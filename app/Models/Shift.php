<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;

class Shift extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'start_time', 'end_time', 'description', 'created_by'];

    // Relationship to User (creator)
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
