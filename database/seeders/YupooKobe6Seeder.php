<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

class YupooKobe6Seeder extends Seeder
{
    private const CNY_TO_IDR = 2650;

    private const SIZES = [
        '40', '40.5', '41', '42', '42.5', '43', '44', '44.5', '45', '45.5', '46', '47.5', '48.5',
    ];

    private const PRODUCTS = [
        ['album_id' => '244413554', 'name' => 'Kobe 6 White Coconut', 'supplier_sku' => null, 'color' => 'White Coconut'],
        ['album_id' => '244412767', 'name' => 'Kobe 6 Triple White', 'supplier_sku' => 'DO5079-021', 'color' => 'Triple White'],
        ['album_id' => '232353591', 'name' => 'Kobe 6 Statue of Liberty', 'supplier_sku' => 'IQ5774-300', 'color' => 'Statue of Liberty'],
        ['album_id' => '226736696', 'name' => 'Kobe 6 Red Blue Rivalry', 'supplier_sku' => 'IO3902-002', 'color' => 'Red Blue'],
        ['album_id' => '216310633', 'name' => 'Kobe 6 White Ice Blue', 'supplier_sku' => 'IO3672-400', 'color' => 'White Ice Blue'],
        ['album_id' => '206755204', 'name' => 'Kobe 6 White Blue', 'supplier_sku' => 'CW2190-400', 'color' => 'White Blue'],
        ['album_id' => '203314007', 'name' => 'Kobe 6 Violent Orange', 'supplier_sku' => 'IH1871-800', 'color' => 'Orange'],
        ['album_id' => '201906249', 'name' => 'Kobe 6 Reverse Green Hornet', 'supplier_sku' => 'FV4921-600', 'color' => 'Green'],
        ['album_id' => '201906209', 'name' => 'Kobe 6 Green Hornet', 'supplier_sku' => 'CW2190-300', 'color' => 'Green'],
        ['album_id' => '201906186', 'name' => 'Kobe 6 Blue White', 'supplier_sku' => 'DJ5437-020', 'color' => 'Blue White'],
        ['album_id' => '201906184', 'name' => 'Kobe 6 White Grey', 'supplier_sku' => 'DO5079-021', 'color' => 'White Grey'],
        ['album_id' => '201906178', 'name' => 'Kobe 6 Blue Orange Gradient', 'supplier_sku' => 'DJ5427-020', 'color' => 'Blue Orange'],
        ['album_id' => '201906166', 'name' => 'Kobe 6 Playoffs White Yellow', 'supplier_sku' => 'CW2190-100', 'color' => 'White Yellow'],
        ['album_id' => '201906150', 'name' => 'Kobe 6 Black White', 'supplier_sku' => 'CW2190-002', 'color' => 'Black White'],
        ['album_id' => '201906135', 'name' => 'Kobe 6 Camouflage', 'supplier_sku' => 'FQ3546-001', 'color' => 'Camouflage'],
        ['album_id' => '201906125', 'name' => 'Kobe 6 Dodgers White Blue', 'supplier_sku' => 'CW2190-400', 'color' => 'Dodgers White Blue'],
        ['album_id' => '187206822', 'name' => 'Kobe 6 Stars 2 White', 'supplier_sku' => 'FQ3546-100', 'color' => 'White'],
    ];

    private const SNAPSHOT_IMAGES = [
        '244413554' => ['https://photo.yupoo.com/tianjin-no1/961e5e6589/medium.jpg'],
        '244412767' => ['https://photo.yupoo.com/tianjin-no1/4a5076c42d/medium.jpg'],
        '232353591' => ['https://photo.yupoo.com/tianjin-no1/f1e328e6/medium.jpg'],
        '226736696' => ['https://photo.yupoo.com/tianjin-no1/e9dcd213/medium.jpg'],
        '216310633' => ['https://photo.yupoo.com/tianjin-no1/52a425dd/medium.jpg'],
        '206755204' => ['https://photo.yupoo.com/tianjin-no1/753c7be7/medium.jpeg'],
        '203314007' => ['https://photo.yupoo.com/tianjin-no1/03d63e27/b5416617.jpeg'],
        '201906249' => ['https://photo.yupoo.com/tianjin-no1/08aaa931/27e59e3c.jpg'],
        '201906209' => ['https://photo.yupoo.com/tianjin-no1/24a87960/166ff4b4.jpg'],
        '201906186' => ['https://photo.yupoo.com/tianjin-no1/01e884d7/f66d089c.jpg'],
        '201906184' => ['https://photo.yupoo.com/tianjin-no1/0c6e18ea/482954e1.jpg'],
        '201906178' => ['https://photo.yupoo.com/tianjin-no1/22c6be04/1a18e02d.jpg'],
        '201906166' => ['https://photo.yupoo.com/tianjin-no1/5387cb92/big.jpg'],
        '201906150' => ['https://photo.yupoo.com/tianjin-no1/5fae38bf/big.jpg'],
        '201906135' => ['https://photo.yupoo.com/tianjin-no1/0a5d00c5/big.jpg'],
        '201906125' => ['https://photo.yupoo.com/tianjin-no1/547a7073/big.jpg'],
        '187206822' => ['https://photo.yupoo.com/tianjin-no1/50cda5a6/big.jpg'],
    ];

