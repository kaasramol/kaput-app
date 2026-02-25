'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { getMechanicById, getReviewsByMechanic } from '@/lib/firestore-queries';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ServiceList } from '@/components/mechanic/ServiceList';
import { ReviewCard } from '@/components/mechanic/ReviewCard';
import type { MechanicProfile, Review } from '@/types';

interface MechanicProfileContentProps {
  mechanicId: string;
}

const DAY_LABELS: Record<string, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
};

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function MechanicProfileContent({ mechanicId }: MechanicProfileContentProps) {
  const [mechanic, setMechanic] = useState<MechanicProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [m, r] = await Promise.all([
          getMechanicById(mechanicId),
          getReviewsByMechanic(mechanicId),
        ]);
        if (!cancelled) {
          setMechanic(m);
          setReviews(r);
        }
      } catch {
        if (!cancelled) setError('Failed to load mechanic profile.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [mechanicId]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !mechanic) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="text-lg font-medium text-text-primary">{error ?? 'Mechanic not found'}</p>
        <Link href="/map">
          <Button variant="secondary" size="sm" className="mt-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Map
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/map"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Map
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">{mechanic.businessName}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {mechanic.address}
            </span>
            {mechanic.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="h-4 w-4" />
                {mechanic.phone}
              </span>
            )}
            {mechanic.rating > 0 && (
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-medium text-text-primary">{mechanic.rating.toFixed(1)}</span>
                <span className="text-text-muted">({mechanic.reviewCount} reviews)</span>
              </span>
            )}
          </div>
        </div>
        <Link href="/quote/new">
          <Button size="lg">
            <FileText className="h-4 w-4" />
            Request Quote
          </Button>
        </Link>
      </div>

      {/* Description */}
      {mechanic.description && (
        <Card className="p-4">
          <p className="text-sm text-text-primary whitespace-pre-wrap">{mechanic.description}</p>
        </Card>
      )}

      {/* Grid: Services + Hours + Certs */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Services */}
        <ServiceList services={mechanic.services} />

        {/* Hours */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-5 w-5 text-accent-light" />
            <h3 className="font-semibold text-text-primary">Business Hours</h3>
          </div>
          {Object.keys(mechanic.hours).length === 0 ? (
            <p className="text-sm text-text-secondary">No hours listed.</p>
          ) : (
            <div className="space-y-1.5">
              {DAY_ORDER.map((day) => {
                const h = mechanic.hours[day];
                return (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="text-text-secondary">{DAY_LABELS[day]}</span>
                    <span className="text-text-primary">
                      {h ? `${h.open} – ${h.close}` : 'Closed'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Certifications */}
      {mechanic.certifications.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="h-5 w-5 text-accent-light" />
            <h3 className="font-semibold text-text-primary">Certifications</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {mechanic.certifications.map((cert) => (
              <Badge key={cert} variant="success">{cert}</Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Portfolio */}
      {mechanic.portfolioImages.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-text-primary">Portfolio</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {mechanic.portfolioImages.map((url, i) => (
              <div
                key={i}
                className="aspect-square overflow-hidden rounded-[var(--radius-md)] border border-border"
              >
                <img src={url} alt={`Portfolio ${i + 1}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary">
          Reviews ({reviews.length})
        </h2>
        {reviews.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 rounded-full bg-bg-elevated p-3">
              <Star className="h-6 w-6 text-text-muted" />
            </div>
            <p className="font-medium text-text-primary">No reviews yet</p>
            <p className="mt-1 text-sm text-text-secondary">
              Be the first to leave a review after a booking.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
