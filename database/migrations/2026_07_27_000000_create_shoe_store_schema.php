<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table): void {
            $table->id();
            $table->string('name', 255);
            $table->string('email', 255);
            $table->string('google_id', 255)->nullable();
            $table->string('phone', 255)->nullable();
            $table->string('role', 255)->default('customer');
            $table->string('avatar_url', 255)->nullable();
            $table->boolean('is_active')->default(1);
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password', 255);
            $table->text('two_factor_secret')->nullable();
            $table->text('two_factor_recovery_codes')->nullable();
            $table->timestamp('two_factor_confirmed_at')->nullable();
            $table->string('remember_token', 100)->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $table->unique('email', 'users_email_unique');
            $table->unique('google_id', 'users_google_id_unique');
        });

        Schema::create('password_reset_tokens', function (Blueprint $table): void {
            $table->string('email', 255);
            $table->string('token', 255);
            $table->timestamp('created_at')->nullable();
            $table->primary('email');
        });

        Schema::create('sessions', function (Blueprint $table): void {
            $table->string('id', 255);
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity');
            $table->index('user_id', 'sessions_user_id_index');
            $table->index('last_activity', 'sessions_last_activity_index');
        });

        Schema::create('personal_access_tokens', function (Blueprint $table): void {
            $table->id();
            $table->string('tokenable_type', 255);
            $table->unsignedBigInteger('tokenable_id');
            $table->text('name');
            $table->string('token', 64);
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unique('token', 'personal_access_tokens_token_unique');
            $table->index(['tokenable_type', 'tokenable_id'], 'personal_access_tokens_tokenable_type_tokenable_id_index');
            $table->index('expires_at', 'personal_access_tokens_expires_at_index');
        });

        Schema::create('cache', function (Blueprint $table): void {
            $table->string('key', 255);
            $table->mediumText('value');
            $table->integer('expiration');
            $table->primary('key');
            $table->index('expiration', 'cache_expiration_index');
        });

        Schema::create('cache_locks', function (Blueprint $table): void {
            $table->string('key', 255);
            $table->string('owner', 255);
            $table->integer('expiration');
            $table->primary('key');
            $table->index('expiration', 'cache_locks_expiration_index');
        });

        Schema::create('jobs', function (Blueprint $table): void {
            $table->id();
            $table->string('queue', 255);
            $table->longText('payload');
            $table->unsignedTinyInteger('attempts');
            $table->unsignedInteger('reserved_at')->nullable();
            $table->unsignedInteger('available_at');
            $table->unsignedInteger('created_at');
            $table->index('queue', 'jobs_queue_index');
        });

        Schema::create('job_batches', function (Blueprint $table): void {
            $table->string('id', 255);
            $table->string('name', 255);
            $table->integer('total_jobs');
            $table->integer('pending_jobs');
            $table->integer('failed_jobs');
            $table->longText('failed_job_ids');
            $table->mediumText('options')->nullable();
            $table->integer('cancelled_at')->nullable();
            $table->integer('created_at');
            $table->integer('finished_at')->nullable();
        });

        Schema::create('failed_jobs', function (Blueprint $table): void {
            $table->id();
            $table->string('uuid', 255);
            $table->text('connection');
            $table->text('queue');
            $table->longText('payload');
            $table->longText('exception');
            $table->timestamp('failed_at')->useCurrent();
            $table->unique('uuid', 'failed_jobs_uuid_unique');
        });

        Schema::create('categories', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('name', 150);
            $table->string('slug', 180);
            $table->text('description')->nullable();
            $table->string('image_url', 255)->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(1);
            $table->timestamp('deleted_at')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unique('slug', 'categories_slug_unique');
            $table->index('parent_id', 'categories_parent_id_index');
            $table->index('slug', 'categories_slug_index');
            $table->index('is_active', 'categories_is_active_index');
            $table->foreign('parent_id', 'categories_parent_id_foreign')->references('id')->on('categories')->nullOnDelete();
        });

        Schema::create('collections', function (Blueprint $table): void {
            $table->id();
            $table->string('name', 150);
            $table->string('slug', 180);
            $table->text('description')->nullable();
            $table->string('banner_desktop_url', 255)->nullable();
            $table->string('banner_mobile_url', 255)->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_featured')->default(0);
            $table->boolean('is_active')->default(1);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unique('slug', 'collections_slug_unique');
            $table->index('slug', 'collections_slug_index');
            $table->index('is_featured', 'collections_is_featured_index');
            $table->index('is_active', 'collections_is_active_index');
            $table->index('starts_at', 'collections_starts_at_index');
            $table->index('ends_at', 'collections_ends_at_index');
        });

        Schema::create('customer_addresses', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('recipient_name', 150);
            $table->string('recipient_phone', 30);
            $table->string('label', 100)->nullable();
            $table->string('province', 100);
            $table->string('city', 100);
            $table->string('district', 100);
            $table->string('subdistrict', 100)->nullable();
            $table->string('postal_code', 20);
            $table->string('biteship_area_id', 100)->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->text('full_address');
            $table->text('note')->nullable();
            $table->boolean('is_default')->default(0);
            $table->timestamp('deleted_at')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->index(['user_id', 'is_default'], 'customer_addresses_user_id_is_default_index');
            $table->index('biteship_area_id', 'customer_addresses_biteship_area_id_index');
            $table->foreign('user_id', 'customer_addresses_user_id_foreign')->references('id')->on('users')->cascadeOnDelete();
        });

        Schema::create('products', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('category_id')->nullable();
            $table->string('name', 200);
            $table->string('slug', 220);
            $table->string('sku', 100)->nullable();
            $table->string('brand_name', 150);
            $table->decimal('regular_price', 15, 2);
            $table->decimal('sale_price', 15, 2)->nullable();
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->string('stock_status', 50)->default('in_stock');
            $table->string('status', 30)->default('draft');
            $table->integer('weight')->default(0);
            $table->integer('length')->nullable();
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->boolean('is_featured')->default(0);
            $table->boolean('is_new_arrival')->default(0);
            $table->boolean('is_best_seller')->default(0);
            $table->string('meta_title', 255)->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unique('slug', 'products_slug_unique');
            $table->unique('sku', 'products_sku_unique');
            $table->index('category_id', 'products_category_id_index');
            $table->index('sku', 'products_sku_index');
            $table->index('brand_name', 'products_brand_name_index');
            $table->index('stock_status', 'products_stock_status_index');
            $table->index('status', 'products_status_index');
            $table->index('is_featured', 'products_is_featured_index');
            $table->index('is_new_arrival', 'products_is_new_arrival_index');
            $table->index('is_best_seller', 'products_is_best_seller_index');
            $table->foreign('category_id', 'products_category_id_foreign')->references('id')->on('categories')->nullOnDelete();
        });

        Schema::create('product_collections', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('collection_id');
            $table->integer('sort_order')->default(0);
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unique(['product_id', 'collection_id'], 'product_collections_product_id_collection_id_unique');
            $table->index('product_id', 'product_collections_product_id_index');
            $table->index('collection_id', 'product_collections_collection_id_index');
            $table->foreign('collection_id', 'product_collections_collection_id_foreign')->references('id')->on('collections')->cascadeOnDelete();
            $table->foreign('product_id', 'product_collections_product_id_foreign')->references('id')->on('products')->cascadeOnDelete();
        });

        Schema::create('product_images', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->string('image_url', 255);
            $table->string('alt_text', 255)->nullable();
            $table->string('color_name', 100)->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_primary')->default(0);
            $table->timestamp('deleted_at')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->index(['product_id', 'is_primary'], 'product_images_product_id_is_primary_index');
            $table->index(['product_id', 'sort_order'], 'product_images_product_id_sort_order_index');
            $table->index(['product_id', 'color_name'], 'product_images_product_id_color_name_index');
            $table->foreign('product_id', 'product_images_product_id_foreign')->references('id')->on('products')->cascadeOnDelete();
        });

        Schema::create('product_variants', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->string('sku', 100);
            $table->string('color_name', 100);
            $table->string('color_hex', 20)->nullable();
            $table->string('size', 100);
            $table->decimal('regular_price', 15, 2)->nullable();
            $table->decimal('sale_price', 15, 2)->nullable();
            $table->integer('stock')->default(0);
            $table->integer('reserved_stock')->default(0);
            $table->integer('weight')->nullable();
            $table->integer('length')->nullable();
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->string('image_url', 255)->nullable();
            $table->boolean('is_active')->default(1);
            $table->timestamp('deleted_at')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unique('sku', 'product_variants_sku_unique');
            $table->unique(['product_id', 'color_name', 'size'], 'product_variants_product_color_size_unique');
            $table->index('product_id', 'product_variants_product_id_index');
            $table->index('sku', 'product_variants_sku_index');
            $table->index('color_name', 'product_variants_color_name_index');
            $table->index('size', 'product_variants_size_index');
            $table->index('is_active', 'product_variants_is_active_index');
            $table->foreign('product_id', 'product_variants_product_id_foreign')->references('id')->on('products')->cascadeOnDelete();
        });

        Schema::create('stock_logs', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('product_variant_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('type', 50);
            $table->integer('quantity');
            $table->integer('stock_before');
            $table->integer('stock_after');
            $table->string('reference_type', 100)->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->text('note')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->index('product_variant_id', 'stock_logs_product_variant_id_index');
            $table->index('user_id', 'stock_logs_user_id_index');
            $table->index('type', 'stock_logs_type_index');
            $table->index('reference_type', 'stock_logs_reference_type_index');
            $table->index('reference_id', 'stock_logs_reference_id_index');
            $table->foreign('product_variant_id', 'stock_logs_product_variant_id_foreign')->references('id')->on('product_variants')->cascadeOnDelete();
            $table->foreign('user_id', 'stock_logs_user_id_foreign')->references('id')->on('users')->nullOnDelete();
        });

        Schema::create('carts', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unique('user_id', 'carts_user_id_unique');
            $table->foreign('user_id', 'carts_user_id_foreign')->references('id')->on('users')->cascadeOnDelete();
        });

        Schema::create('cart_items', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('cart_id');
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('product_variant_id');
            $table->integer('quantity')->default(1);
            $table->string('product_name_snapshot', 200);
            $table->string('product_sku_snapshot', 100)->nullable();
            $table->string('variant_sku_snapshot', 100);
            $table->string('color_name_snapshot', 100);
            $table->string('size_snapshot', 100);
            $table->decimal('price_snapshot', 15, 2);
            $table->string('image_url_snapshot', 255)->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unique(['cart_id', 'product_variant_id'], 'cart_items_cart_id_product_variant_id_unique');
            $table->index('cart_id', 'cart_items_cart_id_index');
            $table->index('product_id', 'cart_items_product_id_index');
            $table->index('product_variant_id', 'cart_items_product_variant_id_index');
            $table->foreign('cart_id', 'cart_items_cart_id_foreign')->references('id')->on('carts')->cascadeOnDelete();
            $table->foreign('product_id', 'cart_items_product_id_foreign')->references('id')->on('products')->cascadeOnDelete();
            $table->foreign('product_variant_id', 'cart_items_product_variant_id_foreign')->references('id')->on('product_variants')->cascadeOnDelete();
        });

        Schema::create('vouchers', function (Blueprint $table): void {
            $table->id();
            $table->string('code', 50);
            $table->string('name', 150);
            $table->text('description')->nullable();
            $table->string('discount_type', 30);
            $table->decimal('discount_value', 15, 2);
            $table->decimal('max_discount', 15, 2)->nullable();
            $table->decimal('min_order_amount', 15, 2)->nullable();
            $table->integer('usage_limit')->nullable();
            $table->integer('used_count')->default(0);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->boolean('is_active')->default(1);
            $table->timestamp('deleted_at')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unique('code', 'vouchers_code_unique');
            $table->index(['is_active', 'starts_at', 'ends_at'], 'vouchers_is_active_starts_at_ends_at_index');
        });

        Schema::create('voucher_categories', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('voucher_id');
            $table->unsignedBigInteger('category_id');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unique(['voucher_id', 'category_id'], 'voucher_categories_voucher_id_category_id_unique');
            $table->index('category_id', 'voucher_categories_category_id_foreign');
            $table->foreign('category_id', 'voucher_categories_category_id_foreign')->references('id')->on('categories')->cascadeOnDelete();
            $table->foreign('voucher_id', 'voucher_categories_voucher_id_foreign')->references('id')->on('vouchers')->cascadeOnDelete();
        });

        Schema::create('voucher_products', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('voucher_id');
            $table->unsignedBigInteger('product_id');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unique(['voucher_id', 'product_id'], 'voucher_products_voucher_id_product_id_unique');
            $table->index('product_id', 'voucher_products_product_id_foreign');
            $table->foreign('product_id', 'voucher_products_product_id_foreign')->references('id')->on('products')->cascadeOnDelete();
            $table->foreign('voucher_id', 'voucher_products_voucher_id_foreign')->references('id')->on('vouchers')->cascadeOnDelete();
        });

        Schema::create('orders', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('customer_address_id')->nullable();
            $table->string('order_number', 100);
            $table->string('checkout_idempotency_key', 100)->nullable();
            $table->string('customer_name', 150);
            $table->string('customer_email', 191);
            $table->string('customer_phone', 30);
            $table->decimal('subtotal', 15, 2)->default(0.00);
            $table->decimal('discount_amount', 15, 2)->default(0.00);
            $table->decimal('shipping_cost', 15, 2)->default(0.00);
            $table->decimal('insurance_cost', 15, 2)->default(0.00);
            $table->decimal('service_fee', 15, 2)->default(0.00);
            $table->decimal('grand_total', 15, 2)->default(0.00);
            $table->unsignedBigInteger('voucher_id')->nullable();
            $table->string('voucher_code', 50)->nullable();
            $table->string('payment_status', 50)->default('pending');
            $table->string('order_status', 50)->default('pending_payment');
            $table->string('shipping_status', 50)->default('not_created');
            $table->string('source_channel', 50)->default('website');
            $table->boolean('terms_agreed')->default(0);
            $table->timestamp('terms_agreed_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('stock_reserved_at')->nullable();
            $table->timestamp('stock_released_at')->nullable();
            $table->timestamp('stock_finalized_at')->nullable();
            $table->timestamp('voucher_released_at')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unique('order_number', 'orders_order_number_unique');
            $table->unique(['user_id', 'checkout_idempotency_key'], 'orders_user_id_checkout_idempotency_key_unique');
            $table->index('customer_address_id', 'orders_customer_address_id_foreign');
            $table->index('voucher_id', 'orders_voucher_id_foreign');
            $table->index('order_number', 'orders_order_number_index');
            $table->index('payment_status', 'orders_payment_status_index');
            $table->index('order_status', 'orders_order_status_index');
            $table->index('shipping_status', 'orders_shipping_status_index');
            $table->index('source_channel', 'orders_source_channel_index');
            $table->foreign('customer_address_id', 'orders_customer_address_id_foreign')->references('id')->on('customer_addresses')->nullOnDelete();
            $table->foreign('user_id', 'orders_user_id_foreign')->references('id')->on('users')->restrictOnDelete();
            $table->foreign('voucher_id', 'orders_voucher_id_foreign')->references('id')->on('vouchers')->nullOnDelete();
        });

        Schema::create('order_addresses', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->string('recipient_name', 150);
            $table->string('recipient_phone', 30);
            $table->string('province', 100);
            $table->string('city', 100);
            $table->string('district', 100);
            $table->string('subdistrict', 100)->nullable();
            $table->string('postal_code', 20);
            $table->string('biteship_area_id', 100)->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->text('full_address');
            $table->text('note')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unique('order_id', 'order_addresses_order_id_unique');
            $table->foreign('order_id', 'order_addresses_order_id_foreign')->references('id')->on('orders')->cascadeOnDelete();
        });

        Schema::create('order_items', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('product_id')->nullable();
            $table->unsignedBigInteger('product_variant_id')->nullable();
            $table->string('product_name', 200);
            $table->string('product_sku', 100)->nullable();
            $table->string('variant_sku', 100);
            $table->string('color_name', 100);
            $table->string('size', 100);
            $table->decimal('price', 15, 2);
            $table->integer('quantity');
            $table->decimal('subtotal', 15, 2);
            $table->integer('weight')->default(0);
            $table->integer('length')->nullable();
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->string('product_image_url', 255)->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->index('order_id', 'order_items_order_id_index');
            $table->index('product_id', 'order_items_product_id_index');
            $table->index('product_variant_id', 'order_items_product_variant_id_index');
            $table->index('variant_sku', 'order_items_variant_sku_index');
            $table->index('color_name', 'order_items_color_name_index');
            $table->index('size', 'order_items_size_index');
            $table->foreign('order_id', 'order_items_order_id_foreign')->references('id')->on('orders')->cascadeOnDelete();
            $table->foreign('product_id', 'order_items_product_id_foreign')->references('id')->on('products')->nullOnDelete();
            $table->foreign('product_variant_id', 'order_items_product_variant_id_foreign')->references('id')->on('product_variants')->nullOnDelete();
        });

        Schema::create('payments', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->string('payment_provider', 50)->default('midtrans');
            $table->string('payment_method', 100)->nullable();
            $table->string('midtrans_order_id', 100)->nullable();
            $table->string('midtrans_transaction_id', 150)->nullable();
            $table->string('midtrans_snap_token', 255)->nullable();
            $table->string('midtrans_redirect_url', 255)->nullable();
            $table->string('transaction_status', 50)->nullable();
            $table->string('fraud_status', 50)->nullable();
            $table->decimal('gross_amount', 15, 2);
            $table->string('currency', 10)->default('IDR');
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('last_synced_at')->nullable();
            $table->text('failure_reason')->nullable();
            $table->json('raw_response')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unique('order_id', 'payments_order_id_unique');
            $table->unique('midtrans_order_id', 'payments_midtrans_order_id_unique');
            $table->index(['order_id', 'transaction_status'], 'payments_order_id_transaction_status_index');
            $table->index('midtrans_transaction_id', 'payments_midtrans_transaction_id_index');
            $table->index(['transaction_status', 'created_at'], 'payments_transaction_status_created_at_index');
            $table->index('last_synced_at', 'payments_last_synced_at_index');
            $table->index('expires_at', 'payments_expires_at_index');
            $table->foreign('order_id', 'payments_order_id_foreign')->references('id')->on('orders')->cascadeOnDelete();
        });

        Schema::create('payment_logs', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('payment_id')->nullable();
            $table->unsignedBigInteger('order_id')->nullable();
            $table->string('provider', 50)->default('midtrans');
            $table->string('event_type', 100)->nullable();
            $table->string('transaction_status', 50)->nullable();
            $table->string('payload_hash', 64)->nullable();
            $table->json('payload');
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unique('payload_hash', 'payment_logs_payload_hash_unique');
            $table->index('payment_id', 'payment_logs_payment_id_foreign');
            $table->index(['provider', 'event_type'], 'payment_logs_provider_event_type_index');
            $table->index(['order_id', 'created_at'], 'payment_logs_order_id_created_at_index');
            $table->foreign('order_id', 'payment_logs_order_id_foreign')->references('id')->on('orders')->nullOnDelete();
            $table->foreign('payment_id', 'payment_logs_payment_id_foreign')->references('id')->on('payments')->nullOnDelete();
        });

        Schema::create('shipments', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->string('shipping_provider', 50)->default('biteship');
            $table->string('biteship_order_id', 150)->nullable();
            $table->string('biteship_tracking_id', 150)->nullable();
            $table->string('waybill_id', 150)->nullable();
            $table->string('label_url', 255)->nullable();
            $table->string('courier_company', 100);
            $table->string('courier_type', 100);
            $table->string('courier_service_name', 150)->nullable();
            $table->string('delivery_type', 50)->default('now');
            $table->decimal('shipping_cost', 15, 2)->default(0.00);
            $table->decimal('insurance_cost', 15, 2)->default(0.00);
            $table->string('estimated_delivery', 100)->nullable();
            $table->string('shipping_status', 50)->default('not_created');
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('creating_at')->nullable();
            $table->timestamp('last_synced_at')->nullable();
            $table->text('failed_reason')->nullable();
            $table->json('raw_rate_response')->nullable();
            $table->json('raw_order_response')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unique('order_id', 'shipments_order_id_unique');
            $table->unique('biteship_order_id', 'shipments_biteship_order_id_unique');
            $table->index('biteship_order_id', 'shipments_biteship_order_id_index');
            $table->index('biteship_tracking_id', 'shipments_biteship_tracking_id_index');
            $table->index('waybill_id', 'shipments_waybill_id_index');
            $table->index('shipping_status', 'shipments_shipping_status_index');
            $table->foreign('order_id', 'shipments_order_id_foreign')->references('id')->on('orders')->cascadeOnDelete();
        });

        Schema::create('shipment_trackings', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('shipment_id');
            $table->string('status', 100);
            $table->text('description')->nullable();
            $table->string('location', 255)->nullable();
            $table->timestamp('happened_at')->nullable();
            $table->timestamp('provider_happened_at')->nullable();
            $table->string('payload_hash', 64)->nullable();
            $table->json('raw_payload')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unique('payload_hash', 'shipment_trackings_payload_hash_unique');
            $table->index(['shipment_id', 'happened_at'], 'shipment_trackings_shipment_id_happened_at_index');
            $table->index(['shipment_id', 'provider_happened_at'], 'shipment_trackings_shipment_id_provider_happened_at_index');
            $table->foreign('shipment_id', 'shipment_trackings_shipment_id_foreign')->references('id')->on('shipments')->cascadeOnDelete();
        });

        Schema::create('biteship_webhook_logs', function (Blueprint $table): void {
            $table->id();
            $table->string('event_type', 100)->nullable();
            $table->string('biteship_order_id', 150)->nullable();
            $table->string('biteship_tracking_id', 150)->nullable();
            $table->string('waybill_id', 150)->nullable();
            $table->string('payload_hash', 64)->nullable();
            $table->json('payload');
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unique('payload_hash', 'biteship_webhook_logs_payload_hash_unique');
            $table->index('event_type', 'biteship_webhook_logs_event_type_index');
            $table->index('biteship_order_id', 'biteship_webhook_logs_biteship_order_id_index');
            $table->index('biteship_tracking_id', 'biteship_webhook_logs_biteship_tracking_id_index');
            $table->index('waybill_id', 'biteship_webhook_logs_waybill_id_index');
        });

        Schema::create('notifications', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('title', 180);
            $table->text('message');
            $table->string('type', 50);
            $table->string('reference_type', 100)->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->boolean('is_read')->default(0);
            $table->timestamp('read_at')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->index(['user_id', 'is_read'], 'notifications_user_id_is_read_index');
            $table->index(['reference_type', 'reference_id'], 'notifications_reference_type_reference_id_index');
            $table->foreign('user_id', 'notifications_user_id_foreign')->references('id')->on('users')->cascadeOnDelete();
        });

        Schema::create('wishlists', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('product_id');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unique(['user_id', 'product_id'], 'wishlists_user_id_product_id_unique');
            $table->index('product_id', 'wishlists_product_id_foreign');
            $table->foreign('product_id', 'wishlists_product_id_foreign')->references('id')->on('products')->cascadeOnDelete();
            $table->foreign('user_id', 'wishlists_user_id_foreign')->references('id')->on('users')->cascadeOnDelete();
        });

        Schema::create('product_reviews', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('order_item_id')->nullable();
            $table->unsignedBigInteger('product_id');
            $table->integer('rating');
            $table->string('title', 150)->nullable();
            $table->text('comment')->nullable();
            $table->boolean('is_visible')->default(1);
            $table->timestamp('deleted_at')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->index('product_id', 'product_reviews_product_id_index');
            $table->index('user_id', 'product_reviews_user_id_index');
            $table->index('order_item_id', 'product_reviews_order_item_id_index');
            $table->index('is_visible', 'product_reviews_is_visible_index');
            $table->foreign('order_item_id', 'product_reviews_order_item_id_foreign')->references('id')->on('order_items')->nullOnDelete();
            $table->foreign('product_id', 'product_reviews_product_id_foreign')->references('id')->on('products')->cascadeOnDelete();
            $table->foreign('user_id', 'product_reviews_user_id_foreign')->references('id')->on('users')->cascadeOnDelete();
        });

        Schema::create('banners', function (Blueprint $table): void {
            $table->id();
            $table->string('title', 180);
            $table->string('subtitle', 255)->nullable();
            $table->string('image_desktop_url', 255);
            $table->string('image_mobile_url', 255)->nullable();
            $table->string('button_text', 100)->nullable();
            $table->string('button_url', 255)->nullable();
            $table->string('placement', 100)->default('homepage');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(1);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->index(['placement', 'is_active', 'sort_order'], 'banners_placement_is_active_sort_order_index');
        });

        Schema::create('pages', function (Blueprint $table): void {
            $table->id();
            $table->string('title', 180);
            $table->string('slug', 180);
            $table->longText('content');
            $table->string('type', 100);
            $table->string('meta_title', 255)->nullable();
            $table->text('meta_description')->nullable();
            $table->boolean('is_active')->default(1);
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unique('slug', 'pages_slug_unique');
            $table->index('slug', 'pages_slug_index');
            $table->index('type', 'pages_type_index');
            $table->index('is_active', 'pages_is_active_index');
        });

        Schema::create('site_settings', function (Blueprint $table): void {
            $table->id();
            $table->string('key', 150);
            $table->text('value')->nullable();
            $table->string('type', 50)->default('string');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unique('key', 'site_settings_key_unique');
        });

        Schema::create('admin_activity_logs', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('action', 150);
            $table->string('module', 100);
            $table->string('reference_type', 100)->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->index('user_id', 'admin_activity_logs_user_id_foreign');
            $table->index(['module', 'created_at'], 'admin_activity_logs_module_created_at_index');
            $table->index(['reference_type', 'reference_id'], 'admin_activity_logs_reference_type_reference_id_index');
            $table->foreign('user_id', 'admin_activity_logs_user_id_foreign')->references('id')->on('users')->cascadeOnDelete();
        });

        $this->addMysqlChecks();
    }

    private function addMysqlChecks(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        foreach ([
            ['products', 'products_regular_price_positive', '`regular_price` > 0'],
            ['products', 'products_sale_price_valid', '`sale_price` IS NULL OR (`sale_price` >= 0 AND `sale_price` <= `regular_price`)'],
            ['products', 'products_weight_non_negative', '`weight` >= 0'],
            ['products', 'products_stock_status_allowed', "`stock_status` IN ('in_stock', 'low_stock', 'out_of_stock')"],
            ['products', 'products_status_allowed', "`status` IN ('draft', 'published', 'archived')"],
            ['product_variants', 'product_variants_stock_non_negative', '`stock` >= 0'],
            ['product_variants', 'product_variants_reserved_stock_non_negative', '`reserved_stock` >= 0'],
            ['product_variants', 'product_variants_reserved_stock_lte_stock', '`reserved_stock` <= `stock`'],
            ['product_variants', 'product_variants_regular_price_valid', '`regular_price` IS NULL OR `regular_price` > 0'],
            ['product_variants', 'product_variants_sale_price_valid', '`sale_price` IS NULL OR (`sale_price` >= 0 AND (`regular_price` IS NULL OR `sale_price` <= `regular_price`))'],
            ['cart_items', 'cart_items_quantity_positive', '`quantity` > 0'],
            ['cart_items', 'cart_items_price_non_negative', '`price_snapshot` >= 0'],
            ['orders', 'orders_order_status_allowed', "`order_status` IN ('pending_payment', 'paid', 'processing', 'ready_to_ship', 'shipment_created', 'shipped', 'delivered', 'completed', 'cancelled', 'payment_failed', 'payment_expired', 'shipment_failed', 'shipment_problem', 'lost', 'returned', 'refunded')"],
            ['orders', 'orders_payment_status_allowed', "`payment_status` IN ('pending', 'paid', 'manual_review', 'failed', 'cancelled', 'expired', 'refunded', 'partially_refunded')"],
            ['orders', 'orders_shipping_status_allowed', "`shipping_status` IN ('not_created', 'creating', 'confirmed', 'allocated', 'picked', 'in_transit', 'delivered', 'cancelled', 'failed', 'problem', 'lost', 'returned')"],
            ['order_items', 'order_items_price_non_negative', '`price` >= 0'],
            ['order_items', 'order_items_quantity_positive', '`quantity` > 0'],
            ['order_items', 'order_items_subtotal_non_negative', '`subtotal` >= 0'],
            ['order_items', 'order_items_weight_non_negative', '`weight` >= 0'],
            ['payments', 'payments_transaction_status_allowed', "`transaction_status` IS NULL OR `transaction_status` IN ('pending', 'capture', 'settlement', 'deny', 'cancel', 'expire', 'failure', 'refund', 'partial_refund', 'authorize', 'manual_review', 'snap_failed')"],
            ['shipments', 'shipments_shipping_status_allowed', "`shipping_status` IN ('not_created', 'creating', 'confirmed', 'allocated', 'picked', 'in_transit', 'delivered', 'cancelled', 'failed', 'problem', 'lost', 'returned')"],
        ] as [$table, $name, $expression]) {
            DB::statement("ALTER TABLE `{$table}` ADD CONSTRAINT `{$name}` CHECK ({$expression})");
        }
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('admin_activity_logs');
        Schema::dropIfExists('site_settings');
        Schema::dropIfExists('pages');
        Schema::dropIfExists('banners');
        Schema::dropIfExists('product_reviews');
        Schema::dropIfExists('wishlists');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('biteship_webhook_logs');
        Schema::dropIfExists('shipment_trackings');
        Schema::dropIfExists('shipments');
        Schema::dropIfExists('payment_logs');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('order_addresses');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('voucher_products');
        Schema::dropIfExists('voucher_categories');
        Schema::dropIfExists('vouchers');
        Schema::dropIfExists('cart_items');
        Schema::dropIfExists('carts');
        Schema::dropIfExists('stock_logs');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('product_collections');
        Schema::dropIfExists('products');
        Schema::dropIfExists('customer_addresses');
        Schema::dropIfExists('collections');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('failed_jobs');
        Schema::dropIfExists('job_batches');
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('cache_locks');
        Schema::dropIfExists('cache');
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
        Schema::enableForeignKeyConstraints();
    }
};
