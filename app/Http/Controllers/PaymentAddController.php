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
    public function index(Request $request)
    {
        $query = PaymentAdd::with(['paymentMode', 'accountLedger'])
            ->orderByDesc('date');

        // 🔐 Only show own data unless admin
        if (!auth()->user()->hasRole('admin')) {
            $query->where('created_by', auth()->id());
        }

        // 🔍 Apply filters
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('voucher_no', 'like', "%{$request->search}%")
                    ->orWhereHas('accountLedger', fn($q) =>
                    $q->where('account_ledger_name', 'like', "%{$request->search}%"));
            });
        }

        if ($request->filled('payment_mode_id')) {
            $query->where('payment_mode_id', $request->payment_mode_id);
        }

        if ($request->filled('from_date')) {
            $query->whereDate('date', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('date', '<=', $request->to_date);
        }

        $paymentAdds = $query->paginate(10)->withQueryString()->through(fn($payment) => [
            'id' => $payment->id,
            'date' => $payment->date,
            'voucher_no' => $payment->voucher_no,
            'amount' => $payment->amount,
            'description' => $payment->description,
            'paymentMode' => $payment->paymentMode,
            'accountLedger' => $payment->accountLedger,
        ]);

        return Inertia::render('payment-add/index', [
            'paymentAdds' => $paymentAdds,
            'filters' => $request->only(['search', 'payment_mode_id', 'from_date', 'to_date']),
            'paymentModes' => ReceivedMode::select('id', 'mode_name')
                ->when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))
                ->get(),
        ]);
    }





    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('payment-add/create', [
            'paymentModes' => ReceivedMode::select('id', 'mode_name', 'opening_balance', 'closing_balance')
                ->when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))
                ->get(),
            'accountLedgers' => AccountLedger::when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))->get(),
        ]);
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'voucher_no' => 'required|string',
            'description' => 'nullable|string',
            'send_sms' => 'boolean',
            'rows' => 'required|array|min:1',
            'rows.*.payment_mode_id' => 'required|exists:received_modes,id',
            'rows.*.account_ledger_id' => 'required|exists:account_ledgers,id',
            'rows.*.amount' => 'required|numeric|min:0.01',
        ]);

        // ✅ Manual check for duplicate voucher numbers
        if (PaymentAdd::where('voucher_no', $request->voucher_no)->exists()) {
            return redirect()->back()->withErrors([
                'voucher_no' => 'This voucher number already exists. Please try again with a different one.'
            ])->withInput();
        }

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
    public function edit($id)
    {
        $payment = PaymentAdd::where('id', $id)
            ->when(
                !auth()->user()->hasRole('admin'),
                fn($q) =>
                $q->where('created_by', auth()->id())
            )
            ->firstOrFail();

        return Inertia::render('payment-add/edit', [
            'payment' => $payment,
            'paymentModes' => ReceivedMode::select('id', 'mode_name', 'opening_balance', 'closing_balance')->get(),
            'accountLedgers' => AccountLedger::select('id', 'account_ledger_name', 'reference_number', 'phone_number', 'opening_balance', 'closing_balance')->get(),
        ]);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'date' => 'required|date',
            'voucher_no' => 'required|string',
            'description' => 'nullable|string',
            'send_sms' => 'boolean',
            'rows' => 'required|array|min:1',
            'rows.*.payment_mode_id' => 'required|exists:received_modes,id',
            'rows.*.account_ledger_id' => 'required|exists:account_ledgers,id',
            'rows.*.amount' => 'required|numeric|min:0.01',
        ]);

        $existing = PaymentAdd::where('voucher_no', $request->voucher_no)
            ->when(
                !auth()->user()->hasRole('admin'),
                fn($q) =>
                $q->where('created_by', auth()->id())
            )
            ->get();

        if ($existing->isEmpty()) {
            return redirect()->back()->withErrors(['msg' => 'Payment not found or unauthorized.']);
        }

        foreach ($existing as $old) {
            $ledger = $old->accountLedger;
            $ledger->closing_balance -= $old->amount;
            $ledger->save();
        }

        PaymentAdd::where('voucher_no', $request->voucher_no)
            ->when(
                !auth()->user()->hasRole('admin'),
                fn($q) =>
                $q->where('created_by', auth()->id())
            )
            ->delete();

        foreach ($request->rows as $row) {
            PaymentAdd::create([
                'date' => $request->date,
                'voucher_no' => $request->voucher_no,
                'payment_mode_id' => $row['payment_mode_id'],
                'account_ledger_id' => $row['account_ledger_id'],
                'amount' => $row['amount'],
                'description' => $request->description,
                'send_sms' => $request->send_sms,
                'created_by' => auth()->id(),
            ]);

            $ledger = AccountLedger::findOrFail($row['account_ledger_id']);
            $currentBalance = $ledger->closing_balance ?? $ledger->opening_balance;
            $ledger->closing_balance = $currentBalance + $row['amount'];
            $ledger->save();
        }

        return redirect()->route('payment-add.index')->with('success', 'Payment updated successfully!');
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
    public function print($voucherNo)
    {
        $payments = PaymentAdd::with(['paymentMode', 'accountLedger'])
            ->where('voucher_no', $voucherNo)
            ->when(
                !auth()->user()->hasRole('admin'),
                fn($q) =>
                $q->where('created_by', auth()->id())
            )
            ->get();

        if ($payments->isEmpty()) {
            abort(404);
        }

        $company = \App\Models\CompanySetting::where('created_by', auth()->id())->first();
        $totalAmount = $payments->sum('amount');
        $accountLedger = $payments->first()->accountLedger;
        $previousBalance = ($accountLedger->closing_balance ?? $accountLedger->opening_balance) - $totalAmount;
        $closingBalance = $accountLedger->closing_balance;

        return Inertia::render('payment-add/print', [
            'company' => $company,
            'payments' => $payments,
            'voucher_no' => $voucherNo,
            'date' => $payments->first()->date,
            'payment_mode' => $payments->first()->paymentMode->mode_name ?? '',
            'description' => $payments->first()->description,
            'total_amount' => $totalAmount,
            'amount_in_words' => numberToWords($totalAmount),
            'previous_balance' => $previousBalance,
            'closing_balance' => $closingBalance,
        ]);
    }
}
