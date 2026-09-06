import { useMemo, useState } from 'react'
import Panel from '../components/Panel'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import FilterBar, { TextFilter, SelectFilter } from '../components/FilterBar'
import { orders } from '../data/sampleData'

const paymentOptions = [
  { value: 'paid', label: 'שולם' },
  { value: 'partial', label: 'שולם חלקית' },
  { value: 'pending', label: 'ממתין' },
]

const paymentStatus = {
  paid: 'done',
  partial: 'pending',
  pending: 'late',
}

const paymentLabel = {
  paid: 'שולם',
  partial: 'שולם חלקית',
  pending: 'ממתין',
}

function money(n) {
  return `${n.toLocaleString('he-IL')} ₪`
}

export default function Orders() {
  const [search, setSearch] = useState('')
  const [payment, setPayment] = useState('')

  const filtered = useMemo(
    () =>
      orders.filter(
        (o) =>
          (!search || o.customer.includes(search) || o.id.includes(search)) &&
          (!payment || o.payment === payment)
      ),
    [search, payment]
  )

  const columns = [
    { key: 'id', header: 'הזמנה', render: (r) => <span className="tabular-nums text-text-2">{r.id}</span> },
    { key: 'customer', header: 'לקוח', render: (r) => <span className="font-semibold">{r.customer}</span> },
    { key: 'date', header: 'תאריך', render: (r) => <span className="tabular-nums text-text-2">{r.date}</span> },
    { key: 'summary', header: 'פריטים' },
    {
      key: 'total',
      header: 'סכום (לפני / כולל מע"מ)',
      render: (r) => (
        <span className="tabular-nums">
          {money(r.beforeVat)} / {money(r.withVat)}
        </span>
      ),
    },
    { key: 'linkedPorting', header: 'קשור לניוד', render: (r) => (r.linkedPorting ? 'כן' : '—') },
    { key: 'payment', header: 'תשלום', render: (r) => <StatusBadge status={paymentStatus[r.payment]}>{paymentLabel[r.payment]}</StatusBadge> },
  ]

  return (
    <div className="flex flex-col gap-4">
      <FilterBar>
        <TextFilter value={search} onChange={setSearch} placeholder="חיפוש לפי לקוח או מספר הזמנה..." />
        <SelectFilter value={payment} onChange={setPayment} options={paymentOptions} placeholder="כל סטטוסי התשלום" />
        <span className="text-xs text-text-2 ms-auto">{filtered.length} הזמנות</span>
      </FilterBar>

      <Panel title="כל ההזמנות">
        <DataTable columns={columns} rows={filtered} rowKey="id" />
      </Panel>

      <p className="text-xs text-text-2 max-w-2xl">
        יצירת הזמנה חדשה, הפקת חשבונית PDF, וסימון הזמנה כ"בוטלה" (במקום מחיקה) יתווספו עם Supabase —
        לפי סעיף 3.5 באיפיון.
      </p>
    </div>
  )
}
