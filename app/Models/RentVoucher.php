<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RentVoucher extends Model
{
    use \App\Traits\BelongsToTenant;
    protected $fillable = [
        'date',
        'vch_no',
        'party_ledger_id',
        'grand_total',
        'previous_balance',
        'received_mode_id',
        'received_amount',
        'balance',
        'remarks',
        'created_by'
    ];

    public function lines()
    {
        return $this->hasMany(RentVoucherLine::class, 'voucher_id');
    }
    public function party()
    {
        return $this->belongsTo(AccountLedger::class, 'party_ledger_id');
    }
    public function receivedMode()
    {
        return $this->belongsTo(ReceivedMode::class);
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function godown()
    {
        return $this->belongsTo(Godown::class);
    }
}
