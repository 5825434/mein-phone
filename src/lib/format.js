export const onlyDigits = (str) => (str ?? '').replace(/\D/g, '')

// מפרמט מספר טלפון ישראלי גולמי (עם או בלי מקף) לתצוגה עם מקף: 05X-XXXXXXX / 0X-XXXXXXX
export function formatPhone(raw) {
  const digits = onlyDigits(raw)
  if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  if (digits.length === 9) return `${digits.slice(0, 2)}-${digits.slice(2)}`
  return raw
}
