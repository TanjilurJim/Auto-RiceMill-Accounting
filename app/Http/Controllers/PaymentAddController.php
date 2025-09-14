<?php

namespace App\Http\Controllers;

use App\Models\PaymentAdd;
use App\Models\ReceivedMode;
use App\Models\AccountLedger;
use App\Models\Journal;
use App\Models\JournalEntry;
// use App\Models\ReceivedMode;
use App\Models\Purchase;
use function godown_scope_ids;



use Inertia\Inertia;
use Illuminate\Http\Request;

class PaymentAddController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // $query = PaymentAdd::with(['paymentMode', 'accountLedger'])
        //     ->orderByDesc('date');

        $ids = godown_scope_ids();

        $query = PaymentAdd::with(['paymentMode', 'accountLedger'])
            ->orderByDesc('date')
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids));


      

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

    public function supplierDues($ledgerId)
    {
        // multi-level access guard (mirror your other pages)
        $ids = godown_scope_ids();

        // Pull purchases for this supplier that the current user can see
        $q = \App\Models\Purchase::query()
            ->where('account_ledger_id', $ledgerId)
            ->where('status', \App\Models\Purchase::STATUS_APPROVED)
            ->withSum('payments as extra_paid', 'amount');

        if ($ids !== null && !empty($ids)) {
            $q->whereIn('created_by', $ids);
        }

        $purchases = $q->get()->map(function ($p) {
            $initial = (float) ($p->amount_paid ?? 0);
            $extra   = (float) ($p->extra_paid ?? 0);
            $remaining = max(0, (float) $p->grand_total - ($initial + $extra));

            return [
                'id'           => $p->id,
                'voucher_no'   => $p->voucher_no,
                'date'         => optional($p->date)->toDateString(),
                'grand_total'  => (float) $p->grand_total,
                'initial_paid' => $initial,
                'extra_paid'   => $extra,
                'remaining'    => $remaining,
            ];
        })->filter(fn($row) => $row['remaining'] > 0)->values();

        $total_due = round($purchases->sum('remaining'), 2);

        return response()->json([
            'total_due' => $total_due,
            'open_purchases' => $purchases->take(10), // keep it light; show top 10
        ]);
    }






 

    public function create()
    {
        $ids = godown_scope_ids();

        return Inertia::render('payment-add/create', [
            'paymentModes' => ReceivedMode::with(['ledger:id,account_ledger_name,closing_balance'])
                ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
                ->get(),
            'accountLedgers' => AccountLedger::when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))->get(),
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

   

    public function edit($id)
    {
        $ids = godown_scope_ids();

        $payment = PaymentAdd::with(['paymentMode.ledger', 'accountLedger'])
            ->where('id', $id)
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->firstOrFail();

        $voucherNo = $payment->voucher_no;

        $paymentRows = PaymentAdd::with(['paymentMode.ledger', 'accountLedger'])
            ->where('voucher_no', $voucherNo)
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->get();

        return Inertia::render('payment-add/edit', [
            'paymentRows' => $paymentRows,
            'voucher_no' => $voucherNo,
            'date' => $payment->date,
            'description' => $payment->description,
            'send_sms' => $payment->send_sms,
            'paymentModes' => ReceivedMode::with(['ledger:id,account_ledger_name,closing_balance'])
                ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
                ->get(),
            'accountLedgers' => AccountLedger::select('id', 'account_ledger_name', 'reference_number', 'phone_number', 'opening_balance', 'closing_balance')
                ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
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




  

    public function destroy(string $id)
    {
        $ids = godown_scope_ids();

        // Find the payment and get the voucher_no
        $payment = PaymentAdd::where('id', $id)
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->firstOrFail();

        $voucherNo = $payment->voucher_no;

        // Get all payments for this voucher
        $payments = PaymentAdd::where('voucher_no', $voucherNo)
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->get();

        // Reverse ledger balances
        foreach ($payments as $p) {
            $ledger = $p->accountLedger;
            if ($ledger) {
                $ledger->closing_balance -= $p->amount;
                $ledger->save();
            }
        }

        // Delete related journals
        Journal::where('voucher_no', $voucherNo)->delete();

        // Delete payments
        PaymentAdd::where('voucher_no', $voucherNo)
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->delete();

        return redirect()->route('payment-add.index')->with('success', 'Payment deleted successfully!');
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

    public function createForPurchase(Purchase $purchase)
    {
        // remaining due = grand_total - sum(existing payments) - initial amount_paid on the purchase
        $alreadyPaid = (float) $purchase->amount_paid;
        $extraPayments = PaymentAdd::where('purchase_id', $purchase->id)->sum('amount');
        $remaining = max(0, $purchase->grand_total - $alreadyPaid - $extraPayments);

        $ids = godown_scope_ids();

        return Inertia::render('payment-add/create-for-purchase', [
            'purchase'       => $purchase->only(['id', 'voucher_no', 'date', 'grand_total', 'account_ledger_id']),
            'remaining_due'  => $remaining,
            'supplierLedger' => $purchase->accountLedger()->select('id', 'account_ledger_name', 'closing_balance')->first(),
            'paymentModes'   => ReceivedMode::with('ledger:id,account_ledger_name,closing_balance')
                ->when($ids, fn($q) => $q->whereIn('created_by', $ids))->get(),
        ]);
    }

    public function storeForPurchase(Request $request, Purchase $purchase)
    {
        $request->validate([
            'date'             => 'required|date',
            'voucher_no'       => 'required|string',
            'payment_mode_id'  => 'required|exists:received_modes,id',
            // lock to supplier’s ledger of this purchase:
            'account_ledger_id' => ['required', 'exists:account_ledgers,id', function ($attr, $val, $fail) use ($purchase) {
                if ((int)$val !== (int)$purchase->account_ledger_id) {
                    $fail('Selected ledger does not match the supplier of this purchase.');
                }
            }],
            'amount'           => ['required', 'numeric', 'min:0.01', function ($attr, $val, $fail) use ($purchase) {
                $alreadyPaid    = (float) $purchase->amount_paid;
                $extraPayments  = (float) PaymentAdd::where('purchase_id', $purchase->id)->sum('amount');
                $remaining      = max(0, $purchase->grand_total - $alreadyPaid - $extraPayments);
                if ($val > $remaining) $fail('Amount exceeds remaining due (' . number_format($remaining, 2) . ').');
            }],
            'description'      => 'nullable|string',
            'send_sms'         => 'boolean',
        ]);

        // Post like your existing payment logic, but bind to the purchase
        $receivedMode = ReceivedMode::findOrFail($request->payment_mode_id);
        $supplier     = AccountLedger::findOrFail($request->account_ledger_id);

        // Journal header (reuse voucher_no if you like that grouping)
        $journal = Journal::create([
            'date'         => $request->date,
            'voucher_no'   => $request->voucher_no,
            'narration'    => $request->description ?: 'Payment for Purchase #' . $purchase->id,
            'created_by'   => auth()->id(),
            'voucher_type' => 'Payment',
        ]);

        // Entries: Debit Supplier (reduce payable), Credit Cash/Bank
        JournalEntry::insert([
            [
                'journal_id'        => $journal->id,
                'account_ledger_id' => $supplier->id,
                'type'              => 'debit',
                'amount'            => $request->amount,
                'note'              => 'Settle due for purchase #' . $purchase->id,
                'created_at'        => now(),
                'updated_at' => now(),
            ],
            [
                'journal_id'        => $journal->id,
                'account_ledger_id' => $receivedMode->ledger_id,
                'type'              => 'credit',
                'amount'            => $request->amount,
                'note'              => 'Paid via ' . $receivedMode->mode_name,
                'created_at'        => now(),
                'updated_at' => now(),
            ],
        ]);

        // Update ledger balances (same convention you already use)
        // Supplier is debited → balance decreases for payables
        $supplier->closing_balance = ($supplier->closing_balance ?? $supplier->opening_balance ?? 0) - $request->amount;
        $supplier->save();

        $paymodeLedger = AccountLedger::find($receivedMode->ledger_id);
        if ($paymodeLedger) {
            // Credit → cash/bank down
            $paymodeLedger->closing_balance = ($paymodeLedger->closing_balance ?? $paymodeLedger->opening_balance ?? 0) - $request->amount;
            $paymodeLedger->save();
        }

        // Persist the payment row, linked to purchase
        PaymentAdd::create([
            'date'             => $request->date,
            'voucher_no'       => $request->voucher_no,
            'purchase_id'      => $purchase->id,                // 👈 link it
            'payment_mode_id'  => $request->payment_mode_id,
            'account_ledger_id' => $supplier->id,
            'amount'           => $request->amount,
            'description'      => $request->description,
            'send_sms'         => (bool)$request->send_sms,
            'created_by'       => auth()->id(),
        ]);

        return redirect()->route('purchases.show', $purchase->id)
            ->with('success', 'Payment recorded and due reduced.');
    }
}
