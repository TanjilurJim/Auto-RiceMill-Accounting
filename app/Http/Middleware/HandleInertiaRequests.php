<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use App\Services\ApprovalCounter;
use Illuminate\Support\Facades\Auth;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');
        $user = $request->user();

        $trial = null;
        if ($user) {
            $ends = $user->trial_ends_at;
            $now  = now();

            $minutesLeft = $ends ? $now->diffInMinutes($ends, false) : null; // negative if expired
            $trial = [
                'ends_at'         => $ends?->toIso8601String(),
                'minutes_left'    => $minutesLeft,
                'days_left'       => $minutesLeft !== null ? ceil(max(0, $minutesLeft) / 1440) : null,
                'expiring_soon'   => $minutesLeft !== null && $minutesLeft <= (2 * 24 * 60) && $minutesLeft > 0, // ≤ 2 days
                'expired'         => $minutesLeft !== null && $minutesLeft <= 0,
                'inactive'        => $user->status !== 'active',
            ];
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'firstAppReload' => $request->session()->pull('first_app_load', false),
            'auth' => [
                'user' => $request->user() ? $request->user()->load('roles') : null,

                'isAdmin'   => $user?->hasRole('admin') ?? false,
                'roles'     => $user ? $user->getRoleNames() : [],   
                'tenant_id' => $request->user()?->tenant_id ?? 0,

                'verified'  => $user?->hasVerifiedEmail() ?? false,
                'trial'   => $trial,
            ],
            'ziggy' => fn(): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
            'counters' => $request->user()
                ? ApprovalCounter::forUser($request->user()->id)
                : [],
        ];
    }
}
