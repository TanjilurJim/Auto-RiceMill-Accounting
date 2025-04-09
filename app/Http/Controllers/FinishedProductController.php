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
    public function index()
    {
        $finishedProducts = FinishedProduct::with([
            'workingOrder',
            'items.product',
            'items.godown',
        ])
            ->where('created_by', auth()->id())
            ->orderBy('id', 'desc')
            ->paginate(10);

        return Inertia::render('finished-products/index', [
            'finishedProducts' => $finishedProducts,
        ]);
    }

    /* ───────────── CREATE ───────────── */
    public function create()
    {
        return Inertia::render('finished-products/create', [
            'workingOrders' => WorkingOrder::with(['items.item', 'items.godown', 'extras'])
                ->where('created_by', auth()->id())
                ->latest()
                ->get(),
            'products'      => Item::where('created_by', auth()->id())->get(),
            'godowns'       => Godown::where('created_by', auth()->id())->get(),
            'autoVoucherNo' => $this->nextVoucher(),
        ]);
    }

    /* ───────────── STORE ───────────── */
    public function store(Request $request)
    {
        $data = $request->validate([
            'working_order_id'       => 'required|exists:working_orders,id',
            'production_date'        => 'required|date',
            'production_voucher_no'  => 'required|string|unique:finished_products,production_voucher_no',
            'reference_no'           => 'nullable|string',
            'remarks'                => 'nullable|string',
            'productRows'            => 'required|array|min:1',
            'productRows.*.product_id'   => 'required|exists:items,id',
            'productRows.*.godown_id'    => 'required|exists:godowns,id',
            'productRows.*.quantity'     => 'required|numeric|min:0.01',
            'productRows.*.unit_price'   => 'nullable|numeric|min:0',
            'productRows.*.total'        => 'nullable|numeric|min:0',
        ]);

        // Header
        $fp = FinishedProduct::create([
            'working_order_id'      => $data['working_order_id'],
            'production_date'       => $data['production_date'],
            'production_voucher_no' => $data['production_voucher_no'],
            'reference_no'          => $data['reference_no'],
            'remarks'               => $data['remarks'],
            'created_by'            => auth()->id(),
        ]);

        // Items
        foreach ($data['productRows'] as $row) {
            $fp->items()->create($row);
        }

        // Update working order status
        $fp->workingOrder->update([
            'production_status'     => 'completed',
            'production_voucher_no' => $data['production_voucher_no'],
        ]);

        return redirect()->route('finished-products.index')
            ->with('success', 'Finished Product saved successfully!');
    }

    /* ───────────── SHOW ───────────── */
    public function show($id)
    {
        $finishedProduct = FinishedProduct::with([
            'workingOrder',
            'items.product',
            'items.godown',
        ])->findOrFail($id);

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

    /* ───────────── DELETE ───────────── */
    public function destroy($id)
    {
        $fp = FinishedProduct::findOrFail($id);

        $fp->delete();

        return redirect()->route('finished-products.index')
            ->with('success', 'Finished Product deleted.');
    }

    /* ───────────── PRINT ───────────── */
    public function print($id)
    {
        $finishedProduct = FinishedProduct::with(['items.product', 'items.godown', 'workingOrder'])
            ->findOrFail($id);

        $totalAmount = $finishedProduct->items->sum('total');
        $amountInWords = numberToWords($totalAmount); // using your helper

        $company = \App\Models\CompanySetting::where('created_by', auth()->id())->first();

        return Inertia::render('finished-products/print', [
            'finishedProduct' => $finishedProduct,
            'company' => $company,
            'amountInWords' => $amountInWords,
        ]);
    }


    // Controller update for edit + update

    // Add to FinishedProductController.php

    public function edit($id)
    {
        $finishedProduct = FinishedProduct::with(['items', 'workingOrder', 'items.product', 'items.godown'])
            ->where('created_by', auth()->id())
            ->findOrFail($id);

        return Inertia::render('finished-products/edit', [
            'finishedProduct' => $finishedProduct,
            'workingOrders'   => WorkingOrder::with(['items.item', 'items.godown', 'extras'])
                ->where('created_by', auth()->id())
                ->latest()->get(),
            'products'        => Item::where('created_by', auth()->id())->get(),
            'godowns'         => Godown::where('created_by', auth()->id())->get(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $fp = FinishedProduct::where('created_by', auth()->id())->findOrFail($id);

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

        // Update header
        $fp->update([
            'working_order_id' => $data['working_order_id'],
            'production_date' => $data['production_date'],
            'production_voucher_no' => $data['production_voucher_no'],
            'reference_no' => $data['reference_no'],
            'remarks' => $data['remarks'],
        ]);

        // Reset product items
        $fp->items()->delete();
        foreach ($data['productRows'] as $row) {
            $fp->items()->create($row);
        }

        // Update WorkingOrder
        $fp->workingOrder->update([
            'production_status' => 'completed',
            'production_voucher_no' => $data['production_voucher_no'],
        ]);

        return redirect()->route('finished-products.index')
            ->with('success', 'Finished Product updated successfully!');
    }


    /* ───────────── HELPER: AUTO VOUCHER ───────────── */
    private function nextVoucher(): string
    {
        $last = FinishedProduct::where('created_by', auth()->id())
            ->latest()
            ->value('production_voucher_no');

        $num = $last ? (int)str_replace('Pro-', '', $last) + 1 : 1;

        return 'Pro-' . str_pad($num, 4, '0', STR_PAD_LEFT);
    }
}
