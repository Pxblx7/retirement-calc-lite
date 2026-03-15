// ─── Types ───────────────────────────────────────────────────────────────────

export interface BucketConfig {
  initialBalance: number
  monthlyContribution: number
  annualReturn: number
}

export interface SimConfig {
  // Ages
  currentAge: number
  retirementAge: number
  planningHorizonAge: number

  // Inflation
  inflation: number // e.g. 0.045

  // Independent Worker
  isIndependent: boolean

  // Buckets
  afore: BucketConfig & { grossSalary: number }
  ppr: BucketConfig & { satRefund: number }
  private: BucketConfig

  // Base Year (Dynamic)
  yearBase: number
}

export interface YearRow {
  year: number
  age: number
  aforeBalance: number
  pprBalance: number
  privateBalance: number
  totalBalance: number
}

export interface BucketResult {
  futureMonthly: number
  vpnMonthly: number
}

export interface SimulationResult {
  years: YearRow[]
  afore: BucketResult
  ppr: BucketResult
  private: BucketResult
  total: BucketResult
  isEarlyRetirement: boolean
}

// ─── Defaults ────────────────────────────────────────────────────────────────

export function getDefaultConfig(): SimConfig {
  return {
    currentAge: 30,
    retirementAge: 65,
    planningHorizonAge: 90,
    inflation: 0.045,
    yearBase: new Date().getFullYear(),
    isIndependent: false,
    afore: {
      grossSalary: 10000,
      initialBalance: 0,
      monthlyContribution: 650, // 6.5% of 10,000
      annualReturn: 0.06,
    },
    ppr: {
      initialBalance: 0,
      monthlyContribution: 0,
      annualReturn: 0.07,
      satRefund: 0,
    },
    private: {
      initialBalance: 0,
      monthlyContribution: 0,
      annualReturn: 0.07,
    },
  }
}

// ─── Math Helpers ────────────────────────────────────────────────────────────

/**
 * Annuity formula to calculate monthly payment (PMT)
 * PMT = PV * (r / (1 - (1 + r)^-n))
 */
function calculateAnnuity(pv: number, annualRate: number, months: number): number {
  if (pv <= 0) return 0
  const r = annualRate / 12
  if (r === 0) return pv / months
  return pv * (r / (1 - Math.pow(1 + r, -months)))
}

// ─── Simulation ──────────────────────────────────────────────────────────────

