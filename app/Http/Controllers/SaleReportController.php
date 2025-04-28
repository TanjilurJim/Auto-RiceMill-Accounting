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
        $categories = Category::select('id', 'name')->orderBy('name')->get();
        $items = Item::select('id', 'item_name')->orderBy('item_name')->get();
        $parties = AccountLedger::select('id', 'account_ledger_name as name')->orderBy('account_ledger_name')->get();
        $godowns = Godown::select('id', 'name')->orderBy('name')->get();
        $salesmen = Salesman::select('id', 'name')->orderBy('name')->get();

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
        return collect(); // build later
    }

    private function getItemData(array $f): Collection
    {
        return collect(); // build later
    }

    private function getPartyData(array $f): Collection
    {
        return collect(); // build later
    }

    private function getGodownData(array $f): Collection
    {
        return collect(); // build later
    }

    private function getSalesmanData(array $f): Collection
    {
        return collect(); // build later
    }

    private function getAllProfitLossData(array $f): Collection
    {
        return collect(); // build later
    }
}
