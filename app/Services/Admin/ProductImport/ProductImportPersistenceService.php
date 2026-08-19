<?php

namespace App\Services\Admin\ProductImport;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImportBatch;
use App\Models\ProductImportItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ProductImportPersistenceService
{
    public function save(ProductImportItem $item): Product
    {
        return DB::transaction(function () use ($item): Product {
            $item = ProductImportItem::query()->whereKey($item->id)->lockForUpdate()->firstOrFail();
            $payload = $item->product_payload;
            if ($item->selected_kicksdb_id && ! $payload) {
                throw ValidationException::withMessages(['item' => 'Detail kandidat belum tersedia.']);
            }
            if (! in_array($item->status, ['ready', 'matched'], true) || blank($payload['sku'] ?? null) || empty($payload['variants'])) {
                throw ValidationException::withMessages(['item' => 'Produk belum siap disimpan.']);
            }
            if (Product::query()->where('sku', $payload['sku'])->exists()) {
                $item->update(['status' => 'duplicate']);
                throw ValidationException::withMessages(['item' => 'SKU produk sudah tersedia.']);
            }
            $item->update(['status' => 'saving']);
            $slug = Str::slug($payload['title']);
            $base = $slug;
            for ($suffix = 2; Product::query()->where('slug', $slug)->exists(); $suffix++) {
                $slug = $base.'-'.$suffix;
            }
            $product = Product::query()->create(['name' => $payload['title'], 'slug' => $slug, 'sku' => $payload['sku'], 'brand_name' => $payload['brand'] ?: 'Unknown', 'price' => $item->price_idr, 'description' => $payload['description'], 'status' => 'draft', 'is_featured' => false, 'is_new_arrival' => false, 'is_best_seller' => false]);
            if (filled($payload['category'] ?? null)) {
                $category = Category::query()->firstOrCreate(['slug' => Str::slug($payload['category'])], ['name' => $payload['category'], 'is_active' => true]);
                $product->categories()->syncWithoutDetaching($category);
            }
            foreach (array_values(array_unique(array_filter($payload['gallery'] ?? []))) as $order => $url) {
                $product->images()->create(['image_url' => $url, 'alt_text' => $product->name, 'sort_order' => $order, 'is_primary' => $order === 0]);
            }
            foreach (array_unique($payload['variants']) as $size) {
                $product->variants()->create(['size' => $size, 'price' => $item->price_idr, 'stock' => 10, 'reserved_stock' => 0, 'is_active' => true]);
            }
            $item->update(['status' => 'saved', 'saved_product_id' => $product->id]);

            return $product;
        });
    }

    public function saveAll(ProductImportBatch $batch): void
    {
        $batch->items()->whereIn('status', ['ready', 'matched'])->each(function (ProductImportItem $item): void {
            try {
                $this->save($item);
            } catch (\Throwable $exception) {
                $item->update(['status' => 'failed', 'error_message' => $exception->getMessage()]);
            }
        });
    }
}
