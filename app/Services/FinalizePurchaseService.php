<?php

namespace App\Services;

use App\Models\{
    Purchase,
    Stock,
    Journal,
    JournalEntry,
    ReceivedMode,
    AccountLedger,
    Item,
    StockMove,
};
use Illuminate\Support\Facades\DB;

class FinalizePurchaseService
{
    /**
     * Post stock, create journal + ledger moves.
     *
     * @param  Purchase  $purchase
     * @param  array     $pay   ['amount_paid' => float, 'received_mode_id' => int]
     */
    public function handle(Purchase $purchase, array $pay = []): void
    {
        /* ------------------------------------------------------------------
         |  Prep – pull figures once so we don't recalc inside loops
         * -----------------------------------------------------------------*/
        $amountPaid      = $pay['amount_paid']     ?? $purchase->amount_paid     ?? 0;
        $receivedModeId  = $pay['received_mode_id'] ?? $purchase->received_mode_id ?? null;
        $grandTotal      = $purchase->grand_total;
        $supplierLedger  = $purchase->account_ledger_id;
        $inventoryLedger = $purchase->inventory_ledger_id;

        DB::transaction(function () use (
            $purchase,
            $amountPaid,
            $receivedModeId,
            $grandTotal,
            $supplierLedger,
            $inventoryLedger
        ) {

            /* =============================================================
             | 1️⃣  Increment stock (or create rows)                  |
             * ============================================================*/

            foreach ($purchase->purchaseItems as $line) {
                $stock = Stock::firstOrNew([
                    'item_id'    => $line->product_id,
                    'godown_id'  => $purchase->godown_id,
                    'lot_id'     => $line->lot_id,
                    'created_by' => $purchase->created_by,
                ]);

                // if new, qty may be null → normalise to 0
                $stock->qty = ($stock->qty ?? 0) + $line->qty;
                $stock->save();

                /* ░░ 2-b) Log the purchase in stock_moves  ░░ */
                StockMove::create([
                    'godown_id'  => $purchase->godown_id,
                    'item_id'    => $line->product_id,
                    'lot_id'     => $line->lot_id,
                    'type'       => 'purchase',                 // 👈 your new enum value
                    'qty'        => $line->qty,
                    'unit_cost'  => $line->price,
                    'reason'     => 'auto-purchase',            // keep or drop as you prefer
                    'created_by' => $purchase->created_by,
                ]);

                // ── b) items table – bump previous_stock ──────────
                Item::where('id', $line->product_id)->increment('previous_stock', $line->qty);
            }   // ← ✅ close the foreach here

            // ← now it’s persisted

            /* =============================================================
             | 2️⃣  Journal header                                       |
             * ============================================================*/
            $journal = $purchase->journal_id
                ? Journal::find($purchase->journal_id)
                : Journal::create([
                    'date'         => $purchase->date,
                    'voucher_no'   => $purchase->voucher_no,
                    'narration'    => 'Auto journal for Purchase',
                    'created_by'   => $purchase->created_by,
                    'voucher_type' => 'Purchase',
                ]);

            // keep the link
            if (! $purchase->journal_id) {
                $purchase->update(['journal_id' => $journal->id]);
            }

            /* =============================================================
             | 3️⃣  Core double-entry                                    |
             * ============================================================*/
            // Debit Inventory
            $this->entry($journal->id, $inventoryLedger, 'debit',  $grandTotal, 'Inventory received');
            // Credit Supplier
            $this->entry($journal->id, $supplierLedger,  'credit', $grandTotal, 'Payable to Supplier');

            /* =============================================================
             | 4️⃣  Optional part-payment                                 |
             * ============================================================*/
            if ($amountPaid > 0 && $receivedModeId) {
                $mode = ReceivedMode::with('ledger')->find($receivedModeId);

                if ($mode && $mode->ledger) {
                    // Credit Cash / Bank / bKash ledger
                    $this->entry(
                        $journal->id,
                        $mode->ledger_id,
                        'credit',
                        $amountPaid,
                        'Payment via ' . $mode->mode_name
                    );
                    // Debit Supplier (reduce payable)
                    $this->entry(
                        $journal->id,
                        $supplierLedger,
                        'debit',
                        $amountPaid,
                        'Partial payment to supplier'
                    );
                }
            }
        });
    }

    /* --------------------------------------------------------------------
     | Helper – create entry + adjust ledger closing balance
     * -------------------------------------------------------------------*/
    private function entry(int $journalId, int $ledgerId, string $type, float $amount, string $note): void
    {
        JournalEntry::create([
            'journal_id'        => $journalId,
            'account_ledger_id' => $ledgerId,
            'type'              => $type,      // debit | credit
            'amount'            => $amount,
            'note'              => $note,
        ]);

        $ledger = AccountLedger::find($ledgerId);
        if (! $ledger) {
            return;
        }

        $current = $ledger->closing_balance ?? $ledger->opening_balance ?? 0;
        $ledger->closing_balance = $type === 'debit'
            ? $current + $amount
            : $current - $amount;
        $ledger->save();
    }
}
