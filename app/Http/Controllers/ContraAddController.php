<?php

namespace App\Http\Controllers;

use App\Models\ContraAdd;
use App\Models\ReceivedMode;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContraAddController extends Controller
{
    public function index()
    {
        $query = \App\Models\ContraAdd::with(['modeFrom', 'modeTo'])
            ->where('created_by', auth()->id())
            ->orderByDesc('date');

        $contras = $query->paginate(10)->withQueryString();

        return Inertia::render('contra-add/index', [
            'contras' => $contras
        ]);
    }


    public function create()
    {
        return Inertia::render('contra-add/create', [
            'paymentModes' => ReceivedMode::select('id', 'mode_name', 'opening_balance', 'closing_balance')->get()

        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'voucher_no' => 'required|string',
            'mode_from_id' => 'required|exists:received_modes,id|different:mode_to_id',
            'mode_to_id' => 'required|exists:received_modes,id',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
            'send_sms' => 'boolean',
        ]);

        // Save the contra entry
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

        // Handle balance updates (Debit/Credit logic)
        $fromMode = \App\Models\ReceivedMode::findOrFail($request->mode_from_id);
        $toMode = \App\Models\ReceivedMode::findOrFail($request->mode_to_id);

        $fromBalance = $fromMode->closing_balance ?? $fromMode->opening_balance ?? 0;
        $toBalance = $toMode->closing_balance ?? $toMode->opening_balance ?? 0;

        // Credit fromMode (reduce)
        $fromMode->closing_balance = $fromBalance - $request->amount;
        $fromMode->save();

        // Debit toMode (increase)
        $toMode->closing_balance = $toBalance + $request->amount;
        $toMode->save();

        return redirect()->route('contra-add.index')->with('success', 'Contra entry created successfully!');
    }
    public function edit($id)
    {
        $contra = ContraAdd::where('id', $id)
            ->when(!auth()->user()->hasRole('admin'), function ($q) {
                $q->where('created_by', auth()->id());
            })
            ->firstOrFail();

        $modes = ReceivedMode::select('id', 'mode_name')->get();

        return Inertia::render('contra-add/edit', [
            'contra' => $contra,
            'modes' => $modes,
        ]);
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'date' => 'required|date',
            'voucher_no' => 'required|string',
            'mode_from_id' => 'required|exists:received_modes,id',
            'mode_to_id' => 'required|exists:received_modes,id',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
            'send_sms' => 'boolean',
        ]);

        $contra = ContraAdd::findOrFail($id);

        if ($contra->created_by !== auth()->id() && !auth()->user()->hasRole('admin')) {
            abort(403, 'Unauthorized');
        }

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

    public function destroy($id)
    {
        $contra = ContraAdd::findOrFail($id);

        if ($contra->created_by !== auth()->id() && !auth()->user()->hasRole('admin')) {
            abort(403, 'Unauthorized');
        }

        // Revert balances
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
    public function print($voucherNo)
    {
        $contra = \App\Models\ContraAdd::with(['modeFrom', 'modeTo'])
            ->where('voucher_no', $voucherNo)
            ->where('created_by', auth()->id())
            ->firstOrFail();

        $company = \App\Models\CompanySetting::where('created_by', auth()->id())->first();
        $amount = $contra->amount;
        $amountInWords = numberToWords($amount); // ✅ Make sure you have this helper

        return Inertia::render('contra-add/print', [
            'company' => $company,
            'voucher_no' => $contra->voucher_no,
            'date' => $contra->date,
            'from_mode' => $contra->modeFrom->mode_name ?? '',
            'to_mode' => $contra->modeTo->mode_name ?? '',
            'amount' => $amount,
            'amount_in_words' => $amountInWords,
            'description' => $contra->description,
        ]);
    }
}
