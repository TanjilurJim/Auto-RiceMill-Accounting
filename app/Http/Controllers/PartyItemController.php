<?php

namespace App\Http\Controllers;
use App\Models\PartyItem;
use App\Models\AccountLedger;
use App\Models\Item;
use App\Models\Unit;    
use Illuminate\Http\Request;

class PartyItemController extends Controller
{
    //
    public function index(AccountLedger $party)
    {
        return PartyItem::where('party_ledger_id', $party->id)
            ->orderBy('item_name')
            ->get(['item_name', 'unit_id']);
    }
}
