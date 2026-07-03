import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Truck,
} from 'lucide-react';
import type { ReactNode } from 'react';

import ShopLayout from '@/layouts/shop-layout';

type ProductCard = {
    id: number;
    slug: string;
    name?: string;
    title?: string;
    price: number;
    sale_price: number | null;
    label?: string | null;
    badge?: string | null;
    image: string | null;
    category?: string | null;
};

type BannerCard = {
    id: number;
    title: string;
    subtitle: string | null;
    image_desktop_url: string;
    image_mobile_url: string | null;
    button_text: string | null;
    button_url: string | null;
} | null;

type CollectionCard = {
    id?: number;
    name: string;
    slug: string;
};

type Props = {
    heroBanners?: BannerCard[];
    collections?: CollectionCard[];
    hajjSeries?: ProductCard[];
    wePresent?: ProductCard[];
    recentAdditions?: ProductCard[];
    mostLoved?: ProductCard[];
};

const shoeImages = [
    'https://ssl.images-ssl-jupiter.com/82023/2025/09/11/9/0/901bde9fdb7a964b.jpg?x-oss-process=image/resize,m_lfit,w_500,h_500/interlace,0/auto-orient,0',
    'https://us03-imgcdn.ymcart.com/82023/2025/01/19/6/0/60ab2f7423e1f43c.jpg?x-oss-process=image/resize,m_lfit,w_500,h_500/interlace,0/auto-orient,0',
    'https://us03-imgcdn.ymcart.com/82023/2024/12/06/0/3/03521cd2daf8e18a.jpg?x-oss-process=image/resize,m_lfit,w_500,h_500/interlace,0/auto-orient,0',
    'https://us03-imgcdn.ymcart.com/82023/2026/06/29/3/8/38785d0746d1a325.jpg?x-oss-process=image/resize,m_lfit,w_500,h_500/interlace,0/auto-orient,0',
    'https://us03-imgcdn.ymcart.com/82023/2026/07/02/e/d/ed784d7a5873b3b5.jpg?x-oss-process=image/resize,m_lfit,w_500,h_500/interlace,0/auto-orient,0',
    'https://us03-imgcdn.ymcart.com/82023/2026/07/02/2/8/281df476c0b5e543.jpg?x-oss-process=image/resize,m_lfit,w_500,h_500/interlace,0/auto-orient,0',
    'https://us03-imgcdn.ymcart.com/82023/2026/06/29/5/d/5df67c56443a8d00.jpg?x-oss-process=image/resize,m_lfit,w_500,h_500/interlace,0/auto-orient,0',
    'https://us03-imgcdn.ymcart.com/82023/2026/06/10/1/3/13f5923199c6bde2.jpg?x-oss-process=image/resize,m_lfit,w_500,h_500/interlace,0/auto-orient,0',
    'https://us03-imgcdn.ymcart.com/82023/2026/06/08/b/0/b071095333628466.jpg?x-oss-process=image/resize,m_lfit,w_500,h_500/interlace,0/auto-orient,0',
    'https://us03-imgcdn.ymcart.com/82023/2026/06/06/7/0/701b29ca8c8ccf2e.jpg?x-oss-process=image/resize,m_lfit,w_500,h_500/interlace,0/auto-orient,0',
    'https://us03-imgcdn.ymcart.com/82023/2026/06/04/c/1/c190a794178b01de.jpg?x-oss-process=image/resize,m_lfit,w_500,h_500/interlace,0/auto-orient,0',
    'https://us03-imgcdn.ymcart.com/82023/2026/06/03/4/e/4ec8bba9e9f8607f.jpg?x-oss-process=image/resize,m_lfit,w_500,h_500/interlace,0/auto-orient,0',
];

const lifestyleImages = [
    'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=1200&auto=format&fit=crop',
];

