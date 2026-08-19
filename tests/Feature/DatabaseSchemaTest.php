<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;

uses(RefreshDatabase::class);

it('matches the db.sql table contract', function () {
    $tables = [
        'admin_activity_logs', 'banners', 'biteship_webhook_logs', 'cache', 'cache_locks',
        'carts', 'cart_items', 'categories', 'customer_addresses',
        'failed_jobs', 'jobs', 'job_batches', 'notifications', 'order_addresses',
        'order_items', 'orders', 'pages', 'password_reset_tokens', 'payment_logs',
        'payments', 'personal_access_tokens', 'product_categories', 'product_images',
        'product_reviews', 'product_variants', 'products', 'sessions', 'shipment_trackings',
        'shipments', 'site_settings', 'stock_logs', 'users', 'voucher_categories',
        'voucher_products', 'vouchers', 'wishlists',
    ];

    foreach ($tables as $table) {
        expect(Schema::hasTable($table))->toBeTrue($table.' table is missing');
    }

    foreach ([
        'desty_connections', 'desty_warehouses', 'desty_product_mappings',
        'desty_variant_mappings', 'desty_order_mappings', 'desty_sync_jobs',
        'desty_webhook_logs', 'inventory_reservations', 'product_marketplace_links',
    ] as $table) {
        expect(Schema::hasTable($table))->toBeFalse($table.' must not exist');
    }

    expect(Schema::hasColumns('products', [
        'brand_name', 'price', 'status',
    ]))->toBeTrue();

    expect(Schema::hasColumns('product_variants', [
        'size', 'price', 'stock', 'reserved_stock', 'image_url',
    ]))->toBeTrue();

    expect(Schema::hasColumns('cart_items', [
        'product_name_snapshot', 'product_sku_snapshot', 'variant_sku_snapshot',
        'color_name_snapshot', 'size_snapshot', 'price_snapshot', 'image_url_snapshot',
    ]))->toBeTrue();

    expect(Schema::hasColumns('orders', [
        'checkout_idempotency_key', 'insurance_cost', 'source_channel',
        'terms_agreed', 'terms_agreed_at',
    ]))->toBeTrue();
});
