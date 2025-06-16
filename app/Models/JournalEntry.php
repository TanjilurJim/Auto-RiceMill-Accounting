<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JournalEntry extends Model
{
    protected $fillable = ['journal_id', 'account_ledger_id', 'type', 'amount', 'note'];

    public function ledger()
    {
        // return $this->belongsTo(AccountLedger::class, 'account_ledger_id');
        return $this->belongsTo(AccountLedger::class, 'ledger_id');
    }

    public function journal()
    {
        return $this->belongsTo(Journal::class);
    }
}
