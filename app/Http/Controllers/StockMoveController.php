<?php

namespace App\Http\Controllers;

use App\Models\{StockMove, Lot, Stock, Item};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockMoveController extends Controller
{
    public function create()
    {
        return inertia('stock-moves/create', [
            'godowns' => \App\Models\Godown::get(['id','name']),
            'items'   => Item::select('id','item_name')->get(),
        ]);
    }

    /* -------------------------------------------------
     |  Payload the Vue/React page will send:
     |  {
     |    date: '2025-08-01',
     |    godown_id: 3,
     |    lines: [
     |      { item_id: 12, lot_no: 'A-15',  type: 'in',  qty: 30, unit_cost: 48 },
     |      { item_id: 12, lot_no: 'A-15',  type: 'out', qty:  5 },
     |      { item_id: 20, lot_no: 'B-2',   type: 'in',  qty: 18 },
     |    ]
     |  }
     * ------------------------------------------------*/
    public function store(Request $req)
    {
        $req->validate([
            'godown_id'          => 'required|exists:godowns,id',
            'lines'              => 'required|array|min:1',
            'lines.*.item_id'    => 'required|exists:items,id',
            'lines.*.lot_no'     => 'required|string|max:50',
            'lines.*.type'       => 'required|in:in,out,adjust',
            'lines.*.qty'        => 'required|numeric|min:0.0001',
            'lines.*.unit_cost'  => 'nullable|numeric|min:0',
            'lines.*.reason'     => 'nullable|string|max:120',
        ]);

        DB::transaction(function () use ($req) {

            foreach ($req->lines as $row) {

                /* 1️⃣  Lot – create or reuse */
                $lot = Lot::firstOrCreate([
                    'godown_id' => $req->godown_id,
                    'item_id'   => $row['item_id'],
                    'lot_no'    => $row['lot_no'],
                ],[
                    'received_at' => $req->date ?? now(),
                    'created_by'  => auth()->id(),
                ]);

                /* 2️⃣  Stock row */
                $stock = Stock::firstOrNew([
                    'godown_id'  => $req->godown_id,
                    'item_id'    => $row['item_id'],
                    'lot_id'     => $lot->id,
                    'created_by' => auth()->id(),
                ]);

                /* 3️⃣  Adjust qty */
                $delta = $row['type'] === 'out' ? -abs($row['qty']) : abs($row['qty']);
                $stock->qty = ($stock->qty ?? 0) + $delta;

                /* 4️⃣  Re-calculate avg cost only when qty comes *in* with a cost */
                if ($row['type'] === 'in' && ($row['unit_cost'] ?? null)) {
                    $oldQty  = $stock->getOriginal('qty') ?? 0;
                    $oldCost = $stock->avg_cost ?? 0;
                    $newQty  = $oldQty + $row['qty'];

                    $stock->avg_cost = $newQty
                        ? (($oldQty*$oldCost) + ($row['qty']*$row['unit_cost'])) / $newQty
                        : 0;
                }
                $stock->save();

                /* 5️⃣  Audit row */
                StockMove::create([
                    'godown_id'  => $req->godown_id,
                    'item_id'    => $row['item_id'],
                    'lot_id'     => $lot->id,
                    'type'       => $row['type'],
                    'qty'        => $row['qty'],
                    'unit_cost'  => $row['unit_cost'] ?? null,
                    'reason'     => $row['reason'] ?? null,
                    'created_by' => auth()->id(),
                ]);
            }
        });

        return back()->with('success','Stock updated!');
    }

    /* a simple list page – optional */
    public function index()
    {
        $moves = StockMove::with(['item','godown','lot','creator'])
                  ->latest()->paginate(15);
        return inertia('stock-moves/index', ['moves'=>$moves]);
    }
}