const fallbackProducts: ProductCard[] = [
    {
        id: 1,
        slug: 'nike-air-force-1-low-kobe-court-purple',
        name: 'Nike Air Force 1 Low Kobe Bryant Court Purple',
        price: 111,
        sale_price: 169,
        label: '-30%',
        image: shoeImages[0],
    },
    {
        id: 2,
        slug: 'nike-air-force-1-low-kobe-lakers-away',
        name: 'Nike Air Force 1 Low Kobe Lakers Away',
        price: 99,
        sale_price: 140,
        label: '-25%',
        image: shoeImages[1],
    },
    {
        id: 3,
        slug: 'nike-air-force-1-low-kobe-lakers-home',
        name: 'Nike Air Force 1 Low Kobe Lakers Home',
        price: 119,
        sale_price: 150,
        label: '-20%',
        image: shoeImages[2],
    },
    {
        id: 4,
        slug: 'jordan-3-retro-sp-bicoastal',
        name: 'Jordan 3 Retro SP Bicoastal',
        price: 114,
        sale_price: 160,
        label: '-25%',
        image: shoeImages[3],
    },
    {
        id: 5,
        slug: 'air-jordan-3-retro-spring',
        name: 'Air Jordan 3 Retro Spring',
        price: 115,
        sale_price: 145,
        label: '-20%',
        image: shoeImages[4],
    },
    {
        id: 6,
        slug: 'jordan-11-retro-cdg-white',
        name: 'Jordan 11 Retro CDG White',
        price: 129,
        sale_price: null,
        label: 'New',
        image: shoeImages[5],
    },
    {
        id: 7,
        slug: 'air-jordan-12-stealth',
        name: 'Air Jordan 12 Stealth',
        price: 142,
        sale_price: null,
        label: 'New',
        image: shoeImages[6],
    },
    {
        id: 8,
        slug: 'vans-lx-old-skool-pearlized',
        name: 'Vans LX Old Skool Pearlized',
        price: 159,
        sale_price: null,
        label: 'Limited',
        image: shoeImages[7],
    },
    {
        id: 9,
        slug: 'jordan-3-retro-brazil',
        name: 'Jordan 3 Retro Brazil',
        price: 119,
        sale_price: null,
        label: 'New',
        image: shoeImages[8],
    },
    {
        id: 10,
        slug: 'air-jordan-4-comic',
        name: 'Air Jordan 4 Comic 2026',
        price: 134,
        sale_price: null,
        label: 'New',
        image: shoeImages[9],
    },
    {
        id: 11,
        slug: 'air-jordan-13-flint',
        name: 'Air Jordan 13 Retro Flint',
        price: 109,
        sale_price: null,
        label: 'New',
        image: shoeImages[10],
    },
    {
        id: 12,
        slug: 'nike-kobe-8-protro-mambacurial',
        name: 'Nike Kobe 8 Protro Mambacurial',
        price: 139,
        sale_price: null,
        label: 'Limited',
        image: shoeImages[11],
    },
];

function money(value: number) {
    if (value > 9999) {
        return new Intl.NumberFormat('id-ID', {
            currency: 'IDR',
            maximumFractionDigits: 0,
            style: 'currency',
        }).format(value);
    }

    return `$${value.toFixed(2)}`;
}

function productName(product: ProductCard) {
    return product.name ?? product.title ?? 'NEXSTEP Sneaker';
}

function mergeProducts(
    products: ProductCard[] | undefined,
    start = 0,
    count = 4,
) {
    const merged = [
        ...(products ?? []),
        ...fallbackProducts.slice(start),
        ...fallbackProducts,
    ];
    const seen = new Set<number | string>();

    return merged
        .filter((product) => {
            const key = product.id ?? product.slug;

            if (seen.has(key)) {
                return false;
            }

            seen.add(key);

            return true;
        })
        .slice(0, count);
}

function SectionHeader({
    title,
    href,
    label = 'View All',
}: {
    title: string;
    href: string;
    label?: string;
}) {
    return (
        <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-[22px] leading-none font-extrabold text-ink">
                {title}
            </h2>
            <Link
                href={href}
                className="inline-flex items-center gap-2 text-[13px] font-bold text-ink hover:text-primary"
            >
                {label}
                <ArrowRight className="h-4 w-4" />
            </Link>
        </div>
    );
}

