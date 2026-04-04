# Retirement Calculator - Bug Fixes & New Features

## Bug Fixes

### Bug 1: PPR Account Limit (Max 3)
**Problem:** Users could add unlimited PPR accounts.  
**Solution:** Added check in `addPPR()` function and disabled the "Add PPR" button when count reaches 3.  
**Files:** `components/simulator/assumptions-panel.tsx`

### Bug 2: Detail Table - Multiple PPR Columns
**Problem:** Detail page showed only 1 aggregated PPR column.  
**Solution:** When `pprList.length > 1`, generates dynamic columns for each PPR account in both the Detail table and the Chart.  
**Files:** `components/simulator/results-panel.tsx`, `lib/ppr-helpers.ts`

### Bug 3: Default PPR Labels
**Problem:** PPR accounts had empty labels by default.  
**Solution:** Updated `createDefaultPPR(index)` to return `label: 'PPR ${index + 1}'`.  
**Files:** `lib/ppr-helpers.ts`

### Bug 4: Real-time Age Validation
**Problem:** Validation only ran when clicking "Simular retiro".  
**Solution:** Added `useEffect` that runs `validateAgesRealtime()` on every age field change, showing red inline errors immediately. Also added edge case validation for invalid ages (1-120).  
**Files:** `app/page.tsx`, `lib/i18n.tsx`

### Bug 5: Goal Tracker Naming
**Problem:** "Meta de Ingreso" didn't match requirements.  
**Solution:** Changed title to "Meta de Pensión", label to "Pensión mensual objetivo (pesos de hoy)", button text simplified.  
**Files:** `lib/i18n.tsx`

### Bug 6: Loading Spinner Duration
**Problem:** Spinner was only 50ms - too fast to notice.  
**Solution:** Changed to 2000ms (2 seconds).  
**Files:** `app/page.tsx`

### Bug 7: Goal Tracker Auto-Selection
**Problem:** The 15,000 default value was auto-selected/highlighted on modal open.  
**Solution:** Added `onFocus` handler that positions cursor at end of value instead of selecting all.  
**Files:** `components/simulator/fintech-inputs.tsx`

### Bug 8: Goal Tracker Target Validation
**Problem:** No validation when target is lower than current projection.  
**Solution:** Pass simulation `result` to GoalTrackerModal. If `targetNPV <= result.total.vpnMonthly`, show warning message and disable the "Calculate" button.  
**Files:** `app/page.tsx`, `components/simulator/assumptions-panel.tsx`, `components/simulator/goal-tracker-modal.tsx`, `lib/i18n.tsx`

---

## New Features

### Multiple PPR Accounts (F1)
- Users can create up to 3 PPR (Personal Retirement Plan) accounts
- Each account has its own: label, balance, monthly contribution, expected return, SAT refund
- In Results Panel:
  - **Summary tab**: Shows "PPR Accounts Breakdown" with percentage share
  - **Chart tab**: Shows separate stacked areas for each PPR account
  - **Detail tab**: Shows separate columns for each PPR account
- Aggregation uses weighted average return (by contribution > balance > plain average)

### Goal Tracker (F3)
- Accessible via "🎯 Meta de Pensión" button
- Allows users to set a target monthly pension in today's pesos (NPV)
- Calculates required additional contributions to reach the goal
- Distributes required contributions proportionally across PPR accounts and Private Savings
- Shows AFORE's projected contribution separately
- If target is already covered by AFORE alone, shows success message
- If target is lower than current projection, shows warning and disables calculation

### Real-time Validation (F4)
- Age field validation shows immediately as user types
- Validates:
  - Age must be between 1-120
  - Current age must be less than retirement age
  - Retirement age must be less than planning horizon
  - Planning horizon cannot exceed 110

---

## Translations Added

- `error.invalidAge`: "Please enter a valid age (1-120)" / "Por favor ingresa una edad válida (1-120)"
- `goal.targetTooLow`: "Your current projection already exceeds this target. Consider setting a higher goal." / "Tu proyección actual ya supera esta meta. Considera establecer una meta más alta."

---

## Project Context

This is **Retiro MX** - A Personal Retirement Simulator for Mexico built with Next.js 14.

### Tech Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Google Gemini (flash-lite) for AI tips
- Recharts for data visualization

### Core Functionality
Simulates retirement projections considering:
- **AFORE**: Mexican pension system (IMSS)
- **PPR**: Personal Retirement Plan (tax-advantaged)
- **Private Savings**: CETES, funds, stocks

Includes:
- Ley 97 early retirement penalties
- NPV (Net Present Value) calculations
- Bilingual support (Spanish/English)
- PDF export via browser print

---

## Phase 8: Cloud Architecture, Security, & Fixes

### Bug Fixes (Phase 8)
- **Bug 9:** "Cargar en simulador" failed/duplicated scenarios for authenticated users.
  - **Solution:** `app/page.tsx` was bypass-reading from `localStorage` directly (which was empty for authenticated users since their data synced to Supabase). Replaced direct localStorage reads with the Supabase-aware `useScenarios` hook. Added deduplication guards to ensure `simResult` isn't repeatedly pushed.
- **Bug 10:** Production deployment failed with `Type error: Cannot find module` on obsolete test imports.
  - **Solution:** Adjusted `tsconfig.json` to properly exclude generated testing directories (`local_tests`, `lib/export.ts`) ensuring `npx tsc` completes with 0 errors.

### Security Hardening (M1-M4)
- **M1 (HTTP Headers):** Configured strict `next.config.mjs` injecting CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy` across all routes.
- **M2 (API Hardening):** Implemented severe rate-limiting in `/api/tips` tracking IPs via memory to prevent Gemini quota exhaustion. Blocked prompt injection vectors with strict Zod parsing schema enforcing numbers and boundaries for all payload fields.
- **M3 (Build Types):** Removed `typescript.ignoreBuildErrors = true` from Next configs, resolving all underlying type mismatches to pass strict mode.
- **M4 (Database Security):** Row Level Security (RLS) fully enacted on `user_scenarios` table. Enforced session lifecycles with OTP expiries set to 1 hour and revoked refresh tokens dynamically.

### Features
- **Supabase Cloud Saves:** Authenticated users now transparently automatically save and load their comparison scenarios using a live PostgreSQL database instead of volatile `localStorage`.
- **Magic Link Auth:** Users login safely via passwordless magic links (`/login` -> email verification callback).
- **Custom Domain Sender:** App is served and sends transactional email verification via `miretiromx.pxblx.com`, authenticated on DNS with Resend + Porkbun for DMARC pass rates.