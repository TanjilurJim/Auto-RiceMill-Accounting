<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SalesOrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'sales_order_id',
        'product_id',
        'quantity',
        'unit_id',
        'rate',
        'discount_type',
        'discount_value',
        'subtotal',
    ];

    public function salesOrder()
    {
        return $this->belongsTo(SalesOrder::class);
    }

    public function product()
    {
        return $this->belongsTo(Item::class, 'product_id'); // important: items table!
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
