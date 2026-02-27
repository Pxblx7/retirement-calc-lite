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
import type { SimulationResult, YearRow } from "@/lib/simulation"
import { formatMXN } from "@/lib/simulation"
import { TrendingUp, TrendingDown, Wallet } from "lucide-react"

interface ResultsPanelProps {
  result: SimulationResult
}

function PhaseSummaryCard({
  title,
  row,
  icon,
}: {
  title: string
  row: YearRow | null
  icon: React.ReactNode
}) {
  if (!row)
    return (
      <Card className="opacity-50">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-sm font-medium">Sin datos</p>
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
        <p className="text-lg font-bold tabular-nums">{formatMXN(row.total)}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>Privada: {formatMXN(row.privada)}</span>
          <span>PPR: {formatMXN(row.ppr)}</span>
          <span>Afore El: {formatMXN(row.aforeEl)}</span>
          <span>Afore Ella: {formatMXN(row.aforeElla)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function SummaryTab({ result }: ResultsPanelProps) {
  // Show select years: every 5 years + phase boundaries
  const keyYears = new Set<number>()
  const firstYear = result.years[0]?.year ?? 0
  const lastYear = result.years[result.years.length - 1]?.year ?? 0

  if (result.endPhase1) keyYears.add(result.endPhase1.year)
  if (result.endPhase2) keyYears.add(result.endPhase2.year)
  if (result.endPhase3) keyYears.add(result.endPhase3.year)
  keyYears.add(firstYear)
  keyYears.add(lastYear)

  // Add every 5 years
  for (let y = firstYear; y <= lastYear; y += 5) {
    keyYears.add(y)
  }

  const summaryRows = result.years.filter((r) => keyYears.has(r.year))

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <PhaseSummaryCard
          title="Final Fase 1 - Acumulacion"
          row={result.endPhase1}
          icon={<TrendingUp className="size-4" />}
        />
        <PhaseSummaryCard
          title="Final Fase 2 - Transicion"
          row={result.endPhase2}
          icon={<Wallet className="size-4" />}
        />
        <PhaseSummaryCard
          title="Final Fase 3 - Horizonte"
          row={result.endPhase3}
          icon={<TrendingDown className="size-4" />}
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            Saldos por Anio (resumen)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Anio</TableHead>
                <TableHead className="text-xs">Fase</TableHead>
                <TableHead className="text-xs text-right">Privada</TableHead>
                <TableHead className="text-xs text-right">PPR</TableHead>
                <TableHead className="text-xs text-right">Afore El</TableHead>
                <TableHead className="text-xs text-right">
                  Afore Ella
                </TableHead>
                <TableHead className="text-xs text-right font-bold">
                  Total
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
                      F{row.phase}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums">
                    {formatMXN(row.privada)}
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums">
                    {formatMXN(row.ppr)}
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums">
                    {formatMXN(row.aforeEl)}
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums">
                    {formatMXN(row.aforeElla)}
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums font-bold">
                    {formatMXN(row.total)}
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
  const data = result.years.map((r) => ({
    year: r.year,
    Privada: Math.round(r.privada),
    PPR: Math.round(r.ppr),
    "Afore El": Math.round(r.aforeEl),
    "Afore Ella": Math.round(r.aforeElla),
    Total: Math.round(r.total),
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
          Patrimonio Total en el Tiempo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
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
                formatter={(value: number) => formatMXN(value)}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Area
                type="monotone"
                dataKey="Privada"
                stackId="1"
                stroke="var(--color-chart-1)"
                fill="url(#colorPrivada)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="PPR"
                stackId="1"
                stroke="var(--color-chart-2)"
                fill="url(#colorPPR)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="Afore El"
                stackId="1"
                stroke="var(--color-chart-3)"
                fill="url(#colorAforeEl)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="Afore Ella"
                stackId="1"
                stroke="var(--color-chart-4)"
                fill="url(#colorAforeElla)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function WithdrawalsTab({ result }: ResultsPanelProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">
          Retiros: VPN vs Nominal
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          VPN = pesos de hoy (anio base). Nominal = pesos del anio
          correspondiente, ajustado por inflacion.
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Punto Clave</TableHead>
              <TableHead className="text-xs">Anio</TableHead>
              <TableHead className="text-xs">Fase</TableHead>
              <TableHead className="text-xs text-right">
                Retiro VPN /mes
              </TableHead>
              <TableHead className="text-xs text-right">
                Retiro Nominal /mes
              </TableHead>
              <TableHead className="text-xs text-right">
                Factor Inflacion
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
                    {kp.label}
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
                      F{kp.phase}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums">
                    {formatMXN(kp.vpnMonthly)}
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums font-bold">
                    {formatMXN(kp.nominalMonthly)}
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
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">
          Detalle Anual Completo
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sticky top-0 bg-card">
                  Anio
                </TableHead>
                <TableHead className="text-xs sticky top-0 bg-card">
                  Fase
                </TableHead>
                <TableHead className="text-xs text-right sticky top-0 bg-card">
                  Privada
                </TableHead>
                <TableHead className="text-xs text-right sticky top-0 bg-card">
                  PPR
                </TableHead>
                <TableHead className="text-xs text-right sticky top-0 bg-card">
                  Afore El
                </TableHead>
                <TableHead className="text-xs text-right sticky top-0 bg-card">
                  Afore Ella
                </TableHead>
                <TableHead className="text-xs text-right sticky top-0 bg-card font-bold">
                  Total
                </TableHead>
                <TableHead className="text-xs text-right sticky top-0 bg-card">
                  Retiro Anual
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
                      F{row.phase}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums">
                    {formatMXN(row.privada)}
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums">
                    {formatMXN(row.ppr)}
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums">
                    {formatMXN(row.aforeEl)}
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums">
                    {formatMXN(row.aforeElla)}
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums font-bold">
                    {formatMXN(row.total)}
                  </TableCell>
                  <TableCell className="text-xs text-right tabular-nums">
                    {row.withdrawalNominalAnnual > 0
                      ? formatMXN(row.withdrawalNominalAnnual)
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
  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="summary">Resumen</TabsTrigger>
        <TabsTrigger value="chart">Grafica</TabsTrigger>
        <TabsTrigger value="withdrawals">Retiros</TabsTrigger>
        <TabsTrigger value="full">Detalle</TabsTrigger>
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
