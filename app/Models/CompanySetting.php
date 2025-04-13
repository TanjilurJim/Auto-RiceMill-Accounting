<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanySetting extends Model
{
    protected $fillable = [
        'created_by',
        'company_name',
        'mailing_name',
        'country',
        'email',
        'website',
        'financial_year',
        'financial_year_id',
        'mobile',
        'address',
        'description',
        'logo_path',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function financialYear()
    {
        return $this->belongsTo(FinancialYear::class, 'financial_year_id');
    }
}
