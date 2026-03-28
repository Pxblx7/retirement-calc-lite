import type { SimConfig } from './simulation'
import type { PPRConfig } from './ppr-helpers'

// ─── Result type ─────────────────────────────────────────────────────────────

export interface GoalResult {
  /** Projected AFORE NPV in today's pesos */
  aforeNPV: number
  /** Whether AFORE alone covers the target — no extra contribution needed */
  alreadyCovered: boolean
  /** Additional monthly contribution needed across ALL PPR accounts combined */
  pprTotalMonthly: number
  /** Additional monthly contribution needed for Private Savings */
  privateMonthly: number
  /** Per-account additional monthly contribution (same order as pprList input) */
  pprByAccount: number[]
}

// ─── Private math helpers ─────────────────────────────────────────────────────

/** Present value of an annuity paying `pmt` per month for `months` months */
function annuityPV(pmt: number, annualRate: number, months: number): number {
  if (pmt <= 0 || months <= 0) return 0
  const r = annualRate / 12
  if (r === 0) return pmt * months
  return pmt * ((1 - Math.pow(1 + r, -months)) / r)
}

/** Monthly payment from a present value `pv` annuity */
function annuityPMT(pv: number, annualRate: number, months: number): number {
  if (pv <= 0 || months <= 0) return 0
  const r = annualRate / 12
  if (r === 0) return pv / months
  return pv * (r / (1 - Math.pow(1 + r, -months)))
}

/**
 * Forward-compound balance using the engine's exact formula:
 *   b_new = (b + contrib * 12) * (1 + r) + satRefund
 * satRefund is added only during accumulation (ignored in withdrawal).
 */
function fvLoop(
  balance: number,
  monthlyContrib: number,
  annualReturn: number,
  years: number,
  satRefund: number = 0,
  annualIncrement: number = 0,
): number {
  let b = balance
  for (let i = 0; i < years; i++) {
    const contrib = monthlyContrib * Math.pow(1 + annualIncrement, i)
    b = (b + contrib * 12) * (1 + annualReturn) + satRefund
  }
  return b
}

/**
 * Binary-search for the monthly contribution that achieves `targetFV`
 * using the engine's exact accumulation formula.
 * Returns the TOTAL required monthly contribution (not just a delta).
 */
function findRequiredMonthlyContrib(
  currentBalance: number,
  targetFV: number,
  annualReturn: number,
  years: number,
  satRefund: number = 0,
  annualIncrement: number = 0,
): number {
  if (years <= 0) return 0

  // Already on track at zero contribution?
  const fvAtZero = fvLoop(currentBalance, 0, annualReturn, years, satRefund, annualIncrement)
  if (fvAtZero >= targetFV) return 0

  // Generous upper bound: if we contribute targetFV every year for `years` years
  let lo = 0
  let hi = targetFV / Math.max(years, 1) + 1_000_000

  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2
    const fv = fvLoop(currentBalance, mid, annualReturn, years, satRefund, annualIncrement)
    if (fv < targetFV) lo = mid
    else hi = mid
  }
  return Math.ceil((lo + hi) / 2)
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Given a desired monthly income in today's pesos, returns the ADDITIONAL
 * monthly contributions each PPR account and Private Savings need to close
 * the gap.
 *
 * AFORE is treated as fixed (salary-determined). The remaining income target
 * is split between PPR and Private proportionally by current contribution
 * weight (with sensible fallbacks).
 */
