<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected function applyUserScope($query)
    {
        return $query->when(!auth()->user()->hasRole('admin'), function ($query) {
            $query->where(function ($q) {
                $q->where('created_by', auth()->id())
                    ->orWhereHas('creator', fn($q2) => $q2->where('created_by', auth()->id()));
            });
        });
    }

    protected function getCompany()
    {
        return \App\Models\CompanySetting::where('created_by', auth()->id())->first();
    }

    protected function getCurrentFinancialYear()
    {
        return \App\Models\FinancialYear::where('created_by', auth()->id())
            ->whereDate('start_date', '<=', now())
            ->whereDate('end_date', '>=', now())
            ->where('is_closed', 0)
            ->first();
    }
}
