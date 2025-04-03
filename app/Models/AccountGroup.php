<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AccountGroup extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'nature_id', 'group_under_id', 'description', 'created_by'];

    // Relationship to Nature model
    public function nature()
    {
        return $this->belongsTo(Nature::class);
    }

    // Relationship to GroupUnder model
    public function groupUnder()
    {
        return $this->belongsTo(GroupUnder::class, 'group_under_id');
    }

    // Relationship to User
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
