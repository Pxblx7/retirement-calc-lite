// ─── Types ───────────────────────────────────────────────────────────────────

export interface SimConfig {
  // Time horizon
  yearBase: number
  yearEnd: number

  // Phase boundaries
  phase1Start: number
  phase1End: number
  phase2Start: number
  phase2End: number
  phase3Start: number
  phase3End: number

  // Inflation
  inflationMx: number // e.g. 0.0445
  inflationOther: number // e.g. 0.02

  // Returns
  returnPrivada: number // e.g. 0.08
  returnPPR: number
  returnAforeEl: number
  returnAforeElla: number

  // Initial balances
  initialPrivada: number
  initialPPR: number
  initialAforeEl: number
  initialAforeElla: number

  // Contributions Phase 1
  pprMonthly: number
  privadaTramo1Amount: number
  privadaTramo1Start: number
  privadaTramo1End: number
  privadaTramo2Amount: number
  privadaTramo2Start: number
  privadaTramo2End: number
  satAnnual: number
  satAnnualStartYear: number
  satMonth: number // 1-12, default 4 (April)
  aforeElBimonthly: number // amount every 2 months
  aforeEllaMonthly: number
  aforeEllaEndYear: number

  // Special events
  ventaCasaYear: number
  ventaCasaAmount: number
  compraCasaYear: number
  compraCasaAmount: number

  // Withdrawals (VPN = today's pesos)
  withdrawalPhase2VPN: number // monthly in base-year pesos
  withdrawalPhase3VPN: number
}

export interface YearRow {
  year: number
  phase: 1 | 2 | 3
  privada: number
  ppr: number
  aforeEl: number
  aforeElla: number
  total: number
  withdrawalNominalAnnual: number
  withdrawalVPNMonthly: number
  depleted: boolean
}

export interface WithdrawalKeyPoint {
  year: number
  phase: 2 | 3
  label: string
  vpnMonthly: number
  nominalMonthly: number
}

export interface SimulationResult {
  years: YearRow[]
  endPhase1: YearRow | null
  endPhase2: YearRow | null
  endPhase3: YearRow | null
  withdrawalKeyPoints: WithdrawalKeyPoint[]
}

// ─── Defaults ────────────────────────────────────────────────────────────────

export function getDefaultConfig(): SimConfig {
  return {
    yearBase: 2026,
    yearEnd: 2085,
    phase1Start: 2026,
    phase1End: 2046,
    phase2Start: 2047,
    phase2End: 2059,
    phase3Start: 2060,
    phase3End: 2085,
    inflationMx: 0.0445,
    inflationOther: 0.02,
    returnPrivada: 0.08,
    returnPPR: 0.09,
    returnAforeEl: 0.06,
    returnAforeElla: 0.05,
    initialPrivada: 0,
    initialPPR: 0,
    initialAforeEl: 521000,
    initialAforeElla: 0,
    pprMonthly: 7750,
    privadaTramo1Amount: 10000,
    privadaTramo1Start: 2027,
    privadaTramo1End: 2040,
    privadaTramo2Amount: 43000,
    privadaTramo2Start: 2041,
    privadaTramo2End: 2046,
    satAnnual: 30000,
    satAnnualStartYear: 2027,
    satMonth: 4,
    aforeElBimonthly: 16000,
    aforeEllaMonthly: 2300,
    aforeEllaEndYear: 2040,
    ventaCasaYear: 2046,
    ventaCasaAmount: 13000000,
    compraCasaYear: 2047,
    compraCasaAmount: 7200000,
    withdrawalPhase2VPN: 40000,
    withdrawalPhase3VPN: 50000,
  }
}

// ─── Simulation ──────────────────────────────────────────────────────────────

