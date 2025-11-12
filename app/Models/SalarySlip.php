<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;
use App\Traits\EnsuresWithinFinancialYear;

class SalarySlip extends Model
{
    use HasFactory, BelongsToTenant, EnsuresWithinFinancialYear;

    protected $fillable = [
        'voucher_number',
        'date',
        'month',         // ✅ add this
        'year',          // ✅ and this
        'created_by',
        'is_advance',
        'financial_year_id',
    ];

    // ensure date is cast to Carbon so the trait can use the instance
    protected $casts = [
        'is_advance' => 'bool',
        'date' => 'date:d-m-Y', // <<< important
    ];

    // tell the trait to validate by the salary PERIOD (month + year)
    protected $financialYearValidateBy = 'period';
    protected $financialYearPeriodMonthColumn = 'month';
    protected $financialYearPeriodYearColumn = 'year';

    // Relationship to SalarySlipEmployee model
    public function salarySlipEmployees()
    {
        return $this->hasMany(SalarySlipEmployee::class);
    }

    public function getTotalOutstandingAttribute(): float
    {
        // summed on the PHP side; if you need DB-level speed make it a query scope
        return $this->salarySlipEmployees->sum(fn($e) => $e->outstanding);
    }

    /* one-liner to fetch all still-owed rows on this slip */
    public function outstandingEmployees()
    {
        return $this->salarySlipEmployees()->outstanding();
    }

    // Relationship to User model (Created by)
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getAdvanceEffectiveAttribute(): bool
    {
        $monthStart = \Carbon\Carbon::create($this->year, $this->month, 1);
        return $this->is_advance || \Carbon\Carbon::parse($this->date)->lt($monthStart);
    }
}
