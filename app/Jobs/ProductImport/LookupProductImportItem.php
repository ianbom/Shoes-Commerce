<?php

namespace App\Jobs\ProductImport;

use App\Models\ProductImportItem;
use App\Services\Admin\ProductImport\KicksDbProductNormalizer;
use App\Services\Admin\ProductImport\ProductImportService;
use App\Services\Integrations\KicksDbService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\Middleware\RateLimited;

class LookupProductImportItem implements ShouldQueue
{
    use Queueable;

    public int $tries = 4;

    public array $backoff = [1, 5, 10];

    public function __construct(public readonly ProductImportItem $item) {}

    public function middleware(): array
    {
        return [new RateLimited('kicksdb')];
    }

    public function handle(KicksDbService $kicksdb, KicksDbProductNormalizer $normalizer, ProductImportService $imports): void
    {
        try {
            $selection = $normalizer->selectMatch($this->item->source_sku, $kicksdb->searchBySku($this->item->source_sku));
            if ($selection['exact']) {
                $identifier = $selection['exact']['id'] ?? $selection['exact']['slug'];
                $this->item->update(['status' => 'ready', 'matched_kicksdb_id' => $identifier, 'product_payload' => $normalizer->normalizeProduct($kicksdb->product($identifier)), 'candidate_payload' => $selection['candidates']]);
            } else {
                $this->item->update(['status' => 'unmatched', 'candidate_payload' => $selection['candidates']]);
            }
        } catch (\Throwable $exception) {
            $this->item->update(['status' => 'failed', 'error_message' => $exception->getMessage()]);
        }
        $imports->refreshCounters($this->item->batch);
    }
}
