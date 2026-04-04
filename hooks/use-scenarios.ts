'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
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

function readLocalScenarios(): Scenario[] {
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

function writeLocalScenarios(scenarios: Scenario[]): void {
  try {
    localStorage.setItem(SCENARIOS_STORAGE_KEY, JSON.stringify(scenarios))
    window.dispatchEvent(new Event('retiro:scenarios:updated'))
  } catch (e: unknown) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      throw new Error('QUOTA_EXCEEDED')
    }
    throw e
  }
}

function clearLocalScenarios(): void {
  try {
    localStorage.removeItem(SCENARIOS_STORAGE_KEY)
    window.dispatchEvent(new Event('retiro:scenarios:updated'))
  } catch {}
}

const mapSupabaseToScenario = (dbRow: any, index: number): Scenario => ({
  id: dbRow.id,
  name: dbRow.name,
  config: dbRow.config,
  result: dbRow.result,
  createdAt: new Date(dbRow.created_at).getTime(),
  color: SCENARIO_COLORS[index] || SCENARIO_COLORS[0],
})

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseScenariosReturn {
  scenarios: Scenario[]
  isLocalStorageAvailable: boolean
  saveScenario: (name: string, config: SimConfig, result: SimulationResult | null) => Promise<Scenario | null>
  updateScenario: (id: string, partial: Partial<Pick<Scenario, 'name' | 'config' | 'result'>>) => Promise<void>
  deleteScenario: (id: string) => Promise<void>
  isFull: boolean
  isLoading: boolean
  user: User | null
}

import React, { createContext, useContext } from 'react'

const ScenariosContext = createContext<UseScenariosReturn | null>(null)

export function ScenariosProvider({ children }: { children: React.ReactNode }) {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [isLocalStorageAvailable] = useState<boolean>(() => isStorageAvailable())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const supabase = createClient()
  // Prevents concurrent loadScenarios executions — set synchronously
  // BEFORE the first await so parallel calls are blocked at entry, not
  // mid-flight (which was the root cause of the 3× migration bug).
  const isLoadingRef = useRef(false)

  // Fetch scenarios from Supabase depending on auth state
  const loadScenarios = useCallback(async (currentUser: User | null) => {
    // Synchronous guard — must be set BEFORE any await so that parallel
    // calls (e.g. getSession + onAuthStateChange firing together) are
    // blocked at entry rather than racing through the migration logic.
    if (isLoadingRef.current) return
    isLoadingRef.current = true

    try {
      setIsLoading(true)
      if (currentUser) {
        // Cloud Scenarios
        const { data, error } = await supabase
          .from('scenarios')
          .select('*')
          .order('created_at', { ascending: true })

        if (!error && data) {
          const cloudScenarios = data.map(mapSupabaseToScenario)

          if (cloudScenarios.length === 0) {
            // Auto-migration: cloud is empty → promote localStorage scenarios
            const local = readLocalScenarios()
            if (local.length > 0) {
              const insertData = local.map(s => ({
                user_id: currentUser.id,
                name: s.name,
                config: s.config,
                result: s.result,
              }))
              const { data: migratedData, error: migrationError } = await supabase
                .from('scenarios')
                .insert(insertData)
                .select()

              if (!migrationError && migratedData) {
                setScenarios(migratedData.map(mapSupabaseToScenario))
                clearLocalScenarios()
              }
            } else {
              setScenarios([])
            }
          } else {
            setScenarios(cloudScenarios)
          }
        }
      } else {
        // Local Scenarios
        setScenarios(readLocalScenarios())
      }
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
    }
  }, [supabase])

  // Initial Auth Mount & Sync
  // NOTE: onAuthStateChange fires INITIAL_SESSION immediately on mount with
  // the current session, so a separate getSession() call is redundant.
  // Having both was one of the triggers for the 3× migration race condition.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      loadScenarios(currentUser)
    })

    return () => subscription.unsubscribe()
  }, [loadScenarios, supabase])

  // Cross-tab sync for unauthenticated local storage users
  useEffect(() => {
    if (!isLocalStorageAvailable || user) return
    const onSync = () => setScenarios(readLocalScenarios())
    window.addEventListener('retiro:scenarios:updated', onSync)
    return () => window.removeEventListener('retiro:scenarios:updated', onSync)
  }, [isLocalStorageAvailable, user])

  // ─── Mutations ─────────────────────────────────────────────────────────────

  const saveScenario = useCallback(
    async (name: string, config: SimConfig, result: SimulationResult | null): Promise<Scenario | null> => {
      if (scenarios.length >= MAX_SCENARIOS) return null

      const slotIndex = scenarios.length
      const finalName = name.trim() || `Escenario ${slotIndex + 1}`

      if (user) {
        const { data, error } = await supabase
          .from('scenarios')
          .insert({
            user_id: user.id,
            name: finalName,
            config,
            result,
          })
          .select()
          .single()

        if (error) {
          console.error('Error saving to Supabase:', error)
          return null
        }
        
        const newCloudScenario = mapSupabaseToScenario(data, slotIndex)
        setScenarios(prev => [...prev, newCloudScenario])
        return newCloudScenario
      } else {
        const newScenario: Scenario = {
          id: Math.random().toString(36).slice(2) + Date.now().toString(36),
          name: finalName,
          config,
          result,
          createdAt: Date.now(),
          color: SCENARIO_COLORS[slotIndex],
        }
        const updated = [...scenarios, newScenario]
        if (isLocalStorageAvailable) writeLocalScenarios(updated)
        setScenarios(updated)
        return newScenario
      }
    },
    [scenarios, isLocalStorageAvailable, user, supabase]
  )

  const updateScenario = useCallback(
    async (id: string, partial: Partial<Pick<Scenario, 'name' | 'config' | 'result'>>) => {
      if (user) {
        const { error } = await supabase
          .from('scenarios')
          .update(partial)
          .eq('id', id)
          
        if (!error) {
          setScenarios(prev => prev.map(s => s.id === id ? { ...s, ...partial } : s))
        }
      } else {
        const updated = scenarios.map((s) => (s.id === id ? { ...s, ...partial } : s))
        if (isLocalStorageAvailable) writeLocalScenarios(updated)
        setScenarios(updated)
      }
    },
    [scenarios, isLocalStorageAvailable, user, supabase]
  )

  const deleteScenario = useCallback(
    async (id: string) => {
      if (user) {
        const { error } = await supabase.from('scenarios').delete().eq('id', id)
        if (!error) {
          setScenarios(prev => {
            const filtered = prev.filter(s => s.id !== id)
            return filtered.map((s, i) => ({ ...s, color: SCENARIO_COLORS[i] }))
          })
        }
      } else {
        const filtered = scenarios.filter((s) => s.id !== id)
        const recolored = filtered.map((s, i) => ({ ...s, color: SCENARIO_COLORS[i] }))
        if (isLocalStorageAvailable) writeLocalScenarios(recolored)
        setScenarios(recolored)
      }
    },
    [scenarios, isLocalStorageAvailable, user, supabase]
  )

  const value = {
    scenarios,
    isLocalStorageAvailable,
    saveScenario,
    updateScenario,
    deleteScenario,
    isFull: scenarios.length >= MAX_SCENARIOS,
    isLoading,
    user,
  }

  return React.createElement(ScenariosContext.Provider, { value }, children)
}

export function useScenarios() {
  const context = useContext(ScenariosContext)
  if (!context) {
    throw new Error('useScenarios must be used within a ScenariosProvider')
  }
  return context
}
