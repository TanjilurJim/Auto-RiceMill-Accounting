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
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use App\Models\{Item, Stock, StockMove, Lot};

class PartyStockAdjustmentController extends Controller
{
    /* ----------  FORM  ---------- */
    public function create()
    {
        $dateStr = now()->format('Ymd');
        $ref = "CONV-$dateStr-" . random_int(1000, 9999);

        // Group party job stock by party -> godown, include godown_name
        $stocks = PartyJobStock::whereHas('partyItem')
            ->with(['partyItem', 'godown'])
            ->where('created_by', auth()->id()) // tenant safety if not global scoped
            ->get()
            ->groupBy(fn($s) => (string)$s->partyItem->party_ledger_id)
            ->map(function ($group) {
                return $group->groupBy(fn($s) => (string)$s->godown_id)
                    ->map(function ($items) {
                        $g = $items->first()->godown ?? null;               // ✅ define $g
                        return [
                            'godown_name' => $g?->name ?? '',                // ✅ works now
                            'items' => $items->map(function ($stock) {
                                return [
                                    'party_item_id' => $stock->party_item_id,
                                    'item_name'     => $stock->partyItem->item_name,
                                    'qty'           => $stock->qty,
                                    'unit_name'     => $stock->unit_name,
                                ];
                            })->values(),
                        ];
                    });
            });

        // expose running job at top level (not inside available_stock)
        $runningJobId = CrushingJob::where('created_by', auth()->id())
            ->where('status', 'running')
            ->value('id');

        return Inertia::render('crushing/ConvertForm', [
            'parties'          => AccountLedger::whereIn('ledger_type', ['sales', 'income'])->get(['id', 'account_ledger_name']),
            'units'            => Unit::all(['id', 'name']),
            'godowns'          => Godown::all(['id', 'name']),
            'dryers'           => Dryer::forMyCompany()->get(['id', 'dryer_name', 'capacity']),
            'today'            => now()->toDateString(),
            'generated_ref_no' => $ref,
            'available_stock'  => $stocks,
            'running_job_id'   => $runningJobId,                         // ✅ here
        ]);
    }






