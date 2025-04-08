<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkingOrder extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'date',
        'voucher_no',
        'reference_no',
        'product_id',
        'godown_id',
        'quantity',
        'purchase_price',
        'subtotal',
        'total_price',
        'created_by'
    ];

    // Define relationship with the product (item)
    public function product()
    {
        return $this->belongsTo(Item::class, 'product_id');
    }

    // Define relationship with the godown
    public function godown()
    {
        return $this->belongsTo(Godown::class, 'godown_id');
    }

    // Define relationship with the creator (user)
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
