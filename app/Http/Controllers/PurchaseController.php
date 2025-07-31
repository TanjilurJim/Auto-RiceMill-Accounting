<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\Item;
use App\Models\Unit;
use App\Models\User;
use App\Services\FinalizePurchaseService;
use App\Models\PurchaseApproval;
use Inertia\Inertia;
use App\Models\Stock;
use App\Models\Godown;
use App\Models\Journal;
use App\Models\Purchase;
use App\Services\ApprovalCounter;

use App\Models\Salesman;
use function numberToWords;

use App\Models\AccountGroup;
use App\Models\JournalEntry;
use App\Models\PurchaseItem;
use App\Models\ReceivedMode;
use Illuminate\Http\Request;
use App\Models\AccountLedger;
use function company_info;   // helper
use function user_scope_ids;   // helper
use function godown_scope_ids; // [multi-level access]


class PurchaseController extends Controller
{



    private function stockGroupedByGodown(array $visibleUserIds)
    {
        return Stock::query()
            ->select('godown_id', 'item_id', DB::raw('SUM(qty) as qty'))
            ->whereIn('created_by', $visibleUserIds)
            ->groupBy('godown_id', 'item_id')
            ->with('item.unit')                     // item & unit after groupBy is OK
            ->get()
            ->groupBy('godown_id')
            ->map(fn($rows) => $rows->map(function ($s) {   // one row per item
                return [
                    'id'   => $s->item_id,                   // use item_id as id
                    'qty'  => $s->qty,
                    'item' => [
                        'id'        => $s->item_id,
                        'item_name' => $s->item->item_name,
                        'unit_name' => $s->item->unit->name ?? '',
                    ],
                ];
            }))
            ->toArray();
    }
    // Show list of purchases
    public function index()
    {
        $user = auth()->user(); // [multi-level access]

        if ($user->hasRole('admin')) { // [multi-level access]
            $purchases = Purchase::with([
                'godown',
                'salesman',
                'accountLedger',
                'purchaseItems.item',
                'creator'
            ])
                ->orderBy('id', 'desc')
                ->paginate(10);
        } else { // [multi-level access]
            $ids = godown_scope_ids(); // [multi-level access]
            $purchases = Purchase::with([
                'godown',
                'salesman',
                'accountLedger',
                'purchaseItems.item',
                'creator'
            ])
                ->whereIn('created_by', $ids) // [multi-level access]
                ->orderBy('id', 'desc')
                ->paginate(10);
        }

        $purchases->getCollection()->transform(function ($p) {
            $p->due = $p->grand_total - $p->amount_paid;
            return $p;
        });

        return Inertia::render('purchases/index', [
            'purchases' => $purchases
        ]);
    }



    public function create()
    {
        $user = auth()->user();
        if ($user->hasRole('admin')) {
            // Admin: show all
            $godowns = Godown::all();
            $salesmen = Salesman::all();
            $ledgers = AccountLedger::all();
            $visibleIds      = $user->hasRole('admin') ? User::pluck('id')->all()
                : godown_scope_ids();

            $stockItemsByGodown = $this->stockGroupedByGodown($visibleIds);

            $inventoryLedgers = AccountLedger::where('ledger_type', 'inventory')->get(['id', 'account_ledger_name', 'ledger_type']);
            $receivedModes = ReceivedMode::with('ledger')->get(['id', 'mode_name', 'ledger_id']);
        } else {
            $userIds = godown_scope_ids();
            $godowns = Godown::whereIn('created_by', $userIds)->get();
            $salesmen = Salesman::whereIn('created_by', $userIds)->get();
            $ledgers = AccountLedger::whereIn('created_by', $userIds)->get();
            $visibleIds      = $user->hasRole('admin') ? User::pluck('id')->all()
                : godown_scope_ids();

            $stockItemsByGodown = $this->stockGroupedByGodown($visibleIds);

            $inventoryLedgers = AccountLedger::where('ledger_type', 'inventory')
                ->whereIn('created_by', $userIds)
                ->get(['id', 'account_ledger_name', 'ledger_type']);
            $receivedModes = ReceivedMode::with('ledger')
                ->whereIn('created_by', $userIds)
                ->get(['id', 'mode_name', 'ledger_id']);
        }

        return Inertia::render('purchases/create', [
            'godowns' => $godowns,
            'salesmen' => $salesmen,
            'ledgers' => $ledgers,
            'stockItemsByGodown' => $stockItemsByGodown,
            'items' => [],
            'inventoryLedgers' => $inventoryLedgers,
            'accountGroups' => AccountGroup::get(['id', 'name']),
            'receivedModes' => $receivedModes,
        ]);
    }

