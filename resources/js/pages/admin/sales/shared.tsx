import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export {
    EmptyState,
    formatPrice,
    PageHeader,
    Pagination,
    TableShell,
} from '@/pages/admin/catalog/shared';
export type { Paginated } from '@/pages/admin/catalog/shared';

export function StatusBadge({
    status,
    tone = 'neutral',
}: {
    status: string | null;
    tone?: 'neutral' | 'good' | 'warn' | 'bad' | 'info';
}) {
    const value = status ?? '-';
    const resolvedTone =
        tone !== 'neutral'
            ? tone
            : [
                    'paid',
                    'settlement',
                    'capture',
                    'completed',
                    'delivered',
                ].includes(value)
              ? 'good'
              : [
                      'pending',
                      'pending_payment',
                      'processing',
                      'ready_to_ship',
                      'confirmed',
                      'allocated',
                      'picked',
                      'in_transit',
                  ].includes(value)
                ? 'warn'
                : [
                        'expired',
                        'failed',
                        'cancelled',
                        'cancel',
                        'deny',
                        'failure',
                        'problem',
                    ].includes(value)
                  ? 'bad'
                  : 'info';

    return (
        <Badge
            variant="outline"
            className={cn(
                resolvedTone === 'good' &&
                    'border-black bg-black text-white',
                resolvedTone === 'warn' &&
                    'border-black/[0.32] bg-black/[0.08] text-black',
                resolvedTone === 'bad' &&
                    'border-black border-dashed bg-white text-black',
                resolvedTone === 'info' &&
                    'border-black/[0.16] bg-white text-black/[0.56]',
            )}
        >
            {value}
        </Badge>
    );
}

export function JsonBlock({ value }: { value: unknown }) {
    return (
        <pre className="max-h-[520px] overflow-auto rounded-lg border bg-muted/40 p-4 text-xs">
            {JSON.stringify(value ?? {}, null, 2)}
        </pre>
    );
}
