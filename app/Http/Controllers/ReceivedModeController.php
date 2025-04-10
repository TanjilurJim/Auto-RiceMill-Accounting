<?php

namespace App\Http\Controllers;

use App\Models\AccountLedger;
use App\Models\ReceivedMode;
use Illuminate\Http\Request;

class ReceivedModeController extends Controller
{
    // Display a listing of the received modes
    public function index()
    {
        // Ensure you're paginating or fetching data properly
        $receivedModes = ReceivedMode::query()
            ->when(!auth()->user()->hasRole('admin'), function ($query) {
                $query->where('created_by', auth()->id());
            })
            ->with('ledger')
            ->paginate(10); // Use pagination for better performance
        return inertia('received-modes/index', [
            'receivedModes' => $receivedModes,
            'currentPage' => $receivedModes->currentPage(),
            'perPage' => $receivedModes->perPage(),
        ]);
    }

    // Show the form for creating a new received mode
    public function create()
    {
        $ledgers = \App\Models\AccountLedger::query()
            ->when(!auth()->user()->hasRole('admin'), function ($query) {
                $query->where('created_by', auth()->id());
            })
            ->select('id', 'account_ledger_name', 'reference_number')
            ->get();

        return inertia('received-modes/create', [
            'ledgers' => $ledgers,
        ]);
    }

    // Store a newly created received mode in storage
    public function store(Request $request)
    {
        $request->validate([
            'mode_name' => 'required|string|max:255',
            'opening_balance' => 'nullable|numeric',
            'closing_balance' => 'nullable|numeric',
            'phone_number' => 'nullable|string|max:20',
            'ledger_id' => 'required|exists:account_ledgers,id', // ✅ new validation
        ]);

        ReceivedMode::create([
            'mode_name' => $request->mode_name,
            'phone_number' => $request->phone_number,
            'opening_balance' => $request->opening_balance,
            'closing_balance' => $request->closing_balance,
            'ledger_id' => $request->ledger_id,
            'created_by' => auth()->id(), // ✅ Add this line
        ]);

        return redirect()->route('received-modes.index')->with('success', 'Received Mode created successfully.');
    }

    // Show the form for editing the specified received mode
    public function edit(ReceivedMode $receivedMode)
    {
        $ledgers = \App\Models\AccountLedger::query()
            ->when(!auth()->user()->hasRole('admin'), function ($query) {
                $query->where('created_by', auth()->id());
            })
            ->select('id', 'account_ledger_name', 'reference_number')
            ->get();

        return inertia('received-modes/edit', [
            'receivedMode' => $receivedMode,
            'ledgers' => $ledgers,
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
