<?php

use App\Models\Product;
use App\Models\ProductImportBatch;
use App\Models\ProductImportItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('allows an admin to remove an unsaved import preview item', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $batch = ProductImportBatch::query()->create(['user_id' => $admin->id, 'source_url' => 'https://shop.x.yupoo.com/categories/1']);
    $item = ProductImportItem::query()->create([
        'product_import_batch_id' => $batch->id,
        'source_album_url' => 'https://shop.x.yupoo.com/albums/1',
        'source_title' => '420Y AB-123',
        'source_sku' => 'AB-123',
        'price_cny' => 420,
        'price_idr' => 1110648,
        'status' => 'ready',
    ]);

    $this->actingAs($admin)
        ->delete(route('admin.product-imports.items.destroy', [$batch, $item]))
        ->assertRedirect();

    $this->assertModelMissing($item);
});

it('does not remove an import item from another batch', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $batch = ProductImportBatch::query()->create(['user_id' => $admin->id, 'source_url' => 'https://shop.x.yupoo.com/categories/1']);
    $otherBatch = ProductImportBatch::query()->create(['user_id' => $admin->id, 'source_url' => 'https://shop.x.yupoo.com/categories/2']);
    $item = ProductImportItem::query()->create([
        'product_import_batch_id' => $otherBatch->id,
        'source_album_url' => 'https://shop.x.yupoo.com/albums/1',
        'source_title' => '420Y AB-123',
        'source_sku' => 'AB-123',
        'price_cny' => 420,
        'price_idr' => 1110648,
        'status' => 'ready',
    ]);

    $this->actingAs($admin)
        ->delete(route('admin.product-imports.items.destroy', [$batch, $item]))
        ->assertNotFound();

    $this->assertModelExists($item);
});

it('does not remove a saved import item', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $product = Product::query()->create([
        'name' => 'Saved Product',
        'slug' => 'saved-product',
        'sku' => 'AB-123',
        'price' => 100000,
        'status' => 'draft',
    ]);
    $batch = ProductImportBatch::query()->create(['user_id' => $admin->id, 'source_url' => 'https://shop.x.yupoo.com/categories/1']);
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
        ->delete(route('admin.product-imports.items.destroy', [$batch, $item]))
        ->assertSessionHasErrors('item');

    $this->assertModelExists($item);
});
