<?php

namespace App\Http\Controllers;

use App\Models\JournalEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PDF;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ProfitLossExport;

class ProfitLossController extends Controller
{
    /* ------------------------ filter view ------------------------ */
    public function filter()
    {
        return Inertia::render('reports/ProfitLossFilter');
    }

    /* ---------------------- main React page ---------------------- */
    public function index(Request $request)
    {
        $data = $this->getProfitLossData($request);

        return Inertia::render('reports/ProfitLoss', [
            'from_date' => $data['from_date'],
            'to_date'   => $data['to_date'],

            // top summary
            'figures'   => $data['figures'],

            // breakdowns
            'byLedger'  => $data['byLedger'],
            'grouped'   => $data['grouped'],   // now grouped by ledger_type (compat name)

            // org
            'company'   => $data['company'],
        ]);
    }

    /* --------------------------- PDF ----------------------------- */
    public function pdf(Request $request)
    {
        $data = $this->getProfitLossData($request);

        $pdf = PDF::loadView('exports.profit_loss_pdf', $data)
            ->setPaper('A4', 'portrait');

        return $pdf->download('profit_loss_report.pdf');
    }

    /* -------------------------- Excel ---------------------------- */
    public function excel(Request $request)
    {
        $data = $this->getProfitLossData($request);

        return Excel::download(new ProfitLossExport($data), 'profit_loss_report.xlsx');
    }

