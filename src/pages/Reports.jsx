import Panel from '../components/Panel'
import DataTable from '../components/DataTable'
import { inventoryItems, allPortings, orders } from '../data/sampleData'

function money(n) {
  return `${n.toLocaleString('he-IL')} ₪`
}

function buildCategoryReport() {
  const byCategory = {}
  for (const item of inventoryItems) {
    const key = item.category
    byCategory[key] ??= { category: key, units: 0, cost: 0, revenue: 0 }
    byCategory[key].units += item.qty
    byCategory[key].cost += item.qty * item.cost
    byCategory[key].revenue += item.qty * item.priceBeforeVat
  }
  return Object.values(byCategory).map((row) => ({
    ...row,
    profit: row.revenue - row.cost,
  }))
}

export default function Reports() {
  const categoryReport = buildCategoryReport()
  const doneCount = allPortings.filter((p) => p.status === 'done').length
  const effectiveness = Math.round((doneCount / allPortings.length) * 100)
  const totalRevenue = orders.reduce((sum, o) => sum + o.withVat, 0)

  const columns = [
    { key: 'category', header: 'קטגוריה', render: (r) => <span className="font-semibold">{r.category}</span> },
    { key: 'units', header: 'יחידות במלאי', render: (r) => <span className="tabular-nums">{r.units}</span> },
    { key: 'cost', header: 'עלות מלאי', render: (r) => <span className="tabular-nums text-text-2">{money(r.cost)}</span> },
    { key: 'revenue', header: 'שווי מכירה (לפני מע"מ)', render: (r) => <span className="tabular-nums">{money(r.revenue)}</span> },
    {
      key: 'profit',
      header: 'רווח גולמי פוטנציאלי',
      render: (r) => <span className="tabular-nums font-semibold text-success">{money(r.profit)}</span>,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3.5">
        <div className="bg-white border border-[#ECE9F7] rounded-2xl p-4">
          <div className="text-xs text-text-2 font-semibold">הכנסות מהזמנות (לדוגמה)</div>
          <div className="font-display font-bold text-2xl tabular-nums mt-1">{money(totalRevenue)}</div>
        </div>
        <div className="bg-white border border-[#ECE9F7] rounded-2xl p-4">
          <div className="text-xs text-text-2 font-semibold">אפקטיביות ניודים</div>
          <div className="font-display font-bold text-2xl tabular-nums mt-1">{effectiveness}%</div>
          <div className="text-[11.5px] text-text-2 mt-1">{doneCount} מתוך {allPortings.length} הושלמו</div>
        </div>
        <div className="bg-white border border-[#ECE9F7] rounded-2xl p-4 flex flex-col justify-between">
          <div className="text-xs text-text-2 font-semibold">ייצוא</div>
          <button
            disabled
            title="ייצוא לאקסל יופעל לאחר חיבור Supabase"
            className="mt-2 self-start px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100 text-text-2 cursor-not-allowed"
          >
            ייצוא לאקסל
          </button>
        </div>
      </div>

      <Panel title="דוח מלאי ורווחיות לפי קטגוריה" subtitle="מבוסס על נתוני המלאי הנוכחיים">
        <DataTable columns={columns} rows={categoryReport} rowKey="category" />
      </Panel>

      <p className="text-xs text-text-2 max-w-2xl">
        דוח מכירות מפורט לפי נציג, ודוח ניודים מלא, יתווספו עם Supabase (נתונים אמיתיים לאורך זמן) —
        לפי סעיף 3.6 באיפיון. המספרים כאן מחושבים מנתוני הדוגמה בלבד.
      </p>
    </div>
  )
}
