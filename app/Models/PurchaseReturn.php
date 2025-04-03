<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PurchaseReturn extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'date',
        'return_voucher_no',
        'godown_id',
        'account_ledger_id',
        'reason',
        'total_qty',
        'grand_total',
        'created_by',
    ];

    public function godown()
    {
        return $this->belongsTo(Godown::class);
    }

    public function accountLedger()
    {
        return $this->belongsTo(AccountLedger::class);
    }

    public function returnItems()
    {
        return $this->hasMany(PurchaseReturnItem::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
