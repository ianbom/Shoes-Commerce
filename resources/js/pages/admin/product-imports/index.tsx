import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/pages/admin/catalog/shared';

export default function ProductImportsIndex() {
    const form = useForm({ source_url: '' });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post('/admin/product-imports');
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
            </div>
        </>
    );
}
