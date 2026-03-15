"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Button } from "@/components/ui/button"
import type { SimConfig, SimulationResult, BucketResult } from "@/lib/simulation"
import { formatCurrency } from "@/lib/simulation"
import { useI18n } from "@/lib/i18n"
import { Info, AlertCircle, Printer } from "lucide-react"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ResultsPanelProps {
  config: SimConfig
  result: SimulationResult
}

function BucketResultCard({
  title,
  res,
  tooltip,
  isTotal = false,
}: {
  title: string
  res: BucketResult
  tooltip?: string
  isTotal?: boolean
}) {
  const { t, locale } = useI18n()
  const fmt = (v: number) => formatCurrency(v, locale)

  return (
    <Card className={isTotal ? "border-primary/50 bg-primary/5" : ""}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
          {tooltip && (
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Info className="size-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">{tooltip}</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-medium">{t("results.monthlyFuture")}</p>
            <p className="text-lg font-bold tabular-nums">{fmt(res.futureMonthly)}</p>
          </div>
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center gap-1">
              <p className="text-[10px] text-muted-foreground uppercase font-medium">{t("results.monthlyVPN")}</p>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">{t("results.vpnTooltip")}</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
            <p className="text-xl font-black text-primary tabular-nums">{fmt(res.vpnMonthly)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SummaryTab({ config, result }: ResultsPanelProps) {
  const { t, locale } = useI18n()

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BucketResultCard title={t("bucket.afore")} res={result.afore} tooltip={t("bucket.aforeTooltip")} />
        <BucketResultCard title={t("bucket.ppr")} res={result.ppr} tooltip={t("bucket.pprTooltip")} />
        <BucketResultCard title={t("bucket.private")} res={result.private} tooltip={t("bucket.privateTooltip")} />
        <BucketResultCard title={t("results.totalPackage")} res={result.total} isTotal />
      </div>

      {config.retirementAge < 65 && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold">⚠️ {locale === "es" ? "Nota Legal (Ley 97)" : "Legal Note (Ley 97)"}</p>
            <p className="opacity-90">
              {locale === "es" 
                ? "La pensión de AFORE se reduce si se solicita antes de los 65 años (ej. 75% a los 60 años). Si te retiras antes de los 60, tu ahorro seguirá creciendo pasivamente, pero el pago de AFORE iniciará legalmente a los 65 años."
                : "AFORE pensions are reduced if taken before age 65 (e.g., 75% at age 60). If you retire before 60, your savings will grow passively, but the AFORE payout will legally start at age 65."}
            </p>
          </div>
        </div>
      )}

      <Card className="bg-muted/30 border-none shadow-none">
        <CardContent className="p-4 text-sm text-muted-foreground italic">
          {t("results.sustainability", { age: config.planningHorizonAge })}
        </CardContent>
      </Card>
    </div>
  )
}

function ChartTab({ config, result }: ResultsPanelProps) {
  const { t, locale } = useI18n()
  const fmt = (v: number) => formatCurrency(v, locale)

  const data = result.years.map((r) => ({
    year: r.year,
    age: r.age,
    AFORE: Math.round(r.aforeBalance),
    PPR: Math.round(r.pprBalance),
    Private: Math.round(r.privateBalance),
  }))

  const formatYAxis = (v: number) => {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
    if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`
    return `$${v}`
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">
          {t("results.total")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[420px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorAfore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPPR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPrivate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-3)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
              <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 11 }} className="fill-muted-foreground" width={60} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e5e7eb",
                  color: "#111827",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => fmt(value)}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return `${label} (Edad: ${payload[0].payload.age})`
                  }
                  return label
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Area type="monotone" dataKey="AFORE" stackId="1" stroke="var(--color-chart-1)" fill="url(#colorAfore)" strokeWidth={2} />
              <Area type="monotone" dataKey="PPR" stackId="1" stroke="var(--color-chart-2)" fill="url(#colorPPR)" strokeWidth={2} />
              <Area type="monotone" dataKey="Private" stackId="1" stroke="var(--color-chart-3)" fill="url(#colorPrivate)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function FullTableTab({ config, result }: ResultsPanelProps) {
  const { t, locale } = useI18n()
  const fmt = (v: number) => formatCurrency(v, locale)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">
          {t("results.detail")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[500px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sticky top-0 bg-card z-10">{t("results.year")}</TableHead>
                <TableHead className="text-xs sticky top-0 bg-card z-10">Edad</TableHead>
                <TableHead className="text-xs text-right sticky top-0 bg-card z-10">AFORE</TableHead>
                <TableHead className="text-xs text-right sticky top-0 bg-card z-10">PPR</TableHead>
                <TableHead className="text-xs text-right sticky top-0 bg-card z-10">Privado</TableHead>
                <TableHead className="text-xs text-right sticky top-0 bg-card z-10 font-bold">{t("results.total")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.years.map((row) => (
                <TableRow key={row.year}>
                  <TableCell className="text-xs tabular-nums font-medium">{row.year}</TableCell>
                  <TableCell className="text-xs tabular-nums">{row.age}</TableCell>
                  <TableCell className="text-xs text-right tabular-nums">{fmt(row.aforeBalance)}</TableCell>
                  <TableCell className="text-xs text-right tabular-nums">{fmt(row.pprBalance)}</TableCell>
                  <TableCell className="text-xs text-right tabular-nums">{fmt(row.privateBalance)}</TableCell>
                  <TableCell className="text-xs text-right tabular-nums font-bold">{fmt(row.totalBalance)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export function ResultsPanel({ config, result }: ResultsPanelProps) {
  const { t } = useI18n()

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <Tabs defaultValue="summary" className="w-full">
          <div className="flex items-center justify-between mb-4 print:hidden">
            <TabsList className="flex-1">
              <TabsTrigger value="summary" className="flex-1">{t("results.summary")}</TabsTrigger>
              <TabsTrigger value="chart" className="flex-1">{t("results.chart")}</TabsTrigger>
              <TabsTrigger value="full" className="flex-1">{t("results.detail")}</TabsTrigger>
            </TabsList>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrint}
              className="ml-4 gap-2 border-primary/20 hover:bg-primary/5"
            >
              <Printer className="size-4" />
              <span className="hidden sm:inline">{t("results.exportPDF")}</span>
            </Button>
          </div>

          <TabsContent value="summary" className="print:block">
            <SummaryTab config={config} result={result} />
          </TabsContent>

          <TabsContent value="chart" className="print:block print:mt-8">
            <ChartTab config={config} result={result} />
          </TabsContent>

          <TabsContent value="full" className="print:block print:mt-8">
            <FullTableTab config={config} result={result} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
