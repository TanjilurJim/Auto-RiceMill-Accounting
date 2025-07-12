<?php

namespace App\Http\Controllers;

use App\Models\ConversionVoucher;
use App\Models\ConversionLine;
use App\Models\PartyItem;
use App\Models\AccountLedger;
use App\Models\Godown;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use PDF; // barryvdh/laravel-dompdf (install if you haven’t)

class ConversionVoucherController extends Controller
{
    /* -------------------------------------------------
     | 1. Called *inside* your PartyStockAdjustmentController
     |    after stock moves have been committed.
     |-------------------------------------------------*/
    public function storeFromValidated(array $v) : ConversionVoucher
    {
        return DB::transaction(function () use ($v) {

            /* ----- header ----- */
            $voucher = ConversionVoucher::create([
                'date'   => $v['date'],
                'ref_no' => $v['ref_no'],
                'party_ledger_id' => $v['party_ledger_id'],
                'godown_id'       => $v['godown_id'],
                'remarks'         => $v['remarks'] ?? null,
                'total_consumed_qty'  => array_sum(array_column($v['consumed'],'qty')),
                'total_generated_qty' => array_sum(array_column($v['generated'],'qty')),
                'created_by' => auth()->id(),
            ]);

            /* ----- lines: consumed ----- */
            foreach ($v['consumed'] as $row) {
                $voucher->lines()->create([
                    'party_item_id' => $row['party_item_id'],
                    'line_type'     => 'consumed',
                    'qty'           => $row['qty'],
                    'unit_name'     => $row['unit_name'] ?? null,
                ]);
            }

            /* ----- lines: generated ----- */
            foreach ($v['generated'] as $row) {
                $partyItemId = PartyItem::where('item_name', $row['item_name'])
                                ->where('party_ledger_id', $v['party_ledger_id'])
                                ->value('id');
                $voucher->lines()->create([
                    'party_item_id' => $partyItemId,
                    'line_type'     => 'generated',
                    'qty'           => $row['qty'],
                    'unit_name'     => $row['unit_name'] ?? null,
                ]);
            }

            return $voucher;
        });
    }

    /* -------------------------------------------------
     | 2. Index: paginated list of vouchers
     |-------------------------------------------------*/
    public function index()
    {
        $vouchers = ConversionVoucher::with(['party','godown'])
            ->orderByDesc('date')
            ->paginate(15);

        return Inertia::render('crushing/ConversionVoucherIndex', [
            'vouchers'   => $vouchers->items(),
            'pagination' => [
                'links'        => $vouchers->linkCollection(),
                'currentPage'  => $vouchers->currentPage(),
                'lastPage'     => $vouchers->lastPage(),
                'total'        => $vouchers->total(),
            ],
        ]);
    }

    /* -------------------------------------------------
     | 3. Show: full details (Inertia page you built)
     |-------------------------------------------------*/
    public function show(ConversionVoucher $voucher)
    {
        $voucher->load(['party','godown','lines.item']);

        return Inertia::render('crushing/PartyStockConvertShow', [
            'header'    => [
                'date'    => $voucher->date,
                'ref_no'  => $voucher->ref_no,
                'party'   => $voucher->party->account_ledger_name,
                'godown'  => $voucher->godown->name,
                'remarks' => $voucher->remarks,
            ],
            'consumed'  => $voucher->lines
                                ->where('line_type','consumed')
                                ->map(fn ($l) => [
                                    'item' => $l->item->item_name,
                                    'qty'  => $l->qty,
                                    'unit' => $l->unit_name,
                                ])->values(),
            'generated' => $voucher->lines
                                ->where('line_type','generated')
                                ->map(fn ($l) => [
                                    'item' => $l->item->item_name,
                                    'qty'  => $l->qty,
                                    'unit' => $l->unit_name,
                                ])->values(),
        ]);
    }

    /* -------------------------------------------------
     | 4. PDF: printable voucher (optional)
     |-------------------------------------------------*/
    public function pdf(ConversionVoucher $voucher)
    {
        $voucher->load(['party','godown','lines.item']);

        $pdf = PDF::loadView('pdf.conversion-voucher', compact('voucher'))
                  ->setPaper('a4','portrait');

        return $pdf->stream("Voucher_{$voucher->ref_no}.pdf");
    }
}
