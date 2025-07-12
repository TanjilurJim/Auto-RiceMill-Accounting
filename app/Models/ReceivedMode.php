<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;

class ReceivedMode extends Model
{
    use BelongsToTenant;
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
    public function purchaseReturn()
{
    return $this->belongsTo(PurchaseReturn::class);
}
}
