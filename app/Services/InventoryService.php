<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use App\Models\WorkingOrder;

class InventoryService
{
    /*-----------------------------------------------------------------
    | 1) Closing Stock (finished goods)                               
    |    stocks table must have:  qty, avg_cost                       
    |    If you haven’t added avg_cost yet, see Option B below.       
    -----------------------------------------------------------------*/
    public function closingStock(string $asOfDate): float
    {
        return (float) DB::table('stocks')
            ->selectRaw('SUM(qty * avg_cost) AS val')
            ->value('val') ?: 0;
    }

    /*-----------------------------------------------------------------
    | 2) Work in Process                                              
    |    Sum total_amount for working orders not yet completed        
    -----------------------------------------------------------------*/
    public function workInProcess(string $asOfDate): float
    {
        return (float) WorkingOrder::whereDate('date', '<=', $asOfDate)
            ->where('production_status', '!=', 'completed')
            ->sum('total_amount');
    }
}
