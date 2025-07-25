<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\SalesOrder;

use App\Models\SalesOrderItem;
use App\Models\AccountLedger;
use App\Models\Salesman;
use App\Models\Item;
use App\Models\Unit;
use App\Models\Godown;
use App\Models\CompanySetting;
use App\Models\Stock;
use Inertia\Inertia;
use function company_info;
use function numberToWords;
use function godown_scope_ids;



class SalesOrderController extends Controller
{
    //
    // public function index()
    // {
    //     $salesOrders = SalesOrder::query()
    //         ->with('ledger', 'salesman', 'items.product')
    //         ->when(!auth()->user()->hasRole('admin'), function ($query) {
    //             $query->where('created_by', auth()->id());
    //         })
    //         ->latest()
    //         ->paginate(10);

    //     return Inertia::render('sales-orders/index', [
    //         'salesOrders' => $salesOrders,
    //         'currentPage' => $salesOrders->currentPage(),
    //         'perPage' => $salesOrders->perPage(),
    //     ]);
    // }

    public function index()
    {
        $ids = godown_scope_ids();

        $salesOrders = SalesOrder::query()
            ->with('ledger', 'salesman', 'items.product')
            ->when(!empty($ids), function ($query) use ($ids) {
                $query->whereIn('created_by', $ids);
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('sales-orders/index', [
            'salesOrders' => $salesOrders,
            'currentPage' => $salesOrders->currentPage(),
            'perPage' => $salesOrders->perPage(),
        ]);
    }

    // public function create()
    // {
    //     $user  = auth()->user();
    //     $me    = $user->id;
    //     $owner = $user->creator_id;        // null for owners / admin

    //     return Inertia::render('sales-orders/create', [
    //         'ledgers'  => AccountLedger::select('id', 'account_ledger_name as name')
    //             ->where('created_by', $me)->get(),

    //         'salesmen' => Salesman::select('id', 'name')
    //             ->where('created_by', $me)->get(),

    //         /*  🟢  CHANGE THIS BLOCK  ────────────────────────── */
    //         'products' => Item::select('id', 'item_name as name', 'unit_id')
    //             ->with('unit')
    //             ->withSum(
    //                 [
    //                     'stocks as stock' => fn($q) =>
    //                     $q->where('created_by', $me)        // tenant-safe
    //                 ],
    //                 'qty'                                   // sum qty column
    //             )
    //             ->where('created_by', $me)
    //             ->get(),
    //         /*  ──────────────────────────────────────────────── */

    //         'units'    => Unit::select('id', 'name')
    //             ->when(
    //                 ! $user->hasRole('admin'),
    //                 fn($q) => $q->whereIn('created_by', $owner ? [$me, $owner] : [$me])
    //             )
    //             ->get(),

    //         'godowns'  => Godown::select('id', 'name')
    //             ->where('created_by', $me)->get(),
    //     ]);
    // }

    public function create()
    {
        $ids = godown_scope_ids();

        return Inertia::render('sales-orders/create', [
            'ledgers'  => empty($ids)
                ? AccountLedger::select('id', 'account_ledger_name as name')->get()
                : AccountLedger::select('id', 'account_ledger_name as name')->whereIn('created_by', $ids)->get(),

            'salesmen' => empty($ids)
                ? Salesman::select('id', 'name')->get()
                : Salesman::select('id', 'name')->whereIn('created_by', $ids)->get(),

            'products' => Item::select('id', 'item_name as name', 'unit_id')
                ->with('unit')
                ->withSum(
                    [
                        'stocks as stock' => fn($q) =>
                        empty($ids) ? $q : $q->whereIn('created_by', $ids)
                    ],
                    'qty'
                )
                ->when(!empty($ids), fn($q) => $q->whereIn('created_by', $ids))
                ->get(),

            'units'    => Unit::select('id', 'name')
                ->when(!empty($ids), fn($q) => $q->whereIn('created_by', $ids))
                ->get(),

            'godowns'  => empty($ids)
                ? Godown::select('id', 'name')->get()
                : Godown::select('id', 'name')->whereIn('created_by', $ids)->get(),
        ]);
    }


    public function store(Request $request)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'ledger_id' => 'required|exists:account_ledgers,id',
            'salesman_id' => 'nullable|exists:salesmen,id',
            'shipping_details' => 'nullable|string',
            'delivered_to' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:items,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_id' => 'required|exists:units,id',
            'items.*.rate' => 'required|numeric|min:0',
            'items.*.discount_type' => 'nullable|in:flat,percentage',
            'items.*.discount_value' => 'nullable|numeric|min:0',
            'items.*.subtotal' => 'required|numeric|min:0',
        ]);

