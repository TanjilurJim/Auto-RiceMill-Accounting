<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;

class FinancialYear extends Model
{
    use BelongsToTenant;
    protected $fillable = [
        'title',
        'start_date',
        'end_date',
        'is_closed',
        'created_by',
    ];

    protected $casts = [
        'is_closed'  => 'boolean',
        'start_date' => 'date:d-m-Y',
        'end_date'   => 'date:d-m-Y',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
