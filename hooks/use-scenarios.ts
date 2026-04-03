'use client'

import { useState, useEffect, useCallback } from 'react'
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
    // Corrupted data — start fresh
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
  /** Save a new scenario (max 3). Returns the saved scenario or null if at limit. */
  saveScenario: (name: string, config: SimConfig, result: SimulationResult | null) => Scenario | null
  /** Update an existing scenario by id (partial update). */
  updateScenario: (id: string, partial: Partial<Pick<Scenario, 'name' | 'config' | 'result'>>) => void
  /** Delete a scenario by id. */
  deleteScenario: (id: string) => void
  /** True when the max number of scenarios has been saved. */
  isFull: boolean
}

export function useScenarios(): UseScenariosReturn {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [isLocalStorageAvailable] = useState<boolean>(() => isStorageAvailable())

  // Load from localStorage on mount (client-only)
  useEffect(() => {
    if (isLocalStorageAvailable) {
      setScenarios(readScenarios())
    }
  }, [isLocalStorageAvailable])

  // Persist to localStorage whenever scenarios change
  useEffect(() => {
    if (!isLocalStorageAvailable) return
    try {
      writeScenarios(scenarios)
    } catch {
      // Quota error is surfaced per-operation in saveScenario
    }
  }, [scenarios, isLocalStorageAvailable])

  const saveScenario = useCallback(
    (name: string, config: SimConfig, result: SimulationResult | null): Scenario | null => {
      if (scenarios.length >= MAX_SCENARIOS) return null

      const slotIndex = scenarios.length
      const color: ScenarioColor = SCENARIO_COLORS[slotIndex]

      const newScenario: Scenario = {
        id: crypto.randomUUID(),
        name: name.trim() || `Escenario ${slotIndex + 1}`,
        config,
        result,
        createdAt: Date.now(),
        color,
      }

      setScenarios((prev) => {
        const updated = [...prev, newScenario]
        if (isLocalStorageAvailable) {
          try {
            writeScenarios(updated)
          } catch {
            // Will be shown by the component via a toast
          }
        }
        return updated
      })

      return newScenario
    },
    [scenarios.length, isLocalStorageAvailable]
  )

  const updateScenario = useCallback(
    (id: string, partial: Partial<Pick<Scenario, 'name' | 'config' | 'result'>>) => {
      setScenarios((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...partial } : s))
      )
    },
    []
  )

  const deleteScenario = useCallback((id: string) => {
    setScenarios((prev) => {
      // Re-assign colors to remaining scenarios by position
      const filtered = prev.filter((s) => s.id !== id)
      return filtered.map((s, i) => ({ ...s, color: SCENARIO_COLORS[i] }))
    })
  }, [])

  return {
    scenarios,
    isLocalStorageAvailable,
    saveScenario,
    updateScenario,
    deleteScenario,
    isFull: scenarios.length >= MAX_SCENARIOS,
  }
}
