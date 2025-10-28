<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinancialYear extends Model
{
    protected $fillable = [
        'title', 'start_date', 'end_date', 'is_closed', 'created_by',
    ];

    protected $casts = [
        'is_closed'  => 'boolean',
        'start_date' => 'date',
        'end_date'   => 'date',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}