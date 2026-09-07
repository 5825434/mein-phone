export const onlyDigits = (str) => (str ?? '').replace(/\D/g, '')

// ברירת מחדל 18% (סעיף 3.10-ב באיפיון - ניתן לעריכה בעתיד מהגדרות)
export const VAT_RATE = 0.18

export const toWithVat = (before) => Math.round(before * (1 + VAT_RATE))
export const toBeforeVat = (withVat) => Math.round(withVat / (1 + VAT_RATE))

export function formatDate(date) {
  return date.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// מחזיר תאריך בפורמט DD.MM.YYYY בעוד N חודשים מהיום - ברירת המחדל של תזכורת ניוד עתידי (סעיף 2.1)
export function monthsFromNow(n) {
  const d = new Date()
  d.setMonth(d.getMonth() + n)
  return formatDate(d)
}

// הופך "02.09.2026" ל-"2026-09-02" עבור <input type="date">, ולהפך
export function toInputDate(ddmmyyyy) {
  if (!ddmmyyyy || ddmmyyyy === '—') return ''
  const [d, m, y] = ddmmyyyy.split('.')
  return `${y}-${m}-${d}`
}
export function fromInputDate(yyyymmdd) {
  if (!yyyymmdd) return '—'
  const [y, m, d] = yyyymmdd.split('-')
  return `${d}.${m}.${y}`
}

// מפרמט מספר טלפון ישראלי גולמי (עם או בלי מקף) לתצוגה עם מקף: 05X-XXXXXXX / 0X-XXXXXXX
export function formatPhone(raw) {
  const digits = onlyDigits(raw)
  if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  if (digits.length === 9) return `${digits.slice(0, 2)}-${digits.slice(2)}`
  return raw
}
