<?php

namespace App\Http\Controllers;

use App\Models\CompanySetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Employee;
use App\Exports\AccountBookExport;
use App\Exports\CategoryWiseStockSummaryExport;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromArray;
use App\Exports\StockSummaryExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Stock;
use App\Models\Item;

use function company_info;   // helper
use function numberToWords;
use function user_scope_ids; // helper
use function godown_scope_ids;

use App\Exports\ArrayExport;
use App\Models\Godown;
use App\Models\Category;
use App\Models\PurchaseItem;
use App\Models\SaleItem;
use App\Models\User;
use App\Models\AccountLedger;

use App\Models\JournalEntry;
use Inertia\Inertia;

class ReportController extends Controller
{
    // Employee Ledger Report

    // public function employeeLedger(Request $request)
    // {
    //     $employees = Employee::select('id', 'name')
    //         ->when(!auth()->user()->hasRole('admin'), function ($query) {
    //             $query->where('created_by', auth()->id());
    //         })
    //         ->get();

    //     if (!$request->employee_id || !$request->from_date || !$request->to_date) {
    //         return Inertia::render('reports/EmployeeLedgerFilter', [
    //             'employees' => $employees,
    //         ]);
    //     }

    //     $employee = Employee::with('ledger')->findOrFail($request->employee_id);
    //     $company = CompanySetting::where('created_by', auth()->id())->first();

    //     if (!$employee->ledger) {
    //         return back()->with('error', 'No ledger account found for this employee.');
    //     }

    //     $ledgerId = $employee->ledger->id;

    //     // Get ledger entries
    //     $from = $request->from_date;
    //     $to = $request->to_date;
    //     $entries = JournalEntry::with('journal')
    //         ->where('account_ledger_id', $ledgerId)
    //         ->whereHas('journal', function ($q) use ($from, $to) {
    //             $q->whereBetween('date', [$from, $to]);
    //         })
    //         ->get()
    //         ->sortBy(fn($entry) => $entry->journal->date)
    //         ->values();

    //     // Calculate opening balance
    //     $openingBalance = JournalEntry::where('account_ledger_id', $ledgerId)
    //         ->whereHas('journal', function ($q) use ($from) {
    //             $q->where('date', '<', $from);
    //         })
    //         ->sum(DB::raw("CASE WHEN type = 'credit' THEN amount ELSE -amount END"));

    //     return Inertia::render('reports/EmployeeLedger', [
    //         'company' => $company,
    //         'employee' => $employee,
    //         'user' => auth()->user(),
    //         'entries' => $entries->map(function ($entry) {
    //             return [
    //                 'id' => $entry->id,
    //                 'type' => $entry->type,
    //                 'amount' => $entry->amount,
    //                 'note' => $entry->note,
    //                 'journal' => [
    //                     'date' => $entry->journal->date,
    //                     'voucher_no' => $entry->journal->voucher_no,
    //                 ],
    //             ];
    //         }),
    //         'from' => $request->from_date,
    //         'to' => $request->to_date,
    //         'opening_balance' => $openingBalance,
    //         'user' => auth()->user(),
    //     ]);
    // }