    // Store purchase
    public function store(Request $request)
    {
        /* 1️⃣  Validation – unchanged */
        $request->validate([
            'date' => 'required|date',
            'voucher_no' => 'nullable|unique:purchases,voucher_no',
            'godown_id' => 'required|exists:godowns,id',
            'salesman_id' => 'required|exists:salesmen,id',
            'account_ledger_id' => 'required|exists:account_ledgers,id',
            'inventory_ledger_id' => 'required|exists:account_ledgers,id',
            'purchase_items' => 'required|array|min:1',
            'purchase_items.*.product_id' => 'required|exists:items,id',
            'purchase_items.*.qty' => 'required|numeric|min:0.01',
            'purchase_items.*.price' => 'required|numeric|min:0',
            'purchase_items.*.discount' => 'nullable|numeric|min:0',
            'purchase_items.*.discount_type' => 'required|in:bdt,percent',
            'purchase_items.*.subtotal' => 'required|numeric|min:0',
            'received_mode_id' => 'nullable|exists:received_modes,id',
            'amount_paid' => 'nullable|numeric|min:0',
        ]);

        /* 2️⃣  Prepare helpers */
        $voucherNo = $request->voucher_no
            ?? 'PUR-' . now()->format('Ymd') . '-' . str_pad(Purchase::max('id') + 1, 4, '0', STR_PAD_LEFT);

        $flow = auth()->user()->company->purchase_approval_flow ?? 'none';

        /* 🔹New totals -------------------------------------------------- */
        $totalQty   = collect($request->purchase_items)->sum('qty');
        $totalPrice = collect($request->purchase_items)->sum(
            fn($row) => $row['qty'] * $row['price']
        );        // before discount
        $totalDisc  = collect($request->purchase_items)->sum('discount');
        $grandTotal = $totalPrice - $totalDisc;                            // after discount
        /* -------------------------------------------------------------- */

        /* 3️⃣  Create header + lines (no stock / journal yet) */
        $purchase = null;
        DB::transaction(function () use (
            $request,
            $voucherNo,
            $flow,
            &$purchase,
            $totalQty,
            $totalPrice,
            $totalDisc,
            $grandTotal,
        ) {
            $purchase = Purchase::create([
                'date'               => $request->date,
                'voucher_no'         => $voucherNo,
                'godown_id'          => $request->godown_id,
                'salesman_id'        => $request->salesman_id,
                'account_ledger_id'  => $request->account_ledger_id,
                'inventory_ledger_id' => $request->inventory_ledger_id,
                'received_mode_id'   => $request->received_mode_id,
                'amount_paid'        => $request->amount_paid ?? 0,
                'phone'              => $request->phone,
                'address'            => $request->address,
                'shipping_details'   => $request->shipping_details,
                'delivered_to'       => $request->delivered_to,

                /* 🔹 add the four money columns */
                'total_qty'      => $totalQty,
                'total_price'    => $totalPrice,
                'total_discount' => $totalDisc,
                'grand_total'    => $grandTotal,

                'status'             => $flow === 'none'
                    ? Purchase::STATUS_APPROVED
                    : Purchase::STATUS_PENDING_SUB,
                'sub_responsible_id' => $this->defaultSub(),
                'responsible_id'     => $this->defaultResp(),
                'created_by'         => auth()->id(),
            ]);

            foreach ($request->purchase_items as $row) {
                $purchase->purchaseItems()->create([
                    'product_id'    => $row['product_id'],
                    'qty'           => $row['qty'],
                    'price'         => $row['price'],
                    'discount'      => $row['discount'] ?? 0,
                    'discount_type' => $row['discount_type'],
                    'subtotal'      => $row['subtotal'],
                ]);
            }
        });

        /* 4️⃣  Post stock & journal immediately only if no approval flow */
        if ($flow === 'none') {
            app(\App\Services\FinalizePurchaseService::class)->handle(
                $purchase,
                $request->only(['amount_paid', 'received_mode_id'])
            );
        }
        // }

        ApprovalCounter::broadcast(auth()->id());
        if ($purchase->sub_responsible_id) {
            ApprovalCounter::broadcast($purchase->sub_responsible_id);
        }

        /* 5️⃣  Redirect with proper flash message */
        return redirect()
            ->route('purchases.index')
            ->with('success', $flow === 'none'
                ? 'Purchase saved & approved.'
                : 'Purchase saved and awaiting approval.');
    }

