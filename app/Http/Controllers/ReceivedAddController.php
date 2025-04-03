<?php

namespace App\Http\Controllers;

use App\Models\ReceivedAdd;
use App\Models\ReceivedMode;
use App\Models\AccountLedger;
use App\Models\CompanySetting;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReceivedAddController extends Controller
{
    public function create()
    {
        return Inertia::render('received-add/create', [
            'receivedModes' => ReceivedMode::select('id', 'mode_name')->get(),
            'accountLedgers' => AccountLedger::select('id', 'account_ledger_name', 'phone_number', 'opening_balance', 'closing_balance')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'voucher_no' => 'required|string|unique:received_adds,voucher_no',
            'received_mode_id' => 'required|exists:received_modes,id',
            'account_ledger_id' => 'required|exists:account_ledgers,id',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
            'send_sms' => 'boolean',
        ]);

        // Create the received entry
        $received = ReceivedAdd::create($request->all());

        // Fetch the ledger and update its balance
        $ledger = AccountLedger::findOrFail($request->account_ledger_id);

        // Use closing_balance if it exists, otherwise fallback to opening_balance
        $currentBalance = $ledger->closing_balance ?? $ledger->opening_balance;

        // Subtract the received amount
        $newBalance = $currentBalance - $request->amount;

        $ledger->closing_balance = $newBalance;
        $ledger->save();

        return redirect()->route('received-add.index')->with('success', 'Received voucher saved successfully!');
    }


    public function index()
    {
        return Inertia::render('received-add/index', [
            'receivedAdds' => ReceivedAdd::with(['receivedMode', 'accountLedger'])
                ->orderByDesc('date')
                ->paginate(10),
        ]);
    }

    public function edit(ReceivedAdd $receivedAdd)
    {
        return Inertia::render('received-add/edit', [
            'receivedAdd' => $receivedAdd->load(['receivedMode', 'accountLedger']),
            'receivedModes' => ReceivedMode::select('id', 'mode_name')->get(),
            'accountLedgers' => AccountLedger::select('id', 'account_ledger_name', 'phone_number', 'opening_balance', 'closing_balance')->get(),
        ]);
    }

    public function update(Request $request, ReceivedAdd $receivedAdd)
    {
        $request->validate([
            'date' => 'required|date',
            'voucher_no' => 'required|string|unique:received_adds,voucher_no,' . $receivedAdd->id,
            'received_mode_id' => 'required|exists:received_modes,id',
            'account_ledger_id' => 'required|exists:account_ledgers,id',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
            'send_sms' => 'boolean',
        ]);

        $receivedAdd->update($request->all());

        return redirect()->route('received-add.index')->with('success', 'Received Add updated successfully!');
    }

    public function destroy(ReceivedAdd $receivedAdd)
    {
        $receivedAdd->delete();
        return redirect()->route('received-add.index')->with('success', 'Deleted successfully.');
    }
    public function print(ReceivedAdd $receivedAdd)
    {
        $receivedAdd->load(['receivedMode', 'accountLedger']);

        $company = CompanySetting::where('created_by', Auth::id())->first();

        return Inertia::render('received-add/print', [
            'receivedAdd' => $receivedAdd,
            'company' => $company,
        ]);
    }
}
