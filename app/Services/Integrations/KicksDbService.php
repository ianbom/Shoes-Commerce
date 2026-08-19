<?php

namespace App\Services\Integrations;

use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class KicksDbService
{
    public function searchBySku(string $sku): array
    {
        return Cache::remember('kicksdb:sku:'.strtoupper($sku), now()->addHour(), fn (): array => $this->request('/v3/stockx/products', ['query' => $sku]));
    }

    public function product(string $idOrSlug): array
    {
        return $this->request('/v3/stockx/products/'.rawurlencode($idOrSlug), ['display[variants]' => 'true']);
    }

    private function request(string $path, array $query = []): array
    {
        $key = config('services.kicksdb.key');
        if (blank($key)) {
            throw new RuntimeException('KicksDB API belum dikonfigurasi.');
        }

        try {
            $response = Http::baseUrl(rtrim((string) config('services.kicksdb.base_url'), '/'))
                ->acceptJson()->withToken($key)->connectTimeout(5)->timeout(20)
                ->retry([1000, 5000, 10000], throw: false)
                ->get($path, $query);

            if (in_array($response->status(), [401, 403], true)) {
                throw new RuntimeException('KicksDB API tidak mengizinkan permintaan ini.');
            }
            if ($response->status() === 404) {
                return [];
            }
            $response->throw();

            return $response->json('data', []);
        } catch (RequestException $exception) {
            throw new RuntimeException('KicksDB tidak dapat dihubungi.', previous: $exception);
        }
    }
}
