<?php

namespace App\Http\Controllers;

use App\Models\PurchaseReturn;
use App\Models\PurchaseReturnItem;
use App\Models\Godown;
use App\Models\Salesman;
use App\Models\AccountLedger;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseReturnController extends Controller
{
    // 🟢 Index: List all returns
    public function index()
    {
        $returns = PurchaseReturn::with([
            'godown',
            'accountLedger',
            'returnItems.item',
            'creator'
        ])
            ->where('created_by', auth()->id())
            ->orderBy('id', 'desc')
            ->paginate(10);

        return Inertia::render('purchase_returns/index', [
            'returns' => $returns
        ]);
    }

    // 🟢 Create form
    public function create()
    {
        return Inertia::render('purchase_returns/create', [
            'godowns' => Godown::where('created_by', auth()->id())->get(),
            'ledgers' => AccountLedger::where('created_by', auth()->id())->get(),
            'items' => Item::where('created_by', auth()->id())->get()->unique('item_name')->values(),
        ]);
    }

    // 🟢 Store
    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'return_voucher_no' => 'nullable|unique:purchase_returns,return_voucher_no',
            'godown_id' => 'required|exists:godowns,id',
            'account_ledger_id' => 'required|exists:account_ledgers,id',
            'return_items' => 'required|array|min:1',
            'return_items.*.product_id' => 'required|exists:items,id',
            'return_items.*.qty' => 'required|numeric|min:0.01',
            'return_items.*.price' => 'required|numeric|min:0',
            'return_items.*.subtotal' => 'required|numeric|min:0',
            'reason' => 'nullable|string|max:1000',
        ]);

        $voucherNo = $request->return_voucher_no ?? 'RET-' . now()->format('Ymd') . '-' . str_pad(PurchaseReturn::max('id') + 1, 4, '0', STR_PAD_LEFT);

        $return = PurchaseReturn::create([
            'date' => $request->date,
            'return_voucher_no' => $voucherNo,
            'godown_id' => $request->godown_id,
            'account_ledger_id' => $request->account_ledger_id,
            'reason' => $request->reason,
            'total_qty' => collect($request->return_items)->sum('qty'),
            'grand_total' => collect($request->return_items)->sum('subtotal'),
            'created_by' => auth()->id(),
        ]);

        foreach ($request->return_items as $item) {
            $return->returnItems()->create([
                'product_id' => $item['product_id'],
                'qty' => $item['qty'],
                'price' => $item['price'],
                'subtotal' => $item['subtotal'],
            ]);
        }

        // After saving purchase return:
        // if ($request->boolean('print')) {
        //     return redirect()->route('purchase-returns.invoice', $return->id);
        // }
        return redirect()->route('purchase-returns.index')->with('success', 'Purchase Return created successfully!');
    }

    // 🟢 Edit
    public function edit(PurchaseReturn $purchase_return)
    {
        if ($purchase_return->created_by !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('purchase_returns/edit', [
            'purchase_return' => $purchase_return->load(['returnItems', 'godown', 'accountLedger']),
            'godowns' => Godown::where('created_by', auth()->id())->get(),
            'ledgers' => AccountLedger::where('created_by', auth()->id())->get(),
            'items' => Item::where('created_by', auth()->id())->get(),
        ]);
    }

    // 🟢 Update
    public function update(Request $request, PurchaseReturn $purchase_return)
    {
        if ($purchase_return->created_by !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'date' => 'required|date',
            'godown_id' => 'required|exists:godowns,id',
            'account_ledger_id' => 'required|exists:account_ledgers,id',
            'return_items' => 'required|array|min:1',
            'return_items.*.product_id' => 'required|exists:items,id',
            'return_items.*.qty' => 'required|numeric|min:0.01',
            'return_items.*.price' => 'required|numeric|min:0',
            'return_items.*.subtotal' => 'required|numeric|min:0',
            'reason' => 'nullable|string|max:1000',
        ]);

        $purchase_return->update([
            'date' => $request->date,
            'godown_id' => $request->godown_id,
            'account_ledger_id' => $request->account_ledger_id,
            'reason' => $request->reason,
            'total_qty' => collect($request->return_items)->sum('qty'),
            'grand_total' => collect($request->return_items)->sum('subtotal'),
        ]);

        $purchase_return->returnItems()->delete();
        foreach ($request->return_items as $item) {
            $purchase_return->returnItems()->create([
                'product_id' => $item['product_id'],
                'qty' => $item['qty'],
                'price' => $item['price'],
                'subtotal' => $item['subtotal'],
            ]);
        }

        // if ($request->boolean('print')) {
        //     return redirect()->route('purchase-returns.invoice', $return->id);
        // }

        return redirect()->route('purchase-returns.index')->with('success', 'Purchase Return updated successfully!');
        
    }

    // 🟢 Delete
    public function destroy(PurchaseReturn $purchase_return)
    {
        if ($purchase_return->created_by !== auth()->id()) {
            abort(403);
        }

        $purchase_return->delete();
        return redirect()->back()->with('success', 'Purchase Return deleted successfully!');
    }

    // 🟢 Optional Print (Invoice)
    public function invoice(PurchaseReturn $purchase_return)
    {
        $purchase_return->load(['returnItems.item', 'godown', 'accountLedger']);
        return Inertia::render('purchase_returns/invoice', [
            'purchase_return' => $purchase_return
        ]);
    }
}
