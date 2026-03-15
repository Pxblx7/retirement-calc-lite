# 🏦 Retiro MX
### Personal Retirement Simulator for Mexico

> Project your future pension considering AFORE, PPR, and Private Savings. Includes personalized AI-driven, bilingual recommendations powered by Google Gemini and clear legal-logic modeling for Mexican pensions (Ley 97).

---

## ✨ Key Features

### 🧮 Financial Simulator
- General configuration: current age, retirement age, planning horizon, expected annual inflation.
- AFORE (IMSS Pension): input gross monthly salary → automatic IMSS contribution estimate (6.5% default), current balance and expected return.
- PPR (Personal Retirement Plan): current balance, monthly contribution, expected return, estimated annual SAT tax refund (NPV-aware).
- Private Savings (CETES, Funds, Stocks): balance, monthly contribution, expected return.
- Independent Worker Mode (RESICO / Freelance): toggles calculations (RFC gen., IVA 0% rules, IMSS M10 notes).
- Dynamic legal pension logic (Ley 97): supports payout start ages, early retirement penalties (60–64 % scale) and passive growth behavior.

### 📊 Results & Insights
- Estimated future monthly pension in future pesos and NPV (Net Present Value, current-year pesos).
- Total Monthly Package: combined AFORE + PPR + Private Savings.
- Wealth growth chart and year-by-year detail view.
- Side-by-side comparisons (e.g., retire at 65 vs retire earlier).
- Tooltips and inline explanations (legal notes and penalties) to educate the user.

### 🤖 AI Recommendations (Powered by Gemini)
- 3 quantitative, personalized recommendations in one bilingual API call (ES/EN).
- Recommendations ALWAYS expressed in NPV (current-year pesos) with explicit mapping from future pesos → NPV.
- Each recommendation includes: numeric figures (MXN), emoji, impact label (High/Medium/Low).
- Cooldown: 30-second rate limit on regenerating tips (client-side).
- Fallback tips available if AI request fails.

### 📄 Native PDF Export
- Browser-native export using `window.print()` and `@media print` styles for readable, ink-friendly PDF output.
- PDF contains header (title, generation date), input summary, results, chart, AI tips and disclaimer footer.
- PDF always styled in Light Mode for readability regardless of current theme.

### 🌐 Internationalization & UX
- Full Spanish / English support with language toggle.
- Dark Mode default; Light Mode toggle available.
- Responsive design (mobile-first).
- Inputs with + / − controls and perfect alignment.
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
- Final model choice: `gemini-2.5-flash-lite` or `gemini-flash-lite-latest` depending on availability.
- Prompt engineering to ensure NPV outputs, bilingual results, numeric recommendations and stable temperature (0.8).

### Phase 5 — Legal & Production Polish
- Implemented Ley 97 logic: passive growth if retiring < 60, early retirement percentages (60:75%, 61:80%, 62:85%, 63:90%, 64:95%, 65+:100%).
- UX: Legal warnings, tooltips, and info badges to explain reductions and payout ages.
- Native PDF export via browser print.
- Footer with PM credit and portfolio link.
- Deployed on Vercel with env-based API key.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| AI | Google Gemini (flash-lite) |
| AI SDK | @google/generative-ai 0.24.1 |
| Deployment | Vercel |

---

## ⚙️ Local Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-user/retiro-mx.git
cd retiro-mx

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY (Google AI Studio) or set the provider in Roo config

# 4. Run in development
npm run dev
```

---

## 📝 Credits & Portfolio
Developed by **Pablo Arroyo** (Product Manager).  
Explore more projects: [https://pxblx7.github.io/pablo-arroyo-product-manager/](https://pxblx7.github.io/pablo-arroyo-product-manager/)
