import { useMemo, useState } from 'react'
import Panel from '../components/Panel'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import Field from '../components/Field'
import FilterBar, { TextFilter, SelectFilter } from '../components/FilterBar'
import { customers as initialCustomers, orders } from '../data/sampleData'

const statusOptions = [
  { value: 'pending', label: 'ממתין לניוד הבא' },
  { value: 'done', label: 'הושלם' },
  { value: 'late', label: 'באיחור' },
  { value: 'declined', label: 'נדחה' },
]

const onlyDigits = (str) => str.replace(/\D/g, '')

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
          <Field label="טלפון" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="050-1234567" />
          <Field label="ספק נוכחי" value={currentCarrier} onChange={(e) => setCurrentCarrier(e.target.value)} placeholder="לדוגמה: סלקום" />
        </div>
        <div className="flex gap-2 justify-end mt-5">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold border border-border">
            ביטול
          </button>
          <button
            disabled={!canSave}
            onClick={() => {
              onAdd({
                id: Date.now(),
                name: name.trim(),
                phone: phone.trim(),
                currentCarrier: currentCarrier.trim() || '—',
                futureCarrier: '—',
                futureDueDate: '—',
                joined: new Date().toLocaleDateString('he-IL'),
                lastActivity: new Date().toLocaleDateString('he-IL'),
                status: 'done',
                notes: '',
              })
              onClose()
            }}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-brand text-white disabled:bg-gray-200 disabled:text-text-2 disabled:cursor-not-allowed"
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

function CustomerDrawer({ customer, onClose, onSaveNotes }) {
  const [notes, setNotes] = useState(customer.notes ?? '')
  const customerOrders = orders.filter((o) => o.customer === customer.name)

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
            <div className="text-xs text-text-2 font-semibold mb-1">ספק נוכחי</div>
            <div className="font-semibold">{customer.currentCarrier}</div>
          </div>
          <div className="bg-bg rounded-xl p-3">
            <div className="text-xs text-text-2 font-semibold mb-1">ספק עתידי</div>
            <div className="font-semibold">
              {customer.futureCarrier === '—' ? '—' : `${customer.futureCarrier} (${customer.futureDueDate})`}
            </div>
          </div>
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

        <div className="font-bold text-sm mb-2">הערות</div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="תיעוד שיחות והערות ללקוח..."
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
        />
        <button
          onClick={() => onSaveNotes(notes)}
          className="mt-2 px-4 py-2 rounded-lg text-sm font-semibold bg-brand text-white"
        >
          שמור הערה
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
    {
      key: 'name',
      header: 'לקוח',
      render: (r) => (
        <button onClick={() => setSelected(r)} className="font-semibold text-brand hover:underline">
          {r.name}
        </button>
      ),
    },
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
          className="ms-auto px-4 py-2 rounded-lg text-sm font-semibold bg-brand text-white"
        >
          + לקוח חדש
        </button>
      </FilterBar>

      <Panel title="כל הלקוחות" subtitle="לחיצה על שם לקוח פותחת את הכרטיס המלא שלו">
        <DataTable columns={columns} rows={filtered} rowKey="id" />
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
          onSaveNotes={(notes) => {
            setCustomers(customers.map((c) => (c.id === selected.id ? { ...c, notes } : c)))
            setSelected({ ...selected, notes })
          }}
        />
      )}
    </div>
  )
}
