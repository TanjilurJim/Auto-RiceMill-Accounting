<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class AccountLedger extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'employee_id',
        'account_ledger_name',
        'phone_number',
        'email',
        'opening_balance',
        'debit_credit',
        'status',
        'account_group_id',
        'group_under_id',
        'address',
        'for_transition_mode',
        'mark_for_user',
        'created_by',
        'reference_number',
        'ledger_type',
    ];
    protected $casts = [
    'for_transition_mode' => 'boolean',
    'mark_for_user'       => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // Generate the reference number automatically
            $model->reference_number = 'RL' . strtoupper(Str::random(10)); // Example: RLXXXXXXXXXX
        });
    }

    public function accountGroup()
    {
        return $this->belongsTo(AccountGroup::class);
    }
    public function groupUnder()
    {
        return $this->belongsTo(GroupUnder::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
