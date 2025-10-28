<?php

use App\Models\User;
use App\Models\CompanySetting;
use Illuminate\Support\Facades\Auth;
use App\Services\InventoryService;






// Top-most parent (group head) খুঁজে বের করার ফাংশন
if (!function_exists('get_top_parent_id')) {
    function get_top_parent_id($user)
    {
        if ($user->hasRole('admin')) return null;
        $current = $user;
        while ($current->created_by) {
            $parent = User::find($current->created_by);
            if (!$parent || $parent->hasRole('admin')) {
                break;
            }
            $current = $parent;
        }
        return $current->id;
    }
}

// Recursive: সব descendant (child/sub-child...) return করে
if (!function_exists('get_all_descendant_user_ids')) {
    function get_all_descendant_user_ids($userId)
    {
        $ids = [];
        $children = User::where('created_by', $userId)
            ->whereDoesntHave('roles', function ($q) {
                $q->where('name', 'admin');
            })
            ->pluck('id')
            ->toArray();

        foreach ($children as $childId) {
            $ids[] = $childId;
            $ids = array_merge($ids, get_all_descendant_user_ids($childId));
        }
        return $ids;
    }
}

// Group-wise user ID list (strict group access)
if (!function_exists('godown_scope_ids')) {
    function godown_scope_ids(): array
    {
        $user = auth()->user();
        if (!$user) return [];

        // Admin: see all
        if ($user->hasRole('admin')) {
            return []; // No filter for admin
        }

        // Group head (top-most parent under admin)
        $groupHeadId = get_top_parent_id($user);

        // Group head + all descendants (the whole group)
        $ids = [$groupHeadId];
        $ids = array_merge($ids, get_all_descendant_user_ids($groupHeadId));

        return array_unique($ids);
    }
}
// Group-wise user ID list (strict group access)
if (!function_exists('user_scope_ids')) {
    function user_scope_ids(): array
    {
        $user = auth()->user();
        if (!$user) return [];
        

        // Admin: see all
        if ($user->hasRole('admin')) {
            return []; // No filter for admin
        }

        // Group head (top-most parent under admin)
        $groupHeadId = get_top_parent_id($user);

        // Group head + all descendants (the whole group)
        $ids = [$groupHeadId];
        $ids = array_merge($ids, get_all_descendant_user_ids($groupHeadId));

        return array_unique($ids);
    }
}











// dashboard helper
// if (!function_exists('user_scope_ids')) {
//     function user_scope_ids($user = null): array
//     {
//         $user = $user ?: auth()->user();
//         if (!$user) return [];
//         $myId = $user->id;
//         $parentId = $user->created_by;
//         $myUsers = User::where('created_by', $myId)->pluck('id')->toArray();

//         $userIds = [$myId];
//         if ($parentId) {
//             $parent = User::find($parentId);
//             if ($parent && !$parent->hasRole('admin')) {
//                 $userIds[] = $parentId;
//             }
//         }
//         $userIds = array_merge($userIds, $myUsers);
//         return array_unique($userIds);
//     }
// }

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





// if (! function_exists('numberToWords')) {
//     function numberToWords(float|int|string $amount): string
//     {
//         // ───── split into Taka / Paisa ─────
//         $amount        = round($amount, 2);              // 1.005 → 1.01
//         $taka          = (int) $amount;
//         $paisa         = (int) round(($amount - $taka) * 100);   // two digits
//         $takaWords     = $taka  ? _bdNumberToWords($taka)  : 'Zero';
//         $paisaWords    = $paisa ? _bdNumberToWords($paisa) : '';

//         return $paisa
//             ? "$takaWords Taka & $paisaWords paisa only"
//             : "$takaWords Taka only";
//     }

//     /* ---------- helper (recursive) ---------- */
//     function _bdNumberToWords(int $n): string
//     {
//         $ones = [
//             0=>'',1=>'one',2=>'two',3=>'three',4=>'four',5=>'five',
//             6=>'six',7=>'seven',8=>'eight',9=>'nine',10=>'ten',
//             11=>'eleven',12=>'twelve',13=>'thirteen',14=>'fourteen',
//             15=>'fifteen',16=>'sixteen',17=>'seventeen',18=>'eighteen',
//             19=>'nineteen'
//         ];
//         $tens = [
//             2=>'twenty',3=>'thirty',4=>'forty',5=>'fifty',
//             6=>'sixty',7=>'seventy',8=>'eighty',9=>'ninety'
//         ];

