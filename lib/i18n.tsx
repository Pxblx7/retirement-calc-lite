"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type Locale = "en" | "es"

const translations = {
  en: {
    // Header
    "header.title": "Retirement Simulator",
    "header.subtitle": "Wealth Strategy - Other Country / Mexico",

    // Assumptions Panel
    "assumptions.general": "General Assumptions",
    "assumptions.baseYear": "Base Year",
    "assumptions.endYear": "End Year",
    "assumptions.phase1": "Phase 1 - Accumulation",
    "assumptions.phase2": "Phase 2 - Transition",
    "assumptions.phase3": "Phase 3 - Advanced Withdrawals",
    "assumptions.start": "Start",
    "assumptions.end": "End",

    "assumptions.rates": "Rates & Returns",
    "assumptions.inflationMx": "Mexico Inflation",
    "assumptions.inflationOther": "Other Country Inflation",
    "assumptions.returnPrivada": "Private Return",
    "assumptions.returnPPR": "PPR Return",
    "assumptions.returnAforeEl": "Afore His Return",
    "assumptions.returnAforeElla": "Afore Her Return",

    "assumptions.contributions": "Contributions & Events",
    "assumptions.initialBalances": "Initial Balances",
    "assumptions.private": "Private",
    "assumptions.aforeHis": "Afore His",
    "assumptions.aforeHer": "Afore Her",
    "assumptions.monthlyContributions": "Monthly Contributions",
    "assumptions.pprMonthly": "PPR Monthly",
    "assumptions.aforeHerMonthly": "Afore Her Monthly",
    "assumptions.aforeHerUntilYear": "Afore Her Until Year",
    "assumptions.privateTranche1": "Private - Tranche 1",
    "assumptions.privateTranche2": "Private - Tranche 2",
    "assumptions.monthlyAmount": "Monthly Amount",
    "assumptions.from": "From",
    "assumptions.until": "Until",
    "assumptions.otherContributions": "Other Contributions",
    "assumptions.satAnnualRefund": "SAT Annual Refund",
    "assumptions.aforeHisBimonthly": "Afore His Bimonthly",
    "assumptions.specialEvents": "Special Events",
    "assumptions.houseSaleYear": "House Sale - Year",
    "assumptions.houseSaleAmount": "House Sale - Amount",
    "assumptions.housePurchaseYear": "House Purchase - Year",
    "assumptions.housePurchaseAmount": "House Purchase - Amount",

    "assumptions.withdrawals": "Withdrawals",
    "assumptions.withdrawalPhase2": "Monthly VPN Withdrawal - Phase 2",
    "assumptions.withdrawalPhase3": "Monthly VPN Withdrawal - Phase 3",

    "assumptions.simulate": "Simulate",

    // Results Panel
    "results.summary": "Summary",
    "results.chart": "Chart",
    "results.withdrawalsTab": "Withdrawals",
    "results.detail": "Detail",
    "results.private": "Private",
    "results.ppr": "PPR",
    "results.aforeHis": "Afore His",
    "results.aforeHer": "Afore Her",

    "results.endPhase1": "End Phase 1 - Accumulation",
    "results.endPhase2": "End Phase 2 - Transition",
    "results.endPhase3": "End Phase 3 - Horizon",
    "results.noData": "No data",

    "results.balancesByYear": "Balances by Year (Summary)",
    "results.year": "Year",
    "results.phase": "Phase",
    "results.total": "Total",
    "results.annualWithdrawal": "Annual Withdrawal",

    "results.wealthOverTime": "Total Wealth Over Time",
    "results.withdrawalsOnChart": "Withdrawals (Annual)",

    "results.vpnVsNominal": "Withdrawals: VPN vs Nominal",
    "results.vpnExplanation": "VPN = today's pesos (base year). Nominal = pesos of the corresponding year, adjusted for inflation.",
    "results.keyPoint": "Key Point",
    "results.withdrawalVPN": "Withdrawal VPN /mo",
    "results.withdrawalNominal": "Withdrawal Nominal /mo",
    "results.inflationFactor": "Inflation Factor",

    "results.fullDetail": "Full Annual Detail",

    // Key point labels
    "kp.startPhase2": "Start Phase 2",
    "kp.endPhase2": "End Phase 2",
    "kp.startPhase3": "Start Phase 3",
    "kp.endPhase3": "End Phase 3",

    // Empty state
    "empty.configure": "Configure your assumptions and press",
    "empty.simulate": "Simulate",
    "empty.toSee": "to see your retirement plan projection",
  },
  es: {
    "header.title": "Simulador de Retiro",
    "header.subtitle": "Estrategia Patrimonial - Otro Pais / Mexico",

    "assumptions.general": "Supuestos Generales",
    "assumptions.baseYear": "Anio base",
    "assumptions.endYear": "Anio fin",
    "assumptions.phase1": "Fase 1 - Acumulacion",
    "assumptions.phase2": "Fase 2 - Transicion",
    "assumptions.phase3": "Fase 3 - Retiros Avanzados",
    "assumptions.start": "Inicio",
    "assumptions.end": "Fin",

    "assumptions.rates": "Tasas y Rendimientos",
    "assumptions.inflationMx": "Inflacion Mexico",
    "assumptions.inflationOther": "Inflacion Otro Pais",
    "assumptions.returnPrivada": "Rendimiento Privada",
    "assumptions.returnPPR": "Rendimiento PPR",
    "assumptions.returnAforeEl": "Rendimiento Afore El",
    "assumptions.returnAforeElla": "Rendimiento Afore Ella",

    "assumptions.contributions": "Aportaciones y Eventos",
    "assumptions.initialBalances": "Saldos iniciales",
    "assumptions.private": "Privada",
    "assumptions.aforeHis": "Afore El",
    "assumptions.aforeHer": "Afore Ella",
    "assumptions.monthlyContributions": "Aportaciones mensuales",
    "assumptions.pprMonthly": "PPR mensual",
    "assumptions.aforeHerMonthly": "Afore Ella mensual",
    "assumptions.aforeHerUntilYear": "Afore Ella hasta anio",
    "assumptions.privateTranche1": "Privada - Tramo 1",
    "assumptions.privateTranche2": "Privada - Tramo 2",
    "assumptions.monthlyAmount": "Monto mensual",
    "assumptions.from": "Desde",
    "assumptions.until": "Hasta",
    "assumptions.otherContributions": "Otros aportes",
    "assumptions.satAnnualRefund": "Devolucion SAT anual",
    "assumptions.aforeHisBimonthly": "Afore El bimestral",
    "assumptions.specialEvents": "Eventos especiales",
    "assumptions.houseSaleYear": "Venta casa - Anio",
    "assumptions.houseSaleAmount": "Venta casa - Monto",
    "assumptions.housePurchaseYear": "Compra casa - Anio",
    "assumptions.housePurchaseAmount": "Compra casa - Monto",

    "assumptions.withdrawals": "Retiros",
    "assumptions.withdrawalPhase2": "Retiro mensual VPN - Fase 2",
    "assumptions.withdrawalPhase3": "Retiro mensual VPN - Fase 3",

    "assumptions.simulate": "Simular",

    "results.summary": "Resumen",
    "results.chart": "Grafica",
    "results.withdrawalsTab": "Retiros",
    "results.detail": "Detalle",
    "results.private": "Privada",
    "results.ppr": "PPR",
    "results.aforeHis": "Afore El",
    "results.aforeHer": "Afore Ella",

    "results.endPhase1": "Final Fase 1 - Acumulacion",
    "results.endPhase2": "Final Fase 2 - Transicion",
    "results.endPhase3": "Final Fase 3 - Horizonte",
    "results.noData": "Sin datos",

    "results.balancesByYear": "Saldos por Anio (resumen)",
    "results.year": "Anio",
    "results.phase": "Fase",
    "results.total": "Total",
    "results.annualWithdrawal": "Retiro Anual",

    "results.wealthOverTime": "Patrimonio Total en el Tiempo",
    "results.withdrawalsOnChart": "Retiros (Anual)",

    "results.vpnVsNominal": "Retiros: VPN vs Nominal",
    "results.vpnExplanation": "VPN = pesos de hoy (anio base). Nominal = pesos del anio correspondiente, ajustado por inflacion.",
    "results.keyPoint": "Punto Clave",
    "results.withdrawalVPN": "Retiro VPN /mes",
    "results.withdrawalNominal": "Retiro Nominal /mes",
    "results.inflationFactor": "Factor Inflacion",

    "results.fullDetail": "Detalle Anual Completo",

    "kp.startPhase2": "Inicio Fase 2",
    "kp.endPhase2": "Fin Fase 2",
    "kp.startPhase3": "Inicio Fase 3",
    "kp.endPhase3": "Fin Fase 3",

    "empty.configure": "Configura tus supuestos y presiona",
    "empty.simulate": "Simular",
    "empty.toSee": "para ver la proyeccion de tu plan de retiro",
  },
} as const

type TranslationKey = keyof typeof translations.en

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en")

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[locale][key] ?? key
    },
    [locale]
  )

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error("useI18n must be used within I18nProvider")
  return context
}
