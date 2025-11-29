<?php

namespace App\Http\Controllers;

use App\Models\JournalEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class BalanceSheetController extends Controller
{
    /** Map each GroupUnder → which side of the sheet */
    private array $sideMap = [
        // ===== ASSETS =====
        'Fixed Assets'                   => 'asset',
        'Current Assets'                 => 'asset',  // includes Inventory, Cash, Bank, AR
        'Misc. Expenses (Asset)'         => 'asset',
        'Sundry Debtors'                 => 'asset',
        'Customer Summary'               => 'asset',
        'Deposit (Assets)'               => 'asset',
        'Loan & Advance (Asset)'         => 'asset',
        'Advance Deposit and Pre-Payment' => 'asset',
        'Cash-in-Hand'                   => 'asset',
        'Bank Account'                   => 'asset',
        'Vehicles & Transportation'      => 'asset',
        'Machinery & Tools'              => 'asset',
        'Land & Land Development'        => 'asset',

        // ===== LIABILITIES & EQUITY =====
        'Capital Account'                => 'liability',
        'Loans (Liability)'              => 'liability',
        'Secured Loans'                  => 'liability',
        'Long Term Loan'                 => 'liability',
        'Short Term Loan'                => 'liability',
        'Non Current Liabilities'        => 'liability',
        'Current Liabilities'            => 'liability',
        'Sundry Creditors'               => 'liability',
        'Supplier Summary'               => 'liability',
        'Inter Company Transaction'      => 'liability', // adjust if you treat it differently
    ];

    public function filter()
    {
        $fy = current_financial_year();
        return Inertia::render('reports/BalanceSheetFilter', [
            // YTD defaults
            'default_from' => $fy?->start_date ?? Carbon::now()->startOfYear()->toDateString(),
            'default_to'   => $fy?->end_date   ?? Carbon::now()->toDateString(),
        ]);
    }

    public function index(Request $request)
    {
        $fy       = current_financial_year();
        $fyStart  = $fy?->start_date ?? Carbon::now()->startOfYear()->toDateString();
        $fyEnd    = $fy?->end_date   ?? Carbon::now()->toDateString();

        // UI may pass a custom range; for a balance sheet we still compute
        // closing balances as of $to, and P&L YTD from $fyStart..$to
        $fromUi   = $request->query('from_date') ?: $fyStart; // for display only
        $to       = $request->query('to_date')   ?: $fyEnd;

        $user     = auth()->user();
        $ids      = user_scope_ids();

        /* ───────────────────────────────────────────────
         | 1) CLOSING BALANCES AS OF $to  (<= $to)
         |    Aggregate GL by GroupUnder
         * ─────────────────────────────────────────────── */
        $raw = JournalEntry::join('account_ledgers',  'journal_entries.account_ledger_id', '=', 'account_ledgers.id')
            // direct group_under on the ledger
            ->leftJoin('group_unders', 'account_ledgers.group_under_id', '=', 'group_unders.id')
            // fallback via the ledger's account_group -> its group_under
            ->leftJoin('account_groups', 'account_ledgers.account_group_id', '=', 'account_groups.id')
            ->leftJoin('group_unders as ag_gu', 'account_groups.group_under_id', '=', 'ag_gu.id')
            ->join('journals', 'journal_entries.journal_id', '=', 'journals.id')
            ->where('journals.date', '<=', $to)
            ->when(!$user->hasRole('admin'), fn($q) => $q->whereIn('journals.created_by', $ids))
            ->selectRaw('
        COALESCE(group_unders.name, ag_gu.name, "(Ungrouped)") as group_name,
        journal_entries.type as dr_cr,
        SUM(journal_entries.amount) as total
    ')
            ->groupBy('group_name', 'journal_entries.type')
            ->get()
            ->groupBy('group_name');

        // Warn if we have groups not mapped to a side
        $unmapped = $raw->keys()->diff(collect($this->sideMap)->keys());
        if ($unmapped->isNotEmpty()) {
            logger()->warning('Unmapped GroupUnders on Balance Sheet', $unmapped->all());
        }

        // Build side totals from closing balances
        $balances = collect($this->sideMap)->map(function ($side, $gName) use ($raw) {
            $rows   = $raw->get($gName, collect());
            $debit  = (float) ($rows->firstWhere('dr_cr', 'debit')->total ?? 0);
            $credit = (float) ($rows->firstWhere('dr_cr', 'credit')->total ?? 0);

            // For a closing balance view:
            // - Asset-ish groups: net = Dr - Cr (positive Dr balance)
            // - Liability/Equity-ish groups: net = Cr - Dr (positive Cr balance)
            $net = $side === 'asset' ? ($debit - $credit) : ($credit - $debit);

            if ($net <= 0) {
                // if negative or zero, push to opposite side as positive
                $side  = $side === 'asset' ? 'liability' : 'asset';
                $value = abs($net);
            } else {
                $value = $net;
            }

            return ['group' => $gName, 'side' => $side, 'value' => round($value, 2)];
        })->filter(fn($row) => $row['value'] != 0)->values();

        /* ───────────────────────────────────────────────
         | 2) CURRENT-YEAR PROFIT as of $to  (P&L YTD)
         |    Sum income vs expenses from FY start .. $to
         * ─────────────────────────────────────────────── */
        $netProfit = $this->netProfitYtd($fyStart, $to, $user->hasRole('admin') ? null : collect($ids));

        if ($netProfit !== 0.0) {
            if ($netProfit > 0) {
                // Profit adds to equity (liability side)
                $balances->push([
                    'group' => 'Current-Year Profit',
                    'side'  => 'liability',
                    'value' => round($netProfit, 2),
                ]);
            } else {
                // Loss sits on the asset side
                $balances->push([
                    'group' => 'Current-Year Loss',
                    'side'  => 'asset',
                    'value' => round(abs($netProfit), 2),
                ]);
            }
        }
        $priorRetained = $this->retainedEarningsPriorTo($fyStart, $user->hasRole('admin') ? null : collect($ids));
        if ($priorRetained !== 0.0) {
            if ($priorRetained > 0) {
                $balances->push([
                    'group' => 'Retained Earnings (Prior Years)',
                    'side'  => 'liability',         // equity side
                    'value' => round($priorRetained, 2),
                ]);
            } else {
                $balances->push([
                    'group' => 'Accumulated Loss (Prior Years)',
                    'side'  => 'asset',             // loss shows on assets
                    'value' => round(abs($priorRetained), 2),
                ]);
            }
        }

        $assetTotal = $balances->where('side', 'asset')->sum('value');
        $liabTotal  = $balances->where('side', 'liability')->sum('value');
        $difference = round($assetTotal - $liabTotal, 2); // should be 0.00 if everything is posted

        return Inertia::render('reports/BalanceSheet', [
            // For display; the true computation uses <= $to and YTD for P&L
            'from_date'   => $fromUi,
            'to_date'     => $to,

            'balances'    => $balances,
            'assetTotal'  => $assetTotal,
            'liabTotal'   => $liabTotal,
            'difference'  => $difference,
            'company'     => company_info(),
        ]);
    }

    /**
     * Compute net profit (income − expenses) for YTD [fyStart..to],
     * respecting multi-tenant scoping when $allowedUserIds is provided.
     */
    private function netProfitYtd(string $fyStart, string $to, ?\Illuminate\Support\Collection $allowedUserIds = null): float
    {
        // Income ledger types in your system
        $incomeTypes  = ['sales_income', 'other_income'];
        // Expense ledger types in your system
        $expenseTypes = ['operating_expense', 'cogs', 'expense'];

        $base = JournalEntry::query()
            ->join('account_ledgers', 'journal_entries.account_ledger_id', '=', 'account_ledgers.id')
            ->join('journals',        'journal_entries.journal_id',       '=', 'journals.id')
            ->whereBetween('journals.date', [$fyStart, $to]);

        if ($allowedUserIds) {
            $base->whereIn('journals.created_by', $allowedUserIds);
        }

        // Income: credits increase income; debits reduce it
        $incomeCredits = (clone $base)->whereIn('account_ledgers.ledger_type', $incomeTypes)
            ->where('journal_entries.type', 'credit')->sum('journal_entries.amount');

        $incomeDebits  = (clone $base)->whereIn('account_ledgers.ledger_type', $incomeTypes)
            ->where('journal_entries.type', 'debit')->sum('journal_entries.amount');

        $incomeNet = (float)$incomeCredits - (float)$incomeDebits;

        // Expenses (incl. COGS): debits increase expense; credits reduce it
        $expDebits = (clone $base)->whereIn('account_ledgers.ledger_type', $expenseTypes)
            ->where('journal_entries.type', 'debit')->sum('journal_entries.amount');

        $expCredits = (clone $base)->whereIn('account_ledgers.ledger_type', $expenseTypes)
            ->where('journal_entries.type', 'credit')->sum('journal_entries.amount');

        $expenseNet = (float)$expDebits - (float)$expCredits;

        return round($incomeNet - $expenseNet, 2);
    }
    private function retainedEarningsPriorTo(
        string $fyStart,
        ?\Illuminate\Support\Collection $allowedUserIds = null
    ): float {
        // Match your chart of accounts classification
        $incomeTypes  = ['sales_income', 'other_income'];
        $expenseTypes = ['operating_expense', 'cogs', 'expense'];

        $base = \App\Models\JournalEntry::query()
            ->join('account_ledgers', 'journal_entries.account_ledger_id', '=', 'account_ledgers.id')
            ->join('journals',        'journal_entries.journal_id',       '=', 'journals.id')
            ->where('journals.date', '<', $fyStart); // strictly before FY start

        if ($allowedUserIds) {
            $base->whereIn('journals.created_by', $allowedUserIds);
        }

        // Income: credits increase income
        $incomeCredits = (clone $base)->whereIn('account_ledgers.ledger_type', $incomeTypes)
            ->where('journal_entries.type', 'credit')->sum('journal_entries.amount');

        // Income debits reduce income (returns/discounts)
        $incomeDebits  = (clone $base)->whereIn('account_ledgers.ledger_type', $incomeTypes)
            ->where('journal_entries.type', 'debit')->sum('journal_entries.amount');

        $incomeNet = (float)$incomeCredits - (float)$incomeDebits;

        // Expenses/COGS: debits increase expense
        $expDebits = (clone $base)->whereIn('account_ledgers.ledger_type', $expenseTypes)
            ->where('journal_entries.type', 'debit')->sum('journal_entries.amount');

        // Credits reduce expense
        $expCredits = (clone $base)->whereIn('account_ledgers.ledger_type', $expenseTypes)
            ->where('journal_entries.type', 'credit')->sum('journal_entries.amount');

        $expenseNet = (float)$expDebits - (float)$expCredits;

        // Positive = accumulated profit (equity); negative = accumulated loss (asset)
        return round($incomeNet - $expenseNet, 2);
    }

    /* ====== PDF & Excel use the same computations as index() ====== */

    private function buildBalanceSheetData(string $fromUi, string $to): array
    {
        $fy      = current_financial_year();
        $fyStart = $fy?->start_date ?? \Carbon\Carbon::now()->startOfYear()->toDateString();

        $user    = auth()->user();
        $ids     = user_scope_ids();

        // P&L headings that should NEVER appear on the balance sheet
        // (we ignore these if they show up via joins/misgrouped ledgers)
        $plHeadings = [
            'Direct Income',
            'Indirect Income',
            'Other Income',
            'Sales Income',
            'Direct Expenses',
            'Indirect Expenses',
            'Selling & Distribution',
            'Administrative Overhead',
            'Financial Expenses',
            'Cost of Sales',
            'COGS',
            // add any local naming you use for P&L headers, if they exist in group_unders
        ];

        /* 1) Closing balances by GroupUnder as of $to */
        $raw = \App\Models\JournalEntry::join('account_ledgers',  'journal_entries.account_ledger_id', '=', 'account_ledgers.id')
            // prefer ledger's own group_under
            ->leftJoin('group_unders', 'account_ledgers.group_under_id', '=', 'group_unders.id')
            // fallback: ledger.account_group -> its group_under
            ->leftJoin('account_groups', 'account_ledgers.account_group_id', '=', 'account_groups.id')
            ->leftJoin('group_unders as ag_gu', 'account_groups.group_under_id', '=', 'ag_gu.id')
            ->join('journals', 'journal_entries.journal_id', '=', 'journals.id')
            ->where('journals.date', '<=', $to)
            ->when(!$user->hasRole('admin'), fn($q) => $q->whereIn('journals.created_by', $ids))
            ->selectRaw('
            COALESCE(group_unders.name, ag_gu.name, "(Ungrouped)") as group_name,
            journal_entries.type as dr_cr,
            SUM(journal_entries.amount) as total
        ')
            ->groupBy('group_name', 'journal_entries.type')
            ->get()
            ->groupBy('group_name');

        // Compute balances only for groups we recognize on a balance sheet
        $balances = collect($this->sideMap)->map(function ($side, $gName) use ($raw) {
            $rows   = $raw->get($gName, collect());
            $debit  = (float) ($rows->firstWhere('dr_cr', 'debit')->total  ?? 0);
            $credit = (float) ($rows->firstWhere('dr_cr', 'credit')->total ?? 0);

            // Assets show Dr balance; Liabilities/Equity show Cr balance
            $net = $side === 'asset' ? ($debit - $credit) : ($credit - $debit);

            if ($net <= 0) {
                // move negative amounts to the opposite side as positive
                $side  = $side === 'asset' ? 'liability' : 'asset';
                $value = abs($net);
            } else {
                $value = $net;
            }

            return ['group' => $gName, 'side' => $side, 'value' => round($value, 2)];
        })
            ->filter(fn($row) => $row['value'] != 0.0)
            ->values();

        /* 2) Profit/Loss (YTD) and Retained Earnings */
        $netProfit = $this->netProfitYtd($fyStart, $to, $user->hasRole('admin') ? null : collect($ids));
        if ($netProfit !== 0.0) {
            $balances->push([
                'group' => $netProfit > 0 ? 'Current-Year Profit' : 'Current-Year Loss',
                'side'  => $netProfit > 0 ? 'liability'          : 'asset',
                'value' => round(abs($netProfit), 2),
            ]);
        }

        $priorRetained = $this->retainedEarningsPriorTo($fyStart, $user->hasRole('admin') ? null : collect($ids));
        if ($priorRetained !== 0.0) {
            $balances->push([
                'group' => $priorRetained > 0 ? 'Retained Earnings (Prior Years)' : 'Accumulated Loss (Prior Years)',
                'side'  => $priorRetained > 0 ? 'liability'                       : 'asset',
                'value' => round(abs($priorRetained), 2),
            ]);
        }

        /* 3) Totals + diagnostics */
        $assetTotal = $balances->where('side', 'asset')->sum('value');
        $liabTotal  = $balances->where('side', 'liability')->sum('value');
        $difference = round($assetTotal - $liabTotal, 2);

        // Unmapped groups (exclude known P&L headings so we don’t spam warnings)
        $allGroupsInData = $raw->keys();
        $mappedGroups    = collect($this->sideMap)->keys();
        $unmapped        = $allGroupsInData
            ->diff($mappedGroups)
            ->reject(fn($g) => in_array($g, $plHeadings, true))
            ->values();

        if ($unmapped->isNotEmpty()) {
            logger()->warning('Unmapped GroupUnders on Balance Sheet (export)', $unmapped->all());
        }

        $co = company_info();

        return [
            'from_date'        => $fromUi,
            'to_date'          => $to,
            'balances'         => $balances,
            'assetTotal'       => $assetTotal,
            'liabTotal'        => $liabTotal,
            'difference'       => $difference,
            'unmapped_groups'  => $unmapped, // optional: show a banner in UI
            'company'          => [
                'company_name'    => $co->company_name,
                'phone'           => $co->phone ?? null,
                'email'           => $co->email ?? null,
                'address'         => $co->address ?? null,
                'logo_path'       => $co->logo_path ?? null,
                'logo_thumb_path' => $co->logo_thumb_path ?? null,
            ],
        ];
    }


    public function pdf(Request $request)
    {
        $fy      = current_financial_year();
        $fyStart = $fy?->start_date ?? Carbon::now()->startOfYear()->toDateString();
        $to      = $request->query('to_date') ?: ($fy?->end_date ?? Carbon::now()->toDateString());
        $fromUi  = $request->query('from_date') ?: $fyStart;

        $data = $this->buildBalanceSheetData($fromUi, $to);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('reports.balance_sheet_pdf', $data)
            ->setPaper('a4', 'portrait');

        return $pdf->download("Balance-Sheet_{$fromUi}_{$to}.pdf");
    }

    public function excel(Request $request)
    {
        $fy      = current_financial_year();
        $fyStart = $fy?->start_date ?? Carbon::now()->startOfYear()->toDateString();
        $to      = $request->query('to_date') ?: ($fy?->end_date ?? Carbon::now()->toDateString());
        $fromUi  = $request->query('from_date') ?: $fyStart;

        $data = $this->buildBalanceSheetData($fromUi, $to);

        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\BalanceSheetExport($data),
            "Balance-Sheet_{$fromUi}_{$to}.xlsx"
        );
    }
}
