'use client'

import { useTheme } from '@/context/ThemeContext'

interface Props {
  onConfirm: () => void
  onCancel:  () => void
}

export default function DeleteModal({ onConfirm, onCancel }: Props) {
  const { T } = useTheme()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-7"
        style={{
          backgroundColor: T.surface,
          border:          `1px solid ${T.borderBrown}`,
          boxShadow:       '0 24px 64px rgba(0,0,0,0.35)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
          style={{
            backgroundColor: 'rgba(232,134,122,0.10)',
            border:          '1px solid rgba(232,134,122,0.25)',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#E8867A" strokeWidth="1.5" className="w-5 h-5">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
          </svg>
        </div>

        <h3 className="text-base font-bold mb-2" style={{ color: T.textPrimary }}>
          Delete this programme?
        </h3>
        <p className="text-sm leading-relaxed mb-7" style={{ color: T.textMuted }}>
          This is permanent and cannot be undone. All data for this programme will be removed.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium
                       transition-all duration-200 hover:scale-[1.02] focus:outline-none"
            style={{
              backgroundColor: T.surface,
              border:          `1px solid ${T.borderBrown}`,
              color:           T.textSecondary,
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold
                       transition-all duration-200 hover:scale-[1.02] focus:outline-none"
            style={{
              backgroundColor: 'rgba(232,134,122,0.12)',
              border:          '1px solid rgba(232,134,122,0.32)',
              color:           '#E8867A',
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}