<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class CategoryWiseStockSummaryExport implements FromView
{
    protected $categories, $filters, $company;

    public function __construct($categories, $filters, $company)
    {
        $this->categories = $categories;
        $this->filters = $filters;
        $this->company = $company;
    }

    public function view(): View
    {
        return view('excel.category-wise-stock-summary', [
            'categories' => $this->categories,
            'filters' => $this->filters,
            'company' => $this->company
        ]);
    }
}
