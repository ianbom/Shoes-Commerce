<?php

use App\Models\ProductImportBatch;
use App\Models\ProductImportItem;
use App\Models\User;
use App\Services\Admin\ProductImport\ProductImportService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

uses(RefreshDatabase::class);

it('selects a valid candidate, fetches variants, and preserves the Yupoo price', function () {
    config()->set('services.kicksdb.key', 'test-key');
    Http::fake(['https://api.kicks.dev/*' => Http::response(['data' => [
        'id' => 'candidate-1', 'title' => 'Nike Test', 'sku' => 'AB-123', 'brand' => 'Nike',
        'category' => 'Sneakers', 'image' => 'https://img.test/one.jpg', 'gallery' => [],
        'variants' => [['sizes' => [['type' => 'us m', 'size' => 'US M 4']]]],
    ]])]);
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $batch = ProductImportBatch::query()->create(['user_id' => $admin->id, 'source_url' => 'https://shop.x.yupoo.com/categories/1']);
    $item = ProductImportItem::query()->create([
        'product_import_batch_id' => $batch->id, 'source_album_url' => 'https://shop.x.yupoo.com/albums/1',
        'source_title' => '420¥ AB-123', 'source_sku' => 'AB-123', 'price_cny' => 420, 'price_idr' => 1110648,
        'status' => 'unmatched', 'candidate_payload' => [['id' => 'candidate-1', 'title' => 'Nike Test']],
    ]);

    app(ProductImportService::class)->selectCandidate($item, 'candidate-1');

    expect($item->fresh()->status)->toBe('ready')
        ->and($item->fresh()->product_payload['variants'])->toBe(['US M 4'])
        ->and((float) $item->fresh()->price_idr)->toBe(1110648.0);
    Http::assertSent(fn ($request) => $request->hasHeader('Authorization', 'Bearer test-key') && $request->url() === 'https://api.kicks.dev/v3/stockx/products/candidate-1?display%5Bvariants%5D=true');
});

it('rejects a candidate that is not listed for the item', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $batch = ProductImportBatch::query()->create(['user_id' => $admin->id, 'source_url' => 'https://shop.x.yupoo.com/categories/1']);
    $item = ProductImportItem::query()->create([
        'product_import_batch_id' => $batch->id, 'source_album_url' => 'https://shop.x.yupoo.com/albums/1',
        'source_title' => '420¥ AB-123', 'source_sku' => 'AB-123', 'price_cny' => 420, 'price_idr' => 1110648,
        'status' => 'unmatched', 'candidate_payload' => [['id' => 'candidate-1']],
    ]);

    expect(fn () => app(ProductImportService::class)->selectCandidate($item, 'candidate-2'))->toThrow(ValidationException::class);
});
