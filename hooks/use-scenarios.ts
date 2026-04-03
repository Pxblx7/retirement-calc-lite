'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Scenario,
  ScenarioColor,
  SCENARIO_COLORS,
  SCENARIOS_STORAGE_KEY,
  MAX_SCENARIOS,
} from '@/lib/scenario-types'
import { SimConfig, SimulationResult } from '@/lib/simulation'

// ─── localStorage helpers ─────────────────────────────────────────────────────

function isStorageAvailable(): boolean {
  try {
    const test = '__retiro_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

function readScenarios(): Scenario[] {
  try {
    const raw = localStorage.getItem(SCENARIOS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as Scenario[]
  } catch {
    return []
  }
}

function writeScenarios(scenarios: Scenario[]): void {
  try {
    localStorage.setItem(SCENARIOS_STORAGE_KEY, JSON.stringify(scenarios))
    // Notify all other useScenarios instances on the same page
    window.dispatchEvent(new Event('retiro:scenarios:updated'))
  } catch (e: unknown) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      throw new Error('QUOTA_EXCEEDED')
    }
    throw e
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseScenariosReturn {
  scenarios: Scenario[]
  isLocalStorageAvailable: boolean
  saveScenario: (name: string, config: SimConfig, result: SimulationResult | null) => Scenario | null
  updateScenario: (id: string, partial: Partial<Pick<Scenario, 'name' | 'config' | 'result'>>) => void
  deleteScenario: (id: string) => void
  isFull: boolean
}

export function useScenarios(): UseScenariosReturn {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [isLocalStorageAvailable] = useState<boolean>(() => isStorageAvailable())

  // Track whether the initial load from localStorage has completed.
  // This prevents the mutation functions from writing an empty array
  // over real data before the mount read has finished.
  const hasLoadedRef = useRef(false)

  // ── Load from localStorage on mount + cross-instance sync ─────────────────
  useEffect(() => {
    if (!isLocalStorageAvailable) return
    const loaded = readScenarios()
    setScenarios(loaded)
    hasLoadedRef.current = true

    // When another useScenarios instance on the SAME page writes to localStorage,
    // browsers fire 'storage' only for OTHER tabs. For same-page cross-instance
    // sync we dispatch a custom event from the write helpers below.
    const onSync = () => setScenarios(readScenarios())
    window.addEventListener('retiro:scenarios:updated', onSync)
    return () => window.removeEventListener('retiro:scenarios:updated', onSync)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─── Mutations ─────────────────────────────────────────────────────────────
  // Each mutation writes directly to localStorage (no reactive write effect).
  // This avoids the race condition where a write effect fires with stale [] state.

  const saveScenario = useCallback(
    (name: string, config: SimConfig, result: SimulationResult | null): Scenario | null => {
      if (scenarios.length >= MAX_SCENARIOS) return null

      const slotIndex = scenarios.length
      const color: ScenarioColor = SCENARIO_COLORS[slotIndex]

      const newScenario: Scenario = {
        id: Math.random().toString(36).slice(2) + Date.now().toString(36),
        name: name.trim() || `Escenario ${slotIndex + 1}`,
        config,
        result,
        createdAt: Date.now(),
        color,
      }

      const updated = [...scenarios, newScenario]
      if (isLocalStorageAvailable) writeScenarios(updated)
      setScenarios(updated)

      return newScenario
    },
    [scenarios, isLocalStorageAvailable]
  )

  const updateScenario = useCallback(
    (id: string, partial: Partial<Pick<Scenario, 'name' | 'config' | 'result'>>) => {
      const updated = scenarios.map((s) => (s.id === id ? { ...s, ...partial } : s))
      if (isLocalStorageAvailable) writeScenarios(updated)
      setScenarios(updated)
    },
    [scenarios, isLocalStorageAvailable]
  )

  const deleteScenario = useCallback(
    (id: string) => {
      const filtered = scenarios.filter((s) => s.id !== id)
      // Re-assign colors to remaining slots after deletion
      const recolored = filtered.map((s, i) => ({ ...s, color: SCENARIO_COLORS[i] }))
      if (isLocalStorageAvailable) writeScenarios(recolored)
      setScenarios(recolored)
    },
    [scenarios, isLocalStorageAvailable]
  )

  return {
    scenarios,
    isLocalStorageAvailable,
    saveScenario,
    updateScenario,
    deleteScenario,
    isFull: scenarios.length >= MAX_SCENARIOS,
  }
}
