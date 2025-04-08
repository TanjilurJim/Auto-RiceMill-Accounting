<?php

// StockTransferController.php

// StockTransferController.php

namespace App\Http\Controllers;

use App\Models\StockTransfer;
use App\Models\StockTransferItem;
use App\Models\Item;
use App\Models\Godown;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockTransferController extends Controller
{
    // Show list of stock transfers
    public function index()
    {
        $stockTransfers = StockTransfer::with(['fromGodown', 'toGodown', 'creator', 'items.item'])
            ->where('created_by', auth()->id())
            ->orderBy('id', 'desc')
            ->paginate(10);

        return Inertia::render('StockTransfer/Index', [
            'stockTransfers' => $stockTransfers // Pass the entire paginator object
        ]);
    }



    // Show create form
    public function create()
    {
        // Define query scope based on the user's role
        $queryScope = auth()->user()->hasRole('admin')
            ? fn($query) => $query
            : fn($query) => $query->where('created_by', auth()->id());

        // Return Inertia view with godowns and items
        return Inertia::render('StockTransfer/Create', [
            'godowns' => Godown::when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))->get(),
            'items' => Item::when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))->get(),
        ]);
    }

    // Store stock transfer
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

            // Update "From" godown stock
            $fromItem = Item::where('id', $product['item_id'])
                ->where('godown_id', $request->from_godown_id)
                ->first();

            if ($fromItem) {
                $fromItem->previous_stock -= $product['quantity'];
                $fromItem->save();
            }

            // Update or create "To" godown stock
            $toItem = Item::where('item_code', $fromItem->item_code)
                ->where('godown_id', $request->to_godown_id)
                ->first();

            if ($toItem) {
                $toItem->previous_stock += $product['quantity'];
                $toItem->save();
            } else {
                $existingItem = Item::where('item_code', $fromItem->item_code)
                    ->where('item_name', '!=', $fromItem->item_name)
                    ->first();

                if ($existingItem) {
                    return redirect()->back()->withErrors([
                        'item_code' => "Item code {$fromItem->item_code} already exists with a different item name.",
                    ])->withInput();
                }

                Item::create([
                    'item_name' => $fromItem->item_name,
                    'item_code' => $fromItem->item_code,
                    'category_id' => $fromItem->category_id,
                    'unit_id' => $fromItem->unit_id,
                    'godown_id' => $request->to_godown_id,
                    'previous_stock' => $product['quantity'],
                    'created_by' => auth()->id(),
                ]);
            }
        }

        return redirect()->route('stock-transfers.index')->with('success', 'Stock Transfer Successfully Completed');
    }


    // Show a specific stock transfer
    public function show($id)
    {
        $stockTransfer = StockTransfer::with('fromGodown', 'toGodown', 'items.item')->findOrFail($id);

        // Access check
        if ($stockTransfer->created_by !== auth()->id() && !auth()->user()->hasRole('admin')) {
            abort(403);
        }

        return Inertia::render('StockTransfer/Show', [
            'stockTransfer' => $stockTransfer,
        ]);
    }

    // Show form to edit a stock transfer
    public function edit($id)
    {
        $stockTransfer = StockTransfer::with('fromGodown', 'toGodown', 'items.item')
            ->findOrFail($id);

        // Check if the logged-in user is authorized to edit this transfer
        if ($stockTransfer->created_by !== auth()->id() && !auth()->user()->hasRole('admin')) {
            abort(403);
        }

        return Inertia::render('StockTransfer/Edit', [
            'stockTransfer' => $stockTransfer,
            'godowns' => Godown::when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))->get(),
            'items' => Item::when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))->get(),
        ]);
    }


    // Update an existing stock transfer
    public function update(Request $request, $id)
    {
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

        $stockTransfer = StockTransfer::findOrFail($id);

        if ($stockTransfer->created_by !== auth()->id() && !auth()->user()->hasRole('admin')) {
            abort(403);
        }

        // Reverse old stock changes
        foreach ($stockTransfer->items as $oldItem) {
            $fromItem = Item::where('item_code', $oldItem->item->item_code)
                ->where('godown_id', $stockTransfer->from_godown_id)
                ->first();

            $toItem = Item::where('item_code', $oldItem->item->item_code)
                ->where('godown_id', $stockTransfer->to_godown_id)
                ->first();

            if ($fromItem) {
                $fromItem->previous_stock += $oldItem->quantity;
                $fromItem->save();
            }

            if ($toItem) {
                $toItem->previous_stock -= $oldItem->quantity;
                $toItem->save();
            }
        }

        // Delete old items
        $stockTransfer->items()->delete();

        // Update stock transfer record
        $stockTransfer->update([
            'date' => $request->date,
            'voucher_no' => $request->voucher_no,
            'from_godown_id' => $request->from_godown_id,
            'to_godown_id' => $request->to_godown_id,
            'total_quantity' => array_sum(array_column($request->products, 'quantity')),
            'total_amount' => collect($request->products)->sum(fn($p) => $p['quantity'] * $p['rate']),
            'note' => $request->note,
        ]);

        // Apply new stock changes
        foreach ($request->products as $product) {
            $stockTransfer->items()->create([
                'item_id' => $product['item_id'],
                'quantity' => $product['quantity'],
                'rate' => $product['rate'],
                'amount' => $product['quantity'] * $product['rate'],
            ]);

            $fromItem = Item::where('id', $product['item_id'])
                ->where('godown_id', $request->from_godown_id)
                ->first();

            if ($fromItem) {
                $fromItem->previous_stock -= $product['quantity'];
                $fromItem->save();
            }

            $toItem = Item::where('item_code', $fromItem->item_code)
                ->where('godown_id', $request->to_godown_id)
                ->first();

            if ($toItem) {
                $toItem->previous_stock += $product['quantity'];
                $toItem->save();
            } else {
                $conflict = Item::where('item_code', $fromItem->item_code)
                    ->where('item_name', '!=', $fromItem->item_name)
                    ->first();

                if ($conflict) {
                    return redirect()->back()->withErrors([
                        'item_code' => "Item code {$fromItem->item_code} already exists with a different item name.",
                    ])->withInput();
                }

                Item::create([
                    'item_name' => $fromItem->item_name,
                    'item_code' => $fromItem->item_code,
                    'category_id' => $fromItem->category_id,
                    'unit_id' => $fromItem->unit_id,
                    'godown_id' => $request->to_godown_id,
                    'previous_stock' => $product['quantity'],
                    'created_by' => auth()->id(),
                ]);
            }
        }

        return redirect()->route('stock-transfers.index')->with('success', 'Stock Transfer Successfully Updated');
    }



    // Delete a stock transfer
    public function destroy(StockTransfer $stockTransfer)
    {
        // Delete related items first if not using ON DELETE CASCADE
        $stockTransfer->items()->delete();

        // Delete the main record
        $stockTransfer->delete();

        return redirect()->back()->with('success', 'Stock Transfer deleted successfully!');
    }
}
