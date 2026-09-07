export default function Modal({ title, onClose, onSave, saveLabel = 'שמור', saveDisabled, children, footNote, wide }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className={`bg-white rounded-2xl p-6 w-full ${wide ? 'max-w-lg' : 'max-w-sm'} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-display font-bold text-lg mb-4">{title}</div>
        <div className="flex flex-col gap-3">{children}</div>
        <div className="flex gap-2 justify-end mt-5">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold border border-border hover:bg-bg transition-colors">
            ביטול
          </button>
          <button
            disabled={saveDisabled}
            onClick={onSave}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-brand text-white hover:bg-[#8f45f0] hover:shadow-md transition-all disabled:bg-gray-200 disabled:text-text-2 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {saveLabel}
          </button>
        </div>
        {footNote && <p className="text-xs text-text-2 mt-3">{footNote}</p>}
      </div>
    </div>
  )
}
