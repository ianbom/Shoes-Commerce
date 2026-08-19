import { Link, router } from '@inertiajs/react';
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Package,
    Search,
    ShoppingCart,
    Truck,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import {
    index as orderIndex,
    show as orderShow,
} from '@/actions/App/Http/Controllers/Customer/OrderController';
import ProfileLayout from '@/layouts/profile-layout';

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Paginated<T> = {
    data: T[];
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
};

type OrderItem = {
    id: number;
    title: string;
    size: string | null;
    qty: number;
    image: string | null;
};

type Order = {
    id: number;
    order_number: string;
    created_date: string | null;
    created_time: string | null;
    payment_status: string;
    order_status: string;
    shipping_status: string;
    grand_total: number;
    items: OrderItem[];
    items_count: number;
    extra_items: number;
    shipment: {
        waybill_id: string | null;
        courier: string | null;
        service: string | null;
    };
    payment: {
        midtrans_redirect_url: string | null;
    };
};

type Filters = {
    search: string;
};

type Props = {
    orders: Paginated<Order>;
    filters: Filters;
};

const FALLBACK_IMAGE = '/img/hasan-almasi-_X2UAmIcpko-unsplash.webp';

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    })
        .format(price)
        .replace('Rp', 'Rp ');
};

const labelStatus = (status: string) => {
    const labels: Record<string, string> = {
        pending: 'Menunggu',
        pending_payment: 'Menunggu Pembayaran',
        paid: 'Dibayar',
        processing: 'Diproses',
        ready_to_ship: 'Siap Dikirim',
        shipped: 'Dikirim',
        delivered: 'Terkirim',
        completed: 'Selesai',
        cancelled: 'Dibatalkan',
        expired: 'Kedaluwarsa',
        failed: 'Gagal',
        created_at: 'Tanggal Dibuat',
        grand_total: 'Total',
    };

    if (labels[status]) {
        return labels[status];
    }

    return status
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const getStatusTextStyle = (_status: string) => 'text-black';

const cleanQuery = (filters: Filters) => {
    return Object.fromEntries(
        Object.entries(filters).filter(
            ([, value]) => value !== '' && value !== null,
        ),
    );
};

const cleanPageLabel = (label: string) => {
    return label.replace('&laquo;', '').replace('&raquo;', '').trim();
};

const canBuyAgain = (status: string) => {
    return status === 'delivered' || status === 'completed';
};

export default function ListOrder({ orders, filters }: Props) {
    const [form, setForm] = useState<Filters>({
        search: filters.search ?? '',
    });

    const visit = (next: Filters) => {
        router.get(orderIndex.url(), cleanQuery(next), {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        visit(form);
    };

    return (
        <ProfileLayout
            title="Pesanan Saya"
            pageTitle="Pesanan Saya"
            subtitle="Lacak dan kelola pembelian terbarumu."
            activePath="list-order"
            breadcrumbs={[
                { label: 'Beranda', href: '/' },
                { label: 'Akun Saya', href: '/my-profile' },
                { label: 'Pesanan Saya' },
            ]}
        >
            <form
                onSubmit={submit}
                className="mb-6 grid gap-3 lg:grid-cols-[1fr_auto]"
            >
                <div className="relative">
                    <Search
                        size={18}
                        className="absolute top-1/2 left-4 -translate-y-1/2 text-black/48"
                    />
                    <input
                        type="search"
                        value={form.search}
                        onChange={(event) =>
                            setForm((current) => ({
                                ...current,
                                search: event.target.value,
                            }))
                        }
                        placeholder="Cari nomor pesanan atau nama produk"
                        className="w-full border-b border-black/16 bg-transparent py-3 pr-4 pl-11 text-[13px] text-black transition-colors focus:border-black focus:outline-none"
                    />
                </div>
                <button
                    type="submit"
                    className="border-b border-black bg-transparent px-5 py-3 text-[12px] font-bold text-black transition-colors hover:border-black/60 hover:text-black/60"
                >
                    Cari
                </button>
            </form>

            {orders.data.length === 0 ? (
                <div className="flex flex-col items-center justify-center border-y border-black/16 px-6 py-20 text-center">
                    <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-black/16 bg-white text-black shadow-sm">
                        <div className="absolute inset-0 rounded-full bg-black/5 opacity-60 blur-xl" />
                        <ShoppingCart
                            size={38}
                            strokeWidth={1.7}
                            className="relative z-10"
                        />
                    </div>
                    <h2 className="mb-2 font-serif text-2xl text-black">
                        Pesanan tidak ditemukan
                    </h2>
                    <p className="mb-8 max-w-[280px] text-[13px] text-black/60">
                        Coba filter lain atau mulai jelajahi koleksi kami.
                    </p>
                    <Link
                        href="/list"
                        className="border-b border-black px-1 py-2 text-[12px] font-bold tracking-wider text-black transition-colors hover:border-black/60 hover:text-black/60"
                    >
                        Belanja Sekarang
                    </Link>
                </div>
            ) : (
                <div className="divide-y divide-black/16 border-y border-black/16">
                    {orders.data.map((order, idx) => (
                        <article
                            key={order.id}
                            className="py-6 transition-colors duration-300 hover:bg-black/5 md:py-7"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <div className="grid grid-cols-2 gap-4 px-1 md:grid-cols-4">
                                <div className="col-span-2 md:col-span-1">
                                    <p className="mb-1 font-serif text-[13px] text-black">
                                        Pesanan #{order.order_number}
                                    </p>
                                    <p className="text-[11px] text-black/60">
                                        {order.created_date ?? '-'} •{' '}
                                        {order.created_time ?? '-'}
                                    </p>
                                </div>
                                <div className="hidden md:block">
                                    <p className="mb-1 text-[10px] text-black/60">
                                        Pembayaran
                                    </p>
                                    <span
                                        className={`inline-block text-[10px] font-bold ${getStatusTextStyle(order.payment_status)}`}
                                    >
                                        {labelStatus(order.payment_status)}
                                    </span>
                                </div>
                                <div className="block md:hidden">
                                    <p className="mb-1 text-[10px] text-black/60">
                                        Total
                                    </p>
                                    <p className="font-serif text-[15px] text-black">
                                        {formatPrice(order.grand_total)}
                                    </p>
                                </div>
                                <div className="hidden md:block">
                                    <p className="mb-1 text-[10px] text-black/60">
                                        Total
                                    </p>
                                    <p className="font-serif text-[14px] text-black">
                                        {formatPrice(order.grand_total)}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end justify-center text-right md:items-end md:text-right">
                                    <p className="mb-1 hidden text-[10px] text-black/60 md:block">
                                        Status Pesanan
                                    </p>
                                    <span
                                        className={`inline-block text-[11px] font-bold ${getStatusTextStyle(order.order_status)}`}
                                    >
                                        {labelStatus(order.order_status)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col items-start justify-between gap-6 px-1 pt-5 lg:flex-row lg:items-center">
                                <div className="hide-scrollbar flex w-full flex-1 gap-4 overflow-x-auto pb-2 lg:pb-0">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex min-w-[260px] gap-4 md:min-w-0"
                                        >
                                            <div className="h-[100px] w-[80px] shrink-0 overflow-hidden rounded-xl bg-black/5">
                                                <img
                                                    src={
                                                        item.image ??
                                                        FALLBACK_IMAGE
                                                    }
                                                    alt={item.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0 py-1 pr-4">
                                                <h4 className="mb-1 line-clamp-2 max-w-[150px] text-[13px] leading-snug font-semibold text-black md:truncate">
                                                    {item.title}
                                                </h4>
                                                <p className="mb-1 text-[11px] text-black/60">
                                                    {item.size ?? '-'}
                                                </p>
                                                <p className="text-[11px] text-black/60">
                                                    Jml: {item.qty}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {order.extra_items > 0 && (
                                        <div className="flex h-[100px] w-[80px] shrink-0 flex-col items-center justify-center rounded-xl border border-black/16 text-black/60">
                                            <span className="font-serif text-lg text-black italic">
                                                +{order.extra_items}
                                            </span>
                                            <span className="text-[10px]">
                                                lagi
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 flex w-full shrink-0 flex-row gap-3 lg:mt-0 lg:w-[200px] lg:flex-col">
                                    {order.order_status ===
                                        'pending_payment' && (
                                        <a
                                            href={
                                                order.payment
                                                    .midtrans_redirect_url ??
                                                '/checkout'
                                            }
                                            target={
                                                order.payment
                                                    .midtrans_redirect_url
                                                    ? '_blank'
                                                    : undefined
                                            }
                                            rel={
                                                order.payment
                                                    .midtrans_redirect_url
                                                    ? 'noreferrer'
                                                    : undefined
                                            }
                                            className="flex-1 rounded-lg bg-black py-2.5 text-center text-[12px] font-bold text-white transition-colors hover:bg-black/80 lg:w-full"
                                        >
                                            Bayar Sekarang
                                        </a>
                                    )}
                                    {order.order_status === 'shipped' && (
                                        <Link
                                            href={orderShow.url(order.id)}
                                            className="flex-1 rounded-lg bg-black py-2.5 text-center text-[12px] font-bold text-white transition-colors hover:bg-black/80 lg:w-full"
                                        >
                                            Lacak Pesanan
                                        </Link>
                                    )}
                                    <Link
                                        href={orderShow.url(order.id)}
                                        className="flex-1 rounded-lg border border-black/16 bg-white py-2.5 text-center text-[12px] font-bold text-black transition-colors hover:border-black/48 hover:bg-black/5 lg:w-full"
                                    >
                                        Lihat Detail
                                    </Link>
                                    {canBuyAgain(order.order_status) && (
                                        <Link
                                            href="/list"
                                            className="flex-1 rounded-lg bg-black py-2.5 text-center text-[12px] font-bold text-white transition-colors hover:bg-black/80 lg:w-full"
                                        >
                                            Beli Lagi
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {order.order_status === 'shipped' && (
                                <div className="mt-6 hidden border-t border-black/16 px-5 pt-5 md:block md:px-8">
                                    <div className="relative z-10 mx-auto flex max-w-[600px] items-center justify-between">
                                        <div className="absolute top-4 right-[5%] left-[5%] -z-10 h-[2px] bg-black/16" />
                                        <div className="absolute top-4 left-[5%] -z-10 h-[2px] w-[60%] bg-black" />
                                        {[
                                            {
                                                label: 'Pesanan Dikonfirmasi',
                                                icon: Check,
                                                active: true,
                                            },
                                            {
                                                label: 'Dikemas',
                                                icon: Package,
                                                active: true,
                                            },
                                            {
                                                label: 'Dikirim',
                                                icon: Truck,
                                                active: true,
                                            },
                                            {
                                                label: 'Terkirim',
                                                icon: Check,
                                                active: false,
                                            },
                                        ].map((step) => {
                                            const Icon = step.icon;

                                            return (
                                                <div
                                                    key={step.label}
                                                    className="flex flex-col items-center"
                                                >
                                                    <div
                                                        className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${step.active ? 'border-black bg-black text-white' : 'border-black/16 text-black/48'}`}
                                                    >
                                                        <Icon
                                                            size={14}
                                                            strokeWidth={3}
                                                        />
                                                    </div>
                                                    <p
                                                        className={`mb-0.5 text-[10px] font-bold ${step.active ? 'text-black' : 'text-black/48'}`}
                                                    >
                                                        {step.label}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </article>
                    ))}

                    <div className="flex flex-col items-center justify-between gap-4 pt-8 pb-4 text-[12px] text-black/60 md:flex-row">
                        <span>
                            Menampilkan {orders.from ?? 0}-{orders.to ?? 0} dari{' '}
                            {orders.total} pesanan
                        </span>
                        <div className="flex flex-wrap justify-center gap-1">
                            {orders.links.map((link) => (
                                <PaginationButton
                                    key={`${link.label}-${link.url ?? 'disabled'}`}
                                    link={link}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </ProfileLayout>
    );
}

function PaginationButton({ link }: { link: PaginationLink }) {
    const label = cleanPageLabel(link.label);
    const content =
        label === 'Previous' ? (
            <ChevronLeft size={16} />
        ) : label === 'Next' ? (
            <ChevronRight size={16} />
        ) : (
            label
        );
    const className = `flex h-8 min-w-8 items-center justify-center border-b px-2 font-medium transition-colors ${link.active ? 'border-black text-black' : 'border-transparent text-black/60 hover:border-black/16 hover:text-black'}`;

    if (!link.url) {
        return <span className={`${className} opacity-40`}>{content}</span>;
    }

    return (
        <Link
            href={link.url}
            preserveScroll
            preserveState
            className={className}
        >
            {content}
        </Link>
    );
}
