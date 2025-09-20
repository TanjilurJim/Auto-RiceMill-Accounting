<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\AllReceivedPaymentExport;
use App\Models\ReceivedMode;            // ← for mode_id → ledger_id mapping

use function user_scope_ids;
use function company_info;

class AllReceivedPaymentReportController extends Controller
{
    public function index(Request $request)
    {
        [$from, $to] = $this->normalizedRange($request);

        $entries = $this->getEntries(
            $from,
            $to,
            ledgerId: $request->integer('ledger_id'),
            modeId:   $request->integer('mode_id'),
            type:     $request->string('type')->toString() ?: null
        );

        return Inertia::render('reports/AllReceivedPayment', [
            'entries'   => $entries,
            'from_date' => $from->toDateString(),
            'to_date'   => $to->toDateString(),
            'company'   => company_info(),
        ]);
    }

    public function filter()
    {
        $user = auth()->user();
        $ids  = user_scope_ids();

        $ledgers = \App\Models\AccountLedger::when(
            !$user->hasRole('admin'),
            fn ($q) => $q->whereIn('created_by', $ids)
        )->get(['id','account_ledger_name']);

        $modes = \App\Models\ReceivedMode::when(
            !$user->hasRole('admin'),
            fn ($q) => $q->whereIn('created_by', $ids)
        )->get(['id','mode_name']);

        return Inertia::render('reports/AllReceivedPaymentFilter', [
            'ledgers' => $ledgers,
            'modes'   => $modes,
        ]);
    }

    public function exportPdf(Request $request)
    {
        [$from, $to] = $this->normalizedRange($request);

        $entries = $this->getEntries(
            $from,
            $to,
            $request->integer('ledger_id'),
            $request->integer('mode_id'),
            $request->string('type')->toString() ?: null
        );

        $company = company_info();
        $thumb   = $company?->logo_thumb_path ? public_path('storage/'.$company->logo_thumb_path) : null;
        $companyArr = [
            'company_name'     => $company->company_name ?? '',
            'phone'            => $company->phone ?? '',
            'email'            => $company->email ?? '',
            'address'          => $company->address ?? '',
            'logo_thumb_path'  => is_string($thumb) && file_exists($thumb) ? $thumb : null,
        ];

        return Pdf::loadView('pdf.all-received-payment', [
                'entries'  => $entries,
                'from'     => $from->toDateString(),
                'to'       => $to->toDateString(),
                'company'  => (object)$companyArr,
            ])
            ->setPaper('A4', 'landscape')
            ->download('all-received-payment-report.pdf');
    }

    public function exportExcel(Request $request)
    {
        [$from, $to] = $this->normalizedRange($request);

        $entries = $this->getEntries(
            $from,
            $to,
            $request->integer('ledger_id'),
            $request->integer('mode_id'),
            $request->string('type')->toString() ?: null
        );

        return Excel::download(
            new AllReceivedPaymentExport(
                $entries,
                $from->toDateString(),
                $to->toDateString(),
                company_info()
            ),
            'all-received-payment-report.xlsx'
        );
    }

