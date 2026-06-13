import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import GlobalHeader from './GlobalHeader';
import Sidebar from './Sidebar';
import WorkspaceTabBar from '../tabs/WorkspaceTabBar';
import SubtabBar from '../tabs/SubtabBar';
import { useTabs } from '../../contexts/TabContext';
import { useTabKeyboardShortcuts } from '../../hooks/useTabKeyboardShortcuts';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { activeTab } = useTabs();
  useTabKeyboardShortcuts();
  const isCaseDetail = /^\/cases\/[^/]+$/.test(location.pathname) && location.pathname !== '/cases/new';
  const isWorkOrderDetail = /^\/workorders\/[^/]+$/.test(location.pathname) && location.pathname !== '/workorders/new';
  const isFieldService = location.pathname === '/fieldservice';
  const isShiftsPage = location.pathname === '/shifts';
  const isFullBleedPage = isFieldService || isShiftsPage;
  const isDetailPage = isCaseDetail || isWorkOrderDetail || isFullBleedPage;

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      <GlobalHeader onMenuToggle={() => setSidebarOpen(v => !v)} />

      {/* Workspace Tab Bar */}
      <WorkspaceTabBar />

      {/* Subtab Bar - scoped to active workspace tab */}
      {activeTab && <SubtabBar workspaceTabId={activeTab.id} />}

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} />

        <main
          id="main-content"
          className={`flex-1 transition-all duration-200
            ${isFullBleedPage ? 'overflow-hidden' : 'overflow-auto'}
            ${sidebarOpen ? 'md:ml-60' : 'md:ml-0'}`}
          tabIndex={-1}
        >
          <div className={`animate-fadeIn ${isDetailPage ? 'h-full min-h-0' : 'p-6 max-w-screen-2xl mx-auto'}`}>
            <Outlet />
          </div>
        </main>
      </div>

      <GlobalFooter />
    </div>
  );
}

function GlobalFooter() {
  return (
    <footer
      role="contentinfo"
      className="px-6 py-3 text-xs flex flex-wrap items-center justify-between gap-3"
      style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border)', backgroundColor: 'var(--bg-panel)', color: 'var(--text-muted)' }}
    >
      <span>© 2026 United Tractors. All rights reserved.</span>
      <span className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-brand-success" aria-hidden="true" />
        System Status: Operational &nbsp;|&nbsp; v1.0.0 &nbsp;|&nbsp; Timezone: UTC+7
      </span>
      <nav aria-label="Footer links" className="flex gap-4">
        {['Terms', 'Privacy', 'Support'].map(label => (
          <button
            key={label}
            type="button"
            className="hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            {label}
          </button>
        ))}
      </nav>
    </footer>
  );
}
