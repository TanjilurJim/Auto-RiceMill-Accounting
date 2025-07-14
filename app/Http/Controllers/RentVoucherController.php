<?php

namespace App\Http\Controllers;

use App\Models\RentVoucher;
use App\Models\AccountLedger;
use App\Models\Unit;
use App\Models\ReceivedMode;
use App\Models\PartyItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RentVoucherController extends Controller
{
    /* ----------  CREATE FORM  ---------- */
    public function create()
    {
        return Inertia::render('crushing/RentVoucherCreate', [
            'today'            => now()->toDateString(),
            'generated_vch_no' => 'RV-' . now()->format('Ymd') . '-' . random_int(1000, 9999),

            'parties' => AccountLedger::whereIn('ledger_type', ['sales', 'income'])
                ->get(['id', 'account_ledger_name']),

            'items'   => PartyItem::with('unit:id,name')
                ->select('id', 'item_name', 'unit_id')
                ->get()
                ->map(fn($i) => [
                    'id'        => $i->id,
                    'item_name' => $i->item_name,
                    'unit_name' => optional($i->unit)->name,   // may be null
                ]),

            'units'   => Unit::orderBy('name')->get(['id', 'name']),   // 👈 NEW
            'modes'   => ReceivedMode::orderBy('mode_name')
                ->get(['id', 'mode_name', 'phone_number']),
        ]);
    }

    /* ----------  STORE  ---------- */
    public function store(Request $r)
    {
        $v = $r->validate([
            'date'            => ['required', 'date'],
            'vch_no'          => ['required', 'string', 'max:50', 'unique:rent_vouchers,vch_no'],
            'party_ledger_id' => ['required', 'exists:account_ledgers,id'],
            'lines'           => ['required', 'array', 'min:1'],
            'lines.*.party_item_id' => ['required', 'exists:party_items,id'],
            'lines.*.unit_name'     => ['required', 'string', 'max:50'],  // NEW
            'lines.*.qty'           => ['required', 'numeric', 'min:0.01'],
            'lines.*.rate'    => ['required', 'numeric', 'min:0'],
            // 'received_mode'   => ['required', 'string'],
            'received_mode_id' => ['required', 'exists:received_modes,id'],
            'received_amount'  => ['required', 'numeric', 'min:0'],
            // 'received_amount' => ['required', 'numeric', 'min:0'],
            'remarks'         => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($v) {

            /* ----------- 1.  Pull previous balance from ledger ----------- */
            $ledger = \App\Models\AccountLedger::findOrFail($v['party_ledger_id']);


            $prevBal = $ledger->closing_balance ?? $ledger->opening_balance ?? 0;  // TODO: pull real balance from ledger if you track it

            if ($ledger->debit_credit === 'credit') {
                $prevBal = -$prevBal;
            }

            /* ----------- 2.  Calculate totals & balance  ----------- */
            $grand = collect($v['lines'])->sum(fn($l) => $l['qty'] * $l['rate']);
            $balance = $prevBal + $grand - $v['received_amount'];

            $voucher = RentVoucher::create([
                'date'    => $v['date'],
                'vch_no'  => $v['vch_no'],
                'party_ledger_id' => $v['party_ledger_id'],
                'grand_total'      => $grand,
                'previous_balance' => $prevBal,

                // 'received_mode'    => $v['received_mode'],
                'received_mode_id' => $v['received_mode_id'],
                'received_amount'  => $v['received_amount'],
                'balance'          => $balance,
                'remarks'          => $v['remarks'] ?? null,
                'created_by'       => auth()->id(),
            ]);

            foreach ($v['lines'] as $l) {
                $voucher->lines()->create([
                    'party_item_id' => $l['party_item_id'],
                    'unit_name'     => $l['unit_name'],
                    'qty'           => $l['qty'],
                    // 'mon'           => $l['mon'],
                    'rate'          => $l['rate'],
                    'amount'        => $l['qty'] * $l['rate'],
                ]);
            }
        });

        return redirect()
            ->route('party-stock.rent-voucher.index')
            ->with('success', 'Voucher saved');
    }

    /* ----------  INDEX LIST  ---------- */
    public function index()
    {
        $vouchers = RentVoucher::with('party')
            ->orderByDesc('date')
            ->paginate(15);

        return Inertia::render('crushing/RentVoucherIndex', [
            'vouchers'   => $vouchers->items(),
            'pagination' => [
                'links'       => $vouchers->linkCollection(),
                'currentPage' => $vouchers->currentPage(),
                'lastPage'    => $vouchers->lastPage(),
                'total'       => $vouchers->total(),
            ],
        ]);
    }

    /* ----------  SHOW / PRINTABLE VIEW  ---------- */
    public function show(RentVoucher $voucher)
    {
        // eager-load the relation
        $voucher->load(['party', 'receivedMode', 'lines.item']);

        return Inertia::render('crushing/RentVoucherShow', [
            'voucher' => $voucher->only([
                'id',
                'date',
                'vch_no',
                'grand_total',
                'previous_balance',
                'balance',
                'received_amount',
                'remarks',
            ]) + [
                // ship the mode in a compact form
                'received_mode' => $voucher->receivedMode
                    ? $voucher->receivedMode->only(['mode_name', 'phone_number'])
                    : null,
                'party' => $voucher->party->only(['account_ledger_name']),
            ],
            'lines' => $voucher->lines->map(fn($l) => [
                'item'      => $l->item->item_name,
                'qty'       => $l->qty,
                'unit_name' => $l->unit_name,
                'rate'      => $l->rate,
                'amount'    => $l->amount,
            ]),
        ]);
    }

    /* ----------  EDIT FORM  ---------- */
    public function edit(RentVoucher $voucher)
    {
        // eager-load for the form
        $voucher->load(['lines.item', 'party', 'receivedMode']);

        return Inertia::render('crushing/RentVoucherEdit', [
            // plain fields we need to bind
            'voucher' => $voucher->only([
                'id',
                'date',
                'vch_no',
                'remarks',
                'received_amount',
                'received_mode_id',
                'party_ledger_id',
            ]) + [
                // we also send computed values so the UI can show them read-only
                'grand_total'      => $voucher->grand_total,
                'previous_balance' => $voucher->previous_balance,
                'balance'          => $voucher->balance,
            ],

            // line items, shaped exactly like the create form expects
            'lines' => $voucher->lines->map(fn($l) => [
                'id'            => $l->id,               // for v-key
                'party_item_id' => $l->party_item_id,
                'unit_name'     => $l->unit_name,
                'qty'           => $l->qty,
                'rate'          => $l->rate,
            ]),

            // dropdown data (same as create)
            'parties' => AccountLedger::whereIn('ledger_type', ['sales', 'income'])
                ->get(['id', 'account_ledger_name']),
            'items' => PartyItem::with('unit:id,name')
                ->select('id', 'item_name', 'unit_id')
                ->get()
                ->map(fn($i) => [
                    'id'        => $i->id,
                    'item_name' => $i->item_name,
                    'unit_name' => optional($i->unit)->name,
                ]),
            'units' => Unit::orderBy('name')->get(['id', 'name']),
            'modes' => ReceivedMode::orderBy('mode_name')
                ->get(['id', 'mode_name', 'phone_number']),
        ]);
    }

    /* ----------  UPDATE  ---------- */
    public function update(Request $r, RentVoucher $voucher)
    {
        $v = $r->validate([
            'date'            => ['required', 'date'],
            'vch_no'          => [
                'required',
                'string',
                'max:50',
                'unique:rent_vouchers,vch_no,' . $voucher->id
            ],
            'party_ledger_id' => ['required', 'exists:account_ledgers,id'],
            'lines'           => ['required', 'array', 'min:1'],
            'lines.*.party_item_id' => ['required', 'exists:party_items,id'],
            'lines.*.unit_name'     => ['required', 'string', 'max:50'],
            'lines.*.qty'           => ['required', 'numeric', 'min:0.01'],
            'lines.*.rate'          => ['required', 'numeric', 'min:0'],
            'received_mode_id' => ['required', 'exists:received_modes,id'],
            'received_amount'  => ['required', 'numeric', 'min:0'],
            'remarks'          => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($v, $voucher) {

            /* --- recompute financials exactly like store() --- */
            $ledger   = AccountLedger::findOrFail($v['party_ledger_id']);
            $prevBal  = $ledger->debit_credit === 'credit'
                ? - ($ledger->closing_balance ?? $ledger->opening_balance ?? 0)
                : ($ledger->closing_balance ?? $ledger->opening_balance ?? 0);

            $grand    = collect($v['lines'])->sum(fn($l) => $l['qty'] * $l['rate']);
            $balance  = $prevBal + $grand - $v['received_amount'];

            /* --- update voucher --- */
            $voucher->update([
                'date'             => $v['date'],
                'vch_no'           => $v['vch_no'],
                'party_ledger_id'  => $v['party_ledger_id'],
                'grand_total'      => $grand,
                'previous_balance' => $prevBal,
                'received_mode_id' => $v['received_mode_id'],
                'received_amount'  => $v['received_amount'],
                'balance'          => $balance,
                'remarks'          => $v['remarks'] ?? null,
                'updated_by'       => auth()->id(),
            ]);

            /* --- refresh line items (simplest: delete & recreate) --- */
            $voucher->lines()->delete();
            foreach ($v['lines'] as $l) {
                $voucher->lines()->create([
                    'party_item_id' => $l['party_item_id'],
                    'unit_name'     => $l['unit_name'],
                    'qty'           => $l['qty'],
                    'rate'          => $l['rate'],
                    'amount'        => $l['qty'] * $l['rate'],
                ]);
            }
        });

        return redirect()
            ->route('party-stock.rent-voucher.index')
            ->with('success', 'Voucher updated');
    }
}
