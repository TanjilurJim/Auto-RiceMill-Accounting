<?php

namespace App\Http\Controllers;

use function company_info;
use function numberToWords;
use App\Models\ReceivedAdd;
use App\Models\ReceivedMode;
use App\Models\AccountLedger;
use App\Models\Journal;
use App\Models\JournalEntry;

use Illuminate\Support\Facades\DB;
use App\Models\CompanySetting;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

use function user_scope_ids;

class ReceivedAddController extends Controller
{

    private function generateVoucherNo(string $prefix = 'RCV'): string
    {
        return $prefix . '-' . now()->format('Ymd') . '-' . random_int(1000, 9999);
    }

    public function create()
    {
        $user    = auth()->user();
        $userIds = user_scope_ids();

        $modeQ   = ReceivedMode::query();
        $ledgerQ = AccountLedger::query();

        if (! $user->hasRole('admin')) {
            $modeQ->whereIn('created_by', $userIds);
            $ledgerQ->whereIn('created_by', $userIds);
        }

        return Inertia::render('received-add/create', [
            'receivedModes'  => $modeQ->select('id', 'mode_name', 'ledger_id')->get(),
            'accountLedgers' => $ledgerQ->select('id', 'account_ledger_name', 'phone_number', 'opening_balance', 'closing_balance')->get(),
        ]);
    }

    public function store(Request $request)
{
    $request->validate([
        'date'              => 'required|date',
        'voucher_no'        => 'nullable|string|unique:received_adds,voucher_no',
        'received_mode_id'  => 'required|exists:received_modes,id',
        'account_ledger_id' => 'required|exists:account_ledgers,id',
        'amount'            => 'required|numeric|min:0.01',
        'description'       => 'nullable|string',
        'reference'         => 'nullable|string|max:100',
        'remarks'           => 'nullable|string|max:500',
        'send_sms'          => 'boolean',
    ]);

    DB::transaction(function () use ($request) {
        $voucherNo = $request->voucher_no ?: $this->generateVoucherNo();

        $received = \App\Models\ReceivedAdd::create([
            'date'              => $request->date,
            'voucher_no'        => $voucherNo,          // ✅ always set
            'received_mode_id'  => $request->received_mode_id,
            'account_ledger_id' => $request->account_ledger_id,
            'amount'            => $request->amount,
            'description'       => $request->description,
            'reference'         => $request->reference,
            'remarks'           => $request->remarks,
            'send_sms'          => (bool) $request->send_sms,
            'created_by'        => auth()->id(),
            'tenant_id'         => optional(auth()->user())->tenant_id,
        ]);

        $received->postToLedgersAndJournal(); // ✅ single posting path
    });

    return redirect()->route('received-add.index')
        ->with('success', 'Received voucher saved and journal posted successfully!');
}

    


    // public function index()
    // {
    //     $receivedAdds = ReceivedAdd::with(['receivedMode', 'accountLedger'])
    //         ->when(!auth()->user()->hasRole('admin'), function ($query) {
    //             $query->where('created_by', auth()->id());
    //         })
    //         ->orderByDesc('date')
    //         ->paginate(10);

    //     return Inertia::render('received-add/index', [
    //         'receivedAdds' => $receivedAdds,
    //         'currentPage' => $receivedAdds->currentPage(),
    //         'perPage' => $receivedAdds->perPage(),
    //     ]);
    // }

    public function index()
    {
        $user = auth()->user();
        $userIds = user_scope_ids();

        $receivedAdds = ReceivedAdd::with(['receivedMode', 'accountLedger'])
            ->when(!$user->hasRole('admin'), function ($query) use ($userIds) {
                $query->whereIn('created_by', $userIds);
            })
            ->orderByDesc('date')
            ->paginate(10);

        return Inertia::render('received-add/index', [
            'receivedAdds' => $receivedAdds,
            'currentPage' => $receivedAdds->currentPage(),
            'perPage' => $receivedAdds->perPage(),
        ]);
    }

    // public function edit(ReceivedAdd $receivedAdd)
    // {
    //     return Inertia::render('received-add/edit', [
    //         'receivedAdd' => $receivedAdd->load(['receivedMode', 'accountLedger']),
    //         'receivedModes' => ReceivedMode::select('id', 'mode_name')->get(),
    //         'accountLedgers' => AccountLedger::select('id', 'account_ledger_name', 'phone_number', 'opening_balance', 'closing_balance')->get(),
    //     ]);
    // }

