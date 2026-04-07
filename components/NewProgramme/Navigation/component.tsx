'use client'

import { btnPrimary } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'
import { TOTAL_STEPS } from '@/lib/NewProgramme/constants'
import { IconArrowLeft, IconArrowRight } from '@/lib/NewProgramme/icons'

interface Props {
  step:   number
  onBack: () => void
  onNext: () => void
}

export default function StepNavigation({ step, onBack, onNext }: Props) {
  const { T } = useTheme()

  return (
    <div className={`flex items-center mt-8 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
      {step > 1 && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                     transition-all duration-200 hover:scale-[1.02] focus:outline-none"
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
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold
                   transition-all duration-200 hover:scale-[1.03] focus:outline-none"
        style={{ background: btnPrimary.bg, boxShadow: btnPrimary.shadow, color: btnPrimary.color }}
      >
        {step === TOTAL_STEPS ? 'Create Programme' : 'Continue'}
        {step < TOTAL_STEPS && <IconArrowRight />}
      </button>
    </div>
  )
}