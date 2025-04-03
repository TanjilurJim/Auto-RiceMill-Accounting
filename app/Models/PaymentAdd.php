<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentAdd extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'voucher_no',
        'payment_mode_id',
        'account_ledger_id',
        'amount',
        'description',
        'send_sms',
        'created_by',
    ];

    public function paymentMode()
    {
        return $this->belongsTo(ReceivedMode::class, 'payment_mode_id');
    }

    public function accountLedger()
    {
        return $this->belongsTo(AccountLedger::class);
    }
}
