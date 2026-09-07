import { useMemo, useState } from 'react'
import Panel from '../components/Panel'
import DataTable from '../components/DataTable'
import Field from '../components/Field'
import SelectField from '../components/SelectField'
import PriceField from '../components/PriceField'
import Modal from '../components/Modal'
import { suppliers as initialSuppliers } from '../data/sampleData'

const vatOptions = ['עם מע"מ', 'ללא מע"מ']

function money(n) {
  return `${n.toLocaleString('he-IL')} ₪`
}

function emptySupplierDraft(vat) {
  return { name: '', contact: '', terms: '', vat, openBalance: '' }
}

function SupplierModal({ initial, onClose, onSave }) {
  const [draft, setDraft] = useState(initial)
  const set = (key) => (e) => setDraft({ ...draft, [key]: e?.target ? e.target.value : e })

  return (
    <Modal
      title={initial.name ? 'עריכת ספק' : 'ספק חדש'}
      onClose={onClose}
      saveDisabled={!draft.name.trim()}
      onSave={() => onSave({ ...draft, openBalance: Number(draft.openBalance) || 0 })}
      wide
      footNote="הספק נשמר בדפדפן שלך בלבד לצורך הדגמה — עם Firebase הוא יישמר לצמיתות."
    >
      <div className="grid grid-cols-2 gap-3">
        <Field label="שם הספק" value={draft.name} onChange={set('name')} placeholder='לדוגמה: סלולר פלוס בע"מ' />
        <Field label="איש קשר / טלפון" value={draft.contact} onChange={set('contact')} placeholder="03-1234567" />
        <Field label="תנאי תשלום" value={draft.terms} onChange={set('terms')} placeholder="שוטף+30" />
        <SelectField label='חבות מע"מ' value={draft.vat} onChange={(v) => setDraft({ ...draft, vat: v })} options={vatOptions} />
        <PriceField label="יתרת חוב פתוחה" value={draft.openBalance} onChange={(v) => setDraft({ ...draft, openBalance: v })} placeholder="0" />
      </div>
    </Modal>
  )
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState(initialSuppliers)
  const [vatTab, setVatTab] = useState('עם מע"מ')
  const [modal, setModal] = useState(null)

  const filtered = useMemo(() => suppliers.filter((s) => s.vat === vatTab), [suppliers, vatTab])
  const totalOpen = filtered.reduce((sum, s) => sum + s.openBalance, 0)

  const columns = [
    { key: 'name', header: 'ספק', render: (r) => <span className="font-semibold">{r.name}</span> },
    { key: 'contact', header: 'איש קשר', render: (r) => <span className="tabular-nums text-text-2">{r.contact}</span> },
    { key: 'terms', header: 'תנאי תשלום' },
    {
      key: 'openBalance',
      header: 'יתרת חוב פתוחה',
      render: (r) => (
        <span className={`tabular-nums font-semibold ${r.openBalance > 0 ? 'text-danger' : 'text-success'}`}>{money(r.openBalance)}</span>
      ),
    },
  ]

  const tabBtn = (val) => (
    <button
      onClick={() => setVatTab(val)}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
        vatTab === val
          ? 'bg-brand text-white hover:bg-[#8f45f0] hover:shadow-md'
          : 'bg-white text-text-2 border border-border hover:border-brand/50 hover:text-brand'
      }`}
    >
      {val === 'עם מע"מ' ? 'ספקים עם חשבונית מע"מ' : 'ספקים ללא מע"מ'}
    </button>
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {tabBtn('עם מע"מ')}
          {tabBtn('ללא מע"מ')}
        </div>
        <button
          onClick={() => setModal({ mode: 'add', data: emptySupplierDraft(vatTab) })}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-brand text-white hover:bg-[#8f45f0] hover:shadow-md transition-all"
        >
          + ספק חדש
        </button>
      </div>

      <div className="bg-white border border-[#ECE9F7] rounded-2xl p-4 w-fit">
        <div className="text-xs text-text-2 font-semibold">סה"כ יתרת חוב פתוחה בקבוצה זו</div>
        <div className="font-display font-bold text-2xl tabular-nums mt-1 text-danger">{money(totalOpen)}</div>
      </div>

      <Panel
        title={`ספקים — ${vatTab === 'עם מע"מ' ? 'עם חשבונית מע"מ' : 'ללא מע"מ'}`}
        subtitle="לחיצה על שורה פותחת אותה לעריכה"
      >
        <DataTable columns={columns} rows={filtered} rowKey="name" onRowClick={(row) => setModal({ mode: 'edit', name: row.name, data: row })} />
      </Panel>

      <p className="text-xs text-text-2 max-w-2xl">
        הזמנות רכש, תשלומים לספק וקישור פריט-לרכישה יתווספו עם Firebase — לפי סעיף 3.7 באיפיון. שתי
        הקבוצות (עם/בלי מע"מ) מפוצלות בכוונה, בדיוק כמו במלאי.
      </p>

      {modal && (
        <SupplierModal
          initial={modal.data}
          onClose={() => setModal(null)}
          onSave={(result) => {
            if (modal.mode === 'add') {
              setSuppliers([result, ...suppliers])
            } else {
              setSuppliers(suppliers.map((s) => (s.name === modal.name ? result : s)))
            }
            setModal(null)
          }}
        />
      )}
    </div>
  )
}
