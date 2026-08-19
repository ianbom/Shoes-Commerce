import { Head, Link, useForm } from '@inertiajs/react';
import { ImageIcon, Save } from 'lucide-react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PageHeader } from '@/pages/admin/catalog/shared';

type Product = { id: number; name: string };
type Variant = {
    id: number;
    product_id: number;
    product: string | null;
    size: string;
    price: string | number | null;
    stock: number;
    reserved_stock: number;
    weight: number | null;
    length: number | null;
    width: number | null;
    height: number | null;
    image_url: string | null;
    is_active: boolean;
};
type Props = {
    mode: 'create' | 'edit';
    variant: Variant | null;
    products: Product[];
    selectedProductId: number | null;
};
const inputClass =
    'h-11 border-black bg-white focus-visible:border-black focus-visible:ring-black';
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const selectClass =
    'admin-form-select h-11 rounded-md border border-black bg-white px-3 text-sm focus:border-black focus:ring-2 focus:ring-black/20 focus:outline-none disabled:bg-black/[0.04]';

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            {children}
            <InputError message={error} />
        </div>
    );
}

export default function ProductVariantForm({
    mode,
    variant,
    products,
    selectedProductId,
}: Props) {
    const isEdit = mode === 'edit' && variant !== null;
    const [clientErrors, setClientErrors] = useState<Record<string, string>>(
        {},
    );
    const [preview, setPreview] = useState<string | null>(
        variant?.image_url ?? null,
    );
    const { data, setData, post, processing, errors } = useForm({
        _method: isEdit ? 'PUT' : 'POST',
        product_id: variant?.product_id ?? selectedProductId ?? '',
        size: variant?.size ?? '',
        price: variant?.price ?? '',
        stock: variant?.stock ?? 0,
        reserved_stock: variant?.reserved_stock ?? 0,
        weight: variant?.weight ?? '',
        length: variant?.length ?? '',
        width: variant?.width ?? '',
        height: variant?.height ?? '',
        image: null as File | null,
        is_active: variant?.is_active ?? true,
    });
    const available = Math.max(
        0,
        Number(data.stock) - Number(data.reserved_stock),
    );
    const label = data.size || 'Variant';
    const fieldError = (key: string) =>
        clientErrors[key] ??
        (errors as Record<string, string | undefined>)[key];
    const setClientError = (key: string, message?: string) =>
        setClientErrors((current) => {
            if (!message) {
                const remaining = { ...current };
                delete remaining[key];

                return remaining;
            }

            return { ...current, [key]: message };
        });
    const selectImage = (event: ChangeEvent<HTMLInputElement>) => {
        const image = event.target.files?.[0] ?? null;

        if (image && image.size > MAX_IMAGE_SIZE) {
            setClientError('image', 'Ukuran gambar maksimal 4 MB.');
            event.target.value = '';

            return;
        }

        setClientError('image');
        setData('image', image);
        setPreview(
            image ? URL.createObjectURL(image) : (variant?.image_url ?? null),
        );
    };
    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (Object.keys(clientErrors).length > 0) {
            return;
        }

        post(
            isEdit
                ? `/admin/product-variants/${variant.id}`
                : '/admin/product-variants',
            { forceFormData: true },
        );
    };

    return (
        <>
            <Head title={isEdit ? `Edit ${label}` : 'Create Variant'} />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="Catalog"
                    title={isEdit ? 'Edit variant' : 'Create variant'}
                    description="Varian adalah ukuran produk dengan harga dan stok sendiri."
                    action={
                        <Button variant="outline" asChild>
                            <Link href="/admin/product-variants">Cancel</Link>
                        </Button>
                    }
                />
                <form
                    onSubmit={submit}
                    className="grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_260px]"
                >
                    <Card className="border-zinc-200 shadow-none">
                        <CardHeader>
                            <CardTitle>Variant information</CardTitle>
                            <CardDescription>
                                Perubahan stok akan dicatat ke stock logs.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5 md:grid-cols-2">
                            <Field label="Product" error={errors.product_id}>
                                <select
                                    disabled={isEdit}
                                    className={selectClass}
                                    value={data.product_id}
                                    onChange={(event) =>
                                        setData(
                                            'product_id',
                                            event.target.value,
                                        )
                                    }
                                    required
                                >
                                    <option value="">Select product</option>
                                    {products.map((product) => (
                                        <option
                                            key={product.id}
                                            value={product.id}
                                        >
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Size" error={errors.size}>
                                <Input
                                    className={inputClass}
                                    value={data.size}
                                    onChange={(event) =>
                                        setData('size', event.target.value)
                                    }
                                    placeholder="EU 42"
                                    required
                                />
                            </Field>
                            <Field label="Price" error={fieldError('price')}>
                                <Input
                                    className={inputClass}
                                    type="number"
                                    min="0"
                                    value={data.price}
                                    onChange={(event) =>
                                        setData('price', event.target.value)
                                    }
                                    required
                                />
                            </Field>
                            <Field label="Stock" error={errors.stock}>
                                <Input
                                    className={inputClass}
                                    type="number"
                                    min="0"
                                    value={data.stock}
                                    placeholder="0"
                                    onChange={(event) =>
                                        setData(
                                            'stock',
                                            Number(event.target.value),
                                        )
                                    }
                                    required
                                />
                            </Field>
                            <Field
                                label="Reserved stock"
                                error={errors.reserved_stock}
                            >
                                <Input
                                    className={inputClass}
                                    type="number"
                                    min="0"
                                    value={data.reserved_stock}
                                    placeholder="0"
                                    onChange={(event) =>
                                        setData(
                                            'reserved_stock',
                                            Number(event.target.value),
                                        )
                                    }
                                />
                            </Field>
                            {(
                                ['weight', 'length', 'width', 'height'] as const
                            ).map((key) => (
                                <Field
                                    key={key}
                                    label={`${key[0].toUpperCase()}${key.slice(1)}${key === 'weight' ? ' (g)' : ' (cm)'}`}
                                    error={errors[key]}
                                >
                                    <Input
                                        className={inputClass}
                                        type="number"
                                        min="0"
                                        value={data[key]}
                                        onChange={(event) =>
                                            setData(key, event.target.value)
                                        }
                                        placeholder="Use product value"
                                    />
                                </Field>
                            ))}
                            <Field
                                label="Upload image (Max 4 MB)"
                                error={fieldError('image')}
                            >
                                <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-zinc-300 text-sm text-zinc-600">
                                    <ImageIcon className="size-4" />
                                    Choose image
                                    <input
                                        className="sr-only"
                                        type="file"
                                        accept="image/*"
                                        onChange={selectImage}
                                    />
                                </label>
                            </Field>
                        </CardContent>
                    </Card>
                    <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
                        <Card className="border-zinc-200 shadow-none">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    {label}
                                </CardTitle>
                                <CardDescription>
                                    {variant?.product ??
                                        products.find(
                                            (product) =>
                                                product.id ===
                                                Number(data.product_id),
                                        )?.name ??
                                        'Select a product'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt={label}
                                        className="aspect-square w-full rounded-md border object-cover"
                                    />
                                ) : (
                                    <div className="flex aspect-square items-center justify-center rounded-md border border-dashed bg-zinc-50">
                                        <ImageIcon className="size-6 text-zinc-400" />
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-zinc-500">
                                        Available stock
                                    </span>
                                    <Badge variant="outline">{available}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label>Active</Label>
                                    <Switch
                                        checked={data.is_active}
                                        onCheckedChange={(is_active) =>
                                            setData('is_active', is_active)
                                        }
                                    />
                                </div>
                                <Button
                                    className="h-11 bg-black hover:bg-black/[0.84]"
                                    type="submit"
                                    disabled={processing}
                                >
                                    <Save />
                                    {processing ? 'Saving…' : 'Save variant'}
                                </Button>
                            </CardContent>
                        </Card>
                    </aside>
                </form>
            </div>
        </>
    );
}
