# Kaput — Claude Code Project Instructions

## Tech Stack
- **Framework**: Next.js 16 (App Router) with React 19
- **Styling**: Tailwind CSS v4 (using `@theme inline` for design tokens)
- **Backend**: Firebase (Auth, Firestore, Storage, Cloud Functions)
- **Map**: Google Maps API (`@googlemaps/js-api-loader`)
- **Payments**: Stripe (`@stripe/stripe-js` + `stripe`)
- **State**: Zustand
- **Animation**: Framer Motion
- **Icons**: Lucide React

## Code Conventions
- **Strict TypeScript**: No `any`. All props typed with interfaces. Prefer `type` for unions, `interface` for objects.
- **Server Components by default**: Only add `'use client'` when using hooks, event handlers, or browser APIs.
- **Path alias**: `@/*` → `./src/*`
- **Imports**: Use `@/` path alias for all internal imports.
- **Components**: PascalCase filenames. One component per file. Props interface named `{Component}Props`.
- **Naming**: camelCase for variables/functions, PascalCase for components/types, UPPER_SNAKE for constants.
- **CSS**: Tailwind utility classes only. Use `cn()` from `@/lib/utils` for conditional classes.
- **No default exports** for components (except pages/layouts which Next.js requires).

## Design Tokens (Dark Theme)
```
Background:  #0a0a0f (primary), #12121a (secondary), #1a1a2e (card), #222238 (elevated)
Accent:      #3b82f6 (blue), #2563eb (hover), #60a5fa (light)
Text:        #f1f5f9 (primary), #94a3b8 (secondary), #64748b (muted)
Border:      #2d2d44
Status:      #22c55e (success), #f59e0b (warning), #ef4444 (error)
Radius:      6px (sm), 10px (md), 16px (lg), 9999px (full)
```

## File Structure
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth pages (login, signup, onboarding)
│   ├── (main)/             # App pages (map, dashboard, booking, etc.)
│   ├── globals.css         # Design tokens + global styles
│   ├── layout.tsx          # Root layout (Inter font, dark theme)
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # Primitives: Button, Input, Card, Modal, Badge, Spinner
│   ├── layout/             # Navbar, Footer
│   ├── map/                # Map components
│   ├── quote/              # Quote flow components
│   ├── booking/            # Booking components
│   ├── mechanic/           # Mechanic profile components
│   ├── dashboard/          # Dashboard components
│   └── chat/               # Chat components
├── lib/
│   ├── firebase.ts         # Firebase init (singleton)
│   ├── utils.ts            # cn() helper
│   └── store.ts            # Zustand stores
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript interfaces (user, vehicle, mechanic, quote, booking, review, message)
└── context/                # React Context providers
```

## Common Patterns

### Creating a new component
```tsx
'use client';  // Only if needed
import { cn } from '@/lib/utils';

interface MyComponentProps {
  className?: string;
}

export function MyComponent({ className }: MyComponentProps) {
  return <div className={cn('base-classes', className)} />;
}
```

### Creating a page
```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title | Kaput',
};

export default function PageName() {
  return <main>...</main>;
}
```

### Firestore operations
Always use typed helpers. Reference schema in `KAPUT-PLAN.md` → "Database Schema" section.

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint check
- `npx tsc --noEmit` — Type check
