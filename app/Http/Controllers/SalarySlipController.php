<?php

namespace App\Http\Controllers;

use App\Models\SalarySlip;
use App\Models\SalarySlipEmployee;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Journal;
use App\Models\JournalEntry;
use App\Models\AccountLedger;
use App\Models\AccountGroup;
use App\Models\GroupUnder;
use App\Models\Nature;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

use function godown_scope_ids;

class SalarySlipController extends Controller
{
    // Show list of salary slips
    // public function index()
    // {
    //     $salarySlips = SalarySlip::with(['salarySlipEmployees.employee.designation']) // 👈 Ensure nested relationship
    //         ->when(!auth()->user()->hasRole('admin'), function ($query) {
    //             $query->where('created_by', auth()->id());
    //         })
    //         ->orderBy('created_at', 'desc')
    //         ->paginate(10)
    //         ->appends(request()->query());

    //     $employees = Employee::with('designation')
    //         ->select('id', 'name', 'designation_id')
    //         ->when(!auth()->user()->hasRole('admin'), function ($q) {
    //             $q->where('created_by', auth()->id());
    //         })
    //         ->get();

    //     return Inertia::render('salarySlips/index', [
    //         'salarySlips' => $salarySlips,
    //         'employees' => $employees,
    //     ]);
    // }

