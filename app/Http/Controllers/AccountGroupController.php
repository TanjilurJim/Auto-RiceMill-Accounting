<?php

namespace App\Http\Controllers;

use App\Models\AccountGroup;
use App\Models\Nature;
use App\Models\GroupUnder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountGroupController extends Controller
{
    public function index()
    {
        $query = AccountGroup::with(['nature', 'groupUnder', 'creator']);

        if (!auth()->user()->hasRole('admin')) {
            $query->where('created_by', auth()->id());
        }

        $accountGroups = $query->get();

        return Inertia::render('account-groups/index', ['accountGroups' => $accountGroups]);
    }

    public function create()
    {
        return Inertia::render('account-groups/create', [
            'natureOptions' => Nature::all(),
            'groupOptions' => GroupUnder::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'nature_id' => 'required|exists:natures,id',
            'group_under_id' => 'nullable|exists:group_unders,id',
            'description' => 'nullable|string',
        ]);

        AccountGroup::create([
            'name' => $request->name,
            'nature_id' => $request->nature_id,
            'group_under_id' => $request->group_under_id,
            'description' => $request->description,
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('account-groups.index')->with('success', 'Account Group created successfully.');
    }

    public function edit(AccountGroup $accountGroup)
    {
        $this->authorizeAccess($accountGroup);

        return Inertia::render('account-groups/edit', [
            'accountGroup' => $accountGroup->load(['nature', 'groupUnder']),
            'natureOptions' => \App\Models\Nature::all(['id', 'name']),
            'groupOptions' => \App\Models\GroupUnder::all(['id', 'name']),
        ]);
    }

    public function update(Request $request, AccountGroup $accountGroup)
    {
        $this->authorizeAccess($accountGroup);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nature_id' => 'required|exists:natures,id',
            'group_under_id' => 'nullable|exists:group_unders,id',
            'description' => 'nullable|string',
        ]);

        $accountGroup->update($validated);

        return redirect()->route('account-groups.index')->with('success', 'Account Group updated successfully.');
    }

    public function destroy(AccountGroup $accountGroup)
    {
        $this->authorizeAccess($accountGroup);

        $accountGroup->delete();

        return redirect()->route('account-groups.index')->with('success', 'Account Group deleted successfully.');
    }

    private function authorizeAccess(AccountGroup $accountGroup)
    {
        if (!auth()->user()->hasRole('admin') && $accountGroup->created_by !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }
    }
}
