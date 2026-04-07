export interface SubEvent {
  id: string
  name: string
  date: string
  startTime: string
  endTime: string
}

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

export const FORMAT_LABELS: Record<string, string> = {
  'single-day':  'Single Day',
  'multi-day':   'Multi-Day',
  'destination': 'Destination',
  'custom':      'Custom',
}