    /**
     * Core fetcher (Journal-based; splits each voucher into line-level rows).
     */
    private function getEntries(
        Carbon $from,
        Carbon $to,
        ?int $ledgerId = null,   // counterparty (customer/supplier) ledger
        ?int $modeId   = null,   // ReceivedMode id (maps to its cash/bank ledger)
        ?string $type  = null     // 'Received' | 'Payment' | 'Contra' (Contra is auto-excluded here)
    ) {
        $user = auth()->user();
        $ids  = user_scope_ids();

        // Optional: map mode_id → its cash/bank ledger_id (keeps existing UI working)
        $modeLedgerId = null;
        if ($modeId) {
            $modeLedgerId = optional(ReceivedMode::find($modeId))->ledger_id;
        }

        // Group name helpers
        $cashBankGroups = ['Cash-in-Hand', 'Bank Account'];
        $arGroups       = ['Sundry Debtors', 'Customer Summary'];
        $apGroups       = ['Sundry Creditors', 'Supplier Summary'];

        // Build pairs: (cash/bank line) × (counterparty AR/AP line) within the same journal
        $rows = DB::table('journal_entries as cash')
            ->join('journals as j', 'j.id', '=', 'cash.journal_id')
            ->join('account_ledgers as cash_ledger', 'cash.account_ledger_id', '=', 'cash_ledger.id')
            ->leftJoin('group_unders as cash_gu', 'cash_ledger.group_under_id', '=', 'cash_gu.id')

            ->join('journal_entries as cp', function ($join) {
                $join->on('cp.journal_id', '=', 'cash.journal_id')
                     ->whereColumn('cp.id', '!=', 'cash.id'); // exclude self
            })
            ->join('account_ledgers as cp_ledger', 'cp.account_ledger_id', '=', 'cp_ledger.id')
            ->leftJoin('group_unders as cp_gu', 'cp_ledger.group_under_id', '=', 'cp_gu.id')

            // who created + when
            ->leftJoin('users as u', 'u.id', '=', 'j.created_by')

            // Date range
            ->whereBetween('j.date', [$from->toDateString(), $to->toDateString()])

            // Scope to allowed creators if not admin
            ->when(!$user->hasRole('admin'), fn($q) => $q->whereIn('j.created_by', $ids))

            // cash/bank side
            ->where(function ($q) use ($cashBankGroups) {
                $q->whereIn('cash_ledger.ledger_type', ['cash', 'bank'])
                  ->orWhereIn('cash_gu.name', $cashBankGroups);
            })

            // counterparty must be AR/AP (this also auto-excludes pure contra)
            ->where(function ($q) use ($arGroups, $apGroups) {
                $q->whereIn('cp_ledger.ledger_type', ['customer', 'supplier'])
                  ->orWhereIn('cp_gu.name', array_merge($arGroups, $apGroups));
            })

            // Optional filters
            ->when($ledgerId, fn($q) => $q->where('cp_ledger.id', $ledgerId))
            ->when($modeLedgerId, fn($q) => $q->where('cash_ledger.id', $modeLedgerId))

            ->select([
                'j.date',
                'j.voucher_no',
                'cash.type as cash_type',
                'cash.amount as cash_amount',
                'cash_ledger.id as cash_ledger_id',
                'cash_ledger.account_ledger_name as cash_ledger_name',
                'cash_ledger.ledger_type as cash_ledger_type',
                'cash_gu.name as cash_group_name',

                'cp.type as cp_type',
                'cp.amount as cp_amount',
                'cp_ledger.id as cp_ledger_id',
                'cp_ledger.account_ledger_name as cp_ledger_name',
                'cp_ledger.ledger_type as cp_ledger_type',
                'cp_gu.name as cp_group_name',

                'u.name as created_by',
            ])
            ->orderByDesc('j.date')
            ->orderByDesc('j.id')
            ->get();

        // Classify each pair in PHP (clear & easy to tweak)
        $classified = $rows->map(function ($r) use ($arGroups, $apGroups) {
            $isCashBank = in_array($r->cash_ledger_type, ['cash','bank'])
                || in_array($r->cash_group_name, ['Cash-in-Hand','Bank Account']);

            $isReceivable = ($r->cp_ledger_type === 'customer') || in_array($r->cp_group_name, $arGroups);
            $isPayable    = ($r->cp_ledger_type === 'supplier') || in_array($r->cp_group_name, $apGroups);

            $txType = null;
            if ($isCashBank && $isReceivable && $r->cash_type === 'debit' && $r->cp_type === 'credit') {
                $txType = 'Received'; // Cash in, customer credited (reduces AR)
            } elseif ($isCashBank && $isPayable && $r->cash_type === 'credit' && $r->cp_type === 'debit') {
                $txType = 'Payment';  // Cash out, supplier debited (reduces AP)
            }

            if (!$txType) {
                return null; // skip anything that isn’t a clean AR/AP cash move
            }

            return [
                'date'        => (string)$r->date,
                'voucher_no'  => $r->voucher_no,
                'ledger'      => $r->cp_ledger_name,    // counterparty
                'mode_ledger' => $r->cash_ledger_name,  // cash/bank
                'amount'      => (float)$r->cp_amount,  // per-counterparty line
                'type'        => $txType,
                'created_by'  => $r->created_by ?? '-',
            ];
        })->filter()->values();

        // Apply 'type' filter if provided (Received/Payment)
        if ($type && in_array($type, ['Received','Payment'])) {
            $classified = $classified->where('type', $type)->values();
        }

        // Note: Contra is intentionally omitted here (no AR/AP counterparty)
        return $classified->sortByDesc('date')->values();
    }

    private function normalizedRange(Request $request): array
    {
        $request->validate([
            'from_date' => 'required|date',
            'to_date'   => 'required|date',
        ]);

        $from = Carbon::parse($request->from_date)->startOfDay();
        $to   = Carbon::parse($request->to_date)->endOfDay();

        if ($from->gt($to)) {
            [$from, $to] = [$to->copy()->startOfDay(), $from->copy()->endOfDay()];
        }

        return [$from, $to];
    }

    protected function applyUserScope($query)
    {
        $user = auth()->user();
        $ids  = user_scope_ids();

        return $query->when(
            !$user->hasRole('admin'),
            fn ($q) => $q->whereIn('created_by', $ids)
        );
    }
}
