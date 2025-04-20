<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sale extends Model
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
        'total_discount',
        'grand_total',
        'other_expense_ledger_id',
        'other_amount',
        'shipping_details',
        'delivered_to',
        'truck_rent',
        'rent_advance',
        'net_rent',
        'truck_driver_name',
        'driver_address',
        'driver_mobile',
        'receive_mode',
        'receive_amount',
        'total_due',
        'closing_balance',
        'created_by',
        'inventory_ledger_id',
        'received_mode_id',     // ✅ Add this
        'amount_received',
        'cogs_ledger_id', // ✅ Add this
        'journal_id',  
    ];

    // ✅ Relationships
    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
    }

    public function godown()
    {
        return $this->belongsTo(Godown::class);
    }

    public function salesman()
    {
        return $this->belongsTo(Salesman::class);
    }

    public function accountLedger()
    {
        return $this->belongsTo(AccountLedger::class);
    }

    public function otherExpenseLedger()
    {
        return $this->belongsTo(AccountLedger::class, 'other_expense_ledger_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function receivedMode()
    {
        return $this->belongsTo(ReceivedMode::class);
    }
    public function journal()
    {
        return $this->belongsTo(Journal::class);
    }
}
