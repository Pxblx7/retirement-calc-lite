"use client"

import { useState, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CurrencyField } from "@/components/simulator/fintech-inputs"
import { useI18n } from "@/lib/i18n"
import type { SimConfig, SimulationResult } from "@/lib/simulation"
import type { PPRConfig } from "@/lib/ppr-helpers"
import { computeGoalThreshold, type GoalResult } from "@/lib/goal-tracker"

// ─── Props ────────────────────────────────────────────────────────────────────

interface GoalTrackerModalProps {
  open: boolean
  config: SimConfig
  pprList: PPRConfig[]
  result?: SimulationResult | null
  onClose: () => void
  /**
   * Called when the user clicks "Apply to my simulator".
   * @param pprByAccount  Additional monthly contribution per PPR (same order as pprList)
   * @param privateMonthly Additional monthly contribution for Private Savings
   */
  onApply: (pprByAccount: number[], privateMonthly: number) => void
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (v: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(v)

// ─── Component ────────────────────────────────────────────────────────────────

export function GoalTrackerModal({
  open,
  config,
  pprList,
  result: simResult,
  onClose,
  onApply,
}: GoalTrackerModalProps) {
  const { t } = useI18n()
  const [targetNPV, setTargetNPV] = useState(15_000)
  const [result, setResult] = useState<GoalResult | null>(null)

  // F8 – Check if target is too low compared to current projection
  const currentIncome = simResult?.total.vpnMonthly ?? 0
  const isTargetTooLow = simResult !== null && simResult !== undefined && targetNPV <= currentIncome

  const handleCompute = useCallback(() => {
    const r = computeGoalThreshold(targetNPV, config, pprList)
    setResult(r)
  }, [targetNPV, config, pprList])

  const handleApply = () => {
    if (!result || result.alreadyCovered) return
    onApply(result.pprByAccount, result.privateMonthly)
    onClose()
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">{t("goal.title")}</DialogTitle>
        </DialogHeader>

        {/* Input section */}
        <div className="flex flex-col gap-4 pb-2">
          <CurrencyField
            label={t("goal.targetLabel")}
            value={targetNPV}
            onChange={setTargetNPV}
            step={1000}
          />
          {isTargetTooLow && (
            <p className="text-sm text-amber-600 dark:text-amber-400">
              {t("goal.targetTooLow")}
            </p>
          )}
          <Button 
            onClick={handleCompute} 
            className="w-full"
            disabled={isTargetTooLow}
          >
            {t("goal.compute")}
          </Button>
        </div>

        {/* Results section */}
        {result && (
          <div className="flex flex-col gap-3 border-t pt-4">
            {result.alreadyCovered ? (
              <>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  {t("goal.alreadyCovered")}
                </p>
                <ResultRow label={t("goal.aforeNPV")} value={fmt(result.aforeNPV)} />
                <Button variant="outline" onClick={onClose} className="w-full mt-1">
                  {t("goal.close")}
                </Button>
              </>
            ) : (
              <>
                {/* AFORE contribution */}
                <ResultRow label={t("goal.aforeNPV")} value={fmt(result.aforeNPV)} />

                {/* PPR aggregate */}
                <ResultRow
                  label={t("goal.pprRequired")}
                  value={fmt(result.pprTotalMonthly)}
                  highlight={result.pprTotalMonthly > 0}
                />

                {/* Per-account breakdown (only if multiple PPRs) */}
                {pprList.length > 1 &&
                  pprList.map((p, i) => (
                    <ResultRow
                      key={i}
                      label={`↳ ${p.label || `PPR ${i + 1}`}`}
                      value={fmt(result.pprByAccount[i] ?? 0)}
                      indent
                    />
                  ))}

                {/* Private Savings */}
                <ResultRow
                  label={t("goal.privateRequired")}
                  value={fmt(result.privateMonthly)}
                  highlight={result.privateMonthly > 0}
                />

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleApply} className="flex-1">
                    {t("goal.apply")}
                  </Button>
                  <Button variant="outline" onClick={onClose}>
                    {t("goal.close")}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Close when no result yet */}
        {!result && (
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={onClose}>
              {t("goal.close")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─── Sub-component ────────────────────────────────────────────────────────────

function ResultRow({
  label,
  value,
  highlight = false,
  indent = false,
}: {
  label: string
  value: string
  highlight?: boolean
  indent?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 text-sm ${indent ? "pl-4" : ""}`}
    >
      <span
        className={`text-muted-foreground leading-tight ${indent ? "text-xs" : ""}`}
      >
        {label}
      </span>
      <span
        className={`font-mono tabular-nums font-semibold shrink-0 ${
          highlight ? "text-primary" : ""
        }`}
      >
        {value}
      </span>
    </div>
  )
}
