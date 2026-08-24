import { Head, Link, useForm } from '@inertiajs/react';
import { ImageIcon, Plus, Save, Trash2, WandSparkles } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { PageHeader, formatPrice } from '@/pages/admin/catalog/shared';

type Option = { id: number; name: string };
type ImageRow = {
    id?: number;
    image: File | null;
    preview: string | null;
    sort_order: string | number;
    is_primary: boolean;
};
type VariantRow = {
    id?: number;
    size: string;
    price: string | number;
    stock: string | number;
    reserved_stock: string | number;
    weight: string | number;
    length: string | number;
    width: string | number;
    height: string | number;
    image: File | null;
    preview: string | null;
    is_active: boolean;
};
type FormData = {
    _method: 'POST' | 'PUT';
    category_ids: Array<string | number>;
    name: string;
    slug: string;
    sku: string;
    brand_name: string;
    price: string | number;
    description: string;
    weight: string | number;
    length: string | number;
    width: string | number;
    height: string | number;
    status: string;
    is_featured: boolean;
    is_new_arrival: boolean;
    is_best_seller: boolean;
    images: ImageRow[];
    variants: VariantRow[];
};
type Product = Omit<FormData, '_method' | 'images' | 'variants'> & {
    id: number;
    images: Array<{
        id: number;
        image_url: string;
        sort_order: number;
        is_primary: boolean;
    }>;
    variants: Array<
        Omit<VariantRow, 'image' | 'preview'> & { image_url: string | null }
    >;
};
type Props = {
    mode: 'create' | 'edit';
    product: Product | null;
    options: {
        categories: Option[];
        statuses: string[];
    };
};

const inputClass =
    'h-11 border-black bg-white focus-visible:border-black focus-visible:ring-black';
const selectClass =
    'admin-form-select h-11 rounded-md border border-black bg-white px-3 text-sm focus:border-black focus:ring-2 focus:ring-black/20 focus:outline-none';
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
const blankImage = (sortOrder: number): ImageRow => ({
    image: null,
    preview: null,
    sort_order: sortOrder,
    is_primary: sortOrder === 0,
});
const blankVariant = (): VariantRow => ({
    size: '',
    price: '',
    stock: 0,
    reserved_stock: 0,
    weight: '',
    length: '',
    width: '',
    height: '',
    image: null,
    preview: null,
    is_active: true,
});

function Section({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <Card className="border-black/20 shadow-none">
            <CardHeader className="border-b border-black/10">
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">{children}</CardContent>
        </Card>
    );
}

function Field({
    label,
    error,
    children,
    className = '',
}: {
    label: string;
    error?: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={`grid gap-2 ${className}`}>
            <Label>{label}</Label>
            {children}
            <InputError message={error} />
        </div>
    );
}

