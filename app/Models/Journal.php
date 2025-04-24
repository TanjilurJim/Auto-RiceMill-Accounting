<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Journal extends Model
{
    //

    protected $fillable = ['date', 'voucher_no', 'narration', 'created_by','voucher_type'];

    public function entries()
    {
        return $this->hasMany(JournalEntry::class, 'journal_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
