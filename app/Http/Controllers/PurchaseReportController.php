<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\PurchaseReturn;
use App\Models\AccountLedger;
use App\Models\Item;
use App\Models\Category;
use App\Models\Unit;
use App\Models\AccountLedgerGroup;
use App\Models\AccountLedgerGroupUnder;
use Maatwebsite\Excel\Facades\Excel;   // ← add this

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

/* PDF & Excel helpers you already use */
use Barryvdh\DomPDF\Facade\Pdf;
use App\Exports\SimpleArrayExport;   // implements FromArray

class PurchaseReportController extends Controller
{
    /* =========================================================
     | 0️⃣  Helpers
     |=========================================================*/
    /** List of user-ids the current user is allowed to see. */
    private function allowedUserIds(): array
    {
        if (auth()->user()->hasRole('admin')) {
            return [];                 // admin → no restriction
        }

        $me   = auth()->id();
        $subs = \App\Models\User::where('created_by', $me)
            ->pluck('id')->all();  // direct sub-users

        return array_merge([$me], $subs);
    }

    /* =========================================================
     | 1️⃣  FILTER PAGE
     |=========================================================*/
    public function filter(string $tab = 'category')
    {
        /* ----------------------------------------------------------
          | Build the list of user-ids this person may see
          | --------------------------------------------------------*/
        if (auth()->user()->hasRole('admin')) {
            // admin → no restriction (null means “skip the whereIn later”)
            $visibleIds = null;
        } else {
            $me        = auth()->id();
            $childIds  = User::where('created_by', $me)->pluck('id')->all();
            $visibleIds = array_merge([$me], $childIds);   // [me + direct sub-users]
        }

        /* ----------------------------------------------------------
          | Drop-down data, each scoped with the SAME rule
          | --------------------------------------------------------*/
        $categories = Category::when(
            $visibleIds,
            fn($q, $ids) => $q->whereIn('created_by', $ids)
        )
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        $items = Item::when(
            $visibleIds,
            fn($q, $ids) => $q->whereIn('created_by', $ids)
        )
            ->select('id', 'item_name')
            ->orderBy('item_name')
            ->get();

        /* ---------- SUPPLIERS / LEDGERS (all groups) ---------- */
        $suppliers = AccountLedger::query()
            ->when($visibleIds, fn($q, $ids) => $q->whereIn('created_by', $ids))
            ->select('id', 'account_ledger_name as name')
            ->orderBy('account_ledger_name')
            ->get();


        /* ----------------------------------------------------------
          | Render the filter page
          | --------------------------------------------------------*/
        return Inertia::render('reports/PurchaseReportFilter', [
            'tab'        => $tab,
            'categories' => $categories,
            'items'      => $items,
            'suppliers'  => $suppliers,
        ]);
    }

    /* =========================================================
     | 2️⃣  INDEX  (main switchboard)
     |=========================================================*/
    public function index(Request $req, string $tab)
    {
        $filters = $this->validateFilters($req, $tab);

        $data = match ($tab) {
            'category' => $this->getCategoryData($filters),
            'item'     => $this->getItemData($filters),
            'party'    => $this->getPartyData($filters),
            'return'   => $this->getReturnData($filters),
            default    => $this->getAllData($filters),
        };

        $page = [
            'category' => 'reports/PurchaseCategoryReport',
            'item'     => 'reports/PurchaseItemReport',
            'party'    => 'reports/PurchasePartyReport',
            'return'   => 'reports/PurchaseReturnReport',
            'all'      => 'reports/PurchaseAllReport',
        ][$tab];

        return Inertia::render($page, [
            'tab'     => $tab,
            'entries' => $data,
            'filters' => $filters,
            'company' => company_info(),          // ⬅️ helper you already use
        ]);
    }

