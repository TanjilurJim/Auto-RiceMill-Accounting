<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReceivedAdd extends Model
{
    protected $fillable = [
        'date',
        'voucher_no',
        'received_mode_id',
        'account_ledger_id',
        'amount',
        'description',
        'send_sms',
        'created_by',
    ];

    public function receivedMode()
    {
        return $this->belongsTo(ReceivedMode::class);
    }

    public function accountLedger()
    {
        return $this->belongsTo(AccountLedger::class);
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
