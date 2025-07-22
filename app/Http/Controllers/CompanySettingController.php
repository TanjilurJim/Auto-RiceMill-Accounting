<?php

namespace App\Http\Controllers;

use Intervention\Image\ImageManager;
use Illuminate\Support\Facades\Storage;
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
            'interestBasisOptions' => [         // 👈 add this
                ['value' => 'due',   'label' => 'Due amount'],
                ['value' => 'total', 'label' => 'Total invoice amount'],
            ],
            'saleFlowOptions' => [
            ['value' => 'none',         'label' => 'No approval (post immediately)'],
            ['value' => 'sub_only',     'label' => '1-step — Sub-Responsible only'],
            ['value' => 'sub_and_resp', 'label' => '2-step — Sub then Responsible'],
        ],
        ]);
    }

    public function update(Request $request, ImageManager $manager)
    {
        $validated = $request->validate([
            'company_name' => 'nullable|string|max:255',
            'mailing_name' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:100',
            'email' => 'nullable|email',
            'website' => 'nullable|url',
            'financial_year_id' => 'nullable|exists:financial_years,id',
            'mobile' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'description' => 'nullable|string',

            // 🆕 global-interest flags
            'apply_interest'     => 'nullable|boolean',
            'interest_basis'     => 'nullable|in:due,total',
            'interest_rate_per_month' => 'nullable|numeric|min:0',  
            'interest_rate_per_year'  => 'nullable|numeric|min:0',
            'interest_type' => 'required|in:percentage,flat',
            'interest_flat_per_day' => 'nullable|numeric|min:0',
            'sale_approval_flow' => 'nullable|in:none,sub_only,sub_and_resp',

        ]);

        // 🟢 normalise checkbox
        $validated['apply_interest'] = $request->boolean('apply_interest');

        $setting = CompanySetting::firstOrNew(['created_by' => auth()->id()]);

        if (!$setting->exists) {
            $setting->created_by = auth()->id(); // ✅ Ensure this is set for new rows
        }

        if ($request->filled('financial_year_id')) {
            $fy = \App\Models\FinancialYear::find($request->financial_year_id);
            if ($fy) {
                $validated['financial_year'] = $fy->title;
            }
        }

        if ($request->hasFile('logo')) {
            $image = $request->file('logo');

            // normal web‑size 300 px wide  ───────────────────────
            $full = $manager->read($image)
                // ← fixes EXIF rotation
                ->resize(300, 300, function ($c) {
                    $c->aspectRatio();
                    $c->upsize();
                })
                ->toPng()
                ->toString();
            $fullName = 'logos/' . uniqid() . '.png';
            Storage::disk('public')->put($fullName, $full);

            // **thumbnail 120×120 bounding box**  ───────────────
            $thumb = $manager->read($image)

                ->resize(120, 120, function ($c) {
                    $c->aspectRatio();
                    $c->upsize();
                })
                ->toJpg(60)
                ->toString();
            $thumbName = 'logos/pdf_' . uniqid() . '.jpg';
            Storage::disk('public')->put($thumbName, $thumb);

            $validated['logo_path']       = $fullName;
            $validated['logo_thumb_path'] = $thumbName;
        }
        \Log::info('✅ Final data to save:', $validated);

        $setting->fill($validated);
        $setting->save();

        \Log::info('✅ Saved CompanySetting ID: ' . $setting->id);

        return redirect()->route('company-settings.edit')->with('success', 'Company info updated.');
    }
}
