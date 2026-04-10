// lib/types/supabase.ts
export interface SupabaseProgrammeRow {
  id: string
  owner_id: string
  title: string
  format: string
  date_start: string | null
  date_end: string | null
  region: string | null
  currency: string
  couple_name_a: string | null
  couple_name_b: string | null
  guest_estimate: string | null
  budget_target: string | null
  priorities: string[]
}

export interface SupabaseEventRow {
  id: string
  title: string
  event_date: string | null
  start_time: string | null
  end_time: string | null
}

export interface SupabaseProgrammeRPCResult extends SupabaseProgrammeRow {
  events: SupabaseEventRow[]
  culture_modules: string[]
}