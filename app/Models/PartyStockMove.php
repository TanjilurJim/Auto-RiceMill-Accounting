<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;

class PartyStockMove extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'date',
        'party_ledger_id',
        'party_item_id',     // 🔄
        'godown_id_from',
        'godown_id_to',
        'qty',
        'weight',
        'rate',
        'total',
        'move_type',
        'ref_no',
        'remarks',
        'created_by',
        'unit_name',
    ];

    public function partyItem()
    {
        return $this->belongsTo(PartyItem::class);
    }
    public function partyLedger()
    {
        return $this->belongsTo(AccountLedger::class);
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
    public function party()
    {
        return $this->belongsTo(AccountLedger::class, 'party_ledger_id');
    }
    public function item()
    {
        return $this->belongsTo(\App\Models\PartyItem::class, 'party_item_id');
    }
}
