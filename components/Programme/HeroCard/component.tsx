'use client'

import { useState, useRef, useCallback } from 'react'
import { btnPrimary, BROWN_PRIMARY, BROWN_LIGHT } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'
import type { Programme } from '@/lib/Programme/types'
import { FORMAT_LABELS } from '@/lib/Programme/types'
import { daysUntil, fmtDate } from '@/lib/Programme/helpers'
import { IconCalendar, IconPin, IconCheck } from '@/lib/Programme/icons'

interface Props {
    programme: Programme
    onChange: (updated: Programme) => void
}

// ── Generic inline-edit hook ──────────────────────────────────
function useInlineEdit(initial: string, onSave: (v: string) => void) {
    const [editing, setEditing] = useState(false)
    const [value, setValue] = useState(initial)
    const inputRef = useRef<HTMLInputElement | null>(null)

    const open = () => { setValue(initial); setEditing(true); setTimeout(() => inputRef.current?.focus(), 30) }
    const save = () => { setEditing(false); if (value.trim() !== initial) onSave(value.trim()) }
    const cancel = () => { setEditing(false); setValue(initial) }
    const onKey = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') { e.preventDefault(); save() }
        if (e.key === 'Escape') { e.preventDefault(); cancel() }
    }

    return { editing, value, setValue, inputRef, open, save, cancel, onKey }
}

// ── Editable stat cell ────────────────────────────────────────
interface StatCellProps {
    label: string
    display: string
    editing: boolean
    value: string
    inputRef: React.RefObject<HTMLInputElement | null>
    type?: 'text' | 'number'
    prefix?: string
    onOpen: () => void
    onSave: () => void
    onCancel: () => void
    onKey: (e: React.KeyboardEvent) => void
    onChange: (v: string) => void
    divider?: boolean
}

