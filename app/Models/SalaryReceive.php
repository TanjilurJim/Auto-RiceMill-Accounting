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
}
