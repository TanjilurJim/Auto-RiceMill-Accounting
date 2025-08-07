<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;
class Stock extends Model
{
    use BelongsToTenant;  

    protected $fillable = ['item_id','lot_id', 'godown_id', 'qty', 'created_by'];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function godown()
    {
        return $this->belongsTo(Godown::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function lot()
    {
        return $this->belongsTo(Lot::class);
    }
    
    // ─── Scopes ──────────────────────────────────────────
    public function scopeForLot   ($q,$lotId)  { return $q->where('lot_id',   $lotId); }
    public function scopeForItem  ($q,$itemId) { return $q->where('item_id',  $itemId); }

    // ─── Convenience accessor (history) ─────────────────
    public function moves()
    {
        return StockMove::where([
            'item_id'   => $this->item_id,
            'godown_id' => $this->godown_id,
            'lot_id'    => $this->lot_id,
        ]);
    }

}
