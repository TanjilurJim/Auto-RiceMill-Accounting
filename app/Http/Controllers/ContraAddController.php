<?php

namespace App\Http\Controllers;

use App\Models\ContraAdd;
use App\Models\ReceivedMode;
use App\Models\Journal;
use App\Models\JournalEntry;
use App\Models\AccountLedger;
use Illuminate\Http\Request;
use Inertia\Inertia;

use function godown_scope_ids;

class ContraAddController extends Controller
{
    // public function index()
    // {
    //     $query = \App\Models\ContraAdd::with(['modeFrom', 'modeTo'])
    //         ->where('created_by', auth()->id())
    //         ->orderByDesc('date');

    //     $contras = $query->paginate(10)->withQueryString();

    //     return Inertia::render('contra-add/index', [
    //         'contras' => $contras
    //     ]);
    // }

    // public function index()
    // {
    //     $ids = godown_scope_ids();

    //     $query = ContraAdd::with(['modeFrom', 'modeTo'])
    //         ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
    //         ->orderByDesc('date');

    //     $contras = $query->paginate(10)->withQueryString();

    //     return Inertia::render('contra-add/index', [
    //         'contras' => $contras
    //     ]);
    // }

    public function index()
    {
        $ids = godown_scope_ids();
        $query = ContraAdd::with(['modeFrom', 'modeTo'])
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->orderByDesc('date');
        $contras = $query->paginate(10)->withQueryString();
        return Inertia::render('contra-add/index', ['contras' => $contras]);
    }

    // public function create()
    // {
    //     return Inertia::render('contra-add/create', [
    //         'paymentModes' => ReceivedMode::with('ledger:id,opening_balance,closing_balance')
    //             ->when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))
    //             ->get(['id', 'mode_name', 'ledger_id']),
    //     ]);
    // }

    // public function create()
    // {
    //     $ids = godown_scope_ids();

    //     return Inertia::render('contra-add/create', [
    //         'paymentModes' => ReceivedMode::with('ledger:id,opening_balance,closing_balance')
    //             ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
    //             ->get(['id', 'mode_name', 'ledger_id']),
    //     ]);
    // }

