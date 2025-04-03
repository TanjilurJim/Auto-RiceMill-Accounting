<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesReturnItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'sales_return_id', 'product_id', 'qty', 'main_price', 'return_amount',
    ];

    public function product()
    {
        return $this->belongsTo(Item::class, 'product_id');
    }
}