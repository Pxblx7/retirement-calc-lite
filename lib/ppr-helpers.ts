import type { SimConfig } from './simulation'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PPRConfig {
  label: string
  initialBalance: number
  monthlyContribution: number
  annualReturn: number
  satRefund: number
}

// ─── Factory ─────────────────────────────────────────────────────────────────

export function createDefaultPPR(index: number = 0): PPRConfig {
  return {
    label: `PPR ${index + 1}`,
    initialBalance: 0,
    monthlyContribution: 0,
    annualReturn: 0.07,
    satRefund: 0,
  }
}

// ─── Aggregation ─────────────────────────────────────────────────────────────

/**
 * Collapses a list of PPR accounts into a single SimConfig['ppr'] object.
 * The annual return is weighted by monthly contribution, then by initial balance,
 * then plain average — whichever has non-zero weight first.
 */
export function aggregatePPRs(pprs: PPRConfig[]): SimConfig['ppr'] {
  if (pprs.length === 0) {
    return { initialBalance: 0, monthlyContribution: 0, annualReturn: 0.07, satRefund: 0 }
  }

  const totalBalance  = pprs.reduce((s, p) => s + p.initialBalance,       0)
  const totalContrib  = pprs.reduce((s, p) => s + p.monthlyContribution,  0)
  const totalSatRefund = pprs.reduce((s, p) => s + p.satRefund,            0)

  let weightedReturn: number
  if (totalContrib > 0) {
    weightedReturn = pprs.reduce((s, p) => s + p.annualReturn * p.monthlyContribution, 0) / totalContrib
  } else if (totalBalance > 0) {
    weightedReturn = pprs.reduce((s, p) => s + p.annualReturn * p.initialBalance, 0) / totalBalance
  } else {
    weightedReturn = pprs.reduce((s, p) => s + p.annualReturn, 0) / pprs.length
  }

  return {
    initialBalance:    totalBalance,
    monthlyContribution: totalContrib,
    annualReturn:      weightedReturn,
    satRefund:         totalSatRefund,
  }
}

// ─── Per-account yearly detail ────────────────────────────────────────────────

/** PMT annuity formula — mirrors simulation.ts */
function calculateAnnuityPMT(pv: number, annualRate: number, months: number): number {
  if (pv <= 0 || months <= 0) return 0
  const r = annualRate / 12
  if (r === 0) return pv / months
  return pv * (r / (1 - Math.pow(1 + r, -months)))
}

/**
 * Simulates each PPR account independently and returns a 2-D array where
 * result[pprIndex][yearIndex] is the balance snapshot for that year (same
 * capture-first logic as the simulation engine).
 *
 * @param pprs        The list of PPR accounts
 * @param years       The years array from SimulationResult (used for age lookup)
 * @param retirementAge
 * @param planningHorizonAge
 */
export function computePPRDetailByYear(
  pprs: PPRConfig[],
  years: { age: number }[],
  retirementAge: number,
  planningHorizonAge: number,
): number[][] {
  const monthsInRetirement = (planningHorizonAge - retirementAge) * 12

  return pprs.map((ppr) => {
    let balance = ppr.initialBalance
    let monthlyWithdrawal = 0
    let pvCaptured = false

    return years.map((row) => {
      // Capture BEFORE any update (mirrors engine)
      const snapshot = Math.max(0, balance)

      // Freeze annuity at the start of withdrawal
      if (row.age === retirementAge && !pvCaptured) {
        pvCaptured = true
        monthlyWithdrawal = calculateAnnuityPMT(snapshot, ppr.annualReturn, monthsInRetirement)
      }

      // Update balance — but not at the last year (engine breaks at planningHorizonAge)
      if (row.age < planningHorizonAge) {
        if (row.age < retirementAge) {
          // Accumulation: matches engine formula exactly
          balance = (balance + ppr.monthlyContribution * 12) * (1 + ppr.annualReturn) + ppr.satRefund
        } else {
          // Withdrawal
          balance = balance * (1 + ppr.annualReturn) - monthlyWithdrawal * 12
        }
      }

      return snapshot
    })
  })
}