export function simulatePlan(config: SimConfig): SimulationResult {
  const yearsToStopWork = config.retirementAge - config.currentAge;

  // --- Key Ages & Scenarios ---
  const isTooEarly = config.retirementAge < 60; // Scenario A: Stops work early, AFORE pays at 65
  const isCesantia = config.retirementAge >= 60 && config.retirementAge < 65; // Scenario B: Pays at retirementAge with penalty
  const isVejez = config.retirementAge >= 65; // Scenario C: Pays at retirementAge (100%)

  const aforePayoutAge = isTooEarly ? 65 : config.retirementAge;
  const pprPrivatePayoutAge = config.retirementAge;

  // Annuity horizon calculation is based on planning horizon minus actual payout age
  const yearsToAforeAnnuity = config.planningHorizonAge - aforePayoutAge;
  const monthsInRetirementAfore = yearsToAforeAnnuity * 12;

  const yearsToPprPrivateAnnuity = config.planningHorizonAge - pprPrivatePayoutAge;
  const monthsInRetirementPprPrivate = yearsToPprPrivateAnnuity * 12;

  let aforeBalance = config.afore.initialBalance;
  let pprBalance = config.ppr.initialBalance;
  let privateBalance = config.private.initialBalance;

  const years: YearRow[] = [];

  // 1. Project until stop work age (where contributions cease)
  for (let i = 0; i <= yearsToStopWork; i++) {
    const currentYear = config.yearBase + i;
    const currentAge = config.currentAge + i;

    years.push({
      year: currentYear,
      age: currentAge,
      aforeBalance,
      pprBalance,
      privateBalance,
      totalBalance: aforeBalance + pprBalance + privateBalance,
    });

    if (i < yearsToStopWork) {
      // Apply monthly contributions and returns
      aforeBalance = (aforeBalance + config.afore.monthlyContribution * 12) * (1 + config.afore.annualReturn);
      pprBalance = (pprBalance + config.ppr.monthlyContribution * 12) * (1 + config.ppr.annualReturn);
      privateBalance = (privateBalance + config.private.monthlyContribution * 12) * (1 + config.private.annualReturn);

      // Add SAT refund for PPR (starting year after base year)
      if (currentYear >= config.yearBase) {
        pprBalance += config.ppr.satRefund;
      }
    }
  }

  // --- 2. Post-Contribution Adjustments & Payout Calculations ---

  // A. AFORE Balance Adjustment (Passive Growth if needed)
  let aforeBalanceAtPayout = aforeBalance;
  let aforePenaltyFactor = 1.0;

  if (isTooEarly) {
    // SCENARIO A: Grow from retirementAge to 65
    const yearsToGrow = 65 - config.retirementAge;
    for (let i = 0; i < yearsToGrow; i++) {
       aforeBalanceAtPayout = aforeBalanceAtPayout * (1 + config.afore.annualReturn);
    }
  } else if (isCesantia) {
    // SCENARIO B: Penalty applies based on age, PV is at retirementAge (aforeBalance already holds this)
    // 60 years: 75%, 61: 80%, 62: 85%, 63: 90%, 64: 95%
    aforePenaltyFactor = 0.75 + (config.retirementAge - 60) * 0.05;
  }
  // If isVejez, aforeBalanceAtPayout = aforeBalance (100% payout at retirementAge)

  // B. AFORE Monthly Payout
  let aforeMonthly = calculateAnnuity(aforeBalanceAtPayout, config.afore.annualReturn, monthsInRetirementAfore);
  aforeMonthly *= aforePenaltyFactor;

  // C. PPR/Private Monthly Payout (PV fixed at config.retirementAge, 100% payout)
  const pprMonthly = calculateAnnuity(pprBalance, config.ppr.annualReturn, monthsInRetirementPprPrivate);
  const privateMonthly = calculateAnnuity(privateBalance, config.private.annualReturn, monthsInRetirementPprPrivate);

  // --- 3. Update Year Tracking (If passive growth occurred up to age 65) ---
  if (isTooEarly && aforePayoutAge > config.retirementAge) {
     const yearsToGrow = aforePayoutAge - config.retirementAge;
     for (let i = 1; i <= yearsToGrow; i++) {
        const passiveAge = config.retirementAge + i;
        const passiveYear = config.yearBase + yearsToStopWork + i;
        
        // Only track capital accumulation up to planning horizon
        if (passiveAge > config.planningHorizonAge) break; 

        years.push({
            year: passiveYear,
            age: passiveAge,
            aforeBalance: aforeBalanceAtPayout, // This balance is the final PV used for annuity calculation at 65
            pprBalance: pprBalance, // Fixed balance from retirement age
            privateBalance: privateBalance, // Fixed balance from retirement age
            totalBalance: aforeBalanceAtPayout + pprBalance + privateBalance,
        });
     }
  }

  // --- 4. VPN Calculations (Base Current Year) ---
  // VPN calculation must use inflation offset from when *that specific bucket's payment starts*.
  
  const getBucketResult = (futureMonthly: number, payoutAge: number): BucketResult => {
    const yearsToInflate = payoutAge - config.currentAge;
    const inflationFactor = Math.pow(1 + config.inflation, yearsToInflate);
    return {
      futureMonthly,
      vpnMonthly: futureMonthly / inflationFactor,
    };
  };

  const aforeRes = getBucketResult(aforeMonthly, aforePayoutAge);
  const pprRes = getBucketResult(pprMonthly, pprPrivatePayoutAge);
  const privateRes = getBucketResult(privateMonthly, pprPrivatePayoutAge);

  return {
    years,
    afore: aforeRes,
    ppr: pprRes,
    private: privateRes,
    total: {
      futureMonthly: aforeRes.futureMonthly + pprRes.futureMonthly + privateRes.futureMonthly,
      vpnMonthly: aforeRes.vpnMonthly + pprRes.vpnMonthly + privateRes.vpnMonthly,
    },
    isEarlyRetirement: isCesantia, 
  }
}

// ─── Formatters ──────────────────────────────────────────────────────────────

export function formatCurrency(value: number, _locale: string = "es-MX"): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}
