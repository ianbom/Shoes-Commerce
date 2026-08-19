<?php

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('filters products by brand and exposes brand options', function () {
    createListProduct('Nike Air', 'Nike');
    createListProduct('Adidas Run', 'Adidas');

    $this->get(route('list', ['brand' => 'Nike']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('products.data.0.title', 'Nike Air')
            ->has('products.data', 1)
            ->where('options.brands.0.value', 'Adidas')
            ->where('options.brands.1.value', 'Nike'));
});

it('filters products by price range', function () {
    createListProduct('Budget Shoe', 'Nike', 300000);
    createListProduct('Premium Shoe', 'Nike', 900000);

    $this->get(route('list', ['price' => 'under_410']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('products.data.0.title', 'Budget Shoe')
            ->has('products.data', 1));
});

function createListProduct(string $name, string $brand, int $price = 500000): Product
{
    return Product::query()->create([
        'name' => $name,
        'slug' => Str::slug($name).'-'.Str::random(6),
        'brand_name' => $brand,
        'price' => $price,
        'status' => 'published',
    ]);
}
