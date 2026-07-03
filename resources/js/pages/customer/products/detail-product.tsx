import { Head, Link } from '@inertiajs/react';
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

import ShopLayout from '@/layouts/shop-layout';

const shoeImages = [
    '/img/sepatu-hero.png',
    'https://us03-imgcdn.ymcart.com/82023/2026/06/29/5/d/5df67c56443a8d00.jpg',
    'https://us03-imgcdn.ymcart.com/82023/2026/06/29/a/e/ae7749dad21cd2fa.jpg',
    'https://us03-imgcdn.ymcart.com/82023/2026/06/29/0/f/0fcf03763860ffd9.jpg',
    'https://us03-imgcdn.ymcart.com/82023/2026/06/29/2/1/2162e225505a295f.jpg',
];

const product = {
    name: 'Airform High OG',
    eyebrow: 'Basketball / Lifestyle',
    summary:
        'A premium high-top sneaker blending classic court heritage with modern everyday wear.',
    price: '$189.00',
    oldPrice: '$219.00',
    discount: 'Save $30',
    color: 'Black / White / Orange',
    rating: '4.7',
    reviews: 128,
};

const colors = ['#111111', '#E5E5E5', '#B8B8B8', '#124C87'];
const sizes = ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'];

const recommendations = [
    ['Court Legacy High', '$169.00', 'https://us03-imgcdn.ymcart.com/82023/2026/06/10/1/3/13f5923199c6bde2.jpg'],
    ['Urban Speed Mid', '$159.00', 'https://us03-imgcdn.ymcart.com/82023/2026/06/08/b/0/b071095333628466.jpg'],
    ['Rival Pro High', '$179.00', 'https://us03-imgcdn.ymcart.com/82023/2026/06/06/7/0/701b29ca8c8ccf2e.jpg'],
    ['Vintage Dunk High', '$149.00', 'https://us03-imgcdn.ymcart.com/82023/2026/06/04/c/1/c190a794178b01de.jpg'],
];

