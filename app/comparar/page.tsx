'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { ArrowLeft, BarChart3, PlusCircle, Sun, Moon, Monitor, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useScenarios } from '@/hooks/use-scenarios'
import { MAX_SCENARIOS } from '@/lib/scenario-types'
import { ScenarioCard } from '@/components/scenarios/scenario-card'
import { WinnerBanner } from '@/components/scenarios/winner-banner'
import { ScenarioOverlayChart } from '@/components/scenarios/scenario-overlay-chart'
import { useI18n } from '@/lib/i18n'
import { AuthStatus } from '@/components/auth/auth-status'
import { ThemeToggle, LanguageToggle, MainFooter } from '@/components/layout/main-header'

// Toggles imported from layout

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CompararPage() {
  const { scenarios, deleteScenario, updateScenario, isFull, isLoading } = useScenarios()
  const { locale } = useI18n()

  // Determine winner (scenario with highest total NPV monthly)
  const withResults = scenarios.filter((s) => s.result !== null)
  const winnerId =
    withResults.length >= 2
      ? withResults.reduce((best, s) =>
          s.result!.total.vpnMonthly > best.result!.total.vpnMonthly ? s : best
        ).id
      : null

  const handleRename = (id: string, newName: string) => {
    updateScenario(id, { name: newName })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <ArrowLeft className="size-4" />
                <span className="hidden sm:inline">
                  {locale === 'es' ? 'Volver al simulador' : 'Back to simulator'}
                </span>
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              <h1 className="text-base font-bold">
                {locale === 'es' ? 'Comparar Escenarios' : 'Compare Scenarios'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="hidden sm:block w-px h-6 bg-border/60 mx-1" />
            <AuthStatus />
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 flex flex-col gap-6">

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-6 py-24 text-center opacity-70">
            <span className="animate-spin text-2xl leading-none">⟳</span>
            <p className="text-sm text-muted-foreground">{locale === 'es' ? 'Cargando escenarios...' : 'Loading scenarios...'}</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && scenarios.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
            <div className="rounded-full bg-muted/40 p-6">
              <BarChart3 className="size-12 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold">
                {locale === 'es' ? 'Aún no tienes escenarios' : 'No scenarios yet'}
              </h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                {locale === 'es'
                  ? 'Simula tu retiro y guárdalo como escenario para comparar distintos planes.'
                  : 'Simulate your retirement and save it as a scenario to compare different plans.'}
              </p>
            </div>
            <Link href="/">
              <Button className="gap-2">
                <ArrowLeft className="size-4" />
                {locale === 'es' ? 'Ir al simulador' : 'Go to simulator'}
              </Button>
            </Link>
          </div>
        )}

        {/* Scenarios view */}
        {scenarios.length > 0 && (
          <>
            {/* Winner banner */}
            <WinnerBanner scenarios={scenarios} />

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {scenarios.map((scenario) => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  isWinner={scenario.id === winnerId}
                  onDelete={deleteScenario}
                  onRename={handleRename}
                />
              ))}

              {/* Add scenario slot */}
              {!isFull && (
                <Link href="/" className="group">
                  <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/50 p-6 text-center transition-colors hover:border-primary/50 hover:bg-muted/30 cursor-pointer">
                    <PlusCircle className="size-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {locale === 'es' ? 'Agregar escenario' : 'Add scenario'}
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      {locale === 'es'
                        ? `${scenarios.length} de ${MAX_SCENARIOS} escenarios`
                        : `${scenarios.length} of ${MAX_SCENARIOS} scenarios`}
                    </p>
                  </div>
                </Link>
              )}
            </div>

            {/* At max capacity notice */}
            {isFull && (
              <p className="text-center text-xs text-muted-foreground">
                {locale === 'es'
                  ? `Máximo ${MAX_SCENARIOS} escenarios. Elimina uno para agregar otro.`
                  : `Maximum ${MAX_SCENARIOS} scenarios. Delete one to add another.`}
              </p>
            )}

            <ScenarioOverlayChart scenarios={scenarios} />
          </>
        )}
      </main>

      {/* ── Footer ── */}
      <MainFooter />
    </div>
  )
}
