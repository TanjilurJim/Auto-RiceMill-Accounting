<?php

namespace App\Services;

use App\Models\RentVoucher;
use App\Models\AccountLedger;
use App\Models\Journal;
use App\Models\JournalEntry;
use App\Models\ReceivedAdd;
use App\Models\ReceivedMode;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class FinalizeRentVoucherService
{
    /**
     * Post the voucher to Journal & (optionally) create the initial receipt.
     * Idempotent: safe to call once; will no-op if already posted & approved.
     */
    public function handle(RentVoucher $voucher, array $payload = []): void
    {
        DB::transaction(function () use ($voucher, $payload) {
            // --- guard: already posted & approved ---
            if ($voucher->status === 'approved' && $voucher->journal_id) {
                return;
            }

            // --- 1) Journal header ---
            $journal = Journal::create([
                'date'         => $voucher->date,
                'voucher_no'   => $voucher->vch_no,
                'voucher_type' => 'CrushingRent',
                'narration'    => 'Auto journal for Rent Voucher',
                'created_by'   => $voucher->created_by ?? Auth::id(),
            ]);

            // --- 2) Key ledgers/amounts ---
            $amount         = (float) $voucher->grand_total;
            $customerLedger = (int) $voucher->party_ledger_id;
            $incomeLedger   = $this->getOrCreateCrushingIncomeLedgerId($voucher->created_by ?? Auth::id());

            // --- 3) Dr AR / Cr Crushing Income ---
            JournalEntry::insert([
                [
                    'journal_id'        => $journal->id,
                    'account_ledger_id' => $customerLedger,
                    'type'              => 'debit',
                    'amount'            => $amount,
                    'note'              => 'Crushing charge receivable',
                ],
                [
                    'journal_id'        => $journal->id,
                    'account_ledger_id' => $incomeLedger,
                    'type'              => 'credit',
                    'amount'            => $amount,
                    'note'              => 'Crushing income',
                ],
            ]);
            LedgerService::adjust($customerLedger, 'debit',  $amount);
            LedgerService::adjust($incomeLedger,   'credit', $amount);

            // --- 4) Optional initial receipt (front-door) ---
            $amt    = array_key_exists('received_amount', $payload) ? (float)$payload['received_amount'] : (float)$voucher->received_amount;
            $modeId = array_key_exists('received_mode_id', $payload) ? (int)$payload['received_mode_id'] : (int)$voucher->received_mode_id;

            $initialReceiptId = null;
            if ($amt > 0 && $modeId) {
                $mode = ReceivedMode::with('ledger')->find($modeId);
                // Safety: require a Cash/Bank mapped mode
                if ($mode && $mode->ledger && $mode->ledger->ledger_type === 'cash_bank') {
                    $receipt = ReceivedAdd::create([
                        'date'              => Carbon::parse($voucher->date),
                        'voucher_no'        => $this->generateReceiptVoucherNo(), // RCV-YYYYMMDD-####
                        'received_mode_id'  => $modeId,
                        'account_ledger_id' => $customerLedger,
                        'amount'            => $amt,
                        'reference'         => 'Initial on Rent Voucher ' . $voucher->vch_no,
                        'remarks'           => $voucher->remarks,
                        'description'       => $voucher->remarks,
                        'created_by'        => $voucher->created_by ?? Auth::id(),
                        'tenant_id'         => optional(Auth::user())->tenant_id,
                    ]);

                    // post Dr Cash/Bank, Cr AR + Journal
                    $receipt->postToLedgersAndJournal();

                    // attach to voucher pivot
                    $voucher->receipts()->attach($receipt->id, [
                        'amount'     => $amt,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    $initialReceiptId = $receipt->id;
                }
            }

            // --- 5) Finalize voucher flags/links ---
            $voucher->update([
                'journal_id'         => $journal->id,
                'status'             => 'approved',
                'approved_at'        => now(),
                'approved_by'        => Auth::id(),
                'initial_receipt_id' => $initialReceiptId,
            ]);
        });
    }

    /**
     * Roll back a previously posted voucher:
     * - reverse (and delete) its journal
     * - reverse (and delete) the auto-created initial receipt (if any)
     * Leaves the voucher in an unposted state (journal_id & initial_receipt_id null).
     */
    public function rollback(RentVoucher $voucher): void
    {
        DB::transaction(function () use ($voucher) {

            // --- A) Roll back auto-created initial receipt (if any) ---
            if ($voucher->initial_receipt_id) {
                $receipt = ReceivedAdd::find($voucher->initial_receipt_id);
                if ($receipt) {
                    // 1) Reverse the receipt's journal impact
                    if ($receipt->journal_id) {
                        $entries = JournalEntry::where('journal_id', $receipt->journal_id)->get();
                        foreach ($entries as $e) {
                            LedgerService::adjust(
                                $e->account_ledger_id,
                                $e->type === 'debit' ? 'credit' : 'debit',
                                (float)$e->amount
                            );
                        }
                        JournalEntry::where('journal_id', $receipt->journal_id)->delete();
                        Journal::where('id', $receipt->journal_id)->delete();
                    }

                    // 2) Detach from voucher pivot
                    $voucher->receipts()->detach($receipt->id);

                    // 3) Delete the receipt row
                    $receipt->delete();
                }
            }

            // --- B) Roll back voucher journal ---
            if ($voucher->journal_id) {
                $entries = JournalEntry::where('journal_id', $voucher->journal_id)->get();
                foreach ($entries as $e) {
                    LedgerService::adjust(
                        $e->account_ledger_id,
                        $e->type === 'debit' ? 'credit' : 'debit',
                        (float)$e->amount
                    );
                }
                JournalEntry::where('journal_id', $voucher->journal_id)->delete();
                Journal::where('id', $voucher->journal_id)->delete();
            }

            // --- C) Clear posting flags on voucher ---
            $voucher->update([
                'journal_id'         => null,
                'initial_receipt_id' => null,
                // If you want to mark it draft before re-post:
                // 'status'          => 'draft',
                // 'approved_at'     => null,
                // 'approved_by'     => null,
            ]);
        });
    }

    private function getOrCreateCrushingIncomeLedgerId(int $userId): int
    {
        $crushingIncomeGroupId = 35; // your subgroup “Crushing Income” under Direct Income
        return AccountLedger::firstOrCreate(
            [
                'ledger_type'    => 'service_income',   // not other_income
                'mark_for_user'  => 0,
                'group_under_id' => $crushingIncomeGroupId,
                'created_by'     => $userId,
            ],
            [
                'account_ledger_name' => 'Crushing Income',
                'opening_balance'     => 0,
                'debit_credit'        => 'credit',
                'status'              => 'active',
                'phone_number'        => '0000000000',
            ]
        )->id;
    }


    private function generateReceiptVoucherNo(string $prefix = 'RCV'): string
    {
        return $prefix . '-' . now()->format('Ymd') . '-' . random_int(1000, 9999);
    }
}
