<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalaryReceive extends Model
{
    use HasFactory;

    protected $fillable = [
        'vch_no',
        'date',
        'employee_id',
        'received_by',
        'amount',
        'description',
        'created_by',
        'salary_slip_employee_id',
    ];

    // Relationship to Employee model
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    // Relationship to ReceivedMode model
    public function receivedMode()
    {
        return $this->belongsTo(ReceivedMode::class, 'received_by');
    }
    public function journal()
    {
        return $this->belongsTo(Journal::class);
    }
    public function salarySlipEmployee()
    {
        return $this->belongsTo(SalarySlipEmployee::class);
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function slipEmployee()   // alias reads nicer in code
    {
        return $this->belongsTo(SalarySlipEmployee::class, 'salary_slip_employee_id');
    }
}
