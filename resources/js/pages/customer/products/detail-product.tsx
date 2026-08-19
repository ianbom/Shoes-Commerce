import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Heart,
    Minus,
    Plus,
    RotateCcw,
    Search,
    ShieldCheck,
    ShoppingBag,
    Star,
    Truck,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { addProductVariantToCart } from '@/actions/App/Http/Controllers/Customer/CartController';
import ShopLayout from '@/layouts/shop-layout';
import { cart, login } from '@/routes';

type ProductVariant = {
    id: number;
    size: string | null;
    price: number;
    image_url: string | null;
    available_stock: number;
    cart_quantity: number;
};

// Helper to format price
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price);
};

const community = [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=900&auto=format&fit=crop',
    '/img/sepatu-hero.png',
];

export default function DetailProduct({
    product,
    relatedProducts,
    recentProducts,
}: any) {
    const { auth } = usePage().props;
    const images =
        product.images?.length > 0
            ? product.images.map((img: any) => img.url)
            : product.image
              ? [product.image]
              : ['/img/sepatu-hero.png'];

    const [image, setImage] = useState(images[0]);

    const availableSizes = product.sizes || [];
    const variants = (product.variants ?? []) as ProductVariant[];
    const initialVariant =
        variants.find(
            (variant) => variant.available_stock - variant.cart_quantity > 0,
        ) ?? variants[0];

    const [selectedSize, setSelectedSize] = useState(
        initialVariant?.size ?? '',
    );
    const [quantity, setQuantity] = useState(1);
    const [wishlisted, setWishlisted] = useState(
        product.is_wishlisted || false,
    );
    const [cartProcessing, setCartProcessing] = useState(false);

    const selectedVariant = variants.find(
        (variant) => variant.size === selectedSize,
    );
    const available_stock = selectedVariant
        ? Math.max(
              0,
              selectedVariant.available_stock - selectedVariant.cart_quantity,
          )
        : 0;

    const addToCart = (buyNow = false) => {
        if (!auth.user) {
            router.visit(login.url());

            return;
        }

        if (!selectedVariant || available_stock < quantity) {
            toast.error('Varian atau stok produk tidak tersedia.');

            return;
        }

        setCartProcessing(true);
        router.post(
            addProductVariantToCart.url(selectedVariant.id),
            { quantity },
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (buyNow) {
                        router.visit(cart.url());
                    }
                },
                onError: (errors) => {
                    toast.error(
                        String(
                            errors.quantity ??
                                errors.product_variant_id ??
                                'Produk gagal ditambahkan ke keranjang.',
                        ),
                    );
                },
                onFinish: () => setCartProcessing(false),
            },
        );
    };

    const accordions = useMemo(
        () => [
            [
                'Product Description',
                product.description || 'No description available.',
            ],
            ['Material & Fit', 'Premium materials. Fits true to size.'],
            [
                'Shipping & Returns',
                'Free standard shipping on orders over $150. 30-day easy returns.',
            ],
        ],
        [product],
    );

    return (
        <ShopLayout>
            <Head title={`${product.title} | NEXSTEP`} />

            <main className="bg-white text-ink">
                <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-8 sm:py-5 lg:px-12">
                    <Breadcrumb
                        category={product.category}
                        categorySlug={product.category_slug}
                        productName={product.title}
                    />

                    <section className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
                        <div>
                            <ProductGallery
                                image={image}
                                setImage={setImage}
                                images={images}
                            />

                            {/* Render rich text description if available */}
                            {product.description && (
                                <div
                                    className="prose prose-sm mt-8 max-w-none text-body"
                                    dangerouslySetInnerHTML={{
                                        __html: product.description,
                                    }}
                                />
                            )}

                            <AccordionList items={accordions} />
                        </div>

                        <PurchasePanel
                            product={product}
                            quantity={quantity}
                            selectedSize={selectedSize}
                            wishlisted={wishlisted}
                            availableSizes={availableSizes}
                            variants={variants}
                            available_stock={available_stock}
                            cartProcessing={cartProcessing}
                            addToCart={addToCart}
                            setQuantity={setQuantity}
                            setSelectedSize={setSelectedSize}
                            setWishlisted={setWishlisted}
                        />
                    </section>

                    {recentProducts && recentProducts.length > 0 && (
                        <ProductRow
                            title="Recently Viewed"
                            products={recentProducts}
                        />
                    )}
                </div>
            </main>
        </ShopLayout>
    );
}

