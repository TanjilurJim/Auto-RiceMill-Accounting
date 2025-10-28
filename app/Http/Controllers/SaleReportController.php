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

    // private function allowedUserIds(): array
    // {
    //     if (auth()->user()->hasRole('admin')) {
    //         return [];  // no restriction
    //     }

    //     $me = auth()->id();
    //     $subs = \App\Models\User::where('created_by', $me)->pluck('id')->all();

    //     return array_merge([$me], $subs);
    // }

    private function allowedUserIds(): array
    {
        if (auth()->user()->hasRole('admin')) {
            return [];  // no restriction
        }
        // Use the global helper for multi-level user access
        return user_scope_ids();
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
            'party_detail' => $this->getPartyVoucherProfitData($filters),
            'godown' => $this->getGodownData($filters),
            'salesman' => $this->getSalesmanData($filters),
            'all' => $this->getAllProfitLossData($filters),
            'return' => $this->getSaleReturnData($filters), // ✅ newly added
            default => collect(),
        };

        $page = [
            'category' => 'reports/SaleCategoryReport',
            'item' => 'reports/SaleItemReport',
            'party' => 'reports/SalePartyReport',
            'party_detail' => 'reports/SalePartyVoucherReport',
            'godown' => 'reports/SaleGodownReport',
            'salesman' => 'reports/SaleSalesmanReport',
            'all' => 'reports/SaleAllProfitLossReport',
            'return' => 'reports/SaleReturnReport', // ✅ newly added
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
                ->join('lots', 'lots.id', '=', 'sale_items.lot_id')
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
            ->join('lots', 'lots.id', '=', 'sale_items.lot_id')

            ->selectRaw('
            sales.date,
            sales.voucher_no,
            account_ledgers.account_ledger_name as party,
            items.item_name,
            lots.lot_no,
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

    private function getPartyVoucherProfitData(array $f): \Illuminate\Support\Collection
{
    $ids = $this->allowedUserIds();

    // Voucher-level totals grouped by party + voucher
    return DB::table('sales as s')
        ->join('sale_items as si', 'si.sale_id', '=', 's.id')
        ->join('account_ledgers as a', 'a.id', '=', 's.account_ledger_id')
        ->join('items as i', 'i.id', '=', 'si.product_id')
        ->leftJoin('stocks as st', function ($j) {
            $j->on('st.item_id', '=', 'si.product_id')
              ->on('st.godown_id', '=', 's.godown_id')
              ->on('st.lot_id', '=', 'si.lot_id')
              ->on('st.created_by', '=', 's.created_by');
        })
        ->selectRaw('
            s.date,
            s.voucher_no,
            a.account_ledger_name as party_name,
            SUM(si.qty) as total_qty,
            SUM(si.main_price * si.qty) as total_sales,
            SUM(COALESCE(NULLIF(st.avg_cost,0), NULLIF(i.purchase_price,0), 0) * si.qty) as total_cost,
            SUM((si.main_price - COALESCE(NULLIF(st.avg_cost,0), NULLIF(i.purchase_price,0), 0)) * si.qty) as total_profit
        ')
        ->when(!empty($f['year']) || (!empty($f['from_date']) && !empty($f['to_date'])), function ($q) use ($f) {
            if (!empty($f['year'])) {
                $q->whereYear('s.date', $f['year']);
            } else {
                $q->whereBetween('s.date', [$f['from_date'], $f['to_date']]);
            }
        })
        ->when($f['party_id'] ?? null, fn($q, $id) => $q->where('a.id', $id))
        ->when($ids, fn($q, $ids) => $q->whereIn('s.created_by', $ids))
        ->groupBy('s.date', 's.voucher_no', 'a.account_ledger_name')
        ->orderBy('a.account_ledger_name')
        ->orderBy('s.date')
        ->orderBy('s.voucher_no')
        ->get();
}



    private function getPartyData(array $f): Collection
    {
        return DB::table('sales')
            ->join('sale_items', 'sale_items.sale_id', '=', 'sales.id') // ✅ join sale_items to access qty
            ->join('account_ledgers', 'account_ledgers.id', '=', 'sales.account_ledger_id')
            ->selectRaw('
            account_ledgers.account_ledger_name AS party_name,
            SUM(sale_items.qty) AS total_qty,
            SUM(sale_items.subtotal) AS total_amount
        ')
            ->where(function ($q) use ($f) {
                if (!empty($f['year'])) {
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
        $allowedUserIds = $this->allowedUserIds();

        // If year filter given → Month-wise summary
        if (!empty($f['year'])) {
            return DB::table('sales')
                ->join('sale_items', 'sale_items.sale_id', '=', 'sales.id')
                ->join('items', 'items.id', '=', 'sale_items.product_id')
                ->join('godowns', 'godowns.id', '=', 'sales.godown_id')
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

        // Detailed voucher-level breakdown
        return DB::table('sales')
            ->join('sale_items', 'sale_items.sale_id', '=', 'sales.id')
            ->join('items', 'items.id', '=', 'sale_items.product_id')
            ->join('units', 'units.id', '=', 'items.unit_id')
            ->join('lots',       'lots.id',            '=', 'sale_items.lot_id')     // 👈 NEW
            ->join('godowns', 'godowns.id', '=', 'sales.godown_id')
            ->join('account_ledgers', 'account_ledgers.id', '=', 'sales.account_ledger_id')
            ->selectRaw('
            sales.date,
            sales.voucher_no,
            godowns.name as godown_name,
            account_ledgers.account_ledger_name as party,
            items.item_name,
            lots.lot_no,  
            units.name as unit_name,
            sale_items.qty,
            sale_items.main_price as rate,
            sale_items.subtotal as amount
        ')
            ->whereBetween('sales.date', [$f['from_date'], $f['to_date']])
            ->when($f['godown_id'] ?? null, fn($q, $id) => $q->where('godowns.id', $id))
            ->when($allowedUserIds, fn($q, $ids) => $q->whereIn('sales.created_by', $ids))
            ->orderBy('sales.date')
            ->orderBy('sales.voucher_no')
            ->get();
    }





    private function getSalesmanData(array $f): Collection
    {
        $allowedUserIds = $this->allowedUserIds();

        // 📆 If year is selected → Month summary
        if (!empty($f['year'])) {
            return DB::table('sales')
                ->join('sale_items', 'sale_items.sale_id', '=', 'sales.id')
                ->join('salesmen', 'salesmen.id', '=', 'sales.salesman_id')
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

        // 🧾 Otherwise, show full detail
        return DB::table('sales')
            ->join('sale_items', 'sale_items.sale_id', '=', 'sales.id')
            ->join('salesmen', 'salesmen.id', '=', 'sales.salesman_id')
            ->join('items', 'items.id', '=', 'sale_items.product_id')
            ->join('account_ledgers', 'account_ledgers.id', '=', 'sales.account_ledger_id')
            ->join('units', 'units.id', '=', 'items.unit_id')
            ->selectRaw('
            sales.date,
            sales.voucher_no,
            salesmen.name AS salesman_name,
            account_ledgers.account_ledger_name AS party,
            items.item_name,
            units.name AS unit_name,
            sale_items.qty,
            sale_items.main_price AS rate,
            sale_items.subtotal AS amount
        ')
            ->whereBetween('sales.date', [$f['from_date'], $f['to_date']])
            ->when($f['salesman_id'] ?? null, fn($q, $id) => $q->where('sales.salesman_id', $id))
            ->when($allowedUserIds, fn($q, $ids) => $q->whereIn('sales.created_by', $ids))
            ->orderBy('sales.date')
            ->orderBy('sales.voucher_no')
            ->get();
    }


    private function getAllProfitLossData(array $f): \Illuminate\Support\Collection
    {
        $allowedUserIds = $this->allowedUserIds();

        // We will value COGS by the lot-level weighted-average cost kept in `stocks`.
        // That’s exactly what FinalizeSaleService used to post COGS, so reports align.

        if (!empty($f['year'])) {
            // ── Month summary: profit = Σ((sale_price - lot_avg_cost) * qty)
            return DB::table('sales as s')
                ->join('sale_items as si', 'si.sale_id', '=', 's.id')
                ->join('items as i', 'i.id', '=', 'si.product_id')
                // lot-level cost
                ->leftJoin('stocks as st', function ($j) {
                    $j->on('st.item_id', '=', 'si.product_id')
                        ->on('st.godown_id', '=', 's.godown_id')
                        ->on('st.lot_id', '=', 'si.lot_id')
                        ->on('st.created_by', '=', 's.created_by');
                })
                ->selectRaw('
                MONTH(s.date) as month,
                SUM( (si.main_price - COALESCE(st.avg_cost, i.purchase_price, 0)) * si.qty ) as profit
            ')
                ->whereYear('s.date', $f['year'])
                ->when($allowedUserIds, fn($q, $ids) => $q->whereIn('s.created_by', $ids))
                ->groupBy(DB::raw('MONTH(s.date)'))
                ->orderBy('month')
                ->get();
        }

        // ── Detailed rows
        return DB::table('sales as s')
            ->join('sale_items as si', 'si.sale_id', '=', 's.id')
            ->join('items as i', 'i.id', '=', 'si.product_id')
            ->join('units as u', 'u.id', '=', 'i.unit_id')
            // lot-level cost
            ->leftJoin('stocks as st', function ($j) {
                $j->on('st.item_id', '=', 'si.product_id')
                    ->on('st.godown_id', '=', 's.godown_id')
                    ->on('st.lot_id', '=', 'si.lot_id')
                    ->on('st.created_by', '=', 's.created_by'); // keep if you truly multi-tenant by created_by
            })
            ->selectRaw('
    s.date,
    s.voucher_no,
    i.item_name,
    si.qty,
    u.name as unit_name,
    si.main_price as sale_price,
    COALESCE(NULLIF(st.avg_cost, 0), NULLIF(i.purchase_price, 0), 0) as purchase_price,
    (si.main_price - COALESCE(NULLIF(st.avg_cost, 0), NULLIF(i.purchase_price, 0), 0)) * si.qty as profit
')
            ->whereBetween('s.date', [$f['from_date'], $f['to_date']])
            ->when($allowedUserIds, fn($q, $ids) => $q->whereIn('s.created_by', $ids))
            ->orderBy('s.date')
            ->orderBy('s.voucher_no')
            ->get();
    }



    public function export(Request $req, string $tab)
    {
        $filters = $this->validateFilters($req, $tab);

        $entries = match ($tab) {
            'category' => $this->getCategoryData($filters),
            'party'    => $this->getPartyData($filters),
            'godown'   => $this->getGodownData($filters),
            'salesman' => $this->getSalesmanData($filters),
            'all'      => $this->getAllProfitLossData($filters),
            'return' => $this->getSaleReturnData($filters),
            default    => collect(),
        };

        $isYearSelected = $filters['year'] ?? null;

        // ── Excel Export ──
        if ($req->query('type') === 'xlsx') {
            $headings = match ($tab) {
                'category' => $isYearSelected
                    ? ['Month', 'Amount (Tk)']
                    : ['Date', 'Voucher No', 'Party', 'Category', 'Item', 'Lot', 'Qty', 'Unit', 'Rate', 'Amount'],

                'party' => ['Party', 'Qty', 'Amount'],

                'godown' => ['Date', 'Voucher No', 'Party', 'Godown', 'Item', 'Qty', 'Unit', 'Rate', 'Amount'],

                'salesman' => ['Date', 'Voucher No', 'Salesman', 'Item', 'Qty', 'Unit', 'Rate', 'Amount'],

                'all' => $isYearSelected
                    ? ['Month', 'Profit (Tk)']
                    : ['Date', 'Voucher No', 'Item', 'Qty', 'Unit', 'Sale Price', 'Cost Price', 'Profit', 'Profit %'],

                'return' => ['Date', 'Voucher No', 'Party', 'Item', 'Qty', 'Unit', 'Rate', 'Amount'],
            };

            $rows = collect($entries)->map(function ($r) use ($tab, $isYearSelected) {
                return match ($tab) {
                    'category' => $isYearSelected
                        ? [
                            date('F', mktime(0, 0, 0, $r->month ?? 1, 1)),
                            number_format($r->amount ?? 0, 2),
                        ]
                        : [
                            $r->date,
                            $r->voucher_no,
                            $r->party,
                            $r->category_name,
                            $r->item_name,
                            $r->lot_no,
                            number_format($r->qty ?? 0, 2),
                            $r->unit_name,
                            number_format($r->rate ?? 0, 2),
                            number_format($r->amount ?? 0, 2),
                        ],

                    'party' => [
                        $r->party_name,
                        number_format($r->total_qty ?? 0, 2),
                        number_format($r->total_amount ?? 0, 2),
                    ],

                    'godown' => [
                        $r->date,
                        $r->voucher_no,
                        $r->party,
                        $r->godown_name,
                        $r->item_name,
                        number_format($r->qty ?? 0, 2),
                        $r->unit_name,
                        number_format($r->rate ?? 0, 2),
                        number_format($r->amount ?? 0, 2),
                    ],

                    'salesman' => [
                        $r->date,
                        $r->voucher_no,
                        $r->salesman_name,
                        $r->item_name,
                        number_format($r->qty ?? 0, 2),
                        $r->unit_name,
                        number_format($r->rate ?? 0, 2),
                        number_format($r->amount ?? 0, 2),
                    ],

                    'all' => $isYearSelected
                        ? [
                            date('F', mktime(0, 0, 0, $r->month ?? 1, 1)),
                            number_format($r->profit ?? 0, 2),
                        ]
                        : [
                            $r->date,
                            $r->voucher_no,
                            $r->item_name,
                            number_format($r->qty ?? 0, 2),
                            $r->unit_name,
                            number_format($r->sale_price ?? 0, 2),
                            number_format($r->purchase_price ?? 0, 2),
                            number_format($r->profit ?? 0, 2),
                            $r->sale_price > 0
                                ? number_format(($r->profit / $r->sale_price) * 100, 2) . '%'
                                : '0.00%',
                        ],

                    'return' => [ // 🆕
                        $r->return_date,
                        $r->voucher_no,
                        $r->party,
                        $r->item_name,
                        number_format($r->qty ?? 0, 2),
                        $r->unit_name,
                        number_format($r->rate ?? 0, 2),
                        number_format($r->amount ?? 0, 2),
                    ],
                };
            });


            // ➡️ Push Grand Total for specific reports
            if (in_array($tab, ['party', 'godown', 'salesman'])) {
                $rows->push([
                    '',
                    '',
                    '',
                    '',
                    'Grand Total',
                    number_format($entries->sum('qty'), 2),
                    '',
                    '',
                    number_format($entries->sum('amount'), 2),
                ]);
            }

            if ($tab === 'all' && !$isYearSelected) {
                $rows->push([
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    'Grand Total',
                    number_format($entries->sum('profit'), 2),
                ]);
            }

            return \Maatwebsite\Excel\Facades\Excel::download(
                new \App\Exports\SimpleArrayExport([$headings, ...$rows]),
                "sale-{$tab}-report.xlsx"
            );
        }

        // ── PDF Export ──
        $pdfView = match ($tab) {
            'category' => 'pdf.sale-category-report',
            'party' => 'pdf.sale-party-report',
            'godown' => 'pdf.sale-godown-report',
            'salesman' => 'pdf.sale-salesman-report',
            'all' => 'pdf.sale-all-profit-loss-report',
            'return' => 'pdf.sales-return-report',
            default => abort(404),
        };

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView($pdfView, [
            'entries' => $entries,
            'filters' => $filters,
            'company' => company_info(),
        ]);

        return $pdf->download("sale-{$tab}-report.pdf");
    }

    private function getSaleReturnData(array $f): Collection
    {
        $allowedUserIds = $this->allowedUserIds();

        return DB::table('sales_returns')
            ->join('sales_return_items', 'sales_return_items.sales_return_id', '=', 'sales_returns.id')
            ->join('items', 'items.id', '=', 'sales_return_items.product_id')
            ->join('account_ledgers', 'account_ledgers.id', '=', 'sales_returns.account_ledger_id')
            ->join('units', 'units.id', '=', 'items.unit_id')
            ->selectRaw('
            sales_returns.return_date,
            sales_returns.voucher_no,
            account_ledgers.account_ledger_name AS party,
            items.item_name,
            units.name AS unit_name,
            sales_return_items.qty AS qty,
            sales_return_items.main_price AS rate,
            (sales_return_items.qty * sales_return_items.main_price) AS amount
        ')
            ->whereBetween('sales_returns.return_date', [$f['from_date'], $f['to_date']])
            ->when($this->allowedUserIds(), fn($q, $ids) => $q->whereIn('sales_returns.created_by', $ids))
            ->orderBy('sales_returns.return_date')
            ->orderBy('sales_returns.voucher_no')
            ->get();
    }
}
