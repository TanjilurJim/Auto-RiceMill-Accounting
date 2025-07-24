<?php

namespace App\Http\Controllers;

use App\Models\PurchaseApproval;
use Inertia\Inertia;

class PurchaseApprovalController extends Controller
{
    /**
     * Show **my** approve / reject actions on Purchases.
     * URI:  GET /purchases/approvals
     */
    public function index()
    {
        $approvals = PurchaseApproval::with([
            // eager-load bits you want to show in the table
            'purchase.accountLedger:id,account_ledger_name',   // supplier name
            'purchase.godown:id,name',
            'purchase.salesman:id,name',
        ])
            ->where('user_id', auth()->id())   // only what *I* did
            ->latest()                         // newest first
            ->paginate(15);

        return Inertia::render('purchases/approvals/History', [
            'approvals' => $approvals,
        ]);
    }
}
