# Kaput

A map-based marketplace connecting car owners with trusted mechanics in Vancouver. Owners describe the problem, attach photos, and collect itemized quotes; mechanics browse open requests, respond with parts/labor breakdowns, and manage jobs through a dedicated dashboard.

**Live demo:** https://kaput-azure.vercel.app. On the login page, pick **Demo as car owner** or **Demo as mechanic** to explore without signing up.

## Features

- **Quote flow** — 4-step guided request (vehicle → service → details → review) with photo uploads and side-by-side quote comparison
- **Map search** — Leaflet + OpenStreetMap mechanic discovery with service-type and rating filters
- **Bookings & chat** — real-time messaging (text + images) between owner and mechanic per booking
- **Masked calls** — Twilio proxy numbers so parties never see each other's real phone number
- **Mechanic subscriptions** — Stripe-powered plans with webhook-driven status updates
- **Push notifications** — Firebase Cloud Messaging with foreground toasts
- **Reviews** — ratings on mechanic profiles with mechanic replies

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Firebase (Auth, Firestore, Storage, FCM) · Stripe · Twilio · Zustand · Framer Motion

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Firebase, Stripe, and Twilio keys
npm run dev
```

Deploy Firestore/Storage security rules and indexes:

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

## Demo mode

The app runs end to end with only Firebase configured:

- **Payments.** Without `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, checkout shows a clearly labelled "Simulate payment" step and plan selection starts a trial directly. Add Stripe test keys and the real Stripe Elements / Checkout flow takes over automatically.
- **Uploads.** Photo uploads are best-effort. If Firebase Storage is not enabled, quotes and onboarding still submit without the photos.
- **Calls and push.** Masked calls stay hidden until `NEXT_PUBLIC_ENABLE_CALLS=true`. Push notifications need `NEXT_PUBLIC_FIREBASE_VAPID_KEY`; in-app notifications work without it.

Seed or reset the demo data (sample shops, reviews, a car owner with quotes, bookings and a chat thread):

```bash
node --env-file=.env.local scripts/seed-demo.mjs
```

All seeded shops carry `isDemo: true`, show a "Demo listing" badge, and are excluded from the sitemap. Re-running the script resets the demo quotes and bookings to their starting state.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type check |
| `node --env-file=.env.local scripts/seed-demo.mjs` | Seed / reset demo data |

## Project structure

```
src/
├── app/            # App Router pages ((auth), (main), api/stripe, api/call)
├── components/     # ui primitives, map, quote, booking, mechanic, dashboard, chat
├── lib/            # firebase init, firestore helpers, storage uploads, stripe
├── hooks/          # useChat, useMechanics, ...
├── context/        # Auth, Notification providers
└── types/          # user, vehicle, mechanic, quote, booking, review, message
```
