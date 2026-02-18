# /new-page [route-path]

Create a new Next.js page for the Kaput project.

## Steps
1. Create `src/app/{route-path}/page.tsx` with:
   - Metadata export with title formatted as `{Page Title} | Kaput`
   - Default export function named `{PageName}Page`
   - Server Component by default (no `'use client'`)
   - Dark theme styling with proper layout spacing

2. Follow these conventions:
   - Pages under `(auth)/` for auth-related routes
   - Pages under `(main)/` for app routes requiring auth
   - Top-level pages for public routes
   - Use semantic HTML (`<main>`, `<section>`, `<h1>`)

## Template
```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '{Page Title} | Kaput',
  description: '{Brief description}',
};

export default function {PageName}Page() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-text-primary">
        {Page Title}
      </h1>
    </main>
  );
}
```
