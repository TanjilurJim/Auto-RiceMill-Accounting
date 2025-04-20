<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SalesReturn extends Model
{
    use HasFactory;

    protected $fillable = [
        'sale_id', 'account_ledger_id', 'godown_id', 'salesman_id', 'voucher_no', 'return_date', 'reason', 'phone', 'address', 'total_qty', 'total_return_amount', 'created_by','inventory_ledger_id', 'cogs_ledger_id','received_mode_id', 'amount_received',
    ];

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function accountLedger()
    {
        return $this->belongsTo(AccountLedger::class, 'account_ledger_id');
    }

    public function godown()
    {
        return $this->belongsTo(Godown::class);
    }

    public function salesman()
    {
        return $this->belongsTo(Salesman::class);
    }

    public function items()
    {
        return $this->hasMany(SalesReturnItem::class);
    }
}
