import type { Timestamp } from 'firebase/firestore';

export interface Vehicle {
  id: string;
  ownerId: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  licensePlate?: string;
  vin?: string;
  createdAt: Timestamp;
}
