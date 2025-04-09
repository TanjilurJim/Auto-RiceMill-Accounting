<?php

namespace App\Http\Controllers;

use App\Models\SalaryReceive;
use App\Models\Employee;
use App\Models\ReceivedMode;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalaryReceiveController extends Controller
{
    // Show the list of salary receives
    public function index()
    {
        $salaryReceives = SalaryReceive::with('employee', 'receivedMode')->paginate(10);
        return Inertia::render('salaryReceives/index', [
            'salaryReceives' => $salaryReceives
        ]);
    }

    // Show the create form
    public function create()
    {
        $employees = Employee::all();
        $receivedModes = ReceivedMode::all();
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

        SalaryReceive::create($request->all());

        return redirect()->route('salary-receives.index')->with('success', 'Salary received successfully!');
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
        $salaryReceive->load('employee', 'receivedMode');
        
        return Inertia::render('salaryReceives/invoice', [
            'salaryReceive' => $salaryReceive
        ]);
    }
}
