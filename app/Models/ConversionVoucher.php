<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConversionVoucher extends Model
{
    //
    protected $fillable = [
        'date','ref_no','party_ledger_id','godown_id','remarks',
        'total_consumed_qty','total_generated_qty','created_by',
    ];

    public function lines()     { return $this->hasMany(ConversionLine::class); }
    public function party()     { return $this->belongsTo(AccountLedger::class,'party_ledger_id'); }
    public function godown()    { return $this->belongsTo(Godown::class); }
}
