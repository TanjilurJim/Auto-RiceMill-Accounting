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
        Sale          $sale,
        float         $cash,
        Carbon        $date,
        ?ReceivedMode $mode,
        ?string       $note          = null,
        bool          $waiveInterest = false      // 🆕 flag
    ): SalePayment {
        return DB::transaction(function () use ($sale, $cash, $date, $mode, $note, $waiveInterest) {

            /* 1️⃣  Calculate interest only if policy + not waived */
            $interest = 0;
            if (! $waiveInterest && $sale->shouldChargeInterest()) {
                $interest = $sale->calcInterest($date);
            }

            /* 2️⃣  Write the payment row */
            $payment = SalePayment::create([
                'sale_id'          => $sale->id,
                'date'             => $date,
                'amount'           => $cash,
                'interest_amount'  => $interest,
                'received_mode_id' => $mode?->id,
                'account_ledger_id' => $mode?->ledger_id
                    ?? optional($mode->ledger)->id,
                'note'             => $note,
                'created_by'       => auth()->id(),
            ]);

            /* 3️⃣  Refresh and update running totals */
            $sale->refresh();
            $sale->total_due = $sale->outstanding;

            if ($interest > 0) {                     // ✅ move inside condition
                $sale->last_interest_date = $date;
            }

            $sale->save();

            /* 4️⃣  Post journal entries */
            JournalService::postSalePayment($payment);

            return $payment;
        });
    }
}
