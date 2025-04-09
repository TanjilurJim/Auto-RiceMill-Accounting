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
        // Paginate salary slips with employee details
        $salarySlips = SalarySlip::with('salarySlipEmployees.employee')
            ->orderBy('date', 'desc')
            ->paginate(10);
        // dd($salarySlips);

        return Inertia::render('salarySlips/index', [
            'salarySlips' => $salarySlips
        ]);
    }

    // Show create form
    public function create()
    {
        // Fetch all employees to assign to salary slips
        $employees = Employee::all();
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
            'salary_slip_employees' => 'required|array|min:1',
            'salary_slip_employees.*.employee_id' => 'required|exists:employees,id',
            'salary_slip_employees.*.basic_salary' => 'required|numeric|min:0',
            'salary_slip_employees.*.additional_amount' => 'nullable|numeric|min:0',
        ]);

        // Create the salary slip
        $salarySlip = SalarySlip::create([
            'voucher_number' => $request->voucher_number,
            'date' => $request->date,
            'created_by' => auth()->id(),
        ]);

        // Save each employee's salary details
        foreach ($request->salary_slip_employees as $employeeData) {
            SalarySlipEmployee::create([
                'salary_slip_id' => $salarySlip->id,
                'employee_id' => $employeeData['employee_id'],
                'basic_salary' => $employeeData['basic_salary'],
                'additional_amount' => $employeeData['additional_amount'] ?? 0,
                'total_amount' => $employeeData['basic_salary'] + ($employeeData['additional_amount'] ?? 0),
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
            'salary_slip_employees' => 'required|array|min:1',
            'salary_slip_employees.*.employee_id' => 'required|exists:employees,id',
            'salary_slip_employees.*.basic_salary' => 'required|numeric|min:0',
            'salary_slip_employees.*.additional_amount' => 'nullable|numeric|min:0',
        ]);

        // Update the salary slip
        $salarySlip->update([
            'voucher_number' => $request->voucher_number,
            'date' => $request->date,
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
