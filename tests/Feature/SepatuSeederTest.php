<?php

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Database\Seeders\SepatuSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;

uses(RefreshDatabase::class);

it('seeds DummyJSON shoe products idempotently', function () {
    Http::preventStrayRequests();

    Http::fake([
        'https://dummyjson.com/products/category/mens-shoes?limit=0' => Http::response([
            'products' => [dummyJsonShoe()],
        ]),
        'https://dummyjson.com/products/category/womens-shoes?limit=0' => Http::response([
            'products' => [
                dummyJsonShoe([
                    'id' => 91,
                    'title' => 'Classic Women Shoes',
                    'sku' => 'WOMEN-001',
                    'brand' => 'FashionCo',
                ]),
                dummyJsonShoe([
                    'id' => 92,
                    'title' => '',
                    'sku' => 'INVALID',
                    'images' => [],
                ]),
            ],
        ]),
    ]);

    (new SepatuSeeder)->run();
    (new SepatuSeeder)->run();

    $product = Product::query()
        ->with(['categories', 'images', 'variants'])
        ->where('sku', 'SHOE-MEN-001')
        ->firstOrFail();

    expect(Product::query()->where('sku', 'like', 'SHOE-%')->count())->toBe(2)
        ->and($product->name)->toBe('Nike Air Jordan 1 Red And Black')
        ->and($product->brand_name)->toBe('Nike')
        ->and($product->categories->first()->slug)->toBe('sneakers')
        ->and((float) $product->price)->toBe(1843200.00)
        ->and($product->weight)->toBe(900)
        ->and($product->length)->toBe(35)
        ->and($product->width)->toBe(24)
        ->and($product->height)->toBe(14);

    expect($product->images)->toHaveCount(3)
        ->and($product->images->first()->is_primary)->toBeTrue()
        ->and(ProductImage::query()->where('product_id', $product->id)->count())->toBe(3);

    expect(ProductVariant::query()->where('product_id', $product->id)->count())->toBe(4)
        ->and($product->variants->first()->size)->toBe('US=4 EU=36')
        ->and($product->variants->sum('stock'))->toBe(7)
        ->and((float) $product->variants->first()->price)->toBe(1843200.00);
});

it('uses the local snapshot when the remote catalog is rate limited', function () {
    Http::preventStrayRequests();

    Http::fake([
        'https://dummyjson.com/products/category/mens-shoes?limit=0' => Http::sequence()
            ->push(['products' => [dummyJsonShoe()]])
            ->push([], 429)
            ->push([], 429)
            ->push([], 429),
        'https://dummyjson.com/products/category/womens-shoes?limit=0' => Http::sequence()
            ->push(['products' => []])
            ->push([], 429)
            ->push([], 429)
            ->push([], 429),
    ]);

    (new SepatuSeeder)->run();
    (new SepatuSeeder)->run();

    expect(Product::query()->where('sku', 'like', 'SHOE-%')->count())->toBe(3)
        ->and(Product::query()->where('sku', 'SHOE-MEN-001')->exists())->toBeTrue()
        ->and(Product::query()->where('sku', 'SHOE-SNAPSHOT-MEN-001')->exists())->toBeTrue()
        ->and(Product::query()->where('sku', 'SHOE-SNAPSHOT-WOMEN-001')->exists())->toBeTrue();
});

/**
 * @param  array<string, mixed>  $overrides
 * @return array<string, mixed>
 */
function dummyJsonShoe(array $overrides = []): array
{
    return array_replace([
        'id' => 90,
        'title' => 'Nike Air Jordan 1 Red And Black',
        'description' => 'High quality basketball shoes.',
        'category' => 'mens-shoes',
        'price' => 128,
        'discountPercentage' => 10,
        'stock' => 7,
        'brand' => 'Nike',
        'sku' => 'MEN-001',
        'weight' => 0.9,
        'dimensions' => [
            'width' => 24,
            'height' => 14,
            'depth' => 35,
        ],
        'availabilityStatus' => 'In Stock',
        'images' => [
            'https://cdn.example.com/1.jpg',
            'https://cdn.example.com/2.jpg',
            'https://cdn.example.com/3.jpg',
        ],
        'thumbnail' => 'https://cdn.example.com/thumb.jpg',
    ], $overrides);
}
