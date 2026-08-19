<?php

use App\Services\Admin\ProductImport\YupooScraper;
use Illuminate\Support\Facades\Http;

it('extracts Yupoo albums when titles are sibling to album links', function () {
    Http::fake([
        'https://tianjin-no1.x.yupoo.com/categories/684940*' => Http::response(<<<'HTML'
<!doctype html>
<html><head><meta charset="utf-8"></head><body>
<div class="categories__children">
    <a class="album__main" href="/albums/242769686?uid=1">
        <img class="album__img" data-src="https://photo.yupoo.com/tianjin-no1/01ba55622c/medium.jpg">
    </a>
    <div class="text_overflow album__title">【 420¥】 【 GX】 【 HQ7978-001】 AJ5圣诞节</div>
</div>
</body></html>
HTML),
    ]);

    $items = app(YupooScraper::class)->scrape('https://tianjin-no1.x.yupoo.com/categories/684940?isSubCate=true');

    expect($items)->toHaveCount(1)
        ->and($items[0])->toMatchArray([
            'price_cny' => 420.0,
            'sku' => 'HQ7978-001',
            'source_album_url' => 'https://tianjin-no1.x.yupoo.com/albums/242769686?uid=1',
            'thumbnail_url' => 'https://photo.yupoo.com/tianjin-no1/01ba55622c/medium.jpg',
        ]);
});

it('accepts Yupoo ASCII Y currency markers', function () {
    Http::fake([
        'https://tianjin-no1.x.yupoo.com/categories/684940*' => Http::response(<<<'HTML'
<div class="categories__children">
<a class="album__main" href="/albums/242769686"><img data-src="https://example.test/shoe.jpg"></a>
<div class="album__title">【420Y】【GX】【HQ7978-001】AJ5圣诞节</div>
</div>
HTML),
    ]);

    $items = app(YupooScraper::class)->scrape('https://tianjin-no1.x.yupoo.com/categories/684940?isSubCate=true');

    expect($items[0]['price_cny'])->toBe(420.0)
        ->and($items[0]['sku'])->toBe('HQ7978-001');
});
