<?php

namespace App\Http\Controllers;

use App\Models\AccountLedger;
use App\Models\AccountGroup;
use App\Models\GroupUnder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;


use function godown_scope_ids;

class AccountLedgerController extends Controller
{
    private const ALLOWED_TYPES = [
        'accounts_receivable',
        'accounts_payable',
        'cash_bank',
        'inventory',
        'sales_income',
        'other_income',
        'cogs',
        'operating_expense',
        'liability',
        'equity',
    ];

    public function index(Request $request)
    {
        $query = AccountLedger::with(['accountGroup', 'groupUnder', 'creator']);

        // scope (non-admin)
        if (!auth()->user()->hasRole('admin')) {
            $ids = godown_scope_ids();
            $query->whereIn('created_by', $ids);
        }

        // --- filter: by ledger type ---
        $type = $request->string('type')->toString();
        if ($type && in_array($type, self::ALLOWED_TYPES, true)) {
            $query->where('ledger_type', $type);
        }

        // --- search: name / reference / phone / group names ---
        $search = trim((string)$request->input('search', ''));
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('account_ledger_name', 'like', "%{$search}%")
                    ->orWhere('reference_number', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('accountGroup', fn($g) => $g->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('groupUnder', fn($g) => $g->where('name', 'like', "%{$search}%"));
            });
        }

        $accountLedgers = $query
            ->orderByDesc('id')
            ->paginate(10)
            ->appends([
                'search' => $search ?: null,
                'type'   => $type ?: null,
            ]);

