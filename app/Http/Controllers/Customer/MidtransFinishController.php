<?php

namespace App\Http\Controllers\Customer;

use App\Actions\Payments\SyncMidtransPaymentAction;
use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Throwable;

class MidtransFinishController extends Controller
{
    public function __invoke(Request $request, SyncMidtransPaymentAction $syncPayment): RedirectResponse
    {
        $midtransOrderId = $request->string('order_id')->trim()->toString();

        if ($midtransOrderId === '') {
            return redirect()->route('my-order');
        }

        $payment = Payment::query()
            ->where('midtrans_order_id', $midtransOrderId)
            ->whereHas('order', fn ($query) => $query->where('user_id', $request->user()->id))
            ->first();

        if (! $payment) {
            return redirect()->route('my-order')->with('warning', 'Pembayaran tidak ditemukan.');
        }

        try {
            $syncPayment->execute($payment, 'customer_finish');
        } catch (Throwable $exception) {
            report($exception);

            return redirect()->route('my-order')->with('warning', 'Status pembayaran belum dapat disinkronkan. Silakan periksa kembali beberapa saat lagi.');
        }

        return redirect()->route('my-order')->with('success', 'Status pembayaran berhasil diperbarui.');
    }
}
