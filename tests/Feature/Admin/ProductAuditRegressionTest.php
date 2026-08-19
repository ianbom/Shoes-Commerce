<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

it('filters admin products through the product categories pivot', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $category = Category::query()->create(['name' => 'Running', 'slug' => 'running', 'is_active' => true]);
    $product = Product::query()->create(['name' => 'Runner', 'slug' => 'runner', 'price' => 100000, 'status' => 'draft']);
    $product->categories()->attach($category);

    $this->actingAs($admin)->get(route('admin.products.index', ['category_id' => $category->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('products.data.0.id', $product->id));
});

it('returns current variant fields and category data in product details', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $category = Category::query()->create(['name' => 'Running', 'slug' => 'running', 'is_active' => true]);
    $product = Product::query()->create(['name' => 'Runner', 'slug' => 'runner-'.Str::random(4), 'price' => 100000, 'status' => 'draft']);
    $product->categories()->attach($category);
    $variant = $product->variants()->create(['size' => '42', 'price' => 100000, 'stock' => 4, 'reserved_stock' => 1, 'is_active' => true]);

    $this->actingAs($admin)->get(route('admin.products.show', $product))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('product.category', 'Running')
            ->where('product.variants.0.id', $variant->id)
            ->where('product.variants.0.price', '100000.00'));
});
