export default function PlaceholderPage({ title, note }) {
  return (
    <div className="bg-white border border-[#ECE9F7] rounded-2xl p-8 text-center text-text-2">
      <div className="font-display text-lg font-bold text-text mb-2">{title}</div>
      <p className="text-sm max-w-md mx-auto">{note}</p>
    </div>
  )
}
