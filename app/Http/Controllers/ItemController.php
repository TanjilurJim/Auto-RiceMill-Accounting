<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Category;
use App\Models\Unit;
use App\Models\Godown;
use App\Models\Stock;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Item::with(['category', 'unit', 'godown', 'creator'])
            ->orderBy('id', 'desc');

        // Check if user is NOT admin, then limit by their ID
        if (!auth()->user()->hasRole('admin')) {
            $query->where('created_by', auth()->id());
        }

        $items = $query->paginate(10);

        return Inertia::render('items/index', [
            'items' => $items,
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('items/create', [
            'categories' => Category::all(),
            'units' => Unit::all(),
            'godowns' => Godown::where('created_by', auth()->id())->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 🔥 Fix: Removed 'item_part' from validation & removed incorrect 'sales_price' field
        $validated = $request->validate([
            'item_name' => 'required|string|max:255',
            'unit_id' => 'required|exists:units,id',
            'category_id' => 'required|exists:categories,id',
            'godown_id' => 'required|exists:godowns,id',
            'purchase_price' => 'nullable|numeric',
            'sale_price' => 'nullable|numeric', // ✅ Fixed from 'sales_price' to 'sale_price'
            'previous_stock' => 'nullable|numeric',
            'total_previous_stock_value' => 'nullable|numeric',
            'description' => 'nullable|string',
        ]);

        // Generate unique item code
        do {
            $nextId = Item::max('id') + 1;
            $itemCode = 'ITM' . str_pad($nextId, 4, '0', STR_PAD_LEFT);
            $exists = Item::where('item_code', $itemCode)->exists();
        } while ($exists);
        // Check if same item_code exists with different name
        $conflictingItem = Item::where('item_code', $itemCode)
            ->where('item_name', '!=', $request->item_name)
            ->first();

        if ($conflictingItem) {
            return redirect()->back()->withErrors([
                'item_code' => 'Item code already exists with a different item name.',
            ])->withInput();
        }

        // Use same item_code if item_name is the same
        $existingSameItem = Item::where('item_code', $itemCode)
            ->where('item_name', $request->item_name)
            ->first();

        $validated['item_code'] = $existingSameItem ? $existingSameItem->item_code : $itemCode;
        $validated['created_by'] = auth()->id();
        $validated['purchase_price'] = $request->purchase_price ?? 0;
        $validated['sale_price'] = $request->sale_price !== '' ? $request->sale_price : 0;
        $validated['previous_stock'] = $request->previous_stock ?? 0;
        $validated['total_previous_stock_value'] = $request->total_previous_stock_value ?? 0;

        // ✅ Save the item
        $item = Item::create($validated);

        // ✅ Insert a stock record for this item
        \App\Models\Stock::create([
            'item_id'   => $item->id,
            'godown_id' => $request->godown_id,
            'qty'       => $request->previous_stock ?? 0,
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('items.index')->with('success', 'Item created successfully!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Item $item)
    {
        $userId = auth()->id();

        // 🔁 Get stock quantity from `stocks` table
        $stockQty = Stock::where([
            'item_id' => $item->id,
            'godown_id' => $item->godown_id,
            'created_by' => $userId,
        ])->value('qty') ?? 0;

        $item->previous_stock = $stockQty;

        return Inertia::render('items/edit', [
            'item' => $item->load(['category', 'unit', 'godown']),
            'categories' => Category::all(),
            'units' => Unit::all(),
            'godowns' => Godown::where('created_by', $userId)->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Item $item)
    {
        $validated = $request->validate([
            'item_name' => 'required|string|max:255',
            'unit_id' => 'required|exists:units,id',
            'category_id' => 'required|exists:categories,id',
            'godown_id' => 'required|exists:godowns,id',
            'purchase_price' => 'nullable|numeric',
            'sale_price' => 'nullable|numeric',
            'previous_stock' => 'nullable|numeric',
            'total_previous_stock_value' => 'nullable|numeric',
            'description' => 'nullable|string',
        ]);

        $validated['purchase_price'] = $request->purchase_price ?? 0;
        $validated['sale_price'] = $request->sale_price ?? 0;
        $validated['total_previous_stock_value'] = $request->total_previous_stock_value ?? 0;

        // 🛠 update item info
        $item->update($validated);

        // 🛠 update the stock table
        $stock = \App\Models\Stock::firstOrNew([
            'item_id' => $item->id,
            'godown_id' => $request->godown_id,
            'created_by' => auth()->id(),
        ]);

        $stock->qty = $request->previous_stock ?? 0;
        $stock->save();

        return redirect()->route('items.index')->with('success', 'Item updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Item $item)
    {
        $item->delete();
        return redirect()->back()->with('success', 'Item deleted successfully!');
    }
}