    /* =========================================================
     | 3️⃣  EXPORT  (pdf / excel)
     |=========================================================*/
    public function export(Request $req, string $tab)
    {
        $filters = $this->validateFilters($req, $tab);

        $rows = match ($tab) {
            'category' => $this->getCategoryData($filters),
            'item'     => $this->getItemData($filters),
            'party'    => $this->getPartyData($filters),
            'return'   => $this->getReturnData($filters),
            default    => $this->getAllData($filters),
        };

        /* Excel */
        if ($req->query('type') === 'xlsx') {

            /* column headings identical to the on-screen table */
            $head = match ($tab) {
                'category' => [
                    'Date',
                    'Vch No',
                    'Account Ledger',
                    'Item',
                    'Qty',
                    'Unit',
                    'Price (each)',
                    'Total (Tk)'
                ],
                'item'   => ['Item', 'Qty', 'Unit', 'Net Amount'],
                /* ---------------⬇︎ changed ⬇︎--------------- */
                'party'  => [
                    'Date',
                    'Vch No',
                    'Supplier',
                    'Item',
                    'Qty',
                    'Unit',
                    'Net (Tk)',
                    'Paid (Tk)',
                    'Due (Tk)'
                ],
                'return' => ['Date', 'Vch No', 'Supplier', 'Item', 'Qty', 'Unit', 'Return (Tk)'],
                default  => ['Date', 'Vch No', 'Supplier', 'Qty', 'Net', 'Paid', 'Due'],
            };

            /* rows in exactly the same order as $head */
            $rowsForXlsx = collect($rows)->map(fn($r) => match ($tab) {
                'category' => [
                    $r->date,
                    $r->voucher_no,
                    $r->supplier,
                    $r->item,
                    $r->total_qty,
                    $r->unit_name,
                    $r->price_each,
                    $r->net_amount,
                ],
                'item' => [
                    $r->item_name,
                    $r->total_qty,
                    $r->unit_name,
                    $r->net_amount,
                ],
                /* ---------------⬇︎ changed ⬇︎--------------- */
                'party' => [
                    $r->date,
                    $r->voucher_no,
                    $r->supplier,
                    $r->item,
                    $r->qty,
                    $r->unit_name,
                    $r->net_amount,
                    $r->amount_paid,
                    $r->due,
                ],
                'return' => [
                    $r->date,
                    $r->voucher_no,
                    $r->supplier,
                    $r->item,          // same GROUP_CONCAT string as the React table
                    $r->qty,           // voucher-total quantity already aggregated
                    $r->unit_name,     // blank when mixed units
                    $r->net_return,
                ],
                default => [
                    $r->date,
                    $r->voucher_no,
                    $r->supplier,
                    $r->qty,
                    $r->net_amount,
                    $r->amount_paid,
                    $r->due,
                ],
            });

            return Excel::download(
                new SimpleArrayExport([$head, ...$rowsForXlsx]),
                "purchase-{$tab}-report.xlsx"
            );
        }

        /* PDF */
        $pdf = Pdf::loadView("pdf.purchase-{$tab}-report", [
            'entries' => $rows,
            'filters' => $filters,
            'company' => company_info(),

        ]);

        return $pdf->download("purchase-{$tab}-report.pdf");
    }

    /* =========================================================
     | 4️⃣  Validation helper
     |=========================================================*/
    private function validateFilters(Request $r, string $tab): array
    {
        $rules = [
            'year'      => 'nullable|integer|min:2000|max:2100',
        ];

        if (!$r->filled('year')) {
            // Only require dates if no year is selected
            $rules['from_date'] = 'required|date';
            $rules['to_date']   = 'required|date';
        }

        if ($tab === 'category') $rules['category_id'] = 'nullable|exists:categories,id';
        if ($tab === 'item')     $rules['item_id']     = 'nullable|exists:items,id';
        if ($tab === 'party')    $rules['supplier_id'] = 'nullable|exists:account_ledgers,id';

        return $r->validate($rules);
    }

    /* =========================================================
     | 5️⃣  DATA BUILDERS
     |=========================================================*/

