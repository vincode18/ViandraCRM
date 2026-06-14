import { AlertTriangle } from 'lucide-react';

/**
 * ConflictResolution — shown when a 409 Conflict is returned during offline sync.
 * Per PWA-PRD-02 §5.4.3.
 *
 * Props:
 *   submission: object  — the local offline submission
 *   serverVersion: object  — the server's current record from 409 response
 *   onResolved: (action: 'keep_mine' | 'use_server') => void
 */
export default function ConflictResolution({ submission, serverVersion, onResolved }) {
  if (!submission || !serverVersion) return null;

  const fields = Object.keys(submission.payload || {}).filter(k => k !== 'photo_count');

  return (
    <div style={{ padding: 16 }}>
      {/* Warning header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
        padding: '10px 14px', borderRadius: 8,
        backgroundColor: 'rgba(198,40,40,0.08)', border: '1px solid rgba(198,40,40,0.3)',
        color: '#C62828',
      }}>
        <AlertTriangle size={16} style={{ flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>Data conflict detected</div>
          <div style={{ fontSize: 12, marginTop: 2 }}>
            This record was modified on the server since you last synced. Choose which version to keep.
          </div>
        </div>
      </div>

      {/* Two-panel comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        {/* Your version */}
        <div style={{
          border: '2px solid var(--accent)',
          borderRadius: 8, padding: 12,
          backgroundColor: 'var(--bg-card)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-dark)', marginBottom: 10 }}>
            Your version
          </div>
          {fields.map(key => (
            <div key={key} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>{key}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', wordBreak: 'break-word' }}>
                {String(submission.payload[key] ?? '—')}
              </div>
            </div>
          ))}
          <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text-muted)' }}>
            Submitted: {new Date(submission.created_at).toLocaleString()}
          </div>
        </div>

        {/* Server version */}
        <div style={{
          border: '1px solid var(--border)',
          borderRadius: 8, padding: 12,
          backgroundColor: 'var(--bg-card)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 10 }}>
            Server version
          </div>
          {fields.map(key => (
            <div key={key} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>{key}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', wordBreak: 'break-word' }}>
                {String(serverVersion[key] ?? '—')}
              </div>
            </div>
          ))}
          {serverVersion.last_modified && (
            <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text-muted)' }}>
              Last modified: {new Date(serverVersion.last_modified).toLocaleString()}
            </div>
          )}
        </div>
      </div>

      {/* Resolution actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          type="button"
          className="btn-primary"
          style={{ minHeight: 44, fontWeight: 600 }}
          onClick={() => onResolved('keep_mine')}
        >
          Keep My Version
        </button>
        <button
          type="button"
          className="btn-secondary"
          style={{ minHeight: 44 }}
          onClick={() => onResolved('use_server')}
        >
          Use Server Version
        </button>
      </div>
    </div>
  );
}
