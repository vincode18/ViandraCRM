import React, { useState, useRef, useEffect } from 'react';
import { Check, X, Edit2, Loader } from 'lucide-react';
import { updateCaseField, insertAuditLog } from '../utils/supabase';

/**
 * EditableField — click to edit any case field inline.
 * Shows a before/after SQL diff panel after a successful save.
 *
 * Props:
 *   caseNumber  string   — case_number used as PK in Supabase
 *   fieldName   string   — exact DB column name (e.g. "subject", "priority")
 *   value       string   — current display value
 *   label       string   — label shown above the field
 *   type        string   — "text" | "select" | "textarea"
 *   options     string[] — required when type="select"
 *   onSaved     fn       — called with newValue after successful save
 */
export default function EditableField({
  caseNumber, fieldName, value, label,
  type = 'text', options = [], onSaved,
  renderValue,
}) {
  const [editing, setEditing]   = useState(false);
  const [draft, setDraft]       = useState(value ?? '');
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [diff, setDiff]         = useState(null); // { before, after, sqlBefore, sqlAfter }
  const inputRef = useRef(null);

  /* sync external value changes */
  useEffect(() => { if (!editing) setDraft(value ?? ''); }, [value, editing]);

  /* auto-focus when editing starts */
  useEffect(() => { if (editing && inputRef.current) inputRef.current.focus(); }, [editing]);

  const handleEdit = () => { setDiff(null); setError(''); setEditing(true); };
  const handleCancel = () => { setDraft(value ?? ''); setEditing(false); setError(''); };

  const handleSave = async () => {
    if (draft === value) { setEditing(false); return; }
    setSaving(true);
    setError('');
    try {
      const result = await updateCaseField(caseNumber, fieldName, draft);
      setDiff(result);

      /* write audit log entry */
      const now = new Date();
      const pad = n => String(n).padStart(2, '0');
      await insertAuditLog({
        caseNumber,
        timestamp: now.toISOString(),
        date: now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
        user: 'System User',
        field: label || fieldName,
        type: 'field-update',
        oldValue: String(result.before ?? ''),
        newValue: String(draft),
        note: `${now.toISOString()} - ${label || fieldName}: "${result.before}" → "${draft}"`,
      });

      setEditing(false);
      onSaved && onSaved(draft);
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  /* keyboard shortcuts */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && type !== 'textarea') { e.preventDefault(); handleSave(); }
    if (e.key === 'Escape') handleCancel();
  };

  /* ── render ── */
  return (
    <div style={{ marginBottom: 2 }}>

      {/* Display mode */}
      {!editing && (
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          onMouseEnter={e => { const btn = e.currentTarget.querySelector('button'); if (btn) btn.style.opacity = '1'; }}
          onMouseLeave={e => { const btn = e.currentTarget.querySelector('button'); if (btn) btn.style.opacity = '0.35'; }}
        >
          <span style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.5, flex: 1 }}>
            {renderValue
              ? renderValue(value)
              : (value || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>—</span>)
            }
          </span>
          <button
            onClick={handleEdit}
            title={`Edit ${label}`}
            style={{
              opacity: 0.35,
              transition: 'opacity 0.15s, background 0.15s',
              padding: '3px 5px',
              borderRadius: 4,
              border: '1px solid var(--border)',
              background: 'var(--bg-lighter)',
              color: '#0070d2',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
            onFocus={e => e.currentTarget.style.opacity = '1'}
            onBlur={e => e.currentTarget.style.opacity = '0.35'}
          >
            <Edit2 size={12} />
          </button>
        </div>
      )}

      {/* Edit mode */}
      {editing && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {type === 'textarea' ? (
            <textarea
              ref={inputRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
              style={{
                width: '100%', fontSize: 13, padding: '6px 8px',
                border: '1.5px solid #0070d2', borderRadius: 4,
                background: 'var(--bg-card)', color: 'var(--text-main)',
                resize: 'vertical', outline: 'none',
              }}
            />
          ) : type === 'select' ? (
            <select
              ref={inputRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                fontSize: 13, padding: '6px 8px',
                border: '1.5px solid #0070d2', borderRadius: 4,
                background: 'var(--bg-card)', color: 'var(--text-main)',
                outline: 'none',
              }}
            >
              {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                fontSize: 13, padding: '6px 8px',
                border: '1.5px solid #0070d2', borderRadius: 4,
                background: 'var(--bg-card)', color: 'var(--text-main)',
                outline: 'none', width: '100%',
              }}
            />
          )}

          {/* Save / Cancel buttons */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '4px 10px', fontSize: 12, fontWeight: 600,
                background: '#0070d2', color: '#fff',
                border: 'none', borderRadius: 4, cursor: saving ? 'wait' : 'pointer',
              }}
            >
              {saving
                ? <><Loader size={11} className="animate-spin" /> Saving…</>
                : <><Check size={11} /> Save</>}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '4px 10px', fontSize: 12, fontWeight: 600,
                background: 'var(--bg-lighter)', color: 'var(--text-secondary)',
                border: '1px solid var(--border)', borderRadius: 4, cursor: 'pointer',
              }}
            >
              <X size={11} /> Cancel
            </button>
            {error && (
              <span style={{ fontSize: 11, color: '#e74c3c' }}>{error}</span>
            )}
          </div>
        </div>
      )}

      {/* Before / After SQL diff panel — shown after a successful save */}
      {diff && !editing && (
        <div style={{
          marginTop: 8, borderRadius: 6, overflow: 'hidden',
          border: '1px solid var(--border)', fontSize: 11,
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '4px 10px', background: 'var(--bg-light)',
            borderBottom: '1px solid var(--border)',
          }}>
            <span style={{ fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.03em' }}>
              SUPABASE QUERY LOG
            </span>
            <button
              onClick={() => setDiff(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', lineHeight: 1 }}
            >
              <X size={12} />
            </button>
          </div>

          {/* Two-column diff */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {/* BEFORE */}
            <div style={{ borderRight: '1px solid var(--border)' }}>
              <div style={{
                padding: '3px 10px', background: 'rgba(231,76,60,0.08)',
                borderBottom: '1px solid var(--border)',
                color: '#c0392b', fontWeight: 700, fontSize: 10, letterSpacing: '0.06em',
              }}>
                ─ BEFORE
              </div>
              <pre style={{
                margin: 0, padding: '8px 10px', fontSize: 11, lineHeight: 1.6,
                color: '#c0392b', background: 'rgba(231,76,60,0.04)',
                overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              }}>
                {diff.sqlBefore}
              </pre>
            </div>

            {/* AFTER */}
            <div>
              <div style={{
                padding: '3px 10px', background: 'rgba(43,187,78,0.08)',
                borderBottom: '1px solid var(--border)',
                color: '#27ae60', fontWeight: 700, fontSize: 10, letterSpacing: '0.06em',
              }}>
                + AFTER
              </div>
              <pre style={{
                margin: 0, padding: '8px 10px', fontSize: 11, lineHeight: 1.6,
                color: '#27ae60', background: 'rgba(43,187,78,0.04)',
                overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              }}>
                {diff.sqlAfter}
              </pre>
            </div>
          </div>

          {/* Value summary */}
          <div style={{
            display: 'flex', gap: 12, padding: '5px 10px',
            background: 'var(--bg-light)', borderTop: '1px solid var(--border)',
            color: 'var(--text-tertiary)', fontSize: 11,
          }}>
            <span><strong style={{ color: '#c0392b' }}>Before:</strong> {String(diff.before ?? '—')}</span>
            <span>→</span>
            <span><strong style={{ color: '#27ae60' }}>After:</strong> {String(diff.after ?? '—')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
