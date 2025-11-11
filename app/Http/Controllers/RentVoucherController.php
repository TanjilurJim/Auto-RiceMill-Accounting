<?php

namespace App\Http\Controllers;

use App\Services\FinalizeRentVoucherService;
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

            'parties' => AccountLedger::whereIn('ledger_type', ['accounts_receivable',])
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
    public function store(Request $r, FinalizeRentVoucherService $finalizer)
    {
        $v = $r->validate([
            'date'            => ['required', 'date'],
            'vch_no'          => ['required', 'string', 'max:50', 'unique:rent_vouchers,vch_no'],
            'party_ledger_id' => ['required', 'exists:account_ledgers,id'],
            'lines'           => ['required', 'array', 'min:1'],
            'lines.*.party_item_id' => ['required', 'exists:party_items,id'],
            'lines.*.unit_name'     => ['required', 'string', 'max:50'],
            'lines.*.qty'           => ['required', 'numeric', 'min:0.01'],
            'lines.*.rate'          => ['required', 'numeric', 'min:0'],
            'received_mode_id'      => ['required', 'exists:received_modes,id'],
            'received_amount'       => ['required', 'numeric', 'min:0'],
            'remarks'               => ['nullable', 'string'],
        ]);

        $voucher = null;

        DB::transaction(function () use ($v, &$voucher) {
            // 1) compute
            $ledger  = \App\Models\AccountLedger::findOrFail($v['party_ledger_id']);
            $prevBal = $ledger->debit_credit === 'credit'
                ? - ($ledger->closing_balance ?? $ledger->opening_balance ?? 0)
                : ($ledger->closing_balance ?? $ledger->opening_balance ?? 0);

            $grand   = collect($v['lines'])->sum(fn($l) => $l['qty'] * $l['rate']);
            $balance = $prevBal + $grand - $v['received_amount'];

            // 2) create header
            $voucher = \App\Models\RentVoucher::create([
                'date'             => $v['date'],
                'vch_no'           => $v['vch_no'],
                'party_ledger_id'  => $v['party_ledger_id'],
                'grand_total'      => $grand,
                'previous_balance' => $prevBal,
                'received_mode_id' => $v['received_mode_id'],
                'received_amount'  => $v['received_amount'],
                'balance'          => $balance,
                'remarks'          => $v['remarks'] ?? null,
                'created_by'       => auth()->id(),
            ]);

            // 3) lines
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

        // 4) post to Journal (+ optional initial receipt) via service
        $finalizer->handle($voucher, [
            'received_amount'  => $v['received_amount'],
            'received_mode_id' => $v['received_mode_id'],
        ]);

        return redirect()
            ->route('party-stock.rent-voucher.index')
            ->with('success', 'Voucher saved & posted');
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
    /* ----------  SHOW / PRINTABLE VIEW  ---------- */
    // App/Http/Controllers/RentVoucherController.php

    public function show(RentVoucher $voucher)
    {
        $voucher->load(['party', 'receivedMode', 'lines.item', 'receipts.receivedMode', 'receipts.creator']);

        // Build payment history (include the initial receive as the first row, if > 0)
        $payments = collect();

        if ($voucher->received_amount > 0) {
            $payments->push([
                'id'            => null,
                'date'          => $voucher->date,
                'amount'        => (float) $voucher->received_amount,
                'reference'     => 'Initial',
                'notes'         => $voucher->remarks,
                'received_mode' => $voucher->receivedMode ? $voucher->receivedMode->only(['mode_name', 'phone_number']) : null,
                'user'          => $voucher->creator ? ['name' => optional($voucher->creator)->name] : null,
            ]);
        }

        // Later allocations coming from ReceivedAdd via pivot
        foreach ($voucher->receipts as $rcpt) {
            $payments->push([
                'id'            => $rcpt->id,
                'date'          => $rcpt->date, // assumes ReceivedAdd has `date`
                'amount'        => (float) $rcpt->pivot->amount,
                'reference'     => $rcpt->reference ?? null,   // assumes ReceivedAdd has `reference`
                'notes'         => $rcpt->remarks ?? null,     // assumes ReceivedAdd has `remarks`
                'received_mode' => $rcpt->receivedMode ? $rcpt->receivedMode->only(['mode_name', 'phone_number']) : null,
                'user'          => $rcpt->creator ? ['name' => optional($rcpt->creator)->name] : null,
            ]);
        }

        // Provide modes to populate the "Settle Due" dialog
        $modes = ReceivedMode::orderBy('mode_name')->get(['id', 'mode_name', 'phone_number']);

        return Inertia::render('crushing/RentVoucherShow', [
            'voucher' => $voucher->only([
                'id',
                'date',
                'vch_no',
                'grand_total',
                'previous_balance',
                'balance',
                'party_ledger_id',
                'received_amount',
                'remarks'
            ]) + [
                'received_mode'  => $voucher->receivedMode ? $voucher->receivedMode->only(['mode_name', 'phone_number']) : null,
                'party'          => $voucher->party->only(['account_ledger_name']),
                'received_total' => $voucher->receivedTotal(),
                'remaining_due'  => $voucher->dueAmount(),
            ],

            'lines' => $voucher->lines->map(fn($l) => [
                'item'      => $l->item->item_name,
                'qty'       => $l->qty,
                'unit_name' => $l->unit_name,
                'rate'      => $l->rate,
                'amount'    => $l->amount,
            ]),

            'payments' => $payments->sortBy('date')->values(),
            'modes'    => $modes,
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

    private function generateReceiptVoucherNo(string $prefix = 'RCV'): string
    {
        return $prefix . '-' . now()->format('Ymd') . '-' . random_int(1000, 9999);
    }

    // App/Http/Controllers/RentVoucherController.php

    public function settle(Request $r, RentVoucher $voucher)
    {
        $data = $r->validate([
            'date'             => ['required', 'date'],
            'received_mode_id' => ['required', 'exists:received_modes,id'],
            'amount'           => ['required', 'numeric', 'min:0.01'],
            'reference'        => ['nullable', 'string', 'max:100'],
            'notes'            => ['nullable', 'string', 'max:500'],
        ]);

        $remaining = $voucher->dueAmount();
        if ($data['amount'] > $remaining + 1e-6) {
            return back()->withErrors(['amount' => 'Amount exceeds remaining due (' . number_format($remaining, 2) . ').']);
        }

        DB::transaction(function () use ($voucher, $data) {
            $receipt = \App\Models\ReceivedAdd::create([
                'date'              => $data['date'],
                'voucher_no'        => $this->generateReceiptVoucherNo(), // ✅ important
                'received_mode_id'  => $data['received_mode_id'],
                'account_ledger_id' => $voucher->party_ledger_id,          // ✅ important
                'amount'            => $data['amount'],
                'reference'         => $data['reference'] ?? null,
                'remarks'           => $data['notes'] ?? null,
                'description'       => $data['notes'] ?? null,
                'created_by'        => auth()->id(),
                'tenant_id'         => optional(auth()->user())->tenant_id,
            ]);

            $receipt->postToLedgersAndJournal();

            $voucher->receipts()->attach($receipt->id, [
                'amount'     => $data['amount'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });

        return redirect()->route('party-stock.rent-voucher.show', $voucher->id)
            ->with('success', 'Due settled successfully.');
    }


    /* ----------  UPDATE  ---------- */
    public function update(Request $r, RentVoucher $voucher, FinalizeRentVoucherService $finalizer)
    {
        $v = $r->validate([
            'date'            => ['required', 'date'],
            'vch_no'          => ['required', 'string', 'max:50', 'unique:rent_vouchers,vch_no,' . $voucher->id],
            'party_ledger_id' => ['required', 'exists:account_ledgers,id'],
            'lines'           => ['required', 'array', 'min:1'],
            'lines.*.party_item_id' => ['required', 'exists:party_items,id'],
            'lines.*.unit_name'     => ['required', 'string', 'max:50'],
            'lines.*.qty'           => ['required', 'numeric', 'min:0.01'],
            'lines.*.rate'          => ['required', 'numeric', 'min:0'],
            'received_mode_id'      => ['required', 'exists:received_modes,id'],
            'received_amount'       => ['required', 'numeric', 'min:0'],
            'remarks'               => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($v, $voucher) {
            // A) recompute finances
            $ledger  = AccountLedger::findOrFail($v['party_ledger_id']);
            $prevBal = $ledger->debit_credit === 'credit'
                ? - ($ledger->closing_balance ?? $ledger->opening_balance ?? 0)
                : ($ledger->closing_balance ?? $ledger->opening_balance ?? 0);
            $grand   = collect($v['lines'])->sum(fn($l) => $l['qty'] * $l['rate']);
            $balance = $prevBal + $grand - $v['received_amount'];

            // B) update header
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

            // C) refresh lines
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

        // D) rollback previous posting (journal + initial receipt), then repost
        $finalizer->rollback($voucher);
        $finalizer->handle($voucher, [
            'received_amount'  => $v['received_amount'],
            'received_mode_id' => $v['received_mode_id'],
        ]);

        return redirect()
            ->route('party-stock.rent-voucher.index')
            ->with('success', 'Voucher updated & reposted');
    }
}
