import { useMemo, useState } from 'react'
import Panel from '../components/Panel'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import Field from '../components/Field'
import SelectField from '../components/SelectField'
import Modal from '../components/Modal'
import FilterBar, { SelectFilter } from '../components/FilterBar'
import { allPortings as initialPortings, carrierOptions, giftOptions } from '../data/sampleData'
import { formatDate, monthsFromNow, toInputDate, fromInputDate } from '../lib/format'

const statusOptions = [
  { value: 'pending', label: 'ממתין לניוד הבא' },
  { value: 'done', label: 'הושלם' },
  { value: 'late', label: 'באיחור' },
  { value: 'declined', label: 'נדחה' },
]

function emptyPortingDraft() {
  return {
    customer: '',
    date: formatDate(new Date()),
    currentCarrier: '',
    gift: '',
    portingsDone: 1,
    futureCarrier: '',
    futureDueDate: toInputDate(monthsFromNow(6)),
    status: 'done',
  }
}

function PortingModal({ initial, onClose, onSave }) {
  const [draft, setDraft] = useState(initial)
  const set = (key) => (e) => setDraft({ ...draft, [key]: e?.target ? e.target.value : e })

  const selectedGift = giftOptions.find((g) => g.name === draft.gift)
  const required = selectedGift?.requiredPortings ?? 1
  const remaining = Math.max(required - Number(draft.portingsDone || 0), 0)

  return (
    <Modal
      title={initial.customer ? 'עריכת ניוד' : 'ניוד חדש'}
      onClose={onClose}
      saveDisabled={!draft.customer.trim() || !draft.currentCarrier}
      onSave={() =>
        onSave({
          ...draft,
          requiredPortings: required,
          futureCarrier: remaining > 0 ? draft.futureCarrier || '—' : '—',
          futureDueDate: remaining > 0 ? fromInputDate(draft.futureDueDate) : '—',
        })
      }
      wide
      footNote="נתונים אלה פעילים בדפדפן שלך בלבד לצורך הדגמה — עם Firebase הם יישמרו לצמיתות."
    >
      <div className="grid grid-cols-2 gap-3">
        <Field label="לקוח" value={draft.customer} onChange={set('customer')} placeholder="שם הלקוח" />
        <Field label="תאריך ניוד" value={draft.date} onChange={set('date')} placeholder="DD.MM.YYYY" />
        <SelectField label="ספק נוכחי" value={draft.currentCarrier} onChange={(v) => setDraft({ ...draft, currentCarrier: v })} options={carrierOptions} />
        <SelectField label="מתנה" value={draft.gift} onChange={(v) => setDraft({ ...draft, gift: v })} options={giftOptions.map((g) => g.name)} />
        <Field label="כמה ניודים בוצעו (כולל זה)" type="number" min="1" value={draft.portingsDone} onChange={set('portingsDone')} />
        <div className="flex flex-col gap-1.5 text-sm">
          <span className="font-semibold text-text-2 text-xs">נדרשים / נותרו</span>
          <div className="border border-border rounded-lg px-3 py-2 bg-bg tabular-nums">{required} / {remaining} נותרו</div>
        </div>
        {remaining > 0 && (
          <>
            <SelectField label="ספק יעד עתידי" value={draft.futureCarrier} onChange={(v) => setDraft({ ...draft, futureCarrier: v })} options={carrierOptions} />
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-text-2 text-xs">תאריך יעד (ברירת מחדל: +6 חודשים)</span>
              <input
                type="date"
                value={draft.futureDueDate}
                onChange={set('futureDueDate')}
                className="border border-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </label>
          </>
        )}
        <SelectField label="סטטוס" value={draft.status} onChange={(v) => setDraft({ ...draft, status: v })} options={statusOptions} />
      </div>
    </Modal>
  )
}

export default function Portings() {
  const [portings, setPortings] = useState(initialPortings.map((p, i) => ({ ...p, id: i })))
  const [status, setStatus] = useState('')
  const [modal, setModal] = useState(null) // { mode: 'add' | 'edit', data, id }

  const filtered = useMemo(() => portings.filter((p) => !status || p.status === status), [portings, status])
  const openCount = portings.filter((p) => p.status === 'pending' || p.status === 'late').length

  const columns = [
    { key: 'customer', header: 'לקוח', render: (r) => <span className="font-semibold">{r.customer}</span> },
    { key: 'date', header: 'תאריך ניוד', render: (r) => <span className="tabular-nums text-text-2">{r.date}</span> },
    { key: 'currentCarrier', header: 'ספק נוכחי' },
    { key: 'gift', header: 'מתנה' },
    {
      key: 'futureCarrier',
      header: 'ספק עתידי / התחייבות',
      render: (r) => (r.futureCarrier === '—' ? '—' : `${r.futureCarrier} (${r.futureDueDate})`),
    },
    { key: 'status', header: 'סטטוס', render: (r) => <StatusBadge status={r.status} /> },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3.5">
        <div className="bg-white border border-[#ECE9F7] rounded-2xl p-4">
          <div className="text-xs text-text-2 font-semibold">סה"כ ניודים</div>
          <div className="font-display font-bold text-2xl tabular-nums mt-1">{portings.length}</div>
        </div>
        <div className="bg-white border border-[#ECE9F7] rounded-2xl p-4">
          <div className="text-xs text-text-2 font-semibold">התחייבויות פתוחות</div>
          <div className="font-display font-bold text-2xl tabular-nums mt-1 text-warning">{openCount}</div>
        </div>
        <div className="bg-white border border-[#ECE9F7] rounded-2xl p-4">
          <div className="text-xs text-text-2 font-semibold">באיחור</div>
          <div className="font-display font-bold text-2xl tabular-nums mt-1 text-danger">
            {portings.filter((p) => p.status === 'late').length}
          </div>
        </div>
      </div>

      <FilterBar>
        <SelectFilter value={status} onChange={setStatus} options={statusOptions} placeholder="כל הסטטוסים" />
        <span className="text-xs text-text-2">{filtered.length} ניודים</span>
        <button
          onClick={() => setModal({ mode: 'add', data: emptyPortingDraft() })}
          className="ms-auto px-4 py-2 rounded-lg text-sm font-semibold bg-brand text-white hover:bg-[#8f45f0] hover:shadow-md transition-all"
        >
          + ניוד חדש
        </button>
      </FilterBar>

      <Panel title="כל הניודים" subtitle="לחיצה על שורה פותחת אותה לעריכה">
        <DataTable
          columns={columns}
          rows={filtered}
          rowKey="id"
          onRowClick={(row) =>
            setModal({
              mode: 'edit',
              id: row.id,
              data: { ...row, futureDueDate: toInputDate(row.futureDueDate) },
            })
          }
        />
      </Panel>

      {modal && (
        <PortingModal
          initial={modal.data}
          onClose={() => setModal(null)}
          onSave={(result) => {
            if (modal.mode === 'add') {
              setPortings([{ ...result, id: Date.now() }, ...portings])
            } else {
              setPortings(portings.map((p) => (p.id === modal.id ? { ...result, id: modal.id } : p)))
            }
            setModal(null)
          }}
        />
      )}
    </div>
  )
}
