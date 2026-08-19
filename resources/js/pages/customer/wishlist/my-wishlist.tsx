import { Link, router } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import type { MouseEvent, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { destroy as removeWishlistItem } from '@/actions/App/Http/Controllers/Customer/WishlistController';
import ProfileLayout from '@/layouts/profile-layout';
import { detail, list } from '@/routes';

type WishlistItem = {
    id: number;
    slug: string;
    title: string;
    category: string | null;
    price: number;
    image: string | null;
    available_stock: number;
    is_available: boolean;
};

type WishlistSummary = {
    item_count: number;
};

type Props = {
    wishlistItems: WishlistItem[];
    summary: WishlistSummary;
};

const fallbackImages = [
    '/img/abdul-raheem-kannath-aNWfK46QWto-unsplash.webp',
    '/img/ainur-iman-qcNmigFPTQM-unsplash.webp',
    '/img/atiyeh-fathi-CvdzGjVX9DA-unsplash.webp',
    '/img/hasan-almasi-_X2UAmIcpko-unsplash.webp',
    '/img/ike-ellyana-2F70bGqQVa4-unsplash.webp',
];

const formatPrice = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    })
        .format(value)
        .replace('IDR', 'Rp')
        .trim();

export default function MyWishlist({ wishlistItems, summary }: Props) {
    const visibleWishlistItems = wishlistItems.filter(
        (item) => item.is_available,
    );

    return (
        <ProfileLayout
            title="Wishlist Saya"
            pageTitle="Wishlist Saya"
            subtitle="Simpan item favoritmu sebelum kehabisan."
            activePath="wishlist"
            breadcrumbs={[
                { label: 'Beranda', href: '/' },
                { label: 'Akun Saya', href: '/my-profile' },
                { label: 'Wishlist Saya' },
            ]}
        >
            <div className="min-w-0">
                <div className="mb-6 flex items-end justify-between border-b border-black/16 pb-4">
                    <div>
                        <p className="mb-1 text-[10px] font-semibold tracking-[0.24em] text-black/60 uppercase">
                            Item Tersimpan
                        </p>
                        <h2 className="text-[17px] font-medium tracking-wide text-black">
                            Koleksi Wishlist
                        </h2>
                    </div>

                    <div className="text-right text-[11px] font-semibold tracking-[0.18em] text-black/60 uppercase">
                        {summary.item_count} produk tersimpan
                    </div>
                </div>

                {visibleWishlistItems.length > 0 ? (
                    <div className="grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-3 md:gap-x-5 md:gap-y-10 xl:grid-cols-4">
                        {visibleWishlistItems.map((item, index) => (
                            <WishlistTile
                                key={item.id}
                                item={item}
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
                        <p className="text-sm font-semibold text-black">
                            Wishlist masih kosong
                        </p>
                        <p className="mt-2 max-w-sm text-[12px] leading-6 text-black/60">
                            Simpan produk favorit dari katalog agar mudah
                            ditemukan kembali.
                        </p>
                        <Link
                            href={list.url()}
                            className="mt-5 bg-black px-5 py-2 text-[11px] font-semibold tracking-wider text-white uppercase transition hover:bg-black/80"
                        >
                            Lihat Produk
                        </Link>
                    </div>
                )}
            </div>
        </ProfileLayout>
    );
}

function FadeInOnScroll({
    children,
    delay = 0,
}: {
    children: ReactNode;
    delay?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;

        if (!element) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { rootMargin: '0px 0px -12% 0px', threshold: 0.16 },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`h-full transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
                visible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-6 opacity-0'
            }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

function WishlistTile({ item, index }: { item: WishlistItem; index: number }) {
    const productHref = detail.url({ query: { product: item.slug } });

    const removeItem = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();

        router.delete(removeWishlistItem.url(item.id), {
            preserveScroll: true,
        });
    };

    return (
        <FadeInOnScroll delay={(index % 12) * 60}>
            <article className="group relative h-full border border-black/16 bg-white transition-colors hover:border-black/32">
                <Link href={productHref} className="block">
                    <div className="relative aspect-square overflow-hidden bg-white p-5 sm:p-6">
                        <img
                            src={
                                item.image ??
                                fallbackImages[index % fallbackImages.length]
                            }
                            alt={item.title}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.035]"
                        />
                    </div>
                </Link>

                <button
                    type="button"
                    aria-label="Hapus dari wishlist"
                    onClick={removeItem}
                    className="absolute top-3 right-3 z-10 flex size-10 items-center justify-center border border-black/16 bg-white text-black shadow-sm transition-colors hover:border-black hover:bg-black hover:text-white"
                >
                    <Heart
                        aria-hidden="true"
                        className="size-5 fill-current"
                        strokeWidth={2.2}
                    />
                </button>

                <Link
                    href={productHref}
                    className="block px-4 pt-1 pb-4 sm:px-5"
                >
                    <h3 className="line-clamp-1 font-display text-[20px] leading-5 font-extrabold tracking-[0.06em] text-black uppercase">
                        {item.title}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-[15px] leading-5 text-black/60">
                        {item.category ?? 'Performance Gear'}
                    </p>
                    <p className="mt-2 text-[18px] leading-none font-extrabold text-black">
                        {formatPrice(item.price)}
                    </p>
                </Link>
            </article>
        </FadeInOnScroll>
    );
}
