<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;
class StockMove extends Model
{   
    use BelongsToTenant;
    //
    protected $fillable = [
        'godown_id',
        'item_id',
        'lot_id',
        'type',
        'qty',
        'weight',
        'unit_cost',
        'reason',
        'ref_no',
        
        'created_by',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
    public function godown()
    {
        return $this->belongsTo(Godown::class);
    }
    public function lot()
    {
        return $this->belongsTo(Lot::class);
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
