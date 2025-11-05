<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\User;
use Inertia\Inertia;
// use Illuminate\Foundation\Auth\User;
use App\Models\Purchase;
use Illuminate\Support\Facades\DB;
use App\Models\AccountLedger;
use App\Models\AccountGroup;
use App\Models\SalePayment;
use App\Models\PaymentAdd;
use App\Models\SalesOrder;
use App\Models\ReceivedAdd;
use App\Models\SalesReturn;
use App\Models\CrushingJob;
use App\Models\WorkingOrder;
use Illuminate\Http\Request;
use App\Models\PurchaseReturn;
use Illuminate\Support\Facades\Auth;

use function user_scope_ids; // <-- Add this line


class DashboardController extends Controller
{


    public function index()
    {
        $userIds = user_scope_ids();

        // If admin, don't filter by userIds
        $isAdmin = empty($userIds);

        $totalSales = Sale::when(!$isAdmin, function ($q) use ($userIds) {
            $q->whereIn('created_by', $userIds);
        })->sum('grand_total');
        $totalPurchases = Purchase::when(!$isAdmin, function ($q) use ($userIds) {
            $q->whereIn('created_by', $userIds);
        })->sum('grand_total');
        $totalPurchaseReturns = PurchaseReturn::when(!$isAdmin, function ($q) use ($userIds) {
            $q->whereIn('created_by', $userIds);
        })->sum('grand_total');
        $totalSalesReturns = SalesReturn::when(!$isAdmin, function ($q) use ($userIds) {
            $q->whereIn('created_by', $userIds);
        })->sum('total_return_amount');
        $totalSalesOrders = SalesOrder::when(!$isAdmin, function ($q) use ($userIds) {
            $q->whereIn('created_by', $userIds);
        })->sum('total_amount');
        $totalReceived = ReceivedAdd::when(!$isAdmin, function ($q) use ($userIds) {
            $q->whereIn('created_by', $userIds);
        })->sum('amount');
        $totalPayment = PaymentAdd::when(!$isAdmin, function ($q) use ($userIds) {
            $q->whereIn('created_by', $userIds);
        })->sum('amount');
        $totalWorkOrders = WorkingOrder::when(!$isAdmin, function ($q) use ($userIds) {
            $q->whereIn('created_by', $userIds);
        })->count();
        $completedWorkOrders = WorkingOrder::when(!$isAdmin, function ($q) use ($userIds) {
            $q->whereIn('created_by', $userIds);
        })->where('production_status', 'completed')->count();


        // ── Running dryers for live countdown panel ─────────────────────────
        $runningDryers = CrushingJob::with(['dryer:id,dryer_name,batch_time'])
            ->when(!$isAdmin, fn($q) => $q->whereIn('created_by', $userIds))
            ->where('status', 'running')
            ->orderByDesc('started_at')
            ->limit(10)
            ->get()
            ->map(function (CrushingJob $j) {
                $batchMinutes = (int) ($j->dryer?->batch_time ?? 0);
                $endsAt = $j->started_at ? $j->started_at->copy()->addMinutes($batchMinutes) : null;

                return [
                    'id'           => $j->id,
                    'dryer'        => $j->dryer?->dryer_name ?? '—',
                    'batchMinutes' => $batchMinutes,              // from dryers.batch_time (minutes)
                    'startedAt'    => optional($j->started_at)->toIso8601String(),
                    'endsAt'       => optional($endsAt)->toIso8601String(),
                    'capacityKg'   => (float) ($j->dryer_capacity ?? 0),
                    'loadedKg'     => (float) ($j->total_loaded_qty ?? 0),
                    'refNo'        => $j->ref_no,
                ];
            });


        $dueExpr = '(sales.grand_total + (
                   select coalesce(sum(interest_amount),0)
                   from sale_payments
                   where sale_id = sales.id
               ) - (
                   select coalesce(sum(amount),0)
                   from sale_payments
                   where sale_id = sales.id
               ))';

        $totalClearedDues = DB::table('sales')
            ->when(!$isAdmin, fn($q) => $q->whereIn('created_by', $userIds))
            ->whereRaw("$dueExpr <= 0")      // fully settled
            ->count();

        $totalDues = DB::table('sales')
            ->when(!$isAdmin, fn($q) => $q->whereIn('created_by', $userIds))
            ->selectRaw("sum($dueExpr) as total_outstanding")
            ->whereRaw("$dueExpr > 0")        // only positive balances
            ->value('total_outstanding') ?? 0;

        /* ──────────────── NEW: Due-adjustment write-offs ─────────────────────
       Sum any sale-payment rows you flagged with waive_interest = true.    */
        $totalDueAdjustments = SalePayment::where('waive_interest', true)
            ->whereHas('sale', fn($q) => $q->when(
                !$isAdmin,
                fn($qq) => $qq->whereIn('created_by', $userIds)
            ))
            ->sum('interest_amount');
        // use the colu

        $supplierLedgers = AccountLedger::select(
            'id',
            'account_ledger_name',
            'opening_balance',
            'closing_balance'
        )
            ->where('ledger_type', 'accounts_payable')
            ->when(!$isAdmin, fn($q) => $q->whereIn('created_by', $userIds))
            ->get();

        // Compute payable: if balance < 0, we owe them
        $mapped = $supplierLedgers->map(function ($l) {
            $closing = $l->closing_balance ?? ($l->opening_balance ?? 0);
            // if you store supplier balances as negative = payable, flip it:
            $payable = $closing < 0 ? abs($closing) : 0;
            return [
                'id'      => $l->id,
                'name'    => $l->account_ledger_name,
                'payable' => round($payable, 2),
            ];
        });

        $topPayables = $mapped->filter(fn($x) => $x['payable'] > 0)
            ->sortByDesc('payable')
            ->take(5)
            ->values();

        $totalPurchaseDue = $mapped->sum('payable');


        return Inertia::render('dashboard', [
            'totalSales' => $totalSales,
            'totalPurchases' => $totalPurchases,
            'totalPurchaseReturns' => $totalPurchaseReturns,
            'totalSalesReturns' => $totalSalesReturns,
            'totalSalesOrders' => $totalSalesOrders,
            'totalReceived' => $totalReceived,
            'totalPayment' => $totalPayment,
            'totalWorkOrders' => $totalWorkOrders,
            'completedWorkOrders' => $completedWorkOrders,

            'totalDues'             => $totalDues,
            'clearedDuesCount'   => $totalClearedDues,
            'purchasePayableTotal' => $totalPurchaseDue,
            'topPurchaseSuppliers' => $topPayables,

            'runningDryers'         => $runningDryers,
            'tenantId'      => auth()->user()->tenant_id, 
        ]);
    }
}
