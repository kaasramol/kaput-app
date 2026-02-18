# Kaput — Full Project Scope & Plan

## Vision
A premium platform connecting car owners with trusted mechanics in Vancouver. Car owners find nearby shops on a map, request quotes, compare prices, book, pay, and leave reviews — all in one place.

---

## Brand

| Attribute | Value |
|---|---|
| **Name** | Kaput |
| **Tagline** | *"Your car is kaput? We've got you."* |
| **Style** | Premium & trust |
| **Colors** | Dark theme (#0a0a0f base) + Electric blue (#3b82f6 accent) |
| **City** | Vancouver, BC (first market) |
| **Language** | English only |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Styling** | Tailwind CSS |
| **Backend** | Firebase (Auth, Firestore, Storage, Cloud Functions) |
| **Map** | Google Maps API |
| **Payments** | Stripe |
| **Push Notifications** | Firebase Cloud Messaging |
| **Deployment** | Vercel |

---

## User Roles

### Car Owner
- Account required to browse
- Must add at least one vehicle (make, model, year) during onboarding
- Can save multiple vehicles later (Phase 2)

### Mechanic
- Self sign-up, create full profile
- Profile includes: basic info, certifications/badges, portfolio photos
- Full web dashboard: calendar, earnings, analytics, customer history, reviews

---

## MVP Features (Phase 1)

### Authentication & Onboarding
- Sign up / login via Firebase Auth (email + Google)
- Car owner onboarding: add vehicle (make, model, year — required)
- Mechanic onboarding: business info, services, certifications, photos

### Map-Based Search
- Full-screen map with shop pins (Google Maps)
- List slides up from bottom on mobile
- Filter by: service type, distance, rating, availability
- Auto-expand search radius if no mechanics respond

### Mechanic Profile Page
- Name, address, hours of operation
- Services offered with pricing ranges
- Certifications & badges (verified)
- Portfolio: photos of past work
- Reviews & ratings (from verified bookings)
- "Request Quote" CTA

### Quote Request Flow
1. Car owner selects vehicle from profile
2. Guided form: select service category → specific symptoms
3. Upload photos/videos of the issue
4. Simple symptom checker (dropdown-based, not full AI)
5. Submit request → sent to nearby mechanics
6. Mechanics respond with: follow-up questions → itemized quote (parts, labor, tax) + time estimate
7. Car owner sees side-by-side quote comparison
8. Accept a quote → proceed to booking

### Booking System
- Immediate service or schedule future date/time
- Calendar-based time slot selection
- Booking confirmation with push notification
- Free cancellation up to 24h before appointment
- Cancellation fee if < 24h

### In-App Communication
- Real-time chat between car owner and mechanic
- Masked phone call option (privacy-protected)
- Chat history preserved per booking

### Payment (Stripe)
- All payments through the platform
- Secure checkout via Stripe
- Itemized invoice/receipt
- Mechanic payouts via Stripe Connect

### Reviews & Ratings
- Only verified booking completions can leave reviews
- Star rating + written review
- AI moderation layer for spam/fake detection
- Mechanic can respond to reviews

### Car Owner Dashboard
- Active bookings with status
- Upcoming appointments
- Quick actions: message mechanic, cancel, view details

### Mechanic Dashboard
- Incoming quote requests
- Active jobs / calendar view
- Earnings overview & analytics
- Customer history
- Review management
- Subscription/billing management

### Notifications
- Push notifications via Firebase Cloud Messaging
- Triggers: new quote response, booking confirmed, appointment reminder, repair status update, new review

### Additional Work Approval
- If mechanic discovers extra issues during repair:
  - Must send updated quote through the platform
  - Car owner receives notification
  - Car owner must approve before extra work begins
  - Original work pauses until approval

---

## MVP Business Rules

| Rule | Detail |
|---|---|
| **Revenue model** | Mechanic subscription (monthly fee to be listed) |
| **Payment flow** | All payments through Stripe on the platform |
| **Cancellation** | Free cancellation 24h+ before, fee if < 24h |
| **Disputes** | Resolved directly between car owner and mechanic |
| **Extra work** | Mechanic sends updated quote, owner must approve |
| **No responses** | Auto-expand search radius |
| **Decline requests** | Mechanics can freely decline any request |

---

## Phase 2 (Post-Launch)

- Full AI diagnosis chat (conversational symptom analysis)
- Live repair timeline (status steps, photos, notes, parts used, time spent)
- Towing service integration (for cars that can't drive to the shop)
- Multiple vehicles per account
- Full owner hub: service history, saved mechanics, maintenance reminders, spending analytics
- Vehicle-centric timeline view
- Video call option for remote diagnosis
- SMS + email notification channels
- Multi-language support (French, Mandarin, Punjabi)
- Mobile native apps (iOS / Android)
- Mechanic mobile app (simplified dashboard)

---

## Page Structure (MVP)

```
/                        → Landing page (hero, value prop, how it works, CTA)
/login                   → Login page
/signup                  → Sign up page (car owner / mechanic role selection)
/onboarding              → Add vehicle (car owner) or business info (mechanic)
/map                     → Full-screen map search with mechanic pins
/mechanic/[id]           → Mechanic profile page
/quote/new               → Quote request form (guided)
/quote/[id]              → Quote detail + comparison view
/booking/[id]            → Booking detail page
/dashboard               → Car owner dashboard (active bookings)
/dashboard/mechanic      → Mechanic dashboard (requests, calendar, earnings)
/chat/[bookingId]        → Chat between car owner and mechanic
/settings                → Account settings, vehicle management, notifications
```

---

## Component Architecture

```
src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Auth group (login, signup, onboarding)
│   ├── (main)/                   # Main app group (map, dashboard, etc.)
│   ├── layout.tsx                # Root layout (dark theme, fonts)
│   └── page.tsx                  # Landing page
├── components/
│   ├── ui/                       # Reusable UI primitives (Button, Input, Card, Modal)
│   ├── layout/                   # Navbar, Footer, Sidebar
│   ├── map/                      # Map, MapPin, MapControls, MechanicCard
│   ├── quote/                    # QuoteForm, QuoteComparison, QuoteCard
│   ├── booking/                  # BookingCard, BookingDetail, Calendar
│   ├── mechanic/                 # MechanicProfile, ServiceList, ReviewCard
│   ├── dashboard/                # OwnerDashboard, MechanicDashboard, Stats
│   └── chat/                     # ChatWindow, MessageBubble, ChatInput
├── lib/
│   ├── firebase.ts               # Firebase config & initialization
│   ├── auth.ts                   # Auth helpers
│   ├── db.ts                     # Firestore helpers
│   ├── storage.ts                # Firebase Storage helpers
│   ├── stripe.ts                 # Stripe integration
│   └── maps.ts                   # Google Maps helpers
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts
│   ├── useFirestore.ts
│   ├── useMap.ts
│   └── useChat.ts
├── types/                        # TypeScript interfaces
│   ├── user.ts
│   ├── vehicle.ts
│   ├── mechanic.ts
│   ├── quote.ts
│   ├── booking.ts
│   └── review.ts
├── context/                      # React Context providers
│   ├── AuthContext.tsx
│   └── MapContext.tsx
└── styles/
    └── globals.css               # Global styles + Tailwind config
```

---

## Database Schema (Firestore Collections)

### users
```
{
  uid: string,
  email: string,
  displayName: string,
  role: "car_owner" | "mechanic",
  phone?: string,
  avatarUrl?: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### vehicles
```
{
  id: string,
  ownerId: string (ref: users),
  make: string,
  model: string,
  year: number,
  color?: string,
  licensePlate?: string,
  vin?: string,
  createdAt: timestamp
}
```

### mechanics
```
{
  id: string,
  userId: string (ref: users),
  businessName: string,
  address: string,
  location: GeoPoint,
  phone: string,
  hours: { [day]: { open: string, close: string } },
  services: string[],
  certifications: string[],
  portfolioImages: string[],
  description: string,
  rating: number,
  reviewCount: number,
  subscriptionStatus: "active" | "inactive" | "trial",
  subscriptionPlan: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### quotes
```
{
  id: string,
  carOwnerId: string (ref: users),
  vehicleId: string (ref: vehicles),
  serviceCategory: string,
  symptoms: string[],
  description: string,
  photos: string[],
  status: "open" | "quoted" | "accepted" | "expired",
  responses: [
    {
      mechanicId: string,
      message?: string,
      items: [{ description: string, type: "parts" | "labor", cost: number }],
      totalCost: number,
      estimatedTime: string,
      respondedAt: timestamp
    }
  ],
  acceptedMechanicId?: string,
  createdAt: timestamp,
  expiresAt: timestamp
}
```

### bookings
```
{
  id: string,
  quoteId: string (ref: quotes),
  carOwnerId: string (ref: users),
  mechanicId: string (ref: mechanics),
  vehicleId: string (ref: vehicles),
  scheduledAt: timestamp,
  type: "immediate" | "scheduled",
  status: "confirmed" | "in_progress" | "completed" | "cancelled",
  totalCost: number,
  paymentStatus: "pending" | "paid" | "refunded",
  stripePaymentId?: string,
  cancellationReason?: string,
  cancelledAt?: timestamp,
  completedAt?: timestamp,
  createdAt: timestamp
}
```

### reviews
```
{
  id: string,
  bookingId: string (ref: bookings),
  carOwnerId: string (ref: users),
  mechanicId: string (ref: mechanics),
  rating: number (1-5),
  comment: string,
  mechanicReply?: string,
  flagged: boolean,
  createdAt: timestamp
}
```

### messages
```
{
  id: string,
  bookingId: string (ref: bookings),
  senderId: string (ref: users),
  text: string,
  imageUrl?: string,
  readAt?: timestamp,
  createdAt: timestamp
}
```

---

## Design Tokens

```css
/* Colors */
--color-bg-primary: #0a0a0f;
--color-bg-secondary: #12121a;
--color-bg-card: #1a1a2e;
--color-bg-elevated: #222238;
--color-accent: #3b82f6;
--color-accent-hover: #2563eb;
--color-accent-light: #60a5fa;
--color-text-primary: #f1f5f9;
--color-text-secondary: #94a3b8;
--color-text-muted: #64748b;
--color-border: #2d2d44;
--color-success: #22c55e;
--color-warning: #f59e0b;
--color-error: #ef4444;

/* Typography */
--font-heading: 'Inter', sans-serif;
--font-body: 'Inter', sans-serif;

/* Spacing */
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 16px;
--radius-full: 9999px;

/* Shadows */
--shadow-card: 0 4px 24px rgba(0, 0, 0, 0.3);
--shadow-elevated: 0 8px 40px rgba(0, 0, 0, 0.5);
```
