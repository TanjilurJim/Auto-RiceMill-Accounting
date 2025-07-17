<?php

namespace App\Services;

use App\Models\Journal;
use App\Models\JournalEntry;
use App\Models\SalePayment;
use Illuminate\Support\Facades\DB;

class JournalService
{
    /* ------------------------------------------------------------
     |  A) Existing purchase helper (leave as-is)
     * ------------------------------------------------------------ */
    public static function createJournalForPurchase($purchase)
    {
        return DB::transaction(function () use ($purchase) {
            $journal = Journal::create([
                'date' => $purchase->date,
                'voucher_no' => $purchase->voucher_no,
                'narration' => 'Auto journal for Purchase ID ' . $purchase->id,
                'created_by' => $purchase->created_by,
            ]);

            // Debit: Purchase/Inventory
            JournalEntry::create([
                'journal_id' => $journal->id,
                'account_ledger_id' => config('accounts.purchase_ledger_id'), // Use your system's "Inventory" or "Purchase" ledger
                'type' => 'debit',
                'amount' => $purchase->grand_total,
                'note' => 'Purchase to Inventory',
            ]);

            // Credit: Supplier
            JournalEntry::create([
                'journal_id' => $journal->id,
                'account_ledger_id' => $purchase->account_ledger_id,
                'type' => 'credit',
                'amount' => $purchase->grand_total,
                'note' => 'Payable to Supplier',
            ]);

            return $journal;
        });
    }

    /* ------------------------------------------------------------
     |  B) NEW  helper for a single sale payment
     * ------------------------------------------------------------ */
    public static function postSalePayment(SalePayment $p): void
    {
        $sale = $p->sale;

        // Re-use or create the journal header for that sale
        $journal = Journal::firstOrCreate(
            ['id' => $sale->journal_id],
            [
                'date'         => $p->date,
                'voucher_no'   => $sale->voucher_no,
                'narration'    => 'Auto journal for Sale',
                'created_by'   => auth()->id(),
                'voucher_type' => 'Sale',
            ]
        );
        $sale->update(['journal_id' => $journal->id]);

        /* ---- 1. Cash / Bank in  ---- */


        if ($p->amount > 0 && $p->ledger) {
            self::addEntry($journal, $p->account_ledger_id, 'debit', $p->amount, 'Customer payment');
        }

        /* ---- 2. Finance charge income ---- */
        if ($p->interest_amount > 0) {
            $interestLedgerId = setting('interest_income_ledger');   // whatever helper / config you use
            self::addEntry($journal, $interestLedgerId, 'credit', $p->interest_amount, 'Finance charge earned');
        }

        /* ---- 3. Credit the customer’s AR ---- */
        self::addEntry(
            $journal,
            $sale->account_ledger_id,
            'credit',
            $p->amount + $p->interest_amount,
            'Receivable settled'
        );
    }

    /* ------------------------------------------------------------
     |  C) Shared tiny helper
     * ------------------------------------------------------------ */
    private static function addEntry(Journal $j, int $ledgerId, string $type, float $amt, string $note)
    {
        JournalEntry::create([
            'journal_id'        => $j->id,
            'account_ledger_id' => $ledgerId,
            'type'              => $type,
            'amount'            => $amt,
            'note'              => $note,
        ]);

        // ↳ adjust to your existing ledger-balance updater
        \App\Services\LedgerService::adjust($ledgerId, $type, $amt);
    }
}
