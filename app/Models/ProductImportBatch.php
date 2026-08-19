<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['user_id', 'source_url', 'status', 'discovered_count', 'matched_count', 'unmatched_count', 'duplicate_count', 'failed_count', 'saved_count', 'error_message', 'started_at', 'finished_at'])]
class ProductImportBatch extends Model
{
    public function items(): HasMany
    {
        return $this->hasMany(ProductImportItem::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected function casts(): array
    {
        return ['started_at' => 'datetime', 'finished_at' => 'datetime'];
    }
}