    // 🔁 Ledger balance helper
    private function updateLedgerBalance($ledgerId, $type, $amount)
    {
        $ledger = AccountLedger::find($ledgerId);
        if (!$ledger) return;

        $current = $ledger->closing_balance ?? $ledger->opening_balance ?? 0;

        $ledger->closing_balance = $type === 'debit'
            ? $current + $amount
            : $current - $amount;

        $ledger->save();
    }



    public function edit(Purchase $purchase)
    {
        $user = auth()->user();
        if (!$user->hasRole('admin')) {
            $ids = godown_scope_ids();
            if (!in_array($purchase->created_by, $ids)) {
                abort(403, 'Unauthorized action.');
            }
            // Non-admin: filter by allowed user IDs
            $godowns  = Godown::whereIn('created_by', $ids)->get(['id', 'name']);
            $salesmen = Salesman::whereIn('created_by', $ids)->get(['id', 'name']);
            $ledgers  = AccountLedger::whereIn('created_by', $ids)->get(['id', 'account_ledger_name']);
            $inventoryLedgers = AccountLedger::where('ledger_type', 'inventory')
                ->whereIn('created_by', $ids)
                ->get(['id', 'account_ledger_name']);
            $receivedModes = ReceivedMode::with('ledger')
                ->whereIn('created_by', $ids)
                ->get(['id', 'mode_name', 'ledger_id']);
            $visibleIds      = $user->hasRole('admin') ? User::pluck('id')->all()
                : godown_scope_ids();

            $stockItemsByGodown = $this->stockGroupedByGodown($visibleIds);
        } else {
            // Admin: show all
            $godowns  = Godown::all(['id', 'name']);
            $salesmen = Salesman::all(['id', 'name']);
            $ledgers  = AccountLedger::all(['id', 'account_ledger_name']);
            $inventoryLedgers = AccountLedger::where('ledger_type', 'inventory')
                ->get(['id', 'account_ledger_name']);
            $receivedModes = ReceivedMode::with('ledger')
                ->get(['id', 'mode_name', 'ledger_id']);
            $visibleIds      = $user->hasRole('admin') ? User::pluck('id')->all()
                : godown_scope_ids();

            $stockItemsByGodown = $this->stockGroupedByGodown($visibleIds);
        }

        return Inertia::render('purchases/edit', [
            'purchase' => $purchase->load([
                'purchaseItems.item',
                'godown',
                'salesman',
                'accountLedger',
            ]),
            'godowns'  => $godowns,
            'salesmen' => $salesmen,
            'ledgers'  => $ledgers,
            'inventoryLedgers' => $inventoryLedgers,
            'receivedModes' => $receivedModes,
            'stockItemsByGodown' => $stockItemsByGodown,
            'phone' => $purchase->phone,
            'address' => $purchase->address,
            'delivered_to' => $purchase->delivered_to,
            'shipping_details' => $purchase->shipping_details,
        ]);
    }

