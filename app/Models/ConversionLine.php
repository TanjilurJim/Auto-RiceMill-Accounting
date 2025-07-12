<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConversionLine extends Model
{
    //
    protected $fillable = [
        'voucher_id','party_item_id','line_type','qty','unit_name',
    ];

    public function voucher()   { return $this->belongsTo(ConversionVoucher::class); }
    public function item()      { return $this->belongsTo(PartyItem::class,'party_item_id'); }

}
