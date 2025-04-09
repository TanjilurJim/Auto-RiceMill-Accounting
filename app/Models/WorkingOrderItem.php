<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkingOrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'working_order_id',
        'product_id',
        'godown_id',
        'quantity',
        'purchase_price',
        'subtotal',
    ];

    /* ─────────── Relationships ─────────── */

    public function workingOrder()
    {
        return $this->belongsTo(WorkingOrder::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class, 'product_id');
    }

    public function godown()
    {
        return $this->belongsTo(Godown::class, 'godown_id');
    }
}
