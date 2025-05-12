<?php

namespace App\Http\Controllers;

use App\Models\PartyStockMove;
use App\Models\PartyJobStock;
use App\Models\AccountLedger;
use App\Models\Item;
use App\Models\Unit;
use App\Models\Godown;
use Illuminate\Http\Request;

use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class PartyStockMoveController extends Controller
{
    public function create()
    {
        $dateStr = now()->format('Ymd');
        $random = random_int(1000, 9999);
        $generatedRefNo = "PSD-$dateStr-$random";

        return Inertia::render('crushing/PartyStockDepositForm', [
            'parties' => AccountLedger::whereIn('ledger_type', ['sales', 'income'])
                ->where(createdByMeOnly())
                ->get(['id', 'account_ledger_name']),
            'items'   => Item::where(createdByMeOnly())->get(['id', 'item_name', 'unit_id']),
            'units' => Unit::where(createdByMeOnly())->get(['id', 'name']),
            'godowns' => Godown::where(createdByMeOnly())->get(['id', 'name']),
            'today'   => now()->toDateString(),
            'generated_ref_no' => $generatedRefNo,
        ]);
    }

    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'date'             => ['required', 'date'],
            'party_ledger_id'  => ['required', 'exists:account_ledgers,id'],
            'godown_id_to'     => ['required', 'exists:godowns,id'],
            'ref_no'           => ['nullable', 'string', 'max:255'],
            'remarks'          => ['nullable', 'string'],
            'deposits'         => ['required', 'array', 'min:1'],
            'deposits.*.item_id' => ['required', 'exists:items,id'],
            'deposits.*.qty'    => ['required', 'numeric', 'min:0.01'],
            'deposits.*.unit_name' => ['nullable', 'string'],
            'deposits.*.rate'   => ['required', 'numeric', 'min:0'],  // Ensure rate is required
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['deposits'] as $deposit) {
                // Create a new record in the PartyStockMove table
                PartyStockMove::create([
                    'date'            => $validated['date'],
                    'party_ledger_id' => $validated['party_ledger_id'],
                    'item_id'         => $deposit['item_id'],
                    'unit_id'         => null,
                    'unit_name'       => $deposit['unit_name'],
                    'godown_id_from'  => null,
                    'godown_id_to'    => $validated['godown_id_to'],
                    'qty'             => $deposit['qty'],
                    'rate'            => $deposit['rate'],  // Save the rate
                    'total'           => $deposit['qty'] * $deposit['rate'],  // Calculate and save total
                    'move_type'       => 'deposit',
                    'ref_no'          => $validated['ref_no'] ?? null,
                    'remarks'         => $validated['remarks'] ?? null,
                    'created_by'      => auth()->id(),
                ]);

                // Update the stock for PartyJobStock
                $stock = PartyJobStock::firstOrNew([
                    'party_ledger_id' => $validated['party_ledger_id'],
                    'item_id'         => $deposit['item_id'],
                    'godown_id'       => $validated['godown_id_to'],
                ]);

                $stock->qty = ($stock->qty ?? 0) + $deposit['qty'];
                $stock->created_by = auth()->id();
                $stock->save();
            }
        });

        // Redirect back with success message
        return redirect()->route('party-stock.deposit.index')->with('success', 'মাল জমা সফলভাবে যুক্ত হয়েছে।');
    }


    // Method to display the list of deposits
    public function index()
    {
        // Step 1: Get paginated list of distinct ref_no's
        $refNos = PartyStockMove::select('ref_no')
            ->where('move_type', 'deposit')
            ->where('created_by', auth()->id())
            ->groupBy('ref_no')
            ->orderByRaw('MAX(date) DESC')
            ->paginate(10); // Adjust per page as needed

        // Step 2: Get all stock moves with those ref_nos
        $moves = PartyStockMove::with(['item', 'partyLedger', 'godownTo'])
            ->where('move_type', 'deposit')
            ->where('created_by', auth()->id())
            ->whereIn('ref_no', $refNos->pluck('ref_no'))
            ->orderBy('date', 'desc')
            ->get();

        // Step 3: Group moves by ref_no and format
        $grouped = $moves->groupBy('ref_no')->map(function ($group) {
            $first = $group->first();
            return [
                'id' => $first->id,
                'date' => $first->date,
                'ref_no' => $first->ref_no,
                'party_ledger_name' => $first->partyLedger->account_ledger_name ?? '',
                'godown_name' => $first->godownTo->name ?? '',
                'remarks' => $first->remarks,
                'items' => $group->map(function ($item) {
                    return [
                        'item_name' => $item->item->item_name ?? '',
                        'unit_name' => $item->unit_name ?? '',
                        'qty' => $item->qty,
                        'rate' => $item->rate ?? 0,
                        'total' => $item->total ?? 0,
                    ];
                })->values(),
            ];
        })->values();

        return Inertia::render('crushing/PartyStockDepositIndex', [
            'deposits' => $grouped,
            'pagination' => [
                'links' => $refNos->linkCollection(),
                'currentPage' => $refNos->currentPage(),
                'lastPage' => $refNos->lastPage(),
                'total' => $refNos->total(),
            ],
        ]);
    }

    //withdraw 

    public function indexWithdraw()
    {
        // Fetch paginated withdrawals
        $withdrawals = PartyStockMove::with(['item', 'partyLedger', 'godownFrom'])
            ->where('move_type', 'withdraw')
            ->where('created_by', auth()->id())
            ->orderBy('date', 'desc')
            ->paginate(10); // Paginate results

        return Inertia::render('crushing/PartyStockWithdrawIndex', [
            'withdrawals' => $withdrawals,
        ]);
    }

    // Withdraw Method
    public function createWithdraw(Request $request)
    {
        // Generate the reference number
        $dateStr = now()->format('Ymd');
        $random = random_int(1000, 9999);
        $generatedRefNo = "PWD-$dateStr-$random"; // Prefix can be changed

        // Fetch godowns, units, and items
        $godowns = Godown::where(createdByMeOnly())->get(['id', 'name']);
        $units = Unit::where(createdByMeOnly())->get(['id', 'name']);
        $parties = AccountLedger::whereIn('ledger_type', ['sales', 'income'])
            ->where(createdByMeOnly())
            ->get(['id', 'account_ledger_name']);
        $items = Item::where(createdByMeOnly())->get(['id', 'item_name']);

        // Fetch available stock from PartyStockMove for each party and its godowns, including items and unit names
        $availableStock = [];
        foreach ($parties as $party) {
            $stockData = PartyStockMove::where('party_ledger_id', $party->id)
                ->with(['item', 'godownFrom', 'godownTo'])  // Eager load relationships
                ->get(['item_id', 'godown_id_from', 'godown_id_to', 'qty', 'unit_name']);  // Fetch the necessary columns

            foreach ($stockData as $stock) {
                // Store data from godownFrom (source godown)
                $availableStock[$party->id][$stock->item_id][$stock->godown_id_from] = [
                    'qty' => $stock->qty,
                    'item_name' => $stock->item->item_name,
                    'godown_name' => $stock->godownFrom->name ?? '',
                    'unit_name' => $stock->unit_name, // Include the unit name here
                ];

                // Store data from godownTo (destination godown)
                $availableStock[$party->id][$stock->item_id][$stock->godown_id_to] = [
                    'qty' => $stock->qty,
                    'item_name' => $stock->item->item_name,
                    'godown_name' => $stock->godownTo->name ?? '',
                    'unit_name' => $stock->unit_name, // Include the unit name here
                ];
            }
        }

        return Inertia::render('crushing/WithdrawForm', [
            'parties' => $parties,
            'items' => $items,
            'godowns' => $godowns,
            'units' => $units,
            'today' => now()->toDateString(),
            'generated_ref_no' => $generatedRefNo,
            'available_stock' => $availableStock, // Only pass data from PartyStockMove
        ]);
    }







    public function withdraw(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'date'             => ['required', 'date'],
            'party_ledger_id'  => ['required', 'exists:account_ledgers,id'],
            'godown_id_from'   => ['required', 'exists:godowns,id'],
            'item_id'          => ['required', 'exists:items,id'],
            'qty'              => ['required', 'numeric', 'min:0.01'],
            'remarks'          => ['nullable', 'string'],
        ]);

        // Fetch available stock for the party and item
        $availableStock = PartyJobStock::where('party_ledger_id', $validated['party_ledger_id'])
            ->where('item_id', $validated['item_id'])
            ->where('godown_id', $validated['godown_id_from'])
            ->first();

        if (!$availableStock || $availableStock->qty < $validated['qty']) {
            return redirect()->back()->with('error', 'Insufficient stock for withdrawal.');
        }

        // Start a transaction to update both tables
        DB::transaction(function () use ($validated) {
            // Record the withdrawal in party_stock_moves
            PartyStockMove::create([
                'date'            => $validated['date'],
                'party_ledger_id' => $validated['party_ledger_id'],
                'item_id'         => $validated['item_id'],
                'godown_id_from'  => $validated['godown_id_from'],
                'godown_id_to'    => null,
                'qty'             => -$validated['qty'], // Negative quantity for withdrawal
                'move_type'       => 'withdraw',
                'ref_no'          => $validated['ref_no'] ?? null,
                'remarks'         => $validated['remarks'] ?? null,
                'created_by'      => auth()->id(),
            ]);

            // Update the stock in party_job_stocks (decrease quantity)
            $stock = PartyJobStock::where('party_ledger_id', $validated['party_ledger_id'])
                ->where('item_id', $validated['item_id'])
                ->where('godown_id', $validated['godown_id_from'])
                ->first();

            if ($stock) {
                $stock->qty -= $validated['qty']; // Decrease the quantity
                $stock->save();
            }
        });

        return redirect()->route('party-stock.withdraw.index')->with('success', 'মাল উত্তোলন সফলভাবে সম্পন্ন হয়েছে।');
    }

    //transfer

    // Transfer Method
    public function createTransfer(Request $request)
    {
        return Inertia::render('crushing/TransferForm', [
            'parties' => AccountLedger::whereIn('ledger_type', ['sales', 'income'])
                ->where(createdByMeOnly())
                ->get(['id', 'account_ledger_name']),
            'items'   => Item::where(createdByMeOnly())->get(['id', 'item_name']),
            'godowns' => Godown::where(createdByMeOnly())->get(['id', 'name']),
            'today'   => now()->toDateString(),
        ]);
    }

    public function transfer(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'date'             => ['required', 'date'],
            'party_ledger_id'  => ['required', 'exists:account_ledgers,id'],
            'godown_id_from'   => ['required', 'exists:godowns,id'],
            'godown_id_to'     => ['required', 'exists:godowns,id'],
            'item_id'          => ['required', 'exists:items,id'],
            'qty'              => ['required', 'numeric', 'min:0.01'],
            'remarks'          => ['nullable', 'string'],
        ]);

        // Start a transaction to update both tables
        DB::transaction(function () use ($validated) {
            // Record the transfer in party_stock_moves
            PartyStockMove::create([
                'date'            => $validated['date'],
                'party_ledger_id' => $validated['party_ledger_id'],
                'item_id'         => $validated['item_id'],
                'godown_id_from'  => $validated['godown_id_from'],
                'godown_id_to'    => $validated['godown_id_to'],
                'qty'             => -$validated['qty'], // Negative quantity for withdrawal
                'move_type'       => 'transfer',
                'ref_no'          => $validated['ref_no'] ?? null,
                'remarks'         => $validated['remarks'] ?? null,
                'created_by'      => auth()->id(),
            ]);

            // Update the stock in the source godown (decrease quantity)
            $stockFrom = PartyJobStock::where('party_ledger_id', $validated['party_ledger_id'])
                ->where('item_id', $validated['item_id'])
                ->where('godown_id', $validated['godown_id_from'])
                ->first();

            if ($stockFrom) {
                $stockFrom->qty -= $validated['qty']; // Decrease the quantity in source godown
                $stockFrom->save();
            }

            // Update the stock in the destination godown (increase quantity)
            $stockTo = PartyJobStock::where('party_ledger_id', $validated['party_ledger_id'])
                ->where('item_id', $validated['item_id'])
                ->where('godown_id', $validated['godown_id_to'])
                ->first();

            if ($stockTo) {
                $stockTo->qty += $validated['qty']; // Increase the quantity in destination godown
                $stockTo->save();
            }
        });

        return redirect()->route('party-stock.deposit.index')->with('success', 'মাল স্থানান্তর সফলভাবে সম্পন্ন হয়েছে।');
    }
}
