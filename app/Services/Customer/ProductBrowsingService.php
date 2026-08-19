<?php

namespace App\Services\Customer;

use App\Models\Banner;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Page;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class ProductBrowsingService
{
    public function homeData(): array
    {
        $banners = $this->activeBanners('homepage')->get();
        $ctaBanner = $this->activeBanners('cta')->first();

        return [
            'canRegister' => Features::enabled(Features::registration()),
            'heroBanners' => $banners->map(fn ($banner) => $this->bannerCard($banner))->toArray(),
            'promoBanner' => $this->bannerCard($banners->skip(1)->first()),
            'ctaBanner' => $this->bannerCard($ctaBanner),
            'categories' => Category::query()->where('is_active', true)->orderBy('sort_order')->get(['name', 'slug', 'image_url']),
            'flashDeals' => $this->productsForSection('sale', 5),
            'newArrivals' => $this->productsForSection('new_arrival', 6),
            'mostLoved' => $this->productsForSection('best_seller', 4),
            'journalPosts' => $this->journalPosts(),
        ];
    }

    public function productListData(Request $request): array
    {
        $filters = $this->validatedFilters($request);

        $products = Product::query()
            ->with($this->productRelations())
            ->where('status', 'published')
            ->when($request->user(), fn ($query, $user) => $query->withExists([
                'wishlists as is_wishlisted' => fn ($query) => $query->where('user_id', $user->id),
            ]))
            ->when($filters['search'] !== '', function ($query) use ($filters) {
                $query->where(function ($query) use ($filters) {
                    $query
                        ->where('name', 'like', "%{$filters['search']}%")
                        ->orWhere('sku', 'like', "%{$filters['search']}%")
                        ->orWhere('description', 'like', "%{$filters['search']}%");
                });
            })
            ->when($filters['category'] !== '', fn ($query) => $query->whereHas('categories', fn ($query) => $query->where('slug', $filters['category'])))
            ->when($filters['brand'] !== '', fn ($query) => $query->where('brand_name', $filters['brand']))
            ->when($filters['type'] === 'featured', fn ($query) => $query->where('is_featured', true))
            ->when($filters['type'] === 'new_arrival', fn ($query) => $query->where('is_new_arrival', true))
            ->when($filters['type'] === 'best_seller', fn ($query) => $query->where('is_best_seller', true))
            ->when($filters['availability'] === 'in_stock', fn ($query) => $query->whereHas('variants', fn ($query) => $query->where('is_active', true)->whereColumn('stock', '>', 'reserved_stock')))
            ->when($filters['availability'] === 'out_of_stock', fn ($query) => $query->whereDoesntHave('variants', fn ($query) => $query->where('is_active', true)->whereColumn('stock', '>', 'reserved_stock')))
            ->when($filters['price'] === 'under_410', fn ($query) => $query->whereRaw('price < ?', [410000]))
            ->when($filters['price'] === '410_830', fn ($query) => $query->whereRaw('price between ? and ?', [410000, 830000]))
            ->when($filters['price'] === '830_1200', fn ($query) => $query->whereRaw('price between ? and ?', [830000, 1200000]))
            ->when($filters['price'] === 'above_1200', fn ($query) => $query->whereRaw('price > ?', [1200000]))
            ->when($filters['size'] !== '', fn ($query) => $query->whereHas('variants', fn ($query) => $query->where('is_active', true)->where('size', $filters['size'])));

        $this->applySort($products, $filters['sort'], $filters['order']);

        return [
            'products' => Inertia::scroll($products
                ->paginate($filters['per_page'])
                ->withQueryString()
                ->through(fn (Product $product) => $this->productCard($product))),
            'filters' => $filters,
            'options' => $this->filterOptions(),
            'collectionBanner' => $this->collectionBanner(),
        ];
    }

    public function productDetailData(Request $request): array
    {
        $slug = (string) $request->query('product', '');

        $product = Product::query()
            ->with($this->productRelations())
            ->where('status', 'published')
            ->when($request->user(), fn ($query, $user) => $query->withExists([
                'wishlists as is_wishlisted' => fn ($query) => $query->where('user_id', $user->id),
            ]))
            ->when(
                $slug !== '',
                fn ($query) => $query->where('slug', $slug),
                fn ($query) => $query->orderByDesc('is_featured')->orderByDesc('created_at')
            )
            ->firstOrFail();

        return [
            'product' => $this->productDetail($product, $request->user()),
            'relatedProducts' => $this->relatedProducts($product, 8),
            'recentProducts' => $this->recentProducts($product, 4),
        ];
    }

    private function productsForSection(string $section, int $limit)
    {
        $query = Product::query()
            ->with($this->productRelations())
            ->where('status', 'published')
            ->limit($limit);

        match ($section) {
            'sale' => $query->where('is_featured', true)->latest(),
            'hajj' => $query
                ->where(fn ($query) => $query
                    ->whereHas('categories', fn ($query) => $query->where('slug', 'like', '%hajj%')->orWhere('name', 'like', '%hajj%'))
                    ->orWhere('is_featured', true))
                ->orderByDesc('is_new_arrival')
                ->latest(),
            'new_arrival' => $query->where('is_new_arrival', true)->latest(),
            'new' => $query->where('is_new_arrival', true)->latest(),
            'best_seller' => $query->where('is_best_seller', true)->latest(),
            'loved' => $query->where(fn ($query) => $query->where('is_best_seller', true)->orWhere('is_featured', true))->orderByDesc('is_best_seller')->latest(),
            default => $query->latest(),
        };

        $products = $query->get();

        if ($products->count() < $limit && ! in_array($section, ['sale', 'new_arrival', 'best_seller'], true)) {
            $fallback = Product::query()
                ->with($this->productRelations())
                ->where('status', 'published')
                ->whereNotIn('id', $products->pluck('id'))
                ->latest()
                ->limit($limit - $products->count())
                ->get();

            $products = $products->concat($fallback);
        }

        return $products->map(fn (Product $product) => $this->productCard($product, 'name'))->values();
    }

    private function relatedProducts(Product $product, int $limit)
    {
        return Product::query()
            ->with($this->productRelations())
            ->where('status', 'published')
            ->where('id', '!=', $product->id)
            ->when($product->categories->isNotEmpty(), fn ($query) => $query->whereHas('categories', fn ($query) => $query->whereKey($product->categories->modelKeys())))
            ->latest()
            ->limit($limit)
            ->get()
            ->map(fn (Product $product) => $this->productCard($product));
    }

    private function recentProducts(Product $product, int $limit)
    {
        return Product::query()
            ->with($this->productRelations())
            ->where('status', 'published')
            ->where('id', '!=', $product->id)
            ->latest()
            ->limit($limit)
            ->get()
            ->map(fn (Product $product) => $this->productCard($product));
    }

    private function productRelations(): array
    {
        return [
            'categories:id,name,slug',
            'primaryImage:id,product_id,image_url,alt_text',
            'images:id,product_id,image_url,alt_text,sort_order',
            'variants' => fn ($query) => $query
                ->select('id', 'product_id', 'size', 'price', 'stock', 'reserved_stock', 'image_url', 'is_active')
                ->where('is_active', true)
                ->orderByRaw('(stock - reserved_stock) > 0 desc')
                ->orderBy('size'),
        ];
    }

    private function productCard(Product $product, string $nameKey = 'title'): array
    {
        $variants = $product->variants;
        $basePrice = (float) $product->price;
        $image = $product->primaryImage?->image_url
            ?? $product->images->first()?->image_url
            ?? $variants->firstWhere('image_url', '!=', null)?->image_url;
        $hoverImage = $product->images
            ->first(fn ($productImage) => $productImage->image_url !== $image)?->image_url
            ?? $variants->first(fn ($variant) => filled($variant->image_url) && $variant->image_url !== $image)?->image_url;

        return [
            'id' => $product->id,
            'slug' => $product->slug,
            $nameKey => $product->name,
            'sku' => $product->sku,
            'price' => $basePrice,
            'image' => $image,
            'hover_image' => $hoverImage,
            'badge' => $this->badge($product),
            'label' => $this->label($product),
            'category' => $product->categories->first()?->name,
            'category_slug' => $product->categories->first()?->slug,
            'sizes' => $variants->pluck('size')->filter()->unique()->values(),
            'available_stock' => $variants->sum(
                fn ($variant) => max(0, (int) $variant->stock - (int) $variant->reserved_stock),
            ),
            'is_wishlisted' => (bool) ($product->is_wishlisted ?? false),
        ];
    }

    private function productDetail(Product $product, ?User $user = null): array
    {
        $variants = $product->variants;
        $cartQuantities = $this->cartQuantities($product, $user);
        $images = $product->images
            ->map(fn ($image) => [
                'url' => $image->image_url,
                'alt' => $image->alt_text ?? $product->name,
            ])
            ->merge($variants
                ->filter(fn ($variant) => filled($variant->image_url))
                ->unique('image_url')
                ->map(fn ($variant) => [
                    'url' => $variant->image_url,
                    'alt' => trim("{$product->name} {$variant->size}"),
                ]))
            ->unique('url')
            ->values();

        return [
            ...$this->productCard($product),
            'description' => $product->description,
            'weight' => $product->weight,
            'dimensions' => [
                'length' => $product->length,
                'width' => $product->width,
                'height' => $product->height,
            ],
            'images' => $images,
            'variants' => $variants
                ->map(fn ($variant) => [
                    'id' => $variant->id,
                    'size' => $variant->size,
                    'price' => (float) $variant->price,
                    'stock' => (int) $variant->stock,
                    'reserved_stock' => (int) $variant->reserved_stock,
                    'available_stock' => max(0, (int) $variant->stock - (int) $variant->reserved_stock),
                    'cart_quantity' => (int) ($cartQuantities[$variant->id] ?? 0),
                    'image_url' => $variant->image_url,
                ])
                ->values(),
        ];
    }

    private function cartQuantities(Product $product, ?User $user): array
    {
        if (! $user) {
            return [];
        }

        return CartItem::query()
            ->where('product_id', $product->id)
            ->whereHas('cart', fn ($query) => $query->where('user_id', $user->id))
            ->pluck('quantity', 'product_variant_id')
            ->all();
    }

    private function validatedFilters(Request $request): array
    {
        return [
            'search' => trim((string) $request->query('search', '')),
            'category' => (string) $request->query('category', ''),
            'brand' => trim((string) $request->query('brand', '')),
            'type' => $this->option($request, 'type', ['all', 'featured', 'new_arrival', 'best_seller', 'discount'], 'all'),
            'availability' => $this->option($request, 'availability', ['all', 'in_stock', 'out_of_stock'], 'all'),
            'price' => $this->option($request, 'price', ['all', 'under_410', '410_830', '830_1200', 'above_1200'], 'all'),
            'size' => (string) $request->query('size', ''),
            'sort' => $this->option($request, 'sort', ['featured', 'latest', 'name', 'price', 'best_seller'], 'featured'),
            'order' => $this->option($request, 'order', ['asc', 'desc'], 'desc'),
            'per_page' => min(max((int) $request->query('per_page', 12), 8), 32),
        ];
    }

    private function option(Request $request, string $key, array $allowed, string $default): string
    {
        $value = (string) $request->query($key, $default);

        return in_array($value, $allowed, true) ? $value : $default;
    }

    private function applySort($query, string $sort, string $order): void
    {
        match ($sort) {
            'latest' => $query->orderBy('created_at', $order),
            'name' => $query->orderBy('name', $order),
            'price' => $query->orderByRaw("price {$order}"),
            'best_seller' => $query->orderByDesc('is_best_seller')->orderByDesc('created_at'),
            default => $query->orderByDesc('is_featured')->orderByDesc('is_new_arrival')->orderByDesc('created_at'),
        };
    }

    private function filterOptions(): array
    {
        return [
            'categories' => Category::query()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'slug'])->values()->all(),
            'brands' => Product::query()
                ->where('status', 'published')
                ->whereNotNull('brand_name')
                ->where('brand_name', '!=', '')
                ->orderBy('brand_name')
                ->distinct()
                ->pluck('brand_name')
                ->map(fn (string $brand) => ['value' => $brand, 'label' => $brand])
                ->values(),
            'sizes' => $this->sizeOptions(),
            'priceRanges' => [
                ['value' => 'under_410', 'label' => 'Under Rp 410.000'],
                ['value' => '410_830', 'label' => 'Rp 410.000 - Rp 830.000'],
                ['value' => '830_1200', 'label' => 'Rp 830.000 - Rp 1.200.000'],
                ['value' => 'above_1200', 'label' => 'Rp 1.200.000 +'],
            ],
            'sorts' => [
                ['value' => 'featured', 'label' => 'Featured'],
                ['value' => 'latest', 'label' => 'Newest'],
                ['value' => 'name', 'label' => 'Name'],
                ['value' => 'price', 'label' => 'Price'],
                ['value' => 'best_seller', 'label' => 'Best Seller'],
            ],
        ];
    }

    private function collectionBanner(): array
    {
        $default = [
            'title' => 'All Products',
            'banner_desktop_url' => '/img/all-product.webp',
            'banner_mobile_url' => '/img/all-product.webp',
            'is_default' => true,
        ];

        return $default;
    }

    private function sizeOptions()
    {
        return Product::query()
            ->join('product_variants', 'products.id', '=', 'product_variants.product_id')
            ->where('products.status', 'published')
            ->where('product_variants.is_active', true)
            ->whereNotNull('product_variants.size')
            ->orderBy('product_variants.size')
            ->pluck('product_variants.size')
            ->unique()
            ->values();
    }

    private function journalPosts()
    {
        return Page::query()
            ->where('is_active', true)
            ->latest()
            ->limit(4)
            ->get(['id', 'title', 'slug', 'type', 'created_at'])
            ->map(fn (Page $page) => [
                'id' => $page->id,
                'title' => $page->title,
                'slug' => $page->slug,
                'type' => $page->type,
                'date' => $page->created_at?->format('M d, Y'),
            ]);
    }

    private function activeBanners(string $placement)
    {
        return Banner::query()
            ->where('is_active', true)
            ->where('placement', $placement)
            ->orderBy('sort_order')
            ->orderByDesc('created_at');
    }

    private function bannerCard(?Banner $banner): ?array
    {
        if (! $banner) {
            return null;
        }

        return [
            'id' => $banner->id,
            'title' => $banner->title,
            'subtitle' => $banner->subtitle,
            'image_desktop_url' => $banner->image_desktop_url,
            'image_mobile_url' => $banner->image_mobile_url,
            'button_text' => $banner->button_text,
            'button_url' => $banner->button_url,
        ];
    }

    private function badge(Product $product): ?string
    {
        if ($product->is_new_arrival) {
            return 'NEW';
        }

        if ($product->is_best_seller) {
            return 'BEST SELLER';
        }

        return $product->is_featured ? 'FEATURED' : null;
    }

    private function label(Product $product): ?string
    {
        return $this->badge($product);
    }
}
