<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;
class Godown extends Model
{
    //
    use BelongsToTenant;

    protected $fillable = [
        'name',
        'godown_code',
        'address',
        'created_by',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
