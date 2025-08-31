<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Verified;
use Spatie\Permission\Models\Role;



class GrantOwnerOnVerification
{
    public function handle(Verified $event): void
    {
        $user = $event->user;

        Role::findOrCreate('Owner', 'web');
        if (! $user->hasRole('Owner')) {
            $user->assignRole('Owner');
        }

        // Configurable trial length:
        // If TRIAL_MINUTES > 0, use minutes (handy for local tests)
        // else use TRIAL_DAYS (defaults to 7)
        $minutes = (int) env('TRIAL_MINUTES', 1);
        $days    = (int) env('TRIAL_DAYS', 7);

        $user->status        = 'active';
        $user->trial_ends_at = $minutes > 0 ? now()->addMinutes($minutes) : now()->addDays($days);
        $user->save();
    }
}
