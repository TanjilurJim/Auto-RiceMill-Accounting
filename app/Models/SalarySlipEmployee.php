<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalarySlipEmployee extends Model
{
    use HasFactory;

    /* ───── Mass-assignable ───── */
    protected $fillable = [
        'salary_slip_id',
        'employee_id',
        'basic_salary',
        'additional_amount',
        'total_amount',
        'paid_amount',        // ← NEW
        'status',             // ← NEW   (Unpaid / Partially Paid / Paid)
    ];

    /* ───── Relationships ───── */
    public function salarySlip()     { return $this->belongsTo(SalarySlip::class); }
    public function employee()       { return $this->belongsTo(Employee::class); }
    public function receives()       { return $this->hasMany(SalaryReceive::class); }

    /* ───── Accessors / Helpers ───── */
    public function getOutstandingAttribute(): float
    {
        return max(0, $this->total_amount - $this->paid_amount);
    }

    /* Optional scope if you want a quick filter */
    public function scopeOutstanding($q)
    {
        return $q->whereColumn('total_amount', '>', 'paid_amount');
    }
}
