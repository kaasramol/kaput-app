'use client';

import { Star } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ReviewCard } from '@/components/mechanic/ReviewCard';
import type { Review } from '@/types';

interface MechanicReviewsSectionProps {
  reviews: Review[];
}

export function MechanicReviewsSection({ reviews }: MechanicReviewsSectionProps) {
  if (reviews.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">Customer Reviews</h2>
        <Card className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-bg-elevated p-4">
            <Star className="h-8 w-8 text-text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary">No reviews yet</h3>
          <p className="mt-1 text-sm text-text-secondary">
            Reviews from completed jobs will appear here.
          </p>
        </Card>
      </div>
    );
  }

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">Customer Reviews</h2>
        <div className="flex items-center gap-1.5 text-sm">
          <Star className="h-4 w-4 fill-warning text-warning" />
          <span className="font-medium text-text-primary">{avgRating.toFixed(1)}</span>
          <span className="text-text-muted">({reviews.length})</span>
        </div>
      </div>
      {reviews.slice(0, 5).map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
