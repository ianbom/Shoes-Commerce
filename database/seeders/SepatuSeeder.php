<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

class SepatuSeeder extends Seeder
{
    private const BASE_URL = 'https://dummyjson.com';

    private const CATEGORIES = ['mens-shoes', 'womens-shoes'];

    private const USD_TO_IDR = 16000;

    public function run(): void
    {
        $products = collect($this->catalog())
            ->map(fn (array $product, int $index): ?array => $this->mapProduct($product, $index))
            ->filter()
            ->values();

        if ($products->isEmpty()) {
            throw new RuntimeException('DummyJSON tidak menghasilkan produk sepatu yang valid.');
        }

        DB::transaction(function () use ($products): void {
            $category = $this->category();
            $collectionIds = $this->collectionIds();
            $seededSkus = [];

            foreach ($products as $product) {
                $record = Product::query()->withTrashed()->updateOrCreate(
                    ['slug' => $product['slug']],
                    [
                        'category_id' => $category->id,
                        'name' => $product['name'],
                        'sku' => $product['sku'],
                        'brand_name' => $product['brand_name'],
                        'regular_price' => $product['regular_price'],
                        'sale_price' => $product['sale_price'],
                        'short_description' => Str::limit($product['description'], 150),
                        'description' => $product['description'],
                        'stock_status' => $product['stock_status'],
                        'status' => 'published',
                        'weight' => $product['weight'],
                        'length' => $product['length'],
                        'width' => $product['width'],
                        'height' => $product['height'],
                        'is_featured' => $product['index'] % 5 === 0,
                        'is_new_arrival' => $product['index'] < 10,
                        'is_best_seller' => $product['index'] % 3 === 0,
                        'meta_title' => $product['name'].' | '.$product['brand_name'],
                        'meta_description' => Str::limit($product['description'], 160),
                    ],
                );

                if ($record->trashed()) {
                    $record->restore();
                }

                $record->collections()->sync($collectionIds);
                $this->syncImages($record, $product['images']);
                $this->syncVariant($record, $product);

                $seededSkus[] = $product['sku'];
            }

            Product::query()
                ->where('sku', 'like', 'SHOE-%')
                ->whereNotIn('sku', $seededSkus)
                ->delete();
        });
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function catalog(): array
    {
        $products = [];

        foreach (self::CATEGORIES as $category) {
            $response = Http::acceptJson()
                ->retry([100, 300], throw: false)
                ->timeout(20)
                ->connectTimeout(5)
                ->get(self::BASE_URL."/products/category/{$category}", ['limit' => 0]);

            if (! $response->successful()) {
                throw new RuntimeException("DummyJSON {$category} gagal diakses (HTTP {$response->status()}).");
            }

            $categoryProducts = $response->json('products');

            if (! is_array($categoryProducts)) {
                throw new RuntimeException("Response DummyJSON {$category} tidak valid.");
            }

            $products = [...$products, ...$categoryProducts];
        }

        return $products;
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>|null
     */
    private function mapProduct(array $data, int $index): ?array
    {
        $name = trim((string) ($data['title'] ?? ''));
        $sourceId = (string) ($data['id'] ?? '');
        $regularPrice = $this->rupiah($data['price'] ?? 0);
        $images = collect($data['images'] ?? [])
            ->filter(fn (mixed $image): bool => is_string($image) && filter_var($image, FILTER_VALIDATE_URL) !== false)
            ->unique()
            ->values()
            ->all();

        if ($name === '' || $sourceId === '' || $regularPrice <= 0 || $images === []) {
            return null;
        }

        $discountPercentage = max(0, min(100, (float) ($data['discountPercentage'] ?? 0)));
        $salePrice = $discountPercentage > 0
            ? (int) round($regularPrice * (1 - ($discountPercentage / 100)))
            : null;
        $stock = max(0, (int) ($data['stock'] ?? 0));
        $brand = trim((string) ($data['brand'] ?? '')) ?: 'Generic';

        return [
            'index' => $index,
            'name' => $name,
            'slug' => Str::slug($name).'-'.$sourceId,
            'sku' => $this->sku((string) ($data['sku'] ?? $sourceId)),
            'brand_name' => $brand,
            'description' => trim((string) ($data['description'] ?? '')) ?: $name,
            'regular_price' => $regularPrice,
            'sale_price' => $salePrice,
            'stock' => $stock,
            'stock_status' => $stock === 0 || Str::contains((string) ($data['availabilityStatus'] ?? ''), 'Out of Stock', true)
                ? 'out_of_stock'
                : 'in_stock',
            'weight' => max(1, (int) round(((float) ($data['weight'] ?? 1)) * 1000)),
            'length' => max(1, (int) round((float) data_get($data, 'dimensions.depth', 35))),
            'width' => max(1, (int) round((float) data_get($data, 'dimensions.width', 25))),
            'height' => max(1, (int) round((float) data_get($data, 'dimensions.height', 15))),
            'images' => $images,
        ];
    }

    /**
     * @param  array<int, string>  $images
     */
    private function syncImages(Product $product, array $images): void
    {
        $keptIds = [];

        foreach ($images as $sortOrder => $imageUrl) {
            $record = ProductImage::query()->withTrashed()->updateOrCreate(
                ['product_id' => $product->id, 'sort_order' => $sortOrder],
                [
                    'image_url' => $imageUrl,
                    'alt_text' => $product->name.' image '.($sortOrder + 1),
                    'is_primary' => $sortOrder === 0,
                ],
            );

            if ($record->trashed()) {
                $record->restore();
            }

            $keptIds[] = $record->id;
        }

        ProductImage::query()
            ->where('product_id', $product->id)
            ->whereNotIn('id', $keptIds)
            ->delete();
    }

    /**
     * @param  array<string, mixed>  $productData
     */
    private function syncVariant(Product $product, array $productData): void
    {
        $sku = $productData['sku'].'-DEFAULT';
        $record = ProductVariant::query()->withTrashed()->updateOrCreate(
            ['sku' => $sku],
            [
                'product_id' => $product->id,
                'color_name' => 'Default',
                'color_hex' => null,
                'size' => 'One Size',
                'regular_price' => $productData['regular_price'],
                'sale_price' => $productData['sale_price'],
                'stock' => $productData['stock'],
                'reserved_stock' => 0,
                'weight' => $productData['weight'],
                'length' => $productData['length'],
                'width' => $productData['width'],
                'height' => $productData['height'],
                'image_url' => $productData['images'][0],
                'is_active' => true,
            ],
        );

        if ($record->trashed()) {
            $record->restore();
        }

        ProductVariant::query()
            ->where('product_id', $product->id)
            ->where('sku', '!=', $sku)
            ->delete();
    }

    private function category(): Category
    {
        $category = Category::query()->withTrashed()->updateOrCreate(
            ['slug' => 'sneakers'],
            [
                'name' => 'Sepatu Sneakers',
                'description' => 'Koleksi sepatu pria dan wanita dari DummyJSON.',
                'sort_order' => 10,
                'is_active' => true,
            ],
        );

        if ($category->trashed()) {
            $category->restore();
        }

        return $category;
    }

    /**
     * @return array<int, array{sort_order: int}>
     */
    private function collectionIds(): array
    {
        return DB::table('collections')
            ->whereIn('slug', ['new-arrivals'])
            ->pluck('id')
            ->mapWithKeys(fn (int $id): array => [$id => ['sort_order' => 1]])
            ->all();
    }

    private function sku(string $value): string
    {
        return Str::limit('SHOE-'.Str::upper(Str::slug($value)), 100, '');
    }

    private function rupiah(mixed $usd): int
    {
        return (int) round(((float) $usd) * self::USD_TO_IDR);
    }
}
