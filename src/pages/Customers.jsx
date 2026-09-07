import { useMemo, useState } from 'react'
import Panel from '../components/Panel'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import Field from '../components/Field'
import SelectField from '../components/SelectField'
import FilterBar, { TextFilter, SelectFilter } from '../components/FilterBar'
import { customers as initialCustomers, orders, carrierOptions, giftOptions } from '../data/sampleData'
import { onlyDigits, formatPhone, monthsFromNow, toInputDate, fromInputDate } from '../lib/format'

const statusOptions = [
  { value: 'pending', label: 'ממתין לניוד הבא' },
  { value: 'done', label: 'הושלם' },
  { value: 'late', label: 'באיחור' },
  { value: 'declined', label: 'נדחה' },
]

function AddCustomerModal({ onClose, onAdd }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [currentCarrier, setCurrentCarrier] = useState('')

  const canSave = name.trim() && phone.trim()

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="font-display font-bold text-lg mb-4">לקוח חדש</div>
        <div className="flex flex-col gap-3">
          <Field label="שם מלא" value={name} onChange={(e) => setName(e.target.value)} placeholder="לדוגמה: נועה שלו" />
          <Field label="טלפון" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0501234567 (עם או בלי מקף)" />
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-semibold text-text-2 text-xs">ספק נוכחי</span>
            <select
              value={currentCarrier}
              onChange={(e) => setCurrentCarrier(e.target.value)}
              className="border border-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/40"
            >
              <option value="">בחר ספק...</option>
              {carrierOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex gap-2 justify-end mt-5">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold border border-border hover:bg-bg transition-colors">
            ביטול
          </button>
          <button
            disabled={!canSave}
            onClick={() => {
              onAdd({
                id: Date.now(),
                name: name.trim(),
                phone: formatPhone(phone.trim()),
                currentCarrier: currentCarrier || '—',
                futureCarrier: '—',
                futureDueDate: '—',
                joined: new Date().toLocaleDateString('he-IL'),
                lastActivity: new Date().toLocaleDateString('he-IL'),
                status: 'done',
                notes: '',
              })
              onClose()
            }}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-brand text-white hover:bg-[#8f45f0] hover:shadow-md transition-all disabled:bg-gray-200 disabled:text-text-2 disabled:cursor-not-allowed disabled:shadow-none"
          >
            הוסף לקוח
          </button>
        </div>
        <p className="text-xs text-text-2 mt-3">
          הלקוח נשמר בדפדפן שלך בלבד לצורך הדגמה — עם Supabase הוא יישמר לצמיתות ויהיה זמין לכל העובדים.
        </p>
      </div>
    </div>
  )
}

function CustomerDrawer({ customer, onClose, onSave }) {
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
          <SelectField
            label="מתנה שניתנה"
            value={gift}
            onChange={setGift}
            options={giftOptions.map((g) => g.name)}
          />
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
          <Field
            label="כמה סימים התקבלו"
            type="number"
            min="0"
            value={simsReceived}
            onChange={(e) => setSimsReceived(e.target.value)}
          />
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

export default function Customers() {
  const [customers, setCustomers] = useState(initialCustomers)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    const digits = onlyDigits(search)
    return customers.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.includes(search) ||
        (digits && onlyDigits(c.phone).includes(digits))
      const matchesStatus = !status || c.status === status
      return matchesSearch && matchesStatus
    })
  }, [customers, search, status])

  const columns = [
    { key: 'name', header: 'לקוח', render: (r) => <span className="font-semibold text-brand">{r.name}</span> },
    { key: 'phone', header: 'טלפון', render: (r) => <span className="tabular-nums">{r.phone}</span> },
    { key: 'currentCarrier', header: 'ספק נוכחי' },
    {
      key: 'futureCarrier',
      header: 'ספק עתידי',
      render: (r) => (r.futureCarrier === '—' ? '—' : `${r.futureCarrier} (${r.futureDueDate})`),
    },
    { key: 'lastActivity', header: 'פעילות אחרונה', render: (r) => <span className="tabular-nums text-text-2">{r.lastActivity}</span> },
    { key: 'status', header: 'סטטוס', render: (r) => <StatusBadge status={r.status} /> },
  ]

  return (
    <div className="flex flex-col gap-4">
      <FilterBar>
        <TextFilter value={search} onChange={setSearch} placeholder="חיפוש לפי שם או טלפון (עם או בלי מקף)..." />
        <SelectFilter value={status} onChange={setStatus} options={statusOptions} placeholder="כל הסטטוסים" />
        <span className="text-xs text-text-2">{filtered.length} לקוחות</span>
        <button
          onClick={() => setShowAdd(true)}
          className="ms-auto px-4 py-2 rounded-lg text-sm font-semibold bg-brand text-white hover:bg-[#8f45f0] hover:shadow-md transition-all"
        >
          + לקוח חדש
        </button>
      </FilterBar>

      <Panel title="כל הלקוחות" subtitle="לחיצה על השורה פותחת את הכרטיס המלא של הלקוח">
        <DataTable columns={columns} rows={filtered} rowKey="id" onRowClick={setSelected} />
      </Panel>

      <p className="text-xs text-text-2 max-w-2xl">
        לקוחות חדשים והערות שנשמרות כאן פעילים בדפדפן שלך בלבד לצורך הדגמה — עם Supabase הם יישמרו
        לצמיתות ויהיו זמינים לכל העובדים, לפי סעיף 3.2 באיפיון.
      </p>

      {showAdd && (
        <AddCustomerModal onClose={() => setShowAdd(false)} onAdd={(c) => setCustomers([c, ...customers])} />
      )}

      {selected && (
        <CustomerDrawer
          customer={selected}
          onClose={() => setSelected(null)}
          onSave={(patch) => {
            setCustomers(customers.map((c) => (c.id === selected.id ? { ...c, ...patch } : c)))
            setSelected({ ...selected, ...patch })
          }}
        />
      )}
    </div>
  )
}
