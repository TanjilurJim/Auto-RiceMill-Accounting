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
use Throwable;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;
use Illuminate\Support\Str;



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
            ->whereIn('created_by', user_scope_ids())
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
        try {
            // 1) Generate a unique reference no (avoid race with unique rule)
            do {
                $dateStr         = now()->format('Ymd');
                $random          = random_int(1000, 9999);
                $generatedRefNo  = "PWD-$dateStr-$random";
            } while (PartyStockMove::where('ref_no', $generatedRefNo)->exists());

            // 2) Lookups
            $godowns = Godown::whereIn('created_by', user_scope_ids())
                ->get(['id', 'name']);

            $units   = Unit::whereIn('created_by', user_scope_ids())
                ->get(['id', 'name']);

            $parties = AccountLedger::whereIn('ledger_type', ['accounts_receivable', ])
                ->whereIn('created_by', user_scope_ids())
                ->get(['id', 'account_ledger_name']);

            $items   = PartyItem::whereIn('created_by', user_scope_ids())
                ->get(['id', 'item_name', 'party_ledger_id']);

            $stocks  = PartyJobStock::with(['partyItem:id,item_name', 'godown:id,name'])
                ->whereIn('created_by', user_scope_ids())
                ->get(['id', 'party_ledger_id', 'party_item_id', 'godown_id', 'qty', 'unit_name']);

            $partyIds = $stocks->pluck('party_ledger_id')->unique()->values();
            $piIds    = $stocks->pluck('party_item_id')->filter()->unique()->values();
            $gdIds    = $stocks->pluck('godown_id')->unique()->values();

            // Latest deposit rate for each (party, item, godown)
            $lastRates = \App\Models\PartyStockMove::select(
                'party_ledger_id',
                'party_item_id',
                'godown_id_to',
                'rate',
                'date',
                'id'
            )
                ->where('move_type', 'deposit')
                ->whereIn('party_ledger_id', $partyIds)
                ->whereIn('party_item_id', $piIds)
                ->whereIn('godown_id_to', $gdIds)
                ->whereIn('created_by', user_scope_ids())
                ->orderBy('party_ledger_id')
                ->orderBy('party_item_id')
                ->orderBy('godown_id_to')
                ->orderByDesc('date')
                ->orderByDesc('id')
                ->get()
                // keep only the latest per triple
                ->unique(fn($r) => $r->party_ledger_id . '|' . $r->party_item_id . '|' . $r->godown_id_to)
                ->keyBy(fn($r) => $r->party_ledger_id . '|' . $r->party_item_id . '|' . $r->godown_id_to);

            // 3) Build available stock map (party -> godown -> items[])
            $availableStock = [];   // ✅ initialize

            $availableStock = [];
            foreach ($stocks as $stock) {
                $partyId  = (int) $stock->party_ledger_id;
                $godownId = (int) $stock->godown_id;

                $availableStock[$partyId] ??= [];
                $availableStock[$partyId][$godownId] ??= [
                    'godown_id'   => $godownId,
                    'godown_name' => $stock->godown->name ?? '',
                    'items'       => [],
                ];

                $key = $partyId . '|' . $stock->party_item_id . '|' . $godownId;
                $lastRate = optional($lastRates->get($key))->rate;

                $availableStock[$partyId][$godownId]['items'][] = [
                    'party_item_id' => (int) $stock->party_item_id,
                    'item_name'     => $stock->partyItem->item_name ?? '',
                    'qty'           => (float) $stock->qty,
                    'unit_name'     => $stock->unit_name ?? '',
                    'last_rate'     => $lastRate !== null ? (float)$lastRate : null, // 👈 NEW
                ];
            }

            return Inertia::render('crushing/WithdrawForm', [
                'parties'          => $parties,
                'items'            => $items,
                'godowns'          => $godowns,
                'units'            => $units,
                'today'            => now()->toDateString(),
                'generated_ref_no' => $generatedRefNo,
                'available_stock'  => $availableStock,  // ✅ now defined
            ]);
        } catch (Throwable $e) {
            // Optional: log($e);
            // Fail soft: return form with minimal data + error flash
            return back()->with('error', 'ফর্ম লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
        }
    }








    public function withdraw(Request $request)
    {
        $validated = $request->validate([
            'date'            => ['required', 'date'],
            'party_ledger_id' => ['required', 'exists:account_ledgers,id'],
            'godown_id_from'  => ['required', 'exists:godowns,id'],
            'ref_no'          => ['required', 'string', 'max:255', 'unique:party_stock_moves,ref_no'],
            'remarks'         => ['nullable', 'string', 'max:1000'],
            'withdraws'       => ['required', 'array', 'min:1'],

            'withdraws.*.party_item_id' => ['required', 'exists:party_items,id'],
            'withdraws.*.unit_name'     => ['nullable', 'string'],
            'withdraws.*.qty'           => ['required', 'numeric', 'min:0.01'],
            'withdraws.*.rate'          => ['nullable', 'numeric', 'min:0'],
            'withdraws.*.bosta_weight'         => ['nullable', 'numeric', 'min:0'],
            'withdraws.*.weight'      => ['nullable', 'numeric', 'min:0']
        ]);

        try {
            DB::transaction(function () use ($validated) {
                foreach ($validated['withdraws'] as $row) {
                    // lock stock for accurate check
                    $stock = \App\Models\PartyJobStock::whereIn('created_by', user_scope_ids())
                        ->where('party_ledger_id', $validated['party_ledger_id'])
                        ->where('party_item_id',   $row['party_item_id'])
                        ->where('godown_id',       $validated['godown_id_from'])
                        ->lockForUpdate()
                        ->first();

                    if (!$stock || $stock->qty < $row['qty']) {
                        throw \Illuminate\Validation\ValidationException::withMessages([
                            'withdraws' => ["Insufficient stock for item {$row['party_item_id']}"],
                        ]);
                    }

                    // compute weight: prefer client, else infer
                    $qty      = (float)$row['qty'];
                    $rate     = isset($row['rate']) ? (float)$row['rate'] : 0.0;
                    $unitName = strtolower((string)($row['unit_name'] ?? ''));
                    $perBosta = isset($row['bosta_weight']) ? (float)$row['bosta_weight'] : 0.0;

                    $weight = $row['weight'] ?? null; // client computed
                    if ($weight === null) {
                        if ($unitName === 'kg') $weight = $qty;
                        elseif ($unitName === 'bosta' && $perBosta > 0) $weight = $qty * $perBosta;
                    }

                    \App\Models\PartyStockMove::create([
                        'date'            => $validated['date'],
                        'party_ledger_id' => $validated['party_ledger_id'],
                        'party_item_id'   => $row['party_item_id'],
                        'godown_id_from'  => $validated['godown_id_from'],
                        'godown_id_to'    => null,
                        'qty'             => -$qty,
                        'weight'          => $weight !== null ? -abs($weight) : null, // NEGATIVE out
                        'rate'            => $rate,
                        'total'           => - ($qty * $rate),
                        'move_type'       => 'withdraw',
                        'ref_no'          => $validated['ref_no'],
                        'remarks'         => $validated['remarks'] ?? null,
                        'unit_name'       => $row['unit_name'] ?? null,
                        'meta'            => [
                            'bosta_weight' => $perBosta ?: null,
                        ],
                        'created_by'      => auth()->id(),
                    ]);

                    // decrement stock
                    $stock->qty -= $qty;
                    $stock->save();
                }
            });

            return redirect()
                ->route('party-stock.withdraw.index')
                ->with('success', 'মাল উত্তোলন সফলভাবে সম্পন্ন হয়েছে।');
        } catch (ValidationException $ve) {
            // Propagate field errors back to the form
            throw $ve;
        } catch (QueryException $qe) {
            // Handle duplicate ref_no or other DB constraint issues gracefully
            if (str_contains(strtolower($qe->getMessage()), 'unique') && str_contains($qe->getMessage(), 'party_stock_moves_ref_no')) {
                throw ValidationException::withMessages([
                    'ref_no' => ['এই রেফারেন্স নম্বরটি ইতিমধ্যেই ব্যবহৃত হয়েছে। আবার চেষ্টা করুন।'],
                ]);
            }
            // Optional: log($qe);
            return back()->with('error', 'ডাটাবেজ ত্রুটি ঘটেছে। দয়া করে আবার চেষ্টা করুন।')->withInput();
        } catch (Throwable $e) {
            // Optional: log($e);
            return back()->with('error', 'অপ্রত্যাশিত ত্রুটি ঘটেছে। দয়া করে আবার চেষ্টা করুন।')->withInput();
        }
    }
}
