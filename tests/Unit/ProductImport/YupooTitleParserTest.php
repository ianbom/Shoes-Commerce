<?php

use App\Services\Admin\ProductImport\YupooTitleParser;

it('parses Yupoo price and SKU', function () {
    $result = (new YupooTitleParser)->parse('【 420¥】 【 GX】 【 HQ7978-001】 AJ5圣诞节');

    expect($result)->toMatchArray(['price_cny' => 420.0, 'sku' => 'HQ7978-001']);
});

it('rejects malformed Yupoo titles', function () {
    expect((new YupooTitleParser)->parse('AJ5 no price'))->toBeNull();
});
