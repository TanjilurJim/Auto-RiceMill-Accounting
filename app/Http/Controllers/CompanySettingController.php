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
        ]);

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
