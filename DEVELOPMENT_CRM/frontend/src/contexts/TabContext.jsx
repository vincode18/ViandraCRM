/* ─────────────────────────────────────────────────────────────────────────
   TabContext — Workspace Tabs State Management
   Manages top-level workspace tabs with pinning, navigation, and persistence
   ───────────────────────────────────────────────────────────────────────── */

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const TabContext = createContext(null);

export function TabProvider({ children }) {
  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);
  const [pinnedTabIds, setPinnedTabIds] = useState(() => {
    try {
      const stored = sessionStorage.getItem('pinned_tabs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist pinned tabs to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('pinned_tabs', JSON.stringify(pinnedTabIds));
  }, [pinnedTabIds]);

  // Generate unique tab ID
  const generateTabId = useCallback(() => {
    return `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Open a new tab or navigate to existing tab
  const openTab = useCallback((config) => {
    const { id, label, icon, path, isRoot = false } = config;
    
    setTabs(prev => {
      // Check if tab with same path already exists
      const existingTab = prev.find(t => t.path === path);
      if (existingTab) {
        setActiveTabId(existingTab.id);
        return prev;
      }

      const newTab = {
        id: id || generateTabId(),
        label,
        icon,
        path,
        isRoot,
        isPinned: false,
        isDirty: false,
        customLabel: null,
      };

      const updated = [...prev, newTab];
      setActiveTabId(newTab.id);
      return updated;
    });
  }, [generateTabId]);

  // Close a tab
  const closeTab = useCallback((tabId) => {
    setTabs(prev => {
      const tabToClose = prev.find(t => t.id === tabId);
      if (!tabToClose) return prev;
      
      if (tabToClose.isDirty) {
        // Trigger unsaved changes modal - return early, let modal handle actual close
        return prev;
      }

      const updated = prev.filter(t => t.id !== tabId);
      
      // If closing active tab, switch to another
      if (activeTabId === tabId) {
        const activeIndex = prev.findIndex(t => t.id === tabId);
        const nextTab = updated[activeIndex - 1] || updated[0];
        setActiveTabId(nextTab?.id || null);
      }

      return updated;
    });
  }, [activeTabId]);

  // Close all tabs except the specified one
  const closeOtherTabs = useCallback((keepTabId) => {
    setTabs(prev => {
      const keepTab = prev.find(t => t.id === keepTabId);
      if (!keepTab) return prev;

      const updated = prev.filter(t => t.id === keepTabId || t.isPinned);
      setActiveTabId(keepTabId);
      return updated;
    });
  }, []);

  // Pin a tab
  const pinTab = useCallback((tabId) => {
    setTabs(prev => prev.map(t => 
      t.id === tabId ? { ...t, isPinned: true } : t
    ));
    setPinnedTabIds(prev => [...new Set([...prev, tabId])]);
  }, []);

  // Unpin a tab
  const unpinTab = useCallback((tabId) => {
    setTabs(prev => prev.map(t => 
      t.id === tabId ? { ...t, isPinned: false } : t
    ));
    setPinnedTabIds(prev => prev.filter(id => id !== tabId));
  }, []);

  // Rename a tab
  const renameTab = useCallback((tabId, newLabel) => {
    setTabs(prev => prev.map(t => 
      t.id === tabId ? { ...t, customLabel: newLabel } : t
    ));
  }, []);

  // Mark tab as dirty (has unsaved changes)
  const markTabDirty = useCallback((tabId, isDirty = true) => {
    setTabs(prev => prev.map(t => 
      t.id === tabId ? { ...t, isDirty } : t
    ));
  }, []);

  // Get active tab
  const activeTab = tabs.find(t => t.id === activeTabId);

  return (
    <TabContext.Provider value={{
      tabs,
      activeTab,
      activeTabId,
      pinnedTabIds,
      openTab,
      closeTab,
      closeOtherTabs,
      pinTab,
      unpinTab,
      renameTab,
      markTabDirty,
      setActiveTabId,
    }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTabs() {
  const ctx = useContext(TabContext);
  if (!ctx) throw new Error('useTabs must be used within TabProvider');
  return ctx;
}
