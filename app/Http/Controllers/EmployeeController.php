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
        $employees = Employee::with('department', 'designation', 'shift', 'referenceBy')
            ->withSum('salarySlipEmployees as gross', 'total_amount')
            ->withSum('salarySlipEmployees as paid',  'paid_amount')
            ->addSelect(DB::raw('
            (SELECT COALESCE(SUM(total_amount - paid_amount),0)
             FROM salary_slip_employees sse
             WHERE sse.employee_id = employees.id
            ) AS outstanding
        '))
            ->orderByDesc('outstanding')
            ->paginate(15)
            ->withQueryString();   // keeps future filters

        return Inertia::render('employees/index', compact('employees'));
    }

    public function create()
    {
        // Global scope already limits rows to the child’s tenant set
        $departments  = Department::all();
        $designations = Designation::all();
        $shifts       = Shift::all();
        $references   = Employee::all();   // Employee already has the trait

        return Inertia::render('employees/create', [
            'departments'  => $departments,
            'designations' => $designations,
            'shifts'       => $shifts,
            'references'   => $references,
        ]);
    }

    public function store(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'name' => 'required|string|max:255',
            'mobile' => 'required|string|max:15',
            'email' => 'required|email|max:255|unique:employees,email',
            'nid' => 'nullable|string|max:20|unique:employees,nid',
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

            //  Auto-create Ledger for Employee
            $groupUnder = GroupUnder::where('name', 'Sundry Creditors')->firstOrFail();
            $nature     = Nature::where('name', 'Liabilities')->firstOrFail();

            $accountGroup = AccountGroup::firstOrCreate(
                ['name' => 'Employee Liability'],
                [
                    'nature_id'      => $nature->id,
                    'group_under_id' => $groupUnder->id,
                    'description'    => 'Employee salary payable accounts',
                    'created_by'     => auth()->id(),
                ]
            );

            AccountLedger::create([
                'employee_id'         => $employee->id,
                'account_ledger_name' => $employee->name,
                'phone_number'        => $employee->mobile ?? '0000000000',
                'email'               => $employee->email  ?? 'employee@example.com',
                'opening_balance'     => 0,
                'debit_credit'        => 'credit',          // ← liability nature
                'status'              => 'active',
                'account_group_id'    => $accountGroup->id,
                'group_under_id'      => $groupUnder->id,
                'address'             => $employee->present_address,
                'ledger_type'         => 'employee',        // ← key line
                'for_transition_mode' => false,
                'mark_for_user'       => false,
                'created_by'          => auth()->id(),
            ]);

            $assetUnder  = GroupUnder::where('name', 'Current Assets')->firstOrFail();
            $assetNature = Nature::where('name', 'Assets')->firstOrFail();
            $advanceGroup = AccountGroup::firstOrCreate(
                ['name' => 'Employee Advances', 'created_by' => auth()->id()],
                [
                    'nature_id'      => $assetNature->id,
                    'group_under_id' => $assetUnder->id,
                    'description'    => 'Short-term advances to employees',
                    'created_by' => auth()->id(),
                ]
            );

            AccountLedger::firstOrCreate(
                [
                    'employee_id'         => $employee->id,
                    'account_ledger_name' => $employee->name . ' - Advance',
                    'ledger_type'         => 'employee_advance',
                    'created_by'          => auth()->id(),
                ],
                [
                    'opening_balance'  => 0,
                    'debit_credit'     => 'debit',
                    'status'           => 'active',
                    'account_group_id' => $advanceGroup->id,
                    'group_under_id'   => $assetUnder->id,
                    'address'          => $employee->present_address,
                    'phone_number'     => $employee->mobile ?? '0000000000',
                    'email'            => $employee->email  ?? 'employee@example.com',
                ]
            );
        });
        // Redirect with a success message
        return redirect()->route('employees.index')->with('success', 'Employee created successfully.');
    }


    public function edit(Employee $employee)
    {
        $ids = godown_scope_ids();
        if ($ids !== null && !empty($ids) && !in_array($employee->created_by, $ids)) {
            abort(403, 'Unauthorized');
        }

        $departments = Department::when($ids !== null && !empty($ids), function ($q) use ($ids) {
            $q->whereIn('created_by', $ids);
        })->get();
        $designations = Designation::when($ids !== null && !empty($ids), function ($q) use ($ids) {
            $q->whereIn('created_by', $ids);
        })->get();
        $shifts = Shift::when($ids !== null && !empty($ids), function ($q) use ($ids) {
            $q->whereIn('created_by', $ids);
        })->get();
        $references = Employee::when($ids !== null && !empty($ids), function ($q) use ($ids) {
            $q->whereIn('created_by', $ids);
        })->get();

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
        $ids = godown_scope_ids();
        if ($ids !== null && !empty($ids) && !in_array($employee->created_by, $ids)) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'mobile' => 'required|string|max:15',
            'email' => 'required|email|max:255|unique:employees,email,' . $employee->id,
            'nid' => 'nullable|string|max:20|unique:employees,nid,' . $employee->id,
            'present_address' => 'required|string|max:255',
            'permanent_address' => 'required|string|max:255',
            'salary' => 'required|numeric',
            'joining_date' => 'required|date',
            'status' => 'required|in:Active,Inactive',
            'advance_amount' => 'nullable|numeric',
            'department_id' => 'required|exists:departments,id',
            'designation_id' => 'required|exists:designations,id',
            'shift_id' => 'required|exists:shifts,id',
            'reference_by' => 'nullable|exists:employees,id',
        ]);

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
        if ($employee->ledger) {
            $employee->ledger->update([
                'account_ledger_name' => $employee->name,
                'phone_number'        => $employee->mobile,
                'email'               => $employee->email,
                'address'             => $employee->present_address,
            ]);
        }

        return redirect()->route('employees.index')->with('success', 'Employee updated successfully.');
    }


    

    public function destroy(Employee $employee)
    {
        $ids = godown_scope_ids();
        if ($ids !== null && !empty($ids) && !in_array($employee->created_by, $ids)) {
            abort(403, 'Unauthorized');
        }

        $employee->delete();

        return redirect()->route('employees.index')->with('success', 'Employee deleted successfully.');
    }

    public function salaryReport(Employee $employee)
    {
        $ids = godown_scope_ids();
        if ($ids && !in_array($employee->created_by, $ids)) {
            abort(403);
        }

        $employee->load([
            'salarySlipEmployees' => fn($q) =>
            $q->with('salarySlip')
                ->orderByDesc('id'),
            'salarySlipEmployees.receives' => fn($q) =>
            $q->orderBy('date'),
            'department',
            'designation',
            'shift'
        ]);

        return Inertia::render('employees/salary-report', [
            'employee' => $employee
        ]);
    }
}
