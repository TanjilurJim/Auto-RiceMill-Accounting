<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReceivedAdd extends Model
{
    protected $fillable = [
        'date',
        'voucher_no',
        'received_mode_id',
        'account_ledger_id',   // payer/customer
        'amount',
        'description',         // legacy field you already use
        'reference',           // ✅ add if column exists (used by settlements)
        'remarks',             // ✅ add if column exists (used by settlements/print)
        'send_sms',
        'created_by',
            // ✅ if you store tenant on this model
    ];

    public function receivedMode()
    {
        return $this->belongsTo(ReceivedMode::class);
    }

    public function rentVouchers()
    {
        return $this->belongsToMany(RentVoucher::class, 'rent_voucher_receipts')
            ->withPivot('amount')->withTimestamps();
    }

    public function accountLedger()
    {
        return $this->belongsTo(AccountLedger::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Post this receipt into ledgers + journal.
     * - DR: ReceivedMode's ledger (cash/bank)
     * - CR: Payer AccountLedger (customer)
     */
    public function postToLedgersAndJournal(): void
    {
        // Reload relations we need
        $this->loadMissing('receivedMode.ledger', 'accountLedger');

        $payer    = $this->accountLedger;               // A/R customer
        $receiver = optional($this->receivedMode)->ledger; // Cash/Bank ledger

        if (! $payer || ! $receiver) {
            throw new \RuntimeException('Posting failed: missing payer or receiver ledger relation.');
        }

        // Update closing balances (same convention you used before)
        $payer->closing_balance = ($payer->closing_balance ?? $payer->opening_balance ?? 0) - $this->amount;
        $payer->save();

        $receiver->closing_balance = ($receiver->closing_balance ?? $receiver->opening_balance ?? 0) + $this->amount;
        $receiver->save();

        // Journal + entries
        $journal = \App\Models\Journal::create([
            'date'         => $this->date,
            'voucher_no'   => $this->voucher_no,
            'narration'    => $this->description
                                 ?? ('Received from ' . $payer->account_ledger_name),
            'voucher_type' => 'Received',
            'created_by'   => $this->created_by,
        ]);

        \App\Models\JournalEntry::insert([
            [
                'journal_id'        => $journal->id,
                'account_ledger_id' => $receiver->id,
                'type'              => 'debit',
                'amount'            => $this->amount,
                'note'              => 'Received via ' . optional($this->receivedMode)->mode_name,
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'journal_id'        => $journal->id,
                'account_ledger_id' => $payer->id,
                'type'              => 'credit',
                'amount'            => $this->amount,
                'note'              => 'Received from ' . $payer->account_ledger_name,
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
        ]);
    }
}
