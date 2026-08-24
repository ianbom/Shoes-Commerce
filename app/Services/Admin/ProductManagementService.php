<?php

namespace App\Services\Admin;

use App\Http\Requests\Admin\ProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\Stock\StockLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ProductManagementService
{
    use ResolvesAdminPagination;

    public function __construct(
        private readonly ProductImageService $images,
        private readonly StockLogService $stockLogs,
    ) {}

    public function indexData(Request $request): array
    {
        $filters = [
            'search' => $request->string('search')->toString(),
            'category_id' => $request->string('category_id')->toString(),
            'status' => $request->string('status')->toString(),
            'stock_status' => $request->string('stock_status')->toString(),
            'is_featured' => $request->string('is_featured')->toString(),
            'is_new_arrival' => $request->string('is_new_arrival')->toString(),
            'is_best_seller' => $request->string('is_best_seller')->toString(),
            'sort' => $request->string('sort')->toString(),
            'direction' => $request->string('direction')->toString(),
        ];
        $sort = in_array($filters['sort'], ['product', 'price', 'created'], true) ? $filters['sort'] : 'created';
        $direction = $filters['direction'] === 'asc' ? 'asc' : 'desc';
        $filters['sort'] = $sort;
        $filters['direction'] = $direction;

        return [
            'products' => Product::query()
                ->with(['categories:id,name',  'primaryImage:id,product_id,image_url,alt_text'])
                ->withSum('variants as total_stock', 'stock')
                ->withSum('variants as total_reserved_stock', 'reserved_stock')
                ->withCount('variants')
                ->when($filters['search'] !== '', fn ($query) => $query->where(fn ($query) => $query
                    ->where('name', 'like', "%{$filters['search']}%")
                    ->orWhere('sku', 'like', "%{$filters['search']}%")))
                ->when($filters['category_id'] !== '', fn ($query) => $query->whereHas('categories', fn ($query) => $query->whereKey($filters['category_id'])))
                ->when($filters['status'] !== '', fn ($query) => $query->where('status', $filters['status']))
                ->when($filters['is_featured'] !== '', fn ($query) => $query->where('is_featured', $filters['is_featured'] === '1'))
                ->when($filters['is_new_arrival'] !== '', fn ($query) => $query->where('is_new_arrival', $filters['is_new_arrival'] === '1'))
                ->when($filters['is_best_seller'] !== '', fn ($query) => $query->where('is_best_seller', $filters['is_best_seller'] === '1'))
                ->when($filters['stock_status'] === 'in_stock', fn ($query) => $query->whereHas('variants', fn ($query) => $query->whereRaw('(stock - reserved_stock) > 5')))
                ->when($filters['stock_status'] === 'low_stock', fn ($query) => $query->whereHas('variants', fn ($query) => $query->whereRaw('(stock - reserved_stock) > 0')->whereRaw('(stock - reserved_stock) <= 5')))
                ->when($filters['stock_status'] === 'sold_out', fn ($query) => $query->whereDoesntHave('variants', fn ($query) => $query->whereRaw('(stock - reserved_stock) > 0')))
                ->when($sort === 'product', fn ($query) => $query->orderBy('name', $direction))
                ->when($sort === 'price', fn ($query) => $query->orderByRaw('price '.$direction))
                ->when($sort === 'created', fn ($query) => $query->orderBy('created_at', $direction))
                ->orderByDesc('id')
                ->paginate($this->perPage($request))
                ->withQueryString()
                ->through(fn (Product $product): array => $this->row($product)),
            'filters' => $filters,
            'options' => $this->options(),
            'stats' => [
                'total' => Product::query()->count(),
                'published' => Product::query()->where('status', 'published')->count(),
                'draft' => Product::query()->where('status', 'draft')->count(),
                'archived' => Product::query()->where('status', 'archived')->count(),
                'low_stock' => Product::query()->whereHas('variants', fn ($query) => $query->whereRaw('(stock - reserved_stock) > 0')->whereRaw('(stock - reserved_stock) <= 5'))->count(),
                'out_of_stock' => Product::query()->whereDoesntHave('variants', fn ($query) => $query->whereRaw('(stock - reserved_stock) > 0'))->count(),
            ],
        ];
    }

    public function create(ProductRequest $request): Product
    {
        $validated = $request->validated();
        $this->assertVariantCombinationsAreUnique($validated['variants'] ?? []);

        return DB::transaction(function () use ($request, $validated): Product {
            $product = Product::query()->create($this->payload($request, $validated));
            $product->categories()->sync($validated['category_ids'] ?? []);
            $this->images->sync($request, $product, $validated['images'] ?? []);
            $this->syncVariants($request, $product, $validated['variants'] ?? [], $request->user()->id);

            return $product;
        });
    }

    public function update(Product $product, ProductRequest $request): void
    {
        $validated = $request->validated();
        $this->assertVariantCombinationsAreUnique($validated['variants'] ?? [], $product);

        DB::transaction(function () use ($request, $product, $validated): void {
            $product->update($this->payload($request, $validated));
            $product->categories()->sync($validated['category_ids'] ?? []);
            $this->images->sync($request, $product, $validated['images'] ?? []);
            $this->syncVariants($request, $product, $validated['variants'] ?? [], $request->user()->id);
        });
    }

    public function bulkUpdateStatus(array $productIds, string $status): array
    {
        $results = ['updated' => 0, 'failed' => 0];

        Product::query()->whereIn('id', $productIds)->each(function (Product $product) use ($status, &$results): void {
            try {
                if ($status === 'published') {
                    $this->publish($product);
                } else {
                    $product->update(['status' => $status]);
                }
                $results['updated']++;
            } catch (ValidationException) {
                $results['failed']++;
            }
        });

        return $results;
    }

    public function bulkDelete(array $productIds): array
    {
        $results = ['deleted' => 0, 'archived' => 0];

        Product::query()->whereIn('id', $productIds)->each(function (Product $product) use (&$results): void {
            $result = $this->delete($product);
            $results[$result['archived'] ? 'archived' : 'deleted']++;
        });

        return $results;
    }

    public function publish(Product $product): void
    {
        $product->loadCount(['images as primary_images_count' => fn ($query) => $query->where('is_primary', true)]);
        $hasActiveVariant = $product->variants()->where('is_active', true)->whereRaw('(stock - reserved_stock) > 0')->exists();

        if ($product->primary_images_count < 1 || ! $hasActiveVariant || $product->weight < 1 || $product->price < 0) {
            throw ValidationException::withMessages([
                'product' => 'Produk published membutuhkan gambar utama, varian aktif dengan stok, berat, dan harga valid.',
            ]);
        }

        $product->update(['status' => 'published']);
    }

    public function archive(Product $product): void
    {
        $product->update(['status' => 'archived']);
    }

    public function duplicate(Product $product): Product
    {
        return DB::transaction(function () use ($product): Product {
            $product->load(['images', 'variants']);
            $copy = $product->replicate(['slug', 'sku', 'status']);
            $copy->name = $product->name.' Copy';
            $copy->slug = $this->uniqueSlug($product->slug.'-copy');
            $copy->sku = $product->sku ? $this->uniqueSku($product->sku.'-COPY') : null;
            $copy->status = 'draft';
            $copy->save();

            foreach ($product->images as $image) {
                $copy->images()->create($image->only(['image_url', 'alt_text', 'sort_order', 'is_primary']));
            }

            foreach ($product->variants as $variant) {
                $copy->variants()->save($variant->replicate());
            }

            return $copy;
        });
    }

    public function delete(Product $product): array
    {
        if ($product->orderItems()->exists()) {
            $product->update(['status' => 'archived']);

            return [
                'archived' => true,
                'message' => 'Product sudah pernah dipesan, jadi diarsipkan.',
            ];
        }

        $product->delete();

        return [
            'archived' => false,
            'message' => 'Product berhasil dihapus.',
        ];
    }

    public function showData(Product $product): array
    {
        $product->load([
            'categories:id,name',
            'images',
            'variants' => fn ($query) => $query->withCount('orderItems')->latest(),
            'variants.stockLogs' => fn ($query) => $query->latest()->limit(10),
            'orderItems' => fn ($query) => $query->latest()->limit(10),
        ]);

        return $this->detail($product);
    }

    public function formData(Product $product): array
    {
        $product->loadMissing(['categories', 'images', 'variants']);

        return [
            ...$product->only([
                'id', 'name', 'slug', 'sku', 'brand_name', 'price', 'description',
                'weight', 'length', 'width', 'height',
                'status', 'is_featured', 'is_new_arrival', 'is_best_seller',
            ]),
            'category_ids' => $product->categories->pluck('id')->values(),
            'images' => $product->images->map->only(['id', 'image_url', 'alt_text', 'color_name', 'sort_order', 'is_primary'])->values(),
            'variants' => $product->variants->map(fn (ProductVariant $variant): array => [
                ...$variant->only(['id', 'size', 'price', 'stock', 'reserved_stock', 'weight', 'length', 'width', 'height', 'image_url', 'is_active']),
                'available_stock' => max(0, $variant->stock - $variant->reserved_stock),
            ])->values(),
        ];
    }

    public function options(): array
    {
        return [
            'categories' => Category::query()->orderBy('name')->get(['id', 'name']),
            'statuses' => ['draft', 'published', 'archived'],
        ];
    }

    private function payload(Request $request, array $validated): array
    {
        return [
            ...collect($validated)->except(['images', 'variants', 'category_ids'])->all(),
            'brand_name' => $validated['brand_name'] ?? 'GodKillerGoods',
            'is_featured' => $request->boolean('is_featured'),
            'is_new_arrival' => $request->boolean('is_new_arrival'),
            'is_best_seller' => $request->boolean('is_best_seller'),
        ];
    }

    private function syncVariants(Request $request, Product $product, array $variants, int $userId): void
    {
        $variants = collect($variants)
            ->map(fn (array $variant, int $index): array => [...$variant, '_index' => $index])
            ->filter(fn (array $variant): bool => filled($variant['size'] ?? null))
            ->values();
        $keptIds = [];
        $folder = 'product/'.Str::slug($product->slug ?: $product->name).'/variants';

        foreach ($variants as $index => $variant) {
            if ((int) ($variant['reserved_stock'] ?? 0) > (int) ($variant['stock'] ?? 0)) {
                throw ValidationException::withMessages(["variants.{$variant['_index']}.reserved_stock" => 'Reserved stock tidak boleh lebih besar dari stock.']);
            }

            $uploadedImage = $request->file("variants.{$variant['_index']}.image");
            $productVariant = ! empty($variant['id'])
                ? $product->variants()->whereKey($variant['id'])->firstOrFail()
                : null;
            $payload = [
                'size' => $variant['size'] ?? null,
                'price' => $variant['price'] ?? $product->price,
                'stock' => $variant['stock'] ?? 0,
                'reserved_stock' => $variant['reserved_stock'] ?? 0,
                'weight' => $variant['weight'] ?? null,
                'length' => $variant['length'] ?? null,
                'width' => $variant['width'] ?? null,
                'height' => $variant['height'] ?? null,
                'image_url' => $uploadedImage
                    ? Storage::url($uploadedImage->storeAs($folder, $this->makeVariantFilename($product->slug, $index, $uploadedImage->getClientOriginalExtension()), 'public'))
                    : $productVariant?->image_url,
                'is_active' => (bool) ($variant['is_active'] ?? false),
            ];

            if ($productVariant) {
                $stockBefore = $productVariant->stock;

                if ($uploadedImage) {
                    $this->images->deleteStoredImage($productVariant->image_url);
                }

                $productVariant->update($payload);
                $this->stockLogs->logIfChanged($productVariant, $stockBefore, $payload['stock'], $userId, 'adjustment', 'Stock updated from product form.');
                $keptIds[] = (int) $variant['id'];

                continue;
            }

            $created = $product->variants()->create($payload);
            $this->stockLogs->logIfChanged($created, 0, $created->stock, $userId, 'adjustment', 'Initial variant stock.');
            $keptIds[] = $created->id;
        }

        $product->variants()->whereNotIn('id', $keptIds)->get()->each(function (ProductVariant $variant): void {
            if ($variant->orderItems()->exists()) {
                $variant->update(['is_active' => false]);

                return;
            }

            $this->images->deleteStoredImage($variant->image_url);
            $variant->delete();
        });
    }

    private function makeVariantFilename(string $sku, int $index, string $extension): string
    {
        $name = Str::slug($sku) ?: 'variant';

        return $name.'-'.($index + 1).'-'.Str::uuid().'.'.(strtolower($extension) ?: 'jpg');
    }

    /**
     * @param  array<int, array<string, mixed>>  $variants
     */
    private function assertVariantCombinationsAreUnique(array $variants, ?Product $product = null): void
    {
        $incoming = collect($variants)
            ->filter(fn (array $variant): bool => filled($variant['size'] ?? null))
            ->map(fn (array $variant): array => [
                'id' => $variant['id'] ?? null,
                'size' => trim((string) ($variant['size'] ?? '')),
            ])
            ->values();

        $keys = $incoming->pluck('size')->map(fn (string $size): string => mb_strtolower($size));

        if ($keys->duplicates()->isNotEmpty()) {
            throw ValidationException::withMessages(['variants' => 'Kombinasi color dan size varian tidak boleh duplikat.']);
        }

        if (! $product || $incoming->isEmpty()) {
            return;
        }

        $incomingIds = $incoming->pluck('id')->filter()->map(fn ($id): int => (int) $id);
        $existing = $product->variants()
            ->whereNotIn('id', $incomingIds)
            ->pluck('size');
        $existingKeys = $existing->map(fn (string $size): string => mb_strtolower($size));

        if ($keys->intersect($existingKeys)->isNotEmpty()) {
            throw ValidationException::withMessages(['variants' => 'Ukuran varian sudah digunakan produk ini.']);
        }
    }

    private function uniqueSlug(string $slug): string
    {
        $base = Str::slug($slug);
        $candidate = $base;
        $count = 2;

        while (Product::query()->where('slug', $candidate)->exists()) {
            $candidate = "{$base}-{$count}";
            $count++;
        }

        return $candidate;
    }

    private function uniqueSku(string $sku): string
    {
        $candidate = $sku;
        $count = 2;

        while (Product::query()->where('sku', $candidate)->exists()) {
            $candidate = "{$sku}-{$count}";
            $count++;
        }

        return $candidate;
    }

    private function row(Product $product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'sku' => $product->sku,
            'brand_name' => $product->brand_name,
            'category' => $product->categories->first()?->name,
            'thumbnail' => $product->primaryImage?->image_url,
            'price' => $product->price,
            'total_stock' => (int) ($product->total_stock ?? 0),
            'total_reserved_stock' => (int) ($product->total_reserved_stock ?? 0),
            'available_stock' => max(0, (int) ($product->total_stock ?? 0) - (int) ($product->total_reserved_stock ?? 0)),
            'variants_count' => $product->variants_count,
            'status' => $product->status,
            'is_featured' => $product->is_featured,
            'is_new_arrival' => $product->is_new_arrival,
            'is_best_seller' => $product->is_best_seller,
            'created_at' => $product->created_at?->toFormattedDateString(),
        ];
    }

    private function detail(Product $product): array
    {
        return [
            ...$this->formData($product),
            'category' => $product->categories->first()?->name,
            'orders' => $product->orderItems->map(fn ($item): array => [
                'id' => $item->id,
                'order_id' => $item->order_id,
                'quantity' => $item->quantity,
                'subtotal' => $item->subtotal,
                'created_at' => $item->created_at?->toFormattedDateString(),
            ])->values(),
            'stock_logs' => $product->variants
                ->flatMap(fn (ProductVariant $variant) => $variant->stockLogs->map(fn ($log): array => [
                    'id' => $log->id,
                    'variant' => $variant->sku,
                    'type' => $log->type,
                    'quantity' => $log->quantity,
                    'stock_before' => $log->stock_before,
                    'stock_after' => $log->stock_after,
                    'created_at' => $log->created_at?->toFormattedDateString(),
                ]))
                ->sortByDesc('created_at')
                ->take(10)
                ->values(),
        ];
    }
}
