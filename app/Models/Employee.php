<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

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

    // Relationship to Department model
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    // Relationship to Designation model
    public function designation()
    {
        return $this->belongsTo(Designation::class);
    }

    // Relationship to Shift model
    public function shift()
    {
        return $this->belongsTo(Shift::class);
    }

    // Relationship to User model (Created by)
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Relationship to Reference Employee model (if any)
    public function referenceBy()
    {
        return $this->belongsTo(Employee::class, 'reference_by');
    }
    
    public function ledger()
    {
        return $this->hasOne(AccountLedger::class); // if using employee_id
    }
}
