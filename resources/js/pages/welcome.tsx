import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    Box,
    ChevronRight,
    CircleDollarSign,
    Footprints,
    Gift,
    Globe2,
    Headphones,
    Heart,
    Leaf,
    PackageCheck,
    RotateCcw,
    Search,
    ShieldCheck,
    Sparkles,
    Star,
    Truck,
    Waves,
    Wind,
    Zap,
} from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';

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

const fallbackProducts: ProductCard[] = shoeImages.map((image, index) => ({
    id: index + 1,
    slug: `nexstep-sneaker-${index + 1}`,
    name: [
        'Nike Air Force 1 Low Retro QS Kobe Bryant',
        'Jordan 4 Retro Nigel Sylvester Brick',
        'Air Jordan 3 OG True Blue 2026',
        'Nike Air Force 1 Low Kobe Lakers Away',
        'Nike Air Force 1 Low Kobe Lakers Home',
        'Off White Virgil Abloh Archive X Air Jordan 1',
        'Nike Air Force 1 Low Court Purple',
        'Nike Air Force 1 Low Bryant Lakers Away',
        'Nike Air Force 1 Low Bryant Lakers Home',
        'Nina Chanel Abney X WMNS Jordan 3 Retro SP',
        'Air Jordan 3 Retro Spring',
        'Nike Kobe 8 Protro Mambacurial',
    ][index],
    price: 1097600 + index * 37200,
    sale_price: index < 5 ? 1449000 + index * 145000 : null,
    label:
        index < 5 ? ['New', 'New', 'Featured', '-26%', '-20%'][index] : 'New',
    image,
}));

const categoryCards = [
    {
        title: 'Running',
        description:
            'Lightweight, responsive sneakers for everyday performance.',
        image: '/welcome/image copy 2.png',
        href: '/list?search=running',
    },
    {
        title: 'Basketball',
        description: 'Built for the game. Engineered for every move.',
        image: '/welcome/image copy 3.png',
        href: '/list?search=basketball',
    },
    {
        title: 'Training',
        description: 'Support, stability, and comfort for every workout.',
        image: '/welcome/image.png',
        href: '/list?search=training',
    },
    {
        title: 'Lifestyle',
        description: 'Street-ready styles that move with your world.',
        image: '/welcome/image copy.png',
        href: '/list?search=lifestyle',
    },
];

const technologies: Array<{
    title: string;
    description: string;
    icon: ComponentType<{ className?: string; strokeWidth?: number }>;
}> = [
    {
        title: 'Aero Foam',
        description: 'Ultra-light foam for maximum comfort and energy return.',
        icon: Footprints,
    },
    {
        title: 'Flex Motion',
        description:
            'Flexible grooves for natural movement and smooth transitions.',
        icon: Waves,
    },
    {
        title: 'Grip Control',
        description: 'Advanced outsole for superior traction on any surface.',
        icon: Sparkles,
    },
    {
        title: 'Breath Tech',
        description: 'Breathable materials that keep your feet cool and dry.',
        icon: Wind,
    },
    {
        title: 'Heel Support',
        description: 'Reinforced support for stability and impact protection.',
        icon: ShieldCheck,
    },
    {
        title: 'Eco Materials',
        description: 'Sustainable materials for a cleaner future.',
        icon: Leaf,
    },
];

function money(value: number) {
    return new Intl.NumberFormat('id-ID', {
        currency: 'IDR',
        maximumFractionDigits: 0,
        style: 'currency',
    }).format(value);
}

function productName(product: ProductCard) {
    return product.name ?? product.title ?? 'GodKillerGoods Sneaker';
}

function mergeProducts(
    products: ProductCard[] | undefined,
    start: number,
    count: number,
) {
    const seen = new Set<number | string>();

    return [
        ...(products ?? []),
        ...fallbackProducts.slice(start),
        ...fallbackProducts,
    ]
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
    label,
}: {
    title: string;
    href: string;
    label: string;
}) {
    return (
        <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="text-[24px] leading-none text-ink uppercase sm:text-[26px]">
                {title}
            </h2>
            <Link
                href={href}
                className="inline-flex items-center gap-2 text-[12px] font-bold text-ink uppercase hover:text-primary"
            >
                {label}
                <ArrowRight className="size-4" />
            </Link>
        </div>
    );
}

