<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Godown;
use App\Models\Salesman;
use App\Models\AccountLedger;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SaleController extends Controller
{
    // List Sales
    public function index()
    {
        $sales = Sale::with([
            'godown',
            'salesman',
            'accountLedger',
            'saleItems.item',
            'creator'
        ])
            ->where('created_by', auth()->id())
            ->orderBy('id', 'desc')
            ->paginate(10);

        return Inertia::render('sales/index', [
            'sales' => $sales
        ]);
    }

    // Create Sale Form
    public function create()
    {
        return Inertia::render('sales/create', [
            'godowns' => Godown::where('created_by', auth()->id())->get(),
            'salesmen' => Salesman::where('created_by', auth()->id())->get(),
            'ledgers' => AccountLedger::where('created_by', auth()->id())->get(),
            'items' => Item::where('created_by', auth()->id())->get(),
        ]);
    }

    // Store Sale
    public function store(Request $request)
    {
        $this->validateRequest($request);

        $voucherNo = $request->voucher_no ?? 'SAL-' . now()->format('Ymd') . '-' . str_pad(Sale::max('id') + 1, 4, '0', STR_PAD_LEFT);

        $sale = Sale::create([
            'date' => $request->date,
            'voucher_no' => $voucherNo,
            'godown_id' => $request->godown_id,
            'salesman_id' => $request->salesman_id,
            'account_ledger_id' => $request->account_ledger_id,
            'phone' => $request->phone,
            'address' => $request->address,
            'shipping_details' => $request->shipping_details,
            'delivered_to' => $request->delivered_to,
            'truck_rent' => $request->truck_rent,
            'rent_advance' => $request->rent_advance,
            'net_rent' => $request->net_rent,
            'truck_driver_name' => $request->truck_driver_name,
            'driver_address' => $request->driver_address,
            'driver_mobile' => $request->driver_mobile,
            'total_qty' => collect($request->sale_items)->sum('qty'),
            'total_discount' => collect($request->sale_items)->sum('discount'),
            'grand_total' => collect($request->sale_items)->sum('subtotal'),
            'other_expense_ledger_id' => $request->other_expense_ledger_id,
            'other_amount' => $request->other_amount ?? 0,
            'receive_mode' => $request->receive_mode,
            'receive_amount' => $request->receive_amount,
            'total_due' => $request->total_due,
            'closing_balance' => $request->closing_balance,
            'created_by' => auth()->id(),
        ]);

        foreach ($request->sale_items as $item) {
            $sale->saleItems()->create([
                'product_id' => $item['product_id'],
                'qty' => $item['qty'],
                'main_price' => $item['main_price'],
                'discount' => $item['discount'] ?? 0,
                'discount_type' => $item['discount_type'],
                'subtotal' => $item['subtotal'],
                'note' => $item['note'] ?? null,
            ]);
        }

        return redirect()->route('sales.index')->with('success', 'Sale created successfully!');
    }

    // Edit Sale Form
    public function edit(Sale $sale)
    {
        if ($sale->created_by !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('sales/edit', [
            'sale' => $sale->load(['saleItems', 'godown', 'salesman', 'accountLedger']),
            'godowns' => Godown::where('created_by', auth()->id())->get(),
            'salesmen' => Salesman::where('created_by', auth()->id())->get(),
            'ledgers' => AccountLedger::where('created_by', auth()->id())->get(),
            'items' => Item::where('created_by', auth()->id())->get(),
        ]);
    }

    // Update Sale
    public function update(Request $request, Sale $sale)
    {
        if ($sale->created_by !== auth()->id()) {
            abort(403);
        }

        $this->validateRequest($request);

        $sale->update([
            'date' => $request->date,
            'godown_id' => $request->godown_id,
            'salesman_id' => $request->salesman_id,
            'account_ledger_id' => $request->account_ledger_id,
            'phone' => $request->phone,
            'address' => $request->address,
            'shipping_details' => $request->shipping_details,
            'delivered_to' => $request->delivered_to,
            'truck_rent' => $request->truck_rent,
            'rent_advance' => $request->rent_advance,
            'net_rent' => $request->net_rent,
            'truck_driver_name' => $request->truck_driver_name,
            'driver_address' => $request->driver_address,
            'driver_mobile' => $request->driver_mobile,
            'total_qty' => collect($request->sale_items)->sum('qty'),
            'total_discount' => collect($request->sale_items)->sum('discount'),
            'grand_total' => collect($request->sale_items)->sum('subtotal'),
            'other_expense_ledger_id' => $request->other_expense_ledger_id,
            'other_amount' => $request->other_amount ?? 0,
            'receive_mode' => $request->receive_mode,
            'receive_amount' => $request->receive_amount,
            'total_due' => $request->total_due,
            'closing_balance' => $request->closing_balance,
        ]);

        $sale->saleItems()->delete();
        foreach ($request->sale_items as $item) {
            $sale->saleItems()->create([
                'product_id' => $item['product_id'],
                'qty' => $item['qty'],
                'main_price' => $item['main_price'],
                'discount' => $item['discount'] ?? 0,
                'discount_type' => $item['discount_type'],
                'subtotal' => $item['subtotal'],
                'note' => $item['note'] ?? null,
            ]);
        }

        return redirect()->route('sales.index')->with('success', 'Sale updated successfully!');
    }

    // Invoice (ERP style print)
    // Invoice (ERP style print)
    public function invoice(Sale $sale)
    {
        $sale->load(['saleItems.item', 'godown', 'salesman', 'accountLedger']);
        return Inertia::render('sales/print/invoice', [
            'sale' => $sale,
            'company' => auth()->user() // Passing company details (User model)
        ]);
    }

    // Truck Chalan (ERP style print)
    public function truckChalan(Sale $sale)
    {
        $sale->load(['saleItems.item', 'godown', 'salesman', 'accountLedger']);
        return Inertia::render('sales/print/truck-chalan', [
            'sale' => $sale,
            'company' => auth()->user() // Passing company details (User model)
        ]);
    }

    // Load Slip (ERP style print)
    public function loadSlip(Sale $sale)
    {
        $sale->load(['saleItems.item', 'godown', 'salesman', 'accountLedger']);
        return Inertia::render('sales/print/load-slip', [
            'sale' => $sale,
            'company' => auth()->user() // Passing company details (User model)
        ]);
    }

    // Gate Pass (ERP style print)
    public function gatePass(Sale $sale)
    {
        $sale->load(['saleItems.item', 'godown', 'salesman', 'accountLedger']);
        return Inertia::render('sales/print/gate-pass', [
            'sale' => $sale,
            'company' => auth()->user() // Passing company details (User model)
        ]);
    }


    // Destroy Sale (already present)
    public function destroy(Sale $sale)
    {
        if ($sale->created_by !== auth()->id()) {
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
        ]);
    }
}
