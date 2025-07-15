<?php

namespace App\Services;

use App\Models\AccountLedger;

class LedgerService
{
    /**
     * Increment or decrement a ledger’s closing_balance.
     *
     * @param int    $ledgerId  AccountLedger primary key
     * @param string $type      'debit'  = balance ↑,  'credit' = balance ↓
     * @param float  $amount
     */
    public static function adjust(int $ledgerId, string $type, float $amount): void
    {
        $ledger = AccountLedger::find($ledgerId);
        if (!$ledger) {
            return;
        }

        $current = $ledger->closing_balance ?? $ledger->opening_balance ?? 0;

        $ledger->closing_balance = $type === 'debit'
            ? $current + $amount
            : $current - $amount;

        $ledger->save();
    }
}