function ProductTile({
    product,
    featured = false,
}: {
    product: ProductCard;
    featured?: boolean;
}) {
    const currentPrice = product.sale_price ?? product.price;
    const oldPrice = product.sale_price !== null ? product.price : null;
    const discount =
        oldPrice && oldPrice > currentPrice
            ? Math.round((1 - currentPrice / oldPrice) * 100)
            : null;
    const label = product.label ?? product.badge ?? (featured ? 'New' : null);
    const image = product.image ?? shoeImages[product.id % shoeImages.length];

    return (
        <article className="group relative min-w-0 overflow-hidden rounded-[12px] border border-hairline bg-surface-subtle">
            <Link
                href={`/detail?product=${product.slug}`}
                aria-label={`View ${productName(product)}`}
                className="block"
            >
                <div className="relative h-[155px] overflow-hidden sm:h-[180px] lg:h-[195px]">
                    {label ? (
                        <span className="absolute top-3 left-3 z-10 bg-ink px-2 py-1 text-[10px] leading-none text-white uppercase">
                            {label}
                        </span>
                    ) : null}
                    <Heart
                        className="absolute top-3 right-3 z-10 size-5 fill-white text-ink"
                        strokeWidth={1.7}
                    />
                    <img
                        src={image}
                        alt={productName(product)}
                        onError={(event) => {
                            event.currentTarget.src =
                                shoeImages[product.id % shoeImages.length];
                        }}
                        className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                </div>
                <div className="px-3 pb-4">
                    <h3 className="line-clamp-2 min-h-10 text-[16px] leading-5 text-ink uppercase">
                        {productName(product)}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="text-[14px] font-extrabold text-ink">
                            {money(currentPrice)}
                        </span>
                        {oldPrice ? (
                            <span className="text-[11px] text-muted-foreground line-through">
                                {money(oldPrice)}
                            </span>
                        ) : null}
                        {discount ? (
                            <span className="ml-auto text-[12px] font-extrabold text-primary">
                                -{discount}%
                            </span>
                        ) : null}
                    </div>
                </div>
            </Link>
        </article>
    );
}

function HeroTrustCard({
    icon: Icon,
    title,
    text,
}: {
    icon: ComponentType<{ className?: string; strokeWidth?: number }>;
    title: string;
    text: string;
}) {
    return (
        <div className="flex items-center gap-3 rounded-[10px] border border-black/5 bg-white px-4 py-3 shadow-dropdown">
            <Icon className="size-6 shrink-0 text-ink" />
            <div>
                <strong className="block text-[13px] leading-4 text-ink">
                    {title}
                </strong>
                <span className="text-[11px] leading-4 text-muted-foreground">
                    {text}
                </span>
            </div>
        </div>
    );
}

