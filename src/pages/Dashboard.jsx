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

const CHART_W = 620
const CHART_H = 260
const PAD_TOP = 30
const PAD_BOTTOM = 28
const PAD_SIDE = 14
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

// תיבת מידע צפה שממוקמת לפי אחוזים בתוך הגרף (לא לפי פיקסלים בפועל) - כך שהיא נשארת מדויקת בכל רוחב מסך
function ChartTooltip({ xPct, yPct, children }) {
  return (
    <div
      className="absolute z-10 bg-white border border-border rounded-lg shadow-lg px-3 py-2 text-xs pointer-events-none whitespace-nowrap"
      style={{ left: `${xPct}%`, top: `${yPct}%`, transform: 'translate(-50%, -120%)' }}
    >
      {children}
    </div>
  )
}

// גרף מגמה מאוחד: כל הסדרות (הכנסות/הוצאות/ניודים) על אותו קנבס, ממודדות למגמת שינוי מאפריל=100
// (כדי שאפשר להשוות יחד מדדים ביחידות שונות - ש"ח מול כמות - בלי לזייף ציר משותף), עם ריחוף שמציג את הערכים האמיתיים.
function TrendChart({ months, series, hoverIndex, onHover }) {
  const indexed = series.map((s) => ({ ...s, idx: s.data.map((v) => (v / s.data[0]) * 100) }))
  const allIdx = indexed.flatMap((s) => s.idx)
  const max = Math.max(...allIdx) * 1.1
  const min = Math.min(...allIdx) * 0.92
  const scaleY = (v) => PAD_TOP + PLOT_H - ((v - min) / (max - min)) * PLOT_H

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width="100%" role="img" aria-label="גרף מגמה מאוחד" onMouseLeave={() => onHover(null)}>
        <line x1={PAD_SIDE} y1={CHART_H - PAD_BOTTOM} x2={CHART_W - PAD_SIDE} y2={CHART_H - PAD_BOTTOM} stroke="#E6E4F0" strokeWidth="1" />

        {hoverIndex !== null && (
          <line
            x1={scaleX(hoverIndex, months.length)}
            y1={PAD_TOP - 10}
            x2={scaleX(hoverIndex, months.length)}
            y2={CHART_H - PAD_BOTTOM}
            stroke="#E6E4F0"
            strokeWidth="1.5"
            strokeDasharray="3,3"
          />
        )}

        {months.map((m, i) => (
          <text key={m} x={scaleX(i, months.length)} y={CHART_H - 8} textAnchor="middle" fontSize="12" fontWeight={i === hoverIndex ? 800 : 500} fill={i === hoverIndex ? 'var(--color-brand)' : '#6B7280'}>
            {m}
          </text>
        ))}

        {indexed.map((s) => {
          const points = s.idx.map((v, i) => `${scaleX(i, months.length)},${scaleY(v)}`).join(' ')
          return (
            <g key={s.name}>
              <polyline points={points} fill="none" stroke={s.color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
              {s.idx.map((v, i) => (
                <circle key={i} cx={scaleX(i, months.length)} cy={scaleY(v)} r={i === hoverIndex ? 6 : 3} fill={s.color} stroke="#fff" strokeWidth={i === hoverIndex ? 2 : 0} />
              ))}
            </g>
          )
        })}

        {/* משטח שקוף לכל חודש שתופס ריחוף בכל הרוחב שלו */}
        {months.map((_, i) => (
          <rect
            key={`hit-${i}`}
            x={scaleX(i, months.length) - CHART_W / months.length / 2}
            y={0}
            width={CHART_W / months.length}
            height={CHART_H}
            fill="transparent"
            onMouseEnter={() => onHover(i)}
          />
        ))}
      </svg>

      {hoverIndex !== null && (
        <ChartTooltip xPct={(scaleX(hoverIndex, months.length) / CHART_W) * 100} yPct={(PAD_TOP / CHART_H) * 100}>
          <div className="font-bold mb-1">{months[hoverIndex]}</div>
          {series.map((s) => (
            <div key={s.name} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: s.color, width: 8, height: 8 }} />
              {s.name}: <span className="font-semibold">{s.unit === 'count' ? s.data[hoverIndex] : money(s.data[hoverIndex])}</span>
            </div>
          ))}
        </ChartTooltip>
      )}
    </div>
  )
}

