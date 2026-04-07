import { BROWN_PRIMARY, BROWN_PALE } from '@/lib/theme'
import type { CmdRowData }  from '@/components/Landing/CommandCenter/component'
import type { Stakeholder } from '@/components/Landing/StakeholderSection/component'
import type { Tradition }   from '@/components/Landing/TraditionSection/component'
import type { Testimonial } from '@/components/Landing/TestimonialSection/component'

// ─── NAV ─────────────────────────────────────────────────────
export const NAV_ITEMS = [
  { label: 'Features',     id: 'features'       },
  { label: 'Live Mode',    id: 'command-centre' },
  { label: 'Stakeholders', id: 'stakeholders'   },
  { label: 'Traditions',   id: 'traditions'     },
]

export const FOOTER_NAV_ITEMS = [
  { label: 'Features',     id: 'features'       },
  { label: 'Live Mode',    id: 'command-centre' },
  { label: 'Stakeholders', id: 'stakeholders'   },
  { label: 'Traditions',   id: 'traditions'     },
  { label: 'Get Started',  id: 'waitlist'       },
]

// ─── LOGO STRIP ───────────────────────────────────────────────
export const LOGO_STRIP_ITEMS = [
  'Single-Day Weddings', 'Multi-Day Celebrations', 'Destination Weddings',
  'Hindu Ceremonies',    'Christian Ceremonies',   'Nikkah & Walima',
  'Civil Ceremonies',    'Blended-Faith Programs', 'Multi-Venue Events',
]

// ─── PROBLEM CARDS ────────────────────────────────────────────
export const PROBLEM_CARDS = [
  { label: 'Planning fragmentation', before: 'Spreadsheets, PDFs, WhatsApp threads, vendor emails',  after: 'One structured system covering every domain',           accentColor: BROWN_PRIMARY },
  { label: 'Day-of control',         before: 'Reactive crisis management with no oversight',         after: 'Live run sheets, incident logging, recovery playbooks', accentColor: '#AA5A50'     },
  { label: 'Cultural flexibility',   before: "Rigid templates that don't fit your tradition",        after: 'Modular ceremony blocks for any culture or blend',       accentColor: '#4A8A80'     },
]

// ─── STATS ────────────────────────────────────────────────────
export const STATS = [
  { id: 'events',       value: 12, suffix: '+', label: 'Event types supported' },
  { id: 'stakeholders', value: 6,  suffix: '',  label: 'Stakeholder roles'     },
  { id: 'traditions',   value: 5,  suffix: '+', label: 'Cultural traditions'   },
  { id: 'features',     value: 13, suffix: '',  label: 'Planning modules'      },
]

// ─── COMMAND CENTRE ───────────────────────────────────────────
export const CMD_ROWS: CmdRowData[] = [
  { time: '14:00', label: 'Bridal party entrance', sub: 'Usher Team · Garden entrance',    status: 'done'      },
  { time: '14:15', label: 'Ceremony begins',        sub: 'Officiant · String quartet cue', status: 'live'      },
  { time: '14:45', label: 'Vows exchange',           sub: 'Ceremony stage · 18 min est.',   status: 'next'      },
  { time: '15:20', label: 'Photography session',    sub: 'Photographer — 8 min delayed',    status: 'alert'     },
  { time: '16:00', label: 'Cocktail hour opens',    sub: 'Terrace · Catering team ready',   status: 'confirmed' },
]

export const CMD_VENDORS = [
  { name: 'Photographer', checked: true  },
  { name: 'Caterer',      checked: true  },
  { name: 'Florist',      checked: true  },
  { name: 'DJ',           checked: false },
  { name: 'Transport',    checked: true  },
]

export const LIVE_FEATURES = [
  { label: 'Role-based run sheets',         desc: 'Every stakeholder sees only what they need to act on.'              },
  { label: 'Real-time vendor check-in',     desc: 'Track arrivals, setup windows, and readiness at a glance.'         },
  { label: 'Incident logging & escalation', desc: 'Log issues with severity, owner, and resolution target instantly.' },
  { label: 'Couple quiet mode',             desc: 'Shield the couple from noise. Surface only what truly matters.'    },
]

