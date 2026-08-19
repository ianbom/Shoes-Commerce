<?php

use App\Providers\AppServiceProvider;
use App\Providers\FortifyServiceProvider;
use App\Providers\ProductImportServiceProvider;

return [
    AppServiceProvider::class,
    FortifyServiceProvider::class,
    ProductImportServiceProvider::class,
];
