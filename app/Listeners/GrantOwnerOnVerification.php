<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Carbon;
use Spatie\Permission\Models\Role;
use Illuminate\Console\Scheduling\Schedule;
class GrantOwnerOnVerification
{
    public function handle(Verified $event): void
    {
        $user = $event->user;

        // Ensure role exists and assign once
        Role::findOrCreate('Owner', config('auth.defaults.guard', 'web'));
        if (! $user->hasRole('Owner')) {
            $user->assignRole('Owner');
        }

        // Read from config (respects config:cache)
        $days = (int) config('trial.days', 7);
        if ($days <= 0) {
            $days = 7; // fallback to a sane default
        }

        $user->status = 'active';

        // Only set once; avoid extending if already set somehow
        if (is_null($user->trial_ends_at)) {
            $user->trial_ends_at = Carbon::now()->addDays($days);
        }

        $user->save();
    }
}
