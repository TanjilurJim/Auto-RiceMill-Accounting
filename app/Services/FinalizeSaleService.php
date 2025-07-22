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
            $totalCost = 0;
            foreach ($sale->saleItems as $row) {
                // decrement stock now
                Stock::where([
                    'item_id'   => $row->product_id,
                    'godown_id' => $sale->godown_id,
                    'created_by' => $sale->created_by,
                ])->decrement('qty', $row->qty);

                // weighted-avg cost (same logic you have today)
                $unitCost = Stock::where([
                    'item_id'   => $row->product_id,
                    'godown_id' => $sale->godown_id,
                    'created_by' => $sale->created_by,
                ])->value('avg_cost') ?? 0;

                if ($unitCost == 0) {
                    $unitCost = Item::find($row->product_id)->purchase_price ?? 0;
                }
                $totalCost += $unitCost * $row->qty;
            }

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
            JournalEntry::insert([
                [
                    'journal_id'        => $journal->id,
                    'account_ledger_id' => $sale->inventory_ledger_id,
                    'type'              => 'credit',
                    'amount'            => $totalCost,
                    'note'              => 'Inventory out (at cost)',
                ],
                [
                    'journal_id'        => $journal->id,
                    'account_ledger_id' => $sale->cogs_ledger_id,
                    'type'              => 'debit',
                    'amount'            => $totalCost,
                    'note'              => 'Cost of Goods Sold',
                ],
            ]);
            LedgerService::adjust($sale->inventory_ledger_id, 'credit', $totalCost);
            LedgerService::adjust($sale->cogs_ledger_id,      'debit',  $totalCost);

            /* ------------------------------
             * 6️⃣  Mark as approved
             * ----------------------------*/
            $sale->update([
                'status'      => Sale::STATUS_APPROVED,
                'approved_at' => now(),
            ]);
        });
    }

    private function getSalesLedgerId(int $userId): int
    {
        return \App\Models\AccountLedger::firstOrCreate(
            [
                'ledger_type'   => 'sales',
                'mark_for_user' => 0,
                'group_under_id' => 10,
                'created_by'    => $userId,
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
