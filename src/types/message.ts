import type { Timestamp } from 'firebase/firestore';

export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  text: string;
  imageUrl?: string;
  readAt?: Timestamp;
  createdAt: Timestamp;
}
