<?php

namespace App\Http\Controllers;

use App\Models\AccountLedger;
use App\Models\AccountGroup;
use App\Models\GroupUnder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

use function godown_scope_ids;

class AccountLedgerController extends Controller
{
    public function index()
    {
        $query = AccountLedger::with(['accountGroup', 'groupUnder', 'creator']);

        // Only restrict by created_by if not admin
        // if (!auth()->user()->hasRole('admin')) {
        //     $query->where('created_by', auth()->id());
        // }

        if (!auth()->user()->hasRole('admin')) {
            $ids = godown_scope_ids();
            $query->whereIn('created_by', $ids);
        }

        $accountLedgers = $query->paginate(10);

        return Inertia::render('account-ledgers/index', [
            'accountLedgers' => $accountLedgers,
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
        $request->validate([
            'account_ledger_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'ledger_type' => 'nullable|string',
            'email' => 'nullable|email',
            'opening_balance' => 'required|numeric',
            'debit_credit' => 'required|in:debit,credit',
            'status' => 'required|in:active,inactive',
            'account_group_input' => 'required|string',
            'address' => 'nullable|string',
            'for_transition_mode' => 'nullable|boolean',
            'mark_for_user' => 'nullable|boolean',
            'reference_number' => 'nullable|string|unique:account_ledgers,reference_number'
        ]);

        // Separate the prefix
        $parts = explode('-', $request->account_group_input);
        $type = $parts[0]; // 'group_under' or 'account_group'
        $id = $parts[1];   // actual id

        $ledgerData = [
            'account_ledger_name' => $request->account_ledger_name,
            'phone_number' => $request->phone_number,
            'email' => $request->email,
            'opening_balance' => $request->opening_balance,
            'debit_credit' => $request->debit_credit,
            'status' => $request->status,
            'address' => $request->address,
            'for_transition_mode' => $request->boolean('for_transition_mode'),
            'mark_for_user'       => $request->boolean('mark_for_user'),
            'ledger_type' => $request->ledger_type,
            'created_by' => auth()->id(),
        ];

        if ($type === 'group_under') {
            $ledgerData['group_under_id'] = $id;
        } elseif ($type === 'account_group') {
            $ledgerData['account_group_id'] = $id;
        }

        AccountLedger::create($ledgerData);

        return redirect()->route('account-ledgers.index')->with('success', 'Account Ledger created successfully.');
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

        $user = auth()->user();

        // Multi-level access control: only admin or allowed users can update
        if (!$user->hasRole('admin')) {
            $ids = godown_scope_ids();
            if (!in_array($accountLedger->created_by, $ids)) {
                abort(403, 'Unauthorized action.');
            }
        }


        // Validate incoming data
        $request->validate([
            'account_ledger_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'email' => 'nullable|email',
            'ledger_type' => 'nullable|string',
            'opening_balance' => 'required|numeric',
            'debit_credit' => 'required|in:debit,credit',
            'status' => 'required|in:active,inactive',
            'account_group_input' => 'required|string',
            'address' => 'nullable|string',
            'for_transition_mode' => 'nullable|boolean',
            'mark_for_user' => 'nullable|boolean',
            'reference_number' => 'nullable|string', // Add validation for reference number if needed
        ]);

        // Update the ledger data
        $parts = explode('-', $request->account_group_input);
        $type = $parts[0];
        $id = $parts[1];

        $ledgerData = [
            'account_ledger_name' => $request->account_ledger_name,
            'phone_number' => $request->phone_number,
            'email' => $request->email,
            'opening_balance' => $request->opening_balance,
            'debit_credit' => $request->debit_credit,
            'status' => $request->status,
            'address' => $request->address,
            'ledger_type' => $request->ledger_type,
            'for_transition_mode' => $request->has('for_transition_mode'),
            'mark_for_user'       => $request->has('mark_for_user'),
            'reference_number' => $request->reference_number, // Ensure reference number is updated if changed
        ];

        // Reset both before updating
        $ledgerData['account_group_id'] = null;
        $ledgerData['group_under_id'] = null;

        if ($type === 'group_under') {
            $ledgerData['group_under_id'] = $id;
        } elseif ($type === 'account_group') {
            $ledgerData['account_group_id'] = $id;
        }

        // Update the Account Ledger
        $accountLedger->update($ledgerData);

        return redirect()->route('account-ledgers.index')->with('success', 'Account Ledger updated successfully.');
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