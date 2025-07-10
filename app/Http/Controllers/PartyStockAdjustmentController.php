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
        $ref = "CONV-$dateStr-".random_int(1000,9999);

        return Inertia::render('crushing/ConvertForm', [
            'parties'  => AccountLedger::whereIn('ledger_type',['sales','income'])->get(['id','account_ledger_name']),
            'units'    => Unit::all(['id','name']),
            'godowns'  => Godown::all(['id','name']),
            'today'    => now()->toDateString(),
            'generated_ref_no' => $ref,
        ]);
    }

    /* ----------  STORE  ---------- */
    public function transfer(Request $request)
    {
        /* 1️⃣  Whole-voucher validation */
        $validated = $request->validate([
            'date'            => ['required','date'],
            'ref_no'          => ['required','string','max:255','unique:party_stock_moves,ref_no'],
            'party_ledger_id' => ['required','exists:account_ledgers,id'],
            'godown_id'       => ['required','exists:godowns,id'],

            /* arrays */
            'consumed'        => ['required','array','min:1'],
            'generated'       => ['required','array','min:1'],

            /* each consumed line */
            'consumed.*.party_item_id' => ['required','exists:party_items,id'],
            'consumed.*.qty'           => ['required','numeric','min:0.01'],
            'consumed.*.unit_name'     => ['nullable','string'],

            /* each generated line */
            'generated.*.item_name'    => ['required','string','max:255'],
            'generated.*.qty'          => ['required','numeric','min:0.01'],
            'generated.*.unit_name'    => ['nullable','string'],
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
                        'consumed' => ['Stock not enough for item #'.$row['party_item_id']],
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

        return redirect()
            ->route('party-stock.withdraw.index')   // or separate convert list
            ->with('success','Conversion saved successfully');
    }
}
