<?php

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->admin = User::factory()->create([
        'role' => 'admin',
        'is_active' => true,
    ]);
});

it('creates a standalone variant with an automatically stored image', function () {
    Storage::fake('public');

    $product = adminProduct('runner-one');

    $this->actingAs($this->admin)
        ->post(route('admin.product-variants.store'), [
            'product_id' => $product->id,
            'sku' => 'RUN-BLK-42',
            'color_name' => 'Black',
            'color_hex' => '#111111',
            'size' => 'EU 42',
            'regular_price' => 1200000,
            'sale_price' => 999000,
            'stock' => 10,
            'reserved_stock' => 3,
            'weight' => 850,
            'length' => 34,
            'width' => 24,
            'height' => 13,
            'image_url' => '/storage/ignored-by-request.jpg',
            'image' => UploadedFile::fake()->image('runner-black.jpg', 800, 1067),
            'is_active' => true,
        ])
        ->assertRedirect();

    $variant = ProductVariant::query()->where('sku', 'RUN-BLK-42')->firstOrFail();

    expect((float) $variant->regular_price)->toBe(1200000.00)
        ->and((float) $variant->sale_price)->toBe(999000.00)
        ->and($variant->reserved_stock)->toBe(3)
        ->and($variant->weight)->toBe(850)
        ->and($variant->length)->toBe(34)
        ->and($variant->width)->toBe(24)
        ->and($variant->height)->toBe(13)
        ->and($variant->image_url)->toStartWith('/storage/images/variants/');
    Storage::disk('public')->assertExists(str($variant->image_url)->after('/storage/')->toString());
});

it('rejects invalid standalone variant prices and reserved stock', function () {
    $product = adminProduct('runner-two');

    $this->actingAs($this->admin)
        ->from(route('admin.product-variants.create'))
        ->post(route('admin.product-variants.store'), [
            'product_id' => $product->id,
            'sku' => 'RUN-WHT-42',
            'color_name' => 'White',
            'size' => 'EU 42',
            'regular_price' => 900000,
            'sale_price' => 1000000,
            'stock' => 2,
            'reserved_stock' => 3,
        ])
        ->assertRedirect(route('admin.product-variants.create'))
        ->assertSessionHasErrors(['sale_price', 'reserved_stock']);
});

it('filters and counts products using available stock', function () {
    $soldOut = adminProduct('sold-out');
    $available = adminProduct('available');

    $soldOut->variants()->create(variantData('SOLD-BLK-42', 10, 10));
    $available->variants()->create(variantData('READY-BLK-42', 10, 2));

    $this->actingAs($this->admin)
        ->get(route('admin.products.index', ['stock_status' => 'sold_out']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('stats.out_of_stock', 1)
            ->has('products.data', 1)
            ->where('products.data.0.id', $soldOut->id)
            ->where('products.data.0.total_stock', 10)
            ->where('products.data.0.total_reserved_stock', 10)
            ->where('products.data.0.available_stock', 0));
});

function adminProduct(string $slug): Product
{
    return Product::query()->create([
        'name' => str($slug)->headline()->toString(),
        'slug' => $slug,
        'brand_name' => 'Axegear',
        'regular_price' => 1200000,
        'weight' => 800,
        'status' => 'draft',
    ]);
}

/**
 * @return array<string, mixed>
 */
function variantData(string $sku, int $stock, int $reservedStock): array
{
    return [
        'sku' => $sku,
        'color_name' => 'Black',
        'size' => 'EU 42',
        'stock' => $stock,
        'reserved_stock' => $reservedStock,
        'is_active' => true,
    ];
}
