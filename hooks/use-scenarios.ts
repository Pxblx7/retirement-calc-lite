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

  // ── Load from localStorage on mount (client-only) ──────────────────────────
  useEffect(() => {
    if (isLocalStorageAvailable) {
      const loaded = readScenarios()
      setScenarios(loaded)
      hasLoadedRef.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─── Mutations ─────────────────────────────────────────────────────────────
  // Each mutation writes directly to localStorage (no reactive write effect).
  // This avoids the race condition where a write effect fires with stale [] state.

  const saveScenario = useCallback(
    (name: string, config: SimConfig, result: SimulationResult | null): Scenario | null => {
      let newScenario: Scenario | null = null

      setScenarios((prev) => {
        if (prev.length >= MAX_SCENARIOS) return prev

        const slotIndex = prev.length
        const color: ScenarioColor = SCENARIO_COLORS[slotIndex]

        newScenario = {
          id: crypto.randomUUID(),
          name: name.trim() || `Escenario ${slotIndex + 1}`,
          config,
          result,
          createdAt: Date.now(),
          color,
        }

        const updated = [...prev, newScenario]
        if (isLocalStorageAvailable) writeScenarios(updated)
        return updated
      })

      return newScenario
    },
    [isLocalStorageAvailable]
  )

  const updateScenario = useCallback(
    (id: string, partial: Partial<Pick<Scenario, 'name' | 'config' | 'result'>>) => {
      setScenarios((prev) => {
        const updated = prev.map((s) => (s.id === id ? { ...s, ...partial } : s))
        if (isLocalStorageAvailable) writeScenarios(updated)
        return updated
      })
    },
    [isLocalStorageAvailable]
  )

  const deleteScenario = useCallback(
    (id: string) => {
      setScenarios((prev) => {
        const filtered = prev.filter((s) => s.id !== id)
        // Re-assign colors to remaining slots after deletion
        const recolored = filtered.map((s, i) => ({ ...s, color: SCENARIO_COLORS[i] }))
        if (isLocalStorageAvailable) writeScenarios(recolored)
        return recolored
      })
    },
    [isLocalStorageAvailable]
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
