<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;


class Khamal extends Model
{
    use BelongsToTenant;

    protected $fillable = ['godown_id','khamal_no','capacity_ton','created_by'];

    public function godown()  { return $this->belongsTo(Godown::class); }
    public function items()   { return $this->hasMany(Item::class); }
}