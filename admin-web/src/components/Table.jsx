export function TableSkeleton({ cols = 5, rows = 5 }) {
  return (
    <table>
      <thead>
        <tr>
          {Array.from({ length: cols }).map((_, i) => (
            <th key={i}>
              <div className="skeleton skeleton-text" style={{ width: '70%' }} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, ri) => (
          <tr key={ri}>
            {Array.from({ length: cols }).map((_, ci) => (
              <td key={ci}>
                <div
                  className="skeleton skeleton-text"
                  style={{ width: ci === 0 ? '80%' : ci === cols - 1 ? '60%' : '75%', height: 14 }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function Table({ columns, data, emptyMessage = 'No hay datos', loading, skeletonCols }) {
  if (loading) {
    return (
      <div style={{ overflowX: 'auto' }}>
        <TableSkeleton cols={skeletonCols ?? columns?.length ?? 5} />
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i} style={col.style}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!data || data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 48 }}>
                {emptyMessage}
              </td>
            </tr>
          ) : data.map((row, ri) => (
            <tr key={row.id ?? ri} className={row._rowClass}>
              {columns.map((col, ci) => (
                <td key={ci} style={col.tdStyle}>
                  {col.render ? col.render(row) : row[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
