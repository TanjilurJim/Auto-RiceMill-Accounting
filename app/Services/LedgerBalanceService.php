<?php

namespace App\Services;

use App\Models\AccountLedger;
use App\Models\JournalEntry;
use App\Models\Journal;

class LedgerBalanceService
{
    public static function recalc(AccountLedger $ledger): void
    {
        $row = JournalEntry::query()
            ->selectRaw("
            SUM(CASE WHEN type='debit'  THEN amount ELSE 0 END)  AS debits,
            SUM(CASE WHEN type='credit' THEN amount ELSE 0 END)  AS credits
        ")
            ->where('account_ledger_id', $ledger->id)
            ->first();

        $debits  = (float) ($row->debits  ?? 0);
        $credits = (float) ($row->credits ?? 0);

        // If an opening journal exists for this ledger, the opening is already represented
        // in the journal lines and shouldn't be added again.
        $hasOpeningJournal = \App\Models\Journal::where('voucher_no', 'OPN-' . $ledger->id)->exists();

        if ($hasOpeningJournal) {
            // net based solely on journal entries
            $net = $debits - $credits;
        } else {
            // legacy/other ledgers: include the stored opening balance
            $open       = (float) ($ledger->opening_balance ?? 0);
            $openSigned = $ledger->debit_credit === 'credit' ? -$open : +$open;
            $net = $openSigned + $debits - $credits;
        }

        $ledger->closing_balance = abs($net);
        $ledger->debit_credit    = $net >= 0 ? 'debit' : 'credit';
        $ledger->save();
    }
}
