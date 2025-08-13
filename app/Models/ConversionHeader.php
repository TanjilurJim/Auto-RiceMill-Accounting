<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConversionHeader extends Model
{
    //
    protected $fillable = [
        'ref_no',
        'owner',
        'date',
        'godown_id',
        'party_ledger_id',
        'remarks',
        'costing_json',
        'created_by',

    ];
    protected $casts = [
        'date' => 'date',
        'costing_json' => 'json',
    ];
}
