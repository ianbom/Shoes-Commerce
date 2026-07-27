<?php

use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

it('creates a product with images, variants, and stock logs from the admin form payload', function () {
    Storage::fake('public');

    $admin = User::factory()->create([
        'role' => 'admin',
        'is_active' => true,
    ]);

    $category = Category::query()->create([
        'name' => 'Gamis',
        'slug' => 'gamis',
        'description' => 'Gamis category',
        'is_active' => true,
    ]);

    $collection = Collection::query()->create([
        'name' => 'Ramadan Collection',
        'slug' => 'ramadan-collection',
        'description' => 'Ramadan collection',
        'is_featured' => true,
        'is_active' => true,
    ]);

    $payload = productPayload($category, $collection);

    $this->actingAs($admin)
        ->post(route('admin.products.store'), $payload)
        ->assertRedirect();

    $product = Product::query()
        ->where('slug', 'gamis-syari-pita')
        ->firstOrFail();

    expect($product)
        ->category_id->toBe($category->id)
        ->name->toBe('Gamis Syar\'i Pita')
        ->sku->toBe('GMS-001')
        ->short_description->toBe('Gamis premium untuk daily wear.')
        ->description->toBe('Gamis premium dengan detail pita dan bahan nyaman.')
        ->status->toBe('published')
        ->is_featured->toBeTrue()
        ->is_new_arrival->toBeTrue()
        ->is_best_seller->toBeFalse()
        ->meta_title->toBe('Gamis Syar\'i Pita Premium')
        ->meta_description->toBe('Gamis premium nyaman untuk aktivitas harian.');

    expect((float) $product->regular_price)->toBe(350000.00)
        ->and((float) $product->sale_price)->toBe(299000.00)
        ->and($product->weight)->toBe(500)
        ->and($product->length)->toBe(30)
        ->and($product->width)->toBe(25)
        ->and($product->height)->toBe(5);

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'category_id' => $category->id,
        'name' => 'Gamis Syar\'i Pita',
        'slug' => 'gamis-syari-pita',
        'sku' => 'GMS-001',
        'regular_price' => 350000,
        'sale_price' => 299000,
        'status' => 'published',
        'is_featured' => true,
        'is_new_arrival' => true,
        'is_best_seller' => false,
    ]);

    $this->assertDatabaseHas('product_collections', [
        'product_id' => $product->id,
        'collection_id' => $collection->id,
    ]);

    $this->assertDatabaseHas('product_images', [
        'product_id' => $product->id,
        'alt_text' => null,
        'sort_order' => 0,
        'is_primary' => true,
    ]);

    $image = $product->images()->firstOrFail();
    expect($image->image_url)->toStartWith('/storage/product/gamis-syari-pita/');
    Storage::disk('public')->assertExists(Str::after($image->image_url, '/storage/'));

    $variant = ProductVariant::query()
        ->where('sku', 'GMS-001-BLK-M')
        ->firstOrFail();

    expect($variant)
        ->product_id->toBe($product->id)
        ->color_name->toBe('Black')
        ->color_hex->toBe('#000000')
        ->size->toBe('M')
        ->stock->toBe(12)
        ->reserved_stock->toBe(2)
        ->is_active->toBeTrue();

    expect((float) $variant->regular_price)->toBe(15000.00)
        ->and((float) $variant->sale_price)->toBe(12000.00)
        ->and($variant->weight)->toBe(700)
        ->and($variant->length)->toBe(32)
        ->and($variant->width)->toBe(26)
        ->and($variant->height)->toBe(7);
    expect($variant->image_url)->toStartWith('/storage/product/gamis-syari-pita/variants/');
    Storage::disk('public')->assertExists(Str::after($variant->image_url, '/storage/'));

    $this->assertDatabaseHas('product_variants', [
        'id' => $variant->id,
        'product_id' => $product->id,
        'sku' => 'GMS-001-BLK-M',
        'color_name' => 'Black',
        'color_hex' => '#000000',
        'size' => 'M',
        'regular_price' => 15000,
        'stock' => 12,
        'reserved_stock' => 2,
        'is_active' => true,
    ]);

    $this->assertDatabaseHas('stock_logs', [
        'product_variant_id' => $variant->id,
        'user_id' => $admin->id,
        'type' => 'adjustment',
        'quantity' => 12,
        'stock_before' => 0,
        'stock_after' => 12,
        'reference_type' => 'manual_adjustment',
        'note' => 'Initial variant stock.',
    ]);
});

