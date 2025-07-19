<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EmployeeReportController extends Controller
{
    /** Salary paid vs. outstanding grouped by month */
    public function index(Request $request)
    {
        // employee selector (“all” by default)
        $employeeId = $request->integer('employee_id') ?: null;

        /* ── Build base query over salary_slip_employees ───────── */
        $slips = DB::table('salary_slip_employees as sse')
            ->join('salary_slips as ss', 'ss.id', '=', 'sse.salary_slip_id')
            ->selectRaw('
                ss.year,
                ss.month,
                SUM(sse.total_amount)        AS gross,
                SUM(sse.paid_amount)         AS paid
            ')
            ->when($employeeId, fn($q) => $q->where('sse.employee_id', $employeeId))
            ->groupBy('ss.year', 'ss.month')
            ->orderByDesc('ss.year')
            ->orderByDesc('ss.month');

        $rows = $slips->get()
            ->map(fn($r) => [
                'year'        => $r->year,
                'month'       => $r->month,
                'gross'       => (float) $r->gross,
                'paid'        => (float) $r->paid,
                'outstanding' => max(0, $r->gross - $r->paid),
            ]);

        // header totals
        $totals = [
            'gross'       => $rows->sum('gross'),
            'paid'        => $rows->sum('paid'),
            'outstanding' => $rows->sum('outstanding'),
        ];

        return Inertia::render('employee-reports/index', [
            'rows'        => $rows,
            'employees'   => Employee::select('id', 'name')->orderBy('name')->get(),
            'selectedId'  => $employeeId,
            'totals'      => $totals,
        ]);
    }
}
