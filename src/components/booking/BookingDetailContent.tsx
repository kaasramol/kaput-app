'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getBookingById, getMechanicById, getMechanicByUserId, getReviewByBooking } from '@/lib/firestore-queries';
import { updateBookingPayment, updateBookingStatus } from '@/lib/firestore-helpers';
import { formatDateTime, formatCurrency } from '@/lib/format';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { PaymentSection } from '@/components/booking/PaymentSection';
import { CancellationModal } from '@/components/booking/CancellationModal';
import { AdditionalWorkApproval } from '@/components/booking/AdditionalWorkApproval';
import { ReviewForm } from '@/components/booking/ReviewForm';
import { ReviewCard } from '@/components/mechanic/ReviewCard';
import { MaskedCallButton } from '@/components/booking/MaskedCallButton';
import type { Booking, BookingStatus, PaymentStatus, MechanicProfile, Review } from '@/types';

interface BookingDetailContentProps {
  bookingId: string;
}

const STATUS_CONFIG: Record<BookingStatus, { label: string; variant: 'info' | 'warning' | 'success' | 'default'; icon: typeof Calendar }> = {
  confirmed: { label: 'Confirmed', variant: 'info', icon: Calendar },
  in_progress: { label: 'In Progress', variant: 'warning', icon: Clock },
  completed: { label: 'Completed', variant: 'success', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', variant: 'default', icon: XCircle },
};

const PAYMENT_CONFIG: Record<PaymentStatus, { label: string; variant: 'warning' | 'success' | 'error' }> = {
  pending: { label: 'Payment Pending', variant: 'warning' },
  paid: { label: 'Paid', variant: 'success' },
  refunded: { label: 'Refunded', variant: 'error' },
};

export function BookingDetailContent({ bookingId }: BookingDetailContentProps) {
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [mechanic, setMechanic] = useState<MechanicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancel, setShowCancel] = useState(false);
  const [review, setReview] = useState<Review | null>(null);
  const [reviewLoaded, setReviewLoaded] = useState(false);
  const [isMechanic, setIsMechanic] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const b = await getBookingById(bookingId);
        if (!cancelled && b) {
          setBooking(b);
          const [m, existingReview, mechanicProfile] = await Promise.all([
            getMechanicById(b.mechanicId),
            b.status === 'completed' ? getReviewByBooking(b.id) : Promise.resolve(null),
            user ? getMechanicByUserId(user.uid) : Promise.resolve(null),
          ]);
          if (!cancelled) {
            setMechanic(m);
            setReview(existingReview);
            setReviewLoaded(true);
            setIsMechanic(mechanicProfile?.id === b.mechanicId);
          }
        }
      } catch {
        if (!cancelled) setError('Failed to load booking details.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [bookingId, user]);

  const handlePaymentComplete = useCallback(async (stripePaymentId: string) => {
    if (!booking) return;
    try {
      await updateBookingPayment(booking.id, stripePaymentId);
      setBooking((prev) => prev ? { ...prev, paymentStatus: 'paid', stripePaymentId } : null);
    } catch {
      // Payment recorded on Stripe side, will reconcile
    }
  }, [booking]);

  const handleCancelled = useCallback(() => {
    setBooking((prev) => prev ? { ...prev, status: 'cancelled' } : null);
  }, []);

  const handleStatusUpdate = useCallback(async (newStatus: 'in_progress' | 'completed') => {
    if (!booking) return;
    setStatusUpdating(true);
    try {
      await updateBookingStatus(booking.id, newStatus);
      setBooking((prev) => prev ? { ...prev, status: newStatus } : null);
    } catch {
      // Silently fail — user can retry
    } finally {
      setStatusUpdating(false);
    }
  }, [booking]);

  const handleAdditionalWorkUpdated = useCallback((requestId: string, approved: boolean) => {
    setBooking((prev) => {
      if (!prev) return null;
      const requests = (prev.additionalWork ?? []).map((r) =>
        r.id === requestId ? { ...r, status: approved ? 'approved' as const : 'declined' as const } : r
      );
      const approvedCost = approved
        ? (prev.additionalWork ?? []).find((r) => r.id === requestId)?.totalCost ?? 0
        : 0;
      return { ...prev, additionalWork: requests, totalCost: prev.totalCost + approvedCost };
    });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="text-lg font-medium text-text-primary">{error ?? 'Booking not found'}</p>
        <Link href="/dashboard">
          <Button variant="secondary" size="sm" className="mt-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const status = STATUS_CONFIG[booking.status];
  const payment = PAYMENT_CONFIG[booking.paymentStatus];
  const isOwner = user?.uid === booking.carOwnerId;
  const canCancel = isOwner && (booking.status === 'confirmed');
  const showPayment = isOwner && booking.paymentStatus === 'pending' && booking.status !== 'cancelled';
  const StatusIcon = status.icon;

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <StatusIcon className="h-6 w-6 text-accent-light" />
            <h1 className="text-2xl font-bold text-text-primary">Booking Details</h1>
          </div>
          <p className="mt-1 text-sm text-text-secondary">
            Booking ID: {booking.id.slice(0, 8)}...
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={status.variant}>{status.label}</Badge>
          <Badge variant={payment.variant}>{payment.label}</Badge>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-accent-light" />
            <div>
              <p className="text-xs text-text-muted">Scheduled For</p>
              <p className="font-medium text-text-primary">{formatDateTime(booking.scheduledAt)}</p>
              <Badge variant="default" className="mt-1">{booking.type}</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-accent-light" />
            <div>
              <p className="text-xs text-text-muted">Total Cost</p>
              <p className="text-xl font-bold text-text-primary">{formatCurrency(booking.totalCost)}</p>
            </div>
          </div>
        </Card>

        {mechanic && (
          <Card className="p-4 sm:col-span-2">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-accent-light" />
              <div>
                <p className="text-xs text-text-muted">Mechanic</p>
                <Link
                  href={`/mechanic/${mechanic.id}`}
                  className="font-medium text-text-primary hover:text-accent transition-colors"
                >
                  {mechanic.businessName}
                </Link>
                <p className="text-sm text-text-secondary">{mechanic.address}</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Cancellation reason */}
      {booking.status === 'cancelled' && booking.cancellationReason && (
        <Card className="border-error/30 bg-error/5 p-4">
          <p className="text-sm font-medium text-error">Cancellation Reason</p>
          <p className="mt-1 text-sm text-text-primary">{booking.cancellationReason}</p>
        </Card>
      )}

      {/* Additional work requests */}
      {booking.additionalWork && booking.additionalWork.length > 0 && (
        <AdditionalWorkApproval
          bookingId={booking.id}
          mechanicId={booking.mechanicId}
          requests={booking.additionalWork}
          isOwner={isOwner}
          onUpdated={handleAdditionalWorkUpdated}
        />
      )}

      {/* Payment */}
      {showPayment && (
        <PaymentSection
          amount={booking.totalCost}
          bookingId={booking.id}
          carOwnerId={booking.carOwnerId}
          mechanicId={booking.mechanicId}
          onPaymentComplete={handlePaymentComplete}
        />
      )}

      {/* Mechanic status actions */}
      {isMechanic && booking.status === 'confirmed' && (
        <div className="flex justify-end">
          <Button size="sm" onClick={() => handleStatusUpdate('in_progress')} loading={statusUpdating}>
            Start Work
          </Button>
        </div>
      )}
      {isMechanic && booking.status === 'in_progress' && (
        <div className="flex justify-end">
          <Button size="sm" onClick={() => handleStatusUpdate('completed')} loading={statusUpdating}>
            Mark Completed
          </Button>
        </div>
      )}

      {/* Owner cancel action */}
      {canCancel && (
        <div className="flex justify-end">
          <Button variant="danger" size="sm" onClick={() => setShowCancel(true)}>
            Cancel Booking
          </Button>
        </div>
      )}

      {/* Communication */}
      {booking.status !== 'cancelled' && (
        <div className="flex flex-wrap items-center gap-3">
          <Link href={`/chat/${booking.id}`}>
            <Button variant="secondary" size="sm">
              {isOwner ? 'Message Mechanic' : 'Message Customer'}
            </Button>
          </Link>
          <MaskedCallButton
            bookingId={booking.id}
            callerId={user?.uid ?? ''}
            callerPhone={user?.phone ?? undefined}
            targetRole={isOwner ? 'mechanic' : 'car_owner'}
            mechanicId={booking.mechanicId}
            carOwnerId={booking.carOwnerId}
          />
        </div>
      )}

      {/* Review section */}
      {isOwner && booking.status === 'completed' && reviewLoaded && (
        review ? (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-text-primary">Your Review</h3>
            <ReviewCard review={review} />
          </div>
        ) : (
          <ReviewForm
            bookingId={booking.id}
            carOwnerId={booking.carOwnerId}
            mechanicId={booking.mechanicId}
            onReviewSubmitted={(r) => setReview(r)}
          />
        )
      )}

      {/* Cancel modal */}
      <CancellationModal
        open={showCancel}
        onClose={() => setShowCancel(false)}
        bookingId={booking.id}
        scheduledAt={booking.scheduledAt?.toDate?.() ?? undefined}
        onCancelled={handleCancelled}
      />
    </div>
  );
}
