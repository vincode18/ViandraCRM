import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/** Record detail scaffolding shared by Service Area + Shift detail pages. */

export function DetailHeader({ icon: Icon, eyebrow, title, badge, actions, backTo }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-start justify-between gap-4 px-6 py-4 flex-wrap"
         style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-panel)' }}>
      <div className="flex items-center gap-3 min-w-0">
        {backTo && (
          <button type="button" onClick={() => navigate(backTo)} aria-label="Back"
                  className="p-2 rounded-lg" style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            <ArrowLeft size={16} />
          </button>
        )}
        <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
             style={{ backgroundColor: 'var(--accent)', color: '#1a1a1a' }}>
          <Icon size={22} />
        </div>
        <div className="min-w-0">
          {eyebrow && <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{eyebrow}</div>}
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold truncate" style={{ color: 'var(--text-main)' }}>{title}</h1>
            {badge}
          </div>
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex items-center gap-1 px-6 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-panel)' }}>
      {tabs.map((t) => (
        <button key={t} type="button" onClick={() => onChange(t)}
          className="px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors"
          style={active === t
            ? { borderColor: 'var(--accent)', color: 'var(--text-main)' }
            : { borderColor: 'transparent', color: 'var(--text-tertiary)' }}>
          {t}
        </button>
      ))}
    </div>
  );
}

export function Section({ title, icon: Icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg overflow-hidden mb-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3"
        style={{ color: 'var(--text-main)' }}>
        <span className="flex items-center gap-2 text-base font-semibold">
          {Icon && <Icon size={17} style={{ color: 'var(--text-tertiary)' }} />}{title}
        </span>
        {open ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1" style={{ borderTop: '1px solid var(--border)' }}>
          {children}
        </div>
      )}
    </div>
  );
}

/** Two-column field grid used inside a Section. */
export function FieldGrid({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-3">{children}</div>;
}

export function Field({ label, value, mono, accent }) {
  return (
    <div className="min-w-0" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
      <div className="text-[11px] mb-0.5" style={{ color: 'var(--text-tertiary)' }}>{label}</div>
      <div className={`text-sm ${mono ? 'font-mono' : ''} truncate`}
           style={{ color: accent ? 'var(--accent-dark)' : 'var(--text-secondary)', fontWeight: 500 }}>
        {value === '' || value == null ? '—' : value}
      </div>
    </div>
  );
}

/** Right-rail panel card (Quick Summary / Activity / System Info). */
export function RailCard({ title, action, children }) {
  return (
    <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{title}</div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function RailRow({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-xs">
      <span style={{ color: 'var(--text-tertiary)' }}>{label}</span>
      <span className="font-medium text-right" style={{ color: accent ? 'var(--accent-dark)' : 'var(--text-secondary)' }}>{value || '—'}</span>
    </div>
  );
}
