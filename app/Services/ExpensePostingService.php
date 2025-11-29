<?php

namespace App\Services;

use App\Models\Expense;
use App\Models\Journal;
use App\Models\JournalEntry;
use Illuminate\Support\Facades\DB;
use App\Services\LedgerService;
class ExpensePostingService
{
    /**
     * Post an expense to the journal with proper double-entry accounting
     *
     * @param Expense $e
     * @throws \InvalidArgumentException If required fields are missing
     * @throws \RuntimeException If expense is already posted
     * @return void
     */
    public function post(Expense $e): void
    {
        // Validate the expense hasn't been posted already
        if ($e->journal_id) {
            throw new \RuntimeException('This expense has already been posted.');
        }

        // Validate required fields
        if (!$e->expense_ledger_id || !$e->amount || !$e->date || !$e->voucher_no) {
            throw new \InvalidArgumentException('Missing required expense fields.');
        }

        // Validate payment method - either payment_ledger_id or supplier_ledger_id must be set
        if (!$e->payment_ledger_id && !$e->supplier_ledger_id) {
            throw new \InvalidArgumentException('Either payment ledger or supplier ledger must be specified.');
        }

        DB::transaction(function () use ($e) {
            // Header
            $journal = Journal::create([
                'date'         => $e->date,
                'voucher_no'   => $e->voucher_no,
                'narration'    => 'Expense: ' . ($e->note ?? ''),
                'voucher_type' => 'Expense',
                'created_by'   => $e->created_by,
            ]);
            $e->update(['journal_id' => $journal->id]);

            // Dr Expense
            JournalEntry::create([
                'journal_id'        => $journal->id,
                'account_ledger_id' => $e->expense_ledger_id,
                'type'              => 'debit',
                'amount'            => $e->amount,
                'note'              => 'Operating expense',
            ]);
            LedgerService::adjust($e->expense_ledger_id, 'debit', $e->amount);

            if ($e->payment_ledger_id) {
                // Paid now → Cr Cash/Bank
                JournalEntry::create([
                    'journal_id'        => $journal->id,
                    'account_ledger_id' => $e->payment_ledger_id, // must be cash_bank
                    'type'              => 'credit',
                    'amount'            => $e->amount,
                    'note'              => 'Paid from cash/bank',
                ]);
                LedgerService::adjust($e->payment_ledger_id, 'credit', $e->amount);
            } else {
                // Not paid → Cr Supplier (A/P)
                JournalEntry::create([
                    'journal_id'        => $journal->id,
                    'account_ledger_id' => $e->supplier_ledger_id, // must be accounts_payable
                    'type'              => 'credit',
                    'amount'            => $e->amount,
                    'note'              => 'Expense payable',
                ]);
                LedgerService::adjust($e->supplier_ledger_id, 'credit', $e->amount);
            }
        });
    }
}
