'use client';

import { useState, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMechanicDashboardData } from '@/hooks/useMechanicDashboardData';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { EarningsCard } from '@/components/mechanic-dashboard/EarningsCard';
import { IncomingQuotesSection } from '@/components/mechanic-dashboard/IncomingQuotesSection';
import { ActiveJobsSection } from '@/components/mechanic-dashboard/ActiveJobsSection';
import { MechanicReviewsSection } from '@/components/mechanic-dashboard/MechanicReviewsSection';
import { QuoteResponseModal } from '@/components/mechanic-dashboard/QuoteResponseModal';
import type { Quote } from '@/types';

export function MechanicDashboardContent() {
  const { user } = useAuth();
  const { profile, incomingQuotes, bookings, reviews, loading, error } =
    useMechanicDashboardData(user?.uid);

  const [respondingQuote, setRespondingQuote] = useState<Quote | null>(null);
  const [respondedQuoteIds, setRespondedQuoteIds] = useState<Set<string>>(new Set());

  const handleResponseSubmitted = useCallback(() => {
    if (respondingQuote) {
      setRespondedQuoteIds((prev) => new Set([...prev, respondingQuote.id]));
    }
    setRespondingQuote(null);
  }, [respondingQuote]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="text-lg font-medium text-text-primary">Something went wrong</p>
        <p className="mt-1 text-sm text-text-secondary">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <AlertCircle className="mb-3 h-10 w-10 text-text-muted" />
        <p className="text-lg font-medium text-text-primary">No mechanic profile found</p>
        <p className="mt-1 text-sm text-text-secondary">
          Please complete your onboarding to set up your shop profile.
        </p>
      </div>
    );
  }

  // Filter out quotes we already responded to in this session
  const visibleQuotes = incomingQuotes.filter((q) => !respondedQuoteIds.has(q.id));

  const subscriptionLabel =
    profile.subscriptionStatus === 'active'
      ? 'Active'
      : profile.subscriptionStatus === 'trial'
        ? 'Trial'
        : 'Inactive';
  const subscriptionVariant =
    profile.subscriptionStatus === 'active'
      ? 'success'
      : profile.subscriptionStatus === 'trial'
        ? 'warning'
        : ('default' as const);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">{profile.businessName}</h1>
          <p className="mt-1 text-text-secondary">Manage your quotes, jobs, and earnings.</p>
        </div>
        <Badge variant={subscriptionVariant}>{subscriptionLabel} Plan</Badge>
      </div>

      {/* Subscription warning */}
      {profile.subscriptionStatus === 'inactive' && (
        <Card className="border-warning/30 bg-warning/5 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-warning" />
            <p className="text-sm text-text-primary">
              Your subscription is inactive. Activate a plan to appear in search results and receive quote requests.
            </p>
          </div>
        </Card>
      )}

      {/* Earnings */}
      <EarningsCard bookings={bookings} />

      {/* Main grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        <IncomingQuotesSection
          quotes={visibleQuotes}
          mechanicId={profile.id}
          onRespond={setRespondingQuote}
        />
        <ActiveJobsSection bookings={bookings} />
      </div>

      {/* Reviews */}
      <MechanicReviewsSection reviews={reviews} />

      {/* Response modal */}
      {respondingQuote && (
        <QuoteResponseModal
          open={!!respondingQuote}
          onClose={() => setRespondingQuote(null)}
          quote={respondingQuote}
          mechanicId={profile.id}
          onResponseSubmitted={handleResponseSubmitted}
        />
      )}
    </div>
  );
}
