# 🏦 Mi Retiro MX
### Simulador de Retiro Personal para México | Personal Retirement Simulator

> Project your future pension considering AFORE, PPR, and Private Savings. Includes a bilingual Blog & Financial Glossary for SEO, personalized AI-driven recommendations powered by Google Gemini, and clear legal-logic modeling for Mexican pensions (Ley 97). Founded in 2026 by Pablo Arroyo.

---

## ✨ Key Features

### 🧮 Financial Simulator
- **General config:** current age, retirement age, planning horizon, expected annual inflation.
- **AFORE (IMSS Pension):** gross monthly salary → automatic IMSS contribution estimate (**9.5% default, 2025 Reforma Pensiones rate**), current balance, expected return, and **Annual Increment %** tracking for progressive savings.
- **PPR (Personal Retirement Plan):** multi-account support — up to 3 PPR accounts, each with its own balance, monthly contribution, **Annual Increment %**, and projected SAT tax refund. Includes native **Article 151 vs Article 93 toggles** individually, alongside inline curated recommendations for platforms like **Fintual and Rankia**.
- **Private Savings (CETES, Funds, Stocks):** balance, monthly contribution, **Annual Increment %**, and expected return.
- **Independent Worker Mode (RESICO / Freelance):** toggles calculations (RFC gen., IVA 0% rules, IMSS M10 notes).
- **Dynamic legal pension logic (Ley 97):** payout start ages, early retirement penalties (60–64% scale) and passive growth behaviour.

### 📊 Results & Insights
- Estimated future monthly pension in future pesos and NPV (Net Present Value, current-year pesos).
- Total Monthly Package: combined AFORE + PPR + Private Savings, with tooltip explaining the **Retiro Programado simulation model**.
- Wealth growth chart and year-by-year detail view.
- Side-by-side comparisons (e.g., retire at 65 vs retire earlier).
- **ISR Legal Warning Badge:** Automatically maps tax liabilities during retirement based on simulated balances and Article 151 constraints.
- Tooltips and inline explanations (legal notes and penalties) to educate the user.

### 🎯 Goal Tracker (Pension Goal)
- Set a target monthly income for retirement.
- Automatically calculates how much extra you need to save in each PPR account to meet your goal.
- One-click **Apply** pre-fills the PPR contribution fields so you can instantly simulate the updated plan.
- Smart warning when your existing AFORE projection already exceeds the target.

### 🤖 AI Recommendations (Powered by Gemini)
- 3 quantitative, personalized recommendations in one bilingual API call (ES/EN).
- Recommendations always expressed in NPV (current-year pesos) with explicit mapping from future pesos → NPV.
- Each recommendation includes: numeric figures (MXN), emoji, impact label (High/Medium/Low).
- 23-second rate limit cooldown on regenerating tips (client-side).
- Fallback tips available if AI request fails.

### 🔀 Scenario Comparison (Compare Mode)
- **Save up to 3 scenarios** from any simulation run, with a custom name.
- **Cloud Save & Sync:** If authenticated, scenarios are saved securely to a PostgreSQL database (Supabase) via Row Level Security (RLS) policies. If unauthenticated, it falls back gracefully to `localStorage`.
- **Compare page (`/comparar`):** side-by-side card layout showing all saved scenarios with key metrics.
- **Winner detection:** automatic "Mejor Pensión 🏆" badge highlighting the scenario with the highest NPV.
- **Overlay chart:** multi-line wealth growth chart overlaying all scenarios for visual comparison.
- **VPN-first highlight:** NPV (current-year pesos) shown as the primary green metric on each card, matching the Summary tab logic.

### 🔐 Authentication & Security
- **Passwordless Magic Links:** Users authenticate securely via email using Supabase Auth and Resend.
- **Custom Branded Delivery:** Emails are delivered via a verified custom domain (`miretiromx.pxblx.com`) ensuring high deliverability (DKIM, SPF, DMARC).
- **Security Hardening:** Natively implements Strict CSP headers, API Rate Limiting, Zod Validation, and strict type-safety compilation.

### 📄 Native PDF Export
- Browser-native export using `window.print()` and `@media print` styles.
- Readable, ink-friendly output with: title, generation date, input summary, results, chart, AI tips, and disclaimer footer.
- Always rendered in Light Mode for readability regardless of current theme.