export function simulatePlan(config: SimConfig): SimulationResult {
  const years: YearRow[] = []

  let privada = config.initialPrivada
  let ppr = config.initialPPR
  let aforeEl = config.initialAforeEl
  let aforeElla = config.initialAforeElla

  // Pre-compute inflation factor from base to end of Phase 1
  const yearsPhase1 = config.phase1End - config.yearBase
  const factorMx = Math.pow(1 + config.inflationMx, yearsPhase1)

  function getPhase(y: number): 1 | 2 | 3 {
    if (y >= config.phase1Start && y <= config.phase1End) return 1
    if (y >= config.phase2Start && y <= config.phase2End) return 2
    return 3
  }

  function getNominalMonthly(y: number): number {
    const phase = getPhase(y)
    const vpn =
      phase === 2 ? config.withdrawalPhase2VPN : config.withdrawalPhase3VPN

    if (phase === 2 || phase === 3) {
      const yearsInJp = y - config.phase2Start
      const factorJp = Math.pow(1 + config.inflationOther, Math.max(0, yearsInJp))
      return vpn * factorMx * factorJp
    }
    return 0
  }

  for (let y = config.yearBase; y <= config.yearEnd; y++) {
    const phase = getPhase(y)
    let depleted = false

    // 1) Contributions (Phase 1 only)
    if (phase === 1) {
      // PPR monthly contributions
      ppr += config.pprMonthly * 12

      // Privada tramo 1
      if (y >= config.privadaTramo1Start && y <= config.privadaTramo1End) {
        privada += config.privadaTramo1Amount * 12
      }
      // Privada tramo 2
      if (y >= config.privadaTramo2Start && y <= config.privadaTramo2End) {
        privada += config.privadaTramo2Amount * 12
      }

      // SAT annual return
      if (y >= config.satAnnualStartYear) {
        privada += config.satAnnual
      }

      // Afore El bimonthly (6 times per year)
      aforeEl += config.aforeElBimonthly * 6

      // Afore Ella monthly
      if (y <= config.aforeEllaEndYear) {
        aforeElla += config.aforeEllaMonthly * 12
      }
    }

    // 2) Special events
    if (y === config.ventaCasaYear) {
      privada += config.ventaCasaAmount
    }
    if (y === config.compraCasaYear) {
      privada -= config.compraCasaAmount
      if (privada < 0) privada = 0
    }

    // 3) Apply annual returns
    privada *= 1 + config.returnPrivada
    ppr *= 1 + config.returnPPR
    aforeEl *= 1 + config.returnAforeEl
    aforeElla *= 1 + config.returnAforeElla

    // 4) Withdrawals (Phase 2 and 3)
    let withdrawalNominalAnnual = 0
    let withdrawalVPNMonthly = 0
    if (phase === 2 || phase === 3) {
      const nominalMonthly = getNominalMonthly(y)
      withdrawalVPNMonthly =
        phase === 2 ? config.withdrawalPhase2VPN : config.withdrawalPhase3VPN
      withdrawalNominalAnnual = nominalMonthly * 12

      const total = privada + ppr + aforeEl + aforeElla

      if (total <= 0) {
        depleted = true
        withdrawalNominalAnnual = 0
      } else if (withdrawalNominalAnnual > total) {
        withdrawalNominalAnnual = total
        depleted = true
        // Distribute proportionally
        const fPrivada = privada / total
        const fPPR = ppr / total
        const fAforeEl = aforeEl / total
        const fAforeElla = aforeElla / total
        privada -= withdrawalNominalAnnual * fPrivada
        ppr -= withdrawalNominalAnnual * fPPR
        aforeEl -= withdrawalNominalAnnual * fAforeEl
        aforeElla -= withdrawalNominalAnnual * fAforeElla
      } else {
        // Proportional withdrawal
        const fPrivada = privada / total
        const fPPR = ppr / total
        const fAforeEl = aforeEl / total
        const fAforeElla = aforeElla / total
        privada -= withdrawalNominalAnnual * fPrivada
        ppr -= withdrawalNominalAnnual * fPPR
        aforeEl -= withdrawalNominalAnnual * fAforeEl
        aforeElla -= withdrawalNominalAnnual * fAforeElla
      }
    }

    // Ensure no negatives from floating point
    privada = Math.max(0, privada)
    ppr = Math.max(0, ppr)
    aforeEl = Math.max(0, aforeEl)
    aforeElla = Math.max(0, aforeElla)

    years.push({
      year: y,
      phase,
      privada,
      ppr,
      aforeEl,
      aforeElla,
      total: privada + ppr + aforeEl + aforeElla,
      withdrawalNominalAnnual,
      withdrawalVPNMonthly,
      depleted,
    })
  }

  // Find phase-end rows
  const endPhase1 = years.find((r) => r.year === config.phase1End) ?? null
  const endPhase2 = years.find((r) => r.year === config.phase2End) ?? null
  const endPhase3 = years.find((r) => r.year === config.phase3End) ?? null

  // Withdrawal key points
  const withdrawalKeyPoints: WithdrawalKeyPoint[] = []

  const kpYears = [
    {
      year: config.phase2Start,
      phase: 2 as const,
      label: `kp.startPhase2`,
    },
    {
      year: config.phase2End,
      phase: 2 as const,
      label: `kp.endPhase2`,
    },
    {
      year: config.phase3Start,
      phase: 3 as const,
      label: `kp.startPhase3`,
    },
    {
      year: config.phase3End,
      phase: 3 as const,
      label: `kp.endPhase3`,
    },
  ]

  for (const kp of kpYears) {
    if (kp.year >= config.yearBase && kp.year <= config.yearEnd) {
      const nominalMonthly = getNominalMonthly(kp.year)
      const vpn =
        kp.phase === 2
          ? config.withdrawalPhase2VPN
          : config.withdrawalPhase3VPN
      withdrawalKeyPoints.push({
        year: kp.year,
        phase: kp.phase,
        label: kp.label,
        vpnMonthly: vpn,
        nominalMonthly,
      })
    }
  }

  return {
    years,
    endPhase1,
    endPhase2,
    endPhase3,
    withdrawalKeyPoints,
  }
}

// ─── Formatters ──────────────────────────────────────────────────────────────

export function formatCurrency(value: number, _locale: string = "en"): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`
}