export default function Welcome({
    collections = [],
    hajjSeries = [],
    wePresent = [],
    recentAdditions = [],
}: Props) {
    const flashDeals = mergeProducts(hajjSeries, 0, 5);
    const arrivals = mergeProducts([...wePresent, ...recentAdditions], 5, 6);
    const categoryLinks = [
        { label: 'New Arrivals', href: '/list?type=new_arrival', icon: Star },
        {
            label: 'Best Sellers',
            href: '/list?type=best_seller',
            icon: BadgeCheck,
        },
        { label: 'Sneakers', href: '/list?search=sneakers', icon: Footprints },
        {
            label: 'Streetwear',
            href: '/list?search=streetwear',
            icon: Sparkles,
        },
        {
            label: 'Limited Drops',
            href: '/list?type=featured',
            icon: CircleDollarSign,
        },
        { label: 'View All', href: '/list', icon: Gift },
    ];

    return (
        <ShopLayout>
            <Head title="GodKillerGoods — Sneakers For Your Rhythm" />

            <div className="mx-auto max-w-[1440px] px-4 pt-4 pb-10 sm:px-7 lg:px-10">
                <section className="relative overflow-hidden rounded-[24px] border border-hairline bg-[radial-gradient(circle_at_68%_45%,#ffffff_0,#f7f7f7_48%,#f2f2f2_100%)] px-7 py-8 sm:px-10 md:min-h-[455px] md:px-8 md:py-10 lg:px-12">
                    <div className="pointer-events-none absolute inset-y-0 left-[34%] hidden text-[310px] leading-none text-black/[0.025] md:block">
                        N
                    </div>
                    <div className="relative grid items-center gap-5 md:grid-cols-[0.95fr_1.35fr_0.65fr] lg:gap-8">
                        <div className="z-10">
                            <p className="text-[13px] font-bold text-[#FA5400] uppercase">
                                New Drop Season
                            </p>
                            <h1 className="mt-4 max-w-[430px] text-[50px] leading-[0.88] tracking-[0.025em] text-ink uppercase sm:text-[52px] lg:text-[72px]">
                                Sneakers For Your Rhythm, Comfort, And The City
                            </h1>
                            <p className="mt-5 max-w-[390px] text-[14px] leading-6 text-body">
                                Premium sneakers, limited releases, and
                                streetwear essentials curated for everyday
                                rotation.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link
                                    href="/list?type=new_arrival"
                                    className="inline-flex h-12 items-center gap-2 rounded-[4px] bg-ink px-6 text-[13px] text-white uppercase hover:bg-primary"
                                >
                                    Shop New Arrivals{' '}
                                    <ArrowRight className="size-4" />
                                </Link>
                                <Link
                                    href="/list?type=best_seller"
                                    className="inline-flex h-12 items-center rounded-[4px] border border-ink bg-white px-6 text-[13px] text-ink uppercase hover:bg-ink hover:text-white"
                                >
                                    View Best Sellers
                                </Link>
                            </div>
                            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-semibold text-ink">
                                <span className="inline-flex items-center gap-2">
                                    <ShieldCheck className="size-4" />
                                    100% Authentic
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    <Truck className="size-4" />
                                    Fast Worldwide Shipping
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    <RotateCcw className="size-4" />
                                    Easy Returns
                                </span>
                            </div>
                        </div>

                        <div className="relative flex min-h-[280px] items-center justify-center md:min-h-[360px] lg:min-h-[390px]">
                            <div className="absolute inset-x-8 bottom-10 h-12 rounded-full bg-black/15 blur-xl" />
                            <img
                                src="/img/sepatu-hero.png"
                                alt="GodKillerGoods orange, black, and white high-top sneaker"
                                className="relative z-10 w-full max-w-[620px] scale-[1.35] -rotate-6 object-contain drop-shadow-[0_28px_22px_rgba(0,0,0,0.18)]"
                            />
                        </div>

                        <div className="z-10 grid gap-3 sm:grid-cols-3 md:grid-cols-1 lg:gap-4">
                            <HeroTrustCard
                                icon={ShieldCheck}
                                title="100% Authentic"
                                text="Guaranteed original"
                            />
                            <HeroTrustCard
                                icon={Globe2}
                                title="Fast Worldwide Shipping"
                                text="On all orders"
                            />
                            <HeroTrustCard
                                icon={RotateCcw}
                                title="Easy Returns"
                                text="Hassle-free returns"
                            />
                            <div className="mt-4 hidden items-center gap-3 rounded-full bg-white px-3 py-3 shadow-dropdown md:flex lg:mt-6 lg:px-4">
                                <div className="flex -space-x-2">
                                    {['AR', 'DM', 'SL', 'JP'].map(
                                        (initials, index) => (
                                            <span
                                                key={initials}
                                                className={`flex size-9 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white ${['bg-zinc-800', 'bg-amber-700', 'bg-stone-500', 'bg-zinc-950'][index]}`}
                                            >
                                                {initials}
                                            </span>
                                        ),
                                    )}
                                </div>
                                <div className="text-[11px] leading-4">
                                    <strong className="block text-ink">
                                        10,000+ collectors
                                    </strong>
                                    <span className="inline-flex items-center gap-1 text-body">
                                        4.9{' '}
                                        <span className="text-primary">
                                            ★★★★★
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-6 grid gap-3 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr]">
                    <form
                        action="/list"
                        method="get"
                        className="flex h-12 items-center rounded-full border border-hairline bg-white px-4 shadow-subtle"
                    >
                        <Search className="size-5 shrink-0 text-ink" />
                        <input
                            name="search"
                            aria-label="Search sneakers, brands, or collections"
                            placeholder="Search sneakers, brands, or collections"
                            className="h-full min-w-0 flex-1 border-0 bg-transparent px-3 text-[12px] outline-none"
                        />
                        <button
                            type="submit"
                            aria-label="Submit search"
                            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-white"
                        >
                            <Search className="size-4" />
                        </button>
                    </form>
                    <div className="flex gap-2 overflow-x-auto">
                        {categoryLinks.map(({ label, href, icon: Icon }) => (
                            <Link
                                key={label}
                                href={href}
                                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-[8px] border border-hairline px-4 text-[11px] text-ink uppercase hover:border-ink hover:bg-surface-soft"
                            >
                                <Icon className="size-4" />
                                {label}
                            </Link>
                        ))}
                    </div>
                </section>

                <main className="mt-7 space-y-8">
                    <section>
                        <SectionHeader
                            title="Weekly Flash Deals"
                            href="/list?type=discount"
                            label="View All Deals"
                        />
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                            {flashDeals.map((product) => (
                                <ProductTile
                                    key={product.slug}
                                    product={product}
                                />
                            ))}
                        </div>
                    </section>

                    <section>
                        <SectionHeader
                            title="New Arrivals"
                            href="/list?type=new_arrival"
                            label="View All New Arrivals"
                        />
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
                            {arrivals.map((product) => (
                                <ProductTile
                                    key={product.slug}
                                    product={product}
                                    featured
                                />
                            ))}
                        </div>
                    </section>

                    <section className="grid gap-4 md:grid-cols-2">
                        {categoryCards.map((category) => (
                            <Link
                                key={category.title}
                                href={category.href}
                                className="group relative min-h-[220px] overflow-hidden rounded-[14px] border border-hairline bg-surface-subtle p-7 sm:min-h-[250px]"
                            >
                                <div className="relative z-10 max-w-[180px]">
                                    <h2 className="text-[38px] leading-none text-ink uppercase sm:text-[44px]">
                                        {category.title}
                                    </h2>
                                    <p className="mt-3 text-[12px] leading-5 text-body">
                                        {category.description}
                                    </p>
                                    <span className="mt-6 inline-flex items-center gap-2 text-[12px] font-bold text-ink uppercase">
                                        Shop Now{' '}
                                        <ArrowRight className="size-4" />
                                    </span>
                                </div>
                                <img
                                    src={category.image}
                                    alt=""
                                    className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/0" />
                            </Link>
                        ))}
                    </section>

                    <section>
                        <h2 className="mb-4 text-[26px] leading-none text-ink uppercase">
                            Technology For Your Every Step
                        </h2>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
                            {technologies.map(
                                ({ title, description, icon: Icon }) => (
                                    <article
                                        key={title}
                                        className="flex min-h-[190px] flex-col items-center justify-center rounded-[12px] border border-hairline bg-surface-subtle px-5 py-6 text-center"
                                    >
                                        <Icon
                                            className="size-10 text-ink"
                                            strokeWidth={1.3}
                                        />
                                        <h3 className="mt-5 text-[17px] leading-none text-ink uppercase">
                                            {title}
                                        </h3>
                                        <p className="mt-3 text-[11px] leading-4 text-body">
                                            {description}
                                        </p>
                                    </article>
                                ),
                            )}
                        </div>
                    </section>

                    <section className="relative overflow-hidden rounded-[14px] bg-[linear-gradient(105deg,#121212_0%,#050505_55%,#161616_100%)] px-7 py-8 text-white sm:px-10 md:grid md:min-h-[190px] md:grid-cols-[210px_1fr_170px] md:items-center md:gap-5 lg:grid-cols-[250px_1fr_230px] lg:gap-8">
                        <div className="relative mx-auto h-36 w-56 -rotate-6 rounded-[10px] border border-white/10 bg-[linear-gradient(145deg,#252525,#080808)] p-6 shadow-modal md:mx-0">
                            <strong className="text-[29px] leading-[0.85] text-white uppercase">
                                GodKiller Goods
                                <br />
                                Club
                            </strong>
                            <span className="absolute right-5 bottom-5 flex size-8 items-center justify-center rounded-[6px] bg-white text-[18px] text-ink">
                                GG
                            </span>
                        </div>
                        <div className="mt-7 md:mt-0">
                            <h2 className="text-[38px] leading-none text-white uppercase">
                                Join The GodKillerGoods Club
                            </h2>
                            <p className="mt-3 max-w-[520px] text-[13px] leading-5 text-white/75">
                                Exclusive member benefits, early access to
                                drops, special offers, and more.
                            </p>
                            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-[10px] text-white/90">
                                <span className="inline-flex items-center gap-2">
                                    <Zap className="size-4" />
                                    Early Access to Drops
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    <CircleDollarSign className="size-4" />
                                    Member Only Discounts
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    <Gift className="size-4" />
                                    Exclusive Rewards
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    <Box className="size-4" />
                                    Birthday Surprises
                                </span>
                            </div>
                        </div>
                        <div className="mt-7 text-center md:mt-0">
                            <Link
                                href="/register"
                                className="inline-flex h-12 w-full items-center justify-center rounded-[3px] bg-[#FA5400] px-8 text-[15px] text-white uppercase hover:bg-[#E64800]"
                            >
                                Join Now
                            </Link>
                            <p className="mt-3 text-[11px] text-white/70">
                                Already a member?{' '}
                                <Link
                                    href="/login"
                                    className="text-primary underline"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </section>
                </main>
            </div>
        </ShopLayout>
    );
}

Welcome.layout = (page: ReactNode) => page;
