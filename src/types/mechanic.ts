import type { GeoPoint, Timestamp } from 'firebase/firestore';

export interface DayHours {
  open: string;
  close: string;
}

export type BusinessHours = Record<string, DayHours>;

export type SubscriptionStatus = 'active' | 'inactive' | 'trial';

export interface MechanicProfile {
  id: string;
  userId: string;
  businessName: string;
  address: string;
  location: GeoPoint;
  phone: string;
  hours: BusinessHours;
  services: string[];
  certifications: string[];
  portfolioImages: string[];
  description: string;
  rating: number;
  reviewCount: number;
  subscriptionStatus: SubscriptionStatus;
  subscriptionPlan: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
