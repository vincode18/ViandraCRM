import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import {
  Menu, Search, Bell, Settings, HelpCircle,
  User, LogOut, ChevronDown, X, Sun, Moon,
  Home, Folder, ClipboardList, Box, Building2, Factory,
  Clock, MapPin, Activity, CalendarClock, Database, Grid3x3, FileText, Layout, Zap, BarChart2, GitBranch, Wifi, WifiOff
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const MODULES = [
  { key: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
  { key: 'case', label: 'Case', icon: Folder, path: '/cases' },
  { key: 'workorder', label: 'Work Order', icon: ClipboardList, path: '/workorders' },
  { key: 'asset', label: 'Asset', icon: Box, path: '/assets' },
  { key: 'account', label: 'Account', icon: Building2, path: '/accounts' },
  { key: 'plant', label: 'Plant', icon: Factory, path: '/plants' },
  { key: 'shift', label: 'Shift', icon: Clock, path: '/shifts' },
  { key: 'serviceappointment', label: 'Service Appointment', icon: CalendarClock, path: '/serviceappointments' },
  { key: 'fieldservice', label: 'Field Service', icon: MapPin, path: '/fieldservice' },
  { key: 'emr', label: 'EMR', icon: Activity, path: '/emr' },
  { key: 'reports', label: 'Reports', icon: BarChart2, path: '/reports' },
];

export default function GlobalHeader({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const { theme, toggle: toggleTheme, isDark, currentModule, setCurrentModule } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const breakpoint = useBreakpoint();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [profileOpen, setProfileOpen] = useState(false);
  const [moduleOpen, setModuleOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const profileRef = useRef(null);
  const moduleRef = useRef(null);
  const settingsRef = useRef(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      localStorage.setItem('ut-last-sync-time', new Date().toISOString());
    };
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync combobox to current URL on every navigation
  useEffect(() => {
    const path = location.pathname;
    const matched = MODULES.slice().reverse().find(m => m.path !== '/dashboard' && path.startsWith(m.path));
    if (matched) {
      setCurrentModule(matched.key);
    } else if (path === '/' || path.startsWith('/dashboard')) {
      setCurrentModule('dashboard');
    }
  }, [location.pathname, setCurrentModule]);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e) {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
      if (moduleRef.current && !moduleRef.current.contains(e.target))
        setModuleOpen(false);
      if (settingsRef.current && !settingsRef.current.contains(e.target))
        setSettingsOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Module selection handler
  const handleModuleSelect = (module) => {
    setCurrentModule(module.key);
    navigate(module.path);
    setModuleOpen(false);
  };

  // Get current module display
  const currentModuleData = MODULES.find(m => m.key === currentModule) || MODULES[0];

  // Keyboard shortcut Ctrl+K for search
  useEffect(() => {
    function handler(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('global-search')?.focus();
      }
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'U'
    : 'U';

  return (
    <header
      role="banner"
      className={`sticky top-0 z-40 flex items-center px-4 gap-3 transition-colors ${breakpoint === 'mobile' ? 'h-[var(--mobile-header-height)]' : 'h-16'}`}
      style={{ backgroundColor: 'var(--bg-panel)', borderBottom: '1px solid var(--border)' }}
    >
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2
                   focus:z-50 focus:bg-brand-blue focus:text-white focus:px-3 focus:py-1.5
                   focus:rounded text-sm"
      >
        Skip to main content
      </a>

      {breakpoint === 'mobile' ? (
        // Mobile Header - Simplified
        <>
          {/* Module Title */}
          <div className="flex-1">
            <h1 className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>
              {currentModuleData.label}
            </h1>
          </div>

          {/* Offline Status Indicator */}
          <div className="flex items-center gap-1 px-2 py-1 rounded" style={{ backgroundColor: isOnline ? 'var(--color-success-pale)' : 'var(--color-danger-pale)' }}>
            {isOnline ? <Wifi size={14} style={{ color: 'var(--color-success)' }} /> : <WifiOff size={14} style={{ color: 'var(--color-danger)' }} />}
            <span className="text-xs font-medium" style={{ color: isOnline ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Profile */}
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--text-main)' }}
            aria-label="Profile menu"
          >
            {initials}
          </button>
        </>
      ) : (
        // Desktop Header - Full
        <>
          {/* ── Left: Logo + toggle + Module combobox ─────────────────────────── */}
          <button
            type="button"
            aria-label="Toggle sidebar navigation"
            onClick={onMenuToggle}
            className="p-2 rounded-lg text-brand-muted hover:text-gray-300
                       hover:bg-brand-card transition-colors min-w-[44px] min-h-[44px]
                       flex items-center justify-center"
          >
            <Menu size={20} aria-hidden="true" />
          </button>

      <a
        href="/dashboard"
        aria-label="UT Service Console – Home"
        className="flex items-center gap-2 font-bold text-sm
                   hover:text-gray-200 transition-colors shrink-0"
        style={{ color: 'var(--text-main)' }}
      >
        <div
          className="w-7 h-7 rounded-md bg-brand-blue flex items-center justify-center
                     text-white text-[10px] font-bold"
          aria-hidden="true"
        >
          UT
        </div>
        <span className="hidden sm:inline">UT Service Console</span>
      </a>

      {/* Module Combobox */}
      <div ref={moduleRef} className="relative ml-2">
        <button
          type="button"
          aria-label="Select module"
          aria-haspopup="listbox"
          aria-expanded={moduleOpen}
          onClick={() => setModuleOpen(v => !v)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                     hover:bg-brand-card transition-colors
                     min-w-[180px] min-h-[44px] text-sm"
          style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <currentModuleData.icon size={16} className="text-brand-blue" aria-hidden="true" />
          <span className="truncate flex-1 text-left">{currentModuleData.label}</span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-150 ${moduleOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        {moduleOpen && (
          <div
            role="listbox"
            aria-label="Module selection"
            className="absolute left-0 top-full mt-1 w-56 rounded-xl shadow-2xl py-1.5 z-50 animate-fadeIn max-h-96 overflow-y-auto"
            style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border)' }}
          >
            {MODULES.map((module) => {
              const Icon = module.icon;
              return (
                <button
                  key={module.key}
                  role="option"
                  aria-selected={currentModule === module.key}
                  type="button"
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left
                    ${currentModule === module.key ? 'bg-brand-blue/10 text-brand-blue' : 'hover:bg-brand-card'}`}
                  style={{ color: currentModule === module.key ? 'var(--text-main)' : 'var(--text-muted)' }}
                  onClick={() => handleModuleSelect(module)}
                >
                  <Icon size={16} className={currentModule === module.key ? 'text-brand-blue' : 'text-brand-muted'} aria-hidden="true" />
                  {module.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Center: Global Search ─────────────────────────────────────────── */}
      <div className="flex-1 max-w-lg mx-auto">
        <label htmlFor="global-search" className="sr-only">Search cases, assets, accounts...</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
            <Search size={14} aria-hidden="true" />
          </span>
          <input
            id="global-search"
            type="search"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Search cases, assets, accounts... (Ctrl+K)"
            className="w-full text-sm rounded-lg pl-8 pr-3 py-2
                       focus:outline-none focus:ring-1 focus:ring-brand-blue"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
          />
          {searchVal && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearchVal('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* ── Right: Icons + Profile ──────────────────────────────────── */}
      <div className="flex items-center gap-1 ml-auto">
        {[
          { icon: Bell,        label: 'Notifications' },
          { icon: HelpCircle,  label: 'Help and Support' },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            title={label}
            className="p-2 rounded-lg text-brand-muted hover:text-gray-300 dark:hover:text-gray-300
                       hover:bg-brand-card dark:hover:bg-brand-card transition-colors min-w-[44px] min-h-[44px]
                       flex items-center justify-center"
          >
            <Icon size={18} aria-hidden="true" />
          </button>
        ))}

        {/* Settings dropdown */}
        <div ref={settingsRef} className="relative">
          <button
            type="button"
            aria-label="Settings"
            aria-haspopup="menu"
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen(v => !v)}
            className="p-2 rounded-lg text-brand-muted hover:text-gray-300 dark:hover:text-gray-300
                       hover:bg-brand-card dark:hover:bg-brand-card transition-colors min-w-[44px] min-h-[44px]
                       flex items-center justify-center"
          >
            <Settings size={18} aria-hidden="true" />
          </button>

          {settingsOpen && (
            <div
              role="menu"
              aria-label="Settings menu"
              className="absolute right-0 top-full mt-1 w-56 rounded-xl shadow-2xl py-1.5 z-50 animate-fadeIn"
              style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border)' }}
            >
              <div className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                App Settings
              </div>
              <button
                role="menuitem"
                type="button"
                onClick={() => {
                  navigate('/settings/query-console');
                  setSettingsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <Database size={15} className="text-brand-muted" aria-hidden="true" />
                Query Console
              </button>
              <button
                role="menuitem"
                type="button"
                onClick={() => {
                  navigate('/settings/application-log');
                  setSettingsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <FileText size={15} className="text-brand-muted" aria-hidden="true" />
                Application Log
              </button>
              <button
                role="menuitem"
                type="button"
                onClick={() => {
                  navigate('/settings/app-builder');
                  setSettingsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <Layout size={15} className="text-brand-muted" aria-hidden="true" />
                App Builder Canvas
              </button>
              <button
                role="menuitem"
                type="button"
                onClick={() => {
                  navigate('/settings/deployment/pipeline');
                  setSettingsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <GitBranch size={15} className="text-brand-muted" aria-hidden="true" />
                Deployment Pipeline
              </button>
              <button
                role="menuitem"
                type="button"
                onClick={() => {
                  navigate('/flows');
                  setSettingsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <Zap size={15} className="text-brand-muted" aria-hidden="true" />
                Flows
              </button>

              <div className="mt-1 pt-1 px-4 py-2 text-[11px] font-bold uppercase tracking-wider" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                Console App
              </div>
              <button
                role="menuitem"
                type="button"
                onClick={() => {
                  navigate('/console/query-interface');
                  setSettingsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <Grid3x3 size={15} className="text-brand-muted" aria-hidden="true" />
                Query Interface
              </button>
            </div>
          )}
        </div>

        {/* ── Theme toggle ──────────────────────────────────────── */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
          className="relative p-2 rounded-lg transition-all duration-200 min-w-[44px] min-h-[44px]
                     flex items-center justify-center
                     text-brand-muted hover:text-gray-300
                     hover:bg-brand-card dark:hover:bg-brand-card
                     border border-transparent hover:border-brand-border"
        >
          <span
            className={`absolute inset-0 rounded-lg transition-opacity duration-300
                        ${ isDark ? 'opacity-0' : 'opacity-100 bg-amber-50' }`}
            aria-hidden="true"
          />
          <span className="relative">
            { isDark
              ? <Sun  size={18} className="text-amber-400" aria-hidden="true" />
              : <Moon size={18} className="text-indigo-500" aria-hidden="true" />
            }
          </span>
        </button>

        {/* Profile dropdown */}
        <div ref={profileRef} className="relative ml-1">
          <button
            type="button"
            aria-label="User menu"
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen(v => !v)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg
                       hover:bg-brand-card transition-colors
                       min-h-[44px] text-sm text-gray-300"
          >
            <div
              className="w-7 h-7 rounded-full bg-brand-blue flex items-center justify-center
                         text-white text-xs font-bold shrink-0"
              aria-hidden="true"
            >
              {initials}
            </div>
            <span className="hidden sm:inline max-w-[120px] truncate">
              {user?.firstName} {user?.lastName}
            </span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-150 ${profileOpen ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>

          {profileOpen && (
            <div
              role="menu"
              aria-label="User options"
              className="absolute right-0 top-full mt-1 w-56 rounded-xl shadow-2xl py-1.5 z-50 animate-fadeIn"
              style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border)' }}
            >
              <div className="px-4 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                <span className="mt-1 inline-block text-xs bg-brand-blue/20 text-brand-blue
                                 px-2 py-0.5 rounded-full">
                  {user?.role}
                </span>
              </div>

              {[
                { icon: User,    label: 'My Profile' },
                { icon: Settings,label: 'Settings' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  role="menuitem"
                  type="button"
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'var(--text-muted)'; }}
                  onClick={() => setProfileOpen(false)}
                >
                  <Icon size={15} className="text-brand-muted" aria-hidden="true" />
                  {label}
                </button>
              ))}

              <div className="mt-1 pt-1" style={{ borderTop: '1px solid var(--border)' }}>
                <button
                  role="menuitem"
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400
                             hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
                >
                  <LogOut size={15} aria-hidden="true" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
        </>
      )}
    </header>
  );
}
