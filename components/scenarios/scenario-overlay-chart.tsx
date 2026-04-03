'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Scenario, SCENARIO_COLOR_CLASSES } from '@/lib/scenario-types'
import { useI18n } from '@/lib/i18n'

interface ScenarioOverlayChartProps {
  scenarios: Scenario[]
}

// Merge all scenarios' year rows into a unified data array keyed by age
function buildChartData(scenarios: Scenario[]): Record<string, number | string>[] {
  const withResults = scenarios.filter((s) => s.result !== null)
  if (withResults.length === 0) return []

  // Collect all ages across all scenarios
  const ageSet = new Set<number>()
  withResults.forEach((s) => s.result!.years.forEach((y) => ageSet.add(y.age)))
  const ages = Array.from(ageSet).sort((a, b) => a - b)

  return ages.map((age) => {
    const row: Record<string, number | string> = { age }
    withResults.forEach((s) => {
      const yearRow = s.result!.years.find((y) => y.age === age)
      row[s.id] = yearRow ? yearRow.totalBalance : 0
    })
    return row
  })
}

// Compact currency formatter for Y axis (e.g. $1.2M, $450K)
function formatAxisValue(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value}`
}

// Custom tooltip showing all scenarios at a given age
function CustomTooltip({
  active,
  payload,
  label,
  scenarios,
  locale,
}: {
  active?: boolean
  payload?: { dataKey: string; value: number; color: string }[]
  label?: number
  scenarios: Scenario[]
  locale: string
}) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-xl border border-border bg-card shadow-xl px-4 py-3 text-xs flex flex-col gap-1.5">
      <p className="font-semibold text-foreground mb-1">
        {locale === 'es' ? `Edad ${label}` : `Age ${label}`}
      </p>
      {payload.map((entry) => {
        const scenario = scenarios.find((s) => s.id === entry.dataKey)
        if (!scenario) return null
        return (
          <div key={entry.dataKey} className="flex items-center gap-2">
            <span
              className="inline-block size-2.5 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{scenario.name}:</span>
            <span className="font-semibold">{formatAxisValue(entry.value)}</span>
          </div>
        )
      })}
    </div>
  )
}

export function ScenarioOverlayChart({ scenarios }: ScenarioOverlayChartProps) {
  const { locale } = useI18n()
  const withResults = scenarios.filter((s) => s.result !== null)
  const data = buildChartData(scenarios)

  if (withResults.length === 0 || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-border/40 bg-muted/20 text-sm text-muted-foreground">
        {locale === 'es'
          ? 'Simula al menos un escenario para ver la gráfica'
          : 'Simulate at least one scenario to see the chart'}
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border/40 bg-card p-5 flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-foreground">
        {locale === 'es' ? 'Evolución del patrimonio' : 'Wealth Evolution'}
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.5} />
          <XAxis
            dataKey="age"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
            className="fill-muted-foreground"
            label={{
              value: locale === 'es' ? 'Edad' : 'Age',
              position: 'insideBottom',
              offset: -2,
              fontSize: 11,
              className: 'fill-muted-foreground',
            }}
          />
          <YAxis
            tickFormatter={formatAxisValue}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
            className="fill-muted-foreground"
            width={58}
          />
          <Tooltip
            content={
              <CustomTooltip scenarios={withResults} locale={locale} />
            }
          />
          <Legend
            formatter={(value) => {
              const s = scenarios.find((sc) => sc.id === value)
              return (
                <span style={{ fontSize: 12, color: 'hsl(var(--foreground))' }}>
                  {s?.name ?? value}
                </span>
              )
            }}
          />
          {withResults.map((scenario) => (
            <Line
              key={scenario.id}
              type="monotone"
              dataKey={scenario.id}
              stroke={SCENARIO_COLOR_CLASSES[scenario.color].hex}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
