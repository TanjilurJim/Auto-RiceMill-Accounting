<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Godown;
use App\Models\Salesman;
use App\Models\AccountLedger;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;


class PurchaseController extends Controller
{

    // Show list of purchases
    public function index()
    {
        $purchases = Purchase::with([
            'godown',
            'salesman',
            'accountLedger',
            'purchaseItems.item', // 🟢 Eager load item inside purchaseItems!
            'creator'
        ])

            ->where('created_by', auth()->id())
            ->orderBy('id', 'desc')
            ->paginate(10);


        return Inertia::render('purchases/index', [
            'purchases' => $purchases
        ]);
    }

    // Show create form
    public function create()
    {
        $queryScope = auth()->user()->hasRole('admin')
            ? fn($query) => $query
            : fn($query) => $query->where('created_by', auth()->id());

        return Inertia::render('purchases/create', [
            'godowns' => Godown::when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))->get(),
            'salesmen' => Salesman::when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))->get(),
            'ledgers' => AccountLedger::when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))->get(),
            'items' => Item::when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))->get(),
        ]);
    }


    // Store purchase
    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'voucher_no' => 'nullable|unique:purchases,voucher_no',
            'godown_id' => 'required|exists:godowns,id',
            'salesman_id' => 'required|exists:salesmen,id',
            'account_ledger_id' => 'required|exists:account_ledgers,id',
            'purchase_items' => 'required|array|min:1',
            'purchase_items.*.product_id' => 'required|exists:items,id',
            'purchase_items.*.qty' => 'required|numeric|min:0.01',
            'purchase_items.*.price' => 'required|numeric|min:0',
            'purchase_items.*.discount' => 'nullable|numeric|min:0',
            'purchase_items.*.discount_type' => 'required|in:bdt,percent',
            'purchase_items.*.subtotal' => 'required|numeric|min:0',
        ]);
        $voucherNo = $request->voucher_no ?? 'PUR-' . now()->format('Ymd') . '-' . str_pad(Purchase::max('id') + 1, 4, '0', STR_PAD_LEFT);
        // Save Purchase record
        $purchase = Purchase::create([
            'date' => $request->date,
            'voucher_no' => $voucherNo,
            'godown_id' => $request->godown_id,
            'salesman_id' => $request->salesman_id,
            'account_ledger_id' => $request->account_ledger_id,
            'phone' => $request->phone,
            'address' => $request->address,
            'shipping_details' => $request->shipping_details, // 🚨 ADD THIS
            'delivered_to' => $request->delivered_to,
            'total_qty' => collect($request->purchase_items)->sum('qty'),
            'total_price' => collect($request->purchase_items)->sum('subtotal'),
            'total_discount' => collect($request->purchase_items)->sum('discount'),
            'grand_total' => collect($request->purchase_items)->sum('subtotal'),
            'created_by' => auth()->id(),
        ]);

        // Save each Purchase Item
        foreach ($request->purchase_items as $item) {
            $purchase->purchaseItems()->create([
                'product_id' => $item['product_id'],
                'qty' => $item['qty'],
                'price' => $item['price'],
                'discount' => $item['discount'] ?? 0,
                'discount_type' => $item['discount_type'],
                'subtotal' => $item['subtotal'],
            ]);
        }

        return redirect()->route('purchases.index')->with('success', 'Purchase created successfully!');
    }
    public function edit(Purchase $purchase)
    {
        // Manual authorization (multi-tenant check)
        if ($purchase->created_by !== auth()->id() && !auth()->user()->hasRole('admin')) {
            abort(403);
        }

        return Inertia::render('purchases/edit', [
            'purchase' => $purchase->load(['purchaseItems', 'godown', 'salesman', 'accountLedger']),
            'godowns' => Godown::when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))->get(),
            'salesmen' => Salesman::when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))->get(),
            'ledgers' => AccountLedger::when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))->get(),
            'items' => Item::when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))->get(),
        ]);
    }



    // Update purchase
    public function update(Request $request, Purchase $purchase)
    {
        // Manual authorization (multi-tenant check)
        if ($purchase->created_by !== auth()->id() && !auth()->user()->hasRole('admin')) {
            abort(403);
        }

        $request->validate([
            'date' => 'required|date',
            'godown_id' => 'required|exists:godowns,id',
            'salesman_id' => 'required|exists:salesmen,id',
            'account_ledger_id' => 'required|exists:account_ledgers,id',
            'purchase_items' => 'required|array|min:1',
            'purchase_items.*.product_id' => 'required|exists:items,id',
            'purchase_items.*.qty' => 'required|numeric|min:0.01',
            'purchase_items.*.price' => 'required|numeric|min:0',
            'purchase_items.*.discount' => 'nullable|numeric|min:0',
            'purchase_items.*.discount_type' => 'required|in:bdt,percent',
            'purchase_items.*.subtotal' => 'required|numeric|min:0',
        ]);

        // Update purchase
        $purchase->update([
            'date' => $request->date,
            'godown_id' => $request->godown_id,
            'salesman_id' => $request->salesman_id,
            'account_ledger_id' => $request->account_ledger_id,
            'phone' => $request->phone,
            'address' => $request->address,
            'shipping_details' => $request->shipping_details,
            'delivered_to' => $request->delivered_to,
            'total_qty' => collect($request->purchase_items)->sum('qty'),
            'total_price' => collect($request->purchase_items)->sum('subtotal'),
            'total_discount' => collect($request->purchase_items)->sum('discount'),
            'grand_total' => collect($request->purchase_items)->sum('subtotal'),
        ]);

        // Sync items
        $purchase->purchaseItems()->delete();
        foreach ($request->purchase_items as $item) {
            $purchase->purchaseItems()->create([
                'product_id' => $item['product_id'],
                'qty' => $item['qty'],
                'price' => $item['price'],
                'discount' => $item['discount'] ?? 0,
                'discount_type' => $item['discount_type'],
                'subtotal' => $item['subtotal'],
            ]);
        }

        // 🚩 Check if 'print' is set to true in the request
        if ($request->has('print') && $request->print) {
            // Redirect to a dedicated invoice/print route
            // (Make sure you have this route set up in web.php)
            return redirect()->route('purchases.invoice', $purchase->id);
        }

        // Otherwise, normal redirect
        return redirect()
            ->route('purchases.index')
            ->with('success', 'Purchase updated successfully!');
    }

    public function invoice(Purchase $purchase)
    {
        // Load relationships if needed
        $purchase->load(['purchaseItems.item', 'godown', 'salesman', 'accountLedger']);

        // Return an Inertia page for printing
        return Inertia::render('purchases/invoice', [
            'purchase' => $purchase,
            // pass any other data you want to display
        ]);
    }





    // Delete Purchase
    public function destroy(Purchase $purchase)
    {
        $purchase->delete();
        return redirect()->back()->with('success', 'Purchase deleted successfully!');
    }
}
