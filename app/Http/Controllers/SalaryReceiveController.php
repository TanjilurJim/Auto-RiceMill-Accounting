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

use function godown_scope_ids; // Assuming this function is defined in your helpers

class SalaryReceiveController extends Controller
{


    public function index()
    {
        $ids = godown_scope_ids();

        $salaryReceives = SalaryReceive::with('employee', 'receivedMode')
            ->when($ids !== null && !empty($ids), function ($query) use ($ids) {
                $query->whereIn('created_by', $ids);
            })
            ->orderByDesc('created_at')
            ->paginate(10);

        return Inertia::render('salaryReceives/index', [
            'salaryReceives' => $salaryReceives
        ]);
    }



    public function create()
    {
        $ids = godown_scope_ids();

        $employees = \App\Models\Employee::query()
            ->when($ids, fn($q) => $q->whereIn('created_by', $ids))
            ->get(['id', 'name']);

        $receivedModes = \App\Models\ReceivedMode::query()
            ->when($ids, fn($q) => $q->whereIn('created_by', $ids))
            ->get(['id', 'mode_name']);

        $salarySlipEmployees = \App\Models\SalarySlipEmployee::with([
            'employee:id,name',
            'salarySlip:id,voucher_number,month,year',
        ])
            ->whereHas('salarySlip', function ($q) use ($ids) {
                if ($ids) $q->whereIn('created_by', $ids);
            })
            ->get()
            ->map(function ($line) {
                $paid = \App\Models\SalaryReceive::where('salary_slip_employee_id', $line->id)->sum('amount');
                return [
                    'id'         => $line->id,
                    'employee'   => ['id' => $line->employee_id, 'name' => $line->employee?->name],
                    'salary_slip' => [
                        'voucher_number' => $line->salarySlip?->voucher_number,
                        'month'          => $line->salarySlip?->month,
                        'year'           => $line->salarySlip?->year,
                    ],
                    'status'     => $line->status ?? 'Unpaid',
                    'total'      => (float)$line->total_amount,
                    'paid'       => (float)$paid,
                    'remaining'  => max(0, (float)$line->total_amount - (float)$paid),
                ];
            })
            ->filter(fn($x) => $x['remaining'] > 0)   // only unsettled
            ->values();

        return \Inertia\Inertia::render('salaryReceives/create', [
            'employees'            => $employees,
            'receivedModes'        => $receivedModes,
            'salarySlipEmployees'  => $salarySlipEmployees,
        ]);
    }


