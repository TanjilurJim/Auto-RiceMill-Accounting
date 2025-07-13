<?php

namespace App\Http\Controllers;

use App\Models\PartyItem;

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
                
                ->get(['id', 'account_ledger_name']),
            // 'items'   => Item::where(createdByMeOnly())->get(['id', 'item_name', 'unit_id']),
            'units' => Unit::all(['id', 'name']),
            'godowns' => Godown::all(['id', 'name']),
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
            'deposits.*.item_name'      => ['required', 'string', 'max:255'],
            'deposits.*.qty'    => ['required', 'numeric', 'min:0.01'],
            'deposits.*.unit_id'        => ['nullable', 'exists:units,id'],
            'deposits.*.unit_name' => ['nullable', 'string'],
            'deposits.*.rate'   => ['required', 'numeric', 'min:0'],  // Ensure rate is required
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['deposits'] as $deposit) {

                $unitId = Unit::where('name', $deposit['unit_name'])->value('id'); 

                /* 3-A  Get (or create) the PartyItem master row  */
                $partyItem = PartyItem::firstOrCreate(



                    [
                        'party_ledger_id' => $validated['party_ledger_id'],
                        'item_name'       => trim($deposit['item_name']),
                    ],
                    [
                        'unit_id'    => $unitId,    // if you store it
                        'created_by' => auth()->id(),
                    ]
                );

                /* 3-B  Save the movement (notice party_item_id) */
                PartyStockMove::create([
                    'date'            => $validated['date'],
                    'party_ledger_id' => $validated['party_ledger_id'],
                    'party_item_id'   => $partyItem->id,        // 🔄 was item_id
                    'godown_id_from'  => null,
                    'godown_id_to'    => $validated['godown_id_to'],
                    'qty'             => $deposit['qty'],
                    'rate'            => $deposit['rate'],
                    'total'           => bcmul($deposit['qty'], $deposit['rate'], 2),
                    'move_type'       => 'deposit',
                    'ref_no'          => $validated['ref_no'] ?? null,
                    'remarks'         => $validated['remarks'] ?? null,
                    'unit_name'       => $deposit['unit_name'] ?? null,
                    'created_by'      => auth()->id(),
                ]);

                /* 3-C  Update running balance table */
                $stock = PartyJobStock::firstOrNew([
                    'party_item_id'   => $partyItem->id,        // 🔄 was item_id
                    'godown_id'       => $validated['godown_id_to'],
                ]);

                // keep party_ledger_id for quick look-ups (optional)
                $stock->party_ledger_id = $validated['party_ledger_id'];
                $stock->qty   = ($stock->qty ?? 0) + $deposit['qty'];
                $stock->unit_name  = $deposit['unit_name'] ?? $stock->unit_name;
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
            
            ->groupBy('ref_no')
            ->orderByRaw('MAX(date) DESC')
            ->paginate(10); // Adjust per page as needed

        // Step 2: Get all stock moves with those ref_nos
        $moves = PartyStockMove::with(['partyItem', 'partyLedger', 'godownTo'])
            ->where('move_type', 'deposit')
            
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
                        'item_name' => $item->partyItem->item_name ?? '',
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



    //transfer


}
