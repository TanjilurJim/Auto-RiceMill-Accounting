<?php

namespace App\Http\Controllers;

use App\Models\SalarySlip;
use App\Models\SalarySlipEmployee;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalarySlipController extends Controller
{
    // Show list of salary slips
    public function index()
    {
        $salarySlips = SalarySlip::with(['salarySlipEmployees.employee.designation']) // 👈 Ensure nested relationship
            ->when(!auth()->user()->hasRole('admin'), function ($query) {
                $query->where('created_by', auth()->id());
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->appends(request()->query());

        $employees = Employee::with('designation')
            ->select('id', 'name', 'designation_id')
            ->when(!auth()->user()->hasRole('admin'), function ($q) {
                $q->where('created_by', auth()->id());
            })
            ->get();

        return Inertia::render('salarySlips/index', [
            'salarySlips' => $salarySlips,
            'employees' => $employees,
        ]);
    }

    // Show create form
    public function create()
    {
        $employees = Employee::with('designation')
            ->select('id', 'name', 'salary', 'designation_id')
            ->when(!auth()->user()->hasRole('admin'), function ($q) {
                $q->where('created_by', auth()->id());
            })
            ->get();

        return Inertia::render('salarySlips/create', [
            'employees' => $employees
        ]);
    }

    // Store salary slip
    public function store(Request $request)
    {
        // Validate the request data
        $request->validate([
            'voucher_number' => 'required|unique:salary_slips,voucher_number',
            'date' => 'required|date',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2020',
            'salary_slip_employees' => 'required|array|min:1',
            'salary_slip_employees.*.employee_id' => 'required|exists:employees,id',
            'salary_slip_employees.*.basic_salary' => 'required|numeric|min:0',
            'salary_slip_employees.*.additional_amount' => 'nullable|numeric|min:0',
        ]);

        // Create the salary slip
        $salarySlip = SalarySlip::create([
            'voucher_number' => $request->voucher_number,
            'date' => $request->date,
            'month' => $request->month,
            'year' => $request->year,
            'created_by' => auth()->id(),
        ]);

        // Save each employee's salary details
        foreach ($request->salary_slip_employees as $employeeData) {
            SalarySlipEmployee::create([
                'salary_slip_id' => $salarySlip->id,
                'employee_id' => $employeeData['employee_id'],
                'basic_salary' => $employeeData['basic_salary'],
                'additional_amount' => $employeeData['additional_amount'] ?? 0,
                'total_amount' => floatval($employeeData['basic_salary']) + floatval($employeeData['additional_amount'] ?? 0),
            ]);
        }

        return redirect()->route('salary-slips.index')->with('success', 'Salary slip created successfully!');
    }

    // Show salary slip edit form
    public function edit(SalarySlip $salarySlip)
    {
        // Load employees associated with the salary slip
        $salarySlip->load('salarySlipEmployees.employee');

        // Fetch all employees for the edit form
        $employees = Employee::all();

        return Inertia::render('salarySlips/edit', [
            'salarySlip' => $salarySlip,
            'employees' => $employees
        ]);
    }

    // Update salary slip
    public function update(Request $request, SalarySlip $salarySlip)
    {
        // Validate the request data
        $request->validate([
            'voucher_number' => 'required|unique:salary_slips,voucher_number,' . $salarySlip->id,
            'date' => 'required|date',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2020',
            'salary_slip_employees' => 'required|array|min:1',
            'salary_slip_employees.*.employee_id' => 'required|exists:employees,id',
            'salary_slip_employees.*.basic_salary' => 'required|numeric|min:0',
            'salary_slip_employees.*.additional_amount' => 'nullable|numeric|min:0',
        ]);

        // Update the salary slip
        $salarySlip->update([
            'voucher_number' => $request->voucher_number,
            'date' => $request->date,
            'month' => $request->month,
            'year' => $request->year,
            'created_by' => auth()->id(),
        ]);

        // Update each employee's salary details
        foreach ($request->salary_slip_employees as $employeeData) {
            $salarySlipEmployee = SalarySlipEmployee::where('salary_slip_id', $salarySlip->id)
                ->where('employee_id', $employeeData['employee_id'])
                ->first();

            if ($salarySlipEmployee) {
                $salarySlipEmployee->update([
                    'basic_salary' => $employeeData['basic_salary'],
                    'additional_amount' => $employeeData['additional_amount'] ?? 0,
                    'total_amount' => $employeeData['basic_salary'] + ($employeeData['additional_amount'] ?? 0),
                ]);
            }
        }

        return redirect()->route('salary-slips.index')->with('success', 'Salary slip updated successfully!');
    }

    // Delete salary slip
    public function destroy(SalarySlip $salarySlip)
    {
        // Delete related salary slip employees
        $salarySlip->salarySlipEmployees()->delete();

        // Delete the salary slip itself
        $salarySlip->delete();

        return redirect()->route('salary-slips.index')->with('success', 'Salary slip deleted successfully!');
    }

    public function invoice(SalarySlip $salarySlip)
    {
        // Ensure salarySlipEmployees and related employee are loaded
        $salarySlip->load('salarySlipEmployees.employee');

        return Inertia::render('salarySlips/invoice', [
            'salarySlip' => $salarySlip
        ]);
    }
}
