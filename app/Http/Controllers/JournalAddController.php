<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Journal;
use App\Models\JournalEntry;
use Illuminate\Http\Request;
use App\Models\AccountLedger;
use App\Models\CompanySetting;

use function godown_scope_ids;

class JournalAddController extends Controller
{
    // public function index(Request $request)
    // {
    //     $query = Journal::with('entries.ledger') // ✅ load entries and their ledgers
    //         ->orderByDesc('created_at');

    //     if (!auth()->user()->hasRole('admin')) {
    //         $query->where('created_by', auth()->id());
    //     }

    //     $journals = $query->paginate(10)->withQueryString();

    //     return Inertia::render('journal-add/index', [
    //         'journals' => $journals,
    //     ]);
    // }

    public function index(Request $request)
    {
        $ids = godown_scope_ids();

        $query = Journal::with('entries.ledger')
            ->orderByDesc('created_at')
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids));

        $journals = $query->paginate(10)->withQueryString();

        return Inertia::render('journal-add/index', [
            'journals' => $journals,
        ]);
    }

    // public function create()
    // {
    //     $accountLedgers = AccountLedger::select('id', 'account_ledger_name', 'opening_balance', 'closing_balance')
    //         ->when(!auth()->user()->hasRole('admin'), function ($q) {
    //             $q->where('created_by', auth()->id());
    //         })
    //         ->get();

    //     return Inertia::render('journal-add/create', [
    //         'accountLedgers' => $accountLedgers
    //     ]);
    // }

    public function create()
    {
        $ids = godown_scope_ids();

        $accountLedgers = AccountLedger::select('id', 'account_ledger_name', 'opening_balance', 'closing_balance')
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
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

        $totalDr = collect($request->rows)->where('type', 'debit')->sum('amount');
        $totalCr = collect($request->rows)->where('type', 'credit')->sum('amount');

        // Check if the total debit and total credit are equal
        if ($totalDr != $totalCr) {
            return back()->withErrors(['rows' => 'Total Debit and Credit must be equal.'])->withInput();
        }

        $journal = Journal::create([
            'date' => $request->date,
            'voucher_no' => $request->voucher_no,
            'voucher_type' => 'Journal',
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

    // Edit method to load the journal entry for editing
    // public function edit($id)
    // {
    //     $journal = Journal::with('entries.ledger')->findOrFail($id);

    //     $accountLedgers = AccountLedger::select('id', 'account_ledger_name', 'opening_balance', 'closing_balance')
    //         ->when(!auth()->user()->hasRole('admin'), function ($q) {
    //             $q->where('created_by', auth()->id());
    //         })
    //         ->get();

    //     return Inertia::render('journal-add/edit', [
    //         'journal' => $journal,
    //         'accountLedgers' => $accountLedgers,
    //     ]);
    // }

    public function edit($id)
    {
        $ids = godown_scope_ids();

        $journal = Journal::with('entries.ledger')
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->findOrFail($id);

        $accountLedgers = AccountLedger::select('id', 'account_ledger_name', 'opening_balance', 'closing_balance')
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->get();

        return Inertia::render('journal-add/edit', [
            'journal' => $journal,
            'accountLedgers' => $accountLedgers,
        ]);
    }

    // Update method to save the edited journal entry
    // public function update(Request $request, $id)
    // {
    //     $request->validate([
    //         'date' => 'required|date',
    //         'voucher_no' => 'required|string|unique:journals,voucher_no,' . $id, // Ignore voucher_no check for current entry

    //         'rows' => 'required|array|min:2',
    //         'rows.*.ledger_id' => 'required|exists:account_ledgers,id',
    //         'rows.*.type' => 'required|in:debit,credit',

    //         'rows.*.amount' => 'required|numeric|min:0.01',
    //         'rows.*.note' => 'nullable|string',
    //     ]);

    //     // Calculate total debit and credit dynamically
    //     $totalDr = collect($request->rows)->where('type', 'debit')->sum('amount');
    //     $totalCr = collect($request->rows)->where('type', 'credit')->sum('amount');

    //     // Ensure that the total debit equals the total credit
    //     if ($totalDr != $totalCr) {
    //         return back()->withErrors(['rows' => 'Total Debit and Credit must be equal.'])->withInput();
    //     }

    //     // Find the journal to update
    //     $journal = Journal::findOrFail($id);
    //     $journal->date = $request->date;
    //     $journal->voucher_no = $request->voucher_no;

    //     // No need to save `total_debit` and `total_credit` if you aren't storing them in the table.
    //     // Instead, you just calculate totals dynamically when needed.

    //     $journal->voucher_type = 'Journal';
        
    //     $journal->save();

    //     // First, delete all the current entries for this journal
    //     $journal->entries()->delete();

    //     // Then, add the new journal entries
    //     foreach ($request->rows as $row) {
    //         JournalEntry::create([
    //             'journal_id' => $journal->id,
    //             'account_ledger_id' => $row['ledger_id'],
    //             'type' => $row['type'],
    //             'amount' => $row['amount'],
    //             'note' => $row['note'],
    //         ]);

    //         // Update ledger balances
    //         $ledger = AccountLedger::findOrFail($row['ledger_id']);
    //         $currentBalance = $ledger->closing_balance ?? $ledger->opening_balance ?? 0;

    //         if ($row['type'] === 'debit') {
    //             $ledger->closing_balance = $currentBalance + $row['amount'];
    //         } else {
    //             $ledger->closing_balance = $currentBalance - $row['amount'];
    //         }

    //         $ledger->save();
    //     }

    //     return redirect()->route('journal-add.index')->with('success', 'Journal entry updated.');
    // }

    public function update(Request $request, $id)
    {
        $ids = godown_scope_ids();

        $request->validate([
            'date' => 'required|date',
            'voucher_no' => 'required|string|unique:journals,voucher_no,' . $id,
            'rows' => 'required|array|min:2',
            'rows.*.ledger_id' => 'required|exists:account_ledgers,id',
            'rows.*.type' => 'required|in:debit,credit',
            'rows.*.amount' => 'required|numeric|min:0.01',
            'rows.*.note' => 'nullable|string',
        ]);

        $totalDr = collect($request->rows)->where('type', 'debit')->sum('amount');
        $totalCr = collect($request->rows)->where('type', 'credit')->sum('amount');

        if ($totalDr != $totalCr) {
            return back()->withErrors(['rows' => 'Total Debit and Credit must be equal.'])->withInput();
        }

        $journal = Journal::where('id', $id)
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->firstOrFail();

        $journal->date = $request->date;
        $journal->voucher_no = $request->voucher_no;
        $journal->voucher_type = 'Journal';
        $journal->save();

        $journal->entries()->delete();

        foreach ($request->rows as $row) {
            JournalEntry::create([
                'journal_id' => $journal->id,
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

        return redirect()->route('journal-add.index')->with('success', 'Journal entry updated.');
    }


    // Print method remains the same
    // public function print($voucherNo)
    // public function print($voucher_no)
    // {
    //     // $journal = Journal::with('rows.ledger')
    //     //     ->where('voucher_no', $voucherNo)
    //     //     ->where('created_by', auth()->id())
    //     //     ->firstOrFail();
    //     $journal = Journal::with(['entries.ledger'])
    //     ->where('voucher_no', $voucher_no)
    //     ->firstOrFail();

    //     $company =  CompanySetting::where('created_by', auth()->id())->first();

    //     return Inertia::render('journal-add/print', [
    //     // return Inertia::render('journal-add.print', [
    //         'company' => $company,
    //         'journal' => $journal,
    //         // 'amount_in_words' => numberToWords($journal->total_debit),

    //         // 'amount_in_words' => numberToWords($journal->total_debit->where('type', 'debit')->sum('amount')),

    //         'amount_in_words' => numberToWords(
    //             ($journal->entries ? $journal->entries->where('type', 'debit')->sum('amount') : 0)
    //         ),

    //     ]);
    // }

    public function print($voucher_no)
    {
        $ids = godown_scope_ids();

        $journal = Journal::with(['entries.ledger'])
            ->where('voucher_no', $voucher_no)
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->firstOrFail();

        $company = CompanySetting::where('created_by', auth()->id())->first();

        return Inertia::render('journal-add/print', [
            'company' => $company,
            'journal' => $journal,
            'amount_in_words' => numberToWords(
                ($journal->entries ? $journal->entries->where('type', 'debit')->sum('amount') : 0)
            ),
        ]);
    }

    // public function destroy($id)
    // {
    //     $journal = Journal::with('entries.ledger')->findOrFail($id);

    //     // Check if the current user is authorized to delete the journal
    //     if ($journal->created_by !== auth()->id() && !auth()->user()->hasRole('admin')) {
    //         return redirect()->route('journal-add.index')->withErrors('Unauthorized action.');
    //     }

    //     // Update ledger balances first (undo the effect of journal entries)
    //     foreach ($journal->entries as $entry) {
    //         $ledger = AccountLedger::findOrFail($entry->account_ledger_id);
    //         $currentBalance = $ledger->closing_balance ?? $ledger->opening_balance ?? 0;

    //         if ($entry->type === 'debit') {
    //             $ledger->closing_balance = $currentBalance - $entry->amount;
    //         } else {
    //             $ledger->closing_balance = $currentBalance + $entry->amount;
    //         }

    //         $ledger->save();
    //     }

    //     // Delete the journal entries associated with this journal
    //     $journal->entries()->delete();

    //     // Now delete the journal itself
    //     $journal->delete();

    //     return redirect()->route('journal-add.index')->with('success', 'Journal entry deleted successfully.');
    // }

    public function destroy($id)
    {
        $ids = godown_scope_ids();

        $journal = Journal::with('entries.ledger')
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->findOrFail($id);

        // Update ledger balances first (undo the effect of journal entries)
        foreach ($journal->entries as $entry) {
            $ledger = AccountLedger::findOrFail($entry->account_ledger_id);
            $currentBalance = $ledger->closing_balance ?? $ledger->opening_balance ?? 0;

            if ($entry->type === 'debit') {
                $ledger->closing_balance = $currentBalance - $entry->amount;
            } else {
                $ledger->closing_balance = $currentBalance + $entry->amount;
            }

            $ledger->save();
        }

        $journal->entries()->delete();
        $journal->delete();

        return redirect()->route('journal-add.index')->with('success', 'Journal entry deleted successfully.');
    }

}
