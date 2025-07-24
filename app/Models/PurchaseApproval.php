<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\{
    Purchase,
    User
};
use App\Traits\BelongsToTenant;   // same trait you use elsewhere

class PurchaseApproval extends Model
{
    use BelongsToTenant;          // fills created_by automatically (if you use the trait)

    /* allow mass-assignment */
    protected $fillable = [
        'purchase_id',
        'user_id',
        'created_by',
        'action',   // 'approved' | 'rejected' | null (pending)
        'note',
    ];

    /* ─── Relationships ─── */
    public function purchase(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Purchase::class);
    }

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