    // Update purchase
    public function update(Request $request, Purchase $purchase)
    {
        /* -------------------  Tenant check  ------------------- */
        // if ($purchase->created_by !== auth()->id() && !auth()->user()->hasRole('admin')) {
        //     abort(403);
        // }

        $user = auth()->user(); // [multi-level access]
        if (!$user->hasRole('admin')) { // [multi-level access]
            $ids = godown_scope_ids(); // [multi-level access]
            if (!in_array($purchase->created_by, $ids)) { // [multi-level access]
                abort(403, 'Unauthorized action.');
            }
        }

        /* -------------------  Validation  --------------------- */
        $request->validate([
            'date'                        => 'required|date',
            'godown_id'                   => 'required|exists:godowns,id',
            'salesman_id'                 => 'required|exists:salesmen,id',
            'account_ledger_id'           => 'required|exists:account_ledgers,id',
            'inventory_ledger_id'         => 'required|exists:account_ledgers,id',
            'purchase_items'              => 'required|array|min:1',
            'purchase_items.*.product_id' => 'required|exists:items,id',
            'purchase_items.*.qty'        => 'required|numeric|min:0.01',
            'purchase_items.*.price'      => 'required|numeric|min:0',
            'purchase_items.*.discount'   => 'nullable|numeric|min:0',
            'purchase_items.*.discount_type' => 'required|in:bdt,percent',
            'purchase_items.*.subtotal'   => 'required|numeric|min:0',

            /* ▼ NEW – part‑payment */
            'received_mode_id' => 'required_with:amount_paid|nullable|exists:received_modes,id',
            'amount_paid'      => [
                'nullable',
                'numeric',
                'min:0',
                function ($attr, $val, $fail) use ($request) {
                    $total = collect($request->purchase_items)->sum('subtotal');
                    if ($val > $total) $fail('Amount paid cannot exceed grand total.');
                },
            ],
        ]);

        /* =============================================================
     | 1️⃣  Roll back previous stock
     * ===========================================================*/
        foreach ($purchase->purchaseItems as $old) {
            Stock::where([
                'item_id'   => $old->product_id,
                'godown_id' => $purchase->godown_id,
                'created_by' => $purchase->created_by,
            ])->decrement('qty', $old->qty);
            Item::where('id', $old->product_id)->decrement('previous_stock', $old->qty);
        }


        /* =============================================================
     | 2️⃣  Delete old journal entries, keep / update header
     * ===========================================================*/
        if ($purchase->journal_id) {
            JournalEntry::where('journal_id', $purchase->journal_id)->delete();
            $journal = Journal::find($purchase->journal_id);
            $journal->update([
                'date'      => $request->date,
                'narration' => 'Auto journal (edited)',
            ]);
        } else {

            /*  🔧 NEW code – reuse an existing header with
                the same voucher, or create it if it doesn’t exist  */
            $journal = Journal::firstOrCreate(
                ['voucher_no' => $purchase->voucher_no],   // search key
                [   // attributes used only when the row has to be created
                    'date'       => $request->date,
                    'narration'  => 'Auto journal (edited)',
                    'created_by' => auth()->id(),
                ]
            );

            // remember the header on the purchase row
            $purchase->journal_id = $journal->id;
        }

        /* =============================================================
     | 3️⃣  Update purchase header
     * ===========================================================*/
        $grandTotal = collect($request->purchase_items)->sum('subtotal');
        $totalQty   = collect($request->purchase_items)->sum('qty');
        $totalDisc  = collect($request->purchase_items)->sum('discount');
        $amountPaid = $request->amount_paid ?? 0;

        $purchase->update([
            'date'            => $request->date,
            'godown_id'       => $request->godown_id,
            'salesman_id'     => $request->salesman_id,
            'account_ledger_id' => $request->account_ledger_id,
            'phone'           => $request->phone,
            'address'         => $request->address,
            'shipping_details' => $request->shipping_details,
            'delivered_to'    => $request->delivered_to,
            'total_qty'       => $totalQty,
            'total_discount'  => $totalDisc,
            'grand_total'     => $grandTotal,
            'amount_paid'     => $amountPaid,          // ▼ NEW
        ]);

        /* =============================================================
     | 4️⃣  Replace item rows + apply new stock
     * ===========================================================*/
        $purchase->purchaseItems()->delete();

        foreach ($request->purchase_items as $row) {
            $purchase->purchaseItems()->create([
                'product_id'    => $row['product_id'],
                'qty'           => $row['qty'],
                'price'         => $row['price'],
                'discount'      => $row['discount'] ?? 0,
                'discount_type' => $row['discount_type'],
                'subtotal'      => $row['subtotal'],
            ]);

            Stock::firstOrNew([
                'item_id'   => $row['product_id'],
                'godown_id' => $request->godown_id,
                'created_by' => auth()->id(),
            ])->increment('qty', $row['qty']);

            Item::where('id', $row['product_id'])->increment('previous_stock', $row['qty']);
        }

        /* =============================================================
     | 5️⃣  Re‑create journal entries
     * ===========================================================*/
        // 5‑1  Inventory  (Debit)
        JournalEntry::create([
            'journal_id'        => $journal->id,
            'account_ledger_id' => $request->inventory_ledger_id,
            'type'              => 'debit',
            'amount'            => $grandTotal,
            'note'              => 'Inventory received (edited)',
        ]);
        $this->updateLedgerBalance($request->inventory_ledger_id, 'debit', $grandTotal);

        // 5‑2  Supplier payable  (Credit)
        JournalEntry::create([
            'journal_id'        => $journal->id,
            'account_ledger_id' => $request->account_ledger_id,
            'type'              => 'credit',
            'amount'            => $grandTotal,
            'note'              => 'Payable to supplier (edited)',
        ]);
        $this->updateLedgerBalance($request->account_ledger_id, 'credit', $grandTotal);

        /* ---------- 5‑3 & 5‑4  part‑payment, if any ---------- */
        if ($amountPaid > 0) {
            $receivedMode = ReceivedMode::with('ledger')->find($request->received_mode_id);

            // Credit Cash / Bank / Bkash ledger
            JournalEntry::create([
                'journal_id'        => $journal->id,
                'account_ledger_id' => $receivedMode->ledger_id,
                'type'              => 'credit',
                'amount'            => $amountPaid,
                'note'              => 'Payment via ' . $receivedMode->mode_name . ' (edited)',
            ]);
            $this->updateLedgerBalance($receivedMode->ledger_id, 'credit', $amountPaid);

            // Debit Supplier ledger (reduces payable)
            JournalEntry::create([
                'journal_id'        => $journal->id,
                'account_ledger_id' => $request->account_ledger_id,
                'type'              => 'debit',
                'amount'            => $amountPaid,
                'note'              => 'Partial payment to supplier (edited)',
            ]);
            $this->updateLedgerBalance($request->account_ledger_id, 'debit', $amountPaid);
        }

        /* =============================================================
     | 6️⃣  Redirect
     * ===========================================================*/
        return redirect()
            ->route('purchases.index')
            ->with('success', 'Purchase updated – stock & accounts adjusted!');
    }

