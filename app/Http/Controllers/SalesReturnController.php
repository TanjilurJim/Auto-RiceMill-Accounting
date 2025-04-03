<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SalesReturn;
use App\Models\SalesReturnItem;
use App\Models\Godown; // ✅ add this line
use App\Models\Salesman; // ✅ add this line
use App\Models\Item; // ✅ add this line
use App\Models\AccountLedger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesReturnController extends Controller
{
    // Show list of sales returns
    public function index()
    {
        $salesReturns = SalesReturn::with(['sale', 'accountLedger']) // Ensure accountLedger is eager-loaded
            ->where('created_by', auth()->id())
            ->orderBy('id', 'desc')
            ->paginate(10);

        return Inertia::render('sales_returns/index', [
            'salesReturns' => $salesReturns
        ]);
    }

    // Show create form
    public function create()
    {
        $voucher = 'RET-' . now()->format('Ymd') . '-' . str_pad(SalesReturn::max('id') + 1, 4, '0', STR_PAD_LEFT);

        return Inertia::render('sales_returns/create', [
            'voucher' => $voucher, // ✅ Pass voucher
            'sales' => Sale::where('created_by', auth()->id())->get(),
            'ledgers' => AccountLedger::where('created_by', auth()->id())->get(),
            'products' => Item::where('created_by', auth()->id())->get(),
            'godowns' => Godown::where('created_by', auth()->id())->get(),
            'salesmen' => Salesman::where('created_by', auth()->id())->get(),
        ]);
    }


    // Store new sales return
    public function store(Request $request)
    {
        $request->validate([
            'sale_id' => 'nullable|exists:sales,id',
            'voucher_no' => 'required|string|max:255|unique:sales_returns,voucher_no',
            'account_ledger_id' => 'required|exists:account_ledgers,id',
            'godown_id' => 'required|exists:godowns,id',
            'salesman_id' => 'required|exists:salesmen,id',
            'return_date' => 'required|date',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'shipping_details' => 'nullable|string|max:255',
            'delivered_to' => 'nullable|string|max:255',
            'reason' => 'nullable|string|max:1000',
            'sales_return_items' => 'required|array|min:1',
            'sales_return_items.*.product_id' => 'required|exists:items,id',
            'sales_return_items.*.qty' => 'required|numeric|min:0.01',
            'sales_return_items.*.main_price' => 'required|numeric|min:0',
            'sales_return_items.*.discount' => 'nullable|numeric|min:0',
            'sales_return_items.*.return_amount' => 'required|numeric|min:0',
        ]);

        $salesReturn = SalesReturn::create([
            'sale_id' => $request->sale_id, // Removed input, optional
            'voucher_no' => $request->voucher_no,
            'account_ledger_id' => $request->account_ledger_id,
            'godown_id' => $request->godown_id,
            'salesman_id' => $request->salesman_id,
            'return_date' => $request->return_date,
            'phone' => $request->phone,
            'address' => $request->address,
            'shipping_details' => $request->shipping_details,
            'delivered_to' => $request->delivered_to,
            'reason' => $request->reason,
            'total_qty' => collect($request->sales_return_items)->sum('qty'),
            'total_return_amount' => collect($request->sales_return_items)->sum('return_amount'),
            'created_by' => auth()->id(),
        ]);

        foreach ($request->sales_return_items as $item) {
            $salesReturn->items()->create([
                'product_id' => $item['product_id'],
                'qty' => $item['qty'],
                'main_price' => $item['main_price'],
                'return_amount' => $item['return_amount'],
            ]);
        }

        return redirect()->route('sales-returns.index')->with('success', 'Sales Return created successfully!');
    }


    // Show edit form
    public function edit(SalesReturn $salesReturn)
    {
        $salesReturn->load(['items', 'sale']); // load related sale as well

        return Inertia::render('sales_returns/edit', [
            'salesReturn' => $salesReturn,
            'sales' => Sale::where('created_by', auth()->id())->get(),
            'ledgers' => AccountLedger::where('created_by', auth()->id())->get(),
            'products' => Item::where('created_by', auth()->id())->get(),
            'godowns' => Godown::where('created_by', auth()->id())->get(),
            'salesmen' => Salesman::where('created_by', auth()->id())->get(),
        ]);
    }

    // Update sales return
    public function update(Request $request, SalesReturn $salesReturn)
    {
        $request->validate([
            'return_date' => 'required|date',
            'reason' => 'nullable|string|max:1000',
            'sales_return_items' => 'required|array|min:1',
            'sales_return_items.*.product_id' => 'required|exists:items,id',
            'sales_return_items.*.qty' => 'required|numeric|min:0.01',
            'sales_return_items.*.main_price' => 'required|numeric|min:0',
        ]);

        $salesReturn->update([
            'return_date' => $request->return_date,
            'reason' => $request->reason,
            'total_qty' => collect($request->sales_return_items)->sum('qty'),
            'total_return_amount' => collect($request->sales_return_items)->sum('return_amount'),
        ]);

        $salesReturn->items()->delete();
        foreach ($request->sales_return_items as $item) {
            $salesReturn->items()->create([
                'product_id' => $item['product_id'],
                'qty' => $item['qty'],
                'main_price' => $item['main_price'],
                'return_amount' => $item['return_amount'],
            ]);
        }

        return redirect()->route('sales-returns.index')->with('success', 'Sales Return updated successfully!');
    }

    public function invoice(SalesReturn $salesReturn)
    {
        $salesReturn->load(['items.product.unit', 'accountLedger', 'sale']); // eager load relationships

        // dd($salesReturn->items->first()->product->unit);

        return Inertia::render('sales_returns/invoice', [
            'salesReturn' => $salesReturn,
        ]);
    }


    // Delete sales return
    public function destroy(SalesReturn $salesReturn)
    {
        $salesReturn->delete();
        return redirect()->back()->with('success', 'Sales Return deleted successfully!');
    }
}
