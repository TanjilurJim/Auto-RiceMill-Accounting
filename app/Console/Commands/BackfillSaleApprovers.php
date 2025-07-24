<?php

//  app/Console/Commands/BackfillSaleApprovers.php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Sale;
use App\Http\Controllers\SaleController;

class BackfillSaleApprovers extends Command
{
    protected $signature   = 'sales:backfill-approvers';
    protected $description = 'Populate sub_responsible_id / responsible_id on older pending sales';

    public function handle(): int
    {
        $h = app(SaleController::class);

        $sub  = $h->defaultSub();
        $resp = $h->defaultResp();

        if (!$sub && !$resp) {
            $this->error('No approver users found – aborting.');
            return self::FAILURE;
        }

        $subCnt = Sale::whereNull('sub_responsible_id')
            ->where('status', Sale::STATUS_PENDING_SUB)
            ->update(['sub_responsible_id' => $sub]);

        $respCnt = Sale::whereNull('responsible_id')
            ->where('status', Sale::STATUS_PENDING_RESP)
            ->update(['responsible_id' => $resp]);

        $this->info("Updated $subCnt pending-sub invoices       → sub_responsible_id = $sub");
        $this->info("Updated $respCnt pending-resp invoices     → responsible_id   = $resp");
        return self::SUCCESS;
    }
}
