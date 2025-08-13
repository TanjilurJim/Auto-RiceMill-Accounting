<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;
class Lot extends Model
{
    use BelongsToTenant;
    protected $fillable = [
        'godown_id','item_id','lot_no','unit_weight','received_at','created_by',
    ];

    public function item()   { return $this->belongsTo(Item::class); }
    public function godown() { return $this->belongsTo(Godown::class); }

    public function stocks()        { return $this->hasMany(Stock::class); }
    public function purchaseItems() { return $this->hasMany(PurchaseItem::class); }

    
    public function saleItems()     { return $this->hasMany(SaleItem::class); }
}