//         // large-number map (Indian system)
//         $scales = [
//             10000000 => 'crore',
//             100000   => 'lakh',
//             1000     => 'thousand',
//             100      => 'hundred',
//         ];

//         if ($n < 20) {
//             return $ones[$n];
//         }
//         if ($n < 100) {
//             $t   = intdiv($n, 10);
//             $r   = $n % 10;
//             return trim($tens[$t] . ($r ? ' ' . $ones[$r] : ''));
//         }

//         foreach ($scales as $divisor => $label) {
//             if ($n >= $divisor) {
//                 $lead = intdiv($n, $divisor);
//                 $rem  = $n % $divisor;
//                 $str  = _bdNumberToWords($lead) . " $label";
//                 if ($rem) {
//                     // add separator rules
//                     $str .= $divisor == 100 ? ' ' : ' ';
//                     $str .= _bdNumberToWords($rem);
//                 }
//                 return trim($str);
//             }
//         }

//         /* for trillions and beyond (international grouping) */
//         return (string) $n;   // fallback, should not happen in normal use
//     }
// }

use App\Models\FinancialYear;
use Carbon\Carbon;

if (!function_exists('current_financial_year')) {
    /**
     * Return the open FY that covers today's date for the
     * currently-logged-in tenant.  If none, return the most-recent
     * FY for the tenant; if still none, null.
     */
    function current_financial_year(): ?FinancialYear
    {
        $today = Carbon::today()->toDateString();

        // 1️⃣  Primary choice – open & date-range matches today
        $fy = FinancialYear::where('is_closed', 0)
            ->where('created_by', auth()->id())
            ->whereDate('start_date', '<=', $today)
            ->whereDate('end_date',   '>=', $today)
            ->first();

        if ($fy) {
            return $fy;
        }

        // 2️⃣  Fallback – latest open FY for the tenant
        $fy = FinancialYear::where('is_closed', 0)
            ->where('created_by', auth()->id())
            ->orderByDesc('start_date')
            ->first();

        // 3️⃣  Ultimate fallback – latest FY of any status for the tenant
        return $fy ?: FinancialYear::where('created_by', auth()->id())
                                   ->orderByDesc('start_date')
                                   ->first();
    }
}



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

/* helpers.php */

// if (! function_exists('company_info')) {
//     function company_info(): ?CompanySetting
//     {
//         static $cached = null;        // one‑request cache
//         if ($cached !== null) {
//             return $cached;
//         }

//         $ownerId = group_owner_id();
//         if ($ownerId === null) {
//             // No logged‑in user – or admin wants a generic record
//             $row = CompanySetting::first();
//         } else {
//             $row = CompanySetting::where('created_by', $ownerId)->first();
//         }

//         if ($row) {
//             $row->append(['logo_url', 'logo_thumb_url']);
//         }

//         return $cached = $row;
//     }
// }



if (! function_exists('setting')) {
    /**
     * Fetch a column from the current company's settings row.
     *
     * @param  string  $key      Column name in company_settings
     * @param  mixed   $default  Fallback when column is null / row missing
     * @return mixed
     */
    function setting(string $key, $default = null)
    {
        static $row = null;                               // ⏱ one-request cache
        $row ??= company_info();

        return $row?->{$key} ?? $default;
    }
}



if (!function_exists('inventory_service')) {
    function inventory_service(): InventoryService
    {
        return new InventoryService();
    }
}




// if (! function_exists('group_owner_id')) {
//     /**
//      * Return the user‑id that “owns” all shared resources
//      * for the current user’s group.
//      *
//      *  • admin  → its own id (or use the first company row – see below)
//      *  • others → top‑most parent under the nearest admin
//      */
//     function group_owner_id(): ?int
//     {
//         $user = auth()->user();
//         if (! $user) {
//             return null;
//         }

//         if ($user->hasRole('admin')) {
//             return $user->id;             // or: return null to fetch the first row
//         }

//         return get_top_parent_id($user);  // you already have this helper
//     }
// }