// גרף עמודות למכירות, עם ריחוף שמציג בתיבה צפה את כל המדדים לאותו חודש (בהשראת אפליקציות מעקב הוצאות פופולריות)
function SalesBarChart({ months, sales, expenses, portings, hoverIndex, onHover }) {
  const barW = 44
  const gap = (CHART_W - PAD_SIDE * 2 - barW * months.length) / (months.length - 1)
  const max = Math.max(...sales) * 1.15
  const scaleY = (v) => (v / max) * PLOT_H

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width="100%" role="img" aria-label="גרף עמודות מכירות" onMouseLeave={() => onHover(null)}>
        <line x1={PAD_SIDE} y1={CHART_H - PAD_BOTTOM} x2={CHART_W - PAD_SIDE} y2={CHART_H - PAD_BOTTOM} stroke="#E6E4F0" strokeWidth="1" />
        {sales.map((v, i) => {
          const x = PAD_SIDE + i * (barW + gap)
          const h = scaleY(v)
          const y = CHART_H - PAD_BOTTOM - h
          const isHover = i === hoverIndex
          const isLast = i === months.length - 1
          return (
            <g key={months[i]}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx="6"
                fill={isLast ? 'url(#barGradCurrent)' : 'url(#barGrad)'}
                opacity={hoverIndex === null || isHover ? 1 : 0.55}
                onMouseEnter={() => onHover(i)}
                style={{ cursor: 'pointer', transition: 'opacity .15s' }}
              />
              <text x={x + barW / 2} y={y - 8} textAnchor="middle" fontSize="12" fontWeight={isHover ? 800 : 700} fill="#4B4B5A">
                {formatK(v)}
              </text>
              <text x={x + barW / 2} y={CHART_H - 8} textAnchor="middle" fontSize="12" fontWeight={isHover ? 800 : 500} fill={isHover ? 'var(--color-brand)' : '#6B7280'}>
                {months[i]}
              </text>
            </g>
          )
        })}
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#A05AFF" />
            <stop offset="1" stopColor="#C79BFF" />
          </linearGradient>
          <linearGradient id="barGradCurrent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7B3FE4" />
            <stop offset="1" stopColor="#A05AFF" />
          </linearGradient>
        </defs>
      </svg>

      {hoverIndex !== null && (
        <ChartTooltip
          xPct={((PAD_SIDE + hoverIndex * (barW + gap) + barW / 2) / CHART_W) * 100}
          yPct={((CHART_H - PAD_BOTTOM - scaleY(sales[hoverIndex])) / CHART_H) * 100}
        >
          <div className="font-bold mb-1">{months[hoverIndex]}</div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand" style={{ width: 8, height: 8 }} />
            מכירות: <span className="font-semibold">{money(sales[hoverIndex])}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-cat-2)', width: 8, height: 8 }} />
            הוצאות: <span className="font-semibold">{money(expenses[hoverIndex])}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-cat-1)', width: 8, height: 8 }} />
            ניודים: <span className="font-semibold">{portings[hoverIndex]}</span>
          </div>
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
  const sales = monthlyFinance.map((m) => m.income)
  const expensesArr = monthlyFinance.map((m) => m.expenses)
  const portingsArr = monthlyPortings.map((m) => m.count)

  const trendSeries = [
    { name: 'הכנסות', color: 'var(--color-cat-1)', data: sales, unit: 'money' },
    { name: 'הוצאות', color: 'var(--color-cat-2)', data: expensesArr, unit: 'money' },
    { name: 'ניודים', color: 'var(--color-brand)', data: portingsArr, unit: 'count' },
  ]

  return (
    <div className="flex flex-col gap-4.5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.label} index={i} {...kpi} />
        ))}
      </div>

      <div className="bg-white border border-[#ECE9F7] rounded-2xl p-4">
        <div className="font-bold text-sm">מגמה חודשית — הכנסות, הוצאות וניודים</div>
        <div className="text-xs text-text-2 mb-2">
          6 חודשים אחרונים, מוצג כמגמת שינוי (אפריל = 100) כדי להשוות יחד מדדים בש"ח ובכמות — עברו עם העכבר על נקודה לערכים האמיתיים
        </div>
        <TrendChart months={months} series={trendSeries} hoverIndex={trendHover} onHover={setTrendHover} />
        <div className="flex items-center gap-4 mt-2">
          {trendSeries.map((s) => (
            <div key={s.name} className="flex items-center gap-1.5 text-xs text-text-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color, width: 10, height: 10 }} />
              {s.name}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-3.5">
        <div className="bg-white border border-[#ECE9F7] rounded-2xl p-4">
          <div className="font-bold text-sm">מכירות לפי חודש</div>
          <div className="text-xs text-text-2 mb-2">עברו עם העכבר על עמודה לפירוט מלא של אותו חודש</div>
          <SalesBarChart months={months} sales={sales} expenses={expensesArr} portings={portingsArr} hoverIndex={barHover} onHover={setBarHover} />
        </div>

        <div className="bg-white border border-[#ECE9F7] rounded-2xl p-4">
          <div className="font-bold text-sm">פילוח מכירות לפי קטגוריה</div>
          <div className="text-xs text-text-2 mb-1">החודש הנוכחי</div>
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
