<?php

use App\Http\Controllers\Api\ProductImportPreviewController;
use App\Http\Controllers\Customer\BiteshipWebhookController;
use App\Http\Controllers\Customer\MidtransWebhookController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/payments/midtrans/notification', MidtransWebhookController::class)->name('payments.midtrans.notification');
Route::post('/shipments/biteship/webhook', BiteshipWebhookController::class)->name('shipments.biteship.webhook');

Route::prefix('product-import')->middleware('throttle:20,1')->group(function (): void {
    Route::get('/preview', [ProductImportPreviewController::class, 'preview'])->name('product-import.preview');
    Route::get('/lookup/{sku}', [ProductImportPreviewController::class, 'lookup'])->where('sku', '[A-Za-z0-9-]+')->name('product-import.lookup');
});
