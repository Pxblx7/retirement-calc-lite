"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type Locale = "en" | "es"

const currentYear = new Date().getFullYear()

const translations = {
  en: {
    // Header
    "header.title": "RETIRO MX",
    "header.subtitle": "SINGLE-PERSON RETIREMENT SIMULATOR FOR MEXICO",

    // Sections
    "section.config": "General Settings",
    "section.savings": "My Savings",
    "section.results": "Results",
    "section.ai": "AI Recommendations",
    "section.portfolio": "Portfolio Tips",

    // Assumptions Panel
    "assumptions.general": "General Assumptions",
    "assumptions.currentAge": "Current age",
    "assumptions.retirementAge": "Retirement age",
    "assumptions.planningHorizon": "Planning horizon (age)",
    "assumptions.planningHorizonTooltip": "Define until what age you want your savings to last. Common choices are 85 or 90 years.",
    "assumptions.inflation": "Expected annual inflation",
    "assumptions.simulate": "🚀 Simulate my retirement",

    // Buckets
    "bucket.afore": "AFORE (IMSS Pension)",
    "bucket.aforeTooltip": "This is your mandatory pension account (AFORE). In this simulator we convert your projected balance into a monthly pension from your retirement age until your planning horizon.",
    "bucket.ppr": "PPR (Personal Retirement Plan)",
    "bucket.pprTooltip": "A tax-deductible personal retirement plan.",
    "bucket.private": "Private Savings (Cetes, Funds, Stocks)",
    "bucket.privateTooltip": "This is your personal investment outside the formal pension system. It can be Cetes, mutual funds, ETFs, or stocks.",

    // Fields
    "field.isIndependent": "I am an independent worker (RESICO / Freelance)",
    "field.grossSalary": "Gross Monthly Salary",
    "field.aforeHelper": "Calculated as 6.5% of your salary (IMSS standard). You can edit it manually.",
    "field.currentBalance": "Current Balance",
    "field.monthlyContribution": "Monthly Contribution",
    "field.expectedReturn": "Expected annual return",
    "field.satRefund": "Estimated annual SAT refund",
    "field.satRefundHelper": "If your PPR is tax-deductible, the SAT can refund up to ~30% of your contributions in your annual tax return.",

    // Results Panel
    "results.summary": "Summary",
    "results.chart": "Chart",
    "results.detail": "Detail",
    "results.monthlyFuture": "Estimated monthly income (future pesos)",
    "results.monthlyVPN": `Monthly income in ${currentYear} pesos (NPV)`,
    "results.vpnTooltip": "NPV = Net Present Value. This shows what your future monthly income would be worth in today's pesos, adjusted for inflation.",
    "results.sustainability": "Your AFORE is modeled as a lifetime pension. Your PPR and Private Savings are calculated as a constant monthly income from your retirement age until age {age}.",
    "results.totalPackage": "Total Monthly Package",
    "results.noData": "No data",
    "results.year": "Year",
    "results.total": "Total Balance",
    "results.exportPDF": "Export PDF",

    // AI Tips
    "ai.loading": "Generating personalized recommendations...",
    "ai.regenerate": "Regenerate tips",
    "ai.cooldown": "Regenerate tips (wait {seconds}s)",
    "ai.waitMessage": "Wait a few seconds before generating new recommendations.",

    // Empty state
    "empty.title": "How much will you have when you retire?",
    "empty.subtitle": "Set up your data and press \"Simulate my retirement\" to find out.",

    // Footer
    "footer.builtBy": "Designed and built by",
    "footer.onlyEducational": "For educational purposes only.",
  },
  es: {
    "header.title": "RETIRO MX",
    "header.subtitle": "SIMULADOR DE RETIRO PERSONAL PARA MÉXICO",

    "section.config": "⚙️ Configuración General",
    "section.savings": "💰 Mis Ahorros",
    "section.results": "📊 Resultados",
    "section.ai": "🤖 Recomendaciones IA",
    "section.portfolio": "💡 Tips de Portafolio",

    "assumptions.general": "Supuestos Generales",
    "assumptions.currentAge": "Edad actual",
    "assumptions.retirementAge": "Edad de retiro",
    "assumptions.planningHorizon": "Horizonte de planeación (edad)",
    "assumptions.planningHorizonTooltip": "Define hasta qué edad quieres planear que duren tus ahorros. Usualmente se usan 85 o 90 años.",
    "assumptions.inflation": "Inflación anual esperada",
    "assumptions.simulate": "🚀 Simular mi retiro",

    "bucket.afore": "AFORE (Pensión IMSS)",
    "bucket.aforeTooltip": "Es tu cuenta de pensión administrada por una AFORE. En este simulador convertimos tu saldo proyectado en una pensión mensual desde tu edad de retiro hasta tu horizonte de planeación.",
    "bucket.ppr": "PPR (Plan Personal de Retiro)",
    "bucket.pprTooltip": "Un plan personal de retiro deducible de impuestos.",
    "bucket.private": "Ahorro Privado (Cetes, Fondos, Bolsa)",
    "bucket.privateTooltip": "Es tu ahorro e inversión personal fuera del sistema formal de pensiones. Puede ser Cetes, fondos, ETFs o acciones.",

    "field.isIndependent": "Soy trabajador independiente (RESICO / Freelance)",
    "field.grossSalary": "Salario Mensual Bruto",
    "field.aforeHelper": "Calculado como el 6.5% de tu salario (estándar IMSS). Puedes editarlo manualmente.",
    "field.currentBalance": "Saldo actual",
    "field.monthlyContribution": "Aportación mensual",
    "field.expectedReturn": "Rendimiento anual esperado",
    "field.satRefund": "Devolución anual estimada del SAT",
    "field.satRefundHelper": "Si tu PPR es deducible, el SAT puede devolverte hasta ~30% de tus aportaciones en la declaración anual.",

    "results.summary": "Resumen",
    "results.chart": "Gráfica",
    "results.detail": "Detalle",
    "results.monthlyFuture": "Pensión mensual estimada (pesos futuros)",
    "results.monthlyVPN": `Pensión mensual en pesos de ${currentYear} (VPN)`,
    "results.vpnTooltip": "VPN = Valor Presente Neto. Te muestra cuánto valdría tu pensión mensual en pesos de hoy, ajustando por inflación.",
    "results.sustainability": "Tu AFORE se modela como una pensión vitalicia. Tu PPR y Ahorro Privado se calculan para entregarte una renta mensual constante desde tu edad de retiro hasta los {age} años.",
    "results.totalPackage": "Paquete Mensual Total",
    "results.noData": "Sin datos",
    "results.year": "Año",
    "results.total": "Saldo Total",
    "results.exportPDF": "Exportar PDF",

    "ai.loading": "Generando recomendaciones personalizadas...",
    "ai.regenerate": "Regenerar tips",
    "ai.cooldown": "Regenerar tips (espera {seconds}s)",
    "ai.waitMessage": "Espera unos segundos antes de generar nuevas recomendaciones.",

    "empty.title": "¿Cuánto tendrás al retirarte?",
    "empty.subtitle": "Configura tus datos y presiona \"Simular mi retiro\" para descubrirlo.",

    "footer.builtBy": "Diseñado y desarrollado por",
    "footer.onlyEducational": "Solo para fines educativos.",
  },
} as const

type TranslationKey = keyof typeof translations.en

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("es") // Default to Spanish

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>): string => {
      const translationSet = translations[locale] as Record<string, string>
      let text = translationSet[key] ?? key
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(`{${k}}`, String(v))
        })
      }
      return text
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
