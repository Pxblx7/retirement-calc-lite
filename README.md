# Retirement Simulator - Wealth Strategy

A comprehensive retirement planning tool designed for users in Mexico and other countries. This simulator helps project wealth across three distinct life phases: Accumulation, Transition, and Advanced Withdrawals.

## 🚀 Features

- **Three-Phase Simulation**:
  - **Phase 1 (Accumulation)**: Focuses on building wealth through various investment vehicles (Private, PPR, Afore).
  - **Phase 2 (Transition)**: Initial withdrawal phase with specific monthly targets.
  - **Phase 3 (Advanced Withdrawals)**: Long-term withdrawal strategy until the end of the projection horizon.
- **Multi-Account Tracking**: Simultaneously simulates Private investments, PPR (Personal Retirement Plans), and Afore (His/Her) accounts.
- **Inflation & Returns**: Customizable inflation rates (Mexico and Other) and expected returns for each account type.
- **Special Events**: Model significant life events like house sales or purchases.
- **Smart Logic**:
  - **SAT Annual Refund**: Configurable start year for tax refunds (default 2027).
  - **Proportional Withdrawals**: Automatically distributes withdrawals across accounts based on their relative balances.
  - **Depletion Alerts**: Visual indicators (red icons) if funds are projected to run out during Phase 3.
- **Export to Excel**: Download a detailed multi-sheet `.xlsx` report including assumptions, summaries, chart data, and full annual breakdowns.
- **Dark Mode by Default**: Optimized for a modern, comfortable viewing experience.
- **Bilingual Support**: Full support for English and Spanish.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Excel Export**: [SheetJS (XLSX)](https://sheetjs.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏃 Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Run the development server**:
    ```bash
    npm run dev
    ```
3.  **Open the app**: Navigate to [http://localhost:3000](http://localhost:3000).

## 📊 Export Details

The Excel export feature provides a comprehensive workbook with:
- **Assumptions**: All input parameters used for the simulation.
- **Summary**: Key milestones and 5-year interval balances.
- **Chart Data**: Raw data points for custom analysis.
- **Withdrawals**: Detailed breakdown of VPN vs. Nominal monthly withdrawals.
- **Detail**: Full year-by-year ledger of all accounts.

## 📄 License

MIT
