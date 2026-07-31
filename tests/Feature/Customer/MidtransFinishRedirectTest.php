<?php

use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

it('strips Midtrans finish query parameters before showing my orders', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('payments.midtrans.finish', [
            'order_id' => 'ORD-20260519-HEONQY',
            'status_code' => '200',
            'transaction_status' => 'settlement',
        ]))
        ->assertRedirect(route('my-order'));
});

it('syncs the authenticated user payment from Midtrans finish callback', function () {
    config(['services.midtrans.server_key' => 'server-key']);
    Http::fake([
        'https://api.sandbox.midtrans.com/v2/*/status' => Http::response([
            'order_id' => 'ORD-FINISH-SYNC',
            'transaction_id' => 'midtrans-transaction-id',
            'transaction_status' => 'settlement',
            'gross_amount' => '150000.00',
            'status_code' => '200',
            'payment_type' => 'bank_transfer',
        ]),
    ]);

    $user = User::factory()->create();
    $payment = createFinishPayment($user, 'ORD-FINISH-SYNC');

    $this->actingAs($user)
        ->get(route('payments.midtrans.finish', ['order_id' => 'ORD-FINISH-SYNC']))
        ->assertRedirect(route('my-order'))
        ->assertSessionHas('success');

    expect($payment->fresh()?->transaction_status)->toBe('settlement')
        ->and($payment->order->fresh()?->payment_status)->toBe('paid')
        ->and($payment->order->fresh()?->stock_finalized_at)->not->toBeNull();
});

it('does not sync another user payment from Midtrans finish callback', function () {
    config(['services.midtrans.server_key' => 'server-key']);
    Http::fake();

    $user = User::factory()->create();
    $anotherUser = User::factory()->create();
    createFinishPayment($anotherUser, 'ORD-FOREIGN');

    $this->actingAs($user)
        ->get(route('payments.midtrans.finish', ['order_id' => 'ORD-FOREIGN']))
        ->assertRedirect(route('my-order'))
        ->assertSessionHas('warning');

    Http::assertNothingSent();
});

function createFinishPayment(User $user, string $midtransOrderId): Payment
{
    $order = Order::query()->create([
        'user_id' => $user->id,
        'order_number' => 'ORD-'.Str::upper(Str::random(10)),
        'checkout_idempotency_key' => (string) Str::uuid(),
        'customer_name' => $user->name,
        'customer_email' => $user->email,
        'customer_phone' => '081234567890',
        'subtotal' => 150000,
        'grand_total' => 150000,
        'stock_reserved_at' => now(),
    ]);

    return Payment::query()->create([
        'order_id' => $order->id,
        'payment_provider' => 'midtrans',
        'midtrans_order_id' => $midtransOrderId,
        'transaction_status' => 'pending',
        'gross_amount' => 150000,
        'currency' => 'IDR',
    ]);
}
