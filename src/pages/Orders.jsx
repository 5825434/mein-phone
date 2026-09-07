import { useMemo, useState } from 'react'
import Panel from '../components/Panel'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import Field from '../components/Field'
import SelectField from '../components/SelectField'
import PriceField from '../components/PriceField'
import Modal from '../components/Modal'
import FilterBar, { TextFilter, SelectFilter } from '../components/FilterBar'
import { orders as initialOrders, customers } from '../data/sampleData'
import { toWithVat, toBeforeVat, formatDate } from '../lib/format'

const paymentOptions = [
  { value: 'paid', label: 'שולם' },
  { value: 'partial', label: 'שולם חלקית' },
  { value: 'pending', label: 'ממתין' },
]

const paymentStatus = { paid: 'done', partial: 'pending', pending: 'late' }
const paymentLabel = { paid: 'שולם', partial: 'שולם חלקית', pending: 'ממתין' }

function money(n) {
  return `${n.toLocaleString('he-IL')} ₪`
}

function emptyOrderDraft() {
  return { id: '', customer: '', date: formatDate(new Date()), summary: '', beforeVat: '', withVat: '', payment: 'paid', linkedPorting: false }
}

function OrderModal({ initial, onClose, onSave }) {
  const [draft, setDraft] = useState(initial)
  const set = (key) => (e) => setDraft({ ...draft, [key]: e?.target ? e.target.value : e })

  return (
    <Modal
      title={initial.id ? 'עריכת הזמנה' : 'הזמנה חדשה'}
      onClose={onClose}
      saveDisabled={!draft.customer.trim() || !draft.summary.trim()}
      onSave={() => onSave({ ...draft, id: draft.id || `ORD-${Date.now().toString().slice(-4)}` })}
      wide
      footNote="ההזמנה נשמרת בדפדפן שלך בלבד לצורך הדגמה — עם Supabase היא תישמר לצמיתות."
    >
      <div className="grid grid-cols-2 gap-3">
        <SelectField label="לקוח" value={draft.customer} onChange={(v) => setDraft({ ...draft, customer: v })} options={customers.map((c) => c.name)} />
        <Field label="תאריך" value={draft.date} onChange={set('date')} placeholder="DD.MM.YYYY" />
        <div className="col-span-2">
          <Field label="פריטים (תיאור חופשי)" value={draft.summary} onChange={set('summary')} placeholder="לדוגמה: iPhone 13 128GB" />
        </div>
        <PriceField
          label='סכום לפני מע"מ'
          value={draft.beforeVat}
          onChange={(v) => setDraft({ ...draft, beforeVat: v, withVat: v === '' ? '' : toWithVat(v) })}
          placeholder="0"
        />
        <PriceField
          label='סכום כולל מע"מ'
          value={draft.withVat}
          onChange={(v) => setDraft({ ...draft, withVat: v, beforeVat: v === '' ? '' : toBeforeVat(v) })}
          placeholder="0"
        />
        <SelectField label="סטטוס תשלום" value={draft.payment} onChange={(v) => setDraft({ ...draft, payment: v })} options={paymentOptions} />
        <label className="flex items-center gap-2.5 text-sm mt-6">
          <input type="checkbox" checked={draft.linkedPorting} onChange={(e) => setDraft({ ...draft, linkedPorting: e.target.checked })} />
          קשור לניוד
        </label>
      </div>
    </Modal>
  )
}

export default function Orders() {
  const [orders, setOrders] = useState(initialOrders)
  const [search, setSearch] = useState('')
  const [payment, setPayment] = useState('')
  const [modal, setModal] = useState(null)

  const filtered = useMemo(
    () => orders.filter((o) => (!search || o.customer.includes(search) || o.id.includes(search)) && (!payment || o.payment === payment)),
    [orders, search, payment]
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
        <span className="text-xs text-text-2">{filtered.length} הזמנות</span>
        <button
          onClick={() => setModal({ mode: 'add', data: emptyOrderDraft() })}
          className="ms-auto px-4 py-2 rounded-lg text-sm font-semibold bg-brand text-white hover:bg-[#8f45f0] hover:shadow-md transition-all"
        >
          + הזמנה חדשה
        </button>
      </FilterBar>

      <Panel title="כל ההזמנות" subtitle="לחיצה על שורה פותחת אותה לעריכה">
        <DataTable columns={columns} rows={filtered} rowKey="id" onRowClick={(row) => setModal({ mode: 'edit', id: row.id, data: row })} />
      </Panel>

      <p className="text-xs text-text-2 max-w-2xl">
        הפקת חשבונית PDF וסימון הזמנה כ"בוטלה" (במקום מחיקה) יתווספו עם Supabase — לפי סעיף 3.5 באיפיון.
      </p>

      {modal && (
        <OrderModal
          initial={modal.data}
          onClose={() => setModal(null)}
          onSave={(result) => {
            if (modal.mode === 'add') {
              setOrders([result, ...orders])
            } else {
              setOrders(orders.map((o) => (o.id === modal.id ? result : o)))
            }
            setModal(null)
          }}
        />
      )}
    </div>
  )
}
