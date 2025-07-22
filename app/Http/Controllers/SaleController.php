<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Services\SalePaymentService;
use App\Services\LedgerService;
use App\Services\FinalizeSaleService;
use Carbon\Carbon;          // already there if you date-parse elsewhere

use Illuminate\Support\Facades\Log;
use App\Models\SaleItem;
use App\Models\Godown;
use App\Models\Salesman;
use App\Models\AccountLedger;
use App\Models\Item;
use App\Models\Stock;
use App\Models\Journal;
use App\Models\JournalEntry;
use function company_info;
use function numberToWords;
use function godown_scope_ids;
use Illuminate\Support\Facades\DB;
use App\Models\ReceivedMode;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SaleController extends Controller
{
    // List Sales
    // public function index()
    // {
    //     $sales = Sale::with([
    //         'godown',
    //         'salesman',
    //         'accountLedger',
    //         'saleItems.item',
    //         'creator'
    //     ])
    //         ->where('created_by', auth()->id())
    //         ->orderBy('id', 'desc')
    //         ->paginate(10);

    //     return Inertia::render('sales/index', [
    //         'sales' => $sales
    //     ]);
    // }

    public const FLOW_NONE          = 'none';
    public const FLOW_SUB_ONLY      = 'sub_only';
    public const FLOW_SUB_AND_RESP  = 'sub_and_resp';

    public function index()
    {
        $ids = godown_scope_ids();

        $query = Sale::with([
            'godown',
            'salesman',
            'accountLedger',
            'saleItems.item',
            'creator'
        ])->orderBy('id', 'desc');

        // If $ids is not empty, filter by created_by
        if (!empty($ids)) {
            $query->whereIn('created_by', $ids);
        }

        $sales = $query->paginate(10);

        return Inertia::render('sales/index', [
            'sales' => $sales
        ]);
    }

    // Create Sale Form
    // public function create()
    // {
    //     return Inertia::render('sales/create', [
    //         'godowns' => Godown::where('created_by', auth()->id())->get(),
    //         'salesmen' => Salesman::where('created_by', auth()->id())->get(),
    //         'ledgers' => AccountLedger::where('created_by', auth()->id())->get(),
    //         'inventoryLedgers' => AccountLedger::where('created_by', auth()->id())->get(['id', 'account_ledger_name']),
    //         'items' => Item::where('created_by', auth()->id())->get(),
    //         'accountGroups' => \App\Models\AccountGroup::get(['id', 'name']),
    //         'receivedModes' => \App\Models\ReceivedMode::with('ledger')
    //             ->where('created_by', auth()->id())
    //             ->get(['id', 'mode_name', 'ledger_id']),
    //     ]);
    // }

    public function create()
    {
        $ids = godown_scope_ids();

        return Inertia::render('sales/create', [
            'godowns' => empty($ids) ? Godown::all() : Godown::whereIn('created_by', $ids)->get(),
            'salesmen' => empty($ids) ? Salesman::all() : Salesman::whereIn('created_by', $ids)->get(),
            'ledgers' => empty($ids) ? AccountLedger::all() : AccountLedger::whereIn('created_by', $ids)->get(),
            'inventoryLedgers' => empty($ids)
                ? AccountLedger::get(['id', 'account_ledger_name'])
                : AccountLedger::whereIn('created_by', $ids)->get(['id', 'account_ledger_name']),
            'items' => empty($ids) ? Item::all() : Item::whereIn('created_by', $ids)->get(),
            'accountGroups' => \App\Models\AccountGroup::get(['id', 'name']),
            'receivedModes' => empty($ids)
                ? \App\Models\ReceivedMode::with('ledger')->get(['id', 'mode_name', 'ledger_id'])
                : \App\Models\ReceivedMode::with('ledger')->whereIn('created_by', $ids)->get(['id', 'mode_name', 'ledger_id']),
        ]);
    }



    // Store Sale
    public function store(Request $request, FinalizeSaleService $finalizer)
    {
        $this->validateRequest($request);

        /* 0️⃣  Prepare helpers */
        $voucherNo = $request->voucher_no
            ?? 'SAL-' . now()->format('Ymd') . '-' . str_pad(Sale::max('id') + 1, 4, '0', STR_PAD_LEFT);

        $flow = auth()->user()->company->sale_approval_flow ?? self::FLOW_NONE;

        /* ------------------------------------------------------------
     | 1️⃣  Create the Sale + its line-items
     * ------------------------------------------------------------ */
        DB::beginTransaction();
        try {
            /* --- header --- */
            $sale = Sale::create([
                'date'                 => $request->date,
                'voucher_no'           => $voucherNo,
                'godown_id'            => $request->godown_id,
                'salesman_id'          => $request->salesman_id,
                'account_ledger_id'    => $request->account_ledger_id,
                'phone'                => $request->phone,
                'address'              => $request->address,
                'shipping_details'     => $request->shipping_details,
                'delivered_to'         => $request->delivered_to,
                'truck_rent'           => $request->truck_rent,
                'rent_advance'         => $request->rent_advance,
                'net_rent'             => $request->net_rent,
                'inventory_ledger_id'  => $request->inventory_ledger_id,
                'cogs_ledger_id'       => $request->cogs_ledger_id,
                'truck_driver_name'    => $request->truck_driver_name,
                'driver_address'       => $request->driver_address,
                'driver_mobile'        => $request->driver_mobile,
                'total_qty'            => collect($request->sale_items)->sum('qty'),
                'total_discount'       => collect($request->sale_items)->sum('discount'),
                'grand_total'          => collect($request->sale_items)->sum('subtotal'),
                'other_expense_ledger_id' => $request->other_expense_ledger_id,
                'other_amount'         => $request->other_amount ?? 0,
                'total_due'            => collect($request->sale_items)->sum('subtotal'),
                'status'               => $flow === self::FLOW_NONE
                    ? Sale::STATUS_APPROVED
                    : Sale::STATUS_PENDING_SUB,
                /* optional if you already collect these IDs in the form */
                'sub_responsible_id'   => $request->sub_responsible_id,
                'responsible_id'       => $request->responsible_id,
                'created_by'           => auth()->id(),
            ]);

            /* --- detail lines (NO stock decrement yet) --- */
            foreach ($request->sale_items as $row) {
                $sale->saleItems()->create([
                    'product_id'    => $row['product_id'],
                    'qty'           => $row['qty'],
                    'main_price'    => $row['main_price'],
                    'discount'      => $row['discount'] ?? 0,
                    'discount_type' => $row['discount_type'],
                    'subtotal'      => $row['subtotal'],
                    'note'          => $row['note'] ?? null,
                ]);
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            report($e);
            return back()->with('error', 'Failed to save sale.');
        }

        /* ------------------------------------------------------------
     | 2️⃣  Post immediately when no approval flow
     * ------------------------------------------------------------ */
        if ($flow === self::FLOW_NONE) {
            $finalizer->handle($sale, $request->only([
                'amount_received',
                'received_mode_id',
            ]));
        }

        return redirect()
            ->route('sales.index')
            ->with('success', $flow === self::FLOW_NONE
                ? 'Sale saved & approved.'
                : 'Sale saved and awaiting approval.');
    }




    // Edit Sale Form
    // public function edit(Sale $sale)
    // {
    //     if ($sale->created_by !== auth()->id()) {
    //         abort(403);
    //     }

    //     return Inertia::render('sales/edit', [
    //         'sale' => $sale->load([
    //             'saleItems',
    //             'godown',
    //             'salesman',
    //             'accountLedger',
    //             'receivedMode.ledger',
    //         ])->makeVisible(['received_mode_id', 'inventory_ledger_id']),
    //         'cogs_ledger_id' => $sale->cogs_ledger_id,
    //         'godowns' => Godown::where('created_by', auth()->id())->get(),
    //         'salesmen' => Salesman::where('created_by', auth()->id())->get(),
    //         'ledgers' => AccountLedger::where('created_by', auth()->id())->get(), // includes COGS ledgers
    //         'inventoryLedgers' => AccountLedger::where('ledger_type', 'inventory')
    //             ->where('created_by', auth()->id())
    //             ->get(['id', 'account_ledger_name']),
    //         'cogsLedgers' => AccountLedger::where('ledger_type', 'cogs')
    //             ->where('created_by', auth()->id())
    //             ->get(['id', 'account_ledger_name']),
    //         'items' => Item::where('created_by', auth()->id())->get(),
    //         'receivedModes' => ReceivedMode::with(['ledger' => function ($q) {
    //             $q->where('ledger_type', 'received_mode');
    //         }])
    //             ->where('created_by', auth()->id())
    //             ->get(['id', 'mode_name', 'ledger_id']),
    //         'accountGroups' => \App\Models\AccountGroup::where('created_by', auth()->id())->get(['id', 'name']), // optional for modal
    //     ]);
    // }

    public function edit(Sale $sale)
    {
        $ids = godown_scope_ids();
        if (!empty($ids) && !in_array($sale->created_by, $ids)) {
            abort(403);
        }

        return Inertia::render('sales/edit', [
            'sale' => $sale->load([
                'saleItems',
                'godown',
                'salesman',
                'accountLedger',
                'receivedMode.ledger',
            ])->makeVisible(['received_mode_id', 'inventory_ledger_id']),
            'cogs_ledger_id' => $sale->cogs_ledger_id,
            'godowns' => empty($ids) ? Godown::all() : Godown::whereIn('created_by', $ids)->get(),
            'salesmen' => empty($ids) ? Salesman::all() : Salesman::whereIn('created_by', $ids)->get(),
            'ledgers' => empty($ids) ? AccountLedger::all() : AccountLedger::whereIn('created_by', $ids)->get(),
            'inventoryLedgers' => empty($ids)
                ? AccountLedger::where('ledger_type', 'inventory')->get(['id', 'account_ledger_name'])
                : AccountLedger::where('ledger_type', 'inventory')->whereIn('created_by', $ids)->get(['id', 'account_ledger_name']),
            'cogsLedgers' => empty($ids)
                ? AccountLedger::where('ledger_type', 'cogs')->get(['id', 'account_ledger_name'])
                : AccountLedger::where('ledger_type', 'cogs')->whereIn('created_by', $ids)->get(['id', 'account_ledger_name']),
            'items' => empty($ids) ? Item::all() : Item::whereIn('created_by', $ids)->get(),
            'receivedModes' => empty($ids)
                ? ReceivedMode::with(['ledger' => function ($q) {
                    $q->where('ledger_type', 'received_mode');
                }])->get(['id', 'mode_name', 'ledger_id'])
                : ReceivedMode::with(['ledger' => function ($q) {
                    $q->where('ledger_type', 'received_mode');
                }])->whereIn('created_by', $ids)->get(['id', 'mode_name', 'ledger_id']),
            'accountGroups' => \App\Models\AccountGroup::get(['id', 'name']),
        ]);
    }

    // Update Sale
    public function update(Request $request, Sale $sale)
    {
        if ($sale->created_by !== auth()->id()) {
            abort(403);
        }

        $this->validateRequest($request);

        DB::beginTransaction();

        try {
            /* 1️⃣  পুরোনো জার্নাল রোল-ব্যাক + স্টক ফেরত */
            if ($sale->journal_id) {
                $oldEntries = JournalEntry::where('journal_id', $sale->journal_id)->get();
                foreach ($oldEntries as $e) {
                    LedgerService::adjust(
                        $e->account_ledger_id,
                        $e->type === 'debit' ? 'credit' : 'debit',
                        $e->amount
                    );
                }
                JournalEntry::where('journal_id', $sale->journal_id)->delete();
                Journal::where('id', $sale->journal_id)->delete();
            }

            foreach ($sale->saleItems as $oldItem) {
                Stock::where([
                    'item_id'   => $oldItem->product_id,
                    'godown_id' => $sale->godown_id,
                    'created_by' => auth()->id(),
                ])->increment('qty', $oldItem->qty);
            }

            /* 2️⃣  সেল-ডেটা আপডেট */
            $sale->update([
                'date'                 => $request->date,
                'godown_id'            => $request->godown_id,
                'salesman_id'          => $request->salesman_id,
                'account_ledger_id'    => $request->account_ledger_id,
                'phone'                => $request->phone,
                'address'              => $request->address,
                'shipping_details'     => $request->shipping_details,
                'delivered_to'         => $request->delivered_to,
                'truck_rent'           => $request->truck_rent,
                'rent_advance'         => $request->rent_advance,
                'net_rent'             => $request->net_rent,
                'truck_driver_name'    => $request->truck_driver_name,
                'driver_address'       => $request->driver_address,
                'driver_mobile'        => $request->driver_mobile,
                'inventory_ledger_id'  => $request->inventory_ledger_id,
                'cogs_ledger_id'       => $request->cogs_ledger_id,
                'total_qty'            => collect($request->sale_items)->sum('qty'),
                'total_discount'       => collect($request->sale_items)->sum('discount'),
                'grand_total'          => collect($request->sale_items)->sum('subtotal'),
                'other_expense_ledger_id' => $request->other_expense_ledger_id,
                'other_amount'         => $request->other_amount ?? 0,
                // 'received_mode_id'     => $request->received_mode_id,
                // 'amount_received'      => $request->amount_received,
                // 'total_due'            => $request->total_due,
                // 'closing_balance'      => $request->closing_balance,
                'total_due'             => collect($request->sale_items)->sum('subtotal'), // full for now
            ]);

            $sale->saleItems()->delete();

            /* 3️⃣  নতুন সেল-আইটেম + স্টক কমানো ও COST হিসাব */
            $totalCost = 0;
            foreach ($request->sale_items as $row) {
                $sale->saleItems()->create([
                    'product_id'    => $row['product_id'],
                    'qty'           => $row['qty'],
                    'main_price'    => $row['main_price'],
                    'discount'      => $row['discount'] ?? 0,
                    'discount_type' => $row['discount_type'],
                    'subtotal'      => $row['subtotal'],
                    'note'          => $row['note'] ?? null,
                ]);

                Stock::where([
                    'item_id'   => $row['product_id'],
                    'godown_id' => $request->godown_id,
                    'created_by' => auth()->id(),
                ])->decrement('qty', $row['qty']);

                $unitCost = Stock::where([
                    'item_id'   => $row['product_id'],
                    'godown_id' => $request->godown_id,
                    'created_by' => auth()->id(),
                ])->value('avg_cost') ?? 0;

                if ($unitCost == 0) {
                    $unitCost = Item::find($row['product_id'])->purchase_price ?? 0;
                }
                $totalCost += $unitCost * $row['qty'];
            }

            /* 4️⃣  নতুন জার্নাল হেডার */
            $journal = Journal::create([
                'date'         => $request->date,
                'voucher_no'   => $sale->voucher_no,
                'narration'    => 'Updated journal for sale',
                'created_by'   => auth()->id(),
            ]);
            $sale->update(['journal_id' => $journal->id]);

            // automatically find the Sales Income ledger (first match)
            $salesLedgerId = $this->getOrCreateSalesLedgerId();


            /* ---- জরুরি মান ---- */
            $grandTotal     = $sale->grand_total;
            $amountReceived = $request->amount_received ?? 0;
            $customerLedger = $request->account_ledger_id;

            /* 5️⃣  জার্নাল এন্ট্রি — ডাবল-এন্ট্রি কমপ্লিট */
            // $grandTotal      = $sale->grand_total;
            // $amountReceived  = $request->amount_received ?? 0;
            // $customerLedger  = $request->account_ledger_id;
            // $salesLedgerId   = 78;                                  // ← Sales Income ledger ID

            // Dr Accounts Receivable
            JournalEntry::create([
                'journal_id'        => $journal->id,
                'account_ledger_id' => $customerLedger,
                'type'              => 'debit',
                'amount'            => $grandTotal,
                'note'              => 'Sale price receivable',
            ]);
            LedgerService::adjust($customerLedger, 'debit', $grandTotal);

            // Cr Sales Income
            JournalEntry::create([
                'journal_id'        => $journal->id,
                'account_ledger_id' => $salesLedgerId,
                'type'              => 'credit',
                'amount'            => $grandTotal,
                'note'              => 'Sales revenue',
            ]);
            LedgerService::adjust($salesLedgerId, 'credit', $grandTotal);

            // যদি নগদ নেন ➜ Dr Cash / Cr AR
            if (($request->amount_received ?? 0) > 0 && $request->received_mode_id) {
                $mode = ReceivedMode::find($request->received_mode_id);
                SalePaymentService::record($sale, $request->amount_received, Carbon::parse($request->date), $mode, 'Payment recorded while editing invoice');
            }

            // Cr Inventory (at cost)
            JournalEntry::create([
                'journal_id'        => $journal->id,
                'account_ledger_id' => $request->inventory_ledger_id,
                'type'              => 'credit',
                'amount'            => $totalCost,
                'note'              => 'Inventory out (at cost)',
            ]);
            LedgerService::adjust($request->inventory_ledger_id, 'credit', $totalCost);

            // Dr COGS
            JournalEntry::create([
                'journal_id'        => $journal->id,
                'account_ledger_id' => $request->cogs_ledger_id,
                'type'              => 'debit',
                'amount'            => $totalCost,
                'note'              => 'Cost of Goods Sold',
            ]);
            LedgerService::adjust($request->cogs_ledger_id, 'debit', $totalCost);

            DB::commit();
            return redirect()->route('sales.index')
                ->with('success', 'Sale updated and journal reposted!');
        } catch (\Throwable $e) {
            DB::rollBack();
            report($e);
            return back()->with('error', 'Failed to update sale.');
        }
    }




    // Invoice (ERP style print)
    // Invoice (ERP style print)

    private function getOrCreateSalesLedgerId()
    {
        $ledger = AccountLedger::firstOrCreate(
            [
                'ledger_type'     => 'sales',
                'mark_for_user'   => 0,
                'group_under_id'  => 10,
                'created_by'      => auth()->id(),
            ],
            [
                'account_ledger_name' => 'Sales Income',
                'opening_balance'     => 0,
                'debit_credit'        => 'credit',
                'status'              => 'active',
                'phone_number'        => '0000000000',
            ]
        );

        return $ledger->id;
    }


    public function invoice(Sale $sale)
    {
        $sale->load([
            'saleItems.item.unit',   // unit eager-loaded like purchases
            'godown',
            'salesman',
            'accountLedger',
        ]);

        return Inertia::render('sales/print/invoice', [
            'sale'        => $sale,
            'company'     => company_info(),                 // ← same helper
            'amountWords' => numberToWords((int) $sale->grand_total),
        ]);
    }

    public function truckChalan(Sale $sale)
    {
        $sale->load([
            'saleItems.item.unit',
            'godown',
            'salesman',
            'accountLedger',
        ]);

        return Inertia::render('sales/print/truck-chalan', [
            'sale'        => $sale,
            'company'     => company_info(),
            'amountWords' => numberToWords((int) $sale->grand_total),
        ]);
    }

    public function loadSlip(Sale $sale)
    {
        $sale->load([
            'saleItems.item.unit',
            'godown',
            'salesman',
            'accountLedger',
        ]);

        return Inertia::render('sales/print/load-slip', [
            'sale'        => $sale,
            'company'     => company_info(),
            'amountWords' => numberToWords((int) $sale->grand_total),
        ]);
    }

    public function gatePass(Sale $sale)
    {
        $sale->load([
            'saleItems.item.unit',
            'godown',
            'salesman',
            'accountLedger',
        ]);

        return Inertia::render('sales/print/gate-pass', [
            'sale'        => $sale,
            'company'     => company_info(),
            'amountWords' => numberToWords((int) $sale->grand_total),
        ]);
    }

    // Destroy Sale (already present)
    // public function destroy(Sale $sale)
    // {
    //     if ($sale->created_by !== auth()->id()) {
    //         abort(403);
    //     }

    //     $sale->delete();
    //     return redirect()->back()->with('success', 'Sale deleted successfully!');
    // }

    public function destroy(Sale $sale)
    {
        $ids = godown_scope_ids();
        if (!empty($ids) && !in_array($sale->created_by, $ids)) {
            abort(403);
        }

        $sale->delete();
        return redirect()->back()->with('success', 'Sale deleted successfully!');
    }

    // 🔄 Validation Rules
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'date' => 'required|date',
            'godown_id' => 'required|exists:godowns,id',
            'salesman_id' => 'required|exists:salesmen,id',
            'account_ledger_id' => 'required|exists:account_ledgers,id',
            'sale_items' => 'required|array|min:1',
            'sale_items.*.product_id' => 'required|exists:items,id',
            'sale_items.*.qty' => 'required|numeric|min:0.01',
            'sale_items.*.main_price' => 'required|numeric|min:0',
            'sale_items.*.discount' => 'nullable|numeric|min:0',
            'sale_items.*.discount_type' => 'required|in:bdt,percent',
            'sale_items.*.subtotal' => 'required|numeric|min:0',
            'received_mode_id' => 'nullable|exists:received_modes,id',
            'amount_received' => 'nullable|numeric|min:0',
        ]);
    }

    // public function getItemsByGodown($godownId)
    // {
    //     $userId = auth()->id();

    //     // Querying the stock data from the 'stocks' table and including the quantity
    //     $stocks = Stock::with('item.unit') // Include unit information if needed
    //         ->where('godown_id', $godownId)
    //         ->where('created_by', $userId)
    //         ->get();

    //     // Map the stock data to return a list with the item's name, unit, and available stock quantity
    //     $result = $stocks->map(function ($stock) {
    //         return [
    //             'id'        => $stock->item->id,
    //             'item_name' => $stock->item->item_name,
    //             'unit'      => $stock->item->unit->name ?? '', // Add unit name if needed
    //             'stock_qty' => $stock->qty, // Get the stock quantity from the 'stocks' table
    //         ];
    //     });

    //     \Log::info($result); // Check the returned result
    //     return response()->json($result); // Return the updated list to the frontend

    // }

    public function getItemsByGodown($godownId)
    {
        $ids = godown_scope_ids();

        $stocks = Stock::with('item.unit')
            ->where('godown_id', $godownId)
            ->when(!empty($ids), function ($q) use ($ids) {
                $q->whereIn('created_by', $ids);
            })
            ->get();

        $result = $stocks->map(function ($stock) {
            return [
                'id'        => $stock->item->id,
                'item_name' => $stock->item->item_name,
                'unit'      => $stock->item->unit->name ?? '',
                'stock_qty' => $stock->qty,
            ];
        });

        \Log::info($result);
        return response()->json($result);
    }
}
