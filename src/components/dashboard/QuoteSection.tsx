'use client';

import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatRelativeTime } from '@/lib/format';
import type { Quote, QuoteStatus } from '@/types';

interface QuoteSectionProps {
  quotes: Quote[];
}

const STATUS_BADGE: Record<QuoteStatus, { label: string; variant: 'info' | 'warning' | 'success' | 'default' }> = {
  open: { label: 'Open', variant: 'info' },
  quoted: { label: 'Quoted', variant: 'warning' },
  accepted: { label: 'Accepted', variant: 'success' },
  expired: { label: 'Expired', variant: 'default' },
};

export function QuoteSection({ quotes }: QuoteSectionProps) {
  if (quotes.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-bg-elevated p-4">
          <FileText className="h-8 w-8 text-text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary">No quotes yet</h3>
        <p className="mt-1 text-sm text-text-secondary">Request a quote to compare mechanic prices.</p>
        <Link href="/quote/new">
          <Button size="sm" className="mt-4">
            Request a Quote
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-text-primary">Recent Quotes</h2>
      {quotes.slice(0, 5).map((quote) => {
        const badge = STATUS_BADGE[quote.status];
        return (
          <Link key={quote.id} href={`/quote/${quote.id}`} className="block">
            <Card hover className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-text-primary">{quote.serviceCategory}</p>
                  <p className="mt-0.5 truncate text-sm text-text-secondary">{quote.description}</p>
                  <p className="mt-1 text-xs text-text-muted">
                    {quote.responses.length} response{quote.responses.length !== 1 ? 's' : ''} · {formatRelativeTime(quote.createdAt)}
                  </p>
                </div>
                <Badge variant={badge.variant}>{badge.label}</Badge>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