    /* ==============================================================
       Core data builder – reused by web view + PDF + Excel
    ============================================================== */
    private function getProfitLossData(Request $request): array
    {
        $from = $request->query('from_date') ?: now()->startOfYear()->toDateString();
        $to   = $request->query('to_date')   ?: now()->endOfYear()->toDateString();

        $user = auth()->user();
        $ids  = user_scope_ids();

        // Canonical classification by ledger_type
        $incomeTypes  = ['sales_income', 'other_income', 'service_income', 'crushing_income', 'income'];            // include legacy 'income'
        $expenseTypes = ['cogs', 'operating_expense', 'expense'];              // include legacy 'expense'

        // Base relation for sums (date + tenant scope)
        $base = JournalEntry::query()
            ->join('account_ledgers as al', 'journal_entries.account_ledger_id', '=', 'al.id')
            ->join('journals as j',         'journal_entries.journal_id',       '=', 'j.id')
            ->whereBetween('j.date', [$from, $to]);

        if (!$user->hasRole('admin')) {
            $base->whereIn('j.created_by', $ids);
        }

        // Sum helper: netting by type set + DR/CR
        $sumCredits = function (array $types) use ($base) {
            return (clone $base)
                ->whereIn('al.ledger_type', $types)
                ->where('journal_entries.type', 'credit')
                ->sum('journal_entries.amount');
        };
        $sumDebits = function (array $types) use ($base) {
            return (clone $base)
                ->whereIn('al.ledger_type', $types)
                ->where('journal_entries.type', 'debit')
                ->sum('journal_entries.amount');
        };

        /* ---------- Top figures ---------- */
        $salesCredits   = (float) $sumCredits(['sales_income', 'sales']); // include legacy 'sales'
        $salesDebits    = (float) $sumDebits(['sales_income', 'sales']);
        $sales          = $salesCredits - $salesDebits;

        $cogsDebits     = (float) $sumDebits(['cogs']);
        $cogsCredits    = (float) $sumCredits(['cogs']);
        $cogs           = $cogsDebits - $cogsCredits;

        $opexDebits     = (float) $sumDebits(['operating_expense', 'expense']);
        $opexCredits    = (float) $sumCredits(['operating_expense', 'expense']);
        $expenses       = $opexDebits - $opexCredits;

        $oiCredits      = (float) $sumCredits(['other_income', 'income']);
        $oiDebits       = (float) $sumDebits(['other_income', 'income']);
        $otherIncome    = $oiCredits - $oiDebits;

        $svcCredits    = (float) $sumCredits(['service_income', 'crushing_income']);
        $svcDebits     = (float) $sumDebits(['service_income', 'crushing_income']);
        $serviceIncome = $svcCredits - $svcDebits;

        $grossProfit    = $sales - $cogs;
        $netProfit      = $grossProfit - $expenses + $otherIncome + $serviceIncome;

        $figures = [
            'sales'        => round($sales, 2),
            'cogs'         => round($cogs, 2),
            'expenses'     => round($expenses, 2),
            'otherIncome'  => round($otherIncome, 2),
            'serviceIncome' => round($serviceIncome, 2), 
            'grossProfit'  => round($grossProfit, 2),
            'netProfit'    => round($netProfit, 2),
        ];

        /* ---------- Per-ledger breakdown (with net) ---------- */
        $byLedgerRaw = (clone $base)
            ->selectRaw('
                al.account_ledger_name as ledger,
                al.ledger_type as ledger_type,
                SUM(CASE WHEN journal_entries.type="debit"  THEN journal_entries.amount ELSE 0 END) as debits,
                SUM(CASE WHEN journal_entries.type="credit" THEN journal_entries.amount ELSE 0 END) as credits
            ')
            ->groupBy('al.account_ledger_name', 'al.ledger_type')
            ->orderBy('al.account_ledger_name')
            ->get();

        $byLedger = $byLedgerRaw->map(function ($r) use ($incomeTypes, $expenseTypes) {
            $debits  = (float) $r->debits;
            $credits = (float) $r->credits;

            if (in_array($r->ledger_type, $incomeTypes, true)) {
                $side = 'income';
                $net  = $credits - $debits;     // income nets credit - debit
            } elseif (in_array($r->ledger_type, $expenseTypes, true)) {
                $side = 'expense';
                $net  = $debits - $credits;     // expenses/COGS net debit - credit
            } else {
                // non-P&L types (assets/liabilities) → show but net = 0 for P&L
                $side = 'neutral';
                $net  = 0.0;
            }

            return [
                'ledger'      => $r->ledger,
                'ledger_type' => $r->ledger_type,
                'debits'      => round($debits, 2),
                'credits'     => round($credits, 2),
                'side'        => $side,
                'net'         => round($net, 2),
            ];
        });

        /* ---------- Grouped by ledger_type (compat “grouped”) ---------- */
        $byTypeRaw = (clone $base)
            ->selectRaw('
                al.ledger_type as ledger_type,
                SUM(CASE WHEN journal_entries.type="debit"  THEN journal_entries.amount ELSE 0 END) as debits,
                SUM(CASE WHEN journal_entries.type="credit" THEN journal_entries.amount ELSE 0 END) as credits
            ')
            ->groupBy('al.ledger_type')
            ->orderBy('al.ledger_type')
            ->get();

        $grouped = $byTypeRaw->map(function ($r) use ($incomeTypes, $expenseTypes) {
            $debits  = (float) $r->debits;
            $credits = (float) $r->credits;

            if (in_array($r->ledger_type, $incomeTypes, true)) {
                $side  = 'income';
                $value = $credits - $debits;
            } elseif (in_array($r->ledger_type, $expenseTypes, true)) {
                $side  = 'expense';
                $value = $debits - $credits;
            } else {
                $side  = 'neutral';
                $value = 0.0;
            }

            return [
                'group' => $r->ledger_type,     // name = ledger_type
                'side'  => $side,               // 'income' | 'expense' | 'neutral'
                'value' => round($value, 2),
            ];
        })->filter(fn($row) => $row['value'] != 0.0)->values();

        /* ---------- company info ---------- */
        $co = company_info() ?: (object)[
            'company_name'   => '',
            'phone'          => '',
            'email'          => '',
            'address'        => '',
            'logo_url'       => '',
            'logo_thumb_url' => '',
        ];

        return [
            'from_date' => $from,
            'to_date'   => $to,

            'figures'  => $figures,
            'byLedger' => $byLedger,
            'grouped'  => $grouped, // grouped by ledger_type

            'company'  => [
                'company_name'   => $co->company_name,
                'phone'          => $co->phone,
                'email'          => $co->email,
                'address'        => $co->address,
                'logo_url'       => $co->logo_url,
                'logo_thumb_url' => $co->logo_thumb_url,
            ],
        ];
    }
}
