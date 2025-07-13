<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RentVoucherLine extends Model
{

    

    //
    protected $fillable = ['voucher_id', 'party_item_id', 'qty', 'unit_name', 'mon', 'rate', 'amount'];
    public function voucher()
    {
        return $this->belongsTo(RentVoucher::class, 'voucher_id');
    }
    public function item()
    {
        return $this->belongsTo(PartyItem::class, 'party_item_id');
    }
}
