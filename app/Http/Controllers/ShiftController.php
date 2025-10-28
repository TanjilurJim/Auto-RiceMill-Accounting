<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ShiftController extends Controller
{


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
        $request->validate([
            'name'        => 'required|string|max:255',
            'start_time'  => ['required', 'date_format:H:i'],
            'end_time'    => [
                'required',
                'date_format:H:i',
                function ($attr, $value, $fail) use ($request) {
                    if (!$request->start_time) return;

                    $start = Carbon::createFromFormat('H:i', $request->start_time);
                    $end   = Carbon::createFromFormat('H:i', $value);

                    // must be different
                    if ($end->equalTo($start)) {
                        return $fail('End time must be different from start time.');
                    }

                    // Allow both cases:
                    // 1) same day: end > start
                    // 2) overnight: end <= start (treated as next day)
                    // => no fail needed here
                }
            ],
            'description' => 'nullable|string',
        ]);

        // (Optional) compute duration in minutes (handles overnight)
        $start = Carbon::createFromFormat('H:i', $request->start_time);
        $end   = Carbon::createFromFormat('H:i', $request->end_time);
        $normalizedEnd = $end->lessThanOrEqualTo($start) ? $end->copy()->addDay() : $end;
        $durationMinutes = $start->diffInMinutes($normalizedEnd);

        Shift::create([
            'name'        => $request->name,
            'start_time'  => $request->start_time, // store as TIME (HH:MM)
            'end_time'    => $request->end_time,   // store as TIME (HH:MM)
            'description' => $request->description,
            'created_by'  => auth()->id(),
            // 'duration_minutes' => $durationMinutes, // if you add this column later
        ]);

        return redirect()->route('shifts.index')->with('success', 'Shift created successfully.');
    }



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
            'name'        => 'required|string|max:255',
            'start_time'  => ['required', 'date_format:H:i'],
            'end_time'    => [
                'required',
                'date_format:H:i',
                function ($attr, $value, $fail) use ($request) {
                    if (!$request->start_time) return;
                    $start = Carbon::createFromFormat('H:i', $request->start_time);
                    $end   = Carbon::createFromFormat('H:i', $value);
                    if ($end->equalTo($start)) {
                        return $fail('End time must be different from start time.');
                    }
                }
            ],
            'description' => 'nullable|string',
        ]);

        $shift->update([
            'name'        => $request->name,
            'start_time'  => $request->start_time,
            'end_time'    => $request->end_time,
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