// ─── STAKEHOLDERS ─────────────────────────────────────────────
export const STAKEHOLDERS: Stakeholder[] = [
  { id: 'couple',      role: 'Couple',             tagline: 'Calm by default',          description: "See your readiness score, this week's key decisions, and live event status — without the operational noise.",                 lightBg: '#F5EDE0', lightBorder: '#D4B896', lightDot: '#8B6B47', lightLabel: '#8B6B47', darkBg: 'rgba(139,107,71,0.12)',  darkBorder: 'rgba(139,107,71,0.25)',  darkDot: BROWN_PALE, darkLabel: BROWN_PALE  },
  { id: 'coordinator', role: 'Day-of Coordinator', tagline: 'Command everything',       description: 'Role-based run sheets, vendor check-in, incident logging, escalation chains, and timeline recovery — in one console.',        lightBg: '#F5E8E6', lightBorder: '#D4A09A', lightDot: '#AA5A50', lightLabel: '#AA5A50', darkBg: 'rgba(176,100,90,0.12)',  darkBorder: 'rgba(176,100,90,0.25)',  darkDot: '#D4847A',  darkLabel: '#D4847A'  },
  { id: 'planner',     role: 'Wedding Planner',    tagline: 'Full operational control', description: 'Cross-event status, vendor balances, blocked tasks, finalization gaps, and live command centre access.',                      lightBg: '#F5EFE0', lightBorder: '#D4BC8C', lightDot: '#9A7A38', lightLabel: '#9A7A38', darkBg: 'rgba(160,130,80,0.12)',  darkBorder: 'rgba(160,130,80,0.25)',  darkDot: '#D4AA66',  darkLabel: '#D4AA66'  },
  { id: 'family',      role: 'Family Lead',        tagline: 'Scoped and clear',         description: 'Assigned responsibilities, ritual item tracking, communication threads, and just enough visibility for your role.',           lightBg: '#E8F2EE', lightBorder: '#90C4B4', lightDot: '#4A8A80', lightLabel: '#4A8A80', darkBg: 'rgba(90,140,130,0.12)',  darkBorder: 'rgba(90,140,130,0.25)',  darkDot: '#7ABDB0',  darkLabel: '#7ABDB0'  },
  { id: 'vendor',      role: 'Vendor',             tagline: 'Briefed and confirmed',    description: 'Arrival windows, deliverables, contact details, and real-time updates — no chasing required.',                               lightBg: '#E8EDF5', lightBorder: '#90A8D4', lightDot: '#4A6A9A', lightLabel: '#4A6A9A', darkBg: 'rgba(100,120,160,0.12)', darkBorder: 'rgba(100,120,160,0.25)', darkDot: '#8AACCF',  darkLabel: '#8AACCF'  },
  { id: 'guest',       role: 'Guest',              tagline: 'Informed and welcomed',    description: 'Event itineraries, venue maps, RSVP, dress code, transport details, and live announcements.',                                lightBg: '#EBF0E8', lightBorder: '#A4C49A', lightDot: '#4A7A38', lightLabel: '#4A7A38', darkBg: 'rgba(110,140,100,0.12)', darkBorder: 'rgba(110,140,100,0.25)', darkDot: '#8ABF7A',  darkLabel: '#8ABF7A'  },
]

