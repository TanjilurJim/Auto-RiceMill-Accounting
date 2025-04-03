<?php

namespace App\Http\Controllers;

use App\Models\ReceivedMode;
use Illuminate\Http\Request;

class ReceivedModeController extends Controller
{
    // Display a listing of the received modes
    public function index()
    {
        // Ensure you're paginating or fetching data properly
        $receivedModes = ReceivedMode::paginate(10);  // Use pagination for better performance
        return inertia('received-modes/index', [
            'receivedModes' => $receivedModes,
        ]);
    }

    // Show the form for creating a new received mode
    public function create()
    {
        return inertia('received-modes/create');
    }

    // Store a newly created received mode in storage
    public function store(Request $request)
    {
        $request->validate([
            'mode_name' => 'required|string|max:255',
            'opening_balance' => 'nullable|numeric',
            'closing_balance' => 'nullable|numeric',
            'phone_number' => 'nullable|string|max:20',
        ]);

        ReceivedMode::create($request->all());

        return redirect()->route('received-modes.index')->with('success', 'Received Mode created successfully.');
    }

    // Show the form for editing the specified received mode
    public function edit(ReceivedMode $receivedMode)
    {
        return inertia('received-modes/edit', [
            'receivedMode' => $receivedMode,
        ]);
    }

    // Update the specified received mode in storage
    public function update(Request $request, ReceivedMode $receivedMode)
    {
        $request->validate([
            'mode_name' => 'required|string|max:255',
            'opening_balance' => 'nullable|numeric',
            'closing_balance' => 'nullable|numeric',
            'phone_number' => 'nullable|string|max:20',
        ]);

        $receivedMode->update($request->all());

        return redirect()->route('received-modes.index')->with('success', 'Received Mode updated successfully.');
    }

    // Remove the specified received mode from storage
    public function destroy(ReceivedMode $receivedMode)
    {
        $receivedMode->delete();

        return redirect()->route('received-modes.index')->with('success', 'Received Mode deleted successfully.');
    }
}
