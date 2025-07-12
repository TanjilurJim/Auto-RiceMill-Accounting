<?php

namespace App\Http\Controllers;

use App\Models\RentVoucher;
use App\Models\AccountLedger;
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
            'today'   => now()->toDateString(),
            'generated_vch_no' => 'RV-' . now()->format('Ymd') . '-' . random_int(1000, 9999),
            'parties' => AccountLedger::whereIn('ledger_type', ['sales', 'income'])
                ->get(['id', 'account_ledger_name']),
            'items'   => PartyItem::with('partyLedger')->get(['id', 'item_name']),
            'modes'   => ReceivedMode::orderBy('mode_name')
                ->get(['id', 'mode_name', 'phone_number']),   // pass phone if needed
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
            'lines.*.qty'     => ['required', 'numeric', 'min:0.01'],
            'lines.*.mon'     => ['nullable', 'numeric', 'min:0'],
            'lines.*.rate'    => ['required', 'numeric', 'min:0'],
            // 'received_mode'   => ['required', 'string'],
            'received_mode_id' => ['required', 'exists:received_modes,id'],
            'received_amount'  => ['required', 'numeric', 'min:0'],
        // 'received_amount' => ['required', 'numeric', 'min:0'],
            'remarks'         => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($v) {

            $grand   = collect($v['lines'])->sum(fn($l) => $l['qty'] * $l['rate']);
            $prevBal = 0;  // TODO: pull real balance from ledger if you track it
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
                    'qty'           => $l['qty'],
                    'mon'           => $l['mon'],
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
        $voucher->load(['party', 'lines.item']);

        return Inertia::render('crushing/RentVoucherShow', [
            'voucher' => $voucher,
            'lines'   => $voucher->lines->map(fn($l) => [
                'item'   => $l->item->item_name,
                'qty'    => $l->qty,
                'mon'    => $l->mon,
                'rate'   => $l->rate,
                'amount' => $l->amount,
            ]),
        ]);
    }
}
