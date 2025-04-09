<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinishedProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'working_order_id',
        'production_date',
        'production_voucher_no',
        'remarks',
        'created_by',
    ];

    /* ─────────── Relationships ─────────── */

    public function workingOrder()
    {
        return $this->belongsTo(WorkingOrder::class);
    }

    public function items()
    {
        return $this->hasMany(FinishedProductItem::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
