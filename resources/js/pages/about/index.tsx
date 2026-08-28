import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';

import SeoHead from '@/components/seo-head';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import ShopLayout from '@/layouts/shop-layout';

type ComparisonImage = {
    id: string;
    src: string;
    alt: string;
    label: string;
    category: string;
    className: string;
    imageClassName?: string;
    marker?: 'good' | 'other';
};

const mainImages: ComparisonImage[] = [
    {
        id: 'outsole',
        src: '/why-us/image.png',
        alt: 'Retail reference and GodKillerGoods outsole comparison',
        label: 'RETAIL REFERENCE',
        category: 'OUTSOLE DETAIL',
        className:
            'col-span-2 row-span-3 md:col-span-3 md:row-span-4 lg:col-span-3 lg:row-span-5',
        imageClassName: 'object-contain',
    },
    {
        id: 'shape',
        src: '/why-us/image copy.png',
        alt: 'Side profile and heel shape comparison between retail and GodKillerGoods sneakers',
        label: 'GG',
        category: 'SHAPE',
        className:
            'col-span-1 row-span-4 md:col-span-3 md:row-span-4 lg:col-span-4 lg:row-span-5 lg:translate-y-8 lg:-rotate-[1.25deg]',
        marker: 'good',
    },
    {
        id: 'construction',
        src: '/why-us/image copy 2.png',
        alt: 'Inner bar construction comparison on a red sneaker',
        label: 'OTHER SAMPLE',
        category: 'CONSTRUCTION',
        className:
            'col-span-1 row-span-4 md:col-span-2 md:row-span-5 lg:col-span-2 lg:row-span-6 lg:translate-y-2',
        imageClassName: 'object-contain',
        marker: 'other',
    },
    {
        id: 'black-detail',
        src: '/why-us/image copy 3.png',
        alt: 'Black sneaker material, tongue, and outsole comparison details',
        label: 'GG QUALITY',
        category: 'MATERIAL & LABEL',
        className:
            'col-span-2 row-span-3 md:col-span-4 md:row-span-4 lg:col-span-3 lg:row-span-5 lg:-translate-y-4 lg:rotate-[0.75deg]',
        marker: 'good',
    },
    {
        id: 'logo-shape',
        src: '/why-us/image copy 4.png',
        alt: 'Side logo, toe box, and tongue comparison on a light sneaker',
        label: 'RETAIL REFERENCE',
        category: 'SIDE LOGO & TOE BOX',
        className:
            'col-span-2 row-span-3 md:col-span-3 md:row-span-4 lg:col-span-4 lg:row-span-5 lg:translate-y-6',
    },
    {
        id: 'tongue',
        src: '/why-us/image copy 5.png',
        alt: 'Retail, GodKillerGoods, and other sample tongue label comparison',
        label: 'GG',
        category: 'TONGUE LABEL',
        className:
            'col-span-1 row-span-4 md:col-span-3 md:row-span-5 lg:col-span-2 lg:row-span-6 lg:-rotate-[1deg]',
        imageClassName: 'object-contain',
        marker: 'good',
    },
    {
        id: 'color',
        src: '/why-us/image copy 6.png',
        alt: 'Retail, GodKillerGoods, and other sample panel color comparison',
        label: 'OTHER SAMPLE',
        category: 'COLOR & PANEL',
        className:
            'col-span-1 row-span-4 md:col-span-3 md:row-span-5 lg:col-span-3 lg:row-span-6 lg:translate-y-10',
        imageClassName: 'object-contain',
        marker: 'other',
    },
    {
        id: 'inside-label',
        src: '/why-us/image copy 7.png',
        alt: 'Retail, GodKillerGoods, and other sample inside label comparison',
        label: 'RETAIL REFERENCE',
        category: 'INSIDE LABEL',
        className:
            'col-span-2 row-span-3 md:col-span-2 md:row-span-5 lg:col-span-2 lg:row-span-6 lg:-translate-y-2 lg:rotate-[1.25deg]',
        imageClassName: 'object-contain',
    },
    {
        id: 'heel',
        src: '/why-us/image copy 8.png',
        alt: 'Retail, GodKillerGoods, and other sample heel logo comparison',
        label: 'GG QUALITY',
        category: 'HEEL EMBROIDERY',
        className:
            'col-span-1 row-span-4 md:col-span-4 md:row-span-4 lg:col-span-4 lg:row-span-5 lg:translate-y-4',
        imageClassName: 'object-contain',
        marker: 'good',
    },
    {
        id: 'apparel-finish',
        src: '/why-us/image copy 9.png',
        alt: 'Retail reference and GodKillerGoods product finishing comparison',
        label: 'GG',
        category: 'OVERALL FINISHING',
        className:
            'col-span-1 row-span-4 md:col-span-3 md:row-span-4 lg:col-span-3 lg:row-span-5 lg:-translate-y-6 lg:-rotate-[0.75deg]',
        imageClassName: 'object-contain',
        marker: 'good',
    },
    {
        id: 'button',
        src: '/why-us/image copy 10.png',
        alt: 'Retail reference and GodKillerGoods detail consistency comparison',
        label: 'RETAIL REFERENCE',
        category: 'DETAIL CONSISTENCY',
        className:
            'col-span-1 row-span-4 md:col-span-3 md:row-span-5 lg:col-span-2 lg:row-span-6 lg:translate-y-2',
        imageClassName: 'object-contain',
    },
    {
        id: 'print',
        src: '/why-us/image copy 11.png',
        alt: 'Retail reference and GodKillerGoods print proportion comparison',
        label: 'GG QUALITY',
        category: 'PRINT & PROPORTION',
        className:
            'col-span-2 row-span-3 md:col-span-3 md:row-span-4 lg:col-span-4 lg:row-span-5 lg:translate-y-8 lg:rotate-[1deg]',
        imageClassName: 'object-contain',
        marker: 'good',
    },
];