const outfits = [
    ['Essential Hoodie', '$89.00', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=700&auto=format&fit=crop'],
    ['Tech Fleece Joggers', '$79.00', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=700&auto=format&fit=crop'],
    ['NEXSTEP Cap', '$35.00', 'https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=700&auto=format&fit=crop'],
    ['Performance Crew Socks', '$16.00', 'https://us03-imgcdn.ymcart.com/82023/2026/06/29/a/e/aedcafdbcaaad837.jpg'],
];

const community = [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=900&auto=format&fit=crop',
    '/img/sepatu-hero.png',
];

const reviews = [
    ['Jason M.', 'May 8, 2024', 'Top-tier quality and comfort', 'The leather is premium and the fit is perfect. These go with everything.', '10'],
    ['Daniel K.', 'Apr 28, 2024', 'Classic look, modern feel', 'Love the heritage vibes with the cushioning. My new everyday pair.', '9.5'],
    ['Chris T.', 'Apr 15, 2024', 'Worth every penny', 'Materials and build quality are outstanding. Highly recommend.', '11'],
];

export default function DetailProduct() {
    const [image, setImage] = useState(shoeImages[0]);
    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [selectedSize, setSelectedSize] = useState('10');
    const [quantity, setQuantity] = useState(1);
    const [wishlisted, setWishlisted] = useState(false);

    const accordions = useMemo(
        () => [
            ['Product Description', product.summary],
            ['Key Features', 'Premium leather upper, cushioned collar, durable traction, and retro court shape.'],
            ['Material Details', 'Full-grain leather, textile lining, rubber outsole, and foam midsole.'],
            ['Size & Fit', 'Fits true to size. Choose your regular sneaker size for a locked-in feel.'],
            ['Shipping & Returns', 'Free standard shipping on orders over $150. 30-day easy returns.'],
        ],
        [],
    );

    return (
        <ShopLayout>
            <Head title={`${product.name} | NEXSTEP`} />

            <main className="bg-white text-ink">
                <div className="mx-auto max-w-[1440px] px-5 py-5 sm:px-8 lg:px-12">
                    <Breadcrumb />

                    <section className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
                        <div>
                            <ProductGallery image={image} setImage={setImage} />
                            <AccordionList items={accordions} />
                        </div>

                        <PurchasePanel
                            quantity={quantity}
                            selectedColor={selectedColor}
                            selectedSize={selectedSize}
                            wishlisted={wishlisted}
                            setQuantity={setQuantity}
                            setSelectedColor={setSelectedColor}
                            setSelectedSize={setSelectedSize}
                            setWishlisted={setWishlisted}
                        />
                    </section>

                    <ProductRow title="You May Also Like" products={recommendations} />
                    <ProductRow title="Style With" products={outfits} />
                    <CommunityStrip />
                    <ReviewsSection />
                </div>
            </main>
        </ShopLayout>
    );
}

function Breadcrumb() {
    return (
        <nav className="mb-6 flex items-center gap-3 text-[13px] font-medium text-muted-foreground">
            {['Home', 'Sneakers', 'Basketball'].map((item) => (
                <span key={item} className="flex items-center gap-3">
                    <Link href={item === 'Home' ? '/' : '/list'} className="hover:text-primary">
                        {item}
                    </Link>
                    <span>/</span>
                </span>
            ))}
            <span className="font-bold text-ink">Product Detail</span>
        </nav>
    );
}

function ProductGallery({
    image,
    setImage,
}: {
    image: string;
    setImage: (image: string) => void;
}) {
    return (
        <section>
            <div className="relative flex aspect-[1.05] min-h-[360px] items-center justify-center rounded-md bg-surface-soft p-8 sm:p-12">
                <span className="absolute top-5 left-5 rounded bg-primary-soft px-3 py-2 text-[12px] font-extrabold text-primary">
                    Limited Drop
                </span>
                <button
                    type="button"
                    className="absolute top-5 right-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-hairline bg-white hover:border-primary hover:text-primary"
                    aria-label="Zoom product image"
                >
                    <Search className="h-5 w-5" />
                </button>
                <img
                    src={image}
                    alt={product.name}
                    className="h-full max-h-[520px] w-full object-contain drop-shadow-[0_22px_18px_rgba(17,17,17,0.12)]"
                />
            </div>

            <div className="mt-5 grid grid-cols-[40px_1fr_40px] items-center gap-2">
                <button type="button" className="h-10 hover:text-primary" aria-label="Previous product image">
                    <ChevronLeft className="mx-auto h-6 w-6" />
                </button>
                <div className="grid grid-cols-4 gap-3">
                    {shoeImages.slice(0, 4).map((item) => (
                        <button
                            type="button"
                            key={item}
                            onClick={() => setImage(item)}
                            className={`aspect-[1.25] rounded-md border bg-surface-soft p-2 ${
                                image === item ? 'border-primary' : 'border-hairline hover:border-ink'
                            }`}
                        >
                            <img src={item} alt="" className="h-full w-full object-contain" />
                        </button>
                    ))}
                </div>
                <button type="button" className="h-10 hover:text-primary" aria-label="Next product image">
                    <ChevronRight className="mx-auto h-6 w-6" />
                </button>
            </div>
        </section>
    );
}

function PurchasePanel({
    quantity,
    selectedColor,
    selectedSize,
    wishlisted,
    setQuantity,
    setSelectedColor,
    setSelectedSize,
    setWishlisted,
}: {
    quantity: number;
    selectedColor: string;
    selectedSize: string;
    wishlisted: boolean;
    setQuantity: (quantity: number) => void;
    setSelectedColor: (color: string) => void;
    setSelectedSize: (size: string) => void;
    setWishlisted: (value: boolean) => void;
}) {
    return (
        <aside className="lg:sticky lg:top-24">
            <p className="text-[12px] font-extrabold tracking-wide text-ink uppercase">{product.eyebrow}</p>
            <h1 className="mt-2 text-[40px] leading-[1.02] font-black tracking-[-0.02em] text-ink sm:text-[48px]">
                {product.name}
            </h1>
            <p className="mt-3 max-w-[520px] text-[16px] leading-6 text-body">{product.summary}</p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="text-[32px] font-extrabold">{product.price}</span>
                <span className="text-[24px] font-bold text-muted-foreground line-through">{product.oldPrice}</span>
                <span className="rounded bg-primary-soft px-3 py-2 text-[12px] font-extrabold text-primary">
                    {product.discount}
                </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 border-b border-hairline pb-6">
                <Stars />
                <span className="text-[13px] font-bold">{product.rating}</span>
                <span className="h-4 w-px bg-hairline" />
                <span className="text-[13px] text-body">({product.reviews} reviews)</span>
                <span className="h-4 w-px bg-hairline" />
                <span className="text-[13px] font-extrabold text-primary">Best Seller</span>
            </div>

            <section className="mt-6">
                <p className="text-[14px] font-medium">
                    Color: <span className="font-bold">{product.color}</span>
                </p>
                <div className="mt-3 flex gap-3">
                    {colors.map((color) => (
                        <button
                            type="button"
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`grid h-10 w-10 place-items-center rounded-full border ${
                                selectedColor === color ? 'border-primary' : 'border-hairline'
                            }`}
                            aria-label={`Select color ${color}`}
                        >
                            <span className="h-7 w-7 rounded-full border border-hairline" style={{ backgroundColor: color }} />
                        </button>
                    ))}
                </div>
            </section>

            <section className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                    <p className="text-[14px] font-bold">Size:</p>
                    <button type="button" className="text-[13px] font-bold hover:text-primary">
                        Size Guide
                    </button>
                </div>
                <div className="grid grid-cols-6 gap-3">
                    {sizes.map((size) => (
                        <button
                            type="button"
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`h-11 rounded border text-[13px] font-bold ${
                                selectedSize === size
                                    ? 'border-ink bg-ink text-white'
                                    : 'border-hairline bg-white hover:border-ink'
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </section>

            <section className="mt-6">
                <p className="mb-3 text-[14px] font-bold">Quantity:</p>
                <div className="grid gap-3 sm:grid-cols-[130px_1fr_1fr]">
                    <div className="grid h-12 grid-cols-3 rounded border border-hairline">
                        <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">
                            <Minus className="mx-auto h-4 w-4" />
                        </button>
                        <span className="grid place-items-center text-[14px] font-bold">{quantity}</span>
                        <button type="button" onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">
                            <Plus className="mx-auto h-4 w-4" />
                        </button>
                    </div>
                    <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded bg-primary px-5 text-[14px] font-extrabold text-white hover:bg-[#E64800]">
                        <ShoppingBag className="h-4 w-4" />
                        Add to Cart
                    </button>
                    <button type="button" className="h-12 rounded border border-ink text-[14px] font-extrabold hover:bg-ink hover:text-white">
                        Buy Now
                    </button>
                </div>
                <button
                    type="button"
                    onClick={() => setWishlisted(!wishlisted)}
                    className="mx-auto mt-4 flex items-center gap-2 text-[14px] font-medium hover:text-primary"
                >
                    <Heart className="h-4 w-4" fill={wishlisted ? 'currentColor' : 'none'} />
                    Add to Wishlist
                </button>
            </section>

            <TrustGrid />
        </aside>
    );
}

function Stars() {
    return (
        <span className="flex items-center gap-0.5" aria-label="Rated 4.7 out of 5">
            {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-primary text-primary" />
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
            <div className="mt-7 grid gap-4 border-y border-hairline py-5 sm:grid-cols-3">
                {items.map(([title, body, Icon]) => (
                    <div key={title as string} className="flex gap-3">
                        <Icon className="mt-1 h-6 w-6 shrink-0" />
                        <div>
                            <p className="text-[13px] font-extrabold">{title as string}</p>
                            <p className="mt-1 text-[12px] leading-4 text-muted-foreground">{body as string}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-5 flex gap-4 rounded-md bg-surface-soft p-6">
                <Truck className="mt-1 h-8 w-8 shrink-0" />
                <div>
                    <p className="text-[14px] font-extrabold">Free Shipping & Easy Returns</p>
                    <p className="mt-1 text-[13px] leading-5 text-body">
                        Free standard shipping on all orders over $150. 30-day easy returns on unworn items in original condition.
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
                    <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-[14px] font-extrabold">
                        {title}
                        <Plus className="h-4 w-4 group-open:rotate-45" />
                    </summary>
                    <p className="px-5 pb-4 text-[13px] leading-5 text-body">{body}</p>
                </details>
            ))}
        </section>
    );
}

function ProductRow({ title, products }: { title: string; products: string[][] }) {
    return (
        <section className="mt-9">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[24px] font-extrabold tracking-[-0.01em]">{title}</h2>
                <Link href="/list" className="inline-flex items-center gap-2 text-[13px] font-bold hover:text-primary">
                    View All <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {products.map(([name, price, image]) => (
                    <Link key={name} href="/list" className="group rounded-md border border-hairline bg-white p-4 hover:border-hairline-strong">
                        <div className="relative aspect-[1.45] bg-surface-soft">
                            <img src={image} alt={name} className="h-full w-full object-contain p-4 transition group-hover:scale-[1.02]" loading="lazy" />
                            <Heart className="absolute top-3 right-3 h-5 w-5" />
                        </div>
                        <h3 className="mt-3 text-[14px] font-semibold">{name}</h3>
                        <p className="mt-1 text-[14px] font-extrabold">{price}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}

function CommunityStrip() {
    return (
        <section className="mt-9">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[24px] font-extrabold tracking-[-0.01em]">From The Community</h2>
                <Link href="/#reviews" className="inline-flex items-center gap-2 text-[13px] font-bold hover:text-primary">
                    View More <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                {community.map((image, index) => (
                    <img key={image} src={image} alt={`Community style ${index + 1}`} className="h-44 w-full rounded-md object-cover" loading="lazy" />
                ))}
            </div>
        </section>
    );
}

function ReviewsSection() {
    return (
        <section className="mt-9 mb-10">
            <h2 className="mb-5 text-[28px] font-extrabold tracking-[-0.01em]">What Sneakerheads Say</h2>
            <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
                <aside className="rounded-md border border-hairline p-5">
                    <div className="flex items-center gap-3">
                        <span className="text-[48px] font-black leading-none">4.7</span>
                        <Stars />
                    </div>
                    <p className="mt-2 text-[13px] text-body">Based on 128 reviews</p>
                    {[78, 15, 5, 1, 1].map((value, index) => (
                        <div key={index} className="mt-3 grid grid-cols-[24px_1fr_36px] items-center gap-2 text-[12px]">
                            <span>{5 - index}</span>
                            <span className="h-2 overflow-hidden rounded-full bg-surface-soft">
                                <span className="block h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
                            </span>
                            <span>{value}%</span>
                        </div>
                    ))}
                </aside>
                <div className="grid gap-5 md:grid-cols-3">
                    {reviews.map(([name, date, title, body, size]) => (
                        <article key={name} className="rounded-md border border-hairline p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="grid h-10 w-10 place-items-center rounded-full bg-surface-soft text-[13px] font-extrabold">
                                        {name.slice(0, 1)}
                                    </span>
                                    <span>
                                        <strong className="block text-[13px]">{name}</strong>
                                        <span className="text-[12px] text-muted-foreground">Verified Buyer</span>
                                    </span>
                                </div>
                                <span className="text-[12px] text-muted-foreground">{date}</span>
                            </div>
                            <div className="mt-4"><Stars /></div>
                            <h3 className="mt-3 text-[15px] font-extrabold">{title}</h3>
                            <p className="mt-2 text-[13px] leading-5 text-body">{body}</p>
                            <p className="mt-4 rounded bg-surface-soft px-3 py-2 text-[12px] text-body">
                                Size: {size} | Color: Black / White / Orange
                            </p>
                        </article>
                    ))}
                </div>
            </div>
            <div className="mt-6 text-center">
                <button type="button" className="h-11 rounded border border-ink px-12 text-[13px] font-extrabold hover:bg-ink hover:text-white">
                    View All Reviews
                </button>
            </div>
        </section>
    );
}
