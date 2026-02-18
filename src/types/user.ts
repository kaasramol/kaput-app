import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'car_owner' | 'mechanic';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
