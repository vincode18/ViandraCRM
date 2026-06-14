/* ─────────────────────────────────────────────────────────────────────────
   Workspace Tab Bar
   Top-level tab bar for multi-record browsing with pinning and overflow
   ───────────────────────────────────────────────────────────────────────── */

import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, MoreHorizontal } from 'lucide-react';
import { useTabs } from '../../contexts/TabContext';

export default function WorkspaceTabBar() {
  const { tabs, activeTabId, pinnedTabIds, closeTab, pinTab, unpinTab, renameTab, setActiveTabId, closeOtherTabs } = useTabs();
  const [menuOpen, setMenuOpen] = useState(null);
  const [overflowMenuOpen, setOverflowMenuOpen] = useState(false);
  const [renamingTab, setRenamingTab] = useState(null);
  const [renamingValue, setRenamingValue] = useState('');
  const menuRef = useRef(null);
  const overflowRef = useRef(null);
  const renameInputRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(null);
      if (overflowRef.current && !overflowRef.current.contains(e.target)) setOverflowMenuOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus rename input
  useEffect(() => {
    if (renamingTab && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingTab]);

  const pinnedTabs = tabs.filter(t => pinnedTabIds.includes(t.id));
  const regularTabs = tabs.filter(t => !pinnedTabIds.includes(t.id));
  const maxVisible = 8;
  const visibleRegularTabs = regularTabs.slice(0, maxVisible - pinnedTabs.length);
  const overflowTabs = regularTabs.slice(maxVisible - pinnedTabs.length);

  const handleTabClick = (tabId) => setActiveTabId(tabId);

  const handleRenameSubmit = (e) => {
    e.preventDefault();
    if (renamingTab && renamingValue.trim()) {
      renameTab(renamingTab, renamingValue.trim().slice(0, 40));
    }
    setRenamingTab(null);
    setRenamingValue('');
  };

  const handleRenameCancel = () => {
    setRenamingTab(null);
    setRenamingValue('');
  };

  return (
    <div 
      role="tablist" 
      aria-label="Workspace tabs"
      className="flex items-center gap-0 px-3"
      style={{ 
        height: '44px', 
        backgroundColor: 'var(--bg-panel)', 
        borderBottom: '1px solid var(--border)' 
      }}
    >
      {/* Pinned Tabs */}
      {pinnedTabs.map(tab => (
        <WorkspaceTab
          key={tab.id}
          tab={tab}
          isActive={activeTabId === tab.id}
          isPinned
          onClick={() => handleTabClick(tab.id)}
          onMenuOpen={() => setMenuOpen(tab.id)}
          menuOpen={menuOpen === tab.id}
          onMenuClose={() => setMenuOpen(null)}
          onPin={() => unpinTab(tab.id)}
          onUnpin={() => unpinTab(tab.id)}
          onClose={() => closeTab(tab.id)}
          onRenameStart={() => {
            setRenamingTab(tab.id);
            setRenamingValue(tab.customLabel || tab.label);
          }}
          isRenaming={renamingTab === tab.id}
          renamingValue={renamingValue}
          onRenameChange={setRenamingValue}
          onRenameSubmit={handleRenameSubmit}
          onRenameCancel={handleRenameCancel}
          renameInputRef={renameInputRef}
        />
      ))}

      {/* Pinned Divider */}
      {pinnedTabs.length > 0 && regularTabs.length > 0 && (
        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border)' }} />
      )}

      {/* Regular Tabs */}
      {visibleRegularTabs.map(tab => (
        <WorkspaceTab
          key={tab.id}
          tab={tab}
          isActive={activeTabId === tab.id}
          onClick={() => handleTabClick(tab.id)}
          onMenuOpen={() => setMenuOpen(tab.id)}
          menuOpen={menuOpen === tab.id}
          onMenuClose={() => setMenuOpen(null)}
          onPin={() => pinTab(tab.id)}
          onUnpin={() => unpinTab(tab.id)}
          onClose={() => closeTab(tab.id)}
          onRenameStart={() => {
            setRenamingTab(tab.id);
            setRenamingValue(tab.customLabel || tab.label);
          }}
          onRename={() => renameTab(tab.id, renamingValue)}
          isRenaming={renamingTab === tab.id}
          renamingValue={renamingValue}
          onRenameChange={setRenamingValue}
          onRenameSubmit={handleRenameSubmit}
          onRenameCancel={handleRenameCancel}
          renameInputRef={renameInputRef}
          onCloseOthers={() => closeOtherTabs(tab.id)}
        />
      ))}

      {/* Overflow Menu */}
      {overflowTabs.length > 0 && (
        <div className="relative" ref={overflowRef}>
          <button
            onClick={() => setOverflowMenuOpen(!overflowMenuOpen)}
            className="px-3 py-2 rounded flex items-center gap-1 text-xs"
            style={{
              backgroundColor: overflowMenuOpen ? 'var(--bg-card)' : 'transparent',
              color: 'var(--text-tertiary)',
              border: overflowMenuOpen ? '1px solid var(--border)' : 'none',
            }}
            aria-label="More tabs"
          >
            <MoreHorizontal size={14} />
            <span>+{overflowTabs.length}</span>
          </button>

          {overflowMenuOpen && (
            <div
              className="absolute left-0 top-full mt-1 min-w-[200px] rounded shadow-lg z-50"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              }}
            >
              {overflowTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTabId(tab.id);
                    setOverflowMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:fill"
                  style={{
                    color: activeTabId === tab.id ? 'var(--text-main)' : 'var(--text-secondary)',
                    backgroundColor: activeTabId === tab.id ? 'var(--bg-light)' : 'transparent',
                  }}
                >
                  <tab.icon size={14} />
                  <span className="truncate max-w-[140px]">{tab.customLabel || tab.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function WorkspaceTab({
  tab,
  isActive,
  isPinned,
  onClick,
  onMenuOpen,
  menuOpen,
  onMenuClose,
  onPin,
  onUnpin,
  onClose,
  onCloseOthers,
  onRenameStart,
  onRename,
  isRenaming,
  renamingValue,
  onRenameChange,
  onRenameSubmit,
  onRenameCancel,
  renameInputRef,
}) {
  const Icon = tab.icon;

  return (
    <div className="relative group" ref={menuOpen ? null : undefined}>
      <div
        role="tab"
        aria-selected={isActive}
        onClick={onClick}
        className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors"
        style={{
          backgroundColor: isActive ? 'var(--bg-card)' : 'transparent',
          borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
          borderBottomColor: isActive ? '#F5C800' : 'transparent',
        }}
        title={tab.customLabel || tab.label}
      >
        <Icon size={16} style={{ color: isActive ? 'var(--text-main)' : 'var(--text-tertiary)' }} />

        {!isPinned && (
          <>
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
                className="text-xs truncate max-w-[160px]"
                style={{
                  color: isActive ? 'var(--text-main)' : 'var(--text-tertiary)',
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                {tab.customLabel || tab.label}
              </span>
            )}
          </>
        )}

        {!isPinned && (isActive || !isRenaming) && (
          <button
            onClick={e => {
              e.stopPropagation();
              onClose();
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-[var(--bg-light)]"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Close tab"
          >
            <X size={14} />
          </button>
        )}

        <button
          onClick={e => {
            e.stopPropagation();
            menuOpen ? onMenuClose() : onMenuOpen();
          }}
          className="p-0.5 rounded hover:bg-[var(--bg-light)]"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Tab menu"
        >
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Tab Menu Dropdown */}
      {menuOpen && (
        <div
          className="absolute left-0 top-full mt-1 min-w-[160px] rounded shadow-lg z-50"
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
          
          {isPinned ? (
            <button
              onClick={() => {
                onUnpin();
                onMenuClose();
              }}
              className="w-full px-3 py-2 text-left text-xs hover:bg-[var(--bg-light)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              Unpin
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  onPin();
                  onMenuClose();
                }}
                className="w-full px-3 py-2 text-left text-xs hover:bg-[var(--bg-light)]"
                style={{ color: 'var(--text-secondary)' }}
              >
                Pin
              </button>
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
              {!tab.isRoot && (
                <>
                  <button
                    onClick={() => {
                      onCloseOthers();
                      onMenuClose();
                    }}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-[var(--bg-light)]"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Close Other Tabs
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
            </>
          )}
        </div>
      )}
    </div>
  );
}
