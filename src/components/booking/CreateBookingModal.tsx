'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Zap } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DateTimePicker } from '@/components/booking/DateTimePicker';
import { createBookingDoc } from '@/lib/firestore-helpers';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { QuoteResponse, BookingType } from '@/types';

interface CreateBookingModalProps {
  open: boolean;
  onClose: () => void;
  quoteId: string;
  vehicleId: string;
  carOwnerId: string;
  response: QuoteResponse;
}

export function CreateBookingModal({
  open,
  onClose,
  quoteId,
  vehicleId,
  carOwnerId,
  response,
}: CreateBookingModalProps) {
  const router = useRouter();
  const [bookingType, setBookingType] = useState<BookingType>('scheduled');
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = bookingType === 'immediate' || scheduledDate !== null;

  async function handleSubmit() {
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    try {
      const date = bookingType === 'immediate' ? new Date() : scheduledDate!;
      const booking = await createBookingDoc({
        quoteId,
        carOwnerId,
        mechanicId: response.mechanicId,
        vehicleId,
        scheduledAt: date,
        type: bookingType,
        totalCost: response.totalCost,
      });

      router.push(`/booking/${booking.id}`);
    } catch {
      setError('Failed to create booking. Please try again.');
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Book Appointment" className="max-w-lg">
      <div className="space-y-4">
        {/* Quote summary */}
        <div className="rounded-[var(--radius-md)] bg-bg-secondary p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Quote Total</span>
            <span className="font-bold text-text-primary">{formatCurrency(response.totalCost)}</span>
          </div>
          <p className="mt-1 text-xs text-text-muted">Est. {response.estimatedTime}</p>
        </div>

        {/* Booking type */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-text-secondary">Appointment Type</p>
          <div className="grid grid-cols-2 gap-3">
            <Card
              hover
              onClick={() => setBookingType('immediate')}
              className={cn(
                'flex flex-col items-center gap-2 p-4 text-center',
                bookingType === 'immediate' && 'border-accent ring-1 ring-accent/50'
              )}
            >
              <Zap className="h-5 w-5 text-warning" />
              <span className="text-sm font-medium text-text-primary">Immediate</span>
              <span className="text-xs text-text-muted">As soon as possible</span>
            </Card>
            <Card
              hover
              onClick={() => setBookingType('scheduled')}
              className={cn(
                'flex flex-col items-center gap-2 p-4 text-center',
                bookingType === 'scheduled' && 'border-accent ring-1 ring-accent/50'
              )}
            >
              <Calendar className="h-5 w-5 text-accent-light" />
              <span className="text-sm font-medium text-text-primary">Scheduled</span>
              <span className="text-xs text-text-muted">Pick a date & time</span>
            </Card>
          </div>
        </div>

        {/* Date picker for scheduled */}
        {bookingType === 'scheduled' && (
          <DateTimePicker
            selectedDate={scheduledDate}
            onSelect={setScheduledDate}
          />
        )}

        {error && <p className="text-sm text-error">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading} disabled={!canSubmit}>
            Confirm Booking
          </Button>
        </div>
      </div>
    </Modal>
  );
}
