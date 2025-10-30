<?php

namespace App\Services;

use App\Models\AccountLedger;
use App\Models\Journal;
use App\Models\JournalEntry;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class OpeningBalancePosting
{
    /**
     * Ensure exactly one Opening journal exists for the given ledger.
     * - If opening is 0 => remove any existing Opening journal.
     * - Else (re)create it with proper debit/credit side, double-entry.
     */
    public function sync(AccountLedger $ledger, ?string $date = null): void
    {
        $amount = (float) ($ledger->opening_balance ?? 0.0);
        $date   = $date ?: ($ledger->created_at?->toDateString() ?? now()->toDateString());

        // Resolve the tenant "owner" (group head) for this ledger
        $tenantOwnerId = $this->tenantOwnerIdForLedger($ledger);

        // Get or create the per-tenant offset ledger (Opening Equity)
        $offsetLedgerId = $this->getOrCreateOffsetLedgerId($tenantOwnerId);

        // Stable per-ledger voucher number so we can upsert idempotently
        $voucherNo = 'OPN-' . $ledger->id;

        DB::transaction(function () use ($ledger, $amount, $date, $voucherNo, $offsetLedgerId) {
            // Upsert the journal header
            $journal = Journal::firstOrCreate(
                ['voucher_no' => $voucherNo],
                [
                    'date'         => $date,
                    'voucher_type' => 'Opening',
                    'narration'    => 'Opening balance for ledger #' . $ledger->id,
                    'created_by'   => auth()->id(),
                ]
            );

            // If opening is zero, remove the opening journal entirely
            if ($amount == 0.0) {
                JournalEntry::where('journal_id', $journal->id)->delete();
                $journal->delete();
                return;
            }

            // Keep header fresh
            $journal->update([
                'date'         => $date,
                'voucher_type' => 'Opening',
                'narration'    => 'Opening balance for ledger #' . $ledger->id,
            ]);

            // Rebuild the two lines to avoid drift
            JournalEntry::where('journal_id', $journal->id)->delete();

            // Natural side:
            // - debit-nature (assets/expenses) -> ledger DEBIT / offset CREDIT
            // - credit-nature (liabilities/income/equity) -> ledger CREDIT / offset DEBIT
            $ledgerLineType = $ledger->debit_credit === 'credit' ? 'credit' : 'debit';
            $offsetLineType = $ledgerLineType === 'debit' ? 'credit' : 'debit';

            // 1) Line for the ledger itself
            JournalEntry::create([
                'journal_id'        => $journal->id,
                'account_ledger_id' => $ledger->id,
                'type'              => $ledgerLineType,
                'amount'            => $amount,
                'note'              => 'Opening',
            ]);

            // 2) Offset line (tenant’s Opening Equity)
            JournalEntry::create([
                'journal_id'        => $journal->id,
                'account_ledger_id' => $offsetLedgerId,
                'type'              => $offsetLineType,
                'amount'            => $amount,
                'note'              => 'Opening offset',
            ]);

            // OPTIONAL: if you maintain a cached closing_balance in AccountLedger,
            // and you want to keep it in sync without touching JournalService:
            // if (class_exists(\App\Services\LedgerService::class)) {
            //     \App\Services\LedgerService::adjust($ledger->id, $ledgerLineType, $amount);
            //     \App\Services\LedgerService::adjust($offsetLedgerId, $offsetLineType, $amount);
            // }
        });
    }

    /**
     * Remove the Opening journal for a ledger (if any).
     */
    public function remove(AccountLedger $ledger): void
    {
        $voucherNo = 'OPN-' . $ledger->id;

        DB::transaction(function () use ($voucherNo) {
            $journal = Journal::where('voucher_no', $voucherNo)->first();
            if (!$journal) {
                return;
            }
            JournalEntry::where('journal_id', $journal->id)->delete();
            $journal->delete();
        });
    }

    /**
     * Determine the tenant "owner" (group head) for the given ledger.
     * Falls back sensibly if helpers/users are missing.
     */
    private function tenantOwnerIdForLedger(AccountLedger $ledger): int
    {
        // Prefer the ledger's creator as the anchor user
        $creator = $ledger->relationLoaded('creator')
            ? $ledger->creator
            : User::find($ledger->created_by);

        $anchor = $creator ?: (auth()->user() ?? User::query()->first());

        // Use your existing helper to get the group head id
        if (function_exists('get_top_parent_id') && $anchor) {
            $head = get_top_parent_id($anchor);
            if ($head) {
                return $head;
            }
            return $anchor->id;
        }

        // Fallbacks
        return $anchor ? $anchor->id : (int) (auth()->id() ?? 1);
    }

    /**
     * Per-tenant offset ledger finder/creator.
     * Creates exactly one "Opening Equity" ledger for the tenant group head,
     * identified by a stable reference_number: SYS-OPENING-EQUITY-<tenantOwnerId>
     */
    private function getOrCreateOffsetLedgerId(int $tenantOwnerId): int
    {
        $reference = 'SYS-OPENING-EQUITY-' . $tenantOwnerId;

        // Try to find by the stable reference (scoped by your global scope via created_by)
        $existing = AccountLedger::where('reference_number', $reference)->first();
        if ($existing) {
            return $existing->id;
        }

        // Create it for this tenant (created_by = tenant group head)
        $offset = AccountLedger::create([
            'account_ledger_name' => 'Opening Equity',
            'ledger_type'         => 'equity',   // fits credit-nature
            'debit_credit'        => 'credit',
            'opening_balance'     => 0,
            'status'              => 'active',
            'created_by'          => $tenantOwnerId,
            'reference_number'    => $reference, // bypasses your auto-generator (boot sets only if empty)
        ]);

        return $offset->id;
    }
}
