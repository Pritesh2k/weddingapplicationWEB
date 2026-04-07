'use client'

import React from 'react'
import { BROWN_PRIMARY, THEME } from '@/lib/theme'
import { useTheme } from '@/context/ThemeContext'
import { STEPS, TOTAL_STEPS } from '@/lib/NewProgramme/constants'
import { IconCheck } from '@/lib/NewProgramme/icons'

interface Props { currentStep: number }

export default function StepIndicator({ currentStep }: Props) {
  const { T } = useTheme()

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-2 sm:gap-3">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.n}>
            <div className="flex items-center gap-1.5">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center
                           text-xs font-bold transition-all duration-300"
                style={{
                  backgroundColor: currentStep >= s.n ? BROWN_PRIMARY : T.surface,
                  color:           currentStep >= s.n ? THEME.btn.text : T.textMuted,
                  border:          `1.5px solid ${currentStep >= s.n ? BROWN_PRIMARY : T.borderBrown}`,
                  transform:       currentStep === s.n ? 'scale(1.18)' : 'scale(1)',
                  boxShadow:       currentStep === s.n ? `0 0 0 3px ${BROWN_PRIMARY}22` : 'none',
                }}
              >
                {currentStep > s.n ? <IconCheck /> : s.n}
              </div>
              <span
                className="hidden sm:block text-xs font-medium transition-colors duration-200"
                style={{ color: currentStep === s.n ? T.accentText : T.textMuted }}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="w-3 sm:w-4 h-px transition-colors duration-300"
                style={{ backgroundColor: currentStep > s.n ? BROWN_PRIMARY : T.borderBrown }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <span className="text-xs font-medium tabular-nums" style={{ color: T.textMuted }}>
        {currentStep} / {TOTAL_STEPS}
      </span>
    </div>
  )
}