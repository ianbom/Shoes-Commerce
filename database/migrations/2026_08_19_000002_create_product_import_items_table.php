<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_import_items', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('product_import_batch_id')->constrained()->cascadeOnDelete();
            $table->string('source_album_url', 700);
            $table->text('source_title');
            $table->string('source_sku', 100)->nullable();
            $table->decimal('price_cny', 15, 2)->nullable();
            $table->decimal('price_idr', 15, 2)->nullable();
            $table->string('status', 32)->default('pending');
            $table->string('matched_kicksdb_id')->nullable();
            $table->string('selected_kicksdb_id')->nullable();
            $table->json('product_payload')->nullable();
            $table->json('candidate_payload')->nullable();
            $table->text('error_message')->nullable();
            $table->foreignId('saved_product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->timestamps();
            $table->unique(['product_import_batch_id', 'source_album_url'], 'import_item_batch_album_unique');
            $table->index(['product_import_batch_id', 'status']);
            $table->index('source_sku');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_import_items');
    }
};
