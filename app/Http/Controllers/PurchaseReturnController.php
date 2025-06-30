<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Models\PurchaseReturn;
use App\Models\PurchaseReturnItem;
use App\Models\Godown;
use App\Models\Salesman;
use App\Models\AccountLedger;
use App\Models\Journal;
use App\Models\ReceivedMode;
use App\Models\JournalEntry;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

use function company_info;   // helper
use function numberToWords;
use function godown_scope_ids; // [multi-level access]

class PurchaseReturnController extends Controller
{
    // 🟢 Index: List all returns
    public function index()
    {
        // $returns = PurchaseReturn::with([
        //     'godown',
        //     'accountLedger',
        //     'returnItems.item',
        //     'creator'
        // ])
        //     ->where('created_by', auth()->id())
        //     ->orderBy('id', 'desc')
        //     ->paginate(10);

        $user = auth()->user(); // [multi-level access]

        if ($user->hasRole('admin')) { // [multi-level access]
            $returns = PurchaseReturn::with([
                'godown',
                'accountLedger',
                'returnItems.item',
                'creator'
            ])
                ->orderBy('id', 'desc')
                ->paginate(10);
        } else { // [multi-level access]
            $ids = godown_scope_ids(); // [multi-level access]
            $returns = PurchaseReturn::with([
                'godown',
                'accountLedger',
                'returnItems.item',
                'creator'
            ])
                ->whereIn('created_by', $ids) // [multi-level access]
                ->orderBy('id', 'desc')
                ->paginate(10);
        }

        return Inertia::render('purchase_returns/index', [
            'returns' => $returns
        ]);
    }

    // 🟢 Create form
    // public function create()
    // {
    //     // return Inertia::render('purchase_returns/create', [
    //     //     'godowns' => Godown::where('created_by', auth()->id())->get(),
    //     //     'ledgers' => AccountLedger::where('created_by', auth()->id())->get(),
    //     //     'items' => Item::where('created_by', auth()->id())->get()->unique('item_name')->values(),
    //     //     'receivedModes' => ReceivedMode::with('ledger') // 🆕 add this
    //     //         ->where('created_by', auth()->id())
    //     //         ->get(),
    //     // ]);

    //     $userIds = godown_scope_ids(); // [multi-level access]

    //     return Inertia::render('purchase_returns/create', [
    //         'godowns' => Godown::whereIn('created_by', $userIds)->get(), // [multi-level access]
    //         'ledgers' => AccountLedger::whereIn('created_by', $userIds)->get(), // [multi-level access]
    //         'items' => Item::whereIn('created_by', $userIds)->get()->unique('item_name')->values(), // [multi-level access]
    //         'receivedModes' => ReceivedMode::with('ledger')
    //             ->whereIn('created_by', $userIds) // [multi-level access]
    //             ->get(),
    //     ]);
    // }

    public function create()
    {
        $user = auth()->user();
        $userIds = godown_scope_ids();

        // If admin, show all data (no filter)
        $godowns = $user->hasRole('admin')
            ? Godown::all()
            : Godown::whereIn('created_by', $userIds)->get();

        $ledgers = $user->hasRole('admin')
            ? AccountLedger::all()
            : AccountLedger::whereIn('created_by', $userIds)->get();

        $items = $user->hasRole('admin')
            ? Item::all()->unique('item_name')->values()
            : Item::whereIn('created_by', $userIds)->get()->unique('item_name')->values();

        $receivedModes = $user->hasRole('admin')
            ? ReceivedMode::with('ledger')->get()
            : ReceivedMode::with('ledger')->whereIn('created_by', $userIds)->get();

        return Inertia::render('purchase_returns/create', [
            'godowns' => $godowns,
            'ledgers' => $ledgers,
            'items' => $items,
            'receivedModes' => $receivedModes,
        ]);
    }

