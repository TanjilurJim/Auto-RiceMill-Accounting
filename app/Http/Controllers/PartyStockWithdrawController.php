<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PartyStockMove;
use App\Models\PartyJobStock;
use App\Models\AccountLedger;
use App\Models\Item;
use App\Models\Unit;
use App\Models\Godown;
use App\Models\PartyItem;


use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class PartyStockWithdrawController extends Controller
{
    //
    public function index()
    {
        // grab all withdraw moves for this user
        $rows = PartyStockMove::with(['partyItem', 'partyLedger', 'godownFrom'])
            ->where('move_type', 'withdraw')
            ->where('created_by', auth()->id())
            ->orderBy('date', 'desc')
            ->get();

        // reshape: one row per voucher (ref_no)
        $withdrawals = $rows->groupBy('ref_no')->map(function ($group) {
            $first = $group->first();

            return [
                'id'                => $first->id,
                'date'              => $first->date,
                'ref_no'            => $first->ref_no,
                'party_ledger_name' => $first->partyLedger->account_ledger_name ?? '',
                'godown_name'       => $first->godownFrom->name ?? '',
                'total'             => $group->sum('total'),   // numeric
                'items'             => $group->map(function ($m) {
                    return [
                        'item_name' => $m->partyItem->item_name ?? '',
                        'unit_name' => $m->unit_name ?? '',
                        'qty'       => abs($m->qty),            // make positive
                        'rate'      => $m->rate,
                        'total'     => abs($m->total),
                    ];
                })->values(),
            ];
        })->values();      // plain array

        return Inertia::render('crushing/WithdrawIndex', [
            'withdrawals' => $withdrawals,
        ]);
    }

    // Withdraw Method
    public function create(Request $request)
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
        $items = PartyItem::where(createdByMeOnly())->get(['id', 'item_name', 'party_ledger_id']);

        // Fetch available stock from PartyStockMove for each party and its godowns, including items and unit names
        $availableStock = [];

        $stocks = PartyJobStock::with(['partyItem', 'godown'])
            ->where(createdByMeOnly())
            ->get();

        foreach ($stocks as $stock) {
            // 1️⃣ Ensure the godown node exists
            $availableStock[$stock->party_ledger_id][$stock->godown_id]['godown_name']
                = $stock->godown->name ?? '';

            // 2️⃣ Push each item row under that godown
            $availableStock[$stock->party_ledger_id][$stock->godown_id]['items'][] = [
                'qty'       => (float) $stock->qty,
                'unit_name' => $stock->unit_name ?? '',
                'item_name' => $stock->partyItem->item_name ?? '',
            ];
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
        /* 1️⃣  Validate the whole voucher + each line */
        $validated = $request->validate([
            'date'            => ['required', 'date'],
            'party_ledger_id' => ['required', 'exists:account_ledgers,id'],
            'godown_id_from'  => ['required', 'exists:godowns,id'],
            'ref_no'          => ['required','string','max:255','unique:party_stock_moves,ref_no'],
            'remarks'         => ['nullable', 'string', 'max:1000'],
            'withdraws'       => ['required', 'array', 'min:1'],

            'withdraws.*.party_item_id' => ['required', 'exists:party_items,id'],
            'withdraws.*.unit_name'     => ['nullable', 'string'],
            'withdraws.*.qty'           => ['required', 'numeric', 'min:0.01'],
            'withdraws.*.rate'          => ['nullable', 'numeric', 'min:0'],
        ]);

        /* 2️⃣  Process every line in a DB transaction */
        DB::transaction(function () use ($validated) {

            foreach ($validated['withdraws'] as $row) {

                /* --- stock check (with row-level lock) --- */
                $stock = PartyJobStock::where('party_ledger_id', $validated['party_ledger_id'])
                    ->where('party_item_id',  $row['party_item_id'])
                    ->where('godown_id',      $validated['godown_id_from'])
                    ->lockForUpdate()
                    ->first();

                if (!$stock || $stock->qty < $row['qty']) {
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        'withdraws' => ["Insufficient stock for item {$row['party_item_id']}"],
                    ]);
                }

                /* --- record movement --- */
                PartyStockMove::create([
                    'date'            => $validated['date'],
                    'party_ledger_id' => $validated['party_ledger_id'],
                    'party_item_id'   => $row['party_item_id'],
                    'godown_id_from'  => $validated['godown_id_from'],
                    'godown_id_to'    => null,
                    'qty'             => -$row['qty'],
                    'rate'            => $row['rate'] ?? 0,
                    'total'           => -$row['qty'] * ($row['rate'] ?? 0),
                    'move_type'       => 'withdraw',
                    'ref_no'          => $validated['ref_no'] ?? null,
                    'remarks'         => $validated['remarks'] ?? null,
                    'unit_name'       => $row['unit_name'] ?? null,
                    'created_by'      => auth()->id(),
                ]);

                /* --- decrement stock balance --- */
                $stock->qty -= $row['qty'];
                $stock->save();
            }
        });

        return redirect()
            ->route('party-stock.withdraw.index')
            ->with('success', 'মাল উত্তোলন সফলভাবে সম্পন্ন হয়েছে।');
    }
}
