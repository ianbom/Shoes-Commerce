<?php

use App\Services\Admin\ProductImport\KicksDbProductNormalizer;

it('normalizes KicksDB images and variants', function () {
    $result = (new KicksDbProductNormalizer)->normalizeProduct([
        'title' => 'Test', 'sku' => 'AB-123', 'image' => 'one.jpg', 'gallery' => ['one.jpg', 'two.jpg'],
        'variants' => [['sizes' => [['type' => 'us m', 'size' => 'US M 4'], ['type' => 'uk', 'size' => 'UK 3.5'], ['type' => 'cm', 'size' => 'CM 23']]]],
    ]);

    expect($result['gallery'])->toBe(['one.jpg', 'two.jpg'])->and($result['variants'])->toBe(['US M 4 / UK 3.5 / CM 23']);
});
