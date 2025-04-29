<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Item;
use App\Models\AccountLedger;
use App\Models\Godown;
use App\Models\Salesman;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SaleReportController extends Controller
{
    /* =========================================================
     | 0️⃣  Helpers
     |=========================================================*/

    private function allowedUserIds(): array
    {
        if (auth()->user()->hasRole('admin')) {
            return [];  // no restriction
        }

        $me = auth()->id();
        $subs = \App\Models\User::where('created_by', $me)->pluck('id')->all();

        return array_merge([$me], $subs);
    }

    /* =========================================================
     | 1️⃣  FILTER PAGE
     |=========================================================*/
    public function filter(string $tab = 'category')
    {
        $allowedUserIds = $this->allowedUserIds(); // 👈 Correctly get allowed users

        $categories = Category::select('id', 'name')
            ->where(function ($q) use ($allowedUserIds) {
                if (!empty($allowedUserIds)) {
                    $q->whereIn('created_by', $allowedUserIds);
                }
            })
            ->orderBy('name')
            ->get();

        $items = Item::select('id', 'item_name')
            ->where(function ($q) use ($allowedUserIds) {
                if (!empty($allowedUserIds)) {
                    $q->whereIn('created_by', $allowedUserIds);
                }
            })
            ->orderBy('item_name')
            ->get();

        $parties = AccountLedger::select('id', 'account_ledger_name as name')
            ->where(function ($q) use ($allowedUserIds) {
                if (!empty($allowedUserIds)) {
                    $q->whereIn('created_by', $allowedUserIds);
                }
            })
            ->orderBy('account_ledger_name')
            ->get();
        // ✅ No need to filter parties here unless you want very strict separation

        $godowns = Godown::select('id', 'name')
            ->where(function ($q) use ($allowedUserIds) {
                if (!empty($allowedUserIds)) {
                    $q->whereIn('created_by', $allowedUserIds);
                }
            })
            ->orderBy('name')
            ->get();

        $salesmen = Salesman::select('id', 'name')
            ->where(function ($q) use ($allowedUserIds) {
                if (!empty($allowedUserIds)) {
                    $q->whereIn('created_by', $allowedUserIds);
                }
            })
            ->orderBy('name')
            ->get();

        return Inertia::render('reports/SaleReportFilter', [
            'tab' => $tab,
            'categories' => $categories,
            'items' => $items,
            'parties' => $parties,
            'godowns' => $godowns,
            'salesmen' => $salesmen,
        ]);
    }


    /* =========================================================
     | 2️⃣  INDEX (Switchboard)
     |=========================================================*/
    public function index(Request $req, string $tab)
    {
        $filters = $this->validateFilters($req, $tab);

        $data = match ($tab) {
            'category' => $this->getCategoryData($filters),
            'item' => $this->getItemData($filters),
            'party' => $this->getPartyData($filters),
            'godown' => $this->getGodownData($filters),
            'salesman' => $this->getSalesmanData($filters),
            'all' => $this->getAllProfitLossData($filters),
            default => collect(),
        };

        $page = [
            'category' => 'reports/SaleCategoryReport',
            'item' => 'reports/SaleItemReport',
            'party' => 'reports/SalePartyReport',
            'godown' => 'reports/SaleGodownReport',
            'salesman' => 'reports/SaleSalesmanReport',
            'all' => 'reports/SaleAllProfitLossReport',
        ][$tab];

        return Inertia::render($page, [
            'tab' => $tab,
            'entries' => $data,
            'filters' => $filters,
            'company' => company_info(), // your helper function
        ]);
    }

    /* =========================================================
     | 3️⃣  EXPORT (future optional)
     |=========================================================*/
    // Similar to purchase export if you want later!

    /* =========================================================
     | 4️⃣  Validation Helper
     |=========================================================*/
    private function validateFilters(Request $r, string $tab): array
    {
        $rules = [
            'from_date' => 'required_without:year|date',
            'to_date' => 'required_without:year|date',
            'year' => 'nullable|digits:4',
        ];

        if ($tab === 'category') $rules['category_id'] = 'nullable|exists:categories,id';
        if ($tab === 'item') $rules['item_id'] = 'nullable|exists:items,id';
        if ($tab === 'party') $rules['party_id'] = 'nullable|exists:account_ledgers,id';
        if ($tab === 'godown') $rules['godown_id'] = 'nullable|exists:godowns,id';
        if ($tab === 'salesman') $rules['salesman_id'] = 'nullable|exists:salesmen,id';

        return $r->validate($rules);
    }

    /* =========================================================
     | 5️⃣  Data Builders
     |=========================================================*/

    private function getCategoryData(array $f): Collection
    {
        $allowedUserIds = $this->allowedUserIds();

        // If year filter given → Month-wise summary
        if (!empty($f['year'])) {
            return DB::table('sales')
                ->join('sale_items', 'sale_items.sale_id', '=', 'sales.id')
                ->join('items', 'items.id', '=', 'sale_items.product_id')
                ->join('categories', 'categories.id', '=', 'items.category_id')
                ->selectRaw('
                     MONTH(sales.date) as month,
                     SUM(sale_items.subtotal) as amount
                 ')
                ->whereYear('sales.date', $f['year'])
                ->when($allowedUserIds, fn($q, $ids) => $q->whereIn('sales.created_by', $ids))
                ->groupBy(DB::raw('MONTH(sales.date)'))
                ->orderBy('month')
                ->get();
        }

        // Else → Normal full details
        return DB::table('sales')
            ->join('sale_items', 'sale_items.sale_id', '=', 'sales.id')
            ->join('items', 'items.id', '=', 'sale_items.product_id')
            ->join('categories', 'categories.id', '=', 'items.category_id')
            ->join('account_ledgers', 'account_ledgers.id', '=', 'sales.account_ledger_id')
            ->join('units', 'units.id', '=', 'items.unit_id')
            ->selectRaw('
                 sales.date,
                 sales.voucher_no,
                 account_ledgers.account_ledger_name as party,
                 categories.name as category_name,
                 items.item_name,
                 units.name as unit_name,
                 sale_items.qty,
                 sale_items.main_price as rate,
                 sale_items.subtotal as amount
             ')
            ->whereBetween('sales.date', [$f['from_date'], $f['to_date']])
            ->when($allowedUserIds, fn($q, $ids) => $q->whereIn('sales.created_by', $ids))
            ->orderBy('sales.date')
            ->orderBy('sales.voucher_no')
            ->get();
    }



    private function getItemData(array $f): Collection
    {
        $allowedUserIds = $this->allowedUserIds();

        // If year selected → Month-wise summary
        if (!empty($f['year'])) {
            return DB::table('sales')
                ->join('sale_items', 'sale_items.sale_id', '=', 'sales.id')
                ->join('items', 'items.id', '=', 'sale_items.product_id')
                ->selectRaw('
                MONTH(sales.date) as month,
                SUM(sale_items.subtotal) as amount
            ')
                ->whereYear('sales.date', $f['year'])
                ->when($allowedUserIds, fn($q, $ids) => $q->whereIn('sales.created_by', $ids))
                ->groupBy(DB::raw('MONTH(sales.date)'))
                ->orderBy('month')
                ->get();
        }

        // Else → Normal detailed rows
        return DB::table('sales')
            ->join('sale_items', 'sale_items.sale_id', '=', 'sales.id')
            ->join('items', 'items.id', '=', 'sale_items.product_id')
            ->join('account_ledgers', 'account_ledgers.id', '=', 'sales.account_ledger_id')
            ->join('units', 'units.id', '=', 'items.unit_id')
            ->selectRaw('
            sales.date,
            sales.voucher_no,
            account_ledgers.account_ledger_name as party,
            items.item_name,
            units.name as unit_name,
            sale_items.qty,
            sale_items.main_price as rate,
            sale_items.subtotal as amount
        ')
            ->whereBetween('sales.date', [$f['from_date'], $f['to_date']])
            ->when($f['item_id'] ?? null, fn($q, $id) => $q->where('items.id', $id))
            ->when($allowedUserIds, fn($q, $ids) => $q->whereIn('sales.created_by', $ids))
            ->orderBy('sales.date')
            ->orderBy('sales.voucher_no')
            ->get();
    }



    private function getPartyData(array $f): Collection
    {
        return DB::table('sales')
            ->join('account_ledgers', 'account_ledgers.id', '=', 'sales.account_ledger_id')
            ->selectRaw('
            account_ledgers.account_ledger_name AS party_name,
            SUM(sales.grand_total) AS total_amount
        ')
            ->where(function ($q) use ($f) {
                if ($f['year']) {
                    $q->whereYear('sales.date', $f['year']);
                } else {
                    $q->whereBetween('sales.date', [$f['from_date'], $f['to_date']]);
                }
            })
            ->when($f['party_id'] ?? null, fn($q, $id) => $q->where('account_ledgers.id', $id))
            ->when($this->allowedUserIds(), fn($q, $ids) => $q->whereIn('sales.created_by', $ids))
            ->groupBy('account_ledgers.account_ledger_name')
            ->orderBy('account_ledgers.account_ledger_name')
            ->get();
    }


    private function getGodownData(array $f): Collection
    {
        return DB::table('sales')
            ->join('godowns', 'godowns.id', '=', 'sales.godown_id')
            ->selectRaw('
            godowns.name AS godown_name,
            SUM(sales.grand_total) AS total_amount
        ')
            ->where(function ($q) use ($f) {
                if ($f['year']) {
                    $q->whereYear('sales.date', $f['year']);
                } else {
                    $q->whereBetween('sales.date', [$f['from_date'], $f['to_date']]);
                }
            })
            ->when($f['godown_id'] ?? null, fn($q, $id) => $q->where('godowns.id', $id))
            ->when($this->allowedUserIds(), fn($q, $ids) => $q->whereIn('sales.created_by', $ids))
            ->groupBy('godowns.name')
            ->orderBy('godowns.name')
            ->get();
    }


    private function getSalesmanData(array $f): Collection
    {
        return DB::table('sales')
            ->join('salesmen', 'salesmen.id', '=', 'sales.salesman_id')
            ->selectRaw('
            salesmen.name AS salesman_name,
            SUM(sales.grand_total) AS total_amount
        ')
            ->where(function ($q) use ($f) {
                if ($f['year']) {
                    $q->whereYear('sales.date', $f['year']);
                } else {
                    $q->whereBetween('sales.date', [$f['from_date'], $f['to_date']]);
                }
            })
            ->when($f['salesman_id'] ?? null, fn($q, $id) => $q->where('salesmen.id', $id))
            ->when($this->allowedUserIds(), fn($q, $ids) => $q->whereIn('sales.created_by', $ids))
            ->groupBy('salesmen.name')
            ->orderBy('salesmen.name')
            ->get();
    }


    private function getAllProfitLossData(array $f): Collection
    {
        $latestPurchases = DB::table('purchase_items')
            ->select('product_id', DB::raw('MAX(id) as latest_id'))
            ->groupBy('product_id');

        return DB::table('sale_items')
            ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
            ->join('items', 'items.id', '=', 'sale_items.product_id')
            ->leftJoinSub($latestPurchases, 'lp', 'lp.product_id', '=', 'sale_items.product_id')
            ->leftJoin('purchase_items', 'purchase_items.id', '=', 'lp.latest_id')
            ->selectRaw('
            items.item_name,
            sale_items.qty,
            sale_items.main_price AS sale_price,
            COALESCE(purchase_items.price, 0) AS purchase_price,
            (sale_items.main_price - COALESCE(purchase_items.price,0)) * sale_items.qty AS profit
        ')
            ->where(function ($q) use ($f) {
                if ($f['year']) {
                    $q->whereYear('sales.date', $f['year']);
                } else {
                    $q->whereBetween('sales.date', [$f['from_date'], $f['to_date']]);
                }
            })
            ->when($this->allowedUserIds(), fn($q, $ids) => $q->whereIn('sales.created_by', $ids))
            ->orderBy('items.item_name')
            ->get();
    }

    public function export(Request $req, string $tab)
    {
        $filters = $this->validateFilters($req, $tab);

        $entries = match ($tab) {
            'category' => $this->getCategoryData($filters),
            'item' => $this->getItemData($filters),
            default => collect(),
        };

        $isYearSelected = $filters['year'] ?? null;

        if ($req->query('type') === 'xlsx') {
            $headings = match ($tab) {
                'category' => $isYearSelected
                    ? ['Month', 'Amount (Tk)']
                    : ['Date', 'Voucher No', 'Party', 'Category', 'Item', 'Qty', 'Unit', 'Rate', 'Amount'],

                'item' => $isYearSelected
                    ? ['Month', 'Amount (Tk)']
                    : ['Date', 'Voucher No', 'Party', 'Item', 'Qty', 'Unit', 'Rate', 'Amount'],

                default => [],
            };

            $rows = collect($entries)->map(function ($r) use ($tab, $isYearSelected) {
                if ($tab === 'category') {
                    return $isYearSelected
                        ? [date('F', mktime(0, 0, 0, $r->month ?? 1, 1)), number_format($r->amount ?? 0, 2)]
                        : [
                            $r->date,
                            $r->voucher_no,
                            $r->party,
                            $r->category_name,
                            $r->item_name,
                            number_format($r->qty ?? 0, 2),
                            $r->unit_name,
                            number_format($r->rate ?? 0, 2),
                            number_format($r->amount ?? 0, 2),
                        ];
                }

                if ($tab === 'item') {
                    return $isYearSelected
                        ? [date('F', mktime(0, 0, 0, $r->month ?? 1, 1)), number_format($r->amount ?? 0, 2)]
                        : [
                            $r->date,
                            $r->voucher_no,
                            $r->party,
                            $r->item_name,
                            number_format($r->qty ?? 0, 2),
                            $r->unit_name,
                            number_format($r->rate ?? 0, 2),
                            number_format($r->amount ?? 0, 2),
                        ];
                }

                return [];
            });

            return \Maatwebsite\Excel\Facades\Excel::download(
                new \App\Exports\SimpleArrayExport([$headings, ...$rows]),
                $tab . '-sale-report.xlsx'
            );
        }

        // ─── Export to PDF ───
        $view = match ($tab) {
            'category' => 'pdf.sale-category-report',
            'item' => 'pdf.sale-item-report',
            default => abort(404),
        };

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView($view, [
            'entries' => $entries,
            'filters' => $filters,
            'company' => company_info(),
        ]);

        return $pdf->download($tab . '-sale-report.pdf');
    }
}
