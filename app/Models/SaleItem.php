<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;
class SaleItem extends Model
{
    
    protected $fillable = [
        'sale_id',
        'product_id',
        'qty',
        'main_price',
        'discount',
        'lot_id',
        'discount_type',
        'subtotal',
        'note',
    ];

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class, 'product_id');
    }
    public function lot()
    {
        return $this->belongsTo(Lot::class);
    }
}
