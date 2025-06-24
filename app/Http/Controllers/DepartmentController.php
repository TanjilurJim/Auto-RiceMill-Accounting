<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\User; // Assuming the 'created_by' is related to 'User'
use Illuminate\Http\Request;
use Inertia\Inertia;

use function godown_scope_ids; // Assuming this function is defined in your helpers

class DepartmentController extends Controller
{
    // public function index()
    // {
    //     // Get all departments with creator relationship
    //     $departments = Department::with('creator')
    //         ->when(!auth()->user()->hasRole('admin'), function ($query) {
    //             $query->where('created_by', auth()->id());
    //         })
    //         ->get();

    //     // Return the index view with departments data using Inertia
    //     return Inertia::render('departments/index', [
    //         'departments' => $departments
    //     ]);
    // }

    public function index()
    {
        $ids = godown_scope_ids();

        $departments = Department::with('creator')
            ->when($ids !== null && !empty($ids), function ($query) use ($ids) {
                $query->whereIn('created_by', $ids);
            })
            ->get();

        return Inertia::render('departments/index', [
            'departments' => $departments
        ]);
    }

    public function create()
    {
        // Return the create view using Inertia (if there are options or related data, like 'users')
        return Inertia::render('departments/create');
    }

    public function store(Request $request)
    {
        // Validate the request input
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Create the new department
        Department::create([
            'name' => $request->name,
            'description' => $request->description,
            'created_by' => auth()->id(), // Set the current logged-in user as creator
        ]);

        // Redirect to index page with success message
        return redirect()->route('departments.index')->with('success', 'Department created successfully.');
    }

    // public function edit(Department $department)
    // {
    //     // Return the edit view with the department data
    //     return Inertia::render('departments/edit', [
    //         'department' => $department
    //     ]);
    // }

    public function edit(Department $department)
    {
        $ids = godown_scope_ids();
        if ($ids !== null && !empty($ids) && !in_array($department->created_by, $ids)) {
            abort(403);
        }

        return Inertia::render('departments/edit', [
            'department' => $department
        ]);
    }


    // public function update(Request $request, Department $department)
    // {
    //     // Validate the request input
    //     $request->validate([
    //         'name' => 'required|string|max:255',
    //         'description' => 'nullable|string',
    //     ]);

    //     // Update the department record
    //     $department->update([
    //         'name' => $request->name,
    //         'description' => $request->description,
    //     ]);

    //     // Redirect to index page with success message
    //     return redirect()->route('departments.index')->with('success', 'Department updated successfully.');
    // }

    public function update(Request $request, Department $department)
    {
        $ids = godown_scope_ids();
        if ($ids !== null && !empty($ids) && !in_array($department->created_by, $ids)) {
            abort(403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $department->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->route('departments.index')->with('success', 'Department updated successfully.');
    }

    // public function destroy(Department $department)
    // {
    //     // Delete the department
    //     $department->delete();

    //     // Redirect to index page with success message
    //     return redirect()->route('departments.index')->with('success', 'Department deleted successfully.');
    // }

    public function destroy(Department $department)
    {
        $ids = godown_scope_ids();
        if ($ids !== null && !empty($ids) && !in_array($department->created_by, $ids)) {
            abort(403);
        }

        $department->delete();

        return redirect()->route('departments.index')->with('success', 'Department deleted successfully.');
    }
}
