<?php

namespace App\Http\Controllers;

use App\Models\Godown;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GodownController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if ($user->hasRole('admin')) {
            // ✅ Admin sees all godowns with their creators
            $godowns = Godown::with('creator')->orderBy('id', 'desc')->paginate(10);
        } else {
            // ✅ Other users see only their own godowns
            $godowns = Godown::where('created_by', $user->id)->orderBy('id', 'desc')->paginate(10);
        }

        return Inertia::render('godowns/index', [
            'godowns' => $godowns ?? []  // ✅ Ensure godowns is always an array
        ]);
    }



    public function create()
    {
        return Inertia::render('godowns/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
        ]);

        $lastGodown = Godown::orderBy('id', 'desc')->first();
        $nextId = $lastGodown ? $lastGodown->id + 1 : 1;
        $godownCode = 'GD-' . rand(1, 999) . '-' . $nextId;

        Godown::create([
            'name' => $request->name,
            'godown_code' => $godownCode,
            'address' => $request->address,
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('godowns.index')->with('success', 'Godown created successfully.');
    }

    public function edit(Godown $godown)
    {
        if ($godown->created_by !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('godowns/edit', [
            'godown' => $godown,
        ]);
    }

    public function update(Request $request, Godown $godown)
    {
        if ($godown->created_by !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
        ]);

        $godown->update([
            'name' => $request->name,
            'address' => $request->address,
        ]);

        return redirect()->route('godowns.index')->with('success', 'Godown updated successfully.');
    }

    public function destroy(Godown $godown)
    {
        if ($godown->created_by !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $godown->delete();

        return redirect()->route('godowns.index')->with('success', 'Godown deleted successfully.');
    }
}
