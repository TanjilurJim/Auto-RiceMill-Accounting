<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\SalaryReceive;
use App\Models\SalarySlipEmployee;


class Employee extends Model
{
    use HasFactory, BelongsToTenant;

    /* ───── Mass-assignable ───── */
    protected $fillable = [
        'name',
        'mobile',
        'email',
        'nid',
        'present_address',
        'permanent_address',
        'salary',
        'joining_date',
        'reference_by',
        'department_id',
        'designation_id',
        'shift_id',
        'status',
        'advance_amount',
        'created_by',
    ];

    /* ───── Relationships ───── */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }
    public function designation()
    {
        return $this->belongsTo(Designation::class);
    }
    public function shift()
    {
        return $this->belongsTo(Shift::class);
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function referenceBy()
    {
        return $this->belongsTo(Employee::class, 'reference_by');
    }
    public function ledger()
    {
        return $this->hasOne(AccountLedger::class);
    }

    /* NEW: link to all slip-rows for this employee */
    public function salarySlipEmployees()
    {
        return $this->hasMany(SalarySlipEmployee::class);
    }

    /* ───── Convenience accessors ───── */
    public function getGrossSalaryAttribute(): float
    {
        // all slips ever issued
        return $this->salarySlipEmployees->sum('total_amount');
    }

    public function getSalaryPaidAttribute(): float
    {
        return $this->salarySlipEmployees->sum('paid_amount');
    }

    public function getSalaryOutstandingAttribute(): float
    {
        return max(0, $this->gross_salary - $this->salary_paid);
    }
    public function getAdvanceBalanceAttribute(): float  
    {
        $advPaid = \App\Models\SalaryReceive::where('employee_id', $this->id)->where('is_advance', true)->sum('amount');
        $advAdj = $this->salarySlipEmployees()->sum('advance_adjusted');
        return max(0, $advPaid - $advAdj);

    }
}
