import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Upload, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { getOfflineSubmissions, updateOfflineSubmission } from '../services/offlineStorageService';

const STATUS_META = {
  SAVED_LOCALLY: { label: 'Saved locally', color: '#FFB81C', bg: 'rgba(255,184,28,0.1)', icon: Clock },
  QUEUED:        { label: 'Queued',         color: '#4A90E2', bg: 'rgba(74,144,226,0.1)', icon: Upload },
  UPLOADING:     { label: 'Uploading…',     color: '#4A90E2', bg: 'rgba(74,144,226,0.1)', icon: Upload, pulse: true },
  SYNCED:        { label: 'Synced',          color: '#34C759', bg: 'rgba(52,199,89,0.1)', icon: CheckCircle },
  FAILED:        { label: 'Failed',          color: '#C62828', bg: '#FFEBEE', icon: AlertTriangle },
  FAILED_PERMANENT: { label: 'Failed (permanent)', color: '#C62828', bg: '#FFEBEE', icon: AlertTriangle },
};

function relativeTime(iso) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

export default function SyncPage() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState(() => localStorage.getItem('ut_last_synced'));

  const load = useCallback(async () => {
    try {
      const all = await getOfflineSubmissions();
      const pending = all.filter(s => s.sync_status !== 'SYNCED');
      setSubmissions(pending);
    } catch (err) {
      console.error('[SyncPage] Failed to load submissions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSyncNow = async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const reg = await navigator.serviceWorker.ready;
        await reg.sync.register('sync-offline-submissions');
      }
      await new Promise(r => setTimeout(r, 1500));
      const now = new Date().toISOString();
      localStorage.setItem('ut_last_synced', now);
      setLastSynced(now);
      await load();
    } catch (err) {
      console.error('[SyncPage] Sync failed:', err);
    } finally {
      setSyncing(false);
    }
  };

  const handleRetry = async (submission) => {
    try {
      await updateOfflineSubmission(submission.id, { sync_status: 'QUEUED', retry_count: 0 });
      await load();
    } catch (err) {
      console.error('[SyncPage] Retry failed:', err);
    }
  };

  const pendingCount = submissions.filter(s => s.sync_status !== 'SYNCED').length;

  const formatLastSynced = () => {
    if (!lastSynced) return 'Never';
    const d = new Date(lastSynced);
    const isToday = new Date().toDateString() === d.toDateString();
    return isToday
      ? `Today at ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
      : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' at ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center gap-3 sticky top-0 z-40" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-panel)', minHeight: 'var(--mobile-header-height)' }}>
        <button onClick={() => navigate(-1)} className="p-1 min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ArrowLeft size={20} style={{ color: 'var(--text-secondary)' }} />
        </button>
        <h1 className="flex-1 text-base font-bold">Pending Uploads</h1>
        <button
          type="button"
          onClick={handleSyncNow}
          disabled={syncing}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            backgroundColor: 'var(--accent)', color: 'var(--text-main)',
            border: 'none', cursor: syncing ? 'not-allowed' : 'pointer',
            opacity: syncing ? 0.7 : 1, minHeight: 36,
          }}
        >
          <RefreshCw size={14} style={syncing ? { animation: 'spin 1s linear infinite' } : {}} />
          {syncing ? 'Syncing…' : 'Sync Now'}
        </button>
      </div>

      {/* Count banner */}
      <div
        style={{
          margin: 16,
          padding: '12px 16px',
          borderRadius: 10,
          backgroundColor: pendingCount > 0 ? 'rgba(255,184,28,0.1)' : 'rgba(52,199,89,0.1)',
          border: `1px solid ${pendingCount > 0 ? 'rgba(255,184,28,0.3)' : 'rgba(52,199,89,0.3)'}`,
          display: 'flex', alignItems: 'center', gap: 10,
        }}
      >
        <Upload size={16} style={{ color: pendingCount > 0 ? '#FFB81C' : '#34C759', flexShrink: 0 }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: pendingCount > 0 ? '#FFB81C' : '#34C759' }}>
          {loading ? 'Loading…' : pendingCount === 0 ? 'All records synced' : `${pendingCount} record${pendingCount !== 1 ? 's' : ''} waiting to upload`}
        </span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto px-4" style={{ paddingBottom: 'calc(var(--bottom-nav-height) + var(--safe-bottom) + 16px)' }}>
        {loading ? (
          <div className="flex items-center justify-center py-12" style={{ color: 'var(--text-secondary)' }}>
            Loading…
          </div>
        ) : submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <CheckCircle size={48} style={{ color: '#34C759' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No pending uploads</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {submissions.map(sub => {
              const meta = STATUS_META[sub.sync_status] || STATUS_META.SAVED_LOCALLY;
              const Icon = meta.icon;
              return (
                <div key={sub.id} className="card" style={{ padding: 14 }}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>{sub.record_id || sub.id}</div>
                      <div className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text-main)', textTransform: 'capitalize' }}>
                        {(sub.form_type || 'submission').replace(/_/g, ' ')}
                      </div>
                    </div>
                    <span
                      style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, flexShrink: 0,
                        backgroundColor: meta.bg, color: meta.color,
                      }}
                    >
                      <Icon size={10} style={meta.pulse ? { animation: 'pulse 1.5s ease-in-out infinite' } : {}} />
                      {meta.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Saved {relativeTime(sub.created_at)}
                      {sub.photo_count > 0 && ` · ${sub.photo_count} photo${sub.photo_count !== 1 ? 's' : ''}`}
                    </div>
                    {(sub.sync_status === 'FAILED' || sub.sync_status === 'FAILED_PERMANENT') && (
                      <button
                        type="button"
                        onClick={() => handleRetry(sub)}
                        style={{
                          fontSize: 11, fontWeight: 600, padding: '2px 8px',
                          borderRadius: 6, border: '1px solid #C62828',
                          color: '#C62828', background: 'transparent', cursor: 'pointer',
                        }}
                      >
                        Retry
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '10px 16px',
          borderTop: '1px solid var(--border)',
          fontSize: 11,
          color: 'var(--text-muted)',
          paddingBottom: 'calc(10px + var(--safe-bottom))',
        }}
      >
        Last synced: {formatLastSynced()}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
