<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Purchase extends Model
{
    use SoftDeletes;

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

        // 🆕 Newly added:
        'received_mode_id',
        'amount_paid',
    ];

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
}
