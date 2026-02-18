# Kaput — Foundation & Claude Code Configuration Plan

## Status: COMPLETE
- All 31 files created/configured
- `npx tsc --noEmit` — passes (0 errors)
- `npm run build` — passes (all pages static)

---

## Part 1: Claude Code Project Configuration

### Step 1 — `CLAUDE.md` (project root) ✅ DONE
Project instructions file with tech stack, conventions, design tokens, file structure, common patterns.

### Step 2 — `.claude/settings.json` ✅ DONE
Permissions and hooks:
- allow: npm run/test/build, git operations, Read/Edit all src files
- deny: reading .env*, rm -rf, sudo commands

### Step 3 — `.claude/hooks/format-on-save.sh` ✅ DONE
PostToolUse hook (Write|Edit) — runs `npx prettier --write` on edited file.

### Step 4 — `.claude/hooks/typecheck-on-stop.sh` ✅ DONE
Stop hook — runs `npx tsc --noEmit` after Claude finishes a coding turn.

### Step 5 — `.claude/hooks/guard-bash.sh` ✅ DONE
PreToolUse hook (Bash) — blocks destructive commands (rm -rf /, DROP TABLE, git push --force).

### Step 6 — `.claude/skills/new-component/SKILL.md` ✅ DONE
Slash command `/new-component [ComponentName]` — scaffolds React component with TS interface, dark theme Tailwind, barrel export.

### Step 7 — `.claude/skills/new-page/SKILL.md` ✅ DONE
Slash command `/new-page [route-path]` — creates Next.js page.tsx with metadata, layout integration.

### Step 8 — `.claude/skills/db-schema/SKILL.md` ✅ DONE
Slash command `/db-schema` — reference skill for Firestore schema, typed operations.

### Step 9 — `.claude/skills/deploy-check/SKILL.md` ✅ DONE
Slash command `/deploy-check` — pre-deployment validation (tsc, build, env vars, lint).

### Step 10 — Update `.gitignore` ✅ DONE
Added `.claude/settings.local.json` entry.

### Step 11 — Install prettier as devDependency ✅ DONE

---

## Part 2: Project Foundation Code

### Step 12 — `src/app/globals.css` — Design System ✅ DONE (pre-existing)
Tailwind v4 `@theme inline` with all color tokens, radius, shadows, dark body styles, scrollbar styling.

### Step 13 — `src/app/layout.tsx` — Root Layout ✅ DONE (pre-existing)
Inter font, metadata (Kaput), `dark` class on html, dark bg on body.

### Step 14 — `src/lib/utils.ts` — Utility Helpers ✅ DONE (pre-existing)
`cn()` function using `clsx` + `tailwind-merge`.

### Step 15 — TypeScript Types (`src/types/`) ✅ DONE
- `user.ts` — User, UserRole
- `vehicle.ts` — Vehicle
- `mechanic.ts` — MechanicProfile, BusinessHours, DayHours, SubscriptionStatus
- `quote.ts` — Quote, QuoteResponse, QuoteItem, QuoteStatus, QuoteItemType
- `booking.ts` — Booking, BookingStatus, BookingType, PaymentStatus
- `review.ts` — Review
- `message.ts` — Message
- `index.ts` — barrel export

### Step 16 — `src/lib/firebase.ts` — Firebase Client Init ✅ DONE
Singleton pattern using getApps()/getApp(), exports auth, db, storage.

### Step 17 — UI Primitives (`src/components/ui/`) ✅ DONE
- `Button.tsx` — primary/secondary/ghost/danger, sm/md/lg, loading spinner, forwardRef
- `Input.tsx` — label, error, optional icon, dark themed, forwardRef
- `Card.tsx` — dark card container, optional hover, onClick with a11y
- `Modal.tsx` — overlay dialog, framer-motion animation, backdrop close, ESC key
- `Badge.tsx` — status pill: default/success/warning/error/info
- `Spinner.tsx` — CSS animated loading spinner with sm/md/lg sizes

### Step 18 — Layout Components (`src/components/layout/`) ✅ DONE (pre-existing)
- `Navbar.tsx` — sticky nav, logo, links, auth buttons, mobile hamburger
- `Footer.tsx` — copyright, links, dark theme

### Step 19 — `src/app/page.tsx` — Landing Page ✅ DONE (pre-existing)
Hero, How It Works, Value Props, Footer CTA, framer-motion animations.

### Step 20 — `src/lib/store.ts` — Zustand Auth Store ✅ DONE
user, loading, setUser(), clearUser(), setLoading().

---

## Files Summary (31 total)

| # | File | Status |
|---|------|--------|
| 1 | `CLAUDE.md` | ✅ Done |
| 2 | `.claude/settings.json` | ✅ Done |
| 3 | `.claude/hooks/format-on-save.sh` | ✅ Done |
| 4 | `.claude/hooks/typecheck-on-stop.sh` | ✅ Done |
| 5 | `.claude/hooks/guard-bash.sh` | ✅ Done |
| 6 | `.claude/skills/new-component/SKILL.md` | ✅ Done |
| 7 | `.claude/skills/new-page/SKILL.md` | ✅ Done |
| 8 | `.claude/skills/db-schema/SKILL.md` | ✅ Done |
| 9 | `.claude/skills/deploy-check/SKILL.md` | ✅ Done |
| 10 | `.gitignore` | ✅ Done |
| 11 | `src/app/globals.css` | ✅ Done |
| 12 | `src/app/layout.tsx` | ✅ Done |
| 13 | `src/lib/utils.ts` | ✅ Done |
| 14-20 | `src/types/*.ts` (7 files + index) | ✅ Done |
| 21 | `src/lib/firebase.ts` | ✅ Done |
| 22-27 | `src/components/ui/*.tsx` (6 files) | ✅ Done |
| 28-29 | `src/components/layout/*.tsx` (2 files) | ✅ Done |
| 30 | `src/app/page.tsx` | ✅ Done |
| 31 | `src/lib/store.ts` | ✅ Done |

## Verification ✅
1. `npm install prettier --save-dev` — installed
2. `npx tsc --noEmit` — 0 errors
3. `npm run build` — success (all 7 pages static)
4. `npm run dev` — ready for testing
