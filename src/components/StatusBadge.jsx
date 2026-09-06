const styles = {
  done: 'bg-success',
  pending: 'bg-warning',
  late: 'bg-danger',
  declined: 'bg-gray-400',
}

const labels = {
  done: 'הושלם',
  pending: 'ממתין לניוד הבא',
  late: 'באיחור',
  declined: 'נדחה',
}

export default function StatusBadge({ status, children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-bold rounded-full px-3 py-1 text-white ${styles[status] ?? 'bg-gray-400'}`}
    >
      {children ?? labels[status] ?? status}
    </span>
  )
}
