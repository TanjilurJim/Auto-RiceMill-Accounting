<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SalesReturn;
use App\Models\Stock;
use App\Models\Journal;
use App\Models\ReceivedMode;
use App\Models\JournalEntry;
use App\Models\SalesReturnItem;
use App\Models\Godown; // ✅ add this line
use App\Models\Salesman; // ✅ add this line
use App\Models\Item; // ✅ add this line
use App\Models\AccountLedger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use function company_info;
use function numberToWords;
use function godown_scope_ids;

class SalesReturnController extends Controller
{
    // Show list of sales returns
    // public function index()
    // {
    //     $salesReturns = SalesReturn::with(['sale', 'accountLedger']) // Ensure accountLedger is eager-loaded
    //         ->where('created_by', auth()->id())
    //         ->orderBy('id', 'desc')
    //         ->paginate(10);

    //     return Inertia::render('sales_returns/index', [
    //         'salesReturns' => $salesReturns
    //     ]);
    // }
    public function index()
    {
        $ids = godown_scope_ids();

        $salesReturns = SalesReturn::with(['sale', 'accountLedger'])
            ->when(!empty($ids), function ($q) use ($ids) {
                $q->whereIn('created_by', $ids);
            })
            ->orderBy('id', 'desc')
            ->paginate(10);

        return Inertia::render('sales_returns/index', [
            'salesReturns' => $salesReturns
        ]);
    }

    // Show create form
    // public function create()
    // {
    //     $voucher = 'SRL-' . now()->format('Ymd') . '-' . str_pad(SalesReturn::max('id') + 1, 4, '0', STR_PAD_LEFT);

    //     return Inertia::render('sales_returns/create', [
    //         'voucher' => $voucher,
    //         'sales' => Sale::where('created_by', auth()->id())->get(),
    //         'ledgers' => AccountLedger::where('created_by', auth()->id())->get(),
    //         'products' => Item::where('created_by', auth()->id())->get(),
    //         'godowns' => Godown::where('created_by', auth()->id())->get(),
    //         'salesmen' => Salesman::where('created_by', auth()->id())->get(),
    //         'receivedModes' => ReceivedMode::with('ledger')->where('created_by', auth()->id())->get(), // ✅
    //     ]);
    // }

    public function create()
    {
        $ids = godown_scope_ids();
        $voucher = 'SRL-' . now()->format('Ymd') . '-' . str_pad(SalesReturn::max('id') + 1, 4, '0', STR_PAD_LEFT);

        return Inertia::render('sales_returns/create', [
            'voucher' => $voucher,
            'sales' => empty($ids) ? Sale::all() : Sale::whereIn('created_by', $ids)->get(),
            'ledgers' => empty($ids) ? AccountLedger::all() : AccountLedger::whereIn('created_by', $ids)->get(),
            'products' => empty($ids) ? Item::all() : Item::whereIn('created_by', $ids)->get(),
            'godowns' => empty($ids) ? Godown::all() : Godown::whereIn('created_by', $ids)->get(),
            'salesmen' => empty($ids) ? Salesman::all() : Salesman::whereIn('created_by', $ids)->get(),
            'receivedModes' => empty($ids)
                ? ReceivedMode::with('ledger')->get()
                : ReceivedMode::with('ledger')->whereIn('created_by', $ids)->get(),
        ]);
    }


