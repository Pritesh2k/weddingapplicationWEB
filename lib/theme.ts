// lib/theme.ts
// ============================================================
// VOW — Design System Tokens
// Edit ONLY this file to retheme the entire application.
// ============================================================

export const THEME = {
  dark: {
    bg:            '#1E1C1A',
    surface:       '#272320',
    surface2:      '#2F2B28',
    textPrimary:   '#F2EDE6',
    textSecondary: '#C9BFB2',
    textMuted:     '#8A7E74',
    borderSubtle:  'rgba(242,237,230,0.07)',
    borderBrown:   'rgba(160,126,84,0.20)',
    accentText:    '#C4A882',
    heroBg:        'radial-gradient(ellipse 130% 85% at 50% -15%, #302620 0%, #272320 45%, #1E1C1A 100%)',
    heroGlow:      'radial-gradient(ellipse, rgba(160,120,72,0.13) 0%, rgba(110,84,50,0.05) 55%, transparent 75%)',
    heroGrid:      'rgba(160,120,72,0.45)',
    heroVignette:  'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 48%, rgba(10,8,6,0.58) 100%)',
    inputBg:       '#232120',
    inputBorder:   'rgba(160,126,84,0.18)',
    inputFocus:    'rgba(160,126,84,0.55)',
    inputShadow:   'rgba(160,126,84,0.12)',
    navBg:         'rgba(30,28,26,0.92)',
    mobileDrawerBg:'rgba(30,28,26,0.96)',
    cmdBg:         '#1E1C1A',
    cmdBorder:     '#38302A',
    cmdHeaderBorder:'rgba(56,48,42,0.9)',
    cmdRowDefault: '#272320',
    cmdVendorBg:   '#2F2B28',
    cmdVendorBorder:'#38302A',
  },
  light: {
    bg:            '#F7F3ED',
    surface:       '#EDE8E0',
    surface2:      '#E4DDD3',
    textPrimary:   '#1C1510',
    textSecondary: '#3D2E1E',
    textMuted:     '#7A6A58',
    borderSubtle:  'rgba(0,0,0,0.08)',
    borderBrown:   'rgba(139,107,71,0.18)',
    accentText:    '#8B6B47',
    heroBg:        'radial-gradient(ellipse 120% 80% at 50% -10%, #F0E8D8 0%, #EDE8E0 40%, #F7F3ED 100%)',
    heroGlow:      'radial-gradient(ellipse, rgba(139,107,71,0.10) 0%, transparent 70%)',
    heroGrid:      'rgba(139,107,71,0.5)',
    heroVignette:  'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, rgba(247,243,237,0.4) 100%)',
    inputBg:       '#F0EBE3',
    inputBorder:   'rgba(139,107,71,0.20)',
    inputFocus:    'rgba(139,107,71,0.55)',
    inputShadow:   'rgba(139,107,71,0.10)',
    navBg:         'rgba(247,243,237,0.92)',
    mobileDrawerBg:'rgba(247,243,237,0.96)',
    cmdBg:         '#F0E8DA',
    cmdBorder:     'rgba(139,107,71,0.25)',
    cmdHeaderBorder:'rgba(139,107,71,0.18)',
    cmdRowDefault: '#EAE2D8',
    cmdVendorBg:   '#E8E0D4',
    cmdVendorBorder:'rgba(139,107,71,0.18)',
  },
  btn: {
    from:   '#8B6B47',
    to:     '#6E5438',
    text:   '#F7F3ED',
    shadow: 'rgba(139,107,71,0.28)',
  },
} as const

// ── Derived helpers — computed once, imported everywhere ──────
export const BROWN_PRIMARY = THEME.btn.from   // '#8B6B47'
export const BROWN_DARK    = THEME.btn.to     // '#6E5438'
export const BROWN_LIGHT   = '#A07E5A'
export const BROWN_PALE    = '#C4A882'

export const btnPrimary = {
  bg:     `linear-gradient(135deg, ${THEME.btn.from} 0%, ${THEME.btn.to} 100%)`,
  shadow: `0 4px 20px ${THEME.btn.shadow}`,
  color:  THEME.btn.text,
}

// ── Type helpers ──────────────────────────────────────────────
export type ThemeMode = typeof THEME.dark | typeof THEME.light
export type DarkMode  = boolean
export const getTheme = (darkMode: DarkMode): ThemeMode =>
  darkMode ? THEME.dark : THEME.light