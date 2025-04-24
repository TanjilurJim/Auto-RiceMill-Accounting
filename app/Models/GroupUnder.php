<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupUnder extends Model
{
    //
    protected $fillable = ['name'];

    public function ledgers()
    {
        return $this->hasMany(AccountLedger::class, 'group_under_id');
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
