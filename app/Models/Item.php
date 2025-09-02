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
        'khamal_id',
        'godown_id',
        'purchase_price',
        'sale_price',
        'weight',
        'total_weight',
        'previous_stock',
        'total_previous_stock_value',
        'description',
        'created_by'

    ];

    protected static function booted()
    {
        static::creating(function (Item $item) {
            if (empty($item->item_code)) {
                $item->item_code = self::nextItemCode();
            }
        });
    }

    public static function nextItemCode(): string
    {
        // Simple incrementing code like your controller
        do {
            $nextId   = (int) (self::max('id') ?? 0) + 1;
            $code     = 'ITM' . str_pad((string)$nextId, 4, '0', STR_PAD_LEFT);
            $exists   = self::where('item_code', $code)->exists();
            if (!$exists) return $code;
        } while (true);
    }
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

    
    public function khamal()
    {
        return $this->belongsTo(Khamal::class);
    }
}
