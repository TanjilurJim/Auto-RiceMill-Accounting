<?php 
namespace App\Services;

use App\Models\Sale;
use App\Models\Purchase;
use App\Events\ApprovalCountersUpdated;

class ApprovalCounter
{
    public static function forUser(int $userId): array
    {
        return [
            // sales
            'sales_sub'  => Sale::pendingSub($userId)->count(),
            'sales_resp' => Sale::pendingResp($userId)->count(),

            // purchases
            'purch_sub'  => Purchase::pendingSub($userId)->count(),
            'purch_resp' => Purchase::pendingResp($userId)->count(),
        ];
    }

    public static function broadcast(int $userId): void
    {
        event(new ApprovalCountersUpdated(
            $userId,
            self::forUser($userId)
        ));
    }
}