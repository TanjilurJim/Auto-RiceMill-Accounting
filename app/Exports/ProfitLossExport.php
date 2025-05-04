<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\{FromArray, WithTitle, WithStyles, WithEvents, ShouldAutoSize};
use Maatwebsite\Excel\Events\AfterSheet;

class ProfitLossExport implements FromArray, WithTitle, WithStyles, WithEvents, ShouldAutoSize
{
    public function __construct(private array $data) {}

    /* ---------- Sheet data ---------- */
    public function array(): array
    {
        $f = $this->data['figures'];

        return [
            ['Profit & Loss Report'],
            ['Period', "{$this->data['from_date']} – {$this->data['to_date']}"],
            [],
            ['Income'],
            ['Sales',           $f['sales']],
            ['Other Income',    $f['otherIncome']],
            [],
            ['Expenses'],
            ['COGS',            $f['cogs']],
            ['Operating Expenses', $f['expenses']],
            [],
            ['Summary'],
            ['Gross Profit',    $f['grossProfit']],
            ['Net Profit',      $f['netProfit']],
        ];
    }

    public function title(): string  { return 'Summary'; }

    /* ---------- Basic styling ---------- */
    public function styles($sheet)
    {
        // Bold headers + section titles
        $sheet->getStyle('A1:A1')->getFont()->setBold(true)->setSize(14);
        foreach ([4,8,12] as $row) {
            $sheet->getStyle("A{$row}:A{$row}")->getFont()->setBold(true);
        }
        // Net Profit highlight
        $last = $sheet->getHighestRow();
        $sheet->getStyle("A{$last}:B{$last}")
              ->applyFromArray([
                  'font' => ['bold'=>true, 'color'=>['rgb'=>'065F46']],
                  'fill' => ['fillType'=>'solid', 'startColor'=>['rgb'=>'ECFDF5']],
              ]);
    }

    /* ---------- Currency & thousand‑sep formatting ---------- */
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $e) {
                // Apply number format to column B except title rows
                $highest = $e->getSheet()->getDelegate()->getHighestRow();
                $e->getSheet()->getStyle("B2:B{$highest}")
                  ->getNumberFormat()
                  ->setFormatCode('#,##0.00');
            },
        ];
    }
}