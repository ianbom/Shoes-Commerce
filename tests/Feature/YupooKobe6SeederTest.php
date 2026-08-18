<?php

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Database\Seeders\YupooKobe6Seeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;

uses(RefreshDatabase::class);

it('seeds Yupoo Kobe 6 albums with CNY prices converted to rupiah idempotently', function () {
    Http::preventStrayRequests();
    Http::fake([
        'https://tianjin-no1.x.yupoo.com/albums/*' => Http::response(<<<'HTML'
            <html><title>【450Y】【STAR】Kobe 6</title><img src="https://photo.yupoo.com/tianjin-no1/product/image.jpg"></html>
            HTML),
    ]);

    (new YupooKobe6Seeder)->run();
    (new YupooKobe6Seeder)->run();

    $product = Product::query()->with(['category', 'collections', 'images', 'variants'])
        ->where('sku', 'YUPOO-K6-244413554')
        ->firstOrFail();

    expect(Product::query()->where('sku', 'like', 'YUPOO-K6-%')->count())->toBe(17)
        ->and($product->category->slug)->toBe('kobe-6')
        ->and($product->collections->pluck('slug')->all())->toContain('yupoo-kobe-6-star')
        ->and((float) $product->regular_price)->toBe(1192500.00)
        ->and($product->stock_status)->toBe('out_of_stock')
        ->and($product->status)->toBe('draft')
        ->and($product->images)->toHaveCount(1)
        ->and($product->images->first()->is_primary)->toBeTrue()
        ->and($product->variants)->toHaveCount(13)
        ->and($product->variants->pluck('size')->all())->toContain('40', '48.5')
        ->and($product->variants->every(fn (ProductVariant $variant): bool => $variant->stock === 0 && ! $variant->is_active))->toBeTrue();

    expect(ProductImage::query()->where('product_id', $product->id)->count())->toBe(1)
        ->and(ProductVariant::query()->where('product_id', $product->id)->count())->toBe(13);
});

it('uses verified snapshot data when Yupoo blocks server requests', function () {
    Http::preventStrayRequests();
    Http::fake([
        'https://tianjin-no1.x.yupoo.com/albums/*' => Http::response('', 567),
    ]);

    (new YupooKobe6Seeder)->run();

    $product = Product::query()->with('images')
        ->where('sku', 'YUPOO-K6-244413554')
        ->firstOrFail();

    expect((float) $product->regular_price)->toBe(1192500.00)
        ->and($product->images)->not->toBeEmpty()
        ->and($product->images->first()->image_url)->toStartWith('https://photo.yupoo.com/tianjin-no1/');
});
