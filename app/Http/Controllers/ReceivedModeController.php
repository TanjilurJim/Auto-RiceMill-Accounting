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
        // Validate the incoming request
        $request->validate([
            'mode_name' => 'required|string|max:255',
            'amount_received' => 'nullable|numeric|min:0.01',  // Nullable (allow 0 or no amount)
            'amount_paid' => 'nullable|numeric|min:0', // Validate paid amount if needed
            'transaction_date' => 'required|date',  // Transaction date must be provided
            'phone_number' => 'nullable|string|max:20',
            'ledger_id' => 'required|exists:account_ledgers,id', // Ensure ledger exists
        ]);

        // Step 1: Create the Received Mode (transaction record)
        ReceivedMode::create([
            'mode_name' => $request->mode_name,
            'phone_number' => $request->phone_number,
            'amount_received' => $request->amount_received,  // Store the received amount (nullable)
            'amount_paid' => $request->amount_paid,  // Store the paid amount (nullable)
            'transaction_date' => $request->transaction_date,  // Store the actual transaction date
            'ledger_id' => $request->ledger_id,
            'created_by' => auth()->id(),  // Track the user who created the transaction
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
        // Validate the incoming request
        $request->validate([
            'mode_name' => 'required|string|max:255',
            'amount_received' => 'nullable|numeric|min:0.00',  // Update received amount
            'amount_paid' => 'nullable|numeric|min:0',  // Update paid amount
            'transaction_date' => 'required|date',  // Update transaction date
            'transaction_type' => 'required|in:received,paid', // Ensure it's either 'received' or 'paid'
            'phone_number' => 'nullable|string|max:20',
        ]);

        // Update the Received Mode with new details
        $receivedMode->update([
            'mode_name' => $request->mode_name,
            'phone_number' => $request->phone_number,
            'amount_received' => $request->amount_received,
            'amount_paid' => $request->amount_paid,
            'transaction_date' => $request->transaction_date,
            'transaction_type' => $request->transaction_type,
        ]);

        return redirect()->route('received-modes.index')->with('success', 'Received Mode updated successfully.');
    }

    // Remove the specified received mode from storage
    public function destroy(ReceivedMode $receivedMode)
    {
        $receivedMode->delete();

        return redirect()->route('received-modes.index')->with('success', 'Received Mode deleted successfully.');
    }
}
