<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;
class SalarySlip extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'voucher_number',
        'date',
        'month',         // ✅ add this
        'year',          // ✅ and this
        'created_by',
        'is_advance'
    ];

    protected $casts = ['is_advance' => 'bool',];

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