const detailImages: ComparisonImage[] = [
    {
        id: 'embroidery',
        src: '/why-us/image copy 12.png',
        alt: 'Embroidery comparison between retail and GodKillerGoods',
        label: 'GG',
        category: 'EMBROIDERY',
        className: 'col-span-2 row-span-4 md:col-span-3 md:row-span-5',
        imageClassName: 'object-contain',
        marker: 'good',
    },
    {
        id: 'back-print',
        src: '/why-us/image copy 13.png',
        alt: 'Back print comparison between retail and GodKillerGoods',
        label: 'RETAIL REFERENCE',
        category: 'PRINT POSITION',
        className: 'col-span-1 row-span-4 md:col-span-2 md:row-span-4',
        imageClassName: 'object-contain',
    },
    {
        id: 'surface',
        src: '/why-us/image copy 14.png',
        alt: 'Material surface and graphic comparison',
        label: 'GG QUALITY',
        category: 'MATERIAL',
        className:
            'col-span-1 row-span-4 md:col-span-3 md:row-span-5 md:translate-y-8',
        imageClassName: 'object-contain',
        marker: 'good',
    },
    {
        id: 'density',
        src: '/why-us/image copy 15.png',
        alt: 'Embroidery density comparison between retail and GodKillerGoods',
        label: 'GG',
        category: 'STITCHING',
        className: 'col-span-2 row-span-3 md:col-span-4 md:row-span-4',
        imageClassName: 'object-contain',
        marker: 'good',
    },
    {
        id: 'outsole-macro',
        src: '/why-us/image.png',
        alt: 'Macro crop of sneaker outsole comparison',
        label: 'OTHER SAMPLE',
        category: 'FINISHING',
        className:
            'col-span-1 row-span-4 md:col-span-2 md:row-span-5 md:-translate-y-5',
        imageClassName: 'object-cover object-bottom',
        marker: 'other',
    },
    {
        id: 'tongue-macro',
        src: '/why-us/image copy 5.png',
        alt: 'Macro crop of sneaker tongue label and stitching',
        label: 'RETAIL REFERENCE',
        category: 'LABEL',
        className: 'col-span-1 row-span-4 md:col-span-3 md:row-span-5',
        imageClassName: 'object-cover object-top',
    },
    {
        id: 'heel-macro',
        src: '/why-us/image copy 8.png',
        alt: 'Macro crop of sneaker heel embroidery comparison',
        label: 'GG QUALITY',
        category: 'COLOR',
        className:
            'col-span-2 row-span-3 md:col-span-3 md:row-span-4 md:translate-y-5',
        imageClassName: 'object-cover object-center',
        marker: 'good',
    },
];