    /* 5-A  Category-wise (voucher rows) */
    /* 5-A  Category-wise (voucher rows) */
    private function getCategoryData(array $f): Collection
    {
        return DB::table('purchase_items')
            ->join('purchases',       'purchases.id',       '=', 'purchase_items.purchase_id')
            ->join('items',           'items.id',           '=', 'purchase_items.product_id')
            ->join('units',           'units.id',           '=', 'items.unit_id')
            ->join('account_ledgers', 'account_ledgers.id', '=', 'purchases.account_ledger_id')
            ->join('categories',      'categories.id',      '=', 'items.category_id')
            ->selectRaw('
            purchases.date,
            purchases.voucher_no,
            account_ledgers.account_ledger_name  AS supplier,
            items.item_name                      AS item,
            units.name                           AS unit_name,
            purchase_items.qty                   AS total_qty,
            purchase_items.price                 AS price_each,
            purchase_items.subtotal              AS net_amount
        ')
            ->whereBetween('purchases.date', [$f['from_date'], $f['to_date']])

            /* 🔑 apply user-scope here */
            ->when(
                $this->allowedUserIds(),             // returns [] for admin, skips clause
                fn($q, $ids) => $q->whereIn('purchases.created_by', $ids)
            )

            /* optional category filter */
            ->when(
                $f['category_id'] ?? null,
                fn($q, $id) => $q->where('categories.id', $id)
            )

            ->orderBy('purchases.date')
            ->orderBy('purchases.voucher_no')
            ->get();
    }


    /* 5-B  Item-wise (aggregated) */
    private function getItemData(array $f): Collection
    {
        return DB::table('purchase_items')
            ->join('purchases', 'purchases.id', '=', 'purchase_items.purchase_id')
            ->join('items',     'items.id',     '=', 'purchase_items.product_id')
            ->join('units',     'units.id',     '=', 'items.unit_id')     // ★ NEW
            ->selectRaw('items.id,
                     items.item_name,
                     units.name                 AS unit_name,         -- ★ NEW
                     SUM(purchase_items.qty)    AS total_qty,
                     SUM(purchase_items.subtotal) AS net_amount')
            ->whereBetween('purchases.date', [$f['from_date'], $f['to_date']])
            ->when(
                $this->allowedUserIds(),
                fn($q, $ids) => $q->whereIn('purchases.created_by', $ids)
            )
            ->when(
                $f['item_id'] ?? null,
                fn($q, $id)  => $q->where('items.id', $id)
            )
            ->groupBy('items.id', 'items.item_name', 'units.name')        // ★ NEW
            ->orderBy('items.item_name')
            ->get();
    }


    /* 5-C ░ Party-wise – one row per voucher, items merged */
    private function getPartyData(array $f): Collection
    {
        /* ──────────────────────────────
     |  sub-query: qty per (voucher,item)
     |────────────────────────────── */
        $itemsSub = DB::table('purchase_items')
            ->join('items',  'items.id',  '=', 'purchase_items.product_id')
            ->join('units',  'units.id',  '=', 'items.unit_id')
            ->selectRaw('
            purchase_items.purchase_id,
            items.item_name,
            units.name            AS unit_name,
            SUM(purchase_items.qty) AS qty          /* already aggregated */
        ')
            ->groupBy(
                'purchase_items.purchase_id',
                'items.item_name',
                'units.name'
            );

        /* list of user-ids this person may see */
        $allowed = $this->allowedUserIds();   // [] for admin → no whereIn()

        /* ──────────────────────────────
     |  main query: one row / voucher
     |────────────────────────────── */
        return DB::table('purchases')
            ->joinSub($itemsSub,   'li',  'li.purchase_id',     '=', 'purchases.id')
            ->join('account_ledgers', 'account_ledgers.id', '=', 'purchases.account_ledger_id')

            ->selectRaw('
            purchases.id,
            purchases.date,
            purchases.voucher_no,
            account_ledgers.account_ledger_name                           AS supplier,

            /* Amon – 12.00 Kg, Shonali – 2.00 Bag … */
            GROUP_CONCAT(
                CONCAT(li.item_name, " – ", FORMAT(li.qty,2), " ", li.unit_name)
                ORDER BY li.item_name
                SEPARATOR ", "
            )                                                             AS item,

            /* voucher-total qty (li.qty is already summed per item) */
            SUM(li.qty)                                                   AS qty,

            /* if all units identical → show it, else blank */
            CASE WHEN COUNT(DISTINCT li.unit_name)=1
                 THEN MIN(li.unit_name)
                 ELSE "" END                                              AS unit_name,

            purchases.grand_total                                         AS net_amount,
            purchases.amount_paid                                         AS amount_paid,
            (purchases.grand_total - purchases.amount_paid)               AS due
        ')

            /* ───── filters ───────────────────────── */
            ->whereBetween('purchases.date', [$f['from_date'], $f['to_date']])
            ->when($allowed, fn($q, $ids) => $q->whereIn('purchases.created_by', $ids))
            ->when(
                $f['supplier_id'] ?? null,
                fn($q, $id)  => $q->where('account_ledgers.id', $id)
            )

            /* group BY voucher (everything else is scalar or aggregated) */
            ->groupBy(
                'purchases.id',
                'purchases.date',
                'purchases.voucher_no',
                'account_ledgers.account_ledger_name',
                'purchases.grand_total',
                'purchases.amount_paid'
            )
            ->orderBy('purchases.date')
            ->orderBy('purchases.voucher_no')
            ->get();
    }




    /* 5-D  Purchase-returns list */
    /* -----------------------------------------------------------------
 | 5-D  Purchase-returns list   (ONLY change is inside selectRaw)
 |-----------------------------------------------------------------*/
    /* 5-D  Purchase-returns list
|───────────────────────────────────────────────────────────────────*/
    private function getReturnData(array $f): Collection
    {
        /* ── 1. line-items bucket, now routed through purchase_returns ── */
        $lineItems = DB::table('purchase_return_items as pri')
            ->join('purchase_returns as pr', 'pr.id', '=', 'pri.purchase_return_id')   // ✨ gets voucher_no
            ->join('items  as i', 'i.id', '=', 'pri.product_id')
            ->join('units  as u', 'u.id', '=', 'i.unit_id')
            ->selectRaw('
            pr.return_voucher_no,
            i.item_name,
            u.name              AS unit_name,
            SUM(pri.qty)        AS qty
        ')
            ->groupBy('pr.return_voucher_no', 'i.item_name', 'u.name');

        /* ── 2. main query ────────────────────────────────────────────── */
        return DB::table('purchase_returns as pr')
            ->joinSub(
                $lineItems,
                'li',
                fn($j) =>
                $j->on('li.return_voucher_no', '=', 'pr.return_voucher_no')
            )
            ->join('account_ledgers as al', 'al.id', '=', 'pr.account_ledger_id')
            ->selectRaw('
            pr.date,
            pr.return_voucher_no                 AS voucher_no,
            al.account_ledger_name               AS supplier,

            /* Shonali – 2.00 Bag, Amon – 10.00 Kg … */
            GROUP_CONCAT(
                CONCAT(li.item_name," – ",FORMAT(li.qty,2)," ",li.unit_name)
                ORDER BY li.item_name SEPARATOR ", "
            )                                     AS item,

            /* voucher-total quantity */
            SUM(li.qty)                           AS qty,

            /* show unit only if all lines share the same one */
            CASE WHEN COUNT(DISTINCT li.unit_name)=1
                 THEN MIN(li.unit_name) ELSE "" END  AS unit_name,

            pr.total_qty,
            pr.grand_total                        AS net_return
        ')
            ->whereBetween('pr.date', [$f['from_date'], $f['to_date']])
            ->when(
                $this->allowedUserIds(),
                fn($q, $ids) => $q->whereIn('pr.created_by', $ids)
            )
            ->groupBy(
                'pr.id',
                'pr.date',
                'pr.return_voucher_no',
                'al.account_ledger_name',
                'pr.total_qty',
                'pr.grand_total'
            )
            ->orderBy('pr.date')
            ->orderBy('pr.return_voucher_no')
            ->get();
    }




    /* 5-E  All-purchases list */
    private function getAllData(array $f): Collection
    {
        $query = DB::table('purchases')
            ->join('account_ledgers', 'account_ledgers.id', '=', 'purchases.account_ledger_id')
            ->when(
                $this->allowedUserIds(),
                fn($q, $ids) => $q->whereIn('purchases.created_by', $ids)
            );

            if (!empty($f['year'])) {
                return DB::table('purchases')
                    ->selectRaw('
                        MONTH(date) as month,
                        SUM(grand_total) as amount
                    ')
                    ->whereYear('date', $f['year'])
                    ->when(
                        $this->allowedUserIds(),
                        fn($q, $ids) => $q->whereIn('created_by', $ids)
                    )
                    ->groupBy(DB::raw('MONTH(date)'))
                    ->orderBy('month')
                    ->get();
            } else {
            // 🔎 Normal voucher-wise list if no year
            return $query
                ->select(
                    'purchases.date',
                    'purchases.voucher_no',
                    'account_ledgers.account_ledger_name as supplier',
                    'purchases.total_qty as qty',
                    'purchases.grand_total as net_amount',
                    'purchases.amount_paid'
                )
                ->whereBetween('purchases.date', [$f['from_date'], $f['to_date']])
                ->orderBy('purchases.date')
                ->get()
                ->map(function ($r) {
                    $r->due = ($r->net_amount ?? 0) - ($r->amount_paid ?? 0);
                    return $r;
                });
        }
    }
}
