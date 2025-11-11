<?php

namespace App\Http\Controllers;

use App\Models\AccountLedger;
use App\Models\GroupUnder;
use App\Models\CompanySetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

use function company_info;   // helper
use function numberToWords;

class LedgerGroupReportController extends Controller
{
    // 1️⃣ Filter page
    public function filter()
    {
        return Inertia::render('reports/LedgerGroupSummaryFilter', [
            'group_unders' => GroupUnder::select('id', 'name')->get(),
        ]);
    }

    // 2️⃣ Final report page with optional date filter
    // public function index(Request $request)
    // {
    //     $request->validate([
    //         'from_date' => 'required|date',
    //         'to_date' => 'required|date',
    //         'group_under_id' => 'nullable|exists:group_unders,id', // ✅ now optional
    //     ]);

    //     $from = $request->input('from_date');
    //     $to = $request->input('to_date');
    //     $groupId = $request->input('group_under_id');
    //     $groupLabel = $groupId
    //         ? 'Showing Group: ' . GroupUnder::find($groupId)->name
    //         : 'Showing All Groups';

    //     $groups = GroupUnder::with(['ledgers' => function ($q) use ($groupId) {
    //         $q->select('id', 'account_ledger_name', 'phone_number', 'group_under_id')
    //             ->when($groupId, fn($q) => $q->where('group_under_id', $groupId))
    //             ->where('created_by', auth()->id());
    //     }])->when($groupId, fn($q) => $q->where('id', $groupId))->get();

    //     $data = $groups->map(function ($group) use ($from, $to) {
    //         $ledgers = $group->ledgers->map(function ($ledger) use ($from, $to) {
    //             $query = \App\Models\JournalEntry::where('account_ledger_id', $ledger->id);
    //             if ($from && $to) {
    //                 $query->whereHas('journal', fn($q) => $q->whereBetween('date', [$from, $to]));
    //             }

    //             $balance = $query->selectRaw("SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) as debit,
    //                                        SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) as credit")
    //                 ->first();

    //             return [
    //                 'id' => $ledger->id,
    //                 'account_ledger_name' => $ledger->account_ledger_name,
    //                 'phone_number' => $ledger->phone_number ?? 'N/A',
    //                 'debit' => (float) $balance->debit,
    //                 'credit' => (float) $balance->credit,
    //             ];
    //         });

    //         return [
    //             'group_name' => $group->name,
    //             'ledgers' => $ledgers,
    //             'total_debit' => $ledgers->sum('debit'),
    //             'total_credit' => $ledgers->sum('credit'),
    //         ];
    //     });

    //     $company = company_info();


    //     return Inertia::render('reports/LedgerGroupSummary', [
    //         'data' => $data,
    //         'grand_total_debit' => $data->sum('total_debit'),
    //         'grand_total_credit' => $data->sum('total_credit'),
    //         'company' => $company,
    //         'filters' => [
    //             'from_date' => $from,
    //             'to_date' => $to,
    //             'group_under_id' => $groupId,
    //         ],
    //         'group_unders' => GroupUnder::all(['id', 'name']),
    //         'group_label' => $groupLabel,
    //     ]);
    // }


    public function index(Request $request)
    {
        $request->validate([
            'from_date' => 'required|date',
            'to_date' => 'required|date',
            'group_under_id' => 'nullable|exists:group_unders,id',
        ]);

        $from = $request->input('from_date');
        $to = $request->input('to_date');
        $groupId = $request->input('group_under_id');
        $groupLabel = $groupId
            ? 'Showing Group: ' . GroupUnder::find($groupId)->name
            : 'Showing All Groups';

        $user = auth()->user();
        $ids = user_scope_ids();

        $groups = GroupUnder::with(['ledgers' => function ($q) use ($groupId, $ids, $user) {
            $q->select('id', 'account_ledger_name', 'phone_number', 'group_under_id', 'ledger_type')
                ->when($groupId, fn($q) => $q->where('group_under_id', $groupId))
                ->when(!$user->hasRole('admin'), fn($q) => $q->whereIn('created_by', $ids))
                // Hard guard: if group is 35 (Crushing Income), show only income-ish ledgers
                ->when($groupId == 35, fn($q) => $q->whereIn('ledger_type', [
                    'service_income',
                    'crushing_income',
                    'sales_income',
                    'income',
                    'other_income'
                ]));
        }])
            ->when($groupId, fn($q) => $q->where('id', $groupId))
            ->get();

        $data = $groups->map(function ($group) use ($from, $to) {
            $ledgers = $group->ledgers->map(function ($ledger) use ($from, $to) {
                $query = \App\Models\JournalEntry::where('account_ledger_id', $ledger->id);
                if ($from && $to) {
                    $query->whereHas('journal', fn($q) => $q->whereBetween('date', [$from, $to]));
                }

                $balance = $query->selectRaw("SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) as debit,
                                        SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) as credit")
                    ->first();

                return [
                    'id' => $ledger->id,
                    'account_ledger_name' => $ledger->account_ledger_name,
                    'phone_number' => $ledger->phone_number ?? 'N/A',
                    'debit' => (float) $balance->debit,
                    'credit' => (float) $balance->credit,
                ];
            });

            return [
                'group_name' => $group->name,
                'ledgers' => $ledgers,
                'total_debit' => $ledgers->sum('debit'),
                'total_credit' => $ledgers->sum('credit'),
            ];
        });

        $company = company_info();

        return Inertia::render('reports/LedgerGroupSummary', [
            'data' => $data,
            'grand_total_debit' => $data->sum('total_debit'),
            'grand_total_credit' => $data->sum('total_credit'),
            'company' => $company,
            'filters' => [
                'from_date' => $from,
                'to_date' => $to,
                'group_under_id' => $groupId,
            ],
            'group_unders' => GroupUnder::all(['id', 'name']),
            'group_label' => $groupLabel,
        ]);
    }
}
