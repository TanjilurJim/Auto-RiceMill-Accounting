<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class ReceivablePayableExport implements FromArray, WithStyles
{
    protected $receivables;
    protected $payables;

    public function __construct($receivables, $payables)
    {
        $this->receivables = $receivables;
        $this->payables = $payables;
    }

    public function array(): array
    {
        $rows = [];

        // Receivables Section (A-C)
        $rows[] = ['Receivables', '', '', '', 'Payables']; // A1-E1
        $rows[] = ['Ledger Name', 'Group', 'Balance (DR)', '', 'Ledger Name', 'Group', 'Balance (CR)'];

        // Max rows from either section
        $max = max(count($this->receivables), count($this->payables));

        for ($i = 0; $i < $max; $i++) {
            $recv = $this->receivables[$i] ?? null;
            $pay = $this->payables[$i] ?? null;

            $rows[] = [
                $recv['ledger_name'] ?? '',
                $recv['group_name'] ?? '',
                $recv['balance'] ?? '',
                '',
                $pay['ledger_name'] ?? '',
                $pay['group_name'] ?? '',
                $pay['balance'] ?? '',
            ];
        }

        // Total Row
        $rows[] = [
            '',
            'Total',
            collect($this->receivables)->sum('balance'),
            '',
            '',
            'Total',
            collect($this->payables)->sum('balance'),
        ];

        return $rows;
    }



    public function styles(Worksheet $sheet)
    {
        $recvCount = count($this->receivables);
        $payCount = count($this->payables);
        $max = max($recvCount, $payCount);
        $totalRow = 3 + $max; // header is row 2, data starts row 3

        return [
            // Receivables section
            'A1' => ['font' => ['bold' => true]],
            'A2:C2' => ['font' => ['bold' => true]],
            'A1:C1' => [
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'E8F5E9'],
                ],
            ],
            "A{$totalRow}:C{$totalRow}" => [
                'font' => ['bold' => true],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_RIGHT],
            ],

            // Payables section
            'E1' => ['font' => ['bold' => true]],
            'E2:G2' => ['font' => ['bold' => true]],
            'E1:G1' => [
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'FFEBEE'],
                ],
            ],
            "E{$totalRow}:G{$totalRow}" => [
                'font' => ['bold' => true],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_RIGHT],
            ],
        ];
    }

    private function payableHeadingRow(): int
    {
        return count($this->receivables) + 4;
    }
}
