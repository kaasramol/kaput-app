# /db-schema

Reference the Firestore database schema for the Kaput project.

## Collections

### users
- `uid`, `email`, `displayName`, `role` (car_owner | mechanic), `phone?`, `avatarUrl?`, `createdAt`, `updatedAt`

### vehicles
- `id`, `ownerId` → users, `make`, `model`, `year`, `color?`, `licensePlate?`, `vin?`, `createdAt`

### mechanics
- `id`, `userId` → users, `businessName`, `address`, `location` (GeoPoint), `phone`, `hours` (BusinessHours), `services[]`, `certifications[]`, `portfolioImages[]`, `description`, `rating`, `reviewCount`, `subscriptionStatus`, `subscriptionPlan`, `createdAt`, `updatedAt`

### quotes
- `id`, `carOwnerId` → users, `vehicleId` → vehicles, `serviceCategory`, `symptoms[]`, `description`, `photos[]`, `status` (open | quoted | accepted | expired), `responses[]` (QuoteResponse), `acceptedMechanicId?`, `createdAt`, `expiresAt`

### bookings
- `id`, `quoteId` → quotes, `carOwnerId` → users, `mechanicId` → mechanics, `vehicleId` → vehicles, `scheduledAt`, `type` (immediate | scheduled), `status` (confirmed | in_progress | completed | cancelled), `totalCost`, `paymentStatus` (pending | paid | refunded), `stripePaymentId?`, `cancellationReason?`, `cancelledAt?`, `completedAt?`, `createdAt`

### reviews
- `id`, `bookingId` → bookings, `carOwnerId` → users, `mechanicId` → mechanics, `rating` (1-5), `comment`, `mechanicReply?`, `flagged`, `createdAt`

### messages
- `id`, `bookingId` → bookings, `senderId` → users, `text`, `imageUrl?`, `readAt?`, `createdAt`

## TypeScript Types
All types are defined in `src/types/` with a barrel export from `src/types/index.ts`.

## Usage
```tsx
import type { User, MechanicProfile, Quote, Booking } from '@/types';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
```
