<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use App\Models\SmtpSetting;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(ImageManager::class, fn() => new ImageManager(new Driver()));
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //


        Gate::before(function ($user, $ability) {
            if ($user->hasRole('admin')) {
                return true; // Admin can access all pages, bypassing permissions
            }
        });

        if (app()->runningInConsole()) return;

        try {
            $smtp = SmtpSetting::where('active', true)->latest('id')->first();
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
            // swallow errors if table not migrated yet
        }
    }
}
