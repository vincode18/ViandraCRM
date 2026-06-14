/* ─────────────────────────────────────────────────────────────────────────
   Subtab Bar
   Secondary tab row nested within a workspace tab for related records
   ───────────────────────────────────────────────────────────────────────── */

import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useTabs } from '../../contexts/TabContext';
import { useSubtabs } from '../../contexts/SubtabContext';

export default function SubtabBar({ workspaceTabId }) {
  const { activeTab } = useTabs();
  const { getSubtabs, getActiveSubtab, closeSubtab, setActiveSubtab, renameSubtab } = useSubtabs();
  const [menuOpen, setMenuOpen] = useState(null);
  const [renamingSubtab, setRenamingSubtab] = useState(null);
  const [renamingValue, setRenamingValue] = useState('');
  const menuRef = useRef(null);
  const renameInputRef = useRef(null);

  const subtabs = getSubtabs(workspaceTabId);
  const activeSubtab = getActiveSubtab(workspaceTabId);

  // Close menu on outside click
  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(null);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus rename input
  useEffect(() => {
    if (renamingSubtab && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingSubtab]);

  // Hide subtab bar if no subtabs
  if (subtabs.length === 0) return null;

  const handleSubtabClick = (subtabId) => setActiveSubtab(workspaceTabId, subtabId);

  const handleRenameSubmit = (e) => {
    e.preventDefault();
    if (renamingSubtab && renamingValue.trim()) {
      renameSubtab(workspaceTabId, renamingSubtab, renamingValue.trim().slice(0, 40));
    }
    setRenamingSubtab(null);
    setRenamingValue('');
  };

  const handleRenameCancel = () => {
    setRenamingSubtab(null);
    setRenamingValue('');
  };

  return (
    <div
      role="tablist"
      aria-label={`Subtabs for ${activeTab?.label || 'record'}`}
      className="flex items-center gap-1 px-3 overflow-x-auto"
      style={{
        height: '36px',
        backgroundColor: 'var(--bg-panel)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {subtabs.map(subtab => (
        <Subtab
          key={subtab.id}
          subtab={subtab}
          isActive={activeSubtab?.id === subtab.id}
          onClick={() => handleSubtabClick(subtab.id)}
          onMenuOpen={() => setMenuOpen(subtab.id)}
          menuOpen={menuOpen === subtab.id}
          onMenuClose={() => setMenuOpen(null)}
          onClose={() => closeSubtab(workspaceTabId, subtab.id)}
          onRenameStart={() => {
            setRenamingSubtab(subtab.id);
            setRenamingValue(subtab.customLabel || subtab.label);
          }}
          isRenaming={renamingSubtab === subtab.id}
          renamingValue={renamingValue}
          onRenameChange={setRenamingValue}
          onRenameSubmit={handleRenameSubmit}
          onRenameCancel={handleRenameCancel}
          renameInputRef={renameInputRef}
        />
      ))}
    </div>
  );
}

function Subtab({
  subtab,
  isActive,
  onClick,
  onMenuOpen,
  menuOpen,
  onMenuClose,
  onClose,
  onRenameStart,
  isRenaming,
  renamingValue,
  onRenameChange,
  onRenameSubmit,
  onRenameCancel,
  renameInputRef,
}) {
  const Icon = subtab.icon;

  return (
    <div className="relative group shrink-0" ref={menuOpen ? null : undefined}>
      <div
        role="tab"
        aria-selected={isActive}
        onClick={onClick}
        className="flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer transition-colors"
        style={{
          backgroundColor: isActive ? 'var(--bg-card)' : 'var(--bg-light)',
          borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
          borderBottomColor: isActive ? '#F5C800' : 'transparent',
        }}
        title={subtab.customLabel || subtab.label}
      >
        <Icon size={14} style={{ color: isActive ? 'var(--text-main)' : 'var(--text-tertiary)' }} />

        {isRenaming ? (
          <form onSubmit={onRenameSubmit} className="flex-1">
            <input
              ref={renameInputRef}
              type="text"
              value={renamingValue}
              onChange={e => onRenameChange(e.target.value)}
              onBlur={onRenameCancel}
              onKeyDown={e => {
                if (e.key === 'Escape') onRenameCancel();
              }}
              className="w-full text-xs bg-transparent border border-[var(--accent)] rounded px-1 outline-none"
              style={{ color: 'var(--text-main)' }}
              maxLength={40}
            />
          </form>
        ) : (
          <span
            className="text-xs truncate max-w-[140px]"
            style={{
              color: isActive ? 'var(--text-main)' : 'var(--text-tertiary)',
              fontWeight: isActive ? 600 : 500,
            }}
          >
            {subtab.customLabel || subtab.label}
          </span>
        )}

        {!subtab.isRoot && (isActive || !isRenaming) && (
          <button
            onClick={e => {
              e.stopPropagation();
              onClose();
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-[var(--bg-light)]"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Close subtab"
          >
            <X size={12} />
          </button>
        )}

        <button
          onClick={e => {
            e.stopPropagation();
            menuOpen ? onMenuClose() : onMenuOpen();
          }}
          className="p-0.5 rounded hover:bg-[var(--bg-light)]"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Subtab menu"
        >
          <ChevronDown size={12} />
        </button>
      </div>

      {/* Subtab Menu Dropdown */}
      {menuOpen && (
        <div
          className="absolute left-0 top-full mt-1 min-w-[140px] rounded shadow-lg z-50"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }}
        >
          <button
            onClick={() => {
              onMenuClose();
              // Refresh functionality - to be implemented
              window.location.reload();
            }}
            className="w-full px-3 py-2 text-left text-xs hover:bg-[var(--bg-light)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            Refresh
          </button>
          
          {!subtab.isRoot && (
            <>
              <button
                onClick={() => {
                  onRenameStart();
                  onMenuClose();
                }}
                className="w-full px-3 py-2 text-left text-xs hover:bg-[var(--bg-light)]"
                style={{ color: 'var(--text-secondary)' }}
              >
                Rename
              </button>
              <button
                onClick={() => {
                  onClose();
                  onMenuClose();
                }}
                className="w-full px-3 py-2 text-left text-xs hover:bg-[var(--bg-light)] text-red-500"
              >
                Close
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
