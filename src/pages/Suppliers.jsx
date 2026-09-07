import { useMemo, useState } from 'react'
import Panel from '../components/Panel'
import DataTable from '../components/DataTable'
import { suppliers } from '../data/sampleData'

function money(n) {
  return `${n.toLocaleString('he-IL')} ₪`
}

export default function Suppliers() {
  const [vatTab, setVatTab] = useState('עם מע"מ')

  const filtered = useMemo(() => suppliers.filter((s) => s.vat === vatTab), [vatTab])

  const totalOpen = filtered.reduce((sum, s) => sum + s.openBalance, 0)

  const columns = [
    { key: 'name', header: 'ספק', render: (r) => <span className="font-semibold">{r.name}</span> },
    { key: 'contact', header: 'איש קשר', render: (r) => <span className="tabular-nums text-text-2">{r.contact}</span> },
    { key: 'terms', header: 'תנאי תשלום' },
    {
      key: 'openBalance',
      header: 'יתרת חוב פתוחה',
      render: (r) => (
        <span className={`tabular-nums font-semibold ${r.openBalance > 0 ? 'text-danger' : 'text-success'}`}>
          {money(r.openBalance)}
        </span>
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
      <div className="flex items-center gap-2.5">
        {tabBtn('עם מע"מ')}
        {tabBtn('ללא מע"מ')}
      </div>

      <div className="bg-white border border-[#ECE9F7] rounded-2xl p-4 w-fit">
        <div className="text-xs text-text-2 font-semibold">סה"כ יתרת חוב פתוחה בקבוצה זו</div>
        <div className="font-display font-bold text-2xl tabular-nums mt-1 text-danger">{money(totalOpen)}</div>
      </div>

      <Panel title={`ספקים — ${vatTab === 'עם מע"מ' ? 'עם חשבונית מע"מ' : 'ללא מע"מ'}`} subtitle="מיון לפי סדר יצירה, ניתן למיין לפי סכום חוב">
        <DataTable columns={columns} rows={filtered} rowKey="name" />
      </Panel>

      <p className="text-xs text-text-2 max-w-2xl">
        הזמנות רכש, תשלומים לספק וקישור פריט-לרכישה יתווספו עם Supabase — לפי סעיף 3.7 באיפיון. שתי
        הקבוצות (עם/בלי מע"מ) מפוצלות בכוונה, בדיוק כמו במלאי.
      </p>
    </div>
  )
}
