<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class ProductImportServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        RateLimiter::for('kicksdb', fn (): Limit => Limit::perMinute(30));
    }
}
