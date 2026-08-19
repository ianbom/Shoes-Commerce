<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('filters wishlist insights through product categories', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $customer = User::factory()->create(['role' => 'customer', 'is_active' => true]);
    $category = Category::query()->create(['name' => 'Running', 'slug' => 'running-wishlist', 'is_active' => true]);
    $product = Product::query()->create(['name' => 'Runner', 'slug' => 'runner-wishlist', 'price' => 100000, 'status' => 'published']);
    $product->categories()->attach($category);
    $product->wishlists()->create(['user_id' => $customer->id]);

    $this->actingAs($admin)->get(route('admin.wishlists.index', ['category_id' => $category->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('products.data.0.category', 'Running'));
});
