<?php

namespace App\Http\Controllers;

use App\Models\SalarySlip;
use App\Models\SalarySlipEmployee;
use App\Models\Employee;
use Illuminate\Http\Request;
use App\Models\FinancialYear;
use Carbon\Carbon;

use Inertia\Inertia;
use App\Models\Journal;
use App\Models\JournalEntry;
use App\Models\AccountLedger;
use App\Models\AccountGroup;
use App\Models\GroupUnder;
use Illuminate\Validation\ValidationException;
use App\Models\Nature;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

use function godown_scope_ids;

class SalarySlipController extends Controller
{


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




    public function create()
    {
        $ids = godown_scope_ids();

        $employees = Employee::with('designation')
            ->select('id', 'name', 'salary', 'designation_id')
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->get()
            ->map(function ($e) {        // 👈 include accessor in payload
                return [
                    'id'               => $e->id,
                    'name'             => $e->name,
                    'salary'           => $e->salary,
                    'advance_balance'  => $e->advance_balance,  // 👈 NEW
                    'designation'      => $e->designation?->only('name'),
                ];
            });

        $currentFy = FinancialYear::where('is_closed', false)->orderByDesc('start_date')->first();

        return Inertia::render('salarySlips/create', [
            'employees' => $employees,
            'current_financial_year' => $currentFy ? [
                'id' => $currentFy->id,
                'start_date' => $currentFy->start_date->toDateString(),
                'end_date' => $currentFy->end_date->toDateString(),
            ] : null,
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
            'is_advance'     => 'sometimes|boolean',
            'salary_slip_employees'                     => 'required|array|min:1',
            'salary_slip_employees.*.employee_id'       => 'required|exists:employees,id',
            'salary_slip_employees.*.basic_salary'      => 'required|numeric|min:0',
            'salary_slip_employees.*.additional_amount' => 'nullable|numeric|min:0',
        ]);

        // Early guard: ensure there is an open financial year and the requested period sits inside it
        $currentFy = FinancialYear::where('is_closed', false)->orderByDesc('start_date')->first();
        if (! $currentFy) {
            throw ValidationException::withMessages(['financial_year' => 'No open financial year. Contact admin.']);
        }

        try {
            $periodDate = Carbon::create((int)$request->year, (int)$request->month, 1)->startOfDay();
        } catch (\Exception $e) {
            throw ValidationException::withMessages(['month' => 'Invalid salary period (month/year).']);
        }

        $fyStart = Carbon::parse($currentFy->start_date)->startOfDay();
        $fyEnd   = Carbon::parse($currentFy->end_date)->endOfDay();

        if (! $periodDate->between($fyStart, $fyEnd)) {
            throw ValidationException::withMessages([
                'month' => "Selected salary period ({$periodDate->toDateString()}) is outside the open financial year ({$fyStart->toDateString()} - {$fyEnd->toDateString()}).",
            ]);
        }

        // ❗ guard: prevent duplicate slips for same employee in same period
        $empIds = collect($request->input('salary_slip_employees', []))
            ->pluck('employee_id')
            ->filter()
            ->unique()
            ->values();

        $month = (int) $request->month;
        $year  = (int) $request->year;

        $ids = godown_scope_ids();

        $dupes = \App\Models\SalarySlipEmployee::query()
            ->whereIn('employee_id', $empIds)
            ->whereHas('salarySlip', function ($q) use ($month, $year, $ids) {
                $q->where('month', $month)
                    ->where('year',  $year)
                    ->when($ids !== null && !empty($ids), fn($qq) => $qq->whereIn('created_by', $ids));
            })
            ->with('employee:id,name')
            ->get();

        if ($dupes->isNotEmpty()) {
            $names = $dupes->pluck('employee.name')->filter()->unique()->values()->all();
            throw ValidationException::withMessages([
                'salary_slip_employees' => ['Already created for this period: ' . implode(', ', $names)],
            ]);
        }

        DB::transaction(function () use ($request, $currentFy) {
            $salarySlip = SalarySlip::create([
                'voucher_number'   => $request->voucher_number,
                'date'             => $request->date,
                'month'            => $request->month,
                'year'             => $request->year,
                'is_advance'       => (bool) $request->boolean('is_advance'),
                'financial_year_id' => $currentFy->id, // persist current open FY
                'created_by'       => auth()->id(),
            ]);

            foreach ($request->salary_slip_employees as $row) {
                \App\Models\SalarySlipEmployee::create([
                    'salary_slip_id'    => $salarySlip->id,
                    'employee_id'       => $row['employee_id'],
                    'basic_salary'      => $row['basic_salary'],
                    'additional_amount' => $row['additional_amount'] ?? 0,
                    'total_amount'      => $row['basic_salary'] + ($row['additional_amount'] ?? 0),
                ]);
            }

            // Journal: DR expense, CR employee liability
            $salaryExpenseLedger = $this->getOrCreateSalaryExpenseLedger();

            $journal = \App\Models\Journal::create([
                'date'       => $request->date,
                'voucher_no' => 'JRN-' . Str::upper(Str::random(6)),
                'narration'  => "Accrued salaries for Slip #{$salarySlip->voucher_number}",
                'created_by' => auth()->id(),
            ]);

            foreach ($salarySlip->salarySlipEmployees as $line) {
                $amount = (float)$line->total_amount;

                $liability = \App\Models\AccountLedger::where('employee_id', $line->employee_id)
                    ->where('ledger_type', 'employee')
                    ->firstOrFail();

                // DR Salary Expense
                \App\Models\JournalEntry::create([
                    'journal_id'        => $journal->id,
                    'account_ledger_id' => $salaryExpenseLedger->id,
                    'type'              => 'debit',
                    'amount'            => $amount,
                    'note'              => 'Accrued salary',
                ]);

                // CR Employee Liability (full)
                \App\Models\JournalEntry::create([
                    'journal_id'        => $journal->id,
                    'account_ledger_id' => $liability->id,
                    'type'              => 'credit',
                    'amount'            => $amount,
                    'note'              => 'Salary payable',
                ]);
            }
        });

        return redirect()->route('salary-slips.index')
            ->with('success', 'Salary slip created and accrued successfully!');
    }






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
            'is_advance'     => 'sometimes|boolean',
            'salary_slip_employees'                     => 'required|array|min:1',
            'salary_slip_employees.*.employee_id'       => 'required|exists:employees,id',
            'salary_slip_employees.*.basic_salary'      => 'required|numeric|min:0',
            'salary_slip_employees.*.additional_amount' => 'nullable|numeric|min:0',
            // ⬆️ no advance_adjusted in the new model
        ]);

        $empIds = collect($request->input('salary_slip_employees', []))
            ->pluck('employee_id')->filter()->unique()->values();

        $month = (int) $request->month;
        $year  = (int) $request->year;
        $ids   = godown_scope_ids();

        $dupes = \App\Models\SalarySlipEmployee::query()
            ->whereIn('employee_id', $empIds)
            ->whereHas('salarySlip', function ($q) use ($month, $year, $salarySlip, $ids) {
                $q->where('month', $month)
                    ->where('year',  $year)
                    ->where('id', '<>', $salarySlip->id)
                    ->when($ids !== null && !empty($ids), fn($qq) => $qq->whereIn('created_by', $ids));
            })
            ->with('employee:id,name')
            ->get();

        if ($dupes->isNotEmpty()) {
            $names = $dupes->pluck('employee.name')->filter()->unique()->values()->all();
            throw ValidationException::withMessages([
                'salary_slip_employees' => ['Already created for this period in another slip: ' . implode(', ', $names)],
            ]);
        }

        DB::transaction(function () use ($request, $salarySlip) {

            /* 1) Update master */
            $salarySlip->update([
                'voucher_number' => $request->voucher_number,
                'date'           => $request->date,
                'month'          => $request->month,
                'year'           => $request->year,
                // If you added columns for the advance metadata, include them here:
                'is_advance'    => (bool)$request->is_advance,
                // 'advance_month' => $request->advance_month,
                // 'advance_year'  => $request->advance_year,
            ]);

            /* 2) Build keyed incoming rows and totals */
            $incoming = collect($request->salary_slip_employees)
                ->map(function ($r) {
                    $basic = (float)($r['basic_salary'] ?? 0);
                    $add   = (float)($r['additional_amount'] ?? 0);
                    $r['total_amount'] = $basic + $add;
                    return $r;
                })
                ->keyBy('employee_id');

            /* 2a) Guards: cannot delete a line with payments; cannot reduce below paid */
            foreach ($salarySlip->salarySlipEmployees as $line) {
                $alreadyPaid = \App\Models\SalaryReceive::where('salary_slip_employee_id', $line->id)->sum('amount');

                if ($incoming->has($line->employee_id)) {
                    $newTotal = (float)$incoming[$line->employee_id]['total_amount'];
                    if ($newTotal < $alreadyPaid) {
                        throw \Illuminate\Validation\ValidationException::withMessages([
                            'salary_slip_employees' =>
                            ["Employee ID {$line->employee_id}: total ("
                                . number_format($newTotal, 2)
                                . ") cannot be less than already paid ("
                                . number_format($alreadyPaid, 2) . ")."],
                        ]);
                    }
                } else {
                    // row would be deleted
                    if ($alreadyPaid > 0) {
                        throw \Illuminate\Validation\ValidationException::withMessages([
                            'salary_slip_employees' =>
                            ["Employee ID {$line->employee_id}: cannot remove a row that already has payments."],
                        ]);
                    }
                }
            }

            /* 3) Sync detail rows (update / delete) */
            foreach ($salarySlip->salarySlipEmployees as $line) {
                $input = $incoming->pull($line->employee_id);
                if ($input) {
                    $line->update([
                        'basic_salary'      => $input['basic_salary'],
                        'additional_amount' => $input['additional_amount'] ?? 0,
                        'total_amount'      => $input['total_amount'],
                    ]);
                } else {
                    $line->delete();
                }
            }

            /* 3b) Create remaining new rows */
            foreach ($incoming as $input) {
                \App\Models\SalarySlipEmployee::create([
                    'salary_slip_id'    => $salarySlip->id,
                    'employee_id'       => $input['employee_id'],
                    'basic_salary'      => $input['basic_salary'],
                    'additional_amount' => $input['additional_amount'] ?? 0,
                    'total_amount'      => $input['total_amount'],
                ]);
            }

            /* 4) Rebuild accrual journal: DR Expense, CR Employee Liability (no advance split) */
            $salaryExpenseLedger = $this->getOrCreateSalaryExpenseLedger();

            $journal = \App\Models\Journal::firstOrCreate(
                ['voucher_no' => $salarySlip->voucher_number . '-ACCR'],
                [
                    'date'       => $request->date,
                    'narration'  => "Accrued salaries for Slip #{$salarySlip->voucher_number}",
                    'created_by' => auth()->id(),
                ]
            );

            $journal->update([
                'date'      => $request->date,
                'narration' => "Accrued salaries for Slip #{$salarySlip->voucher_number} (updated)",
            ]);

            \App\Models\JournalEntry::where('journal_id', $journal->id)->delete();

            $salarySlip->load('salarySlipEmployees');

            foreach ($salarySlip->salarySlipEmployees as $line) {
                $amount = (float)$line->total_amount;

                $liabLedger = \App\Models\AccountLedger::where('employee_id', $line->employee_id)
                    ->where('ledger_type', 'employee')
                    ->firstOrFail();

                // DR Salary Expense
                \App\Models\JournalEntry::create([
                    'journal_id'        => $journal->id,
                    'account_ledger_id' => $salaryExpenseLedger->id,
                    'type'              => 'debit',
                    'amount'            => $amount,
                    'note'              => 'Accrued salary (updated)',
                ]);

                // CR Employee Liability (full)
                \App\Models\JournalEntry::create([
                    'journal_id'        => $journal->id,
                    'account_ledger_id' => $liabLedger->id,
                    'type'              => 'credit',
                    'amount'            => $amount,
                    'note'              => 'Salary payable (updated)',
                ]);
            }

            /* 5) Refresh paid & status after edits (so list views stay accurate) */
            foreach ($salarySlip->salarySlipEmployees as $line) {
                $paid = \App\Models\SalaryReceive::where('salary_slip_employee_id', $line->id)->sum('amount');
                $line->paid_amount = $paid;
                $line->status = match (true) {
                    $paid <= 0 => 'Unpaid',
                    $paid >= (float)$line->total_amount => 'Paid',
                    default => 'Partially Paid',
                };
                $line->save();
            }
        });

        return redirect()
            ->route('salary-slips.index')
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
                        'advance_adjusted' => $entry->advance_adjusted,
                        'net_payable'      => $entry->net_payable,
                    ];
                }),
            ]
        ]);
    }




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