    // Store new sales return
    public function store(Request $request)
    {
        $request->validate([
            'sale_id' => 'nullable|exists:sales,id',
            'voucher_no' => 'required|string|max:255|unique:sales_returns,voucher_no',
            'account_ledger_id' => 'required|exists:account_ledgers,id',
            'godown_id' => 'required|exists:godowns,id',
            'salesman_id' => 'required|exists:salesmen,id',
            'return_date' => 'required|date',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'shipping_details' => 'nullable|string|max:255',
            'inventory_ledger_id' => 'required|exists:account_ledgers,id',
            'cogs_ledger_id' => 'required|exists:account_ledgers,id',
            'received_mode_id' => 'nullable|exists:received_modes,id',
            'amount_received' => 'nullable|numeric|min:0',
            'delivered_to' => 'nullable|string|max:255',
            'reason' => 'nullable|string|max:1000',
            'sales_return_items' => 'required|array|min:1',
            'sales_return_items.*.product_id' => 'required|exists:items,id',
            'sales_return_items.*.qty' => 'required|numeric|min:0.01',
            'sales_return_items.*.main_price' => 'required|numeric|min:0',
            'sales_return_items.*.discount' => 'nullable|numeric|min:0',
            'sales_return_items.*.return_amount' => 'required|numeric|min:0',
        ]);

        \DB::beginTransaction();

        try {
            // 1️⃣ Create Return Header
            $salesReturn = SalesReturn::create([
                'sale_id' => $request->sale_id,
                'voucher_no' => $request->voucher_no,
                'account_ledger_id' => $request->account_ledger_id,
                'inventory_ledger_id' => $request->inventory_ledger_id,
                'cogs_ledger_id' => $request->cogs_ledger_id,
                'godown_id' => $request->godown_id,
                'salesman_id' => $request->salesman_id,
                'return_date' => $request->return_date,
                'phone' => $request->phone,
                'address' => $request->address,
                'shipping_details' => $request->shipping_details,
                'delivered_to' => $request->delivered_to,
                'reason' => $request->reason,
                'total_qty' => collect($request->sales_return_items)->sum('qty'),
                'total_return_amount' => collect($request->sales_return_items)->sum('return_amount'),
                'created_by' => auth()->id(),
            ]);

            // 2️⃣ Save Items + Reverse Stock
            foreach ($request->sales_return_items as $item) {
                $salesReturn->items()->create([
                    'product_id' => $item['product_id'],
                    'qty' => $item['qty'],
                    'main_price' => $item['main_price'],
                    'return_amount' => $item['return_amount'],
                ]);

                // ✅ Reverse Stock
                Stock::where([
                    'item_id' => $item['product_id'],
                    'godown_id' => $request->godown_id,
                    'created_by' => auth()->id(),
                ])->increment('qty', $item['qty']);
            }

            // 3️⃣ Journal Entry Header
            $journal = Journal::create([
                'date' => $request->return_date,
                'voucher_no' => $request->voucher_no,
                'narration' => 'Sales return journal',
                'voucher_type' => 'Sale Return', // ✅ Add this
                'created_by' => auth()->id(),
            ]);
            $salesReturn->update(['journal_id' => $journal->id]);

            $returnAmount = $salesReturn->total_return_amount;
            $customerLedgerId = $request->account_ledger_id;
            $stockLedgerId = $request->inventory_ledger_id; // ⚙️ optional config fallback

            // 4️⃣ Credit Customer (you owe them)
            $returnAmount = $salesReturn->total_return_amount;
            $customerLedgerId = $request->account_ledger_id;
            $stockLedgerId = $request->inventory_ledger_id;
            $cogsLedgerId = $request->cogs_ledger_id;

            // 🔹 Credit Customer
            JournalEntry::create([
                'journal_id' => $journal->id,
                'account_ledger_id' => $customerLedgerId,
                'type' => 'credit',
                'amount' => $returnAmount,
                'note' => 'Customer credited for sales return',
            ]);
            $this->updateLedgerBalance($customerLedgerId, 'credit', $returnAmount);

            // 🔹 Debit Inventory
            JournalEntry::create([
                'journal_id' => $journal->id,
                'account_ledger_id' => $stockLedgerId,
                'type' => 'debit',
                'amount' => $returnAmount,
                'note' => 'Inventory returned from customer',
            ]);
            $this->updateLedgerBalance($stockLedgerId, 'debit', $returnAmount);

            // 🔹 Debit COGS (reverse original expense)
            JournalEntry::create([
                'journal_id' => $journal->id,
                'account_ledger_id' => $cogsLedgerId,
                'type' => 'debit',
                'amount' => $returnAmount,
                'note' => 'Reversing cost of goods sold',
            ]);
            $this->updateLedgerBalance($cogsLedgerId, 'debit', $returnAmount);

            if ($request->received_mode_id && $request->amount_received > 0) {
                $receivedMode = ReceivedMode::find($request->received_mode_id);
                $refundLedgerId = $receivedMode?->ledger_id;

                if ($refundLedgerId) {
                    JournalEntry::create([
                        'journal_id' => $journal->id,
                        'account_ledger_id' => $refundLedgerId,
                        'type' => 'credit',
                        'amount' => $request->amount_received,
                        'note' => 'Refund to customer (cash/bank)',
                    ]);
                    $this->updateLedgerBalance($refundLedgerId, 'credit', $request->amount_received);
                }
            }


            \DB::commit();
            return redirect()->route('sales-returns.index')->with('success', 'Sales Return created successfully!');
        } catch (\Throwable $e) {
            \DB::rollBack();
            \Log::error('SalesReturn store failed: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return back()->with('error', 'Failed to create sales return. ' . $e->getMessage());
        }
    }



    // Show edit form
    // public function edit(SalesReturn $salesReturn)
    // {
    //     $salesReturn->load(['items', 'sale']); // load related sale as well

    //     return Inertia::render('sales_returns/edit', [
    //         'salesReturn' => $salesReturn,
    //         'sales' => Sale::where('created_by', auth()->id())->get(),
    //         'ledgers' => AccountLedger::where('created_by', auth()->id())->get(),
    //         'products' => Item::where('created_by', auth()->id())->get(),
    //         'godowns' => Godown::where('created_by', auth()->id())->get(),
    //         'salesmen' => Salesman::where('created_by', auth()->id())->get(),
    //     ]);
    // }

    public function edit(SalesReturn $salesReturn)
    {
        $ids = godown_scope_ids();
        $salesReturn->load(['items', 'sale']);

        return Inertia::render('sales_returns/edit', [
            'salesReturn' => $salesReturn,
            'sales' => empty($ids) ? Sale::all() : Sale::whereIn('created_by', $ids)->get(),
            'ledgers' => empty($ids) ? AccountLedger::all() : AccountLedger::whereIn('created_by', $ids)->get(),
            'products' => empty($ids) ? Item::all() : Item::whereIn('created_by', $ids)->get(),
            'godowns' => empty($ids) ? Godown::all() : Godown::whereIn('created_by', $ids)->get(),
            'salesmen' => empty($ids) ? Salesman::all() : Salesman::whereIn('created_by', $ids)->get(),
        ]);
    }

    // Update sales return
    public function update(Request $request, SalesReturn $salesReturn)
    {
        $request->validate([
            'return_date' => 'required|date',
            'reason' => 'nullable|string|max:1000',
            'sales_return_items' => 'required|array|min:1',
            'sales_return_items.*.product_id' => 'required|exists:items,id',
            'sales_return_items.*.qty' => 'required|numeric|min:0.01',
            'sales_return_items.*.main_price' => 'required|numeric|min:0',
        ]);

        $salesReturn->update([
            'return_date' => $request->return_date,
            'reason' => $request->reason,
            'total_qty' => collect($request->sales_return_items)->sum('qty'),
            'total_return_amount' => collect($request->sales_return_items)->sum('return_amount'),
        ]);

        if ($salesReturn->journal) {
            $salesReturn->journal->update([
                'voucher_type' => 'Sale Return',
            ]);
        }

        $salesReturn->items()->delete();
        foreach ($request->sales_return_items as $item) {
            $salesReturn->items()->create([
                'product_id' => $item['product_id'],
                'qty' => $item['qty'],
                'main_price' => $item['main_price'],
                'return_amount' => $item['return_amount'],
            ]);
        }

        return redirect()->route('sales-returns.index')->with('success', 'Sales Return updated successfully!');
    }

    // public function invoice(SalesReturn $salesReturn)
    // {
    //     /* tenant-safety */
    //     if (
    //         ! auth()->user()->hasRole('admin') &&
    //         $salesReturn->created_by !== auth()->id()
    //     ) {
    //         abort(403, 'Unauthorised');
    //     }

    //     /* eager-load everything the UI needs */
    //     $salesReturn->load([
    //         'items.product.unit',
    //         'accountLedger',
    //         'sale',
    //     ]);

    //     return Inertia::render('sales_returns/invoice', [
    //         'return'       => $salesReturn,
    //         'company'      => company_info(),                                 // logo, name, …
    //         'amountWords'  => numberToWords(                                  // e.g. “One thousand …”
    //             (int) $salesReturn->items->sum('return_amount')
    //         ),
    //     ]);
    // }

    public function invoice(SalesReturn $salesReturn)
    {
        $ids = godown_scope_ids();
        if (!empty($ids) && !in_array($salesReturn->created_by, $ids)) {
            abort(403, 'Unauthorised');
        }

        $salesReturn->load([
            'items.product.unit',
            'accountLedger',
            'sale',
        ]);

        return Inertia::render('sales_returns/invoice', [
            'return'       => $salesReturn,
            'company'      => company_info(),
            'amountWords'  => numberToWords(
                (int) $salesReturn->items->sum('return_amount')
            ),
        ]);
    }



    // Delete sales return
    // public function destroy(SalesReturn $salesReturn)
    // {
    //     $salesReturn->delete();
    //     return redirect()->back()->with('success', 'Sales Return deleted successfully!');
    // }

    public function destroy(SalesReturn $salesReturn)
    {
        $ids = godown_scope_ids();
        if (!empty($ids) && !in_array($salesReturn->created_by, $ids)) {
            abort(403, 'Unauthorized');
        }

        $salesReturn->delete();
        return redirect()->back()->with('success', 'Sales Return deleted successfully!');
    }

    public function loadSale(Sale $sale)
    {
        $sale->load([
            'saleItems:id,sale_id,product_id,qty,main_price,discount',
        ]);

        return response()->json([
            'id' => $sale->id,
            'account_ledger_id' => $sale->account_ledger_id,
            'godown_id' => $sale->godown_id,
            'salesman_id' => $sale->salesman_id,
            'phone' => $sale->phone,
            'address' => $sale->address,
            'inventory_ledger_id' => $sale->inventory_ledger_id,
            'cogs_ledger_id' => $sale->cogs_ledger_id,
            'received_mode_id' => $sale->received_mode_id,
            'amount_received' => $sale->amount_received,
            'sale_items' => $sale->saleItems->map(fn($item) => [
                'product_id' => $item->product_id,
                'qty' => $item->qty,
                'main_price' => $item->main_price,
                'discount' => $item->discount ?? 0,
                'max_qty' => $item->qty,
            ]),
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
}
