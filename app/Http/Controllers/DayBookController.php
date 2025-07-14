<?php

namespace App\Http\Controllers;

use App\Models\PartyStockMove;
use App\Models\RentVoucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DayBookController extends Controller
{
    public function index(Request $r)
    {
        /* ------------------------------------------------- filters */
        $from  = $r->query('date_from') ?: now()->toDateString();
        $to    = $r->query('date_to')   ?: now()->toDateString();
        $types = $r->query('types', []);          // array of selected voucher types

        /* helper to skip unwanted sets */
        $skip = fn(string $t) => $types && ! in_array($t, $types);

        /* ------------------------------ Deposit (জমা) ------------- */
        $deposit = $skip('Deposit') ? collect() : PartyStockMove::query()
            ->where('move_type', 'deposit')
            ->whereBetween('date', [$from, $to])
            ->groupBy('ref_no')
            ->selectRaw('
                MAX(date)               AS date,
                ref_no                  AS vch,
                MAX(party_ledger_id)    AS party_ledger_id,
                MAX(godown_id_to)       AS godown_id,
                "Deposit"               AS vch_type,
                0                       AS out_qty,
                SUM(qty)                AS in_qty,
                SUM(total)              AS stock_value,
                0                       AS rent_bill,
                MAX(remarks)            AS remarks
            ');

        /* ------------------------------ Withdraw (উত্তোলন) -------- */
        $withdraw = $skip('Withdraw') ? collect() : PartyStockMove::query()
            ->where('move_type', 'withdraw')
            ->whereBetween('date', [$from, $to])
            ->groupBy('ref_no')
            ->selectRaw('
                MAX(date)               AS date,
                ref_no                  AS vch,
                MAX(party_ledger_id)    AS party_ledger_id,
                MAX(godown_id_from)     AS godown_id,
                "Withdraw"              AS vch_type,
                SUM(ABS(qty))           AS out_qty,
                0                       AS in_qty,
                SUM(ABS(total))         AS stock_value,
                0                       AS rent_bill,
                MAX(remarks)            AS remarks
            ');

        /* ------------------------------ Convert (crushing) -------- */
        $convert = $skip('Convert') ? collect() : PartyStockMove::query()
            ->whereIn('move_type', ['convert-in', 'convert-out'])
            ->whereBetween('date', [$from, $to])
            ->groupBy('ref_no')
            ->selectRaw('
                MAX(date)               AS date,
                ref_no                  AS vch,
                MAX(party_ledger_id)    AS party_ledger_id,
                MAX(COALESCE(godown_id_to, godown_id_from)) AS godown_id,
                "Convert"               AS vch_type,
                SUM(CASE WHEN move_type="convert-out" THEN ABS(qty) ELSE 0 END) AS out_qty,
                SUM(CASE WHEN move_type="convert-in"  THEN qty      ELSE 0 END) AS in_qty,
                0                       AS stock_value,
                0                       AS rent_bill,
                MAX(remarks)            AS remarks
            ');

        /* ------------------------------ Rent voucher -------------- */
        $rent = $skip('Rent') ? collect() : RentVoucher::query()
            ->whereBetween('date', [$from, $to])
            ->selectRaw('
                date                    AS date,
                vch_no                  AS vch,
                party_ledger_id,
                NULL                    AS godown_id,
                "Rent"                  AS vch_type,
                0                       AS out_qty,
                0                       AS in_qty,
                0                       AS stock_value,
                grand_total             AS rent_bill,
                remarks                 AS remarks
            ');

        /* ------------------------------ Union all ----------------- */
        $pieces = [];

        if (! $skip('Deposit'))  $pieces[] = $deposit;
        if (! $skip('Withdraw')) $pieces[] = $withdraw;
        if (! $skip('Convert'))  $pieces[] = $convert;
        if (! $skip('Rent'))     $pieces[] = $rent;

        /* If the user unticked every type, create a dummy empty builder      */
        if (empty($pieces)) {
            $pieces[] = PartyStockMove::query()
                ->selectRaw('NULL AS date, NULL AS vch, NULL AS party_ledger_id, NULL AS godown_id,
                     NULL AS vch_type, 0 AS out_qty, 0 AS in_qty, 0 AS stock_value,
                     0 AS rent_bill, NULL AS remarks')
                ->whereRaw('0 = 1');        // always false – returns 0 rows
        }

        /* Chain the pieces together with UNION ALL                           */
        $union = array_shift($pieces);      // first query
        foreach ($pieces as $p) {
            $union->unionAll($p);           // add the rest
        }


        $rows = DB::query()
            ->fromSub($union, 'u')
            ->leftJoin('account_ledgers as al', 'u.party_ledger_id', '=', 'al.id')
            ->leftJoin('godowns         as g', 'u.godown_id', '=', 'g.id')
            ->orderBy('u.date')->orderBy('u.vch')
            ->get([
                'u.*',
                'al.account_ledger_name as party',
                DB::raw('COALESCE(g.name,"—") as godown')
            ]);

        /* ------------------------------ totals --------------------- */
        $totals = [
            'in_qty'      => (float) $rows->sum('in_qty'),
            'out_qty'     => (float) $rows->sum('out_qty'),
            'stock_value' => (float) $rows->sum('stock_value'),
            'rent_bill'   => (float) $rows->sum('rent_bill'),
        ];

        $byType = $rows->groupBy('vch_type')->map(fn($g) => [
            'in_qty'      => (float) $g->sum('in_qty'),
            'out_qty'     => (float) $g->sum('out_qty'),
            'stock_value' => (float) $g->sum('stock_value'),
            'rent_bill'   => (float) $g->sum('rent_bill'),
        ]);

        return Inertia::render('crushing/DayBookIndex', [
            'rows'    => $rows,
            'totals'  => $totals,
            'byType'  => $byType,
            'filters' => ['from' => $from, 'to' => $to],
        ]);
    }
}
