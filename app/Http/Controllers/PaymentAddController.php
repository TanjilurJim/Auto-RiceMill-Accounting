<?php

namespace App\Http\Controllers;

use App\Models\PaymentAdd;
use App\Models\ReceivedMode;
use App\Models\AccountLedger;
use App\Models\Journal;
use App\Models\JournalEntry;
// use App\Models\ReceivedMode;



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
            'paymentModes' => ReceivedMode::with(['ledger:id,account_ledger_name,closing_balance'])
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

            // 🔁 Update account ledger balance
            $ledger = \App\Models\AccountLedger::findOrFail($row['account_ledger_id']);
            $ledger->closing_balance = ($ledger->closing_balance ?? $ledger->opening_balance) + $row['amount'];
            $ledger->save();

            // 🔁 Get received mode's ledger (cash/bank)
            $receivedMode = \App\Models\ReceivedMode::findOrFail($row['payment_mode_id']);

            // 🧾 Create journal
            $journal = \App\Models\Journal::create([
                'date' => $request->date,
                'voucher_no' => $request->voucher_no,
                'narration' => $request->description ?? 'Payment to ' . $ledger->account_ledger_name,
                'created_by' => auth()->id(),
                'voucher_type' => 'Payment',
            ]);

            \App\Models\JournalEntry::insert([
                [
                    'journal_id' => $journal->id,
                    'account_ledger_id' => $row['account_ledger_id'],
                    'type' => 'debit',
                    'amount' => $row['amount'],
                    'note' => 'Payment to ' . $ledger->account_ledger_name,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'journal_id' => $journal->id,
                    'account_ledger_id' => $receivedMode->ledger_id,
                    'type' => 'credit',
                    'amount' => $row['amount'],
                    'note' => 'Paid via ' . $receivedMode->mode_name,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
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
        $payment = PaymentAdd::with(['paymentMode.ledger', 'accountLedger'])
            ->where('id', $id)
            ->when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))
            ->firstOrFail();

        $voucherNo = $payment->voucher_no;

        $paymentRows = PaymentAdd::with(['paymentMode.ledger', 'accountLedger'])
            ->where('voucher_no', $voucherNo)
            ->get();

        return Inertia::render('payment-add/edit', [
            'paymentRows' => $paymentRows,
            'voucher_no' => $voucherNo,
            'date' => $payment->date,
            'description' => $payment->description,
            'send_sms' => $payment->send_sms,
            'paymentModes' => ReceivedMode::with(['ledger:id,account_ledger_name,closing_balance'])
                ->when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))
                ->get(),
            'accountLedgers' => AccountLedger::select('id', 'account_ledger_name', 'reference_number', 'phone_number', 'opening_balance', 'closing_balance')
                ->when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))
                ->get(),
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

        $voucherNo = $request->voucher_no;

        // 1️⃣ Reverse old payments + ledgers
        $oldPayments = PaymentAdd::where('voucher_no', $voucherNo)
            ->when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))
            ->get();

        foreach ($oldPayments as $old) {
            $ledger = $old->accountLedger;
            $ledger->closing_balance -= $old->amount;
            $ledger->save();
        }

        // 2️⃣ Delete old journals
        Journal::where('voucher_no', $voucherNo)->delete();

        // 3️⃣ Delete old payments
        PaymentAdd::where('voucher_no', $voucherNo)
            ->when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))
            ->delete();

        // 4️⃣ Recreate payments + ledger updates + journal
        $journal = Journal::create([
            'date' => $request->date,
            'voucher_no' => $voucherNo,
            'narration' => $request->description ?? 'Updated Payment',
            'created_by' => auth()->id(),
        ]);

        foreach ($request->rows as $row) {
            $payment = PaymentAdd::create([
                'date' => $request->date,
                'voucher_no' => $voucherNo,
                'payment_mode_id' => $row['payment_mode_id'],
                'account_ledger_id' => $row['account_ledger_id'],
                'amount' => $row['amount'],
                'description' => $request->description,
                'send_sms' => $request->send_sms,
                'created_by' => auth()->id(),
            ]);

            $ledger = AccountLedger::findOrFail($row['account_ledger_id']);
            $ledger->closing_balance = ($ledger->closing_balance ?? $ledger->opening_balance) + $row['amount'];
            $ledger->save();

            $receivedMode = ReceivedMode::findOrFail($row['payment_mode_id']);

            JournalEntry::insert([
                [
                    'journal_id' => $journal->id,
                    'account_ledger_id' => $row['account_ledger_id'],
                    'type' => 'debit',
                    'amount' => $row['amount'],
                    'note' => 'Payment to ' . $ledger->account_ledger_name,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'journal_id' => $journal->id,
                    'account_ledger_id' => $receivedMode->ledger_id,
                    'type' => 'credit',
                    'amount' => $row['amount'],
                    'note' => 'Paid via ' . $receivedMode->mode_name,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
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
