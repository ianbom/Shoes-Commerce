<?php

namespace App\Services\Admin\ProductImport;

class KicksDbProductNormalizer
{
    public function selectMatch(string $sku, array $results): array
    {
        $results = array_is_list($results) ? $results : ($results['data'] ?? []);
        $normalized = $this->sku($sku);
        $exact = collect($results)->first(fn (array $item): bool => $this->sku((string) ($item['sku'] ?? '')) === $normalized);

        return ['exact' => $exact, 'candidates' => collect($results)->take(5)->map(fn (array $item): array => collect($item)->only(['id', 'slug', 'title', 'sku', 'brand', 'image'])->all())->values()->all()];
    }

    public function normalizeProduct(array $payload): array
    {
        $payload = $payload['data'] ?? $payload;
        $images = array_values(array_unique(array_filter([$payload['image'] ?? null, ...($payload['gallery'] ?? [])])));

        return [
            'id' => $payload['id'] ?? $payload['slug'] ?? null,
            'title' => $payload['title'] ?? null,
            'sku' => $payload['sku'] ?? null,
            'brand' => $payload['brand'] ?? null,
            'model' => $payload['model'] ?? null,
            'description' => $payload['description'] ?? null,
            'category' => $payload['category'] ?? null,
            'image' => $images[0] ?? null,
            'gallery' => $images,
            'variants' => $this->variantLabels($payload['variants'] ?? []),
        ];
    }

    public function variantLabels(array $variants): array
    {
        return collect($variants)->map(function (array $variant): ?string {
            $sizes = collect($variant['sizes'] ?? [])->mapWithKeys(fn (array $size): array => [strtolower((string) ($size['type'] ?? '')) => $size['size'] ?? null]);
            $values = collect(['us m', 'uk', 'cm'])->map(fn (string $type) => $sizes->get($type))->filter();

            return $values->isNotEmpty() ? $values->implode(' / ') : null;
        })->filter()->unique()->values()->all();
    }

    public function sku(string $sku): string
    {
        return strtoupper(preg_replace('/[^A-Z0-9]/i', '', $sku));
    }
}
