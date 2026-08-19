<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('includes existing cart quantity for each product detail variant', function () {
    $user = User::factory()->create();
    $product = createDetailProduct();
    $variant = ProductVariant::query()->create([
        'product_id' => $product->id,
        'sku' => 'SKU-'.Str::upper(Str::random(8)),
        'color_name' => 'Black',
        'size' => 'M',
        'stock' => 5,
        'reserved_stock' => 0,
        'is_active' => true,
    ]);
    $cart = Cart::query()->create(['user_id' => $user->id]);
    CartItem::query()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'product_variant_id' => $variant->id,
        'quantity' => 5,
        'product_name_snapshot' => $product->name,
        'variant_sku_snapshot' => $variant->size,
        'color_name_snapshot' => '',
        'size_snapshot' => $variant->size,
        'price_snapshot' => 100000,
    ]);

    $this->actingAs($user)
        ->get(route('detail', ['product' => $product->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('customer/products/detail-product')
            ->where('product.available_stock', 5)
            ->where('product.variants.0.id', $variant->id)
            ->where('product.variants.0.stock', 5)
            ->where('product.variants.0.reserved_stock', 0)
            ->where('product.variants.0.available_stock', 5)
            ->where('product.variants.0.cart_quantity', 5));
});

it('adds a selected product variant to the authenticated user cart', function () {
    $user = User::factory()->create();
    $product = createDetailProduct();
    $variant = ProductVariant::query()->create([
        'product_id' => $product->id,
        'sku' => 'SKU-'.Str::upper(Str::random(8)),
        'color_name' => 'Black',
        'size' => 'M',
        'stock' => 5,
        'reserved_stock' => 0,
        'is_active' => true,
    ]);

    $this->actingAs($user)
        ->from(route('detail', ['product' => $product->slug]))
        ->post(route('cart.add-product-variant', $variant), ['quantity' => 2])
        ->assertRedirect(route('detail', ['product' => $product->slug]));

    expect($user->cart?->items()->where('product_variant_id', $variant->id)->value('quantity'))->toBe(2);

    $this->actingAs($user)
        ->post(route('cart.add-product-variant', $variant), ['quantity' => 1])
        ->assertRedirect();

    expect($user->cart?->items()->where('product_variant_id', $variant->id)->value('quantity'))->toBe(3);
});

it('rejects cart quantities above available stock', function () {
    $user = User::factory()->create();
    $product = createDetailProduct();
    $variant = ProductVariant::query()->create([
        'product_id' => $product->id,
        'sku' => 'SKU-'.Str::upper(Str::random(8)),
        'color_name' => 'Black',
        'size' => 'M',
        'stock' => 2,
        'reserved_stock' => 1,
        'is_active' => true,
    ]);

    $this->actingAs($user)
        ->post(route('cart.add-product-variant', $variant), ['quantity' => 2])
        ->assertSessionHasErrors('quantity');

    expect(CartItem::query()->count())->toBe(0);
});

it('requires authentication to add a product variant to cart', function () {
    $product = createDetailProduct();
    $variant = ProductVariant::query()->create([
        'product_id' => $product->id,
        'sku' => 'SKU-'.Str::upper(Str::random(8)),
        'color_name' => 'Black',
        'size' => 'M',
        'stock' => 2,
        'reserved_stock' => 0,
        'is_active' => true,
    ]);

    $this->post(route('cart.add-product-variant', $variant), ['quantity' => 1])
        ->assertRedirect(route('login'));
});

/**
 * @param  array<string, mixed>  $overrides
 */
function createDetailProduct(array $overrides = []): Product
{
    $name = (string) ($overrides['name'] ?? 'Detail Product '.Str::random(8));

    return Product::query()->create([
        ...[
            'name' => $name,
            'slug' => Str::slug($name).'-'.Str::lower(Str::random(6)),
            'price' => 100000,
            'status' => 'published',
        ],
        ...$overrides,
    ]);
}
