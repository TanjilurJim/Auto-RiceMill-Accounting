<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Purchase extends Model
{
    use SoftDeletes;

    /* ── Status flags ── */
    public const STATUS_DRAFT        = 'draft';
    public const STATUS_PENDING_SUB  = 'pending_sub';
    public const STATUS_PENDING_RESP = 'pending_resp';
    public const STATUS_APPROVED     = 'approved';
    public const STATUS_REJECTED     = 'rejected';

    protected $fillable = [
        'date',
        'voucher_no',
        'godown_id',
        'salesman_id',
        'account_ledger_id',
        'phone',
        'address',
        'total_qty',
        'total_price',
        'total_discount',
        'grand_total',
        'shipping_details',
        'delivered_to',
        'created_by',
        'inventory_ledger_id',

        'status',
        'sub_responsible_id',
        'responsible_id',
        'sub_approved_at',
        'sub_approved_by',
        'approved_at',
        'approved_by',
        'rejected_at',
        'rejected_by',
        // 🆕 Newly added:
        'received_mode_id',
        'amount_paid',
    ];

    protected $casts = ['date' => 'date'];

    // ✅ Relationship with Purchase Items
    public function purchaseItems()
    {
        return $this->hasMany(PurchaseItem::class);
    }

    public function receivedMode()
    {
        return $this->belongsTo(ReceivedMode::class, 'received_mode_id');
    }

    // ✅ Relationship with Godown
    public function godown()
    {
        return $this->belongsTo(Godown::class);
    }

    // ✅ Relationship with Salesman
    public function salesman()
    {
        return $this->belongsTo(Salesman::class);
    }

    // ✅ Relationship with Ledger
    public function accountLedger()
    {
        return $this->belongsTo(AccountLedger::class);
    }

    // ✅ Relationship with User who created
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approvals()
    {
        return $this->hasMany(PurchaseApproval::class);
    }
    public function subApprover()
    {
        return $this->belongsTo(User::class, 'sub_approved_by');
    }
    public function respApprover()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
