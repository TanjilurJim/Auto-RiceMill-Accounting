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

     public function receipts()
    {
        return $this->belongsToMany(ReceivedAdd::class, 'rent_voucher_receipts')
            ->withPivot('amount')->withTimestamps();
    }

    /** Total received including the amount received at voucher creation */
    public function receivedTotal(): float
    {
        return (float) $this->received_amount + $this->allocatedTotal();
    }

    /** Allocations made later via the pivot */
    public function allocatedTotal(): float
    {
        return (float) $this->receipts()->sum('rent_voucher_receipts.amount');
    }

    /** Remaining due for THIS voucher only (ignores ledger carryovers) */
    public function dueAmount(): float
    {
        return max(0, (float) $this->grand_total - $this->receivedTotal());
    }
}

