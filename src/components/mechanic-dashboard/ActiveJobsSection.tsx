'use client';

import { Calendar, Wrench } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate, formatCurrency } from '@/lib/format';
import type { Booking, BookingStatus } from '@/types';

interface ActiveJobsSectionProps {
  bookings: Booking[];
}

const STATUS_BADGE: Record<BookingStatus, { label: string; variant: 'info' | 'warning' | 'success' | 'default' }> = {
  confirmed: { label: 'Confirmed', variant: 'info' },
  in_progress: { label: 'In Progress', variant: 'warning' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'default' },
};

export function ActiveJobsSection({ bookings }: ActiveJobsSectionProps) {
  const active = bookings.filter((b) => b.status === 'confirmed' || b.status === 'in_progress');
  const recent = bookings
    .filter((b) => b.status === 'completed' || b.status === 'cancelled')
    .slice(0, 5);

  if (active.length === 0 && recent.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">Jobs</h2>
        <Card className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-bg-elevated p-4">
            <Wrench className="h-8 w-8 text-text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary">No jobs yet</h3>
          <p className="mt-1 text-sm text-text-secondary">
            Accepted quotes become jobs shown here.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {active.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">Active Jobs</h2>
          {active.map((booking) => (
            <BookingRow key={booking.id} booking={booking} />
          ))}
        </div>
      )}
      {recent.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">Recent Jobs</h2>
          {recent.map((booking) => (
            <BookingRow key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}

function BookingRow({ booking }: { booking: Booking }) {
  const badge = STATUS_BADGE[booking.status];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-[var(--radius-md)] bg-bg-elevated p-2">
            <Calendar className="h-5 w-5 text-accent-light" />
          </div>
          <div>
            <p className="font-medium text-text-primary">{formatDate(booking.scheduledAt)}</p>
            <p className="text-sm text-text-secondary">{formatCurrency(booking.totalCost)}</p>
          </div>
        </div>
        <Badge variant={badge.variant}>{badge.label}</Badge>
      </div>
    </Card>
  );
}
