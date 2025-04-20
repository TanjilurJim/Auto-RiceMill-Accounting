<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class StockSummaryExport implements FromView
{
    protected $stocks, $filters, $company;

    public function __construct($stocks, $filters, $company)
    {
        $this->stocks = $stocks;
        $this->filters = $filters;
        $this->company = $company;
    }

    public function view(): View
    {
        return view('excel.stock-summary', [
            'stocks' => $this->stocks,
            'filters' => $this->filters,
            'company' => $this->company
        ]);
    }
}
