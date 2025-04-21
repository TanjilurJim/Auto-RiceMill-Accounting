<?php

namespace App\Http\Controllers;

use App\Models\CompanySetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Employee;
use App\Exports\StockSummaryExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Stock;
use App\Models\Item;

use App\Models\Godown;
use App\Models\Category;
use App\Models\PurchaseItem;
use App\Models\SaleItem;
use App\Models\User;

use App\Models\JournalEntry;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function employeeLedger(Request $request)
    {
        $employees = Employee::select('id', 'name')
            ->when(!auth()->user()->hasRole('admin'), function ($query) {
                $query->where('created_by', auth()->id());
            })
            ->get();

        if (!$request->employee_id || !$request->from_date || !$request->to_date) {
            return Inertia::render('reports/EmployeeLedgerFilter', [
                'employees' => $employees,
            ]);
        }

        $employee = Employee::with('ledger')->findOrFail($request->employee_id);
        $company = CompanySetting::where('created_by', auth()->id())->first();

        if (!$employee->ledger) {
            return back()->with('error', 'No ledger account found for this employee.');
        }

        $ledgerId = $employee->ledger->id;

        // Get ledger entries
        $from = $request->from_date;
        $to = $request->to_date;
        $entries = JournalEntry::with('journal')
            ->where('account_ledger_id', $ledgerId)
            ->whereHas('journal', function ($q) use ($from, $to) {
                $q->whereBetween('date', [$from, $to]);
            })
            ->get()
            ->sortBy(fn($entry) => $entry->journal->date)
            ->values();

        // Calculate opening balance
        $openingBalance = JournalEntry::where('account_ledger_id', $ledgerId)
            ->whereHas('journal', function ($q) use ($from) {
                $q->where('date', '<', $from);
            })
            ->sum(DB::raw("CASE WHEN type = 'credit' THEN amount ELSE -amount END"));

        return Inertia::render('reports/EmployeeLedger', [
            'company' => $company,
            'employee' => $employee,
            'user' => auth()->user(),
            'entries' => $entries->map(function ($entry) {
                return [
                    'id' => $entry->id,
                    'type' => $entry->type,
                    'amount' => $entry->amount,
                    'note' => $entry->note,
                    'journal' => [
                        'date' => $entry->journal->date,
                        'voucher_no' => $entry->journal->voucher_no,
                    ],
                ];
            }),
            'from' => $request->from_date,
            'to' => $request->to_date,
            'opening_balance' => $openingBalance,
            'user' => auth()->user(),
        ]);
    }

    public function stockSummary(Request $request)
    {
        $from = $request->input('from');
        $to = $request->input('to');

        // If filters are missing, show filter page
        $godowns = Godown::where('created_by', auth()->id())->select('id', 'name')->get();
        $categories = Category::where('created_by', auth()->id())->get(['id', 'name']); // ✅ FETCH CATEGORIES

        if (!$from || !$to) {
            return Inertia::render('reports/StockSummaryFilter', [
                'godowns' => $godowns,
                'categories' => $categories,
            ]);
        }

        $stocks = Stock::with(['item.unit', 'godown'])
            ->when($request->godown_id, fn($q) => $q->where('godown_id', $request->godown_id))
            ->get()
            ->map(function ($stock) {
                $lastPurchaseDate = PurchaseItem::where('product_id', $stock->item_id)
                    ->latest('created_at')->value('created_at');

                $lastSaleDate = SaleItem::where('product_id', $stock->item_id)
                    ->latest('created_at')->value('created_at');

                $totalPurchaseValue = PurchaseItem::where('product_id', $stock->item_id)->sum('subtotal');
                $totalSalesValue = SaleItem::where('product_id', $stock->item_id)->sum('subtotal');
                $totalSaleQty = SaleItem::where('product_id', $stock->item_id)->sum('qty');

                return [
                    'item_name'        => $stock->item->item_name,
                    'godown_name'      => $stock->godown->name,

                    'unit'             => $stock->item->unit->name, // include unit name
                    'qty'              => (float) $stock->qty,
                    'total_sale_qty' => $totalSaleQty, // ✅ ADD THIS
                    'last_purchase_at' => $lastPurchaseDate,
                    'last_sale_at'     => $lastSaleDate,
                    'total_purchase'   => (float) $totalPurchaseValue,
                    'total_sale'       => (float) $totalSalesValue,
                ];
            });



        $company = CompanySetting::where('created_by', auth()->id())->first();

        return Inertia::render('reports/StockSummary', [
            'stocks' => $stocks,
            'company' => $company,
            'godowns' => $godowns,
            'categories' => $categories, // ✅ PASS HERE
            'filters' => [
                'from' => $from,
                'to' => $to,
                'godown_id' => $request->godown_id,
            ]
        ]);
    }
    public function stockSummaryPDF(Request $request)
    {
        $stocks = $this->getStockData($request);
        $company = CompanySetting::where('created_by', auth()->id())->first();

        $pdf = Pdf::loadView('pdf.stock-summary', [
            'stocks' => $stocks,
            'filters' => $request->only('from', 'to'),
            'company' => $company
        ]);

        return $pdf->download('stock-summary.pdf');
    }

    public function stockSummaryExcel(Request $request)
    {
        $stocks = $this->getStockData($request);
        $company = CompanySetting::where('created_by', auth()->id())->first();

        return Excel::download(
            new StockSummaryExport($stocks, $request->only('from', 'to'), $company),
            'stock-summary.xlsx'
        );
    }

    private function getStockData(Request $request)
    {
        return Stock::with(['item.unit', 'godown'])
            ->when($request->godown_id, fn($q) => $q->where('godown_id', $request->godown_id))
            ->get()
            ->map(function ($stock) {
                return [
                    'item_name' => $stock->item->item_name,
                    'godown_name' => $stock->godown->name,
                    'unit' => $stock->item->unit->name,
                    'qty' => (float) $stock->qty,
                    'total_purchase' => PurchaseItem::where('product_id', $stock->item_id)->sum('subtotal'),
                    'total_sale' => SaleItem::where('product_id', $stock->item_id)->sum('subtotal'),
                    'last_purchase_at' => PurchaseItem::where('product_id', $stock->item_id)->latest()->value('created_at'),
                    'last_sale_at' => SaleItem::where('product_id', $stock->item_id)->latest()->value('created_at'),
                ];
            });
    }

    public function categoryWiseStockSummary(Request $request)
    {
        $from = $request->input('from');
        $to = $request->input('to');
        $categoryId = $request->input('category_id');

        $query = Category::with(['items.stocks'])
            ->whereHas('items', fn($q) => $q->where('created_by', auth()->id()));

        if ($categoryId) {
            $query->where('id', $categoryId);
        }

        $categories = $query->get()->map(function ($category) {
            $totalQty = 0;
            $totalPurchase = 0;
            $totalSale = 0;
            $lastPurchase = null;
            $lastSale = null;
            $lastPurchaseQty = 0;
            $lastSaleQty = 0;
            $lastPurchaseUnit = '';
            $lastSaleUnit = '';

            foreach ($category->items as $item) {
                $totalQty += $item->stocks->sum('qty');
                $totalPurchase += PurchaseItem::where('product_id', $item->id)->sum('subtotal');
                $totalSale += SaleItem::where('product_id', $item->id)->sum('subtotal');

                // Last purchase
                $latestPurchase = PurchaseItem::where('product_id', $item->id)
                    ->latest('created_at')->first();
                if ($latestPurchase && (!$lastPurchase || $latestPurchase->created_at > $lastPurchase)) {
                    $lastPurchase = $latestPurchase->created_at;
                    $lastPurchaseQty = $latestPurchase->qty ?? 0;
                    $lastPurchaseUnit = optional($item->unit)->name ?? '';
                }

                // Last sale
                $latestSale = SaleItem::where('product_id', $item->id)
                    ->latest('created_at')->first();
                if ($latestSale && (!$lastSale || $latestSale->created_at > $lastSale)) {
                    $lastSale = $latestSale->created_at;
                    $lastSaleQty = $latestSale->qty ?? 0;
                    $lastSaleUnit = optional($item->unit)->name ?? '';
                }
            }

            return [
                'category_name'       => $category->name,
                'total_qty'           => $totalQty,
                'total_purchase'      => $totalPurchase,
                'total_sale'          => $totalSale,
                'last_purchase_at'    => $lastPurchase,
                'last_purchase_qty'   => $lastPurchaseQty,
                'last_purchase_unit'  => $lastPurchaseUnit,
                'last_sale_at'        => $lastSale,
                'last_sale_qty'       => $lastSaleQty,
                'last_sale_unit'      => $lastSaleUnit,
            ];
        });

        return Inertia::render('reports/CategoryWiseStockSummary', [
            'categories' => $categories,
            'filters' => [
                'from' => $from,
                'to' => $to,
                'category_id' => $categoryId,
            ],
            'company' => CompanySetting::where('created_by', auth()->id())->first(),
        ]);
    }
}
