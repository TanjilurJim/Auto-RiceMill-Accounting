<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SmtpSetting extends Model
{
    //
    protected $fillable = [
        'host','port','encryption','username','password',
        'from_name','from_address','timeout','active',
        'created_by','updated_by',
    ];

    protected $casts = [
        // Laravel’s built-in encrypted cast keeps values encrypted at rest
        'password' => 'encrypted',
        'active'   => 'boolean',
        'port'     => 'integer',
        'timeout'  => 'integer',
    ];

}
