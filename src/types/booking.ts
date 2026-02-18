import type { Timestamp } from 'firebase/firestore';

export type BookingStatus = 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export type BookingType = 'immediate' | 'scheduled';

export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface Booking {
  id: string;
  quoteId: string;
  carOwnerId: string;
  mechanicId: string;
  vehicleId: string;
  scheduledAt: Timestamp;
  type: BookingType;
  status: BookingStatus;
  totalCost: number;
  paymentStatus: PaymentStatus;
  stripePaymentId?: string;
  cancellationReason?: string;
  cancelledAt?: Timestamp;
  completedAt?: Timestamp;
  createdAt: Timestamp;
}
