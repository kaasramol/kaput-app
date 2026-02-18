import type { Timestamp } from 'firebase/firestore';

export type QuoteStatus = 'open' | 'quoted' | 'accepted' | 'expired';

export type QuoteItemType = 'parts' | 'labor';

export interface QuoteItem {
  description: string;
  type: QuoteItemType;
  cost: number;
}

export interface QuoteResponse {
  mechanicId: string;
  message?: string;
  items: QuoteItem[];
  totalCost: number;
  estimatedTime: string;
  respondedAt: Timestamp;
}

export interface Quote {
  id: string;
  carOwnerId: string;
  vehicleId: string;
  serviceCategory: string;
  symptoms: string[];
  description: string;
  photos: string[];
  status: QuoteStatus;
  responses: QuoteResponse[];
  acceptedMechanicId?: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
}
