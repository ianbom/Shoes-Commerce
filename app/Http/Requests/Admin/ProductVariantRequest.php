<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductVariantRequest extends FormRequest
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
        $variant = $this->route('productVariant');

        return [
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'sku' => ['required', 'string', 'max:100', Rule::unique('product_variants', 'sku')->ignore($variant)],
            'color_name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('product_variants', 'color_name')
                    ->where(fn ($query) => $query
                        ->where('product_id', $this->input('product_id'))
                        ->where('size', $this->input('size')))
                    ->ignore($variant),
            ],
            'color_hex' => ['nullable', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'size' => ['required', 'string', 'max:100'],
            'regular_price' => ['nullable', 'numeric', 'min:0'],
            'sale_price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'reserved_stock' => ['required', 'integer', 'min:0', 'lte:stock'],
            'weight' => ['nullable', 'integer', 'min:0'],
            'length' => ['nullable', 'integer', 'min:0'],
            'width' => ['nullable', 'integer', 'min:0'],
            'height' => ['nullable', 'integer', 'min:0'],
            'image_url' => ['nullable', 'string', 'max:255', 'not_regex:/^blob:/i'],
            'image' => ['nullable', 'file', 'image', 'max:4096'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [function ($validator): void {
            if (filled($this->input('sale_price')) && blank($this->input('regular_price'))) {
                $validator->errors()->add('sale_price', 'Sale price membutuhkan regular price.');
            } elseif ((float) $this->input('sale_price', 0) > (float) $this->input('regular_price', 0)) {
                $validator->errors()->add('sale_price', 'Sale price tidak boleh lebih besar dari regular price.');
            }
        }];
    }
}
