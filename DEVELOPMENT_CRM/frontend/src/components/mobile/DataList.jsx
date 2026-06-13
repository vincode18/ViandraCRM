import { useIsMobile } from '../../hooks/useBreakpoint';

/**
 * Responsive data list: renders a <table> on desktop and stacked cards on mobile.
 *
 * Props:
 *   columns: Array<{ key, label, hideMobile?: boolean, render?: (value, row) => ReactNode }>
 *   data: Array<object>
 *   onRowClick?: (row) => void
 *   mobileCardRenderer?: (row) => ReactNode  — custom card layout; falls back to auto-generated card
 *   emptyMessage?: string
 */
export default function DataList({
  columns,
  data,
  onRowClick,
  mobileCardRenderer,
  emptyMessage = 'No data found',
}) {
  const isMobile = useIsMobile();

  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
        <p style={{ fontSize: 14 }}>{emptyMessage}</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {data.map((row, i) => (
          <div
            key={row.id ?? i}
            className="card"
            style={{
              padding: 16,
              cursor: onRowClick ? 'pointer' : 'default',
            }}
            onClick={() => onRowClick?.(row)}
            role={onRowClick ? 'button' : undefined}
            tabIndex={onRowClick ? 0 : undefined}
            onKeyDown={onRowClick ? (e) => { if (e.key === 'Enter') onRowClick(row); } : undefined}
          >
            {mobileCardRenderer
              ? mobileCardRenderer(row)
              : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {columns
                    .filter(c => !c.hideMobile)
                    .map(col => (
                      <div key={col.key} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)' }}>
                          {col.label}
                        </span>
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'right' }}>
                          {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                        </span>
                      </div>
                    ))}
                </div>
              )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid var(--border)' }}>
          {columns.map(col => (
            <th
              key={col.key}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr
            key={row.id ?? i}
            style={{
              borderBottom: '1px solid var(--border)',
              cursor: onRowClick ? 'pointer' : 'default',
              transition: 'background-color 150ms',
            }}
            onClick={() => onRowClick?.(row)}
            onMouseEnter={e => { if (onRowClick) e.currentTarget.style.backgroundColor = 'var(--accent-pale)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            {columns.map(col => (
              <td key={col.key} style={{ padding: '12px', fontSize: 13, color: 'var(--text-secondary)' }}>
                {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
