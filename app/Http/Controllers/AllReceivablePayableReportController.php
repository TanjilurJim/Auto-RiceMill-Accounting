<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\AccountLedger;
use App\Models\ReceivedAdd;
use App\Models\PaymentAdd;
use Barryvdh\DomPDF\Facade\Pdf;

use App\Models\AccountGroup;
use App\Models\CompanySetting;
use App\Models\Sale;
use App\Models\Purchase;
use App\Models\SalesReturn;
use App\Models\PurchaseReturn;


use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ReceivablePayableExport;


use Inertia\Inertia;

use function user_scope_ids;


class AllReceivablePayableReportController extends Controller
{
    public function index(Request $request)
    {
        $from = $request->input('from_date');
        $to = $request->input('to_date');

        $ledgers = $this->applyUserScope(
            AccountLedger::with('groupUnder')
                ->select('id', 'account_ledger_name', 'opening_balance', 'closing_balance', 'group_under_id', 'debit_credit')
        )->get();

        $report = [];

        foreach ($ledgers as $ledger) {
            $ledgerId = $ledger->id;

            // Received directly (Receive > Ledger)
            $totalReceivedDirect = $this->applyUserScope(ReceivedAdd::where('account_ledger_id', $ledgerId))
                ->when($from, fn($q) => $q->whereDate('date', '>=', $from))
                ->when($to, fn($q) => $q->whereDate('date', '<=', $to))
                ->sum('amount');

            // Received into bank/cash from sales (via received_modes)
            $totalReceivedFromSales = \DB::table('received_modes')
                ->join('sales', 'sales.id', '=', 'received_modes.sale_id')
                ->where('received_modes.ledger_id', $ledgerId)
                ->when($from, fn($q) => $q->whereDate('sales.date', '>=', $from))
                ->when($to, fn($q) => $q->whereDate('sales.date', '<=', $to))
                ->sum('received_modes.amount_received');

            // Total received into this payment ledger
            $totalReceived = $totalReceivedDirect + $totalReceivedFromSales;

            // ✅ Received from customer (used to reduce receivables)
            $salesReceived = $this->applyUserScope(Sale::where('account_ledger_id', $ledgerId))
                ->when($from, fn($q) => $q->whereDate('date', '>=', $from))
                ->when($to, fn($q) => $q->whereDate('date', '<=', $to))
                ->sum('amount_received');

            // Payment directly (Payment > Ledger)
            $totalPayment = $this->applyUserScope(PaymentAdd::where('account_ledger_id', $ledgerId))
                ->when($from, fn($q) => $q->whereDate('date', '>=', $from))
                ->when($to, fn($q) => $q->whereDate('date', '<=', $to))
                ->sum('amount');

            // Payment from bank/cash for purchase returns (via received_modes)
            $totalPaymentFromReceivedModes = \DB::table('received_modes')
                ->join('purchase_returns', 'purchase_returns.id', '=', 'received_modes.purchase_return_id')
                ->where('received_modes.ledger_id', $ledgerId)
                ->when($from, fn($q) => $q->whereDate('purchase_returns.date', '>=', $from))
                ->when($to, fn($q) => $q->whereDate('purchase_returns.date', '<=', $to))
                ->sum('received_modes.amount_paid');

            $totalPayment += $totalPaymentFromReceivedModes;

            $totalSale = $this->applyUserScope(Sale::where('account_ledger_id', $ledgerId))
                ->when($from, fn($q) => $q->whereDate('date', '>=', $from))
                ->when($to, fn($q) => $q->whereDate('date', '<=', $to))
                ->sum('grand_total');

            $totalPurchase = $this->applyUserScope(Purchase::where('account_ledger_id', $ledgerId))
                ->when($from, fn($q) => $q->whereDate('date', '>=', $from))
                ->when($to, fn($q) => $q->whereDate('date', '<=', $to))
                ->sum('grand_total');

            $totalSalesReturn = $this->applyUserScope(SalesReturn::where('account_ledger_id', $ledgerId))
                ->when($from, fn($q) => $q->whereDate('return_date', '>=', $from))
                ->when($to, fn($q) => $q->whereDate('return_date', '<=', $to))
                ->sum('total_return_amount');

            $totalPurchaseReturn = $this->applyUserScope(PurchaseReturn::where('account_ledger_id', $ledgerId))
                ->when($from, fn($q) => $q->whereDate('date', '>=', $from))
                ->when($to, fn($q) => $q->whereDate('date', '<=', $to))
                ->sum('grand_total');

            // ✅ Final balance logic
            $balance = ($ledger->opening_balance ?? 0)
                + $totalSale
                - $salesReceived  // correct receivable
                - $totalSalesReturn
                - $totalReceived
                - $totalPayment
                + $totalPurchase
                - $totalPurchaseReturn;

            if (abs($balance) < 0.01) {
                continue;
            }

            $report[] = [
                'ledger_id' => $ledgerId,
                'ledger_name' => $ledger->account_ledger_name,
                'group_name' => optional($ledger->groupUnder)->name,
                'balance' => abs($balance),
                'type' => $balance >= 0
                    ? ($ledger->debit_credit === 'credit' ? 'CR' : 'DR')
                    : ($ledger->debit_credit === 'credit' ? 'DR' : 'CR'),
            ];
        }

        $receivables = collect($report)->where('type', 'DR')->values();
        $payables = collect($report)->where('type', 'CR')->values();
        $company = CompanySetting::where('created_by', auth()->id())->first();

        return Inertia::render('reports/AllReceivablePayableReport', [
            'from_date' => $from,
            'to_date' => $to,
            'receivables' => $receivables,
            'payables' => $payables,
            'company' => $company,
        ]);
    }


