<?php

namespace App\Http\Controllers;

use App\Models\JournalEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BalanceSheetController extends Controller
{
    /** Map each group_under → which side of the sheet */
    private array $sideMap = [
        // ASSETS
        'Fixed Assets'           => 'asset',
        'Current Assets'         => 'asset',
        'Misc. Expenses (Asset)' => 'asset',

        // LIABILITIES & EQUITY
        'Capital Account'        => 'liability',
        'Loans (Liability)'      => 'liability',
        'Current Liabilities'    => 'liability',
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

        $balances = collect($this->sideMap)->map(function ($side, $gName) use ($raw) {

            $rows   = $raw->get($gName, collect());
            $debit  = $rows->firstWhere('dr_cr','debit' )?->total ?? 0;
            $credit = $rows->firstWhere('dr_cr','credit')?->total ?? 0;

            // debit‑positive for assets, credit‑positive for liabilities
            $value = $side === 'asset' ? $debit - $credit : $credit - $debit;

            return ['group'=>$gName, 'side'=>$side, 'value'=>$value];
        })->filter(fn($row)=>$row['value'] != 0)->values();

        /* ───── Inventory figures ───── */
        $stock   = inventory_service()->closingStock($to);     // closing finished‑goods value
        $working = inventory_service()->workInProcess($to);    // WIP batches still open

        $assetTotal = $balances->where('side','asset')->sum('value') + $stock + $working;
        $liabTotal  = $balances->where('side','liability')->sum('value');
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
}
