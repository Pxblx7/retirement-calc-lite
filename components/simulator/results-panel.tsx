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
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { SimulationResult, YearRow } from "@/lib/simulation"
import { formatCurrency } from "@/lib/simulation"
import { useI18n } from "@/lib/i18n"
import { TrendingUp, TrendingDown, Wallet } from "lucide-react"

interface ResultsPanelProps {
  result: SimulationResult
}

function PhaseSummaryCard({
  title,
  row,
  icon,
  fmt,
}: {
  title: string
  row: YearRow | null
  icon: React.ReactNode
  fmt: (v: number) => string
}) {
  const { t } = useI18n()

  if (!row)
    return (
      <Card className="opacity-50">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-sm font-medium">{t("results.noData")}</p>
        </CardContent>
      </Card>
    )

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center justify-center size-8 rounded-md bg-primary/10 text-primary">
            {icon}
          </div>
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
        </div>
        <p className="text-lg font-bold tabular-nums">{fmt(row.total)}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>Private: {fmt(row.privada)}</span>
          <span>PPR: {fmt(row.ppr)}</span>
          <span>Afore His: {fmt(row.aforeEl)}</span>
          <span>Afore Her: {fmt(row.aforeElla)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function SummaryTab({ result }: ResultsPanelProps) {
  const { t, locale } = useI18n()
  const fmt = (v: number) => formatCurrency(v, locale)

  const keyYears = new Set<number>()
  const firstYear = result.years[0]?.year ?? 0
  const lastYear = result.years[result.years.length - 1]?.year ?? 0

  if (result.endPhase1) keyYears.add(result.endPhase1.year)
  if (result.endPhase2) keyYears.add(result.endPhase2.year)
  if (result.endPhase3) keyYears.add(result.endPhase3.year)
  keyYears.add(firstYear)
  keyYears.add(lastYear)

  for (let y = firstYear; y <= lastYear; y += 5) {
    keyYears.add(y)
  }

  const summaryRows = result.years.filter((r) => keyYears.has(r.year))

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <PhaseSummaryCard
          title={t("results.endPhase1")}
          row={result.endPhase1}
          icon={<TrendingUp className="size-4" />}
          fmt={fmt}
        />
        <PhaseSummaryCard
          title={t("results.endPhase2")}
          row={result.endPhase2}
          icon={<Wallet className="size-4" />}
          fmt={fmt}
        />
        <PhaseSummaryCard
          title={t("results.endPhase3")}
          row={result.endPhase3}
          icon={<TrendingDown className="size-4" />}
          fmt={fmt}
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            {t("results.balancesByYear")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">{t("results.year")}</TableHead>
                <TableHead className="text-xs">{t("results.phase")}</TableHead>
                <TableHead className="text-xs text-right whitespace-nowrap">Private</TableHead>
                <TableHead className="text-xs text-right whitespace-nowrap">PPR</TableHead>
                <TableHead className="text-xs text-right whitespace-nowrap">Afore His</TableHead>
                <TableHead className="text-xs text-right whitespace-nowrap">Afore Her</TableHead>
                <TableHead className="text-xs text-right font-bold whitespace-nowrap">
                  {t("results.total")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaryRows.map((row) => (
                <TableRow
                  key={row.year}
                  className={row.depleted ? "text-destructive" : ""}
                >
                  <TableCell className="text-xs tabular-nums font-medium">
                    {row.year}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        row.phase === 1
                          ? "bg-chart-2/15 text-chart-2"
                          : row.phase === 2
                            ? "bg-chart-4/15 text-chart-4"
                            : "bg-chart-1/15 text-chart-1"
                      }`}
                    >
                      P{row.phase}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums">
                    {fmt(row.privada)}
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums">
                    {fmt(row.ppr)}
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums">
                    {fmt(row.aforeEl)}
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums">
                    {fmt(row.aforeElla)}
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums font-bold">
                    {fmt(row.total)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function ChartTab({ result }: ResultsPanelProps) {
  const { t, locale } = useI18n()
  const fmt = (v: number) => formatCurrency(v, locale)

  const withdrawalLabel = t("results.withdrawalsOnChart")

  const data = result.years.map((r) => ({
    year: r.year,
    Private: Math.round(r.privada),
    PPR: Math.round(r.ppr),
    "Afore His": Math.round(r.aforeEl),
    "Afore Her": Math.round(r.aforeElla),
    [withdrawalLabel]: Math.round(r.withdrawalNominalAnnual),
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
          {t("results.wealthOverTime")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[420px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <defs>
                <linearGradient
                  id="colorPrivada"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-chart-1)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-chart-1)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="colorPPR" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-chart-2)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-chart-2)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient
                  id="colorAforeEl"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-chart-3)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-chart-3)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient
                  id="colorAforeElla"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-chart-4)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-chart-4)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-border"
              />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
              />
              <YAxis
                yAxisId="left"
                tickFormatter={formatYAxis}
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
                width={60}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={formatYAxis}
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-popover)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-popover-foreground)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => fmt(value)}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="Private"
                stackId="1"
                stroke="var(--color-chart-1)"
                fill="url(#colorPrivada)"
                strokeWidth={2}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="PPR"
                stackId="1"
                stroke="var(--color-chart-2)"
                fill="url(#colorPPR)"
                strokeWidth={2}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="Afore His"
                stackId="1"
                stroke="var(--color-chart-3)"
                fill="url(#colorAforeEl)"
                strokeWidth={2}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="Afore Her"
                stackId="1"
                stroke="var(--color-chart-4)"
                fill="url(#colorAforeElla)"
                strokeWidth={2}
              />
              <Bar
                yAxisId="right"
                dataKey={withdrawalLabel}
                fill="var(--color-destructive)"
                opacity={0.6}
                barSize={4}
                radius={[2, 2, 0, 0]}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function WithdrawalsTab({ result }: ResultsPanelProps) {
  const { t, locale } = useI18n()
  const fmt = (v: number) => formatCurrency(v, locale)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">
          {t("results.vpnVsNominal")}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {t("results.vpnExplanation")}
        </p>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs whitespace-nowrap">{t("results.keyPoint")}</TableHead>
              <TableHead className="text-xs">{t("results.year")}</TableHead>
              <TableHead className="text-xs">{t("results.phase")}</TableHead>
              <TableHead className="text-xs text-right whitespace-nowrap">
                {t("results.withdrawalVPN")}
              </TableHead>
              <TableHead className="text-xs text-right whitespace-nowrap">
                {t("results.withdrawalNominal")}
              </TableHead>
              <TableHead className="text-xs text-right whitespace-nowrap">
                {t("results.inflationFactor")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.withdrawalKeyPoints.map((kp) => {
              const factor =
                kp.vpnMonthly > 0 ? kp.nominalMonthly / kp.vpnMonthly : 0
              return (
                <TableRow key={kp.year}>
                  <TableCell className="text-xs font-medium">
                    {t(kp.label as "kp.startPhase2")} ({kp.year})
                  </TableCell>
                  <TableCell className="text-xs tabular-nums">
                    {kp.year}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        kp.phase === 2
                          ? "bg-chart-4/15 text-chart-4"
                          : "bg-chart-1/15 text-chart-1"
                      }`}
                    >
                      P{kp.phase}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums">
                    {fmt(kp.vpnMonthly)}
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums font-bold">
                    {fmt(kp.nominalMonthly)}
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums text-muted-foreground">
                    {factor.toFixed(2)}x
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function FullTableTab({ result }: ResultsPanelProps) {
  const { t, locale } = useI18n()
  const fmt = (v: number) => formatCurrency(v, locale)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">
          {t("results.fullDetail")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[500px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sticky top-0 bg-card z-10">
                  {t("results.year")}
                </TableHead>
                <TableHead className="text-xs sticky top-0 bg-card z-10">
                  {t("results.phase")}
                </TableHead>
                <TableHead className="text-xs text-right sticky top-0 bg-card z-10 whitespace-nowrap">
                  Private
                </TableHead>
                <TableHead className="text-xs text-right sticky top-0 bg-card z-10 whitespace-nowrap">
                  PPR
                </TableHead>
                <TableHead className="text-xs text-right sticky top-0 bg-card z-10 whitespace-nowrap">
                  Afore His
                </TableHead>
                <TableHead className="text-xs text-right sticky top-0 bg-card z-10 whitespace-nowrap">
                  Afore Her
                </TableHead>
                <TableHead className="text-xs text-right sticky top-0 bg-card z-10 font-bold whitespace-nowrap">
                  {t("results.total")}
                </TableHead>
                <TableHead className="text-xs text-right sticky top-0 bg-card z-10 whitespace-nowrap">
                  {t("results.annualWithdrawal")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.years.map((row) => (
                <TableRow
                  key={row.year}
                  className={row.depleted ? "text-destructive" : ""}
                >
                  <TableCell className="text-xs tabular-nums font-medium">
                    {row.year}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        row.phase === 1
                          ? "bg-chart-2/15 text-chart-2"
                          : row.phase === 2
                            ? "bg-chart-4/15 text-chart-4"
                            : "bg-chart-1/15 text-chart-1"
                      }`}
                    >
                      P{row.phase}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums">
                    {fmt(row.privada)}
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums">
                    {fmt(row.ppr)}
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums">
                    {fmt(row.aforeEl)}
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums">
                    {fmt(row.aforeElla)}
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums font-bold">
                    {fmt(row.total)}
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums">
                    {row.withdrawalNominalAnnual > 0
                      ? fmt(row.withdrawalNominalAnnual)
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export function ResultsPanel({ result }: ResultsPanelProps) {
  const { t } = useI18n()

  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="summary">{t("results.summary")}</TabsTrigger>
        <TabsTrigger value="chart">{t("results.chart")}</TabsTrigger>
        <TabsTrigger value="withdrawals">{t("results.withdrawalsTab")}</TabsTrigger>
        <TabsTrigger value="full">{t("results.detail")}</TabsTrigger>
      </TabsList>

      <TabsContent value="summary" className="mt-4">
        <SummaryTab result={result} />
      </TabsContent>

      <TabsContent value="chart" className="mt-4">
        <ChartTab result={result} />
      </TabsContent>

      <TabsContent value="withdrawals" className="mt-4">
        <WithdrawalsTab result={result} />
      </TabsContent>

      <TabsContent value="full" className="mt-4">
        <FullTableTab result={result} />
      </TabsContent>
    </Tabs>
  )
}
