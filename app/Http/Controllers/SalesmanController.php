<?php

namespace App\Http\Controllers;

use App\Models\SalesMan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesManController extends Controller
{
    public function index()
    {
        $salesmen = SalesMan::with('creator')
            ->where('created_by', auth()->id())
            ->get();

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

        // Generate unique salesman code like SM-0001, SM-0002
        $lastSalesman = SalesMan::orderBy('id', 'desc')->first();
        $nextId = $lastSalesman ? $lastSalesman->id + 1 : 1;
        $salesmanCode = 'SM-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);

        SalesMan::create([
            'name' => $request->name,
            'phone_number' => $request->phone_number,
            'email' => $request->email,
            'address' => $request->address,
            'salesman_code' => $salesmanCode, // ✅ fixing the error here
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('salesmen.index')->with('success', 'Salesman created successfully.');
    }


    public function edit(SalesMan $salesman)
    {
        if ($salesman->created_by !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('salesmen/edit', [
            'salesman' => $salesman,
        ]);
    }

    public function update(Request $request, SalesMan $salesman)
    {
        if ($salesman->created_by !== auth()->id()) {
            abort(403, 'Unauthorized action.');
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
        if ($salesman->created_by !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $salesman->delete();

        return redirect()->route('salesmen.index')->with('success', 'Salesman deleted successfully.');
    }
}