export default function ProductForm({ mode, product, options }: Props) {
    const isEdit = mode === 'edit' && product !== null;
    const [clientErrors, setClientErrors] = useState<Record<string, string>>(
        {},
    );
    const { data, setData, post, processing, errors } = useForm<FormData>({
        _method: isEdit ? 'PUT' : 'POST',
        category_ids: product?.category_ids ?? [],
        name: product?.name ?? '',
        slug: product?.slug ?? '',
        sku: product?.sku ?? '',
        brand_name: product?.brand_name ?? 'GodKillerGoods',
        price: product?.price ?? '',
        description: product?.description ?? '',
        weight: product?.weight ?? 0,
        length: product?.length ?? '',
        width: product?.width ?? '',
        height: product?.height ?? '',
        status: product?.status ?? 'draft',
        is_featured: product?.is_featured ?? false,
        is_new_arrival: product?.is_new_arrival ?? false,
        is_best_seller: product?.is_best_seller ?? false,
        images:
            product?.images.map((image, index) => ({
                id: image.id,
                image: null,
                preview: image.image_url,
                sort_order: image.sort_order ?? index,
                is_primary: image.is_primary,
            })) ?? [],
        variants:
            product?.variants.map((variant) => ({
                id: variant.id,
                size: variant.size,
                price: variant.price,
                stock: variant.stock,
                reserved_stock: variant.reserved_stock,
                weight: variant.weight,
                length: variant.length,
                width: variant.width,
                height: variant.height,
                image: null,
                preview: variant.image_url,
                is_active: variant.is_active,
            })) ?? [],
    });

    const nestedError = (key: string) =>
        (errors as Record<string, string | undefined>)[key];
    const fieldError = (key: string) => clientErrors[key] ?? nestedError(key);
    const setClientError = (key: string, message?: string) =>
        setClientErrors((current) => {
            if (!message) {
                const remaining = { ...current };
                delete remaining[key];

                return remaining;
            }

            return { ...current, [key]: message };
        });
    const imageCount = data.images.length;
    const activeVariants = data.variants.filter(
        (variant) => variant.is_active,
    ).length;

    const updateImage = (index: number, patch: Partial<ImageRow>) =>
        setData(
            'images',
            data.images.map((image, imageIndex) =>
                imageIndex === index ? { ...image, ...patch } : image,
            ),
        );
    const updateVariant = (index: number, patch: Partial<VariantRow>) =>
        setData(
            'variants',
            data.variants.map((variant, variantIndex) =>
                variantIndex === index ? { ...variant, ...patch } : variant,
            ),
        );
    const selectImage = (
        index: number,
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const image = event.target.files?.[0] ?? null;
        const errorKey = 'images.' + index + '.image';

        if (image && image.size > MAX_IMAGE_SIZE) {
            setClientError(errorKey, 'Ukuran gambar maksimal 4 MB.');
            event.target.value = '';

            return;
        }

        setClientError(errorKey);
        updateImage(index, {
            image,
            preview: image
                ? URL.createObjectURL(image)
                : data.images[index].preview,
        });
    };
    const selectVariantImage = (
        index: number,
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const image = event.target.files?.[0] ?? null;
        const errorKey = 'variants.' + index + '.image';

        if (image && image.size > MAX_IMAGE_SIZE) {
            setClientError(errorKey, 'Ukuran gambar maksimal 4 MB.');
            event.target.value = '';

            return;
        }

        setClientError(errorKey);
        updateVariant(index, {
            image,
            preview: image
                ? URL.createObjectURL(image)
                : data.variants[index].preview,
        });
    };
    const setPrimaryImage = (index: number) =>
        setData(
            'images',
            data.images.map((image, imageIndex) => ({
                ...image,
                is_primary: imageIndex === index,
            })),
        );
    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (Object.keys(clientErrors).length > 0) {
            return;
        }

        post(isEdit ? `/admin/products/${product.id}` : '/admin/products', {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title={isEdit ? `Edit ${product.name}` : 'Create Product'} />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="Catalog"
                    title={isEdit ? 'Edit product' : 'Create product'}
                    description="Kelola identitas, kategori, harga, gambar, ukuran, dan stok produk."
                    action={
                        <Button variant="outline" asChild>
                            <Link href="/admin/products">Cancel</Link>
                        </Button>
                    }
                />
                <form
                    onSubmit={submit}
                    className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]"
                >
                    <div className="space-y-6">
                        <Section
                            title="Product identity"
                            description="Informasi utama untuk katalog dan pencarian."
                        >
                            <div className="grid gap-5 md:grid-cols-2">
                                <Field
                                    label="Model name"
                                    error={errors.name}
                                    className="md:col-span-2"
                                >
                                    <Input
                                        className={inputClass}
                                        value={data.name}
                                        placeholder="Contoh: Urban Speed Black"
                                        onChange={(event) => {
                                            const name = event.target.value;
                                            setData('name', name);

                                            if (
                                                !data.slug ||
                                                data.slug === slugify(data.name)
                                            ) {
                                                setData('slug', slugify(name));
                                            }
                                        }}
                                        required
                                    />
                                </Field>
                                <Field label="Slug" error={errors.slug}>
                                    <div className="flex gap-2">
                                        <Input
                                            className={inputClass}
                                            value={data.slug}
                                            placeholder="urban-speed-black"
                                            onChange={(event) =>
                                                setData(
                                                    'slug',
                                                    slugify(event.target.value),
                                                )
                                            }
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setData(
                                                    'slug',
                                                    slugify(data.name),
                                                )
                                            }
                                            aria-label="Generate slug from product name"
                                        >
                                            <WandSparkles /> Generate
                                        </Button>
                                    </div>
                                </Field>
                                <Field label="Parent SKU" error={errors.sku}>
                                    <Input
                                        className={inputClass}
                                        value={data.sku}
                                        placeholder="Contoh: USB-001"
                                        onChange={(event) =>
                                            setData('sku', event.target.value)
                                        }
                                    />
                                </Field>
                                <Field label="Brand" error={errors.brand_name}>
                                    <Input
                                        className={inputClass}
                                        value={data.brand_name}
                                        placeholder="Contoh: NEXSTEP"
                                        onChange={(event) =>
                                            setData(
                                                'brand_name',
                                                event.target.value,
                                            )
                                        }
                                        required
                                    />
                                </Field>
                                <Field
                                    label="Categories"
                                    error={errors.category_ids}
                                    className="md:col-span-2"
                                >
                                    <div className="grid gap-3 rounded-md border border-black p-3 sm:grid-cols-2">
                                        {options.categories.map((category) => (
                                            <label
                                                key={category.id}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={data.category_ids.some(
                                                        (id) =>
                                                            Number(id) ===
                                                            category.id,
                                                    )}
                                                    onChange={(event) =>
                                                        setData(
                                                            'category_ids',
                                                            event.target.checked
                                                                ? [
                                                                    ...data.category_ids,
                                                                    category.id,
                                                                ]
                                                                : data.category_ids.filter(
                                                                    (id) =>
                                                                        Number(
                                                                            id,
                                                                        ) !==
                                                                        category.id,
                                                                ),
                                                        )
                                                    }
                                                />
                                                {category.name}
                                            </label>
                                        ))}
                                    </div>
                                </Field>
                            </div>
                        </Section>

                        <Section
                            title="Pricing and shipping"
                            description="Harga dasar dan ukuran pengiriman produk."
                        >
                            <div className="grid gap-5 md:grid-cols-2">
                                <Field label="Price" error={errors.price}>
                                    <Input
                                        className={inputClass}
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={data.price}
                                        placeholder="0"
                                        onChange={(event) =>
                                            setData('price', event.target.value)
                                        }
                                        required
                                    />
                                </Field>
                                <Field
                                    label="Weight (gram)"
                                    error={errors.weight}
                                >
                                    <Input
                                        className={inputClass}
                                        type="number"
                                        min="0"
                                        value={data.weight}
                                        placeholder="Contoh: 800"
                                        onChange={(event) =>
                                            setData(
                                                'weight',
                                                event.target.value,
                                            )
                                        }
                                        required
                                    />
                                </Field>
                                <div className="grid grid-cols-3 gap-3">
                                    {(
                                        ['length', 'width', 'height'] as const
                                    ).map((key) => (
                                        <Field
                                            key={key}
                                            label={`${key[0].toUpperCase()}${key.slice(1)} (cm)`}
                                            error={errors[key]}
                                        >
                                            <Input
                                                className={inputClass}
                                                type="number"
                                                min="0"
                                                value={data[key]}
                                                placeholder="0"
                                                onChange={(event) =>
                                                    setData(
                                                        key,
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                        </Field>
                                    ))}
                                </div>
                            </div>
                        </Section>

                        <Section
                            title="Description"
                            description="Tuliskan material, teknologi, penggunaan, fit, dan care guidance."
                        >
                            <div className="grid gap-5">
                                <Field
                                    label="Full description"
                                    error={errors.description}
                                >
                                    <Textarea
                                        className="min-h-48 border-black"
                                        value={data.description}
                                        placeholder="Jelaskan material, fitur, ukuran, dan perawatan produk"
                                        onChange={(event) =>
                                            setData(
                                                'description',
                                                event.target.value,
                                            )
                                        }
                                    />
                                </Field>
                            </div>
                        </Section>

                        <Section
                            title="Product images"
                            description="Gambar disimpan otomatis ke public storage."
                        >
                            <div className="space-y-4">
                                {data.images.map((image, index) => (
                                    <div
                                        key={image.id ?? index}
                                        className="grid gap-4 rounded-lg border border-black/20 p-4 md:grid-cols-[120px_minmax(0,1fr)_auto]"
                                    >
                                        <div className="aspect-square overflow-hidden rounded-md border border-black/20 bg-black/[0.04]">
                                            {image.preview ? (
                                                <img
                                                    src={image.preview}
                                                    alt={`Product preview ${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center">
                                                    <ImageIcon className="size-6 text-black/40" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <Field
                                                label="Image file (Max 4 MB)"
                                                error={fieldError(
                                                    `images.${index}.image`,
                                                )}
                                                className="sm:col-span-2"
                                            >
                                                <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-black px-3 text-sm text-black">
                                                    <ImageIcon className="size-4" />
                                                    {image.preview
                                                        ? 'Replace image'
                                                        : 'Choose image'}
                                                    <input
                                                        className="sr-only"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(event) =>
                                                            selectImage(
                                                                index,
                                                                event,
                                                            )
                                                        }
                                                    />
                                                </label>
                                            </Field>
                                            <Field
                                                label="Sort order"
                                                error={nestedError(
                                                    `images.${index}.sort_order`,
                                                )}
                                            >
                                                <Input
                                                    className={inputClass}
                                                    type="number"
                                                    min="0"
                                                    value={image.sort_order}
                                                    placeholder="0"
                                                    onChange={(event) =>
                                                        updateImage(index, {
                                                            sort_order:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                />
                                            </Field>
                                            <div className="flex items-center justify-between rounded-md border border-black px-3">
                                                <Label>Primary image</Label>
                                                <Switch
                                                    checked={image.is_primary}
                                                    onCheckedChange={() =>
                                                        setPrimaryImage(index)
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            aria-label="Remove product image"
                                            onClick={() => {
                                                setClientErrors({});
                                                setData(
                                                    'images',
                                                    data.images.filter(
                                                        (_, imageIndex) =>
                                                            imageIndex !==
                                                            index,
                                                    ),
                                                );
                                            }}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setData('images', [
                                            ...data.images,
                                            blankImage(data.images.length),
                                        ])
                                    }
                                >
                                    <Plus /> Add image
                                </Button>
                            </div>
                        </Section>

                        <Section
                            title="Variants"
                            description="Setiap kombinasi warna dan ukuran harus memiliki SKU unik."
                        >
                            <div className="space-y-4">
                                {data.variants.map((variant, index) => (
                                    <VariantEditor
                                        key={variant.id ?? index}
                                        variant={variant}
                                        index={index}
                                        error={fieldError}
                                        update={updateVariant}
                                        selectImage={selectVariantImage}
                                        remove={() => {
                                            setClientErrors({});
                                            setData(
                                                'variants',
                                                data.variants.filter(
                                                    (_, variantIndex) =>
                                                        variantIndex !== index,
                                                ),
                                            );
                                        }}
                                    />
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setData('variants', [
                                            ...data.variants,
                                            blankVariant(),
                                        ])
                                    }
                                >
                                    <Plus /> Add variant
                                </Button>
                            </div>
                        </Section>
                    </div>

                    <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
                        <Section
                            title="Publish"
                            description="Atur status dan penempatan katalog."
                        >
                            <div className="grid gap-4">
                                <Field label="Status" error={errors.status}>
                                    <select
                                        className={selectClass}
                                        value={data.status}
                                        onChange={(event) =>
                                            setData(
                                                'status',
                                                event.target.value,
                                            )
                                        }
                                    >
                                        {options.statuses.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                                {(
                                    [
                                        {
                                            key: 'is_featured',
                                            label: 'Featured',
                                        },
                                        {
                                            key: 'is_new_arrival',
                                            label: 'New arrival',
                                        },
                                        {
                                            key: 'is_best_seller',
                                            label: 'Best seller',
                                        },
                                    ] as const
                                ).map(({ key, label }) => (
                                    <div
                                        className="flex items-center justify-between"
                                        key={key}
                                    >
                                        <Label>{label}</Label>
                                        <Switch
                                            checked={data[key]}
                                            onCheckedChange={(checked) =>
                                                setData(key, checked)
                                            }
                                        />
                                    </div>
                                ))}
                                <div className="rounded-md bg-black/[0.04] p-3 text-sm text-black/70">
                                    {imageCount} image(s), {activeVariants}{' '}
                                    active variant(s)
                                    <br />
                                    Base price: {formatPrice(data.price)}
                                </div>
                                <Button
                                    className="h-11 bg-black hover:bg-black/[0.84]"
                                    type="submit"
                                    disabled={processing}
                                >
                                    <Save />
                                    {processing
                                        ? 'Saving…'
                                        : isEdit
                                            ? 'Save changes'
                                            : 'Create product'}
                                </Button>
                            </div>
                        </Section>
                    </aside>
                </form>
            </div>
        </>
    );
}

function VariantEditor({
    variant,
    index,
    error,
    update,
    remove,
    selectImage,
}: {
    variant: VariantRow;
    index: number;
    error: (key: string) => string | undefined;
    update: (index: number, patch: Partial<VariantRow>) => void;
    remove: () => void;
    selectImage: (index: number, event: ChangeEvent<HTMLInputElement>) => void;
}) {
    const available = Math.max(
        0,
        Number(variant.stock || 0) - Number(variant.reserved_stock || 0),
    );

    return (
        <div className="rounded-lg border border-black/20 p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-3">
                <div className="flex items-center gap-2">
                    <strong className="text-sm">
                        {variant.size || 'Size'}
                    </strong>
                    <Badge variant="outline">Available: {available}</Badge>
                </div>
                <div className="flex items-center gap-3">
                    <Label className="text-xs">Active</Label>
                    <Switch
                        checked={variant.is_active}
                        onCheckedChange={(isActive) =>
                            update(index, { is_active: isActive })
                        }
                    />
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={remove}
                        aria-label="Remove variant"
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Field label="Size" error={error(`variants.${index}.size`)}>
                    <Input
                        className={inputClass}
                        value={variant.size}
                        placeholder="EU 42"
                        onChange={(event) =>
                            update(index, { size: event.target.value })
                        }
                        required
                    />
                </Field>
                <Field
                    label="Price override"
                    error={error(`variants.${index}.price`)}
                >
                    <Input
                        className={inputClass}
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={variant.price}
                        placeholder="Use product price"
                        onChange={(event) =>
                            update(index, { price: event.target.value })
                        }
                    />
                </Field>
                <Field label="Stock" error={error(`variants.${index}.stock`)}>
                    <Input
                        className={inputClass}
                        type="number"
                        min="0"
                        value={variant.stock}
                        placeholder="0"
                        onChange={(event) =>
                            update(index, { stock: event.target.value })
                        }
                        required
                    />
                </Field>
                <Field
                    label="Reserved stock"
                    error={error(`variants.${index}.reserved_stock`)}
                >
                    <Input
                        className={inputClass}
                        type="number"
                        min="0"
                        value={variant.reserved_stock}
                        placeholder="0"
                        onChange={(event) =>
                            update(index, {
                                reserved_stock: event.target.value,
                            })
                        }
                    />
                </Field>
                {(['weight', 'length', 'width', 'height'] as const).map(
                    (key) => (
                        <Field
                            key={key}
                            label={`${key[0].toUpperCase()}${key.slice(1)}${key === 'weight' ? ' (g)' : ' (cm)'}`}
                            error={error(`variants.${index}.${key}`)}
                        >
                            <Input
                                className={inputClass}
                                type="number"
                                min="0"
                                value={variant[key]}
                                placeholder="Use product value"
                                onChange={(event) =>
                                    update(index, {
                                        [key]: event.target.value,
                                    })
                                }
                            />
                        </Field>
                    ),
                )}
                <Field
                    label="Variant image (Max 4 MB)"
                    error={error(`variants.${index}.image`)}
                    className="xl:col-span-2"
                >
                    <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-black px-3 text-sm text-black">
                        <ImageIcon className="size-4" />
                        {variant.preview ? 'Replace image' : 'Choose image'}
                        <input
                            className="sr-only"
                            type="file"
                            accept="image/*"
                            onChange={(event) => selectImage(index, event)}
                        />
                    </label>
                </Field>
                {variant.preview && (
                    <img
                        src={variant.preview}
                        alt={`${variant.size || 'Variant'} preview`}
                        className="aspect-square h-20 rounded-md border border-black/20 object-cover"
                    />
                )}
            </div>
        </div>
    );
}
