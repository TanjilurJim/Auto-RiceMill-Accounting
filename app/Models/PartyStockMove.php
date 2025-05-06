<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartyStockMove extends Model
{
    protected $fillable = [
        'date',
        'party_ledger_id',
        'item_id',
        'godown_id_from',
        'godown_id_to',
        'qty',
        'rate',       // ✅ add this
        'total',
        'move_type',
        'ref_no',
        'remarks',
        'created_by',
        'unit_name',  // Add this to allow mass assignment of unit_name
    ];

    public function partyLedger()
    {
        return $this->belongsTo(AccountLedger::class, 'party_ledger_id');
    }

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }

    public function godownFrom()
    {
        return $this->belongsTo(Godown::class, 'godown_id_from');
    }

    public function godownTo()
    {
        return $this->belongsTo(Godown::class, 'godown_id_to');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
