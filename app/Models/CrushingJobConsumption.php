<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToTenant;

class CrushingJobConsumption extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'crushing_job_id','source','item_id','lot_id','party_item_id','qty','weight','unit_name','created_by',
    ];

    public function job()       { return $this->belongsTo(CrushingJob::class, 'crushing_job_id'); }
    public function item()      { return $this->belongsTo(Item::class); }
    public function lot()       { return $this->belongsTo(Lot::class); }
    public function partyItem() { return $this->belongsTo(PartyItem::class); }
}
