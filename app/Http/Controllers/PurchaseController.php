<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Unit;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Stock;
use App\Models\Godown;
use App\Models\Journal;
use App\Models\Purchase;

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

    // Show list of purchases
    // public function index()
    // {
    //     $purchases = Purchase::with([
    //         'godown',
    //         'salesman',
    //         'accountLedger',
    //         'purchaseItems.item', // 🟢 Eager load item inside purchaseItems!
    //         'creator'
    //     ])

    //         ->where('created_by', auth()->id())
    //         ->orderBy('id', 'desc')
    //         ->paginate(10);

    //     $purchases->getCollection()->transform(function ($p) {
    //         $p->due = $p->grand_total - $p->amount_paid;   // 👈 add field
    //         return $p;
    //     });

    //     return Inertia::render('purchases/index', [
    //         'purchases' => $purchases
    //     ]);
    // }

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

    // Show create form
    // public function create()
    // {
    //     // $userIds = user_scope_ids();
    //     $userIds = godown_scope_ids(); // [multi-level access]

    //     return Inertia::render('purchases/create', [
    //         'godowns' => Godown::whereIn('created_by', $userIds)->get(),
    //         'salesmen' => Salesman::whereIn('created_by', $userIds)->get(),
    //         'ledgers' => AccountLedger::whereIn('created_by', $userIds)->get(),
    //         'stockItemsByGodown' => Stock::with('item.unit')
    //             ->whereIn('created_by', $userIds)
    //             ->get()
    //             ->groupBy('godown_id')
    //             ->map(fn($col) => $col->map(fn($s) => [
    //                 'id'   => $s->id,
    //                 'qty'  => $s->qty,
    //                 'item' => [
    //                     'id'        => $s->item->id,
    //                     'item_name' => $s->item->item_name,
    //                     'unit_name' => $s->item->unit->name ?? '',
    //                 ],
    //             ]))
    //             ->toArray(),
    //         'items' => [],
    //         'inventoryLedgers' => AccountLedger::where('ledger_type', 'inventory')
    //             ->whereIn('created_by', $userIds)
    //             ->get(['id', 'account_ledger_name', 'ledger_type']),
    //         'accountGroups' => AccountGroup::get(['id', 'name']),
    //         'receivedModes' => ReceivedMode::with('ledger')
    //             ->whereIn('created_by', $userIds)
    //             ->get(['id', 'mode_name', 'ledger_id']),
    //     ]);
    // }

    public function create()
    {
        $user = auth()->user();
        if ($user->hasRole('admin')) {
            // Admin: show all
            $godowns = Godown::all();
            $salesmen = Salesman::all();
            $ledgers = AccountLedger::all();
            $stockItemsByGodown = Stock::with('item.unit')->get()
                ->groupBy('godown_id')
                ->map(fn($col) => $col->map(fn($s) => [
                    'id'   => $s->id,
                    'qty'  => $s->qty,
                    'item' => [
                        'id'        => $s->item->id,
                        'item_name' => $s->item->item_name,
                        'unit_name' => $s->item->unit->name ?? '',
                    ],
                ]))
                ->toArray();
            $inventoryLedgers = AccountLedger::where('ledger_type', 'inventory')->get(['id', 'account_ledger_name', 'ledger_type']);
            $receivedModes = ReceivedMode::with('ledger')->get(['id', 'mode_name', 'ledger_id']);
        } else {
            $userIds = godown_scope_ids();
            $godowns = Godown::whereIn('created_by', $userIds)->get();
            $salesmen = Salesman::whereIn('created_by', $userIds)->get();
            $ledgers = AccountLedger::whereIn('created_by', $userIds)->get();
            $stockItemsByGodown = Stock::with('item.unit')
                ->whereIn('created_by', $userIds)
                ->get()
                ->groupBy('godown_id')
                ->map(fn($col) => $col->map(fn($s) => [
                    'id'   => $s->id,
                    'qty'  => $s->qty,
                    'item' => [
                        'id'        => $s->item->id,
                        'item_name' => $s->item->item_name,
                        'unit_name' => $s->item->unit->name ?? '',
                    ],
                ]))
                ->toArray();
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

        $voucherNo = $request->voucher_no ?? 'PUR-' . now()->format('Ymd') . '-' . str_pad(Purchase::max('id') + 1, 4, '0', STR_PAD_LEFT);

        $purchase = Purchase::create([
            'date' => $request->date,
            'voucher_no' => $voucherNo,
            'godown_id' => $request->godown_id,
            'salesman_id' => $request->salesman_id,
            'account_ledger_id' => $request->account_ledger_id,
            'inventory_ledger_id' => $request->inventory_ledger_id,
            'received_mode_id' => $request->received_mode_id,
            'amount_paid' => $request->amount_paid ?? 0,
            'phone' => $request->phone,
            'address' => $request->address,
            'shipping_details' => $request->shipping_details,
            'delivered_to' => $request->delivered_to,
            'total_qty' => collect($request->purchase_items)->sum('qty'),
            'total_price' => collect($request->purchase_items)->sum('subtotal'),
            'total_discount' => collect($request->purchase_items)->sum('discount'),
            'grand_total' => collect($request->purchase_items)->sum('subtotal'),
            'created_by' => auth()->id(),
        ]);

        foreach ($request->purchase_items as $item) {
            $purchase->purchaseItems()->create([
                'product_id' => $item['product_id'],
                'qty' => $item['qty'],
                'price' => $item['price'],
                'discount' => $item['discount'] ?? 0,
                'discount_type' => $item['discount_type'],
                'subtotal' => $item['subtotal'],
            ]);

            // Update stock
            $stock = \App\Models\Stock::firstOrNew([
                'item_id' => $item['product_id'],
                'godown_id' => $request->godown_id,
                'created_by' => auth()->id(),
            ]);
            $stock->qty += $item['qty'];
            $stock->created_by = auth()->id();
            $stock->save();
        }

        // Journal
        $journal = Journal::create([
            'date' => $request->date,
            'voucher_no' => $voucherNo,
            'narration' => 'Auto journal for Purchase',
            'created_by' => auth()->id(),
            'voucher_type' => 'Purchase',
        ]);

        // 1️⃣ Inventory (debit)
        JournalEntry::create([
            'journal_id' => $journal->id,
            'account_ledger_id' => $request->inventory_ledger_id,
            'type' => 'debit',
            'amount' => $purchase->grand_total,
            'note' => 'Inventory received',
        ]);

        $this->updateLedgerBalance($request->inventory_ledger_id, 'debit', $purchase->grand_total);

        // 2️⃣ Supplier (credit)
        JournalEntry::create([
            'journal_id' => $journal->id,
            'account_ledger_id' => $request->account_ledger_id,
            'type' => 'credit',
            'amount' => $purchase->grand_total,
            'note' => 'Payable to Supplier',
        ]);

        $this->updateLedgerBalance($request->account_ledger_id, 'credit', $purchase->grand_total);

        // 3️⃣ Payment if any
        if ($request->amount_paid > 0 && $request->received_mode_id) {

            // just fetch the row the user picked
            $receivedMode = ReceivedMode::with('ledger')
                ->findOrFail($request->received_mode_id);

            if ($receivedMode && $receivedMode->ledger) {
                // Credit payment method
                JournalEntry::create([
                    'journal_id' => $journal->id,
                    'account_ledger_id' => $receivedMode->ledger_id,
                    'type' => 'credit',
                    'amount' => $request->amount_paid,
                    'note' => 'Payment via ' . $receivedMode->mode_name,
                ]);
                $this->updateLedgerBalance($receivedMode->ledger_id, 'credit', $request->amount_paid);

                // Debit supplier (partial payment)
                JournalEntry::create([
                    'journal_id' => $journal->id,
                    'account_ledger_id' => $request->account_ledger_id,
                    'type' => 'debit',
                    'amount' => $request->amount_paid,
                    'note' => 'Partial payment to supplier',
                ]);
                $this->updateLedgerBalance($request->account_ledger_id, 'debit', $request->amount_paid);
            }
        }

        $purchase->update(['journal_id' => $journal->id]);

        return redirect()->route('purchases.index')->with('success', 'Purchase created and stock updated!');
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

    // public function edit(Purchase $purchase)
    // {
    //     // multi‑tenant guard
    //     // if ($purchase->created_by !== auth()->id() && ! auth()->user()->hasRole('admin')) {
    //     //     abort(403);
    //     // }

    //     $user = auth()->user(); // [multi-level access]
    //     if (!$user->hasRole('admin')) { // [multi-level access]
    //         $ids = godown_scope_ids(); // [multi-level access]
    //         if (!in_array($purchase->created_by, $ids)) { // [multi-level access]
    //             abort(403, 'Unauthorized action.');
    //         }
    //     }

    //     // $userId = auth()->id();
    //     // $userId = user_scope_ids();
    //     $userId = godown_scope_ids(); // [multi-level access]

    //     return Inertia::render('purchases/edit', [
    //         'purchase' => $purchase->load([
    //             'purchaseItems.item',
    //             'godown',
    //             'salesman',
    //             'accountLedger',
    //         ]),

    //         // 'godowns'  => Godown::where('created_by', $userId)->get(['id', 'name']),
    //         // 'salesmen' => Salesman::where('created_by', $userId)->get(['id', 'name']),
    //         // 'ledgers'  => AccountLedger::where('created_by', $userId)->get(['id', 'account_ledger_name']),

    //         // /* inventory ledgers (same filter you used on create) */
    //         // 'inventoryLedgers' => AccountLedger::where('ledger_type', 'inventory')
    //         //     ->where('created_by', $userId)
    //         //     ->get(['id', 'account_ledger_name']),

    //         // /* payment modes */
    //         // 'receivedModes' => ReceivedMode::with('ledger')
    //         //     ->where('created_by', $userId)
    //         //     ->get(['id', 'mode_name', 'ledger_id']),

    //         // /* --- NEW: grouped stock just like the create() page --- */
    //         // 'stockItemsByGodown' => Stock::with('item.unit')
    //         //     ->where('created_by', $userId)
    //         //     ->get()                                // each row: item + qty
    //         //     ->groupBy('godown_id')                 // bucket by godown
    //         //     ->map(fn($col) => $col->map(fn($s) => [
    //         //         'id'   => $s->id,
    //         //         'qty'  => $s->qty,
    //         //         'item' => [
    //         //             'id'        => $s->item->id,
    //         //             'item_name' => $s->item->item_name,
    //         //             'unit_name'  => $s->item->unit->name ?? '',
    //         //         ],
    //         //     ]))
    //         //     ->toArray(),



    //         'godowns'  => Godown::whereIn('created_by', $userIds)->get(['id', 'name']),
    //         'salesmen' => Salesman::whereIn('created_by', $userIds)->get(['id', 'name']),
    //         'ledgers'  => AccountLedger::whereIn('created_by', $userIds)->get(['id', 'account_ledger_name']),
    //         'inventoryLedgers' => AccountLedger::where('ledger_type', 'inventory')
    //             ->whereIn('created_by', $userIds)
    //             ->get(['id', 'account_ledger_name']),
    //         'receivedModes' => ReceivedMode::with('ledger')
    //             ->whereIn('created_by', $userIds)
    //             ->get(['id', 'mode_name', 'ledger_id']),
    //         'stockItemsByGodown' => Stock::with('item.unit')
    //             ->whereIn('created_by', $userIds)
    //             ->get()
    //             ->groupBy('godown_id')
    //             ->map(fn($col) => $col->map(fn($s) => [
    //                 'id'   => $s->id,
    //                 'qty'  => $s->qty,
    //                 'item' => [
    //                     'id'        => $s->item->id,
    //                     'item_name' => $s->item->item_name,
    //                     'unit_name' => $s->item->unit->name ?? '',
    //                 ],
    //             ]))
    //             ->toArray(),


    //         'phone' => $purchase->phone,
    //         'address' => $purchase->address,
    //         'delivered_to' => $purchase->delivered_to,
    //         'shipping_details' => $purchase->shipping_details,


    //     ]);
    // }

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
            $stockItemsByGodown = Stock::with('item.unit')
                ->whereIn('created_by', $ids)
                ->get()
                ->groupBy('godown_id')
                ->map(fn($col) => $col->map(fn($s) => [
                    'id'   => $s->id,
                    'qty'  => $s->qty,
                    'item' => [
                        'id'        => $s->item->id,
                        'item_name' => $s->item->item_name,
                        'unit_name' => $s->item->unit->name ?? '',
                    ],
                ]))
                ->toArray();
        } else {
            // Admin: show all
            $godowns  = Godown::all(['id', 'name']);
            $salesmen = Salesman::all(['id', 'name']);
            $ledgers  = AccountLedger::all(['id', 'account_ledger_name']);
            $inventoryLedgers = AccountLedger::where('ledger_type', 'inventory')
                ->get(['id', 'account_ledger_name']);
            $receivedModes = ReceivedMode::with('ledger')
                ->get(['id', 'mode_name', 'ledger_id']);
            $stockItemsByGodown = Stock::with('item.unit')
                ->get()
                ->groupBy('godown_id')
                ->map(fn($col) => $col->map(fn($s) => [
                    'id'   => $s->id,
                    'qty'  => $s->qty,
                    'item' => [
                        'id'        => $s->item->id,
                        'item_name' => $s->item->item_name,
                        'unit_name' => $s->item->unit->name ?? '',
                    ],
                ]))
                ->toArray();
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
}