    // Store the new salary receive
    public function store(\Illuminate\Http\Request $request)
    {
        $request->validate([
            'vch_no'                  => 'required|unique:salary_receives,vch_no',
            'date'                    => 'required|date',
            'received_by'             => 'required|exists:received_modes,id',
            'salary_slip_employee_id' => 'required|exists:salary_slip_employees,id',
            'amount'                  => 'required|numeric|min:0.01',
            'description'             => 'nullable|string',
            // 'employee_id' optional; we’ll derive from the slip line for safety
        ]);

        $line = \App\Models\SalarySlipEmployee::with('salarySlip')->findOrFail($request->salary_slip_employee_id);

        $already   = \App\Models\SalaryReceive::where('salary_slip_employee_id', $line->id)->sum('amount');
        $remaining = max(0, (float)$line->total_amount - (float)$already);

        if ($request->amount > $remaining) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'amount' => "This payment exceeds the remaining salary. Remaining: ৳" . number_format($remaining, 2),
            ]);
        }

        \DB::transaction(function () use ($request, $line) {

            // Ledgers
            $employeeLiabLedger = \App\Models\AccountLedger::where('employee_id', $line->employee_id)
                ->where('ledger_type', 'employee') // liability
                ->firstOrFail();

            $modeLedger = \App\Models\ReceivedMode::with('ledger')
                ->findOrFail($request->received_by)->ledger;

            // Journal
            $journal = \App\Models\Journal::create([
                'date'       => $request->date,
                'voucher_no' => 'JRN-' . \Illuminate\Support\Str::upper(\Illuminate\Support\Str::random(6)),
                'narration'  => "Salary payment for Slip {$line->salarySlip?->voucher_number}",
                'created_by' => auth()->id(),
            ]);

            // DR Employee Liability
            \App\Models\JournalEntry::create([
                'journal_id'        => $journal->id,
                'account_ledger_id' => $employeeLiabLedger->id,
                'type'              => 'debit',
                'amount'            => $request->amount,
                'note'              => 'Salary settlement',
            ]);

            // CR Cash/Bank
            \App\Models\JournalEntry::create([
                'journal_id'        => $journal->id,
                'account_ledger_id' => $modeLedger->id,
                'type'              => 'credit',
                'amount'            => $request->amount,
                'note'              => 'Paid via ' . $modeLedger->account_ledger_name,
            ]);

            // Persist receive (derive employee_id from slip line)
            $receive = \App\Models\SalaryReceive::create([
                'vch_no'                  => $request->vch_no,
                'date'                    => $request->date,
                'employee_id'             => $line->employee_id,
                'received_by'             => $request->received_by,
                'amount'                  => $request->amount,
                'description'             => $request->description,
                'created_by'              => auth()->id(),
                'salary_slip_employee_id' => $line->id,
                'is_advance'              => false, // legacy column; harmless
                'journal_id'              => $journal->id,
            ]);

            // Refresh paid + status on the line
            $paid = \App\Models\SalaryReceive::where('salary_slip_employee_id', $line->id)->sum('amount');
            $line->paid_amount = $paid;
            $line->status = match (true) {
                $paid <= 0 => 'Unpaid',
                $paid >= (float)$line->total_amount => 'Paid',
                default => 'Partially Paid',
            };
            $line->save();
        });

        return redirect()->route('salary-receives.index')
            ->with('success', 'Salary receive saved & journal posted!');
    }




    public function edit(SalaryReceive $salaryReceive)
    {
        $ids = godown_scope_ids();

        $salaryReceive->load([
            'employee' => fn($q) => $q->withoutGlobalScopes(),
            'receivedMode' => fn($q) => $q->withoutGlobalScopes(),
            'salarySlipEmployee.salarySlip' => fn($q) => $q->withoutGlobalScopes(),
        ]);

        $employees = Employee::query()
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->get();

        $receivedModes = ReceivedMode::query()
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->get();

        $salarySlipEmployees = \App\Models\SalarySlipEmployee::with('employee', 'salarySlip')
            ->when($ids !== null && !empty($ids), function ($q) use ($ids) {
                $q->whereHas('employee', function ($q2) use ($ids) {
                    $q2->whereIn('created_by', $ids);
                });
            })
            ->whereIn('status', ['Unpaid', 'Partially Paid', 'Paid'])
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


    public function update(Request $request, SalaryReceive $salaryReceive)
    {
        $request->validate([
            'vch_no'                  => 'required|unique:salary_receives,vch_no,' . $salaryReceive->id,
            'date'                    => 'required|date',
            'received_by'             => 'required|exists:received_modes,id',
            'salary_slip_employee_id' => 'required|exists:salary_slip_employees,id',
            'amount'                  => 'required|numeric|min:0.01',
            'description'             => 'nullable|string',
        ]);

        $line = \App\Models\SalarySlipEmployee::findOrFail($request->salary_slip_employee_id);

        $already   = \App\Models\SalaryReceive::where('salary_slip_employee_id', $line->id)
            ->where('id', '!=', $salaryReceive->id)
            ->sum('amount');
        $remaining = max(0, (float)$line->total_amount - (float)$already);

        if ($request->amount > $remaining) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'amount' => "This payment exceeds the remaining salary. Remaining: ৳" . number_format($remaining, 2),
            ]);
        }

        \DB::transaction(function () use ($request, $salaryReceive, $line) {

            // Ledgers
            $employeeLiabLedger = \App\Models\AccountLedger::where('employee_id', $line->employee_id)
                ->where('ledger_type', 'employee')->firstOrFail();
            $modeLedger = \App\Models\ReceivedMode::with('ledger')
                ->findOrFail($request->received_by)->ledger;

            // Journal (create or reuse)
            $journal = $salaryReceive->journal ?? \App\Models\Journal::create([
                'date'       => $request->date,
                'voucher_no' => 'JRN-' . \Illuminate\Support\Str::upper(\Illuminate\Support\Str::random(6)),
                'narration'  => "Salary payment (updated) for Slip {$line->salarySlip?->voucher_number}",
                'created_by' => auth()->id(),
            ]);

            $journal->update([
                'date'      => $request->date,
                'narration' => "Salary payment (updated) for Slip {$line->salarySlip?->voucher_number}",
            ]);

            \App\Models\JournalEntry::where('journal_id', $journal->id)->delete();

            // DR Employee Liability
            \App\Models\JournalEntry::create([
                'journal_id'        => $journal->id,
                'account_ledger_id' => $employeeLiabLedger->id,
                'type'              => 'debit',
                'amount'            => $request->amount,
                'note'              => 'Salary settlement (updated)',
            ]);

            // CR Cash/Bank
            \App\Models\JournalEntry::create([
                'journal_id'        => $journal->id,
                'account_ledger_id' => $modeLedger->id,
                'type'              => 'credit',
                'amount'            => $request->amount,
                'note'              => 'Paid via ' . $modeLedger->account_ledger_name . ' (updated)',
            ]);

            // Persist receive
            $salaryReceive->update([
                'vch_no'                  => $request->vch_no,
                'date'                    => $request->date,
                'employee_id'             => $line->employee_id, // derive
                'received_by'             => $request->received_by,
                'amount'                  => $request->amount,
                'description'             => $request->description,
                'salary_slip_employee_id' => $line->id,
                'is_advance'              => false,
                'journal_id'              => $journal->id,
            ]);

            // Refresh paid + status
            $paid = \App\Models\SalaryReceive::where('salary_slip_employee_id', $line->id)->sum('amount');
            $line->paid_amount = $paid;
            $line->status = match (true) {
                $paid <= 0 => 'Unpaid',
                $paid >= (float)$line->total_amount => 'Paid',
                default => 'Partially Paid',
            };
            $line->save();
        });

        return redirect()->route('salary-receives.index')
            ->with('success', 'Salary receive updated!');
    }




    public function destroy(SalaryReceive $salaryReceive)
    {
        $ids = godown_scope_ids();
        if ($ids !== null && !empty($ids) && !in_array($salaryReceive->created_by, $ids)) {
            abort(403, 'Unauthorized');
        }

        $salaryReceive->delete();
        return redirect()->route('salary-receives.index')->with('success', 'Salary receive deleted successfully!');
    }



    public function show(SalaryReceive $salaryReceive)
    {
        $ids = godown_scope_ids();
        if ($ids !== null && !empty($ids) && !in_array($salaryReceive->created_by, $ids)) {
            abort(403, 'Unauthorized');
        }

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
