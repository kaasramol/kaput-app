import type { Timestamp } from 'firebase/firestore';

export interface Review {
  id: string;
  bookingId: string;
  carOwnerId: string;
  mechanicId: string;
  rating: number;
  comment: string;
  mechanicReply?: string;
  flagged: boolean;
  createdAt: Timestamp;
}
