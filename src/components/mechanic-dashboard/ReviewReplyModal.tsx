'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { replyToReview } from '@/lib/firestore-helpers';

interface ReviewReplyModalProps {
  open: boolean;
  onClose: () => void;
  reviewId: string;
  onReplied: (reviewId: string, reply: string) => void;
}

export function ReviewReplyModal({ open, onClose, reviewId, onReplied }: ReviewReplyModalProps) {
  const [reply, setReply] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (reply.trim().length < 5) {
      setError('Reply must be at least 5 characters.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await replyToReview(reviewId, reply.trim());
      onReplied(reviewId, reply.trim());
      setReply('');
      onClose();
    } catch {
      setError('Failed to submit reply. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Reply to Review">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Write your response to this review..."
          rows={4}
          className="w-full rounded-[var(--radius-md)] border border-border bg-bg-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        {error && <p className="text-sm text-error">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting} disabled={submitting}>
            Submit Reply
          </Button>
        </div>
      </form>
    </Modal>
  );
}
