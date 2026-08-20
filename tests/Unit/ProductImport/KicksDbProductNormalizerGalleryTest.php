<?php

use App\Services\Admin\ProductImport\KicksDbProductNormalizer;

it('includes all gallery and 360 image URLs', function () {
    $payload = app(KicksDbProductNormalizer::class)->normalizeProduct([
        'sku' => 'AB-123',
        'image' => 'https://img.test/main.jpg',
        'gallery' => ['https://img.test/gallery.jpg', 'https://img.test/main.jpg'],
        'gallery_360' => ['https://img.test/360-01.jpg', 'https://img.test/360-02.jpg'],
        'variants' => [['sizes' => [['type' => 'us m', 'size' => 'US M 4']]]],
    ]);

    expect($payload['gallery'])->toBe([
        'https://img.test/main.jpg',
        'https://img.test/gallery.jpg',
        'https://img.test/360-01.jpg',
        'https://img.test/360-02.jpg',
    ]);
});
