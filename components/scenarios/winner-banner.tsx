'use client'

import { Scenario, SCENARIO_COLOR_CLASSES } from '@/lib/scenario-types'
import { formatCurrency } from '@/lib/simulation'
import { Trophy } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

interface WinnerBannerProps {
  scenarios: Scenario[]
}

export function WinnerBanner({ scenarios }: WinnerBannerProps) {
  const { locale } = useI18n()

  // Need at least 2 scenarios with results to show a winner
  const withResults = scenarios.filter((s) => s.result !== null)
  if (withResults.length < 2) return null

  const winner = withResults.reduce((best, s) =>
    (s.result!.total.vpnMonthly > best.result!.total.vpnMonthly) ? s : best
  )

  const colors = SCENARIO_COLOR_CLASSES[winner.color]
  const amount = formatCurrency(winner.result!.total.vpnMonthly)

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-5 py-3 ${colors.border} ${colors.badgeBg}`}
    >
      <Trophy className={`size-5 shrink-0 ${colors.badge}`} />
      <p className="text-sm font-medium">
        <span className={`font-bold ${colors.badge}`}>{winner.name}</span>
        {' '}
        <span className="text-foreground/80">
          {locale === 'es'
            ? `genera la mayor pensión total: ${amount}/mes (VPN)`
            : `generates the highest total pension: ${amount}/month (NPV)`}
        </span>
      </p>
    </div>
  )
}
