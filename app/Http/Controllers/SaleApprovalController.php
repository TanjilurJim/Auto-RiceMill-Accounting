<?php

namespace App\Http\Controllers;
use App\Models\SaleApproval;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SaleApprovalController extends Controller
{
    //
     public function index()
    {
        $approvals = SaleApproval::with([
                'sale.accountLedger',   // customer name
                'sale.salesman',        // optional
            ])
            ->where('user_id', auth()->id())
            ->latest()                 // newest first
            ->paginate(15);

        return Inertia::render('sales/approvals/History', [
            'approvals' => $approvals,
        ]);
    }
}