    public function employeeLedger(Request $request)
    {
        $user = auth()->user();
        $employeeQuery = Employee::select('id', 'name');

        if (!$user->hasRole('admin')) {
            $ids = user_scope_ids();
            // Exclude admin-created employees for normal users
            $adminIds = User::role('admin')->pluck('id')->toArray();
            $employeeQuery->whereIn('created_by', $ids)
                        ->whereNotIn('created_by', $adminIds);
        }

        $employees = $employeeQuery->get();

        if (!$request->employee_id || !$request->from_date || !$request->to_date) {
            return Inertia::render('reports/EmployeeLedgerFilter', [
                'employees' => $employees,
            ]);
        }

        $employee = Employee::with('ledger')->findOrFail($request->employee_id);
        // $company = CompanySetting::where('created_by', auth()->id())->first();

        $company = CompanySetting::where('created_by', auth()->id())->first() ?? (object)[
            'company_name' => '',
            // add other fields as needed with default values
        ];

        if (!$employee->ledger) {
            return back()->with('error', 'No ledger account found for this employee.');
        }

        $ledgerId = $employee->ledger->id;
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


    // Stock Summary Report
    // public function stockSummary(Request $request)
    // {
    //     $from = $request->input('from');
    //     $to = $request->input('to');

    //     // If filters are missing, show filter page
    //     $godowns = Godown::when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))
    //         ->select('id', 'name')->get();
    //     $categories = Category::when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))
    //         ->get(['id', 'name']); // ✅ FETCH CATEGORIES

    //     $items = Item::when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))
    //         ->get(['id', 'item_name']);
    //     if (!$from || !$to) {
    //         return Inertia::render('reports/StockSummaryFilter', [
    //             'godowns' => $godowns,
    //             'categories' => $categories,
    //             'items' => $items, // ✅ Add this line
    //         ]);
    //     }
    //     // dd(auth()->user()->hasRole('admin'), auth()->id());
    //     $stocks = $this->getStockData($request);



    //     $company = CompanySetting::where('created_by', auth()->id())->first();

    //     return Inertia::render('reports/StockSummary', [
    //         'items' => $items, // ✅ use pre-filtered variable here
    //         'stocks' => $stocks,
    //         'company' => $company,
    //         'godowns' => $godowns,
    //         'categories' => $categories,
    //         'filters' => [
    //             'from' => $from,
    //             'to' => $to,
    //             'godown_id' => $request->godown_id,
    //         ]
    //     ]);
    // }

    public function stockSummary(Request $request)
    {
        $from = $request->input('from');
        $to = $request->input('to');

        $user = auth()->user();
        $ids = user_scope_ids();

        // If filters are missing, show filter page
        if (!$user->hasRole('admin')) {
            $godowns = Godown::whereIn('created_by', $ids)->select('id', 'name')->get();
            $categories = Category::whereIn('created_by', $ids)->get(['id', 'name']);
            $items = Item::whereIn('created_by', $ids)->get(['id', 'item_name']);
        } else {
            $godowns = Godown::select('id', 'name')->get();
            $categories = Category::get(['id', 'name']);
            $items = Item::get(['id', 'item_name']);
        }

        if (!$from || !$to) {
            return Inertia::render('reports/StockSummaryFilter', [
                'godowns' => $godowns,
                'categories' => $categories,
                'items' => $items,
            ]);
        }

        $stocks = $this->getStockData($request);

        $company = CompanySetting::where('created_by', auth()->id())->first();

        return Inertia::render('reports/StockSummary', [
            'items' => $items,
            'stocks' => $stocks,
            'company' => $company,
            'godowns' => $godowns,
            'categories' => $categories,
            'filters' => [
                'from' => $from,
                'to' => $to,
                'godown_id' => $request->godown_id,
            ]
        ]);
    }

    // Stock Summary PDF and Excel exports
    public function stockSummaryPDF(Request $request)
    {
        // user_scope_ids() is used inside getStockData, so nothing extra needed here
        $stocks = $this->getStockData($request);
        $company = CompanySetting::where('created_by', auth()->id())->first();

        $pdf = Pdf::loadView('pdf.stock-summary', [
            'stocks' => $stocks,
            'filters' => $request->only('from', 'to'),
            'company' => $company
        ]);

        return $pdf->download('stock-summary.pdf');
    }

    // Stock Summary Excel export
    public function stockSummaryExcel(Request $request)
    {
        // user_scope_ids() is used inside getStockData, so nothing extra needed here
        $stocks = $this->getStockData($request);
        $company = CompanySetting::where('created_by', auth()->id())->first();

        return Excel::download(
            new StockSummaryExport($stocks, $request->only('from', 'to'), $company),
            'stock-summary.xlsx'
        );
    }

    // Stock Data
    // private function getStockData(Request $request)
    // {
    //     return Stock::with(['item.unit', 'godown'])
    //         ->when(!auth()->user()->hasRole('admin'), function ($q) {
    //             $q->whereHas('item', function ($subQuery) {
    //                 $subQuery->where('created_by', auth()->id());
    //             });
    //         })
    //         ->when($request->godown_id, fn($q) => $q->where('godown_id', $request->godown_id))
    //         ->get()
    //         ->map(function ($stock) {
    //             return [
    //                 'item_name' => $stock->item->item_name,
    //                 'godown_name' => $stock->godown->name,
    //                 'unit' => $stock->item->unit->name,
    //                 'qty' => (float) $stock->qty ?? 0,
    //                 'total_purchase' => (float) (PurchaseItem::where('product_id', $stock->item_id)->sum('subtotal') ?? 0),
    //                 'total_sale' => (float) (SaleItem::where('product_id', $stock->item_id)->sum('subtotal') ?? 0),
    //                 'total_sale_qty' => (float) (SaleItem::where('product_id', $stock->item_id)->sum('qty') ?? 0), // ✅ ADD THIS
    //                 'last_purchase_at' => PurchaseItem::where('product_id', $stock->item_id)->latest()->value('created_at'),
    //                 'last_sale_at' => SaleItem::where('product_id', $stock->item_id)->latest()->value('created_at'),
    //             ];
    //         });
    // }

    private function getStockData(Request $request)
    {
        $user = auth()->user();
        $ids = user_scope_ids();

        return Stock::with(['item.unit', 'godown'])
            ->when(!$user->hasRole('admin'), function ($q) use ($ids) {
                $q->whereHas('item', function ($subQuery) use ($ids) {
                    $subQuery->whereIn('created_by', $ids);
                });
            })
            ->when($request->godown_id, fn($q) => $q->where('godown_id', $request->godown_id))
            ->get()
            ->map(function ($stock) {
                return [
                    'item_name' => $stock->item->item_name,
                    // 'godown_name' => $stock->godown->name,
                    'godown_name' => optional($stock->godown)->name,
                    // 'unit' => $stock->item->unit->name,
                    'unit' => optional($stock->item->unit)->name ?? '',
                    'qty' => (float) $stock->qty ?? 0,
                    'total_purchase' => (float) (PurchaseItem::where('product_id', $stock->item_id)->sum('subtotal') ?? 0),
                    'total_sale' => (float) (SaleItem::where('product_id', $stock->item_id)->sum('subtotal') ?? 0),
                    'total_sale_qty' => (float) (SaleItem::where('product_id', $stock->item_id)->sum('qty') ?? 0),
                    'last_purchase_at' => PurchaseItem::where('product_id', $stock->item_id)->latest()->value('created_at'),
                    'last_sale_at' => SaleItem::where('product_id', $stock->item_id)->latest()->value('created_at'),
                ];
            });
    }

    // category Wise Stock Summary
    // public function categoryWiseStockSummary(Request $request)
    // {
    //     $from = $request->input('from');
    //     $to = $request->input('to');
    //     $categoryId = $request->input('category_id');

    //     $query = Category::with(['items.stocks'])
    //         ->when(!auth()->user()->hasRole('admin'), function ($q) {
    //             $q->whereHas('items', fn($qq) => $qq->where('created_by', auth()->id()));
    //         });

    //     if ($categoryId) {
    //         $query->where('id', $categoryId);
    //     }

    //     $categories = $query->get()->map(function ($category) {
    //         $totalQty = 0;
    //         $totalPurchase = 0;
    //         $totalSale = 0;
    //         $lastPurchase = null;
    //         $lastSale = null;
    //         $lastPurchaseQty = 0;
    //         $lastSaleQty = 0;
    //         $lastPurchaseUnit = '';
    //         $lastSaleUnit = '';

    //         $items = $category->items->filter(function ($item) {
    //             return auth()->user()->hasRole('admin') || $item->created_by === auth()->id();
    //         });

    //         foreach ($items as $item) {
    //             $totalQty += $item->stocks->sum('qty');
    //             $totalPurchase += PurchaseItem::where('product_id', $item->id)->sum('subtotal');
    //             $totalSale += SaleItem::where('product_id', $item->id)->sum('subtotal');

    //             // Last purchase
    //             $latestPurchase = PurchaseItem::where('product_id', $item->id)
    //                 ->latest('created_at')->first();
    //             if ($latestPurchase && (!$lastPurchase || $latestPurchase->created_at > $lastPurchase)) {
    //                 $lastPurchase = $latestPurchase->created_at;
    //                 $lastPurchaseQty = $latestPurchase->qty ?? 0;
    //                 $lastPurchaseUnit = optional($item->unit)->name ?? '';
    //             }

    //             // Last sale
    //             $latestSale = SaleItem::where('product_id', $item->id)
    //                 ->latest('created_at')->first();
    //             if ($latestSale && (!$lastSale || $latestSale->created_at > $lastSale)) {
    //                 $lastSale = $latestSale->created_at;
    //                 $lastSaleQty = $latestSale->qty ?? 0;
    //                 $lastSaleUnit = optional($item->unit)->name ?? '';
    //             }
    //         }

    //         return [
    //             'category_name'       => $category->name,
    //             'total_qty'           => $totalQty,
    //             'total_purchase'      => $totalPurchase,
    //             'total_sale'          => $totalSale,
    //             'last_purchase_at'    => $lastPurchase,
    //             'last_purchase_qty'   => $lastPurchaseQty,
    //             'last_purchase_unit'  => $lastPurchaseUnit,
    //             'last_sale_at'        => $lastSale,
    //             'last_sale_qty'       => $lastSaleQty,
    //             'last_sale_unit'      => $lastSaleUnit,
    //         ];
    //     });

    //     return Inertia::render('reports/CategoryWiseStockSummary', [
    //         'categories' => $categories,
    //         'filters' => [
    //             'from' => $from,
    //             'to' => $to,
    //             'category_id' => $categoryId,
    //         ],
    //         'company' => CompanySetting::where('created_by', auth()->id())->first(),
    //     ]);
    // }

    public function categoryWiseStockSummary(Request $request)
    {
        $from = $request->input('from');
        $to = $request->input('to');
        $categoryId = $request->input('category_id');
        $user = auth()->user();
        $ids = user_scope_ids();

        $query = Category::with(['items.stocks'])
            ->when(!$user->hasRole('admin'), function ($q) use ($ids) {
                $q->whereHas('items', fn($qq) => $qq->whereIn('created_by', $ids));
            });

        if ($categoryId) {
            $query->where('id', $categoryId);
        }

        $categories = $query->get()->map(function ($category) use ($user, $ids) {
            $totalQty = 0;
            $totalPurchase = 0;
            $totalSale = 0;
            $lastPurchase = null;
            $lastSale = null;
            $lastPurchaseQty = 0;
            $lastSaleQty = 0;
            $lastPurchaseUnit = '';
            $lastSaleUnit = '';

            $items = $category->items->filter(function ($item) use ($user, $ids) {
                return $user->hasRole('admin') || in_array($item->created_by, $ids);
            });

            foreach ($items as $item) {
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

    // category wise stock summary pdf and excel
    public function categoryWiseStockSummaryPDF(Request $request)
    {
        $categories = $this->getCategoryWiseStockData($request);
        $company = CompanySetting::where('created_by', auth()->id())->first();

        $pdf = Pdf::loadView('pdf.category-wise-stock-summary', [
            'categories' => $categories,
            'filters' => $request->only('from', 'to'),
            'company' => $company
        ]);

        return $pdf->download('category-wise-stock-summary.pdf');
    }

    // category Wise Stock Summary Excel
    public function categoryWiseStockSummaryExcel(Request $request)
    {
        $categories = $this->getCategoryWiseStockData($request); // or reuse same logic from existing controller
        $company = CompanySetting::where('created_by', auth()->id())->first();

        return Excel::download(
            new CategoryWiseStockSummaryExport($categories, $request->only('from', 'to', 'category_id'), $company),
            'category-wise-stock-summary.xlsx'
        );
    }

    // getCategoryWiseStockData
    private function getCategoryWiseStockData(Request $request)
    {
        $from = $request->input('from');
        $to = $request->input('to');
        $categoryId = $request->input('category_id');
        $user = auth()->user();
        $ids = user_scope_ids();

        $query = Category::with(['items.stocks'])
            ->when(!$user->hasRole('admin'), function ($q) use ($ids) {
                $q->whereHas('items', fn($qq) => $qq->whereIn('created_by', $ids));
            });

        if ($categoryId) {
            $query->where('id', $categoryId);
        }

        return $query->get()->map(function ($category) use ($user, $ids, $from, $to) {
            $totalQty = 0;
            $totalPurchase = 0;
            $totalSale = 0;
            $lastPurchase = null;
            $lastSale = null;
            $lastPurchaseQty = 0;
            $lastSaleQty = 0;
            $lastPurchaseUnit = '';
            $lastSaleUnit = '';

            $items = $category->items->filter(function ($item) use ($user, $ids) {
                return $user->hasRole('admin') || in_array($item->created_by, $ids);
            });

            foreach ($items as $item) {
                $totalQty += $item->stocks->sum('qty');
                $totalPurchase += \App\Models\PurchaseItem::where('product_id', $item->id)
                    ->when($from && $to, fn($q) => $q->whereBetween('created_at', [$from, $to]))
                    ->sum('subtotal');
                $totalSale += \App\Models\SaleItem::where('product_id', $item->id)
                    ->when($from && $to, fn($q) => $q->whereBetween('created_at', [$from, $to]))
                    ->sum('subtotal');

                // Last purchase
                $latestPurchase = \App\Models\PurchaseItem::where('product_id', $item->id)
                    ->when($from && $to, fn($q) => $q->whereBetween('created_at', [$from, $to]))
                    ->latest('created_at')->first();
                if ($latestPurchase && (!$lastPurchase || $latestPurchase->created_at > $lastPurchase)) {
                    $lastPurchase = $latestPurchase->created_at;
                    $lastPurchaseQty = $latestPurchase->qty ?? 0;
                    $lastPurchaseUnit = optional($item->unit)->name ?? '';
                }

                // Last sale
                $latestSale = \App\Models\SaleItem::where('product_id', $item->id)
                    ->when($from && $to, fn($q) => $q->whereBetween('created_at', [$from, $to]))
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
    }

    // itemWiseStockSummary
    // public function itemWiseStockSummary(Request $request)
    // {
    //     $from = $request->input('from');
    //     $to = $request->input('to');
    //     $godownId = $request->input('godown_id');
    //     $itemId = $request->input('item_id');

    //     $query = Item::with(['unit', 'stocks'])
    //         ->when(!auth()->user()->hasRole('admin'), function ($q) {
    //             $q->where('created_by', auth()->id());
    //         });

    //     if ($itemId) {
    //         $query->where('id', $itemId);
    //     }

    //     $items = $query->get()->map(function ($item) use ($from, $to, $godownId) {
    //         $stocks = $item->stocks;
    //         if ($godownId) {
    //             $stocks = $stocks->where('godown_id', $godownId);
    //         }

    //         $totalQty = $stocks->sum('qty');

    //         $totalPurchase = PurchaseItem::where('product_id', $item->id)
    //             ->when($from && $to, fn($q) => $q->whereBetween('created_at', [$from, $to]))
    //             ->sum('subtotal');

    //         $totalSale = SaleItem::where('product_id', $item->id)
    //             ->when($from && $to, fn($q) => $q->whereBetween('created_at', [$from, $to]))
    //             ->sum('subtotal');

    //         $totalSaleQty = SaleItem::where('product_id', $item->id)
    //             ->when($from && $to, fn($q) => $q->whereBetween('created_at', [$from, $to]))
    //             ->sum('qty');

    //         $lastPurchase = PurchaseItem::where('product_id', $item->id)
    //             ->when($from && $to, fn($q) => $q->whereBetween('created_at', [$from, $to]))
    //             ->latest('created_at')->first();

    //         $lastSale = SaleItem::where('product_id', $item->id)
    //             ->when($from && $to, fn($q) => $q->whereBetween('created_at', [$from, $to]))
    //             ->latest('created_at')->first();

    //         return [
    //             'item_name'           => $item->item_name,
    //             'unit'                => optional($item->unit)->name ?? '',
    //             'total_qty'           => $totalQty,
    //             'total_purchase'      => $totalPurchase,
    //             'total_sale'          => $totalSale,
    //             'total_sale_qty'      => $totalSaleQty,
    //             'last_purchase_at'    => optional($lastPurchase)->created_at,
    //             'last_purchase_qty'   => optional($lastPurchase)->qty ?? 0,
    //             'last_sale_at'        => optional($lastSale)->created_at,
    //             'last_sale_qty'       => optional($lastSale)->qty ?? 0,
    //         ];
    //     });

    //     return Inertia::render('reports/ItemWiseStockSummary', [
    //         'items' => $items,
    //         'godowns' => Godown::when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))
    //             ->get(['id', 'name']),
    //         'categories' => Category::when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))
    //             ->get(['id', 'name']),
    //         'company' => CompanySetting::where('created_by', auth()->id())->first(),
    //         'filters' => [
    //             'from' => $from,
    //             'to' => $to,
    //             'godown_id' => $godownId,
    //         ],
    //     ]);
    // }

    public function itemWiseStockSummary(Request $request)
    {
        $from = $request->input('from');
        $to = $request->input('to');
        $godownId = $request->input('godown_id');
        $itemId = $request->input('item_id');
        $user = auth()->user();
        $ids = user_scope_ids();

        $query = Item::with(['unit', 'stocks'])
            ->when(!$user->hasRole('admin'), function ($q) use ($ids) {
                $q->whereIn('created_by', $ids);
            });

        if ($itemId) {
            $query->where('id', $itemId);
        }

        $items = $query->get()->map(function ($item) use ($from, $to, $godownId) {
            $stocks = $item->stocks;
            if ($godownId) {
                $stocks = $stocks->where('godown_id', $godownId);
            }

            $totalQty = $stocks->sum('qty');

            $totalPurchase = PurchaseItem::where('product_id', $item->id)
                ->when($from && $to, fn($q) => $q->whereBetween('created_at', [$from, $to]))
                ->sum('subtotal');

            $totalSale = SaleItem::where('product_id', $item->id)
                ->when($from && $to, fn($q) => $q->whereBetween('created_at', [$from, $to]))
                ->sum('subtotal');

            $totalSaleQty = SaleItem::where('product_id', $item->id)
                ->when($from && $to, fn($q) => $q->whereBetween('created_at', [$from, $to]))
                ->sum('qty');

            $lastPurchase = PurchaseItem::where('product_id', $item->id)
                ->when($from && $to, fn($q) => $q->whereBetween('created_at', [$from, $to]))
                ->latest('created_at')->first();

            $lastSale = SaleItem::where('product_id', $item->id)
                ->when($from && $to, fn($q) => $q->whereBetween('created_at', [$from, $to]))
                ->latest('created_at')->first();

            return [
                'item_name'           => $item->item_name,
                'unit'                => optional($item->unit)->name ?? '',
                'total_qty'           => $totalQty,
                'total_purchase'      => $totalPurchase,
                'total_sale'          => $totalSale,
                'total_sale_qty'      => $totalSaleQty,
                'last_purchase_at'    => optional($lastPurchase)->created_at,
                'last_purchase_qty'   => optional($lastPurchase)->qty ?? 0,
                'last_sale_at'        => optional($lastSale)->created_at,
                'last_sale_qty'       => optional($lastSale)->qty ?? 0,
            ];
        });

        return Inertia::render('reports/ItemWiseStockSummary', [
            'items' => $items,
            'godowns' => Godown::when(!$user->hasRole('admin'), fn($q) => $q->whereIn('created_by', $ids))
                ->get(['id', 'name']),
            'categories' => Category::when(!$user->hasRole('admin'), fn($q) => $q->whereIn('created_by', $ids))
                ->get(['id', 'name']),
            'company' => CompanySetting::where('created_by', auth()->id())->first(),
            'filters' => [
                'from' => $from,
                'to' => $to,
                'godown_id' => $godownId,
            ],
        ]);
    }

    // itemWiseStockSummaryPDF
    public function itemWiseStockSummaryPDF(Request $request)
    {
        $items = $this->getItemWiseStockData($request);
        $company = CompanySetting::where('created_by', auth()->id())->first();

        $pdf = Pdf::loadView('pdf.item-wise-stock-summary', [
            'items' => $items,
            'filters' => $request->only('from', 'to', 'godown_id'),
            'company' => $company
        ]);

        return $pdf->download('item-wise-stock-summary.pdf');
    }

    // itemWiseStockSummaryExcel
    public function itemWiseStockSummaryExcel(Request $request)
    {
        $items = $this->getItemWiseStockData($request);
        $company = CompanySetting::where('created_by', auth()->id())->first();

        return Excel::download(
            new ArrayExport($items->toArray()), // ✅ Now it's a plain array
            'item-wise-stock-summary.xlsx'
        );
    }

    // getItemWiseStockData
    // private function getItemWiseStockData(Request $request)
    // {
    //     $from = $request->input('from');
    //     $to = $request->input('to');
    //     $godownId = $request->input('godown_id');

    //     return Item::with(['unit', 'stocks'])
    //         ->when(!auth()->user()->hasRole('admin'), function ($q) {
    //             $q->where('created_by', auth()->id());
    //         })
    //         ->get()
    //         ->map(function ($item) use ($from, $to, $godownId) {
    //             $stocks = $item->stocks;
    //             if ($godownId) {
    //                 $stocks = $stocks->where('godown_id', $godownId);
    //             }

    //             $totalQty = $stocks->sum('qty');
    //             $totalPurchase = PurchaseItem::where('product_id', $item->id)
    //                 ->when($from && $to, fn($q) => $q->whereBetween('created_at', [$from, $to]))
    //                 ->sum('subtotal');

    //             $totalSale = SaleItem::where('product_id', $item->id)
    //                 ->when($from && $to, fn($q) => $q->whereBetween('created_at', [$from, $to]))
    //                 ->sum('subtotal');

    //             $totalSaleQty = SaleItem::where('product_id', $item->id)
    //                 ->when($from && $to, fn($q) => $q->whereBetween('created_at', [$from, $to]))
    //                 ->sum('qty');

    //             $lastPurchase = PurchaseItem::where('product_id', $item->id)
    //                 ->when($from && $to, fn($q) => $q->whereBetween('created_at', [$from, $to]))
    //                 ->latest('created_at')->first();

    //             $lastSale = SaleItem::where('product_id', $item->id)
    //                 ->when($from && $to, fn($q) => $q->whereBetween('created_at', [$from, $to]))
    //                 ->latest('created_at')->first();

    //             return [
    //                 'item_name'           => $item->item_name,
    //                 'unit'                => optional($item->unit)->name ?? '',
    //                 'total_qty'           => $totalQty,
    //                 'total_purchase'      => $totalPurchase,
    //                 'total_sale'          => $totalSale,
    //                 'total_sale_qty'      => $totalSaleQty,
    //                 'last_purchase_at'    => optional($lastPurchase)->created_at,
    //                 'last_purchase_qty'   => optional($lastPurchase)->qty ?? 0,
    //                 'last_sale_at'        => optional($lastSale)->created_at,
    //                 'last_sale_qty'       => optional($lastSale)->qty ?? 0,
    //             ];
    //         });
    // }

    private function getItemWiseStockData(Request $request)
    {
        $from = $request->input('from');
        $to = $request->input('to');
        $godownId = $request->input('godown_id');
        $user = auth()->user();
        $ids = user_scope_ids();

        return Item::with(['unit', 'stocks'])
            ->when(!$user->hasRole('admin'), function ($q) use ($ids) {
                $q->whereIn('created_by', $ids);
            })
            ->get()
            ->map(function ($item) use ($from, $to, $godownId) {
                $stocks = $item->stocks;
                if ($godownId) {
                    $stocks = $stocks->where('godown_id', $godownId);
                }

                $totalQty = $stocks->sum('qty');
                $totalPurchase = PurchaseItem::where('product_id', $item->id)
                    ->when($from && $to, fn($q) => $q->whereBetween('created_at', [$from, $to]))
                    ->sum('subtotal');

                $totalSale = SaleItem::where('product_id', $item->id)
                    ->when($from && $to, fn($q) => $q->whereBetween('created_at', [$from, $to]))
                    ->sum('subtotal');

                $totalSaleQty = SaleItem::where('product_id', $item->id)
                    ->when($from && $to, fn($q) => $q->whereBetween('created_at', [$from, $to]))
                    ->sum('qty');

                $lastPurchase = PurchaseItem::where('product_id', $item->id)
                    ->when($from && $to, fn($q) => $q->whereBetween('created_at', [$from, $to]))
                    ->latest('created_at')->first();

                $lastSale = SaleItem::where('product_id', $item->id)
                    ->when($from && $to, fn($q) => $q->whereBetween('created_at', [$from, $to]))
                    ->latest('created_at')->first();

                return [
                    'item_name'           => $item->item_name,
                    'unit'                => optional($item->unit)->name ?? '',
                    'total_qty'           => $totalQty,
                    'total_purchase'      => $totalPurchase,
                    'total_sale'          => $totalSale,
                    'total_sale_qty'      => $totalSaleQty,
                    'last_purchase_at'    => optional($lastPurchase)->created_at,
                    'last_purchase_qty'   => optional($lastPurchase)->qty ?? 0,
                    'last_sale_at'        => optional($lastSale)->created_at,
                    'last_sale_qty'       => optional($lastSale)->qty ?? 0,
                ];
            });
    }

    // dayBook
    public function dayBook(Request $request)
    {
        $authUser = auth()->user();
        $isAdmin = $authUser->hasRole('admin');

        $company = \App\Models\CompanySetting::where('created_by', auth()->id())->first();

        // 👇 Admin gets all users; non-admin gets self + users they created
        // $allowedUserIds = $isAdmin
        //     ? \App\Models\User::pluck('id')
        //     : \App\Models\User::where('created_by', $authUser->id)
        //     ->orWhere('id', $authUser->id)
        //     ->pluck('id');

        // Use user_scope_ids() for multi-level access
        $allowedUserIds = $isAdmin ? \App\Models\User::pluck('id') : user_scope_ids();

        $users = \App\Models\User::select('id', 'name')
            ->whereIn('id', $allowedUserIds)
            ->get();

        // 🔍 If filters missing, show filter page
        if (!$request->filled('from_date') || !$request->filled('to_date')) {
            return Inertia::render('reports/DayBookFilter', [
                'users' => $users,
                'isAdmin' => $isAdmin,
            ]);
        }

        // ✅ Validation
        $request->validate([
            'from_date' => 'required|date',
            'to_date' => 'required|date|after_or_equal:from_date',
            'transaction_type' => 'nullable|string',
            'created_by' => 'nullable|integer',
        ]);

        $from = $request->from_date;
        $to = $request->to_date;
        $userId = $request->created_by;
        $type = $request->transaction_type;

        $entries = collect();

        // ✅ Common filter closure
        $applyFilters = fn($query) => $query
            ->whereBetween('date', [$from, $to])
            ->when($userId, fn($q) => $q->where('created_by', $userId))
            ->when(!$isAdmin, fn($q) => $q->whereIn('created_by', $allowedUserIds));

        // ✅ Purchase
        if (!$type || $type === 'Purchase') {
            $entries = $entries->merge(
                $applyFilters(\App\Models\Purchase::query())
                    ->with(['creator', 'accountLedger'])
                    ->get()
                    ->map(fn($r) => [
                        'date' => $r->date,
                        'voucher_no' => $r->voucher_no,
                        'type' => 'Purchase',
                        'ledger' => optional($r->accountLedger)->account_ledger_name,
                        'debit' => $r->grand_total,
                        'credit' => 0,
                        'note' => $r->note ?? '-',
                        'created_by' => optional($r->creator)->name,
                    ])
            );
        }

        // ✅ Purchase Return
        if (!$type || $type === 'Purchase Return') {
            $entries = $entries->merge(
                \App\Models\PurchaseReturn::query()
                    ->whereBetween('date', [$from, $to])
                    ->when($userId, fn($q) => $q->where('created_by', $userId))
                    ->when(!$isAdmin, fn($q) => $q->whereIn('created_by', $allowedUserIds))
                    ->with(['creator', 'accountLedger'])
                    ->get()
                    ->map(fn($r) => [
                        'date' => $r->date,
                        'voucher_no' => $r->return_voucher_no,
                        'type' => 'Purchase Return',
                        'ledger' => optional($r->accountLedger)->account_ledger_name,
                        'debit' => 0,
                        'credit' => $r->grand_total,
                        'note' => $r->reason ?? '-',
                        'created_by' => optional($r->creator)->name,
                    ])
            );
        }

        // ✅ Sale
        if (!$type || $type === 'Sale') {
            $entries = $entries->merge(
                \App\Models\Sale::query()
                    ->whereBetween('date', [$from, $to])
                    ->when($userId, fn($q) => $q->where('created_by', $userId))
                    ->when(!$isAdmin, fn($q) => $q->whereIn('created_by', $allowedUserIds))
                    ->with(['creator', 'accountLedger'])
                    ->get()
                    ->map(fn($r) => [
                        'date' => $r->date,
                        'voucher_no' => $r->voucher_no,
                        'type' => 'Sale',
                        'ledger' => optional($r->accountLedger)->account_ledger_name,
                        'debit' => $r->grand_total,
                        'credit' => 0,
                        'note' => '-',
                        'created_by' => optional($r->creator)->name,
                    ])
            );
        }

        // ✅ Sale Return
        if (!$type || $type === 'Sale Return') {
            $entries = $entries->merge(
                \App\Models\SalesReturn::query()
                    ->whereBetween('return_date', [$from, $to])
                    ->when($userId, fn($q) => $q->where('created_by', $userId))
                    ->when(!$isAdmin, fn($q) => $q->whereIn('created_by', $allowedUserIds))
                    ->with(['creator', 'accountLedger'])
                    ->get()
                    ->map(fn($r) => [
                        'date' => $r->return_date,
                        'voucher_no' => $r->voucher_no,
                        'type' => 'Sale Return',
                        'ledger' => optional($r->accountLedger)->account_ledger_name,
                        'debit' => 0,
                        'credit' => $r->total_return_amount,
                        'note' => $r->reason ?? '-',
                        'created_by' => optional($r->creator)->name,
                    ])
            );
        }

        // ✅ Receive
        if (!$type || $type === 'Receive') {
            $entries = $entries->merge(
                $applyFilters(\App\Models\ReceivedAdd::query())
                    ->with(['accountLedger', 'creator']) // ✅ eager load both
                    ->get()
                    ->map(fn($r) => [
                        'date' => $r->date,
                        'voucher_no' => $r->voucher_no,
                        'type' => 'Receive',
                        'ledger' => optional($r->accountLedger)->account_ledger_name ?? '-', // ✅ correctly access ledger name
                        'debit' => $r->amount,
                        'credit' => 0,
                        'note' => $r->description ?? '-',
                        'created_by' => optional($r->creator)->name,
                    ])
            );
        }


        // ✅ Payment
        if (!$type || $type === 'Payment') {
            $entries = $entries->merge(
                $applyFilters(\App\Models\PaymentAdd::query())
                    ->with(['creator', 'accountLedger'])
                    ->get()
                    ->map(fn($r) => [
                        'date' => $r->date,
                        'voucher_no' => $r->voucher_no,
                        'type' => 'Payment',
                        'ledger' => optional($r->accountLedger)->account_ledger_name,
                        'debit' => 0,
                        'credit' => $r->amount,
                        'note' => $r->description ?? '-',
                        'created_by' => optional($r->creator)->name,
                    ])
            );
        }

        // ✅ Contra
        if (!$type || $type === 'Contra') {
            $entries = $entries->merge(
                $applyFilters(\App\Models\ContraAdd::query())
                    ->with('creator')
                    ->get()
                    ->map(fn($r) => [
                        'date' => $r->date,
                        'voucher_no' => $r->voucher_no,
                        'type' => 'Contra',
                        'ledger' => '-',
                        'debit' => $r->amount,
                        'credit' => 0,
                        'note' => $r->description ?? '-',
                        'created_by' => optional($r->creator)->name,
                    ])
            );
        }

        // ✅ Journal
        if (!$type || $type === 'Journal') {
            $entries = $entries->merge(
                $applyFilters(\App\Models\Journal::query())
                    ->with('entries.ledger', 'creator')
                    ->get()
                    ->flatMap(function ($journal) {
                        return $journal->entries->map(function ($entry) use ($journal) {
                            return [
                                'date' => $journal->date,
                                'voucher_no' => $journal->voucher_no,
                                'type' => 'Journal',
                                'ledger' => optional($entry->ledger)->account_ledger_name,
                                'debit' => $entry->type === 'debit' ? $entry->amount : 0,
                                'credit' => $entry->type === 'credit' ? $entry->amount : 0,
                                'note' => $entry->note ?? $journal->narration,
                                'created_by' => optional($journal->creator)->name,
                            ];
                        });
                    })
            );
        }

        $sorted = $entries->sortBy(['date', 'voucher_no'])->values();

        return Inertia::render('reports/DayBook', [
            'users' => $users,
            'isAdmin' => $isAdmin,
            'entries' => $sorted,
            'from' => $from,
            'to' => $to,
            'filters' => [
                'from' => $from,
                'to' => $to,
                'transaction_type' => $type,
                'created_by' => $userId,
            ],
            'company' => $company,
        ]);
    }

    // getDayBookEntries
    private function getDayBookEntries(Request $request, $allowedUserIds, $isAdmin)
    {
        $from = $request->from_date;
        $to = $request->to_date;
        $userId = $request->created_by;
        $type = $request->transaction_type;

        $entries = collect();

        $applyFilters = fn($query) => $query
            ->whereBetween('date', [$from, $to])
            ->when($userId, fn($q) => $q->where('created_by', $userId))
            ->when(!$isAdmin, fn($q) => $q->whereIn('created_by', $allowedUserIds));

        // ✅ Purchase
        if (!$type || $type === 'Purchase') {
            $entries = $entries->merge(
                $applyFilters(\App\Models\Purchase::query())
                    ->with(['creator', 'accountLedger'])
                    ->get()
                    ->map(fn($r) => [
                        'date' => $r->date,
                        'voucher_no' => $r->voucher_no,
                        'type' => 'Purchase',
                        'ledger' => optional($r->accountLedger)->account_ledger_name,
                        'debit' => $r->grand_total,
                        'credit' => 0,
                        'note' => $r->note ?? '-',
                        'created_by' => optional($r->creator)->name,
                    ])
            );
        }

        // ✅ Purchase Return
        if (!$type || $type === 'Purchase Return') {
            $entries = $entries->merge(
                \App\Models\PurchaseReturn::query()
                    ->whereBetween('date', [$from, $to])
                    ->when($userId, fn($q) => $q->where('created_by', $userId))
                    ->when(!$isAdmin, fn($q) => $q->whereIn('created_by', $allowedUserIds))
                    ->with(['creator', 'accountLedger'])
                    ->get()
                    ->map(fn($r) => [
                        'date' => $r->date,
                        'voucher_no' => $r->return_voucher_no,
                        'type' => 'Purchase Return',
                        'ledger' => optional($r->accountLedger)->account_ledger_name,
                        'debit' => 0,
                        'credit' => $r->grand_total,
                        'note' => $r->reason ?? '-',
                        'created_by' => optional($r->creator)->name,
                    ])
            );
        }

        // ✅ Sale
        if (!$type || $type === 'Sale') {
            $entries = $entries->merge(
                \App\Models\Sale::query()
                    ->whereBetween('date', [$from, $to])
                    ->when($userId, fn($q) => $q->where('created_by', $userId))
                    ->when(!$isAdmin, fn($q) => $q->whereIn('created_by', $allowedUserIds))
                    ->with(['creator', 'accountLedger'])
                    ->get()
                    ->map(fn($r) => [
                        'date' => $r->date,
                        'voucher_no' => $r->voucher_no,
                        'type' => 'Sale',
                        'ledger' => optional($r->accountLedger)->account_ledger_name,
                        'debit' => $r->grand_total,
                        'credit' => 0,
                        'note' => '-',
                        'created_by' => optional($r->creator)->name,
                    ])
            );
        }

        // ✅ Sale Return
        if (!$type || $type === 'Sale Return') {
            $entries = $entries->merge(
                \App\Models\SalesReturn::query()
                    ->whereBetween('return_date', [$from, $to])
                    ->when($userId, fn($q) => $q->where('created_by', $userId))
                    ->when(!$isAdmin, fn($q) => $q->whereIn('created_by', $allowedUserIds))
                    ->with(['creator', 'accountLedger'])
                    ->get()
                    ->map(fn($r) => [
                        'date' => $r->return_date,
                        'voucher_no' => $r->voucher_no,
                        'type' => 'Sale Return',
                        'ledger' => optional($r->accountLedger)->account_ledger_name,
                        'debit' => 0,
                        'credit' => $r->total_return_amount,
                        'note' => $r->reason ?? '-',
                        'created_by' => optional($r->creator)->name,
                    ])
            );
        }

        // ✅ Receive
        if (!$type || $type === 'Receive') {
            $entries = $entries->merge(
                $applyFilters(\App\Models\ReceivedAdd::query())
                    ->with(['accountLedger', 'creator'])
                    ->get()
                    ->map(fn($r) => [
                        'date' => $r->date,
                        'voucher_no' => $r->voucher_no,
                        'type' => 'Receive',
                        'ledger' => optional($r->accountLedger)->account_ledger_name ?? '-',
                        'debit' => $r->amount,
                        'credit' => 0,
                        'note' => $r->description ?? '-',
                        'created_by' => optional($r->creator)->name,
                    ])
            );
        }

        // ✅ Payment
        if (!$type || $type === 'Payment') {
            $entries = $entries->merge(
                $applyFilters(\App\Models\PaymentAdd::query())
                    ->with(['creator', 'accountLedger'])
                    ->get()
                    ->map(fn($r) => [
                        'date' => $r->date,
                        'voucher_no' => $r->voucher_no,
                        'type' => 'Payment',
                        'ledger' => optional($r->accountLedger)->account_ledger_name,
                        'debit' => 0,
                        'credit' => $r->amount,
                        'note' => $r->description ?? '-',
                        'created_by' => optional($r->creator)->name,
                    ])
            );
        }

        // ✅ Contra
        if (!$type || $type === 'Contra') {
            $entries = $entries->merge(
                $applyFilters(\App\Models\ContraAdd::query())
                    ->with('creator')
                    ->get()
                    ->map(fn($r) => [
                        'date' => $r->date,
                        'voucher_no' => $r->voucher_no,
                        'type' => 'Contra',
                        'ledger' => '-',
                        'debit' => $r->amount,
                        'credit' => 0,
                        'note' => $r->description ?? '-',
                        'created_by' => optional($r->creator)->name,
                    ])
            );
        }

        // ✅ Journal
        if (!$type || $type === 'Journal') {
            $entries = $entries->merge(
                $applyFilters(\App\Models\Journal::query())
                    ->with('entries.ledger', 'creator')
                    ->get()
                    ->flatMap(function ($journal) {
                        return $journal->entries->map(function ($entry) use ($journal) {
                            return [
                                'date' => $journal->date,
                                'voucher_no' => $journal->voucher_no,
                                'type' => 'Journal',
                                'ledger' => optional($entry->ledger)->account_ledger_name,
                                'debit' => $entry->type === 'debit' ? $entry->amount : 0,
                                'credit' => $entry->type === 'credit' ? $entry->amount : 0,
                                'note' => $entry->note ?? $journal->narration,
                                'created_by' => optional($journal->creator)->name,
                            ];
                        });
                    })
            );
        }

        return $entries->sortBy(['date', 'voucher_no'])->values();
    }

    // dayBookExcel 
    public function dayBookExcel(Request $request)
    {
        $request->validate([
            'from_date' => 'required|date',
            'to_date' => 'required|date|after_or_equal:from_date',
        ]);

        $authUser = auth()->user();
        $isAdmin = $authUser->hasRole('admin');

        // $allowedUserIds = $isAdmin
        //     ? \App\Models\User::pluck('id')
        //     : \App\Models\User::where('created_by', $authUser->id)->orWhere('id', $authUser->id)->pluck('id');

        // Use user_scope_ids() for multi-level access
        $allowedUserIds = $isAdmin
            ? User::pluck('id')
            : user_scope_ids();

        $request->merge([
            'from_date' => $request->from_date ?? now()->format('Y-m-d'),
            'to_date' => $request->to_date ?? now()->format('Y-m-d'),
        ]);
        $authUser = auth()->user();
        $isAdmin = $authUser->hasRole('admin');

        $allowedUserIds = $isAdmin
            ? \App\Models\User::pluck('id')
            : \App\Models\User::where('created_by', $authUser->id)->orWhere('id', $authUser->id)->pluck('id');

        $entries = $this->getDayBookEntries($request, $allowedUserIds, $isAdmin);

        return \Excel::download(new \App\Exports\DayBookExport($entries->toArray()), 'day-book-report.xlsx');
    }

    // dayBookPdf
    public function dayBookPdf(Request $request)
    {
        $request->validate([
            'from_date' => 'required|date',
            'to_date' => 'required|date|after_or_equal:from_date',
        ]);

        $authUser = auth()->user();
        $isAdmin = $authUser->hasRole('admin');

        // $allowedUserIds = $isAdmin
        //     ? \App\Models\User::pluck('id')
        //     : \App\Models\User::where('created_by', $authUser->id)->orWhere('id', $authUser->id)->pluck('id');

        // Use user_scope_ids() for multi-level access
        $allowedUserIds = $isAdmin
            ? User::pluck('id')
            : user_scope_ids();

        $request->merge([
            'from_date' => $request->from_date ?? now()->format('Y-m-d'),
            'to_date' => $request->to_date ?? now()->format('Y-m-d'),
        ]);
        $authUser = auth()->user();
        $isAdmin = $authUser->hasRole('admin');

        $allowedUserIds = $isAdmin
            ? \App\Models\User::pluck('id')
            : \App\Models\User::where('created_by', $authUser->id)->orWhere('id', $authUser->id)->pluck('id');

        $entries = $this->getDayBookEntries($request, $allowedUserIds, $isAdmin);
        $company = \App\Models\CompanySetting::firstWhere('created_by', auth()->id());

        $pdf = \PDF::loadView('reports.day-book-pdf', [
            'entries' => $entries,
            'filters' => $request->all(),
            'company' => $company,
        ])->setPaper('a4', 'landscape');

        return $pdf->download('day-book-report.pdf');
    }

    // accountBook
    public function accountBook(Request $request)
    {

        $user = auth()->user();
        $ids = user_scope_ids();

        // ── 1.  Ledgers for the filter drop-down ─────────────────────────────────────
        // $ledgers = AccountLedger::select('id', 'account_ledger_name')
        //     ->when(
        //         !auth()->user()->hasRole('admin'),
        //         fn($q) => $q->where('created_by', auth()->id())
        //     )
        //     ->get();

        $ledgers = AccountLedger::select('id', 'account_ledger_name')
        ->when(
            !$user->hasRole('admin'),
            fn($q) => $q->whereIn('created_by', $ids)
        )
        ->get();

        // ── 2.  Show filter page if any field missing ───────────────────────────────
        if (
            !$request->filled('ledger_id') ||
            !$request->filled('from_date') ||
            !$request->filled('to_date')
        ) {

            return Inertia::render('reports/AccountBookFilter', [
                'ledgers' => $ledgers,
            ]);
        }

        // ── 3.  Core variables ──────────────────────────────────────────────────────
        $ledgerId = $request->ledger_id;
        $from     = $request->from_date;
        $to       = $request->to_date;

        // ── 4.  Get the full ledger profile (phone, email, etc.) ────────────────────
        $ledger = AccountLedger::findOrFail($ledgerId);

        // ── 5.  Opening balance before the FROM date ────────────────────────────────
        $openingBalance = JournalEntry::where('account_ledger_id', $ledgerId)
            ->whereHas('journal', fn($q) => $q->where('date', '<', $from))
            ->sum(DB::raw("CASE
                          WHEN type = 'credit' THEN amount
                          ELSE -amount
                       END"));

        // ── 6.  Ledger transactions within the range ────────────────────────────────
        $entries = JournalEntry::with(['journal', 'ledger'])   // 👈 eager-load ledger
            ->where('account_ledger_id', $ledgerId)
            ->whereHas('journal', fn($q) => $q->whereBetween('date', [$from, $to]))
            ->get()
            ->sortBy(fn($e) => $e->journal->date)
            ->values();

        // ── 6-A.  Helper to derive the same labels Day Book uses ───────────────
        $resolveType = static function ($journal) {
            // You can derive from either voucher prefix …or… the morph class
            return match (substr($journal->voucher_no, 0, 3)) {
                'PUR' => 'Purchase',
                'RET' => 'Purchase Return',     // purchase-return prefix
                'SAL' => 'Sale',
                'SRL' => 'Sale Return',         // sales-return prefix (adjust if different)
                'PAY' => 'Payment',
                'REC' => 'Receive',
                'CON' => 'Contra',
                default => 'Journal',
            };
        };

        // ── 7.  Company info ────────────────────────────────────────────────────────
        $company = company_info();

        // ── 8.  Send data to React page ─────────────────────────────────────────────
        return Inertia::render('reports/AccountBook', [
            // dropdown data so the page can keep the Select2 populated
            'ledgers'         => $ledgers,

            // single ledger profile (for header at left)
            'ledger'          => [
                'id'                => $ledger->id,
                'account_ledger_name' => $ledger->account_ledger_name,
                'phone_number'      => $ledger->phone_number,
                'email'             => $ledger->email,
                'address'           => $ledger->address,
                'opening_balance'   => (float) $ledger->opening_balance,
                'debit_credit'      => $ledger->debit_credit,   // 'debit' | 'credit'
            ],

            'company'         => $company,
            'opening_balance' => (float) $openingBalance,

            // map entries so debit/credit are always floats
            'entries' => $entries->map(function ($entry) use ($resolveType) {
                return [
                    'date'        => $entry->journal->date,
                    'voucher_no'  => $entry->journal->voucher_no,
                    'type'        => $entry->journal->voucher_type ?? $resolveType($entry->journal),
                    'account'     => $entry->ledger->account_ledger_name ?? '',
                    'note'        => $entry->note ?? '-',
                    'debit'       => $entry->type === 'debit'  ? (float) $entry->amount : 0.0,
                    'credit'      => $entry->type === 'credit' ? (float) $entry->amount : 0.0,
                ];
            }),

            'from'       => $from,
            'to'         => $to,
            'ledger_id'  => $ledgerId,
        ]);
    }

    // exportAccountBookExcel
    public function exportAccountBookExcel(Request $request)
    {
        $data = $this->getAccountBookData($request);
        return Excel::download(new AccountBookExport(collect($data['entries'])), 'account_book.xlsx');
    }

    // exportAccountBookPDF 
    // public function exportAccountBookPDF(Request $request)
    // {
    //     $data = $this->getAccountBookData($request);

    //     $company = CompanySetting::firstWhere('created_by', auth()->id());
    //     $ledger = AccountLedger::findOrFail($request->ledger_id);

    //     $ledgerProfile = [
    //         'id' => $ledger->id,
    //         'account_ledger_name' => $ledger->account_ledger_name,
    //         'phone_number' => $ledger->phone_number ?? '-',
    //         'email' => $ledger->email ?? '-',
    //         'address' => $ledger->address ?? '-',
    //         'opening_balance' => (float) $ledger->opening_balance,
    //         'debit_credit' => $ledger->debit_credit,
    //     ];

    //     return Pdf::loadView('pdf.account-book', [
    //         'entries' => $data['entries'],
    //         'opening_balance' => $data['opening_balance'],
    //         'company' => $company,
    //         'ledger' => $ledgerProfile,
    //         'from' => $request->from,
    //         'to' => $request->to,
    //     ])->setPaper('a4', 'landscape')->download('account_book.pdf');
    // }

    public function exportAccountBookPDF(Request $request)
    {
        $data = $this->getAccountBookData($request);

        $user = auth()->user();
        $ids = user_scope_ids();

        // Ledger access check for non-admins
        if (!$user->hasRole('admin')) {
            $allowedLedgerIds = AccountLedger::whereIn('created_by', $ids)->pluck('id')->toArray();
            if (!in_array($request->ledger_id, $allowedLedgerIds)) {
                abort(403, 'Unauthorized ledger access.');
            }
        }

        $company = CompanySetting::firstWhere('created_by', auth()->id()) ?? (object)[
            'company_name' => '',
            // add other fields as needed
        ];
        $ledger = AccountLedger::findOrFail($request->ledger_id);

        $ledgerProfile = [
            'id' => $ledger->id,
            'account_ledger_name' => $ledger->account_ledger_name,
            'phone_number' => $ledger->phone_number ?? '-',
            'email' => $ledger->email ?? '-',
            'address' => $ledger->address ?? '-',
            'opening_balance' => (float) $ledger->opening_balance,
            'debit_credit' => $ledger->debit_credit,
        ];

        return Pdf::loadView('pdf.account-book', [
            'entries' => $data['entries'],
            'opening_balance' => $data['opening_balance'],
            'company' => $company,
            'ledger' => $ledgerProfile,
            'from' => $request->from,
            'to' => $request->to,
        ])->setPaper('a4', 'landscape')->download('account_book.pdf');
    }

    // getAccountBookData
    private function getAccountBookData(Request $request): array
    {
        $request->validate([
            'ledger_id' => 'required|exists:account_ledgers,id',
            'from' => 'required|date',
            'to' => 'required|date',
        ]);

        $ledgerId = $request->ledger_id;
        $from = $request->from;
        $to = $request->to;

        $openingBalance = \App\Models\JournalEntry::where('account_ledger_id', $ledgerId)
            ->whereHas('journal', fn($q) => $q->where('date', '<', $from))
            ->sum(\DB::raw("CASE WHEN type = 'credit' THEN amount ELSE -amount END"));

        $entries = \App\Models\JournalEntry::with(['journal', 'ledger'])
            ->where('account_ledger_id', $ledgerId)
            ->whereHas('journal', fn($q) => $q->whereBetween('date', [$from, $to]))
            ->get()
            ->sortBy(fn($e) => $e->journal->date)
            ->values()
            ->map(function ($entry) {
                return [
                    'date'       => $entry->journal->date,
                    'voucher_no' => $entry->journal->voucher_no,
                    'type'       => $entry->journal->voucher_type ?? $this->resolveVoucherType($entry->journal->voucher_no),
                    'account'    => $entry->ledger->account_ledger_name ?? '-',
                    'note'       => $entry->note ?? '-',
                    'debit'      => $entry->type === 'debit' ? (float) $entry->amount : 0.0,
                    'credit'     => $entry->type === 'credit' ? (float) $entry->amount : 0.0,
                ];
            });

        return [
            'entries' => $entries,
            'opening_balance' => $openingBalance,
        ];
    }

    private function resolveVoucherType(string $voucherNo): string
    {
        return match (substr($voucherNo, 0, 3)) {
            'PUR' => 'Purchase',
            'SAL' => 'Sale',
            'SRL' => 'Sale Return',     // clearly separate
            'RET' => 'Purchase Return', // clarify RET = purchase return only
            'PAY' => 'Payment',
            'REC' => 'Receive',
            'CON' => 'Contra',
            default => 'Journal',
        };
    }


}
