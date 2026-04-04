"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n"
import { ShieldCheck, Clock, Receipt, Coffee, ExternalLink } from "lucide-react"

export function PortfolioTips() {
  const { t, locale } = useI18n()

  const tips = [
    {
      title: locale === "es" ? "Diversificación" : "Diversification",
      body: locale === "es"
        ? "No pongas todos tus huevos en una sola canasta. Combina AFORE, PPR y ahorro privado."
        : "Don't put all your eggs in one basket. Combine AFORE, PPR, and private savings.",
      icon: <ShieldCheck className="size-5 text-blue-500" />,
    },
    {
      title: locale === "es" ? "Interés Compuesto" : "Compound Interest",
      body: locale === "es"
        ? "El tiempo es tu mejor aliado. Entre más joven empieces, más crecerá tu dinero exponencialmente."
        : "Time is your best ally. The younger you start, the more your money will grow exponentially.",
      icon: <Clock className="size-5 text-green-500" />,
    },
    {
      title: locale === "es" ? "Beneficios Fiscales" : "Tax Benefits",
      body: locale === "es"
        ? "Aprovecha las deducciones del PPR. El SAT puede devolverte dinero cada año por ahorrar para tu retiro."
        : "Take advantage of PPR deductions. The SAT can refund you money every year for saving for retirement.",
      icon: <Receipt className="size-5 text-purple-500" />,
    },
    {
      title: locale === "es" ? "Gasto Hormiga" : "Latte Factor",
      body: locale === "es"
        ? "Pequeños ahorros diarios en cafés o suscripciones pueden convertirse en millones a largo plazo."
        : "Small daily savings on coffee or subscriptions can turn into millions in the long run.",
      icon: <Coffee className="size-5 text-amber-500" />,
    },
  ]


return (
  <div className="flex flex-col gap-4">
    <h2 className="text-lg font-bold flex items-center gap-2">
      {t("section.portfolio")}
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tips.map((tip, index) => (
        <Card key={index} className="border-none shadow-sm bg-card/50">
          <CardHeader className="pb-2 flex flex-row items-center gap-3">
            <div className="bg-background p-2 rounded-lg shadow-sm">
              {tip.icon}
            </div>
            <CardTitle className="text-sm font-bold">{tip.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {tip.body}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)
}

export function PPRFundGuide() {
  const { t, locale } = useI18n()

  const bullets = [
    locale === "es" ? "Rendimiento neto ≥ 7% a 10 años" : "Net return ≥ 7% over 10 years",
    locale === "es" ? "Comisiones ≤ 1.5% anual" : "Fees ≤ 1.5% per year",
    locale === "es" ? "Perfil de riesgo acorde a tu horizonte de tiempo" : "Risk profile aligned with your time horizon",
  ]

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold flex items-center gap-2">
        💡 {t("tips.fundTitle")}
      </h2>
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 flex flex-col gap-4">
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary font-bold mt-0.5">•</span>
              {b}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-4 border-t border-border/40 pt-4">
          <a
            href="https://www.rankia.mx/planes-de-pensiones/mejores"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <ExternalLink className="size-3.5" /> Rankia MX — {t("tips.fundRankia")}
          </a>
          <a
            href="https://fintual.mx"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <ExternalLink className="size-3.5" /> Fintual — {t("tips.fundFintual")}
          </a>
        </div>
        <p className="text-[11px] text-muted-foreground/60 italic">{t("tips.fundDisclaimer")}</p>
      </div>
    </div>
  )
}

export function RetirementExplainer() {
  const { locale } = useI18n()

  const cards = [
    {
      title: locale === "es" ? "Jubilación por Vejez (65 años)" : "Old-age Retirement (65 years)",
      body: locale === "es"
        ? "Con 65 años y las semanas cotizadas requeridas, obtienes el 100% de tu pensión calculada."
        : "At age 65 with required contribution weeks, you receive 100% of your calculated pension.",
      color: "border-green-500/20 bg-green-500/5",
    },
    {
      title: locale === "es" ? "Jubilación Anticipada (60 años)" : "Early Retirement (60 years)",
      body: locale === "es"
        ? "Si te retiras a los 60 años, tu pensión se reduce aproximadamente a un 75% de la pensión completa."
        : "If you retire at age 60, your pension is reduced to approximately 75% of the full pension.",
      color: "border-amber-500/20 bg-amber-500/5",
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card, index) => (
          <Card key={index} className={`border ${card.color}`}>
            <CardContent className="p-4">
              <h3 className="text-sm font-bold mb-2">{card.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {card.body}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground italic text-center">
        {locale === "es"
          ? "Este simulador simplifica las reglas del IMSS para fines educativos."
          : "This simulator simplifies IMSS rules for educational purposes."}
      </p>
    </div>
  )
}
