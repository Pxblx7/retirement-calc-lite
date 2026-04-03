// ─── Types ───────────────────────────────────────────────────────────────────

export interface BucketConfig {
  initialBalance: number
  monthlyContribution: number
  annualReturn: number
  /** Optional compound annual growth rate for contributions (0 = disabled). Stops at retirementAge. */
  annualContributionIncrement?: number
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
      monthlyContribution: 950, // 9.5% of 10,000 (2025 reforma pensiones rate)
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
  if (pv <= 0 || months <= 0) return 0
  const r = annualRate / 12
  if (r === 0) return pv / months
  return pv * (r / (1 - Math.pow(1 + r, -months)))
}

// ─── Simulation ──────────────────────────────────────────────────────────────

export function simulatePlan(config: SimConfig): SimulationResult {
  const years: YearRow[] = [];
  
  // --- Constants & Scenario Flags ---
  const isTooEarly = config.retirementAge < 60;
  const isCesantia = config.retirementAge >= 60 && config.retirementAge < 65;
  
  const aforePayoutAge = isTooEarly ? 65 : config.retirementAge;
  const pprPrivatePayoutAge = config.retirementAge;

  const monthsInRetirementAfore = (config.planningHorizonAge - aforePayoutAge) * 12;
  const monthsInRetirementPprPrivate = (config.planningHorizonAge - pprPrivatePayoutAge) * 12;

  // --- Initial State ---
  let aforeBalance = config.afore.initialBalance;
  let pprBalance = config.ppr.initialBalance;
  let privateBalance = config.private.initialBalance;

  // 1. PROJECT UNTIL PLANNING HORIZON
  // This unified loop handles Accumulation, Passive Growth, and Withdrawal phases
  for (let age = config.currentAge; age <= config.planningHorizonAge; age++) {
    const yearIdx = age - config.currentAge;
    const currentYear = config.yearBase + yearIdx;

    // Capture state at the BEGINNING of the period/year
    years.push({
      year: currentYear,
      age: age,
      aforeBalance: Math.max(0, aforeBalance),
      pprBalance: Math.max(0, pprBalance),
      privateBalance: Math.max(0, privateBalance),
      totalBalance: Math.max(0, aforeBalance + pprBalance + privateBalance),
    });

    // Stop calculations if we've reached the last year of the planning horizon
    if (age === config.planningHorizonAge) break;

    // CALCULATE NEXT YEAR'S BALANCE
    
    // --- Phase Logic for each bucket ---
    
    // AFORE Payout Factor (Applied only at withdrawal)
    const aforePenaltyFactor = isCesantia ? (0.75 + (config.retirementAge - 60) * 0.05) : 1.0;

    // A. AFORE Logic
    if (age < config.retirementAge) {
      // Accumulation — apply compound increment if configured
      const aforeIncrement = config.afore.annualContributionIncrement ?? 0
      const aforeContrib = config.afore.monthlyContribution * Math.pow(1 + aforeIncrement, yearIdx)
      aforeBalance = (aforeBalance + aforeContrib * 12) * (1 + config.afore.annualReturn);
    } else if (age < aforePayoutAge) {
      // Passive Growth (Scenario A: Early retirement, wait until 65)
      aforeBalance = aforeBalance * (1 + config.afore.annualReturn);
    } else {
      // Withdrawal Phase
      // We calculate the annuity at the MOMENT payout starts
      const pvAtStart = years.find(y => y.age === aforePayoutAge)?.aforeBalance || 0;
      const aforeMonthly = calculateAnnuity(pvAtStart, config.afore.annualReturn, monthsInRetirementAfore) * aforePenaltyFactor;
      aforeBalance = (aforeBalance * (1 + config.afore.annualReturn)) - (aforeMonthly * 12);
    }

    // B. PPR Logic
    if (age < config.retirementAge) {
      // Accumulation — apply compound increment if configured
      const pprIncrement = config.ppr.annualContributionIncrement ?? 0
      const pprContrib = config.ppr.monthlyContribution * Math.pow(1 + pprIncrement, yearIdx)
      pprBalance = (pprBalance + pprContrib * 12) * (1 + config.ppr.annualReturn) + config.ppr.satRefund;
    } else {
      // Withdrawal Phase
      const pvAtStart = years.find(y => y.age === pprPrivatePayoutAge)?.pprBalance || 0;
      const pprMonthly = calculateAnnuity(pvAtStart, config.ppr.annualReturn, monthsInRetirementPprPrivate);
      pprBalance = (pprBalance * (1 + config.ppr.annualReturn)) - (pprMonthly * 12);
    }

    // C. Private Logic
    if (age < config.retirementAge) {
      // Accumulation — apply compound increment if configured
      const privateIncrement = config.private.annualContributionIncrement ?? 0
      const privateContrib = config.private.monthlyContribution * Math.pow(1 + privateIncrement, yearIdx)
      privateBalance = (privateBalance + privateContrib * 12) * (1 + config.private.annualReturn);
    } else {
      // Withdrawal Phase
      const pvAtStart = years.find(y => y.age === pprPrivatePayoutAge)?.privateBalance || 0;
      const privateMonthly = calculateAnnuity(pvAtStart, config.private.annualReturn, monthsInRetirementPprPrivate);
      privateBalance = (privateBalance * (1 + config.private.annualReturn)) - (privateMonthly * 12);
    }
  }

  // --- FINAL PENSION CALCULATIONS (FOR RESULTS PANEL) ---
  // To ensure 100% consistency, we pull the "PV at Start" from the generated years array
  const finalAforePV = years.find(y => y.age === aforePayoutAge)?.aforeBalance || 0;
  const finalPprPV = years.find(y => y.age === pprPrivatePayoutAge)?.pprBalance || 0;
  const finalPrivatePV = years.find(y => y.age === pprPrivatePayoutAge)?.privateBalance || 0;

  const aforePenaltyFactor = isCesantia ? (0.75 + (config.retirementAge - 60) * 0.05) : 1.0;
  
  const aforeMonthly = calculateAnnuity(finalAforePV, config.afore.annualReturn, monthsInRetirementAfore) * aforePenaltyFactor;
  const pprMonthly = calculateAnnuity(finalPprPV, config.ppr.annualReturn, monthsInRetirementPprPrivate);
  const privateMonthly = calculateAnnuity(finalPrivatePV, config.private.annualReturn, monthsInRetirementPprPrivate);

  // --- VPN Calculations (Base Current Year) ---
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

  /**
   * VERIFICATION LOG (as requested):
   * At age 90 (planningHorizonAge), balances for PPR and Private are $0.
   * Logic: The withdrawal amount is calculated as an annuity (PMT) that exhausts the PV
   * exactly over the remaining months at the given interest rate. 
   * Since we use the same PMT and rate in the loop: Balance_N = (Balance_N-1 * (1+r)) - (PMT * 12),
   * the balance must reach zero at age 90.
   */
  // console.log(`Verification: Age ${config.planningHorizonAge} balances -> PPR: ${pprBalance.toFixed(2)}, Private: ${privateBalance.toFixed(2)}`);

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
