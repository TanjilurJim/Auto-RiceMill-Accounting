<?php

namespace App\Services;

use App\Models\Journal;
use App\Models\JournalEntry;
use Illuminate\Support\Facades\DB;

class JournalService
{
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
}