    public function run(): void
    {
        $catalog = array_map(fn (array $product): array => $this->fetch($product), self::PRODUCTS);

        DB::transaction(function () use ($catalog): void {
            $category = $this->category();

            foreach ($catalog as $data) {
                $this->seedProduct($data, $category);
            }
        });
    }

    private function fetch(array $product): array
    {
        $images = self::SNAPSHOT_IMAGES[$product['album_id']] ?? [];

        if ($images === []) {
            throw new RuntimeException("Snapshot Yupoo album {$product['album_id']} tidak tersedia.");
        }

        return [
            ...$product,
            'source_url' => "https://tianjin-no1.x.yupoo.com/albums/{$product['album_id']}",
            'price_cny' => 450,
            'images' => $images,
        ];
    }

    private function seedProduct(array $data, Category $category): void
    {
        $sku = "YUPOO-K6-{$data['album_id']}";
        $price = $data['price_cny'] * self::CNY_TO_IDR;
        $description = "Imported from Yupoo STAR Kobe 6 album {$data['album_id']}. Supplier price: ¥{$data['price_cny']}; converted at Rp".number_format(self::CNY_TO_IDR, 0, ',', '.')." per CNY. Source: {$data['source_url']}";

        $product = Product::query()->withTrashed()->updateOrCreate(
            ['sku' => $sku],
            [
                'name' => $data['name'],
                'slug' => Str::slug("yupoo-kobe-6-{$data['album_id']}"),
                'brand_name' => 'Kobe',
                'price' => $price,
                'description' => $description,
                'status' => 'draft',
                'weight' => 0,
                'is_featured' => false,
                'is_new_arrival' => true,
                'is_best_seller' => false,
            ],
        );

        if ($product->trashed()) {
            $product->restore();
        }

        $product->categories()->syncWithoutDetaching([$category->id]);
        $this->syncImages($product, $data['images'], $data['name']);
        $this->syncVariants($product, $price, $data['images'][0]);
    }

    private function syncImages(Product $product, array $images, string $alt): void
    {
        ProductImage::query()->where('product_id', $product->id)->whereNotIn('image_url', $images)->delete();

        foreach ($images as $sortOrder => $image) {
            $record = ProductImage::query()->withTrashed()->updateOrCreate(
                ['product_id' => $product->id, 'image_url' => $image],
                ['alt_text' => $alt, 'sort_order' => $sortOrder + 1, 'is_primary' => $sortOrder === 0],
            );

            if ($record->trashed()) {
                $record->restore();
            }
        }
    }

    private function syncVariants(Product $product, int $price, string $image): void
    {
        foreach (self::SIZES as $size) {
            $variant = ProductVariant::query()->withTrashed()->updateOrCreate(
                ['product_id' => $product->id, 'size' => $size],
                [
                    'price' => $price,
                    'stock' => 0,
                    'reserved_stock' => 0,
                    'image_url' => $image,
                    'is_active' => false,
                ],
            );

            if ($variant->trashed()) {
                $variant->restore();
            }
        }
    }

    private function category(): Category
    {
        $category = Category::query()->withTrashed()->updateOrCreate(
            ['slug' => 'kobe-6'],
            ['name' => 'Kobe 6', 'description' => 'Koleksi Kobe 6 dari supplier Yupoo.', 'sort_order' => 50, 'is_active' => true],
        );

        if ($category->trashed()) {
            $category->restore();
        }

        return $category;
    }
}
