<?php

namespace App\Http\Controllers;

use App\Models\StockTransfer;
use App\Models\StockTransferItem;
use App\Models\Stock;
use App\Models\Item;
use App\Models\Godown;
use Illuminate\Http\Request;
use Inertia\Inertia;

use function godown_scope_ids;

class StockTransferController extends Controller
{
    /*--------------------------------------------------------------
    |  LIST & FORM SCREENS
    --------------------------------------------------------------*/
    // public function index()
    // {
    //     $transfers = StockTransfer::with(['fromGodown', 'toGodown', 'creator', 'items.item'])
    //         ->where('created_by', auth()->id())
    //         ->latest('date')
    //         ->paginate(10);

    //     return Inertia::render('StockTransfer/Index', [
    //         'stockTransfers' => $transfers,
    //     ]);
    // }

    public function index()
    {
        $ids = godown_scope_ids();

        $transfers = StockTransfer::with(['fromGodown', 'toGodown', 'creator', 'items.item'])
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->latest('date')
            ->paginate(10);

        return Inertia::render('StockTransfer/Index', [
            'stockTransfers' => $transfers,
        ]);
    }

    // public function create()
    // {
    //     return Inertia::render('StockTransfer/Create', [
    //         'godowns' => Godown::where('created_by', auth()->id())->get(),
    //         'items' => \App\Models\Stock::with('item')
    //             ->where('created_by', auth()->id())
    //             ->get()
    //             ->map(function ($stock) {
    //                 return [
    //                     'id' => $stock->item->id,
    //                     'item_name' => $stock->item->item_name,
    //                     'godown_id' => $stock->godown_id,
    //                     'previous_stock' => $stock->qty,
    //                 ];
    //             }),

    //         // 👇 NEW
    //         'liveStock' => Stock::with('item')
    //             ->where('created_by', auth()->id())
    //             ->get(['id', 'item_id', 'godown_id', 'qty']),
    //     ]);
    // }

