<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;
use App\Models\SalePayment;
use App\Traits\BelongsToTenant;
use App\Models\CompanySetting;

class Sale extends Model
{
    use SoftDeletes,  BelongsToTenant;

    public const STATUS_DRAFT        = 'draft';
    public const STATUS_PENDING_SUB  = 'pending_sub';
    public const STATUS_PENDING_RESP = 'pending_resp';
    public const STATUS_APPROVED     = 'approved';
    public const STATUS_REJECTED     = 'rejected';

    protected $fillable = [
        'date',
        'voucher_no',
        'godown_id',
        'salesman_id',
        'account_ledger_id',
        'phone',
        'address',
        'total_qty',
        'total_discount',
        'grand_total',
        'other_expense_ledger_id',
        'other_amount',
        'shipping_details',
        'delivered_to',
        'truck_rent',
        'rent_advance',
        'net_rent',
        'truck_driver_name',
        'driver_address',
        'driver_mobile',
        'receive_mode',
        'receive_amount',
        'total_due',
        'closing_balance',
        'created_by',
        'inventory_ledger_id',
        'received_mode_id',     //
        'amount_received',
        'cogs_ledger_id', //
        'journal_id',
        'interest_applicable',
        'interest_basis',
        'last_interest_date',
        'status',
        'sub_responsible_id',
        'responsible_id',
        'approved_at',
    ];
    protected $casts = [
        'date'               => 'date',     // 
        'last_interest_date' => 'date',
        'interest_applicable' => 'boolean',
    ];

    public function approvals()
    {
        return $this->hasMany(SaleApproval::class);
    }


    public function getPrincipalDueAttribute(): float
    {
        return max(0, $this->grand_total -
            $this->payments()->sum('amount'));
    }

    /* ---------- Daily interest on that principal ---------- */
    public function getDailyInterestAttribute(): float
    {
        if (! $this->shouldChargeInterest()) {
            return 0;
        }

        /* Flat rate per day? --------------------------------*/
        if ($this->cfg('interest_type', 'percentage') === 'flat') {
            return (float) $this->cfg('interest_flat_per_day', 0);
        }

        /* Percentage rate -----------------------------------*/
        $principal = $this->principal_due;
        $monthly   = $this->cfg('interest_rate_per_month');
        $yearly    = $this->cfg('interest_rate_per_year', 0);

        $dailyRate = !is_null($monthly)
            ? ($monthly / 100) / 30
            : ($yearly  / 100) / 365;

        return round($principal * $dailyRate, 2);
    }


    public function company()
    {
        return $this->belongsTo(CompanySetting::class, 'created_by', 'created_by');
    }

    private function cfg(string $key, $default = null)
    {
        return $this->company?->{$key} ?? $default;
    }

    protected static function booted()
    {
        static::creating(function (Sale $sale) {
            if (is_null($sale->interest_applicable)) {
                $sale->interest_applicable = $sale->cfg('apply_interest', true);
            }
            if (is_null($sale->interest_basis)) {
                $sale->interest_basis = $sale->cfg('interest_basis', 'due');
            }
        });
    }

    // ✅ Relationships
    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
    }

    public function godown()
    {
        return $this->belongsTo(Godown::class);
    }

    public function salesman()
    {
        return $this->belongsTo(Salesman::class);
    }

    public function accountLedger()
    {
        return $this->belongsTo(AccountLedger::class);
    }

    public function otherExpenseLedger()
    {
        return $this->belongsTo(AccountLedger::class, 'other_expense_ledger_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function receivedMode()
    {
        return $this->belongsTo(ReceivedMode::class);
    }
    public function journal()
    {
        return $this->belongsTo(Journal::class);
    }
    public function payments()
    {
        return $this->hasMany(SalePayment::class);
    }



    /* -------------------------------------------------
 |  Computed attributes
 * -------------------------------------------------*/
    public function getOutstandingAttribute(): float
    {
        return $this->grand_total
            + $this->payments()->sum('interest_amount')
            - $this->payments()->sum('amount');
    }

    /* -------------------------------------------------
 |  Interest helpers
 * -------------------------------------------------*/
    /**
     * Should we accrue finance charge on this sale?
     */
    public function shouldChargeInterest(): bool
    {
        return ($this->interest_applicable ?? false)
            && $this->cfg('apply_interest', true);
    }

    public function getAccruedInterestAttribute(): float
    {
        return (float) $this->payments()->sum('interest_amount');
    }

    public function getBalanceWithInterestAttribute(): float
    {
        return $this->grand_total - $this->payments()->sum('amount') + $this->accrued_interest;
    }



    /**
     * Calculate interest from last_interest_date (or invoice date) up to $to.
     */
    public function calcInterest(Carbon $to): float
    {
        $basis = $this->interest_basis ?? $this->cfg('interest_basis', 'due');
        $principal = $basis === 'total' ? $this->grand_total : $this->outstanding;

        $since = $this->last_interest_date ?? $this->date;

        // Use calendar days for flat interest, fractional for percentage
        if ($this->cfg('interest_type', 'percentage') === 'flat') {
            // For flat interest, use only date parts (ignore time)
            $since = $since->copy()->startOfDay();
            $to = $to->copy()->startOfDay();
            $days = max(0, $since->diffInDays($to));
        } else {
            // For percentage interest, use precise fractional days
            $days = max(0, $since->floatDiffInDays($to));
        }

        $days -= $this->cfg('interest_grace_days', 0);
        $days = max(0, $days);

        // Flat rate calculation
        if ($this->cfg('interest_type', 'percentage') === 'flat') {
            return round($days * $this->cfg('interest_flat_per_day', 0), 2);
        }

        // Percentage calculation remains unchanged
        $monthly = $this->cfg('interest_rate_per_month');
        $yearly = $this->cfg('interest_rate_per_year', 0);

        $dailyRate = !is_null($monthly)
            ? ($monthly / 100) / 30
            : ($yearly / 100) / 365;

        return round($principal * $dailyRate * $days, 2);
    }
}
