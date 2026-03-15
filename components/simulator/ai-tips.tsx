"use client"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Sparkles } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import type { SimConfig, SimulationResult } from "@/lib/simulation"
import { toast } from "sonner"

interface Tip {
  tip_es: string
  tip_en: string
  icon: string
  impact: string
}

interface AITipsProps {
  config: SimConfig
  result: SimulationResult
  triggerFetch?: number // Used to trigger fetch from parent
}

export function AITips({ config, result, triggerFetch }: AITipsProps) {
  const [tips, setTips] = useState<Tip[]>([])
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const { t, locale } = useI18n()

  const fetchTips = useCallback(async () => {
    if (cooldown > 0) {
      toast.error(t("ai.waitMessage"))
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentAge: config.currentAge,
          retirementAge: config.retirementAge,
          planningHorizonAge: config.planningHorizonAge,
          inflation: config.inflation * 100,
          aforeBalance: config.afore.initialBalance,
          aforeMonthly: config.afore.monthlyContribution,
          aforeMonthlyNPV: result.afore.vpnMonthly,
          pprBalance: config.ppr.initialBalance,
          pprMonthly: config.ppr.monthlyContribution,
          pprMonthlyNPV: result.ppr.vpnMonthly,
          privateBalance: config.private.initialBalance,
          privateMonthly: config.private.monthlyContribution,
          privateMonthlyNPV: result.private.vpnMonthly,
          totalMonthlyFuture: result.total.futureMonthly,
          totalMonthlyNPV: result.total.vpnMonthly,
        }),
      })
      const data = await response.json()
      setTips(data)
      setCooldown(30)
    } catch (error) {
      console.error("Error fetching AI tips:", error)
    } finally {
      setLoading(false)
    }
  }, [config, result, cooldown, t])

  // Handle trigger from parent
  useEffect(() => {
    if (triggerFetch && triggerFetch > 0) {
      fetchTips()
    }
  }, [triggerFetch]) // Only run when triggerFetch changes

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const getImpactColor = (impact: string) => {
    const imp = impact.toLowerCase()
    if (imp.includes("alto") || imp.includes("high")) {
      return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
    }
    if (imp.includes("medio") || imp.includes("medium")) {
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
    }
    return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"
  }

  if (tips.length === 0 && !loading) return null

  return (
    <div className="flex flex-col gap-4 ai-recommendations-section">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          {t("section.ai")}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchTips}
          disabled={loading || cooldown > 0}
          className="gap-2 text-xs"
        >
          <RefreshCw className={`size-3 ${loading ? "animate-spin" : ""}`} />
          {cooldown > 0 
            ? t("ai.cooldown", { seconds: cooldown }) 
            : t("ai.regenerate")}
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-card/50 rounded-2xl border border-dashed border-border">
          <RefreshCw className="size-8 text-primary animate-spin mb-4" />
          <p className="text-sm font-medium text-muted-foreground">{t("ai.loading")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tips.map((tip, index) => (
            <Card key={index} className="overflow-hidden border-none shadow-md bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-5 flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{tip.icon}</span>
                  <Badge variant="outline" className={`text-[10px] uppercase font-bold ${getImpactColor(tip.impact)}`}>
                    Impacto {tip.impact}
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed text-foreground/90 flex-grow">
                  {locale === "es" ? tip.tip_es : tip.tip_en}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
