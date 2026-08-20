import { Head, Link, router, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { destroy } from '@/actions/App/Http/Controllers/Admin/ProductImportController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader, Pagination } from '@/pages/admin/catalog/shared';

type Batch = {
    id: number;
    source_url: string;
    status: string;
    discovered_count: number;
    matched_count: number;
    unmatched_count: number;
    duplicate_count: number;
    failed_count: number;
    saved_count: number;
    created_at: string;
};

type Props = {
    batches: {
        data: Batch[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number | null;
        to: number | null;
        total: number;
        per_page?: number;
    };
};

export default function ProductImportsIndex({ batches }: Props) {
    const form = useForm({ source_url: '' });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post('/admin/product-imports');
    };
    const removeBatch = (batch: Batch) => {
        if (window.confirm(`Hapus riwayat import batch #${batch.id}?`)) {
            router.delete(destroy.url(batch.id));
        }
    };

    return (
        <>
            <Head title="Import Produk" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="Katalog"
                    title="Import Produk"
                    description="Import album Yupoo, cocokkan SKU melalui KicksDB."
                />
                {form.processing ? (
                    <div
                        aria-busy="true"
                        className="flex max-w-2xl items-center gap-3 rounded-lg border bg-white p-6"
                    >
                        <div className="size-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                        <div>
                            <p className="font-medium">
                                Mengambil data produk…
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Memproses album Yupoo dan mencocokkan SKU
                                KicksDB.
                            </p>
                        </div>
                    </div>
                ) : (
                    <form
                        onSubmit={submit}
                        className="max-w-2xl space-y-4 rounded-lg border bg-white p-6"
                    >
                        <Input
                            value={form.data.source_url}
                            onChange={(event) =>
                                form.setData('source_url', event.target.value)
                            }
                            placeholder="https://nama.x.yupoo.com/categories/..."
                        />
                        <Button disabled={form.processing}>Mulai Import</Button>
                        {form.errors.source_url && (
                            <p className="text-sm text-red-600">
                                {form.errors.source_url}
                            </p>
                        )}
                    </form>
                )}
                <section className="overflow-hidden rounded-lg border bg-white">
                    <div className="border-b px-5 py-4">
                        <h2 className="font-semibold">Riwayat Import</h2>
                        <p className="text-sm text-muted-foreground">
                            Batch import produk sebelumnya.
                        </p>
                    </div>
                    {batches.data.length === 0 ? (
                        <p className="p-8 text-center text-sm text-muted-foreground">
                            Belum ada riwayat import.
                        </p>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[840px] text-sm">
                                    <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3">Batch</th>
                                            <th className="px-4 py-3">
                                                Sumber
                                            </th>
                                            <th className="px-4 py-3">
                                                Status
                                            </th>
                                            <th className="px-4 py-3">
                                                Produk
                                            </th>
                                            <th className="px-4 py-3">
                                                Tersimpan
                                            </th>
                                            <th className="px-4 py-3">
                                                Dibuat
                                            </th>
                                            <th className="px-4 py-3 text-right">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {batches.data.map((batch) => (
                                            <tr
                                                className="border-t"
                                                key={batch.id}
                                            >
                                                <td className="px-4 py-3 font-medium">
                                                    #{batch.id}
                                                </td>
                                                <td className="max-w-72 truncate px-4 py-3 text-muted-foreground">
                                                    {batch.source_url}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {batch.status}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {batch.discovered_count}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {batch.saved_count}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {new Date(
                                                        batch.created_at,
                                                    ).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            asChild
                                                            size="sm"
                                                            variant="outline"
                                                        >
                                                            <Link
                                                                href={`/admin/product-imports/${batch.id}`}
                                                            >
                                                                Detail
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            onClick={() =>
                                                                removeBatch(
                                                                    batch,
                                                                )
                                                            }
                                                            size="sm"
                                                            variant="destructive"
                                                        >
                                                            Hapus
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-5 pb-5">
                                <Pagination paginator={batches} />
                            </div>
                        </>
                    )}
                </section>
            </div>
        </>
    );
}
