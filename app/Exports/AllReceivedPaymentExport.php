<?php

namespace App\Exports;

use App\Models\ReceivedAdd;
use Maatwebsite\Excel\Concerns\FromCollection;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class AllReceivedPaymentExport implements FromView
{
    public $entries;
    public $from;
    public $to;
    public $company;

    public function __construct($entries, $from, $to, $company)
    {
        $this->entries = $entries;
        $this->from    = $from;
        $this->to      = $to;
        $this->company = $company;
    }

    public function view(): View
    {
        return view('exports.all-received-payment', [
            'entries' => $this->entries,
            'from'    => $this->from,
            'to'      => $this->to,
            'company' => $this->company,
        ]);
    }
}