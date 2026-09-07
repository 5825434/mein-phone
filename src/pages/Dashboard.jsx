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

const CHART_W = 300
const CHART_H = 210
const PAD_TOP = 20
const PAD_BOTTOM = 24
const PAD_SIDE = 10
const PLOT_H = CHART_H - PAD_TOP - PAD_BOTTOM

function scaleX(i, count) {
  return PAD_SIDE + (i * (CHART_W - PAD_SIDE * 2)) / (count - 1)
}

function formatK(value) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`
}

// גרף קווים גנרי עם ריחוף משותף: מעביר עכבר על נקודה מדגיש אותה בכל הסדרות ומעדכן את שורת הנתונים למטה
function LineChart({ months, series, hoverIndex, onHover, formatValue = formatK }) {
  const max = Math.max(...series.flatMap((s) => s.data)) * 1.15
  const scaleY = (v) => PAD_TOP + PLOT_H - (v / max) * PLOT_H

  return (
    <svg
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      width="100%"
      role="img"
      aria-label="גרף קווים"
      onMouseLeave={() => onHover(null)}
    >
      <line x1={PAD_SIDE} y1={CHART_H - PAD_BOTTOM} x2={CHART_W - PAD_SIDE} y2={CHART_H - PAD_BOTTOM} stroke="#E6E4F0" strokeWidth="1" />

      {hoverIndex !== null && (
        <line
          x1={scaleX(hoverIndex, months.length)}
          y1={PAD_TOP - 6}
          x2={scaleX(hoverIndex, months.length)}
          y2={CHART_H - PAD_BOTTOM}
          stroke="#E6E4F0"
          strokeWidth="1.5"
          strokeDasharray="3,3"
        />
      )}

      {months.map((m, i) => (
        <text key={m} x={scaleX(i, months.length)} y={CHART_H - 6} textAnchor="middle" fontSize="10.5" fontWeight={i === hoverIndex ? 800 : 400} fill={i === hoverIndex ? 'var(--color-brand)' : '#6B7280'}>
          {m}
        </text>
      ))}

      {series.map((s) => {
        const points = s.data.map((v, i) => `${scaleX(i, months.length)},${scaleY(v)}`).join(' ')
        const lastIdx = s.data.length - 1
        return (
          <g key={s.name}>
            <polyline points={points} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {s.data.map((v, i) => (
              <circle
                key={i}
                cx={scaleX(i, months.length)}
                cy={scaleY(v)}
                r={i === hoverIndex ? 5.5 : i === lastIdx ? 3.5 : 2.5}
                fill={s.color}
                stroke="#fff"
                strokeWidth={i === hoverIndex ? 1.5 : 0}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => onHover(i)}
              />
            ))}
            {hoverIndex === null && (
              <text x={scaleX(lastIdx, months.length)} y={scaleY(s.data[lastIdx]) - 10} textAnchor="middle" fontSize="11" fontWeight="800" fill={s.color}>
                {formatValue(s.data[lastIdx])}
              </text>
            )}
          </g>
        )
      })}

      {/* משטח שקוף מעל כל הרוחב שתופס תנועת עכבר בין הנקודות, כדי שהריחוף לא "יידרש" לפגוע בול בעיגול */}
      {months.map((_, i) => (
        <rect
          key={`hit-${i}`}
          x={scaleX(i, months.length) - (CHART_W / months.length) / 2}
          y={0}
          width={CHART_W / months.length}
          height={CHART_H}
          fill="transparent"
          onMouseEnter={() => onHover(i)}
        />
      ))}
    </svg>
  )
}

function Legend({ series }) {
  return (
    <div className="flex items-center gap-4 mt-1">
      {series.map((s) => (
        <div key={s.name} className="flex items-center gap-1.5 text-xs text-text-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color, width: 10, height: 10 }} />
          {s.name}
        </div>
      ))}
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
  const [hoverIndex, setHoverIndex] = useState(null)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const months = monthlyFinance.map((m) => m.month)
  const activeIndex = hoverIndex ?? months.length - 1

  const financeSeries = [
    { name: 'הכנסות', color: 'var(--color-cat-1)', data: monthlyFinance.map((m) => m.income) },
    { name: 'הוצאות', color: 'var(--color-cat-2)', data: monthlyFinance.map((m) => m.expenses) },
  ]
  const portingsSeries = [{ name: 'ניודים', color: 'var(--color-brand)', data: monthlyPortings.map((m) => m.count) }]

  return (
    <div className="flex flex-col gap-4.5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.label} index={i} {...kpi} />
        ))}
      </div>

      <div className="bg-white border border-[#ECE9F7] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="font-bold text-sm">סקירה חודשית</div>
            <div className="text-xs text-text-2">6 חודשים אחרונים — עברו עם העכבר על נקודה לפרטים</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr_0.9fr] gap-4 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-[#F1EFF9]">
          <div className="lg:pl-4">
            <div className="text-xs font-semibold text-text-2 mb-1">הכנסות מול הוצאות (בש"ח)</div>
            <LineChart months={months} series={financeSeries} hoverIndex={hoverIndex} onHover={setHoverIndex} />
            <Legend series={financeSeries} />
          </div>

          <div className="lg:px-4 pt-4 lg:pt-0">
            <div className="text-xs font-semibold text-text-2 mb-1">ניודים לפי חודש (כמות)</div>
            <LineChart months={months} series={portingsSeries} hoverIndex={hoverIndex} onHover={setHoverIndex} formatValue={(v) => `${v}`} />
          </div>

          <div className="lg:pr-4 pt-4 lg:pt-0">
            <div className="text-xs font-semibold text-text-2 mb-1">פילוח מכירות לפי קטגוריה (החודש)</div>
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

        <div className="mt-4 pt-3 border-t border-[#F1EFF9] flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
          <span className="font-bold">{months[activeIndex]}:</span>
          <span style={{ color: 'var(--color-cat-1)' }}>הכנסות {formatK(monthlyFinance[activeIndex].income)} ₪</span>
          <span style={{ color: 'var(--color-cat-2)' }}>הוצאות {formatK(monthlyFinance[activeIndex].expenses)} ₪</span>
          <span style={{ color: 'var(--color-brand)' }}>ניודים {monthlyPortings[activeIndex].count}</span>
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