        $voucherNo = 'SO-' . str_pad(SalesOrder::max('id') + 1, 5, '0', STR_PAD_LEFT);

        $salesOrder = SalesOrder::create([
            'voucher_no' => $voucherNo,
            'date' => $data['date'],
            'account_ledger_id' => $data['ledger_id'],

            'salesman_id' => $data['salesman_id'],
            'shipping_details' => $data['shipping_details'],
            'delivered_to' => $data['delivered_to'],
            'total_qty' => collect($data['items'])->sum('quantity'),
            'total_amount' => collect($data['items'])->sum('subtotal'),
            'created_by' => auth()->id(),
        ]);

        foreach ($data['items'] as $item) {
            $salesOrder->items()->create($item);
        }

        return redirect()->route('sales-orders.index')->with('success', 'Sales Order Created Successfully!');
    }

    // public function edit(SalesOrder $salesOrder)
    // {
    //     $userId = auth()->id();

    //     // Prevent non-admin users from editing others' orders
    //     if (!auth()->user()->hasRole('admin') && $salesOrder->created_by !== $userId) {
    //         abort(403, 'Unauthorized access');
    //     }

    //     return Inertia::render('sales-orders/edit', [
    //         'salesOrder' => $salesOrder->load('items.product', 'items.unit'),
    //         'ledgers' => AccountLedger::select('id', 'account_ledger_name as name')
    //             ->where('created_by', $userId)
    //             ->get(),

    //         'salesmen' => Salesman::select('id', 'name')
    //             ->where('created_by', $userId)
    //             ->get(),

    //         'products' => Item::select('id', 'item_name as name', 'unit_id')
    //             ->with('unit')
    //             ->withSum(
    //                 [
    //                     'stocks as stock' => fn($q) =>
    //                     $q->where('created_by', $userId)
    //                 ],
    //                 'qty'
    //             )
    //             ->where('created_by', $userId)
    //             ->get(),


    //         'units' => Unit::select('id', 'name')
    //             ->when(
    //                 ! auth()->user()->hasRole('admin'),
    //                 fn($q) => $q->whereIn(
    //                     'created_by',
    //                     auth()->user()->creator_id
    //                         ? [auth()->id(), auth()->user()->creator_id]
    //                         : [auth()->id()]
    //                 )
    //             )
    //             ->get(),

    //         'godowns' => Godown::select('id', 'name')
    //             ->where('created_by', $userId)
    //             ->get(),
    //     ]);
    // }

    public function edit(SalesOrder $salesOrder)
    {
        $ids = godown_scope_ids();

        if (!empty($ids) && !in_array($salesOrder->created_by, $ids)) {
            abort(403, 'Unauthorized access');
        }

        return Inertia::render('sales-orders/edit', [
            'salesOrder' => $salesOrder->load('items.product', 'items.unit'),
            'ledgers' => empty($ids)
                ? AccountLedger::select('id', 'account_ledger_name as name')->get()
                : AccountLedger::select('id', 'account_ledger_name as name')->whereIn('created_by', $ids)->get(),

            'salesmen' => empty($ids)
                ? Salesman::select('id', 'name')->get()
                : Salesman::select('id', 'name')->whereIn('created_by', $ids)->get(),

            'products' => Item::select('id', 'item_name as name', 'unit_id')
                ->with('unit')
                ->withSum(
                    [
                        'stocks as stock' => fn($q) =>
                        empty($ids) ? $q : $q->whereIn('created_by', $ids)
                    ],
                    'qty'
                )
                ->when(!empty($ids), fn($q) => $q->whereIn('created_by', $ids))
                ->get(),

            'units' => Unit::select('id', 'name')
                ->when(!empty($ids), fn($q) => $q->whereIn('created_by', $ids))
                ->get(),

            'godowns' => empty($ids)
                ? Godown::select('id', 'name')->get()
                : Godown::select('id', 'name')->whereIn('created_by', $ids)->get(),
        ]);
    }

    public function update(Request $request, $id)
    {
        // Validate the request
        $validated = $request->validate([
            'date' => 'required|date',
            'voucher_no' => 'required|string',
            'ledger_id' => 'required|exists:account_ledgers,id',
            'salesman_id' => 'nullable|exists:salesmen,id',
            'godown_id' => 'nullable|integer',
            'shipping_details' => 'nullable|string',
            'delivered_to' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:items,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_id' => 'required|exists:units,id',
            'items.*.rate' => 'required|numeric|min:0',
            'items.*.discount_type' => 'nullable|in:flat,percentage',
            'items.*.discount_value' => 'nullable|numeric|min:0',
            'items.*.subtotal' => 'required|numeric|min:0',
        ]);

        // Find the sales order
        $order = SalesOrder::findOrFail($id);

        // Update the sales order
        $order->update([
            'date' => $validated['date'],
            'voucher_no' => $validated['voucher_no'],
            'account_ledger_id' => $validated['ledger_id'],
            'salesman_id' => $validated['salesman_id'],
            'godown_id' => $validated['godown_id'],
            'shipping_details' => $validated['shipping_details'],
            'delivered_to' => $validated['delivered_to'],
            'total_qty' => collect($validated['items'])->sum('quantity'),
            'total_amount' => collect($validated['items'])->sum('subtotal'),
        ]);

        // Update items: simplest way is to delete old and insert new
        $order->items()->delete();
        foreach ($validated['items'] as $item) {
            $order->items()->create($item);
        }

        return redirect()->route('sales-orders.index')->with('success', 'Sales order updated successfully.');
    }

    // public function destroy(SalesOrder $salesOrder)
    // {
    //     // Optional: delete related items first (if you want to clear them manually)
    //     $salesOrder->items()->delete();

    //     // Delete the main sales order
    //     $salesOrder->delete();

    //     return redirect()->back()->with('success', 'Sales Order deleted successfully!');
    // }

    public function destroy(SalesOrder $salesOrder)
    {
        $ids = godown_scope_ids();
        if (!empty($ids) && !in_array($salesOrder->created_by, $ids)) {
            abort(403, 'Unauthorized access');
        }

        $salesOrder->items()->delete();
        $salesOrder->delete();

        return redirect()->back()->with('success', 'Sales Order deleted successfully!');
    }

    // public function invoice(SalesOrder $salesOrder)
    // {
    //     /* tenant safety */
    //     if (
    //         ! auth()->user()->hasRole('admin') &&
    //         $salesOrder->created_by !== auth()->id()
    //     ) {
    //         abort(403, 'Unauthorised');
    //     }

    //     /* eager-load what the front-end needs */
    //     $salesOrder->load([
    //         'ledger',                 // supplier / customer ledger
    //         'salesman',
    //         'items.product.unit',     // product → unit name
    //     ]);

    //     return Inertia::render('sales-orders/invoice', [
    //         'order'       => $salesOrder,
    //         'company'     => company_info(),                     // helper
    //         'amountWords' => numberToWords((int)$salesOrder->total_amount),
    //     ]);
    // }

    public function invoice(SalesOrder $salesOrder)
    {
        $ids = godown_scope_ids();
        if (!empty($ids) && !in_array($salesOrder->created_by, $ids)) {
            abort(403, 'Unauthorised');
        }

        $salesOrder->load([
            'ledger',
            'salesman',
            'items.product.unit',
        ]);

        return Inertia::render('sales-orders/invoice', [
            'order'       => $salesOrder,
            'company'     => company_info(),
            'amountWords' => numberToWords((int)$salesOrder->total_amount),
        ]);
    }

    public function getProductsByGodown($godownId)
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
                'name'      => $stock->item->item_name,
                'unit'      => ['name' => $stock->item->unit->name ?? ''],
                'stock'     => $stock->qty,
                'unit_id'   => $stock->item->unit_id,
            ];
        });

        return response()->json($result);
    }

}
