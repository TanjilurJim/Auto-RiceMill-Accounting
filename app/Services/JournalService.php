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
        // … your untouched code …
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
            self::addEntry($journal, $p->ledger_id, 'debit', $p->amount, 'Customer payment');
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
        app(\App\Http\Controllers\SaleController::class)
            ->updateLedgerBalance($ledgerId, $type, $amt);
    }
}