        return Inertia::render('account-ledgers/index', [
            'accountLedgers' => $accountLedgers,
            // send current filters so UI stays in sync
            'filters' => [
                'search' => $search,
                'type'   => $type,
            ],
            // optional: provide list for dropdown
            'ledgerTypes' => array_values(self::ALLOWED_TYPES),
        ]);
    }


    public function create()
    {
        $referenceNumber = 'RL' . strtoupper(Str::random(10)); // Example: RLXXXXXXXXXX

        return Inertia::render('account-ledgers/create', [
            'groupUnders' => \App\Models\GroupUnder::all(),
            'accountGroups' => AccountGroup::with(['groupUnder', 'nature'])->get(),
            'isAdmin' => auth()->user()->hasRole('admin'), // Passing admin check to frontend
            'reference_number' => $referenceNumber, // Pass generated reference number
        ]);
    }


    public function store(Request $request)
    {
        return DB::transaction(function () use ($request) {

            // ✅ validation + guardrails
            $validated = $request->validate([
                'account_ledger_name' => ['required', 'string', 'max:255'],
                'ledger_type'         => ['required', Rule::in(self::ALLOWED_TYPES)],
                'debit_credit'        => ['required', Rule::in(['debit', 'credit'])],
                'opening_balance'     => ['nullable', 'numeric', 'min:0'],
                'closing_balance' => ['nullable', 'numeric', 'min:0'], 
                'account_group_input' => ['required', 'string'], // will be parsed below
                'mark_for_user'       => ['boolean'],
                'status'              => ['required', Rule::in(['active', 'inactive'])],
                'phone_number'        => ['nullable', 'string', 'max:255'],
                'email'               => ['nullable', 'email', 'max:255'],
                'address'             => ['nullable', 'string'],
                'reference_number'    => ['nullable', 'string', 'max:64'],
                'for_transition_mode' => ['boolean'],
            ]);

            // If marked as customer, force A/R + debit
            if ($request->boolean('mark_for_user')) {
                $validated['ledger_type']  = 'accounts_receivable';
                $validated['debit_credit'] = 'debit';
            }

            // Parse "group_under-<id>" or "account_group-<id>"
            $kind = null;
            $id = null;
            if (str_contains($request->input('account_group_input'), '-')) {
                [$kind, $id] = explode('-', $request->input('account_group_input'), 2);
            }
            if ($kind === 'group_under') {
                $validated['group_under_id']   = (int) $id;
                $validated['account_group_id'] = null;
            } elseif ($kind === 'account_group') {
                $validated['account_group_id'] = (int) $id;
                $validated['group_under_id']   = null;
            } else {
                // bad input shape
                abort(422, 'Invalid account group selection.');
            }
            unset($validated['account_group_input']); // not a column

            // Preserve admin-provided reference_number; model will autogen only if empty
            if ($request->filled('reference_number')) {
                $validated['reference_number'] = $request->string('reference_number');
            }

            // Create
            AccountLedger::create($validated + [
                'created_by' => auth()->id(),
                'tenant_id'  => optional(auth()->user())->tenant_id, // if you use multi-tenant
            ]);

            return redirect()
                ->route('account-ledgers.index')
                ->with('success', 'Account ledger created successfully.');
        });
    }

    public function edit(AccountLedger $accountLedger)
    {
        // if ($accountLedger->created_by !== auth()->id() && !auth()->user()->hasRole('admin')) {
        //     abort(403, 'Unauthorized action.');
        // }

        $user = auth()->user();
        if (!$user->hasRole('admin')) {
            $ids = godown_scope_ids();
            if (!in_array($accountLedger->created_by, $ids)) {
                abort(403, 'Unauthorized action.');
            }
        }

        return Inertia::render('account-ledgers/edit', [
            'ledger' => $accountLedger->load(['accountGroup', 'groupUnder', 'creator']),
            'accountGroups' => AccountGroup::with(['groupUnder', 'nature'])->get(),
            'groupUnders' => GroupUnder::all(),
            'isAdmin' => auth()->user()->hasRole('admin'),  // Pass the isAdmin flag
        ]);
    }

    public function update(Request $request, AccountLedger $accountLedger)
    {
        $validated = $request->validate([
            'account_ledger_name' => ['required', 'string', 'max:255'],
            'ledger_type'         => ['required', Rule::in(self::ALLOWED_TYPES)],
            'debit_credit'        => ['required', Rule::in(['debit', 'credit'])],
            'opening_balance'     => ['nullable', 'numeric', 'min:0'],
            'closing_balance' => ['nullable', 'numeric', 'min:0'], 
            'account_group_input' => ['required', 'string'],
            'mark_for_user'       => ['boolean'],
            'status'              => ['required', Rule::in(['active', 'inactive'])],
            'phone_number'        => ['required', 'string', 'max:255'],
            'email'               => ['nullable', 'email', 'max:255'],
            'address'             => ['nullable', 'string'],
            'reference_number'    => ['nullable', 'string', 'max:64'],
            'for_transition_mode' => ['boolean'],
        ]);

        if ($request->boolean('mark_for_user')) {
            $validated['ledger_type']  = 'accounts_receivable';
            $validated['debit_credit'] = 'debit';
        }

        [$kind, $id] = explode('-', $request->input('account_group_input'), 2);
        if ($kind === 'group_under') {
            $validated['group_under_id']   = (int) $id;
            $validated['account_group_id'] = null;
        } else {
            $validated['account_group_id'] = (int) $id;
            $validated['group_under_id']   = null;
        }
        unset($validated['account_group_input']);

        if ($request->filled('reference_number')) {
            $validated['reference_number'] = $request->string('reference_number');
        }

        $accountLedger->update($validated);

        return redirect()
            ->route('account-ledgers.index')
            ->with('success', 'Account ledger updated.');
    }





    // public function destroy(AccountLedger $accountLedger)
    // {
    //     if ($accountLedger->created_by !== auth()->id() && !auth()->user()->hasRole('admin')) {
    //         abort(403, 'Unauthorized action.');
    //     }

    //     $accountLedger->delete();

    //     return redirect()->route('account-ledgers.index')->with('success', 'Account Ledger deleted successfully.');
    // }

    public function destroy(AccountLedger $accountLedger)
    {
        $user = auth()->user();
        if (!$user->hasRole('admin')) {
            $ids = godown_scope_ids();
            if (!in_array($accountLedger->created_by, $ids)) {
                abort(403, 'Unauthorized action.');
            }
        }
        $accountLedger->delete();
        return redirect()->route('account-ledgers.index')->with('success', 'Account Ledger deleted successfully.');
    }



    public function storeFromModal(Request $request)
    {
        $request->validate([
            'account_ledger_name' => 'required|string|max:255',
            'account_group_id' => 'required|exists:account_groups,id',
            'ledger_type'         => 'nullable|string',
        ]);

        $ledger = \App\Models\AccountLedger::create([
            'account_ledger_name' => $request->account_ledger_name,
            'account_group_id' => $request->account_group_id,
            'phone_number' => $request->phone_number ?? '',
            'email' => $request->email ?? null,
            'opening_balance' => 0,
            'closing_balance' => 0,
            'debit_credit' => $request->debit_credit ?? 'debit',
            'status' => $request->status ?? 'active',
            'for_transition_mode' => $request->for_transition_mode ?? 0,
            'mark_for_user' => $request->mark_for_user ?? 0,
            'ledger_type'         => $request->ledger_type,
            'created_by' => auth()->id(),
        ]);


        return response()->json($ledger);
    }

    public function balance($id)
    {
        $ledger = AccountLedger::findOrFail($id);

        return response()->json([
            'balance' => $ledger->closing_balance ?? $ledger->opening_balance ?? 0,
            'closing_balance' => $ledger->closing_balance ?? $ledger->opening_balance ?? 0,
            'debit_credit' => $ledger->debit_credit ?? 'debit',
        ]);
    }
}
