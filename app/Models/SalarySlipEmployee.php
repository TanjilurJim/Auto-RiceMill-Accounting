<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalarySlipEmployee extends Model
{
    use HasFactory;

    protected $fillable = [
        'salary_slip_id',
        'employee_id',
        'basic_salary',
        'additional_amount',
        'total_amount',
    ];

    // Relationship to SalarySlip model
    public function salarySlip()
    {
        return $this->belongsTo(SalarySlip::class);
    }

    // Relationship to Employee model
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
