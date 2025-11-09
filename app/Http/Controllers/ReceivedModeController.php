<?php

namespace App\Http\Controllers;

use App\Models\AccountLedger;
use App\Models\ReceivedMode;
use App\Services\OpeningBalancePosting;
use Illuminate\Http\Request;

use function godown_scope_ids;
use function get_top_parent_id;

class ReceivedModeController extends Controller
{
    public function index()
    {
        $ids = godown_scope_ids();

        $receivedModes = ReceivedMode::query()
            ->when(!empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->with('ledger:id,account_ledger_name,closing_balance,debit_credit,group_under_id')
            ->orderByDesc('id')
            ->paginate(10);

        return inertia('received-modes/index', [
            'receivedModes' => $receivedModes,
            'currentPage'   => $receivedModes->currentPage(),
            'perPage'       => $receivedModes->perPage(),
        ]);
    }

    public function create()
    {
        // No ledgers list needed anymore; the ledger will be auto-created.
        return inertia('received-modes/create');
    }

    public function store(Request $request, OpeningBalancePosting $openingPoster)
    {
        $validated = $request->validate([
            'mode_name'        => ['required', 'string', 'max:255'],
            'phone_number'     => ['nullable', 'string', 'max:20'],
            'mode_kind'        => ['required', 'in:cash_in_hand,bank_account'], // 👈 new
            'opening_balance'  => ['nullable', 'numeric', 'min:0'],            // 👈 new
            'opening_date'     => ['nullable', 'date'],                         // 👈 new
        ]);

        $opening     = (float) ($validated['opening_balance'] ?? 0);
        $openingDate = $validated['opening_date'] ?? now()->toDateString();

        // Ensure a proper cash/bank ledger exists and get its id
        [$ledgerId, $ledger] = $this->ensureCashBankLedger(
            modeName:    $validated['mode_name'],
            modeKind:    $validated['mode_kind'],
            phone:       $validated['phone_number'] ?? null,
            opening:     $opening,
            openingDate: $openingDate
        );

        // Create the Received Mode linked to that ledger
        $ownerId = get_top_parent_id(auth()->user()) ?? auth()->id();

        ReceivedMode::create([
            'mode_name'    => $validated['mode_name'],
            'phone_number' => $validated['phone_number'] ?? null,
            'ledger_id'    => $ledgerId,
            'created_by'   => $ownerId,
        ]);

        return redirect()->route('received-modes.index')
            ->with('success', 'Received Mode created successfully.');
    }

    public function edit(ReceivedMode $receivedMode)
    {
        // Stays as-is if you allow editing; you can keep or drop the ledgers list.
        return inertia('received-modes/edit', [
            'receivedMode' => $receivedMode->load('ledger:id,account_ledger_name'),
        ]);
    }

    public function update(Request $request, ReceivedMode $receivedMode)
    {
        $validated = $request->validate([
            'mode_name'    => ['required', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            // If you also want to allow switching its ledger, add a path like below;
            // otherwise omit ledger edits to keep it simple.
        ]);

        $receivedMode->update($validated);

        return redirect()->route('received-modes.index')
            ->with('success', 'Received Mode updated successfully.');
    }

    public function destroy(ReceivedMode $receivedMode)
    {
        $receivedMode->delete();

        return redirect()->route('received-modes.index')
            ->with('success', 'Received Mode deleted successfully.');
    }

    /**
     * Ensure a cash/bank ledger exists for this mode (per tenant), optionally with opening balance.
     *
     * Rules:
     * - ledger_type = 'cash_bank'
     * - debit_credit = 'debit'
     * - status = 'active'
     * - group_under_id: 17 (Cash in Hand) | 18 (Bank Account)
     * - opening_balance = provided value
     * - closing_balance initialized to opening
     */
    private function ensureCashBankLedger(
        string $modeName,
        string $modeKind, // 'cash_in_hand' | 'bank_account'
        ?string $phone,
        float $opening,
        string $openingDate
    ): array {
        $ownerId      = get_top_parent_id(auth()->user()) ?? auth()->id();
        $name         = $modeName;                                   // keep names human
        $groupUnderId = $modeKind === 'bank_account' ? 18 : 17;

        // Deduplicate by (name, type, created_by)
        $existing = AccountLedger::query()
            ->where('account_ledger_name', $name)
            ->where('ledger_type', 'cash_bank')
            ->where('created_by', $ownerId)
            ->first();

        if ($existing) {
            $dirty = false;

            if (empty($existing->group_under_id)) {
                $existing->group_under_id = $groupUnderId;
                $dirty = true;
            }
            if ($phone && empty($existing->phone_number)) {
                $existing->phone_number = $phone;
                $dirty = true;
            }
            if ($dirty) $existing->save();

            // If an opening is provided (or changed), sync Opening journal
            if ($opening > 0 && (float)$existing->opening_balance !== $opening) {
                $existing->opening_balance = $opening;
                $existing->debit_credit    = 'debit';
                $existing->closing_balance = $opening;
                $existing->save();

                app(OpeningBalancePosting::class)->sync($existing, $openingDate);
            }

            return [$existing->id, $existing];
        }

        // Create fresh ledger
        $ledger = AccountLedger::create([
            'account_ledger_name' => $name,
            'ledger_type'         => 'cash_bank',
            'debit_credit'        => 'debit',
            'status'              => 'active',
            'opening_balance'     => $opening,
            'closing_balance'     => $opening, // cached
            'group_under_id'      => $groupUnderId, // 17 cash, 18 bank
            'account_group_id'    => null,
            'phone_number'        => $phone,
            'created_by'          => $ownerId,
        ]);

        if ($opening > 0) {
            app(OpeningBalancePosting::class)->sync($ledger, $openingDate);
        }

        return [$ledger->id, $ledger];
    }
}
