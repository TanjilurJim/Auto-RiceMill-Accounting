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


class SalesOrderController extends Controller
{
    //
    public function index()
    {
        $salesOrders = SalesOrder::query()
            ->with('ledger', 'salesman', 'items.product')
            ->when(!auth()->user()->hasRole('admin'), function ($query) {
                $query->where('created_by', auth()->id());
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('sales-orders/index', [
            'salesOrders' => $salesOrders,
            'currentPage' => $salesOrders->currentPage(),
            'perPage' => $salesOrders->perPage(),
        ]);
    }

    public function create()
    {
        $user  = auth()->user();
        $me    = $user->id;
        $owner = $user->creator_id;        // null for owners / admin

        return Inertia::render('sales-orders/create', [
            'ledgers'  => AccountLedger::select('id', 'account_ledger_name as name')
                ->where('created_by', $me)->get(),

            'salesmen' => Salesman::select('id', 'name')
                ->where('created_by', $me)->get(),

            /*  🟢  CHANGE THIS BLOCK  ────────────────────────── */
            'products' => Item::select('id', 'item_name as name', 'unit_id')
                ->with('unit')
                ->withSum(
                    [
                        'stocks as stock' => fn($q) =>
                        $q->where('created_by', $me)        // tenant-safe
                    ],
                    'qty'                                   // sum qty column
                )
                ->where('created_by', $me)
                ->get(),
            /*  ──────────────────────────────────────────────── */

            'units'    => Unit::select('id', 'name')
                ->when(
                    ! $user->hasRole('admin'),
                    fn($q) => $q->whereIn('created_by', $owner ? [$me, $owner] : [$me])
                )
                ->get(),

            'godowns'  => Godown::select('id', 'name')
                ->where('created_by', $me)->get(),
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
    public function destroy(SalesOrder $salesOrder)
    {
        // Optional: delete related items first (if you want to clear them manually)
        $salesOrder->items()->delete();

        // Delete the main sales order
        $salesOrder->delete();

        return redirect()->back()->with('success', 'Sales Order deleted successfully!');
    }

    public function edit(SalesOrder $salesOrder)
    {
        $userId = auth()->id();

        // Prevent non-admin users from editing others' orders
        if (!auth()->user()->hasRole('admin') && $salesOrder->created_by !== $userId) {
            abort(403, 'Unauthorized access');
        }

        return Inertia::render('sales-orders/edit', [
            'salesOrder' => $salesOrder->load('items.product', 'items.unit'),
            'ledgers' => AccountLedger::select('id', 'account_ledger_name as name')
                ->where('created_by', $userId)
                ->get(),

            'salesmen' => Salesman::select('id', 'name')
                ->where('created_by', $userId)
                ->get(),

            'products' => Item::select('id', 'item_name as name', 'unit_id')
                ->with('unit')
                ->withSum(
                    [
                        'stocks as stock' => fn($q) =>
                        $q->where('created_by', $userId)
                    ],
                    'qty'
                )
                ->where('created_by', $userId)
                ->get(),


            'units' => Unit::select('id', 'name')
                ->when(
                    ! auth()->user()->hasRole('admin'),
                    fn($q) => $q->whereIn(
                        'created_by',
                        auth()->user()->creator_id
                            ? [auth()->id(), auth()->user()->creator_id]
                            : [auth()->id()]
                    )
                )
                ->get(),

            'godowns' => Godown::select('id', 'name')
                ->where('created_by', $userId)
                ->get(),
        ]);
    }

    public function invoice(SalesOrder $salesOrder)
    {
        /* tenant safety */
        if (
            ! auth()->user()->hasRole('admin') &&
            $salesOrder->created_by !== auth()->id()
        ) {
            abort(403, 'Unauthorised');
        }

        /* eager-load what the front-end needs */
        $salesOrder->load([
            'ledger',                 // supplier / customer ledger
            'salesman',
            'items.product.unit',     // product → unit name
        ]);

        return Inertia::render('sales-orders/invoice', [
            'order'       => $salesOrder,
            'company'     => company_info(),                     // helper
            'amountWords' => numberToWords((int)$salesOrder->total_amount),
        ]);
    }
}
