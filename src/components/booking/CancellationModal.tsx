'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { cancelBooking } from '@/lib/firestore-helpers';

interface CancellationModalProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  scheduledAt?: Date;
  onCancelled: () => void;
}

function isWithin24Hours(scheduledAt?: Date): boolean {
  if (!scheduledAt) return false;
  const hoursUntil = (scheduledAt.getTime() - Date.now()) / (1000 * 60 * 60);
  return hoursUntil < 24;
}

export function CancellationModal({ open, onClose, bookingId, scheduledAt, onCancelled }: CancellationModalProps) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lateFee = isWithin24Hours(scheduledAt);

  async function handleCancel() {
    if (!reason.trim()) return;
    setLoading(true);
    setError(null);

    try {
      await cancelBooking(bookingId, reason.trim());
      onCancelled();
      onClose();
    } catch {
      setError('Failed to cancel booking. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Cancel Booking">
      <div className="space-y-4">
        {lateFee && (
          <div className="rounded-[var(--radius-md)] border border-warning/30 bg-warning/10 p-3">
            <p className="text-sm font-medium text-warning">Late cancellation fee applies</p>
            <p className="mt-1 text-xs text-text-secondary">
              This booking is within 24 hours of the scheduled time. A cancellation fee will be charged.
            </p>
          </div>
        )}
        <p className="text-sm text-text-secondary">
          Are you sure you want to cancel this booking? Please provide a reason.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for cancellation..."
          rows={3}
          className="w-full rounded-[var(--radius-md)] border border-border bg-bg-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50 resize-none"
        />
        {error && <p className="text-sm text-error">{error}</p>}
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Keep Booking
          </Button>
          <Button
            variant="danger"
            onClick={handleCancel}
            loading={loading}
            disabled={!reason.trim()}
          >
            {lateFee ? 'Cancel (Fee Applies)' : 'Cancel Booking'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
