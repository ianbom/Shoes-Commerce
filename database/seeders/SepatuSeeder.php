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

    private const CATEGORIES = [
        'mens-shoes',
        'womens-shoes',
    ];

    // ponytail: snapshot keeps fresh seeds deterministic; refresh it when the source catalog changes materially.
    private const LOCAL_SNAPSHOT = [
        'mens-shoes' => [
            [
                'id' => 90001,
                'title' => 'Court Alpha Sneaker',
                'description' => 'Everyday court sneaker with cushioned comfort.',
                'price' => 90,
                'stock' => 12,
                'brand' => 'GodKillerGoods',
                'sku' => 'SNAPSHOT-MEN-001',
                'weight' => 0.9,
                'dimensions' => ['width' => 24, 'height' => 14, 'depth' => 35],
                'images' => ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80'],
            ],
        ],
        'womens-shoes' => [
            [
                'id' => 90002,
                'title' => 'Run Nova Sneaker',
                'description' => 'Lightweight sneaker for daily movement.',
                'price' => 85,
                'stock' => 10,
                'brand' => 'GodKillerGoods',
                'sku' => 'SNAPSHOT-WOMEN-001',
                'weight' => 0.8,
                'dimensions' => ['width' => 23, 'height' => 13, 'depth' => 34],
                'images' => ['https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=1200&q=80'],
            ],
        ],
    ];

    private const USD_TO_IDR = 16000;

    /**
     * Daftar ukuran sepatu yang tersedia.
     *
     * Ukuran US dan EU akan disimpan dalam satu kolom size.
     */
    private const SHOE_SIZES = [
        ['us' => 4, 'eu' => 36],
        ['us' => 5, 'eu' => 37],
        ['us' => 6, 'eu' => 38],
        ['us' => 7, 'eu' => 39],
        ['us' => 8, 'eu' => 40],
        ['us' => 9, 'eu' => 41],
        ['us' => 10, 'eu' => 42],
        ['us' => 11, 'eu' => 43],
        ['us' => 12, 'eu' => 44],
    ];

    private bool $usedLocalSnapshot = false;

    public function run(): void
    {
        $products = collect($this->catalog())
            ->map(
                fn (array $product, int $index): ?array => $this->mapProduct($product, $index)
            )
            ->filter()
            ->values();

        if ($products->isEmpty()) {
            throw new RuntimeException(
                'DummyJSON tidak menghasilkan produk sepatu yang valid.'
            );
        }

        DB::transaction(function () use ($products): void {
            $category = $this->category();
            $seededSkus = [];

            foreach ($products as $product) {
                $record = Product::query()
                    ->withTrashed()
                    ->updateOrCreate(
                        [
                            'slug' => $product['slug'],
                        ],
                        [
                            'name' => $product['name'],
                            'sku' => $product['sku'],
                            'brand_name' => $product['brand_name'],
                            'price' => $product['price'],
                            'description' => $product['description'],
                            'status' => 'published',
                            'weight' => $product['weight'],
                            'length' => $product['length'],
                            'width' => $product['width'],
                            'height' => $product['height'],
                            'is_featured' => $product['index'] % 5 === 0,
                            'is_new_arrival' => $product['index'] < 10,
                            'is_best_seller' => $product['index'] % 3 === 0,
                        ],
                    );

                if ($record->trashed()) {
                    $record->restore();
                }

                $record->categories()->sync([$category->id]);

                $this->syncImages(
                    $record,
                    $product['images']
                );

                $this->syncVariants(
                    $record,
                    $product
                );

                $seededSkus[] = $product['sku'];
            }

            /*
             * Menghapus produk sepatu dari hasil seeder lama yang sudah
             * tidak ditemukan lagi pada response DummyJSON terbaru.
             */
            if (! $this->usedLocalSnapshot) {
                Product::query()
                    ->where('sku', 'like', 'SHOE-%')
                    ->whereNotIn('sku', $seededSkus)
                    ->delete();
            }
        });
    }

    /**
     * Mengambil katalog sepatu pria dan wanita dari DummyJSON.
     *
     * @return array<int, array<string, mixed>>
     */
    private function catalog(): array
    {
        $this->usedLocalSnapshot = false;
        $products = [];

        foreach (self::CATEGORIES as $category) {
            $response = Http::acceptJson()
                ->retry([100, 300], throw: false)
                ->timeout(20)
                ->connectTimeout(5)
                ->get(
                    self::BASE_URL."/products/category/{$category}",
                    [
                        'limit' => 0,
                    ]
                );

            $categoryProducts = $response->successful()
                ? $response->json('products')
                : null;

            if (! is_array($categoryProducts)) {
                $this->usedLocalSnapshot = true;
                $categoryProducts = self::LOCAL_SNAPSHOT[$category];
            }

            $products = [
                ...$products,
                ...$categoryProducts,
            ];
        }

        return $products;
    }

    /**
     * Mengubah data produk dari DummyJSON menjadi format aplikasi.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>|null
     */
    private function mapProduct(array $data, int $index): ?array
    {
        $name = trim((string) ($data['title'] ?? ''));
        $sourceId = (string) ($data['id'] ?? '');
        $regularPrice = $this->rupiah($data['price'] ?? 0);

        $images = collect($data['images'] ?? [])
            ->filter(
                fn (mixed $image): bool => is_string($image)
                    && filter_var(
                        $image,
                        FILTER_VALIDATE_URL
                    ) !== false
            )
            ->unique()
            ->values()
            ->all();

        if (
            $name === ''
            || $sourceId === ''
            || $regularPrice <= 0
            || $images === []
        ) {
            return null;
        }

        $discountPercentage = max(
            0,
            min(
                100,
                (float) ($data['discountPercentage'] ?? 0)
            )
        );

        $salePrice = $discountPercentage > 0
            ? (int) round(
                $regularPrice * (1 - ($discountPercentage / 100))
            )
            : null;

        $stock = max(
            0,
            (int) ($data['stock'] ?? 0)
        );

        $brand = trim(
            (string) ($data['brand'] ?? '')
        ) ?: 'Generic';

        return [
            'index' => $index,
            'name' => $name,
            'slug' => Str::slug($name).'-'.$sourceId,
            'sku' => $this->sku(
                (string) ($data['sku'] ?? $sourceId)
            ),
            'brand_name' => $brand,
            'description' => trim(
                (string) ($data['description'] ?? '')
            ) ?: $name,
            'price' => $salePrice ?? $regularPrice,
            'stock' => $stock,
            'weight' => max(
                1,
                (int) round(
                    ((float) ($data['weight'] ?? 1)) * 1000
                )
            ),
            'length' => max(
                1,
                (int) round(
                    (float) data_get(
                        $data,
                        'dimensions.depth',
                        35
                    )
                )
            ),
            'width' => max(
                1,
                (int) round(
                    (float) data_get(
                        $data,
                        'dimensions.width',
                        25
                    )
                )
            ),
            'height' => max(
                1,
                (int) round(
                    (float) data_get(
                        $data,
                        'dimensions.height',
                        15
                    )
                )
            ),
            'images' => $images,
        ];
    }

    /**
     * Menyimpan dan memperbarui gambar produk.
     *
     * @param  array<int, string>  $images
     */
    private function syncImages(
        Product $product,
        array $images
    ): void {
        $keptIds = [];

        foreach ($images as $sortOrder => $imageUrl) {
            $record = ProductImage::query()
                ->withTrashed()
                ->updateOrCreate(
                    [
                        'product_id' => $product->id,
                        'sort_order' => $sortOrder,
                    ],
                    [
                        'image_url' => $imageUrl,
                        'alt_text' => $product->name
                            .' image '
                            .($sortOrder + 1),
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
     * Membuat beberapa varian ukuran untuk satu produk.
     *
     * Contoh:
     * - US=4 EU=36
     * - US=5 EU=37
     * - US=6 EU=38
     *
     * @param  array<string, mixed>  $productData
     */
    private function syncVariants(
        Product $product,
        array $productData
    ): void {
        $sizes = $this->sizesForProduct(
            (int) $productData['index']
        );

        $variantCount = count($sizes);
        $totalStock = max(
            0,
            (int) $productData['stock']
        );

        /*
         * Membagi stok produk ke seluruh varian ukuran.
         *
         * Contoh:
         * Total stok: 20
         * Jumlah varian: 6
         *
         * Hasil pembagian:
         * 4, 4, 3, 3, 3, 3
         */
        $baseStock = intdiv(
            $totalStock,
            $variantCount
        );

        $stockRemainder = $totalStock % $variantCount;

        $keptVariantIds = [];

        foreach ($sizes as $index => $size) {
            $sizeLabel = sprintf(
                'US=%s EU=%s',
                $size['us'],
                $size['eu']
            );

            $variantStock = $baseStock
                + ($index < $stockRemainder ? 1 : 0);

            $record = ProductVariant::query()
                ->withTrashed()
                ->updateOrCreate(
                    [
                        'product_id' => $product->id,
                        'size' => $sizeLabel,
                    ],
                    [
                        'size' => $sizeLabel,
                        'price' => $productData['price'],
                        'stock' => $variantStock,
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

            $keptVariantIds[] = $record->id;
        }

        /*
         * Menghapus varian lama yang tidak termasuk dalam
         * daftar ukuran terbaru.
         */
        ProductVariant::query()
            ->where('product_id', $product->id)
            ->whereNotIn('id', $keptVariantIds)
            ->delete();
    }

    /**
     * Menghasilkan variasi ukuran berbeda untuk setiap produk.
     *
     * Setiap produk akan mempunyai 4 sampai 7 ukuran.
     *
     * @return array<int, array{us: int, eu: int}>
     */
    private function sizesForProduct(int $productIndex): array
    {
        $availableSizes = self::SHOE_SIZES;

        /*
         * Pola jumlah varian:
         *
         * Produk index 0: 4 ukuran
         * Produk index 1: 5 ukuran
         * Produk index 2: 6 ukuran
         * Produk index 3: 7 ukuran
         * Produk index 4: kembali 4 ukuran
         */
        $variantCount = 4 + ($productIndex % 4);

        $maximumStartIndex = count($availableSizes)
            - $variantCount;

        $startIndex = $maximumStartIndex > 0
            ? $productIndex % ($maximumStartIndex + 1)
            : 0;

        return array_slice(
            $availableSizes,
            $startIndex,
            $variantCount
        );
    }

    /**
     * Membuat atau memperbarui kategori sepatu.
     */
    private function category(): Category
    {
        $category = Category::query()
            ->withTrashed()
            ->updateOrCreate(
                [
                    'slug' => 'sneakers',
                ],
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
     * Membuat SKU utama produk.
     */
    private function sku(string $value): string
    {
        return Str::limit(
            'SHOE-'.Str::upper(
                Str::slug($value)
            ),
            100,
            ''
        );
    }

    /**
     * Mengonversi harga USD menjadi Rupiah.
     */
    private function rupiah(mixed $usd): int
    {
        return (int) round(
            ((float) $usd) * self::USD_TO_IDR
        );
    }
}
