<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContraAdd extends Model
{
    protected $fillable = [
        'date',
        'voucher_no',
        'mode_from_id',
        'mode_to_id',
        'amount',
        'description',
        'send_sms',
        'created_by',
    ];

    public function modeFrom()
    {
        return $this->belongsTo(\App\Models\ReceivedMode::class, 'mode_from_id');
    }

    public function modeTo()
    {
        return $this->belongsTo(\App\Models\ReceivedMode::class, 'mode_to_id');
    }

    public function creator()
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }
}