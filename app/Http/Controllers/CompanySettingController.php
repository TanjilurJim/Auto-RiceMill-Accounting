<?php

namespace App\Http\Controllers;

use Intervention\Image\ImageManager;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\CompanySetting;
use App\Models\FinancialYear;
use Illuminate\Support\Facades\Auth;

class CompanySettingController extends Controller
{
    public function edit()
    {
        $tenantId = auth()->user()->tenant_id;
        $setting = CompanySetting::where('created_by', $tenantId)->first();
        $financialYears = FinancialYear::where('created_by', $tenantId)->get();

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
            'purchaseFlowOptions' => [
                ['value' => 'none',         'label' => 'No approval (post immediately)'],
                ['value' => 'sub_only',     'label' => '1-step — Sub-Responsible'],
                ['value' => 'sub_and_resp', 'label' => '2-step — Sub then Responsible'],
            ],
        ]);
    }

    public function update(Request $request, ImageManager $manager)
    {
        $tenantId = auth()->user()->tenant_id;

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
            'apply_interest' => 'nullable|boolean',
            'interest_basis' => 'nullable|in:due,total',
            'interest_rate_per_month' => 'nullable|numeric|min:0',
            'interest_rate_per_year' => 'nullable|numeric|min:0',
            'interest_type' => 'nullable|in:percentage,flat', // Changed from 'required' to 'nullable'
            'interest_flat_per_day' => 'nullable|numeric|min:0',
            'sale_approval_flow' => 'nullable|in:none,sub_only,sub_and_resp',
            'purchase_approval_flow' => 'nullable|in:none,sub_only,sub_and_resp',
            'logo' => 'nullable|image|max:2048', // Add validation for logo
        ]);

        // Normalize checkbox - ensure it's always set
        $validated['apply_interest'] = $request->boolean('apply_interest');

        // Set defaults for fields that might be missing
        $validated['interest_type'] = $validated['interest_type'] ?? 'percentage';

        $setting = CompanySetting::firstOrNew(['created_by' => $tenantId]);

        if (!$setting->exists) {
            $setting->created_by = $tenantId;
        }

        // Handle financial year
        if ($request->filled('financial_year_id')) {
            $fy = \App\Models\FinancialYear::find($request->financial_year_id);
            if ($fy) {
                $validated['financial_year'] = $fy->title;
            }
        }

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $image = $request->file('logo');

            $full = $manager->read($image)
                ->resize(300, 300, function ($c) {
                    $c->aspectRatio();
                    $c->upsize();
                })
                ->toPng()
                ->toString();

            $fullName = 'logos/' . uniqid() . '.png';
            Storage::disk('public')->put($fullName, $full);

            $thumb = $manager->read($image)
                ->resize(120, 120, function ($c) {
                    $c->aspectRatio();
                    $c->upsize();
                })
                ->toJpg(60)
                ->toString();

            $thumbName = 'logos/pdf_' . uniqid() . '.jpg';
            Storage::disk('public')->put($thumbName, $thumb);

            $validated['logo_path'] = $fullName;
            $validated['logo_thumb_path'] = $thumbName;
        }

        // Remove 'logo' from validated data before saving
        unset($validated['logo']);

        \Log::info('✅ Final data to save:', $validated);

        $setting->fill($validated);
        $setting->save();

        \Log::info('✅ Saved CompanySetting ID: ' . $setting->id);

        return redirect()->route('company-settings.edit')->with('success', 'Company info updated.');
    }

    public function editCostings()
    {
        $tenantId = auth()->user()->tenant_id;
        $setting = CompanySetting::firstOrCreate(['created_by' => $tenantId], [
            'company_name' => null,
        ]);

        $presets = data_get($setting, 'costings.items', []);

        $basisOptions = [
            ['value' => 'per_bosta',  'label' => 'Per Bosta '],
            ['value' => 'per_kg_main', 'label' => 'Per kg '],
            ['value' => 'fixed',      'label' => 'Fixed (flat amount)'],
        ];

        return Inertia::render('company-settings/ProductionCostSetting', [
            'presets'       => $presets,
            'basisOptions'  => $basisOptions,
        ]);
    }

    public function updateCostings(Request $request)
    {
        $tenantId = auth()->user()->tenant_id;
        $validated = $request->validate([
            'items'                 => ['required', 'array'],
            'items.*.label'         => ['required', 'string', 'max:255'],
            'items.*.rate'          => ['required', 'numeric', 'min:0'],
            'items.*.basis'         => ['required', 'in:per_bosta,per_kg_main,fixed'],
            'items.*.id'            => ['nullable', 'string', 'max:100'],
        ]);

        // Normalize: ensure each row has a stable id (slug of label)
        $items = collect($validated['items'])->map(function ($r) {
            $id = $r['id'] ?? Str::slug($r['label'], '_');
            return [
                'id'    => $id,
                'label' => $r['label'],
                'rate'  => (float) $r['rate'],
                'basis' => $r['basis'],
            ];
        })->values()->all();

        $setting = CompanySetting::firstOrCreate(['created_by' => $tenantId]);
        $setting->costings = ['items' => $items];
        $setting->save();

        return back()->with('success', 'Production cost presets updated.');
    }
}
