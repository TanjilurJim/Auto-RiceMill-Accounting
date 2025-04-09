<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalarySlip extends Model
{
    use HasFactory;

    protected $fillable = [
        'voucher_number',
        'date',
        'created_by',
    ];

    // Relationship to SalarySlipEmployee model
    public function salarySlipEmployees()
    {
        return $this->hasMany(SalarySlipEmployee::class);
    }

    // Relationship to User model (Created by)
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
