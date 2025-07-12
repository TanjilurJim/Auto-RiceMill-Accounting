<?php

namespace App\Http\Controllers;

use App\Models\PartyItem;
use App\Models\PartyStockMove;
use App\Models\PartyJobStock;
use App\Models\AccountLedger;
use App\Models\Godown;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class PartyStockAdjustmentController extends Controller
{
    /* ----------  FORM  ---------- */
    public function create()
    {
        $dateStr = now()->format('Ymd');
        $ref = "CONV-$dateStr-" . random_int(1000, 9999);

        // Build available stock grouped
        $stocks = PartyJobStock::whereHas('partyItem')
            ->with('partyItem')
            ->get()
            ->groupBy(function ($item) {
                return (string)$item->partyItem->party_ledger_id;
            })
            ->map(function ($group) {
                return $group->groupBy(function ($item) {
                    return (string)$item->godown_id;
                })->map(function ($items) {
                    return [
                        'items' => $items->map(function ($stock) {
                            return [
                                'party_item_id' => $stock->party_item_id,
                                'item_name'     => $stock->partyItem->item_name,
                                'qty'           => $stock->qty,
                                'unit_name'     => $stock->unit_name,
                            ];
                        })->values()
                    ];
                });
            });

        return Inertia::render('crushing/ConvertForm', [
            'parties'  => AccountLedger::whereIn('ledger_type', ['sales', 'income'])->get(['id', 'account_ledger_name']),
            'units'    => Unit::all(['id', 'name']),
            'godowns'  => Godown::all(['id', 'name']),
            'today'    => now()->toDateString(),
            'generated_ref_no' => $ref,
            'available_stock' => $stocks,
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
        $moves = PartyStockMove::with(['partyItem', 'partyLedger', 'godownTo'])
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

        $moves = PartyStockMove::with(['partyItem', 'partyLedger', 'godownTo'])
            ->where('ref_no', $refNo)
            ->orderBy('move_type')          // convert-out first
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
}
