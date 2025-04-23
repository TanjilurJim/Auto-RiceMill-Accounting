<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class DayBookExport implements FromCollection, WithHeadings, WithStyles, ShouldAutoSize
{
    protected $entries;

    public function __construct(array $entries)
    {
        $this->entries = $entries;
    }

    public function collection()
    {
        return collect($this->entries)->map(fn($e) => [
            'Date' => $e['date'],
            'Type' => $e['type'],
            'Voucher No' => $e['voucher_no'],
            'Ledger' => $e['ledger'],
            'Created By' => $e['created_by'] ?? '-',
            'Debit' => $e['debit'],
            'Credit' => $e['credit'],
            'Note' => $e['note'] ?? '-',
        ]);
    }

    public function headings(): array
    {
        return ['Date', 'Type', 'Voucher No', 'Ledger', 'Created By', 'Debit', 'Credit', 'Note'];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}