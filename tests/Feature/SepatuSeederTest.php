<?php

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Database\Seeders\SepatuSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;

uses(RefreshDatabase::class);

it('seeds flightkickz products with multiple images and variants', function () {
    Http::preventStrayRequests();

    Http::fake([
        'https://www.flightkickz.club/' => Http::response('<a href="/Air-Jordan-12-Stealth-sneakers-p29290158.html">Jordan</a>'),
        'https://www.flightkickz.club/Air-Jordan-12-Stealth-sneakers-p29290158.html' => Http::response(flightkickzProductHtml()),
    ]);

    (new SepatuSeeder)->run();
    (new SepatuSeeder)->run();

    $product = Product::query()
        ->with(['category', 'images', 'variants', 'marketplaceLinks'])
        ->where('sku', 'FKZ-CT8013-015')
        ->firstOrFail();

    expect($product)
        ->name->toBe('Air Jordan 12 Stealth sneakers')
        ->brand_name->toBe('Air Jordan')
        ->stock_status->toBe('in_stock')
        ->category->slug->toBe('sneakers')
        ->and((float) $product->regular_price)->toBe(2048000.00);

    expect($product->images)->toHaveCount(3)
        ->and($product->images->first()->is_primary)->toBeTrue()
        ->and(ProductImage::query()->where('product_id', $product->id)->count())->toBe(3);

    expect(ProductVariant::query()->where('product_id', $product->id)->count())->toBe(2)
        ->and($product->variants->pluck('size')->all())->toBe(['US7/UK6/EU40', 'US8/UK7/EU41']);

    expect($product->marketplaceLinks)->toHaveCount(1);
});

function flightkickzProductHtml(): string
{
    $json = json_encode([
        '@context' => 'http://schema.org/',
        '@type' => 'Product',
        'name' => 'Air Jordan 12 Stealth sneakers',
        'image' => [
            'https://cdn.example.com/1.jpg',
            'https://cdn.example.com/2.jpg',
            'https://cdn.example.com/3.jpg',
        ],
        'description' => 'Style CT8013-015 Colorway Stealth White Cool Grey',
        'mpn' => 'CT8013-015',
        'sku' => 'CT8013-015',
        'brand' => [
            '@type' => 'Brand',
            'name' => 'Air Jordan',
        ],
        'offers' => [
            '@type' => 'Offer',
            'priceCurrency' => 'USD',
            'price' => '128',
            'availability' => 'http://schema.org/InStock',
        ],
    ], JSON_THROW_ON_ERROR);

    $skus = json_encode([
        [
            'sku_code' => '152264683',
            'sku_value' => 'Nike Men:US7/UK6/EU40',
            'sku_value_short' => 'US7/UK6/EU40',
            'stock_nums' => '7',
        ],
        [
            'sku_code' => '152264685',
            'sku_value' => 'Nike Men:US8/UK7/EU41',
            'sku_value_short' => 'US8/UK7/EU41',
            'stock_nums' => '8',
        ],
    ], JSON_THROW_ON_ERROR);

    return <<<HTML
<html>
<head><script type="application/ld+json">{$json}</script></head>
<body><script>var skulist_str='{$skus}';</script></body>
</html>
HTML;
}
