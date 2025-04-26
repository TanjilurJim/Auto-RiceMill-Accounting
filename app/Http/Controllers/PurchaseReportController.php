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
                 $visibleIds, fn ($q,$ids) => $q->whereIn('created_by', $ids)
             )
             ->select('id','name')
             ->orderBy('name')
             ->get();
     
         $items = Item::when(
                 $visibleIds, fn ($q,$ids) => $q->whereIn('created_by', $ids)
             )
             ->select('id','item_name')
             ->orderBy('item_name')
             ->get();
     
         $suppliers = AccountLedger::whereHas('groupUnder',
                         fn ($q) => $q->where('name','Sundry Creditors'))
             ->when(
                 $visibleIds, fn ($q,$ids) => $q->whereIn('created_by', $ids)
             )
             ->select('id','account_ledger_name as name')
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
            return (new SimpleArrayExport($rows->toArray()))
                ->download("purchase-{$tab}-report.xlsx");
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
            'from_date' => 'required|date',
            'to_date'   => 'required|date',
        ];
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
            fn ($q, $ids) => $q->whereIn('purchases.created_by', $ids)
        )

        /* optional category filter */
        ->when(
            $f['category_id'] ?? null,
            fn ($q, $id) => $q->where('categories.id', $id)
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
            ->join('items', 'items.id', '=', 'purchase_items.product_id')
            ->selectRaw('items.id,
                         items.item_name,
                         SUM(purchase_items.qty)      as total_qty,
                         SUM(purchase_items.subtotal) as net_amount')
            ->whereBetween('purchases.date', [$f['from_date'], $f['to_date']])
            ->when(
                $this->allowedUserIds(),
                fn($q, $ids) => $q->whereIn('purchases.created_by', $ids)
            )
            ->when(
                $f['item_id'] ?? null,
                fn($q, $id) => $q->where('items.id', $id)
            )
            ->groupBy('items.id', 'items.item_name')
            ->orderBy('items.item_name')
            ->get();
    }

    /* 5-C  Party-wise (aggregated) */
    private function getPartyData(array $f): Collection
    {
        return DB::table('purchases')
            ->join('account_ledgers', 'account_ledgers.id', '=', 'purchases.account_ledger_id')
            ->selectRaw('account_ledgers.id,
                         account_ledgers.account_ledger_name as supplier,
                         SUM(purchases.total_qty)    as total_qty,
                         SUM(purchases.grand_total)  as net_amount,
                         SUM(purchases.amount_paid)  as amount_paid')
            ->whereBetween('purchases.date', [$f['from_date'], $f['to_date']])
            ->when(
                $this->allowedUserIds(),
                fn($q, $ids) => $q->whereIn('purchases.created_by', $ids)
            )
            ->when(
                $f['supplier_id'] ?? null,
                fn($q, $id) => $q->where('account_ledgers.id', $id)
            )
            ->groupBy('account_ledgers.id', 'account_ledgers.account_ledger_name')
            ->orderBy('account_ledgers.account_ledger_name')
            ->get()
            ->map(function ($r) {
                $r->due = $r->net_amount - $r->amount_paid;
                return $r;
            });
    }

    /* 5-D  Purchase-returns list */
    private function getReturnData(array $f): Collection
    {
        return DB::table('purchase_returns')
            ->join('account_ledgers', 'account_ledgers.id', '=', 'purchase_returns.supplier_id')
            ->select(
                'purchase_returns.date',
                'purchase_returns.voucher_no',
                'account_ledgers.account_ledger_name as supplier',
                'purchase_returns.total_qty',
                'purchase_returns.grand_total as net_return'
            )
            ->whereBetween('purchase_returns.date', [$f['from_date'], $f['to_date']])
            ->when(
                $this->allowedUserIds(),
                fn($q, $ids) => $q->whereIn('purchase_returns.created_by', $ids)
            )
            ->orderBy('purchase_returns.date')
            ->get();
    }

    /* 5-E  All-purchases list */
    private function getAllData(array $f): Collection
    {
        return DB::table('purchases')
            ->join('account_ledgers', 'account_ledgers.id', '=', 'purchases.account_ledger_id')
            ->select(
                'purchases.date',
                'purchases.voucher_no',
                'account_ledgers.account_ledger_name as supplier',
                'purchases.total_qty',
                'purchases.grand_total as net_amount',
                'purchases.amount_paid'
            )
            ->whereBetween('purchases.date', [$f['from_date'], $f['to_date']])
            ->when(
                $this->allowedUserIds(),
                fn($q, $ids) => $q->whereIn('purchases.created_by', $ids)
            )
            ->orderBy('purchases.date')
            ->get()
            ->map(function ($r) {
                $r->due = $r->net_amount - $r->amount_paid;
                return $r;
            });
    }
}
