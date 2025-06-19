<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use function godown_scope_ids;

class UnitController extends Controller
{
    // App\Http\Controllers\UnitController.php

    // public function index(Request $request)
    // {
    //     $units = Unit::where('created_by', auth()->id())
    //         ->orderBy('id', 'desc')
    //         ->paginate(10); // You can change "10" to any number you want per page

    //     return Inertia::render('units/index', [
    //         'units' => $units,
    //     ]);
    // }

    public function index(Request $request)
    {
        $user = auth()->user();

        if ($user->hasRole('admin')) {
            $units = Unit::with('creator')->orderBy('id', 'desc')->paginate(10);
        } else {
            $ids = godown_scope_ids(); // Use the same helper for user scope
            $units = Unit::with('creator')
                ->whereIn('created_by', $ids)
                ->orderBy('id', 'desc')
                ->paginate(10);
        }

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

    // public function update(Request $request, Unit $unit)
    // {
    //     $request->validate([
    //         'name' => 'required|string|max:255',
    //     ]);

    //     $unit->update([
    //         'name' => $request->name,
    //     ]);

    //     return redirect()->back()->with('success', 'Unit updated successfully!');
    // }

    public function update(Request $request, Unit $unit)
    {
        $user = auth()->user();

        if (!$user->hasRole('admin')) {
            $ids = godown_scope_ids();
            if (!in_array($unit->created_by, $ids)) {
                abort(403, 'Unauthorized action.');
            }
        }

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $unit->update([
            'name' => $request->name,
        ]);

        return redirect()->back()->with('success', 'Unit updated successfully!');
    }

    // public function destroy(Unit $unit)
    // {
    //     $unit->delete();
    //     return redirect()->back()->with('success', 'Unit deleted successfully!');
    // }

    public function destroy(Unit $unit)
    {
        $user = auth()->user();

        if (!$user->hasRole('admin')) {
            $ids = godown_scope_ids();
            if (!in_array($unit->created_by, $ids)) {
                abort(403, 'Unauthorized action.');
            }
        }

        $unit->delete();
        return redirect()->back()->with('success', 'Unit deleted successfully!');
    }

}
