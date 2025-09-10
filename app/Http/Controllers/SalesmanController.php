<?php

namespace App\Http\Controllers;

use App\Models\Salesman;
use Illuminate\Http\Request;
use Inertia\Inertia;
use function godown_scope_ids;
use Illuminate\Support\Facades\DB;
class SalesManController extends Controller
{
    public function index()
    {
        // $salesmen = SalesMan::with('creator')
        //     ->where('created_by', auth()->id())
        //     ->get();

        $user = auth()->user();

        if ($user->hasRole('admin')) {
            $salesmen = SalesMan::with('creator')->orderBy('id', 'desc')->get();
        } else {
            $ids = godown_scope_ids();
            $salesmen = SalesMan::with('creator')
                ->whereIn('created_by', $ids)
                ->orderBy('id', 'desc')
                ->get();
        }

        return Inertia::render('salesmen/index', [
            'salesmen' => $salesmen,
        ]);
    }



    public function create()
    {
        return Inertia::render('salesmen/create');
    }

    public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'phone_number' => 'required|string|max:20',
        'email' => 'nullable|email',
        'address' => 'nullable|string',
    ]);

    DB::transaction(function () use ($request) {
        // 1) Insert without code (code is nullable)
        $salesman = SalesMan::create([
            'name'         => $request->name,
            'phone_number' => $request->phone_number,
            'email'        => $request->email,
            'address'      => $request->address,
            'salesman_code'=> null,           // <-- insert first
            'created_by'   => auth()->id(),
        ]);

        // 2) Now compute a guaranteed-unique code from the ID and update
        $salesman->update([
            'salesman_code' => sprintf('SM-%04d', $salesman->id),
        ]);
    });

    return redirect()->route('salesmen.index')->with('success', 'Salesman created successfully.');
}


    public function edit(SalesMan $salesman)
    {
        // if ($salesman->created_by !== auth()->id()) {
        //     abort(403, 'Unauthorized action.');
        // }

        $user = auth()->user();

        if (!$user->hasRole('admin')) {
            $ids = godown_scope_ids();
            if (!in_array($salesman->created_by, $ids)) {
                abort(403, 'Unauthorized action.');
            }
        }

        return Inertia::render('salesmen/edit', [
            'salesman' => $salesman,
        ]);
    }

    public function update(Request $request, SalesMan $salesman)
    {
        // if ($salesman->created_by !== auth()->id()) {
        //     abort(403, 'Unauthorized action.');
        // }

        $user = auth()->user();

        if (!$user->hasRole('admin')) {
            $ids = godown_scope_ids();
            if (!in_array($salesman->created_by, $ids)) {
                abort(403, 'Unauthorized action.');
            }
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
        ]);

        $salesman->update([
            'name' => $request->name,
            'phone_number' => $request->phone_number,
            'email' => $request->email,
            'address' => $request->address,
        ]);

        return redirect()->route('salesmen.index')->with('success', 'Salesman updated successfully.');
    }

    public function destroy(SalesMan $salesman)
    {
        // if ($salesman->created_by !== auth()->id()) {
        //     abort(403, 'Unauthorized action.');
        // }

        $user = auth()->user();

        if (!$user->hasRole('admin')) {
            $ids = godown_scope_ids();
            if (!in_array($salesman->created_by, $ids)) {
                abort(403, 'Unauthorized action.');
            }
        }

        $salesman->delete();

        return redirect()->route('salesmen.index')->with('success', 'Salesman deleted successfully.');
    }
}
