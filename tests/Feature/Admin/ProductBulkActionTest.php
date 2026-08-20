<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function createBulkProduct(string $slug, string $status = 'draft'): Product
{
    $product = Product::query()->create([
        'name' => $slug,
        'slug' => $slug,
        'sku' => strtoupper($slug),
        'price' => 100000,
        'weight' => 500,
        'status' => $status,
    ]);
    ProductImage::query()->create([
        'product_id' => $product->id,
        'image_url' => 'https://example.test/'.$slug.'.jpg',
        'is_primary' => true,
    ]);
    ProductVariant::query()->create([
        'product_id' => $product->id,
        'size' => 'US M 9',
        'price' => 100000,
        'stock' => 10,
        'is_active' => true,
    ]);

    return $product;
}

it('bulk updates selected product statuses', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $first = createBulkProduct('bulk-first');
    $second = createBulkProduct('bulk-second');

    $this->actingAs($admin)
        ->patch(route('admin.products.bulk-status'), [
            'product_ids' => [$first->id, $second->id],
            'status' => 'published',
        ])
        ->assertRedirect();

    expect($first->fresh()->status)->toBe('published')
        ->and($second->fresh()->status)->toBe('published');
});

it('bulk deletes products without orders and archives products with orders', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $deletable = createBulkProduct('bulk-delete');
    $ordered = createBulkProduct('bulk-archive', 'published');
    $order = Order::query()->create([
        'user_id' => $admin->id,
        'order_number' => 'ORDER-BULK-1',
        'customer_name' => 'Admin',
        'customer_email' => $admin->email,
        'customer_phone' => '08123456789',
        'subtotal' => 100000,
        'grand_total' => 100000,
    ]);
    OrderItem::query()->create([
        'order_id' => $order->id,
        'product_id' => $ordered->id,
        'product_name' => $ordered->name,
        'variant_sku' => 'US-M-9',
        'color_name' => 'Black',
        'size' => 'US M 9',
        'price' => 100000,
        'quantity' => 1,
        'subtotal' => 100000,
    ]);

    $this->actingAs($admin)
        ->delete(route('admin.products.bulk-destroy'), [
            'product_ids' => [$deletable->id, $ordered->id],
        ])
        ->assertRedirect();

    $this->assertSoftDeleted('products', ['id' => $deletable->id]);

    expect($ordered->fresh()->status)->toBe('archived');
});
