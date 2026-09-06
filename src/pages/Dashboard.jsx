import KpiCard from '../components/KpiCard'
import StatusBadge from '../components/StatusBadge'
import {
  kpis,
  monthlyFinance,
  monthlyPortings,
  salesByCategory,
  recentPortings,
} from '../data/sampleData'

const CHART_W = 300
const CHART_H = 150
const PAD_TOP = 16
const PAD_BOTTOM = 22
const PAD_SIDE = 8
const PLOT_H = CHART_H - PAD_TOP - PAD_BOTTOM

function scaleX(i, count) {
  return PAD_SIDE + (i * (CHART_W - PAD_SIDE * 2)) / (count - 1)
}

function formatK(value) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`
}

// גרף קווים גנרי - מקבל כמה סדרות על אותו ציר ערכים (יחידה משותפת בלבד, לעולם לא שני צירים)
function LineChart({ months, series, height = CHART_H, formatValue = formatK }) {
  const max = Math.max(...series.flatMap((s) => s.data)) * 1.15
  const scaleY = (v) => PAD_TOP + PLOT_H - (v / max) * PLOT_H

  return (
    <svg viewBox={`0 0 ${CHART_W} ${height}`} width="100%" role="img" aria-label="גרף קווים">
      <line
        x1={PAD_SIDE}
        y1={CHART_H - PAD_BOTTOM}
        x2={CHART_W - PAD_SIDE}
        y2={CHART_H - PAD_BOTTOM}
        stroke="#E6E4F0"
        strokeWidth="1"
      />
      {months.map((m, i) => (
        <text
          key={m}
          x={scaleX(i, months.length)}
          y={CHART_H - 6}
          textAnchor="middle"
          fontSize="10"
          fill="#6B7280"
        >
          {m}
        </text>
      ))}
      {series.map((s) => {
        const points = s.data.map((v, i) => `${scaleX(i, months.length)},${scaleY(v)}`).join(' ')
        const lastIdx = s.data.length - 1
        return (
          <g key={s.name}>
            <polyline points={points} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            {s.data.map((v, i) => (
              <circle key={i} cx={scaleX(i, months.length)} cy={scaleY(v)} r={i === lastIdx ? 3.5 : 2.5} fill={s.color} />
            ))}
            <text
              x={scaleX(lastIdx, months.length)}
              y={scaleY(s.data[lastIdx]) - 8}
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="800"
              fill={s.color}
            >
              {formatValue(s.data[lastIdx])}
            </text>
          </g>
        )
      })}
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
        <text
          key={`${slice.name}-label`}
          x={slice.label.x}
          y={slice.label.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontWeight="700"
          fontSize="13"
        >
          {slice.pct}%
        </text>
      ))}
    </svg>
  )
}

export default function Dashboard() {
  const months = monthlyFinance.map((m) => m.month)
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

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1fr] gap-3.5">
        <div className="bg-white border border-[#ECE9F7] rounded-2xl p-4">
          <div className="font-bold text-sm">הכנסות מול הוצאות</div>
          <div className="text-xs text-text-2 mb-1">6 חודשים אחרונים, בש"ח</div>
          <LineChart months={months} series={financeSeries} />
          <Legend series={financeSeries} />
        </div>

        <div className="bg-white border border-[#ECE9F7] rounded-2xl p-4">
          <div className="font-bold text-sm">ניודים לפי חודש</div>
          <div className="text-xs text-text-2 mb-1">6 חודשים אחרונים, כמות</div>
          <LineChart months={months} series={portingsSeries} formatValue={(v) => `${v}`} />
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
                <tr key={row.customer} className="border-b border-[#F1EFF9] last:border-0">
                  <td className="px-4.5 py-2.5">{row.customer}</td>
                  <td className="px-4.5 py-2.5 tabular-nums text-text-2">{row.date}</td>
                  <td className="px-4.5 py-2.5">{row.currentCarrier}</td>
                  <td className="px-4.5 py-2.5">{row.futureCarrier}</td>
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
    </div>
  )
}
