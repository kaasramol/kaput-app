'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Car, Wrench, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getQuoteById } from '@/lib/firestore-queries';
import { formatDate, formatRelativeTime } from '@/lib/format';
import { SERVICE_CATEGORIES } from '@/lib/service-categories';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { QuoteResponseCard } from '@/components/quote/QuoteResponseCard';
import type { Quote, QuoteStatus } from '@/types';

interface QuoteDetailContentProps {
  quoteId: string;
}

const STATUS_BADGE: Record<QuoteStatus, { label: string; variant: 'info' | 'warning' | 'success' | 'default' }> = {
  open: { label: 'Open', variant: 'info' },
  quoted: { label: 'Quoted', variant: 'warning' },
  accepted: { label: 'Accepted', variant: 'success' },
  expired: { label: 'Expired', variant: 'default' },
};

export function QuoteDetailContent({ quoteId }: QuoteDetailContentProps) {
  const { user } = useAuth();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const q = await getQuoteById(quoteId);
        if (!cancelled) setQuote(q);
      } catch {
        if (!cancelled) setError('Failed to load quote details.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [quoteId]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="text-lg font-medium text-text-primary">
          {error ?? 'Quote not found'}
        </p>
        <Link href="/dashboard">
          <Button variant="secondary" size="sm" className="mt-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const badge = STATUS_BADGE[quote.status];
  const isOwner = user?.uid === quote.carOwnerId;
  const canAccept = isOwner && (quote.status === 'open' || quote.status === 'quoted');
  const categoryIcon = SERVICE_CATEGORIES.find(
    (c) => c.label === quote.serviceCategory
  )?.icon;

  return (
    <div className="space-y-8">
      {/* Back link + header */}
      <div>
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              {categoryIcon && <span className="mr-2">{categoryIcon}</span>}
              {quote.serviceCategory}
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Submitted {formatRelativeTime(quote.createdAt)} · Expires {formatDate(quote.expiresAt)}
            </p>
          </div>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
      </div>

      {/* Quote info cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Car className="h-5 w-5 text-accent-light" />
            <div>
              <p className="text-xs text-text-muted">Vehicle</p>
              <p className="font-medium text-text-primary">ID: {quote.vehicleId}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Wrench className="h-5 w-5 text-accent-light" />
            <div>
              <p className="text-xs text-text-muted">Symptoms</p>
              {quote.symptoms.length > 0 ? (
                <div className="mt-1 flex flex-wrap gap-1">
                  {quote.symptoms.map((s) => (
                    <Badge key={s} variant="info">{s}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-secondary">None specified</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {quote.description && (
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 h-5 w-5 text-accent-light" />
            <div>
              <p className="text-xs text-text-muted">Description</p>
              <p className="text-sm text-text-primary whitespace-pre-wrap">{quote.description}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Responses */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary">
          Mechanic Responses ({quote.responses.length})
        </h2>

        {quote.responses.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-bg-elevated p-4">
              <FileText className="h-8 w-8 text-text-muted" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">No responses yet</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Mechanics will review your request and respond with quotes.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {quote.responses.map((response, index) => (
              <QuoteResponseCard
                key={index}
                response={response}
                isAccepted={quote.acceptedMechanicId === response.mechanicId}
                canAccept={canAccept}
                onAccept={() => {
                  // TODO: Implement accept quote mutation
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
