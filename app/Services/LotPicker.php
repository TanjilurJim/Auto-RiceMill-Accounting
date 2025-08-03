<?php 

namespace App\Services;

use App\Models\{ Stock, Lot };

class LotPicker
{
    /**
     * Return an array of [lot_id, qty, cost] segments that satisfy $needed.
     * FIFO = earliest received_at first.
     */
    public function pick(int $godownId, int $itemId, float $needed): array
    {
        $segments = [];

        // all lots with stock >0 for this item/godown, ordered oldest first
        $lots = Lot::where('godown_id', $godownId)
            ->where('item_id', $itemId)
            ->orderBy('received_at')
            ->withSum('stocks as balance', 'qty')
            ->having('balance', '>', 0)
            ->get();

        foreach ($lots as $lot) {
            if ($needed <= 0) break;

            $available = (float) $lot->balance;
            $take      = min($available, $needed);

            // average cost = total value / qty, or fall-back to item.purchase_price
            $costPrice = $lot->stocks()
                ->join('purchase_items','stocks.lot_id','=','purchase_items.lot_id')
                ->avg('purchase_items.price') ?? $lot->item->purchase_price;

            $segments[] = [
                'lot_id' => $lot->id,
                'qty'    => $take,
                'cost'   => $costPrice * $take,
                'unit_cost' => $costPrice,
            ];

            $needed -= $take;
        }

        /* Optional: throw if not enough stock */
        if ($needed > 0) {
            throw new \RuntimeException('Insufficient stock for item '.$itemId);
        }

        return $segments;
    }
}