    public function invoice(Purchase $purchase)
    {
        // eager-load anything you need on the Vue/React side
        $purchase->load([
            'purchaseItems.item.unit',   // or ->product  – match your relations
            'godown',
            'salesman',
            'accountLedger',
        ]);
        // dd($purchase->purchaseItems);

        // company_info() is the helper you showed
        $company = company_info();

        // convert grand_total to words once, server-side
        $amountWords = numberToWords((int) $purchase->grand_total);

        return Inertia::render('purchases/invoice', [
            'purchase'      => $purchase,
            'company'       => $company,       // 👉 front-end gets {name,address,phone,…}
            'amountWords'   => $amountWords,   // optional – saves JS work
        ]);
    }

    public function show(Purchase $purchase)
    {
        $purchase->load([
            'purchaseItems.item.unit',
            'godown',
            'salesman',
            'accountLedger',
            'approvals.user',   // to see who approved / rejected
        ]);

        $purchase->setAttribute('me', auth()->id());

        return Inertia::render('purchases/show', [
            'purchase' => $purchase,
        ]);
    }


    public function fetchBalance($id)
    {
        $ledger = AccountLedger::findOrFail($id);
        return response()->json([
            'closing_balance' => $ledger->closing_balance ?? 0,
            'debit_credit'    => $ledger->debit_credit ?? 'debit',  // optional
        ]);
    }


