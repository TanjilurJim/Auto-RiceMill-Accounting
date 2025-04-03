<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReceivedMode extends Model
{
    //
    protected $fillable = [
        'mode_name',
        'opening_balance',
        'closing_balance',
        'phone_number',
    ];
}
