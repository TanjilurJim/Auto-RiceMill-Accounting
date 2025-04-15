<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReceivedMode extends Model
{
    //
    protected $fillable = [
        'mode_name',
        
        'phone_number',
        'ledger_id',
        'created_by',
       
    ];

    public function ledger()
    {
        return $this->belongsTo(AccountLedger::class, 'ledger_id');
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
