# Mi Retiro MX — Bug Fixes & Feature Log

**Project:** Mi Retiro MX — Simulador de Retiro Personal para México  
**Stack:** Next.js 16 (App Router) · TypeScript 5.7 · Tailwind CSS v4 · shadcn/ui · Supabase · Google Gemini · Vercel  
**Founded:** 2026 by Pablo Arroyo

> This file tracks all bug fixes, new features, and improvements across all development phases in chronological order.

---

## Phase 6 — Advanced Features & Multi-PPR

### Bug Fixes

**Bug 1 — PPR Account Limit (Max 3)**  
**Problem:** Users could add unlimited PPR accounts.  
**Solution:** Added check in `addPPR()` and disabled the "Add PPR" button when count reaches 3.  
**Files:** `components/simulator/assumptions-panel.tsx`

**Bug 2 — Detail Table: Missing Per-PPR Columns**  
**Problem:** Detail page showed only 1 aggregated PPR column regardless of how many accounts existed.  
**Solution:** When `pprList.length > 1`, generates dynamic columns for each PPR in both the Detail table and Chart.  
**Files:** `components/simulator/results-panel.tsx`, `lib/ppr-helpers.ts`

**Bug 3 — Default PPR Labels**  
**Problem:** PPR accounts had empty labels by default.  
**Solution:** Updated `createDefaultPPR(index)` to return `label: 'PPR ${index + 1}'`.  
**Files:** `lib/ppr-helpers.ts`

**Bug 4 — Real-time Age Validation**  
**Problem:** Validation only ran when clicking "Simular retiro" — no immediate inline feedback.  
**Solution:** Added `useEffect` running `validateAgesRealtime()` on every age field change with red inline errors. Added edge case validation for invalid ages (1–120).  
**Files:** `app/page.tsx`, `lib/i18n.tsx`

**Bug 5 — Goal Tracker Naming**  
**Problem:** Label "Meta de Ingreso" didn't match requirements.  
**Solution:** Changed title to "Meta de Pensión", label to "Pensión mensual objetivo (pesos de hoy)".  
**Files:** `lib/i18n.tsx`

**Bug 6 — Loading Spinner Too Fast**  
**Problem:** Spinner was only 50ms — invisible to the user.  
**Solution:** Changed to 2000ms (2 seconds).  
**Files:** `app/page.tsx`

**Bug 7 — Goal Tracker Auto-Selection on Open**  
**Problem:** The 15,000 default value was auto-selected/highlighted on modal open, making editing confusing.  
**Solution:** Added `onFocus` handler positioning cursor at end of value instead of selecting all.  
**Files:** `components/simulator/fintech-inputs.tsx`

**Bug 8 — Goal Tracker: No Validation for Already-Exceeded Target**  
**Problem:** No feedback when target pension was lower than the current projected income.  
**Solution:** Pass simulation `result` to `GoalTrackerModal`. If `targetNPV <= result.total.vpnMonthly`, show amber warning and disable "Calculate" button.  
**Files:** `app/page.tsx`, `components/simulator/assumptions-panel.tsx`, `components/simulator/goal-tracker-modal.tsx`, `lib/i18n.tsx`

### New Features

**F1 — Multiple PPR Accounts (up to 3)**
- Users can create up to 3 independent PPR accounts, each with its own label, balance, monthly contribution, expected return, and SAT refund.
- Results Panel now shows per-account data:
  - **Summary tab:** "PPR Accounts Breakdown" with percentage share per account.
  - **Chart tab:** Separate stacked areas per PPR account.
  - **Detail tab:** Separate columns per PPR account.
- Aggregation uses weighted-average return (by contribution > balance > plain average).

**F2 — Goal Tracker (🎯 Meta de Pensión)**
- Opens via "🎯 Meta de Pensión" button in the simulator.
- User sets a target monthly pension in today's pesos (NPV).
- Engine back-calculates required monthly contributions to close the gap, distributed proportionally across all PPR accounts and Private Savings.
- Shows AFORE's projected NPV contribution separately.
- "Apply to simulator" button pre-fills contribution fields so the user only needs to click "Simular mi retiro".
- Shows a success state if AFORE alone already covers the target.
- Disables calculation with an amber warning if target is already exceeded by the current projection.

