<?php

namespace App\Jobs\ProductImport;

use App\Models\Product;
use App\Models\ProductImportBatch;
use App\Models\SiteSetting;
use App\Services\Admin\ProductImport\YupooScraper;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessProductImportBatch implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public array $backoff = [1, 5, 10];

    public function __construct(public readonly ProductImportBatch $batch) {}

    public function handle(YupooScraper $scraper): void
    {
        $this->batch->update(['status' => 'scraping', 'started_at' => now(), 'error_message' => null]);

        try {
            $rate = (float) (SiteSetting::query()->where('key', 'cny_to_idr_rate')->value('value') ?? 2644.40);
            foreach ($scraper->scrape($this->batch->source_url) as $source) {
                $duplicate = Product::query()->where('sku', $source['sku'])->exists();
                $item = $this->batch->items()->updateOrCreate(['source_album_url' => $source['source_album_url']], [
                    'source_title' => $source['raw_title'], 'source_sku' => $source['sku'], 'price_cny' => $source['price_cny'],
                    'price_idr' => round($source['price_cny'] * $rate, 2), 'status' => $duplicate ? 'duplicate' : 'pending',
                ]);
                if (! $duplicate) {
                    LookupProductImportItem::dispatch($item);
                }
            }
            $this->batch->update(['status' => 'matching']);
            $this->refresh();
        } catch (\Throwable $exception) {
            $this->batch->update(['status' => 'failed', 'error_message' => $exception->getMessage(), 'finished_at' => now()]);
        }
    }

    private function refresh(): void
    {
        $counts = $this->batch->items()->selectRaw('status, count(*) total')->groupBy('status')->pluck('total', 'status');
        $this->batch->update(['discovered_count' => $counts->sum(), 'duplicate_count' => $counts['duplicate'] ?? 0]);
    }
}
