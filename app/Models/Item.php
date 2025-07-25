<?php

namespace App\Models;
use App\Traits\BelongsToTenant;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Item extends Model
{
    //
    use SoftDeletes, BelongsToTenant;

    protected $fillable = [
        'item_name',

        'item_code',
        'category_id',
        'unit_id',
        'godown_id',
        'purchase_price',
        'sale_price',
        'previous_stock',
        'total_previous_stock_value',
        'description',
        'created_by'

    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
    public function godown()
    {
        return $this->belongsTo(Godown::class);
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function stocks()
    {
        return $this->hasMany(\App\Models\Stock::class, 'item_id');
    }
}
