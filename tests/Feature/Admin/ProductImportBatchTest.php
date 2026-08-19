<?php

use App\Models\ProductImportBatch;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('allows admins to create an import batch', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);

    $this->actingAs($admin)->post(route('admin.product-imports.store'), ['source_url' => 'https://shop.x.yupoo.com/categories/1'])->assertRedirect();

    expect(ProductImportBatch::query()->whereBelongsTo($admin)->count())->toBe(1);
});

it('rejects unsafe import URLs', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);

    $this->actingAs($admin)->post(route('admin.product-imports.store'), ['source_url' => 'https://example.com/a'])->assertSessionHasErrors('source_url');
});
