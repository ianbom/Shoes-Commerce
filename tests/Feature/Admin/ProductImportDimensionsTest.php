<?php

use App\Models\ProductImportBatch;
use App\Models\ProductImportItem;
use App\Models\User;
use App\Services\Admin\ProductImport\ProductImportPersistenceService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('applies default shipping dimensions to imported products and variants', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $batch = ProductImportBatch::query()->create([
        'user_id' => $admin->id,
        'source_url' => 'https://shop.x.yupoo.com/categories/1',
    ]);
    $item = ProductImportItem::query()->create([
        'product_import_batch_id' => $batch->id,
        'source_album_url' => 'https://shop.x.yupoo.com/albums/1',
        'source_title' => '420Y AB-123',
        'source_sku' => 'AB-123',
        'price_cny' => 420,
        'price_idr' => 1110648,
        'status' => 'ready',
        'product_payload' => [
            'title' => 'Imported Product',
            'sku' => 'AB-123',
            'brand' => 'Nike',
            'description' => null,
            'category' => null,
            'gallery' => [],
            'variants' => ['US M 4 / UK 3.5 / CM 23', 'US M 5 / UK 4 / CM 24'],
        ],
    ]);

    $product = app(ProductImportPersistenceService::class)->save($item);

    expect($product->fresh()->only(['weight', 'length', 'width', 'height']))->toBe([
        'weight' => 500,
        'length' => 23,
        'width' => 9,
        'height' => 10,
    ])
        ->and($product->variants()->get()->map(fn ($variant) => $variant->only(['stock', 'weight', 'length', 'width', 'height']))->all())->toBe([
            ['stock' => 10, 'weight' => 500, 'length' => 23, 'width' => 9, 'height' => 10],
            ['stock' => 10, 'weight' => 500, 'length' => 23, 'width' => 9, 'height' => 10],
        ]);
});
