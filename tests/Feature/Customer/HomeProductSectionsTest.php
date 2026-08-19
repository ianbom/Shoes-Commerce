<?php

use App\Models\Product;
use App\Models\SiteSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('shows flash deals and latest new arrivals on home page', function () {
    $baseTime = Carbon::parse('2026-05-21 10:00:00');

    foreach (range(1, 6) as $index) {
        createHomeProduct([
            'name' => "New Arrival {$index}",
            'is_new_arrival' => true,
            'created_at' => $baseTime->copy()->addMinutes($index),
        ]);
    }

    createHomeProduct([
        'name' => 'Sale Only Product',
        'price' => 90000,
        'is_featured' => true,
        'is_new_arrival' => false,
        'created_at' => $baseTime->copy()->addMinutes(20),
    ]);

    foreach (range(1, 5) as $index) {
        createHomeProduct([
            'name' => "Best Seller {$index}",
            'is_best_seller' => true,
            'created_at' => $baseTime->copy()->addMinutes($index),
        ]);
    }

    createHomeProduct([
        'name' => 'Featured Only Product',
        'is_featured' => true,
        'is_best_seller' => false,
        'created_at' => $baseTime->copy()->addMinutes(30),
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->has('flashDeals', 2)
            ->where('flashDeals.0.name', 'Featured Only Product')
            ->where('flashDeals.1.name', 'Sale Only Product')
            ->has('newArrivals', 6)
            ->where('newArrivals.0.name', 'New Arrival 6')
            ->where('newArrivals.5.name', 'New Arrival 1'));
});

it('returns empty product sections without database records', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->has('flashDeals', 0)
            ->has('newArrivals', 0));
});

it('shares the WhatsApp number with shop pages', function () {
    SiteSetting::query()->create([
        'key' => 'whatsapp_number',
        'value' => '6281234567890',
        'type' => 'string',
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('shop.whatsapp_number', '6281234567890'));
});

/**
 * @param  array<string, mixed>  $overrides
 */
function createHomeProduct(array $overrides = []): Product
{
    $name = (string) ($overrides['name'] ?? 'Home Product '.Str::random(8));
    $timestamps = array_intersect_key($overrides, array_flip(['created_at', 'updated_at']));
    $attributes = array_diff_key($overrides, $timestamps);

    $product = Product::query()->create([
        ...[
            'name' => $name,
            'slug' => Str::slug($name).'-'.Str::lower(Str::random(6)),
            'price' => 100000,
            'status' => 'published',
        ],
        ...$attributes,
    ]);

    if ($timestamps !== []) {
        $product->forceFill([
            ...$timestamps,
            'updated_at' => $timestamps['updated_at'] ?? $timestamps['created_at'],
        ])->save();
    }

    return $product;
}
