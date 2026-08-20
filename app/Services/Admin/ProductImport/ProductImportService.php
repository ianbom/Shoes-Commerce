<?php

namespace App\Services\Admin\ProductImport;

use App\Jobs\ProductImport\ProcessProductImportBatch;
use App\Models\ProductImportBatch;
use App\Models\ProductImportItem;
use App\Models\User;
use App\Services\Integrations\KicksDbService;
use Illuminate\Validation\ValidationException;

class ProductImportService
{
    public function __construct(private readonly YupooUrlValidator $urls, private readonly KicksDbService $kicksdb, private readonly KicksDbProductNormalizer $normalizer) {}

    public function createBatch(string $url, User $admin): ProductImportBatch
    {
        $url = $this->urls->validate($url);
        $batch = $admin->productImportBatches()->create(['source_url' => $url]);
        ProcessProductImportBatch::dispatch($batch);

        return $batch;
    }

    public function refreshCounters(ProductImportBatch $batch): void
    {
        $counts = $batch->items()->selectRaw('status, count(*) total')->groupBy('status')->pluck('total', 'status');
        $batch->update(['discovered_count' => $counts->sum(), 'matched_count' => ($counts['matched'] ?? 0) + ($counts['ready'] ?? 0), 'unmatched_count' => $counts['unmatched'] ?? 0, 'duplicate_count' => $counts['duplicate'] ?? 0, 'failed_count' => $counts['failed'] ?? 0, 'saved_count' => $counts['saved'] ?? 0, 'status' => $counts->sum() && (($counts['pending'] ?? 0) + ($counts['ready'] ?? 0) + ($counts['unmatched'] ?? 0)) === 0 ? 'ready' : $batch->status]);
    }

    public function indexData(): array
    {
        return [
            'batches' => ProductImportBatch::query()->latest()->paginate(15)->withQueryString(),
        ];
    }

    public function data(ProductImportBatch $batch): array
    {
        return ['batch' => $batch, 'items' => $batch->items()->latest()->paginate(24)->withQueryString()];
    }

    public function removeBatch(ProductImportBatch $batch): void
    {
        $batch->delete();
    }

    public function removeItem(ProductImportItem $item): void
    {
        if ($item->status === 'saved') {
            throw ValidationException::withMessages(['item' => 'Produk yang sudah tersimpan tidak dapat dihapus dari preview.']);
        }

        $batch = $item->batch;
        $item->delete();
        $this->refreshCounters($batch);
    }

    public function selectCandidate(ProductImportItem $item, string $id): void
    {
        if (! collect($item->candidate_payload)->contains(fn (array $candidate): bool => (string) ($candidate['id'] ?? $candidate['slug'] ?? '') === $id)) {
            throw ValidationException::withMessages(['kicksdb_id' => 'Kandidat tidak tersedia untuk produk ini.']);
        }

        $item->update(['selected_kicksdb_id' => $id, 'product_payload' => $this->normalizer->normalizeProduct($this->kicksdb->product($id)), 'status' => 'ready']);
    }
}
