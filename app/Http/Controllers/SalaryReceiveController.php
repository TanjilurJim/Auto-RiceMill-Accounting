<?php

namespace App\Http\Controllers;

use App\Models\SalaryReceive;
use App\Models\Employee;
use App\Models\ReceivedMode;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        return Inertia::render('salaryReceives/create', [
            'employees' => $employees,
            'receivedModes' => $receivedModes
        ]);
    }

    // Store the new salary receive
    public function store(Request $request)
    {
        $request->validate([
            'vch_no' => 'required|unique:salary_receives,vch_no',
            'date' => 'required|date',
            'employee_id' => 'required|exists:employees,id',
            'received_by' => 'required|exists:received_modes,id',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        DB::transaction(function () use ($request) {
            // Create salary receive
            $salaryReceive = SalaryReceive::create([
                'vch_no' => $request->vch_no,
                'date' => $request->date,
                'employee_id' => $request->employee_id,
                'received_by' => $request->received_by,
                'amount' => $request->amount,
                'description' => $request->description,
                'created_by' => auth()->id(),
            ]);

            // Get ledgers
            $salaryExpenseLedger = $this->getOrCreateSalaryExpenseLedger();
            $receivedMode = ReceivedMode::with('ledger')->findOrFail($request->received_by);
            $paymentLedger = $receivedMode->ledger;

            // Create journal
            $journal = Journal::create([
                'date' => $request->date,
                'voucher_no' => 'JRN-' . strtoupper(Str::random(6)),
                'narration' => 'Salary payment to Employee ID ' . $request->employee_id,
                'created_by' => auth()->id(),
            ]);

            // Create journal entries
            JournalEntry::create([
                'journal_id' => $journal->id,
                'account_ledger_id' => $salaryExpenseLedger->id,
                'type' => 'debit',
                'amount' => $request->amount,
                'note' => 'Salary Paid',
            ]);

            JournalEntry::create([
                'journal_id' => $journal->id,
                'account_ledger_id' => $paymentLedger->id,
                'type' => 'credit',
                'amount' => $request->amount,
                'note' => 'Paid via ' . $receivedMode->name,
            ]);

            // Link journal to salary receive
            $salaryReceive->journal_id = $journal->id;
            $salaryReceive->save();
        });

        return redirect()->route('salary-receives.index')->with('success', 'Salary received and journal posted successfully!');
    }

    // Show the edit form
    public function edit(SalaryReceive $salaryReceive)
    {
        // Ensure 'employee' and 'receivedMode' are loaded with the salaryReceive
        $salaryReceive->load('employee', 'receivedMode'); // Ensure both relationships are loaded

        $employees = Employee::all(); // Get all employees
        $receivedModes = ReceivedMode::all(); // Get all received modes

        return Inertia::render('salaryReceives/edit', [
            'salaryReceive' => $salaryReceive,
            'employees' => $employees,
            'receivedModes' => $receivedModes,
        ]);
    }



    // Update the salary receive
    public function update(Request $request, SalaryReceive $salaryReceive)
    {
        $request->validate([
            'vch_no' => 'required|unique:salary_receives,vch_no,' . $salaryReceive->id,
            'date' => 'required|date',
            'employee_id' => 'required|exists:employees,id',
            'received_by' => 'required|exists:received_modes,id',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $salaryReceive->update($request->all());

        return redirect()->route('salary-receives.index')->with('success', 'Salary received updated successfully!');
    }

    // Delete the salary receive
    public function destroy(SalaryReceive $salaryReceive)
    {
        $salaryReceive->delete();
        return redirect()->route('salary-receives.index')->with('success', 'Salary receive deleted successfully!');
    }

    public function show(SalaryReceive $salaryReceive)
    {
        // Load employee and receivedMode relationship data
        $salaryReceive->load('employee', 'receivedMode', 'journal.entries.ledger');

        return Inertia::render('salaryReceives/invoice', [
            'salaryReceive' => $salaryReceive
        ]);
    }

    private function getOrCreateSalaryExpenseLedger(): \App\Models\AccountLedger
    {
        // 1. Make sure the account group exists under Expenses > Indirect Expenses
        $groupUnder = \App\Models\GroupUnder::where('name', 'Indirect Expenses')->firstOrFail();
        $expenseNature = \App\Models\Nature::where('name', 'Expenses')->firstOrFail();

        $accountGroup = \App\Models\AccountGroup::firstOrCreate(
            ['name' => 'Salary Expense'],
            [
                'nature_id' => $expenseNature->id,
                'group_under_id' => $groupUnder->id,
                'description' => 'Auto-generated group for salary expenses',
                'created_by' => auth()->id(),
            ]
        );

        // 2. Create the AccountLedger under that group
        return \App\Models\AccountLedger::firstOrCreate(
            ['account_ledger_name' => 'Salary Expense'],
            [
                'phone_number' => '0000000000',
                'email' => 'salary@company.com',
                'opening_balance' => 0,
                'debit_credit' => 'debit',
                'status' => 'active',
                'account_group_id' => $accountGroup->id,
                'group_under_id' => $groupUnder->id,
                'address' => 'Company HR',
                'for_transition_mode' => false,
                'mark_for_user' => false,
                'created_by' => auth()->id(),
            ]
        );
    }
}
