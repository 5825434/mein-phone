import { useState } from 'react'
import StatusBadge from './StatusBadge'
import Field from './Field'
import SelectField from './SelectField'
import { orders, carrierOptions, giftOptions } from '../data/sampleData'
import { monthsFromNow, toInputDate, fromInputDate } from '../lib/format'

export default function CustomerDrawer({ customer, onClose, onSave }) {
  const [notes, setNotes] = useState(customer.notes ?? '')
  const [currentCarrier, setCurrentCarrier] = useState(customer.currentCarrier === '—' ? '' : customer.currentCarrier)
  const [gift, setGift] = useState(customer.gift ?? '')
  const [portingsDone, setPortingsDone] = useState(customer.portingsDone ?? 1)
  const [futureCarrier, setFutureCarrier] = useState(customer.futureCarrier === '—' ? '' : customer.futureCarrier)
  const [futureDueDate, setFutureDueDate] = useState(
    toInputDate(customer.futureDueDate === '—' ? monthsFromNow(6) : customer.futureDueDate)
  )
  const [simsReceived, setSimsReceived] = useState(customer.simsReceived ?? 1)
  const [lineNumbers, setLineNumbers] = useState(customer.lineNumbers ?? '')

  const customerOrders = orders.filter((o) => o.customer === customer.name)
  const selectedGift = giftOptions.find((g) => g.name === gift)
  const requiredPortings = selectedGift?.requiredPortings ?? 1
  const remaining = Math.max(requiredPortings - Number(portingsDone || 0), 0)

  const handleSave = () => {
    onSave({
      notes,
      currentCarrier: currentCarrier || '—',
      gift,
      requiredPortings,
      portingsDone: Number(portingsDone || 0),
      futureCarrier: remaining > 0 ? futureCarrier || '—' : '—',
      futureDueDate: remaining > 0 ? fromInputDate(futureDueDate) : '—',
      simsReceived: Number(simsReceived || 0),
      lineNumbers,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={onClose}>
      <div className="bg-white h-full w-full max-w-md p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()} dir="rtl">
        <div className="flex items-start justify-between mb-1">
          <div className="font-display font-bold text-xl">{customer.name}</div>
          <button onClick={onClose} className="text-text-2 hover:text-text text-xl leading-none">
            ×
          </button>
        </div>
        <div className="text-sm text-text-2 tabular-nums mb-4">{customer.phone}</div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-bg rounded-xl p-3">
            <div className="text-xs text-text-2 font-semibold mb-1">הצטרפות</div>
            <div className="font-semibold tabular-nums">{customer.joined}</div>
          </div>
          <div className="bg-bg rounded-xl p-3">
            <div className="text-xs text-text-2 font-semibold mb-1">סטטוס</div>
            <StatusBadge status={customer.status} />
          </div>
        </div>

        <div className="font-bold text-sm mb-2">היסטוריית הזמנות</div>
        <div className="flex flex-col gap-2 mb-5">
          {customerOrders.length === 0 && <div className="text-sm text-text-2">אין עדיין הזמנות ללקוח זה בנתוני הדוגמה.</div>}
          {customerOrders.map((o) => (
            <div key={o.id} className="flex items-center justify-between border border-border rounded-lg px-3 py-2 text-sm">
              <span>{o.summary}</span>
              <span className="tabular-nums text-text-2">{o.date}</span>
            </div>
          ))}
        </div>

        <div className="font-bold text-sm mb-2">ניוד ומתנה</div>
        <div className="grid grid-cols-2 gap-3 mb-2">
          <SelectField label="ספק נוכחי" value={currentCarrier} onChange={setCurrentCarrier} options={carrierOptions} />
          <SelectField label="מתנה שניתנה" value={gift} onChange={setGift} options={giftOptions.map((g) => g.name)} />
          <Field
            label="כמה ניודים בוצעו עד כה (כולל זה)"
            type="number"
            min="1"
            value={portingsDone}
            onChange={(e) => setPortingsDone(e.target.value)}
          />
          <div className="flex flex-col gap-1.5 text-sm">
            <span className="font-semibold text-text-2 text-xs">נדרשים למתנה זו / נותרו</span>
            <div className="border border-border rounded-lg px-3 py-2 bg-bg tabular-nums">
              {requiredPortings} / {remaining} נותרו
            </div>
          </div>
          <Field
            label="מספרי קו שנוידו"
            value={lineNumbers}
            onChange={(e) => setLineNumbers(e.target.value)}
            placeholder="לדוגמה: 050-1234567"
          />
          <Field label="כמה סימים התקבלו" type="number" min="0" value={simsReceived} onChange={(e) => setSimsReceived(e.target.value)} />
        </div>

        {remaining > 0 ? (
          <div className="grid grid-cols-2 gap-3 mb-5 p-3 bg-[#FFF8E8] rounded-xl">
            <div className="col-span-2 text-xs font-semibold text-warning">
              עוד {remaining} ניוד/ים נדרשים — נפתחת התחייבות עתידית:
            </div>
            <SelectField label="ספק יעד עתידי" value={futureCarrier} onChange={setFutureCarrier} options={carrierOptions} />
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-text-2 text-xs">תאריך יעד (ברירת מחדל: +6 חודשים)</span>
              <input
                type="date"
                value={futureDueDate}
                onChange={(e) => setFutureDueDate(e.target.value)}
                className="border border-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </label>
          </div>
        ) : (
          <div className="mb-5 p-3 bg-[#EAFBF5] rounded-xl text-xs font-semibold text-success">
            אין התחייבות עתידית פתוחה — הושלמו כל הניודים הנדרשים למתנה זו.
          </div>
        )}

        <div className="font-bold text-sm mb-2">הערות</div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="תיעוד שיחות והערות ללקוח..."
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
        />
        <button
          onClick={handleSave}
          className="mt-3 px-4 py-2 rounded-lg text-sm font-semibold bg-brand text-white hover:bg-[#8f45f0] hover:shadow-md transition-all"
        >
          שמור שינויים
        </button>
      </div>
    </div>
  )
}