**F3 — Real-time Age Validation**
- Age field errors appear immediately as the user types, without requiring a simulation run.
- Validates: age between 1–120, current age < retirement age < planning horizon ≤ 110.

**I18n Additions**
- `error.invalidAge`: "Please enter a valid age (1–120)" / "Por favor ingresa una edad válida (1–120)"
- `goal.targetTooLow`: "Your current projection already exceeds this target." / "Tu proyección actual ya supera esta meta."

---

## Phase 7 — Scenario Comparison & Simulation Accuracy

### Improvements
- **3-Scenario Save & Compare system:** Users can save up to 3 named simulation runs, persisted in `localStorage`.
- **Compare page (`/comparar`):** Full-width dashboard with per-scenario cards, winner badge ("Mejor Pensión 🏆"), and overlay chart.
- **NPV-first design:** NPV (current-year pesos) is highlighted as the primary decision metric across the Summary tab and Compare page.
- **AFORE contribution rate updated to 9.5%** (2025 Reforma Pensiones rate, previously 6.5%). Live salary-change handler updated consistently.
- **Retiro Programado model transparency:** Tooltip explains the simulation model to users on the Total Package card.
- **"¿Cómo elegir tu fondo PPR?" section** relocated to a full-width section after Portfolio Tips for better readability.
- **Save Scenario button** repositioned directly below results summary cards for higher visibility. Resets automatically when a new simulation is run (prevents duplicate saves).
- **Bug fix:** Replaced `crypto.randomUUID()` with a cross-environment-safe ID generator to prevent crashes on non-HTTPS local network testing.

---

## Phase 8 — Cloud Architecture & Security Hardening

### Bug Fixes

**Bug 9 — "Cargar en simulador" Failed for Authenticated Users**  
**Problem:** `app/page.tsx` was reading directly from `localStorage`, which was empty for authenticated users (their data lived in Supabase).  
**Solution:** Replaced direct `localStorage` reads with the Supabase-aware `useScenarios` hook. Added deduplication guards to prevent repeated `simResult` pushes.

**Bug 10 — Production Build Failure: Cannot Find Module**  
**Problem:** `npx tsc` failed with `Type error: Cannot find module` due to obsolete test imports.  
**Solution:** Adjusted `tsconfig.json` to properly exclude `local_tests/` and `lib/export.ts` from the TypeScript compilation scope.

