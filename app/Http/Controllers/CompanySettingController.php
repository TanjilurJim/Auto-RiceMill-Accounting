<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CompanySetting;
use App\Models\FinancialYear;
use Illuminate\Support\Facades\Auth;

class CompanySettingController extends Controller
{
    public function edit()
    {
        $setting = CompanySetting::where('created_by', Auth::id())->first();
        $financialYears = FinancialYear::where('created_by', Auth::id())->get();

        return Inertia::render('company-settings/edit', [
            'setting' => $setting,
            'financialYears' => $financialYears,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'mailing_name' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:100',
            'email' => 'nullable|email',
            'website' => 'nullable|url',
            'financial_year_id' => 'nullable|exists:financial_years,id',
            'mobile' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $setting = CompanySetting::firstOrCreate(
            ['created_by' => auth()->id()],
            $validated
        );
    
        // 💡 If financial year is selected, also save its title in financial_year
        if ($request->filled('financial_year_id')) {
            $fy = \App\Models\FinancialYear::find($request->financial_year_id);
            if ($fy) {
                $validated['financial_year'] = $fy->title;
            }
        }


        $setting->fill($validated);
        $setting->save();

        return redirect()->route('company-settings.edit')->with('success', 'Company info updated.');
    }
}
