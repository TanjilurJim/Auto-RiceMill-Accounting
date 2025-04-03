<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SalesOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'voucher_no',
        'date',
        'account_ledger_id',
        'salesman_id',
        'shipping_details',
        'delivered_to',
        'total_qty',
        'total_amount',
    ];

    public function ledger()
    {
        return $this->belongsTo(AccountLedger::class, 'account_ledger_id');
    }

    public function salesman()
    {
        return $this->belongsTo(Salesman::class);
    }

    public function items()
    {
        return $this->hasMany(SalesOrderItem::class);
    }
}