### Security Hardening (M1–M4)
- **M1 (HTTP Headers):** Strict `next.config.mjs` injecting CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy` across all routes.
- **M2 (API Hardening):** Severe rate-limiting on `/api/tips` tracking IPs via memory to prevent Gemini quota exhaustion. Strict Zod schema blocks prompt injection vectors.
- **M3 (Build Types):** Removed `typescript.ignoreBuildErrors = true`, resolving all underlying type mismatches for strict-mode compliance.
- **M4 (Database Security):** Row Level Security (RLS) fully enacted on `user_scenarios` table. OTP expiries set to 1 hour; refresh tokens revoked dynamically.

### New Features
- **Supabase Cloud Saves:** Authenticated users automatically save and load scenarios from a live PostgreSQL database (instead of volatile `localStorage`).
- **Magic Link Auth:** Passwordless email login via Supabase Auth (`/login` → email verification callback).
- **Custom Domain Sender:** Transactional emails sent via `miretiromx.pxblx.com` using Resend, authenticated with DKIM/SPF/DMARC via Porkbun DNS.

---

## Phase 9 — Content Marketing Hub, SEO/AEO & Versioning

### Bug Fixes

**Bug 11 — Next.js 15+ Hydration Error on Dynamic Routes**  
**Problem:** Blog and Glossary dynamic route pages (`/blog/[slug]`, `/glosario/[slug]`) threw hydration errors and returned 404s because `params` was accessed synchronously in Next.js 15+.  
**Solution:** Updated `generateMetadata()` and page components to `await params` treating it as a `Promise`, per Next.js 15 App Router spec.  
**Files:** `app/blog/[slug]/page.tsx`, `app/glosario/[slug]/page.tsx`

**Bug 12 — Unit Test Import Paths Broken**  
**Problem:** `local_tests/lib/*.test.ts` imported from `'./simulation'` and `'./goal-tracker'` (same-directory paths that don't exist), causing all unit tests to fail at module resolution.  
**Solution:** Corrected all imports to `'../../lib/simulation'`, `'../../lib/goal-tracker'`, and `'../../lib/ppr-helpers'`.  
**Files:** `local_tests/lib/simulation.test.ts`, `local_tests/lib/goal-tracker.test.ts`

**Bug 13 — Goal Tracker Test: Overly Strict Precision Assertion**  
**Problem:** `toBeCloseTo(pprTotalMonthly, 0)` failed because `Math.ceil()` applied to each PPR account can make the per-account sum 1–2 MXN higher than `pprTotalMonthly` — this is intentional rounding behavior, not a bug.  
**Solution:** Replaced with a ceiling-safe range assertion: `sum >= pprTotalMonthly` and `sum <= pprTotalMonthly + pprList.length`.  
**Files:** `local_tests/lib/goal-tracker.test.ts`

### Improvements

- **Navigation:** Header and Footer updated with Blog and Glossary links grouped under "Contenido" / "Content".
- **Branding:** Project title confirmed as **Mi Retiro MX** across all metadata, `layout.tsx` titles, and internal references. Removed legacy "Retiro MX" references.
- **Analytics:** `@vercel/analytics` installed and `<Analytics />` wired into `app/layout.tsx`. Activated via Vercel Dashboard → Analytics tab (no further code required).
- **Versioning:** `lib/releases.ts` central store and `components/novedades/release-modal.tsx` auto-show new features on first visit after a version bump (dismissed via `localStorage` key `last_seen_version`). Current versions: `v1.0.0` (Launch), `v1.1.0` (Phase 9).
- **Unit Testing:** Installed Vitest. Added `"test:unit": "vitest run local_tests/lib"` to `package.json`. **All 5 unit tests passing ✅** (`npm run test:unit`).
- **Next.js 15+ compatibility:** All dynamic route components use `Promise`-based `params` to resolve hydration and async rendering warnings.

### New Features

**Blog Engine (`/blog`, `/blog/[slug]`)**
- Bilingual (ES/EN) blog with static generation for zero-latency loads.
- Dynamic `BlogPosting` JSON-LD schema per article for AEO (Answer Engine Optimization).
- 3 articles covering the full marketing funnel, authored by **Pablo Arroyo** with bibliography for E-E-A-T signals:
  1. *El Estado Actual del Retiro en México* — Top of funnel (Awareness).
  2. *AFORE vs PPR: Guía Definitiva* — Mid funnel (Consideration).
  3. *Cómo utilizar Mi Retiro MX* — Bottom of funnel (Retention/Tutorial).

**Financial Glossary (`/glosario`, `/glosario/[slug]`)**
- 10+ key financial terms (AFORE, PPR, VPN, Interés Compuesto, Rendimiento Neto, etc.).
- Individual term pages with `DefinedTerm` JSON-LD structured data.
- Internal linking from glossary terms to the main simulator.

**SEO Comparison Pages (`/comparativas/[slug]`)**
- Static pages comparing products (e.g., AFORE vs PPR) with `FAQPage` JSON-LD schema for rich snippets.
- Fully bilingual with translated `generateMetadata()` per locale.

**Global Schema Markup (`components/seo/schema-markup.tsx`)**
- `WebSite`, `Organization`, and `SoftwareApplication` JSON-LD injected globally on every page via `app/layout.tsx`.
- Semantic HTML throughout: `<article>`, `<h2>`, `<time>` tags to aid AI citation engines (ChatGPT, Perplexity, Claude).