"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CurrencyField, YearField, PercentField } from "@/components/simulator/fintech-inputs"
import type { SimConfig } from "@/lib/simulation"
import { useI18n } from "@/lib/i18n"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

  return (
    <div className="flex flex-col gap-4">
      {/* General Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            {t("section.config")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <YearField
              label={t("assumptions.currentAge")}
              value={config.currentAge}
              onChange={(v) => onChange({ currentAge: v })}
            />
            <YearField
              label={t("assumptions.retirementAge")}
              value={config.retirementAge}
              onChange={(v) => onChange({ retirementAge: v })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
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

      {/* My Savings */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              {t("section.savings")}
            </CardTitle>
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
          {/* AFORE */}
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

          {/* PPR */}
          <div className="flex flex-col gap-3 border-t border-border pt-4">
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
            <div className="grid grid-cols-2 gap-3">
              <CurrencyField
                label={t("field.currentBalance")}
                value={config.ppr.initialBalance}
                onChange={(v) => onChange({ ppr: { ...config.ppr, initialBalance: v } })}
              />
              <CurrencyField
                label={t("field.monthlyContribution")}
                value={config.ppr.monthlyContribution}
                onChange={(v) => onChange({ ppr: { ...config.ppr, monthlyContribution: v } })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <PercentField
                label={t("field.expectedReturn")}
                value={config.ppr.annualReturn}
                onChange={(v) => onChange({ ppr: { ...config.ppr, annualReturn: v } })}
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
                  value={config.ppr.satRefund}
                  onChange={(v) => onChange({ ppr: { ...config.ppr, satRefund: v } })}
                />
              </div>
            </div>
          </div>

          {/* Private Savings */}
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
                onChange={(v) => onChange({ private: { ...config.private, monthlyContribution: v } })}
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

      <Button onClick={onSimulate} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
        {t("assumptions.simulate")}
      </Button>
    </div>
  )
}
