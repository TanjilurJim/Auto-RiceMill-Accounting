<?php

namespace App\Http\Controllers;

use App\Models\Journal;
use App\Models\JournalEntry;
use App\Models\AccountLedger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JournalAddController extends Controller
{
    public function index(Request $request)
    {
        $query = Journal::with('entries.ledger') // ✅ load entries and their ledgers
            ->orderByDesc('date');

        if (!auth()->user()->hasRole('admin')) {
            $query->where('created_by', auth()->id());
        }

        $journals = $query->paginate(10)->withQueryString();

        return Inertia::render('journal-add/index', [
            'journals' => $journals,
        ]);
    }

    public function create()
    {
        $accountLedgers = AccountLedger::select('id', 'account_ledger_name', 'opening_balance', 'closing_balance')
            ->when(!auth()->user()->hasRole('admin'), function ($q) {
                $q->where('created_by', auth()->id());
            })
            ->get();

        return Inertia::render('journal-add/create', [
            'accountLedgers' => $accountLedgers
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'voucher_no' => 'required|string|unique:journals,voucher_no',

            'rows' => 'required|array|min:2',
            'rows.*.ledger_id' => 'required|exists:account_ledgers,id',
            'rows.*.type' => 'required|in:debit,credit',

            'rows.*.amount' => 'required|numeric|min:0.01',
            'rows.*.note' => 'nullable|string',
        ]);

        $totalDr = collect($request->rows)->where('type', 'Dr')->sum('amount');
        $totalCr = collect($request->rows)->where('type', 'Cr')->sum('amount');

        if ($totalDr != $totalCr) {
            return back()->withErrors(['rows' => 'Total Debit and Credit must be equal.'])->withInput();
        }

        $journal = Journal::create([
            'date' => $request->date,
            'voucher_no' => $request->voucher_no,
            'total_debit' => $totalDr,
            'total_credit' => $totalCr,
            'created_by' => auth()->id(),
        ]);

        foreach ($request->rows as $row) {
            JournalEntry::create([
                'journal_id' => $journal->id, // ✅ this was missing
                'account_ledger_id' => $row['ledger_id'],
                'type' => $row['type'],
                'amount' => $row['amount'],
                'note' => $row['note'],
            ]);

            $ledger = AccountLedger::findOrFail($row['ledger_id']);
            $currentBalance = $ledger->closing_balance ?? $ledger->opening_balance ?? 0;

            if ($row['type'] === 'debit') {
                $ledger->closing_balance = $currentBalance + $row['amount'];
            } else {
                $ledger->closing_balance = $currentBalance - $row['amount'];
            }

            $ledger->save();
        }

        return redirect()->route('journal-add.index')->with('success', 'Journal entry saved.');
    }

    public function print($voucherNo)
    {
        $journal = Journal::with('rows.ledger')
            ->where('voucher_no', $voucherNo)
            ->where('created_by', auth()->id())
            ->firstOrFail();

        $company = \App\Models\CompanySetting::where('created_by', auth()->id())->first();

        return Inertia::render('journal-add/print', [
            'company' => $company,
            'journal' => $journal,
            'amount_in_words' => numberToWords($journal->total_debit),
        ]);
    }
}
