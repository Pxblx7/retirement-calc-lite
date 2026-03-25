"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CurrencyField, YearField, PercentField } from "@/components/simulator/fintech-inputs"
import { GoalTrackerModal } from "@/components/simulator/goal-tracker-modal"
import type { SimConfig, SimulationResult } from "@/lib/simulation"
import type { PPRConfig } from "@/lib/ppr-helpers"
import { createDefaultPPR } from "@/lib/ppr-helpers"
import { useI18n } from "@/lib/i18n"
import { Info, Loader2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// ─── Props ────────────────────────────────────────────────────────────────────

interface AssumptionsPanelProps {
  config: SimConfig
  onChange: (updates: Partial<SimConfig>) => void
  onSimulate: () => void
  /** F1 – Dynamic PPR account list */
  pprList: PPRConfig[]
  onPPRListChange: (pprs: PPRConfig[]) => void
  /** F2 – Loading spinner while simulating */
  isSimulating?: boolean
  /** F4 – Per-field validation errors (keyed by field name) */
  formErrors?: Partial<Record<"currentAge" | "retirementAge" | "planningHorizonAge", string>>
  /** F8 – Current simulation result for goal validation */
  result?: SimulationResult | null
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AssumptionsPanel({
  config,
  onChange,
  onSimulate,
  pprList,
  onPPRListChange,
  isSimulating = false,
  formErrors = {},
  result,
}: AssumptionsPanelProps) {
  const { t } = useI18n()

  // F3 – Goal Tracker modal visibility
  const [goalTrackerOpen, setGoalTrackerOpen] = useState(false)

  // ─── AFORE helpers ─────────────────────────────────────────────────────────

  const handleSalaryChange = (salary: number) => {
    const aforeContribution = Math.round(salary * 0.065)
    onChange({
      afore: {
        ...config.afore,
        grossSalary: salary,
        monthlyContribution: aforeContribution,
      },
    })
  }

  const handleIndependentToggle = (checked: boolean) => {
    onChange({
      isIndependent: checked,
      afore: {
        ...config.afore,
        grossSalary: checked ? 0 : config.afore.grossSalary,
        monthlyContribution: checked ? 0 : config.afore.monthlyContribution,
      },
    })
  }

  // ─── PPR list helpers (F1) ─────────────────────────────────────────────────

  const updatePPR = (index: number, patch: Partial<PPRConfig>) => {
    const next = pprList.map((p, i) => (i === index ? { ...p, ...patch } : p))
    onPPRListChange(next)
  }

  const addPPR = () => {
    if (pprList.length >= 3) return
    onPPRListChange([...pprList, createDefaultPPR(pprList.length)])
  }

  const removePPR = (index: number) => {
    if (pprList.length <= 1) return
    onPPRListChange(pprList.filter((_, i) => i !== index))
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-4">

      {/* ── General Settings Card ─────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            {t("section.config")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {/* F4: error prop wired to validation state */}
            <YearField
              label={t("assumptions.currentAge")}
              value={config.currentAge}
              onChange={(v) => onChange({ currentAge: v })}
              error={formErrors.currentAge}
            />
            <YearField
              label={t("assumptions.retirementAge")}
              value={config.retirementAge}
              onChange={(v) => onChange({ retirementAge: v })}
              error={formErrors.retirementAge}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* Planning Horizon with tooltip + error */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                  {t("assumptions.planningHorizon")}
                </label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="size-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">{t("assumptions.planningHorizonTooltip")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <YearField
                label=""
                value={config.planningHorizonAge}
                onChange={(v) => onChange({ planningHorizonAge: v })}
                error={formErrors.planningHorizonAge}
              />
            </div>
            <PercentField
              label={t("assumptions.inflation")}
              value={config.inflation}
              onChange={(v) => onChange({ inflation: v })}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── My Savings Card ───────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">{t("section.savings")}</CardTitle>
          </div>
          <div className="flex items-center space-x-2 mt-2 bg-primary/5 p-2 rounded-md border border-primary/10">
            <Checkbox
              id="independent"
              checked={config.isIndependent}
              onCheckedChange={(checked) => handleIndependentToggle(checked as boolean)}
            />
            <Label
              htmlFor="independent"
              className="text-[10px] font-bold uppercase tracking-tight cursor-pointer text-primary"
            >
              {t("field.isIndependent")}
            </Label>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">

          {/* ── AFORE ──────────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                {t("bucket.afore")}
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">{t("bucket.aforeTooltip")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {!config.isIndependent && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      {t("field.grossSalary")}
                    </label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="size-3 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-xs">{t("field.aforeHelper")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <CurrencyField
                    label=""
                    value={config.afore.grossSalary}
                    onChange={handleSalaryChange}
                  />
                </div>
              )}
              <CurrencyField
                label={t("field.currentBalance")}
                value={config.afore.initialBalance}
                onChange={(v) => onChange({ afore: { ...config.afore, initialBalance: v } })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <CurrencyField
                label={t("field.monthlyContribution")}
                value={config.afore.monthlyContribution}
                onChange={(v) => onChange({ afore: { ...config.afore, monthlyContribution: v } })}
              />
              <PercentField
                label={t("field.expectedReturn")}
                value={config.afore.annualReturn}
                onChange={(v) => onChange({ afore: { ...config.afore, annualReturn: v } })}
              />
            </div>
          </div>

          {/* ── PPR (F1: dynamic multi-account list) ───────────────────────── */}
          <div className="flex flex-col gap-3 border-t border-border pt-4">
            {/* Section header */}
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                {t("bucket.ppr")}
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">{t("bucket.pprTooltip")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* One card per PPR account */}
            {pprList.map((ppr, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/20 p-3"
              >
                {/* Card header: plan name + remove button */}
                <div className="flex items-center gap-2">
                  <Input
                    value={ppr.label}
                    onChange={(e) => updatePPR(i, { label: e.target.value })}
                    placeholder={t("field.pprLabel")}
                    className="h-7 text-xs"
                  />
                  {pprList.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                      onClick={() => removePPR(i)}
                    >
                      {t("bucket.removePPR")}
                    </Button>
                  )}
                </div>

                {/* Balance + Contribution */}
                <div className="grid grid-cols-2 gap-3">
                  <CurrencyField
                    label={t("field.currentBalance")}
                    value={ppr.initialBalance}
                    onChange={(v) => updatePPR(i, { initialBalance: v })}
                  />
                  <CurrencyField
                    label={t("field.monthlyContribution")}
                    value={ppr.monthlyContribution}
                    onChange={(v) => updatePPR(i, { monthlyContribution: v })}
                  />
                </div>

                {/* Return + SAT Refund */}
                <div className="grid grid-cols-2 gap-3">
                  <PercentField
                    label={t("field.expectedReturn")}
                    value={ppr.annualReturn}
                    onChange={(v) => updatePPR(i, { annualReturn: v })}
                  />
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        {t("field.satRefund")}
                      </label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="size-3 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-xs">{t("field.satRefundHelper")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <CurrencyField
                      label=""
                      value={ppr.satRefund}
                      onChange={(v) => updatePPR(i, { satRefund: v })}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add another PPR */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={addPPR}
              disabled={pprList.length >= 3}
            >
              {t("bucket.addPPR")}
            </Button>
          </div>

          {/* ── Private Savings ────────────────────────────────────────────── */}
          <div className="flex flex-col gap-3 border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                {t("bucket.private")}
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">{t("bucket.privateTooltip")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <CurrencyField
                label={t("field.currentBalance")}
                value={config.private.initialBalance}
                onChange={(v) => onChange({ private: { ...config.private, initialBalance: v } })}
              />
              <CurrencyField
                label={t("field.monthlyContribution")}
                value={config.private.monthlyContribution}
                onChange={(v) =>
                  onChange({ private: { ...config.private, monthlyContribution: v } })
                }
              />
            </div>
            <PercentField
              label={t("field.expectedReturn")}
              value={config.private.annualReturn}
              onChange={(v) => onChange({ private: { ...config.private, annualReturn: v } })}
            />
          </div>
        </CardContent>
      </Card>

      {/* F3 – Goal Tracker trigger button */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => setGoalTrackerOpen(true)}
      >
        {t("goal.open")}
      </Button>

      {/* F2 – Simulate button with spinner */}
      <Button
        onClick={onSimulate}
        disabled={isSimulating}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        size="lg"
      >
        {isSimulating ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            {t("assumptions.simulate")}…
          </>
        ) : (
          t("assumptions.simulate")
        )}
      </Button>

      {/* F3 – Goal Tracker modal (portal) */}
      {goalTrackerOpen && (
        <GoalTrackerModal
          open={goalTrackerOpen}
          config={config}
          pprList={pprList}
          result={result}
          onClose={() => setGoalTrackerOpen(false)}
          onApply={(pprByAccount, privateMonthly) => {
            // Add required delta to each PPR account
            const updatedPPRs = pprList.map((p, i) => ({
              ...p,
              monthlyContribution: p.monthlyContribution + (pprByAccount[i] ?? 0),
            }))
            onPPRListChange(updatedPPRs)
            // Add required delta to Private Savings
            if (privateMonthly > 0) {
              onChange({
                private: {
                  ...config.private,
                  monthlyContribution: config.private.monthlyContribution + privateMonthly,
                },
              })
            }
          }}
        />
      )}
    </div>
  )
}
