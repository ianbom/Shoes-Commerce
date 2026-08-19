<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\CustomerAddress;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Services\Integrations\BiteshipService;
use App\Services\Integrations\MidtransService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

it('creates an order and returns the Midtrans payment URL', function () {
    [$user, $address, $variant] = checkoutPaymentFixture();
    bindCheckoutIntegrations([
        'token' => 'snap-token',
        'redirect_url' => 'https://app.sandbox.midtrans.com/snap/v4/redirection/snap-token',
    ]);

    selectCheckoutPaymentRate($this, $user, $address);

    $this->actingAs($user)
        ->postJson(route('checkout.place-order'), checkoutPaymentPayload($address))
        ->assertOk()
        ->assertJsonPath('redirect_url', 'https://app.sandbox.midtrans.com/snap/v4/redirection/snap-token');

    $order = Order::query()->with('payment')->firstOrFail();

    expect($order->items()->count())->toBe(1)
        ->and($order->shipment()->exists())->toBeTrue()
        ->and($order->address()->exists())->toBeTrue()
        ->and($order->payment?->transaction_status)->toBe('pending')
        ->and($variant->fresh()?->reserved_stock)->toBe(2)
        ->and(CartItem::query()->count())->toBe(0);
});

it('releases reservations and keeps the cart when Midtrans omits its payment URL', function () {
    [$user, $address, $variant] = checkoutPaymentFixture();
    bindCheckoutIntegrations(['token' => 'snap-token']);

    selectCheckoutPaymentRate($this, $user, $address);

    $this->actingAs($user)
        ->postJson(route('checkout.place-order'), checkoutPaymentPayload($address))
        ->assertUnprocessable()
        ->assertJsonValidationErrors('payment');

    expect(Order::query()->value('payment_status'))->toBe('failed')
        ->and(Payment::query()->value('transaction_status'))->toBe('snap_failed')
        ->and($variant->fresh()?->reserved_stock)->toBe(0)
        ->and(CartItem::query()->count())->toBe(1);
});

/**
 * @return array{User, CustomerAddress, ProductVariant}
 */
function checkoutPaymentFixture(): array
{
    $user = User::factory()->create();
    $address = CustomerAddress::query()->create([
        'user_id' => $user->id,
        'recipient_name' => 'Siti Aisyah',
        'recipient_phone' => '081234567890',
        'label' => 'Home',
        'province' => 'Jawa Barat',
        'city' => 'Bandung',
        'district' => 'Coblong',
        'subdistrict' => 'Dago',
        'postal_code' => '40135',
        'full_address' => 'Jl. Dipatiukur No. 10',
        'biteship_area_id' => 'IDNP6IDNC148IDND631IDZ40135',
        'latitude' => -6.8901000,
        'longitude' => 107.6102000,
        'is_default' => true,
    ]);
    $name = 'Checkout Product '.Str::random(8);
    $product = Product::query()->create([
        'name' => $name,
        'slug' => Str::slug($name).'-'.Str::lower(Str::random(6)),
        'price' => 100000,
        'weight' => 500,
        'status' => 'published',
    ]);
    $variant = ProductVariant::query()->create([
        'product_id' => $product->id,
        'sku' => 'CHECKOUT-'.Str::upper(Str::random(8)),
        'color_name' => 'Black',
        'size' => 'M',
        'stock' => 5,
        'reserved_stock' => 0,
        'is_active' => true,
    ]);
    $cart = Cart::query()->create(['user_id' => $user->id]);
    CartItem::query()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'product_variant_id' => $variant->id,
        'quantity' => 2,
        'product_name_snapshot' => $product->name,
        'variant_sku_snapshot' => $variant->size,
        'color_name_snapshot' => '',
        'size_snapshot' => $variant->size,
        'price_snapshot' => 100000,
    ]);

    return [$user, $address, $variant];
}

function bindCheckoutIntegrations(array $midtransResponse): void
{
    $rate = checkoutPaymentRate();
    $biteship = Mockery::mock(BiteshipService::class);
    $biteship->shouldReceive('shippingRates')->twice()->andReturn([$rate]);
    app()->instance(BiteshipService::class, $biteship);

    $midtrans = Mockery::mock(MidtransService::class);
    $midtrans->shouldReceive('createSnapTransaction')->once()->andReturn($midtransResponse);
    app()->instance(MidtransService::class, $midtrans);
}

function selectCheckoutPaymentRate($test, User $user, CustomerAddress $address): void
{
    $test->actingAs($user)
        ->postJson(route('checkout.shipping-rates'), ['customer_address_id' => $address->id])
        ->assertOk();

    $test->actingAs($user)
        ->postJson(route('checkout.shipping-rate'), ['shipping_rate_id' => checkoutPaymentRate()['id']])
        ->assertOk();
}

function checkoutPaymentPayload(CustomerAddress $address): array
{
    return [
        'customer_address_id' => $address->id,
        'shipping_rate_id' => checkoutPaymentRate()['id'],
        'idempotency_key' => (string) Str::uuid(),
        'voucher_code' => null,
        'notes' => null,
        'terms_agreed' => true,
    ];
}

function checkoutPaymentRate(): array
{
    return [
        'id' => 'jne-reg-15000',
        'courier_company' => 'jne',
        'courier_type' => 'reg',
        'courier_service_name' => 'Regular',
        'description' => 'Regular delivery',
        'duration' => '2 - 3 days',
        'price' => 15000.0,
        'raw' => [],
    ];
}
