<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

it('renders admin order details from item snapshots', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $customer = User::factory()->create();
    $product = Product::query()->create([
        'name' => 'Air Jordan 1',
        'slug' => 'air-jordan-1-'.Str::random(8),
        'brand_name' => 'Nike',
        'price' => 2500000,
        'status' => 'published',
    ]);
    $variant = $product->variants()->create([
        'size' => '42',
        'price' => 2500000,
        'stock' => 3,
        'reserved_stock' => 0,
        'is_active' => true,
    ]);
    $order = Order::query()->create([
        'user_id' => $customer->id,
        'order_number' => 'ORD-SNAPSHOT-001',
        'customer_name' => $customer->name,
        'customer_email' => $customer->email,
        'customer_phone' => $customer->phone ?? '081234567890',
        'subtotal' => 2500000,
        'grand_total' => 2500000,
        'terms_agreed' => true,
        'terms_agreed_at' => now(),
    ]);

    OrderItem::query()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_variant_id' => $variant->id,
        'product_name' => $product->name,
        'product_sku' => 'AJ1-001',
        'variant_sku' => 'AJ1-001-42',
        'color_name' => 'Black Red',
        'size' => '42',
        'price' => 2500000,
        'quantity' => 1,
        'subtotal' => 2500000,
    ]);

    $variantQueries = [];

    DB::listen(function (QueryExecuted $query) use (&$variantQueries): void {
        if (str_contains($query->sql, 'product_variants')) {
            $variantQueries[] = $query->sql;
        }
    });

    $this->actingAs($admin)
        ->get(route('admin.orders.show', $order))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/orders/show')
            ->where('order.items.0.variant_sku', 'AJ1-001-42')
            ->where('order.items.0.color_name', 'Black Red')
            ->where('order.items.0.size', '42'));

    expect($variantQueries)->toBeEmpty();
});
