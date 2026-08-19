<?php

use App\Models\Product;

it('serves crawl directives and sitemap', function () {
    $this->get('/robots.txt')->assertSuccessful()->assertSee('Sitemap:');
    $this->get('/sitemap.xml')->assertSuccessful()->assertHeader('Content-Type', 'application/xml');
});

it('returns not found for an unknown product slug', function () {
    $this->get('/detail?product=missing-product')->assertNotFound();
});

it('includes only published products in the sitemap', function () {
    $published = Product::query()->create([
        'name' => 'Published Shoe',
        'slug' => 'published-shoe',
        'sku' => 'PUB-1',
        'brand_name' => 'Axegear',
        'price' => 100000,
        'status' => 'published',
    ]);
    Product::query()->create([
        'name' => 'Draft Shoe',
        'slug' => 'draft-shoe',
        'sku' => 'DRAFT-1',
        'brand_name' => 'Axegear',
        'price' => 100000,
        'status' => 'draft',
    ]);

    $response = $this->get('/sitemap.xml')->assertSuccessful();

    $response->assertSee($published->slug)->assertDontSee('draft-shoe');
});
