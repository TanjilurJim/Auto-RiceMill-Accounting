<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinishedProductItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'finished_product_id',
        'product_id',
        'godown_id',
        'quantity',
        'unit_price',
        'total',
    ];

    /* ─────────── Relationships ─────────── */

    public function finishedProduct()
    {
        return $this->belongsTo(FinishedProduct::class);
    }

    public function product()
    {
        return $this->belongsTo(Item::class, 'product_id');
    }

    public function godown()
    {
        return $this->belongsTo(Godown::class);
    }
}
