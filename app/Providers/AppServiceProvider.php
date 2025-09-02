<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(ImageManager::class, fn () => new ImageManager(new Driver()));
    }

    public function boot(): void
    {
        // Admin bypass
        Gate::before(function ($user, $ability) {
            if ($user->hasRole('admin')) {
                return true;
            }
        });

        // Configure SMTP from DB (yours – unchanged)
        if (app()->runningInConsole()) return;
        try {
            $smtp = \App\Models\SmtpSetting::where('active', true)->latest('id')->first();
            if ($smtp) {
                config([
                    'mail.default'                 => 'smtp',
                    'mail.mailers.smtp.transport'  => 'smtp',
                    'mail.mailers.smtp.host'       => $smtp->host,
                    'mail.mailers.smtp.port'       => $smtp->port,
                    'mail.mailers.smtp.encryption' => $smtp->encryption === 'none' ? null : $smtp->encryption,
                    'mail.mailers.smtp.username'   => $smtp->username,
                    'mail.mailers.smtp.password'   => $smtp->password,
                    'mail.mailers.smtp.timeout'    => $smtp->timeout,
                    'mail.from.address'            => $smtp->from_address ?: $smtp->username,
                    'mail.from.name'               => $smtp->from_name ?: config('app.name'),
                ]);
            }
        } catch (\Throwable $e) {
            // swallow if tables not ready
        }

        // 🔵 Share company meta (name + logo URL) with all Inertia pages
        Inertia::share('company', function () {
            $user = auth()->user();
            if (!$user) return null;

            static $memo = null;  // request-level cache
            if ($memo !== null) return $memo;

            try {
                $setting = \App\Models\CompanySetting::where('created_by', $user->tenant_id)->first();
                if (!$setting) return $memo = null;

                return $memo = [
                    'name'          => $setting->company_name,
                    'logo_url'      => $setting->logo_path
                        ? Storage::disk('public')->url($setting->logo_path)
                        : null,
                    'logo_thumb_url'=> $setting->logo_thumb_path
                        ? Storage::disk('public')->url($setting->logo_thumb_path)
                        : null,
                ];
            } catch (\Throwable $e) {
                return $memo = null;
            }
        });
    }
}
