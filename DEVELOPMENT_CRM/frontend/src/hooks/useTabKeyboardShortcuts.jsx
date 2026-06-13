/* ─────────────────────────────────────────────────────────────────────────
   Tab Keyboard Shortcuts Hook
   Handles keyboard shortcuts for workspace tabs and subtabs
   ───────────────────────────────────────────────────────────────────────── */

import { useEffect } from 'react';
import { useTabs } from '../contexts/TabContext';
import { useSubtabs } from '../contexts/SubtabContext';

export function useTabKeyboardShortcuts() {
  const { tabs, activeTabId, setActiveTabId, closeTab } = useTabs();
  const { activeSubtabByTabId, setActiveSubtab, closeSubtab, getSubtabs } = useSubtabs();

  useEffect(() => {
    function handleKeyDown(e) {
      // Workspace Tab Shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
        e.preventDefault();
        if (activeTabId) {
          closeTab(activeTabId);
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'Tab') {
        e.preventDefault();
        if (tabs.length === 0) return;

        const currentIndex = tabs.findIndex(t => t.id === activeTabId);
        if (e.shiftKey) {
          // Ctrl+Shift+Tab - Previous tab
          const prevIndex = currentIndex <= 0 ? tabs.length - 1 : currentIndex - 1;
          setActiveTabId(tabs[prevIndex].id);
        } else {
          // Ctrl+Tab - Next tab
          const nextIndex = currentIndex >= tabs.length - 1 ? 0 : currentIndex + 1;
          setActiveTabId(tabs[nextIndex].id);
        }
        return;
      }

      // Subtab Shortcuts
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        const subtabs = getSubtabs(activeTabId);
        if (subtabs.length === 0) return;

        const currentSubtabId = activeSubtabByTabId[activeTabId];
        const currentIndex = subtabs.findIndex(s => s.id === currentSubtabId);
        const prevIndex = currentIndex <= 0 ? subtabs.length - 1 : currentIndex - 1;
        setActiveSubtab(activeTabId, subtabs[prevIndex].id);
        return;
      }

      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        const subtabs = getSubtabs(activeTabId);
        if (subtabs.length === 0) return;

        const currentSubtabId = activeSubtabByTabId[activeTabId];
        const currentIndex = subtabs.findIndex(s => s.id === currentSubtabId);
        const nextIndex = currentIndex >= subtabs.length - 1 ? 0 : currentIndex + 1;
        setActiveSubtab(activeTabId, subtabs[nextIndex].id);
        return;
      }

      if (e.altKey && e.key === 'w') {
        e.preventDefault();
        const currentSubtabId = activeSubtabByTabId[activeTabId];
        if (currentSubtabId && activeTabId) {
          closeSubtab(activeTabId, currentSubtabId);
        }
        return;
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [tabs, activeTabId, setActiveTabId, closeTab, activeSubtabByTabId, setActiveSubtab, closeSubtab, getSubtabs]);
}
