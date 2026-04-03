import { SimConfig, SimulationResult } from './simulation'

// ─── Scenario Colors ─────────────────────────────────────────────────────────

export type ScenarioColor = 'teal' | 'violet' | 'amber'

export const SCENARIO_COLORS: ScenarioColor[] = ['teal', 'violet', 'amber']

export const SCENARIO_COLOR_CLASSES: Record<
  ScenarioColor,
  { border: string; badge: string; badgeBg: string; hex: string }
> = {
  teal: {
    border:  'border-teal-500',
    badge:   'text-teal-400',
    badgeBg: 'bg-teal-500/20',
    hex:     '#14b8a6',
  },
  violet: {
    border:  'border-violet-500',
    badge:   'text-violet-400',
    badgeBg: 'bg-violet-500/20',
    hex:     '#8b5cf6',
  },
  amber: {
    border:  'border-amber-500',
    badge:   'text-amber-400',
    badgeBg: 'bg-amber-500/20',
    hex:     '#f59e0b',
  },
}

// ─── Scenario Type ────────────────────────────────────────────────────────────

export interface Scenario {
  /** Unique identifier — generated via crypto.randomUUID() */
  id: string

  /** User-editable display name, e.g. "Retiro a los 52" */
  name: string

  /** Full simulation config snapshot */
  config: SimConfig

  /** Computed result — null until the scenario has been simulated */
  result: SimulationResult | null

  /** Unix timestamp (Date.now()) when the scenario was saved */
  createdAt: number

  /** Visual color slot — determined by position in the store (max 3) */
  color: ScenarioColor
}

export const MAX_SCENARIOS = 3
export const SCENARIOS_STORAGE_KEY = 'retiro_mx_scenarios'
