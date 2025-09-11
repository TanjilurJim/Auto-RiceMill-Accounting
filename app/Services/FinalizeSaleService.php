<?php

namespace App\Services;

use App\Models\Sale;
use App\Models\Stock;
use App\Models\Item;
use App\Models\Journal;
use App\Models\ReceivedMode;
use App\Models\JournalEntry;
use App\Services\LedgerService;
use App\Services\SalePaymentService;
use Carbon\Carbon;
use Illuminate\Validation\Rule;

use Illuminate\Support\Facades\DB;

class FinalizeSaleService
{
    /**
     * Runs inside one big transaction.
     * Called by SaleController *only* when the flow
     * allows immediate posting OR the final approver clicks “Approve”.
     */
    public function handle(Sale $sale, array $payload = []): void
    {
        // $payload can bring in date / amount_received / mode etc.
        $request = (object) $payload;

        DB::transaction(function () use ($sale, $request) {

            /* ------------------------------
             * 0️⃣ guard – do NOT post twice
             * ----------------------------*/
            if ($sale->status === Sale::STATUS_APPROVED && $sale->journal_id) {
                return;
            }

            /* ------------------------------
             * 1️⃣  Reduce stock  +  collect COST
             * ----------------------------*/
            $costByItem = [];            // [item_id => cost]

            foreach ($sale->saleItems as $row) {

                // decrement that **exact lot**
                Stock::where([
                    'item_id'    => $row->product_id,
                    'godown_id'  => $sale->godown_id,
                    'lot_id'     => $row->lot_id,
                    'created_by' => $sale->created_by,
                ])->decrement('qty', $row->qty);

                // weighted-avg cost of that lot
                $unitCost = Stock::where([
                    'item_id'    => $row->product_id,
                    'godown_id'  => $sale->godown_id,
                    'lot_id'     => $row->lot_id,
                    'created_by' => $sale->created_by,
                ])->value('avg_cost') ?? 0;

                if ($unitCost == 0) {
                    $unitCost = Item::find($row->product_id)->purchase_price ?? 0;
                }

                $costByItem[$row->product_id] = ($costByItem[$row->product_id] ?? 0)
                    + ($unitCost * $row->qty);
            }

            $totalCost = array_sum($costByItem);

            /* ------------------------------
             * 2️⃣  Journal header
             * ----------------------------*/
            $journal = Journal::create([
                'date'         => $sale->date,
                'voucher_no'   => $sale->voucher_no,
                'narration'    => 'Auto journal for Sale',
                'voucher_type' => 'Sale',
                'created_by'   => $sale->created_by,
            ]);
            $sale->update(['journal_id' => $journal->id]);

            /* key vars */
            $grandTotal      = $sale->grand_total;
            $customerLedger  = $sale->account_ledger_id;
            $salesLedgerId   = $this->getSalesLedgerId($sale->created_by);

            /* ------------------------------
             * 3️⃣  AR  /  Sales income
             * ----------------------------*/
            JournalEntry::insert([
                [
                    'journal_id'        => $journal->id,
                    'account_ledger_id' => $customerLedger,
                    'type'              => 'debit',
                    'amount'            => $grandTotal,
                    'note'              => 'Sale price receivable',
                ],
                [
                    'journal_id'        => $journal->id,
                    'account_ledger_id' => $salesLedgerId,
                    'type'              => 'credit',
                    'amount'            => $grandTotal,
                    'note'              => 'Sales revenue',
                ],
            ]);
            LedgerService::adjust($customerLedger, 'debit',  $grandTotal);
            LedgerService::adjust($salesLedgerId,  'credit', $grandTotal);

            /* ------------------------------
             * 4️⃣  Optional: immediate payment
             * ----------------------------*/
            if (($request->amount_received ?? 0) > 0 && ($request->received_mode_id ?? false)) {
                $mode = \App\Models\ReceivedMode::find($request->received_mode_id);
                SalePaymentService::record(
                    $sale,
                    $request->amount_received,
                    Carbon::parse($sale->date),
                    $mode,
                    'Initial payment on invoice approval'
                );
            }

            /* ------------------------------
             * 5️⃣  Inventory / COGS
             * ----------------------------*/
            foreach ($costByItem as $itemId => $cost) {
                $note = 'Inventory out (Item #' . $itemId . ')';

                JournalEntry::create([
                    'journal_id'        => $journal->id,
                    'account_ledger_id' => $sale->inventory_ledger_id,
                    'type'              => 'credit',
                    'amount'            => $cost,
                    'note'              => $note,
                ]);

                JournalEntry::create([
                    'journal_id'        => $journal->id,
                    'account_ledger_id' => $sale->cogs_ledger_id,
                    'type'              => 'debit',
                    'amount'            => $cost,
                    'note'              => 'COGS – ' . $note,
                ]);
            }

            // adjust ledgers once with the total
            LedgerService::adjust($sale->inventory_ledger_id, 'credit', $totalCost);
            LedgerService::adjust($sale->cogs_ledger_id,      'debit',  $totalCost);

            /* ------------------------------
             * 6️⃣  Mark as approved
             * ----------------------------*/
            $sale->update([
                'status'      => Sale::STATUS_APPROVED,
                'approved_at' => now(),
            ]);
            ApprovalCounter::broadcast($sale->sub_responsible_id);
            if ($sale->responsible_id) {
                ApprovalCounter::broadcast($sale->responsible_id);
            }
        });
    }
    private function validateRequest(Request $request)
{
    return $request->validate([
        'date'         => 'required|date',
        'godown_id'    => 'required|exists:godowns,id',
        'salesman_id'  => 'required|exists:salesmen,id',

        // customer ledger must be AR
        'account_ledger_id' => [
            'required',
            Rule::exists('account_ledgers', 'id')->where(fn($q) => $q->where('ledger_type', 'accounts_receivable')),
        ],

        // inventory & cogs are required and type-checked
        'inventory_ledger_id' => [
            'required',
            Rule::exists('account_ledgers','id')->where(fn($q) => $q->where('ledger_type','inventory')),
        ],
        'cogs_ledger_id' => [
            'required',
            Rule::exists('account_ledgers','id')->where(fn($q) => $q->where('ledger_type','cogs')),
        ],

        'sale_items'                 => 'required|array|min:1',
        'sale_items.*.product_id'    => ['required','exists:items,id', function ($attr,$val,$fail) use ($request) {
            if (!preg_match('/sale_items\.(\d+)\./',$attr,$m)) return;
            $idx   = (int) $m[1];
            $lotId = $request->input("sale_items.$idx.lot_id");
            $ok = \App\Models\Lot::where('id',$lotId)->where('item_id',$val)->exists();
            if (!$ok) $fail('Lot does not match item.');
        }],
        'sale_items.*.lot_id'        => 'required|exists:lots,id',
        'sale_items.*.qty'           => 'required|numeric|min:0.01',
        'sale_items.*.main_price'    => 'required|numeric|min:0',
        'sale_items.*.discount'      => 'nullable|numeric|min:0',
        'sale_items.*.discount_type' => 'required|in:bdt,percent',
        'sale_items.*.subtotal'      => 'required|numeric|min:0',

        'received_mode_id' => [
            'nullable',
            'exists:received_modes,id',
            function ($attr, $val, $fail) use ($request) {
                if (($request->amount_received ?? 0) > 0) {
                    $lt = \App\Models\ReceivedMode::with('ledger')->find($val)?->ledger?->ledger_type;
                    if ($lt !== 'cash_bank') {
                        $fail('Selected receive mode must map to a Cash/Bank ledger.');
                    }
                }
            },
        ],
        'amount_received' => 'nullable|numeric|min:0',
    ]);
}

    private function getSalesLedgerId(int $userId): int
    {
        return \App\Models\AccountLedger::firstOrCreate(
            [
                'ledger_type'    => 'sales_income',  // ← change
                'mark_for_user'  => 0,
                'group_under_id' => 10,
                'created_by'     => $userId,
            ],
            [
                'account_ledger_name' => 'Sales Income',
                'opening_balance'     => 0,
                'debit_credit'        => 'credit',
                'status'              => 'active',
                'phone_number'        => '0000000000',
            ]
        )->id;
    }
}
