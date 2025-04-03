<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UnitController extends Controller
{
    // App\Http\Controllers\UnitController.php

    public function index(Request $request)
    {
        $units = Unit::query()
            ->orderBy('id', 'desc')
            ->paginate(10); // You can change "10" to any number you want per page

        return Inertia::render('units/index', [
            'units' => $units,
        ]);
    }


    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Unit::create([
            'name' => $request->name,
            'created_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Unit added successfully!');
    }

    public function update(Request $request, Unit $unit)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $unit->update([
            'name' => $request->name,
        ]);

        return redirect()->back()->with('success', 'Unit updated successfully!');
    }

    public function destroy(Unit $unit)
    {
        $unit->delete();
        return redirect()->back()->with('success', 'Unit deleted successfully!');
    }
}
