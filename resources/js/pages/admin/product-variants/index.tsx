import { Head, Link, router } from '@inertiajs/react';
import {
    Edit3,
    Package,
    Plus,
    Search,
    SlidersHorizontal,
    Trash2,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    ActiveBadge,
    Pagination,
    PageHeader,
    Thumbnail,
    formatPrice,
} from '@/pages/admin/catalog/shared';

type Variant = {
    id: number;
    product_id: number;
    product: string | null;
    size: string | null;
    price: string | number | null;
    stock: number;
    reserved_stock: number;
    available_stock: number;
    image_url: string | null;
    is_active: boolean;
};
type Variants = {
    data: Variant[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number | null;
    to: number | null;
    total: number;
    per_page: number;
};
type Props = {
    variants: Variants;
    product: { id: number; name: string } | null;
    filters: { search: string; status: string };
    stats: {
        total: number;
        active: number;
        inactive: number;
        in_stock: number;
        low_stock: number;
        sold_out: number;
    };
};

export default function ProductVariantsIndex({
    variants,
    product,
    filters,
    stats,
}: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const base = product
        ? `/admin/products/${product.id}/variants`
        : '/admin/product-variants';
    const apply = (key: 'search' | 'status', value: string) =>
        router.get(
            base,
            { ...filters, [key]: value, page: 1 },
            { preserveState: true, replace: true },
        );
    const submit = (event: FormEvent) => {
        event.preventDefault();
        apply('search', search);
    };
    const remove = (variant: Variant) => {
        if (confirm(`Delete or deactivate size ${variant.size || variant.id}?`))
            router.delete(`/admin/product-variants/${variant.id}`, {
                preserveScroll: true,
            });
    };
    const cards = [
        ['All', stats.total],
        ['Active', stats.active],
        ['Inactive', stats.inactive],
        ['In stock', stats.in_stock],
        ['Low stock', stats.low_stock],
        ['Sold out', stats.sold_out],
    ];

    return (
        <>
            <Head title="Product Variants" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="Catalog"
                    title={
                        product
                            ? `${product.name} variants`
                            : 'Product variants'
                    }
                    description="Setiap varian adalah ukuran produk dengan harga dan stok sendiri."
                    action={
                        <Button
                            className="bg-black hover:bg-black/[0.84]"
                            asChild
                        >
                            <Link
                                href={`/admin/product-variants/create${product ? `?product_id=${product.id}` : ''}`}
                            >
                                <Plus />
                                Add variant
                            </Link>
                        </Button>
                    }
                />
                <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
                    {cards.map(([label, value]) => (
                        <Card
                            key={label}
                            className="border-zinc-200 py-4 shadow-none"
                        >
                            <CardContent className="px-4">
                                <p className="text-xs text-zinc-500">{label}</p>
                                <p className="mt-1 text-2xl font-semibold">
                                    {value}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <Card className="border-zinc-200 shadow-none">
                    <CardContent className="space-y-4 pt-6">
                        <form
                            onSubmit={submit}
                            className="flex flex-col gap-3 sm:flex-row"
                        >
                            <div className="relative min-w-0 flex-1">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
                                <Input
                                    className="h-10 border-zinc-200 pl-9"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search size or product"
                                />
                            </div>
                            <select
                                value={filters.status}
                                onChange={(event) =>
                                    apply('status', event.target.value)
                                }
                                className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm"
                            >
                                <option value="">All status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <Button type="submit" variant="outline">
                                <SlidersHorizontal />
                                Filter
                            </Button>
                        </form>
                        <div className="overflow-x-auto rounded-lg border border-zinc-200">
                            <table className="w-full min-w-[920px] text-sm">
                                <thead className="bg-zinc-50 text-left text-xs font-medium text-zinc-500">
                                    <tr>
                                        <th className="px-4 py-3">Variant</th>
                                        <th className="px-4 py-3">Product</th>
                                        <th className="px-4 py-3">Price</th>
                                        <th className="px-4 py-3">Stock</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {variants.data.map((variant) => {
                                        const stockClass =
                                            variant.available_stock <= 0
                                                ? 'border-black/[0.32] bg-black/[0.04] text-black'
                                                : variant.available_stock <= 5
                                                  ? 'border-black/[0.32] bg-black/[0.04] text-black'
                                                  : 'border-black/[0.32] bg-black/[0.04] text-black';
                                        return (
                                            <tr
                                                className="border-t border-zinc-100"
                                                key={variant.id}
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <Thumbnail
                                                            src={
                                                                variant.image_url
                                                            }
                                                            alt={
                                                                variant.size ||
                                                                'Variant'
                                                            }
                                                        />
                                                        <div>
                                                            <strong>
                                                                {variant.size ||
                                                                    'No size'}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Link
                                                        className="font-medium hover:underline"
                                                        href={`/admin/products/${variant.product_id}`}
                                                    >
                                                        {variant.product || '—'}
                                                    </Link>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {variant.price ? (
                                                        formatPrice(
                                                            variant.price,
                                                        )
                                                    ) : (
                                                        <span className="text-zinc-400">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge
                                                        variant="outline"
                                                        className={stockClass}
                                                    >
                                                        {
                                                            variant.available_stock
                                                        }{' '}
                                                        available
                                                    </Badge>
                                                    <p className="mt-1 text-xs text-zinc-400">
                                                        {variant.reserved_stock}{' '}
                                                        reserved /{' '}
                                                        {variant.stock} total
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <ActiveBadge
                                                        active={
                                                            variant.is_active
                                                        }
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                        >
                                                            <Link
                                                                aria-label="Adjust stock"
                                                                href={`/admin/product-variants/${variant.id}/stock-adjustment`}
                                                            >
                                                                <Package />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                        >
                                                            <Link
                                                                aria-label="Edit variant"
                                                                href={`/admin/product-variants/${variant.id}/edit`}
                                                            >
                                                                <Edit3 />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label="Delete variant"
                                                            onClick={() =>
                                                                remove(variant)
                                                            }
                                                        >
                                                            <Trash2 className="text-black" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {variants.data.length === 0 && (
                                <div className="py-14 text-center text-sm text-zinc-500">
                                    No variants match these filters.
                                </div>
                            )}
                        </div>
                        <Pagination paginator={variants} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