it('preserves stored product and variant files without image url input', function () {
    Storage::fake('public');

    $admin = User::factory()->create([
        'role' => 'admin',
        'is_active' => true,
    ]);
    $product = Product::query()->create([
        'name' => 'Urban Speed',
        'slug' => 'urban-speed',
        'sku' => 'USB-001',
        'brand_name' => 'NEXSTEP',
        'regular_price' => 1000000,
        'weight' => 800,
        'status' => 'draft',
    ]);
    $imagePath = 'product/urban-speed/existing.jpg';
    $variantPath = 'product/urban-speed/variants/existing.jpg';
    Storage::disk('public')->put($imagePath, 'product-image');
    Storage::disk('public')->put($variantPath, 'variant-image');
    $image = $product->images()->create([
        'image_url' => '/storage/'.$imagePath,
        'alt_text' => 'legacy alt text',
        'color_name' => 'Legacy color',
        'sort_order' => 0,
        'is_primary' => true,
    ]);
    $variant = $product->variants()->create([
        'sku' => 'USB-BLK-42',
        'color_name' => 'Black',
        'color_hex' => '#000000',
        'size' => 'EU 42',
        'stock' => 8,
        'reserved_stock' => 1,
        'image_url' => '/storage/'.$variantPath,
        'is_active' => true,
    ]);

    $this->actingAs($admin)
        ->put(route('admin.products.update', $product), [
            'name' => $product->name,
            'slug' => $product->slug,
            'sku' => $product->sku,
            'brand_name' => $product->brand_name,
            'regular_price' => $product->regular_price,
            'weight' => $product->weight,
            'status' => 'draft',
            'images' => [[
                'id' => $image->id,
                'sort_order' => 0,
                'is_primary' => true,
            ]],
            'variants' => [[
                'id' => $variant->id,
                'sku' => $variant->sku,
                'color_name' => $variant->color_name,
                'color_hex' => $variant->color_hex,
                'size' => $variant->size,
                'stock' => $variant->stock,
                'reserved_stock' => $variant->reserved_stock,
                'is_active' => true,
            ]],
        ])
        ->assertRedirect();

    expect($image->fresh())
        ->image_url->toBe('/storage/'.$imagePath)
        ->alt_text->toBeNull()
        ->color_name->toBeNull();
    expect($variant->fresh()->image_url)->toBe('/storage/'.$variantPath);
    Storage::disk('public')->assertExists($imagePath);
    Storage::disk('public')->assertExists($variantPath);
});

/**
 * @return array<string, mixed>
 */
function productPayload(Category $category, Collection $collection): array
{
    return [
        'category_id' => $category->id,
        'collection_id' => $collection->id,
        'name' => 'Gamis Syar\'i Pita',
        'slug' => 'gamis-syari-pita',
        'sku' => 'GMS-001',
        'short_description' => 'Gamis premium untuk daily wear.',
        'description' => 'Gamis premium dengan detail pita dan bahan nyaman.',
        'regular_price' => 350000,
        'sale_price' => 299000,
        'weight' => 500,
        'length' => 30,
        'width' => 25,
        'height' => 5,
        'status' => 'published',
        'is_featured' => true,
        'is_new_arrival' => true,
        'is_best_seller' => false,
        'meta_title' => 'Gamis Syar\'i Pita Premium',
        'meta_description' => 'Gamis premium nyaman untuk aktivitas harian.',
        'images' => [
            [
                'image' => UploadedFile::fake()->image('product-front.jpg', 800, 1067),
                'sort_order' => 0,
                'is_primary' => true,
            ],
        ],
        'variants' => [
            [
                'sku' => 'GMS-001-BLK-M',
                'color_name' => 'Black',
                'color_hex' => '#000000',
                'size' => 'M',
                'regular_price' => 15000,
                'sale_price' => 12000,
                'stock' => 12,
                'reserved_stock' => 2,
                'weight' => 700,
                'length' => 32,
                'width' => 26,
                'height' => 7,
                'image' => UploadedFile::fake()->image('variant-black.jpg', 800, 1067),
                'is_active' => true,
            ],
        ],
    ];
}
