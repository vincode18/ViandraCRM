/* ─────────────────────────────────────────────────────────────────────────
   Unsaved Changes Modal
   Confirmation dialog before closing tabs with unsaved form changes
   ───────────────────────────────────────────────────────────────────────── */

import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function UnsavedChangesModal({ isOpen, onDiscard, onKeepEditing, tabLabel }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="unsaved-modal-title"
    >
      <div
        className="rounded-lg shadow-2xl max-w-md w-full mx-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
        }}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0" style={{ color: '#F5C800' }}>
              <AlertTriangle size={24} />
            </div>
            <div className="flex-1">
              <h2
                id="unsaved-modal-title"
                className="text-lg font-semibold mb-2"
                style={{ color: 'var(--text-main)' }}
              >
                Unsaved changes
              </h2>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                You have unsaved changes on <strong>{tabLabel || 'this tab'}</strong>. Do you want to discard them?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={onKeepEditing}
                  className="px-4 py-2 rounded text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-light)',
                    color: 'var(--text-main)',
                    border: '1px solid var(--border)',
                  }}
                >
                  Keep editing
                </button>
                <button
                  onClick={onDiscard}
                  className="px-4 py-2 rounded text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: '#1a1a1a',
                  }}
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
