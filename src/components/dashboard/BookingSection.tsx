'use client';

import { Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate, formatCurrency } from '@/lib/format';
import type { Booking, BookingStatus, PaymentStatus } from '@/types';

interface BookingSectionProps {
  bookings: Booking[];
}

const STATUS_BADGE: Record<BookingStatus, { label: string; variant: 'info' | 'warning' | 'success' | 'default' | 'error' }> = {
  confirmed: { label: 'Confirmed', variant: 'info' },
  in_progress: { label: 'In Progress', variant: 'warning' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'default' },
};

const PAYMENT_BADGE: Record<PaymentStatus, { label: string; variant: 'warning' | 'success' | 'error' }> = {
  pending: { label: 'Unpaid', variant: 'warning' },
  paid: { label: 'Paid', variant: 'success' },
  refunded: { label: 'Refunded', variant: 'error' },
};

function BookingCard({ booking }: { booking: Booking }) {
  const status = STATUS_BADGE[booking.status];
  const payment = PAYMENT_BADGE[booking.paymentStatus];

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-text-primary">{formatDate(booking.scheduledAt)}</p>
          <p className="mt-0.5 text-sm text-text-secondary">{formatCurrency(booking.totalCost)}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge variant={status.variant}>{status.label}</Badge>
          <Badge variant={payment.variant}>{payment.label}</Badge>
        </div>
      </div>
    </Card>
  );
}

export function BookingSection({ bookings }: BookingSectionProps) {
  if (bookings.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-bg-elevated p-4">
          <Calendar className="h-8 w-8 text-text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary">No bookings yet</h3>
        <p className="mt-1 text-sm text-text-secondary">Your upcoming and past bookings will appear here.</p>
      </Card>
    );
  }

  const upcoming = bookings.filter((b) => b.status === 'confirmed' || b.status === 'in_progress');
  const past = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div className="space-y-6">
      {upcoming.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">Upcoming Bookings</h2>
          {upcoming.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
      {past.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">Past Bookings</h2>
          {past.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}
