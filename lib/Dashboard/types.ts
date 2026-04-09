// lib/Dashboard/types.ts
export interface SubEvent {
  id: string
  name: string
  date: string
  startTime: string
  endTime: string
}

// Legacy type — kept for any remaining helpers that reference it
export interface Programme {
  id: string
  coupleNameA: string
  coupleNameB: string
  title: string
  dateFrom: string
  dateTo: string
  region: string
  currency: string
  format: string
  cultures: string[]
  subEvents: SubEvent[]
  guestEstimate: string
  budgetTarget: string
  priorities: string[]
  hasPlanner: boolean | null
  createdAt: string
}

// Supabase DB shape — used by Dashboard + ProgrammeCard
export interface SupabaseProgramme {
  id: string
  title: string
  format: string
  date_start: string | null
  date_end: string | null
  region: string | null
  currency: string
  couple_name_a: string | null
  couple_name_b: string | null
  guest_estimate: number | null  // ← CHANGED: number | null
  budget_target: number | null  // ← CHANGED: number | null
  event_count: number
}

export const FORMAT_LABELS: Record<string, string> = {
  'single_day': 'Single Day',
  'multi-day': 'Multi-Day',
  'destination': 'Destination',
  'interfaith': 'Interfaith',
  'civil_plus_cultural': 'Civil + Cultural',
  'custom': 'Custom',
}