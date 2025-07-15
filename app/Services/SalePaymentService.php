<?php

namespace App\Services;

use App\Models\Sale;
use App\Models\SalePayment;
use App\Models\ReceivedMode;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SalePaymentService
{
    /**
     * Record a cash/cheque/e-wallet payment (and any finance charge)
     */
    public static function record(
        Sale $sale,
        float $cash,
        Carbon $date,
        ?ReceivedMode $mode,
        ?string $note = null
    ): SalePayment {
        return DB::transaction(function () use ($sale, $cash, $date, $mode, $note) {

            // 1️⃣  Calculate interest, if policy says so
            $interest = $sale->shouldChargeInterest()
                ? $sale->calcInterest($date)
                : 0;

            // 2️⃣  Persist the payment row
            $payment = SalePayment::create([
                'sale_id'          => $sale->id,
                'date'             => $date,
                'amount'           => $cash,
                'interest_amount'  => $interest,
                'received_mode_id' => $mode?->id,
                'account_ledger_id'=> $mode?->ledger_id,
                'note'             => $note,
                'created_by'       => auth()->id(),
            ]);

            // 3️⃣  Update running totals on the sale
            $sale->total_due         = $sale->outstanding - $cash - $interest;
            $sale->last_interest_date = $date;
            $sale->save();

            // 4️⃣  Post journal entries
            JournalService::postSalePayment($payment);

            return $payment;
        });
    }
}
