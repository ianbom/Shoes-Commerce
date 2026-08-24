import { Link } from '@inertiajs/react';
import SeoHead from '@/components/seo-head';
import {
    ArrowRight,
    BadgeCheck,
    Box,
    ChevronLeft,
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
import { useEffect, useRef, useState } from 'react';
import type { ComponentType, ReactNode } from 'react';

import ShopLayout from '@/layouts/shop-layout';

type ProductCard = {
    id: number;
    slug: string;
    name: string;
    price: number;
    label: string | null;
    badge: string | null;
    image: string | null;
    category: string | null;
};

type BannerCard = {
    id: number;
    title: string;
    subtitle: string | null;
    image_desktop_url: string | null;
    image_mobile_url: string | null;
    button_text: string | null;
    button_url: string | null;
};

type CategoryCard = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
};

type Props = {
    heroBanners?: BannerCard[];
    categories?: CategoryCard[];
    flashDeals?: ProductCard[];
    newArrivals?: ProductCard[];
    mostLoved?: ProductCard[];
};

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

function CampaignCarousel({ banners }: { banners: BannerCard[] }) {
    const [activeSlide, setActiveSlide] = useState(0);
    const touchStartX = useRef<number | null>(null);

    const moveSlide = (offset: number) => {
        setActiveSlide(
            (currentSlide) =>
                (currentSlide + offset + banners.length) % banners.length,
        );
    };

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const interval = window.setInterval(() => moveSlide(1), 5000);

        return () => window.clearInterval(interval);
    }, [activeSlide]);

    return (
        <section
            aria-label="Featured campaigns"
            aria-roledescription="carousel"
            className="relative h-[200px] overflow-hidden rounded-[14px] sm:h-[260px] lg:h-[430px]"
            onTouchStart={(event) => {
                touchStartX.current = event.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
                const startX = touchStartX.current;
                const endX = event.changedTouches[0]?.clientX;

                touchStartX.current = null;

                if (startX === null || endX === undefined) {
                    return;
                }

                const distance = startX - endX;

                if (Math.abs(distance) < 40) {
                    return;
                }

                moveSlide(distance > 0 ? 1 : -1);
            }}
        >
            <div
                className="flex h-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
                {banners.map((banner) => (
                    <picture key={banner.id} className="h-full w-full shrink-0">
                        {banner.image_mobile_url && (
                            <source
                                media="(max-width: 639px)"
                                srcSet={banner.image_mobile_url}
                            />
                        )}
                        <img
                            src={banner.image_desktop_url ?? '/img/banner.png'}
                            alt={banner.title}
                            loading="lazy"
                            className="h-full w-full object-cover object-center"
                        />
                    </picture>
                ))}
            </div>

            <button
                type="button"
                onClick={() => moveSlide(-1)}
                className="absolute top-1/2 left-3 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink transition-colors hover:bg-white"
                aria-label="Previous campaign"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>
            <button
                type="button"
                onClick={() => moveSlide(1)}
                className="absolute top-1/2 right-3 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink transition-colors hover:bg-white"
                aria-label="Next campaign"
            >
                <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                {banners.map((banner, index) => (
                    <button
                        key={banner.id}
                        type="button"
                        onClick={() => setActiveSlide(index)}
                        className={`h-2 rounded-full transition-all ${
                            activeSlide === index
                                ? 'w-5 bg-white'
                                : 'w-2 bg-white/60 hover:bg-white'
                        }`}
                        aria-label={`Show campaign ${index + 1}`}
                        aria-current={activeSlide === index}
                    />
                ))}
            </div>
        </section>
    );
}

function ProductTile({ product }: { product: ProductCard }) {
    const currentPrice = product.price;
    const label = product.label ?? product.badge;

    return (
        <article className="group relative min-w-0 overflow-hidden rounded-[12px] border border-hairline bg-surface-subtle">
            <Link
                href={`/detail?product=${product.slug}`}
                aria-label={`View ${product.name}`}
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
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-105"
                            loading="lazy"
                        />
                    ) : null}
                </div>
                <div className="px-3 pb-4">
                    <h3 className="line-clamp-2 min-h-10 text-[16px] leading-5 text-ink uppercase">
                        {product.name}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="text-[14px] font-extrabold text-ink">
                            {money(currentPrice)}
                        </span>
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
    heroBanners = [],
    categories = [],
    flashDeals = [],
    newArrivals = [],
}: Props) {
    const banners = heroBanners.filter(
        (banner) =>
            banner && (banner.image_desktop_url || banner.image_mobile_url),
    );
    const campaignBanners = banners.length
        ? banners
        : [
              {
                  id: 0,
                  title: 'Featured products',
                  subtitle: null,
                  image_desktop_url: '/img/banner.png',
                  image_mobile_url: null,
                  button_text: null,
                  button_url: null,
              },
          ];
    const categoryLinks = categories.map((category) => ({
        label: category.name,
        href: `/list?category=${encodeURIComponent(category.slug)}`,
        icon: Footprints,
    }));

    return (
        <ShopLayout>
            <SeoHead
                title="GodKillerGoods | Premium Sneakers and Streetwear"
                description="Shop premium sneakers, limited releases, and streetwear essentials curated for everyday rotation at GodKillerGoods."
                canonical={`${window.location.origin}/`}
                image={`${window.location.origin}/img/sepatu-hero.png`}
                structuredData={[
                    {
                        '@context': 'https://schema.org',
                        '@type': 'Organization',
                        name: 'GodKillerGoods',
                        url: `${window.location.origin}/`,
                        logo: `${window.location.origin}/logo-shay/axegear-logo.webp`,
                    },
                    {
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        name: 'GodKillerGoods',
                        url: `${window.location.origin}/`,
                    },
                ]}
            />

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
                            aria-label="Search products, brands, or SKU"
                            placeholder="Search products, brands, or SKU"
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

                    <CampaignCarousel banners={campaignBanners} />

                    <section>
                        <SectionHeader
                            title="New Arrivals"
                            href="/list?type=new_arrival"
                            label="View All New Arrivals"
                        />
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
                            {newArrivals.map((product) => (
                                <ProductTile
                                    key={product.slug}
                                    product={product}
                                />
                            ))}
                        </div>
                    </section>

                    <section className="grid gap-4 md:grid-cols-2">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/list?category=${encodeURIComponent(category.slug)}`}
                                className="group relative min-h-[220px] overflow-hidden rounded-[14px] border border-hairline bg-surface-subtle p-7 sm:min-h-[250px]"
                            >
                                <div className="relative z-10 max-w-[180px]">
                                    <h2 className="text-[38px] leading-none text-ink uppercase sm:text-[44px]">
                                        {category.name}
                                    </h2>
                                    <p className="mt-3 text-[12px] leading-5 text-body">
                                        {category.description ??
                                            'Explore this category.'}
                                    </p>
                                    <span className="mt-6 inline-flex items-center gap-2 text-[12px] font-bold text-ink uppercase">
                                        Shop Now{' '}
                                        <ArrowRight className="size-4" />
                                    </span>
                                </div>
                                <img
                                    src={
                                        category.image_url ??
                                        '/img/all-product.webp'
                                    }
                                    alt=""
                                    className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/35 to-transparent" />
                            </Link>
                        ))}
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
