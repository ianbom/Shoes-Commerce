<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'product_id',
    'size',
    'price',
    'stock',
    'reserved_stock',
    'weight',
    'length',
    'width',
    'height',
    'image_url',
    'is_active',
])]
class ProductVariant extends Model
{
    use SoftDeletes;

    protected static function booted(): void
    {
        static::creating(function (self $variant): void {
            $variant->price ??= $variant->product()->value('price');
        });
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function stockLogs(): HasMany
    {
        return $this->hasMany(StockLog::class);
    }

    protected function casts(): array
    {
        return [
            'height' => 'integer',
            'is_active' => 'boolean',
            'length' => 'integer',
            'price' => 'decimal:2',
            'reserved_stock' => 'integer',
            'stock' => 'integer',
            'weight' => 'integer',
            'width' => 'integer',
        ];
    }
}
