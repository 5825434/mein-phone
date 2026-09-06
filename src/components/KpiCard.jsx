const gradients = [
  'from-[#A05AFF] to-[#4BCBEB]',
  'from-[#1BCFB4] to-[#4BCBEB]',
  'from-[#9E58FF] to-[#FE9496]',
  'from-[#FE9496] to-[#F59E0B]',
]

export default function KpiCard({ index, label, value, trend }) {
  return (
    <div
      className={`rounded-2xl p-4 flex flex-col gap-1.5 text-white shadow-[0_12px_24px_-14px_rgba(90,40,180,0.5)] bg-gradient-to-br ${gradients[index % gradients.length]}`}
    >
      <span className="text-xs font-semibold text-white/85">{label}</span>
      <span className="font-display font-bold text-2xl tabular-nums">{value}</span>
      <span className="text-[11.5px] text-white/85">{trend}</span>
    </div>
  )
}
