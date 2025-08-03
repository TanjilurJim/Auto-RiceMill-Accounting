<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Khamal;
use Illuminate\Validation\Rule;
use App\Models\Category;
use App\Models\Unit;
use App\Models\Godown;
use App\Models\Lot;
use Illuminate\Support\Facades\DB;
use App\Models\Stock;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use function godown_scope_ids;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // public function index()
    // {
    //     $userId = auth()->id();

    //     $items = Item::with(['category', 'unit', 'godown', 'creator'])
    //         ->where('created_by', $userId)
    //         ->withSum(['stocks as current_stock' => function ($q) use ($userId) {
    //             $q->where('created_by', $userId);
    //         }], 'qty')
    //         ->orderBy('id', 'desc')
    //         ->paginate(10);

    //     return Inertia::render('items/index', [
    //         'items' => $items,
    //     ]);
    // }
    public function index()
    {
        $user = auth()->user();

        if ($user->hasRole('admin')) {
            $items = Item::with(['category', 'unit', 'godown', 'creator'])
                ->withSum('stocks as current_stock', 'qty')
                ->orderBy('id', 'desc')
                ->paginate(10);
        } else {
            $ids = godown_scope_ids();
            $items = Item::with(['category', 'unit', 'godown', 'creator'])
                ->whereIn('created_by', $ids)
                ->withSum(['stocks as current_stock' => function ($q) use ($ids) {
                    $q->whereIn('created_by', $ids);
                }], 'qty')
                ->orderBy('id', 'desc')
                ->paginate(10);
        }

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

        /* --------------------------------------------------
       2️⃣  Build the form payload
        ------------------------------------------------- */
        return Inertia::render('items/create', [

            // master tables: mine OR my family (parent/children)
            'categories' => Category::where(createdByMeOr($extraUserIds))->get(),
            'units'      => Unit::where(createdByMeOr($extraUserIds))->get(),

            // godowns: same visibility
            'godowns'    => Godown::with('khamals')
                ->where(createdByMeOr($extraUserIds))->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        /* 1️⃣ Validate -------------------------------------------------- */
        $validated = $request->validate([
            'item_name'  => [
                'required',
                'string',
                'max:255',
                Rule::unique('items', 'item_name')
                    ->whereIn('created_by', user_scope_ids()),
            ],
            'unit_id'    => 'required|exists:units,id',
            'category_id' => 'required|exists:categories,id',
            'godown_id'  => 'required|exists:godowns,id',

            'purchase_price'               => 'nullable|numeric',
            'sale_price'                   => 'nullable|numeric',
            'previous_stock'               => 'nullable|numeric',
            'total_previous_stock_value'   => 'nullable|numeric',
            'description'                  => 'nullable|string',

            /* new                                             */
            'lot_no'      => 'required_with:previous_stock|string|max:50',
            'received_at' => 'nullable|date',
        ]);

        /* 2️⃣ Generate a unique item_code ------------------ */
        do {
            $nextId   = Item::max('id') + 1;
            $itemCode = 'ITM' . str_pad($nextId, 4, '0', STR_PAD_LEFT);
        } while (Item::where('item_code', $itemCode)->exists());

        $validated += [
            'item_code'   => $itemCode,
            'created_by'  => auth()->id(),
            'purchase_price' => $request->purchase_price ?? 0,
            'sale_price'     => $request->sale_price     ?? 0,
            'previous_stock' => $request->previous_stock ?? 0,
            'total_previous_stock_value' => $request->total_previous_stock_value ?? 0,
        ];

        /* 3️⃣ Create the Item row --------------------------- */
        $item = Item::create($validated);

        /* 4️⃣ Opening stock → its own lot + stock row ------- */
        $openingQty = (float) ($request->previous_stock ?? 0);

        if ($openingQty > 0) {

            $lot = \App\Models\Lot::create([
                'godown_id'   => $request->godown_id,
                'item_id'     => $item->id,
                'lot_no'      => $request->lot_no,
                'received_at' => $request->received_at ?? now(),
                'created_by'  => auth()->id(),
            ]);

            \App\Models\Stock::create([
                'item_id'   => $item->id,
                'godown_id' => $request->godown_id,
                'lot_id'    => $lot->id,               // ⭐
                'qty'       => $openingQty,
                'avg_cost'  => $request->purchase_price ?? 0,
                'created_by' => auth()->id(),
            ]);
        }

        return redirect()
            ->route('items.index')
            ->with('success', 'Item created successfully!');
    }




    public function edit(Item $item)
    {
        $user = auth()->user();

        if (!$user->hasRole('admin')) {
            $ids = godown_scope_ids();
            if (!in_array($item->created_by, $ids)) {
                abort(403, 'Unauthorized action.');
            }
        }

        $userId = auth()->id();

        $lot = Lot::where([
            'item_id'   => $item->id,
            'godown_id' => $item->godown_id,
            'created_by' => auth()->id(),
        ])
            ->orderBy('received_at')   // opening stock = oldest
            ->first();

        $item->previous_stock = Stock::where([
            'item_id'   => $item->id,
            'godown_id' => $item->godown_id,
            'created_by' => auth()->id(),
        ])->value('qty') ?? 0;

        $item->lot_no      = $lot?->lot_no      ?? '';
        $item->received_at = $lot?->received_at ?? '';



        return Inertia::render('items/edit', [
            'item'       => $item->load(['category', 'unit', 'godown']),
            'categories' => Category::all(),
            'units'      => Unit::all(),
            'godowns'    => Godown::all(),
        ]);
    }



    public function update(Request $request, Item $item)
    {
        $user = auth()->user();

        if (!$user->hasRole('admin')) {
            $ids = godown_scope_ids();
            if (!in_array($item->created_by, $ids)) {
                abort(403, 'Unauthorized action.');
            }
        }

        $validated = $request->validate([
            'item_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('items', 'item_name')
                    ->whereIn('created_by', user_scope_ids())
                    ->ignore($item->id),                         // 👈 ignore current row
            ],
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

        $item->update($validated);

        $stock = \App\Models\Stock::firstOrNew([
            'item_id' => $item->id,
            'godown_id' => $request->godown_id,
            'created_by' => auth()->id(),
        ]);

        $stock->qty = $request->previous_stock ?? 0;
        $stock->save();

        return redirect()->route('items.index')->with('success', 'Item updated successfully!');
    }



    public function destroy(Item $item)
    {
        $user = auth()->user();

        if (!$user->hasRole('admin')) {
            $ids = godown_scope_ids();
            if (!in_array($item->created_by, $ids)) {
                abort(403, 'Unauthorized action.');
            }
        }

        $item->delete();
        return redirect()->back()->with('success', 'Item deleted successfully!');
    }
}
