'use client'

import { btnPrimary } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'
import { TOTAL_STEPS } from '@/lib/NewProgramme/constants'
import { IconArrowLeft, IconArrowRight } from '@/lib/NewProgramme/icons'

interface Props {
  step:    number
  onBack:  () => void
  onNext:  () => void | Promise<void>
  loading?: boolean        // ← NEW
}

export default function StepNavigation({ step, onBack, onNext, loading = false }: Props) {
  const { T } = useTheme()

  const isFinalStep = step === TOTAL_STEPS

  return (
    <div className={`flex items-center mt-8 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
      {step > 1 && (
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                     transition-all duration-200 hover:scale-[1.02] focus:outline-none
                     disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: T.surface,
            border:          `1px solid ${T.borderBrown}`,
            color:           T.textSecondary,
          }}
        >
          <IconArrowLeft /> Back
        </button>
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold
                   transition-all duration-200 hover:scale-[1.03] focus:outline-none
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        style={{
          background: loading ? T.surface2 : btnPrimary.bg,
          boxShadow:  loading ? 'none'      : btnPrimary.shadow,
          color:      loading ? T.textMuted : btnPrimary.color,
        }}
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Saving…
          </>
        ) : (
          <>
            {isFinalStep ? 'Create Programme' : 'Continue'}
            {!isFinalStep && <IconArrowRight />}
          </>
        )}
      </button>
    </div>
  )
}