function StatCell({
    label, display, editing, value, inputRef,
    type = 'text', onOpen, onSave, onCancel, onKey, onChange, divider = false,
}: StatCellProps) {
    const { T } = useTheme()

    return (
        <div
            className="relative flex flex-col items-center justify-center
                 py-4 sm:py-5 cursor-pointer select-none
                 transition-colors duration-150 group"
            style={{
                borderRight: divider ? `1px solid ${T.borderSubtle}` : undefined,
                backgroundColor: editing
                    ? (document.documentElement.classList.contains('dark')
                        ? 'rgba(139,107,71,0.06)' : 'rgba(139,107,71,0.04)')
                    : 'transparent',
            }}
            onClick={() => !editing && onOpen()}
        >
            {editing ? (
                <div className="flex items-center gap-1.5">
                    <input
                        ref={inputRef}
                        type={type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={onSave}
                        onKeyDown={onKey}
                        className="text-base sm:text-lg font-bold text-center leading-none bg-transparent
                       focus:outline-none"
                        style={{
                            color: 'var(--accent-text)',
                            borderBottom: `1.5px solid ${BROWN_PRIMARY}`,
                            width: type === 'number' ? '72px' : '90px',
                            paddingBottom: '1px',
                        }}
                    />
                    <button
                        onMouseDown={(e) => { e.preventDefault(); onSave() }}
                        className="rounded-full p-0.5 focus:outline-none transition-opacity"
                        style={{ color: BROWN_PRIMARY, opacity: 0.8 }}
                    >
                        <IconCheck />
                    </button>
                </div>
            ) : (
                <p
                    className="text-base sm:text-lg font-bold leading-none mb-1
                     group-hover:opacity-70 transition-opacity duration-150
                     max-w-full px-2 truncate text-center"
                    style={{ color: 'var(--text-primary)' }}
                >
                    {display}
                </p>
            )}

            <p
                className="text-[10px] mt-1 transition-colors duration-150"
                style={{ color: editing ? BROWN_PRIMARY : 'var(--text-muted)' }}
            >
                {label}
                {!editing && (
                    <span
                        className="ml-1 opacity-0 group-hover:opacity-40 transition-opacity duration-150
                       text-[9px]"
                        style={{ color: BROWN_PRIMARY }}
                    >
                        ✎
                    </span>
                )}
            </p>

            {/* Active underline indicator */}
            {editing && (
                <div
                    className="absolute bottom-0 left-4 right-4 h-px rounded-full"
                    style={{ background: BROWN_PRIMARY, opacity: 0.35 }}
                />
            )}
        </div>
    )
}

// ── Editable pill ─────────────────────────────────────────────
interface EditPillProps {
    icon: React.ReactNode
    display: string | null
    editing: boolean
    value: string
    inputRef: React.RefObject<HTMLInputElement | null>
    type?: 'text' | 'date'
    placeholder?: string
    onOpen: () => void
    onSave: () => void
    onCancel: () => void
    onKey: (e: React.KeyboardEvent) => void
    onChange: (v: string) => void
}

function EditPill({
    icon, display, editing, value, inputRef, type = 'text',
    placeholder, onOpen, onSave, onCancel, onKey, onChange,
}: EditPillProps) {
    const { darkMode, T } = useTheme()

    return (
        <span
            className="group flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full
                 cursor-pointer transition-all duration-200"
            style={{
                backgroundColor: editing
                    ? darkMode ? 'rgba(139,107,71,0.12)' : 'rgba(139,107,71,0.08)'
                    : T.surface,
                border: `1px solid ${editing ? BROWN_PRIMARY : T.borderSubtle}`,
                color: T.textMuted,
            }}
            onClick={() => !editing && onOpen()}
        >
            <span style={{ color: editing ? BROWN_PRIMARY : T.textMuted }}>{icon}</span>

            {editing ? (
                <span className="flex items-center gap-1">
                    <input
                        ref={inputRef}
                        type={type}
                        value={value}
                        placeholder={placeholder}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={onSave}
                        onKeyDown={onKey}
                        className="bg-transparent focus:outline-none font-medium"
                        style={{
                            color: T.textPrimary,
                            borderBottom: `1px solid ${BROWN_PRIMARY}55`,
                            width: type === 'date' ? '130px' : '100px',
                            fontSize: '12px',
                            paddingBottom: '1px',
                            colorScheme: darkMode ? 'dark' : 'light',
                        }}
                    />
                    <button
                        onMouseDown={(e) => { e.preventDefault(); onSave() }}
                        className="focus:outline-none shrink-0"
                        style={{ color: BROWN_PRIMARY }}
                    >
                        <IconCheck />
                    </button>
                </span>
            ) : (
                <>
                    <span
                        className="transition-colors duration-150"
                        style={{ color: display ? T.textMuted : `${T.textMuted}66` }}
                    >
                        {display || placeholder}
                    </span>
                    {/* Hover hint */}
                    <span
                        className="text-[9px] opacity-0 group-hover:opacity-40
                       transition-opacity duration-200 ml-0.5"
                        style={{ color: BROWN_PRIMARY }}
                    >
                        ✎
                    </span>
                </>
            )}
        </span>
    )
}

// ── Main component ────────────────────────────────────────────
export default function HeroCard({ programme: p, onChange }: Props) {
    const { darkMode, T } = useTheme()

    const days = daysUntil(p.dateFrom)
    const weddingDate = p.dateFrom
        ? fmtDate(p.dateFrom, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        : null
    const weddingDateShort = p.dateFrom
        ? fmtDate(p.dateFrom, { day: 'numeric', month: 'short', year: 'numeric' })
        : null

    // ── Persist ────────────────────────────────────────────────
    const save = useCallback((patch: Partial<Programme>) => {
        const updated = { ...p, ...patch }
        onChange(updated)
        try {
            const list: Programme[] = JSON.parse(localStorage.getItem('vow-programmes') || '[]')
            const idx = list.findIndex((x) => x.id === p.id)
            if (idx !== -1) {
                list[idx] = updated
                localStorage.setItem('vow-programmes', JSON.stringify(list))
            }
        } catch { }
    }, [p, onChange])

    // ── Field editors ──────────────────────────────────────────
    const dateEdit = useInlineEdit(p.dateFrom, (v) => save({ dateFrom: v }))
    const regionEdit = useInlineEdit(p.region, (v) => save({ region: v }))
    const guestsEdit = useInlineEdit(p.guestEstimate, (v) => save({ guestEstimate: v }))
    const budgetEdit = useInlineEdit(p.budgetTarget, (v) => save({ budgetTarget: v }))

    return (
        <div
            className="vow-section rounded-2xl overflow-hidden"
            style={{
                backgroundColor: T.surface,
                border: `1px solid ${T.borderSubtle}`,
                boxShadow: darkMode
                    ? '0 24px 60px rgba(0,0,0,0.40)'
                    : '0 8px 40px rgba(139,107,71,0.10)',
            }}
        >
            {/* Gradient accent line */}
            <div
                className="h-px w-full"
                style={{
                    background: `linear-gradient(90deg, transparent, ${BROWN_PRIMARY}88, ${BROWN_LIGHT}88, transparent)`,
                }}
            />

            <div className="px-5 sm:px-7 md:px-8 pt-6 sm:pt-7 pb-0">

                {/* Label + countdown */}
                <div className="flex items-start justify-between mb-5">
                    <p className="text-[10px] font-bold tracking-[0.18em] uppercase mt-0.5" style={{ color: T.accentText }}>
                        Wedding Programme
                    </p>
                    {days !== null && days > 0 && (
                        <div className="flex items-baseline gap-1 px-3 py-2 rounded-xl shrink-0"
                            style={{
                                backgroundColor: darkMode ? 'rgba(139,107,71,0.10)' : 'rgba(139,107,71,0.07)',
                                border: `1px solid ${darkMode ? 'rgba(139,107,71,0.22)' : 'rgba(139,107,71,0.16)'}`,
                            }}>
                            <span className="text-2xl font-bold leading-none" style={{ color: T.accentText }}>{days}</span>
                            <span className="text-xs" style={{ color: T.textMuted }}>days</span>
                        </div>
                    )}
                    {days === 0 && (
                        <span className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                            style={{ backgroundColor: 'rgba(90,158,138,0.12)', border: '1px solid rgba(90,158,138,0.25)', color: '#7ABDB0' }}>
                            🎉 Today!
                        </span>
                    )}
                    {days !== null && days < 0 && (
                        <span className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                            style={{ backgroundColor: 'rgba(90,158,138,0.12)', border: '1px solid rgba(90,158,138,0.25)', color: '#7ABDB0' }}>
                            ✓ Complete
                        </span>
                    )}
                </div>

                {/* Title + names */}
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight mb-1" style={{ color: T.textPrimary }}>
                    {p.title}
                </h1>
                <p className="text-sm font-semibold mb-5" style={{ color: T.accentText }}>
                    {p.coupleNameA} & {p.coupleNameB}
                </p>

                {/* Editable pills — date & location only */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    <EditPill
                        icon={<IconCalendar />}
                        display={weddingDate}
                        editing={dateEdit.editing}
                        value={dateEdit.value}
                        inputRef={dateEdit.inputRef}
                        type="date"
                        placeholder="Set date"
                        onOpen={dateEdit.open}
                        onSave={dateEdit.save}
                        onCancel={dateEdit.cancel}
                        onKey={dateEdit.onKey}
                        onChange={dateEdit.setValue}
                    />
                    <EditPill
                        icon={<IconPin />}
                        display={p.region || null}
                        editing={regionEdit.editing}
                        value={regionEdit.value}
                        inputRef={regionEdit.inputRef}
                        type="text"
                        placeholder="Set location"
                        onOpen={regionEdit.open}
                        onSave={regionEdit.save}
                        onCancel={regionEdit.cancel}
                        onKey={regionEdit.onKey}
                        onChange={regionEdit.setValue}
                    />
                </div>

                {/* Culture / format tags */}
                <div className="flex flex-wrap gap-1.5 pb-5">
                    {p.format && (
                        <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold"
                            style={{
                                backgroundColor: darkMode ? 'rgba(139,107,71,0.18)' : 'rgba(139,107,71,0.10)',
                                border: `1px solid ${BROWN_PRIMARY}`,
                                color: T.accentText,
                            }}>
                            {FORMAT_LABELS[p.format] ?? p.format}
                        </span>
                    )}
                    {p.cultures.map((c) => (
                        <span key={c} className="text-[11px] px-2.5 py-1 rounded-full font-medium capitalize"
                            style={{ backgroundColor: T.surface, border: `1px solid ${T.borderSubtle}`, color: T.textSecondary }}>
                            {c}
                        </span>
                    ))}
                </div>
            </div>

            {/* Stats strip — Events (read-only), Guests, Budget (both editable) */}
            <div
                className="grid grid-cols-3"
                style={{ borderTop: `1px solid ${T.borderSubtle}` }}
            >
                {/* Events — read only */}
                <div
                    className="flex flex-col items-center py-4 sm:py-5"
                    style={{ borderRight: `1px solid ${T.borderSubtle}` }}
                >
                    <p className="text-base sm:text-lg font-bold leading-none mb-1" style={{ color: T.textPrimary }}>
                        {p.subEvents.length}
                    </p>
                    <p className="text-[10px]" style={{ color: T.textMuted }}>Events</p>
                </div>

                {/* Guests — editable */}
                <StatCell
                    label="Guests"
                    display={p.guestEstimate || '—'}
                    editing={guestsEdit.editing}
                    value={guestsEdit.value}
                    inputRef={guestsEdit.inputRef}
                    type="number"
                    onOpen={guestsEdit.open}
                    onSave={guestsEdit.save}
                    onCancel={guestsEdit.cancel}
                    onKey={guestsEdit.onKey}
                    onChange={guestsEdit.setValue}
                    divider
                />

                {/* Budget — editable */}
                <StatCell
                    label="Budget"
                    display={
                        p.budgetTarget
                            ? `${p.currency} ${Number(p.budgetTarget).toLocaleString()}`
                            : '—'
                    }
                    editing={budgetEdit.editing}
                    value={budgetEdit.value}
                    inputRef={budgetEdit.inputRef}
                    type="number"
                    onOpen={budgetEdit.open}
                    onSave={budgetEdit.save}
                    onCancel={budgetEdit.cancel}
                    onKey={budgetEdit.onKey}
                    onChange={budgetEdit.setValue}
                />
            </div>
        </div>
    )
}