export default function Field({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-semibold text-text-2 text-xs">{label}</span>
      <input
        {...props}
        className="border border-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/40"
      />
    </label>
  )
}
