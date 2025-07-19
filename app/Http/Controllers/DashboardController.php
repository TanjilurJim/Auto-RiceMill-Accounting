<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\User;
use Inertia\Inertia;
// use Illuminate\Foundation\Auth\User;
use App\Models\Purchase;
use Illuminate\Support\Facades\DB;

use App\Models\SalePayment;
use App\Models\PaymentAdd;
use App\Models\SalesOrder;
use App\Models\ReceivedAdd;
use App\Models\SalesReturn;
use App\Models\WorkingOrder;
use Illuminate\Http\Request;
use App\Models\PurchaseReturn;
use Illuminate\Support\Facades\Auth;

use function user_scope_ids; // <-- Add this line


class DashboardController extends Controller
{
    // public function index()
    // {

    //     // $userIds = user_scope_ids(); // <-- Use multi-level user ids


    //     $user = Auth::user();

    //     if ($user->hasRole('admin')) {
    //     // Admin: see all users' data
    //     $userIds = User::pluck('id')->toArray();
    //     } else {
    //         $myId = $user->id;
    //         $myUsers = User::where('created_by', $myId)->pluck('id')->toArray();

    //         // Only include your creator if they are NOT admin
    //         $parentId = $user->created_by;
    //         $parentUsers = [];
    //         if ($parentId) {
    //             $parent = User::find($parentId);
    //             if ($parent && !$parent->hasRole('admin')) {
    //                 $parentUsers[] = $parentId;
    //             }
    //         }

    //         $userIds = array_unique(array_merge([$myId], $myUsers, $parentUsers));
    //     }

    //     // $myId = $user->id;

    //     // // Users you created
    //     // $myUsers = User::where('created_by', $myId)->pluck('id')->toArray();

    //     // // Only include your creator if they are NOT admin
    //     // $parentId = $user->created_by;
    //     // $parentUsers = [];
    //     // if ($parentId) {
    //     //     $parent = User::find($parentId);
    //     //     if ($parent && !$parent->hasRole('admin')) {
    //     //         $parentUsers[] = $parentId;
    //     //     }
    //     // }

    //     // // Merge all relevant user IDs
    //     // $userIds = array_unique(array_merge([$myId], $myUsers, $parentUsers));


    //     // Sum sales for these users
    //     $totalSales = Sale::whereIn('created_by', $userIds)->sum('grand_total');
    //     $totalPurchases = Purchase::whereIn('created_by', $userIds)->sum('grand_total');
    //     $totalPurchaseReturns = PurchaseReturn::whereIn('created_by', $userIds)->sum('grand_total');
    //     $totalSalesReturns = SalesReturn::whereIn('created_by', $userIds)->sum('total_return_amount');
    //     $totalSalesOrders = SalesOrder::whereIn('created_by', $userIds)->sum('total_amount');
    //     $totalReceived = ReceivedAdd::whereIn('created_by', $userIds)->sum('amount');
    //     $totalPayment = PaymentAdd::whereIn('created_by', $userIds)->sum('amount');
    //     $totalWorkOrders = WorkingOrder::whereIn('created_by', $userIds)->count();
    //     // Work orders with production_status = 'completed'
    //     $completedWorkOrders = WorkingOrder::whereIn('created_by', $userIds)
    //         ->where('production_status', 'completed')
    //         ->count();


    //     return Inertia::render('dashboard', [
    //         'totalSales' => $totalSales,
    //         'totalPurchases' => $totalPurchases,
    //         'totalPurchaseReturns' => $totalPurchaseReturns,
    //         'totalSalesReturns' => $totalSalesReturns,
    //         'totalSalesOrders' => $totalSalesOrders,
    //         'totalReceived' => $totalReceived,
    //         'totalPayment' => $totalPayment,
    //         'totalWorkOrders' => $totalWorkOrders,
    //         'completedWorkOrders' => $completedWorkOrders,

    //     ]);
    // }

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
            ->sum('interest_amount');         // use the colu

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
        ]);
    }
}
