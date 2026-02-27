"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CurrencyField, YearField, PercentField } from "@/components/simulator/fintech-inputs"
import type { SimConfig } from "@/lib/simulation"
import { useI18n } from "@/lib/i18n"
import { Play } from "lucide-react"

interface AssumptionsPanelProps {
  config: SimConfig
  onChange: (updates: Partial<SimConfig>) => void
  onSimulate: () => void
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
            <YearField
              label={t("assumptions.baseYear")}
              value={config.yearBase}
              onChange={(v) => onChange({ yearBase: v })}
            />
            <YearField
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
              <YearField
                label={t("assumptions.start")}
                value={config.phase1Start}
                onChange={(v) => onChange({ phase1Start: v })}
              />
              <YearField
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
              <YearField
                label={t("assumptions.start")}
                value={config.phase2Start}
                onChange={(v) => onChange({ phase2Start: v })}
              />
              <YearField
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
              <YearField
                label={t("assumptions.start")}
                value={config.phase3Start}
                onChange={(v) => onChange({ phase3Start: v })}
              />
              <YearField
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
            <CurrencyField
              label={t("assumptions.private")}
              value={config.initialPrivada}
              onChange={(v) => onChange({ initialPrivada: v })}
              step={10000}
            />
            <CurrencyField
              label="PPR"
              value={config.initialPPR}
              onChange={(v) => onChange({ initialPPR: v })}
              step={10000}
            />
            <CurrencyField
              label={t("assumptions.aforeHis")}
              value={config.initialAforeEl}
              onChange={(v) => onChange({ initialAforeEl: v })}
              step={10000}
            />
            <CurrencyField
              label={t("assumptions.aforeHer")}
              value={config.initialAforeElla}
              onChange={(v) => onChange({ initialAforeElla: v })}
              step={10000}
            />
          </div>

          <div className="border-t border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {t("assumptions.monthlyContributions")}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <CurrencyField
                label={t("assumptions.pprMonthly")}
                value={config.pprMonthly}
                onChange={(v) => onChange({ pprMonthly: v })}
                step={500}
              />
              <CurrencyField
                label={t("assumptions.aforeHerMonthly")}
                value={config.aforeEllaMonthly}
                onChange={(v) => onChange({ aforeEllaMonthly: v })}
                step={100}
              />
            </div>
            <div className="mt-3">
              <YearField
                label={t("assumptions.aforeHerUntilYear")}
                value={config.aforeEllaEndYear}
                onChange={(v) => onChange({ aforeEllaEndYear: v })}
              />
            </div>
          </div>

          {/* Private Tranche 1 */}
          <div className="border-t border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {t("assumptions.privateTranche1")}
            </p>
            <div className="flex flex-col gap-2">
              <CurrencyField
                label={t("assumptions.monthlyAmount")}
                value={config.privadaTramo1Amount}
                onChange={(v) => onChange({ privadaTramo1Amount: v })}
                step={1000}
              />
              <div className="grid grid-cols-2 gap-3">
                <YearField
                  label={t("assumptions.from")}
                  value={config.privadaTramo1Start}
                  onChange={(v) => onChange({ privadaTramo1Start: v })}
                />
                <YearField
                  label={t("assumptions.until")}
                  value={config.privadaTramo1End}
                  onChange={(v) => onChange({ privadaTramo1End: v })}
                />
              </div>
            </div>
          </div>

          {/* Private Tranche 2 */}
          <div className="border-t border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {t("assumptions.privateTranche2")}
            </p>
            <div className="flex flex-col gap-2">
              <CurrencyField
                label={t("assumptions.monthlyAmount")}
                value={config.privadaTramo2Amount}
                onChange={(v) => onChange({ privadaTramo2Amount: v })}
                step={1000}
              />
              <div className="grid grid-cols-2 gap-3">
                <YearField
                  label={t("assumptions.from")}
                  value={config.privadaTramo2Start}
                  onChange={(v) => onChange({ privadaTramo2Start: v })}
                />
                <YearField
                  label={t("assumptions.until")}
                  value={config.privadaTramo2End}
                  onChange={(v) => onChange({ privadaTramo2End: v })}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {t("assumptions.otherContributions")}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <CurrencyField
                label={t("assumptions.satAnnualRefund")}
                value={config.satAnnual}
                onChange={(v) => onChange({ satAnnual: v })}
                step={5000}
              />
              <CurrencyField
                label={t("assumptions.aforeHisBimonthly")}
                value={config.aforeElBimonthly}
                onChange={(v) => onChange({ aforeElBimonthly: v })}
                step={1000}
              />
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {t("assumptions.specialEvents")}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <YearField
                label={t("assumptions.houseSaleYear")}
                value={config.ventaCasaYear}
                onChange={(v) => onChange({ ventaCasaYear: v })}
              />
              <CurrencyField
                label={t("assumptions.houseSaleAmount")}
                value={config.ventaCasaAmount}
                onChange={(v) => onChange({ ventaCasaAmount: v })}
                step={100000}
              />
              <YearField
                label={t("assumptions.housePurchaseYear")}
                value={config.compraCasaYear}
                onChange={(v) => onChange({ compraCasaYear: v })}
              />
              <CurrencyField
                label={t("assumptions.housePurchaseAmount")}
                value={config.compraCasaAmount}
                onChange={(v) => onChange({ compraCasaAmount: v })}
                step={100000}
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
          <CurrencyField
            label={t("assumptions.withdrawalPhase2")}
            value={config.withdrawalPhase2VPN}
            onChange={(v) => onChange({ withdrawalPhase2VPN: v })}
            step={5000}
          />
          <CurrencyField
            label={t("assumptions.withdrawalPhase3")}
            value={config.withdrawalPhase3VPN}
            onChange={(v) => onChange({ withdrawalPhase3VPN: v })}
            step={5000}
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
