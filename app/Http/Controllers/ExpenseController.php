<?php

namespace App\Http\Controllers;

use App\Models\AccountLedger;
use App\Models\Expense;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    /**
     * Quick helper: ensure/create an Operating Expense ledger.
     * Default group_under_id = 11 (Indirect Expenses).
     */
    private function ensureExpenseLedger(string $name = 'Operating Expense', ?int $groupUnderId = 11): int
    {
        $existing = AccountLedger::where([
            ['ledger_type', '=', 'operating_expense'],
            ['account_ledger_name', '=', $name],
            ['created_by', '=', auth()->id()],
        ])->first();

        if ($existing) return $existing->id;

        return AccountLedger::create([
            'account_ledger_name' => $name,
            'ledger_type'         => 'operating_expense',
            'debit_credit'        => 'debit',
            'opening_balance'     => 0,
            'closing_balance'     => 0,
            'status'              => 'active',
            'group_under_id'      => $groupUnderId ?? 11,
            'created_by'          => auth()->id(),
        ])->id;
    }

    /**
     * List expenses (scoped).
     */
    public function index(Request $req)
    {
        $ids = godown_scope_ids();

        $q = Expense::with([
            'expenseLedger:id,account_ledger_name,group_under_id',
            'paymentLedger:id,account_ledger_name',
            'supplierLedger:id,account_ledger_name',
            'journal:id,voucher_no,date',
        ])
            ->when(!empty($ids), fn($qq) => $qq->whereIn('created_by', $ids))
            // 🔒 group the ORs so they don't ignore date constraints
            ->when($req->q, function ($qq) use ($req) {
                $qq->where(function ($w) use ($req) {
                    $w->where('voucher_no', 'like', '%' . $req->q . '%')
                        ->orWhere('note', 'like', '%' . $req->q . '%');
                });
            })
            ->when($req->from, fn($qq, $from) => $qq->whereDate('date', '>=', $from))
            ->when($req->to, fn($qq, $to) => $qq->whereDate('date', '<=', $to))
            ->latest('id');

        $expenses = $q->paginate(15)->withQueryString();

        return Inertia::render('expenses/index', [
            'expenses' => $expenses,
            'filters'  => $req->only(['q', 'from', 'to']),
        ]);
    }


    /**
     * Create form.
     */
    public function create()
    {
        $ids = godown_scope_ids();

        return Inertia::render('expenses/create', [
            // Expense heads (Operating Expense)
            'expenseLedgers' => AccountLedger::where('ledger_type', 'operating_expense')
                ->when(!empty($ids), fn($q) => $q->whereIn('created_by', $ids))
                ->get(['id', 'account_ledger_name', 'group_under_id']),

            // Pay-from (Cash/Bank)
            'cashBankLedgers' => AccountLedger::where('ledger_type', 'cash_bank')
                ->when(!empty($ids), fn($q) => $q->whereIn('created_by', $ids))
                ->get(['id', 'account_ledger_name']),

            // Supplier A/P (credit purchase of expense)
            'supplierLedgers' => AccountLedger::where('ledger_type', 'accounts_payable')
                ->when(!empty($ids), fn($q) => $q->whereIn('created_by', $ids))
                ->get(['id', 'account_ledger_name']),
        ]);
    }

    /**
     * Store & post (double-entry via ExpensePostingService).
     */
    public function store(Request $request, \App\Services\ExpensePostingService $poster)
    {
        // We allow either expense_ledger_id OR expense_ledger_name (+ optional group_under_id)
        $data = $request->validate([
            'date'               => ['required', 'date'],
            'voucher_no'         => ['nullable', 'string', 'max:64'],

            'expense_ledger_id'  => ['nullable', 'exists:account_ledgers,id'],
            'expense_ledger_name' => ['nullable', 'string', 'max:255'],
            'group_under_id'     => ['nullable', 'integer'], // e.g. 11/30/31/33

            'amount'             => ['required', 'numeric', 'min:0.01'],
            'note'               => ['nullable', 'string', 'max:65535'],

            // Exactly one is required: pay now (cash/bank) OR accrue to supplier (A/P)
            'payment_ledger_id'  => ['nullable', 'exists:account_ledgers,id'],
            'supplier_ledger_id' => ['nullable', 'exists:account_ledgers,id'],
        ]);

        // If no expense_ledger_id provided, but a name is provided → create/ensure it.
        if (empty($data['expense_ledger_id']) && !empty($data['expense_ledger_name'])) {
            $data['expense_ledger_id'] = $this->ensureExpenseLedger(
                $data['expense_ledger_name'],
                $data['group_under_id'] ?? 11
            );
        }

        // Now hard-require the id
        if (empty($data['expense_ledger_id'])) {
            return back()->withErrors(['expense_ledger_id' => 'Select an expense head or type a new name.'])->withInput();
        }

        // Enforce mutual exclusivity on payment vs supplier
        $payId = $data['payment_ledger_id']  ?? null;
        $supId = $data['supplier_ledger_id'] ?? null;
        if (!($payId xor $supId)) {
            return back()->withErrors(['payment_ledger_id' => 'Choose either a payment ledger OR a supplier, not both.'])->withInput();
        }

        // Lightweight type guards
        if ($payId) {
            $lt = AccountLedger::find($payId)->ledger_type ?? null;
            if ($lt !== 'cash_bank') {
                return back()->withErrors(['payment_ledger_id' => 'Payment ledger must be Cash/Bank.'])->withInput();
            }
        }
        if ($supId) {
            $lt = AccountLedger::find($supId)->ledger_type ?? null;
            if ($lt !== 'accounts_payable') {
                return back()->withErrors(['supplier_ledger_id' => 'Supplier ledger must be Accounts Payable.'])->withInput();
            }
        }

        // Expense head must be Operating Expense
        $expType = AccountLedger::find($data['expense_ledger_id'])->ledger_type ?? null;
        if ($expType !== 'operating_expense') {
            return back()->withErrors(['expense_ledger_id' => 'Select an Operating Expense ledger.'])->withInput();
        }

        // Default voucher_no if empty
        $voucher = $data['voucher_no'] ?? ('EXP-' . now()->format('Ymd') . '-' . str_pad((string)((Expense::max('id') ?? 0) + 1), 4, '0', STR_PAD_LEFT));
        $data['voucher_no'] = $voucher;

        // Persist
        $expense = Expense::create([
            'date'               => $data['date'],
            'voucher_no'         => $data['voucher_no'],
            'expense_ledger_id'  => $data['expense_ledger_id'],
            'amount'             => $data['amount'],
            'note'               => $data['note'] ?? null,
            'payment_ledger_id'  => $payId,
            'supplier_ledger_id' => $supId,
            'created_by'         => auth()->id(),
        ]);

        // Post journal (double-entry)
        $poster->post($expense);

        return redirect()->route('expenses.index')->with('success', 'Expense recorded.');
    }

    /**
     * Show a single expense.
     */
    public function show(Expense $expense)
    {
        // 🔒 scope check (mirror your other controllers)
        $ids = godown_scope_ids();
        if (!empty($ids) && !in_array($expense->created_by, $ids)) {
            abort(403);
        }

        $expense->load([
            'expenseLedger:id,account_ledger_name,group_under_id',
            'paymentLedger:id,account_ledger_name',
            'supplierLedger:id,account_ledger_name',
            'journal.entries.ledger:id,account_ledger_name,ledger_type',
        ]);

        return Inertia::render('expenses/show', ['expense' => $expense]);
    }
}
