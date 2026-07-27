import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import {
    ActiveBadge,
    EmptyState,
    formatPrice,
    PageHeader,
    Pagination,
    TableShell,
    Thumbnail,
} from '@/pages/admin/catalog/shared';
import type { Paginated } from '@/pages/admin/catalog/shared';

export {
    ActiveBadge,
    EmptyState,
    formatPrice,
    PageHeader,
    Pagination,
    TableShell,
    Thumbnail,
};
export type { Paginated };

export function ReadBadge({ read }: { read: boolean }) {
    return (
        <Badge
            variant="outline"
            className={
                read
                    ? 'border-black/[0.16] bg-white text-black/[0.56]'
                    : 'border-black bg-black text-white'
            }
        >
            {read ? 'Read' : 'Unread'}
        </Badge>
    );
}

export function MetricCard({
    label,
    value,
    detail,
}: {
    label: string;
    value: ReactNode;
    detail?: string;
}) {
    return (
        <div className="rounded-lg border border-black/15 bg-card p-4 shadow-none dark:border-white/20">
            <p className="text-sm text-muted-foreground">{label}</p>
            <div className="mt-2 text-2xl font-semibold tracking-tight">
                {value}
            </div>
            {detail ? (
                <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
            ) : null}
        </div>
    );
}

export function textInputClass() {
    return 'border-input focus-visible:border-ring focus-visible:ring-ring/50 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]';
}

export function booleanLabel(value: boolean) {
    return value ? 'Active' : 'Inactive';
}
