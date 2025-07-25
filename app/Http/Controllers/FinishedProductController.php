<?php

namespace App\Http\Controllers;

use App\Models\FinishedProduct;
use App\Models\FinishedProductItem;
use App\Models\Godown;
use App\Models\Item;
use App\Models\WorkingOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinishedProductController extends Controller
{
    /* ───────────── INDEX ───────────── */
    // public function index()
    // {
    //     $finishedProducts = FinishedProduct::with([
    //         'workingOrder',
    //         'items.product',
    //         'items.godown',
    //     ])
    //         ->where('created_by', auth()->id())
    //         ->orderBy('id', 'desc')
    //         ->paginate(10);

    //     return Inertia::render('finished-products/index', [
    //         'finishedProducts' => $finishedProducts,
    //     ]);
    // }

    public function index()
    {
        $ids = user_scope_ids();

        $finishedProducts = FinishedProduct::with([
            'workingOrder',
            'items.product',
            'items.godown',
        ])
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->orderBy('id', 'desc')
            ->paginate(10);

        return Inertia::render('finished-products/index', [
            'finishedProducts' => $finishedProducts,
        ]);
    }

    /* ───────────── CREATE ───────────── */
    // public function create()
    // {
    //     return Inertia::render('finished-products/create', [
    //         'workingOrders' => WorkingOrder::with(['items.item', 'items.godown', 'extras'])
    //             ->where('created_by', auth()->id())
    //             ->latest()
    //             ->get(),
    //         'products'      => Item::where('created_by', auth()->id())->get(),
    //         'godowns'       => Godown::where('created_by', auth()->id())->get(),
    //         'autoVoucherNo' => $this->nextVoucher(),
    //     ]);
    // }

    public function create()
    {
        $ids = user_scope_ids();

        return Inertia::render('finished-products/create', [
            'workingOrders' => WorkingOrder::with(['items.item', 'items.godown', 'extras'])
                ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
                ->latest()
                ->get(),
            'products'      => Item::when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))->get(),
            'godowns'       => Godown::when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))->get(),
            'autoVoucherNo' => $this->nextVoucher($ids),
        ]);
    }

    /* ───────────── STORE ───────────── */
    // public function store(Request $request)
    // {
    //     $data = $request->validate([
    //         'working_order_id'           => 'required|exists:working_orders,id',
    //         'production_date'            => 'required|date',
    //         'production_voucher_no'      => 'required|string|unique:finished_products,production_voucher_no,NULL,id,created_by,' . auth()->id(),
    //         'reference_no'               => 'nullable|string',
    //         'remarks'                    => 'nullable|string',
    //         'productRows'                => 'required|array|min:1',
    //         'productRows.*.product_id'   => 'required|exists:items,id',
    //         'productRows.*.godown_id'    => 'required|exists:godowns,id',
    //         'productRows.*.quantity'     => 'required|numeric|min:0.01',
    //         'productRows.*.unit_price'   => 'required|numeric|min:0',   // cost is mandatory for stock value
    //         'productRows.*.total'        => 'nullable|numeric|min:0',
    //     ]);

    //     \DB::transaction(function () use ($data) {

    //         /* 1️⃣  Header row -------------------------------------------------- */
    //         $fp = FinishedProduct::create([
    //             'working_order_id'      => $data['working_order_id'],
    //             'production_date'       => $data['production_date'],
    //             'production_voucher_no' => $data['production_voucher_no'],
    //             'reference_no'          => $data['reference_no'],
    //             'remarks'               => $data['remarks'],
    //             'created_by'            => auth()->id(),
    //         ]);

    //         /* 2️⃣  Line items + STOCK update ---------------------------------- */
    //         foreach ($data['productRows'] as $row) {

    //             // save finished_product_items
    //             $fp->items()->create($row);

    //             // sync stocks table (running qty + weighted‑average cost)
    //             $stock = \App\Models\Stock::firstOrNew([
    //                 'item_id'    => $row['product_id'],
    //                 'godown_id'  => $row['godown_id'],
    //                 'created_by' => auth()->id(),
    //             ]);

    //             $oldQty   = $stock->qty ?? 0;
    //             $oldCost  = $stock->avg_cost ?? 0;

    //             $newQty   = $oldQty + $row['quantity'];

    //             // weighted average cost  = (old value + new value) / new qty
    //             $stock->avg_cost = $newQty
    //                 ? (($oldQty * $oldCost) + ($row['quantity'] * $row['unit_price'])) / $newQty
    //                 : $row['unit_price'];

    //             $stock->qty = $newQty;
    //             $stock->save();
    //         }

    //         /* 3️⃣  Mark working‑order completed -------------------------------- */
    //         $fp->workingOrder->update([
    //             'production_status'     => 'completed',
    //             'production_voucher_no' => $data['production_voucher_no'],
    //         ]);
    //     });

    //     return redirect()
    //         ->route('finished-products.index')
    //         ->with('success', 'Finished Product saved successfully!');
    // }

    public function store(Request $request)
    {
        $ids = user_scope_ids();

        $data = $request->validate([
            'working_order_id'           => 'required|exists:working_orders,id',
            'production_date'            => 'required|date',
            'production_voucher_no'      => 'required|string|unique:finished_products,production_voucher_no,NULL,id,created_by,' . auth()->id(),
            'reference_no'               => 'nullable|string',
            'remarks'                    => 'nullable|string',
            'productRows'                => 'required|array|min:1',
            'productRows.*.product_id'   => 'required|exists:items,id',
            'productRows.*.godown_id'    => 'required|exists:godowns,id',
            'productRows.*.quantity'     => 'required|numeric|min:0.01',
            'productRows.*.unit_price'   => 'required|numeric|min:0',
            'productRows.*.total'        => 'nullable|numeric|min:0',
        ]);

        \DB::transaction(function () use ($data) {
            $fp = FinishedProduct::create([
                'working_order_id'      => $data['working_order_id'],
                'production_date'       => $data['production_date'],
                'production_voucher_no' => $data['production_voucher_no'],
                'reference_no'          => $data['reference_no'],
                'remarks'               => $data['remarks'],
                'created_by'            => auth()->id(),
            ]);

            foreach ($data['productRows'] as $row) {
                $fp->items()->create($row);

                $stock = \App\Models\Stock::firstOrNew([
                    'item_id'    => $row['product_id'],
                    'godown_id'  => $row['godown_id'],
                    'created_by' => auth()->id(),
                ]);

                $oldQty   = $stock->qty ?? 0;
                $oldCost  = $stock->avg_cost ?? 0;
                $newQty   = $oldQty + $row['quantity'];

                $stock->avg_cost = $newQty
                    ? (($oldQty * $oldCost) + ($row['quantity'] * $row['unit_price'])) / $newQty
                    : $row['unit_price'];

                $stock->qty = $newQty;
                $stock->save();
            }

            $fp->workingOrder->update([
                'production_status'     => 'completed',
                'production_voucher_no' => $data['production_voucher_no'],
            ]);
        });

        return redirect()
            ->route('finished-products.index')
            ->with('success', 'Finished Product saved successfully!');
    }

    /* ───────────── SHOW ───────────── */
    // public function show($id)
    // {
    //     $finishedProduct = FinishedProduct::with([
    //         'workingOrder',
    //         'items.product',
    //         'items.godown',
    //     ])->findOrFail($id);

    //     return Inertia::render('finished-products/show', [
    //         'finishedProduct' => $finishedProduct,
    //     ]);
    // }

    public function show($id)
    {
        $ids = user_scope_ids();

        $finishedProduct = FinishedProduct::with([
            'workingOrder',
            'items.product',
            'items.godown',
        ])
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->findOrFail($id);

        return Inertia::render('finished-products/show', [
            'finishedProduct' => $finishedProduct,
        ]);
    }

    /* ───────────── EDIT ───────────── */
    // public function edit($id)
    // {
    //     $finishedProduct = FinishedProduct::with('items')->findOrFail($id);

    //     return Inertia::render('finished-products/edit', [
    //         'finishedProduct' => $finishedProduct,
    //         'products'        => Item::where('created_by', auth()->id())->get(),
    //         'godowns'         => Godown::where('created_by', auth()->id())->get(),
    //     ]);
    // }

    // public function edit($id)
    // {
    //     $finishedProduct = FinishedProduct::with(['items', 'workingOrder', 'items.product', 'items.godown'])
    //         ->where('created_by', auth()->id())
    //         ->findOrFail($id);

    //     return Inertia::render('finished-products/edit', [
    //         'finishedProduct' => $finishedProduct,
    //         'workingOrders'   => WorkingOrder::with(['items.item', 'items.godown', 'extras'])
    //             ->where('created_by', auth()->id())
    //             ->latest()->get(),
    //         'products'        => Item::where('created_by', auth()->id())->get(),
    //         'godowns'         => Godown::where('created_by', auth()->id())->get(),
    //     ]);
    // }

    public function edit($id)
    {
        $ids = user_scope_ids();

        $finishedProduct = FinishedProduct::with(['items', 'workingOrder', 'items.product', 'items.godown'])
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->findOrFail($id);

        return Inertia::render('finished-products/edit', [
            'finishedProduct' => $finishedProduct,
            'workingOrders'   => WorkingOrder::with(['items.item', 'items.godown', 'extras'])
                ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
                ->latest()->get(),
            'products'        => Item::when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))->get(),
            'godowns'         => Godown::when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))->get(),
        ]);
    }




    // /* ───────────── UPDATE ───────────── */
    // public function update(Request $request, $id)
    // {
    //     $fp = FinishedProduct::findOrFail($id);

    //     $data = $request->validate([
    //         'production_date'        => 'required|date',
    //         'reference_no'           => 'nullable|string',
    //         'remarks'                => 'nullable|string',
    //         'productRows'            => 'required|array|min:1',
    //         'productRows.*.product_id'   => 'required|exists:items,id',
    //         'productRows.*.godown_id'    => 'required|exists:godowns,id',
    //         'productRows.*.quantity'     => 'required|numeric|min:0.01',
    //         'productRows.*.unit_price'   => 'nullable|numeric|min:0',
    //         'productRows.*.total'        => 'nullable|numeric|min:0',
    //     ]);

    //     $fp->update([
    //         'production_date' => $data['production_date'],
    //         'reference_no'    => $data['reference_no'],
    //         'remarks'         => $data['remarks'],
    //     ]);

    //     $fp->items()->delete();
    //     foreach ($data['productRows'] as $row) {
    //         $fp->items()->create($row);
    //     }

    //     return redirect()->route('finished-products.index')
    //         ->with('success', 'Finished Product updated successfully!');
    // }

    // public function update(Request $request, $id)
    // {
    //     $fp = FinishedProduct::where('created_by', auth()->id())->findOrFail($id);

    //     $data = $request->validate([
    //         'working_order_id' => 'required|exists:working_orders,id',
    //         'production_date' => 'required|date',
    //         'production_voucher_no' => 'required|string|unique:finished_products,production_voucher_no,' . $id,
    //         'reference_no' => 'nullable|string',
    //         'remarks' => 'nullable|string',

    //         'productRows' => 'required|array|min:1',
    //         'productRows.*.product_id' => 'required|exists:items,id',
    //         'productRows.*.godown_id' => 'required|exists:godowns,id',
    //         'productRows.*.quantity' => 'required|numeric|min:0.01',
    //         'productRows.*.unit_price' => 'nullable|numeric|min:0',
    //         'productRows.*.total' => 'nullable|numeric|min:0',
    //     ]);

    //     // Update header
    //     $fp->update([
    //         'working_order_id' => $data['working_order_id'],
    //         'production_date' => $data['production_date'],
    //         'production_voucher_no' => $data['production_voucher_no'],
    //         'reference_no' => $data['reference_no'],
    //         'remarks' => $data['remarks'],
    //     ]);

    //     // Reset product items
    //     $fp->items()->delete();
    //     foreach ($data['productRows'] as $row) {
    //         $fp->items()->create($row);
    //     }

    //     // Update WorkingOrder
    //     $fp->workingOrder->update([
    //         'production_status' => 'completed',
    //         'production_voucher_no' => $data['production_voucher_no'],
    //     ]);

    //     return redirect()->route('finished-products.index')
    //         ->with('success', 'Finished Product updated successfully!');
    // }

    public function update(Request $request, $id)
    {
        $ids = user_scope_ids();

        $fp = FinishedProduct::when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))->findOrFail($id);

        $data = $request->validate([
            'working_order_id' => 'required|exists:working_orders,id',
            'production_date' => 'required|date',
            'production_voucher_no' => 'required|string|unique:finished_products,production_voucher_no,' . $id,
            'reference_no' => 'nullable|string',
            'remarks' => 'nullable|string',
            'productRows' => 'required|array|min:1',
            'productRows.*.product_id' => 'required|exists:items,id',
            'productRows.*.godown_id' => 'required|exists:godowns,id',
            'productRows.*.quantity' => 'required|numeric|min:0.01',
            'productRows.*.unit_price' => 'nullable|numeric|min:0',
            'productRows.*.total' => 'nullable|numeric|min:0',
        ]);

        $fp->update([
            'working_order_id' => $data['working_order_id'],
            'production_date' => $data['production_date'],
            'production_voucher_no' => $data['production_voucher_no'],
            'reference_no' => $data['reference_no'],
            'remarks' => $data['remarks'],
        ]);

        $fp->items()->delete();
        foreach ($data['productRows'] as $row) {
            $fp->items()->create($row);
        }

        $fp->workingOrder->update([
            'production_status' => 'completed',
            'production_voucher_no' => $data['production_voucher_no'],
        ]);

        return redirect()->route('finished-products.index')
            ->with('success', 'Finished Product updated successfully!');
    }

    /* ───────────── DELETE ───────────── */
    // public function destroy($id)
    // {
    //     $fp = FinishedProduct::findOrFail($id);

    //     $fp->delete();

    //     return redirect()->route('finished-products.index')
    //         ->with('success', 'Finished Product deleted.');
    // }

    public function destroy($id)
    {
        $ids = user_scope_ids();

        $fp = FinishedProduct::when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))->findOrFail($id);

        $fp->delete();

        return redirect()->route('finished-products.index')
            ->with('success', 'Finished Product deleted.');
    }

    /* ───────────── PRINT ───────────── */
    // public function print($id)
    // {
    //     $finishedProduct = FinishedProduct::with(['items.product', 'items.godown', 'workingOrder'])
    //         ->findOrFail($id);

    //     $totalAmount = $finishedProduct->items->sum('total');
    //     $amountInWords = numberToWords($totalAmount); // using your helper

    //     $company = \App\Models\CompanySetting::where('created_by', auth()->id())->first();

    //     return Inertia::render('finished-products/print', [
    //         'finishedProduct' => $finishedProduct,
    //         'company' => $company,
    //         'amountInWords' => $amountInWords,
    //     ]);
    // }

    public function print($id)
    {
        $ids = user_scope_ids();

        $finishedProduct = FinishedProduct::with(['items.product', 'items.godown', 'workingOrder'])
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->findOrFail($id);

        $totalAmount = $finishedProduct->items->sum('total');
        $amountInWords = numberToWords($totalAmount);

        $company = \App\Models\CompanySetting::when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))->first();

        return Inertia::render('finished-products/print', [
            'finishedProduct' => $finishedProduct,
            'company' => $company,
            'amountInWords' => $amountInWords,
        ]);
    }


    // Controller update for edit + update

    // Add to FinishedProductController.php

    

    /* ───────────── HELPER: AUTO VOUCHER ───────────── */
    // private function nextVoucher(): string
    // {
    //     $last = FinishedProduct::where('created_by', auth()->id())
    //         ->latest()
    //         ->value('production_voucher_no');

    //     $num = $last ? (int)str_replace('Pro-', '', $last) + 1 : 1;

    //     return 'Pro-' . str_pad($num, 4, '0', STR_PAD_LEFT);
    // }

    private function nextVoucher($ids = null): string
    {
        $ids = $ids ?? user_scope_ids();

        $last = FinishedProduct::when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->latest()
            ->value('production_voucher_no');

        $num = $last ? (int)str_replace('Pro-', '', $last) + 1 : 1;

        return 'Pro-' . str_pad($num, 4, '0', STR_PAD_LEFT);
    }


}
