export type WeddingFormat = 'single-day' | 'multi-day' | 'destination' | 'custom'
export type CultureModule = 'hindu' | 'muslim' | 'christian' | 'civil' | 'blended'

export interface SubEvent {
  id: string
  name: string
  date: string
  startTime: string
  endTime: string
}

export interface ProgrammeData {
  step: number
  coupleNameA: string
  coupleNameB: string
  title: string
  dateFrom: string
  dateTo: string
  region: string
  currency: string
  format: WeddingFormat | ''
  cultures: CultureModule[]
  subEvents: SubEvent[]
  guestEstimate: string
  budgetTarget: string
  priorities: string[]
  hasPlanner: boolean | null
}

export const EMPTY: ProgrammeData = {
  step: 1,
  coupleNameA: '', coupleNameB: '',
  title: '', dateFrom: '', dateTo: '',
  region: '', currency: 'GBP',
  format: '', cultures: [], subEvents: [],
  guestEstimate: '', budgetTarget: '',
  priorities: [], hasPlanner: null,
}