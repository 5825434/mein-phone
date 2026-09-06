import KpiCard from '../components/KpiCard'
import StatusBadge from '../components/StatusBadge'
import { kpis, monthlySales, salesByCategory, recentPortings } from '../data/sampleData'

const CHART_MAX = 20000
const CHART_TOP = 10
const CHART_BASE = 150
const CHART_HEIGHT = CHART_BASE - CHART_TOP
const BAR_WIDTH = 30
const BAR_GAP = 18

function formatK(value) {
  return `${(value / 1000).toFixed(1)}k`
}

function BarChart() {
  return (
    <svg viewBox="0 0 300 185" role="img" aria-label="גרף עמודות מכירות חודשיות">
      <line x1="10" y1={CHART_BASE} x2="292" y2={CHART_BASE} stroke="#E6E4F0" strokeWidth="1" />
      {monthlySales.map((point, i) => {
        const x = 15 + i * (BAR_WIDTH + BAR_GAP)
        const height = (point.value / CHART_MAX) * CHART_HEIGHT
        const y = CHART_BASE - height
        const isLast = i === monthlySales.length - 1
        return (
          <g key={point.month}>
            <rect
              x={x}
              y={y}
              width={BAR_WIDTH}
              height={height}
              rx="4"
              fill={isLast ? 'url(#barGradCurrent)' : 'url(#barGrad)'}
            />
            <text
              x={x + BAR_WIDTH / 2}
              y={y - 6}
              textAnchor="middle"
              fontSize="11"
              fontWeight={isLast ? 800 : 700}
              fill="#4B4B5A"
            >
              {formatK(point.value)}
            </text>
            <text
              x={x + BAR_WIDTH / 2}
              y={CHART_BASE + 16}
              textAnchor="middle"
              fontSize="11"
              fontWeight={isLast ? 800 : 600}
              fill={isLast ? '#7B3FE4' : '#6B7280'}
            >
              {point.month}
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
    <svg viewBox="0 0 180 180" width="150" height="150" role="img" aria-label="עוגת פילוח מכירות לפי קטגוריה">
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
  return (
    <div className="flex flex-col gap-4.5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.label} index={i} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-3.5">
        <div className="bg-white border border-[#ECE9F7] rounded-2xl p-4">
          <div className="font-bold text-sm">מכירות לפי חודש</div>
          <div className="text-xs text-text-2 mb-1">6 חודשים אחרונים, בש"ח</div>
          <BarChart />
        </div>

        <div className="bg-white border border-[#ECE9F7] rounded-2xl p-4">
          <div className="font-bold text-sm">פילוח מכירות לפי קטגוריה</div>
          <div className="text-xs text-text-2 mb-1">החודש הנוכחי</div>
          <div className="flex justify-center py-2">
            <PieChart />
          </div>
          <div className="flex flex-col gap-2 pt-1">
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