    public function filter()
    {
        $user = auth()->user();
        $ids = user_scope_ids();

        $ledgers = AccountLedger::when(
            !$user->hasRole('admin'),
            fn($q) => $q->whereIn('created_by', $ids)
        )->get(['id', 'account_ledger_name']);

        return Inertia::render('reports/AllReceivablePayableFilter', [
            'ledgers' => $ledgers,
        ]);
    }


    public function exportPdf(Request $request)
    {
        $from = $request->input('from_date');
        $to = $request->input('to_date');

        $report = $this->generateReport($from, $to);
        $company = $this->getCompany();

        $pdf = Pdf::loadView('exports.receivable-payable-pdf', [
            'from_date' => $from,
            'to_date' => $to,
            'receivables' => $report['receivables'],
            'payables' => $report['payables'],
            'company' => $company,
        ])->setPaper('a4', 'portrait');

        return $pdf->download("receivable-payable-{$from}-{$to}.pdf");
    }

    public function excel(Request $request)
    {
        $from = $request->input('from_date');
        $to = $request->input('to_date');

        $report = $this->generateReport($from, $to);

        return Excel::download(new ReceivablePayableExport($report['receivables'], $report['payables'], $from, $to), "receivable-payable-{$from}-{$to}.xlsx");
    }

    private function generateReport($from, $to)
    {
        $ledgers = $this->applyUserScope(
            AccountLedger::with('groupUnder')->select('id', 'account_ledger_name', 'opening_balance', 'closing_balance', 'group_under_id', 'debit_credit')
        )->get();

        $report = [];

        foreach ($ledgers as $ledger) {
            $ledgerId = $ledger->id;

            // Received via Receive Module
            $totalReceivedDirect = $this->applyUserScope(ReceivedAdd::where('account_ledger_id', $ledgerId))
                ->when($from, fn($q) => $q->whereDate('date', '>=', $from))
                ->when($to, fn($q) => $q->whereDate('date', '<=', $to))
                ->sum('amount');

            // Received via Sales Received Modes (Bank/Cash ledger side)
            $totalReceivedFromSales = \DB::table('received_modes')
                ->join('sales', 'sales.id', '=', 'received_modes.sale_id')
                ->where('received_modes.ledger_id', $ledgerId)
                ->when($from, fn($q) => $q->whereDate('sales.date', '>=', $from))
                ->when($to, fn($q) => $q->whereDate('sales.date', '<=', $to))
                ->sum('received_modes.amount_received');

            $totalReceived = $totalReceivedDirect + $totalReceivedFromSales;

            // Payments via Payment Module
            $totalPayment = $this->applyUserScope(PaymentAdd::where('account_ledger_id', $ledgerId))
                ->when($from, fn($q) => $q->whereDate('date', '>=', $from))
                ->when($to, fn($q) => $q->whereDate('date', '<=', $to))
                ->sum('amount');

            // Payments via ReceivedModes in Purchase Return (Bank/Cash ledger side)
            $totalPaymentFromReceivedModes = \DB::table('received_modes')
                ->join('purchase_returns', 'purchase_returns.id', '=', 'received_modes.purchase_return_id')
                ->where('received_modes.ledger_id', $ledgerId)
                ->when($from, fn($q) => $q->whereDate('purchase_returns.date', '>=', $from))
                ->when($to, fn($q) => $q->whereDate('purchase_returns.date', '<=', $to))
                ->sum('received_modes.amount_paid');

            $totalPayment += $totalPaymentFromReceivedModes;

            // Sales and Received (Customer-side)
            $salesGrandTotal = $this->applyUserScope(Sale::where('account_ledger_id', $ledgerId))
                ->when($from, fn($q) => $q->whereDate('date', '>=', $from))
                ->when($to, fn($q) => $q->whereDate('date', '<=', $to))
                ->sum('grand_total');

            $salesReceived = $this->applyUserScope(Sale::where('account_ledger_id', $ledgerId))
                ->when($from, fn($q) => $q->whereDate('date', '>=', $from))
                ->when($to, fn($q) => $q->whereDate('date', '<=', $to))
                ->sum('amount_received');

            $totalPurchase = $this->applyUserScope(Purchase::where('account_ledger_id', $ledgerId))
                ->when($from, fn($q) => $q->whereDate('date', '>=', $from))
                ->when($to, fn($q) => $q->whereDate('date', '<=', $to))
                ->sum('grand_total');

            $totalSalesReturn = $this->applyUserScope(SalesReturn::where('account_ledger_id', $ledgerId))
                ->when($from, fn($q) => $q->whereDate('return_date', '>=', $from))
                ->when($to, fn($q) => $q->whereDate('return_date', '<=', $to))
                ->sum('total_return_amount');

            $totalPurchaseReturn = $this->applyUserScope(PurchaseReturn::where('account_ledger_id', $ledgerId))
                ->when($from, fn($q) => $q->whereDate('date', '>=', $from))
                ->when($to, fn($q) => $q->whereDate('date', '<=', $to))
                ->sum('grand_total');

            $balance = ($ledger->opening_balance ?? 0)
                + $salesGrandTotal
                - $salesReceived
                - $totalSalesReturn
                - $totalReceived     // cash/bank ledger inflow
                - $totalPayment      // cash/bank ledger outflow
                + $totalPurchase
                - $totalPurchaseReturn;

            if (abs($balance) < 0.01) {
                continue;
            }

            $report[] = [
                'ledger_id' => $ledgerId,
                'ledger_name' => $ledger->account_ledger_name,
                'group_name' => optional($ledger->groupUnder)->name,
                'balance' => abs($balance),
                'type' => $balance >= 0
                    ? ($ledger->debit_credit === 'credit' ? 'CR' : 'DR')
                    : ($ledger->debit_credit === 'credit' ? 'DR' : 'CR'),
            ];
        }

        return [
            'receivables' => collect($report)->where('type', 'DR')->values(),
            'payables' => collect($report)->where('type', 'CR')->values(),
        ];
    }


    // private function applyUserScope($query)
    // {
    //     return $query->when(!auth()->user()->hasRole('admin'), function ($query) {
    //         $query->where(function ($q) {
    //             $q->where('created_by', auth()->id())
    //                 ->orWhereHas('creator', fn($q2) => $q2->where('created_by', auth()->id()));
    //         });
    //     });
    // }

    protected function applyUserScope($query)
    {
        $user = auth()->user();
        $ids = user_scope_ids();

        return $query->when(
            !$user->hasRole('admin'),
            fn($q) => $q->whereIn('created_by', $ids)
        );
    }

}
