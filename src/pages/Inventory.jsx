import { useMemo, useState } from 'react'
import Panel from '../components/Panel'
import DataTable from '../components/DataTable'
import Field from '../components/Field'
import SelectField from '../components/SelectField'
import PriceField from '../components/PriceField'
import Modal from '../components/Modal'
import FilterBar, { TextFilter } from '../components/FilterBar'
import { inventoryItems as initialItems } from '../data/sampleData'
import { toWithVat, toBeforeVat } from '../lib/format'

const categoryOptions = ['טלפונים', 'סימים', 'אביזרים', 'אחר']
const vatOptions = ['חייב', 'פטור']

const stockLabels = {
  available: { text: 'זמין', className: 'text-success' },
  low: { text: 'מלאי נמוך', className: 'text-warning' },
  out: { text: 'אזל', className: 'text-danger' },
}

function money(n) {
  return `${n.toLocaleString('he-IL')} ₪`
}

function statusFromQty(qty) {
  if (qty <= 0) return 'out'
  if (qty <= 2) return 'low'
  return 'available'
}

function emptyItemDraft() {
  return { sku: '', name: '', brand: '', category: 'טלפונים', qty: 1, cost: '', priceBeforeVat: '', priceWithVat: '', vat: 'חייב' }
}

function ItemModal({ initial, onClose, onSave }) {
  const [draft, setDraft] = useState(initial)
  const set = (key) => (e) => setDraft({ ...draft, [key]: e?.target ? e.target.value : e })

  return (
    <Modal
      title={initial.sku ? 'עריכת מוצר' : 'מוצר חדש'}
      onClose={onClose}
      saveDisabled={!draft.name.trim() || !draft.sku.trim()}
      onSave={() => onSave({ ...draft, qty: Number(draft.qty) || 0, status: statusFromQty(Number(draft.qty) || 0) })}
      wide
      footNote="הפריט נשמר בדפדפן שלך בלבד לצורך הדגמה — עם Supabase הוא יישמר לצמיתות."
    >
      <div className="grid grid-cols-2 gap-3">
        <Field label='מק"ט' value={draft.sku} onChange={set('sku')} placeholder="PH-XXXX" />
        <Field label="שם מוצר" value={draft.name} onChange={set('name')} placeholder="לדוגמה: iPhone 13" />
        <Field label="יצרן/דגם" value={draft.brand} onChange={set('brand')} placeholder="Apple" />
        <SelectField label="קטגוריה" value={draft.category} onChange={(v) => setDraft({ ...draft, category: v })} options={categoryOptions} />
        <Field label="כמות במלאי" type="number" min="0" value={draft.qty} onChange={set('qty')} />
        <SelectField label='חבות מע"מ' value={draft.vat} onChange={(v) => setDraft({ ...draft, vat: v })} options={vatOptions} />
        <PriceField label="מחיר עלות" value={draft.cost} onChange={(v) => setDraft({ ...draft, cost: v })} placeholder="0" />
        <div />
        <PriceField
          label='מחיר לפני מע"מ'
          value={draft.priceBeforeVat}
          onChange={(v) => setDraft({ ...draft, priceBeforeVat: v, priceWithVat: v === '' ? '' : toWithVat(v) })}
          placeholder="0"
        />
        <PriceField
          label='מחיר כולל מע"מ'
          value={draft.priceWithVat}
          onChange={(v) => setDraft({ ...draft, priceWithVat: v, priceBeforeVat: v === '' ? '' : toBeforeVat(v) })}
          placeholder="0"
        />
      </div>
    </Modal>
  )
}

export default function Inventory() {
  const [items, setItems] = useState(initialItems)
  const [vatTab, setVatTab] = useState('חייב')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)

  const filtered = useMemo(
    () => items.filter((i) => i.vat === vatTab && (!search || i.name.includes(search) || i.sku.includes(search))),
    [items, vatTab, search]
  )

  const columns = [
    { key: 'sku', header: 'מק"ט', render: (r) => <span className="tabular-nums text-text-2">{r.sku}</span> },
    { key: 'name', header: 'מוצר', render: (r) => <span className="font-semibold">{r.name}</span> },
    { key: 'category', header: 'קטגוריה' },
    { key: 'qty', header: 'כמות', render: (r) => <span className="tabular-nums">{r.qty}</span> },
    { key: 'cost', header: 'מחיר עלות', render: (r) => <span className="tabular-nums text-text-2">{money(r.cost)}</span> },
    {
      key: 'price',
      header: 'מחיר מכירה (לפני / כולל מע"מ)',
      render: (r) => (
        <span className="tabular-nums">
          {money(r.priceBeforeVat)} / {money(r.priceWithVat)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'סטטוס',
      render: (r) => <span className={`font-semibold text-xs ${stockLabels[r.status].className}`}>{stockLabels[r.status].text}</span>,
    },
  ]

  const tabBtn = (val, label) => (
    <button
      onClick={() => setVatTab(val)}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
        vatTab === val
          ? 'bg-brand text-white hover:bg-[#8f45f0] hover:shadow-md'
          : 'bg-white text-text-2 border border-border hover:border-brand/50 hover:text-brand'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2.5">
        {tabBtn('חייב', 'מלאי חייב במע"מ')}
        {tabBtn('פטור', 'מלאי פטור ממע"מ')}
      </div>

      <FilterBar>
        <TextFilter value={search} onChange={setSearch} placeholder="חיפוש לפי שם או מק״ט..." />
        <span className="text-xs text-text-2">{filtered.length} פריטים</span>
        <button
          onClick={() => setModal({ mode: 'add', data: { ...emptyItemDraft(), vat: vatTab } })}
          className="ms-auto px-4 py-2 rounded-lg text-sm font-semibold bg-brand text-white hover:bg-[#8f45f0] hover:shadow-md transition-all"
        >
          + מוצר חדש
        </button>
      </FilterBar>

      <Panel title={`מלאי — ${vatTab === 'חייב' ? 'חייב במע"מ' : 'פטור ממע"מ'}`} subtitle="לחיצה על שורה פותחת אותה לעריכה">
        <DataTable columns={columns} rows={filtered} rowKey="sku" onRowClick={(row) => setModal({ mode: 'edit', sku: row.sku, data: row })} />
      </Panel>

      <p className="text-xs text-text-2 max-w-2xl">
        שתי הרשימות (חייב/פטור) מפוצלות בכוונה כדי שלא יתערבבו רכישות עם מע"מ ובלי מע"מ בחישובי
        העלות והדוחות — לפי סעיף 3.4 באיפיון.
      </p>

      {modal && (
        <ItemModal
          initial={modal.data}
          onClose={() => setModal(null)}
          onSave={(result) => {
            if (modal.mode === 'add') {
              setItems([result, ...items])
            } else {
              setItems(items.map((i) => (i.sku === modal.sku ? result : i)))
            }
            setModal(null)
          }}
        />
      )}
    </div>
  )
}
