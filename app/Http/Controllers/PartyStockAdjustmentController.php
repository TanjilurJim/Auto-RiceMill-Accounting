<?php

namespace App\Http\Controllers;

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

class PartyStockAdjustmentController extends Controller
{
    //
    // Transfer Method
    public function create(Request $request)
    {
        return Inertia::render('crushing/TransferForm', [
            'parties' => AccountLedger::whereIn('ledger_type', ['sales', 'income'])
                ->where(createdByMeOnly())
                ->get(['id', 'account_ledger_name']),
            'items'   => Item::where(createdByMeOnly())->get(['id', 'item_name']),
            'godowns' => Godown::where(createdByMeOnly())->get(['id', 'name']),
            'today'   => now()->toDateString(),
        ]);
    }

    public function transfer(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'date'             => ['required', 'date'],
            'party_ledger_id'  => ['required', 'exists:account_ledgers,id'],
            'godown_id_from'   => ['required', 'exists:godowns,id'],
            'godown_id_to'     => ['required', 'exists:godowns,id'],
            'item_id'          => ['required', 'exists:items,id'],
            'qty'              => ['required', 'numeric', 'min:0.01'],
            'remarks'          => ['nullable', 'string'],
        ]);

        // Start a transaction to update both tables
        DB::transaction(function () use ($validated) {
            // Record the transfer in party_stock_moves
            PartyStockMove::create([
                'date'            => $validated['date'],
                'party_ledger_id' => $validated['party_ledger_id'],
                'item_id'         => $validated['item_id'],
                'godown_id_from'  => $validated['godown_id_from'],
                'godown_id_to'    => $validated['godown_id_to'],
                'qty'             => -$validated['qty'], // Negative quantity for withdrawal
                'move_type'       => 'transfer',
                'ref_no'          => $validated['ref_no'] ?? null,
                'remarks'         => $validated['remarks'] ?? null,
                'created_by'      => auth()->id(),
            ]);

            // Update the stock in the source godown (decrease quantity)
            $stockFrom = PartyJobStock::where('party_ledger_id', $validated['party_ledger_id'])
                ->where('item_id', $validated['item_id'])
                ->where('godown_id', $validated['godown_id_from'])
                ->first();

            if ($stockFrom) {
                $stockFrom->qty -= $validated['qty']; // Decrease the quantity in source godown
                $stockFrom->save();
            }

            // Update the stock in the destination godown (increase quantity)
            $stockTo = PartyJobStock::where('party_ledger_id', $validated['party_ledger_id'])
                ->where('item_id', $validated['item_id'])
                ->where('godown_id', $validated['godown_id_to'])
                ->first();

            if ($stockTo) {
                $stockTo->qty += $validated['qty']; // Increase the quantity in destination godown
                $stockTo->save();
            }
        });

        return redirect()->route('party-stock.deposit.index')->with('success', 'মাল স্থানান্তর সফলভাবে সম্পন্ন হয়েছে।');
    }
}
