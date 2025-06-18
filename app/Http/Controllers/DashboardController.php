<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\User;
use Inertia\Inertia;
// use Illuminate\Foundation\Auth\User;
use App\Models\Purchase;
use App\Models\PaymentAdd;
use App\Models\SalesOrder;
use App\Models\ReceivedAdd;
use App\Models\SalesReturn;
use App\Models\WorkingOrder;
use Illuminate\Http\Request;
use App\Models\PurchaseReturn;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // // Exclude admin
        // if ($user->hasRole('admin')) {
        //     $userIds = User::pluck('id'); // all users
        // } else {
        //     // Get my id
        //     $myId = $user->id;

        //     // Users I created
        //     $myUsers = User::where('created_by', $myId)->pluck('id')->toArray();

        //     // User who created me (parent)
        //     $parentId = $user->created_by;
        //     $parentUsers = [];
        //     if ($parentId) {
        //         $parentUsers = [$parentId];
        //     }

        //     // All relevant user IDs
        //     $userIds = array_unique(array_merge([$myId], $myUsers, $parentUsers));
        // }

        $myId = $user->id;

        // Users you created
        $myUsers = User::where('created_by', $myId)->pluck('id')->toArray();

        // Only include your creator if they are NOT admin
        $parentId = $user->created_by;
        $parentUsers = [];
        if ($parentId) {
            $parent = User::find($parentId);
            if ($parent && !$parent->hasRole('admin')) {
                $parentUsers[] = $parentId;
            }
        }

        // Merge all relevant user IDs
        $userIds = array_unique(array_merge([$myId], $myUsers, $parentUsers));


        // Sum sales for these users
        $totalSales = Sale::whereIn('created_by', $userIds)->sum('grand_total');
        $totalPurchases = Purchase::whereIn('created_by', $userIds)->sum('grand_total');
        $totalPurchaseReturns = PurchaseReturn::whereIn('created_by', $userIds)->sum('grand_total');
        $totalSalesReturns = SalesReturn::whereIn('created_by', $userIds)->sum('total_return_amount');
        $totalSalesOrders = SalesOrder::whereIn('created_by', $userIds)->sum('total_amount');
        $totalReceived = ReceivedAdd::whereIn('created_by', $userIds)->sum('amount');
        $totalPayment = PaymentAdd::whereIn('created_by', $userIds)->sum('amount');
        $totalWorkOrders = WorkingOrder::whereIn('created_by', $userIds)->count();
        // Work orders with production_status = 'completed'
        $completedWorkOrders = WorkingOrder::whereIn('created_by', $userIds)
            ->where('production_status', 'completed')
            ->count();


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

        ]);
    }
}