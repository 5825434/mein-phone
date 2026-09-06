import { useMemo, useState } from 'react'
import Panel from '../components/Panel'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import FilterBar, { SelectFilter } from '../components/FilterBar'
import { allPortings } from '../data/sampleData'

const statusOptions = [
  { value: 'pending', label: 'ממתין לניוד הבא' },
  { value: 'done', label: 'הושלם' },
  { value: 'late', label: 'באיחור' },
  { value: 'declined', label: 'נדחה' },
]

export default function Portings() {
  const [status, setStatus] = useState('')

  const filtered = useMemo(
    () => allPortings.filter((p) => !status || p.status === status),
    [status]
  )

  const openCount = allPortings.filter((p) => p.status === 'pending' || p.status === 'late').length

  const columns = [
    { key: 'customer', header: 'לקוח', render: (r) => <span className="font-semibold">{r.customer}</span> },
    { key: 'date', header: 'תאריך ניוד', render: (r) => <span className="tabular-nums text-text-2">{r.date}</span> },
    { key: 'currentCarrier', header: 'ספק נוכחי' },
    { key: 'gift', header: 'מתנה' },
    { key: 'futureCarrier', header: 'ספק עתידי / התחייבות' },
    { key: 'status', header: 'סטטוס', render: (r) => <StatusBadge status={r.status} /> },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3.5">
        <div className="bg-white border border-[#ECE9F7] rounded-2xl p-4">
          <div className="text-xs text-text-2 font-semibold">סה"כ ניודים</div>
          <div className="font-display font-bold text-2xl tabular-nums mt-1">{allPortings.length}</div>
        </div>
        <div className="bg-white border border-[#ECE9F7] rounded-2xl p-4">
          <div className="text-xs text-text-2 font-semibold">התחייבויות פתוחות</div>
          <div className="font-display font-bold text-2xl tabular-nums mt-1 text-warning">{openCount}</div>
        </div>
        <div className="bg-white border border-[#ECE9F7] rounded-2xl p-4">
          <div className="text-xs text-text-2 font-semibold">באיחור</div>
          <div className="font-display font-bold text-2xl tabular-nums mt-1 text-danger">
            {allPortings.filter((p) => p.status === 'late').length}
          </div>
        </div>
      </div>

      <FilterBar>
        <SelectFilter value={status} onChange={setStatus} options={statusOptions} placeholder="כל הסטטוסים" />
        <span className="text-xs text-text-2 ms-auto">{filtered.length} ניודים</span>
      </FilterBar>

      <Panel title="כל הניודים">
        <DataTable columns={columns} rows={filtered} rowKey="customer" />
      </Panel>

      <p className="text-xs text-text-2 max-w-2xl">
        תזכורות אוטומטיות (יצירה, דחייה, סימון בוצע) ושרשור התחייבויות מעבר לניוד עתידי אחד יתווספו עם
        Supabase — לפי סעיף 3.3 באיפיון.
      </p>
    </div>
  )
}
