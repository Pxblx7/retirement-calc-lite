'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil, Trash2, ArrowUpRight, Trophy, Check } from 'lucide-react'
import { Scenario, SCENARIO_COLOR_CLASSES } from '@/lib/scenario-types'
import { formatCurrency } from '@/lib/simulation'
import { useI18n } from '@/lib/i18n'

interface ScenarioCardProps {
  scenario: Scenario
  isWinner: boolean
  onDelete: (id: string) => void
  onRename: (id: string, newName: string) => void
}

export function ScenarioCard({ scenario, isWinner, onDelete, onRename }: ScenarioCardProps) {
  const { locale } = useI18n()
  const [isRenaming, setIsRenaming] = useState(false)
  const [nameInput, setNameInput] = useState(scenario.name)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const colors = SCENARIO_COLOR_CLASSES[scenario.color]
  const r = scenario.result

  const handleRenameStart = () => {
    setNameInput(scenario.name)
    setIsRenaming(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleRenameCommit = () => {
    const trimmed = nameInput.trim()
    if (trimmed && trimmed !== scenario.name) {
      onRename(scenario.id, trimmed)
    }
    setIsRenaming(false)
  }

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDelete(scenario.id)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  const retirementAge = scenario.config.retirementAge

  return (
    <div
      className={`relative flex flex-col rounded-2xl border-2 bg-card p-5 gap-4 transition-shadow hover:shadow-lg ${colors.border}`}
    >
      {/* Winner badge */}
      {isWinner && (
        <span
          className={`flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold mb-[-8px] ${colors.badgeBg} ${colors.badge} border ${colors.border}`}
        >
          <Trophy className="size-3" />
          {locale === 'es' ? 'Mejor pensión' : 'Best pension'}
        </span>
      )}

      {/* Name + actions */}
      <div className="flex items-start justify-between gap-2">
        {isRenaming ? (
          <div className="flex items-center gap-1.5 flex-1">
            <Input
              ref={inputRef}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleRenameCommit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameCommit()
                if (e.key === 'Escape') setIsRenaming(false)
              }}
              className="h-7 text-sm font-semibold"
              maxLength={40}
            />
            <Button size="icon" variant="ghost" className="size-7" onClick={handleRenameCommit}>
              <Check className="size-3.5" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate">{scenario.name}</h3>
            <button
              onClick={handleRenameStart}
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Rename scenario"
            >
              <Pencil className="size-3.5" />
            </button>
          </div>
        )}

        {/* Retirement age badge */}
        <span className={`shrink-0 text-xs font-bold rounded-full px-2 py-0.5 ${colors.badgeBg} ${colors.badge}`}>
          {locale === 'es' ? `Retiro ${retirementAge}` : `Retire ${retirementAge}`}
        </span>
      </div>

      {/* Pension breakdown */}
      {r ? (
        <div className="flex flex-col gap-2">
          <PensionRow
            label={locale === 'es' ? 'AFORE' : 'AFORE'}
            future={r.afore.futureMonthly}
            npv={r.afore.vpnMonthly}
          />
          <PensionRow
            label="PPR"
            future={r.ppr.futureMonthly}
            npv={r.ppr.vpnMonthly}
          />
          <PensionRow
            label={locale === 'es' ? 'Ahorro Privado' : 'Private Savings'}
            future={r.private.futureMonthly}
            npv={r.private.vpnMonthly}
          />
          <div className={`mt-1 flex items-center justify-between rounded-lg px-3 py-2 ${colors.badgeBg}`}>
            <span className={`text-sm font-bold ${colors.badge}`}>
              {locale === 'es' ? 'Total' : 'Total'}
            </span>
            <div className="text-right">
              <p className={`text-base font-bold ${colors.badge}`}>
                {formatCurrency(r.total.vpnMonthly)}<span className="text-xs font-normal opacity-70">/mes (VPN)</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(r.total.futureMonthly)}/mes (Futuro)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 items-center justify-center py-6 text-center text-muted-foreground text-sm">
          <p>{locale === 'es' ? 'Sin resultados — carga y simula este escenario.' : 'No results — load and simulate this scenario.'}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-border/50">
        <Link href={`/?scenario=${scenario.id}`} className="flex-1">
          <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs">
            <ArrowUpRight className="size-3.5" />
            {locale === 'es' ? 'Cargar en simulador' : 'Load in simulator'}
          </Button>
        </Link>
        <Button
          size="sm"
          variant={confirmDelete ? 'destructive' : 'ghost'}
          onClick={handleDeleteClick}
          className="gap-1 text-xs"
        >
          <Trash2 className="size-3.5" />
          {confirmDelete
            ? (locale === 'es' ? '¿Confirmar?' : 'Confirm?')
            : (locale === 'es' ? 'Eliminar' : 'Delete')}
        </Button>
      </div>
    </div>
  )
}

// ─── Helper sub-component ─────────────────────────────────────────────────────

function PensionRow({
  label,
  future,
  npv,
}: {
  label: string
  future: number
  npv: number
}) {
  return (
    <div className="flex items-center justify-between px-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="text-right">
        <p className="text-sm font-medium">{formatCurrency(npv)} <span className="text-[10px] text-muted-foreground">VPN</span></p>
        <p className="text-xs text-muted-foreground">{formatCurrency(future)}/mes</p>
      </div>
    </div>
  )
}
