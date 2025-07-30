<?php

namespace App\Http\Controllers;

use App\Models\Dryer;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use function get_top_parent_id;

class DryerController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:dryers.view')->only(['index', 'show']);
        $this->middleware('permission:dryers.create')->only(['create', 'store']);
        $this->middleware('permission:dryers.edit')->only(['edit', 'update']);
        $this->middleware('permission:dryers.delete')->only(['destroy']);
    }

    /* ------------------------------------------------------------------ */
    /*  LIST                                                               */
    /* ------------------------------------------------------------------ */
    public function index(Request $request)
    {
        $dryers = Dryer::forMyCompany()
            ->when($request->q, fn ($q, $v) => $q->where('dryer_name', 'like', "%{$v}%"))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('dryers/Index', [
            'dryers'  => $dryers->through(fn ($d) => [
                'id'           => $d->id,
                'dryer_name'   => $d->dryer_name,
                'dryer_type'   => $d->dryer_type,
                'capacity'     => $d->capacity,
                'manufacturer' => $d->manufacturer,
            ]),
            'filters' => $request->only('q'),
        ]);
    }

    /* ------------------------------------------------------------------ */
    /*  CREATE FORM                                                        */
    /* ------------------------------------------------------------------ */
    public function create()
    {
        return Inertia::render('dryers/Create');
    }

    /* ------------------------------------------------------------------ */
    /*  STORE                                                              */
    /* ------------------------------------------------------------------ */
    public function store(Request $request)
    {
        $headId    = get_top_parent_id(auth()->user());
        $validated = $request->validate($this->rules($headId));

        Dryer::create($validated + [
            'created_by' => $headId,
            'updated_by' => auth()->id(),
        ]);

        return to_route('dryers.index')->with('success', 'Dryer added.');
    }

    /* ------------------------------------------------------------------ */
    /*  SHOW                                                               */
    /* ------------------------------------------------------------------ */
    public function show(Dryer $dryer)
    {
        $this->authorizeCompany($dryer);

        return Inertia::render('dryers/Show', ['dryer' => $dryer]);
    }

    /* ------------------------------------------------------------------ */
    /*  EDIT FORM                                                          */
    /* ------------------------------------------------------------------ */
    public function edit(Dryer $dryer)
    {
        $this->authorizeCompany($dryer);

        return Inertia::render('dryers/Edit', ['dryer' => $dryer]);
    }

    /* ------------------------------------------------------------------ */
    /*  UPDATE                                                             */
    /* ------------------------------------------------------------------ */
    public function update(Request $request, Dryer $dryer)
    {
        $this->authorizeCompany($dryer);

        $headId    = get_top_parent_id(auth()->user());
        $validated = $request->validate($this->rules($headId, $dryer->id));

        $dryer->update($validated + ['updated_by' => auth()->id()]);

        return back()->with('success', 'Dryer updated.');
    }

    /* ------------------------------------------------------------------ */
    /*  DELETE (soft-delete)                                               */
    /* ------------------------------------------------------------------ */
    public function destroy(Dryer $dryer)
    {
        $this->authorizeCompany($dryer);

        $dryer->delete();

        return to_route('dryers.index')->with('success', 'Dryer deleted.');
    }

    /* ====== helpers ==================================================== */
    private function authorizeCompany(Dryer $dryer): void
    {
        abort_unless(
            $dryer->created_by === get_top_parent_id(auth()->user()),
            403,
            'Unauthorized'
        );
    }

    private function rules(int $headId, ?int $ignoreId = null): array
    {
        return [
            'dryer_name'   => [
                'required', 'string', 'max:120',
                Rule::unique('dryers')
                    ->where(fn ($q) => $q->where('created_by', $headId))
                    ->ignore($ignoreId),
            ],
            'dryer_type'   => 'nullable|string|max:60',
            'capacity'     => 'required|numeric|min:0',
            'batch_time'   => 'nullable|integer|min:0',
            'manufacturer' => 'nullable|string|max:100',
            'model_number' => 'nullable|string|max:80',
            'power_kw'     => 'nullable|numeric|min:0',
            'fuel_type'    => 'nullable|string|max:40',
            'length_mm'    => 'nullable|integer|min:0',
            'width_mm'     => 'nullable|integer|min:0',
            'height_mm'    => 'nullable|integer|min:0',
        ];
    }
}
