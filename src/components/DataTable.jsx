export default function DataTable({ columns, rows, rowKey, onRowClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm mt-1">
        <thead>
          <tr className="text-text-2 text-[11.5px] font-semibold">
            {columns.map((col) => (
              <th key={col.key} className="text-right px-4.5 py-2 border-b border-[#ECE9F7] whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row[rowKey]}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`border-b border-[#F1EFF9] last:border-0 transition-colors ${
                onRowClick ? 'cursor-pointer hover:bg-[#FAF8FF]' : ''
              }`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4.5 py-2.5 whitespace-nowrap">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4.5 py-8 text-center text-text-2">
                אין תוצאות להצגה
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
