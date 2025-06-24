<?php

namespace App\Http\Controllers;

use App\Models\AccountLedger;
use App\Models\ReceivedMode;
use Illuminate\Http\Request;
use function godown_scope_ids;

class ReceivedModeController extends Controller
{
    // Display a listing of the received modes
    // public function index()
    // {
    //     // Ensure you're paginating or fetching data properly
    //     $receivedModes = ReceivedMode::query()
    //         ->when(!auth()->user()->hasRole('admin'), function ($query) {
    //             $query->where('created_by', auth()->id());
    //         })
    //         ->with('ledger')
    //         ->paginate(10); // Use pagination for better performance
    //     return inertia('received-modes/index', [
    //         'receivedModes' => $receivedModes,
    //         'currentPage' => $receivedModes->currentPage(),
    //         'perPage' => $receivedModes->perPage(),
    //     ]);
    // }

    public function index()
    {
        $ids = godown_scope_ids();

        $receivedModes = ReceivedMode::query()
            ->when(!empty($ids), function ($query) use ($ids) {
                $query->whereIn('created_by', $ids);
            })
            ->with('ledger')
            ->paginate(10);

        return inertia('received-modes/index', [
            'receivedModes' => $receivedModes,
            'currentPage' => $receivedModes->currentPage(),
            'perPage' => $receivedModes->perPage(),
        ]);
    }

    // Show the form for creating a new received mode
    // public function create()
    // {
    //     $ledgers = AccountLedger::query()
    //         ->when(!auth()->user()->hasRole('admin'), function ($query) {
    //             $query->where('created_by', auth()->id());
    //         })
    //         ->select('id', 'account_ledger_name', 'reference_number')
    //         ->get();

    //     return inertia('received-modes/create', [
    //         'ledgers' => $ledgers,
    //     ]);
    // }

    public function create()
    {
        $ids = godown_scope_ids();

        $ledgers = AccountLedger::query()
            ->when(!empty($ids), function ($query) use ($ids) {
                $query->whereIn('created_by', $ids);
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
            'phone_number' => 'nullable|string|max:20',
            'ledger_id' => 'required|exists:account_ledgers,id',
        ]);

        ReceivedMode::create([
            'mode_name' => $request->mode_name,
            'phone_number' => $request->phone_number,
            'ledger_id' => $request->ledger_id,
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('received-modes.index')->with('success', 'Received Mode created successfully.');
    }

    // Show the form for editing the specified received mode
    // public function edit(ReceivedMode $receivedMode)
    // {
    //     $ledgers = \App\Models\AccountLedger::query()
    //         ->when(!auth()->user()->hasRole('admin'), function ($query) {
    //             $query->where('created_by', auth()->id());
    //         })
    //         ->select('id', 'account_ledger_name', 'reference_number')
    //         ->get();

    //     return inertia('received-modes/edit', [
    //         'receivedMode' => $receivedMode,
    //         'ledgers' => $ledgers,
    //     ]);
    // }

    public function edit(ReceivedMode $receivedMode)
    {
        $ids = godown_scope_ids();

        $ledgers = AccountLedger::query()
            ->when(!empty($ids), function ($query) use ($ids) {
                $query->whereIn('created_by', $ids);
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
            'phone_number' => 'nullable|string|max:20',
            'ledger_id' => 'required|exists:account_ledgers,id',
        ]);

        $receivedMode->update([
            'mode_name' => $request->mode_name,
            'phone_number' => $request->phone_number,
            'ledger_id' => $request->ledger_id,
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
