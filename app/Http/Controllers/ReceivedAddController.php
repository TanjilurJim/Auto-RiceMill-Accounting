<?php

namespace App\Http\Controllers;

use function company_info;
use function numberToWords;
use App\Models\ReceivedAdd;
use App\Models\ReceivedMode;
use App\Models\AccountLedger;
use App\Models\Journal;
use App\Models\JournalEntry;

use App\Models\CompanySetting;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReceivedAddController extends Controller
{
    public function create()
    {
        $query = ReceivedMode::query();
        $ledgerQuery = AccountLedger::query();

        // Only show own data if not admin
        if (!auth()->user()->hasRole('admin')) {
            $query->where('created_by', auth()->id());
            $ledgerQuery->where('created_by', auth()->id());
        }

        return Inertia::render('received-add/create', [
            'receivedModes' => $query->select('id', 'mode_name', 'ledger_id')->get(), // ✅ Add 'ledger_id'
            'accountLedgers' => $ledgerQuery
                ->select('id', 'account_ledger_name', 'phone_number', 'opening_balance', 'closing_balance')
                ->get(),
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

        // 💾 Create ReceivedAdd entry
        $received = ReceivedAdd::create([
            ...$request->only([
                'date',
                'voucher_no',
                'received_mode_id',
                'account_ledger_id',
                'amount',
                'description',
                'send_sms',
            ]),
            'created_by' => auth()->id(),
        ]);

        // 📤 Credit from payer (account ledger)
        $payerLedger = AccountLedger::findOrFail($request->account_ledger_id);
        $payerLedger->closing_balance = ($payerLedger->closing_balance ?? $payerLedger->opening_balance) - $request->amount;
        $payerLedger->save();

        // 📥 Debit into receiver (received_mode → ledger)
        $receivedMode = ReceivedMode::with('ledger')->findOrFail($request->received_mode_id);
        $receiverLedger = $receivedMode->ledger;
        $receiverLedger->closing_balance = ($receiverLedger->closing_balance ?? $receiverLedger->opening_balance) + $request->amount;
        $receiverLedger->save();

        // 📘 Journal entry
        $journal = Journal::create([
            'date' => $request->date,
            'voucher_no' => $request->voucher_no,
            'narration' => $request->description ?? 'Received from ' . $payerLedger->account_ledger_name,
            'created_by' => auth()->id(),
            'voucher_type' => 'Received',
        ]);

        JournalEntry::insert([
            [
                'journal_id' => $journal->id,
                'account_ledger_id' => $receiverLedger->id,
                'type' => 'debit',
                'amount' => $request->amount,
                'note' => 'Received via ' . $receivedMode->mode_name,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'journal_id' => $journal->id,
                'account_ledger_id' => $payerLedger->id,
                'type' => 'credit',
                'amount' => $request->amount,
                'note' => 'Received from ' . $payerLedger->account_ledger_name,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        return redirect()->route('received-add.index')->with('success', 'Received voucher saved and journal posted successfully!');
    }


    public function index()
    {
        $receivedAdds = ReceivedAdd::with(['receivedMode', 'accountLedger'])
            ->when(!auth()->user()->hasRole('admin'), function ($query) {
                $query->where('created_by', auth()->id());
            })
            ->orderByDesc('date')
            ->paginate(10);

        return Inertia::render('received-add/index', [
            'receivedAdds' => $receivedAdds,
            'currentPage' => $receivedAdds->currentPage(),
            'perPage' => $receivedAdds->perPage(),
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
        /* tenant safety */
        if (
            ! auth()->user()->hasRole('admin') &&
            $receivedAdd->created_by !== auth()->id()
        ) {
            abort(403, 'Unauthorised');
        }

        /* what the UI needs */
        $receivedAdd->load(['receivedMode', 'accountLedger']);

        return Inertia::render('received-add/print', [
            'receivedAdd'  => $receivedAdd,
            'company'      => company_info(),                       // ↞ helper adds logo URLs too
            'amountWords'  => numberToWords((int) $receivedAdd->amount),
        ]);
    }
}