const galleryImages = [...mainImages, ...detailImages];
const processSteps = [
    ['01', 'COMPARE', 'Kami membandingkan berbagai pilihan factory dan batch.'],
    [
        '02',
        'SELECT',
        'Produk dipilih berdasarkan detail, material, shape, warna dan finishing.',
    ],
    ['03', 'QC', 'Produk diperiksa kembali sebelum dikirim kepada customer.'],
] as const;
const qualityChecks = [
    'MODEL',
    'SKU',
    'SIZE',
    'COLOR',
    'SHAPE',
    'STITCHING',
    'MATERIAL',
    'OVERALL CONDITION',
];
const summaryRows = [
    'SINCE 2020',
    'GG QUALITY',
    'FACTORY & BATCH COMPARISON',
    'QC BEFORE SHIPPING',
    'REAL PRODUCT PHOTOS',
    'DIRECT SOURCING',
    'SPECIAL REQUEST',
    'SAFE PACKAGING',
    'CLAIM SUPPORT',
];
const realImages = [
    [
        '/why-us/image copy.png',
        'SIDE PROFILE',
        'On-hand side profile comparison of GodKillerGoods sneakers',
    ],
    [
        '/why-us/image copy 4.png',
        'DETAIL',
        'On-hand detail comparison of GodKillerGoods sneakers',
    ],
    [
        '/why-us/image copy 3.png',
        'ON-HAND / QC',
        'Quality control detail of a GodKillerGoods sneaker',
    ],
] as const;

