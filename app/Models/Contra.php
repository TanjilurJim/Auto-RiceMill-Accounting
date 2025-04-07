<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contra extends Model
{
    protected $fillable = [
        'date',
        'voucher_no',
        'from_account_ledger_id',
        'to_account_ledger_id',
        'amount',
        'description',
        'created_by',
    ];

    public function fromLedger()
    {
        return $this->belongsTo(AccountLedger::class, 'from_account_ledger_id');
    }

    public function toLedger()
    {
        return $this->belongsTo(AccountLedger::class, 'to_account_ledger_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
