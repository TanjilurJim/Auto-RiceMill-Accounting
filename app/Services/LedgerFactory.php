<?php

namespace App\Services;

use App\Models\AccountLedger;

class LedgerFactory
{
    public static function ensureOperatingExpense(string $name = 'Operating Expense', ?int $groupUnderId = 11): int
    {
        $owner = auth()->id();

        $existing = AccountLedger::where([
            ['ledger_type', '=', 'operating_expense'],
            ['account_ledger_name', '=', $name],
            ['created_by', '=', $owner],
        ])->first();

        if ($existing) return $existing->id;

        return AccountLedger::create([
            'account_ledger_name' => $name,
            'ledger_type'         => 'operating_expense',
            'debit_credit'        => 'debit',
            'opening_balance'     => 0,
            'closing_balance'     => 0,
            'status'              => 'active',
            'group_under_id'      => $groupUnderId ?? 11, // Indirect Expenses
            'created_by'          => $owner,
        ])->id;
    }
}
