<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;

class PartyJobStock extends Model
{
    use BelongsToTenant;
    protected $fillable = [
        'party_ledger_id',   // still handy for quick look-ups
        'party_item_id',     // NEW
        'godown_id',
        'qty',
        'unit_name',
        'created_by',
    ];

    public function partyItem()
    {
        return $this->belongsTo(PartyItem::class);
    }
    public function partyLedger()
    {
        return $this->belongsTo(AccountLedger::class, 'party_ledger_id');
    }
    public function godown()
    {
        return $this->belongsTo(Godown::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
