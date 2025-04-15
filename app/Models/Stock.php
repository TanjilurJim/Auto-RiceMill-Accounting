<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    protected $fillable = ['item_id', 'godown_id', 'qty','created_by'];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function godown()
    {
        return $this->belongsTo(Godown::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
