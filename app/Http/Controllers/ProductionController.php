<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Godown;
use App\Models\WorkingOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductionController extends Controller
{
    /* ─────────────────────────  INDEX  ───────────────────────── */
    // app/Http/Controllers/ProductionController.php
    public function index()
    {
        $workingOrders = WorkingOrder::with([
            'items.item',
            'items.godown',
            'extras',
            'creator',
        ])
            ->where('created_by', auth()->id())
            ->select([
                'id',
                'voucher_no',
                'reference_no',
                'date',
                'total_amount',
                'production_status',
                'production_voucher_no',
            ])
            ->withSum('items as total_quantity', 'quantity')
            ->withSum('items as subtotal', 'subtotal')
            ->orderBy('id', 'desc')
            ->paginate(10);

        return Inertia::render('working-order/index', [
            'workingOrders' => $workingOrders,
        ]);
    }



    /* ─────────────────────────  CREATE FORM  ───────────────────────── */
    public function create()
    {
        $products = Item::where('created_by', auth()->id())
            ->get()
            ->unique('item_name') // remove duplicates by name
            ->values();           // reset the array keys

        return Inertia::render('working-order/create', [
            'products'      => $products,
            'godowns'       => Godown::where('created_by', auth()->id())->get(),
            'autoVoucherNo' => $this->nextVoucher(),
        ]);
    }

    /* ─────────────────────────  STORE  ───────────────────────── */
    public function store(Request $request)
    {
        // Validate the incoming request
        $data = $request->validate([
            'date'         => 'required|date',
            'voucher_no'   => 'required|string',
            'reference_no' => 'nullable|string',
            'orderData'    => 'required|array|min:1',
            'orderData.*.product_id'     => 'required|exists:items,id',
            'orderData.*.godown_id'      => 'required|exists:godowns,id',
            'orderData.*.quantity'       => 'required|numeric|min:1',
            'orderData.*.purchase_price' => 'required|numeric|min:0',
            'orderData.*.subtotal'       => 'required|numeric|min:0',
            'extrasData'            => 'nullable|array',
            'extrasData.*.title'    => 'required_with:extrasData|string',
            'extrasData.*.quantity' => 'nullable|numeric',
            'extrasData.*.price'    => 'nullable|numeric',
            'extrasData.*.total'    => 'required|numeric',
        ]);

        // Ensure tenant_id is properly set (using current authenticated user's ID)
        $tenantId = auth()->id();  // Assuming the tenant_id is the current authenticated user

        // Check if the voucher_no already exists for the same tenant_id
        $existingOrder = WorkingOrder::where('tenant_id', $tenantId)
            ->where('voucher_no', $data['voucher_no'])
            ->first();

        if ($existingOrder) {
            // If exists, generate a new voucher number or throw an error
            return back()->withErrors(['voucher_no' => 'Voucher number already exists for this tenant.']);
        }

        // Create the working order with tenant_id
        $wo = WorkingOrder::create([
            'tenant_id'    => $tenantId,  // Now tenant_id is explicitly set
            'date'         => $data['date'],
            'voucher_no'   => $data['voucher_no'],
            'reference_no' => $data['reference_no'],
            'created_by'   => $tenantId,  // Assuming created_by is the same as tenant_id
        ]);

        // Continue with the rest of the store logic...

        // Insert items and extras as necessary
        $grandTotal = 0;
        foreach ($data['orderData'] as $row) {
            $grandTotal += $row['subtotal'];
            $wo->items()->create($row);
        }

        foreach ($data['extrasData'] ?? [] as $extra) {
            $grandTotal += $extra['total'];
            $wo->extras()->create($extra);
        }

        // Update total amount for the working order
        $wo->update(['total_amount' => $grandTotal]);

        return redirect()->route('working-orders.index')
            ->with('success', 'Working Order added successfully!');
    }


    /* ─────────────────────────  EDIT FORM  ───────────────────────── */
    public function edit($id)
    {
        $workingOrder = WorkingOrder::with('items', 'extras')->findOrFail($id);

        if ($workingOrder->created_by !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('working-order/edit', [
            'workingOrder' => $workingOrder,
            'products'     => Item::where('created_by', auth()->id())->get(),
            'godowns'      => Godown::where('created_by', auth()->id())->get(),
        ]);
    }

    /* ─────────────────────────  UPDATE  ───────────────────────── */
    public function update(Request $request, $id)
    {
        $workingOrder = WorkingOrder::findOrFail($id);
        if ($workingOrder->created_by !== auth()->id()) {
            abort(403);
        }

        $data = $request->validate([
            'date'         => 'required|date',
            'voucher_no'   => 'required|string',
            'reference_no' => 'nullable|string',

            'orderData'    => 'required|array|min:1',
            'orderData.*.product_id'     => 'required|exists:items,id',
            'orderData.*.godown_id'      => 'required|exists:godowns,id',
            'orderData.*.quantity'       => 'required|numeric|min:1',
            'orderData.*.purchase_price' => 'required|numeric|min:0',
            'orderData.*.subtotal'       => 'required|numeric|min:0',

            'extrasData'            => 'nullable|array',
            'extrasData.*.title'    => 'required_with:extrasData|string',
            'extrasData.*.quantity' => 'nullable|numeric',
            'extrasData.*.price'    => 'nullable|numeric',
            'extrasData.*.total'    => 'required|numeric',
        ]);

        $workingOrder->update([
            'date'         => $data['date'],
            'voucher_no'   => $data['voucher_no'],
            'reference_no' => $data['reference_no'],
        ]);

        /* reset & re‑insert items */
        $workingOrder->items()->delete();
        $grandTotal = 0;
        foreach ($data['orderData'] as $row) {
            $grandTotal += $row['subtotal'];
            $workingOrder->items()->create($row);
        }

        /* reset & re‑insert extras */
        $workingOrder->extras()->delete();
        foreach ($data['extrasData'] ?? [] as $extra) {
            $grandTotal += $extra['total'];
            $workingOrder->extras()->create($extra);
        }

        $workingOrder->update(['total_amount' => $grandTotal]);

        return back()->with('success', 'Working Order updated successfully!');
    }


    /* ─────────────────────────  DELETE  ───────────────────────── */
    public function delete($id)
    {
        $workingOrder = WorkingOrder::findOrFail($id);
        if ($workingOrder->created_by !== auth()->id()) {
            abort(403);
        }

        $workingOrder->delete();   // cascade deletes items
        return redirect()->route('production.index')
            ->with('success', 'Working Order deleted successfully!');
    }

    /* ─────────────────────────  SHOW  ───────────────────────── */
    public function show($id)
    {
        $workingOrder = WorkingOrder::with([
            'items.item',
            'items.godown',
            'extras',
            'creator',
        ])->findOrFail($id);

        if ($workingOrder->created_by !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('working-order/show', [
            'workingOrder' => $workingOrder,
        ]);
    }

    /* ─────────────────────────  PRINT  ───────────────────────── */
    public function print($id)
    {
        $workingOrder = WorkingOrder::with([
            'items.product',
            'items.godown',
            'creator',
        ])->findOrFail($id);

        if ($workingOrder->created_by !== auth()->id()) {
            abort(403);
        }

        return view('production.print', compact('workingOrder'));
    }

    /* ─────────────────────────  HELPER : Next Voucher  ───────────────────────── */
    private function nextVoucher(): string
    {
        $last = WorkingOrder::where('created_by', auth()->id())
            ->latest()
            ->value('voucher_no');          // e.g. WO-0012

        $num  = $last ? (int)str_replace('WO-', '', $last) + 1 : 1;

        return 'WO-' . str_pad($num, 4, '0', STR_PAD_LEFT);
    }

    public function markAsProduced(Request $request, $id)
    {
        $workingOrder = WorkingOrder::findOrFail($id);

        if ($workingOrder->created_by !== auth()->id()) {
            abort(403);
        }

        // Generate Production Voucher No like: PRD-WO-0012
        $productionVoucher = 'PRD-' . $workingOrder->voucher_no;

        // Update working order
        $workingOrder->update([
            'production_status' => 'completed',
            'production_voucher_no' => $productionVoucher,
        ]);

        return redirect()->back()->with('success', 'Production marked as completed.');
    }
}
