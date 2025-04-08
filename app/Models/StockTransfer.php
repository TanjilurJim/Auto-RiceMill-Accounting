<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;



class StockTransfer extends Model
{
    protected $fillable = [
        'date', 
        'voucher_no', 
        'reference_no', 
        'from_godown_id', 
        'to_godown_id', 
        'total_quantity', 
        'total_amount', 
        'note',
        'created_by',
    ];

    // Relationships
    public function fromGodown()
    {
        return $this->belongsTo(Godown::class, 'from_godown_id');
    }

    public function toGodown()
    {
        return $this->belongsTo(Godown::class, 'to_godown_id');
    }

    public function items()
    {
        return $this->hasMany(StockTransferItem::class);
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}

