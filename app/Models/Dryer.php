<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;
use function get_top_parent_id;

class Dryer extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'dryer_name', 'slug', 'dryer_type', 'capacity', 'batch_time',
        'manufacturer', 'model_number', 'power_kw', 'fuel_type',
        'length_mm', 'width_mm', 'height_mm', 'created_by', 'updated_by',
    ];

    /* ------------------------------------------------------------------ */
    /*  Local scope: confine queries to MY company                         */
    /* ------------------------------------------------------------------ */
    public function scopeForMyCompany($q)
    {
        $headId = get_top_parent_id(auth()->user());
        return $q->where('created_by', $headId);
    }

    /* Relationships -----------------------------------------------------*/
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function company()
    {
        $headId = get_top_parent_id($this->creator);
        return $this->hasOne(CompanySetting::class, 'created_by')
                    ->where('created_by', $headId);
    }
}