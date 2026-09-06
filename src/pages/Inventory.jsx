import { useMemo, useState } from 'react'
import Panel from '../components/Panel'
import DataTable from '../components/DataTable'
import FilterBar, { TextFilter } from '../components/FilterBar'
import { inventoryItems } from '../data/sampleData'

const stockLabels = {
  available: { text: 'זמין', className: 'text-success' },
  low: { text: 'מלאי נמוך', className: 'text-warning' },
  out: { text: 'אזל', className: 'text-danger' },
}

function money(n) {
  return `${n.toLocaleString('he-IL')} ₪`
}

export default function Inventory() {
  const [vatTab, setVatTab] = useState('חייב')
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () =>
      inventoryItems.filter(
        (i) => i.vat === vatTab && (!search || i.name.includes(search) || i.sku.includes(search))
      ),
    [vatTab, search]
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
      className={`px-4 py-2 rounded-lg text-sm font-semibold ${
        vatTab === val ? 'bg-brand text-white' : 'bg-white text-text-2 border border-border'
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
        <span className="text-xs text-text-2 ms-auto">{filtered.length} פריטים</span>
      </FilterBar>

      <Panel title={`מלאי — ${vatTab === 'חייב' ? 'חייב במע"מ' : 'פטור ממע"מ'}`}>
        <DataTable columns={columns} rows={filtered} rowKey="sku" />
      </Panel>

      <p className="text-xs text-text-2 max-w-2xl">
        שתי הרשימות (חייב/פטור) מפוצלות בכוונה כדי שלא יתערבבו רכישות עם מע"מ ובלי מע"מ בחישובי
        העלות והדוחות — לפי סעיף 3.4 באיפיון.
      </p>
    </div>
  )
}
