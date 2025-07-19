<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SalaryOwedController extends Controller
{
        /* ───────────────── Index ───────────────── */
        public function index(Request $request)
        {
                $employees = Employee::query()
                        ->select('id', 'name')

                        // keep the two sums if you still want to show them in the UI
                        ->addSelect([
                                'gross_sum' => DB::table('salary_slip_employees')
                                        ->selectRaw('SUM(total_amount)')
                                        ->whereColumn('employee_id', 'employees.id'),
                                'paid_sum'  => DB::table('salary_slip_employees')
                                        ->selectRaw('SUM(paid_amount)')
                                        ->whereColumn('employee_id', 'employees.id'),
                        ])

                        // compute outstanding WITHOUT relying on those aliases
                        ->addSelect(DB::raw('
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                        COALESCE((
                                                                                                                                                                                                                                                            SELECT SUM(total_amount)
                                                                                                                                                                                                                                                                                FROM salary_slip_employees
                                                                                                                                                                                                                                                                                                    WHERE employee_id = employees.id
                                                                                                                                                                                                                                                                                                                    ),0)
                                                                                                                                                                                                                                                                                                                                  - COALESCE((
                                                                                                                                                                                                                                                                                                                                                      SELECT SUM(paid_amount)
                                                                                                                                                                                                                                                                                                                                                                          FROM salary_slip_employees
                                                                                                                                                                                                                                                                                                                                                                                              WHERE employee_id = employees.id
                                                                                                                                                                                                                                                                                                                                                                                                              ),0)
                                                                                                                                                                                                                                                                                                                                                                                                                          ) AS outstanding
                                                                                                                                                                                                                                                                                                                                                                                                                                  '))

                        ->having('outstanding', '>', 0)
                        ->orderByDesc('outstanding')
                        ->paginate(15)
                        ->withQueryString();


                $totals = [
                        'headcount'   => $employees->total(),

                        // If you kept gross_sum / paid_sum aliases:
                        'gross'       => $employees->getCollection()->sum('gross_sum'),
                        'paid'        => $employees->getCollection()->sum('paid_sum'),
                        'outstanding' => $employees->getCollection()->sum('outstanding'),

                        // If you dropped the aliases, compute on the fly:
                        'gross' => $employees->getCollection()->sum(fn($e) => $e->gross),
                ];

                return Inertia::render('salaryOwed/index', [
                        'employees' => $employees,
                        'totals'    => $totals,
                ]);
        }

        /* ───────────────── Detail ───────────────── */
        public function show(Employee $employee)
        {
                $employee->load([
                        'salarySlipEmployees' => fn($q) =>
                        $q->with('salarySlip')
                                ->orderByDesc('id'),

                        // 👇 add receivedMode inside the nested with()
                        'salarySlipEmployees.receives' => fn($q) =>
                        $q->with('receivedMode')        // <── NEW
                                ->orderBy('date'),

                        'department:id,name',
                        'designation:id,name',
                ]);

                /* ── totals for the header cards ─────────────────────────── */
                $gross      = $employee->salarySlipEmployees->sum('total_amount');
                $paid       = $employee->salarySlipEmployees->sum('paid_amount');
                $outstanding = max(0, $gross - $paid);

                return Inertia::render('salaryOwed/show', [
                        'employee' => [
                                'id'                    => $employee->id,
                                'name'                  => $employee->name,
                                'gross_salary'          => $gross,
                                'salary_paid'           => $paid,
                                'salary_outstanding'    => $outstanding,
                                'salary_slip_employees' => $employee->salarySlipEmployees,
                        ],
                ]);
        }
}
