<?php

namespace App\Http\Controllers;

use App\Models\JournalEntry;
use App\Models\Journal;
use App\Models\AccountLedger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfitLossController extends Controller
{
    /** ─────────────── Filter page (select dates) */
    public function filter()
    {
        return Inertia::render('reports/ProfitLossFilter');
    }

    /** ─────────────── Main P&L report */
    public function index(Request $request)
    {
        $from = $request->query('from_date') ?: now()->startOfYear()->toDateString();
        $to   = $request->query('to_date')   ?: now()->endOfYear()->toDateString();

        $entries = JournalEntry::with(['ledger', 'journal']) // 👈 eager load both
            ->whereHas('journal', fn($q) => $q->whereBetween('date', [$from, $to]));

        if (! auth()->user()->hasRole('admin')) {
            $entries->whereHas('journal', fn($q) => $q->where('created_by', auth()->id()));
        }

        $sum = fn(string $type, string $drCr) => (clone $entries)
            ->where('type', $drCr)
            ->whereHas('ledger', fn($q) => $q->where('ledger_type', $type))
            ->sum('amount');

        $figures = [
            'sales'       => (float) $sum('sales',   'credit'),
            'cogs'        => (float) $sum('cogs',    'debit'),
            'expenses'    => (float) $sum('expense', 'debit'),
            'otherIncome' => (float) $sum('income',  'credit'),
        ];

        $figures['grossProfit'] = $figures['sales'] - $figures['cogs'];
        $figures['netProfit']   = $figures['grossProfit'] - $figures['expenses'] + $figures['otherIncome'];

        /* optional breakdown per ledger */
        $byLedger = (clone $entries)
            ->selectRaw('account_ledger_id,
                         SUM(CASE WHEN type="debit"  THEN amount ELSE 0 END) as debits,
                         SUM(CASE WHEN type="credit" THEN amount ELSE 0 END) as credits')
            ->groupBy('account_ledger_id')
            ->get()
            ->map(fn($row) => [
                'ledger'  => AccountLedger::find($row->account_ledger_id)->account_ledger_name ?? 'Unknown',
                'type'    => AccountLedger::find($row->account_ledger_id)->ledger_type,
                'debits'  => $row->debits,
                'credits' => $row->credits,
            ]);

        /* company data (for header) */
        $company = company_info();

        return Inertia::render('reports/ProfitLoss', [
            'from_date' => $from,
            'to_date'   => $to,
            'figures'   => $figures,
            'byLedger'  => $byLedger,
            'company'   => [
                'company_name'    => $company->company_name,
                'phone'           => $company->phone ?? null,
                'email'           => $company->email ?? null,
                'address'         => $company->address ?? null,
                'logo_url'        => $company->logo_url ?? null,
                'logo_thumb_url'  => $company->logo_thumb_url ?? null,
            ],
        ]);
    }
}
