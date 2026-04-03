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
    "section.config": "⚙️ General Settings",
    "section.savings": "💰 My Savings",
    "section.results": "📊 Results",
    "section.ai": "🤖 AI Recommendations",
    "section.portfolio": "💡 Portfolio Tips",

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
    "field.aforeHelper": "Calculated as ~9.5% of your salary (2025 reforma pensiones rate). You can edit it manually.",
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
    "results.totalPackageTooltip": "This simulator uses a Retiro Programado model: your savings continue earning compound interest throughout retirement and are designed to be fully paid out by your planning horizon age. If you live beyond that age and chose Retiro Programado with your AFORE, funds could run out.",
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

    // Validation errors (F4)
    "error.retirementBeforeCurrent": "Retirement age must be greater than current age.",
    "error.horizonBeforeRetirement": "Planning horizon must be greater than retirement age.",
    "error.minRetirement": "Retirement age must be at least 50.",

    // PPR multi-account labels (F1)
    "field.pprLabel": "Plan name (optional)",
    "bucket.addPPR": "+ Add PPR account",
    "bucket.removePPR": "Remove",

    // Results – PPR breakdown (F1)
    "results.pprBreakdown": "PPR Accounts Breakdown",

    // Validation – age checks (F4) – additional keys
    "error.currentAgeMustBeLess": "Current age must be less than retirement age.",
    "error.retirementAgeMustBeLess": "Retirement age must be less than planning horizon.",
    "error.planningHorizonMustBeLarger": "Planning horizon must be larger than retirement age.",
    "error.planningHorizonTooLarge": "Planning horizon cannot exceed 110 years.",
    "error.invalidAge": "Please enter a valid age (1-120).",

    // Goal Tracker (F3)
    "goal.open": "🎯 Pension Goal",
    "goal.title": "🎯 Pension Goal",
    "goal.targetLabel": "Target monthly pension (today's pesos)",
    "goal.compute": "Calculate contributions",
    "goal.aforeNPV": "AFORE projected NPV",
    "goal.pprRequired": "Additional monthly PPR (total)",
    "goal.privateRequired": "Additional monthly Private Savings",
    "goal.apply": "Apply to my simulator",
    "goal.alreadyCovered": "✅ Your AFORE already covers this target!",
    "goal.close": "Close",
    "goal.targetTooLow": "Your current projection already exceeds this target. Consider setting a higher goal.",

    // Feature 1 — Annual contribution increment
    "field.annualIncrementToggle": "Increase contribution annually",
    "field.annualIncrement": "Annual increase",
    "field.annualIncrementTooltip": "Your contribution grows each year like a salary raise. Formula: Contribution₀ × (1 + %)^year. Applies only until retirement age.",

    // Feature 2 — PPR tax article selector
    "ppr.taxArticle": "Tax Article",
    "ppr.art151Label": "Art. 151 (Deductible)",
    "ppr.art93Label": "Art. 93 (Exempt at 65+)",
    "ppr.art151Desc": "Your contributions are tax-deductible now (deducible). At withdrawal, pension income is subject to ISR.",
    "ppr.art93Desc": "No deduction now, but retirement income at 65+ is fully exempt from ISR.",
    "ppr.art93SatTooltip": "No SAT refund — Art. 93 gives you tax exemption at retirement instead.",
    "results.art151Warning": "⚠️ Subject to ISR at withdrawal",

    // Feature 3 — Fund comparison tips
    "tips.fundTitle": "How to choose your PPR fund?",
    "tips.fundBullet1": "Net return ≥ 7% over 10 years",
    "tips.fundBullet2": "Annual fees ≤ 1.5%",
    "tips.fundBullet3": "Risk profile matching your time horizon",
    "tips.fundRankia": "Editorial comparison of the best PPRs",
    "tips.fundFintual": "Transparent historical returns",
    "tips.fundDisclaimer": "Past performance does not guarantee future results.",

    // Feature 5 — System theme
    "theme.light": "Switch to dark mode",
    "theme.dark": "Switch to system theme",
    "theme.system": "Switch to light mode",
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
    "field.aforeHelper": "Calculado como ~9.5% de tu salario (tasa reforma pensiones 2025). Puedes editarlo manualmente.",
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
    "results.totalPackageTooltip": "Este simulador usa un modelo de Retiro Programado: tu saldo sigue generando interés compuesto durante el retiro y está diseñado para agotarse exactamente en tu horizonte de planeación. Si vives más allá de esa edad con Retiro Programado real, los fondos podrían terminarse.",
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

    // Validation errors (F4)
    "error.retirementBeforeCurrent": "La edad de retiro debe ser mayor que la edad actual.",
    "error.horizonBeforeRetirement": "El horizonte de planeación debe ser mayor que la edad de retiro.",
    "error.minRetirement": "La edad de retiro debe ser de al menos 50 años.",

    // PPR multi-account labels (F1)
    "field.pprLabel": "Nombre del plan (opcional)",
    "bucket.addPPR": "+ Agregar otra cuenta PPR",
    "bucket.removePPR": "Eliminar",

    // Results – PPR breakdown (F1)
    "results.pprBreakdown": "Desglose de cuentas PPR",

    // Validation – age checks (F4) – additional keys
    "error.currentAgeMustBeLess": "La edad actual debe ser menor que la edad de retiro.",
    "error.retirementAgeMustBeLess": "La edad de retiro debe ser menor que el horizonte de planeación.",
    "error.planningHorizonMustBeLarger": "El horizonte de planeación debe ser mayor que la edad de retiro.",
    "error.planningHorizonTooLarge": "El horizonte de planeación no puede superar 110 años.",
    "error.invalidAge": "Por favor ingresa una edad válida (1-120).",

    // Goal Tracker (F3)
    "goal.open": "🎯 Meta de Pensión",
    "goal.title": "🎯 Meta de Pensión",
    "goal.targetLabel": "Pensión mensual objetivo (pesos de hoy)",
    "goal.compute": "Calcular aportaciones",
    "goal.aforeNPV": "VPN estimado del AFORE",
    "goal.pprRequired": "Aportación mensual adicional PPR (total)",
    "goal.privateRequired": "Aportación mensual adicional Ahorro Privado",
    "goal.apply": "Aplicar a mi simulador",
    "goal.alreadyCovered": "✅ ¡Tu AFORE solo ya cubre esta meta!",
    "goal.close": "Cerrar",
    "goal.targetTooLow": "Tu proyección actual ya supera esta meta. Considera establecer una meta más alta.",

    // Feature 1 — Annual contribution increment
    "field.annualIncrementToggle": "Incrementar aportación cada año",
    "field.annualIncrement": "Incremento anual",
    "field.annualIncrementTooltip": "Tu aportación crece cada año como un aumento de sueldo. Fórmula: Aportación₀ × (1 + %)^año. Solo aplica hasta tu edad de retiro.",

    // Feature 2 — PPR tax article selector
    "ppr.taxArticle": "Artículo Fiscal",
    "ppr.art151Label": "Art. 151 (Deducible)",
    "ppr.art93Label": "Art. 93 (Exento a los 65+)",
    "ppr.art151Desc": "Tus aportaciones son deducibles de ISR ahora. Al retiro, la pensión está sujeta a ISR.",
    "ppr.art93Desc": "Sin deducción ahora, pero tus retiros a los 65+ están exentos de ISR.",
    "ppr.art93SatTooltip": "Sin devolución del SAT — el Art. 93 te da exención de ISR en el retiro en cambio.",
    "results.art151Warning": "⚠️ Sujeto a ISR en el retiro",

    // Feature 3 — Fund comparison tips
    "tips.fundTitle": "¿Cómo elegir tu fondo PPR?",
    "tips.fundBullet1": "Rendimiento neto ≥ 7% a 10 años",
    "tips.fundBullet2": "Comisiones ≤ 1.5% anual",
    "tips.fundBullet3": "Perfil de riesgo acorde a tu horizonte de tiempo",
    "tips.fundRankia": "Comparativa editorial de los mejores PPR",
    "tips.fundFintual": "Rendimiento histórico transparente",
    "tips.fundDisclaimer": "Rendimientos históricos no garantizan resultados futuros.",

    // Feature 5 — System theme
    "theme.light": "Cambiar a modo oscuro",
    "theme.dark": "Usar tema del sistema",
    "theme.system": "Cambiar a modo claro",
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
