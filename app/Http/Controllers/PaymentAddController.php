<?php

namespace App\Http\Controllers;

use App\Models\PaymentAdd;
use App\Models\ReceivedMode;
use App\Models\AccountLedger;


use Inertia\Inertia;
use Illuminate\Http\Request;

class PaymentAddController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('payment-add/index', [
            'paymentAdds' => PaymentAdd::with(['paymentMode', 'accountLedger'])
                ->orderByDesc('date')
                ->paginate(10),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('payment-add/create', [
            'paymentModes' => ReceivedMode::select('id', 'mode_name', 'opening_balance', 'closing_balance')->get(),
            'accountLedgers' => AccountLedger::select('id', 'account_ledger_name', 'reference_number', 'phone_number', 'opening_balance', 'closing_balance')->get(),
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'voucher_no' => 'required|string|unique:payment_adds,voucher_no',
            'description' => 'nullable|string',
            'send_sms' => 'boolean',
            'rows' => 'required|array|min:1',
            'rows.*.payment_mode_id' => 'required|exists:received_modes,id',
            'rows.*.account_ledger_id' => 'required|exists:account_ledgers,id',
            'rows.*.amount' => 'required|numeric|min:0.01',
        ]);

        foreach ($request->rows as $row) {
            $payment = PaymentAdd::create([
                'date' => $request->date,
                'voucher_no' => $request->voucher_no,
                'payment_mode_id' => $row['payment_mode_id'],
                'account_ledger_id' => $row['account_ledger_id'],
                'amount' => $row['amount'],
                'description' => $request->description,
                'send_sms' => $request->send_sms,
                'created_by' => auth()->id(),
            ]);

            // Update the closing balance of the account ledger
            $ledger = \App\Models\AccountLedger::findOrFail($row['account_ledger_id']);
            $currentBalance = $ledger->closing_balance ?? $ledger->opening_balance;
            $ledger->closing_balance = $currentBalance + $row['amount'];
            $ledger->save();
        }

        return redirect()->route('payment-add.index')->with('success', 'Payments added successfully!');
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
