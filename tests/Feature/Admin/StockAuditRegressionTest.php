<?php

use App\Models\Product;
use App\Services\Stock\StockService;
use Illuminate\Http\Request;

it('uses available stock for stock index filters and rows', function () {
    $product = Product::query()->create(['name' => 'Runner', 'slug' => 'runner-stock', 'price' => 100000, 'status' => 'draft']);
    $variant = $product->variants()->create(['size' => '42', 'price' => 100000, 'stock' => 10, 'reserved_stock' => 10, 'is_active' => true]);

    $data = app(StockService::class)->variantsIndex(Request::create('/admin/stock', 'GET', ['stock_status' => 'sold_out']));

    expect($data['variants']->total())->toBe(1)
        ->and($data['variants']->items()[0]['available_stock'])->toBe(0)
        ->and($data['stats']['sold_out'])->toBe(1);
});
