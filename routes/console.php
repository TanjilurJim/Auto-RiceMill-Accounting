<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');



Schedule::command('sales:accrue-interest')
    ->daily();               // runs at 00:00
      // safety lock

///* * * * * cd /var/www/your-app && php artisan schedule:run >> /dev/null 2>&1
//chronjob command run korte hobe
// php artisan sales:accrue-interest