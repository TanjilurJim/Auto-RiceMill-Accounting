<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // -------- Stats (global) --------
        $totalUsers  = User::count();
        $activeUsers = User::where('status', 'active')->count();
        $newThisWeek = User::where('created_at', '>=', now()->subDays(7))->count();

        // Roles summary via Spatie tables
        $rolesSummary = DB::table('roles')
            ->select('roles.name as role', DB::raw('COUNT(*) as count'))
            ->join('model_has_roles', 'roles.id', '=', 'model_has_roles.role_id')
            ->join('users', 'users.id', '=', 'model_has_roles.model_id')
            ->where('roles.guard_name', 'web')
            ->whereNull('users.deleted_at')
            ->groupBy('roles.name')
            ->orderBy('roles.name')
            ->get()
            ->map(fn ($r) => ['role' => $r->role, 'count' => (int) $r->count])
            ->values();

        // Recent users (latest 12) with role names
        $recentUsers = User::with('roles:id,name')
            ->latest('created_at')
            ->limit(12)
            ->get()
            ->map(function (User $u) {
                return [
                    'id'        => $u->id,
                    'name'      => $u->name,
                    'email'     => $u->email,
                    'roleNames' => $u->roles->pluck('name')->values(),
                    'joinedAt'  => optional($u->created_at)->toIso8601String(),
                    'isActive'  => $u->status === 'active',
                ];
            });

        // -------- NEW: expiringSoon (for the countdown panel) --------
        $windowDays = (int) env('TRIAL_EXPIRY_WINDOW_DAYS', 14); // tweak in .env
        $expiringSoon = User::query()
            ->where('status', 'active')
            ->whereNotNull('trial_ends_at')
            ->whereBetween('trial_ends_at', [now(), now()->addDays($windowDays)])
            ->orderBy('trial_ends_at')
            ->limit(50)
            ->get(['id','name','email','trial_ends_at'])
            ->map(fn (User $u) => [
                'id'         => $u->id,
                'name'       => $u->name,
                'email'      => $u->email,
                'inactiveAt' => optional($u->trial_ends_at)->toIso8601String(), // front-end expects this key
                // 'warnFrom' => optional($u->trial_started_at)->toIso8601String(), // if you add/track start
            ]);

        return Inertia::render('dashboard/AdminDashboard', [
            'stats' => [
                'totalUsers'   => $totalUsers,
                'activeUsers'  => $activeUsers,
                'newThisWeek'  => $newThisWeek,
                'rolesSummary' => $rolesSummary,
            ],
            'recentUsers'  => $recentUsers,
            'expiringSoon' => $expiringSoon, // << pass to page
        ]);
    }
}