export default function About() {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const selectedIndex = galleryImages.findIndex(
        (image) => image.id === selectedId,
    );
    const selectedImage = galleryImages[selectedIndex] ?? null;

    const moveLightbox = (direction: number) => {
        if (selectedIndex < 0) {
            return;
        }

        const nextIndex =
            (selectedIndex + direction + galleryImages.length) %
            galleryImages.length;
        setSelectedId(galleryImages[nextIndex].id);
    };

    return (
        <ShopLayout>
            <SeoHead
                title="Why Us | GodKillerGoods"
                description="Lihat detail yang menjadi dasar proses perbandingan, seleksi, dan quality control GodKillerGoods."
                canonical="/about"
                image="/why-us/image copy.png"
            />
            <div className="bg-white text-[#111111]">
                <section className="px-4 pt-24 pb-16 text-center sm:px-6 sm:pt-32 sm:pb-24 lg:px-10 lg:pt-40 lg:pb-32">
                    <div className="mx-auto flex max-w-[760px] flex-col items-center">
                        <p className="text-[11px] font-semibold tracking-[0.28em] text-[#FA5400] uppercase sm:text-xs">
                            Why GodKiller Goods
                        </p>
                        <h1 className="mt-5 text-[56px] leading-[0.86] font-black tracking-[-0.075em] uppercase sm:text-7xl lg:text-[112px]">
                            Why Us
                        </h1>
                        <div className="mt-8 flex max-w-[720px] flex-col gap-4 text-sm leading-7 text-[#757575] sm:mt-10 sm:text-base sm:leading-8">
                            <p>
                                Sejak 2020, GodKillerGoods berkomitmen
                                menghadirkan produk yang telah melalui proses
                                seleksi detail berdasarkan standar Godkiller
                                Goods Quality.
                            </p>
                            <p>
                                Kami membandingkan berbagai factory dan batch
                                untuk setiap model, mulai dari shape, material,
                                warna, stitching, embroidery hingga overall
                                finishing.
                            </p>
                        </div>
                    </div>
                </section>

                <section
                    aria-label="GodKillerGoods product comparison gallery"
                    className="mx-auto max-w-[1600px] px-3 sm:px-5 lg:px-8"
                >
                    <EditorialCollage
                        images={mainImages}
                        onSelect={setSelectedId}
                    />
                </section>

                <br/>
                <br/>

                <section
                    aria-labelledby="detail-comparison-title"
                    className="mx-auto max-w-[1500px] px-4 pb-32 sm:px-6 sm:pb-44 lg:px-10 lg:pb-56"
                >
                    <div className="mb-12 flex items-end justify-between gap-6 border-b border-[#E5E5E5] pb-5 sm:mb-16">
                        <div>
                            <p className="text-[11px] font-semibold tracking-[0.24em] text-[#757575] uppercase">
                                Detail Comparison
                            </p>
                            <h2
                                id="detail-comparison-title"
                                className="mt-3 text-4xl font-black tracking-[-0.055em] uppercase sm:text-6xl"
                            >
                                Evidence in every detail.
                            </h2>
                        </div>
                        <span className="hidden text-xs text-[#757575] sm:block">
                            06—08 DETAILS
                        </span>
                    </div>
                    <EditorialCollage
                        images={detailImages}
                        onSelect={setSelectedId}
                        compact
                    />
                </section>

                <section className="border-y border-[#E5E5E5]">
                    <div className="mx-auto grid max-w-[1500px] gap-16 px-4 py-28 sm:px-6 sm:py-36 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-44">
                        <div className="max-w-xl">
                            <p className="text-[11px] font-semibold tracking-[0.24em] text-[#757575] uppercase">
                                Real Product Pictures
                            </p>
                            <h2 className="mt-5 text-5xl leading-[0.9] font-black tracking-[-0.06em] uppercase sm:text-7xl lg:text-[92px]">
                                What you see
                                <br />
                                is what you get.
                            </h2>
                            <p className="mt-8 max-w-md text-base leading-8 text-[#757575]">
                                Semua foto yang kami tampilkan merupakan real
                                picture produk yang kami tangani.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                            {realImages.map(([src, label, alt], index) => (
                                <figure
                                    key={label}
                                    className={
                                        index === 0
                                            ? 'col-span-2'
                                            : index === 1
                                              ? 'md:translate-y-14'
                                              : 'md:translate-y-6'
                                    }
                                >
                                    <div className="h-[280px] overflow-hidden bg-[#F5F5F5] sm:h-[360px] lg:h-[460px]">
                                        <img
                                            src={src}
                                            alt={alt}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-300 ease-out hover:scale-[1.02]"
                                        />
                                    </div>
                                    <figcaption className="mt-3 text-[11px] font-semibold tracking-[0.18em] text-[#757575] uppercase">
                                        {label}
                                    </figcaption>
                                </figure>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            <Dialog
                open={selectedImage !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedId(null);
                    }
                }}
            >
                <DialogContent className="max-h-[94vh] max-w-[calc(100%-1rem)] gap-0 overflow-hidden rounded-none border-0 bg-[#111111] p-0 text-white shadow-none sm:max-w-6xl">
                    {selectedImage ? (
                        <div className="grid max-h-[94vh] lg:grid-cols-[1fr_320px]">
                            <div className="flex min-h-0 items-center justify-center bg-black p-3 sm:p-6">
                                <img
                                    src={selectedImage.src}
                                    alt={selectedImage.alt}
                                    className="max-h-[72vh] w-full object-contain lg:max-h-[88vh]"
                                />
                            </div>
                            <div className="flex flex-col justify-between gap-8 overflow-y-auto p-6 sm:p-8 lg:p-10">
                                <DialogHeader className="pr-8 text-left">
                                    <p className="text-[11px] font-semibold tracking-[0.2em] text-white/50 uppercase">
                                        {selectedImage.label}
                                    </p>
                                    <DialogTitle className="mt-3 text-3xl leading-none font-black tracking-[-0.04em] uppercase">
                                        {selectedImage.category}
                                    </DialogTitle>
                                    <DialogDescription className="mt-4 text-sm leading-7 text-white/60">
                                        Detail produk dibandingkan secara visual
                                        sebagai bagian dari proses seleksi
                                        GodKillerGoods.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex items-center justify-between border-t border-white/20 pt-5">
                                    <span className="text-xs text-white/50">
                                        {String(selectedIndex + 1).padStart(
                                            2,
                                            '0',
                                        )}{' '}
                                        / {galleryImages.length}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => moveLightbox(-1)}
                                            aria-label="View previous comparison image"
                                            className="inline-flex h-11 w-11 items-center justify-center border border-white/30 transition-colors hover:border-white hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => moveLightbox(1)}
                                            aria-label="View next comparison image"
                                            className="inline-flex h-11 w-11 items-center justify-center border border-white/30 transition-colors hover:border-white hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                        >
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </DialogContent>
            </Dialog>
        </ShopLayout>
    );
}

function EditorialCollage({
    images,
    onSelect,
    compact = false,
}: {
    images: ComparisonImage[];
    onSelect: (id: string) => void;
    compact?: boolean;
}) {
    const gridClassName = compact
        ? 'lg:[grid-auto-rows:64px]'
        : 'lg:[grid-auto-rows:72px]';

    return (
        <div
            className={[
                'grid grid-flow-dense [grid-auto-rows:68px] grid-cols-2 gap-3 sm:[grid-auto-rows:76px] sm:gap-4 md:[grid-auto-rows:58px] md:grid-cols-6 lg:grid-cols-12',
                gridClassName,
            ].join(' ')}
        >
            {images.map((image) => (
                <button
                    key={image.id}
                    type="button"
                    onClick={() => onSelect(image.id)}
                    aria-label={
                        'View ' +
                        image.category.toLowerCase() +
                        ' comparison detail'
                    }
                    className={[
                        'group relative min-h-0 overflow-hidden bg-[#F5F5F5] text-left focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FA5400]',
                        image.className,
                    ].join(' ')}
                >
                    <img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        className={[
                            'h-full w-full transition-transform duration-300 ease-out group-hover:scale-[1.025]',
                            image.imageClassName ?? 'object-cover',
                        ].join(' ')}
                    />
                    <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/35" />
                    <span className="absolute inset-x-0 bottom-0 flex translate-y-2 items-end justify-between gap-3 p-4 text-white opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                        <span>
                            <span className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] uppercase">
                                {image.marker ? (
                                    <span
                                        className={
                                            image.marker === 'good'
                                                ? 'h-1.5 w-1.5 rounded-full bg-[#39B96E]'
                                                : 'h-1.5 w-1.5 rounded-full bg-[#B35D5D]'
                                        }
                                    />
                                ) : null}
                                {image.label}
                            </span>
                            <span className="mt-1 block text-sm font-bold tracking-[-0.01em] uppercase sm:text-base">
                                {image.category}
                            </span>
                        </span>
                        <span className="hidden shrink-0 text-[10px] font-semibold tracking-[0.12em] uppercase sm:block">
                            View detail →
                        </span>
                    </span>
                </button>
            ))}
        </div>
    );
}

function ContactRow({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="grid grid-cols-[130px_1fr] gap-5 border-b border-[#E5E5E5] py-5 sm:grid-cols-[160px_1fr] sm:py-6">
            <dt className="text-[11px] font-semibold tracking-[0.14em] text-[#757575] uppercase">
                {label}
            </dt>
            <dd className="text-sm leading-6 font-medium sm:text-base">
                {value}
            </dd>
        </div>
    );
}
