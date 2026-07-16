# Kaput

A map-based marketplace connecting car owners with trusted mechanics in Vancouver. Owners describe the problem, attach photos, and collect itemized quotes; mechanics browse open requests, respond with parts/labor breakdowns, and manage jobs through a dedicated dashboard.

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

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type check |

## Project structure

```
src/
├── app/            # App Router pages ((auth), (main), api/stripe, api/twilio)
├── components/     # ui primitives, map, quote, booking, mechanic, dashboard, chat
├── lib/            # firebase init, firestore helpers, storage uploads, stripe
├── hooks/          # useChat, useMechanics, ...
├── context/        # Auth, Notification providers
└── types/          # user, vehicle, mechanic, quote, booking, review, message
```
