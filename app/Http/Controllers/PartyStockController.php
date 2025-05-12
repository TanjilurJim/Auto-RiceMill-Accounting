<?php

namespace App\Http\Controllers;

use App\Models\PartyJobStock;
use App\Models\Godown;
use App\Models\Unit;
use Illuminate\Http\Request;

class PartyStockController extends Controller
{
    //

    // public function getAvailableStock($partyId)
    // {
    //     // Fetch available stock for the specific party, along with the item, godown, and unit names
    //     $stock = PartyJobStock::where('party_ledger_id', $partyId)
    //         ->with(['item', 'godown'])  // Eager load the 'item' and 'godown' relationships
    //         ->get(['item_id', 'godown_id', 'qty', 'unit_name']);  // Include unit_name in the selected columns

    //     // Initialize the available stock array
    //     $availableStock = [];

    //     // Group by item_id and godown_id, and store the item_name, godown_name, qty, and unit_name
    //     foreach ($stock as $entry) {
    //         $availableStock[$entry->item_id][$entry->godown_id] = [
    //             'item_name' => $entry->item->item_name,  // Fetch the item name
    //             'godown_name' => $entry->godown->name,   // Fetch the godown name
    //             'qty' => $entry->qty,                    // Store the quantity
    //             'unit_name' => $entry->unit_name,        // Fetch the unit name
    //         ];
    //     }

    //     // Return the stock as a JSON response with item_name, godown_name, qty, and unit_name
    //     return response()->json(['stock' => $availableStock]);
    // }





    // public function getPartyGodowns($partyId)
    // {
    //     // Fetch godowns associated with the party via the 'party_job_stocks' table
    //     $godownIds = PartyJobStock::where('party_ledger_id', $partyId)
    //         ->distinct()
    //         ->pluck('godown_id');  // Get distinct godown ids for the party

    //     // Fetch godowns based on these ids
    //     $godowns = Godown::whereIn('id', $godownIds)->get();

    //     // Return the godowns as a JSON response
    //     return response()->json(['godowns' => $godowns]);
    // }
}