    public function index()
    {
        $ids = godown_scope_ids();

        $salarySlips = SalarySlip::with(['salarySlipEmployees.employee.designation'])
            ->when($ids !== null && !empty($ids), function ($query) use ($ids) {
                $query->whereIn('created_by', $ids);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->appends(request()->query());

        $employees = Employee::with('designation')
            ->select('id', 'name', 'designation_id')
            ->when($ids !== null && !empty($ids), function ($q) use ($ids) {
                $q->whereIn('created_by', $ids);
            })
            ->get();

        return Inertia::render('salarySlips/index', [
            'salarySlips' => $salarySlips,
            'employees' => $employees,
        ]);
    }


    // Show create form
    // public function create()
    // {
    //     $employees = Employee::with('designation')
    //         ->select('id', 'name', 'salary', 'designation_id')
    //         ->when(!auth()->user()->hasRole('admin'), function ($q) {
    //             $q->where('created_by', auth()->id());
    //         })
    //         ->get();

    //     return Inertia::render('salarySlips/create', [
    //         'employees' => $employees
    //     ]);
    // }

    public function create()
    {
        $ids = godown_scope_ids();

        $employees = Employee::with('designation')
            ->select('id', 'name', 'salary', 'designation_id')
            ->when($ids !== null && !empty($ids), function ($q) use ($ids) {
                $q->whereIn('created_by', $ids);
            })
            ->get();

        return Inertia::render('salarySlips/create', [
            'employees' => $employees
        ]);
    }

    // Store salary slip
    public function store(Request $request)
    {
        $request->validate([
            'voucher_number' => 'required|unique:salary_slips,voucher_number',
            'date'           => 'required|date',
            'month'          => 'required|integer|min:1|max:12',
            'year'           => 'required|integer|min:2020',
            'salary_slip_employees'                     => 'required|array|min:1',
            'salary_slip_employees.*.employee_id'       => 'required|exists:employees,id',
            'salary_slip_employees.*.basic_salary'      => 'required|numeric|min:0',
            'salary_slip_employees.*.additional_amount' => 'nullable|numeric|min:0',
        ]);

        DB::transaction(function () use ($request) {

            /* ───── 1. create SalarySlip + detail rows ───── */
            $salarySlip = SalarySlip::create([
                'voucher_number' => $request->voucher_number,
                'date'           => $request->date,
                'month'          => $request->month,
                'year'           => $request->year,
                'created_by'     => auth()->id(),
            ]);

            foreach ($request->salary_slip_employees as $row) {
                SalarySlipEmployee::create([
                    'salary_slip_id'    => $salarySlip->id,
                    'employee_id'       => $row['employee_id'],
                    'basic_salary'      => $row['basic_salary'],
                    'additional_amount' => $row['additional_amount'] ?? 0,
                    'total_amount'      => $row['basic_salary'] + ($row['additional_amount'] ?? 0),
                ]);
            }

            /* ───── 2. post accrual journal ───── */
            $salaryExpenseLedger = $this->getOrCreateSalaryExpenseLedger();

            $journal = Journal::create([
                'date'       => $request->date,
                'voucher_no' => 'JRN-' . strtoupper(Str::random(6)),
                'narration'  => "Accrued salaries for Slip #{$salarySlip->voucher_number}",
                'created_by' => auth()->id(),
            ]);

            foreach ($request->salary_slip_employees as $row) {
                $amount         = $row['basic_salary'] + ($row['additional_amount'] ?? 0);
                $employeeLedger = AccountLedger::where('employee_id', $row['employee_id'])->firstOrFail();

                // DR Salary Expense
                JournalEntry::create([
                    'journal_id'        => $journal->id,
                    'account_ledger_id' => $salaryExpenseLedger->id,
                    'type'              => 'debit',
                    'amount'            => $amount,
                    'note'              => 'Accrued salary',
                ]);

                // CR Employee Ledger
                JournalEntry::create([
                    'journal_id'        => $journal->id,
                    'account_ledger_id' => $employeeLedger->id,
                    'type'              => 'credit',
                    'amount'            => $amount,
                    'note'              => 'Salary payable',
                ]);
            }
        });

        return redirect()->route('salary-slips.index')
            ->with('success', 'Salary slip created and accrued successfully!');
    }


    // Show salary slip edit form
    // public function edit(SalarySlip $salarySlip)
    // {
    //     // Load employees associated with the salary slip
    //     $salarySlip->load('salarySlipEmployees.employee');

    //     // Fetch all employees for the edit form
    //     $employees = Employee::all();

    //     return Inertia::render('salarySlips/edit', [
    //         'salarySlip' => $salarySlip,
    //         'employees' => $employees
    //     ]);
    // }

    public function edit(SalarySlip $salarySlip)
    {
        $ids = godown_scope_ids();
        if ($ids !== null && !empty($ids) && !in_array($salarySlip->created_by, $ids)) {
            abort(403, 'Unauthorized');
        }

        $salarySlip->load('salarySlipEmployees.employee');

        $employees = Employee::when($ids !== null && !empty($ids), function ($q) use ($ids) {
            $q->whereIn('created_by', $ids);
        })->get();

        return Inertia::render('salarySlips/edit', [
            'salarySlip' => $salarySlip,
            'employees' => $employees
        ]);
    }

    // Update salary slip
    // public function update(Request $request, SalarySlip $salarySlip)
    // {
    //     $request->validate([
    //         'voucher_number' => 'required|unique:salary_slips,voucher_number,' . $salarySlip->id,
    //         'date'           => 'required|date',
    //         'month'          => 'required|integer|min:1|max:12',
    //         'year'           => 'required|integer|min:2020',
    //         'salary_slip_employees'                     => 'required|array|min:1',
    //         'salary_slip_employees.*.employee_id'       => 'required|exists:employees,id',
    //         'salary_slip_employees.*.basic_salary'      => 'required|numeric|min:0',
    //         'salary_slip_employees.*.additional_amount' => 'nullable|numeric|min:0',
    //     ]);

    //     DB::transaction(function () use ($request, $salarySlip) {

    //         /* ───── 1. update master row ───── */
    //         $salarySlip->update([
    //             'voucher_number' => $request->voucher_number,
    //             'date'           => $request->date,
    //             'month'          => $request->month,
    //             'year'           => $request->year,
    //         ]);

    //         /* ───── 2. sync detail rows ───── */
    //         $detailRows = collect($request->salary_slip_employees)->keyBy('employee_id');

    //         foreach ($salarySlip->salarySlipEmployees as $line) {
    //             $input = $detailRows->pull($line->employee_id);
    //             if ($input) {
    //                 $line->update([
    //                     'basic_salary'      => $input['basic_salary'],
    //                     'additional_amount' => $input['additional_amount'] ?? 0,
    //                     'total_amount'      => $input['basic_salary'] + ($input['additional_amount'] ?? 0),
    //                 ]);
    //             } else {
    //                 $line->delete(); // removed from slip
    //             }
    //         }

    //         // any new employees added
    //         foreach ($detailRows as $input) {
    //             SalarySlipEmployee::create([
    //                 'salary_slip_id'    => $salarySlip->id,
    //                 'employee_id'       => $input['employee_id'],
    //                 'basic_salary'      => $input['basic_salary'],
    //                 'additional_amount' => $input['additional_amount'] ?? 0,
    //                 'total_amount'      => $input['basic_salary'] + ($input['additional_amount'] ?? 0),
    //             ]);
    //         }

    //         /* ───── 3. rebuild accrual journal ───── */
    //         $salaryExpenseLedger = $this->getOrCreateSalaryExpenseLedger();

    //         // delete old entries; keep journal header
    //         $journal = Journal::firstOrCreate(
    //             ['voucher_no' => $salarySlip->voucher_number . '-ACCR'],
    //             [
    //                 'date'       => $request->date,
    //                 'narration'  => "Accrued salaries for Slip #{$salarySlip->voucher_number}",
    //                 'created_by' => auth()->id(),
    //             ]
    //         );
    //         JournalEntry::where('journal_id', $journal->id)->delete();

    //         foreach ($salarySlip->salarySlipEmployees as $line) {
    //             $amount         = $line->total_amount;
    //             $employeeLedger = AccountLedger::where('employee_id', $line->employee_id)->firstOrFail();

    //             JournalEntry::create([
    //                 'journal_id'        => $journal->id,
    //                 'account_ledger_id' => $salaryExpenseLedger->id,
    //                 'type'              => 'debit',
    //                 'amount'            => $amount,
    //                 'note'              => 'Accrued salary (updated)',
    //             ]);

    //             JournalEntry::create([
    //                 'journal_id'        => $journal->id,
    //                 'account_ledger_id' => $employeeLedger->id,
    //                 'type'              => 'credit',
    //                 'amount'            => $amount,
    //                 'note'              => 'Salary payable (updated)',
    //             ]);
    //         }
    //     });

    //     return redirect()->route('salary-slips.index')
    //         ->with('success', 'Salary slip & accrual updated successfully!');
    // }

    public function update(Request $request, SalarySlip $salarySlip)
    {
        $ids = godown_scope_ids();
        if ($ids !== null && !empty($ids) && !in_array($salarySlip->created_by, $ids)) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'voucher_number' => 'required|unique:salary_slips,voucher_number,' . $salarySlip->id,
            'date'           => 'required|date',
            'month'          => 'required|integer|min:1|max:12',
            'year'           => 'required|integer|min:2020',
            'salary_slip_employees'                     => 'required|array|min:1',
            'salary_slip_employees.*.employee_id'       => 'required|exists:employees,id',
            'salary_slip_employees.*.basic_salary'      => 'required|numeric|min:0',
            'salary_slip_employees.*.additional_amount' => 'nullable|numeric|min:0',
        ]);

        DB::transaction(function () use ($request, $salarySlip) {

            /* ───── 1. update master row ───── */
            $salarySlip->update([
                'voucher_number' => $request->voucher_number,
                'date'           => $request->date,
                'month'          => $request->month,
                'year'           => $request->year,
            ]);

            /* ───── 2. sync detail rows ───── */
            $detailRows = collect($request->salary_slip_employees)->keyBy('employee_id');

            foreach ($salarySlip->salarySlipEmployees as $line) {
                $input = $detailRows->pull($line->employee_id);
                if ($input) {
                    $line->update([
                        'basic_salary'      => $input['basic_salary'],
                        'additional_amount' => $input['additional_amount'] ?? 0,
                        'total_amount'      => $input['basic_salary'] + ($input['additional_amount'] ?? 0),
                    ]);
                } else {
                    $line->delete(); // removed from slip
                }
            }

            // any new employees added
            foreach ($detailRows as $input) {
                SalarySlipEmployee::create([
                    'salary_slip_id'    => $salarySlip->id,
                    'employee_id'       => $input['employee_id'],
                    'basic_salary'      => $input['basic_salary'],
                    'additional_amount' => $input['additional_amount'] ?? 0,
                    'total_amount'      => $input['basic_salary'] + ($input['additional_amount'] ?? 0),
                ]);
            }

            /* ───── 3. rebuild accrual journal ───── */
            $salaryExpenseLedger = $this->getOrCreateSalaryExpenseLedger();

            $journal = Journal::firstOrCreate(
                ['voucher_no' => $salarySlip->voucher_number . '-ACCR'],
                [
                    'date'       => $request->date,
                    'narration'  => "Accrued salaries for Slip #{$salarySlip->voucher_number}",
                    'created_by' => auth()->id(),
                ]
            );
            JournalEntry::where('journal_id', $journal->id)->delete();

            foreach ($salarySlip->salarySlipEmployees as $line) {
                $amount         = $line->total_amount;
                $employeeLedger = AccountLedger::where('employee_id', $line->employee_id)->firstOrFail();

                JournalEntry::create([
                    'journal_id'        => $journal->id,
                    'account_ledger_id' => $salaryExpenseLedger->id,
                    'type'              => 'debit',
                    'amount'            => $amount,
                    'note'              => 'Accrued salary (updated)',
                ]);

                JournalEntry::create([
                    'journal_id'        => $journal->id,
                    'account_ledger_id' => $employeeLedger->id,
                    'type'              => 'credit',
                    'amount'            => $amount,
                    'note'              => 'Salary payable (updated)',
                ]);
            }
        });

        return redirect()->route('salary-slips.index')
            ->with('success', 'Salary slip & accrual updated successfully!');
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


    // public function show(SalarySlip $salarySlip)
    // {
    //     $salarySlip->load([
    //         'salarySlipEmployees.employee.designation',
    //         'creator', // if you want to show who created it
    //     ]);

    //     return Inertia::render('salarySlips/show', [
    //         'salarySlip' => [
    //             'id' => $salarySlip->id,
    //             'voucher_number' => $salarySlip->voucher_number,
    //             'date' => $salarySlip->date,
    //             'month' => $salarySlip->month,
    //             'year' => $salarySlip->year,
    //             'created_at' => $salarySlip->created_at->toDateTimeString(),
    //             'employees' => $salarySlip->salarySlipEmployees->map(function ($entry) {
    //                 return [
    //                     'id' => $entry->id,
    //                     'employee_name' => $entry->employee->name,
    //                     'designation' => $entry->employee->designation->name ?? '',
    //                     'basic_salary' => $entry->basic_salary,
    //                     'additional_amount' => $entry->additional_amount,
    //                     'total_amount' => $entry->total_amount,
    //                     'paid_amount' => $entry->paid_amount,
    //                     'status' => $entry->status ?? 'Unpaid',
    //                 ];
    //             }),
    //         ]
    //     ]);
    // }

    public function show(SalarySlip $salarySlip)
    {
        $ids = godown_scope_ids();
        if ($ids !== null && !empty($ids) && !in_array($salarySlip->created_by, $ids)) {
            abort(403, 'Unauthorized');
        }

        $salarySlip->load([
            'salarySlipEmployees.employee.designation',
            'creator',
        ]);

        return Inertia::render('salarySlips/show', [
            'salarySlip' => [
                'id' => $salarySlip->id,
                'voucher_number' => $salarySlip->voucher_number,
                'date' => $salarySlip->date,
                'month' => $salarySlip->month,
                'year' => $salarySlip->year,
                'created_at' => $salarySlip->created_at->toDateTimeString(),
                'employees' => $salarySlip->salarySlipEmployees->map(function ($entry) {
                    return [
                        'id' => $entry->id,
                        'employee_name' => $entry->employee->name,
                        'designation' => $entry->employee->designation->name ?? '',
                        'basic_salary' => $entry->basic_salary,
                        'additional_amount' => $entry->additional_amount,
                        'total_amount' => $entry->total_amount,
                        'paid_amount' => $entry->paid_amount,
                        'status' => $entry->status ?? 'Unpaid',
                    ];
                }),
            ]
        ]);
    }


    // Delete salary slip
    // public function destroy(SalarySlip $salarySlip)
    // {
    //     // Delete related salary slip employees
    //     $salarySlip->salarySlipEmployees()->delete();

    //     // Delete the salary slip itself
    //     $salarySlip->delete();

    //     return redirect()->route('salary-slips.index')->with('success', 'Salary slip deleted successfully!');
    // }

    public function destroy(SalarySlip $salarySlip)
    {
        $ids = godown_scope_ids();
        if ($ids !== null && !empty($ids) && !in_array($salarySlip->created_by, $ids)) {
            abort(403, 'Unauthorized');
        }

        $salarySlip->salarySlipEmployees()->delete();
        $salarySlip->delete();

        return redirect()->route('salary-slips.index')->with('success', 'Salary slip deleted successfully!');
    }

    // public function invoice(SalarySlip $salarySlip)
    // {
    //     // Ensure salarySlipEmployees and related employee are loaded
    //     $salarySlip->load('salarySlipEmployees.employee');

    //     return Inertia::render('salarySlips/invoice', [
    //         'salarySlip' => $salarySlip
    //     ]);
    // }

    public function invoice(SalarySlip $salarySlip)
    {
        $ids = godown_scope_ids();
        if ($ids !== null && !empty($ids) && !in_array($salarySlip->created_by, $ids)) {
            abort(403, 'Unauthorized');
        }

        $salarySlip->load('salarySlipEmployees.employee');

        return Inertia::render('salarySlips/invoice', [
            'salarySlip' => $salarySlip
        ]);
    }

}
