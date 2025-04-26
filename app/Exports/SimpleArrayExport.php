<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;

class SimpleArrayExport implements FromArray
{
    public function __construct(private array $rows) {}

    public function array(): array
    {
        return $this->rows;
    }
}
