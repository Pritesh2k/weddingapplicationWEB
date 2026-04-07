export interface SubEvent {
  id: string; name: string; date: string; startTime: string; endTime: string
}
export interface Programme {
  id: string; coupleNameA: string; coupleNameB: string; title: string
  dateFrom: string; dateTo: string; region: string; currency: string
  format: string; cultures: string[]; subEvents: SubEvent[]
  guestEstimate: string; budgetTarget: string; priorities: string[]
  hasPlanner: boolean | null; createdAt: string
}
export const MODULES = [
  { id: 'guests',      emoji: '👥', label: 'Guest List',   desc: 'Invites, RSVPs, dietary needs & seating'    },
  { id: 'venue',       emoji: '🏛️', label: 'Venue',        desc: 'Ceremony and reception spaces'               },
  { id: 'vendors',     emoji: '🤝', label: 'Vendors',      desc: 'Food, drink, decor, music & suppliers'       },
  { id: 'items',       emoji: '🪑', label: 'Venue Items',  desc: 'Tables, chairs, linens — customisable'       },
  { id: 'tasks',       emoji: '✅', label: 'Task List',    desc: 'Everything to do, ordered by timeline'       },
  { id: 'budget',      emoji: '💷', label: 'Budget',       desc: 'Track spend vs target, by category'          },
  { id: 'timeline',    emoji: '🗓️', label: 'Day Timeline', desc: 'Minute-by-minute order of your day'          },
  { id: 'inspiration', emoji: '✨', label: 'Inspiration',  desc: 'Mood boards, palettes and your vision'       },
]
export const FORMAT_LABELS: Record<string, string> = {
  'single-day': 'Single Day', 'multi-day': 'Multi-Day',
  'destination': 'Destination', 'custom': 'Custom',
}