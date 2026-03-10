import * as XLSX from "xlsx"
import type { SimConfig, SimulationResult, WithdrawalKeyPoint } from "./simulation"

// Helper to convert array of objects to worksheet and apply number format
function aoaToSheet(data: any[][], header?: string[]) {
  const ws = XLSX.utils.aoa_to_sheet(data)
  if (header) {
    XLSX.utils.sheet_add_aoa(ws, [header], { origin: "A1" })
  }

  // Apply number format to numeric cells
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1')
  for (let R = range.s.r + 1; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellref = XLSX.utils.encode_cell({ r: R, c: C })
      if (ws[cellref] && typeof ws[cellref].v === 'number') {
        ws[cellref].t = 'n'
        ws[cellref].z = '#,##0' // Accounting-like format without decimals for cleaner look, or use '#,##0.00'
      }
    }
  }
  return ws
}

function createAssumptionsSheet(config: SimConfig) {
  const data = [
    ["Assumption", "Value"],
    ["Base Year", config.yearBase],
    ["End Year", config.yearEnd],
    ["Phase 1 Start", config.phase1Start],
    ["Phase 1 End", config.phase1End],
    ["Phase 2 Start", config.phase2Start],
    ["Phase 2 End", config.phase2End],
    ["Phase 3 Start", config.phase3Start],
    ["Phase 3 End", config.phase3End],
    ["Inflation MX", config.inflationMx],
    ["Inflation Other", config.inflationOther],
    ["Return Privada", config.returnPrivada],
    ["Return PPR", config.returnPPR],
    ["Return Afore El", config.returnAforeEl],
    ["Return Afore Ella", config.returnAforeElla],
    ["Initial Privada", config.initialPrivada],
    ["Initial PPR", config.initialPPR],
    ["Initial Afore El", config.initialAforeEl],
    ["Initial Afore Ella", config.initialAforeElla],
    ["PPR Monthly", config.pprMonthly],
    ["Privada Tramo 1 Amount", config.privadaTramo1Amount],
    ["Privada Tramo 1 Start", config.privadaTramo1Start],
    ["Privada Tramo 1 End", config.privadaTramo1End],
    ["Privada Tramo 2 Amount", config.privadaTramo2Amount],
    ["Privada Tramo 2 Start", config.privadaTramo2Start],
    ["Privada Tramo 2 End", config.privadaTramo2End],
    ["SAT Annual", config.satAnnual],
    ["SAT Annual Start Year", config.satAnnualStartYear],
    ["SAT Month", config.satMonth],
    ["Afore El Bimonthly", config.aforeElBimonthly],
    ["Afore Ella Monthly", config.aforeEllaMonthly],
    ["Afore Ella End Year", config.aforeEllaEndYear],
    ["Venta Casa Year", config.ventaCasaYear],
    ["Venta Casa Amount", config.ventaCasaAmount],
    ["Compra Casa Year", config.compraCasaYear],
    ["Compra Casa Amount", config.compraCasaAmount],
    ["Withdrawal Phase 2 VPN", config.withdrawalPhase2VPN],
    ["Withdrawal Phase 3 VPN", config.withdrawalPhase3VPN],
  ]
  return aoaToSheet(data)
}

function createSummarySheet(result: SimulationResult, t: (key: string) => string) {
  const keyYears = new Set<number>()
  const firstYear = result.years[0]?.year ?? 0
  const lastYear = result.years[result.years.length - 1]?.year ?? 0

  if (result.endPhase1) keyYears.add(result.endPhase1.year)
  if (result.endPhase2) keyYears.add(result.endPhase2.year)
  if (result.endPhase3) keyYears.add(result.endPhase3.year)
  keyYears.add(firstYear)
  keyYears.add(lastYear)

  for (let y = firstYear; y <= lastYear; y += 5) {
    keyYears.add(y)
  }

  const summaryRows = result.years.filter((r) => keyYears.has(r.year))

  const data = summaryRows.map((row) => [
    row.year,
    `P${row.phase}`,
    row.privada,
    row.ppr,
    row.aforeEl,
    row.aforeElla,
    row.total,
  ])
  const header = [
    t("results.year"),
    t("results.phase"),
    t("results.private"),
    t("results.ppr"),
    t("results.aforeHis"),
    t("results.aforeHer"),
    t("results.total"),
  ]
  return aoaToSheet(data, header)
}

function createChartSheet(result: SimulationResult, t: (key: string) => string) {
  const withdrawalLabel = t("results.withdrawalsOnChart")
  const data = result.years.map((r) => ({
    year: r.year,
    [t("results.private")]: Math.round(r.privada),
    [t("results.ppr")]: Math.round(r.ppr),
    [t("results.aforeHis")]: Math.round(r.aforeEl),
    [t("results.aforeHer")]: Math.round(r.aforeElla),
    [withdrawalLabel]: Math.round(r.withdrawalNominalAnnual),
  }))
  return XLSX.utils.json_to_sheet(data)
}

function createWithdrawalsSheet(result: SimulationResult, t: (key: string) => string) {
  const data = result.withdrawalKeyPoints.map((kp) => {
    const factor = kp.vpnMonthly > 0 ? kp.nominalMonthly / kp.vpnMonthly : 0
    return [
      `${t(kp.label as any)} (${kp.year})`,
      kp.year,
      `P${kp.phase}`,
      kp.vpnMonthly,
      kp.nominalMonthly,
      Number(factor.toFixed(2)),
    ]
  })
  const header = [
    t("results.keyPoint"),
    t("results.year"),
    t("results.phase"),
    t("results.withdrawalVPN"),
    t("results.withdrawalNominal"),
    t("results.inflationFactor"),
  ]
  return aoaToSheet(data, header)
}

function createDetailSheet(result: SimulationResult, t: (key: string) => string) {
  const data = result.years.map((row) => [
    row.year,
    `P${row.phase}`,
    row.privada,
    row.ppr,
    row.aforeEl,
    row.aforeElla,
    row.total,
    row.withdrawalNominalAnnual,
  ])
  const header = [
    t("results.year"),
    t("results.phase"),
    t("results.private"),
    t("results.ppr"),
    t("results.aforeHis"),
    t("results.aforeHer"),
    t("results.total"),
    t("results.annualWithdrawal"),
  ]
  return aoaToSheet(data, header)
}

export function exportToExcel(
  config: SimConfig,
  result: SimulationResult,
  t: (key: any) => string,
  _locale: string,
) {
  const wb = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(wb, createAssumptionsSheet(config), "Assumptions")
  XLSX.utils.book_append_sheet(wb, createSummarySheet(result, t), "Summary")
  XLSX.utils.book_append_sheet(wb, createChartSheet(result, t), "Chart Data")
  XLSX.utils.book_append_sheet(wb, createWithdrawalsSheet(result, t), "Withdrawals")
  XLSX.utils.book_append_sheet(wb, createDetailSheet(result, t), "Detail")

  XLSX.writeFile(wb, "retirement_simulation.xlsx")
}
