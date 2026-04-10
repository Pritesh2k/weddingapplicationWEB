import type { CultureModule } from './types'
import type { ProgrammeData } from './types'

export const SUGGESTED_EVENTS: Record<CultureModule, string[]> = {
  hindu: ['Mehendi', 'Haldi', 'Sangeet', 'Wedding Ceremony', 'Reception'],
  muslim: ['Nikah', 'Walima', 'Family Gathering'],
  christian: ['Rehearsal & Blessing', 'Wedding Ceremony', 'Reception'],
  civil: ['Legal Ceremony', 'Reception', 'Celebration'],
  blended: ['Opening Gathering', 'Ceremony Stream A', 'Ceremony Stream B', 'Combined Reception'],
}

export const CURRENCIES = ['GBP', 'USD', 'EUR', 'AED', 'INR', 'CAD', 'AUD']

export const PRIORITIES = [
  'Guest Experience',
  'Budget Control',
  'Cultural Authenticity',
  'Vendor Quality',
  'Timeline Precision',
  'Decor & Aesthetics',
  'Intimate Atmosphere',
  'Photography & Film',
  'Food & Drink Quality',
  'Sustainability',
  'Family Involvement',
  'Music & Entertainment',
]

export const FORMATS = [
  {
    value: 'single_day',
    label: 'Single-day wedding',
    description: 'Everything happens on one main day.',
  },
  {
    value: 'multi_day',
    label: 'Multi-day wedding',
    description: 'Spread your celebration across multiple days.',
  },
  {
    value: 'festival_style',
    label: 'Festival-style wedding',
    description: 'A more immersive celebration with several moments and gatherings.',
  },
] as const

export const CULTURES = [
  { value: 'hindu', label: 'Hindu', emoji: '🪔' },
  { value: 'muslim', label: 'Muslim', emoji: '☪️' },
  { value: 'christian', label: 'Christian', emoji: '⛪' },
  { value: 'civil', label: 'Civil', emoji: '🏛️' },
  { value: 'blended', label: 'Blended', emoji: '✨' },
] as const

export const STEPS = [
  { n: 1, label: 'Couple' },
  { n: 2, label: 'Programme' },
  { n: 3, label: 'Format' },
  { n: 4, label: 'Traditions' },
  { n: 5, label: 'Events' },
  { n: 6, label: 'Constraints' },
]

export const EMPTY: ProgrammeData = {
  step: 1,
  coupleNameA: '',
  coupleNameB: '',
  title: '',
  dateFrom: '',
  dateTo: '',
  region: '',
  currency: 'GBP',
  format: 'single_day',
  cultures: [],
  subEvents: [],
  guestEstimate: '',
  budgetTarget: '',
  priorities: [],
  hasPlanner: null,
}

export const TOTAL_STEPS = STEPS.length