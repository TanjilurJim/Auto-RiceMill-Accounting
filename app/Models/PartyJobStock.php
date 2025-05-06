<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartyJobStock extends Model
{
    protected $fillable = [
        'party_ledger_id',
        'item_id',
        'godown_id',
        'qty',
        'created_by',
        'unit_name',  // Add this if you need to store or use unit_name in PartyJobStock
    ];

    public function partyLedger() {
        return $this->belongsTo(AccountLedger::class, 'party_ledger_id');
    }
    
    public function item() {
        return $this->belongsTo(Item::class, 'item_id');
    }
    
    public function godown() {
        return $this->belongsTo(Godown::class, 'godown_id');
    }

    public function creator() {
        return $this->belongsTo(User::class, 'created_by');
    }
}
