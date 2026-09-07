import { useState } from 'react'
import KpiCard from '../components/KpiCard'
import StatusBadge from '../components/StatusBadge'
import CustomerDrawer from '../components/CustomerDrawer'
import {
  kpis,
  monthlyFinance,
  monthlyPortings,
  salesByCategory,
  recentPortings,
  customers,
} from '../data/sampleData'

const CHART_W = 260
const CHART_H = 190
const PAD_TOP = 24
const PAD_BOTTOM = 24
const PAD_SIDE = 10
const PLOT_H = CHART_H - PAD_TOP - PAD_BOTTOM

function scaleX(i, count) {
  return PAD_SIDE + (i * (CHART_W - PAD_SIDE * 2)) / (count - 1)
}

function formatK(value) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`
}
function money(v) {
  return `${v.toLocaleString('he-IL')} ₪`
}

// אותה מיפוי צבעים בשני הגרפים (מכירות/הכנסות, הוצאות, ניודים) כדי שאותו מדד תמיד יזוהה לפי אותו צבע
const METRIC_COLORS = {
  income: 'var(--color-cat-1)',
  expenses: 'var(--color-cat-2)',
  portings: 'var(--color-brand)',
}

function ChartTooltip({ xPct, yPct, children }) {
  return (
    <div
      className="absolute z-10 bg-white border border-border rounded-lg shadow-lg px-2.5 py-2 text-[11px] pointer-events-none whitespace-nowrap"
      style={{ left: `${xPct}%`, top: `${yPct}%`, transform: 'translate(-50%, -120%)' }}
    >
      {children}
    </div>
  )
}

function TooltipRows({ month, income, expenses, portings }) {
  return (
    <>
      <div className="font-bold mb-1">{month}</div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ background: METRIC_COLORS.income, width: 7, height: 7 }} />
        הכנסות: <span className="font-semibold">{money(income)}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ background: METRIC_COLORS.expenses, width: 7, height: 7 }} />
        הוצאות: <span className="font-semibold">{money(expenses)}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ background: METRIC_COLORS.portings, width: 7, height: 7 }} />
        ניודים: <span className="font-semibold">{portings}</span>
      </div>
    </>
  )
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] text-text-2">
      <span className="flex items-center gap-1"><span className="rounded-full" style={{ background: METRIC_COLORS.income, width: 8, height: 8 }} />הכנסות</span>
      <span className="flex items-center gap-1"><span className="rounded-full" style={{ background: METRIC_COLORS.expenses, width: 8, height: 8 }} />הוצאות</span>
      <span className="flex items-center gap-1"><span className="rounded-full" style={{ background: METRIC_COLORS.portings, width: 8, height: 8 }} />ניודים</span>
    </div>
  )
}

// גרף מגמה מאוחד: שלוש הסדרות על אותו קנבס, ממודדות למגמת שינוי מאפריל=100 (כדי להשוות ש"ח מול כמות בלי ציר משותף מזויף)
function TrendChart({ months, income, expenses, portings, hoverIndex, onHover }) {
  const series = [
    { data: income, color: METRIC_COLORS.income },
    { data: expenses, color: METRIC_COLORS.expenses },
    { data: portings, color: METRIC_COLORS.portings },
  ]
  const indexed = series.map((s) => s.data.map((v) => (v / s.data[0]) * 100))
  const allIdx = indexed.flat()
  const max = Math.max(...allIdx) * 1.1
  const min = Math.min(...allIdx) * 0.9
  const scaleY = (v) => PAD_TOP + PLOT_H - ((v - min) / (max - min)) * PLOT_H

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width="100%" role="img" aria-label="גרף מגמה מאוחד" onMouseLeave={() => onHover(null)}>
        <line x1={PAD_SIDE} y1={CHART_H - PAD_BOTTOM} x2={CHART_W - PAD_SIDE} y2={CHART_H - PAD_BOTTOM} stroke="#E6E4F0" strokeWidth="1" />
        {hoverIndex !== null && (
          <line x1={scaleX(hoverIndex, months.length)} y1={PAD_TOP - 8} x2={scaleX(hoverIndex, months.length)} y2={CHART_H - PAD_BOTTOM} stroke="#E6E4F0" strokeWidth="1.5" strokeDasharray="3,3" />
        )}
        {months.map((m, i) => (
          <text key={m} x={scaleX(i, months.length)} y={CHART_H - 7} textAnchor="middle" fontSize="9.5" fontWeight={i === hoverIndex ? 800 : 500} fill={i === hoverIndex ? 'var(--color-brand)' : '#6B7280'}>
            {m}
          </text>
        ))}
        {series.map((s, si) => {
          const pts = indexed[si].map((v, i) => `${scaleX(i, months.length)},${scaleY(v)}`).join(' ')
          return (
            <g key={s.color}>
              <polyline points={pts} fill="none" stroke={s.color} strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" />
              {indexed[si].map((v, i) => (
                <circle key={i} cx={scaleX(i, months.length)} cy={scaleY(v)} r={i === hoverIndex ? 4.5 : 2.25} fill={s.color} stroke="#fff" strokeWidth={i === hoverIndex ? 1.3 : 0} />
              ))}
            </g>
          )
        })}
        {months.map((_, i) => (
          <rect key={`hit-${i}`} x={scaleX(i, months.length) - CHART_W / months.length / 2} y={0} width={CHART_W / months.length} height={CHART_H} fill="transparent" onMouseEnter={() => onHover(i)} />
        ))}
      </svg>
      {hoverIndex !== null && (
        <ChartTooltip xPct={(scaleX(hoverIndex, months.length) / CHART_W) * 100} yPct={(PAD_TOP / CHART_H) * 100}>
          <TooltipRows month={months[hoverIndex]} income={income[hoverIndex]} expenses={expenses[hoverIndex]} portings={portings[hoverIndex]} />
        </ChartTooltip>
      )}
    </div>
  )
}

// גרף עמודות מקובצות: לכל חודש שלוש עמודות (הכנסות/הוצאות/ניודים), כל סדרה ממודדת לגובה יחסית לשיא שלה עצמה
// (כדי שניודים בכמות קטנה לא "ייעלמו" ליד הכנסות בש"ח) - עם אותם צבעים כמו בגרף המגמה.
function GroupedBarChart({ months, income, expenses, portings, hoverIndex, onHover }) {
  const series = [
    { data: income, color: METRIC_COLORS.income, max: Math.max(...income) },
    { data: expenses, color: METRIC_COLORS.expenses, max: Math.max(...expenses) },
    { data: portings, color: METRIC_COLORS.portings, max: Math.max(...portings) },
  ]
  const clusterW = (CHART_W - PAD_SIDE * 2) / months.length
  const barGap = 2
  const barW = (clusterW - barGap * 4) / 3

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width="100%" role="img" aria-label="גרף עמודות מקובצות" onMouseLeave={() => onHover(null)}>
        <line x1={PAD_SIDE} y1={CHART_H - PAD_BOTTOM} x2={CHART_W - PAD_SIDE} y2={CHART_H - PAD_BOTTOM} stroke="#E6E4F0" strokeWidth="1" />
        {months.map((m, i) => {
          const clusterX = PAD_SIDE + i * clusterW
          const isHover = i === hoverIndex
          return (
            <g key={m} opacity={hoverIndex === null || isHover ? 1 : 0.45} style={{ transition: 'opacity .15s' }}>
              {series.map((s, si) => {
                const h = (s.data[i] / (s.max * 1.1)) * PLOT_H
                const x = clusterX + barGap + si * (barW + barGap)
                const y = CHART_H - PAD_BOTTOM - h
                return <rect key={si} x={x} y={y} width={barW} height={h} rx="2" fill={s.color} />
              })}
              <rect x={clusterX} y={0} width={clusterW} height={CHART_H} fill="transparent" onMouseEnter={() => onHover(i)} style={{ cursor: 'pointer' }} />
              <text x={clusterX + clusterW / 2} y={CHART_H - 7} textAnchor="middle" fontSize="9.5" fontWeight={isHover ? 800 : 500} fill={isHover ? 'var(--color-brand)' : '#6B7280'}>
                {m}
              </text>
            </g>
          )
        })}
      </svg>
      {hoverIndex !== null && (
        <ChartTooltip xPct={((PAD_SIDE + hoverIndex * clusterW + clusterW / 2) / CHART_W) * 100} yPct={(PAD_TOP / CHART_H) * 100}>
          <TooltipRows month={months[hoverIndex]} income={income[hoverIndex]} expenses={expenses[hoverIndex]} portings={portings[hoverIndex]} />
        </ChartTooltip>
      )}
    </div>
  )
}

// עוגת פילוח: קודקודי הפרוסות מחושבים ממעגל ברדיוס 70 סביב (90,90), עם התחלה ב-12:00 בכיוון השעון.
function polarPoint(angleDeg, r = 70, cx = 90, cy = 90) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) }
}

function PieChart() {
  let cumulative = 0
  const slices = salesByCategory.map((cat) => {
    const startAngle = cumulative * 3.6
    cumulative += cat.pct
    const endAngle = cumulative * 3.6
    const large = endAngle - startAngle > 180 ? 1 : 0
    const start = polarPoint(startAngle)
    const end = polarPoint(endAngle)
    const mid = polarPoint((startAngle + endAngle) / 2, 45)
    return {
      ...cat,
      path: `M90,90 L${start.x.toFixed(2)},${start.y.toFixed(2)} A70,70 0 ${large},1 ${end.x.toFixed(2)},${end.y.toFixed(2)} Z`,
      label: mid,
    }
  })

  return (
    <svg viewBox="0 0 180 180" width="120" height="120" role="img" aria-label="עוגת פילוח מכירות לפי קטגוריה">
      {slices.map((slice) => (
        <path key={slice.name} d={slice.path} fill={slice.color} />
      ))}
      {slices.map((slice) => (
        <text key={`${slice.name}-label`} x={slice.label.x} y={slice.label.y} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontWeight="700" fontSize="13">
          {slice.pct}%
        </text>
      ))}
    </svg>
  )
}

export default function Dashboard() {
  const [trendHover, setTrendHover] = useState(null)
  const [barHover, setBarHover] = useState(null)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const months = monthlyFinance.map((m) => m.month)
  const income = monthlyFinance.map((m) => m.income)
  const expenses = monthlyFinance.map((m) => m.expenses)
  const portings = monthlyPortings.map((m) => m.count)

  return (
    <div className="flex flex-col gap-4.5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.label} index={i} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="bg-white border border-[#ECE9F7] rounded-2xl p-4">
          <div className="font-bold text-sm">מגמה חודשית</div>
          <div className="text-[11px] text-text-2 mb-1">מגמת שינוי (אפריל=100) — ריחוף לערכים אמיתיים</div>
          <TrendChart months={months} income={income} expenses={expenses} portings={portings} hoverIndex={trendHover} onHover={setTrendHover} />
          <Legend />
        </div>

        <div className="bg-white border border-[#ECE9F7] rounded-2xl p-4">
          <div className="font-bold text-sm">מכירות לפי חודש</div>
          <div className="text-[11px] text-text-2 mb-1">כל עמודה בגובה יחסי לשיא שלה — ריחוף לפירוט</div>
          <GroupedBarChart months={months} income={income} expenses={expenses} portings={portings} hoverIndex={barHover} onHover={setBarHover} />
          <Legend />
        </div>

        <div className="bg-white border border-[#ECE9F7] rounded-2xl p-4">
          <div className="font-bold text-sm">פילוח מכירות לפי קטגוריה</div>
          <div className="text-[11px] text-text-2 mb-1">החודש הנוכחי</div>
          <div className="flex justify-center py-1">
            <PieChart />
          </div>
          <div className="flex flex-col gap-1.5 pt-1">
            {salesByCategory.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2.5 text-sm">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: cat.color, width: 10, height: 10 }} />
                <span className="font-semibold">{cat.name}</span>
                <span className="ms-auto tabular-nums font-semibold text-text-2">{cat.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#ECE9F7] rounded-2xl overflow-hidden">
        <div className="font-bold text-sm px-4.5 pt-4">ניודים אחרונים</div>
        <p className="text-xs text-text-2 px-4.5 pb-1">לחיצה על שורה פותחת את כרטיס הלקוח</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm mt-2">
            <thead>
              <tr className="text-text-2 text-[11.5px] font-semibold">
                <th className="text-right px-4.5 py-2 border-b border-[#ECE9F7]">לקוח</th>
                <th className="text-right px-4.5 py-2 border-b border-[#ECE9F7]">תאריך</th>
                <th className="text-right px-4.5 py-2 border-b border-[#ECE9F7]">ספק נוכחי</th>
                <th className="text-right px-4.5 py-2 border-b border-[#ECE9F7]">ספק עתידי</th>
                <th className="text-right px-4.5 py-2 border-b border-[#ECE9F7]">מתנה</th>
                <th className="text-right px-4.5 py-2 border-b border-[#ECE9F7]">סטטוס</th>
              </tr>
            </thead>
            <tbody>
              {recentPortings.map((row) => (
                <tr
                  key={row.customer}
                  onClick={() => setSelectedCustomer(customers.find((c) => c.name === row.customer) ?? null)}
                  className="border-b border-[#F1EFF9] last:border-0 cursor-pointer hover:bg-[#FAF8FF] transition-colors"
                >
                  <td className="px-4.5 py-2.5 font-semibold text-brand">{row.customer}</td>
                  <td className="px-4.5 py-2.5 tabular-nums text-text-2">{row.date}</td>
                  <td className="px-4.5 py-2.5">{row.currentCarrier}</td>
                  <td className="px-4.5 py-2.5">
                    {row.futureCarrier === '—' ? '—' : `${row.futureCarrier} (${row.futureDueDate})`}
                  </td>
                  <td className="px-4.5 py-2.5">{row.gift}</td>
                  <td className="px-4.5 py-2.5">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCustomer && (
        <CustomerDrawer customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} onSave={() => setSelectedCustomer(null)} />
      )}
    </div>
  )
}
