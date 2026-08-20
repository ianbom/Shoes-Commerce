import { Head, Link, router, usePoll } from '@inertiajs/react';
import { useState } from 'react';
import {
    destroyItem,
    saveAll,
    saveItem,
    selectCandidate,
} from '@/actions/App/Http/Controllers/Admin/ProductImportController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { PageHeader } from '@/pages/admin/catalog/shared';

type Candidate = {
    id?: string;
    slug?: string;
    title?: string;
    sku?: string;
    brand?: string;
    image?: string;
};
type Payload = {
    title?: string;
    sku?: string;
    brand?: string;
    category?: string;
    description?: string;
    image?: string;
    gallery?: string[];
    variants?: string[];
};
type Item = {
    id: number;
    source_title: string;
    source_sku: string | null;
    price_cny: string;
    price_idr: string;
    status: string;
    product_payload?: Payload;
    candidate_payload?: Candidate[];
};
type Batch = {
    id: number;
    status: string;
    discovered_count: number;
    matched_count: number;
    unmatched_count: number;
    duplicate_count: number;
    failed_count: number;
    saved_count: number;
    source_url: string;
};

export default function ProductImportsShow({
    batch,
    items,
}: {
    batch: Batch;
    items: { data: Item[] };
}) {
    const [detail, setDetail] = useState<Item | null>(null);
    usePoll(
        3000,
        {},
        {
            autoStart: ['pending', 'scraping', 'matching'].includes(
                batch.status,
            ),
        },
    );
    const save = (item: Item) =>
        router.post(saveItem.url({ batch: batch.id, item: item.id }));
    const saveEverything = () => router.post(saveAll.url(batch.id));
    const remove = (item: Item) => {
        if (window.confirm('Hapus produk ini dari preview import?')) {
            router.delete(destroyItem.url({ batch: batch.id, item: item.id }), {
                onSuccess: () => setDetail(null),
            });
        }
    };
    const choose = (item: Item, candidate: Candidate) =>
        router.post(
            selectCandidate.url({ batch: batch.id, item: item.id }),
            { kicksdb_id: candidate.id ?? candidate.slug ?? '' },
            { onSuccess: () => setDetail(null) },
        );

    return (
        <>
            <Head title="Preview Import Produk" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="Import Produk"
                    title={`Batch #${batch.id}`}
                    description={batch.source_url}
                />
                <div className="grid gap-3 md:grid-cols-6">
                    {[
                        ['Ditemukan', batch.discovered_count],
                        ['Cocok', batch.matched_count],
                        ['Tidak ditemukan', batch.unmatched_count],
                        ['Duplikat', batch.duplicate_count],
                        ['Gagal', batch.failed_count],
                        ['Tersimpan', batch.saved_count],
                    ].map(([label, value]) => (
                        <div
                            className="rounded-lg border bg-white p-4"
                            key={label as string}
                        >
                            <div className="text-xs text-muted-foreground">
                                {label}
                            </div>
                            <div className="text-2xl font-semibold">
                                {value}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/product-imports">
                        <Button variant="outline">Import Baru</Button>
                    </Link>
                    <Button onClick={saveEverything}>
                        Simpan Semua Produk Valid
                    </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {items.data.map((item) => (
                        <article
                            className="rounded-lg border bg-white p-3"
                            key={item.id}
                        >
                            {item.product_payload?.image && (
                                <img
                                    className="mb-2 aspect-[4/3] w-full rounded object-cover"
                                    src={item.product_payload.image}
                                    alt=""
                                />
                            )}
                            <h2 className="truncate text-sm font-semibold">
                                {item.product_payload?.title ??
                                    item.source_title}
                            </h2>
                            <p className="truncate text-xs text-muted-foreground">
                                SKU: {item.source_sku ?? '-'} · ¥
                                {item.price_cny}
                            </p>
                            <p className="text-xs">Status: {item.status}</p>
                            <div className="mt-2 flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setDetail(item)}
                                >
                                    Detail
                                </Button>
                                {item.status === 'ready' && (
                                    <Button onClick={() => save(item)}>
                                        Simpan
                                    </Button>
                                )}
                                {item.status !== 'saved' && (
                                    <Button
                                        variant="destructive"
                                        onClick={() => remove(item)}
                                    >
                                        Hapus
                                    </Button>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
            <ProductDetailDialog
                item={detail}
                onClose={() => setDetail(null)}
                onSelect={choose}
            />
        </>
    );
}

function ProductDetailDialog({
    item,
    onClose,
    onSelect,
}: {
    item: Item | null;
    onClose: () => void;
    onSelect: (item: Item, candidate: Candidate) => void;
}) {
    const payload = item?.product_payload;

    return (
        <Dialog
            open={item !== null}
            onOpenChange={(open) => !open && onClose()}
        >
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {payload?.title ??
                            item?.source_title ??
                            'Detail produk'}
                    </DialogTitle>
                    <DialogDescription>
                        Preview data produk, ukuran, dan kandidat serupa.
                    </DialogDescription>
                </DialogHeader>
                {item && (
                    <div className="space-y-4 text-sm">
                        <div className="grid gap-2 sm:grid-cols-2">
                            <div>
                                SKU: {payload?.sku ?? item.source_sku ?? '-'}
                            </div>
                            <div>
                                Harga: ¥{item.price_cny} · Rp {item.price_idr}
                            </div>
                            <div>Brand: {payload?.brand ?? '-'}</div>
                            <div>Kategori: {payload?.category ?? '-'}</div>
                        </div>
                        {payload?.description && (
                            <p className="rounded border p-3">
                                {payload.description}
                            </p>
                        )}
                        <div>
                            <h3 className="mb-2 font-semibold">Ukuran</h3>
                            <ul className="list-disc pl-5">
                                {(payload?.variants ?? []).map((variant) => (
                                    <li key={variant}>{variant}</li>
                                ))}
                            </ul>
                        </div>
                        {item.candidate_payload &&
                            item.candidate_payload.length > 0 && (
                                <div>
                                    <h3 className="mb-2 font-semibold">
                                        Kandidat serupa
                                    </h3>
                                    <div className="grid gap-2">
                                        {item.candidate_payload.map(
                                            (candidate) => (
                                                <div
                                                    className="flex items-center gap-3 rounded border p-2"
                                                    key={
                                                        candidate.id ??
                                                        candidate.slug
                                                    }
                                                >
                                                    <img
                                                        className="size-12 rounded object-cover"
                                                        src={candidate.image}
                                                        alt=""
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="font-medium">
                                                            {candidate.title ??
                                                                '-'}
                                                        </div>
                                                        <div className="text-muted-foreground">
                                                            {candidate.sku ??
                                                                '-'}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        onClick={() =>
                                                            onSelect(
                                                                item,
                                                                candidate,
                                                            )
                                                        }
                                                    >
                                                        Pilih
                                                    </Button>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
