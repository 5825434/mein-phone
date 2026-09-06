import { useMemo, useState } from 'react'
import Panel from '../components/Panel'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import FilterBar, { TextFilter, SelectFilter } from '../components/FilterBar'
import { customers } from '../data/sampleData'

const statusOptions = [
  { value: 'pending', label: 'ממתין לניוד הבא' },
  { value: 'done', label: 'הושלם' },
  { value: 'late', label: 'באיחור' },
  { value: 'declined', label: 'נדחה' },
]

export default function Customers() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        !search || c.name.includes(search) || c.phone.includes(search)
      const matchesStatus = !status || c.status === status
      return matchesSearch && matchesStatus
    })
  }, [search, status])

  const columns = [
    { key: 'name', header: 'לקוח', render: (r) => <span className="font-semibold">{r.name}</span> },
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
        <TextFilter value={search} onChange={setSearch} placeholder="חיפוש לפי שם או טלפון..." />
        <SelectFilter value={status} onChange={setStatus} options={statusOptions} placeholder="כל הסטטוסים" />
        <span className="text-xs text-text-2 ms-auto">{filtered.length} לקוחות</span>
      </FilterBar>

      <Panel title="כל הלקוחות">
        <DataTable columns={columns} rows={filtered} rowKey="id" />
      </Panel>

      <p className="text-xs text-text-2 max-w-2xl">
        זהו תצוגת רשימה עם נתוני דוגמה. כרטיס לקוח מלא (היסטוריית רכישות, מתנות, הערות) ועריכה בפועל
        יתווספו כשיחובר Supabase — לפי סעיף 3.2 באיפיון.
      </p>
    </div>
  )
}
