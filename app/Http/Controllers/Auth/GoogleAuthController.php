<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Spatie\Permission\Models\Role;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        // You can drop ->stateless() locally if you prefer the default stateful flow
        return Socialite::driver('google')
            ->scopes(['email', 'profile'])
            ->redirect();
    }

    // app/Http/Controllers/Auth/GoogleAuthController.php

    public function callback()
    {
        try {
            $g = Socialite::driver('google')->stateless()->user();
        } catch (\Throwable $e) {
            return redirect()->route('login')->with('status', 'Google sign-in failed. Please try again.');
        }

        $email = $g->getEmail();
        if (!$email) {
            return redirect()->route('login')->with('status', 'Google account has no email.');
        }

        // Find existing by email (including soft-deleted)
        $user = User::withTrashed()->where('email', $email)->first();

        // If soft-deleted, block (or restore if that’s your policy)
        if ($user && $user->trashed()) {
            return redirect()->route('login')->with('status', 'This account is disabled.');
        }

        if (!$user) {
            // Ensure Owner role exists for the correct guard
            Role::findOrCreate('Owner', 'web');

            $user = User::create([
                'name'              => $g->getName() ?: explode('@', $email)[0],
                'email'             => $email,
                'password'          => Hash::make(Str::random(32)),
                'google_id'         => $g->getId(),
                'google_avatar'     => $g->getAvatar(),
                'status'            => 'active',
                'email_verified_at' => now(), // instant verification
            ]);

            // Start trial
            $minutes = (int) env('TRIAL_MINUTES', 0);
            $days    = (int) env('TRIAL_DAYS', 7);
            $user->trial_ends_at = $minutes > 0 ? now()->addMinutes($minutes) : now()->addDays($days);
            $user->save();

            // Assign role
            if (!$user->hasRole('Owner')) {
                $user->assignRole('Owner');
            }
        } else {
            // Link Google + ensure verified
            $updates = [
                'email_verified_at' => now(),
            ];
            if (!$user->google_id)     $updates['google_id'] = $g->getId();
            if (!$user->google_avatar) $updates['google_avatar'] = $g->getAvatar();

            if ($updates) $user->forceFill($updates)->save();
        }

        // ✅ Make absolutely sure Laravel considers them verified
        if (method_exists($user, 'hasVerifiedEmail') && ! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified(); // fires Verified event + sets email_verified_at
        }

        // Block inactive accounts
        if ($user->status !== 'active') {
            return redirect()->route('login')->with('status', 'Your account is inactive. Please contact support.');
        }

        Auth::login($user, remember: true);

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