export function computeGoalThreshold(
  targetNPVMonthly: number,
  config: SimConfig,
  pprList: PPRConfig[],
): GoalResult {
  const yearsToRetirement = Math.max(config.retirementAge - config.currentAge, 0)
  const monthsPPRPrivate  = (config.planningHorizonAge - config.retirementAge) * 12

  // AFORE typically pays from age 65 (or retirement age if >= 65)
  const isCesantia       = config.retirementAge >= 60 && config.retirementAge < 65
  const aforePayoutAge   = Math.max(config.retirementAge, 65)
  const aforeAccumYears  = aforePayoutAge - config.currentAge
  const monthsAfore      = Math.max((config.planningHorizonAge - aforePayoutAge) * 12, 0)

  // --- 1. Project AFORE balance to payout age ---
  const aforeFV = fvLoop(
    config.afore.initialBalance,
    config.afore.monthlyContribution,
    config.afore.annualReturn,
    aforeAccumYears,
    0,
    config.afore.annualContributionIncrement ?? 0,
  )
  // Cesantia penalty: ~75% at 60, linearly improving to 100% at 65
  const penalty       = isCesantia ? 0.75 + (config.retirementAge - 60) * 0.05 : 1.0
  const aforeMonthly  = annuityPMT(aforeFV, config.afore.annualReturn, monthsAfore) * penalty
  const aforeNPV      = aforeMonthly / Math.pow(1 + config.inflation, aforeAccumYears)

  // --- 2. Remaining target for PPR + Private ---
  const remainingNPV  = Math.max(0, targetNPVMonthly - aforeNPV)

  if (remainingNPV <= 0) {
    return {
      aforeNPV,
      alreadyCovered: true,
      pprTotalMonthly: 0,
      privateMonthly: 0,
      pprByAccount: pprList.map(() => 0),
    }
  }

  const remainingFuture = remainingNPV * Math.pow(1 + config.inflation, yearsToRetirement)

  // --- 3. Split PPR vs Private by contribution weight ---
  const totalPPRContrib  = pprList.reduce((s, p) => s + p.monthlyContribution, 0)
  const totalPPRBalance  = pprList.reduce((s, p) => s + p.initialBalance,      0)
  const privateContrib   = config.private.monthlyContribution
  const denomContrib     = totalPPRContrib + privateContrib

  let wPPR: number, wPrivate: number
  if (denomContrib > 0) {
    wPPR = totalPPRContrib / denomContrib
    wPrivate = privateContrib / denomContrib
  } else if (totalPPRBalance + config.private.initialBalance > 0) {
    const totalBal = totalPPRBalance + config.private.initialBalance
    wPPR = totalPPRBalance / totalBal
    wPrivate = config.private.initialBalance / totalBal
  } else {
    // No money anywhere — split by account count (1 PPR-slot vs 1 Private slot)
    wPPR = pprList.length / (pprList.length + 1)
    wPrivate = 1 / (pprList.length + 1)
  }

  // --- 4. Compute required PPR aggregate lump sum & contribution ---
  const pprAggReturn =
    totalPPRContrib > 0
      ? pprList.reduce((s, p) => s + p.annualReturn * p.monthlyContribution, 0) / totalPPRContrib
      : totalPPRBalance > 0
      ? pprList.reduce((s, p) => s + p.annualReturn * p.initialBalance, 0) / totalPPRBalance
      : pprList.reduce((s, p) => s + p.annualReturn, 0) / Math.max(pprList.length, 1)

  const pprAggIncrement = totalPPRContrib > 0
    ? pprList.reduce((s, p) => s + (p.annualContributionIncrement ?? 0) * p.monthlyContribution, 0) / totalPPRContrib
    : pprList.reduce((s, p) => s + (p.annualContributionIncrement ?? 0), 0) / Math.max(pprList.length, 1)

  const pprTargetFuture  = remainingFuture * wPPR
  const pprTargetLump    = annuityPV(pprTargetFuture, pprAggReturn, monthsPPRPrivate)
  const totalPPRSatRefund = pprList.reduce((s, p) => s + (p.taxArticle === 'art93' ? 0 : p.satRefund), 0)

  const pprTotalRequired  = findRequiredMonthlyContrib(
    totalPPRBalance,
    pprTargetLump,
    pprAggReturn,
    yearsToRetirement,
    totalPPRSatRefund,
    pprAggIncrement,
  )
  const pprTotalMonthly   = Math.max(0, pprTotalRequired - totalPPRContrib)

  // --- 5. Compute required Private lump sum & contribution ---
  const privateTargetFuture  = remainingFuture * wPrivate
  const privateTargetLump    = annuityPV(privateTargetFuture, config.private.annualReturn, monthsPPRPrivate)
  const privateRequired      = findRequiredMonthlyContrib(
    config.private.initialBalance,
    privateTargetLump,
    config.private.annualReturn,
    yearsToRetirement,
    0, // satRefund
    config.private.annualContributionIncrement ?? 0,
  )
  const privateMonthly = Math.max(0, privateRequired - privateContrib)

  // --- 6. Distribute PPR delta among individual accounts by current weight ---
  const pprByAccount = pprList.map((p) => {
    if (pprList.length === 1) return pprTotalMonthly
    const w = totalPPRContrib > 0 ? p.monthlyContribution / totalPPRContrib : 1 / pprList.length
    return Math.ceil(pprTotalMonthly * w)
  })

  return { aforeNPV, alreadyCovered: false, pprTotalMonthly, privateMonthly, pprByAccount }
}
