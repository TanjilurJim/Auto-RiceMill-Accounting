<?php

namespace App\Console\Commands;

use Illuminate\Support\Facades\Log;
use App\Models\Sale;
use App\Models\SalePayment;
use Carbon\Carbon;
use Illuminate\Console\Command;

class AccrueSaleInterest extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sales:accrue-interest';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Accrue daily finance charges on unpaid sales';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $today = Carbon::today();


        Sale::where('total_due', '>', 0)
            ->where('interest_applicable', 1)
            ->chunkById(100, function ($sales) use ($today) {
                foreach ($sales as $sale) {
                    $interest = $sale->calcInterest($today);

                    Log::info("AccrueInterest DEBUG sale {$sale->id}", [
                        'apply_interest'          => setting('apply_interest'),
                        'interest_type'           => setting('interest_type'),
                        'interest_flat_per_day'   => setting('interest_flat_per_day'),
                        'interest_rate_per_month' => setting('interest_rate_per_month'),
                        'interest_rate_per_year'  => setting('interest_rate_per_year'),
                        'interest_grace_days'     => setting('interest_grace_days'),
                    ]);
                    /* 🐞 DEBUG --------------------------------------------------- */
                    // if ($interest > 0) {
                    //     Log::info("AccrueInterest: posting {$interest} to sale {$sale->id}");
                    // } else {
                    //     Log::info("AccrueInterest: ZERO for sale {$sale->id}  —  "
                    //         . "total_due={$sale->total_due}, "
                    //         . "applicable={$sale->interest_applicable}, "
                    //         . "basis={$sale->interest_basis}");
                    // }
                    /* ----------------------------------------------------------- */

                    if ($interest > 0) {
                        SalePayment::create([
                            'sale_id'         => $sale->id,
                            'date'            => $today,
                            'amount'          => 0,
                            'interest_amount' => $interest,
                            'note'            => 'Daily finance charge',
                            'created_by'      => $sale->created_by,   // system user or null
                        ]);

                        $sale->last_interest_date = $today;
                        $sale->save();
                    }
                }
            });

        return self::SUCCESS;
    }
}
