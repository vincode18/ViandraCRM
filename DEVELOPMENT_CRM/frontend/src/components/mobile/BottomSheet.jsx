import { useEffect, useRef } from 'react';

export default function BottomSheet({ open, onClose, title, children }) {
  const panelRef = useRef(null);

  // Escape key close
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Focus trap
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      onClick={onClose}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="relative w-full rounded-t-2xl outline-none"
        style={{
          backgroundColor: 'var(--bg-panel)',
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'slideUpSheet 200ms ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: 'var(--border)' }} />
        </div>

        {title && (
          <div className="px-4 pb-3 pt-1 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-main)' }}>{title}</h3>
          </div>
        )}

        <div className="p-4">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes slideUpSheet {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
