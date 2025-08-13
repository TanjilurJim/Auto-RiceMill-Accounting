<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CrushingJob extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'ref_no',
        'date',
        'owner',
        'party_ledger_id',
        'godown_id',
        'dryer_id',
        'status',
        'started_at',
        'stopped_at',
        'dryer_capacity',
        'total_loaded_qty',
        'remarks',
        'created_by',
    ];

    protected $casts = [
        'date' => 'date',
        'started_at' => 'datetime',
        'stopped_at' => 'datetime',
    ];
    public function consumptions(): HasMany
    {
        return $this->hasMany(CrushingJobConsumption::class, 'crushing_job_id');
    }

    

    public function lines()
    {
        return $this->hasMany(CrushingJobConsumption::class);
    }
    public function party()
    {
        return $this->belongsTo(AccountLedger::class, 'party_ledger_id');
    }
    public function godown()
    {
        return $this->belongsTo(Godown::class);
    }
    public function dryer()
    {
        return $this->belongsTo(Dryer::class);
    }

    public function getDurationMinutesAttribute(): ?int
    {
        if (!$this->started_at || !$this->stopped_at) return null;
        return $this->stopped_at->diffInMinutes($this->started_at);
    }

    public function getUtilizationAttribute(): ?float
    {
        if (!$this->dryer_capacity || $this->dryer_capacity <= 0) return null;
        return (float) ($this->total_loaded_qty / $this->dryer_capacity);
    }
}
