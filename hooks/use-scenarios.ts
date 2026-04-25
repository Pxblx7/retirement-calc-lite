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
import { SimConfig, SimulationResult, getDefaultConfig } from '@/lib/simulation'
import { PPRConfig } from '@/lib/ppr-helpers'

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

function sanitizeConfig(config: any): SimConfig {
  const defaultCfg = getDefaultConfig()
  if (!config || typeof config !== 'object') return defaultCfg
  // pprList is persisted inside the config JSONB blob but isn't part of SimConfig
  // (it's hoisted to the top-level Scenario.pprList field). Strip it here.
  const { pprList: _pprList, ...rest } = config
  return {
    ...defaultCfg,
    ...rest,
    afore: { ...defaultCfg.afore, ...(rest.afore || {}) },
    ppr: { ...defaultCfg.ppr, ...(rest.ppr || {}) },
    private: { ...defaultCfg.private, ...(rest.private || {}) },
  }
}

function extractPPRList(rawConfig: any): PPRConfig[] | undefined {
  const list = rawConfig?.pprList
  if (!Array.isArray(list) || list.length === 0) return undefined
  return list as PPRConfig[]
}

function sanitizeResult(result: any): SimulationResult | null {
  if (!result || typeof result !== 'object') return null
  if (!result.total || typeof result.total.vpnMonthly !== 'number') return null
  if (!result.afore || !result.ppr || !result.private) return null
  return result as SimulationResult
}

function readLocalScenarios(): Scenario[] {
  try {
    const raw = localStorage.getItem(SCENARIOS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map((s: any) => ({
      ...s,
      config: sanitizeConfig(s.config),
      result: sanitizeResult(s.result),
      pprList: extractPPRList(s.config),
    })) as Scenario[]
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
  config: sanitizeConfig(dbRow.config),
  result: sanitizeResult(dbRow.result),
  createdAt: new Date(dbRow.created_at || Date.now()).getTime(),
  color: SCENARIO_COLORS[index] || SCENARIO_COLORS[0],
  pprList: extractPPRList(dbRow.config),
})

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseScenariosReturn {
  scenarios: Scenario[]
  isLocalStorageAvailable: boolean
  saveScenario: (
    name: string,
    config: SimConfig,
    result: SimulationResult | null,
    pprList?: PPRConfig[],
  ) => Promise<Scenario | null>
  updateScenario: (
    id: string,
    partial: Partial<Pick<Scenario, 'name' | 'config' | 'result' | 'pprList'>>,
  ) => Promise<void>
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
                // Re-embed pprList into config so per-account state survives the cloud migration.
                config: s.pprList && s.pprList.length > 0
                  ? { ...s.config, pprList: s.pprList }
                  : s.config,
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
    async (
      name: string,
      config: SimConfig,
      result: SimulationResult | null,
      pprList?: PPRConfig[],
    ): Promise<Scenario | null> => {
      if (scenarios.length >= MAX_SCENARIOS) return null

      const slotIndex = scenarios.length
      const finalName = name.trim() || `Escenario ${slotIndex + 1}`
      // Embed pprList inside the config JSONB so persistence survives without a schema change.
      const persistedConfig = pprList && pprList.length > 0 ? { ...config, pprList } : config

      if (user) {
        const { data, error } = await supabase
          .from('scenarios')
          .insert({
            user_id: user.id,
            name: finalName,
            config: persistedConfig,
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
          pprList,
        }
        // Persist with pprList embedded inside config so readLocalScenarios picks it up on reload.
        const persisted: Scenario = { ...newScenario, config: persistedConfig }
        const updated = [...scenarios, persisted]
        if (isLocalStorageAvailable) writeLocalScenarios(updated)
        setScenarios([...scenarios, newScenario])
        return newScenario
      }
    },
    [scenarios, isLocalStorageAvailable, user, supabase]
  )

  const updateScenario = useCallback(
    async (id: string, partial: Partial<Pick<Scenario, 'name' | 'config' | 'result' | 'pprList'>>) => {
      // If config and/or pprList are part of this update, embed pprList inside the config JSONB
      // so persistence rules stay consistent with saveScenario.
      const existing = scenarios.find((s) => s.id === id)
      const nextConfig = partial.config ?? existing?.config
      const nextPPRList = 'pprList' in partial ? partial.pprList : existing?.pprList
      const dbPartial: Record<string, unknown> = {}
      if (partial.name !== undefined) dbPartial.name = partial.name
      if (partial.result !== undefined) dbPartial.result = partial.result
      if (partial.config !== undefined || 'pprList' in partial) {
        dbPartial.config = nextPPRList && nextPPRList.length > 0
          ? { ...(nextConfig as SimConfig), pprList: nextPPRList }
          : nextConfig
      }

      if (user) {
        const { error } = await supabase
          .from('scenarios')
          .update(dbPartial)
          .eq('id', id)

        if (!error) {
          setScenarios(prev => prev.map(s => s.id === id ? { ...s, ...partial } : s))
        }
      } else {
        // For localStorage we re-embed pprList in config so a fresh read round-trips correctly.
        const persistedScenarios = scenarios.map((s) => {
          if (s.id !== id) return s
          const merged: Scenario = { ...s, ...partial }
          const embed = merged.pprList && merged.pprList.length > 0
            ? { ...merged.config, pprList: merged.pprList }
            : merged.config
          return { ...merged, config: embed as SimConfig }
        })
        if (isLocalStorageAvailable) writeLocalScenarios(persistedScenarios)
        setScenarios(scenarios.map((s) => (s.id === id ? { ...s, ...partial } : s)))
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
