<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin' && (bool) $this->user()?->is_active;
    }

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        $product = $this->route('product');
        $productId = $product?->id;
        $imageIdRule = Rule::exists('product_images', 'id');
        $variantIdRule = Rule::exists('product_variants', 'id');

        if ($productId) {
            $imageIdRule->where('product_id', $productId);
            $variantIdRule->where('product_id', $productId);
        }

        return [
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'collection_id' => ['nullable', 'integer', 'exists:collections,id'],
            'name' => ['required', 'string', 'max:200'],
            'slug' => ['required', 'string', 'max:220', Rule::unique('products', 'slug')->ignore($product)],
            'sku' => ['nullable', 'string', 'max:100', Rule::unique('products', 'sku')->ignore($product)],
            'brand_name' => ['nullable', 'string', 'max:150'],
            'regular_price' => ['required', 'numeric', 'min:0'],
            'sale_price' => ['nullable', 'numeric', 'min:0', 'lte:regular_price'],
            'short_description' => ['nullable', 'string', 'max:1000'],
            'description' => ['nullable', 'string'],
            'stock_status' => ['nullable', 'string', 'max:50'],
            'weight' => ['required', 'integer', 'min:0'],
            'length' => ['nullable', 'integer', 'min:0'],
            'width' => ['nullable', 'integer', 'min:0'],
            'height' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
            'is_featured' => ['sometimes', 'boolean'],
            'is_new_arrival' => ['sometimes', 'boolean'],
            'is_best_seller' => ['sometimes', 'boolean'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'images' => ['nullable', 'array'],
            'images.*.id' => ['nullable', 'integer', $imageIdRule],
            'images.*.image' => ['nullable', 'file', 'image', 'max:4096'],
            'images.*.sort_order' => ['nullable', 'integer', 'min:0'],
            'images.*.is_primary' => ['sometimes', 'boolean'],
            'variants' => ['nullable', 'array'],
            'variants.*.id' => ['nullable', 'integer', $variantIdRule],
            'variants.*.sku' => ['nullable', 'string', 'max:100'],
            'variants.*.color_name' => ['nullable', 'string', 'max:100'],
            'variants.*.color_hex' => ['nullable'],
            'variants.*.size' => ['nullable', 'string', 'max:100'],
            'variants.*.regular_price' => ['nullable', 'numeric', 'min:0'],
            'variants.*.sale_price' => ['nullable', 'numeric', 'min:0'],
            'variants.*.stock' => ['nullable', 'integer', 'min:0'],
            'variants.*.reserved_stock' => ['nullable', 'integer', 'min:0'],
            'variants.*.weight' => ['nullable', 'integer', 'min:0'],
            'variants.*.length' => ['nullable', 'integer', 'min:0'],
            'variants.*.width' => ['nullable', 'integer', 'min:0'],
            'variants.*.height' => ['nullable', 'integer', 'min:0'],
            'variants.*.image' => ['nullable', 'file', 'image', 'max:4096'],
            'variants.*.is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [
            function ($validator): void {
                $variants = collect($this->input('variants', []))
                    ->filter(fn (array $variant): bool => filled($variant['sku'] ?? null));

                $variants->each(function (array $variant, int $index) use ($validator): void {
                    if (filled($variant['sale_price'] ?? null) && blank($variant['regular_price'] ?? null)) {
                        $validator->errors()->add("variants.{$index}.sale_price", 'Sale price membutuhkan regular price.');
                    } elseif ((float) ($variant['sale_price'] ?? 0) > (float) ($variant['regular_price'] ?? 0)) {
                        $validator->errors()->add("variants.{$index}.sale_price", 'Sale price tidak boleh lebih besar dari regular price.');
                    }

                    if ((int) ($variant['reserved_stock'] ?? 0) > (int) ($variant['stock'] ?? 0)) {
                        $validator->errors()->add("variants.{$index}.reserved_stock", 'Reserved stock tidak boleh lebih besar dari stock.');
                    }

                    if (blank($variant['color_name'] ?? null)) {
                        $validator->errors()->add("variants.{$index}.color_name", 'Color wajib diisi jika SKU varian diisi.');
                    }

                    if (blank($variant['size'] ?? null)) {
                        $validator->errors()->add("variants.{$index}.size", 'Size wajib diisi jika SKU varian diisi.');
                    }
                });

                if ($this->input('status') !== 'published') {
                    return;
                }

                if ((int) $this->input('weight', 0) < 1) {
                    $validator->errors()->add('weight', 'Weight minimal 1 gram untuk produk published.');
                }

                $images = collect($this->input('images', []))
                    ->filter(fn (array $image, int $index): bool => filled($image['id'] ?? null) || $this->hasFile("images.{$index}.image"));

                if ($images->isEmpty()) {
                    $validator->errors()->add('images', 'Produk published minimal memiliki satu gambar.');
                }

                if (! $images->contains(fn (array $image): bool => (bool) ($image['is_primary'] ?? false))) {
                    $validator->errors()->add('images', 'Produk published membutuhkan satu gambar utama.');
                }

                if (! $variants->contains(fn (array $variant): bool => (bool) ($variant['is_active'] ?? false) && ((int) ($variant['stock'] ?? 0) - (int) ($variant['reserved_stock'] ?? 0)) > 0)) {
                    $validator->errors()->add('variants', 'Produk published membutuhkan satu varian aktif dengan stok tersedia.');
                }
            },
        ];
    }
}
