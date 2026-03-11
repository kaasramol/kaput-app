import type { Timestamp } from 'firebase/firestore';

export type BookingStatus = 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export type BookingType = 'immediate' | 'scheduled';

export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export type AdditionalWorkStatus = 'pending' | 'approved' | 'declined';

export interface AdditionalWorkItem {
  description: string;
  type: 'parts' | 'labor';
  cost: number;
}

export interface AdditionalWorkRequest {
  id: string;
  reason: string;
  items: AdditionalWorkItem[];
  totalCost: number;
  status: AdditionalWorkStatus;
  createdAt: Timestamp;
  respondedAt?: Timestamp;
}

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
  additionalWork?: AdditionalWorkRequest[];
  createdAt: Timestamp;
}