function ProductTile({
    product,
    compact = false,
}: {
    product: ProductCard;
    compact?: boolean;
}) {
    const oldPrice =
        product.sale_price && product.sale_price > product.price
            ? product.sale_price
            : null;
    const label = product.label ?? product.badge;
    const image = product.image ?? shoeImages[product.id % shoeImages.length];

    return (
        <article className="group relative overflow-hidden bg-white transition">
            {label ? (
                <span
                    className={`absolute top-3 left-3 z-10 px-2 py-1 text-[11px] leading-none font-extrabold ${label.toLowerCase().includes('new') ? 'bg-surface-soft text-ink' : 'bg-primary text-white'}`}
                >
                    {label.startsWith('-')
                        ? label
                        : label
                              .replace('SALE', 'Sale')
                              .replace('BEST SELLER', 'Best Seller')}
                </span>
            ) : null}
            <Link
                href={`/detail?product=${product.slug}`}
                aria-label={`View ${productName(product)}`}
                className="block"
            >
                <div
                    className={`${compact ? 'h-40' : 'h-56 md:h-64'} overflow-hidden bg-white`}
                >
                    <img
                        src={image}
                        alt={productName(product)}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                    />
                </div>
                <div className="pt-3 pb-4">
                    <p className="truncate text-[14px] font-semibold text-ink">
                        {productName(product)}
                    </p>
                    <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-[15px] font-extrabold text-ink">
                            {money(product.price)}
                        </span>
                        {oldPrice ? (
                            <span className="text-[12px] font-medium text-muted line-through">
                                {money(oldPrice)}
                            </span>
                        ) : null}
                    </div>
                </div>
            </Link>
        </article>
    );
}

function MiniProduct({ product }: { product: ProductCard }) {
    return (
        <Link
            href={`/detail?product=${product.slug}`}
            className="grid grid-cols-[72px_1fr] items-center gap-3 border border-hairline p-2 hover:border-hairline-strong"
        >
            <img
                src={product.image ?? shoeImages[0]}
                alt={productName(product)}
                className="h-16 w-full object-contain"
                loading="lazy"
            />
            <span>
                <span className="block truncate text-[12px] font-semibold text-ink">
                    {productName(product)}
                </span>
                <span className="mt-1 block text-[12px] font-extrabold text-ink">
                    {money(product.price)}
                </span>
            </span>
        </Link>
    );
}

