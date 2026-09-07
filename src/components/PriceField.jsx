import { onlyDigits } from '../lib/format'

// שדה מחיר עם פסיקי אלפים תוך כדי הקלדה (למשל 1,500) - הערך המספרי הנקי מוחזר ב-onChange
export default function PriceField({ label, value, onChange, placeholder, suffix = '₪' }) {
  const display = value === '' || value === undefined ? '' : Number(value).toLocaleString('he-IL')

  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-semibold text-text-2 text-xs">{label}</span>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={display}
          onChange={(e) => {
            const digits = onlyDigits(e.target.value)
            onChange(digits === '' ? '' : Number(digits))
          }}
          placeholder={placeholder}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/40 tabular-nums"
        />
        {suffix && <span className="absolute inset-y-0 left-3 flex items-center text-xs text-text-2">{suffix}</span>}
      </div>
    </label>
  )
}
