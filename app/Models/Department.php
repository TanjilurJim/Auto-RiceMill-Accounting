<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;
class Department extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = ['name', 'description', 'created_by'];

    // Relationship to User (creator)
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
