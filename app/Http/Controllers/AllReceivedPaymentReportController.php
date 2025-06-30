<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\AccountLedger;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\AllReceivedPaymentExport;

use function user_scope_ids;

class AllReceivedPaymentReportController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'from_date' => 'required|date',
            'to_date' => 'required|date',
        ]);

        $from = $request->from_date;
        $to = $request->to_date;

        // 🔹 Received
        $receiveds = $this->applyUserScope(
            \App\Models\ReceivedAdd::with(['accountLedger', 'receivedMode.ledger', 'creator'])
                ->whereBetween('date', [$from, $to])
        )->get()->map(function ($r) {
            return [
                'date' => $r->date,
                'voucher_no' => $r->voucher_no,
                'ledger' => $r->accountLedger->account_ledger_name ?? '-',
                'mode_ledger' => $r->receivedMode?->ledger->account_ledger_name ?? '-',
                'amount' => $r->amount,
                'type' => 'Received',
                'created_by' => $r->creator->name ?? '-',
            ];
        });

        // 🔹 Payment
        $payments = $this->applyUserScope(
            \App\Models\PaymentAdd::with(['accountLedger', 'paymentMode.ledger', 'creator'])
                ->whereBetween('date', [$from, $to])
        )->get()->map(function ($p) {
            return [
                'date' => $p->date,
                'voucher_no' => $p->voucher_no,
                'ledger' => $p->accountLedger->account_ledger_name ?? '-',
                'mode_ledger' => $p->paymentMode?->ledger->account_ledger_name ?? '-',
                'amount' => $p->amount,
                'type' => 'Payment',
                'created_by' => $p->creator->name ?? '-',
            ];
        });

        // 🔹 Contra
        $contras = $this->applyUserScope(
            \App\Models\ContraAdd::with(['modeFrom.ledger', 'modeTo.ledger', 'creator'])
                ->whereBetween('date', [$from, $to])
        )->get()->map(function ($c) {
            return [
                'date' => $c->date,
                'voucher_no' => $c->voucher_no,
                'ledger' => $c->modeFrom?->ledger->account_ledger_name ?? '-',
                'mode_ledger' => $c->modeTo?->ledger->account_ledger_name ?? '-',
                'amount' => $c->amount,
                'type' => 'Contra',
                'created_by' => $c->creator->name ?? '-',
            ];
        });

        $entries = collect($receiveds)
            ->merge($payments)
            ->merge($contras)
            ->sortByDesc('date')
            ->values();

        return Inertia::render('reports/AllReceivedPayment', [
            'entries' => $entries,
            'from_date' => $from,
            'to_date' => $to,
            'company' => company_info(),
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

        return Inertia::render('reports/AllReceivedPaymentFilter', [
            'ledgers' => $ledgers,
        ]);
    }

    public function exportPdf(Request $request)
    {
        $request->validate([
            'from_date' => 'required|date',
            'to_date'   => 'required|date',
        ]);

        $from     = $request->from_date;
        $to       = $request->to_date;
        $entries  = $this->getEntries($from, $to);

        $company  = company_info();               // Eloquent model
        $company->thumb_path = $company->logo_thumb_path
            ? public_path('storage/' . $company->logo_thumb_path)   // ← local file!
            : null;

        return Pdf::loadView(
            'pdf.all-received-payment',
            compact('entries', 'from', 'to', 'company')
        )
            ->setPaper('A4', 'landscape')
            ->download('all-received-payment-report.pdf');
    }

    public function exportExcel(Request $request)
    {
        $request->validate([
            'from_date' => 'required|date',
            'to_date'   => 'required|date',
        ]);

        $from    = $request->from_date;
        $to      = $request->to_date;
        $entries = $this->getEntries($from, $to);
        $company = company_info();

        return Excel::download(
            new AllReceivedPaymentExport($entries, $from, $to, $company),
            'all-received-payment-report.xlsx'
        );
    }

    private function getEntries($from, $to)
    {
        $receiveds = $this->applyUserScope(
            \App\Models\ReceivedAdd::with(['accountLedger', 'receivedMode.ledger', 'creator'])
                ->whereBetween('date', [$from, $to])
        )->get()->map(function ($r) {
            return [
                'date' => $r->date,
                'voucher_no' => $r->voucher_no,
                'ledger' => $r->accountLedger->account_ledger_name ?? '-',
                'mode_ledger' => $r->receivedMode?->ledger->account_ledger_name ?? '-',
                'amount' => $r->amount,
                'type' => 'Received',
                'created_by' => $r->creator->name ?? '-',
            ];
        });

        $payments = $this->applyUserScope(
            \App\Models\PaymentAdd::with(['accountLedger', 'paymentMode.ledger', 'creator'])
                ->whereBetween('date', [$from, $to])
        )->get()->map(function ($p) {
            return [
                'date' => $p->date,
                'voucher_no' => $p->voucher_no,
                'ledger' => $p->accountLedger->account_ledger_name ?? '-',
                'mode_ledger' => $p->paymentMode?->ledger->account_ledger_name ?? '-',
                'amount' => $p->amount,
                'type' => 'Payment',
                'created_by' => $p->creator->name ?? '-',
            ];
        });

        $contras = $this->applyUserScope(
            \App\Models\ContraAdd::with(['modeFrom.ledger', 'modeTo.ledger', 'creator'])
                ->whereBetween('date', [$from, $to])
        )->get()->map(function ($c) {
            return [
                'date' => $c->date,
                'voucher_no' => $c->voucher_no,
                'ledger' => $c->modeFrom?->ledger->account_ledger_name ?? '-',
                'mode_ledger' => $c->modeTo?->ledger->account_ledger_name ?? '-',
                'amount' => $c->amount,
                'type' => 'Contra',
                'created_by' => $c->creator->name ?? '-',
            ];
        });

        return collect($receiveds)->merge($payments)->merge($contras)->sortByDesc('date')->values();
    }

    /**
     * Restricts queries based on user hierarchy
     */
    // protected function applyUserScope($query)
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
