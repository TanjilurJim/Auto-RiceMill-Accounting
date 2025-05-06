<?php

namespace App\Http\Controllers;

use App\Models\JournalEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;             //  ← NEW
use Maatwebsite\Excel\Facades\Excel;        //  ← NEW
use App\Exports\BalanceSheetExport;


class BalanceSheetController extends Controller
{

    public function filter()
    {
        return Inertia::render('reports/BalanceSheetFilter', [
            // pre‑fill date pickers with current year‑to‑date
            'default_from' => Carbon::now()->startOfYear()->toDateString(),
            'default_to'   => Carbon::now()->toDateString(),
        ]);
    }

    /** Quick in‑place P&L net figure for the selected period */
    private function netProfit(string $from, string $to): float
    {
        $entries = \App\Models\JournalEntry::with(['ledger', 'journal'])
            ->whereHas('journal', fn($q) => $q->whereBetween('date', [$from, $to]));

        $sum = fn(string $type, string $drCr) => (clone $entries)
            ->where('type', $drCr)
            ->whereHas('ledger', fn($q) => $q->where('ledger_type', $type))
            ->sum('amount');

        $sales       =  $sum('sales',   'credit');
        $cogs        =  $sum('cogs',    'debit');
        $expenses    =  $sum('expense', 'debit');
        $otherIncome =  $sum('income',  'credit');

        return ($sales - $cogs)            // gross profit
            - $expenses + $otherIncome;   // net profit
    }

    /** Map each group_under → which side of the sheet */
    private array $sideMap = [
        // ASSETS
        'Fixed Assets'           => 'asset',
        'Current Assets'         => 'asset',
        'Misc. Expenses (Asset)' => 'asset',
        'Sundry Debtors'           => 'asset',
        'Customer Summary'       => 'asset',

        // LIABILITIES & EQUITY
        'Capital Account'        => 'liability',
        'Loans (Liability)'      => 'liability',
        'Current Liabilities'    => 'liability',
        'Sundry Creditors'         => 'liability',
        'Sundry Creditors'       => 'liability',
    ];

