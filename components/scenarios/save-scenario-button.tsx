'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BookmarkPlus, BarChart3, Check } from 'lucide-react'
import { useScenarios } from '@/hooks/use-scenarios'
import { SimConfig, SimulationResult } from '@/lib/simulation'
import { MAX_SCENARIOS } from '@/lib/scenario-types'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'

interface SaveScenarioButtonProps {
  config: SimConfig
  result: SimulationResult
  /** If set, the button becomes "Update scenario" mode */
  editingScenarioId?: string | null
}

export function SaveScenarioButton({
  config,
  result,
  editingScenarioId,
}: SaveScenarioButtonProps) {
  const { scenarios, saveScenario, updateScenario, isFull } = useScenarios()
  const { locale } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [quotaError, setQuotaError] = useState(false)

  // Reset saved status if the user runs a new simulation
  useEffect(() => {
    setSaved(false)
    setSavedId(null)
    setIsOpen(false)
  }, [result])

  const isEditing = !!editingScenarioId

  const defaultName =
    locale === 'es'
      ? `Escenario ${scenarios.length + 1}`
      : `Scenario ${scenarios.length + 1}`

  const [isSaving, setIsSaving] = useState(false)

  const handleOpen = async () => {
    if (isEditing) {
      setIsSaving(true)
      await updateScenario(editingScenarioId!, { config, result })
      setIsSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      return
    }
    setName(defaultName)
    setIsOpen(true)
    setSaved(false)
    setSavedId(null)
    setQuotaError(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    const scenario = await saveScenario(name || defaultName, config, result)
    setIsSaving(false)
    if (!scenario) {
      setIsOpen(false)
      return
    }
    setSavedId(scenario.id)
    setSaved(true)
    setIsOpen(false)
  }

  // Already saved — show success state
  if (saved && !isEditing) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="flex items-center gap-1.5 text-sm text-emerald-400 font-medium">
          <Check className="size-4" />
          {locale === 'es' ? 'Escenario guardado' : 'Scenario saved'}
        </span>
        {savedId && (
          <Link href="/comparar" className="text-sm text-primary underline underline-offset-2 font-medium">
            {locale === 'es' ? 'Ver comparación →' : 'View comparison →'}
          </Link>
        )}
      </div>
    )
  }

  // Updated scenario
  if (saved && isEditing) {
    return (
      <span className="flex items-center gap-1.5 text-sm text-emerald-400 font-medium">
        <Check className="size-4" />
        {locale === 'es' ? 'Escenario actualizado' : 'Scenario updated'}
      </span>
    )
  }

  // Full — cannot add more
  if (isFull && !isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled className="gap-1.5 opacity-50 cursor-not-allowed">
          <BookmarkPlus className="size-4" />
          {locale === 'es' ? 'Guardar escenario' : 'Save scenario'}
        </Button>
        <span className="text-xs text-muted-foreground">
          {locale === 'es' ? `Máximo ${MAX_SCENARIOS} escenarios` : `Max ${MAX_SCENARIOS} scenarios`}
        </span>
        <Link href="/comparar">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <BarChart3 className="size-4" />
            {locale === 'es' ? 'Ver comparación' : 'View comparison'}
          </Button>
        </Link>
      </div>
    )
  }

  // Name input open
  if (isOpen) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <Input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder={defaultName}
          className="h-8 w-44 text-sm"
          maxLength={40}
          disabled={isSaving}
        />
        <Button size="sm" onClick={handleSave} disabled={isSaving} className="gap-1.5">
          {isSaving ? <span className="animate-spin text-lg leading-none">⟳</span> : <Check className="size-4" />}
          {locale === 'es' ? (isSaving ? 'Guardando...' : 'Guardar') : (isSaving ? 'Saving...' : 'Save')}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setIsOpen(false)} disabled={isSaving}>
          {locale === 'es' ? 'Cancelar' : 'Cancel'}
        </Button>
        {quotaError && (
          <span className="text-xs text-destructive">
            {locale === 'es' ? 'Espacio lleno — elimina un escenario.' : 'Storage full — delete a scenario.'}
          </span>
        )}
      </div>
    )
  }

  // Default button
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleOpen}
      disabled={isSaving}
      className="gap-1.5"
    >
      {isSaving ? <span className="animate-spin text-lg leading-none">⟳</span> : <BookmarkPlus className="size-4" />}
      {isEditing
        ? (locale === 'es' ? (isSaving ? 'Actualizando...' : 'Actualizar escenario') : (isSaving ? 'Updating...' : 'Update scenario'))
        : (locale === 'es' ? 'Guardar como escenario' : 'Save as scenario')}
    </Button>
  )
}
