"use client"

import { useState, useCallback, useEffect, Suspense } from "react"
import { useTheme } from "next-themes"
import { useSearchParams } from "next/navigation"
import { AssumptionsPanel } from "@/components/simulator/assumptions-panel"
import { ResultsPanel } from "@/components/simulator/results-panel"
import { AITips } from "@/components/simulator/ai-tips"
import { PortfolioTips, RetirementExplainer, PPRFundGuide } from "@/components/simulator/educational-sections"
import {
  getDefaultConfig,
  simulatePlan,
  type SimConfig,
  type SimulationResult,
} from "@/lib/simulation"
import { useI18n, type Locale } from "@/lib/i18n"
import { aggregatePPRs, createDefaultPPR, type PPRConfig } from "@/lib/ppr-helpers"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor, Globe, Calculator, BarChart3 } from "lucide-react"
import Link from "next/link"
import { SaveScenarioButton } from "@/components/scenarios/save-scenario-button"
import { useScenarios } from "@/hooks/use-scenarios"
import { SCENARIOS_STORAGE_KEY } from "@/lib/scenario-types"
import type { Scenario } from "@/lib/scenario-types"

// ─── Header utils ─────────────────────────────────────────────────────────────

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { t } = useI18n()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const cycle = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full" aria-label="Toggle theme" disabled>
        <Monitor className="size-5" />
      </Button>
    )
  }

  const ariaKey = theme === "light" ? "theme.light" : theme === "dark" ? "theme.dark" : "theme.system"
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycle}
      className="rounded-full"
      aria-label={t(ariaKey as Parameters<typeof t>[0])}
    >
      {theme === "light" && <Sun className="size-5" />}
      {theme === "dark" && <Moon className="size-5" />}
      {(theme === "system" || !theme) && <Monitor className="size-5" />}
    </Button>
  )
}


