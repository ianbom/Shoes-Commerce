<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['product_import_batch_id', 'source_album_url', 'source_title', 'source_sku', 'price_cny', 'price_idr', 'status', 'matched_kicksdb_id', 'selected_kicksdb_id', 'product_payload', 'candidate_payload', 'error_message', 'saved_product_id'])]
class ProductImportItem extends Model
{
    public function batch(): BelongsTo
    {
        return $this->belongsTo(ProductImportBatch::class, 'product_import_batch_id');
    }

    public function savedProduct(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'saved_product_id');
    }

    protected function casts(): array
    {
        return ['price_cny' => 'decimal:2', 'price_idr' => 'decimal:2', 'product_payload' => 'array', 'candidate_payload' => 'array'];
    }
}
