<?php

use Illuminate\Support\Facades\Http;

it('exposes a public Yupoo preview endpoint', function () {
    Http::fake([
        'https://shop.x.yupoo.com/categories/1*' => Http::response(<<<'HTML'
<div class="categories__children">
<a class="album__main" href="/albums/10"><img data-src="https://example.test/shoe.jpg"></a>
<div class="album__title">【420¥】【GX】【HQ7978-001】AJ5</div>
</div>
HTML),
    ]);

    $this->getJson('/api/product-import/preview?url='.urlencode('https://shop.x.yupoo.com/categories/1'))
        ->assertSuccessful()
        ->assertJsonPath('count', 1)
        ->assertJsonPath('data.0.sku', 'HQ7978-001')
        ->assertJsonMissingPath('data.0.raw_title');
});

it('exposes a public KicksDB SKU lookup endpoint', function () {
    config(['services.kicksdb.key' => 'test-key', 'services.kicksdb.base_url' => 'https://api.kicks.dev']);
    Http::fake([
        'https://api.kicks.dev/v3/stockx/products*' => Http::response(['data' => [['id' => 'shoe-1', 'sku' => 'HQ7978-001', 'title' => 'Jordan 5']]]),
    ]);

    $this->getJson('/api/product-import/lookup/HQ7978-001')
        ->assertSuccessful()
        ->assertJsonPath('sku', 'HQ7978-001')
        ->assertJsonPath('count', 1)
        ->assertJsonPath('data.0.title', 'Jordan 5');
});
