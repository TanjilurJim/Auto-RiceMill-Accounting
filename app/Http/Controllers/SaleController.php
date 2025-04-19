<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Godown;
use App\Models\Salesman;
use App\Models\AccountLedger;
use App\Models\Item;
use App\Models\Stock;
use App\Models\Journal;
use App\Models\JournalEntry;

use Illuminate\Support\Facades\DB;
use App\Models\ReceivedMode;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SaleController extends Controller
{
    // List Sales
    public function index()
    {
        $sales = Sale::with([
            'godown',
            'salesman',
            'accountLedger',
            'saleItems.item',
            'creator'
        ])
            ->where('created_by', auth()->id())
            ->orderBy('id', 'desc')
            ->paginate(10);

        return Inertia::render('sales/index', [
            'sales' => $sales
        ]);
    }

    // Create Sale Form
    public function create()
    {
        return Inertia::render('sales/create', [
            'godowns' => Godown::where('created_by', auth()->id())->get(),
            'salesmen' => Salesman::where('created_by', auth()->id())->get(),
            'ledgers' => AccountLedger::where('created_by', auth()->id())->get(),
            'items' => Item::where('created_by', auth()->id())->get(),
            'receivedModes' => \App\Models\ReceivedMode::with('ledger')
                ->where('created_by', auth()->id())
                ->get(['id', 'mode_name', 'ledger_id']),
        ]);
    }

    private function updateLedgerBalance($ledgerId, $type, $amount)
    {
        $ledger = AccountLedger::find($ledgerId);
        if (!$ledger) return;

        $current = $ledger->closing_balance ?? $ledger->opening_balance ?? 0;
        $ledger->closing_balance = $type === 'debit'
            ? $current + $amount
            : $current - $amount;

        $ledger->save();
    }

    // Store Sale
    public function store(Request $request)
    {
        $this->validateRequest($request);

        $voucherNo = $request->voucher_no ?? 'SAL-' . now()->format('Ymd') . '-' . str_pad(Sale::max('id') + 1, 4, '0', STR_PAD_LEFT);

        DB::beginTransaction();

        try {
            // 1️⃣ Create Sale
            $sale = Sale::create([
                'date' => $request->date,
                'voucher_no' => $voucherNo,
                'godown_id' => $request->godown_id,
                'salesman_id' => $request->salesman_id,
                'account_ledger_id' => $request->account_ledger_id,
                'phone' => $request->phone,
                'address' => $request->address,
                'shipping_details' => $request->shipping_details,
                'delivered_to' => $request->delivered_to,
                'truck_rent' => $request->truck_rent,
                'rent_advance' => $request->rent_advance,
                'net_rent' => $request->net_rent,
                'truck_driver_name' => $request->truck_driver_name,
                'driver_address' => $request->driver_address,
                'driver_mobile' => $request->driver_mobile,
                'total_qty' => collect($request->sale_items)->sum('qty'),
                'total_discount' => collect($request->sale_items)->sum('discount'),
                'grand_total' => collect($request->sale_items)->sum('subtotal'),
                'other_expense_ledger_id' => $request->other_expense_ledger_id,
                'other_amount' => $request->other_amount ?? 0,
                'received_mode_id' => $request->received_mode_id,
                'amount_received' => $request->amount_received,
                'total_due' => $request->total_due,
                'closing_balance' => $request->closing_balance,
                'created_by' => auth()->id(),
            ]);

            // 2️⃣ Create Sale Items + reduce stock
            foreach ($request->sale_items as $item) {
                $sale->saleItems()->create([
                    'product_id' => $item['product_id'],
                    'qty' => $item['qty'],
                    'main_price' => $item['main_price'],
                    'discount' => $item['discount'] ?? 0,
                    'discount_type' => $item['discount_type'],
                    'subtotal' => $item['subtotal'],
                    'note' => $item['note'] ?? null,
                ]);

                // Stock decrement
                Stock::where([
                    'item_id' => $item['product_id'],
                    'godown_id' => $request->godown_id,
                    'created_by' => auth()->id(),
                ])->decrement('qty', $item['qty']);
            }

            // 3️⃣ Journal Header
            $journal = Journal::create([
                'date' => $request->date,
                'voucher_no' => $voucherNo,
                'narration' => 'Auto journal for Sale',
                'created_by' => auth()->id(),
            ]);
            $sale->update(['journal_id' => $journal->id]);
            if ($request->received_mode_id && $request->amount_received > 0) {
                ReceivedMode::where('id', $request->received_mode_id)->update([
                    'amount_received' => $request->amount_received,
                    'transaction_date' => $request->date,
                    'sale_id' => $sale->id,
                ]);
            }

            $grandTotal = $sale->grand_total;
            $amountReceived = $request->amount_received ?? 0;
            $customerLedgerId = $request->account_ledger_id;

            // Always CREDIT customer for full sale amount
            JournalEntry::create([
                'journal_id' => $journal->id,
                'account_ledger_id' => $customerLedgerId,
                'type' => 'credit',
                'amount' => $grandTotal,
                'note' => 'Sale to customer',
            ]);
            $this->updateLedgerBalance($customerLedgerId, 'credit', $grandTotal);

            // If payment received
            if ($amountReceived > 0 && $request->received_mode_id) {
                $receivedMode = ReceivedMode::with('ledger')->find($request->received_mode_id);

                if ($receivedMode && $receivedMode->ledger) {
                    // 1️⃣ Debit received account (Nagad, Cash etc.)
                    JournalEntry::create([
                        'journal_id' => $journal->id,
                        'account_ledger_id' => $receivedMode->ledger_id,
                        'type' => 'debit',
                        'amount' => $amountReceived,
                        'note' => 'Payment received via ' . $receivedMode->mode_name,
                    ]);
                    $this->updateLedgerBalance($receivedMode->ledger_id, 'debit', $amountReceived);

                    // 2️⃣ Only debit customer if partial payment
                    if ($amountReceived < $grandTotal) {
                        JournalEntry::create([
                            'journal_id' => $journal->id,
                            'account_ledger_id' => $customerLedgerId,
                            'type' => 'debit',
                            'amount' => $amountReceived,
                            'note' => 'Receivable partially settled by customer',
                        ]);
                        $this->updateLedgerBalance($customerLedgerId, 'debit', $amountReceived);
                    }

                    // Update ReceivedMode table
                    $receivedMode->update([
                        'amount_received' => $amountReceived,
                        'transaction_date' => $request->date,
                        'sale_id' => $sale->id,
                    ]);
                }
            }


            // 4️⃣ Credit Inventory (COGS)



            DB::commit();
            return redirect()->route('sales.index')->with('success', 'Sale created and journal posted!');
        } catch (\Throwable $e) {
            DB::rollBack();
            report($e);
            return back()->with('error', 'Failed to save sale.');
        }
    }


    // Edit Sale Form
    public function edit(Sale $sale)
    {
        if ($sale->created_by !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('sales/edit', [
            'sale' => $sale->load(['saleItems', 'godown', 'salesman', 'accountLedger', 'receivedMode.ledger',]),
            'godowns' => Godown::where('created_by', auth()->id())->get(),
            'salesmen' => Salesman::where('created_by', auth()->id())->get(),
            'ledgers' => AccountLedger::where('created_by', auth()->id())->get(),
            'items' => Item::where('created_by', auth()->id())->get(),
            'receivedModes' => ReceivedMode::with('ledger')->where('created_by', auth()->id())->get(['id', 'mode_name', 'ledger_id']),
        ]);
    }

    // Update Sale
    public function update(Request $request, Sale $sale)
    {
        if ($sale->created_by !== auth()->id()) {
            abort(403);
        }

        $this->validateRequest($request);

        DB::beginTransaction();

        try {
            // 1️⃣ Reverse old journal entries
            if ($sale->journal_id) {
                $oldEntries = JournalEntry::where('journal_id', $sale->journal_id)->get();
                foreach ($oldEntries as $entry) {
                    $this->updateLedgerBalance($entry->account_ledger_id, $entry->type === 'debit' ? 'credit' : 'debit', $entry->amount);
                }
                JournalEntry::where('journal_id', $sale->journal_id)->delete();
                Journal::where('id', $sale->journal_id)->delete();
            }

            // 2️⃣ Restore stock
            foreach ($sale->saleItems as $oldItem) {
                Stock::where([
                    'item_id' => $oldItem->product_id,
                    'godown_id' => $sale->godown_id,
                    'created_by' => auth()->id(),
                ])->increment('qty', $oldItem->qty);
            }

            // 3️⃣ Update sale
            $sale->update([
                'date' => $request->date,
                'godown_id' => $request->godown_id,
                'salesman_id' => $request->salesman_id,
                'account_ledger_id' => $request->account_ledger_id,
                'phone' => $request->phone,
                'address' => $request->address,
                'shipping_details' => $request->shipping_details,
                'delivered_to' => $request->delivered_to,
                'truck_rent' => $request->truck_rent,
                'rent_advance' => $request->rent_advance,
                'net_rent' => $request->net_rent,
                'truck_driver_name' => $request->truck_driver_name,
                'driver_address' => $request->driver_address,
                'driver_mobile' => $request->driver_mobile,
                'total_qty' => collect($request->sale_items)->sum('qty'),
                'total_discount' => collect($request->sale_items)->sum('discount'),
                'grand_total' => collect($request->sale_items)->sum('subtotal'),
                'other_expense_ledger_id' => $request->other_expense_ledger_id,
                'other_amount' => $request->other_amount ?? 0,
                'received_mode_id' => $request->received_mode_id,
                'amount_received' => $request->amount_received,
                'total_due' => $request->total_due,
                'closing_balance' => $request->closing_balance,
            ]);

            $sale->saleItems()->delete();

            foreach ($request->sale_items as $item) {
                $sale->saleItems()->create([
                    'product_id' => $item['product_id'],
                    'qty' => $item['qty'],
                    'main_price' => $item['main_price'],
                    'discount' => $item['discount'] ?? 0,
                    'discount_type' => $item['discount_type'],
                    'subtotal' => $item['subtotal'],
                    'note' => $item['note'] ?? null,
                ]);

                Stock::where([
                    'item_id' => $item['product_id'],
                    'godown_id' => $request->godown_id,
                    'created_by' => auth()->id(),
                ])->decrement('qty', $item['qty']);
            }

            // 4️⃣ New journal
            $journal = Journal::create([
                'date' => $request->date,
                'voucher_no' => $sale->voucher_no,
                'narration' => 'Updated journal for sale',
                'created_by' => auth()->id(),
            ]);
            $sale->update(['journal_id' => $journal->id]);

            // 5️⃣ Entries
            $grandTotal = $sale->grand_total;
            $amountReceived = $request->amount_received ?? 0;
            $customerLedgerId = $request->account_ledger_id;

            // Credit full sale amount to customer
            JournalEntry::create([
                'journal_id' => $journal->id,
                'account_ledger_id' => $customerLedgerId,
                'type' => 'credit',
                'amount' => $grandTotal,
                'note' => 'Updated sale to customer',
            ]);
            $this->updateLedgerBalance($customerLedgerId, 'credit', $grandTotal);

            // If paid
            if ($amountReceived > 0 && $request->received_mode_id) {
                $receivedMode = ReceivedMode::with('ledger')->find($request->received_mode_id);

                if ($receivedMode && $receivedMode->ledger) {
                    // Debit cash/bank/etc
                    JournalEntry::create([
                        'journal_id' => $journal->id,
                        'account_ledger_id' => $receivedMode->ledger_id,
                        'type' => 'debit',
                        'amount' => $amountReceived,
                        'note' => 'Updated payment received via ' . $receivedMode->mode_name,
                    ]);
                    $this->updateLedgerBalance($receivedMode->ledger_id, 'debit', $amountReceived);

                    // Only debit customer if partial payment
                    if ($amountReceived < $grandTotal) {
                        JournalEntry::create([
                            'journal_id' => $journal->id,
                            'account_ledger_id' => $customerLedgerId,
                            'type' => 'debit',
                            'amount' => $amountReceived,
                            'note' => 'Receivable partially settled by customer',
                        ]);
                        $this->updateLedgerBalance($customerLedgerId, 'debit', $amountReceived);
                    }

                    // Update ReceivedMode table
                    $receivedMode->update([
                        'amount_received' => $amountReceived,
                        'transaction_date' => $request->date,
                        'sale_id' => $sale->id,
                    ]);
                }
            }

            DB::commit();
            return redirect()->route('sales.index')->with('success', 'Sale updated and journal reposted!');
        } catch (\Throwable $e) {
            DB::rollBack();
            report($e);
            return back()->with('error', 'Failed to update sale.');
        }
    }


    // Invoice (ERP style print)
    // Invoice (ERP style print)
    public function invoice(Sale $sale)
    {
        $sale->load(['saleItems.item', 'godown', 'salesman', 'accountLedger']);
        return Inertia::render('sales/print/invoice', [
            'sale' => $sale,
            'company' => auth()->user() // Passing company details (User model)
        ]);
    }

    // Truck Chalan (ERP style print)
    public function truckChalan(Sale $sale)
    {
        $sale->load(['saleItems.item', 'godown', 'salesman', 'accountLedger']);
        return Inertia::render('sales/print/truck-chalan', [
            'sale' => $sale,
            'company' => auth()->user() // Passing company details (User model)
        ]);
    }

    // Load Slip (ERP style print)
    public function loadSlip(Sale $sale)
    {
        $sale->load(['saleItems.item', 'godown', 'salesman', 'accountLedger']);
        return Inertia::render('sales/print/load-slip', [
            'sale' => $sale,
            'company' => auth()->user() // Passing company details (User model)
        ]);
    }

    // Gate Pass (ERP style print)
    public function gatePass(Sale $sale)
    {
        $sale->load(['saleItems.item', 'godown', 'salesman', 'accountLedger']);
        return Inertia::render('sales/print/gate-pass', [
            'sale' => $sale,
            'company' => auth()->user() // Passing company details (User model)
        ]);
    }


    // Destroy Sale (already present)
    public function destroy(Sale $sale)
    {
        if ($sale->created_by !== auth()->id()) {
            abort(403);
        }

        $sale->delete();
        return redirect()->back()->with('success', 'Sale deleted successfully!');
    }

    // 🔄 Validation Rules
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'date' => 'required|date',
            'godown_id' => 'required|exists:godowns,id',
            'salesman_id' => 'required|exists:salesmen,id',
            'account_ledger_id' => 'required|exists:account_ledgers,id',
            'sale_items' => 'required|array|min:1',
            'sale_items.*.product_id' => 'required|exists:items,id',
            'sale_items.*.qty' => 'required|numeric|min:0.01',
            'sale_items.*.main_price' => 'required|numeric|min:0',
            'sale_items.*.discount' => 'nullable|numeric|min:0',
            'sale_items.*.discount_type' => 'required|in:bdt,percent',
            'sale_items.*.subtotal' => 'required|numeric|min:0',
            'received_mode_id' => 'nullable|exists:received_modes,id',
            'amount_received' => 'nullable|numeric|min:0',
        ]);
    }

    public function getItemsByGodown($godownId)
    {
        $userId = auth()->id();

        // Querying the stock data from the 'stocks' table and including the quantity
        $stocks = Stock::with('item.unit') // Include unit information if needed
            ->where('godown_id', $godownId)
            ->where('created_by', $userId)
            ->get();

        // Map the stock data to return a list with the item's name, unit, and available stock quantity
        $result = $stocks->map(function ($stock) {
            return [
                'id'        => $stock->item->id,
                'item_name' => $stock->item->item_name,
                'unit'      => $stock->item->unit->name ?? '', // Add unit name if needed
                'stock_qty' => $stock->qty, // Get the stock quantity from the 'stocks' table
            ];
        });

        \Log::info($result); // Check the returned result
        return response()->json($result); // Return the updated list to the frontend

    }
}
