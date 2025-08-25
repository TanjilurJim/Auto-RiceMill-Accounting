<?php

namespace App\Http\Controllers;

use App\Models\PartyItem;

use App\Models\PartyStockMove;
use App\Models\PartyJobStock;
use App\Models\AccountLedger;
use App\Models\Item;
use App\Models\Unit;
use App\Models\Godown;
use Illuminate\Http\Request;

use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class PartyStockMoveController extends Controller
{
    public function create()
    {
        $dateStr = now()->format('Ymd');
        $random = random_int(1000, 9999);
        $generatedRefNo = "PSD-$dateStr-$random";

        return Inertia::render('crushing/PartyStockDepositForm', [
            'parties' => AccountLedger::whereIn('ledger_type', ['sales', 'income'])

                ->get(['id', 'account_ledger_name']),
            // 'items'   => Item::where(createdByMeOnly())->get(['id', 'item_name', 'unit_id']),
            'units' => Unit::all(['id', 'name']),
            'godowns' => Godown::all(['id', 'name']),
            'today'   => now()->toDateString(),
            'generated_ref_no' => $generatedRefNo,
        ]);
    }

    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'date'             => ['required', 'date'],
            'party_ledger_id'  => ['required', 'exists:account_ledgers,id'],
            'godown_id_to'     => ['required', 'exists:godowns,id'],
            'ref_no'           => ['nullable', 'string', 'max:255'],
            'remarks'          => ['nullable', 'string'],
            'deposits'         => ['required', 'array', 'min:1'],
            'deposits.*.item_name'      => ['required', 'string', 'max:255'],
            'deposits.*.qty'    => ['required', 'numeric', 'min:0.01'],
            'deposits.*.unit_id'        => ['nullable', 'exists:units,id'],
            'deposits.*.unit_name' => ['nullable', 'string'],
            'deposits.*.rate'   => ['required', 'numeric', 'min:0'],  // Ensure rate is required

            'deposits.*.bosta_weight'   => ['nullable', 'numeric', 'min:0'],  // new
            'deposits.*.weight'   => ['nullable', 'numeric', 'min:0'],  // new
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['deposits'] as $deposit) {
                $unitId = \App\Models\Unit::where('name', $deposit['unit_name'])->value('id');

                $partyItem = \App\Models\PartyItem::firstOrCreate(
                    [
                        'party_ledger_id' => $validated['party_ledger_id'],
                        'item_name'       => trim($deposit['item_name']),
                    ],
                    [
                        'unit_id'    => $unitId,
                        'created_by' => auth()->id(),
                    ]
                );

                $qty      = (float) $deposit['qty'];
                $rate     = (float) $deposit['rate'];
                $unitName = strtolower((string)($deposit['unit_name'] ?? ''));
                $perBosta = isset($deposit['bosta_weight']) ? (float)$deposit['bosta_weight'] : 0.0;

                // Prefer client calc only if > 0; otherwise recompute
                $weight = isset($deposit['weight']) ? (float)$deposit['weight'] : 0.0;
                if ($weight <= 0) {
                    if ($unitName === 'kg') {
                        $weight = $qty;
                    } elseif ($unitName === 'bosta' && $perBosta > 0) {
                        $weight = $qty * $perBosta; // kg
                    } else {
                        $weight = null; // unknown
                    }
                }

                \App\Models\PartyStockMove::create([
                    'date'            => $validated['date'],
                    'party_ledger_id' => $validated['party_ledger_id'],
                    'party_item_id'   => $partyItem->id,
                    'godown_id_from'  => null,
                    'godown_id_to'    => $validated['godown_id_to'],
                    'qty'             => $qty,
                    'weight'          => $weight !== null ? round(abs($weight), 3) : null, // store +ve kg
                    'rate'            => $rate,
                    'total'           => bcmul($qty, $rate, 2), // rate per-bosta stays qty×rate
                    'move_type'       => 'deposit',
                    'ref_no'          => $validated['ref_no'] ?? null,
                    'remarks'         => $validated['remarks'] ?? null,
                    'unit_name'       => $deposit['unit_name'] ?? null,
                    'meta'            => ['bosta_weight' => $perBosta ?: null],
                    'created_by'      => auth()->id(),
                ]);

                $stock = \App\Models\PartyJobStock::firstOrNew([
                    'party_item_id' => $partyItem->id,
                    'godown_id'     => $validated['godown_id_to'],
                ]);
                $stock->party_ledger_id = $validated['party_ledger_id'];
                $stock->qty        = ($stock->qty ?? 0) + $qty;
                $stock->unit_name  = $deposit['unit_name'] ?? $stock->unit_name;
                $stock->created_by = auth()->id();
                $stock->save();
            }
        });


        // Redirect back with success message
        return redirect()->route('party-stock.deposit.index')->with('success', 'পণ্য জমা সফলভাবে হয়েছে।');
    }


    // Method to display the list of deposits
    public function index()
    {
        // Step 1: Get paginated list of distinct ref_no's
        $refNos = PartyStockMove::select('ref_no')
            ->where('move_type', 'deposit')

            ->groupBy('ref_no')
            ->orderByRaw('MAX(date) DESC')
            ->paginate(10); // Adjust per page as needed

        // Step 2: Get all stock moves with those ref_nos
        $moves = PartyStockMove::with(['partyItem', 'partyLedger', 'godownTo'])
            ->where('move_type', 'deposit')

            ->whereIn('ref_no', $refNos->pluck('ref_no'))
            ->orderBy('date', 'desc')
            ->get();

        // Step 3: Group moves by ref_no and format
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
                        'rate' => $item->rate ?? 0,
                        'total' => $item->total ?? 0,
                    ];
                })->values(),
            ];
        })->values();

        return Inertia::render('crushing/PartyStockDepositIndex', [
            'deposits' => $grouped,
            'pagination' => [
                'links' => $refNos->linkCollection(),
                'currentPage' => $refNos->currentPage(),
                'lastPage' => $refNos->lastPage(),
                'total' => $refNos->total(),
            ],
        ]);
    }

    public function show($id)
    {
        $row   = \App\Models\PartyStockMove::findOrFail($id);
        $refNo = $row->ref_no;

        $moves = \App\Models\PartyStockMove::with(['partyItem', 'partyLedger', 'godownTo'])
            ->where('move_type', 'deposit')
            ->where('ref_no', $refNo)
            ->orderBy('id')
            ->get();

        if ($moves->isEmpty()) abort(404);

        $first        = $moves->first();
        $totalQty     = (float) $moves->sum('qty');
        $totalWeight  = (float) $moves->whereNotNull('weight')->sum('weight');
        $totalAmount  = (float) $moves->whereNotNull('total')->sum('total');

        $items = $moves->map(function ($m) {
            $meta = is_array($m->meta) ? $m->meta : (json_decode($m->meta ?? '{}', true) ?: []);
            return [
                'item_name'    => $m->partyItem->item_name ?? '',
                'unit_name'    => $m->unit_name ?? '',
                'qty'          => (float) $m->qty,
                'rate'         => $m->rate !== null ? (float)$m->rate : null,
                'total'        => $m->total !== null ? (float)$m->total : null,
                'weight'       => $m->weight !== null ? (float)$m->weight : null,
                'bosta_weight' => isset($meta['bosta_weight']) ? (float)$meta['bosta_weight'] : null,
            ];
        })->values();

        // 🔹 NEW: current balances for these items in this godown
        $partyId  = (int) $first->party_ledger_id;
        $godownId = (int) $first->godown_id_to; // deposit → to
        $itemIds  = $moves->pluck('party_item_id')->unique()->values();

        $balances = \App\Models\PartyJobStock::with('partyItem:id,item_name')
            ->where('party_ledger_id', $partyId)
            ->where('godown_id', $godownId)
            ->whereIn('party_item_id', $itemIds)
            ->get()
            ->map(fn($s) => [
                'party_item_id' => (int) $s->party_item_id,
                'item_name'     => $s->partyItem->item_name ?? '',
                'qty'           => (float) $s->qty,
                'unit_name'     => $s->unit_name,
            ])
            ->values();

        return \Inertia\Inertia::render('crushing/PartyStockDepositShow', [
            'header' => [
                'date'         => $first->date,
                'ref_no'       => $refNo,
                'party'        => $first->partyLedger->account_ledger_name ?? '',
                'godown'       => $first->godownTo->name ?? '',
                'remarks'      => $first->remarks,
                'total_qty'    => $totalQty,
                'total_weight' => $totalWeight ?: null,
                'total_amount' => $totalAmount,
            ],
            'items'     => $items,
            'balances'  => $balances, // 👈 send to front-end
        ]);
    }


    //withdraw 



    //transfer


}