function LanguageToggle() {
  const { locale, setLocale } = useI18n()
  const toggle = () => {
    const next: Locale = locale === "en" ? "es" : "en"
    setLocale(next)
  }
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="gap-1.5 uppercase font-bold text-xs"
      aria-label="Toggle language"
    >
      <Globe className="size-4" />
      {locale}
    </Button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function SimulatorPageInner() {
  const [config, setConfig] = useState<SimConfig>(getDefaultConfig)
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [aiTrigger, setAiTrigger] = useState(0)
  const { t, locale } = useI18n()
  const searchParams = useSearchParams()
  const { scenarios } = useScenarios()

  // Scenario editing state
  const [editingScenarioId, setEditingScenarioId] = useState<string | null>(null)
  const [editingScenarioName, setEditingScenarioName] = useState<string | null>(null)

  // Load scenario from URL param (?scenario=<id>)
  useEffect(() => {
    const scenarioId = searchParams?.get('scenario')
    if (!scenarioId) return
    try {
      const raw = localStorage.getItem(SCENARIOS_STORAGE_KEY)
      if (!raw) return
      const stored: Scenario[] = JSON.parse(raw)
      const found = stored.find((s) => s.id === scenarioId)
      if (!found) return
      setConfig(found.config)
      setResult(found.result)
      setEditingScenarioId(found.id)
      setEditingScenarioName(found.name)
    } catch {
      // ignore parse errors
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // F1 – Multiple PPR accounts
  const [pprList, setPPRList] = useState<PPRConfig[]>([createDefaultPPR(0)])

  // F2 – Loading spinner
  const [isSimulating, setIsSimulating] = useState(false)

  // F4 – Validation errors
  const [formErrors, setFormErrors] = useState<
    Partial<Record<"currentAge" | "retirementAge" | "planningHorizonAge", string>>
  >({})

  // ─── Real-time validation ─────────────────────────────────────────────────
  
  const validateAgesRealtime = useCallback(() => {
    const errors: typeof formErrors = {}
    
    // Invalid age values (edge cases)
    if (config.currentAge < 1 || config.currentAge > 120) {
      errors.currentAge = t("error.invalidAge")
    }
    if (config.retirementAge < 1 || config.retirementAge > 120) {
      errors.retirementAge = t("error.invalidAge")
    }
    if (config.planningHorizonAge < 1 || config.planningHorizonAge > 110) {
      errors.planningHorizonAge = t("error.invalidAge")
    }
    
    // Relationship errors (only if values are valid)
    if (config.currentAge >= 1 && config.retirementAge >= 1 && config.currentAge >= config.retirementAge) {
      errors.currentAge = t("error.currentAgeMustBeLess")
      errors.retirementAge = t("error.retirementAgeMustBeLess")
    }
    if (config.retirementAge >= 1 && config.planningHorizonAge >= 1 && config.retirementAge >= config.planningHorizonAge) {
      errors.retirementAge = t("error.retirementAgeMustBeLess")
      errors.planningHorizonAge = t("error.planningHorizonMustBeLarger")
    }
    if (config.planningHorizonAge > 110) {
      errors.planningHorizonAge = t("error.planningHorizonTooLarge")
    }
    
    setFormErrors(errors)
    return errors
  }, [config, t])

  // Run validation on config changes
  useEffect(() => {
    validateAgesRealtime()
  }, [config.currentAge, config.retirementAge, config.planningHorizonAge, validateAgesRealtime])

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleChange = useCallback((updates: Partial<SimConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }, [])

  /** F4 – Age validation (for simulate button) */
  const validateAges = (): boolean => {
    const errors: typeof formErrors = {}
    if (config.currentAge >= config.retirementAge) {
      errors.currentAge = t("error.currentAgeMustBeLess")
      errors.retirementAge = t("error.retirementAgeMustBeLess")
    }
    if (config.retirementAge >= config.planningHorizonAge) {
      errors.retirementAge = t("error.retirementAgeMustBeLess")
      errors.planningHorizonAge = t("error.planningHorizonMustBeLarger")
    }
    if (config.planningHorizonAge > 110) {
      errors.planningHorizonAge = t("error.planningHorizonTooLarge")
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return false
    }
    setFormErrors({})
    return true
  }

  const handleSimulate = useCallback(async () => {
    if (!validateAges()) return

    setIsSimulating(true)
    try {
      // F1 – Aggregate all PPR accounts into the single config.ppr field
      const aggregated = aggregatePPRs(pprList)
      const simConfig: SimConfig = { ...config, ppr: aggregated }

      // Yield to the browser paint so the spinner renders
      await new Promise<void>((resolve) => setTimeout(resolve, 800))

      const res = simulatePlan(simConfig)
      setResult(res)
      // Also keep config in sync so child components show correct data
      setConfig(simConfig)

      // Trigger AI fetch
      setAiTrigger((prev) => prev + 1)
    } finally {
      setIsSimulating(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, pprList])

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-[1440px] px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <Calculator className="size-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-black tracking-tight uppercase">
                {t("header.title")}
              </h1>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                {t("header.subtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {scenarios.length > 0 && (
              <Link href="/comparar">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <BarChart3 className="size-4" />
                  <span className="hidden sm:inline">
                    {locale === 'es' ? 'Comparar' : 'Compare'}
                  </span>
                  <span className="text-xs font-bold">({scenarios.length})</span>
                </Button>
              </Link>
            )}
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1440px] px-4 py-8 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-start">
          {/* Left column - Assumptions */}
          <aside className="lg:sticky lg:top-24">
            <ScrollArea className="lg:h-[calc(100vh-160px)] pr-4 -mr-4">
              <AssumptionsPanel
                config={config}
                onChange={handleChange}
                onSimulate={handleSimulate}
                pprList={pprList}
                onPPRListChange={setPPRList}
                isSimulating={isSimulating}
                formErrors={formErrors}
                result={result}
              />
            </ScrollArea>
          </aside>

          {/* Right column - Results & Sections */}
          <div className="flex flex-col gap-12">
            {/* Results Section */}
            <section id="results">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                {t("section.results")}
              </h2>
              {result ? (
                <div className="flex flex-col gap-8">
                  {editingScenarioId && editingScenarioName && (
                    <div className="flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm text-amber-400">
                      <span>✏️</span>
                      <span>
                        {locale === 'es'
                          ? `Editando: "${editingScenarioName}" — Simula de nuevo para actualizar`
                          : `Editing: "${editingScenarioName}" — Re-simulate to update`}
                      </span>
                    </div>
                  )}
                  <ResultsPanel 
                    config={config} 
                    result={result} 
                    pprList={pprList}
                    actionButton={
                      <SaveScenarioButton
                        config={config}
                        result={result}
                        editingScenarioId={editingScenarioId}
                      />
                    }
                  />
                  <RetirementExplainer />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/30 p-16 text-center">
                  <div className="bg-muted size-16 rounded-full flex items-center justify-center mb-4">
                    <Calculator className="size-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{t("empty.title")}</h3>
                  <p className="text-muted-foreground mt-2 max-w-xs">{t("empty.subtitle")}</p>
                </div>
              )}
            </section>

            {/* AI Recommendations */}
            {result && (
              <section id="ai-tips">
                <AITips config={config} result={result} triggerFetch={aiTrigger} />
              </section>
            )}

            {/* Portfolio Tips */}
            <section id="portfolio-tips">
              <PortfolioTips />
            </section>

            {/* PPR Fund Guide */}
            <section id="ppr-fund-guide">
              <PPRFundGuide />
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 py-8 mt-12">
        <div className="mx-auto max-w-[1440px] px-4 flex flex-col items-center gap-2 text-center">
          <p className="text-sm text-muted-foreground">
            {t("footer.builtBy")}{" "}
            <a
              href="https://pxblx7.github.io/pablo-arroyo-product-manager/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-primary hover:underline"
            >
              Pablo Arroyo — Product Manager
            </a>
          </p>
          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">
            © {new Date().getFullYear()} RETIRO MX. {t("footer.onlyEducational")}
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function SimulatorPage() {
  return (
    <Suspense>
      <SimulatorPageInner />
    </Suspense>
  )
}
