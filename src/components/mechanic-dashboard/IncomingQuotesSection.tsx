'use client';

import { FileText, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatRelativeTime } from '@/lib/format';
import type { Quote } from '@/types';

interface IncomingQuotesSectionProps {
  quotes: Quote[];
  mechanicId: string;
  onRespond: (quote: Quote) => void;
}

export function IncomingQuotesSection({ quotes, mechanicId, onRespond }: IncomingQuotesSectionProps) {
  // Filter out quotes this mechanic already responded to
  const unanswered = quotes.filter(
    (q) => !q.responses.some((r) => r.mechanicId === mechanicId)
  );

  if (unanswered.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">Incoming Quote Requests</h2>
        <Card className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-bg-elevated p-4">
            <FileText className="h-8 w-8 text-text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary">No new requests</h3>
          <p className="mt-1 text-sm text-text-secondary">
            New quote requests from car owners will appear here.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">Incoming Quote Requests</h2>
        <Badge variant="info">{unanswered.length} new</Badge>
      </div>
      {unanswered.map((quote) => (
        <Card key={quote.id} className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-text-primary">{quote.serviceCategory}</p>
              <p className="mt-0.5 truncate text-sm text-text-secondary">{quote.description}</p>
              {quote.symptoms.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {quote.symptoms.slice(0, 3).map((s) => (
                    <Badge key={s} variant="default">{s}</Badge>
                  ))}
                  {quote.symptoms.length > 3 && (
                    <Badge variant="default">+{quote.symptoms.length - 3}</Badge>
                  )}
                </div>
              )}
              <div className="mt-2 flex items-center gap-1.5 text-xs text-text-muted">
                <Clock className="h-3.5 w-3.5" />
                <span>{formatRelativeTime(quote.createdAt)}</span>
                <span>·</span>
                <span>{quote.responses.length} response{quote.responses.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <Button size="sm" onClick={() => onRespond(quote)}>
              Respond
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