export default function Welcome({
    heroBanners = [],
    collections = [],
    hajjSeries = [],
    wePresent = [],
    recentAdditions = [],
    mostLoved = [],
}: Props) {
    const flashDeals = mergeProducts(hajjSeries, 0, 5);
    const arrivals = mergeProducts(
        recentAdditions.length ? recentAdditions : wePresent,
        5,
        8,
    );
    const bestSellers = mergeProducts(mostLoved, 0, 6);
    const categoryProducts = mergeProducts(
        [...flashDeals, ...arrivals, ...bestSellers],
        0,
        16,
    );
    const heroImage =
        heroBanners.find(Boolean)?.image_desktop_url ?? shoeImages[0];
    const categoryNames =
        collections.length > 0
            ? collections.slice(0, 4).map((collection) => collection.name)
            : [
                  'Luxury Sneakers',
                  'Streetwear Essentials',
                  'Performance Classics',
                  'Warehouse Ready',
              ];

    return (
        <ShopLayout>
            <Head title="NEXSTEP" />

            <section className="relative overflow-hidden border-b border-hairline bg-white">
                <div className="absolute inset-y-0 right-0 hidden w-1/2 text-[220px] leading-none font-black text-surface-soft lg:block">
                    N
                </div>
                <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-10 sm:px-8 lg:min-h-[520px] lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-20">
                    <div className="relative z-10">
                        <p className="mb-4 text-[13px] font-extrabold text-primary uppercase">
                            New Drop Season
                        </p>
                        <h1 className="max-w-[620px] text-[50px] leading-[0.95] font-black tracking-[-0.04em] text-ink sm:text-[72px] lg:text-[84px]">
                            Step Into The Next Drop
                        </h1>
                        <p className="mt-5 max-w-[520px] text-[17px] leading-7 font-medium text-body">
                            Premium sneakers, limited releases, and streetwear
                            essentials curated for everyday rotation.
                        </p>
                        <div className="mt-7 flex flex-wrap gap-3">
                            <Link
                                href="/list?type=new_arrival"
                                className="inline-flex h-12 items-center gap-3 bg-primary px-6 text-[14px] font-extrabold text-white hover:bg-primary-hover"
                            >
                                Shop New Arrivals
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/list?type=best_seller"
                                className="inline-flex h-12 items-center border border-ink bg-white px-6 text-[14px] font-extrabold text-ink hover:bg-ink hover:text-white"
                            >
                                View Best Sellers
                            </Link>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-6 text-[12px] font-bold text-body">
                            {[
                                ['100% Authentic', BadgeCheck],
                                ['Fast Worldwide Shipping', Truck],
                                ['Easy Returns', RotateCcw],
                            ].map(([label, Icon]) => (
                                <span
                                    key={label as string}
                                    className="inline-flex items-center gap-2"
                                >
                                    <Icon className="h-5 w-5 text-ink" />
                                    {label as string}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="relative z-10 min-h-[320px]">
                        <img
                            src={'/img/sepatu-hero.png'}
                            alt="NEXSTEP hero sneaker"
                            className="mx-auto h-[320px] w-full object-contain drop-shadow-[0_24px_18px_rgba(17,17,17,0.14)] sm:h-[440px] lg:h-[500px]"
                        />
                    </div>
                </div>
            </section>

            <main className="mx-auto max-w-[1440px] px-5 py-5 sm:px-8 lg:px-20">
                <section className="mb-8">
                    <SectionHeader
                        title="Weekly Flash Deals"
                        href="/list?type=discount"
                        label="View All Deals"
                    />
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {flashDeals.map((product) => (
                            <ProductTile
                                key={product.slug}
                                product={product}
                                compact
                            />
                        ))}
                    </div>
                </section>

                <section className="mb-8">
                    <SectionHeader
                        title="New Arrivals"
                        href="/list?type=new_arrival"
                        label="View All New Arrivals"
                    />
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {arrivals.map((product) => (
                            <ProductTile key={product.slug} product={product} />
                        ))}
                    </div>
                </section>

                <section className="mb-8">
                    <SectionHeader
                        title="Best Sellers"
                        href="/list?type=best_seller"
                        label="View All Best Sellers"
                    />
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                        {bestSellers.map((product) => (
                            <ProductTile
                                key={product.slug}
                                product={product}
                                compact
                            />
                        ))}
                    </div>
                </section>

                <section className="mb-8 grid gap-4 border-y border-hairline py-6 lg:grid-cols-[320px_1fr]">
                    <div className="flex flex-col justify-center">
                        <h2 className="text-[34px] leading-[1] font-black tracking-[-0.03em] text-ink">
                            Built For Collectors, Styled For Everyday
                        </h2>
                        <p className="mt-4 text-[14px] leading-6 font-medium text-body">
                            From standout sneakers to street-ready gear, we have
                            got your every step.
                        </p>
                        <Link
                            href="/list"
                            className="mt-5 inline-flex h-11 w-fit items-center gap-2 bg-primary px-5 text-[13px] font-extrabold text-white hover:bg-primary-hover"
                        >
                            Explore The Collection
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                        {lifestyleImages.map((image, index) => (
                            <img
                                key={image}
                                src={image}
                                alt={`NEXSTEP editorial ${index + 1}`}
                                className="h-44 w-full object-cover md:h-56"
                                loading="lazy"
                            />
                        ))}
                    </div>
                </section>

                {/* <section className="mb-8 grid gap-32 md:grid-cols-2 xl:grid-cols-3">
                    {categoryNames.map((name, index) => (
                        <div key={name}>
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-[17px] font-extrabold text-ink">{name}</h3>
                                <Link href={`/list?search=${encodeURIComponent(name)}`} className="inline-flex items-center gap-1 text-[12px] font-bold text-ink hover:text-primary">
                                    View All <ArrowRight className="h-3 w-3" />
                                </Link>
                            </div>
                            <div className="grid gap-2">
                                {categoryProducts.slice(index * 4, index * 4 + 4).map((product) => <MiniProduct key={`${name}-${product.slug}`} product={product} />)}
                            </div>
                        </div>
                    ))}
                </section> */}
            </main>
        </ShopLayout>
    );
}

Welcome.layout = (page: ReactNode) => page;