    public function create()
    {
        $ids = godown_scope_ids();
        return Inertia::render('contra-add/create', [
            'paymentModes' => ReceivedMode::with('ledger:id,opening_balance,closing_balance')
                ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
                ->get(['id', 'mode_name', 'ledger_id']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'voucher_no' => 'required|string|unique:contra_adds,voucher_no',
            'mode_from_id' => 'required|exists:received_modes,id|different:mode_to_id',
            'mode_to_id' => 'required|exists:received_modes,id',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
            'send_sms' => 'boolean',
        ]);

        // 💾 Save contra
        $contra = ContraAdd::create([
            'date' => $request->date,
            'voucher_no' => $request->voucher_no,
            'mode_from_id' => $request->mode_from_id,
            'mode_to_id' => $request->mode_to_id,
            'amount' => $request->amount,
            'description' => $request->description,
            'send_sms' => $request->send_sms,
            'created_by' => auth()->id(),
        ]);

        // 🔄 Update balances
        $fromMode = ReceivedMode::with('ledger')->findOrFail($request->mode_from_id);
        $toMode = ReceivedMode::with('ledger')->findOrFail($request->mode_to_id);

        $fromLedger = $fromMode->ledger;
        $toLedger = $toMode->ledger;

        $fromLedger->closing_balance -= $request->amount;
        $fromLedger->save();

        $toLedger->closing_balance += $request->amount;
        $toLedger->save();

        // 📘 Journal Entry
        $journal = Journal::create([
            'date' => $request->date,
            'voucher_no' => $request->voucher_no,
            'narration' => $request->description ?? 'Contra entry',
            'created_by' => auth()->id(),
            'voucher_type' => 'Contra',
        ]);

        JournalEntry::insert([
            [
                'journal_id' => $journal->id,
                'account_ledger_id' => $toLedger->id,
                'type' => 'debit',
                'amount' => $request->amount,
                'note' => 'Received to ' . $toMode->mode_name,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'journal_id' => $journal->id,
                'account_ledger_id' => $fromLedger->id,
                'type' => 'credit',
                'amount' => $request->amount,
                'note' => 'Transferred from ' . $fromMode->mode_name,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        return redirect()->route('contra-add.index')->with('success', 'Contra entry saved and journal posted successfully!');
    }
    // public function edit($id)
    // {
    //     $contra = ContraAdd::where('id', $id)
    //         ->when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))
    //         ->firstOrFail();

    //     $modes = ReceivedMode::select('id', 'mode_name')
    //         ->when(!auth()->user()->hasRole('admin'), fn($q) => $q->where('created_by', auth()->id()))
    //         ->get();

    //     return Inertia::render('contra-add/edit', [
    //         'contra' => $contra,
    //         'modes' => $modes,
    //     ]);
    // }

    // public function edit($id)
    // {
    //     $ids = godown_scope_ids();

    //     $contra = ContraAdd::where('id', $id)
    //         ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
    //         ->firstOrFail();

    //     $modes = ReceivedMode::select('id', 'mode_name')
    //         ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
    //         ->get();

    //     return Inertia::render('contra-add/edit', [
    //         'contra' => $contra,
    //         'modes' => $modes,
    //     ]);
    // }

    public function edit($id)
    {
        $ids = godown_scope_ids();
        $contra = ContraAdd::where('id', $id)
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->firstOrFail();
        $modes = ReceivedMode::select('id', 'mode_name')
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->get();
        return Inertia::render('contra-add/edit', [
            'contra' => $contra,
            'modes' => $modes,
        ]);
    }

    // public function update(Request $request, $id)
    // {

    //     $ids = godown_scope_ids(); // Ensure user has access to the modes

    //     $request->validate([
    //         'date' => 'required|date',
    //         'voucher_no' => 'required|string',
    //         'mode_from_id' => 'required|exists:received_modes,id',
    //         'mode_to_id' => 'required|exists:received_modes,id',
    //         'amount' => 'required|numeric|min:0.01',
    //         'description' => 'nullable|string',
    //         'send_sms' => 'boolean',
    //     ]);

    //     // $contra = ContraAdd::findOrFail($id);

    //     // if ($contra->created_by !== auth()->id() && !auth()->user()->hasRole('admin')) {
    //     //     abort(403, 'Unauthorized');
    //     // }

    //     $contra = ContraAdd::where('id', $id)
    //         ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
    //         ->firstOrFail();


    //     // Revert old balances
    //     $oldFrom = ReceivedMode::find($contra->mode_from_id);
    //     $oldTo = ReceivedMode::find($contra->mode_to_id);
    //     $oldFrom->closing_balance += $contra->amount;
    //     $oldTo->closing_balance -= $contra->amount;
    //     $oldFrom->save();
    //     $oldTo->save();

    //     // Update contra
    //     $contra->update([
    //         'date' => $request->date,
    //         'voucher_no' => $request->voucher_no,
    //         'mode_from_id' => $request->mode_from_id,
    //         'mode_to_id' => $request->mode_to_id,
    //         'amount' => $request->amount,
    //         'description' => $request->description,
    //         'send_sms' => $request->send_sms,
    //     ]);

    //     // Apply new balances
    //     $newFrom = ReceivedMode::find($request->mode_from_id);
    //     $newTo = ReceivedMode::find($request->mode_to_id);
    //     $newFrom->closing_balance -= $request->amount;
    //     $newTo->closing_balance += $request->amount;
    //     $newFrom->save();
    //     $newTo->save();

    //     return redirect()->route('contra-add.index')->with('success', 'Contra entry updated successfully.');
    // }

    public function update(Request $request, $id)
    {
        $ids = godown_scope_ids();
        $request->validate([
            'date' => 'required|date',
            'voucher_no' => 'required|string',
            'mode_from_id' => 'required|exists:received_modes,id',
            'mode_to_id' => 'required|exists:received_modes,id',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
            'send_sms' => 'boolean',
        ]);
        $contra = ContraAdd::where('id', $id)
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->firstOrFail();
        // Revert old balances
        $oldFrom = ReceivedMode::find($contra->mode_from_id);
        $oldTo = ReceivedMode::find($contra->mode_to_id);
        $oldFrom->closing_balance += $contra->amount;
        $oldTo->closing_balance -= $contra->amount;
        $oldFrom->save();
        $oldTo->save();
        // Update contra
        $contra->update([
            'date' => $request->date,
            'voucher_no' => $request->voucher_no,
            'mode_from_id' => $request->mode_from_id,
            'mode_to_id' => $request->mode_to_id,
            'amount' => $request->amount,
            'description' => $request->description,
            'send_sms' => $request->send_sms,
        ]);
        // Apply new balances
        $newFrom = ReceivedMode::find($request->mode_from_id);
        $newTo = ReceivedMode::find($request->mode_to_id);
        $newFrom->closing_balance -= $request->amount;
        $newTo->closing_balance += $request->amount;
        $newFrom->save();
        $newTo->save();
        return redirect()->route('contra-add.index')->with('success', 'Contra entry updated successfully.');
    }

    // public function destroy($id)
    // {
    //     $contra = ContraAdd::findOrFail($id);

    //     if ($contra->created_by !== auth()->id() && !auth()->user()->hasRole('admin')) {
    //         abort(403, 'Unauthorized');
    //     }

    //     // Revert balances
    //     $from = ReceivedMode::find($contra->mode_from_id);
    //     $to = ReceivedMode::find($contra->mode_to_id);

    //     if ($from && $to) {
    //         $from->closing_balance += $contra->amount;
    //         $to->closing_balance -= $contra->amount;

    //         $from->save();
    //         $to->save();
    //     }

    //     $contra->delete();

    //     return back()->with('success', 'Contra entry deleted successfully!');
    // }

    // public function destroy($id)
    // {
    //     $ids = godown_scope_ids();

    //     $contra = ContraAdd::where('id', $id)
    //         ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
    //         ->firstOrFail();

    //     // Revert balances
    //     $from = ReceivedMode::find($contra->mode_from_id);
    //     $to = ReceivedMode::find($contra->mode_to_id);

    //     if ($from && $to) {
    //         $from->closing_balance += $contra->amount;
    //         $to->closing_balance -= $contra->amount;

    //         $from->save();
    //         $to->save();
    //     }

    //     $contra->delete();

    //     return back()->with('success', 'Contra entry deleted successfully!');
    // }

    public function destroy($id)
    {
        $ids = godown_scope_ids();
        $contra = ContraAdd::where('id', $id)
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->firstOrFail();
        $from = ReceivedMode::find($contra->mode_from_id);
        $to = ReceivedMode::find($contra->mode_to_id);
        if ($from && $to) {
            $from->closing_balance += $contra->amount;
            $to->closing_balance -= $contra->amount;
            $from->save();
            $to->save();
        }
        $contra->delete();
        return back()->with('success', 'Contra entry deleted successfully!');
    }

    // app/Http/Controllers/ContraAddController.php
    // public function print(string $voucherNo)
    // {
    //     $contra = \App\Models\ContraAdd::with(['modeFrom', 'modeTo'])
    //         ->where('voucher_no', $voucherNo)
    //         ->where('created_by', auth()->id())
    //         ->firstOrFail();

    //     // grab whatever company header the user should see
    //     $company = company_info();                      // helper already set up

    //     $amount          = (float) $contra->amount;
    //     $amountInWords   = numberToWords($amount);      // helper now type-safe

    //     return Inertia::render('contra-add/print', [
    //         'company'          => $company,             // has logo_url, company_name, …
    //         'voucher_no'       => $contra->voucher_no,
    //         'date'             => $contra->date,
    //         'from_mode'        => $contra->modeFrom?->mode_name ?? '',
    //         'to_mode'          => $contra->modeTo?->mode_name   ?? '',
    //         'amount'           => $amount,
    //         'amount_in_words'  => $amountInWords,
    //         'description'      => $contra->description,
    //     ]);
    // }

    // public function print(string $voucherNo)
    // {
    //     $ids = godown_scope_ids();

    //     $contra = ContraAdd::with(['modeFrom', 'modeTo'])
    //         ->where('voucher_no', $voucherNo)
    //         ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
    //         ->firstOrFail();

    //     $company = company_info();

    //     $amount          = (float) $contra->amount;
    //     $amountInWords   = numberToWords($amount);

    //     return Inertia::render('contra-add/print', [
    //         'company'          => $company,
    //         'voucher_no'       => $contra->voucher_no,
    //         'date'             => $contra->date,
    //         'from_mode'        => $contra->modeFrom?->mode_name ?? '',
    //         'to_mode'          => $contra->modeTo?->mode_name   ?? '',
    //         'amount'           => $amount,
    //         'amount_in_words'  => $amountInWords,
    //         'description'      => $contra->description,
    //     ]);
    // }

    public function print(string $voucherNo)
    {
        $ids = godown_scope_ids();
        $contra = ContraAdd::with(['modeFrom', 'modeTo'])
            ->where('voucher_no', $voucherNo)
            ->when($ids !== null && !empty($ids), fn($q) => $q->whereIn('created_by', $ids))
            ->firstOrFail();
        $company = company_info();
        $amount = (float) $contra->amount;
        $amountInWords = numberToWords($amount);
        return Inertia::render('contra-add/print', [
            'company'          => $company,
            'voucher_no'       => $contra->voucher_no,
            'date'             => $contra->date,
            'from_mode'        => $contra->modeFrom?->mode_name ?? '',
            'to_mode'          => $contra->modeTo?->mode_name   ?? '',
            'amount'           => $amount,
            'amount_in_words'  => $amountInWords,
            'description'      => $contra->description,
        ]);
    }

}