    // Delete Purchase
    public function destroy(Purchase $purchase)
    {
        $user = auth()->user(); // [multi-level access]
        if (!$user->hasRole('admin')) { // [multi-level access]
            $ids = godown_scope_ids(); // [multi-level access]
            if (!in_array($purchase->created_by, $ids)) { // [multi-level access]
                abort(403, 'Unauthorized action.');
            }
        }

        $purchase->delete();
        return redirect()->back()->with('success', 'Purchase deleted successfully!');
    }
    /* helpers ---------------------------------------------*/
    private function defaultSub(): ?int
    {
        return User::permission('purchase.sub-responsible')
            ->whereIn('id', user_scope_ids())
            ->value('id');
    }
    private function defaultResp(): ?int
    {
        return User::permission('purchase.responsible')
            ->whereIn('id', user_scope_ids())
            ->value('id');
    }

    /* APPROVE SUB -----------------------------------------*/
    public function approveSub(Purchase $purchase)
    {
        abort_unless($purchase->status === Purchase::STATUS_PENDING_SUB, 400);

        DB::transaction(function () use ($purchase) {
            $needsFinal = (bool) $purchase->responsible_id;

            $purchase->update([
                'status'            => $needsFinal ? Purchase::STATUS_PENDING_RESP : Purchase::STATUS_APPROVED,
                'sub_approved_at'   => now(),
                'sub_approved_by'   => auth()->id(),
            ]);

            ApprovalCounter::broadcast($purchase->sub_responsible_id);
            ApprovalCounter::broadcast($purchase->responsible_id);


            $this->logApproval($purchase, 'approved', 'Approved by Sub-Responsible');

            if (! $needsFinal) {
                app(FinalizePurchaseService::class)->handle($purchase);
            }
        });

        return back()->with('success', 'Purchase approved at first step.');
    }

    /* APPROVE FINAL ---------------------------------------*/
    public function approveFinal(Purchase $purchase)
    {
        abort_unless($purchase->status === Purchase::STATUS_PENDING_RESP, 400);

        DB::transaction(function () use ($purchase) {
            $purchase->update([
                'status'       => Purchase::STATUS_APPROVED,
                'approved_at'  => now(),
                'approved_by'  => auth()->id(),
            ]);

            $this->logApproval($purchase, 'approved', 'Approved by Responsible');

            app(FinalizePurchaseService::class)->handle($purchase);

            ApprovalCounter::broadcast($purchase->responsible_id);
        });

        return back()->with('success', 'Purchase fully approved.');
    }

    /* REJECT ----------------------------------------------*/
    public function reject(Request $request, Purchase $purchase)
    {
        $request->validate(['note' => 'required|string|max:500']);

        $allowed = ($purchase->status === Purchase::STATUS_PENDING_SUB  && $purchase->sub_responsible_id === auth()->id())
            || ($purchase->status === Purchase::STATUS_PENDING_RESP && $purchase->responsible_id     === auth()->id());

        abort_unless($allowed, 403);

        DB::transaction(function () use ($purchase, $request) {
            $purchase->update([
                'status'      => Purchase::STATUS_REJECTED,
                'rejected_at' => now(),
                'rejected_by' => auth()->id(),
            ]);

            $this->logApproval($purchase, 'rejected', $request->note);
            ApprovalCounter::broadcast($purchase->sub_responsible_id);
            ApprovalCounter::broadcast($purchase->responsible_id);
            ApprovalCounter::broadcast(auth()->id());
        });

        return back()->with('success', 'Purchase rejected.');
    }

