<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseReturnItem extends Model
{
    protected $fillable = [
        'purchase_return_id',
        'product_id',
        'qty',
        'lot_id',
        'price',
        'subtotal',
    ];

    public function purchaseReturn()
    {
        return $this->belongsTo(PurchaseReturn::class);
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
