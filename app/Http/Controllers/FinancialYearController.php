<?php

namespace App\Http\Controllers;

use App\Models\FinancialYear;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class FinancialYearController extends Controller
{
    public function index()
    {
        $financialYears = FinancialYear::where('created_by', Auth::id())->latest()->get();

        return Inertia::render('financial-years/index', [
            'financialYears' => $financialYears,
        ]);
    }

    public function create()
    {
        return Inertia::render('financial-years/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        FinancialYear::create([
            ...$request->all(),
            'created_by' => Auth::id(),
        ]);

        return redirect()->route('financial-years.index')->with('success', 'Financial Year created.');
    }

    public function edit(FinancialYear $financialYear)
    {
        return Inertia::render('financial-years/edit', [
            'financialYear' => $financialYear,
        ]);
    }

    public function update(Request $request, FinancialYear $financialYear)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $financialYear->update($request->all());

        return redirect()->route('financial-years.index')->with('success', 'Financial Year updated.');
    }

    public function destroy(FinancialYear $financialYear)
    {
        $financialYear->delete();

        return redirect()->route('financial-years.index')->with('success', 'Deleted.');
    }
}
