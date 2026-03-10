# Kaput — Project Status

## Last Updated: March 4, 2026

---

## Overview
A premium platform connecting car owners with trusted mechanics in Vancouver.
- **Repo**: `/Users/kasramolaei/projects/car-mechanic/`
- **Stack**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Firebase, Stripe, Zustand
- **Theme**: Dark (#0a0a0f base) + Electric Blue (#3b82f6 accent)

---

## Completed Features

### Foundation (Commit: 973550a)
- [x] Project config (CLAUDE.md, hooks, skills)
- [x] Design system & tokens (globals.css, dark theme)
- [x] TypeScript types (user, vehicle, mechanic, quote, booking, review, message)
- [x] Firebase client init (singleton pattern)
- [x] UI primitives (Button, Input, Card, Modal, Badge, Spinner)
- [x] Layout (Navbar, Footer)
- [x] Landing page with animations
- [x] Zustand auth store

### Auth & App Pages (Commit: 451e200)
- [x] Login page (Firebase email + Google auth)
- [x] Signup page (role selection: car_owner / mechanic)
- [x] Onboarding (vehicle add for owners, business info for mechanics)
- [x] AuthContext + AuthGuard
- [x] Map search page (Google Maps integration, filters: search, service type, rating)
- [x] Mechanic profile page (real Firestore data, services, hours, reviews)
- [x] Quote request flow (4-step guided form: vehicle → service → details → review)
- [x] Quote comparison view (side-by-side response cards)
- [x] Car owner dashboard (vehicles, quotes, bookings)
- [x] Mechanic dashboard (incoming quotes, active jobs, earnings, reviews)
- [x] Quote response modal (itemized parts/labor, estimated time)
- [x] SEO (sitemap, robots, OG images, JSON-LD schemas)
- [x] Marketing pages (for-mechanics, pricing with FAQ JSON-LD)

### Booking & Chat (Commit: b9cf637)
- [x] Booking creation with DateTimePicker (custom calendar)
- [x] Booking detail page (status, payment, mechanic info)
- [x] Cancellation with reason
- [x] Real-time chat (Firestore onSnapshot)
- [x] Chat UI (message bubbles, auto-scroll, read-only for closed bookings)

### Session: March 4, 2026 (Uncommitted)
- [x] **Review submission system** — ReviewForm component, createReviewDoc Firestore helper, mechanic rating auto-update, "Leave Review" on completed bookings, mechanic reply modal
- [x] **Settings page** — Profile editing (name, phone), vehicle management (add/delete), password change, role badge display
- [x] **Photo upload in quote flow** — Firebase Storage upload via `uploadQuotePhotos()`, wired into QuoteForm (was TODO stub)
- [x] **Stripe Elements integration** — Real PaymentElement with dark theme, `stripe.confirmPayment()`, Stripe webhook route for payment_intent.succeeded
- [x] **Push notifications (FCM)** — Service worker, token registration, NotificationContext, Toast component, foreground message listener, notification triggers (quote response, booking confirmed, new review, appointment reminder)

---

## What's Still Missing (vs. MVP Plan)

### Partial / Needs Work
| Feature | Gap |
|---|---|
| Onboarding (mechanic) | No certifications upload, no portfolio photos, no hours of operation, location hardcoded to {0,0} |
| Map search | Google Maps API key missing from .env.local, default center is NYC (plan: Vancouver), no distance filter, no auto-expand radius |
| Mechanic dashboard | All quotes shown system-wide (not geo-filtered), no calendar view, no analytics, no profile editing, no subscription management |
| Booking detail | Mechanic can't update status to in_progress/completed, no 24h cancellation fee logic |
| Quote comparison | Shows raw vehicleId instead of vehicle name |

### Not Built
| Feature | Notes |
|---|---|
| Stripe Connect (payouts) | Mechanic payouts not implemented |
| Subscription billing UI | Dashboard shows warning badge but no activation/management flow |
| Additional work approval | Mechanic can't send updated quote mid-repair |
| Masked phone calls | Listed in plan, not implemented |
| Image sharing in chat | Message type supports it, ChatInput only sends text |
| Dynamic sitemap | Static sitemap misses mechanic profile URLs |

### Environment Gaps
Missing from `.env.local`:
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_FIREBASE_VAPID_KEY`

---

## File Count Summary
- **Total files created/modified this session**: 15
- **New components**: ReviewForm, ReviewReplyModal, SettingsContent, Toast, PaymentSection (rewritten)
- **New libs**: storage.ts, notifications.ts, notification-triggers.ts
- **New contexts**: NotificationContext
- **New API routes**: /api/stripe/webhook
- **New public files**: firebase-messaging-sw.js

---

## Commands
```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # ESLint
npx tsc --noEmit   # Type check (0 errors as of last check)
```
