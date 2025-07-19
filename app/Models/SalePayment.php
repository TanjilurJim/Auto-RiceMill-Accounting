<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalePayment extends Model
{
    protected $fillable = [
        'sale_id',
        'date',
        'amount',
        'interest_amount',
        'received_mode_id',
        'account_ledger_id',
        'note',
        'created_by'
    ];

    protected $casts = [
        'amount'          => 'decimal:2',
        'interest_amount' => 'decimal:2',
        'date'            => 'date',

        'waive_interest' => 'boolean',
    ];


    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }
    public function mode()
    {
        return $this->belongsTo(ReceivedMode::class, 'received_mode_id');
    }
    public function ledger()
    {
        return $this->belongsTo(AccountLedger::class, 'account_ledger_id');
    }
}
