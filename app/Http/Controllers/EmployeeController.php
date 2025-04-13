<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Shift;
use App\Models\Reference;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\AccountGroup;
use App\Models\GroupUnder;
use App\Models\Nature;
use App\Models\AccountLedger;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class EmployeeController extends Controller
{
    public function index()
    {
        // Fetch all employees with related data (department, designation, shift, reference_by)
        $employees = Employee::query()
            ->with('department', 'designation', 'shift', 'referenceBy')
            ->when(!auth()->user()->hasRole('admin'), function ($query) {
                $query->where('created_by', auth()->id());
            })
            ->get();

        // Return Inertia view with employee data
        return Inertia::render('employees/index', [
            'employees' => $employees
        ]);
    }

    public function create()
    {
        // Fetch all the required relations data (departments, designations, shifts, references)
        $departments = Department::when(!auth()->user()->hasRole('admin'), function ($q) {
            $q->where('created_by', auth()->id());
        })->get();
        $designations = Designation::when(!auth()->user()->hasRole('admin'), function ($q) {
            $q->where('created_by', auth()->id());
        })->get();
        $shifts = Shift::when(!auth()->user()->hasRole('admin'), function ($q) {
            $q->where('created_by', auth()->id());
        })->get();
        $references = Employee::when(!auth()->user()->hasRole('admin'), function ($q) {
            $q->where('created_by', auth()->id());
        })->get(); // Assuming employees can refer to other employees

        // Return the create view
        return Inertia::render('employees/create', [
            'departments' => $departments,
            'designations' => $designations,
            'shifts' => $shifts,
            'references' => $references,
        ]);
    }

    public function store(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'name' => 'required|string|max:255',
            'mobile' => 'required|string|max:15',
            'email' => 'required|email|max:255|unique:employees,email',
            'nid' => 'required|string|max:20|unique:employees,nid',
            'present_address' => 'required|string|max:255',
            'permanent_address' => 'required|string|max:255',
            'salary' => 'required|numeric',
            'joining_date' => 'required|date',
            'status' => 'required|in:Active,Inactive',
            'advance_amount' => 'nullable|numeric',
            'department_id' => 'required|exists:departments,id',
            'designation_id' => 'required|exists:designations,id',
            'shift_id' => 'required|exists:shifts,id',
            'reference_by' => 'nullable|exists:employees,id', // Optional: Employee who referred
        ]);

        // Create a new employee
        DB::transaction(function () use ($request) {
            $employee = Employee::create([
                'name' => $request->name,
                'mobile' => $request->mobile,
                'email' => $request->email,
                'nid' => $request->nid,
                'present_address' => $request->present_address,
                'permanent_address' => $request->permanent_address,
                'salary' => $request->salary,
                'joining_date' => $request->joining_date,
                'status' => $request->status,
                'advance_amount' => $request->advance_amount,
                'department_id' => $request->department_id,
                'designation_id' => $request->designation_id,
                'shift_id' => $request->shift_id,
                'reference_by' => $request->reference_by,
                'created_by' => auth()->id(),
            ]);

            // 🌟 Auto-create Ledger for Employee
            $groupUnder = GroupUnder::where('name', 'Indirect Expenses')->firstOrFail();
            $nature = Nature::where('name', 'Expenses')->firstOrFail();

            $accountGroup = AccountGroup::firstOrCreate(
                ['name' => 'Employee Salary Expense'],
                [
                    'nature_id' => $nature->id,
                    'group_under_id' => $groupUnder->id,
                    'description' => 'Ledger group for employee salary tracking',
                    'created_by' => auth()->id(),
                ]
            );

            AccountLedger::create([
                'employee_id' => $employee->id,
                'account_ledger_name' => $employee->name,
                'phone_number' => $employee->mobile ?? '0000000000',
                'email' => $employee->email ?? 'employee@example.com',
                'opening_balance' => 0,
                'debit_credit' => 'debit',
                'status' => 'active',
                'account_group_id' => $accountGroup->id,
                'group_under_id' => $groupUnder->id,
                'address' => $employee->present_address,
                'for_transition_mode' => false,
                'mark_for_user' => false,
                'created_by' => auth()->id(),
            ]);
        });
        // Redirect with a success message
        return redirect()->route('employees.index')->with('success', 'Employee created successfully.');
    }

    public function edit(Employee $employee)
    {
        if (!auth()->user()->hasRole('admin') && $employee->created_by !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        $departments = Department::all();
        $designations = Designation::all();
        $shifts = Shift::all();
        $references = Employee::all();

        return Inertia::render('employees/edit', [
            'employee' => $employee,
            'departments' => $departments,
            'designations' => $designations,
            'shifts' => $shifts,
            'references' => $references,
        ]);
    }

    public function update(Request $request, Employee $employee)
    {
        // Validate the incoming request
        $request->validate([
            'name' => 'required|string|max:255',
            'mobile' => 'required|string|max:15',
            'email' => 'required|email|max:255|unique:employees,email,' . $employee->id,
            'nid' => 'required|string|max:20|unique:employees,nid,' . $employee->id,
            'present_address' => 'required|string|max:255',
            'permanent_address' => 'required|string|max:255',
            'salary' => 'required|numeric',
            'joining_date' => 'required|date',
            'status' => 'required|in:Active,Inactive',
            'advance_amount' => 'nullable|numeric',
            'department_id' => 'required|exists:departments,id',
            'designation_id' => 'required|exists:designations,id',
            'shift_id' => 'required|exists:shifts,id',
            'reference_by' => 'nullable|exists:employees,id', // Optional: Employee who referred
        ]);

        // Update the employee
        $employee->update([
            'name' => $request->name,
            'mobile' => $request->mobile,
            'email' => $request->email,
            'nid' => $request->nid,
            'present_address' => $request->present_address,
            'permanent_address' => $request->permanent_address,
            'salary' => $request->salary,
            'joining_date' => $request->joining_date,
            'status' => $request->status,
            'advance_amount' => $request->advance_amount,
            'department_id' => $request->department_id,
            'designation_id' => $request->designation_id,
            'shift_id' => $request->shift_id,
            'reference_by' => $request->reference_by,
        ]);

        // Redirect with a success message
        return redirect()->route('employees.index')->with('success', 'Employee updated successfully.');
    }

    public function destroy(Employee $employee)
    {
        // Delete the employee
        $employee->delete();

        // Redirect with a success message
        return redirect()->route('employees.index')->with('success', 'Employee deleted successfully.');
    }
}
