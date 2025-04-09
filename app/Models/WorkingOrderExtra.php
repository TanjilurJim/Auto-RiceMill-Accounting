<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkingOrderExtra extends Model
{
    use HasFactory;

    protected $fillable = [
        'working_order_id',
        'title',
        'quantity',
        'price',
        'total',
    ];

    public function workingOrder()
    {
        return $this->belongsTo(WorkingOrder::class);
    }
}