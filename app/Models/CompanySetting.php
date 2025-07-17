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
        'apply_interest',
        'interest_flat_per_day',
        'interest_rate_per_year',
        'interest_rate_per_month',
        'interest_basis',
        'logo_path',
        'interest_type', 
        'logo_thumb_path', 
    ];

     /* ──────────── Accessors ──────────── */
     protected $appends = ['logo_url', 'logo_thumb_url'];

     protected $casts = [
        'apply_interest'  => 'boolean',
    ];

     public function getLogoUrlAttribute(): ?string
     {
         return $this->logo_path
             ? asset('storage/' . $this->logo_path)
             : null;
     }
 
     public function getLogoThumbUrlAttribute(): ?string
     {
         // fall back to full logo if thumb missing
         return $this->logo_thumb_path
             ? asset('storage/' . $this->logo_thumb_path)
             : $this->logo_url;
     }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function financialYear()
    {
        return $this->belongsTo(FinancialYear::class, 'financial_year_id');
    }
}
