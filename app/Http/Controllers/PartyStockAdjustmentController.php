<?php

namespace App\Http\Controllers;

use App\Models\PartyItem;
use App\Models\PartyStockMove;
use App\Models\PartyJobStock;
use App\Models\AccountLedger;
use App\Models\Godown;
use App\Models\Unit;
use Illuminate\Http\Request;
use App\Models\CrushingJob;
use App\Models\CrushingJobConsumption;
use App\Models\Dryer;
use App\Models\CompanySetting;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use App\Models\{Item, Stock, StockMove, Lot};

class PartyStockAdjustmentController extends Controller
{
    /* ----------  FORM  ---------- */
    public function create(Request $request)
    {
        $dateStr = now()->format('Ymd');
        $ref = "CONV-$dateStr-" . random_int(1000, 9999);

        $preset = null;
        if ($request->filled('job')) {
            $job = CrushingJob::with('consumptions')->findOrFail($request->job);

            // Map consumptions to your form shape
            $consumed = $job->consumptions->map(function ($c) {
                if ($c->source === 'company') {
                    return [
                        'item_id'   => (string)$c->item_id,
                        'lot_id'    => (string)$c->lot_id,
                        'qty'       => (string)$c->qty,
                        'unit_name' => (string)($c->unit_name ?? ''),
                        'weight'    => $c->weight !== null ? (string)$c->weight : '',
                    ];
                }
                return [
                    'party_item_id' => (string)$c->party_item_id,
                    'qty'           => (string)$c->qty,
                    'unit_name'     => (string)($c->unit_name ?? ''),
                    'weight'        => $c->weight !== null ? (string)$c->weight : '',
                ];
            })->values();

            $preset = [
                'date'            => $job->date ?? now()->toDateString(),
                'ref_no'          => $ref, // a fresh ref for the conversion voucher
                'owner'           => $job->owner,
                'party_ledger_id' => $job->party_ledger_id,
                'godown_id'       => $job->godown_id,
                'dryer_id'        => $job->dryer_id,
                'consumed'        => $consumed,
                'generated'       => [], // empty; user will enter outputs
                'remarks'         => $job->remarks,
                'job_id'          => $job->id, // pass through so transfer() can mark posted
            ];
        }

        // Group party job stock by party -> godown, include godown_name
        $stocksRaw = \App\Models\PartyJobStock::whereHas('partyItem')
            ->with(['partyItem:id,party_ledger_id,item_name', 'godown:id,name'])
            ->where('created_by', auth()->id())
            ->get();

        $partyItemIds = $stocksRaw->pluck('party_item_id')->filter()->unique()->values();

        $lastDeposits = \App\Models\PartyStockMove::select('id', 'party_item_id', 'unit_name', 'meta')
            ->whereIn('party_item_id', $partyItemIds)
            ->where('move_type', 'deposit')
            ->where('created_by', auth()->id())
            ->orderBy('id', 'desc')
            ->get()
            ->groupBy('party_item_id')
            ->map->first();

        $stocks = $stocksRaw
            ->groupBy(fn($s) => (string) $s->partyItem->party_ledger_id)
            ->map(function ($group) use ($lastDeposits) {
                return $group->groupBy(fn($s) => (string) $s->godown_id)
                    ->map(function ($items) use ($lastDeposits) {
                        $g = $items->first()->godown ?? null;

                        return [
                            'godown_name' => $g?->name ?? '',
                            'items' => $items->map(function ($stock) use ($lastDeposits) {
                                $unit = strtolower((string) ($stock->unit_name ?? ''));
                                $perUnitKg = null;

                                if ($unit === 'kg') {
                                    $perUnitKg = 1;
                                } elseif ($unit === 'bosta') {
                                    $last = $lastDeposits->get($stock->party_item_id);
                                    $meta = $last?->meta;
                                    if (is_string($meta)) $meta = json_decode($meta, true) ?: [];
                                    $perUnitKg = $meta['bosta_weight'] ?? null;
                                }

                                return [
                                    'party_item_id' => (int) $stock->party_item_id,
                                    'item_name'     => $stock->partyItem->item_name,
                                    'qty'           => (float) $stock->qty,
                                    'unit_name'     => $stock->unit_name,
                                    'per_unit_kg'   => $perUnitKg, // NEW
                                ];
                            })->values(),
                        ];
                    });
            });

        // expose running job at top level (not inside available_stock)
        $runningJobId = CrushingJob::where('created_by', auth()->id())
            ->where('status', 'running')
            ->value('id');

        $tenantId = auth()->user()->tenant_id;

        $setting = CompanySetting::firstOrCreate(['created_by' => $tenantId], [
            'company_name' => null,
        ]);
        $costingPresets = data_get($setting, 'costings.items', []);

        return Inertia::render('crushing/ConvertForm', [
            'parties'          => AccountLedger::whereIn('ledger_type', ['sales', 'income'])->get(['id', 'account_ledger_name']),
            'units'            => Unit::all(['id', 'name']),
            'godowns'          => Godown::all(['id', 'name']),
            'dryers'           => Dryer::forMyCompany()->get(['id', 'dryer_name', 'capacity']),
            'today'            => now()->toDateString(),
            'generated_ref_no' => $ref,
            'available_stock'  => $stocks,
            'running_job_id'   => $runningJobId,
            'costing_presets' => $costingPresets,
            'preset'          => $preset,                  // ✅ here
            'items'            => Item::with('unit:id,name')
                ->orderBy('item_name')
                ->get(['id', 'item_name', 'unit_id']),
            'units' => Unit::orderBy('name')->get(['id', 'name']),
        ]);
    }






