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
    Lot,
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
        $amountPaid      = $pay['amount_paid']      ?? $purchase->amount_paid      ?? 0;
        $receivedModeId  = $pay['received_mode_id'] ?? $purchase->received_mode_id ?? null;
        $grandTotal      = $purchase->grand_total;
        $supplierLedger  = $purchase->account_ledger_id;
        $inventoryLedger = $purchase->inventory_ledger_id;

        // ↓ avoid N+1 when we read $line->lot
        $purchase->loadMissing('purchaseItems.lot');

        DB::transaction(function () use ($purchase, $amountPaid, $receivedModeId, $grandTotal, $supplierLedger, $inventoryLedger) {

            /* 1) Stock & stock_moves */
            foreach ($purchase->purchaseItems as $line) {
                $stock = Stock::firstOrNew([
                    'item_id'    => $line->product_id,
                    'godown_id'  => $purchase->godown_id,
                    'lot_id'     => $line->lot_id,
                    'created_by' => $purchase->created_by,
                ]);

                $stock->qty = ($stock->qty ?? 0) + $line->qty;
                $stock->save();

                // per-kg rate from lot unit_weight (if set)
                $lot = $line->lot ?? Lot::find($line->lot_id);
                $perKg = null;
                $unitWeight = $lot?->unit_weight; // kg per unit/bosta

                if (!is_null($unitWeight) && $unitWeight > 0) {
                    // price is per unit -> convert to per-kg
                    $perKg = round(((float)$line->price) / (float)$unitWeight, 6);
                }

                StockMove::create([
                    'godown_id'  => $purchase->godown_id,
                    'item_id'    => $line->product_id,
                    'lot_id'     => $line->lot_id,
                    'type'       => 'purchase',
                    'qty'        => $line->qty,
                    'unit_cost'  => $line->price, // per unit/bosta
                    'reason'     => 'auto-purchase',
                    'meta'       => [
                        // helps the Item detail screen compute fast
                        'per_kg_rate' => $perKg,          // may be null if not computable
                        'unit_weight' => $unitWeight,     // echo what we used
                    ],
                    'created_by' => $purchase->created_by,
                ]);

                // maintain your “previous_stock” accumulator on items
                Item::where('id', $line->product_id)->increment('previous_stock', $line->qty);
            }

            /* 2) Journal header */
            $journal = $purchase->journal_id
                ? Journal::find($purchase->journal_id)
                : Journal::create([
                    'date'         => $purchase->date,
                    'voucher_no'   => $purchase->voucher_no,
                    'narration'    => 'Auto journal for Purchase',
                    'created_by'   => $purchase->created_by,
                    'voucher_type' => 'Purchase',
                ]);

            if (!$purchase->journal_id) {
                $purchase->update(['journal_id' => $journal->id]);
            }

            /* 3) Double-entry: Dr Inventory / Cr Supplier */
            $this->entry($journal->id, $inventoryLedger, 'debit',  $grandTotal, 'Inventory received');
            $this->entry($journal->id, $supplierLedger,  'credit', $grandTotal, 'Payable to Supplier');

            /* 4) Optional part payment */
            if ($amountPaid > 0 && $receivedModeId) {
                $mode = ReceivedMode::with('ledger')->find($receivedModeId);
                if ($mode && $mode->ledger) {
                    $this->entry($journal->id, $mode->ledger_id, 'credit', $amountPaid, 'Payment via ' . $mode->mode_name);
                    $this->entry($journal->id, $supplierLedger,  'debit',  $amountPaid, 'Partial payment to supplier');
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
