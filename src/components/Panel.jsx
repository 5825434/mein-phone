export default function Panel({ title, subtitle, actions, children, className = '' }) {
  return (
    <div className={`bg-white border border-[#ECE9F7] rounded-2xl overflow-hidden ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between px-4.5 pt-4 pb-2">
          <div>
            {title && <div className="font-bold text-sm">{title}</div>}
            {subtitle && <div className="text-xs text-text-2">{subtitle}</div>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </div>
  )
}
