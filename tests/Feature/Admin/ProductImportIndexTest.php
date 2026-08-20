<?php

use App\Models\Product;
use App\Models\ProductImportBatch;
use App\Models\ProductImportItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('lists previous import batches for an admin', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $batch = ProductImportBatch::query()->create([
        'user_id' => $admin->id,
        'source_url' => 'https://shop.x.yupoo.com/categories/1',
        'status' => 'ready',
        'discovered_count' => 12,
        'saved_count' => 8,
    ]);

    $this->actingAs($admin)
        ->get(route('admin.product-imports.index'))
        ->assertInertia(fn ($page) => $page
            ->component('admin/product-imports/index')
            ->has('batches.data', 1)
            ->where('batches.data.0.id', $batch->id));
});

it('deletes an import batch and its preview items without deleting saved products', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $product = Product::query()->create([
        'name' => 'Saved Product',
        'slug' => 'saved-product',
        'sku' => 'AB-123',
        'price' => 100000,
        'status' => 'draft',
    ]);
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
        'status' => 'saved',
        'saved_product_id' => $product->id,
    ]);

    $this->actingAs($admin)
        ->delete(route('admin.product-imports.destroy', $batch))
        ->assertRedirect(route('admin.product-imports.index'));

    $this->assertModelMissing($batch);
    $this->assertModelMissing($item);
    $this->assertModelExists($product);
});
