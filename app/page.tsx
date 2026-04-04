"use client"

import { useState, useCallback, useEffect, useRef, Suspense } from "react"
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
import { AuthStatus } from "@/components/auth/auth-status"
import { aggregatePPRs, createDefaultPPR, type PPRConfig } from "@/lib/ppr-helpers"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor, Globe, Calculator, BarChart3 } from "lucide-react"
import Link from "next/link"
import { SaveScenarioButton } from "@/components/scenarios/save-scenario-button"
import { useScenarios } from "@/hooks/use-scenarios"

import { MainHeader, MainFooter } from "@/components/layout/main-header"

// No toggles here anymore
// ─── Page ─────────────────────────────────────────────────────────────────────

function SimulatorPageInner() {
  const [config, setConfig] = useState<SimConfig>(getDefaultConfig)
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [aiTrigger, setAiTrigger] = useState(0)
  const { t, locale } = useI18n()
  const searchParams = useSearchParams()
  const { scenarios, isLoading } = useScenarios()

  // Scenario editing state
  const [editingScenarioId, setEditingScenarioId] = useState<string | null>(null)
  const [editingScenarioName, setEditingScenarioName] = useState<string | null>(null)

  // Load scenario from URL param (?scenario=<id>)
  // Uses the hook's scenarios array so it works for BOTH anonymous users
  // (localStorage) and logged-in users (Supabase). The old code read
  // localStorage directly, which is empty after cloud migration.
  const scenarioFromUrlLoaded = useRef(false)
  useEffect(() => {
    const scenarioId = searchParams?.get('scenario')
    if (!scenarioId || isLoading || scenarioFromUrlLoaded.current) return

    const found = scenarios.find((s) => s.id === scenarioId)
    if (!found) return

    scenarioFromUrlLoaded.current = true
    setConfig(found.config)
    setResult(found.result)
    setEditingScenarioId(found.id)
    setEditingScenarioName(found.name)
  }, [searchParams, scenarios, isLoading])

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
      <MainHeader />

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
      <MainFooter />
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
