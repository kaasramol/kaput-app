'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Wrench, Play, CheckCircle2, MessageSquare, PlusCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { updateBookingStatus } from '@/lib/firestore-helpers';
import { AdditionalWorkModal } from '@/components/booking/AdditionalWorkModal';
import { formatDate, formatCurrency } from '@/lib/format';
import type { Booking, BookingStatus, AdditionalWorkRequest } from '@/types';

interface ActiveJobsSectionProps {
  bookings: Booking[];
}

const STATUS_BADGE: Record<BookingStatus, { label: string; variant: 'info' | 'warning' | 'success' | 'default' }> = {
  confirmed: { label: 'Confirmed', variant: 'info' },
  in_progress: { label: 'In Progress', variant: 'warning' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'default' },
};

export function ActiveJobsSection({ bookings: initialBookings }: ActiveJobsSectionProps) {
  const [bookings, setBookings] = useState(initialBookings);

  const active = bookings.filter((b) => b.status === 'confirmed' || b.status === 'in_progress');
  const recent = bookings
    .filter((b) => b.status === 'completed' || b.status === 'cancelled')
    .slice(0, 5);

  async function handleStatusUpdate(bookingId: string, newStatus: 'in_progress' | 'completed') {
    try {
      await updateBookingStatus(bookingId, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch {
      // Status update failed
    }
  }

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
            <BookingRow
              key={booking.id}
              booking={booking}
              onStatusUpdate={handleStatusUpdate}
            />
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

function BookingRow({
  booking,
  onStatusUpdate,
}: {
  booking: Booking;
  onStatusUpdate?: (bookingId: string, status: 'in_progress' | 'completed') => void;
}) {
  const [updating, setUpdating] = useState(false);
  const [showAdditionalWork, setShowAdditionalWork] = useState(false);
  const [localBooking, setLocalBooking] = useState(booking);
  const badge = STATUS_BADGE[localBooking.status];

  const pendingRequests = (localBooking.additionalWork ?? []).filter((r) => r.status === 'pending').length;

  async function handleUpdate(status: 'in_progress' | 'completed') {
    if (!onStatusUpdate) return;
    setUpdating(true);
    await onStatusUpdate(localBooking.id, status);
    setUpdating(false);
  }

  function handleAdditionalWorkSent(request: AdditionalWorkRequest) {
    setLocalBooking((prev) => ({
      ...prev,
      additionalWork: [...(prev.additionalWork ?? []), request],
    }));
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-[var(--radius-md)] bg-bg-elevated p-2">
            <Calendar className="h-5 w-5 text-accent-light" />
          </div>
          <div>
            <p className="font-medium text-text-primary">{formatDate(localBooking.scheduledAt)}</p>
            <p className="text-sm text-text-secondary">{formatCurrency(localBooking.totalCost)}</p>
            {pendingRequests > 0 && (
              <p className="text-xs text-warning">
                {pendingRequests} additional work request{pendingRequests > 1 ? 's' : ''} pending
              </p>
            )}
          </div>
        </div>
        <Badge variant={badge.variant}>{badge.label}</Badge>
      </div>

      {/* Actions for active bookings */}
      {onStatusUpdate && (localBooking.status === 'confirmed' || localBooking.status === 'in_progress') && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
          {localBooking.status === 'confirmed' && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleUpdate('in_progress')}
              disabled={updating}
            >
              <Play className="h-3.5 w-3.5" />
              Start Job
            </Button>
          )}
          {localBooking.status === 'in_progress' && (
            <>
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleUpdate('completed')}
                disabled={updating}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Mark Complete
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowAdditionalWork(true)}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Additional Work
              </Button>
            </>
          )}
          <Link href={`/chat/${localBooking.id}`}>
            <Button size="sm" variant="ghost">
              <MessageSquare className="h-3.5 w-3.5" />
              Chat
            </Button>
          </Link>
        </div>
      )}

      <AdditionalWorkModal
        open={showAdditionalWork}
        onClose={() => setShowAdditionalWork(false)}
        bookingId={localBooking.id}
        carOwnerId={localBooking.carOwnerId}
        onRequestSent={handleAdditionalWorkSent}
      />
    </Card>
  );
}
