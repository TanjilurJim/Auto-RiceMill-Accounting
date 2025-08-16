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
            $items = Item::with([
                'category',
                'unit',
                'godown',
                'creator',
                'stocks.lot' => fn($q) => $q->where('qty', '>', 0) // ✅ only active lots
            ])
                ->withSum('stocks as current_stock', 'qty')
                ->orderBy('id', 'desc')
                ->paginate(10);
        } else {
            $ids = godown_scope_ids();
            $items = Item::with([
                'category',
                'unit',
                'godown',
                'creator',
                'stocks' => fn($q) => $q->where('qty', '>', 0)->with('lot')
            ])
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
        $validated = $request->validate([
            'item_name'  => [
                'required',
                'string',
                'max:255',
                Rule::unique('items', 'item_name')->whereIn('created_by', user_scope_ids()),
            ],
            'unit_id'     => 'required|exists:units,id',
            'category_id' => 'required|exists:categories,id',
            'godown_id'   => 'required|exists:godowns,id',
            'weight'      => 'nullable|numeric|min:0',
            'purchase_price'               => 'nullable|numeric',
            'sale_price'                   => 'nullable|numeric',
            'previous_stock'               => 'nullable|numeric|min:0',
            'total_previous_stock_value'   => 'nullable|numeric',
            'description'                  => 'nullable|string',
            'lot_no'      => 'required_with:previous_stock|string|max:50',
            'received_at' => 'nullable|date',
        ]);

        // 2) Generate code (unchanged)
        do {
            $nextId   = Item::max('id') + 1;
            $itemCode = 'ITM' . str_pad($nextId, 4, '0', STR_PAD_LEFT);
        } while (Item::where('item_code', $itemCode)->exists());

        // 3) Normalize + compute totals
        $openingQty = (float) ($request->previous_stock ?? 0);
        $weight     = $request->filled('weight') ? (float)$request->weight : null;
        $totalWeight = $weight !== null ? round($openingQty * $weight, 2) : null;

        $validated += [
            'item_code'                    => $itemCode,
            'created_by'                   => auth()->id(),
            'purchase_price'               => $request->purchase_price ?? 0,
            'sale_price'                   => $request->sale_price     ?? 0,
            'previous_stock'               => $openingQty,
            'total_previous_stock_value'   => $request->total_previous_stock_value ?? 0,
            'weight'                       => $weight,
            // 🆕 save computed total_weight on create
            'total_weight'                 => $totalWeight,
        ];

        $item = Item::create($validated);

        // 4) Opening stock + lot (unchanged)
        if ($openingQty > 0) {
            $lot = \App\Models\Lot::create([
                'godown_id'   => $request->godown_id,
                'item_id'     => $item->id,
                'lot_no'      => $request->lot_no,
                'received_at' => $request->received_at ? date('Y-m-d', strtotime($request->received_at)) : now(),
                'created_by'  => auth()->id(),
            ]);

            \App\Models\Stock::create([
                'item_id'    => $item->id,
                'godown_id'  => $request->godown_id,
                'lot_id'     => $lot->id,
                'qty'        => $openingQty,
                'avg_cost'   => $request->purchase_price ?? 0,
                'created_by' => auth()->id(),
            ]);
        }

        return redirect()->route('items.index')->with('success', 'Item created successfully!');
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
            'item_name'  => [
                'required',
                'string',
                'max:255',
                Rule::unique('items', 'item_name')->whereIn('created_by', user_scope_ids())->ignore($item->id),
            ],
            'unit_id'    => 'required|exists:units,id',
            'category_id' => 'required|exists:categories,id',
            'godown_id'  => 'required|exists:godowns,id',

            'purchase_price'             => 'nullable|numeric',
            'sale_price'                 => 'nullable|numeric',
            'previous_stock'             => 'nullable|numeric|min:0',
            'total_previous_stock_value' => 'nullable|numeric',
            'description'                => 'nullable|string',

            // 🆕
            'weight' => 'nullable|numeric|min:0',
        ]);

        // normalize numeric fields
        $validated['purchase_price']             = $request->purchase_price ?? 0;
        $validated['sale_price']                 = $request->sale_price ?? 0;
        $validated['total_previous_stock_value'] = $request->total_previous_stock_value ?? 0;

        // Apply scalar updates first
        $item->fill($validated);

        // 🆕 recompute total_weight from current (or incoming) values
        $weight = $request->filled('weight') ? (float)$request->weight : $item->weight;
        // if previous_stock is not sent, keep existing (or compute from stock if you prefer)
        $prev   = $request->filled('previous_stock')
            ? (float)$request->previous_stock
            : (float)($item->previous_stock ?? 0);

        $item->weight       = $weight;
        $item->total_weight = $weight !== null ? round($prev * $weight, 2) : null;
        $item->save();

        // keep your stock opening row in sync (unchanged logic)
        $stock = \App\Models\Stock::firstOrNew([
            'item_id'    => $item->id,
            'godown_id'  => $request->godown_id,
            'created_by' => auth()->id(),
        ]);
        $stock->qty = $request->previous_stock ?? 0;
        $stock->save();

        return redirect()->route('items.index')->with('success', 'Item updated successfully!');
    }



    public function show(Item $item, Request $request)
    {
        $user   = auth()->user();
        $scope  = godown_scope_ids();
        $gId    = $request->godown_id;

        /* 1️⃣ Active stock rows */
        $stocks = \App\Models\Stock::with(['lot', 'godown'])
            ->where('item_id', $item->id)
            ->where('qty', '>', 0)
            ->when(!$user->hasRole('admin'), fn($q) => $q->whereIn('created_by', $scope))
            ->when($gId,                       fn($q) => $q->where('godown_id', $gId))
            ->get();

        /* 2️⃣ Lot id of the very first lot (opening) */
        $openingLotId = \App\Models\Lot::where('item_id', $item->id)
            ->orderBy('id')       // earliest = first
            ->value('id');

        /* 3️⃣ One query: latest IN-move cost for every lot */
        /* 3️⃣ One query: latest IN or Purchase move cost for every lot */
        $lastRates = \App\Models\StockMove::select('lot_id', 'unit_cost', 'meta')
            ->whereIn('type', ['in', 'purchase'])   // ✅ include both
            ->whereIn('lot_id', $stocks->pluck('lot_id'))
            ->orderBy('lot_id')
            ->orderByDesc('id')
            ->get()
            ->unique('lot_id')
            ->keyBy('lot_id'); //  [lot_id => StockMove]

        /* 4️⃣ Build rows */
        $rows = $stocks->map(function ($s) use ($item, $lastRates, $openingLotId) {

            // 4.1 newest IN or purchase move cost?
            $move = $lastRates[$s->lot_id] ?? null;
            $rate = 0;

            if ($move) {
                // Prefer per_kg_rate from meta if present (conversion)
                if (!empty($move->meta['per_kg_rate'])) {
                    $rate = (float) $move->meta['per_kg_rate'];
                } else {
                    $rate = (float) $move->unit_cost;
                }
            }

            // 4.2 else any stored avg_cost?
            if ($rate == 0 && $s->avg_cost) {
                $rate = (float) $s->avg_cost;
            }

            // 4.3 else if this is the opening lot → item’s purchase_price
            if ($rate == 0 && $s->lot_id == $openingLotId) {
                $rate = (float) ($item->purchase_price ?? 0);
            }

            $value = round($s->qty * $rate, 2);

            return [
                'lot_no'      => $s->lot?->lot_no,
                'received_at' => optional($s->lot)->received_at,
                'godown'      => $s->godown?->name,
                'qty'         => (float) $s->qty,
                'rate'        => $rate,
                'value'       => $value,
            ];
        });

        $totalWeight = $item->weight ? $rows->sum(fn($r) => $r['qty'] * (float)$item->weight) : null;


        /* 5️⃣ Summary */
        $summary = [
            'total_qty'   => $rows->sum('qty'),
            'total_value' => $rows->sum('value'),
            'last_in'     => $rows->max('received_at'),
            'unit'        => $item->unit?->name,
            'total_weight' => $totalWeight,
        ];

        /* 6️⃣ Render */
        return Inertia::render('items/show', [
            'item'    => $item->only('id', 'item_name', 'item_code', 'weight') + ['unit' => $summary['unit']],
            'stocks'  => $rows,
            'summary' => $summary,
            'godowns' => $user->hasRole('admin')
                ? \App\Models\Godown::select('id', 'name')->get()
                : \App\Models\Godown::whereIn('created_by', $scope)->select('id', 'name')->get(),
            'filters' => ['godown_id' => $gId],
        ]);
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
