<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\SalarySlip;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeReportController extends Controller
{
    public function index(Request $request)
    {
        $employeeId = $request->integer('employee_id') ?: null;
        $type       = $request->string('type')->toString() ?: 'all';
        $ids        = user_scope_ids(); // [] => admin

        $firstDayExpr = "STR_TO_DATE(CONCAT(salary_slips.year,'-',LPAD(salary_slips.month,2,'0'),'-01'), '%Y-%m-%d')";

        // ── MAIN MONTHLY ROLLUP ───────────────────────────────────────
        $q = SalarySlip::query()
            ->join('salary_slip_employees as sse', 'sse.salary_slip_id', '=', 'salary_slips.id')
            ->leftJoin('salary_receives as sr', function ($join) use ($ids) {
                $join->on('sr.salary_slip_employee_id', '=', 'sse.id');
                if ($ids) {
                    $join->whereIn('sr.created_by', $ids); // left-join scoped safely
                }
            })
            ->selectRaw("
                salary_slips.year,
                salary_slips.month,
                SUM(sse.total_amount) AS gross,
                SUM(COALESCE(sr.amount,0)) AS paid,
                SUM(CASE WHEN sr.id IS NOT NULL AND sr.date <  $firstDayExpr THEN sr.amount ELSE 0 END) AS paid_advance,
                SUM(CASE WHEN sr.id IS NOT NULL AND sr.date >= $firstDayExpr THEN sr.amount ELSE 0 END) AS paid_regular
            ")
            ->when($employeeId, fn($q) => $q->where('sse.employee_id', $employeeId))
            ->groupBy('salary_slips.year', 'salary_slips.month')
            ->orderByDesc('salary_slips.year')->orderByDesc('salary_slips.month');

        if ($type === 'advance') {
            $q->havingRaw('paid_advance > 0');
        } elseif ($type === 'regular') {
            $q->havingRaw('paid > 0 AND paid_advance = 0');
        }

        $rows = $q->toBase()->get()->map(fn($r) => [
            'year'         => (int) $r->year,
            'month'        => (int) $r->month,
            'gross'        => (float) $r->gross,
            'paid'         => (float) $r->paid,
            'paid_advance' => (float) $r->paid_advance,
            'paid_regular' => (float) $r->paid_regular,
            'outstanding'  => max(0, (float) $r->gross - (float) $r->paid),
            'has_advance'  => (float) $r->paid_advance > 0,
        ]);

        $totals = [
            'gross'       => $rows->sum('gross'),
            'paid'        => $rows->sum('paid'),
            'advance'     => $rows->sum('paid_advance'),
            'regular'     => $rows->sum('paid_regular'),
            'outstanding' => $rows->sum('outstanding'),
        ];

        // ── ADVANCE RECEIVERS ────────────────────────────────────────
        $empAdvances = SalarySlip::query()
            ->join('salary_slip_employees as sse', 'sse.salary_slip_id', '=', 'salary_slips.id')
            ->leftJoin('salary_receives as sr', function ($join) use ($ids) {
                $join->on('sr.salary_slip_employee_id', '=', 'sse.id');
                if ($ids) {
                    $join->whereIn('sr.created_by', $ids);
                }
            })
            ->join('employees as e', 'e.id', '=', 'sse.employee_id')
            ->when($employeeId, fn($q) => $q->where('sse.employee_id', $employeeId))
            ->selectRaw("
                sse.employee_id,
                e.name,
                SUM(CASE WHEN sr.id IS NOT NULL AND sr.date < $firstDayExpr THEN sr.amount ELSE 0 END) AS advance_paid
            ")
            ->groupBy('sse.employee_id', 'e.name')
            ->havingRaw('advance_paid > 0')
            ->orderByDesc('advance_paid')
            ->toBase()
            ->get();

        // Tenant-scoped by model automatically
        $employeeList = Employee::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('employee-reports/index', [
            'rows'        => $rows,
            'employees'   => $employeeList,
            'selectedId'  => $employeeId,
            'totals'      => $totals,
            'type'        => $type,
            'empAdvances' => $empAdvances,
        ]);
    }
}
