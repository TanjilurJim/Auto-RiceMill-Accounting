<?php

namespace App\Http\Controllers;

use App\Models\AccountLedger;
use App\Models\PartyItem;
use App\Models\PartyStockMove;
use Illuminate\Http\Request;
use App\Models\Godown;
use DB;
use Inertia\Inertia;

// app/Http/Controllers/PartyStockReportController.php
class PartyStockReportController extends Controller
{
    public function index(Request $r)
    {
        /* ---------- filters ---------- */
        $filters = [
            'party_id'  => $r->query('party_id'),
            'item_id'   => $r->query('item_id'),
            'from'      => $r->query('date_from') ?: now()->startOfMonth()->toDateString(),
            'to'        => $r->query('date_to')   ?: now()->toDateString(),
        ];

        /* ---------- look-up dropdowns ---------- */
        $parties = AccountLedger::whereIn('ledger_type', ['sales', 'income'])
            ->orderBy('account_ledger_name')->get(['id', 'account_ledger_name']);
        $items   = PartyItem::orderBy('item_name')->get(['id', 'item_name']);

        /* ---------- build the two sub-queries ---------- */

        // (A) Opening balance = everything BEFORE :from
        $opening = PartyStockMove::query()
            ->whereDate('date', '<', $filters['from'])
            ->when($filters['party_id'], fn($q, $p) => $q->where('party_ledger_id', $p))
            ->when($filters['item_id'],  fn($q, $i) => $q->where('party_item_id', $i))
            ->selectRaw('party_ledger_id, party_item_id,
                         COALESCE(godown_id_to, godown_id_from) AS loc_id,
                         unit_name,
                         SUM(qty) AS opening_qty')
            ->groupBy('party_ledger_id', 'party_item_id', 'loc_id', 'unit_name');

        // (B) Movements INSIDE the range
        // (B) Movements INSIDE the range
        $moves = PartyStockMove::query()
            ->whereBetween('date', [$filters['from'], $filters['to']])
            ->when($filters['party_id'], fn($q, $p) => $q->where('party_ledger_id', $p))
            ->when($filters['item_id'],  fn($q, $i) => $q->where('party_item_id', $i))
            ->selectRaw('
        party_ledger_id,
        party_item_id,
        COALESCE(godown_id_to, godown_id_from) AS loc_id,
        unit_name,

        /* make OUT flows positive by multiplying with -1 */
        SUM(CASE WHEN move_type="deposit"     THEN  qty       ELSE 0 END)  AS deposit_qty,
        SUM(CASE WHEN move_type="withdraw"    THEN -qty       ELSE 0 END)  AS withdraw_qty,
        SUM(CASE WHEN move_type="convert-in"  THEN  qty       ELSE 0 END)  AS conv_in_qty,
        SUM(CASE WHEN move_type="convert-out" THEN -qty       ELSE 0 END)  AS conv_out_qty
    ')
            ->groupBy('party_ledger_id', 'party_item_id', 'loc_id', 'unit_name');

        /* ---------- stitch opening + moves ---------- */

        $rows = DB::query()
            ->fromSub($opening, 'o')
            ->rightJoinSub($moves, 'm', function ($j) {
                $j->on('o.party_ledger_id', '=', 'm.party_ledger_id')
                    ->on('o.party_item_id',   '=', 'm.party_item_id')
                    ->on('o.loc_id',          '=', 'm.loc_id')
                    ->on('o.unit_name',       '=', 'm.unit_name');
            })
            ->leftJoin('account_ledgers as al', 'm.party_ledger_id', '=', 'al.id')
            ->leftJoin('party_items     as pi', 'm.party_item_id',   '=', 'pi.id')
            ->leftJoin('godowns         as g',  'm.loc_id',          '=', 'g.id')
            ->selectRaw('
        al.account_ledger_name                    as party,
        COALESCE(g.name,"—")                      as godown,
        pi.item_name                              as item,
        COALESCE(o.unit_name, m.unit_name)        as unit_name,
        COALESCE(o.opening_qty,0)                 as opening_qty,
        m.deposit_qty,
        m.withdraw_qty,
        m.conv_in_qty,
        m.conv_out_qty,
        ( COALESCE(o.opening_qty,0)
          + m.deposit_qty
          - m.withdraw_qty
          - m.conv_out_qty
          + m.conv_in_qty )                      AS closing_qty
    ')
            ->get()
            ->map(fn($r) => [
                'party'    => $r->party,
                'godown'   => $r->godown,
                'item'     => $r->item,
                'unit'     => $r->unit_name,
                'opening'  => (float) ($r->opening_qty ?? 0),
                'deposit'  => (float) ($r->deposit_qty ?? 0),
                'withdraw' => (float) ($r->withdraw_qty ?? 0),
                'conv_in'  => (float) ($r->conv_in_qty ?? 0),
                'conv_out' => (float) ($r->conv_out_qty ?? 0),
                'closing'  => (float) ($r->closing_qty ?? 0),
            ]);

        /* ---------- totals ---------- */
        $totals = [
            'opening'  => $rows->sum('opening'),
            'deposit'  => $rows->sum('deposit'),
            'withdraw' => $rows->sum('withdraw'),
            'conv_in'  => $rows->sum('conv_in'),
            'conv_out' => $rows->sum('conv_out'),
            'closing'  => $rows->sum('closing'),
        ];

        return Inertia::render('crushing/PartyStockReportIndex', [
            'parties' => $parties,
            'items'   => $items,
            'rows'    => $rows,
            'totals'  => $totals,
            'filters' => $filters,
        ]);
    }
}