// ─── TRADITIONS ───────────────────────────────────────────────
export const TRADITIONS: Tradition[] = [
  { id: 'hindu',    label: 'Hindu / Indian',      events: ['Mehendi', 'Haldi', 'Sangeet', 'Ceremony', 'Reception'],    activeTabBg: 'rgba(160,120,60,0.15)',  activeTabBorder: 'rgba(160,120,60,0.50)',  activeTabText: '#B8924A',  tagBg: 'rgba(160,120,60,0.12)',  tagBorder: 'rgba(160,120,60,0.30)',  tagText: '#B8924A',  lightActiveTabBg: 'rgba(139,107,47,0.10)', lightActiveTabBorder: 'rgba(139,107,47,0.40)', lightActiveTabText: '#7A5A28', lightTagBg: 'rgba(139,107,47,0.08)', lightTagBorder: 'rgba(139,107,47,0.25)', lightTagText: '#7A5A28'        },
  { id: 'muslim',   label: 'Muslim',              events: ['Nikah', 'Walima', 'Family Gathering'],                      activeTabBg: 'rgba(80,140,130,0.15)',  activeTabBorder: 'rgba(80,140,130,0.50)',  activeTabText: '#5AADA0',  tagBg: 'rgba(80,140,130,0.12)',  tagBorder: 'rgba(80,140,130,0.30)',  tagText: '#5AADA0',  lightActiveTabBg: 'rgba(60,110,100,0.10)',  lightActiveTabBorder: 'rgba(60,110,100,0.40)',  lightActiveTabText: '#3A7A70', lightTagBg: 'rgba(60,110,100,0.08)',  lightTagBorder: 'rgba(60,110,100,0.25)',  lightTagText: '#3A7A70'  },
  { id: 'christian',label: 'Christian',           events: ['Rehearsal', 'Ceremony', 'Blessing', 'Reception'],           activeTabBg: 'rgba(90,120,170,0.15)',  activeTabBorder: 'rgba(90,120,170,0.50)',  activeTabText: '#7A9FCC',  tagBg: 'rgba(90,120,170,0.12)',  tagBorder: 'rgba(90,120,170,0.30)',  tagText: '#7A9FCC',  lightActiveTabBg: 'rgba(70,100,150,0.10)',  lightActiveTabBorder: 'rgba(70,100,150,0.40)',  lightActiveTabText: '#4A70A0', lightTagBg: 'rgba(70,100,150,0.08)',  lightTagBorder: 'rgba(70,100,150,0.25)',  lightTagText: '#4A70A0'  },
  { id: 'civil',    label: 'Civil',               events: ['Legal Ceremony', 'Reception', 'Celebration'],               activeTabBg: 'rgba(130,110,170,0.15)', activeTabBorder: 'rgba(130,110,170,0.50)', activeTabText: '#A890CC',  tagBg: 'rgba(130,110,170,0.12)', tagBorder: 'rgba(130,110,170,0.30)', tagText: '#A890CC',  lightActiveTabBg: 'rgba(100,85,140,0.10)',  lightActiveTabBorder: 'rgba(100,85,140,0.40)',  lightActiveTabText: '#6A5598', lightTagBg: 'rgba(100,85,140,0.08)',  lightTagBorder: 'rgba(100,85,140,0.25)',  lightTagText: '#6A5598'  },
  { id: 'blended',  label: 'Blended / Interfaith', events: ['Custom Streams', 'Multi-tradition', 'Combined Program'],  activeTabBg: 'rgba(139,107,71,0.18)', activeTabBorder: 'rgba(139,107,71,0.55)', activeTabText: BROWN_PALE, tagBg: 'rgba(139,107,71,0.14)', tagBorder: 'rgba(139,107,71,0.35)', tagText: BROWN_PALE, lightActiveTabBg: 'rgba(110,84,50,0.12)',   lightActiveTabBorder: 'rgba(110,84,50,0.45)',   lightActiveTabText: BROWN_PRIMARY, lightTagBg: 'rgba(110,84,50,0.09)', lightTagBorder: 'rgba(110,84,50,0.28)', lightTagText: BROWN_PRIMARY },
]

export const TRADITION_FEATURES = [
  { title: 'Faith-agnostic by design', desc: 'No single tradition is hardcoded. Select one or many cultural modules during programme setup.'           },
  { title: 'Ritual item tracking',     desc: 'Every ceremony element — items, witnesses, officiants, readings, music cues — is tracked and assigned.' },
  { title: 'Multi-stream support',     desc: 'Running a Hindu and a Church ceremony in the same programme? Separate ritual streams, one system.'       },
  { title: 'Guest scoping per event',  desc: 'Different guest sets for mehendi vs reception. Invitations, RSVPs, and seating stay separate.'           },
]

// ─── TESTIMONIALS ─────────────────────────────────────────────
export const TESTIMONIALS: Testimonial[] = [
  { id: 't1', quote: 'Vow turned what would have been a logistical nightmare into the most organised event I have ever coordinated. The live mode on the day was extraordinary.',         name: 'Priya & James',   detail: '3-day Hindu-Christian blended wedding, London', initials: 'PJ', avatarBg: 'rgba(139,107,71,0.18)', avatarColor: BROWN_PALE  },
  { id: 't2', quote: "As a professional planner, I've tried every tool on the market. Nothing comes close to the operational depth Vow offers, especially for multi-venue events.",       name: 'Sarah Okonkwo',   detail: 'Wedding Planner, London',                      initials: 'SO', avatarBg: 'rgba(176,100,90,0.18)', avatarColor: '#D4847A'   },
  { id: 't3', quote: 'We had a 5-day destination wedding across two venues. The fact that every family member, vendor, and coordinator had their own tailored view was a game-changer.', name: 'Aisha & Tariq',   detail: 'Destination Nikah & Walima, Dubai',            initials: 'AT', avatarBg: 'rgba(90,140,130,0.18)',  avatarColor: '#7ABDB0'  },
]