    public function create()
    {
        $ids = godown_scope_ids();

        return Inertia::render('StockTransfer/Create', [
            'godowns' => Godown::when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))->get(),
            'items' => Stock::with('item')
                ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
                ->get()
                ->map(function ($stock) {
                    return [
                        'id' => $stock->item->id,
                        'item_name' => $stock->item->item_name,
                        'godown_id' => $stock->godown_id,
                        'previous_stock' => $stock->qty,
                    ];
                }),
            'liveStock' => Stock::with('item')
                ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
                ->get(['id', 'item_id', 'godown_id', 'qty']),
        ]);
    }

    // public function show($id)
    // {
    //     $transfer = StockTransfer::with(['fromGodown', 'toGodown', 'items.item'])
    //         ->where('created_by', auth()->id())
    //         ->findOrFail($id);

    //     return Inertia::render('StockTransfer/Show', ['stockTransfer' => $transfer]);
    // }

    public function show($id)
    {
        $ids = godown_scope_ids();

        $transfer = StockTransfer::with(['fromGodown', 'toGodown', 'items.item'])
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->findOrFail($id);

        return Inertia::render('StockTransfer/Show', ['stockTransfer' => $transfer]);
    }

    // public function edit($id)
    // {
    //     $userId = auth()->id();
    //     $isAdmin = auth()->user()->hasRole('admin');

    //     $transfer = StockTransfer::with(['items.item'])
    //         ->when(!$isAdmin, fn($q) => $q->where('created_by', $userId))
    //         ->findOrFail($id);

    //     return Inertia::render('StockTransfer/Edit', [
    //         'stockTransfer' => $transfer,
    //         'godowns' => Godown::when(!$isAdmin, fn($q) => $q->where('created_by', $userId))->get(),

    //         // 🟡 Only items that the user owns
    //         'items' => \App\Models\Item::when(!$isAdmin, fn($q) => $q->where('created_by', $userId))->get(),

    //         // 🟩 All stocks grouped by godown so frontend can filter easily
    //         'stocks' => \App\Models\Stock::with('item')
    //             ->when(!$isAdmin, fn($q) => $q->where('created_by', $userId))
    //             ->get(),
    //     ]);
    // }

    public function edit($id)
    {
        $ids = godown_scope_ids();

        $transfer = StockTransfer::with(['items.item'])
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->findOrFail($id);

        return Inertia::render('StockTransfer/Edit', [
            'stockTransfer' => $transfer,
            'godowns' => Godown::when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))->get(),
            'items' => Item::when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))->get(),
            'stocks' => Stock::with('item')
                ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
                ->get(),
        ]);
    }

    /*--------------------------------------------------------------
    |  STORE
    --------------------------------------------------------------*/
    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'voucher_no' => 'nullable|unique:stock_transfers,voucher_no',
            'from_godown_id' => 'required|exists:godowns,id',
            'to_godown_id' => 'required|exists:godowns,id|different:from_godown_id',
            'products' => 'required|array|min:1',
            'products.*.item_id' => 'required|exists:items,id',
            'products.*.quantity' => 'required|numeric|min:0.01',
            'products.*.rate' => 'required|numeric|min:0.01',
        ]);

        $voucherNo = $request->voucher_no ?? 'ST-' . now()->format('Ymd') . '-' . str_pad(StockTransfer::max('id') + 1, 4, '0', STR_PAD_LEFT);

        $stockTransfer = StockTransfer::create([
            'date' => $request->date,
            'voucher_no' => $voucherNo,
            'reference_no' => $request->reference_no,
            'from_godown_id' => $request->from_godown_id,
            'to_godown_id' => $request->to_godown_id,
            'total_quantity' => array_sum(array_column($request->products, 'quantity')),
            'total_amount' => collect($request->products)->sum(fn($p) => $p['quantity'] * $p['rate']),
            'note' => $request->note,
            'created_by' => auth()->id(),
        ]);

        foreach ($request->products as $product) {
            StockTransferItem::create([
                'stock_transfer_id' => $stockTransfer->id,
                'item_id' => $product['item_id'],
                'quantity' => $product['quantity'],
                'rate' => $product['rate'],
                'amount' => $product['quantity'] * $product['rate'],
            ]);

            // 🟢 Reduce stock in from_godown
            $fromStock = \App\Models\Stock::firstOrNew([
                'item_id' => $product['item_id'],
                'godown_id' => $request->from_godown_id,
                'created_by' => auth()->id(),
            ]);
            $fromStock->qty = max(0, $fromStock->qty - $product['quantity']);
            $fromStock->save();

            // 🟢 Increase stock in to_godown
            $toStock = \App\Models\Stock::firstOrNew([
                'item_id' => $product['item_id'],
                'godown_id' => $request->to_godown_id,
                'created_by' => auth()->id(),
            ]);
            $toStock->qty += $product['quantity'];
            $toStock->save();
        }

        return redirect()->route('stock-transfers.index')->with('success', 'Stock Transfer Successfully Completed');
    }


    /*--------------------------------------------------------------
    |  UPDATE
    --------------------------------------------------------------*/
    public function update(Request $request, $id)
    {

        $ids = godown_scope_ids();

        $request->validate([
            'date' => 'required|date',
            'voucher_no' => 'nullable|unique:stock_transfers,voucher_no,' . $id,
            'from_godown_id' => 'required|exists:godowns,id',
            'to_godown_id' => 'required|exists:godowns,id|different:from_godown_id',
            'products' => 'required|array|min:1',
            'products.*.item_id' => 'required|exists:items,id',
            'products.*.quantity' => 'required|numeric|min:0.01',
            'products.*.rate' => 'required|numeric|min:0.01',
        ]);

        // $stockTransfer = StockTransfer::with('items')->findOrFail($id);

        // if ($stockTransfer->created_by !== auth()->id() && !auth()->user()->hasRole('admin')) {
        //     abort(403);
        // }

        $stockTransfer = StockTransfer::with('items')
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->findOrFail($id);

        // 🧨 Rollback previous stock changes
        foreach ($stockTransfer->items as $oldItem) {
            // ➖ Rollback from godown
            $fromStock = \App\Models\Stock::firstOrNew([
                'item_id' => $oldItem->item_id,
                'godown_id' => $stockTransfer->from_godown_id,
                'created_by' => auth()->id(),
            ]);
            $fromStock->qty += $oldItem->quantity;
            $fromStock->save();

            // ➖ Rollback to godown
            $toStock = \App\Models\Stock::firstOrNew([
                'item_id' => $oldItem->item_id,
                'godown_id' => $stockTransfer->to_godown_id,
                'created_by' => auth()->id(),
            ]);
            $toStock->qty = max(0, $toStock->qty - $oldItem->quantity);
            $toStock->save();
        }

        // Delete old transfer items
        $stockTransfer->items()->delete();

        // 🟡 Update main record
        $stockTransfer->update([
            'date' => $request->date,
            'voucher_no' => $request->voucher_no,
            'from_godown_id' => $request->from_godown_id,
            'to_godown_id' => $request->to_godown_id,
            'total_quantity' => array_sum(array_column($request->products, 'quantity')),
            'total_amount' => collect($request->products)->sum(fn($p) => $p['quantity'] * $p['rate']),
            'note' => $request->note,
        ]);

        // 🟢 Re-apply new stock changes
        foreach ($request->products as $product) {
            $stockTransfer->items()->create([
                'item_id' => $product['item_id'],
                'quantity' => $product['quantity'],
                'rate' => $product['rate'],
                'amount' => $product['quantity'] * $product['rate'],
            ]);

            // ➖ Reduce from godown
            $fromStock = \App\Models\Stock::firstOrNew([
                'item_id' => $product['item_id'],
                'godown_id' => $request->from_godown_id,
                'created_by' => auth()->id(),
            ]);
            $fromStock->qty = max(0, $fromStock->qty - $product['quantity']);
            $fromStock->save();

            // ➕ Add to godown
            $toStock = \App\Models\Stock::firstOrNew([
                'item_id' => $product['item_id'],
                'godown_id' => $request->to_godown_id,
                'created_by' => auth()->id(),
            ]);
            $toStock->qty += $product['quantity'];
            $toStock->save();
        }

        return redirect()->route('stock-transfers.index')->with('success', 'Stock Transfer Updated Successfully');
    }


    /*--------------------------------------------------------------
    |  DELETE
    --------------------------------------------------------------*/
    // public function destroy(StockTransfer $stockTransfer)
    // {
    //     if ($stockTransfer->created_by !== auth()->id()) {
    //         abort(403);
    //     }

    //     foreach ($stockTransfer->items as $line) {
    //         Stock::where([
    //             'item_id'   => $line->item_id,
    //             'godown_id' => $stockTransfer->from_godown_id,
    //             'created_by' => auth()->id(),
    //         ])->increment('qty', $line->quantity);

    //         Stock::where([
    //             'item_id'   => $line->item_id,
    //             'godown_id' => $stockTransfer->to_godown_id,
    //             'created_by' => auth()->id(),
    //         ])->decrement('qty', $line->quantity);
    //     }

    //     $stockTransfer->items()->delete();
    //     $stockTransfer->delete();

    //     return back()->with('success', 'Stock transfer deleted.');
    // }

    public function destroy(StockTransfer $stockTransfer)
    {
        $ids = godown_scope_ids();

        if ($ids !== null && !empty($ids) && !in_array($stockTransfer->created_by, $ids)) {
            abort(403);
        }

        foreach ($stockTransfer->items as $line) {
            Stock::where([
                'item_id'   => $line->item_id,
                'godown_id' => $stockTransfer->from_godown_id,
                'created_by' => $stockTransfer->created_by,
            ])->increment('qty', $line->quantity);

            Stock::where([
                'item_id'   => $line->item_id,
                'godown_id' => $stockTransfer->to_godown_id,
                'created_by' => $stockTransfer->created_by,
            ])->decrement('qty', $line->quantity);
        }

        $stockTransfer->items()->delete();
        $stockTransfer->delete();

        return back()->with('success', 'Stock transfer deleted.');
    }

    /*--------------------------------------------------------------
    |  HELPER
    --------------------------------------------------------------*/
    private function validateTransfer(Request $request, $id = null): void
    {
        $rules = [
            'date'            => 'required|date',
            'voucher_no'      => 'nullable|unique:stock_transfers,voucher_no' . ($id ? ',' . $id : ''),
            'from_godown_id'  => 'required|exists:godowns,id',
            'to_godown_id'    => 'required|exists:godowns,id|different:from_godown_id',
            'products'        => 'required|array|min:1',
            'products.*.item_id'  => 'required|exists:items,id',
            'products.*.quantity' => 'required|numeric|min:0.01',
            'products.*.rate'     => 'required|numeric|min:0.01',
        ];
        $request->validate($rules);
    }
}
