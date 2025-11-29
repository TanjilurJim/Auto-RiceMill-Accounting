<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;
class Expense extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'date', 'voucher_no',
        'expense_ledger_id',   // the expense head (operating_expense ledger)
        'amount', 'note',

        // payment style
        'payment_ledger_id',   // cash/bank ledger (optional)
        'supplier_ledger_id',  // A/P ledger (optional; use when not paying now)

        'journal_id',
        'created_by',
    ];

    public function expenseLedger()  { return $this->belongsTo(AccountLedger::class, 'expense_ledger_id'); }
    public function paymentLedger()  { return $this->belongsTo(AccountLedger::class, 'payment_ledger_id'); }
    public function supplierLedger() { return $this->belongsTo(AccountLedger::class, 'supplier_ledger_id'); }
    public function journal()        { return $this->belongsTo(Journal::class); }
}
