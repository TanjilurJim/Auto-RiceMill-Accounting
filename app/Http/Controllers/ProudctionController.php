<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Godown;
use App\Models\WorkingOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;


class ProductionController extends Controller
{
    // Show the form for creating a working order
    public function create()
    {
        // Fetch products and godowns to pass to the view
        $products = Item::all();
        $godowns = Godown::all();

        // Return Inertia page with products and godowns
        return Inertia::render('Production/WorkingOrderAdd', [
            'products' => $products,
            'godowns' => $godowns,
        ]);
    }

    // Store the working order in the database
    public function store(Request $request)
    {
        // Validate the incoming request data
        $data = $request->validate([
            'date' => 'required|date',
            'voucher_no' => 'required|string|unique:working_orders',
            'reference_no' => 'required|string|unique:working_orders',
            'product_id' => 'required|exists:items,id',
            'godown_id' => 'required|exists:godowns,id',
            'quantity' => 'required|numeric',
            'purchase_price' => 'required|numeric',
            'subtotal' => 'required|numeric',
            'total_price' => 'required|numeric',
        ]);

        // Create a new working order
        WorkingOrder::create([
            'date' => $data['date'],
            'voucher_no' => $data['voucher_no'],
            'reference_no' => $data['reference_no'],
            'product_id' => $data['product_id'],
            'godown_id' => $data['godown_id'],
            'quantity' => $data['quantity'],
            'purchase_price' => $data['purchase_price'],
            'subtotal' => $data['subtotal'],
            'total_price' => $data['total_price'],
            'created_by' => auth()->id(),
        ]);

        // Redirect back to the form with success message
        return redirect()->route('production.create')->with('success', 'Working Order added successfully!');
    }

    // Show the form for editing a working order
    public function edit($id)
    {
        // Fetch the working order, products, and godowns
        $workingOrder = WorkingOrder::findOrFail($id);
        $products = Item::all();
        $godowns = Godown::all();

        // Return the edit page with the working order, products, and godowns
        return Inertia::render('Production/WorkingOrderEdit', [
            'workingOrder' => $workingOrder,
            'products' => $products,
            'godowns' => $godowns,
        ]);
    }

    // Update the working order in the database
    public function update(Request $request, $id)
    {
        // Validate the incoming request data
        $data = $request->validate([
            'date' => 'required|date',
            'voucher_no' => 'required|string|unique:working_orders,voucher_no,' . $id,
            'reference_no' => 'required|string|unique:working_orders,reference_no,' . $id,
            'product_id' => 'required|exists:items,id',
            'godown_id' => 'required|exists:godowns,id',
            'quantity' => 'required|numeric',
            'purchase_price' => 'required|numeric',
            'subtotal' => 'required|numeric',
            'total_price' => 'required|numeric',
        ]);

        // Find the working order by ID and update it
        $workingOrder = WorkingOrder::findOrFail($id);
        $workingOrder->update([
            'date' => $data['date'],
            'voucher_no' => $data['voucher_no'],
            'reference_no' => $data['reference_no'],
            'product_id' => $data['product_id'],
            'godown_id' => $data['godown_id'],
            'quantity' => $data['quantity'],
            'purchase_price' => $data['purchase_price'],
            'subtotal' => $data['subtotal'],
            'total_price' => $data['total_price'],
        ]);

        // Redirect to the list or details page with a success message
        return redirect()->route('production.create')->with('success', 'Working Order updated successfully!');
    }

    // Delete the working order
    public function delete($id)
    {
        // Find the working order by ID and delete it
        $workingOrder = WorkingOrder::findOrFail($id);
        $workingOrder->delete();

        // Redirect with a success message
        return redirect()->route('production.create')->with('success', 'Working Order deleted successfully!');
    }

    // Show the details of a specific working order
    public function show($id)
    {
        // Fetch the working order and associated data
        $workingOrder = WorkingOrder::with(['product', 'godown', 'creator'])->findOrFail($id);

        // Return the details page with the working order
        return Inertia::render('Production/WorkingOrderShow', [
            'workingOrder' => $workingOrder,
        ]);
    }

    // Print the working order details
    public function print($id)
    {
        // Fetch the working order and associated data
        $workingOrder = WorkingOrder::with(['product', 'godown', 'creator'])->findOrFail($id);

        // Return a printable view (you can create a new Blade or Vue page for this)
        return view('production.print', [
            'workingOrder' => $workingOrder,
        ]);
    }
}
