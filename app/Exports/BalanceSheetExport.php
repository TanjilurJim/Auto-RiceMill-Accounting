<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class BalanceSheetExport implements FromArray, WithHeadings, ShouldAutoSize
{
    private array $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function headings(): array
    {
        return [
            'Assets',
            'Amount',
            '',
            'Liabilities & Equity',
            'Amount'
        ];
    }

    public function array(): array
    {
        $assets = collect($this->data['balances'])
            ->where('side', 'asset')
            ->map(fn($row) => [$row['group'], $row['value'], '', '', '']);

        $liabs = collect($this->data['balances'])
            ->where('side', 'liability')
            ->values()
            ->map(fn($row) => ['', '', '', $row['group'], $row['value']]);

        // Add inventory values to assets
        $assets->push(['Closing Stock', $this->data['stock'], '', '', '']);
        $assets->push(['Work-In-Process', $this->data['working'], '', '', '']);

        // Align row count (so assets & liabilities appear side by side)
        $max = max($assets->count(), $liabs->count());
        // Add inventory values to assets
        $assets->push(['Closing Stock', $this->data['stock'], '', '', '']);
        $assets->push(['Work-In-Process', $this->data['working'], '', '', '']);

        // Align row count (so assets & liabilities appear side by side)
        $max = max($assets->count(), $liabs->count());

        // ✅ FIX: convert to array after padding
        $assets = $assets->pad($max, ['', '', '', '', ''])->values()->all();
        $liabs  = $liabs->pad($max, ['', '', '', '', ''])->values()->all();

        // Combine row-by-row
        $rows = [];
        for ($i = 0; $i < $max; $i++) {
            $rows[] = [
                $assets[$i][0],
                $assets[$i][1],
                '',
                $liabs[$i][3],
                $liabs[$i][4]
            ];
        }

        // Add totals
        $rows[] = ['', '', '', '', ''];
        $rows[] = ['Total Assets', $this->data['assetTotal'], '', 'Total Liabilities', $this->data['liabTotal']];
        $rows[] = ['Difference', $this->data['difference'], '', '', ''];

        return $rows;
    }
}
