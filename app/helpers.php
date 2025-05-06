<?php

// auth helper
if (!function_exists('createdByMeOnly')) {
    function createdByMeOnly(): array
    {
        return ['created_by' => auth()->id()];
    }
}

if (!function_exists('createdByMeOr')) {
    function createdByMeOr(array $extraUserIds)
    {
        return function ($query) use ($extraUserIds) {
            return $query->where('created_by', auth()->id())
                         ->orWhereIn('created_by', $extraUserIds);
        };
    }
}

if (!function_exists('ownedByMe')) {
    function ownedByMe(): int
    {
        return auth()->id();
    }
}


if (!function_exists('numberToWords')) {
    function numberToWords($number)
    {
        $words = [
            0 => 'zero',
            1 => 'one',
            2 => 'two',
            3 => 'three',
            4 => 'four',
            5 => 'five',
            6 => 'six',
            7 => 'seven',
            8 => 'eight',
            9 => 'nine',
            10 => 'ten',
            11 => 'eleven',
            12 => 'twelve',
            13 => 'thirteen',
            14 => 'fourteen',
            15 => 'fifteen',
            16 => 'sixteen',
            17 => 'seventeen',
            18 => 'eighteen',
            19 => 'nineteen',
            20 => 'twenty',
            30 => 'thirty',
            40 => 'forty',
            50 => 'fifty',
            60 => 'sixty',
            70 => 'seventy',
            80 => 'eighty',
            90 => 'ninety'
        ];

        if ($number <= 20) {
            return ucfirst($words[$number]) . ' only';
        }

        if ($number < 100) {
            $tens = (int)($number / 10) * 10;
            $units = $number % 10;
            return ucfirst($words[$tens] . ($units ? '-' . $words[$units] : '')) . ' only';
        }

        if ($number < 1000) {
            $hundreds = (int)($number / 100);
            $remainder = $number % 100;
            return ucfirst($words[$hundreds] . ' hundred' . ($remainder ? ' and ' . numberToWords($remainder) : '')) . ' only';
        }

        return 'Number too large to convert';
    }
}

use App\Models\CompanySetting;
use Illuminate\Support\Facades\Auth;

if (! function_exists('company_info')) {
    function company_info(): ?CompanySetting
    {
        /* one‑request cache */
        static $cached = null;
        if ($cached !== null) {
            return $cached;
        }

        $user = Auth::user();

        /* Which row? */
        $row = match (true) {
            // admin – first company in DB
            $user && $user->hasRole('admin')       => CompanySetting::first(),

            // normal user – record I created
            $user && CompanySetting::where('created_by', $user->id)->exists()
                                                => CompanySetting::where('created_by', $user->id)->first(),

            // sub‑user – pick my “parent’s” company
            $user && $user->creator_id            // 👈 change if you use a different column
                                                => CompanySetting::where('created_by', $user->creator_id)->first(),

            default                                => null,
        };

        /* Add URL accessors so they survive JSON serialisation */
        if ($row) {
            $row->append(['logo_url', 'logo_thumb_url']);
        }

        return $cached = $row;
    }

    
}

use App\Services\InventoryService;

if (!function_exists('inventory_service')) {
    function inventory_service(): InventoryService
    {
        return new InventoryService();
    }
}

