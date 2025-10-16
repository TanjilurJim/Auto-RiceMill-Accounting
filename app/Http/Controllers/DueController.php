<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\ReceivedMode;
use App\Services\SalePaymentService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;


class DueController extends Controller
{
    /* -----------------------------------------------------------------
     |  GET /dues  ➜ outstanding-invoices grid
     * ----------------------------------------------------------------*/
    /* -----------------------------------------------------------------
 |  GET /dues  ➜ outstanding-invoices grid
 * ----------------------------------------------------------------*/
    public function index(Request $request)
    {
        $search  = $request->string('q');
        $perPage = 10;

        /* ───── 1. build the query & get the paginator ───── */
        $paginator = Sale::with(['accountLedger', 'saleItems.item'])
            ->whereRaw('(grand_total + (
                       select coalesce(sum(interest_amount),0)
                         from sale_payments
                        where sale_id = sales.id)
                     -
                     (select coalesce(sum(amount),0)
                        from sale_payments
                       where sale_id = sales.id)) > 0')
            ->when($search, fn($q) =>
            $q->where('voucher_no', 'like', "%{$search}%")
                ->orWhereHas(
                    'accountLedger',
                    fn($qq) => $qq->where('account_ledger_name', 'like', "%{$search}%")
                )
                ->orWhereHas(
                    'saleItems.item',
                    fn($qq) => $qq->where('item_name', 'like', "%{$search}%")
                ))
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->paginate($perPage);

        /* ───── 2. keep the search term on every page link ───── */
        if ($search) {
            $paginator->appends('q', $search);
        }

        /* ───── 3. shape each row (this returns *another* paginator) ───── */
        $sales = $paginator->through(fn($s) => [
            'id'          => $s->id,
            'date'        => $s->date->toDateString(),
            'voucher_no'  => $s->voucher_no,
            'customer'    => $s->accountLedger?->account_ledger_name ?? 'N/A',

            'sale_items'  => $s->saleItems->pluck('item.item_name')
                ->take(3)->implode(', '),
            'extra_count' => max(0, $s->saleItems->count() - 3),

            'outstanding' => $s->outstanding,
        ]);

        return Inertia::render('dues/index', [
            'sales'   => $sales,                // still a paginator object
            'filters' => ['q' => $search],
        ]);
    }



    /* -----------------------------------------------------------------
     |  GET /dues/{sale}  ➜ detail with timeline + quick-receive form
     * ----------------------------------------------------------------*/
    public function show(Sale $sale)
    {
        $sale->load(['accountLedger', 'payments.mode', 'saleItems.item.unit',])
            ->append([
                'accrued_interest',
                'balance_with_interest',
                'principal_due',     // 🆕 accessor
                'daily_interest',    // 🆕 accessor
            ]);

        return Inertia::render('dues/show', [
            'sale' => [
                'id'                     => $sale->id,
                'date'          => $sale->date->toDateString(),
                'voucher_no'             => $sale->voucher_no,
                'customer'               => $sale->accountLedger?->account_ledger_name ?? 'N/A',

                /* ----- four key figures for the banner ---------- */
                'total_sale'             => $sale->grand_total,          // আসল মালের দাম
                'principal_due'          => $sale->principal_due,        // বাকি (সুদ ছাড়া)
                'daily_interest'         => $sale->daily_interest,       // দৈনিক সুদ
                'balance_with_interest'  => $sale->balance_with_interest, // সুদসহ মোট বাকি

                /* existing fields -------------------------------- */
                'outstanding'            => $sale->outstanding,
                'accrued_interest'       => $sale->accrued_interest,
            ],

            'items' => $sale->saleItems->map(fn($row) => [
                'name' => $row->item?->item_name ?? '—',
                'qty'  => $row->qty,
                'unit' => $row->item?->unit?->name ?? '',   // ← add
            ]),



            /** time-line under the form */
            'payments' => $sale->payments->sortBy('date')->values()->map(fn($p) => [
                'id'              => $p->id,
                'date'            => $p->date,
                'amount'          => $p->amount,
                'interest_amount' => $p->interest_amount,
                'received_mode'   => $p->mode?->mode_name ?? '—',
                'note'            => $p->note,
                'waive_interest'   => 'sometimes|boolean',
            ]),

            /** dropdown for the “Mode” selector */
            'receivedModes' => ReceivedMode::select('id', 'mode_name')
                ->where('created_by', auth()->id())
                ->orderBy('mode_name')
                ->get(),
        ]);
    }

    /* -----------------------------------------------------------------
     |  POST /dues/{sale}/pay  ➜ save an instalment
     * ----------------------------------------------------------------*/
    public function store(Request $request, Sale $sale)
    {
        $data = $request->validate([
            'date'             => 'required|date',
            'amount'           => 'required|numeric|min:0.01',
            'received_mode_id' => 'nullable|exists:received_modes,id',
            'note'             => 'nullable|string|max:255',
        ]);

        $mode = $data['received_mode_id']
            ? ReceivedMode::find($data['received_mode_id'])
            : null;

        /** One-liner that:
         *   – writes sale_payments
         *   – updates running totals on the invoice
         *   – posts the double-entry journal
         */
        SalePaymentService::record(
            $sale,
            $data['amount'],
            Carbon::parse($data['date']),
            $mode,
            $data['note'],
            waiveInterest: $request->boolean('waive_interest')   // 🆕
        );

        return back()->with('success', 'Payment recorded!');
    }

    // app/Http/Controllers/DueController.php
    public function settled()
    {
        /* Select invoices whose outstanding balance is ≤ 0
       (over-payments stay “cleared”)                           */
        $sales = Sale::with(['accountLedger', 'payments'])
            ->whereRaw('
            (grand_total + (
                select coalesce(sum(interest_amount),0)
                from sale_payments
                where sale_id = sales.id
            ) - (
                select coalesce(sum(amount),0)
                from sale_payments
                where sale_id = sales.id
            )) <= 0
        ')
            ->orderByDesc('date')
            ->get();

        return Inertia::render('dues/settled', [
            'sales' => $sales->map(fn($s) => [
                'id'             => $s->id,
                'date'           => $s->date->toDateString(),
                'voucher_no'     => $s->voucher_no,
                'customer'       => $s->accountLedger?->account_ledger_name ?? 'N/A',

                /* handy summary numbers */
                'total_sale'     => $s->grand_total,
                'interest_paid'  => $s->payments->sum('interest_amount'),
                'total_paid'     => $s->payments->sum('amount'),
                'cleared_on'     => optional($s->payments->max('date'))->toDateString(),
            ]),
        ]);
    }
}
