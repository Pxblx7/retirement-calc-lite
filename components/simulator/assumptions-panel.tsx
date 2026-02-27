"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { SimConfig } from "@/lib/simulation"
import { useI18n } from "@/lib/i18n"
import { Play } from "lucide-react"

interface AssumptionsPanelProps {
  config: SimConfig
  onChange: (updates: Partial<SimConfig>) => void
  onSimulate: () => void
}

function NumberField({
  label,
  value,
  onChange,
  suffix,
  step,
  className,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  suffix?: string
  step?: number
  className?: string
}) {
  return (
    <div className={className}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-1.5">
        <Input
          type="number"
          value={value}
          step={step ?? 1}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="h-8 text-sm tabular-nums"
        />
        {suffix && (
          <span className="text-xs text-muted-foreground shrink-0">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

function PercentField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <NumberField
      label={label}
      value={parseFloat((value * 100).toFixed(4))}
      onChange={(v) => onChange(v / 100)}
      suffix="%"
      step={0.1}
    />
  )
}

export function AssumptionsPanel({
  config,
  onChange,
  onSimulate,
}: AssumptionsPanelProps) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-4">
      {/* General Assumptions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            {t("assumptions.general")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label={t("assumptions.baseYear")}
              value={config.yearBase}
              onChange={(v) => onChange({ yearBase: v })}
            />
            <NumberField
              label={t("assumptions.endYear")}
              value={config.yearEnd}
              onChange={(v) => onChange({ yearEnd: v })}
            />
          </div>

          <div className="border-t border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {t("assumptions.phase1")}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label={t("assumptions.start")}
                value={config.phase1Start}
                onChange={(v) => onChange({ phase1Start: v })}
              />
              <NumberField
                label={t("assumptions.end")}
                value={config.phase1End}
                onChange={(v) => onChange({ phase1End: v })}
              />
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {t("assumptions.phase2")}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label={t("assumptions.start")}
                value={config.phase2Start}
                onChange={(v) => onChange({ phase2Start: v })}
              />
              <NumberField
                label={t("assumptions.end")}
                value={config.phase2End}
                onChange={(v) => onChange({ phase2End: v })}
              />
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {t("assumptions.phase3")}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label={t("assumptions.start")}
                value={config.phase3Start}
                onChange={(v) => onChange({ phase3Start: v })}
              />
              <NumberField
                label={t("assumptions.end")}
                value={config.phase3End}
                onChange={(v) => onChange({ phase3End: v })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rates & Returns */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            {t("assumptions.rates")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <PercentField
              label={t("assumptions.inflationMx")}
              value={config.inflationMx}
              onChange={(v) => onChange({ inflationMx: v })}
            />
            <PercentField
              label={t("assumptions.inflationOther")}
              value={config.inflationOther}
              onChange={(v) => onChange({ inflationOther: v })}
            />
          </div>
          <div className="border-t border-border pt-3 grid grid-cols-2 gap-3">
            <PercentField
              label={t("assumptions.returnPrivada")}
              value={config.returnPrivada}
              onChange={(v) => onChange({ returnPrivada: v })}
            />
            <PercentField
              label={t("assumptions.returnPPR")}
              value={config.returnPPR}
              onChange={(v) => onChange({ returnPPR: v })}
            />
            <PercentField
              label={t("assumptions.returnAforeEl")}
              value={config.returnAforeEl}
              onChange={(v) => onChange({ returnAforeEl: v })}
            />
            <PercentField
              label={t("assumptions.returnAforeElla")}
              value={config.returnAforeElla}
              onChange={(v) => onChange({ returnAforeElla: v })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contributions & Events */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            {t("assumptions.contributions")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {/* Initial Balances */}
          <p className="text-xs font-medium text-muted-foreground">
            {t("assumptions.initialBalances")}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label={t("assumptions.private")}
              value={config.initialPrivada}
              onChange={(v) => onChange({ initialPrivada: v })}
              suffix="MXN"
            />
            <NumberField
              label="PPR"
              value={config.initialPPR}
              onChange={(v) => onChange({ initialPPR: v })}
              suffix="MXN"
            />
            <NumberField
              label={t("assumptions.aforeHis")}
              value={config.initialAforeEl}
              onChange={(v) => onChange({ initialAforeEl: v })}
              suffix="MXN"
            />
            <NumberField
              label={t("assumptions.aforeHer")}
              value={config.initialAforeElla}
              onChange={(v) => onChange({ initialAforeElla: v })}
              suffix="MXN"
            />
          </div>

          <div className="border-t border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {t("assumptions.monthlyContributions")}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label={t("assumptions.pprMonthly")}
                value={config.pprMonthly}
                onChange={(v) => onChange({ pprMonthly: v })}
                suffix="MXN"
              />
              <NumberField
                label={t("assumptions.aforeHerMonthly")}
                value={config.aforeEllaMonthly}
                onChange={(v) => onChange({ aforeEllaMonthly: v })}
                suffix="MXN"
              />
            </div>
            <div className="mt-2">
              <NumberField
                label={t("assumptions.aforeHerUntilYear")}
                value={config.aforeEllaEndYear}
                onChange={(v) => onChange({ aforeEllaEndYear: v })}
              />
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {t("assumptions.privateTranche1")}
            </p>
            <div className="grid grid-cols-3 gap-3">
              <NumberField
                label={t("assumptions.monthlyAmount")}
                value={config.privadaTramo1Amount}
                onChange={(v) => onChange({ privadaTramo1Amount: v })}
                suffix="MXN"
              />
              <NumberField
                label={t("assumptions.from")}
                value={config.privadaTramo1Start}
                onChange={(v) => onChange({ privadaTramo1Start: v })}
              />
              <NumberField
                label={t("assumptions.until")}
                value={config.privadaTramo1End}
                onChange={(v) => onChange({ privadaTramo1End: v })}
              />
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {t("assumptions.privateTranche2")}
            </p>
            <div className="grid grid-cols-3 gap-3">
              <NumberField
                label={t("assumptions.monthlyAmount")}
                value={config.privadaTramo2Amount}
                onChange={(v) => onChange({ privadaTramo2Amount: v })}
                suffix="MXN"
              />
              <NumberField
                label={t("assumptions.from")}
                value={config.privadaTramo2Start}
                onChange={(v) => onChange({ privadaTramo2Start: v })}
              />
              <NumberField
                label={t("assumptions.until")}
                value={config.privadaTramo2End}
                onChange={(v) => onChange({ privadaTramo2End: v })}
              />
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {t("assumptions.otherContributions")}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label={t("assumptions.satAnnualRefund")}
                value={config.satAnnual}
                onChange={(v) => onChange({ satAnnual: v })}
                suffix="MXN"
              />
              <NumberField
                label={t("assumptions.aforeHisBimonthly")}
                value={config.aforeElBimonthly}
                onChange={(v) => onChange({ aforeElBimonthly: v })}
                suffix="MXN"
              />
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {t("assumptions.specialEvents")}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label={t("assumptions.houseSaleYear")}
                value={config.ventaCasaYear}
                onChange={(v) => onChange({ ventaCasaYear: v })}
              />
              <NumberField
                label={t("assumptions.houseSaleAmount")}
                value={config.ventaCasaAmount}
                onChange={(v) => onChange({ ventaCasaAmount: v })}
                suffix="MXN"
              />
              <NumberField
                label={t("assumptions.housePurchaseYear")}
                value={config.compraCasaYear}
                onChange={(v) => onChange({ compraCasaYear: v })}
              />
              <NumberField
                label={t("assumptions.housePurchaseAmount")}
                value={config.compraCasaAmount}
                onChange={(v) => onChange({ compraCasaAmount: v })}
                suffix="MXN"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawals */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            {t("assumptions.withdrawals")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <NumberField
            label={t("assumptions.withdrawalPhase2")}
            value={config.withdrawalPhase2VPN}
            onChange={(v) => onChange({ withdrawalPhase2VPN: v })}
            suffix="MXN"
          />
          <NumberField
            label={t("assumptions.withdrawalPhase3")}
            value={config.withdrawalPhase3VPN}
            onChange={(v) => onChange({ withdrawalPhase3VPN: v })}
            suffix="MXN"
          />
        </CardContent>
      </Card>

      <Button onClick={onSimulate} className="w-full" size="lg">
        <Play className="size-4" />
        {t("assumptions.simulate")}
      </Button>
    </div>
  )
}
