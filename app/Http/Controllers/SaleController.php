<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Illuminate\Validation\ValidationException;
use App\Services\SalePaymentService;
use App\Services\LedgerService;
use App\Services\FinalizeSaleService;
use Carbon\Carbon;          // already there if you date-parse elsewhere
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use App\Models\SaleItem;
use App\Models\Godown;
use App\Models\Salesman;
use App\Services\ApprovalCounter;
use App\Models\AccountLedger;
use App\Models\Item;
use App\Models\Stock;
use App\Models\Journal;
use App\Models\JournalEntry;
use function company_info;
use function numberToWords;
use function godown_scope_ids;
use Illuminate\Support\Facades\DB;
use App\Models\ReceivedMode;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class SaleController extends Controller
{


    public const FLOW_NONE          = 'none';
    public const FLOW_SUB_ONLY      = 'sub_only';
    public const FLOW_SUB_AND_RESP  = 'sub_and_resp';

    public function defaultSub(): ?int
    {
        return User::permission('sales.approve-sub')      // via role **or** direct
            ->whereIn('id', user_scope_ids())            // stay inside tenant
            ->value('id');                               // first match
    }

    public function defaultResp(): ?int
    {
        return User::permission('sales.approve')
            ->whereIn('id', user_scope_ids())
            ->value('id');
    }
    public function index()
    {
        $ids = godown_scope_ids();

        $query = Sale::with([
            'godown',
            'salesman',
            'accountLedger',
            'saleItems.item',

            'creator'
        ])->orderBy('id', 'desc');

        // If $ids is not empty, filter by created_by
        if (!empty($ids)) {
            $query->whereIn('created_by', $ids);
        }

        $sales = $query->paginate(10);

        return Inertia::render('sales/index', [
            'sales' => $sales
        ]);
    }



    public function create()
    {
        $ids = godown_scope_ids();

        return Inertia::render('sales/create', [
            'godowns' => empty($ids) ? Godown::all() : Godown::whereIn('created_by', $ids)->get(),
            'salesmen' => empty($ids) ? Salesman::all() : Salesman::whereIn('created_by', $ids)->get(),
            'ledgers' => empty($ids) ? AccountLedger::all() : AccountLedger::whereIn('created_by', $ids)->get(),
            'inventoryLedgers' => empty($ids)
                ? AccountLedger::get(['id', 'account_ledger_name'])
                : AccountLedger::whereIn('created_by', $ids)->get(['id', 'account_ledger_name']),
            'items' => empty($ids) ? Item::all() : Item::whereIn('created_by', $ids)->get(),
            'accountGroups' => \App\Models\AccountGroup::get(['id', 'name']),
            'receivedModes' => empty($ids)
                ? \App\Models\ReceivedMode::with('ledger')->get(['id', 'mode_name', 'ledger_id'])
                : \App\Models\ReceivedMode::with('ledger')->whereIn('created_by', $ids)->get(['id', 'mode_name', 'ledger_id']),
        ]);
    }

    public function show(Sale $sale)
    {

        $sale->load([
            'saleItems.item.unit',
            'godown',
            'salesman',
            'accountLedger',
            'approvals.user',   // to see who approved / rejected
        ]);
        $sale->setAttribute('me', auth()->id());

        return Inertia::render('sales/show', [
            'sale' => $sale,
        ]);
    }



    public function store(Request $request, FinalizeSaleService $finalizer)
    {
        /* 🔒 1. validate (now requires lot_id) */
        $this->validateRequest($request);

        /* 🔧 2. helpers */
        $voucherNo = $request->voucher_no
            ?? 'SAL-' . now()->format('Ymd') . '-' . str_pad(Sale::max('id') + 1, 4, '0', STR_PAD_LEFT);

        $flow = auth()->user()->company->sale_approval_flow ?? self::FLOW_NONE;

        /* 📝 3. header + lines — all inside one TX */
        DB::beginTransaction();
        try {
            /* 3-a  Header */
            $sale = Sale::create([
                'date'                   => $request->date,
                'voucher_no'             => $voucherNo,
                'godown_id'              => $request->godown_id,
                'salesman_id'            => $request->salesman_id,
                'account_ledger_id'      => $request->account_ledger_id,
                'phone'                  => $request->phone,
                'address'                => $request->address,
                'shipping_details'       => $request->shipping_details,
                'delivered_to'           => $request->delivered_to,
                'truck_rent'             => $request->truck_rent,
                'rent_advance'           => $request->rent_advance,
                'net_rent'               => $request->net_rent,
                'inventory_ledger_id'    => $request->inventory_ledger_id,
                'cogs_ledger_id'         => $request->cogs_ledger_id,
                'truck_driver_name'      => $request->truck_driver_name,
                'driver_address'         => $request->driver_address,
                'driver_mobile'          => $request->driver_mobile,
                'total_qty'              => collect($request->sale_items)->sum('qty'),
                'total_discount'         => collect($request->sale_items)->sum('discount'),
                'grand_total'            => collect($request->sale_items)->sum('subtotal'),
                'other_expense_ledger_id' => $request->other_expense_ledger_id,
                'other_amount'           => $request->other_amount ?? 0,
                'total_due'              => collect($request->sale_items)->sum('subtotal'),
                'status'                 => $flow === self::FLOW_NONE
                    ? Sale::STATUS_APPROVED
                    : Sale::STATUS_PENDING_SUB,
                'sub_responsible_id'     => $this->defaultSub(),
                'responsible_id'         => $this->defaultResp(),
                'created_by'             => auth()->id(),
            ]);

            /* 3-b  Detail rows (user-chosen lots) */
            foreach ($request->sale_items as $row) {
                /* stock guard */
                $available = Stock::where([
                    'godown_id' => $request->godown_id,
                    'item_id'   => $row['product_id'],
                    'lot_id'    => $row['lot_id'],
                    'created_by' => auth()->id(),
                ])->value('qty') ?? 0;

                if ($available < $row['qty']) {
                    throw ValidationException::withMessages([
                        'sale_items' => ["Lot {$row['lot_id']} has only {$available} in stock."],
                    ]);
                }

                /* create line */
                $sale->saleItems()->create([
                    'product_id'    => $row['product_id'],
                    'lot_id'        => $row['lot_id'],
                    'qty'           => $row['qty'],
                    'main_price'    => $row['main_price'],
                    'discount'      => $row['discount'] ?? 0,
                    'discount_type' => $row['discount_type'],
                    'subtotal'      => $row['subtotal'],
                    'note'          => $row['note'] ?? null,
                ]);
            }

            DB::commit();
            ApprovalCounter::broadcast($sale->sub_responsible_id);
        } catch (\Throwable $e) {
            DB::rollBack();
            report($e);
            return back()->with('error', 'Failed to save sale.');
        }

        /* 4. post immediately if no approval flow */
        if ($flow === self::FLOW_NONE) {
            $finalizer->handle($sale, $request->only([
                'amount_received',
                'received_mode_id',
            ]));
        }

        return redirect()
            ->route('sales.index')
            ->with('success', $flow === self::FLOW_NONE
                ? 'Sale saved & approved.'
                : 'Sale saved and awaiting approval.');
    }







    public function edit(Sale $sale)
    {
        $ids = godown_scope_ids();
        if (!empty($ids) && !in_array($sale->created_by, $ids)) {
            abort(403);
        }

        return Inertia::render('sales/edit', [
            'sale' => $sale->load([
                'saleItems',
                'godown',
                'salesman',
                'accountLedger',
                'receivedMode.ledger',
            ])->makeVisible(['received_mode_id', 'inventory_ledger_id']),
            'cogs_ledger_id' => $sale->cogs_ledger_id,
            'godowns' => empty($ids) ? Godown::all() : Godown::whereIn('created_by', $ids)->get(),
            'salesmen' => empty($ids) ? Salesman::all() : Salesman::whereIn('created_by', $ids)->get(),
            'ledgers' => empty($ids) ? AccountLedger::all() : AccountLedger::whereIn('created_by', $ids)->get(),
            'inventoryLedgers' => empty($ids)
                ? AccountLedger::where('ledger_type', 'inventory')->get(['id', 'account_ledger_name'])
                : AccountLedger::where('ledger_type', 'inventory')->whereIn('created_by', $ids)->get(['id', 'account_ledger_name']),
            'cogsLedgers' => empty($ids)
                ? AccountLedger::where('ledger_type', 'cogs')->get(['id', 'account_ledger_name'])
                : AccountLedger::where('ledger_type', 'cogs')->whereIn('created_by', $ids)->get(['id', 'account_ledger_name']),
            'items' => empty($ids) ? Item::all() : Item::whereIn('created_by', $ids)->get(),
            'receivedModes' => empty($ids)
                ? ReceivedMode::with(['ledger' => function ($q) {
                    $q->where('ledger_type', 'received_mode');
                }])->get(['id', 'mode_name', 'ledger_id'])
                : ReceivedMode::with(['ledger' => function ($q) {
                    $q->where('ledger_type', 'received_mode');
                }])->whereIn('created_by', $ids)->get(['id', 'mode_name', 'ledger_id']),
            'accountGroups' => \App\Models\AccountGroup::get(['id', 'name']),
        ]);
    }

    // Update Sale
    public function update(Request $request, Sale $sale)
    {
        if ($sale->created_by !== auth()->id()) {
            abort(403);
        }

        $this->validateRequest($request);

        DB::beginTransaction();

        try {
            /* 1️⃣  পুরোনো জার্নাল রোল-ব্যাক + স্টক ফেরত */
            if ($sale->journal_id) {
                $oldEntries = JournalEntry::where('journal_id', $sale->journal_id)->get();
                foreach ($oldEntries as $e) {
                    LedgerService::adjust(
                        $e->account_ledger_id,
                        $e->type === 'debit' ? 'credit' : 'debit',
                        $e->amount
                    );
                }
                JournalEntry::where('journal_id', $sale->journal_id)->delete();
                Journal::where('id', $sale->journal_id)->delete();
            }

            foreach ($sale->saleItems as $oldItem) {
                Stock::where([
                    'item_id'   => $oldItem->product_id,
                    'godown_id' => $sale->godown_id,
                    'lot_id'    => $oldItem->lot_id,
                    'created_by' => auth()->id(),
                ])->increment('qty', $oldItem->qty);
            }

            /* 2️⃣  সেল-ডেটা আপডেট */
            $sale->update([
                'date'                 => $request->date,
                'godown_id'            => $request->godown_id,
                'salesman_id'          => $request->salesman_id,
                'account_ledger_id'    => $request->account_ledger_id,
                'phone'                => $request->phone,
                'address'              => $request->address,
                'shipping_details'     => $request->shipping_details,
                'delivered_to'         => $request->delivered_to,
                'truck_rent'           => $request->truck_rent,
                'rent_advance'         => $request->rent_advance,
                'net_rent'             => $request->net_rent,
                'truck_driver_name'    => $request->truck_driver_name,
                'driver_address'       => $request->driver_address,
                'driver_mobile'        => $request->driver_mobile,
                'inventory_ledger_id'  => $request->inventory_ledger_id,
                'cogs_ledger_id'       => $request->cogs_ledger_id,
                'total_qty'            => collect($request->sale_items)->sum('qty'),
                'total_discount'       => collect($request->sale_items)->sum('discount'),
                'grand_total'          => collect($request->sale_items)->sum('subtotal'),
                'other_expense_ledger_id' => $request->other_expense_ledger_id,
                'other_amount'         => $request->other_amount ?? 0,
                // 'received_mode_id'     => $request->received_mode_id,
                // 'amount_received'      => $request->amount_received,
                // 'total_due'            => $request->total_due,
                // 'closing_balance'      => $request->closing_balance,
                'total_due'             => collect($request->sale_items)->sum('subtotal'), // full for now
            ]);



            /* 3️⃣  নতুন সেল-আইটেম + স্টক কমানো ও COST হিসাব */
            $sale->saleItems()->delete();

            /* 3️⃣ Re-insert lines **split by lot** + adjust stock + recalc cost */
            $totalCost = 0;

            foreach ($request->sale_items as $row) {

                foreach (
                    $this->pickLots(
                        $request->godown_id,
                        $row['product_id'],
                        $row['qty']
                    ) as $seg
                ) {

                    // new detail row
                    $sale->saleItems()->create([
                        'product_id'    => $row['product_id'],
                        'lot_id'        => $seg['lot_id'],
                        'qty'           => $seg['qty'],
                        'main_price'    => $row['main_price'],
                        'discount'      => $row['discount'] ?? 0,
                        'discount_type' => $row['discount_type'],
                        'subtotal'      => round(
                            ($row['subtotal'] / $row['qty']) * $seg['qty'],
                            2
                        ),
                        'note'          => $row['note'] ?? null,
                    ]);

                    // decrement that lot’s stock
                    Stock::where([
                        'item_id'    => $row['product_id'],
                        'godown_id'  => $request->godown_id,
                        'lot_id'     => $seg['lot_id'],
                        'created_by' => auth()->id(),
                    ])->decrement('qty', $seg['qty']);

                    // accumulate cost
                    $unitCost = Stock::where([
                        'item_id'    => $row['product_id'],
                        'godown_id'  => $request->godown_id,
                        'lot_id'     => $seg['lot_id'],
                        'created_by' => auth()->id(),
                    ])->value('avg_cost') ?? 0;

                    if ($unitCost == 0) {
                        $unitCost = Item::find($row['product_id'])->purchase_price ?? 0;
                    }
                    $totalCost += $unitCost * $seg['qty'];
                }
            }

            /* 4️⃣  নতুন জার্নাল হেডার */
            $journal = Journal::create([
                'date'         => $request->date,
                'voucher_no'   => $sale->voucher_no,
                'narration'    => 'Updated journal for sale',
                'created_by'   => auth()->id(),
            ]);
            $sale->update(['journal_id' => $journal->id]);

            // automatically find the Sales Income ledger (first match)
            $salesLedgerId = $this->getOrCreateSalesLedgerId();


            /* ---- জরুরি মান ---- */
            $grandTotal     = $sale->grand_total;
            $amountReceived = $request->amount_received ?? 0;
            $customerLedger = $request->account_ledger_id;

            /* 5️⃣  জার্নাল এন্ট্রি — ডাবল-এন্ট্রি কমপ্লিট */
            // $grandTotal      = $sale->grand_total;
            // $amountReceived  = $request->amount_received ?? 0;
            // $customerLedger  = $request->account_ledger_id;
            // $salesLedgerId   = 78;                                  // ← Sales Income ledger ID

            // Dr Accounts Receivable
            JournalEntry::create([
                'journal_id'        => $journal->id,
                'account_ledger_id' => $customerLedger,
                'type'              => 'debit',
                'amount'            => $grandTotal,
                'note'              => 'Sale price receivable',
            ]);
            LedgerService::adjust($customerLedger, 'debit', $grandTotal);

            // Cr Sales Income
            JournalEntry::create([
                'journal_id'        => $journal->id,
                'account_ledger_id' => $salesLedgerId,
                'type'              => 'credit',
                'amount'            => $grandTotal,
                'note'              => 'Sales revenue',
            ]);
            LedgerService::adjust($salesLedgerId, 'credit', $grandTotal);

            // যদি নগদ নেন ➜ Dr Cash / Cr AR
            if (($request->amount_received ?? 0) > 0 && $request->received_mode_id) {
                $mode = ReceivedMode::find($request->received_mode_id);
                SalePaymentService::record($sale, $request->amount_received, Carbon::parse($request->date), $mode, 'Payment recorded while editing invoice');
            }

            // Cr Inventory (at cost)
            JournalEntry::create([
                'journal_id'        => $journal->id,
                'account_ledger_id' => $request->inventory_ledger_id,
                'type'              => 'credit',
                'amount'            => $totalCost,
                'note'              => 'Inventory out (at cost)',
            ]);
            LedgerService::adjust($request->inventory_ledger_id, 'credit', $totalCost);

            // Dr COGS
            JournalEntry::create([
                'journal_id'        => $journal->id,
                'account_ledger_id' => $request->cogs_ledger_id,
                'type'              => 'debit',
                'amount'            => $totalCost,
                'note'              => 'Cost of Goods Sold',
            ]);
            LedgerService::adjust($request->cogs_ledger_id, 'debit', $totalCost);

            DB::commit();
            return redirect()->route('sales.index')
                ->with('success', 'Sale updated and journal reposted!');
        } catch (\Throwable $e) {
            DB::rollBack();
            report($e);
            return back()->with('error', 'Failed to update sale.');
        }
    }




    // Invoice (ERP style print)
    // Invoice (ERP style print)

    private function getOrCreateSalesLedgerId()
    {
        $ledger = AccountLedger::firstOrCreate(
            [
                'ledger_type'     => 'sales',
                'mark_for_user'   => 0,
                'group_under_id'  => 10,
                'created_by'      => auth()->id(),
            ],
            [
                'account_ledger_name' => 'Sales Income',
                'opening_balance'     => 0,
                'debit_credit'        => 'credit',
                'status'              => 'active',
                'phone_number'        => '0000000000',
            ]
        );

        return $ledger->id;
    }


    public function invoice(Sale $sale)
    {
        $sale->load([
            'saleItems.item.unit',   // unit eager-loaded like purchases
            'godown',
            'salesman',
            'accountLedger',
        ]);

        return Inertia::render('sales/print/invoice', [
            'sale'        => $sale,
            'company'     => company_info(),                 // ← same helper
            'amountWords' => numberToWords((int) $sale->grand_total),
        ]);
    }

    public function truckChalan(Sale $sale)
    {
        $sale->load([
            'saleItems.item.unit',
            'godown',
            'salesman',
            'accountLedger',
        ]);

        return Inertia::render('sales/print/truck-chalan', [
            'sale'        => $sale,
            'company'     => company_info(),
            'amountWords' => numberToWords((int) $sale->grand_total),
        ]);
    }

    public function loadSlip(Sale $sale)
    {
        $sale->load([
            'saleItems.item.unit',
            'godown',
            'salesman',
            'accountLedger',
        ]);

        return Inertia::render('sales/print/load-slip', [
            'sale'        => $sale,
            'company'     => company_info(),
            'amountWords' => numberToWords((int) $sale->grand_total),
        ]);
    }

    public function gatePass(Sale $sale)
    {
        $sale->load([
            'saleItems.item.unit',
            'godown',
            'salesman',
            'accountLedger',
        ]);

        return Inertia::render('sales/print/gate-pass', [
            'sale'        => $sale,
            'company'     => company_info(),
            'amountWords' => numberToWords((int) $sale->grand_total),
        ]);
    }


    public function destroy(Sale $sale)
    {
        $ids = godown_scope_ids();
        if (!empty($ids) && !in_array($sale->created_by, $ids)) {
            abort(403);
        }

        $sale->delete();
        return redirect()->back()->with('success', 'Sale deleted successfully!');
    }

    // 🔄 Validation Rules
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'date' => 'required|date',
            'godown_id' => 'required|exists:godowns,id',
            'salesman_id' => 'required|exists:salesmen,id',
            'account_ledger_id' => 'required|exists:account_ledgers,id',
            'sale_items' => 'required|array|min:1',
            'sale_items.*.product_id' => [
                'required',
                'exists:items,id',

                // ✅ make sure the chosen lot belongs to this item
                function ($attr, $val, $fail) use ($request) {
                    // attr looks like sale_items.3.product_id → capture “3”
                    if (!preg_match('/sale_items\.(\d+)\./', $attr, $m)) {
                        return $fail('Invalid attribute path.');
                    }
                    $idx    = (int) $m[1];
                    $lotId  = $request->input("sale_items.$idx.lot_id");

                    $ok = \App\Models\Lot::where('id', $lotId)
                        ->where('item_id', $val)
                        ->exists();

                    if (! $ok) {
                        $fail('Lot does not match item.');
                    }
                },
            ],
            'sale_items.*.lot_id'   => 'required|exists:lots,id',

            'sale_items.*.qty' => 'required|numeric|min:0.01',
            'sale_items.*.main_price' => 'required|numeric|min:0',
            'sale_items.*.discount' => 'nullable|numeric|min:0',
            'sale_items.*.discount_type' => 'required|in:bdt,percent',
            'sale_items.*.subtotal' => 'required|numeric|min:0',
            'received_mode_id' => 'nullable|exists:received_modes,id',
            'amount_received' => 'nullable|numeric|min:0',
        ]);
    }



    public function approveSub(Sale $sale)
    {
        if ($sale->status !== Sale::STATUS_PENDING_SUB) {
            return back()->with('error', 'Invalid status for sub approval.');
        }

        DB::transaction(function () use ($sale) {
            $requiresFinal = (bool) $sale->responsible_id;

            $sale->update([
                'status'           => $requiresFinal ? Sale::STATUS_PENDING_RESP : Sale::STATUS_APPROVED,
                'sub_approved_at'  => now(),
                'sub_approved_by'  => auth()->id(),
            ]);
            ApprovalCounter::broadcast($sale->sub_responsible_id);
            if ($sale->responsible_id)
                ApprovalCounter::broadcast($sale->responsible_id);
            $this->logApproval($sale, 'approved', 'Approved by Sub-Responsible');

            if (! $requiresFinal) {
                app(\App\Services\FinalizeSaleService::class)->handle($sale);
            }
        });

        return back()->with('success', 'Sale approved by Sub-Responsible.');
    }




    public function approveFinal(Sale $sale)
    {
        if ($sale->status !== Sale::STATUS_PENDING_RESP) {
            return back()->with('error', 'Invalid status for final approval.');
        }

        DB::transaction(function () use ($sale) {
            $sale->update([
                'status'      => Sale::STATUS_APPROVED,
                'approved_at' => now(),
                'approved_by' => auth()->id(),
            ]);
            ApprovalCounter::broadcast($sale->responsible_id);

            $this->logApproval($sale, 'approved', 'Approved by Responsible');

            app(\App\Services\FinalizeSaleService::class)->handle($sale);
        });

        return back()->with('success', 'Sale fully approved.');
    }


    public function reject(Request $request, Sale $sale)
    {
        $request->validate([
            'note' => 'required|string|max:500',
        ]);

        if (! in_array($sale->status, [Sale::STATUS_PENDING_SUB, Sale::STATUS_PENDING_RESP])) {
            return back()->with('error', 'Invalid status');
        }

        // (Optional) authorization: ensure the current user is the correct approver
        $this->authorizeReject($sale); // or inline checks like you did with mayAct

        DB::transaction(function () use ($sale, $request) {
            $sale->update([
                'status'        => Sale::STATUS_REJECTED,
                'rejected_at'   => now(),
                'rejected_by'   => auth()->id(),
                // optional denormalized field:
                'rejected_note' => $request->note,
            ]);
            ApprovalCounter::broadcast($sale->sub_responsible_id);
            if ($sale->responsible_id)
                ApprovalCounter::broadcast($sale->responsible_id);

            $this->logApproval($sale, 'rejected', $request->note);
        });

        return back()->with('success', 'Sale rejected.');
    }

    protected function authorizeReject(Sale $sale)
    {
        $me = auth()->id();

        $allowed = ($sale->status === Sale::STATUS_PENDING_SUB  && $sale->sub_responsible_id === $me)
            || ($sale->status === Sale::STATUS_PENDING_RESP && $sale->responsible_id === $me);

        abort_unless($allowed, 403);
    }



    public function inboxSub(Request $req)
    {
        // No changes needed here, this is our template
        $sales = Sale::query()
            ->where('status', Sale::STATUS_PENDING_SUB)
            ->where('sub_responsible_id', auth()->id())
            // Add filtering logic here
            ->when($req->q, function ($query, $q) {
                $query->where('voucher_no', 'like', "%{$q}%")
                    ->orWhereHas('accountLedger', fn($qBuilder) => $qBuilder->where('account_ledger_name', 'like', "%{$q}%"));
            })
            ->when($req->from, fn($query, $from) => $query->whereDate('date', '>=', $from))
            ->when($req->to, fn($query, $to) => $query->whereDate('date', '<=', $to))
            ->with([
                'godown:id,name',
                'salesman:id,name',
                'accountLedger:id,account_ledger_name',
                'subApprover:id,name',
                'respApprover:id,name',
            ])
            ->latest()
            ->paginate(15)
            ->withQueryString() // important for pagination links to keep filters
            ->through(fn($s) => [
                'id'          => $s->id,
                'date'        => $s->date->toDateString(),
                'voucher_no'  => $s->voucher_no,
                'grand_total' => $s->grand_total,
                'customer'    => $s->accountLedger?->account_ledger_name,
                'godown'      => $s->godown?->name,
                'salesman'    => $s->salesman?->name,
                'sub_status'  => $s->sub_approved_at
                    ? 'approved'
                    : ($s->status === Sale::STATUS_REJECTED ? 'rejected' : 'pending'),
                'sub_by'      => $s->subApprover?->name,
                'resp_status' => $s->approved_at
                    ? 'approved'
                    : ($s->status === Sale::STATUS_PENDING_RESP ? 'pending'
                        : ($s->status === Sale::STATUS_REJECTED ? 'rejected' : '—')),
                'resp_by'     => $s->respApprover?->name,
            ]);

        return Inertia::render('sales/inbox/SubInbox', [
            'sales'   => $sales,
            'filters' => $req->only(['q', 'from', 'to']),
        ]);
    }

    /**
     * MODIFIED: This now mirrors the structure of `inboxSub` for component reuse.
     */
    public function inboxResp(Request $req)
    {
        $sales = Sale::query()
            ->where('status', Sale::STATUS_PENDING_RESP)
            ->where('responsible_id', auth()->id())
            // Add same filtering logic
            ->when($req->q, function ($query, $q) {
                $query->where('voucher_no', 'like', "%{$q}%")
                    ->orWhereHas('accountLedger', fn($qBuilder) => $qBuilder->where('account_ledger_name', 'like', "%{$q}%"));
            })
            ->when($req->from, fn($query, $from) => $query->whereDate('date', '>=', $from))
            ->when($req->to, fn($query, $to) => $query->whereDate('date', '<=', $to))
            ->with([
                'godown:id,name',
                'salesman:id,name',
                'accountLedger:id,account_ledger_name',
                'subApprover:id,name',
                'respApprover:id,name',
            ])
            ->latest()
            ->paginate(15)
            ->withQueryString() // ensure pagination links retain filters
            ->through(fn($s) => [ // Use the same transformation
                'id'          => $s->id,
                'date'        => $s->date->toDateString(),
                'voucher_no'  => $s->voucher_no,
                'grand_total' => $s->grand_total,
                'customer'    => $s->accountLedger?->account_ledger_name,
                'godown'      => $s->godown?->name,
                'salesman'    => $s->salesman?->name,
                'sub_status'  => $s->sub_approved_at
                    ? 'approved'
                    : ($s->status === Sale::STATUS_REJECTED ? 'rejected' : 'pending'),
                'sub_by'      => $s->subApprover?->name,
                'resp_status' => $s->approved_at
                    ? 'approved'
                    : ($s->status === Sale::STATUS_PENDING_RESP ? 'pending'
                        : ($s->status === Sale::STATUS_REJECTED ? 'rejected' : '—')),
                'resp_by'     => $s->respApprover?->name,
            ]);

        return Inertia::render('sales/inbox/RespInbox', [
            'sales' => $sales,
            'filters' => $req->only(['q', 'from', 'to']), // Pass filters here too
        ]);
    }



    private function logApproval(Sale $sale, string $action, ?string $note = null): void
    {
        \App\Models\SaleApproval::create([
            'sale_id' => $sale->id,
            'user_id' => auth()->id(),
            'created_by' => auth()->id(),
            'action'  => $action,
            'note'    => $note,
        ]);
    }



    public function getItemsByGodown($godownId)
    {
        $ids = godown_scope_ids();

        $stocks = Stock::with('item.unit')
            ->where('godown_id', $godownId)
            ->when(!empty($ids), function ($q) use ($ids) {
                $q->whereIn('created_by', $ids);
            })
            ->get();

        $result = $stocks->map(function ($stock) {
            return [
                'id'        => $stock->item->id,
                'item_name' => $stock->item->item_name,
                'unit'      => $stock->item->unit->name ?? '',
                'stock_qty' => $stock->qty,
            ];
        });

        \Log::info($result);
        return response()->json($result);
    }

    private function pickLots(int $godownId, int $itemId, float $requestQty): array
    {
        $segments = [];
        $remaining = $requestQty;

        $fifoLots = \App\Models\Lot::where([
            'godown_id' => $godownId,
            'item_id'   => $itemId,
        ])
            ->orderBy('received_at')
            ->get();

        foreach ($fifoLots as $lot) {
            if ($remaining <= 0) break;

            $available = \App\Models\Stock::where([
                'godown_id' => $godownId,
                'item_id'   => $itemId,
                'lot_id'    => $lot->id,
            ])->value('qty') ?? 0;

            if ($available <= 0) continue;

            $take = min($available, $remaining);
            $segments[] = ['lot_id' => $lot->id, 'qty' => $take];
            $remaining -= $take;
        }

        if ($remaining > 0) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'sale_items' => ["Not enough stock (missing {$remaining} units)."],
            ]);
        }

        return $segments;
    }

    public function stocksWithLots(int $godownId)
    {
        $ids = godown_scope_ids();

        $stocks = Stock::with([
            'item:id,item_name,unit_id,weight',
            'item.unit:id,name',
            // ⬇ include unit_weight so the UI can compute weight from বস্তা
            'lot:id,lot_no,unit_weight,received_at',
        ])
            ->where('godown_id', $godownId)
            ->when($ids, fn($q) => $q->whereIn('created_by', $ids))
            ->whereNotNull('lot_id')      // ignore orphan rows
            ->get()
            ->filter(fn($s) => $s->lot); // keep only rows whose lot exists

        $payload = $stocks
            ->groupBy('item_id')
            ->map(function ($rows) {
                $item = $rows->first()->item;

                return [
                    'id'        => $item->id,
                    'item_name' => $item->item_name,
                    'unit'      => $item->unit?->name ?? '', // safe access
                    'item_weight' => (float) ($item->weight ?? 0),
                    'lots'      => $rows->map(function ($s) {
                        return [
                            'lot_id'      => $s->lot_id,
                            'lot_no'      => $s->lot->lot_no,
                            'received_at' => optional($s->lot->received_at)->toDateString(),
                            'stock_qty'   => (float) $s->qty,                          // cast for UI
                            'unit_weight' => (float) ($s->lot->unit_weight ?? 0.0),    // ⬅ NEW: kg per বস্তা
                        ];
                    })->values(),
                ];
            })
            ->values();

        return response()->json($payload);
    }
}
