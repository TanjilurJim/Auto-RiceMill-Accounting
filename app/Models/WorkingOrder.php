<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkingOrder extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'tenant_id',
        'date',
        'voucher_no',
        'reference_no',
        'production_status',
        'total_amount',   // new header‑level total
        'created_by',
        'production_voucher_no', 
    ];

    /* ─────────── Relationships ─────────── */

    // all line items that belong to this order
    public function items()
    {
        return $this->hasMany(WorkingOrderItem::class);
    }

    // user who created the order (same as before)
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function extras()
    {
        return $this->hasMany(WorkingOrderExtra::class);
    }
}
