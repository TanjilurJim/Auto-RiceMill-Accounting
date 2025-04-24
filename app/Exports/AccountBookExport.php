<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AccountBookExport implements FromCollection, WithHeadings, WithStyles, ShouldAutoSize
{
    protected array $entries;

    public function __construct(Collection $entries)
    {
        $this->entries = $entries->toArray(); // 🔁 FIX: convert collection to array
    }

    public function collection()
    {
        $balance = 0;

        return collect($this->entries)->map(function ($e) use (&$balance) {
            $debit = $e['debit'] ?? 0;
            $credit = $e['credit'] ?? 0;
            $balance += $debit - $credit;

            return [
                'Date' => $e['date'] ?? '-',
                'Type' => $e['type'] ?? '-',
                'Vch. No' => $e['voucher_no'] ?? '-',
                'Accounts' => $e['account'] ?? '-',
                'Note' => $e['note'] ?? '-',
                'Debit (TK)' => number_format($debit, 2),
                'Credit (TK)' => number_format($credit, 2),
                'Balance (TK)' => number_format(abs($balance), 2) . ' (' . ($balance >= 0 ? 'Dr' : 'Cr') . ')',
            ];
        });
    }

    public function headings(): array
    {
        return [
            'Date',
            'Type',
            'Vch. No',
            'Accounts',
            'Note',
            'Debit (TK)',
            'Credit (TK)',
            'Balance (TK)',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