    public function inboxSub(Request $req)
    {
        $purchases = Purchase::query()
            ->where('status', Purchase::STATUS_PENDING_SUB)
            ->where('sub_responsible_id', auth()->id())

            // 🔍 Filter by voucher no or supplier name
            ->when($req->q, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('voucher_no', 'like', "%{$search}%")
                        ->orWhereHas('accountLedger', fn($q2) => $q2->where('account_ledger_name', 'like', "%{$search}%"));
                });
            })

            // 📅 Date range filters
            ->when($req->from, fn($q, $from) => $q->whereDate('date', '>=', $from))
            ->when($req->to,   fn($q, $to)   => $q->whereDate('date', '<=', $to))

            ->with([
                'godown:id,name',
                'salesman:id,name',
                'accountLedger:id,account_ledger_name',
                'subApprover:id,name',
                'respApprover:id,name',
            ])
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn($p) => [
                'id'          => $p->id,
                'date'        => $p->date->toDateString(),
                'voucher_no'  => $p->voucher_no,
                'grand_total' => $p->grand_total,
                'supplier'    => $p->accountLedger?->account_ledger_name,
                'godown'      => $p->godown?->name,
                'salesman'    => $p->salesman?->name,
                'sub_status'  => 'pending', // always pending here
                'resp_status' => $p->status === Purchase::STATUS_PENDING_RESP ? 'pending'
                    : ($p->status === Purchase::STATUS_REJECTED ? 'rejected' : '—'),
            ]);

        return Inertia::render('purchases/inbox/SubInbox', [
            'purchases' => $purchases,
            'filters'   => $req->only(['q', 'from', 'to']),
        ]);
    }

    public function inboxResp(Request $req)
    {
        $purchases = Purchase::query()
            ->where('status', Purchase::STATUS_PENDING_RESP)
            ->where('responsible_id', auth()->id())

            /* 🔍 Search by voucher or supplier */
            ->when($req->q, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('voucher_no', 'like', "%{$search}%")
                        ->orWhereHas(
                            'accountLedger',
                            fn($q2) => $q2->where('account_ledger_name', 'like', "%{$search}%")
                        );
                });
            })

            /* 📅 Date range */
            ->when($req->from, fn($q, $from) => $q->whereDate('date', '>=', $from))
            ->when($req->to,   fn($q, $to)   => $q->whereDate('date', '<=', $to))

            ->with([
                'godown:id,name',
                'salesman:id,name',
                'accountLedger:id,account_ledger_name',
                'subApprover:id,name',
                'respApprover:id,name',
            ])
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn($p) => [
                'id'          => $p->id,
                'date'        => $p->date->toDateString(),
                'voucher_no'  => $p->voucher_no,
                'grand_total' => $p->grand_total,
                'supplier'    => $p->accountLedger?->account_ledger_name,
                'godown'      => $p->godown?->name,
                'salesman'    => $p->salesman?->name,

                'sub_status'  => $p->sub_approved_at
                    ? 'approved'
                    : ($p->status === Purchase::STATUS_REJECTED ? 'rejected' : 'pending'),

                'resp_status' => 'pending',          // always pending in this inbox
            ]);

        return Inertia::render('purchases/inbox/RespInbox', [
            'purchases' => $purchases,
            'filters'   => $req->only(['q', 'from', 'to']),
        ]);
    }





    /* helper */
    private function logApproval(Purchase $purchase, string $action, ?string $note = null)
    {
        PurchaseApproval::create([
            'purchase_id' => $purchase->id,
            'user_id'     => auth()->id(),
            'created_by'  => auth()->id(),
            'action'      => $action,
            'note'        => $note,
        ]);
    }
}
