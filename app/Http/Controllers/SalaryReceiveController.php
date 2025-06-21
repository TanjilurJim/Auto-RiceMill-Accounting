<?php

namespace App\Http\Controllers;

use App\Models\SalaryReceive;
use App\Models\Employee;
use App\Models\ReceivedMode;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\GroupUnder;
use App\Models\Nature;
use App\Models\AccountGroup;
use App\Models\User;

use App\Models\SalarySlip;
use App\Models\Journal;
use App\Models\JournalEntry;
use App\Models\AccountLedger;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SalaryReceiveController extends Controller
{
    // Show the list of salary receives
    public function index()
    {
        $salaryReceives = SalaryReceive::with('employee', 'receivedMode')
            ->when(!auth()->user()->hasRole('admin'), function ($query) {
                $query->where('created_by', auth()->id());
            })
            ->orderByDesc('created_at')
            ->paginate(10);

        return Inertia::render('salaryReceives/index', [
            'salaryReceives' => $salaryReceives
        ]);
    }

    // Show the create form
    public function create()
    {
        $employees = Employee::query()
            ->when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))
            ->get();

        $receivedModes = ReceivedMode::query()
            ->when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))
            ->get();

        // Fetch salary slips that are unpaid or partially paid
        $unpaidSalarySlipEmployees = \App\Models\SalarySlipEmployee::with('employee', 'salarySlip')
            ->whereIn('status', ['Unpaid', 'Partially Paid'])
            ->get();

        return Inertia::render('salaryReceives/create', [
            'employees' => $employees,
            'receivedModes' => $receivedModes,
            'salarySlipEmployees' => $unpaidSalarySlipEmployees, // 👈 new data
        ]);
    }

    // Store the new salary receive
    public function store(Request $request)
    {
        // In your validate block:
        $request->validate([
            'vch_no'                  => 'required|unique:salary_receives,vch_no',
            'date'                    => 'required|date',
            'employee_id'             => 'required|exists:employees,id',
            'received_by'             => 'required|exists:received_modes,id',
            'amount'                  => 'required|numeric|min:0',
            'description'             => 'nullable|string',
            'salary_slip_employee_id' => 'nullable|exists:salary_slip_employees,id',
        ]);

        if ($request->filled('salary_slip_employee_id')) {
            $salarySlipEmployee = \App\Models\SalarySlipEmployee::find($request->salary_slip_employee_id);

            if ($salarySlipEmployee) {
                $totalPaid = SalaryReceive::where('salary_slip_employee_id', $salarySlipEmployee->id)->sum('amount');

                $remaining = $salarySlipEmployee->total_amount - $totalPaid;

                if ($request->amount > $remaining) {
                    // ❌ Block over-payment
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        'amount' => "This payment exceeds the remaining salary. Remaining: ৳" . number_format($remaining, 2),
                    ]);
                }
            }
        }


        DB::transaction(function () use ($request) {

            /* 1️⃣  create SalaryReceive row */
            $salaryReceive = SalaryReceive::create([
                'vch_no'                  => $request->vch_no,
                'date'                    => $request->date,
                'employee_id'             => $request->employee_id,
                'received_by'             => $request->received_by,
                'amount'                  => $request->amount,
                'description'             => $request->description,
                'created_by'              => auth()->id(),
                'salary_slip_employee_id' => $request->salary_slip_employee_id,
            ]);

            // Get ledgers
            /* 2️⃣  fetch ledgers */
            $employeeLedger = AccountLedger::where('employee_id', $request->employee_id)->firstOrFail();
            $modeLedger     = ReceivedMode::with('ledger')->findOrFail($request->received_by)->ledger;

            /* 3️⃣  create settlement journal */
            $journal = Journal::create([
                'date'       => $request->date,
                'voucher_no' => 'JRN-' . strtoupper(Str::random(6)),
                'narration'  => 'Salary payment to Employee ID ' . $request->employee_id,
                'created_by' => auth()->id(),
            ]);



            // ✅ Journal Entry 1: Salary Expense (Debit)
            // DR Employee Ledger (clears liability)
            JournalEntry::create([
                'journal_id'        => $journal->id,
                'account_ledger_id' => $employeeLedger->id,
                'type'              => 'debit',
                'amount'            => $request->amount,
                'note'              => 'Salary settlement',
            ]);

            // ✅ Journal Entry 2: Employee Ledger (Credit)
            // CR Cash / bKash / Nagad
            JournalEntry::create([
                'journal_id'        => $journal->id,
                'account_ledger_id' => $modeLedger->id,
                'type'              => 'credit',
                'amount'            => $request->amount,
                'note'              => 'Paid via ' . $modeLedger->account_ledger_name,
            ]);


            // Link journal to salary receive
            $salaryReceive->journal_id = $journal->id;
            $salaryReceive->save();

            // ⏩ Handle salary slip payment tracking as before
            if ($request->filled('salary_slip_employee_id')) {
                $salarySlipEmployee = \App\Models\SalarySlipEmployee::find($request->salary_slip_employee_id);

                if ($salarySlipEmployee) {
                    $totalPaid = SalaryReceive::where('salary_slip_employee_id', $salarySlipEmployee->id)->sum('amount');
                    $salarySlipEmployee->paid_amount = $totalPaid;

                    $salarySlipEmployee->status = match (true) {
                        $totalPaid >= $salarySlipEmployee->total_amount => 'Paid',
                        $totalPaid > 0 => 'Partially Paid',
                        default => 'Unpaid',
                    };

                    $salarySlipEmployee->save();
                }
            }
        });

        return redirect()->route('salary-receives.index')->with('success', 'Salary received and journal posted successfully!');
    }

    // Show the edit form
    public function edit(SalaryReceive $salaryReceive)
    {
        // Forcefully load related models — skip created_by filtering here
        $salaryReceive->load([
            'employee' => fn($q) => $q->withoutGlobalScopes(),
            'receivedMode' => fn($q) => $q->withoutGlobalScopes(),
            'salarySlipEmployee.salarySlip' => fn($q) => $q->withoutGlobalScopes(),
        ]);

        $employees = Employee::query()
            ->when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))
            ->get();

        $receivedModes = ReceivedMode::query()
            ->when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))
            ->get();

        $salarySlipEmployees = \App\Models\SalarySlipEmployee::with('employee', 'salarySlip')
            ->whereIn('status', ['Unpaid', 'Partially Paid', 'Paid']) // show all in edit
            ->get();



        return Inertia::render('salaryReceives/edit', [
            'salaryReceive' => [
                'id' => $salaryReceive->id,
                'vch_no' => $salaryReceive->vch_no,
                'date' => $salaryReceive->date,
                'employee' => $salaryReceive->employee ? [
                    'id' => $salaryReceive->employee->id,
                    'name' => $salaryReceive->employee->name,
                ] : null,
                'received_mode' => $salaryReceive->receivedMode ? [
                    'id' => $salaryReceive->receivedMode->id,
                    'mode_name' => $salaryReceive->receivedMode->mode_name,
                ] : null,
                'amount' => $salaryReceive->amount,
                'description' => $salaryReceive->description,
                'salary_slip_employee' => $salaryReceive->salarySlipEmployee ? [
                    'id' => $salaryReceive->salarySlipEmployee->id,
                    'status' => $salaryReceive->salarySlipEmployee->status,
                    'employee' => $salaryReceive->salarySlipEmployee->employee->name ?? '',
                    'salary_slip' => [
                        'voucher_no' => $salaryReceive->salarySlipEmployee->salarySlip->voucher_number ?? '',
                    ],
                ] : null,
            ],
            'employees' => $employees,
            'receivedModes' => $receivedModes,
            'salarySlipEmployees' => $salarySlipEmployees,
        ]);
    }






    // Update the salary receive
    public function update(Request $request, SalaryReceive $salaryReceive)
    {
        $request->validate([
            'vch_no'                  => 'required|unique:salary_receives,vch_no,' . $salaryReceive->id,
            'date'                    => 'required|date',
            'employee_id'             => 'required|exists:employees,id',
            'received_by'             => 'required|exists:received_modes,id',
            'amount'                  => 'required|numeric|min:0',
            'description'             => 'nullable|string',
            'salary_slip_employee_id' => 'nullable|exists:salary_slip_employees,id',
        ]);

        // Prevent overpayment if editing linked slip
        if ($request->filled('salary_slip_employee_id')) {
            $salarySlipEmployee = \App\Models\SalarySlipEmployee::find($request->salary_slip_employee_id);
            if ($salarySlipEmployee) {
                $totalPaid = SalaryReceive::where('salary_slip_employee_id', $salarySlipEmployee->id)
                    ->where('id', '!=', $salaryReceive->id)
                    ->sum('amount');

                $remaining = $salarySlipEmployee->total_amount - $totalPaid;

                if ($request->amount > $remaining) {
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        'amount' => "This payment exceeds the remaining salary. Remaining: ৳" . number_format($remaining, 2),
                    ]);
                }
            }
        }

        DB::transaction(function () use ($request, $salaryReceive) {

            /* 1️⃣  update SalaryReceive row */
            $salaryReceive->update([
                'vch_no'                  => $request->vch_no,
                'date'                    => $request->date,
                'employee_id'             => $request->employee_id,
                'received_by'             => $request->received_by,
                'amount'                  => $request->amount,
                'description'             => $request->description,
                'salary_slip_employee_id' => $request->salary_slip_employee_id,
            ]);


            /* 2️⃣  fetch ledgers */
            $employeeLedger = AccountLedger::where('employee_id', $request->employee_id)->firstOrFail();
            $modeLedger     = ReceivedMode::with('ledger')->findOrFail($request->received_by)->ledger;

            /* 3️⃣  update or recreate journal */
            $journal = $salaryReceive->journal ?? Journal::create([
                'date'       => $request->date,
                'voucher_no' => 'JRN-' . strtoupper(Str::random(6)),
                'narration'  => 'Salary payment to Employee ID ' . $request->employee_id,
                'created_by' => auth()->id(),
            ]);

            $journal->update([
                'date'      => $request->date,
                'narration' => 'Salary payment to Employee ID ' . $request->employee_id . ' (updated)',
            ]);

            // wipe old entries
            JournalEntry::where('journal_id', $journal->id)->delete();

            // DR Employee
            JournalEntry::create([
                'journal_id'        => $journal->id,
                'account_ledger_id' => $employeeLedger->id,
                'type'              => 'debit',
                'amount'            => $request->amount,
                'note'              => 'Salary settlement (updated)',
            ]);

            // CR Cash / bKash / Nagad
            JournalEntry::create([
                'journal_id'        => $journal->id,
                'account_ledger_id' => $modeLedger->id,
                'type'              => 'credit',
                'amount'            => $request->amount,
                'note'              => 'Paid via ' . $modeLedger->account_ledger_name . ' (updated)',
            ]);

            $salaryReceive->journal_id = $journal->id;
            $salaryReceive->save();

            // Update salary slip payment info
            if ($request->filled('salary_slip_employee_id')) {
                $salarySlipEmployee = \App\Models\SalarySlipEmployee::find($request->salary_slip_employee_id);
                if ($salarySlipEmployee) {
                    $totalPaid = SalaryReceive::where('salary_slip_employee_id', $salarySlipEmployee->id)->sum('amount');
                    $salarySlipEmployee->paid_amount = $totalPaid;

                    $salarySlipEmployee->status = match (true) {
                        $totalPaid >= $salarySlipEmployee->total_amount => 'Paid',
                        $totalPaid > 0 => 'Partially Paid',
                        default => 'Unpaid',
                    };

                    $salarySlipEmployee->save();
                }
            }
        });

        return redirect()->route('salary-receives.index')
            ->with('success', 'Salary receive updated successfully!');
    }




    // Delete the salary receive
    public function destroy(SalaryReceive $salaryReceive)
    {
        $salaryReceive->delete();
        return redirect()->route('salary-receives.index')->with('success', 'Salary receive deleted successfully!');
    }

    public function show(SalaryReceive $salaryReceive)
    {
        $salaryReceive->load([
            'employee.designation',
            'employee.department',
            'receivedMode.ledger',
            'salarySlipEmployee.salarySlip',
            'journal.entries.ledger',
            'creator',
        ]);

        return Inertia::render('salaryReceives/show', [
            'salaryReceive' => [
                'id' => $salaryReceive->id,
                'vch_no' => $salaryReceive->vch_no,
                'date' => $salaryReceive->date,
                'amount' => $salaryReceive->amount,
                'description' => $salaryReceive->description,
                'created_at' => $salaryReceive->created_at,
                'employee' => $salaryReceive->employee,
                'received_mode' => $salaryReceive->receivedMode,
                'salary_slip_employee' => $salaryReceive->salarySlipEmployee,
                'journal' => $salaryReceive->journal,
                'creator' => $salaryReceive->creator,
            ],
        ]);
    }


    private function getOrCreateSalaryExpenseLedger(): AccountLedger
    {
        $groupUnder   = GroupUnder::where('name', 'Indirect Expenses')
            // ← scoped
            ->firstOrFail();

        $expenseNature = Nature::where('name', 'Expenses')->firstOrFail();

        $accountGroup = AccountGroup::firstOrCreate(
            ['name' => 'Salary Expense', 'created_by' => auth()->id()], // ← scoped key
            [
                'nature_id'      => $expenseNature->id,
                'group_under_id' => $groupUnder->id,
                'description'    => 'Auto group for salary expense',
                'created_by'     => auth()->id(),
            ]
        );

        return AccountLedger::firstOrCreate(
            ['account_ledger_name' => 'Salary Expense', 'created_by' => auth()->id()], // ← scoped key
            [
                'ledger_type'     => 'expense',
                'opening_balance' => 0,
                'debit_credit'    => 'debit',
                'status'          => 'active',
                'phone_number'     => '0000000000',              // ← add
                'email'            => 'noreply@example.com',     // ← add
                'account_group_id' => $accountGroup->id,
                'group_under_id'  => $groupUnder->id,
                'created_by'      => auth()->id(),
            ]
        );
    }
}