    public function edit(ReceivedAdd $receivedAdd)
    {
        $user = auth()->user();
        $userIds = user_scope_ids();

        if (!$user->hasRole('admin') && !in_array($receivedAdd->created_by, $userIds)) {
            abort(403, 'Unauthorised');
        }

        return Inertia::render('received-add/edit', [
            'receivedAdd' => $receivedAdd->load(['receivedMode', 'accountLedger']),
            'receivedModes' => ReceivedMode::select('id', 'mode_name')->get(),
            'accountLedgers' => AccountLedger::select('id', 'account_ledger_name', 'phone_number', 'opening_balance', 'closing_balance')->get(),
        ]);
    }

    // public function update(Request $request, ReceivedAdd $receivedAdd)
    // {
    //     $request->validate([
    //         'date' => 'required|date',
    //         'voucher_no' => 'required|string|unique:received_adds,voucher_no,' . $receivedAdd->id,
    //         'received_mode_id' => 'required|exists:received_modes,id',
    //         'account_ledger_id' => 'required|exists:account_ledgers,id',
    //         'amount' => 'required|numeric|min:0.01',
    //         'description' => 'nullable|string',
    //         'send_sms' => 'boolean',
    //     ]);

    //     $receivedAdd->update($request->all());

    //     return redirect()->route('received-add.index')->with('success', 'Received Add updated successfully!');
    // }

    public function update(Request $request, ReceivedAdd $receivedAdd)
    {
        $user = auth()->user();
        $userIds = user_scope_ids();

        if (!$user->hasRole('admin') && !in_array($receivedAdd->created_by, $userIds)) {
            abort(403, 'Unauthorised');
        }

        $request->validate([
            'date' => 'required|date',
            'voucher_no' => 'required|string|unique:received_adds,voucher_no,' . $receivedAdd->id,
            'received_mode_id' => 'required|exists:received_modes,id',
            'account_ledger_id' => 'required|exists:account_ledgers,id',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
            'send_sms' => 'boolean',
        ]);

        $receivedAdd->update($request->all());

        return redirect()->route('received-add.index')->with('success', 'Received Add updated successfully!');
    }

    // public function destroy(ReceivedAdd $receivedAdd)
    // {
    //     $receivedAdd->delete();
    //     return redirect()->route('received-add.index')->with('success', 'Deleted successfully.');
    // }

    public function destroy(ReceivedAdd $receivedAdd)
    {
        $user = auth()->user();
        $userIds = user_scope_ids();

        if (!$user->hasRole('admin') && !in_array($receivedAdd->created_by, $userIds)) {
            abort(403, 'Unauthorised');
        }

        $receivedAdd->delete();
        return redirect()->route('received-add.index')->with('success', 'Deleted successfully.');
    }


    // public function print(ReceivedAdd $receivedAdd)
    // {
    //     /* tenant safety */
    //     if (
    //         ! auth()->user()->hasRole('admin') &&
    //         $receivedAdd->created_by !== auth()->id()
    //     ) {
    //         abort(403, 'Unauthorised');
    //     }

    //     /* what the UI needs */
    //     $receivedAdd->load(['receivedMode', 'accountLedger']);

    //     return Inertia::render('received-add/print', [
    //         'receivedAdd'  => $receivedAdd,
    //         'company'      => company_info(),                       // ↞ helper adds logo URLs too
    //         'amountWords'  => numberToWords((int) $receivedAdd->amount),
    //     ]);
    // }

    public function print(ReceivedAdd $receivedAdd)
    {
        $user = auth()->user();
        $userIds = user_scope_ids();

        if (!$user->hasRole('admin') && !in_array($receivedAdd->created_by, $userIds)) {
            abort(403, 'Unauthorised');
        }

        $receivedAdd->load(['receivedMode', 'accountLedger']);

        return Inertia::render('received-add/print', [
            'receivedAdd'  => $receivedAdd,
            'company'      => company_info(),
            'amountWords'  => numberToWords((int) $receivedAdd->amount),
        ]);
    }
}
