'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { createReviewDoc } from '@/lib/firestore-helpers';
import { sendNewReviewNotification } from '@/lib/notification-triggers';
import type { Review } from '@/types';

interface ReviewFormProps {
  bookingId: string;
  carOwnerId: string;
  mechanicId: string;
  onReviewSubmitted: (review: Review) => void;
}

export function ReviewForm({ bookingId, carOwnerId, mechanicId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayRating = hoveredRating || rating;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }
    if (comment.trim().length < 10) {
      setError('Please write at least 10 characters.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const review = await createReviewDoc({
        bookingId,
        carOwnerId,
        mechanicId,
        rating,
        comment: comment.trim(),
      });
      sendNewReviewNotification(mechanicId, review.id, rating).catch(() => {});
      onReviewSubmitted(review);
    } catch {
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-text-primary">Leave a Review</h3>
      <p className="mt-1 text-sm text-text-secondary">
        How was your experience? Your feedback helps other car owners.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* Star rating */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">Rating</label>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
              const starValue = i + 1;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoveredRating(starValue)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="rounded-sm p-0.5 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      'h-7 w-7 transition-colors',
                      starValue <= displayRating
                        ? 'fill-warning text-warning'
                        : 'text-bg-elevated hover:text-text-muted'
                    )}
                  />
                </button>
              );
            })}
            {rating > 0 && (
              <span className="ml-2 text-sm text-text-secondary">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Great'}
                {rating === 5 && 'Excellent'}
              </span>
            )}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="review-comment" className="mb-2 block text-sm font-medium text-text-primary">
            Your Review
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell others about your experience..."
            rows={4}
            className="w-full rounded-[var(--radius-md)] border border-border bg-bg-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <p className="mt-1 text-xs text-text-muted">{comment.length} characters (min 10)</p>
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        <Button type="submit" loading={submitting} disabled={rating === 0 || submitting}>
          Submit Review
        </Button>
      </form>
    </Card>
  );
}
