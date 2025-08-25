<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Journal;
use App\Models\JournalEntry;

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
        $to   = $request->input('to_date');

        $report  = $this->generateReport($from, $to);
        $company = CompanySetting::where('created_by', auth()->id())->first();

        return Inertia::render('reports/AllReceivablePayableReport', [
            'from_date'   => $from,
            'to_date'     => $to,
            'receivables' => $report['receivables'],
            'payables'    => $report['payables'],
            'company'     => $company,
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
        // 1) Ledgers in scope
        $ledgers = $this->applyUserScope(
            AccountLedger::with('groupUnder')
                ->select('id', 'account_ledger_name', 'opening_balance', 'debit_credit', 'group_under_id')
        )->get();

        if ($ledgers->isEmpty()) {
            return ['receivables' => collect(), 'payables' => collect()];
        }

        $ledgerIds = $ledgers->pluck('id')->all();

        // Helper: apply tenant scope to Journal inside whereHas
        $scopeJournal = function ($q) {
            // applyUserScope expects a Builder; Journal has created_by
            $this->applyUserScope($q);
        };

        // 2a) B/F movements (before 'from') – only if from provided
        $bf = collect();
        if ($from) {
            $bf = \App\Models\JournalEntry::query()
                ->whereIn('account_ledger_id', $ledgerIds)
                ->whereHas('journal', function ($q) use ($from, $scopeJournal) {
                    $scopeJournal($q);
                    $q->whereDate('date', '<', $from);
                })
                ->select(
                    'account_ledger_id',
                    \DB::raw("SUM(CASE WHEN type = 'debit'  THEN amount ELSE 0 END) as dr"),
                    \DB::raw("SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) as cr")
                )
                ->groupBy('account_ledger_id')
                ->get()
                ->keyBy('account_ledger_id');
        }

        // 2b) Period movements within [from, to] (if no dates, take all in-scope)
        $period = \App\Models\JournalEntry::query()
            ->whereIn('account_ledger_id', $ledgerIds)
            ->whereHas('journal', function ($q) use ($from, $to, $scopeJournal) {
                $scopeJournal($q);
                if ($from) $q->whereDate('date', '>=', $from);
                if ($to)   $q->whereDate('date', '<=', $to);
            })
            ->select(
                'account_ledger_id',
                \DB::raw("SUM(CASE WHEN type = 'debit'  THEN amount ELSE 0 END) as dr"),
                \DB::raw("SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) as cr")
            )
            ->groupBy('account_ledger_id')
            ->get()
            ->keyBy('account_ledger_id');

        // 3) Compute balances
        $rows = [];
        foreach ($ledgers as $l) {
            $open = (float) ($l->opening_balance ?? 0);

            $bfDr = (float) ($bf[$l->id]->dr ?? 0);
            $bfCr = (float) ($bf[$l->id]->cr ?? 0);

            $perDr = (float) ($period[$l->id]->dr ?? 0);
            $perCr = (float) ($period[$l->id]->cr ?? 0);

            $net = ($bfDr - $bfCr) + ($perDr - $perCr);
            $balance = $open + $net;

            if (abs($balance) < 0.01) {
                continue;
            }

            // presentation (your existing convention)
            $type = $balance >= 0
                ? ($l->debit_credit === 'credit' ? 'CR' : 'DR')
                : ($l->debit_credit === 'credit' ? 'DR' : 'CR');

            $rows[] = [
                'ledger_id'   => $l->id,
                'ledger_name' => $l->account_ledger_name,
                'group_name'  => optional($l->groupUnder)->name,
                'balance'     => abs($balance),
                'type'        => $type,
            ];
        }

        return [
            'receivables' => collect($rows)->where('type', 'DR')->values(),
            'payables'    => collect($rows)->where('type', 'CR')->values(),
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
