<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // ❶  exposes POST /broadcasting/auth
        Broadcast::routes([
        'middleware' => ['web', 'auth'],
    ]);

        // ❷  loads your channel authorisation callbacks
        require base_path('routes/channels.php');
    }
}
