<?php

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
    /**
     * Returns the “company profile” row that belongs to the
     * current tenant. Admins get the first record (or you can
     * customise below).
     *
     * @return \App\Models\CompanySetting|null
     */
    function company_info(): ?CompanySetting
    {
        /* ----------------------------------------------------------
         | Cache result for the remainder of THIS request
         * --------------------------------------------------------*/
        static $cached = null;
        if ($cached !== null) {
            return $cached;
        }

        /* ----------------------------------------------------------
         | Decide which row to return
         * --------------------------------------------------------*/
        $user = Auth::user();

        // 1️⃣  Admin  → first record (or change logic if you need)
        if ($user && $user->hasRole('admin')) {
            return $cached = CompanySetting::first();
        }

        // 2️⃣  Normal user  → company created by ME
        if ($user) {
            return $cached = CompanySetting::where('created_by', $user->id)->first();
        }

        if ($cached && $cached->logo_path) {
            $cached->logo_url = asset('storage/' . $cached->logo_path);
        }

        // 3️⃣  Fallback (guest / no row found) → null
        return $cached = null;
    }
}
