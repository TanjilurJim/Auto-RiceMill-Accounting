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


if (! function_exists('numberToWords')) {
    function numberToWords(float|int|string $amount): string
    {
        // ───── split into Taka / Paisa ─────
        $amount        = round($amount, 2);              // 1.005 → 1.01
        $taka          = (int) $amount;
        $paisa         = (int) round(($amount - $taka) * 100);   // two digits
        $takaWords     = $taka  ? _bdNumberToWords($taka)  : 'Zero';
        $paisaWords    = $paisa ? _bdNumberToWords($paisa) : '';

        return $paisa
            ? "$takaWords Taka & $paisaWords paisa only"
            : "$takaWords Taka only";
    }

    /* ---------- helper (recursive) ---------- */
    function _bdNumberToWords(int $n): string
    {
        $ones = [
            0=>'',1=>'one',2=>'two',3=>'three',4=>'four',5=>'five',
            6=>'six',7=>'seven',8=>'eight',9=>'nine',10=>'ten',
            11=>'eleven',12=>'twelve',13=>'thirteen',14=>'fourteen',
            15=>'fifteen',16=>'sixteen',17=>'seventeen',18=>'eighteen',
            19=>'nineteen'
        ];
        $tens = [
            2=>'twenty',3=>'thirty',4=>'forty',5=>'fifty',
            6=>'sixty',7=>'seventy',8=>'eighty',9=>'ninety'
        ];

        // large-number map (Indian system)
        $scales = [
            10000000 => 'crore',
            100000   => 'lakh',
            1000     => 'thousand',
            100      => 'hundred',
        ];

        if ($n < 20) {
            return $ones[$n];
        }
        if ($n < 100) {
            $t   = intdiv($n, 10);
            $r   = $n % 10;
            return trim($tens[$t] . ($r ? ' ' . $ones[$r] : ''));
        }

        foreach ($scales as $divisor => $label) {
            if ($n >= $divisor) {
                $lead = intdiv($n, $divisor);
                $rem  = $n % $divisor;
                $str  = _bdNumberToWords($lead) . " $label";
                if ($rem) {
                    // add separator rules
                    $str .= $divisor == 100 ? ' ' : ' ';
                    $str .= _bdNumberToWords($rem);
                }
                return trim($str);
            }
        }

        /* for trillions and beyond (international grouping) */
        return (string) $n;   // fallback, should not happen in normal use
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

