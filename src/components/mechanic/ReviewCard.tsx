'use client';

import { Star } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatRelativeTime } from '@/lib/format';
import type { Review } from '@/types';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating
                    ? 'fill-warning text-warning'
                    : 'text-bg-elevated'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-text-muted">{formatRelativeTime(review.createdAt)}</span>
        </div>
        <p className="text-sm text-text-primary">{review.comment}</p>
        {review.mechanicReply && (
          <div className="ml-4 border-l-2 border-accent/30 pl-3">
            <p className="text-xs font-medium text-accent-light">Mechanic Reply</p>
            <p className="text-sm text-text-secondary">{review.mechanicReply}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
