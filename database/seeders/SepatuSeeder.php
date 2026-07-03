<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductMarketplaceLink;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

class SepatuSeeder extends Seeder
{
    private const BASE_URL = 'https://www.flightkickz.club';

    private const LIMIT = 24;

    private const USD_TO_IDR = 16000;

    public function run(): void
    {
        $products = collect($this->productUrls())
            ->take(self::LIMIT)
            ->map(fn (string $url, int $index): array => $this->scrapeProduct($url, $index))
            ->filter(fn (array $product): bool => count($product['images']) > 1)
            ->values();

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
                        'product_line' => $product['product_line'],
                        'style_name' => $product['style_name'],
                        'regular_price' => $product['regular_price'],
                        'sale_price' => null,
                        'short_description' => Str::limit($product['description'], 150),
                        'description' => $product['description'],
                        'stock_status' => $product['stock_status'],
                        'status' => 'published',
                        'weight' => 1000,
                        'length' => 35,
                        'width' => 25,
                        'height' => 15,
                        'is_featured' => $product['index'] % 5 === 0,
                        'is_new_arrival' => $product['index'] < 10,
                        'is_best_seller' => $product['index'] % 3 === 0,
                        'meta_title' => $product['name'].' | Flightkickz',
                        'meta_description' => Str::limit($product['description'], 160),
                    ],
                );

                if ($record->trashed()) {
                    $record->restore();
                }

                $record->collections()->sync($collectionIds);
                $this->syncImages($record, $product['images']);
                $this->syncVariants($record, $product);
                $this->syncMarketplaceLink($record, $product);

                $seededSkus[] = $product['sku'];
            }

            Product::query()
                ->where('sku', 'like', 'FKZ-%')
                ->whereNotIn('sku', $seededSkus)
                ->delete();
        });
    }

    /**
     * @return array<int, string>
     */
    private function productUrls(): array
    {
        $html = Http::retry([100, 300])
            ->timeout(20)
            ->connectTimeout(5)
            ->withUserAgent('Mozilla/5.0 Seeder')
            ->get(self::BASE_URL.'/')
            ->throw()
            ->body();

        preg_match_all('/href=["\']([^"\']+-p\d+\.html)["\']/i', $html, $matches);

        return collect($matches[1] ?? [])
            ->map(fn (string $url): string => $this->absoluteUrl(html_entity_decode($url)))
            ->unique()
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function scrapeProduct(string $url, int $index): array
    {
        $html = Http::retry([100, 300])
            ->timeout(20)
            ->connectTimeout(5)
            ->withUserAgent('Mozilla/5.0 Seeder')
            ->get($url)
            ->throw()
            ->body();

        $data = $this->jsonLdProduct($html);
        $name = trim((string) ($data['name'] ?? ''));
        $sku = $this->sku((string) ($data['sku'] ?? $data['mpn'] ?? $this->productId($url)));
        $images = $this->images($data['image'] ?? []);

        if ($name === '' || $images === []) {
            throw new RuntimeException("Data Flightkickz tidak lengkap: {$url}");
        }

        return [
            'index' => $index,
            'name' => $name,
            'slug' => Str::slug($name).'-'.$this->productId($url),
            'sku' => $sku,
            'brand_name' => (string) data_get($data, 'brand.name', 'Flightkickz'),
            'product_line' => (string) data_get($data, 'brand.name', 'Sneakers'),
            'style_name' => Str::limit($name, 180, ''),
            'description' => trim((string) ($data['description'] ?? $name)),
            'regular_price' => $this->rupiah((string) data_get($data, 'offers.price', '0')),
            'stock_status' => Str::contains((string) data_get($data, 'offers.availability', ''), 'OutOfStock') ? 'out_of_stock' : 'in_stock',
            'source_url' => $url,
            'source_id' => $this->productId($url),
            'images' => $images,
            'variants' => $this->variants($html),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function jsonLdProduct(string $html): array
    {
        preg_match_all('/<script[^>]+type=["\']application\/ld\+json["\'][^>]*>(.*?)<\/script>/is', $html, $matches);

        foreach ($matches[1] ?? [] as $script) {
            $decoded = json_decode(html_entity_decode(trim($script)), true);
            $product = $this->findProductSchema($decoded);

            if ($product !== []) {
                return $product;
            }
        }

        throw new RuntimeException('JSON-LD Product tidak ditemukan.');
    }

    /**
     * @return array<string, mixed>
     */
    private function findProductSchema(mixed $value): array
    {
        if (! is_array($value)) {
            return [];
        }

        $type = $value['@type'] ?? null;

        if ($type === 'Product' || (is_array($type) && in_array('Product', $type, true))) {
            return $value;
        }

        foreach ($value as $child) {
            $product = $this->findProductSchema($child);

            if ($product !== []) {
                return $product;
            }
        }

        return [];
    }

    /**
     * @return array<int, string>
     */
    private function images(mixed $images): array
    {
        return collect(is_array($images) ? $images : [$images])
            ->filter(fn (mixed $image): bool => is_string($image) && str_starts_with($image, 'http'))
            ->unique()
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function variants(string $html): array
    {
        if (! preg_match('/var\s+skulist_str\s*=\s*\'(.*?)\';/s', $html, $match)) {
            return [['code' => 'DEFAULT', 'name' => 'Default Title', 'size' => 'One Size', 'stock' => 24]];
        }

        $items = json_decode(stripslashes($match[1]), true);

        if (! is_array($items) || $items === []) {
            return [['code' => 'DEFAULT', 'name' => 'Default Title', 'size' => 'One Size', 'stock' => 24]];
        }

        return collect($items)
            ->take(20)
            ->map(fn (array $item): array => [
                'code' => (string) ($item['sku_code'] ?? Str::slug((string) ($item['sku_value_short'] ?? 'default'))),
                'name' => (string) ($item['sku_value'] ?? $item['sku_value_short'] ?? 'Default Title'),
                'size' => (string) ($item['sku_value_short'] ?? 'One Size'),
                'stock' => max(0, min(99, (int) ($item['stock_nums'] ?? 24))),
            ])
            ->values()
            ->all();
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
    private function syncVariants(Product $product, array $productData): void
    {
        $keptSkus = [];

        foreach ($productData['variants'] as $variant) {
            $sku = Str::limit($productData['sku'].'-'.Str::upper(Str::slug($variant['code'])), 100, '');
            $record = ProductVariant::query()->withTrashed()->updateOrCreate(
                ['sku' => $sku],
                [
                    'product_id' => $product->id,
                    'barcode' => null,
                    'variant_name' => $variant['name'],
                    'color_name' => null,
                    'color_hex' => null,
                    'size' => $variant['size'],
                    'package_type' => 'Sneakers',
                    'regular_price' => $productData['regular_price'],
                    'sale_price' => null,
                    'stock' => $productData['stock_status'] === 'out_of_stock' ? 0 : $variant['stock'],
                    'reserved_stock' => 0,
                    'desty_available_stock' => $productData['stock_status'] === 'out_of_stock' ? 0 : $variant['stock'],
                    'desty_on_hand_stock' => $productData['stock_status'] === 'out_of_stock' ? 0 : $variant['stock'],
                    'desty_reserved_stock' => 0,
                    'stock_source' => 'manual',
                    'allow_manual_stock_edit' => true,
                    'weight' => 1000,
                    'length' => 35,
                    'width' => 25,
                    'height' => 15,
                    'image_url' => $productData['images'][0],
                    'is_active' => true,
                ],
            );

            if ($record->trashed()) {
                $record->restore();
            }

            $keptSkus[] = $sku;
        }

        ProductVariant::query()
            ->where('product_id', $product->id)
            ->whereNotIn('sku', $keptSkus)
            ->delete();
    }

    /**
     * @param  array<string, mixed>  $productData
     */
    private function syncMarketplaceLink(Product $product, array $productData): void
    {
        ProductMarketplaceLink::query()->updateOrCreate(
            ['product_id' => $product->id, 'marketplace_name' => 'Flightkickz'],
            [
                'external_product_id' => $productData['source_id'],
                'external_sku' => $productData['sku'],
                'product_url' => $productData['source_url'],
                'price_snapshot' => $productData['regular_price'],
                'stock_snapshot' => collect($productData['variants'])->sum('stock'),
                'last_synced_at' => now(),
                'is_active' => true,
            ],
        );
    }

    private function category(): Category
    {
        $category = Category::query()->withTrashed()->updateOrCreate(
            ['slug' => 'sneakers'],
            [
                'name' => 'Sepatu Sneakers',
                'description' => 'Koleksi sepatu sneakers dari Flightkickz.',
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

    private function absoluteUrl(string $url): string
    {
        if (str_starts_with($url, 'http')) {
            return $url;
        }

        return self::BASE_URL.'/'.ltrim($url, '/');
    }

    private function productId(string $url): string
    {
        preg_match('/-p(\d+)\.html/i', $url, $match);

        return $match[1] ?? md5($url);
    }

    private function sku(string $value): string
    {
        return Str::limit('FKZ-'.Str::upper(Str::slug($value)), 100, '');
    }

    private function rupiah(string $usd): int
    {
        return (int) round(((float) str_replace(['US$', '$', ','], '', $usd)) * self::USD_TO_IDR);
    }
}
