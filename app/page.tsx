"use client"

import { useState, useCallback } from "react"
import { AssumptionsPanel } from "@/components/simulator/assumptions-panel"
import { ResultsPanel } from "@/components/simulator/results-panel"
import {
  getDefaultConfig,
  simulatePlan,
  type SimConfig,
  type SimulationResult,
} from "@/lib/simulation"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function SimulatorPage() {
  const [config, setConfig] = useState<SimConfig>(getDefaultConfig)
  const [result, setResult] = useState<SimulationResult | null>(null)

  const handleChange = useCallback((updates: Partial<SimConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }, [])

  const handleSimulate = useCallback(() => {
    const res = simulatePlan(config)
    setResult(res)
  }, [config])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-bold text-foreground text-balance">
              Simulador de Retiro
            </h1>
            <p className="text-sm text-muted-foreground">
              Estrategia Patrimonial Japan / Mexico
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
          {/* Left column - Assumptions */}
          <aside className="lg:sticky lg:top-6">
            <ScrollArea className="lg:h-[calc(100vh-120px)]">
              <div className="pr-4">
                <AssumptionsPanel
                  config={config}
                  onChange={handleChange}
                  onSimulate={handleSimulate}
                />
              </div>
            </ScrollArea>
          </aside>

          {/* Right column - Results */}
          <section>
            {result ? (
              <ResultsPanel result={result} />
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-card/50 p-12">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    Configura tus supuestos y presiona
                  </p>
                  <p className="text-lg font-semibold text-foreground mt-1">
                    Simular
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    para ver la proyeccion de tu plan de retiro
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