    /* ----------  STORE  ---------- */
    public function transfer(Request $request)
    {
        $validated = $request->validate([
            'date'            => ['required', 'date'],
            'ref_no'          => ['required', 'string', 'max:255', 'unique:party_stock_moves,ref_no'],
            'party_ledger_id' => ['required', 'exists:account_ledgers,id'],
            'godown_id'       => ['required', 'exists:godowns,id'],
            'consumed'        => ['required', 'array', 'min:1'],
            'consumed.*.weight'   => ['nullable', 'numeric', 'min:0'],
            'generated.*.weight'  => ['nullable', 'numeric', 'min:0'],
            'generated'       => ['required', 'array', 'min:1'],
            'consumed.*.party_item_id' => ['required', 'exists:party_items,id'],
            'consumed.*.qty'           => ['required', 'numeric', 'min:0.01'],
            'consumed.*.unit_name'     => ['nullable', 'string'],
            'generated.*.item_name'    => ['required', 'string', 'max:255'],
            'generated.*.qty'          => ['required', 'numeric', 'min:0.01'],
            'generated.*.unit_name'    => ['nullable', 'string'],
            'generated.*.is_main'     => ['nullable', 'boolean'],
            'generated.*.per_kg_rate' => ['nullable', 'numeric', 'min:0'],
            'generated.*.sale_value'  => ['nullable', 'numeric', 'min:0'],
        ]);
        $validated['date'] = \Carbon\Carbon::parse($validated['date'])->toDateString();

        $jobId = $request->input('job_id'); // ⬅️ receive job_id

        DB::transaction(function () use ($validated, $jobId, $request) {
            $date       = $validated['date'];
            $refNo      = $validated['ref_no'];
            $partyId    = (int) $validated['party_ledger_id'];
            $godownId   = (int) $validated['godown_id'];
            $remarks    = $request->input('remarks'); // not in $validated, so pull from request

            /* -------------------- CONSUMED (convert-out) -------------------- */
            foreach ($validated['consumed'] as $row) {
                $partyItemId = (int) $row['party_item_id'];
                $qty         = (float) $row['qty'];
                $unitName    = $row['unit_name'] ?? null;

                // Optional weight (store negative for out)
                $weight = null;
                if (array_key_exists('weight', $row) && $row['weight'] !== null && $row['weight'] !== '') {
                    $weight = -abs((float) $row['weight']);
                }

                // Lock stock and ensure enough qty
                $pStock = \App\Models\PartyJobStock::where([
                    'party_item_id'   => $partyItemId,
                    'godown_id'       => $godownId,
                    'party_ledger_id' => $partyId,   // 👈 add this
                    'created_by'      => auth()->id(),
                ])->lockForUpdate()->first();

                if (!$pStock || $pStock->qty < $qty) {
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        'consumed' => ["Not enough stock for party_item_id={$partyItemId} in this godown."],
                    ]);
                }

                // Decrement balance
                $pStock->decrement('qty', $qty);

                // History (out)
                \App\Models\PartyStockMove::create([
                    'date'            => $date,
                    'party_ledger_id' => $partyId,
                    'party_item_id'   => $partyItemId,
                    'godown_id_from'  => $godownId,
                    'qty'             => -$qty,
                    'unit_name'       => $unitName,
                    'weight'          => $weight,                  // 👈 nullable negative
                    'move_type'       => 'convert-out',
                    'ref_no'          => $refNo,
                    'remarks'         => $remarks,

                    'created_by'      => auth()->id(),
                ]);
            }

            /* -------------------- GENERATED (convert-in) -------------------- */
            foreach ($validated['generated'] as $row) {
                $itemName  = trim($row['item_name']);
                $qty       = (float) $row['qty'];
                $unitName  = $row['unit_name'] ?? null;

                // Optional weight (store positive for in)
                $weight = null;
                if (array_key_exists('weight', $row) && $row['weight'] !== null && $row['weight'] !== '') {
                    $weight = abs((float) $row['weight']);
                }

                // Ensure PartyItem exists for this party + name
                $partyItem = \App\Models\PartyItem::firstOrCreate(
                    [
                        'party_ledger_id' => $partyId,
                        'item_name'       => $itemName,
                        'created_by'      => auth()->id(),
                    ],
                    [
                        'unit_id' => null, // keep null unless you want to infer from $unitName
                    ]
                );

                // Upsert PartyJobStock (increase qty)
                $pStock = \App\Models\PartyJobStock::lockForUpdate()->firstOrNew([
                    'party_item_id'   => $partyItem->id,
                    'godown_id'       => $godownId,
                    'party_ledger_id' => $partyId,   // 👈 add this
                    'created_by'      => auth()->id(),
                ]);
                $pStock->qty        = ($pStock->qty ?? 0) + $qty;
                $pStock->unit_name  = $unitName ?? $pStock->unit_name;
                $pStock->save();

                // History (in)
                \App\Models\PartyStockMove::create([
                    'date'            => $date,
                    'party_ledger_id' => $partyId,
                    'party_item_id'   => $partyItem->id,
                    'godown_id_to'    => $godownId,
                    'qty'             => $qty,
                    'unit_name'       => $unitName,
                    'weight'          => $weight,                  // 👈 nullable positive
                    'move_type'       => 'convert-in',
                    'ref_no'          => $refNo,
                    'remarks'         => $remarks,
                    'meta' => [
                        'is_main'     => (bool)($row['is_main'] ?? false),
                        'per_kg_rate' => isset($row['per_kg_rate']) ? (float)$row['per_kg_rate'] : null,
                        'sale_value'  => isset($row['sale_value']) ? (float)$row['sale_value'] : null,
                    ],
                    'created_by'      => auth()->id(),
                ]);
            }

            /* -------------------- Link posted job (if any) -------------------- */
            if ($jobId) {
                $job = \App\Models\CrushingJob::lockForUpdate()->find($jobId);
                if ($job && $job->created_by === auth()->id()) {
                    $job->update([
                        'posted_ref_no' => $refNo,
                        'posted_at'     => now(),
                    ]);
                }
            }
        });

        return redirect()->route('party-stock.transfer.index')
            ->with('success', 'Conversion saved successfully');
    }
    public function jobsIndex()
    {
        $jobs = CrushingJob::with(['dryer', 'godown', 'party'])
            ->where('created_by', auth()->id())
            ->orderByDesc('started_at')
            ->paginate(12);

        // gather posted voucher refs for this page
        $postedRefs = $jobs->getCollection()->pluck('posted_ref_no')->filter()->unique();

        // ref_no => sum(abs(weight)) for convert-out lines only
        $loadedByRef = DB::table('party_stock_moves')
            ->selectRaw('ref_no, SUM(ABS(weight)) AS loaded_kg')
            ->whereIn('ref_no', $postedRefs)
            ->where('move_type', 'convert-out')
            ->groupBy('ref_no')
            ->pluck('loaded_kg', 'ref_no');

        return Inertia::render('crushing/JobsIndex', [
            'jobs' => $jobs->through(function ($j) use ($loadedByRef) {
                $mins = ($j->started_at && $j->stopped_at)
                    ? $j->stopped_at->diffInMinutes($j->started_at)
                    : null;

                // Loaded from moves if posted; else fallback to job field
                $loadedKg = 0.0;

                if ($j->posted_ref_no) {
                    $loadedKg = (float) DB::table('party_stock_moves')
                        ->where('ref_no', $j->posted_ref_no)
                        ->where('move_type', 'convert-out')
                        ->sum(DB::raw('ABS(weight)'));
                }

                // Fallback to snapshot captured at Start (we store kg there now)
                if ($loadedKg <= 0) {
                    $loadedKg = (float) $j->total_loaded_qty;
                }


                $capacityTon = $j->dryer_capacity !== null ? (float) $j->dryer_capacity : null;
                $capacityKg  = $capacityTon !== null ? $capacityTon * 1000.0 : null;

                return [
                    'id'           => $j->id,
                    'ref_no'       => $j->ref_no,
                    'date'         => optional($j->date)->toDateString(),
                    'status'       => $j->status,
                    'dryer'        => $j->dryer?->dryer_name ?? '',
                    'godown'       => $j->godown?->name ?? '',
                    'party'        => $j->party?->account_ledger_name ?? null,
                    'started_at'   => optional($j->started_at)->toDateTimeString(),
                    'stopped_at'   => optional($j->stopped_at)->toDateTimeString(),
                    'capacity'     => $capacityTon,                       // ton
                    'loaded'       => $loadedKg,                          // kg (absolute already summed)
                    'duration_min' => $mins,
                    'utilization'  => ($capacityKg && $capacityKg > 0) ? round($loadedKg / $capacityKg, 3) : null,
                    'remarks'      => $j->remarks,
                ];
            }),
        ]);
    }

    public function jobsShow(CrushingJob $job)
    {
        abort_if($job->created_by !== auth()->id(), 403);

        $job->load(['dryer', 'godown', 'party']);
        $lines = CrushingJobConsumption::with(['item', 'lot', 'partyItem'])
            ->where('crushing_job_id', $job->id)
            ->get()
            ->map(function ($l) {
                return [
                    'source'      => $l->source,
                    'item'        => $l->item?->item_name,
                    'lot'         => $l->lot?->lot_no,
                    'party_item'  => $l->partyItem?->item_name,
                    'qty'         => $l->qty,
                    'unit_name'   => $l->unit_name,
                ];
            });

        $mins = ($job->started_at && $job->stopped_at) ? $job->stopped_at->diffInMinutes($job->started_at) : null;

        return Inertia::render('crushing/CrushingJobShow', [
            'job' => [
                'id' => $job->id,
                'ref_no' => $job->ref_no,
                'date' => optional($job->date)->toDateString(),
                'status' => $job->status,
                'dryer' => $job->dryer?->dryer_name ?? '',
                'godown' => $job->godown?->name ?? '',
                'party' => $job->party?->account_ledger_name ?? null,
                'started_at' => optional($job->started_at)->toDateTimeString(),
                'stopped_at' => optional($job->stopped_at)->toDateTimeString(),
                'duration_min' => $mins,
                'capacity' => $job->dryer_capacity,
                'loaded' => $job->total_loaded_qty,
                'utilization' => ($job->dryer_capacity ? round($job->total_loaded_qty / $job->dryer_capacity, 3) : null),
                'remarks' => $job->remarks,
                'posted_ref_no' => $job->posted_ref_no,
            ],
            'lines' => $lines,
        ]);
    }



    public function jobStart(Request $request)
    {
        // -------- Header validation --------
        $base = $request->validate([
            'date'            => ['required', 'date'],
            'ref_no'          => ['required', 'string', 'max:255'],
            'owner'           => ['required', 'in:company,party'],
            'party_ledger_id' => ['nullable', 'required_if:owner,party', 'exists:account_ledgers,id'],
            'godown_id'       => ['required', 'exists:godowns,id'],
            'dryer_id'        => ['required', 'exists:dryers,id'],
            'remarks'         => ['nullable', 'string', 'max:500'],
        ]);

        // -------- Line validation --------
        if ($base['owner'] === 'company') {
            $request->validate([
                'consumed'               => ['required', 'array', 'min:1'],
                'consumed.*.item_id'     => ['required', 'exists:items,id'],
                'consumed.*.lot_id'      => ['required', 'exists:lots,id'],
                'consumed.*.qty'         => ['required', 'numeric', 'min:0.01'],
                'consumed.*.unit_name'   => ['nullable', 'string', 'max:50'],
                'consumed.*.weight'      => ['nullable', 'numeric', 'min:0'],
            ]);
        } else { // party
            $request->validate([
                'consumed'                    => ['required', 'array', 'min:1'],
                'consumed.*.party_item_id'    => ['required', 'exists:party_items,id'],
                'consumed.*.qty'              => ['required', 'numeric', 'min:0.01'],
                'consumed.*.unit_name'        => ['nullable', 'string', 'max:50'],
                'consumed.*.weight'           => ['nullable', 'numeric', 'min:0'],
            ]);
        }

        $dryer = Dryer::findOrFail($base['dryer_id']);

        $job = DB::transaction(function () use ($base, $request, $dryer) {
            // NOTE: If your dryer capacity is stored in TON, convert to KG here (× 1000).
            // $capacityKg = ((float)$dryer->capacity) * 1000;
            $capacityKg = (float) $dryer->capacity;

            $job = CrushingJob::create([
                'ref_no'          => $base['ref_no'],
                'date'            => $base['date'],
                'owner'           => $base['owner'],
                'party_ledger_id' => $base['owner'] === 'party' ? $base['party_ledger_id'] : null,
                'godown_id'       => $base['godown_id'],
                'dryer_id'        => $base['dryer_id'],
                'status'          => 'running',
                'started_at'      => Carbon::now(),
                'dryer_capacity'  => $capacityKg,    // snapshot in KG
                'remarks'         => $base['remarks'] ?? null,
                'created_by'      => auth()->id(),
            ]);

            $totalQty    = 0.0;  // optional: keep if you still want the count of units
            $totalWeight = 0.0;  // primary metric: total loaded weight in KG

            foreach ($request->input('consumed', []) as $row) {
                $unitName = strtolower(trim($row['unit_name'] ?? ''));
                $qty      = (float) $row['qty'];

                // 1) Take provided weight if present
                $w = (isset($row['weight']) && $row['weight'] !== '') ? (float)$row['weight'] : null;

                // 2) Infer weight when missing
                if ($w === null) {
                    if ($unitName === 'kg') {
                        $w = $qty; // qty already in KG
                    } elseif ($base['owner'] === 'company') {
                        // derive from item.weight or lot.unit_weight when available
                        $perUnitKg = null;

                        if (!empty($row['item_id'])) {
                            $perUnitKg = (float) \App\Models\Item::whereKey($row['item_id'])->value('weight');
                        }
                        if ((!$perUnitKg || $perUnitKg <= 0) && !empty($row['lot_id'])) {
                            $perUnitKg = (float) \App\Models\Lot::whereKey($row['lot_id'])->value('unit_weight');
                        }
                        if ($perUnitKg && $perUnitKg > 0) {
                            $w = $qty * $perUnitKg;
                        }
                    }
                    // (party owner: leave null if not derivable)
                }

                // 3) Persist the line
                $line = [
                    'crushing_job_id' => $job->id,
                    'source'          => $base['owner'],
                    'qty'             => $qty,
                    'unit_name'       => $row['unit_name'] ?? null,
                    'weight'          => $w, // nullable
                    'created_by'      => auth()->id(),
                ];
                if ($base['owner'] === 'company') {
                    $line['item_id'] = $row['item_id'];
                    $line['lot_id']  = $row['lot_id'];
                } else {
                    $line['party_item_id'] = $row['party_item_id'];
                }
                CrushingJobConsumption::create($line);

                // 4) Totals
                $totalQty    += $qty;
                $totalWeight += (float) ($w ?? 0);
            }

            // 5) Store total loaded *weight* (KG) on the job
            $job->update([
                'total_loaded_qty' => $totalWeight, // treat as KG
            ]);

            return $job;
        });

        return redirect()
            ->route('crushing.jobs.index')
            ->with('success', 'Dryer started.')
            ->with('running_job_id', $job->id);
    }


    public function jobStop(CrushingJob $job)
    {
        if ($job->status !== 'running') {
            return back()->with('warning', 'Job already stopped.');
        }

        $job->update([
            'status'     => 'stopped',
            'stopped_at' => Carbon::now(),
        ]);

        // Redirect to convert form prefilled from this job
        return redirect()
            ->route('party-stock.transfer.create', ['job' => $job->id])
            ->with('success', 'Dryer stopped. Enter generated items now.');
    }

    public function index()
    {
        // Fetch ref_no's for conversions
        $refNos = PartyStockMove::select('ref_no')
            ->whereIn('move_type', ['convert-in', 'convert-out'])
            ->where('created_by', auth()->id())
            ->groupBy('ref_no')
            ->orderByRaw('MAX(date) DESC')
            ->paginate(10);

        // Fetch all moves with these ref_nos
        $moves = PartyStockMove::with(['partyItem', 'partyLedger', 'godownTo', 'godownFrom']) // 👈
            ->whereIn('move_type', ['convert-in', 'convert-out'])
            ->where('created_by', auth()->id())
            ->whereIn('ref_no', $refNos->pluck('ref_no'))
            ->orderBy('date', 'desc')
            ->get();

        // Group moves by ref_no
        $grouped = $moves->groupBy('ref_no')->map(function ($group) {
            $first = $group->first();
            return [
                'id' => $first->id,
                'date' => $first->date,
                'ref_no' => $first->ref_no,
                'party_ledger_name' => $first->partyLedger->account_ledger_name ?? '',
                'godown_name' => $first->godownTo->name ?? '',
                'remarks' => $first->remarks,
                'items' => $group->map(function ($item) {
                    return [
                        'item_name' => $item->partyItem->item_name ?? '',
                        'unit_name' => $item->unit_name ?? '',
                        'qty' => $item->qty,
                        'weight'    => $item->weight !== null ? (float)$item->weight : null,
                        'move_type' => $item->move_type,
                    ];
                })->values(),
            ];
        })->values();

        return Inertia::render('crushing/PartyStockConvertIndex', [
            'conversions' => $grouped,
            'pagination' => [
                'links' => $refNos->linkCollection(),
                'currentPage' => $refNos->currentPage(),
                'lastPage' => $refNos->lastPage(),
                'total' => $refNos->total(),
            ],
        ]);
    }

    /* ----------  SHOW  ---------- */
    public function show($id)               // or PartyStockMove $move
    {
        $refNo = PartyStockMove::findOrFail($id)->ref_no;   // resolve full voucher

        $moves = PartyStockMove::with(['partyItem', 'partyLedger', 'godownTo', 'godownFrom']) // 👈
            ->where('ref_no', $refNo)
            ->orderBy('move_type')
            ->get();

        $header = $moves->first();          // common meta

        return Inertia::render('crushing/PartyStockConvertShow', [
            'header' => [
                'date'    => $header->date,
                'ref_no'  => $header->ref_no,
                'party'   => $header->partyLedger->account_ledger_name ?? '',
                'godown'  => $header->godownTo->name ?? ($header->godown_id_from ? $header->godownFrom->name : ''),
                'remarks' => $header->remarks,
            ],
            'consumed'  => $moves->where('move_type', 'convert-out')->values()
                ->map(fn($m) => [
                    'item' => $m->partyItem->item_name ?? '',
                    'qty'  => abs($m->qty),
                    'unit' => $m->unit_name ?? '',
                ]),
            'generated' => $moves->where('move_type', 'convert-in')->values()
                ->map(fn($m) => [
                    'item' => $m->partyItem->item_name ?? '',
                    'qty'  => $m->qty,
                    'weight' => $m->weight !== null ? (float)$m->weight : null,
                    'unit' => $m->unit_name ?? '',
                    'is_main'     => (bool)($m->meta['is_main'] ?? false),
                    'per_kg_rate' => $m->meta['per_kg_rate'] ?? null,
                    'sale_value'  => $m->meta['sale_value'] ?? null,
                ]),
        ]);
    }


    /* ----------  EDIT form  ---------- */
    public function edit($id)
    {
        $refNo = PartyStockMove::findOrFail($id)->ref_no;

        $moves = PartyStockMove::with(['partyItem'])
            ->where('ref_no', $refNo)
            ->get();

        // transform to the same structure your ConvertForm expects
        $header = $moves->first();
        $payload = [
            'date'            => $header->date,
            'ref_no'          => $header->ref_no,
            'party_ledger_id' => $header->party_ledger_id,
            'godown_id'       => $header->godown_id_from ?: $header->godown_id_to,
            'consumed'  => $moves->where('move_type', 'convert-out')->values(),
            'generated' => $moves->where('move_type', 'convert-in')->values(),
        ];

        return Inertia::render('crushing/ConvertForm', [
            // same props as create() plus ↓ pre-fill data
            'preset' => $payload,
            //…other props (parties, godowns, units, available_stock, etc.)
        ]);
    }

    public function update(Request $request, $id)
    {
        // 1. find voucher by ref_no
        $refNo = PartyStockMove::findOrFail($id)->ref_no;

        // 2. OPTIONAL: rollback stock & delete prior moves
        DB::transaction(function () use ($refNo) {
            // Reverse quantities (add back convert-out, subtract convert-in)…
            // or simpler: just delete and let fresh insert happen.
            foreach (PartyStockMove::where('ref_no', $refNo)->lockForUpdate()->get() as $move) {
                $stock = PartyJobStock::where('party_item_id', $move->party_item_id)
                    ->where('godown_id', $move->godown_id_from ?: $move->godown_id_to)
                    ->where('party_ledger_id', $move->party_ledger_id)   // 👈 add
                    ->first();
                if ($stock) {
                    $stock->qty -= $move->qty;   // because convert-out had negative qty
                    $stock->save();
                }
                $move->delete();
            }
        });

        // 3. Re-use the same validation & insertion logic from transfer()
        return $this->transfer($request);   // or copy logic inline
    }

    /* ----------  DESTROY  ---------- */
    public function destroy($id)
    {
        $refNo = PartyStockMove::findOrFail($id)->ref_no;

        DB::transaction(function () use ($refNo) {
            foreach (PartyStockMove::where('ref_no', $refNo)->lockForUpdate()->get() as $move) {
                $stock = PartyJobStock::where('party_item_id', $move->party_item_id)
                    ->where('godown_id', $move->godown_id_from ?: $move->godown_id_to)
                    ->where('party_ledger_id', $move->party_ledger_id)   // 👈 add
                    ->first();
                if ($stock) {
                    $stock->qty -= $move->qty;   // reverse the movement
                    $stock->save();
                }
                $move->delete();
            }
        });

        return back()->with('success', 'Conversion deleted.');
    }

    public function companyIndex()
    {
        $refNos = StockMove::select('ref_no')
            ->whereNotNull('ref_no')
            ->whereIn('type', ['in', 'out'])
            ->where('created_by', auth()->id())
            ->where(function ($q) {
                $q->where('reason', 'Crushing')
                    ->orWhere('reason', 'like', 'Crushing convert-%');
            })
            ->groupBy('ref_no')
            ->orderByRaw('MAX(created_at) DESC')
            ->paginate(10);

        $moves = StockMove::with(['item:id,item_name', 'lot:id,lot_no', 'godown:id,name'])
            ->whereIn('ref_no', $refNos->pluck('ref_no'))
            ->orderBy('created_at', 'desc')
            ->get();

        $grouped = $moves->groupBy('ref_no')->map(function ($group) {
            $first = $group->first();

            return [
                'id'         => $first->id,
                'ref_no'     => $first->ref_no,
                // if you have a `date` column on stock_moves, prefer it; otherwise use created_at
                'date'       => optional($group->max('created_at'))->toDateString(),
                'godown_name' => $first->godown?->name ?? '',   // ← keep key name consistent with your TSX
                'remarks'    => 'Crushing',
                'items'      => $group->map(fn($m) => [
                    'item_name' => $m->item?->item_name ?? '',
                    'unit_name' => $m->unit_name ?? '',       // if you store it
                    'qty'       => (float) $m->qty,
                    'weight'    => $m->weight !== null ? (float)$m->weight : null,
                    'move_type' => $m->type === 'in' ? 'convert-in' : 'convert-out',
                ])->values(),
            ];
        })->values();

        return Inertia::render('crushing/CompanyConvertIndex', [
            'conversions' => $grouped,
            'pagination'  => [
                'links'       => $refNos->linkCollection(),
                'currentPage' => $refNos->currentPage(),
                'lastPage'    => $refNos->lastPage(),
                'total'       => $refNos->total(),
            ],
        ]);
    }


    protected function storeCompany(Request $request)
    {
        $refNo = 'CCONV-' . now()->format('Ymd') . '-' . random_int(1000, 9999);
        $v = $request->validate([
            'owner'      => ['required', 'in:company'],
            'date'       => ['required', 'date'],
            'godown_id'  => ['required', 'exists:godowns,id'],

            // CONSUMED
            'consumed'               => ['required', 'array', 'min:1'],
            'consumed.*.item_id'     => ['required', 'exists:items,id'],
            'consumed.*.lot_id'      => ['required', 'exists:lots,id'],
            'consumed.*.qty'         => ['required', 'numeric', 'min:0.01'],
            'consumed.*.weight'        => ['nullable', 'numeric', 'min:0'],

            // GENERATED (either item_id OR item_name)
            'generated'                 => ['required', 'array', 'min:1'],
            'generated.*.item_id'       => ['nullable', 'exists:items,id', 'required_without:generated.*.item_name'],
            'generated.*.item_name'     => ['nullable', 'string', 'max:255', 'required_without:generated.*.item_id'],
            'generated.*.unit_name'     => ['nullable', 'string', 'max:50'], // used only when creating a new item
            'generated.*.lot_no'        => ['required', 'string', 'max:255'],
            'generated.*.qty'           => ['required', 'numeric', 'min:0.01'],
            'generated.*.weight'       => ['nullable', 'numeric', 'min:0'],
            'generated.*.bosta_weight' => ['nullable', 'numeric', 'min:0'],
            'generated.*.is_main'     => ['nullable', 'boolean'],
            'generated.*.per_kg_rate' => ['nullable', 'numeric', 'min:0'],
            'generated.*.sale_value'  => ['nullable', 'numeric', 'min:0'],
        ]);

        $jobId = $request->input('job_id');

        DB::transaction(function () use ($v, $jobId, $refNo) {

            /* ---------- 1) CONSUME (out) ------------------------------------ */
            foreach ($v['consumed'] as $row) {
                $stock = Stock::where([
                    'item_id'   => $row['item_id'],
                    'lot_id'    => $row['lot_id'],
                    'godown_id' => $v['godown_id'],
                ])->lockForUpdate()->first();

                if (!$stock || $stock->qty < $row['qty']) {
                    throw ValidationException::withMessages([
                        'consumed' => ["Not enough qty for item #{$row['item_id']} lot #{$row['lot_id']}"],
                    ]);
                }
                $w = null;
                if (array_key_exists('weight', $row) && $row['weight'] !== null && $row['weight'] !== '') {
                    $w = -abs((float)$row['weight']);
                }
                // history
                StockMove::create([
                    'ref_no'    => $refNo,
                    // 'date'       => $v['date'],
                    'weight'     => $w,
                    'godown_id'  => $v['godown_id'],
                    'item_id'    => $row['item_id'],
                    'lot_id'     => $row['lot_id'],
                    'type'       => 'out',                 // ✅ valid value
                    'qty'        => -$row['qty'],
                    'reason'     => 'Crushing convert-out',
                    'created_by' => auth()->id(),
                ]);

                // balance
                $stock->decrement('qty', $row['qty']);
            }

            /* ---------- 2) GENERATE (in) ------------------------------------ */

            foreach ($v['generated'] as $row) {
                // ---- derive unit weight (kg per unit) & movement total weight ----
                $unitName   = strtolower(trim($row['unit_name'] ?? ''));  // 'kg' | 'bosta' | ...
                $qty        = (float) $row['qty'];
                $bostaW     = isset($row['bosta_weight']) && $row['bosta_weight'] !== '' ? (float)$row['bosta_weight'] : null;
                $moveWeight = isset($row['weight']) && $row['weight'] !== '' ? (float)$row['weight'] : null;

                $unitWeightKg = null; // kg per 1 inventory unit
                if ($unitName === 'kg') {
                    $unitWeightKg = 1.0;
                    if ($moveWeight === null) $moveWeight = $qty; // qty already in kg
                } elseif ($unitName === 'bosta') {
                    if ($bostaW && $bostaW > 0) {
                        $unitWeightKg = $bostaW;
                    } elseif ($moveWeight && $qty > 0) {
                        $unitWeightKg = $moveWeight / $qty; // infer
                    }
                    if ($moveWeight === null && $unitWeightKg) {
                        $moveWeight = $qty * $unitWeightKg;
                    }
                } else {
                    // other unit: infer if possible
                    if ($moveWeight && $qty > 0) {
                        $unitWeightKg = $moveWeight / $qty;
                    }
                }

                // ---- resolve/create Item (catalog), fill per-unit kg into items.weight (if empty) ----
                if (!empty($row['item_id'])) {
                    $itemId = (int)$row['item_id'];
                    $item   = Item::find($itemId);
                    if ($item && ($item->weight === null || (float)$item->weight == 0) && $unitWeightKg) {
                        $item->weight = $unitWeightKg;          // ⬅ catalog-level per-unit weight
                        $item->save();
                    }
                } else {
                    $unitId = null;
                    if (!empty($row['unit_name'])) {
                        $unitId = Unit::where('name', $row['unit_name'])->value('id');
                    }
                    $categoryId = \App\Models\Category::firstOrCreate(
                        ['name' => 'Finished Goods', 'created_by' => auth()->id()],
                        []
                    )->id;

                    $item = Item::firstOrCreate(
                        ['item_name' => trim($row['item_name'])],
                        [
                            'unit_id'     => $unitId,
                            'category_id' => $categoryId,
                            'godown_id'   => $v['godown_id'],
                            'weight'      => $unitWeightKg,      // ⬅ set on create
                            'created_by'  => auth()->id(),
                        ]
                    );
                    $itemId = $item->id;

                    // if existed and empty weight → backfill once
                    if (!$item->wasRecentlyCreated && ($item->weight === null || (float)$item->weight == 0) && $unitWeightKg) {
                        $item->weight = $unitWeightKg;
                        $item->save();
                    }
                }

                // ---- create/reuse Lot, snapshot per-unit weight on lot (batch-level) ----
                $lot = Lot::firstOrCreate(
                    [
                        'godown_id' => $v['godown_id'],
                        'item_id'   => $itemId,
                        'lot_no'    => trim($row['lot_no']),
                    ],
                    [
                        'received_at' => date('Y-m-d', strtotime($v['date'])),
                        'unit_weight' => $unitWeightKg,         // ⬅ per-unit kg on this batch
                        'created_by'  => auth()->id(),
                    ]
                );
                if (($lot->unit_weight === null || (float)$lot->unit_weight == 0) && $unitWeightKg) {
                    $lot->unit_weight = $unitWeightKg;
                    $lot->save();
                }

                // ---- valuation for stock value (unit_cost) ----
                // MAIN: prefer per_kg_rate from UI; for kg items it's tk/kg; for bosta items make it tk/bosta.
                // BYPRODUCT: if sale_value given, set unit_cost = sale_value/qty so value carries.
                $isMain       = (bool)($row['is_main'] ?? false);
                $perKgRate    = isset($row['per_kg_rate']) && $row['per_kg_rate'] !== '' ? (float)$row['per_kg_rate'] : null;
                $saleValue    = isset($row['sale_value']) && $row['sale_value'] !== '' ? (float)$row['sale_value'] : null;

                $unitCost = null; // cost per inventory unit (per kg OR per bosta, matching the unit)
                if ($isMain && $perKgRate !== null) {
                    $unitCost = ($unitName === 'kg')
                        ? $perKgRate                         // tk/kg
                        : (($unitWeightKg ?: 0) > 0 ? $perKgRate * $unitWeightKg : null); // tk/bosta
                } elseif (!$isMain && $saleValue !== null && $qty > 0) {
                    $unitCost = $saleValue / $qty;           // tk per unit for byproducts
                }

                // ---- stock balance & average cost update ----
                $stock = Stock::lockForUpdate()->firstOrNew([
                    'item_id'   => $itemId,
                    'lot_id'    => $lot->id,
                    'godown_id' => $v['godown_id'],
                ]);

                $oldQty = (float)($stock->exists ? $stock->qty : 0);
                $oldAvg = (float)($stock->avg_cost ?? 0);

                $newQty = $oldQty + $qty;
                if ($unitCost !== null && $newQty > 0) {
                    $newAvg = (($oldQty * $oldAvg) + ($qty * $unitCost)) / $newQty;
                    $stock->avg_cost = round($newAvg, 6);
                }
                $stock->qty = $newQty;
                $stock->created_by = $stock->created_by ?: auth()->id();
                $stock->save();

                // ---- movement history (IN) with weight + unit_cost for downstream costing ----
                $w = $moveWeight !== null ? abs($moveWeight) : null;

                StockMove::create([
                    'ref_no'     => $refNo,
                    // 'date'    => $v['date'],
                    'godown_id'  => $v['godown_id'],
                    'item_id'    => $itemId,
                    'lot_id'     => $lot->id,
                    'type'       => 'in',
                    'qty'        => $qty,
                    'weight'     => $w,             // total kg moved in
                    'unit_cost'  => $unitCost,      // ⬅ key for valuation
                    'reason'     => 'Crushing convert-in',
                    'meta'       => [
                        'is_main'     => $isMain,
                        'per_kg_rate' => $perKgRate,
                        'sale_value'  => $saleValue,
                    ],
                    'created_by' => auth()->id(),
                ]);
            }


            // Mark job posted (optional)
            if ($jobId) {
                $job = CrushingJob::lockForUpdate()->find($jobId);
                if ($job && $job->created_by === auth()->id()) {
                    $job->update([
                        'posted_ref_no' => $v['date'] . '-company',
                        'posted_at'     => now(),
                    ]);
                }
            }
        });

        return redirect()->route('company-conversions.index')
            ->with('success', 'Conversion saved (company stock).');
    }

    public function companyShow($id)
    {
        $refNo = \App\Models\StockMove::findOrFail($id)->ref_no;

        $moves = \App\Models\StockMove::with([
            'item:id,item_name,unit_id',
            'item.unit:id,name',
            'lot:id,lot_no',
            'godown:id,name'
        ])
            ->where('ref_no', $refNo)
            ->orderBy('type') // out first, then in
            ->get();

        $date  = optional($moves->max('created_at'))->toDateString();
        $first = $moves->first();

        // ---------- Build price reference maps (for consumed/out) ----------
        $lotIds  = $moves->pluck('lot_id')->filter()->unique()->values();
        $itemIds = $moves->pluck('item_id')->filter()->unique()->values();

        // Latest IN/purchase unit_cost per lot
        $lastRates = \App\Models\StockMove::select('lot_id', 'unit_cost')
            ->whereIn('type', ['in', 'purchase'])
            ->whereIn('lot_id', $lotIds)
            ->orderBy('lot_id')
            ->orderByDesc('id')
            ->get()
            ->unique('lot_id')
            ->keyBy('lot_id'); // [lot_id => StockMove]

        // avg_cost from stock per lot (any godown is fine for a fallback)
        $avgCosts = \App\Models\Stock::select('lot_id', 'avg_cost')
            ->whereIn('lot_id', $lotIds)
            ->get()
            ->keyBy('lot_id'); // [lot_id => Stock]

        // opening lot id per item
        $openingLots = \App\Models\Lot::selectRaw('MIN(id) as id, item_id')
            ->whereIn('item_id', $itemIds)
            ->groupBy('item_id')
            ->pluck('id', 'item_id'); // [item_id => opening_lot_id]

        // item.purchase_price
        $itemPurchase = \App\Models\Item::whereIn('id', $itemIds)
            ->pluck('purchase_price', 'id'); // [item_id => price]

        // Helper: compute unit rate for an OUT move (qty-basis)
        $computeRate = function ($m) use ($lastRates, $avgCosts, $openingLots, $itemPurchase) {
            $rate = (float) ($lastRates[$m->lot_id]->unit_cost ?? 0);
            if ($rate == 0 && isset($avgCosts[$m->lot_id])) {
                $rate = (float) ($avgCosts[$m->lot_id]->avg_cost ?? 0);
            }
            if ($rate == 0 && isset($openingLots[$m->item_id]) && $openingLots[$m->item_id] == $m->lot_id) {
                $rate = (float) ($itemPurchase[$m->item_id] ?? 0);
            }
            return $rate;
        };

        // ---------- Transform for UI ----------
        $consumed = $moves->where('type', 'out')->values()->map(function ($m) use ($computeRate) {
            // qty basis: if unit is explicitly 'kg' use weight; else use qty
            $basis   = (strtolower($m->unit_name ?? '') === 'kg') ? 'weight' : 'qty';
            $qtyLike = $basis === 'weight' ? abs((float) $m->weight) : abs((float) $m->qty);
            $rate    = $computeRate($m);
            $amount  = round($qtyLike * $rate, 2);

            return [
                'item'       => $m->item?->item_name ?? '',
                'lot'        => $m->lot?->lot_no ?? '',
                'qty'        => abs((float) $m->qty),
                'weight'     => $m->weight !== null ? abs((float)$m->weight) : null,
                'unit'       => $m->item?->unit?->name ?? ($m->unit_name ?? null),
                'unit_rate'  => $rate ?: null,        // ← reconstructed input rate
                'basis'      => $basis,               // 'qty' or 'weight' (for your table badge, if needed)
                'amount'     => $amount,              // ← rate × (qty|weight)
            ];
        });

        $generated = $moves->where('type', 'in')->values()->map(function ($m) {
            $meta     = is_array($m->meta) ? $m->meta : (json_decode($m->meta ?? '{}', true) ?: []);
            $isMain   = (bool)($meta['is_main'] ?? false);
            $perKg    = $meta['per_kg_rate'] ?? null;
            $saleVal  = $meta['sale_value'] ?? null;

            // Amount for display:
            // - main: per-kg × weight (if both present)
            // - by-product: sale_value
            $amount = null;
            if ($isMain && $perKg !== null && $m->weight !== null) {
                $amount = round(((float)$perKg) * ((float)$m->weight), 2);
            } elseif (!$isMain && $saleVal !== null) {
                $amount = (float)$saleVal;
            }

            return [
                'item'        => $m->item?->item_name ?? '',
                'lot'         => $m->lot?->lot_no ?? '',
                'qty'         => (float) $m->qty,
                'weight'      => $m->weight !== null ? (float)$m->weight : null,
                'unit'        => $m->item?->unit?->name ?? ($m->unit_name ?? null),

                // Pricing bits for UI:
                'is_main'     => $isMain,
                'per_kg_rate' => $perKg !== null ? (float)$perKg : null,  // show for main
                'sale_value'  => $saleVal !== null ? (float)$saleVal : null, // show for by-products
                'amount'      => $amount, // derived line total
            ];
        });

        return \Inertia\Inertia::render('crushing/CompanyConvertShow', [
            'header' => [
                'date'    => $date,
                'ref_no'  => $refNo,
                'godown'  => $first?->godown?->name ?? '',
                'remarks' => 'Crushing',
            ],
            'consumed'  => $consumed,
            'generated' => $generated,
        ]);
    }


    public function computePaddyTotal(Request $request)
    {
        $v = $request->validate([
            'owner'      => ['required', 'in:company,party'],
            'godown_id'  => ['required', 'integer'],
            'consumed'   => ['required', 'array', 'min:1'],

            // company rows
            'consumed.*.item_id'     => ['nullable', 'integer'],
            'consumed.*.lot_id'      => ['nullable', 'integer'],

            // party rows
            'consumed.*.party_item_id' => ['nullable', 'integer'],

            // common
            'consumed.*.qty'         => ['required', 'numeric', 'min:0.0001'],
            'consumed.*.weight'      => ['nullable', 'numeric', 'min:0'],
            'consumed.*.unit_name'   => ['nullable', 'string', 'max:50'],
        ]);

        $owner    = $v['owner'];
        $godownId = (int) $v['godown_id'];
        $rows     = collect($v['consumed']);

        $breakdown = [];
        $total = 0.0;

        if ($owner === 'company') {
            // ---------- COMPANY: use ItemController@show logic, but batched ----------
            $lotIds  = $rows->pluck('lot_id')->filter()->unique()->values();
            $itemIds = $rows->pluck('item_id')->filter()->unique()->values();

            // last IN/purchase unit_cost per lot
            $lastRates = \App\Models\StockMove::select('lot_id', 'unit_cost')
                ->whereIn('type', ['in', 'purchase'])
                ->whereIn('lot_id', $lotIds)
                ->orderBy('lot_id')
                ->orderByDesc('id')
                ->get()
                ->unique('lot_id')
                ->keyBy('lot_id'); // [lot_id => StockMove]

            // avg_cost from stock row (per lot in the selected godown)
            $avgCosts = \App\Models\Stock::select('lot_id', 'avg_cost')
                ->whereIn('lot_id', $lotIds)
                ->where('godown_id', $godownId)
                ->get()
                ->keyBy('lot_id'); // [lot_id => Stock]

            // opening lot id per item (earliest lot)
            $openingLots = \App\Models\Lot::selectRaw('MIN(id) as id, item_id')
                ->whereIn('item_id', $itemIds)
                ->groupBy('item_id')
                ->pluck('id', 'item_id'); // [item_id => opening_lot_id]

            // purchase_price per item
            $itemPurchase = \App\Models\Item::whereIn('id', $itemIds)
                ->pluck('purchase_price', 'id'); // [item_id => price]

            foreach ($rows as $i => $r) {
                $lotId  = (int) ($r['lot_id'] ?? 0);
                $itemId = (int) ($r['item_id'] ?? 0);

                // 1) latest IN unit_cost
                $rate = (float) ($lastRates[$lotId]->unit_cost ?? 0);

                // 2) fallback: avg_cost
                if ($rate == 0 && isset($avgCosts[$lotId])) {
                    $rate = (float) ($avgCosts[$lotId]->avg_cost ?? 0);
                }

                // 3) fallback: if this is the opening lot for the item → item.purchase_price
                if ($rate == 0 && $itemId && isset($openingLots[$itemId]) && $openingLots[$itemId] == $lotId) {
                    $rate = (float) ($itemPurchase[$itemId] ?? 0);
                }

                // Quantity basis:
                // If you want to price by kg whenever unit_name == 'kg', switch to weight.
                $basis = 'qty';
                $qtyLike = (float) ($r['qty'] ?? 0);
                if (isset($r['unit_name']) && strtolower((string)$r['unit_name']) === 'kg') {
                    $basis = 'weight';
                    $qtyLike = (float) ($r['weight'] ?? 0);
                }

                $lineTotal = round($qtyLike * $rate, 2);
                $total += $lineTotal;

                $breakdown[] = [
                    'index'      => $i,
                    'item_id'    => $itemId,
                    'lot_id'     => $lotId,
                    'rate'       => $rate,
                    'basis'      => $basis,           // 'qty' or 'weight'
                    'quantity'   => $qtyLike,
                    'line_total' => $lineTotal,
                ];
            }
        } else {
            // ---------- PARTY: catalog rate -> latest DEPOSIT rate -> latest any rate ----------
            $partyIds = $rows->pluck('party_item_id')->filter()->unique()->values();
            $creatorId = auth()->id();




            // 1) Latest DEPOSIT with non-null rate per party_item_id
            $lastDeposits = \App\Models\PartyStockMove::select('party_item_id', 'unit_name', 'rate', 'meta')
                ->whereIn('party_item_id', $partyIds)
                ->where('created_by', $creatorId)
                ->where('move_type', 'deposit')
                ->whereNotNull('rate')
                ->orderBy('party_item_id')
                ->orderByDesc('id')
                ->get()
                ->unique('party_item_id')
                ->keyBy('party_item_id');

            // 2) Fallback: latest ANY move with non-null rate per party_item_id
            $lastAnyRated = \App\Models\PartyStockMove::select('party_item_id', 'unit_name', 'rate', 'meta')
                ->whereIn('party_item_id', $partyIds)
                ->where('created_by', $creatorId)
                ->whereIn('move_type', ['deposit', 'withdraw', 'convert-in', 'convert-out'])
                ->whereNotNull('rate')
                ->orderBy('party_item_id')
                ->orderByDesc('id')
                ->get()
                ->unique('party_item_id')
                ->keyBy('party_item_id');


            foreach ($rows as $i => $r) {
                $pid      = (int) ($r['party_item_id'] ?? 0);
                $uiUnit   = strtolower((string) ($r['unit_name'] ?? ''));
                $uiQty    = (float) ($r['qty'] ?? 0);
                $uiWeight = (float) ($r['weight'] ?? 0);

                // Base catalog rate
                $rate = (float) ($partyRates[$pid] ?? 0);

                // ✅ SAFE get() instead of [$pid]
                $move = $lastDeposits->get($pid) ?? $lastAnyRated->get($pid);

                if ($rate <= 0 && $move && $move->rate !== null) {
                    $rate = (float) $move->rate;
                }

                // ✅ NULLSAFE property access
                $moveUnit = strtolower((string) ($move?->unit_name ?? ''));
                $metaRaw  = $move?->meta;
                $meta     = is_string($metaRaw) ? (json_decode($metaRaw, true) ?: []) : ((array) $metaRaw);

                $hasPerKgRate = isset($meta['per_kg_rate']) && (float) $meta['per_kg_rate'] > 0;

                $basis   = 'qty';
                $qtyLike = $uiQty;

                if ($uiUnit === 'kg' || $moveUnit === 'kg' || $hasPerKgRate) {
                    $basis   = 'weight';
                    $qtyLike = $uiWeight;

                    if ($qtyLike <= 0 && $uiQty > 0) {
                        $bw = isset($meta['bosta_weight']) ? (float) $meta['bosta_weight'] : 0;
                        if ($bw > 0) $qtyLike = $uiQty * $bw; // derive kg from বস্তা
                    }
                }

                $lineTotal = round($qtyLike * $rate, 2);
                $total += $lineTotal;

                $breakdown[] = [
                    'index'         => $i,
                    'party_item_id' => $pid,
                    'rate'          => $rate,
                    'basis'         => $basis,
                    'quantity'      => $qtyLike,
                    'line_total'    => $lineTotal,
                ];
            }
        }
        return response()->json([
            'total'     => round($total, 2),
            'breakdown' => $breakdown,
        ]);
    }
}
