<?php

namespace App\Http\Controllers;

use App\Models\JournalEntry;
use App\Models\AccountLedger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PDF;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ProfitLossExport;

class ProfitLossController extends Controller
{
    /* ------------------------------------------------------------------
       Map each group_under “name” (or id) to Income / Expense buckets.
       Add or remove labels as your chart of accounts evolves.
    ------------------------------------------------------------------ */
    private array $groupMap = [
        // EXPENSE GROUPS
        'Direct Expenses'         => 'expense',
        'Indirect Expenses'       => 'expense',
        'Vehicles & Transportation' => 'expense',
        'Transportation'          => 'expense',
        'Financial Expenses'      => 'expense',
        'Misc. Expenses (Asset)'  => 'expense',
        'Selling & Distribution'  => 'expense',
        'Administrative Overhead' => 'expense',
    
        // INCOME GROUPS
        'Direct Income'           => 'income',
        'Indirect Income'         => 'income',
        'Non Operating Income'    => 'income',
        'Rent Voucher Income'     => 'income',
    
        // OPTIONAL / INTERPRETED (based on usage in your app)
        // 'Sundry Debtors'          => 'income',   // if used for customer income
        // 'Customer Summary'        => 'income',
        // 'Sundry Creditors'        => 'expense',  // if used for supplier expenses
        // 'Supplier Summary'        => 'expense',
    ];

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
            'figures'   => $data['figures'],
            'byLedger'  => $data['byLedger'],
            'grouped'   => $data['grouped'],        // <-- new array
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
        $ids = user_scope_ids();

        /* ---------- shared entry builder ---------- */
        $entries = JournalEntry::with(['ledger', 'journal'])
            ->whereHas('journal', fn ($q) => $q->whereBetween('date', [$from, $to]));

        // if (!auth()->user()->hasRole('admin')) {
        //     $entries->whereHas('journal', fn ($q) => $q->where('created_by', auth()->id()));
        // }

        if (!$user->hasRole('admin')) {
            $entries->whereHas('journal', fn ($q) => $q->whereIn('created_by', $ids)); 
        }

        /* ---------- top‑level figures ---------- */
        $sum = fn (string $type, string $drCr) => (clone $entries)
            ->where('type', $drCr)
            ->whereHas('ledger', fn ($q) => $q->where('ledger_type', $type))
            ->sum('amount');

        $figures = [
            'sales'       => (float) $sum('sales',   'credit'),
            'cogs'        => (float) $sum('cogs',    'debit'),
            'expenses'    => (float) $sum('expense', 'debit'),
            'otherIncome' => (float) $sum('income',  'credit'),
        ];
        $figures['grossProfit'] = $figures['sales'] - $figures['cogs'];
        $figures['netProfit']   = $figures['grossProfit'] - $figures['expenses'] + $figures['otherIncome'];

        /* ---------- per‑ledger breakdown ---------- */
        $byLedger = (clone $entries)
            ->selectRaw('account_ledger_id,
                         SUM(CASE WHEN type="debit"  THEN amount ELSE 0 END) as debits,
                         SUM(CASE WHEN type="credit" THEN amount ELSE 0 END) as credits')
            ->groupBy('account_ledger_id')
            ->get()
            ->map(fn ($row) => [
                'ledger'  => AccountLedger::find($row->account_ledger_id)->account_ledger_name ?? 'Unknown',
                'type'    => AccountLedger::find($row->account_ledger_id)->ledger_type,
                'debits'  => $row->debits,
                'credits' => $row->credits,
            ]);

        /* ---------- group_under breakdown ---------- */
        $groupSums = JournalEntry::join('account_ledgers', 'journal_entries.account_ledger_id', '=', 'account_ledgers.id')
            ->join('group_unders',  'account_ledgers.group_under_id', '=', 'group_unders.id')
            ->join('journals',      'journal_entries.journal_id',     '=', 'journals.id')
            ->whereBetween('journals.date', [$from, $to])
            // ->when(!auth()->user()->hasRole('admin'),
            //     fn ($q) => $q->where('journals.created_by', auth()->id()))

            ->when(!$user->hasRole('admin'),
                fn ($q) => $q->whereIn('journals.created_by', $ids))

            ->selectRaw('group_unders.name as group_name,
                         journal_entries.type as dr_cr,
                         SUM(journal_entries.amount) as total')
            ->groupBy('group_unders.name', 'journal_entries.type')
            ->get()
            ->groupBy('group_name');

        $grouped = collect($this->groupMap)->map(function ($side, $gName) use ($groupSums) {
            $raw    = $groupSums->get($gName, collect());
            $debit  = $raw->firstWhere('dr_cr', 'debit' )?->total ?? 0;
            $credit = $raw->firstWhere('dr_cr', 'credit')?->total ?? 0;
            $value  = $side === 'expense' ? ($debit - $credit) : ($credit - $debit);

            return [
                'group' => $gName,
                'side'  => $side,   // 'expense' | 'income'
                'value' => $value,
            ];
        })->filter(fn ($row) => $row['value'] != 0)->values();

        /* ---------- company info ---------- */
        $co = company_info();
        // dd($groupSums->keys());

        if (!$co) {
            $co = (object)[
                'company_name'   => '',
                'phone'          => '',
                'email'          => '',
                'address'        => '',
                'logo_url'       => '',
                'logo_thumb_url' => '',
            ];
        }

        return [
            'from_date' => $from,
            'to_date'   => $to,
            'figures'   => $figures,
            'byLedger'  => $byLedger,
            'grouped'   => $grouped,   // <-- new payload
            'company'   => [
                'company_name'   => $co->company_name ,
                'phone'          => $co->phone ,
                'email'          => $co->email ,
                'address'        => $co->address ,
                'logo_url'       => $co->logo_url ,
                'logo_thumb_url' => $co->logo_thumb_url ,
            ],
        ];
    }
}
