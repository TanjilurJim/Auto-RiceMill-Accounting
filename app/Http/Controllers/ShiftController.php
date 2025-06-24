<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShiftController extends Controller
{
    // public function index()
    // {
    //     // Fetch all shifts with their creator
    //     $shifts = Shift::with('creator')
    //         ->when(!auth()->user()->hasRole('admin'), function ($query) {
    //             $query->where('created_by', auth()->id());
    //         })
    //         ->get();

    //     // Return the index view with data
    //     return Inertia::render('shifts/index', [
    //         'shifts' => $shifts
    //     ]);
    // }

    public function index()
    {
        $ids = godown_scope_ids();

        $shifts = Shift::with('creator')
            ->when($ids !== null && !empty($ids), function ($query) use ($ids) {
                $query->whereIn('created_by', $ids);
            })
            ->get();

        return Inertia::render('shifts/index', [
            'shifts' => $shifts
        ]);
    }

    public function create()
    {
        // Return the create Inertia view
        return Inertia::render('shifts/create');
    }

    public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'name' => 'required|string|max:255',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'description' => 'nullable|string',
        ]);

        // Create the new shift
        Shift::create([
            'name' => $request->name,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'description' => $request->description,
            'created_by' => auth()->id(),
        ]);

        // Redirect with success message
        return redirect()->route('shifts.index')->with('success', 'Shift created successfully.');
    }

    // public function edit(Shift $shift)
    // {
    //     // Return the edit view for the given shift
    //     return Inertia::render('shifts/edit', [
    //         'shift' => $shift
    //     ]);
    // }

    public function edit(Shift $shift)
    {
        $ids = godown_scope_ids();
        if ($ids !== null && !empty($ids) && !in_array($shift->created_by, $ids)) {
            abort(403);
        }

        return Inertia::render('shifts/edit', [
            'shift' => $shift
        ]);
    }

    // public function update(Request $request, Shift $shift)
    // {
    //     // Validate the request
    //     $request->validate([
    //         'name' => 'required|string|max:255',
    //         'start_time' => 'required|date_format:H:i',
    //         'end_time' => 'required|date_format:H:i|after:start_time',
    //         'description' => 'nullable|string',
    //     ]);

    //     // Update the shift
    //     $shift->update([
    //         'name' => $request->name,
    //         'start_time' => $request->start_time,
    //         'end_time' => $request->end_time,
    //         'description' => $request->description,
    //     ]);

    //     // Redirect with success message
    //     return redirect()->route('shifts.index')->with('success', 'Shift updated successfully.');
    // }

    public function update(Request $request, Shift $shift)
    {
        $ids = godown_scope_ids();
        if ($ids !== null && !empty($ids) && !in_array($shift->created_by, $ids)) {
            abort(403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'description' => 'nullable|string',
        ]);

        $shift->update([
            'name' => $request->name,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'description' => $request->description,
        ]);

        return redirect()->route('shifts.index')->with('success', 'Shift updated successfully.');
    }

    // public function destroy(Shift $shift)
    // {
    //     // Delete the shift
    //     $shift->delete();

    //     // Redirect with success message
    //     return redirect()->route('shifts.index')->with('success', 'Shift deleted successfully.');
    // }

    public function destroy(Shift $shift)
    {
        $ids = godown_scope_ids();
        if ($ids !== null && !empty($ids) && !in_array($shift->created_by, $ids)) {
            abort(403);
        }

        $shift->delete();

        return redirect()->route('shifts.index')->with('success', 'Shift deleted successfully.');
    }

}