    public function index(Request $request)
    {
        $from = $request->query('from_date') ?: now()->startOfYear()->toDateString();
        $to   = $request->query('to_date')   ?: now()->endOfYear()->toDateString();

        /* ───── Journal balances per group_under ───── */
        $raw = JournalEntry::join('account_ledgers',  'journal_entries.account_ledger_id', '=', 'account_ledgers.id')
            ->join('group_unders', 'account_ledgers.group_under_id', '=', 'group_unders.id')
            ->join('journals',     'journal_entries.journal_id',     '=', 'journals.id')
            ->whereBetween('journals.date', [$from, $to])
            ->selectRaw('group_unders.name  as group_name,
                         journal_entries.type as dr_cr,
                         SUM(journal_entries.amount)  as total')
            ->groupBy('group_unders.name', 'journal_entries.type')
            ->get()
            ->groupBy('group_name');

        /* 🔍 LOG ANY GROUPS WE HAVEN’T MAPPED YET ────────────── */
        $unmapped = $raw->keys()
            ->diff(collect($this->sideMap)->keys());

        if ($unmapped->isNotEmpty()) {
            // ← writes to storage/logs/laravel.log
            logger()->warning(
                'Un‑mapped GroupUnders → not shown on Balance Sheet',
                $unmapped->all()
            );
        }

        $balances = collect($this->sideMap)->map(function ($side, $gName) use ($raw) {

            $rows   = $raw->get($gName, collect());
            $debit  = $rows->firstWhere('dr_cr', 'debit')?->total ?? 0;
            $credit = $rows->firstWhere('dr_cr', 'credit')?->total ?? 0;

            // debit‑positive for assets, credit‑positive for liabilities
            $rawVal = $side === 'asset' ? $debit - $credit : $credit - $debit;



            if ($rawVal < 0) {
                // move to opposite column, make value positive
                $side   = $side === 'asset' ? 'liability' : 'asset';
                $value  = abs($rawVal);
            } else {
                $value  = $rawVal;
            }

            return ['group' => $gName, 'side' => $side, 'value' => $value];
        })->filter(fn($row) => $row['value'] != 0)->values();

        /* ───── Inventory figures ───── */
        $stock   = inventory_service()->closingStock($to);     // closing finished‑goods value
        $working = inventory_service()->workInProcess($to);    // WIP batches still open

        $netProfit = $this->netProfit($from, $to);

        if ($netProfit != 0) {
            $balances->push([
                'group' => 'Current‑Year Profit',
                'side'  => 'liability',     // profit belongs to equity
                'value' => $netProfit,
            ]);
        }
        $assetTotal = $balances->where('side', 'asset')->sum('value') + $stock + $working;
        $liabTotal  = $balances->where('side', 'liability')->sum('value');
        $difference = $assetTotal - $liabTotal;   // normally zero

        return Inertia::render('reports/BalanceSheet', [
            'from_date'   => $from,
            'to_date'     => $to,
            'balances'    => $balances,
            'stock'       => $stock,
            'working'     => $working,
            'assetTotal'  => $assetTotal,
            'liabTotal'   => $liabTotal,
            'difference'  => $difference,
            'company'     => company_info(),
        ]);
    }

    private function buildBalanceSheetData(string $from, string $to): array
    {
        $raw = JournalEntry::join('account_ledgers',  'journal_entries.account_ledger_id', '=', 'account_ledgers.id')
            ->join('group_unders', 'account_ledgers.group_under_id', '=', 'group_unders.id')
            ->join('journals',     'journal_entries.journal_id',     '=', 'journals.id')
            ->whereBetween('journals.date', [$from, $to])
            ->selectRaw('group_unders.name  as group_name,
                     journal_entries.type as dr_cr,
                     SUM(journal_entries.amount)  as total')
            ->groupBy('group_unders.name', 'journal_entries.type')
            ->get()
            ->groupBy('group_name');

        $unmapped = $raw->keys()->diff(collect($this->sideMap)->keys());
        if ($unmapped->isNotEmpty()) {
            logger()->warning('Unmapped GroupUnders → not shown on Balance Sheet', $unmapped->all());
        }

        $balances = collect($this->sideMap)->map(function ($side, $gName) use ($raw) {
            $rows   = $raw->get($gName, collect());
            $debit  = $rows->firstWhere('dr_cr', 'debit')?->total ?? 0;
            $credit = $rows->firstWhere('dr_cr', 'credit')?->total ?? 0;
            $rawVal = $side === 'asset' ? $debit - $credit : $credit - $debit;

            if ($rawVal < 0) {
                $side  = $side === 'asset' ? 'liability' : 'asset';
                $value = abs($rawVal);
            } else {
                $value = $rawVal;
            }

            return ['group' => $gName, 'side' => $side, 'value' => $value];
        })->filter(fn($row) => $row['value'] != 0)->values();

        $stock      = inventory_service()->closingStock($to);
        $working    = inventory_service()->workInProcess($to);
        $netProfit  = $this->netProfit($from, $to);

        if ($netProfit != 0) {
            $balances->push([
                'group' => 'Current‑Year Profit',
                'side'  => 'liability',
                'value' => $netProfit,
            ]);
        }

        $assetTotal = $balances->where('side', 'asset')->sum('value') + $stock + $working;
        $liabTotal  = $balances->where('side', 'liability')->sum('value');
        $difference = $assetTotal - $liabTotal;

        $co = company_info();
        return [
            'from_date'   => $from,
            'to_date'     => $to,
            'balances'    => $balances,
            'stock'       => $stock,
            'working'     => $working,
            'assetTotal'  => $assetTotal,
            'liabTotal'   => $liabTotal,
            'difference'  => $difference,
            'company'     => [
                'company_name'     => $co->company_name,
                'phone'            => $co->phone ?? null,
                'email'            => $co->email ?? null,
                'address'          => $co->address ?? null,
                'logo_path'        => $co->logo_path ?? null,
                'logo_thumb_path'  => $co->logo_thumb_path ?? null,
            ],
        ];
    }

    public function pdf(Request $request)
    {
        $from = $request->query('from_date') ?: now()->startOfYear()->toDateString();
        $to   = $request->query('to_date')   ?: now()->endOfYear()->toDateString();

        $data = $this->buildBalanceSheetData($from, $to);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('reports.balance_sheet_pdf', $data)
            ->setPaper('a4', 'portrait');

        return $pdf->download("Balance-Sheet_{$from}_{$to}.pdf");
    }

    public function excel(Request $request)
    {
        $from = $request->query('from_date') ?: now()->startOfYear()->toDateString();
        $to   = $request->query('to_date')   ?: now()->endOfYear()->toDateString();

        $data = $this->buildBalanceSheetData($from, $to);

        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\BalanceSheetExport($data),
            "Balance-Sheet_{$from}_{$to}.xlsx"
        );
    }
}