    /* ----------  STORE  ---------- */
    public function transfer(Request $request)
    {
        /* 1️⃣  Whole-voucher validation */
        $validated = $request->validate([
            'date'            => ['required', 'date'],
            'ref_no'          => ['required', 'string', 'max:255', 'unique:party_stock_moves,ref_no'],
            'party_ledger_id' => ['required', 'exists:account_ledgers,id'],
            'godown_id'       => ['required', 'exists:godowns,id'],

            /* arrays */
            'consumed'        => ['required', 'array', 'min:1'],
            'generated'       => ['required', 'array', 'min:1'],

            /* each consumed line */
            'consumed.*.party_item_id' => ['required', 'exists:party_items,id'],
            'consumed.*.qty'           => ['required', 'numeric', 'min:0.01'],
            'consumed.*.unit_name'     => ['nullable', 'string'],

            /* each generated line */
            'generated.*.item_name'    => ['required', 'string', 'max:255'],
            'generated.*.qty'          => ['required', 'numeric', 'min:0.01'],
            'generated.*.unit_name'    => ['nullable', 'string'],
        ]);

        /* 2️⃣  One transaction – lock + post both sides */
        DB::transaction(function () use ($validated) {

            /* -- CONSUMED (negative) -------------------------------- */
            foreach ($validated['consumed'] as $row) {

                /* lock stock */
                $stock = PartyJobStock::where('party_item_id', $row['party_item_id'])
                    ->where('godown_id', $validated['godown_id'])
                    ->lockForUpdate()
                    ->first();

                if (!$stock || $stock->qty < $row['qty']) {
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        'consumed' => ['Stock not enough for item #' . $row['party_item_id']],
                    ]);
                }

                /* movement */
                PartyStockMove::create([
                    'date'            => $validated['date'],
                    'ref_no'          => $validated['ref_no'],
                    'move_type'       => 'convert-out',
                    'party_ledger_id' => $validated['party_ledger_id'],
                    'party_item_id'   => $row['party_item_id'],
                    'godown_id_from'  => $validated['godown_id'],
                    'godown_id_to'    => null,
                    'qty'             => -$row['qty'],
                    'unit_name'       => $row['unit_name'] ?? null,
                    'total'           => 0,
                    'created_by'      => auth()->id(),
                ]);

                /* decrement balance */
                $stock->qty -= $row['qty'];
                $stock->save();
            }

            /* -- GENERATED (positive) ------------------------------- */
            foreach ($validated['generated'] as $row) {

                $partyItem = PartyItem::firstOrCreate(
                    [
                        'party_ledger_id' => $validated['party_ledger_id'],
                        'item_name'       => trim($row['item_name']),
                    ],
                    ['created_by' => auth()->id()]
                );

                PartyStockMove::create([
                    'date'            => $validated['date'],
                    'ref_no'          => $validated['ref_no'],
                    'move_type'       => 'convert-in',
                    'party_ledger_id' => $validated['party_ledger_id'],
                    'party_item_id'   => $partyItem->id,
                    'godown_id_from'  => null,
                    'godown_id_to'    => $validated['godown_id'],
                    'qty'             =>  $row['qty'],
                    'unit_name'       => $row['unit_name'] ?? null,
                    'total'           => 0,
                    'created_by'      => auth()->id(),
                ]);

                $stock = PartyJobStock::firstOrNew([
                    'party_item_id' => $partyItem->id,
                    'godown_id'     => $validated['godown_id'],
                ]);
                $stock->party_ledger_id = $validated['party_ledger_id'];
                $stock->qty += $row['qty'];
                $stock->unit_name = $row['unit_name'] ?? $stock->unit_name;
                $stock->created_by = auth()->id();
                $stock->save();
            }
        });

        // $voucher = app(\App\Http\Controllers\ConversionVoucherController::class)
        //    ->storeFromValidated($validated);

        return redirect()
            ->route('party-stock.transfer.index')   // or separate convert list
            ->with('success', 'Conversion saved successfully');
    }
    public function jobsIndex()
    {
        $jobs = CrushingJob::with(['dryer', 'godown', 'party'])
            ->where('created_by', auth()->id())
            ->orderByDesc('started_at')
            ->paginate(12);

        return Inertia::render('crushing/JobsIndex', [
            'jobs' => $jobs->through(function ($j) {
                $mins = ($j->started_at && $j->stopped_at) ? $j->stopped_at->diffInMinutes($j->started_at) : null;
                return [
                    'id' => $j->id,
                    'ref_no' => $j->ref_no,
                    'date' => optional($j->date)->toDateString(),
                    'status' => $j->status,
                    'dryer' => $j->dryer?->dryer_name ?? '',
                    'godown' => $j->godown?->name ?? '',
                    'party' => $j->party?->account_ledger_name ?? null,
                    'started_at' => optional($j->started_at)->toDateTimeString(),
                    'stopped_at' => optional($j->stopped_at)->toDateTimeString(),
                    'capacity' => $j->dryer_capacity,
                    'loaded' => $j->total_loaded_qty,
                    'duration_min' => $mins,
                    'utilization' => ($j->dryer_capacity ? round($j->total_loaded_qty / $j->dryer_capacity, 3) : null),
                    'remarks' => $j->remarks,
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
            ],
            'lines' => $lines,
        ]);
    }



    public function jobStart(Request $request)
    {
        // validate header
        $base = $request->validate([
            'date'       => ['required', 'date'],
            'ref_no'     => ['required', 'string', 'max:255'],
            'owner'      => ['required', 'in:company,party'],
            'party_ledger_id' => ['nullable', 'required_if:owner,party', 'exists:account_ledgers,id'],
            'godown_id'  => ['required', 'exists:godowns,id'],
            'dryer_id'   => ['required', 'exists:dryers,id'],
            'remarks'    => ['nullable', 'string', 'max:500'],
        ]);

        // validate lines based on owner
        if ($base['owner'] === 'company') {
            $request->validate([
                'consumed'               => ['required', 'array', 'min:1'],
                'consumed.*.item_id'     => ['required', 'exists:items,id'],
                'consumed.*.lot_id'      => ['required', 'exists:lots,id'],
                'consumed.*.qty'         => ['required', 'numeric', 'min:0.01'],
                'consumed.*.unit_name'   => ['nullable', 'string', 'max:50'],
            ]);
        } else { // party
            $request->validate([
                'consumed'                    => ['required', 'array', 'min:1'],
                'consumed.*.party_item_id'    => ['required', 'exists:party_items,id'],
                'consumed.*.qty'              => ['required', 'numeric', 'min:0.01'],
                'consumed.*.unit_name'        => ['nullable', 'string', 'max:50'],
            ]);
        }

        $dryer = Dryer::findOrFail($base['dryer_id']);

        $job = DB::transaction(function () use ($base, $request, $dryer) {
            $job = CrushingJob::create([
                'ref_no'          => $base['ref_no'],
                'date'            => $base['date'],
                'owner'           => $base['owner'],
                'party_ledger_id' => $base['owner'] === 'party' ? $base['party_ledger_id'] : null,
                'godown_id'       => $base['godown_id'],
                'dryer_id'        => $base['dryer_id'],
                'status'          => 'running',
                'started_at'      => Carbon::now(),
                'dryer_capacity'  => $dryer->capacity,   // snapshot
                'remarks'         => $base['remarks'] ?? null,
                'created_by'      => auth()->id(),
            ]);

            $total = 0;
            foreach ($request->input('consumed', []) as $row) {
                $line = [
                    'crushing_job_id' => $job->id,
                    'source'          => $base['owner'],
                    'qty'             => $row['qty'],
                    'unit_name'       => $row['unit_name'] ?? null,
                    'created_by'      => auth()->id(),
                ];
                if ($base['owner'] === 'company') {
                    $line['item_id'] = $row['item_id'];
                    $line['lot_id']  = $row['lot_id'];
                } else {
                    $line['party_item_id'] = $row['party_item_id'];
                }
                CrushingJobConsumption::create($line);
                $total += (float) $row['qty'];
            }

            $job->update(['total_loaded_qty' => $total]);

            return $job;
        });

        return redirect()
            ->route('crushing.jobs.index')
            ->with('success', 'Dryer started.')
            ->with('running_job_id', $job->id);
    }

    public function jobStop(CrushingJob $job)
    {
        abort_if($job->created_by !== auth()->id(), 403);

        if ($job->status === 'running') {
            $job->status = 'stopped';
            $job->stopped_at = now();
            $job->save();
        }

        return back()->with('success', 'Dryer job stopped.');
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
                    'unit' => $m->unit_name ?? '',
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

    protected function storeCompany(Request $request)
    {
        $v = $request->validate([
            'owner'      => ['required', 'in:company'],
            'date'       => ['required', 'date'],
            'godown_id'  => ['required', 'exists:godowns,id'],

            'consumed'               => ['required', 'array', 'min:1'],
            'consumed.*.item_id'     => ['required', 'exists:items,id'],
            'consumed.*.lot_id'      => ['required', 'exists:lots,id'],
            'consumed.*.qty'         => ['required', 'numeric', 'min:0.01'],

            'generated'              => ['required', 'array', 'min:1'],
            'generated.*.item_id'    => ['required', 'exists:items,id'],
            'generated.*.lot_no'     => ['required', 'string', 'max:255'],
            'generated.*.qty'        => ['required', 'numeric', 'min:0.01'],
        ]);

        DB::transaction(function () use ($v) {

            /* ---------- 1️⃣ CONSUME PADDY -------------------------------- */
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

                /* history */
                StockMove::create([
                    'godown_id' => $v['godown_id'],
                    'item_id'   => $row['item_id'],
                    'lot_id'    => $row['lot_id'],
                    'type'      => 'convert-out',       // ◄— use your enum / string
                    'qty'       => -$row['qty'],
                    'reason'    => 'Crushing',
                    'created_by' => auth()->id(),
                ]);

                /* balance */
                $stock->decrement('qty', $row['qty']);
            }

            /* ---------- 2️⃣ GENERATE RICE / BRAN ------------------------- */
            foreach ($v['generated'] as $row) {

                /* create / reuse lot */
                $lot = Lot::firstOrCreate(
                    [
                        'godown_id' => $v['godown_id'],
                        'item_id'   => $row['item_id'],
                        'lot_no'    => trim($row['lot_no']),
                    ],
                    [
                        'received_at' => $v['date'],
                        'created_by' => auth()->id(),
                    ]
                );

                /* stock balance */
                $stock = Stock::firstOrNew([
                    'item_id'   => $row['item_id'],
                    'lot_id'    => $lot->id,
                    'godown_id' => $v['godown_id'],
                ]);
                $stock->qty += $row['qty'];
                $stock->created_by = $stock->created_by ?: auth()->id();
                $stock->save();

                /* history */
                StockMove::create([
                    'godown_id' => $v['godown_id'],
                    'item_id'   => $row['item_id'],
                    'lot_id'    => $lot->id,
                    'type'      => 'convert-in',
                    'qty'       =>  $row['qty'],
                    'reason'    => 'Crushing',
                    'created_by' => auth()->id(),
                ]);
            }
        });

        return back()->with('success', 'Conversion saved (company stock).');
    }
}