### 🌐 Internationalization & UX
- Full **Spanish / English** support with one-click language toggle.
- **Dark Mode** default; Light Mode toggle available — both settings are fully independent.
- Real-time input validation (e.g., age-out-of-range shows an instant red error).
- Responsive design (mobile-first).
- Inputs with +/− controls and perfect alignment.
- Footer credit to Product Manager with portfolio link.

---

## 🗺️ Product Journey (PM Notes)

This project followed an iterative Product Management + Vibe Coding approach:

### Phase 1 — Problem Definition
Identified that many Mexicans lack clarity about retirement projections; existing tools ignore AFORE/PPR/Private Savings interplay and legal constraints.

### Phase 2 — MVP
Built the financial core: 3-instrument simulator, compound interest projections, inflation-adjusted NPV display, and simple results.

### Phase 3 — UX & Product Improvements
- Automatic IMSS contribution logic from gross salary.
- RESICO/Freelance mode and RFC/external-customer rules implemented.
- Input grid alignment and UI polish.

### Phase 4 — AI Integration (Technical Story)
- Iterative debugging: 404 (v1beta vs v1 SDK), quota 429 errors on multiple Gemini models.
- Final model choice: `gemini-2.5-flash-lite` / `gemini-flash-lite-latest` depending on availability.
- Prompt engineering: NPV outputs, bilingual results, numeric recommendations, stable temperature (0.8).

### Phase 5 — Legal & Production Polish
- Implemented Ley 97: passive growth if retiring < 60, early retirement percentages (60:75%→65+:100%).
- UX: legal warnings, tooltips, and info badges to explain reductions and payout ages.
- Native PDF export via browser print.
- Deployed on Vercel with env-based API key.

### Phase 6 — Advanced Features & Quality
- **Multi-account PPR:** up to 3 independent PPR accounts, each individually configurable, with dynamic add/remove controls.
- **Article 151 vs 93 Selection:** Specific configuration toggle inside each PPR allowing native distinction between tax-advantaged (151) and capital-gains (93) profiles.
- **Goal Tracker:** target-pension modal that back-calculates required PPR contributions and populates the form with one click.
- **Real-time validation:** instant age-range error without needing to trigger a simulation.
- **Playwright end-to-end testing:** custom Node.js Playwright scripts (in `/tests`) and automated browser test workflows safely isolated in `/local_tests`.
- **Annual Increment %:** Set an expected annual contribution increase (%) for AFORE, PPR, and Private Funds.
- **Curated Suggestions:** Educational links pushing users to Rankia and Fintual for better PPR market insights.
- **ISR Warning Logic:** Natively alerts players on Results if their plan subjects them to ISR post-retirement (Art. 151).

### Phase 7 — Scenario Comparison & Simulation Accuracy
- **3-Scenario Save & Compare system:** users can save up to 3 simulation runs as named scenarios, persisted in `localStorage`.
- **Compare page (`/comparar`):** full-width dashboard with card-per-scenario layout, winner badge, and overlay chart.
- **VPN-first design:** NPV highlighted as the primary decision metric across both the Summary tab and Compare page.
- **AFORE contribution rate updated to 9.5%** (2025 Reforma Pensiones rate, previously 6.5%). Live salary-change handler updated consistently.
- **Retiro Programado model transparency:** tooltip on Total Package card explains the simulation model to users.
- **"¿Cómo elegir tu fondo PPR?" relocated** from sidebar to a dedicated full-width section after Portfolio Tips for better readability.
- **Save Scenario button repositioned** to appear directly below the results summary cards for higher visibility.
- **Simulation state reset:** Save Scenario button resets automatically when a new simulation is run (prevents accidental duplicate saves).
- **Bug fix:** replaced `crypto.randomUUID()` with a cross-environment-safe ID generator to prevent crashes on non-HTTPS local network testing.

