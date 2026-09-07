import { Link } from 'react-router-dom'

const gradients = [
  'from-[#A05AFF] to-[#4BCBEB]',
  'from-[#1BCFB4] to-[#4BCBEB]',
  'from-[#9E58FF] to-[#FE9496]',
  'from-[#FE9496] to-[#F59E0B]',
]

export default function KpiCard({ index, label, value, trend, to }) {
  const content = (
    <>
      <span className="text-xs font-semibold text-white/85">{label}</span>
      <span className="font-display font-bold text-2xl tabular-nums">{value}</span>
      <span className="text-[11.5px] text-white/85">{trend}</span>
    </>
  )

  const className = `rounded-2xl p-4 flex flex-col gap-1.5 text-white shadow-[0_12px_24px_-14px_rgba(90,40,180,0.5)] bg-gradient-to-br ${gradients[index % gradients.length]} ${
    to ? 'transition-transform duration-150 hover:-translate-y-1 hover:shadow-[0_18px_30px_-14px_rgba(90,40,180,0.6)] cursor-pointer' : ''
  }`

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    )
  }

  return <div className={className}>{content}</div>
}
