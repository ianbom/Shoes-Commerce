<?php

namespace App\Http\Controllers\Api;

use App\Services\Admin\ProductImport\YupooScraper;
use App\Services\Integrations\KicksDbService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductImportPreviewController
{
    public function preview(Request $request, YupooScraper $scraper): JsonResponse
    {
        $validated = $request->validate(['url' => ['required', 'url', 'max:2048']]);
        $items = $scraper->scrape($validated['url']);

        return response()->json([
            'source_url' => $validated['url'],
            'count' => count($items),
            'data' => array_map(fn (array $item): array => [
                'sku' => $item['sku'],
                'price_cny' => $item['price_cny'],
                'source_album_url' => $item['source_album_url'],
                'thumbnail_url' => $item['thumbnail_url'],
            ], $items),
        ]);
    }

    public function lookup(string $sku, KicksDbService $kicksdb): JsonResponse
    {
        $results = $kicksdb->searchBySku($sku);

        return response()->json([
            'sku' => strtoupper($sku),
            'count' => count($results),
            'data' => $results,
        ]);
    }
}
