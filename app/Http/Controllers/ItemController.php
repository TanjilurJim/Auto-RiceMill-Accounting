<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Category;
use App\Models\Unit;
use App\Models\Godown;
use Illuminate\Support\Facades\DB;
use App\Models\Stock;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = auth()->id();

        $items = Item::with(['category', 'unit', 'godown', 'creator'])
            ->where('created_by', $userId)
            ->withSum(['stocks as current_stock' => function ($q) use ($userId) {
                $q->where('created_by', $userId);
            }], 'qty')
            ->orderBy('id', 'desc')
            ->paginate(10);

        return Inertia::render('items/index', [
            'items' => $items,
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        /* -------------------------------------------------
       1️⃣  Figure out which other users are “visible” to me
           -------------------------------------------------
           - always myself
           - my direct children        (users where created_by = me)
           - my parent (created_by)    ⇢ but NOT if that parent is admin
    ------------------------------------------------- */
        $me           = auth()->user();
        $extraUserIds = [];                        // will feed createdByMeOr()

        // children
        $extraUserIds = array_merge(
            $extraUserIds,
            User::where('created_by', $me->id)->pluck('id')->all()
        );

        // parent  (only if non-admin)
        if ($me->created_by) {
            $parent = User::find($me->created_by);
            if ($parent && ! $parent->hasRole('admin')) {
                $extraUserIds[] = $parent->id;
            }
        }

        /* remove duplicates just in case */
        $extraUserIds = array_unique($extraUserIds);

        /* -------------------------------------------------
       2️⃣  Build the form payload
    ------------------------------------------------- */
        return Inertia::render('items/create', [

            // master tables: mine OR my family (parent/children)
            'categories' => Category::where(createdByMeOr($extraUserIds))->get(),
            'units'      => Unit::where(createdByMeOr($extraUserIds))->get(),

            // godowns: same visibility
            'godowns'    => Godown::where(createdByMeOr($extraUserIds))->get(),
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

    // public function getItemsByGodown($godownId)
    // {
    //     $items = Item::where('created_by', auth()->id())
    //         ->with('unit') // optional
    //         ->get();

    //     $stocks = \App\Models\Stock::where('godown_id', $godownId)
    //         ->where('created_by', auth()->id())
    //         ->get()
    //         ->keyBy('item_id');

    //     $itemsWithStock = $items->map(function ($item) use ($stocks) {
    //         $stockQty = $stocks[$item->id]->qty ?? 0;
    //         return [
    //             'id' => $item->id,
    //             'item_name' => $item->item_name,
    //             'unit' => $item->unit->name ?? '',
    //             'stock_qty' => $stockQty,
    //         ];
    //     });

    //     return response()->json($itemsWithStock);
    // }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Item $item)
    {
        $item->delete();
        return redirect()->back()->with('success', 'Item deleted successfully!');
    }
}
