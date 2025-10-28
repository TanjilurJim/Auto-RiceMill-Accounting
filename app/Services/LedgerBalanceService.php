<?php

namespace App\Services;

use App\Models\AccountLedger;
use App\Models\JournalEntry;

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

        $open       = (float) ($ledger->opening_balance ?? 0);
        $openSigned = $ledger->debit_credit === 'credit' ? -$open : +$open;
        $debits     = (float) ($row->debits  ?? 0);
        $credits    = (float) ($row->credits ?? 0);

        $net = $openSigned + $debits - $credits;     // + => Dr, - => Cr

        $ledger->closing_balance = abs($net);
        $ledger->debit_credit    = $net >= 0 ? 'debit' : 'credit';
        $ledger->save();
    }
}
