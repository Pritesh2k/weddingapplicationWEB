'use client'

import { useTheme } from '@/context/ThemeContext'
import { CURRENCIES } from '@/lib/NewProgramme/constants'
import type { ProgrammeData } from '@/lib/NewProgramme/types'

interface Props {
  data:  ProgrammeData
  patch: (f: Partial<ProgrammeData>) => void
  inp:   () => React.CSSProperties
}

const Required = () => <span style={{ color: '#D4847A', marginLeft: '2px' }}>*</span>
const Optional = () => <span style={{ color: 'inherit', marginLeft: '4px', fontWeight: 400, opacity: 0.55, fontSize: '10px', textTransform: 'none', letterSpacing: 0 }}>(optional)</span>

export default function Step2Programme({ data, patch, inp }: Props) {
  const { darkMode, T } = useTheme()
  const dateStyle = { ...inp(), colorScheme: darkMode ? 'dark' as const : 'light' as const }

  return (
    <div>
      <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: T.accentText }}>
        Step 2 · The programme
      </p>
      <h2 className="text-2xl font-bold tracking-tight mb-1" style={{ color: T.textPrimary }}>
        Name your programme
      </h2>
      <p className="text-sm mb-6" style={{ color: T.textMuted }}>
        Set the title, dates, region, and currency for your wedding.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.textMuted }}>
            Programme title<Required />
          </label>
          <input
            type="text"
            placeholder={`${data.coupleNameA || 'A'} & ${data.coupleNameB || 'B'}'s Wedding`}
            value={data.title}
            onChange={(e) => patch({ title: e.target.value })}
            style={inp()}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.textMuted }}>
              Start date<Required />
            </label>
            <input type="date" value={data.dateFrom}
              onChange={(e) => patch({ dateFrom: e.target.value })} style={dateStyle} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.textMuted }}>
              End date<Required />
            </label>
            <input type="date" value={data.dateTo} min={data.dateFrom}
              onChange={(e) => patch({ dateTo: e.target.value })} style={dateStyle} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.textMuted }}>
              Region / City<Optional />
            </label>
            <input type="text" placeholder="e.g. London" value={data.region}
              onChange={(e) => patch({ region: e.target.value })} style={inp()} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.textMuted }}>
              Currency<Optional />
            </label>
            <select value={data.currency} onChange={(e) => patch({ currency: e.target.value })}
              style={{ ...inp(), cursor: 'pointer' }}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
