<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JournalEntry;
use App\Models\AccountLedger;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ReceivablePayableExport;
use Inertia\Inertia;

use function user_scope_ids;
use function company_info;

class AllReceivablePayableReportController extends Controller
{
    /** Which GroupUnder names belong to AR vs AP */
    private array $receivableGroups = [
        'Sundry Debtors',
        'Customer Summary',
        'Loan & Advance (Asset)',
        'Advance Deposit and Pre-Payment',
        'Deposit (Assets)',
    ];

    private array $payableGroups = [
        'Sundry Creditors',
        'Supplier Summary',
        'Current Liabilities',
        'Loans (Liability)',
    ];

    public function index(Request $request)
    {
        $from = $request->input('from_date');
        $to   = $request->input('to_date');

        $report  = $this->generateReport($from, $to);

        return Inertia::render('reports/AllReceivablePayableReport', [
            'from_date'   => $from,
            'to_date'     => $to,
            'receivables' => $report['receivables'],
            'payables'    => $report['payables'],
            'company'     => company_info(),
        ]);
    }

    public function filter()
    {
        $user = auth()->user();
        $ids  = user_scope_ids();

        $ledgers = AccountLedger::when(!$user->hasRole('admin'),
            fn($q) => $q->whereIn('created_by', $ids)
        )->get(['id', 'account_ledger_name']);

        return Inertia::render('reports/AllReceivablePayableFilter', [
            'ledgers' => $ledgers,
        ]);
    }

    public function exportPdf(Request $request)
    {
        $from   = $request->input('from_date');
        $to     = $request->input('to_date');
        $report = $this->generateReport($from, $to);

        $pdf = Pdf::loadView('exports.receivable-payable-pdf', [
            'from_date'   => $from,
            'to_date'     => $to,
            'receivables' => $report['receivables'],
            'payables'    => $report['payables'],
            'company'     => company_info(),
        ])->setPaper('a4', 'portrait');

        return $pdf->download("receivable-payable-{$from}-{$to}.pdf");
    }

    public function excel(Request $request)
    {
        $from   = $request->input('from_date');
        $to     = $request->input('to_date');
        $report = $this->generateReport($from, $to);

        return Excel::download(
            new ReceivablePayableExport($report['receivables'], $report['payables'], $from, $to),
            "receivable-payable-{$from}-{$to}.xlsx"
        );
    }

    private function generateReport(?string $from, ?string $to): array
    {
        $user = auth()->user();
        $ids  = user_scope_ids();

        // Only ledgers that live in AR/AP group_under buckets
        $ledgers = AccountLedger::with('groupUnder:id,name')
            ->select('id', 'account_ledger_name', 'opening_balance', 'debit_credit', 'group_under_id', 'created_by')
            ->when(!$user->hasRole('admin'), fn($q) => $q->whereIn('created_by', $ids))
            ->whereHas('groupUnder', function ($q) {
                $q->whereIn('name', array_merge($this->receivableGroups, $this->payableGroups));
            })
            ->get();

        if ($ledgers->isEmpty()) {
            return ['receivables' => collect(), 'payables' => collect()];
        }

        $ledgerIds = $ledgers->pluck('id')->all();

        // Helper: scope journals by tenant
        $scopeJournal = function ($q) use ($user, $ids) {
            if (!$user->hasRole('admin')) {
                $q->whereIn('created_by', $ids);
            }
        };

        // Movements BEFORE "from" (B/F)
        $bf = collect();
        if ($from) {
            $bf = JournalEntry::query()
                ->whereIn('account_ledger_id', $ledgerIds)
                ->whereHas('journal', function ($q) use ($from, $scopeJournal) {
                    $scopeJournal($q);
                    $q->whereDate('date', '<', $from);
                })
                ->select(
                    'account_ledger_id',
                    \DB::raw("SUM(CASE WHEN type='debit'  THEN amount ELSE 0 END) as dr"),
                    \DB::raw("SUM(CASE WHEN type='credit' THEN amount ELSE 0 END) as cr")
                )
                ->groupBy('account_ledger_id')
                ->get()
                ->keyBy('account_ledger_id');
        }

        // Movements IN the period [from..to] (or all, if null)
        $period = JournalEntry::query()
            ->whereIn('account_ledger_id', $ledgerIds)
            ->whereHas('journal', function ($q) use ($from, $to, $scopeJournal) {
                $scopeJournal($q);
                if ($from) $q->whereDate('date', '>=', $from);
                if ($to)   $q->whereDate('date', '<=', $to);
            })
            ->select(
                'account_ledger_id',
                \DB::raw("SUM(CASE WHEN type='debit'  THEN amount ELSE 0 END) as dr"),
                \DB::raw("SUM(CASE WHEN type='credit' THEN amount ELSE 0 END) as cr")
            )
            ->groupBy('account_ledger_id')
            ->get()
            ->keyBy('account_ledger_id');

        $receivables = [];
        $payables    = [];

        foreach ($ledgers as $l) {
            $groupName = $l->groupUnder->name ?? '(Ungrouped)';

            // Opening balance by side
            $open      = (float) ($l->opening_balance ?? 0);
            $openDr    = $l->debit_credit === 'debit'  ? $open : 0.0;
            $openCr    = $l->debit_credit === 'credit' ? $open : 0.0;

            // Movement sums
            $bfDr      = (float) ($bf[$l->id]->dr ?? 0);
            $bfCr      = (float) ($bf[$l->id]->cr ?? 0);
            $perDr     = (float) ($period[$l->id]->dr ?? 0);
            $perCr     = (float) ($period[$l->id]->cr ?? 0);

            // Closing DR/CR totals and net
            $totalDr   = $openDr + $bfDr + $perDr;
            $totalCr   = $openCr + $bfCr + $perCr;
            $net       = $totalDr - $totalCr;  // >0 => DR balance, <0 => CR balance

            if (abs($net) < 0.01) {
                continue; // skip zero balances
            }

            $amount = round(abs($net), 2);
            $side   = $net > 0 ? 'DR' : 'CR';

            $isRecvGroup = in_array($groupName, $this->receivableGroups, true);
            $isPayGroup  = in_array($groupName, $this->payableGroups, true);

            // Only classify AR/AP groups; add suffix for advances/overpayments
            if ($isRecvGroup && $side === 'DR') {
                $receivables[] = [
                    'ledger_id'   => $l->id,
                    'ledger_name' => $l->account_ledger_name,
                    'group_name'  => $groupName,
                    'balance'     => $amount,
                    'type'        => 'DR',
                ];
            } elseif ($isRecvGroup && $side === 'CR') {
                // Customer overpayment
                $payables[] = [
                    'ledger_id'   => $l->id,
                    'ledger_name' => $l->account_ledger_name . ' (Overpayment)',
                    'group_name'  => $groupName,
                    'balance'     => $amount,
                    'type'        => 'CR',
                ];
            } elseif ($isPayGroup && $side === 'CR') {
                $payables[] = [
                    'ledger_id'   => $l->id,
                    'ledger_name' => $l->account_ledger_name,
                    'group_name'  => $groupName,
                    'balance'     => $amount,
                    'type'        => 'CR',
                ];
            } elseif ($isPayGroup && $side === 'DR') {
                // Advance given to supplier
                $receivables[] = [
                    'ledger_id'   => $l->id,
                    'ledger_name' => $l->account_ledger_name . ' (Advance)',
                    'group_name'  => $groupName,
                    'balance'     => $amount,
                    'type'        => 'DR',
                ];
            }
        }

        return [
            'receivables' => collect($receivables)->values(),
            'payables'    => collect($payables)->values(),
        ];
    }
}
