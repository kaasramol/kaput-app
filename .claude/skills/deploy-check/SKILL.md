# /deploy-check

Run pre-deployment validation for the Kaput project.

## Checks to Run (in order)
1. **TypeScript**: `npx tsc --noEmit` — ensure no type errors
2. **Lint**: `npm run lint` — ensure no lint errors
3. **Build**: `npm run build` — ensure production build succeeds
4. **Env vars**: Verify required environment variables are documented

## Required Environment Variables
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
```

## Steps
1. Run all checks sequentially
2. Report pass/fail for each
3. If any fail, show the errors and suggest fixes
