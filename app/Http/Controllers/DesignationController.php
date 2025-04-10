<?php

namespace App\Http\Controllers;

use App\Models\Designation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DesignationController extends Controller
{
    public function index()
    {
        // Fetch all designations with their creator
        $designations = Designation::with('creator')
            ->when(!auth()->user()->hasRole('admin'), function ($query) {
                $query->where('created_by', auth()->id());
            })
            ->get();

        // Return Inertia view with data
        return Inertia::render('designations/index', [
            'designations' => $designations
        ]);
    }

    public function create()
    {
        // Return the create Inertia view
        return Inertia::render('designations/create');
    }

    public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Create the new designation
        Designation::create([
            'name' => $request->name,
            'description' => $request->description,
            'created_by' => auth()->id(),
        ]);

        // Redirect with success message
        return redirect()->route('designations.index')->with('success', 'Designation created successfully.');
    }

    public function edit(Designation $designation)
    {
        // Return the edit view for the given designation
        return Inertia::render('designations/edit', [
            'designation' => $designation
        ]);
    }

    public function update(Request $request, Designation $designation)
    {
        // Validate the request
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Update the designation
        $designation->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        // Redirect with success message
        return redirect()->route('designations.index')->with('success', 'Designation updated successfully.');
    }

    public function destroy(Designation $designation)
    {
        // Delete the designation
        $designation->delete();

        // Redirect with success message
        return redirect()->route('designations.index')->with('success', 'Designation deleted successfully.');
    }
}
