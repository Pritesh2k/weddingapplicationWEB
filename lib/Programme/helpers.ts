export const daysUntil = (d: string) =>
  d ? Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000) : null

export const fmtDate = (d: string, opts?: Intl.DateTimeFormatOptions) =>
  d ? new Date(d).toLocaleDateString('en-GB', opts ?? { day: 'numeric', month: 'short', year: 'numeric' }) : ''

export const fmtTime = (t: string) => {
  if (!t) return ''
  const [h, m] = t.split(':'); const hr = parseInt(h)
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`
}