    // 🟢 Store
    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'inventory_ledger_id' => 'required|exists:account_ledgers,id',
            'return_voucher_no' => 'nullable|unique:purchase_returns,return_voucher_no',
            'godown_id' => 'required|exists:godowns,id',
            'account_ledger_id' => 'required|exists:account_ledgers,id',
            'return_items' => 'required|array|min:1',
            'return_items.*.product_id' => 'required|exists:items,id',
            'return_items.*.qty' => 'required|numeric|min:0.01',
            'return_items.*.price' => 'required|numeric|min:0',
            'return_items.*.subtotal' => 'required|numeric|min:0',
            'reason' => 'nullable|string|max:1000',
        ]);

        $voucherNo = $request->return_voucher_no ?? 'RET-' . now()->format('Ymd') . '-' . str_pad(PurchaseReturn::max('id') + 1, 4, '0', STR_PAD_LEFT);

        $return = PurchaseReturn::create([
            'date' => $request->date,
            'return_voucher_no' => $voucherNo,
            'godown_id' => $request->godown_id,
            'account_ledger_id' => $request->account_ledger_id,
            'inventory_ledger_id'=> $request->inventory_ledger_id,
            'reason' => $request->reason,
            'total_qty' => collect($request->return_items)->sum('qty'),
            'grand_total' => collect($request->return_items)->sum('subtotal'),
            'created_by' => auth()->id(),
        ]);

        foreach ($request->return_items as $item) {
            $return->returnItems()->create($item);
            $stock = Stock::where('item_id', $item['product_id'])->where('godown_id', $request->godown_id)->first();
            if ($stock) {
                $stock->decrement('qty', $item['qty']);
            }
        }

        $journal = Journal::firstOrCreate([
            'voucher_no' => $voucherNo
        ], [
            'date' => $request->date,
            'narration' => 'Auto Journal for Purchase Return',
            'created_by' => auth()->id(),
            'voucher_type' => 'Purchase Return',
        ]);

        $journal->entries()->createMany([
            [
                'account_ledger_id' => $request->account_ledger_id,
                'type' => 'debit',
                'amount' => $return->grand_total,
                'note' => 'Reduce supplier payable (return) | রিটার্নের কারণে সরবরাহকারীর বাকি হ্রাস',
            ],
            [
                'account_ledger_id' => $return->inventory_ledger_id, 
                'type' => 'credit',
                'amount' => $return->grand_total,
                'note' => 'Inventory decreased (purchase return)',
            ],
        ]);

        $this->updateLedgerBalance($request->account_ledger_id, 'debit', $return->grand_total);
        $this->updateLedgerBalance($return->inventory_ledger_id, 'credit', $return->grand_total); 

        $return->journal_id = $journal->id;
        $return->save();

        if ($request->filled('refund_modes')) {
            foreach ($request->refund_modes as $mode) {
                // ① make / reuse one row per ledger
                $received = ReceivedMode::firstOrCreate(
                    ['ledger_id' => $mode['ledger_id']],          // search key
                    [
                        'mode_name'  => $mode['mode_name'],
                        'created_by' => auth()->id(),
                    ]
                );

                // ② optional: keep latest phone or rename
                $received->update([
                    'phone_number' => $mode['phone_number'] ?? $received->phone_number,
                ]);

                $journal->entries()->create([
                    'account_ledger_id' =>  $received->ledger_id,
                    'type' => 'credit',
                    'amount' => $mode['amount_paid'],
                    'note' => 'Refund paid via ' .  (\App\Models\AccountLedger::find($mode['ledger_id'])?->account_ledger_name ?? 'Unknown'),
                ]);
                $journal->entries()->create([
                    'account_ledger_id' => $request->account_ledger_id,
                    'type' => 'debit',
                    'amount' => $mode['amount_paid'],
                    'note' => 'Refund adjustment to supplier',
                ]);

                $this->updateLedgerBalance($mode['ledger_id'], 'credit', $mode['amount_paid']);
                $this->updateLedgerBalance($request->account_ledger_id, 'debit', $mode['amount_paid']);
            }
        }

        return redirect()->route('purchase-returns.index')->with('success', 'Purchase Return created successfully!');
    }

    // 🟢 Edit
    public function edit(PurchaseReturn $purchase_return)
    {
        // tenant / owner check
        // if ($purchase_return->created_by !== auth()->id()) {
        //     abort(403);
        // }

        $user = auth()->user(); // [multi-level access]
        if (!$user->hasRole('admin')) { // [multi-level access]
            $ids = godown_scope_ids(); // [multi-level access]
            if (!in_array($purchase_return->created_by, $ids)) { // [multi-level access]
                abort(403);
            }
        }


        // $userId = auth()->id();                 // shorthand
        $userIds = godown_scope_ids(); // [multi-level access]
        $inventoryGroupIds = [1, 2, 14, 15];    // the groups you treat as “Inventory”

        /* 1️⃣ eager‑load everything we need on the header record */
        $purchase_return->load([
            'returnItems.item',          // each item row + product name
            'godown',
            'accountLedger',
            'refundModes.ledger',        // ← existing ReceivedMode rows + their ledgers
        ]);

        /* 2️⃣ return data for dropdowns & props */
        return Inertia::render('purchase_returns/edit', [
            'purchase_return'  => $purchase_return->load([
                'returnItems.item',
                'godown',
                'accountLedger',
                'refundModes.ledger',   // 🆕  pre‑fill refund rows
            ]),
            'godowns'          => Godown::where('created_by', $userIds)->get(),
            'ledgers'          => AccountLedger::where('created_by', $userIds)->get(),
            'inventoryLedgers' => AccountLedger::whereIn('account_group_id', [1, 2, 14, 15])
                ->where('created_by', $userIds)
                ->get(['id', 'account_ledger_name']),         // 🆕
            'receivedModes'    => ReceivedMode::with('ledger')
                ->where('created_by', $userIds)
                ->get(['id', 'mode_name', 'ledger_id']),       // 🆕
            'items'            => Item::where('created_by', $userIds)->get(),
        ]);
    }

    // 🟢 Update
    public function update(Request $request, PurchaseReturn $purchase_return)
    {
        // if ($purchase_return->created_by !== auth()->id()) {
        //     abort(403);
        // }

        $user = auth()->user(); // [multi-level access]
        if (!$user->hasRole('admin')) { // [multi-level access]
            $ids = godown_scope_ids(); // [multi-level access]
            if (!in_array($purchase_return->created_by, $ids)) { // [multi-level access]
                abort(403);
            }
        }

        $request->validate([
            'date' => 'required|date',
            'godown_id' => 'required|exists:godowns,id',
            'account_ledger_id' => 'required|exists:account_ledgers,id',
            'inventory_ledger_id' => 'required|exists:account_ledgers,id',
            'return_items' => 'required|array|min:1',
            'return_items.*.product_id' => 'required|exists:items,id',
            'return_items.*.qty' => 'required|numeric|min:0.01',
            'return_items.*.price' => 'required|numeric|min:0',
            'refund_modes.*.ledger_id' => 'nullable|exists:account_ledgers,id',
            'refund_modes.*.amount_paid' => 'nullable|numeric|min:0.01',
            'return_items.*.subtotal' => 'required|numeric|min:0',
            'reason' => 'nullable|string|max:1000',
        ]);

        foreach ($purchase_return->returnItems as $item) {
            $stock = Stock::where('item_id', $item->product_id)
                ->where('godown_id', $purchase_return->godown_id)
                ->first();

            if ($stock) {
                $stock->increment('qty', $item->qty); // reverse
            }
        }

        if ($purchase_return->journal_id) {
            JournalEntry::where('journal_id', $purchase_return->journal_id)->delete();
        }

        $journal = Journal::firstOrCreate(
            ['voucher_no' => $purchase_return->return_voucher_no],
            [
                'date' => $request->date,
                'narration' => 'Auto Journal for Purchase Return (updated)',
                'created_by' => auth()->id(),
            ]
        );
        /* -----------------------------------------------------------
        |  🟣  REFUND‑MODE CLEAN‑UP & RECREATE  <<––  INSERT HERE
        |------------------------------------------------------------
        */
        // make sure this import is at top

        // A. reverse & delete previous refund‑mode rows
        $oldRefunds = ReceivedMode::where('purchase_return_id', $purchase_return->id)->get();

        foreach ($oldRefunds as $old) {
            // reverse closing‑balance effect
            $this->updateLedgerBalance($old->ledger_id,            'debit',  $old->amount_paid);
            $this->updateLedgerBalance($purchase_return->account_ledger_id, 'credit', $old->amount_paid);

            $old->delete();
        }

        // also clear their journal entries (they came after the two core lines)
        JournalEntry::where('journal_id', $purchase_return->journal_id)
            ->where('note', 'like', 'Refund%')
            ->delete();

        // B. create the newly‑submitted refund modes
        if ($request->filled('refund_modes')) {
            foreach ($request->refund_modes as $mode) {

                \Log::info('Refund mode debug', $mode);

                $received = ReceivedMode::firstOrCreate(
                    ['ledger_id' => $mode['ledger_id']],
                    ['mode_name' => $mode['mode_name'], 'created_by' => auth()->id()]
                );

                $received->update([
                    'phone_number' => $mode['phone_number'] ?? $received->phone_number,
                ]);

                // single, clear way to get the ledger name
                $ledName = $received->ledger?->account_ledger_name ?? 'Unknown';

                JournalEntry::create([
                    'journal_id'        => $journal->id,        // header created earlier
                    'account_ledger_id' => (int) $mode['ledger_id'],
                    'type'   => 'credit',
                    'amount' => $mode['amount_paid'],
                    'note'   => 'Refund paid via ' . $ledName,
                ]);

                JournalEntry::create([
                    'journal_id'        => $journal->id,
                    'account_ledger_id' => $request->account_ledger_id,
                    'type'   => 'debit',
                    'amount' => $mode['amount_paid'],
                    'note'   => 'Refund adjustment to supplier',
                ]);

                $this->updateLedgerBalance($received->ledger_id, 'credit', $mode['amount_paid']);
                $this->updateLedgerBalance($request->account_ledger_id, 'debit',  $mode['amount_paid']);
            }
        }
        /* -----------------------------------------------------------
        |  🟣  END REFUND BLOCK
        |------------------------------------------------------------
        */

        $purchase_return->update([
            'date' => $request->date,
            'godown_id' => $request->godown_id,
            'account_ledger_id' => $request->account_ledger_id,
            'inventory_ledger_id' => $request->inventory_ledger_id,  // ✅ this line
            'reason' => $request->reason,
            'total_qty' => collect($request->return_items)->sum('qty'),
            'grand_total' => collect($request->return_items)->sum('subtotal'),
        ]);

        $purchase_return->returnItems()->delete();
        foreach ($request->return_items as $item) {
            $purchase_return->returnItems()->create($item);

            $stock = Stock::firstOrNew([
                'item_id' => $item['product_id'],
                'godown_id' => $request->godown_id,
                'created_by' => auth()->id(),
            ]);
            $stock->qty -= $item['qty'];
            $stock->save();
        }

        // Recreate journal entries as in store()


        $journal->entries()->createMany([
            [
                'account_ledger_id' => $request->account_ledger_id,
                'type' => 'debit',
                'amount' => $purchase_return->grand_total,
            ],
            [
                'account_ledger_id' => $purchase_return->inventory_ledger_id,
                'type' => 'credit',
                'amount' => $purchase_return->grand_total,
            ],
        ]);

        $this->updateLedgerBalance($request->account_ledger_id, 'debit', $purchase_return->grand_total);
        $this->updateLedgerBalance($purchase_return->inventory_ledger_id, 'credit', $purchase_return->grand_total); // ✅

        $purchase_return->journal_id = $journal->id;
        $purchase_return->save();

        return redirect()->route('purchase-returns.index')->with('success', 'Purchase Return updated successfully!');
    }

    // 🟢 Delete
    public function destroy(PurchaseReturn $purchase_return)
    {
        // if ($purchase_return->created_by !== auth()->id()) {
        //     abort(403);
        // }

        $user = auth()->user(); // [multi-level access]
        if (!$user->hasRole('admin')) { // [multi-level access]
            $ids = godown_scope_ids(); // [multi-level access]
            if (!in_array($purchase_return->created_by, $ids)) { // [multi-level access]
                abort(403);
            }
        }

        $purchase_return->delete();
        return redirect()->back()->with('success', 'Purchase Return deleted successfully!');
    }

    // 🟢 Optional Print (Invoice)
    public function invoice(PurchaseReturn $purchase_return)
    {
        $purchase_return->load(['returnItems.item', 'godown', 'accountLedger']);

        $company = company_info();
        $amountWords = numberToWords((int) $purchase_return->grand_total);

        // return Inertia::render('purchase_returns/invoice', [
        //     'purchase_return' => $purchase_return
        // ]);
        return Inertia::render('purchase_returns/invoice', [
            'purchase_return' => $purchase_return,
            'company' => $company,
            'amountWords' => $amountWords,
        ]);
    }

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
}
