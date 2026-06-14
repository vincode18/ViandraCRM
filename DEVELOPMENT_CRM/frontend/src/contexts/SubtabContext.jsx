/* ─────────────────────────────────────────────────────────────────────────
   SubtabContext — Subtabs State Management (Scoped to Workspace Tab)
   Manages secondary tabs nested within a workspace tab for related records
   ───────────────────────────────────────────────────────────────────────── */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const SubtabContext = createContext(null);

const MAX_SUBTABS = 6;

export function SubtabProvider({ children }) {
  // subtabsByTabId: { [workspaceTabId]: [subtab1, subtab2, ...] }
  const [subtabsByTabId, setSubtabsByTabId] = useState({});
  const [activeSubtabByTabId, setActiveSubtabByTabId] = useState({});

  // Generate unique subtab ID
  const generateSubtabId = useCallback(() => {
    return `subtab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Open a subtab within a workspace tab
  const openSubtab = useCallback((workspaceTabId, config) => {
    const { id, label, icon, path, isRoot = false } = config;
    
    setSubtabsByTabId(prev => {
      const existingSubtabs = prev[workspaceTabId] || [];
      
      // Check if subtab with same path already exists
      const existingSubtab = existingSubtabs.find(s => s.path === path);
      if (existingSubtab) {
        setActiveSubtabByTabId(prev => ({ ...prev, [workspaceTabId]: existingSubtab.id }));
        return prev;
      }

      // Check max subtabs limit
      if (existingSubtabs.length >= MAX_SUBTABS && !isRoot) {
        // Limit reached - return unchanged
        return prev;
      }

      const newSubtab = {
        id: id || generateSubtabId(),
        label,
        icon,
        path,
        isRoot,
        isDirty: false,
        customLabel: null,
      };

      const updated = [...existingSubtabs, newSubtab];
      setActiveSubtabByTabId(prev => ({ ...prev, [workspaceTabId]: newSubtab.id }));
      return { ...prev, [workspaceTabId]: updated };
    });
  }, [generateSubtabId]);

  // Close a subtab
  const closeSubtab = useCallback((workspaceTabId, subtabId) => {
    setSubtabsByTabId(prev => {
      const subtabs = prev[workspaceTabId] || [];
      const subtabToClose = subtabs.find(s => s.id === subtabId);
      if (!subtabToClose) return prev;
      
      if (subtabToClose.isRoot || subtabToClose.isDirty) {
        // Cannot close root or dirty tabs directly
        return prev;
      }

      const updated = subtabs.filter(s => s.id !== subtabId);
      
      // If closing active subtab, switch to another
      if (activeSubtabByTabId[workspaceTabId] === subtabId) {
        const activeIndex = subtabs.findIndex(s => s.id === subtabId);
        const nextSubtab = updated[activeIndex - 1] || updated[0];
        setActiveSubtabByTabId(prev => ({ 
          ...prev, 
          [workspaceTabId]: nextSubtab?.id || null 
        }));
      }

      // Hide subtab row if no subtabs
      if (updated.length === 0) {
        const newByTabId = { ...prev };
        delete newByTabId[workspaceTabId];
        return newByTabId;
      }

      return { ...prev, [workspaceTabId]: updated };
    });
  }, [activeSubtabByTabId]);

  // Switch active subtab
  const setActiveSubtab = useCallback((workspaceTabId, subtabId) => {
    setActiveSubtabByTabId(prev => ({ ...prev, [workspaceTabId]: subtabId }));
  }, []);

  // Rename a subtab
  const renameSubtab = useCallback((workspaceTabId, subtabId, newLabel) => {
    setSubtabsByTabId(prev => {
      const subtabs = prev[workspaceTabId] || [];
      const updated = subtabs.map(s => 
        s.id === subtabId ? { ...s, customLabel: newLabel } : s
      );
      return { ...prev, [workspaceTabId]: updated };
    });
  }, []);

  // Mark subtab as dirty
  const markSubtabDirty = useCallback((workspaceTabId, subtabId, isDirty = true) => {
    setSubtabsByTabId(prev => {
      const subtabs = prev[workspaceTabId] || [];
      const updated = subtabs.map(s => 
        s.id === subtabId ? { ...s, isDirty } : s
      );
      return { ...prev, [workspaceTabId]: updated };
    });
  }, []);

  // Get subtabs for a workspace tab
  const getSubtabs = useCallback((workspaceTabId) => {
    return subtabsByTabId[workspaceTabId] || [];
  }, [subtabsByTabId]);

  // Get active subtab for a workspace tab
  const getActiveSubtab = useCallback((workspaceTabId) => {
    const subtabId = activeSubtabByTabId[workspaceTabId];
    const subtabs = subtabsByTabId[workspaceTabId] || [];
    return subtabs.find(s => s.id === subtabId) || subtabs[0];
  }, [activeSubtabByTabId, subtabsByTabId]);

  // Close all subtabs for a workspace tab (when workspace tab closes)
  const closeAllSubtabs = useCallback((workspaceTabId) => {
    setSubtabsByTabId(prev => {
      const newByTabId = { ...prev };
      delete newByTabId[workspaceTabId];
      return newByTabId;
    });
    setActiveSubtabByTabId(prev => {
      const newActive = { ...prev };
      delete newActive[workspaceTabId];
      return newActive;
    });
  }, []);

  return (
    <SubtabContext.Provider value={{
      subtabsByTabId,
      activeSubtabByTabId,
      openSubtab,
      closeSubtab,
      setActiveSubtab,
      renameSubtab,
      markSubtabDirty,
      getSubtabs,
      getActiveSubtab,
      closeAllSubtabs,
      MAX_SUBTABS,
    }}>
      {children}
    </SubtabContext.Provider>
  );
}

export function useSubtabs() {
  const ctx = useContext(SubtabContext);
  if (!ctx) throw new Error('useSubtabs must be used within SubtabProvider');
  return ctx;
}