### Phase 8 — Cloud Architecture & Security Hardening
- **Supabase Integration:** Replaced local mock storage with a real PostgreSQL database for scenarios.
- **Magic Link Authentication:** Implemented passwordless email login using Supabase Auth.
- **Custom Domain Email (Resend):** Integrated Resend SMTP to deliver branded auth emails via `miretiromx.pxblx.com` with full DKIM/DMARC authentication.
- **Security Layer (M1-M4):** Enforced Content Security Policy (CSP), API-level Zod validation and IP-based rate limiting on the Gemini AI endpoints, and Row Level Security (RLS) on database tables.
- **Production CI/CD:** Hardened `tsconfig.json` and strict build settings for zero-error deployments on Vercel.

### Phase 9 — Content Marketing Hub, SEO/AEO & Versioning
- **Bilingual Blog Engine:** 3 strategic articles (ES/EN) covering top, mid, and bottom-of-funnel. Authored by Pablo Arroyo with bibliography for E-E-A-T trust signals. Statically generated for zero-latency loads.
- **Financial Glossary (`/glosario`):** 10+ key terms (AFORE, PPR, VPN, Interés Compuesto, etc.) with individual pages and `DefinedTerm` JSON-LD structured data.
- **SEO Comparison Pages (`/comparativas`):** Static pages comparing products (e.g., AFORE vs PPR) with `FAQPage` schema for AEO (Answer Engine Optimization).
- **Global Schema Markup:** `WebSite`, `Organization`, and `SoftwareApplication` JSON-LD injected globally. `BlogPosting` schema added per article.
- **Application Versioning Widget:** `ReleaseModal` component auto-shows new features on first visit after a version bump, driven by `lib/releases.ts`.
- **Vercel Web Analytics:** `@vercel/analytics` integrated into `app/layout.tsx` for production traffic tracking.
- **Unit Testing with Vitest:** 5 passing unit tests covering the simulation engine and Goal Tracker math.

---

## 🧪 Testing

### Unit Tests (Vitest)

Pure-function unit tests covering the financial simulation engine and Goal Tracker math.

```bash
npm run test:unit
```

| Test file | Coverage |
|---|---|
| `local_tests/lib/simulation.test.ts` | Annual increment NPV impact, Tax Article 151 vs 93 logic, mixed tax article simulation |
| `local_tests/lib/goal-tracker.test.ts` | AFORE increment effect on required PPR, multi-PPR proportional distribution |

**5/5 tests passing ✅**

### End-to-End Tests (Playwright)

Browser automation tests covering full user flows.

```bash
# Install Playwright (first time only)
npx playwright install chromium

# Run isolated Playwright suite
npx playwright test --config=local_tests/playwright.config.ts
```

| Test | Feature |
|------|---------|
| `test-01-page-load.js` | Page loads and main heading is visible |
| `test-02-language-toggle.js` | ES ↔ EN language switch |
| `test-03-theme-toggle.js` | Light / Dark theme toggle |
| `test-04-realtime-validation.js` | Instant age validation error |
| `test-05-loading-spinner.js` | Spinner appears on simulate click |
| `test-06-simulation-flow.js` | Full simulation returns results |
| `test-07-ppr-multi-account.js` | Add / remove PPR accounts, cap at 3 |
| `test-08-goal-tracker.js` | Goal Tracker modal + Apply button |
| `test-09-goal-tracker-warning.js` | Target-too-low warning message |
| `test-10-independent-toggles.js` | Language & theme toggles are independent |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.7 |
| Database & Auth | Supabase (PostgreSQL, Magic Links) |
| Email Delivery | Resend (Custom SMTP) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| AI | Google Gemini (flash-lite) |
| AI SDK | @google/generative-ai 0.24.1 |
| Unit Testing | Vitest |
| E2E Testing | Playwright |
| Analytics | Vercel Web Analytics |
| Deployment | Vercel |

---

## ⚙️ Local Installation

```bash
# 1. Clone the repository
git clone https://github.com/Pxblx7/retirement-calc-lite.git
cd retirement-calc-lite

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY (get one free at https://aistudio.google.com)

# 4. Run in development
npm run dev
```

---

## 📝 Credits & Portfolio
Developed by **Pablo Arroyo** — Product Manager.  
📧 pab.arroyo@outlook.com  
🔗 [Portfolio](https://pxblx7.github.io/pablo-arroyo-product-manager/)