function Breadcrumb({
    category,
    categorySlug,
    productName,
}: {
    category?: string;
    categorySlug?: string;
    productName: string;
}) {
    return (
        <nav className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-medium text-muted-foreground sm:mb-6 sm:gap-3 sm:text-[13px]">
            <span className="flex items-center gap-3">
                <Link href="/" className="hover:text-primary">
                    Home
                </Link>
                <span>/</span>
            </span>
            <span className="flex items-center gap-3">
                <Link href="/list" className="hover:text-primary">
                    Products
                </Link>
                <span>/</span>
            </span>
            {category && (
                <span className="flex items-center gap-3">
                    <Link
                        href={`/list?category=${categorySlug}`}
                        className="hover:text-primary"
                    >
                        {category}
                    </Link>
                    <span>/</span>
                </span>
            )}
            <span className="min-w-0 font-bold break-words text-ink">
                {productName}
            </span>
        </nav>
    );
}

function ProductGallery({
    image,
    setImage,
    images,
}: {
    image: string;
    setImage: (image: string) => void;
    images: string[];
}) {
    return (
        <section>
            <div className="relative flex aspect-square min-h-0 items-center justify-center overflow-hidden rounded-md sm:aspect-[1.05] sm:min-h-[360px]">
                <button
                    type="button"
                    className="absolute top-5 right-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-hairline bg-white hover:border-primary hover:text-primary"
                    aria-label="Zoom product image"
                >
                    <Search className="h-5 w-5" />
                </button>
                <img
                    src={image}
                    alt="Product preview"
                    className="h-full max-h-[520px] w-full object-cover"
                />
            </div>

            {images.length > 1 && (
                <div className="mt-3 grid grid-cols-[32px_minmax(0,1fr)_32px] items-center gap-1 sm:mt-5 sm:grid-cols-[40px_minmax(0,1fr)_40px] sm:gap-2">
                    <button
                        type="button"
                        className="h-10 hover:text-primary"
                        aria-label="Previous product image"
                    >
                        <ChevronLeft className="mx-auto h-6 w-6" />
                    </button>
                    <div className="grid min-w-0 grid-cols-4 gap-2 sm:gap-3">
                        {images.slice(0, 4).map((item, index) => (
                            <button
                                type="button"
                                key={index}
                                onClick={() => setImage(item)}
                                className={`aspect-[1.25] overflow-hidden rounded-md border ${
                                    image === item
                                        ? 'border-primary'
                                        : 'border-hairline hover:border-ink'
                                }`}
                            >
                                <img
                                    src={item}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                    <button
                        type="button"
                        className="h-10 hover:text-primary"
                        aria-label="Next product image"
                    >
                        <ChevronRight className="mx-auto h-6 w-6" />
                    </button>
                </div>
            )}
        </section>
    );
}

function PurchasePanel({
    product,
    quantity,
    selectedSize,
    wishlisted,
    availableSizes,
    variants,
    available_stock,
    cartProcessing,
    addToCart,
    setQuantity,
    setSelectedSize,
    setWishlisted,
}: any) {
    const isOutOfStock = available_stock <= 0;
    const selectedVariant = variants.find(
        (variant: ProductVariant) => variant.size === selectedSize,
    );
    const price = formatPrice(selectedVariant?.price ?? product.price);

    return (
        <aside className="lg:sticky lg:top-24">
            <p className="text-[12px] font-extrabold tracking-wide text-ink uppercase">
                {product.category || 'Product'}
            </p>
            <h1 className="mt-2 text-[32px] leading-[1.02] font-black tracking-[-0.02em] break-words text-ink sm:text-[48px]">
                {product.title}
            </h1>
            {product.description && (
                <p className="mt-3 max-w-[520px] text-[16px] leading-6 text-body">
                    {product.description.replace(/<[^>]*>/g, '')}
                </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="text-[28px] font-extrabold sm:text-[32px]">
                    {price}
                </span>
                {product.label && (
                    <span className="bg-primary-soft rounded px-3 py-2 text-[12px] font-extrabold text-primary">
                        {product.label}
                    </span>
                )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 border-b border-hairline pb-5 sm:gap-3 sm:pb-6">
                <Stars />
                <span className="text-[13px] font-bold">4.7</span>
                <span className="h-4 w-px bg-hairline" />
                <span className="text-[13px] text-body">(128 reviews)</span>
                {product.badge === 'BEST SELLER' && (
                    <>
                        <span className="h-4 w-px bg-hairline" />
                        <span className="text-[13px] font-extrabold text-primary">
                            Best Seller
                        </span>
                    </>
                )}
            </div>

            {availableSizes.length > 0 && (
                <section className="mt-5 sm:mt-6">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-[14px] font-bold">Size:</p>
                        <button
                            type="button"
                            className="text-[13px] font-bold hover:text-primary"
                        >
                            Size Guide
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {availableSizes.map((size: string) => {
                            const variant = variants.find(
                                (candidate: ProductVariant) =>
                                    candidate.size === size,
                            );
                            const unavailable =
                                !variant ||
                                variant.available_stock -
                                    variant.cart_quantity <=
                                    0;

                            return (
                                <button
                                    type="button"
                                    key={size}
                                    disabled={unavailable}
                                    onClick={() => {
                                        setSelectedSize(size);
                                        setQuantity(1);
                                    }}
                                    className={`h-11 min-w-[3rem] rounded border px-3 text-[13px] font-bold ${
                                        unavailable
                                            ? 'cursor-not-allowed border-hairline bg-surface-soft text-muted line-through'
                                            : selectedSize === size
                                              ? 'border-ink bg-ink text-white'
                                              : 'border-hairline bg-white hover:border-ink'
                                    }`}
                                >
                                    {size}
                                </button>
                            );
                        })}
                    </div>
                </section>
            )}

            <section className="mt-6">
                <p className="mb-3 text-[14px] font-bold">Quantity:</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[130px_1fr_1fr]">
                    <div className="grid h-12 w-full grid-cols-3 rounded border border-hairline sm:w-[130px]">
                        <button
                            type="button"
                            disabled={quantity <= 1 || cartProcessing}
                            onClick={() =>
                                setQuantity(Math.max(1, quantity - 1))
                            }
                            aria-label="Decrease quantity"
                        >
                            <Minus className="mx-auto h-4 w-4" />
                        </button>
                        <span className="grid place-items-center text-[14px] font-bold">
                            {quantity}
                        </span>
                        <button
                            type="button"
                            disabled={
                                quantity >= available_stock || cartProcessing
                            }
                            onClick={() =>
                                setQuantity(
                                    Math.min(available_stock, quantity + 1),
                                )
                            }
                            aria-label="Increase quantity"
                        >
                            <Plus className="mx-auto h-4 w-4" />
                        </button>
                    </div>
                    <button
                        type="button"
                        disabled={isOutOfStock || cartProcessing}
                        onClick={() => addToCart(false)}
                        className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded px-5 text-[14px] font-extrabold text-white ${isOutOfStock || cartProcessing ? 'cursor-not-allowed bg-muted' : 'bg-primary hover:bg-primary-hover'}`}
                    >
                        <ShoppingBag className="h-4 w-4" />
                        {isOutOfStock
                            ? 'Out of Stock'
                            : cartProcessing
                              ? 'Adding...'
                              : 'Add to Cart'}
                    </button>
                    <button
                        type="button"
                        disabled={isOutOfStock || cartProcessing}
                        onClick={() => addToCart(true)}
                        className={`h-12 w-full rounded border text-[14px] font-extrabold ${isOutOfStock || cartProcessing ? 'cursor-not-allowed border-hairline text-muted' : 'border-ink hover:bg-ink hover:text-white'}`}
                    >
                        {cartProcessing ? 'Processing...' : 'Buy Now'}
                    </button>
                </div>
            </section>

            <TrustGrid />
        </aside>
    );
}

function Stars() {
    return (
        <span
            className="flex items-center gap-0.5"
            aria-label="Rated 4.7 out of 5"
        >
            {Array.from({ length: 5 }).map((_, index) => (
                <Star
                    key={index}
                    className="h-4 w-4 fill-primary text-primary"
                />
            ))}
        </span>
    );
}

function TrustGrid() {
    const items = [
        ['100% Authentic', 'Genuine products guaranteed', ShieldCheck],
        ['Fast Shipping', 'Orders ship within 24 hours', Truck],
        ['Easy Returns', '30-day return policy', RotateCcw],
    ];

    return (
        <>
            <div className="mt-5 flex gap-3 rounded-md bg-surface-soft p-4 sm:gap-4 sm:p-6">
                <Truck className="mt-1 h-8 w-8 shrink-0" />
                <div>
                    <p className="text-[14px] font-extrabold">
                        Free Shipping & Easy Returns
                    </p>
                    <p className="mt-1 text-[13px] leading-5 text-body">
                        Free standard shipping on all orders over $150. 30-day
                        easy returns on unworn items in original condition.
                    </p>
                </div>
            </div>
        </>
    );
}

function AccordionList({ items }: { items: string[][] }) {
    return (
        <section className="mt-7 divide-y divide-hairline rounded-md border border-hairline">
            {items.map(([title, body], index) => (
                <details key={title} open={index === 0} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 text-[14px] font-extrabold sm:px-5">
                        {title}
                        <Plus className="h-4 w-4 group-open:rotate-45" />
                    </summary>
                    <p className="px-4 pb-4 text-[13px] leading-5 text-body sm:px-5">
                        {body}
                    </p>
                </details>
            ))}
        </section>
    );
}

function ProductRow({ title, products }: { title: string; products: any[] }) {
    return (
        <section className="mt-9">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[24px] font-extrabold tracking-[-0.01em]">
                    {title}
                </h2>
                <Link
                    href="/list"
                    className="inline-flex items-center gap-2 text-[13px] font-bold hover:text-primary"
                >
                    View All <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((p) => {
                    const price = formatPrice(p.price);
                    return (
                        <Link
                            key={p.id}
                            href={`/detail?product=${p.slug}`}
                            className="group block overflow-hidden rounded-md border border-hairline bg-white hover:border-hairline-strong"
                        >
                            <div className="relative aspect-[1.45]">
                                <img
                                    src={p.image || '/img/sepatu-hero.png'}
                                    alt={p.title}
                                    className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                                    loading="lazy"
                                />
                                <Heart
                                    className="absolute top-3 right-3 h-5 w-5"
                                    fill={
                                        p.is_wishlisted
                                            ? 'currentColor'
                                            : 'none'
                                    }
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-[14px] font-semibold">
                                    {p.title}
                                </h3>
                                <p className="mt-1 text-[14px] font-extrabold">
                                    {price}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

function CommunityStrip() {
    return (
        <section className="mt-9">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[24px] font-extrabold tracking-[-0.01em]">
                    From The Community
                </h2>
                <Link
                    href="/#reviews"
                    className="inline-flex items-center gap-2 text-[13px] font-bold hover:text-primary"
                >
                    View More <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                {community.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Community style ${index + 1}`}
                        className="h-44 w-full rounded-md object-cover"
                        loading="lazy"
                    />
                ))}
            </div>
        </section>
    );
}

function ReviewsSection() {
    const reviews = [
        [
            'Jason M.',
            'May 8, 2024',
            'Top-tier quality and comfort',
            'The leather is premium and the fit is perfect. These go with everything.',
            '10',
        ],
        [
            'Daniel K.',
            'Apr 28, 2024',
            'Classic look, modern feel',
            'Love the heritage vibes with the cushioning. My new everyday pair.',
            '9.5',
        ],
        [
            'Chris T.',
            'Apr 15, 2024',
            'Worth every penny',
            'Materials and build quality are outstanding. Highly recommend.',
            '11',
        ],
    ];

    return (
        <section className="mt-9 mb-10">
            <h2 className="mb-5 text-[28px] font-extrabold tracking-[-0.01em]">
                What Sneakerheads Say
            </h2>
            <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
                <aside className="rounded-md border border-hairline p-5">
                    <div className="flex items-center gap-3">
                        <span className="text-[48px] leading-none font-black">
                            4.7
                        </span>
                        <Stars />
                    </div>
                    <p className="mt-2 text-[13px] text-body">
                        Based on 128 reviews
                    </p>
                    {[78, 15, 5, 1, 1].map((value, index) => (
                        <div
                            key={index}
                            className="mt-3 grid grid-cols-[24px_1fr_36px] items-center gap-2 text-[12px]"
                        >
                            <span>{5 - index}</span>
                            <span className="h-2 overflow-hidden rounded-full bg-surface-soft">
                                <span
                                    className="block h-full rounded-full bg-primary"
                                    style={{ width: `${value}%` }}
                                />
                            </span>
                            <span>{value}%</span>
                        </div>
                    ))}
                </aside>
                <div className="grid gap-5 md:grid-cols-3">
                    {reviews.map(([name, date, title, body, size]) => (
                        <article
                            key={name}
                            className="rounded-md border border-hairline p-5"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="grid h-10 w-10 place-items-center rounded-full bg-surface-soft text-[13px] font-extrabold">
                                        {name.slice(0, 1)}
                                    </span>
                                    <span>
                                        <strong className="block text-[13px]">
                                            {name}
                                        </strong>
                                        <span className="text-[12px] text-muted-foreground">
                                            Verified Buyer
                                        </span>
                                    </span>
                                </div>
                                <span className="text-[12px] text-muted-foreground">
                                    {date}
                                </span>
                            </div>
                            <div className="mt-4">
                                <Stars />
                            </div>
                            <h3 className="mt-3 text-[15px] font-extrabold">
                                {title}
                            </h3>
                            <p className="mt-2 text-[13px] leading-5 text-body">
                                {body}
                            </p>
                            <p className="mt-4 rounded bg-surface-soft px-3 py-2 text-[12px] text-body">
                                Size: {size} | Color: Black / White / Orange
                            </p>
                        </article>
                    ))}
                </div>
            </div>
            <div className="mt-6 text-center">
                <button
                    type="button"
                    className="h-11 rounded border border-ink px-12 text-[13px] font-extrabold hover:bg-ink hover:text-white"
                >
                    View All Reviews
                </button>
            </div>
        </section>
    );
}
