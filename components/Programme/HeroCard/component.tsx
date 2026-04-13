'use client'

import { supabase } from '@/DB/client'
import { useState, useRef, useCallback } from 'react'
import { BROWN_PRIMARY, BROWN_LIGHT } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/Auth/AuthContext'
import type { Programme } from '@/lib/Programme/types'
import { FORMAT_LABELS } from '@/lib/Programme/types'
import { daysUntil, fmtDate } from '@/lib/Programme/helpers'
import { IconCalendar, IconPin, IconCheck } from '@/lib/Programme/icons'

interface Props {
    programme: Programme
    onChange: (updated: Programme) => void
}

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

interface StatCellProps {
    label: string
    display: string
    editing: boolean
    value: string
    inputRef: React.RefObject<HTMLInputElement | null>
    type?: 'text' | 'number'
    onOpen: () => void
    onSave: () => void
    onCancel: () => void
    onKey: (e: React.KeyboardEvent) => void
    onChange: (v: string) => void
    divider?: boolean
}

function StatCell({
    label, display, editing, value, inputRef,
    type = 'text', onOpen, onSave, onKey, onChange, divider = false,
}: StatCellProps) {
    const { darkMode, T } = useTheme()

    return (
        <div
            className="relative flex flex-col items-center justify-center
                 py-5 cursor-pointer select-none transition-colors duration-150 group"
            style={{
                borderRight: divider ? `1px solid ${T.borderSubtle}` : undefined,
                backgroundColor: editing
                    ? darkMode ? 'rgba(139,107,71,0.06)' : 'rgba(139,107,71,0.04)'
                    : 'transparent',
            }}
            onClick={() => !editing && onOpen()}
        >
            {editing ? (
                <div className="flex items-center gap-1.5 mb-1">
                    <input
                        ref={inputRef}
                        type={type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={onSave}
                        onKeyDown={onKey}
                        className="text-base sm:text-lg font-bold text-center leading-none
                       bg-transparent focus:outline-none"
                        style={{
                            color: T.accentText,
                            borderBottom: `1.5px solid ${BROWN_PRIMARY}`,
                            width: type === 'number' ? '72px' : '90px',
                            paddingBottom: '1px',
                        }}
                    />
                    <button
                        onMouseDown={(e) => { e.preventDefault(); onSave() }}
                        className="rounded-full p-0.5 focus:outline-none"
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
                    style={{ color: T.textPrimary }}
                >
                    {display}
                </p>
            )}

            <p
                className="text-[10px] transition-colors duration-150"
                style={{ color: editing ? BROWN_PRIMARY : T.textMuted }}
            >
                {label}
                {!editing && (
                    <span
                        className="ml-1 opacity-0 group-hover:opacity-40
                       transition-opacity duration-150 text-[9px]"
                        style={{ color: BROWN_PRIMARY }}
                    >
                        ✎
                    </span>
                )}
            </p>

            {editing && (
                <div
                    className="absolute bottom-0 left-4 right-4 h-px rounded-full"
                    style={{ background: BROWN_PRIMARY, opacity: 0.35 }}
                />
            )}
        </div>
    )
}

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
    placeholder, onOpen, onSave, onKey, onChange,
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

export default function HeroCard({ programme: p, onChange }: Props) {
    const { darkMode, T } = useTheme()
    const { user } = useAuth()

    const days = daysUntil(p.dateFrom)
    const weddingDate = p.dateFrom
        ? fmtDate(p.dateFrom, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        : null

    // ── date + region → update_wedding_programme ─────────────────────
    const saveLocation = useCallback(async (patch: Partial<Pick<Programme, 'dateFrom' | 'region'>>) => {
        const updated = { ...p, ...patch }
        onChange(updated)
        if (!user) return

        const rpcPatch: Record<string, unknown> = {
            p_uid:          user.uid,
            p_programme_id: p.id,
        }
        if (patch.dateFrom !== undefined) rpcPatch.p_date_start = patch.dateFrom || null
        if (patch.region   !== undefined) rpcPatch.p_region     = patch.region   || null

        const { error } = await supabase.rpc('update_wedding_programme', rpcPatch)
        if (error) console.error('[HeroCard] location save failed:', error.message)
    }, [p, onChange, user])

    // ── guests + budget → update_programme_stats ─────────────────────
    const saveStats = useCallback(async (patch: Partial<Pick<Programme, 'guestEstimate' | 'budgetTarget'>>) => {
        const updated = { ...p, ...patch }
        onChange(updated)
        if (!user) return

        const rpcPatch: Record<string, unknown> = {
            p_uid:          user.uid,
            p_programme_id: p.id,
        }
        if (patch.guestEstimate !== undefined) rpcPatch.p_guest_estimate = patch.guestEstimate ? Number(patch.guestEstimate) : null
        if (patch.budgetTarget  !== undefined) rpcPatch.p_budget_target  = patch.budgetTarget  ? Number(patch.budgetTarget)  : null

        const { error } = await supabase.rpc('update_programme_stats', rpcPatch)
        if (error) console.error('[HeroCard] stats save failed:', error.message)
    }, [p, onChange, user])

    const dateEdit   = useInlineEdit(p.dateFrom,      (v) => saveLocation({ dateFrom: v }))
    const regionEdit = useInlineEdit(p.region,        (v) => saveLocation({ region: v }))
    const guestsEdit = useInlineEdit(String(p.guestEstimate ?? ''), (v) => saveStats({ guestEstimate: v }))
    const budgetEdit = useInlineEdit(String(p.budgetTarget  ?? ''), (v) => saveStats({ budgetTarget: v }))

    return (
        <div
            className="rounded-2xl overflow-hidden flex flex-col"
            style={{
                backgroundColor: T.surface,
                border: `1px solid ${T.borderSubtle}`,
                boxShadow: darkMode
                    ? '0 24px 60px rgba(0,0,0,0.40)'
                    : '0 8px 40px rgba(139,107,71,0.10)',
                height: '100%',
                minHeight: 'unset',
            }}
        >
            {/* Top gradient accent */}
            <div
                className="h-px w-full shrink-0"
                style={{
                    background: `linear-gradient(90deg, transparent, ${BROWN_PRIMARY}88, ${BROWN_LIGHT}88, transparent)`,
                }}
            />

            {/* ── Info block ─────────────────────────────────────────────── */}
            <div className="px-6 sm:px-8 pt-6 sm:pt-7 pb-5">

                <p
                    className="text-[10px] font-bold tracking-[0.18em] uppercase mb-4"
                    style={{ color: T.accentText }}
                >
                    Wedding Programme
                </p>

                <h1
                    className="font-bold tracking-tight leading-tight mb-1"
                    style={{
                        color: T.textPrimary,
                        fontSize: 'clamp(22px, 3vw, 30px)',
                    }}
                >
                    {p.title}
                </h1>
                <p className="text-sm font-semibold mb-5" style={{ color: T.accentText }}>
                    {p.coupleNameA} & {p.coupleNameB}
                </p>

                {/* Pills */}
                <div className="flex flex-wrap gap-1.5 mb-3">
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
                <div className="flex flex-wrap gap-1.5">
                    {p.format && (
                        <span
                            className="text-[11px] px-2.5 py-1 rounded-full font-semibold"
                            style={{
                                backgroundColor: darkMode ? 'rgba(139,107,71,0.18)' : 'rgba(139,107,71,0.10)',
                                border: `1px solid ${BROWN_PRIMARY}`,
                                color: T.accentText,
                            }}
                        >
                            {FORMAT_LABELS[p.format] ?? p.format}
                        </span>
                    )}
                    {p.cultures.map((c) => (
                        <span
                            key={c}
                            className="text-[11px] px-2.5 py-1 rounded-full font-medium capitalize"
                            style={{
                                backgroundColor: T.surface,
                                border: `1px solid ${T.borderSubtle}`,
                                color: T.textSecondary,
                            }}
                        >
                            {c}
                        </span>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div className="mx-6 sm:mx-8 h-px shrink-0" style={{ backgroundColor: T.borderSubtle }} />

            {/* ── Countdown ────────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">

                {days !== null && days > 0 && (
                    <>
                        <p
                            className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4"
                            style={{ color: T.textMuted }}
                        >
                            Days until your wedding
                        </p>
                        <p
                            className="font-bold leading-none tracking-tight"
                            style={{
                                fontSize: 'clamp(64px, 9vw, 96px)',
                                color: T.accentText,
                                fontVariantNumeric: 'tabular-nums',
                            }}
                        >
                            {days}
                        </p>
                        <div
                            className="mt-4 rounded-full"
                            style={{
                                width: '48px',
                                height: '1px',
                                background: `linear-gradient(90deg, transparent, ${BROWN_PRIMARY}, transparent)`,
                            }}
                        />
                        <p
                            className="mt-4 text-xs tracking-wide text-center"
                            style={{ color: T.textMuted }}
                        >
                            {weddingDate}
                        </p>
                    </>
                )}

                {days === 0 && (
                    <>
                        <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4"
                            style={{ color: T.textMuted }}>
                            It's your wedding day
                        </p>
                        <p className="text-5xl">🎉</p>
                        <p className="mt-4 text-sm font-semibold tracking-wide" style={{ color: '#7ABDB0' }}>
                            Today!
                        </p>
                    </>
                )}

                {days !== null && days < 0 && (
                    <>
                        <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4"
                            style={{ color: T.textMuted }}>
                            Wedding completed
                        </p>
                        <p className="text-4xl font-bold" style={{ color: '#7ABDB0' }}>✓</p>
                        <p className="mt-4 text-xs tracking-wide" style={{ color: T.textMuted }}>
                            {weddingDate}
                        </p>
                    </>
                )}

                {days === null && (
                    <p className="text-xs text-center" style={{ color: T.textMuted }}>
                        Set a wedding date to see your countdown
                    </p>
                )}
            </div>

            {/* ── Stats strip ────────────────────────────────────────────── */}
            <div
                className="grid grid-cols-3 shrink-0"
                style={{ borderTop: `1px solid ${T.borderSubtle}` }}
            >
                <div
                    className="flex flex-col items-center py-4 sm:py-5"
                    style={{ borderRight: `1px solid ${T.borderSubtle}` }}
                >
                    <p className="text-base sm:text-lg font-bold leading-none mb-1" style={{ color: T.textPrimary }}>
                        {p.subEvents.length}
                    </p>
                    <p className="text-[10px]" style={{ color: T.textMuted }}>Events</p>
                </div>

                <StatCell
                    label="Guests"
                    display={p.guestEstimate ? String(p.guestEstimate) : '—'}
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
