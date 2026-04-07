import type { Programme } from './types'

export function loadAllProgrammes(): Programme[] {
  try {
    const raw = localStorage.getItem('vow-programmes')
    if (raw) return JSON.parse(raw) as Programme[]

    const legacy = localStorage.getItem('vow-programme')
    if (legacy) {
      const p = JSON.parse(legacy) as Programme
      const list = [p]
      localStorage.setItem('vow-programmes', JSON.stringify(list))
      localStorage.removeItem('vow-programme')
      return list
    }
  } catch {}
  return []
}

export function saveAllProgrammes(list: Programme[]) {
  localStorage.setItem('vow-programmes', JSON.stringify(list))
}

export function daysUntil(dateStr: string): number | null {
  if (!dateStr) return null
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000)
}

export function formatWeddingDate(dateStr: string): string | null {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}