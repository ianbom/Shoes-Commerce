<?php

namespace App\Services\Admin;

use App\Models\Category;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistInsightService
{
    use ResolvesAdminPagination;

    public function indexData(Request $request): array
    {
        $filters = [
            'search' => $request->string('search')->toString(),
            'category_id' => $request->string('category_id')->toString(),
        ];

        return [
            'products' => Product::query()
                ->with(['categories:id,name', 'primaryImage'])
                ->withCount('wishlists')
                ->when($filters['search'] !== '', fn ($query) => $query->where(fn ($query) => $query
                    ->where('name', 'like', "%{$filters['search']}%")
                    ->orWhere('sku', 'like', "%{$filters['search']}%")))
                ->when($filters['category_id'] !== '', fn ($query) => $query->whereHas('categories', fn ($query) => $query->whereKey($filters['category_id'])))
                ->whereHas('wishlists')
                ->orderByDesc('wishlists_count')
                ->paginate($this->perPage($request))
                ->withQueryString()
                ->through(fn (Product $product): array => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'category' => $product->categories->first()?->name,
                    'thumbnail' => $product->primaryImage?->image_url,
                    'status' => $product->status,
                    'wishlists_count' => $product->wishlists_count,
                ]),
            'filters' => $filters,
            'categories' => Category::query()->orderBy('name')->get(['id', 'name']),
            'recent' => Wishlist::query()
                ->with(['user:id,name,email', 'product:id,name'])
                ->latest()
                ->limit(10)
                ->get()
                ->map(fn (Wishlist $wishlist): array => [
                    'id' => $wishlist->id,
                    'customer' => $wishlist->user?->name,
                    'product' => $wishlist->product?->name,
                    'created_at' => $wishlist->created_at?->toFormattedDateString(),
                ]),
        ];
    }
}
