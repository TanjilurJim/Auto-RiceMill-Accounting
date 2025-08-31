<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Auth\Events\Verified;
use App\Listeners\GrantOwnerOnVerification;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        Verified::class => [
            GrantOwnerOnVerification::class,
        ],
    ];
}
