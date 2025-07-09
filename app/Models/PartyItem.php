<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartyItem extends Model
{
    //
    protected $fillable = [
        'party_ledger_id', 'item_name', 'unit_id', 'created_by',
    ];

    public function partyLedger() { return $this->belongsTo(AccountLedger::class, 'party_ledger_id'); }
    public function unit()        { return $this->belongsTo(Unit::class); }
    public function stocks()      { return $this->hasMany(PartyJobStock::class); }   // re-used class
    public function moves()       { return $this->hasMany(PartyStockMove::class); }
}
