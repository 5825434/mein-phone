import { useMemo, useState } from 'react'
import Panel from '../components/Panel'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import Field from '../components/Field'
import CustomerDrawer from '../components/CustomerDrawer'
import FilterBar, { TextFilter, SelectFilter } from '../components/FilterBar'
import { customers as initialCustomers, carrierOptions } from '../data/sampleData'
import { onlyDigits, formatPhone } from '../lib/format'

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
