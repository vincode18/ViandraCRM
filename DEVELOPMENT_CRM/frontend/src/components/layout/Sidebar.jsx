import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, Wrench,
  Users, Building2, Package, BarChart2,
  ChevronRight, Filter, Clock, TrendingUp, Plus, AlertCircle,
  ArrowLeft, Clipboard, Box, Archive, ClipboardList, Calendar, FileText
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const NAV_ITEMS = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/cases',      icon: FolderOpen,      label: 'Cases' },
  { to: '/workorders', icon: Wrench,           label: 'Work Orders' },
  { to: '/assets',     icon: Package,          label: 'Assets',    disabled: true },
  { to: '/accounts',   icon: Building2,        label: 'Accounts',  disabled: true },
  { to: '/users',      icon: Users,            label: 'Users',     adminOnly: true, disabled: true },
  { to: '/reports',    icon: BarChart2,        label: 'Reports',   disabled: true },
];

const CASE_MODULE_NAV = [
  {
    section: 'CASES',
    items: [
      { to: '/cases', icon: FolderOpen, label: 'All Cases' },
      { to: '/cases?status=Open', icon: Clock, label: 'Open' },
      { to: '/cases?status=In Progress', icon: TrendingUp, label: 'In Progress' },
      { to: '/cases?status=Pending Review', icon: Filter, label: 'Pending Review' },
      { to: '/cases?status=Closed', icon: ChevronRight, label: 'Closed' },
    ]
  },
  {
    section: 'FILTERS',
    items: [
      { to: '/cases?priority=High', icon: AlertCircle, label: 'High Priority' },
      { to: '/cases?sla=breached', icon: AlertCircle, label: 'SLA Breached' },
    ]
  },
  {
    section: 'QUICK LINKS',
    items: [
      { to: '/cases/new', icon: Plus, label: 'Create New Case' },
      { to: '/cases?owner=me', icon: Users, label: 'My Open Cases' },
    ]
  },
];

const WORK_ORDER_MODULE_NAV = [
  {
    section: 'WORK ORDERS',
    items: [
      { to: '/workorders', icon: Wrench, label: 'All Work Orders' },
      { to: '/workorders?status=Open', icon: Clock, label: 'Open' },
      { to: '/workorders?status=In Progress', icon: TrendingUp, label: 'In Progress' },
      { to: '/workorders?status=Completed', icon: ChevronRight, label: 'Completed' },
      { to: '/workorders?status=Cancelled', icon: Filter, label: 'Cancelled' },
    ]
  },
  {
    section: 'FILTERS',
    items: [
      { to: '/workorders?priority=High', icon: AlertCircle, label: 'High Priority' },
      { to: '/workorders?priority=Urgent', icon: AlertCircle, label: 'Urgent' },
    ]
  },
  {
    section: 'QUICK LINKS',
    items: [
      { to: '/workorders/new', icon: Plus, label: 'Create New Work Order' },
      { to: '/workorders?mechanic=me', icon: Users, label: 'My Work Orders' },
    ]
  },
];

export default function Sidebar({ isOpen }) {
  const { user } = useAuth();
  const { currentModule } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Detect if we're on a case detail page: /cases/:id (but not /cases/new or /cases/:id/edit)
  const caseDetailMatch = location.pathname.match(/^\/cases\/([^/]+)$/);
  const isCaseDetail = caseDetailMatch && caseDetailMatch[1] !== 'new';

  // Detect if we're on a work order detail page: /workorders/:id (but not /workorders/new)
  const workOrderDetailMatch = location.pathname.match(/^\/workorders\/([^/]+)$/);
  const isWorkOrderDetail = workOrderDetailMatch && workOrderDetailMatch[1] !== 'new';

  return (
    <aside
      aria-label="Sidebar navigation"
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)]
                  flex flex-col z-30 transition-all duration-200 overflow-hidden
                  ${isOpen ? 'w-60' : 'w-0 md:w-0'}`}
      style={{ backgroundColor: 'var(--bg-panel)', borderRight: '1px solid var(--border)' }}
    >
      <nav className="flex-1 overflow-y-auto py-4 px-3" aria-label="Main navigation">
        {isCaseDetail ? (
          // Case Detail Sidebar (FRD v2.0)
          <CaseDetailSidebar navigate={navigate} />
        ) : isWorkOrderDetail ? (
          // Work Order Detail Sidebar (FRD WO Module)
          <WorkOrderDetailSidebar navigate={navigate} />
        ) : currentModule === 'case' ? (
          // Case Module Navigation
          CASE_MODULE_NAV.map((navSection) => (
            <div key={navSection.section} className="mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2" style={{ color: 'var(--text-muted)' }}>
                {navSection.section}
              </p>
              <ul className="space-y-0.5">
                {navSection.items.map(({ to, icon: Icon, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                         transition-all duration-150 group
                         ${isActive
                           ? 'bg-brand-blue/15 text-brand-blue font-semibold border border-brand-blue/20'
                           : 'text-gray-400 hover:bg-brand-card hover:text-white'}`
                      }
                    >
                      <Icon size={16} aria-hidden="true" className="shrink-0" />
                      <span className="truncate">{label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : currentModule === 'workorder' ? (
          // Work Order Module Navigation
          WORK_ORDER_MODULE_NAV.map((navSection) => (
            <div key={navSection.section} className="mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2" style={{ color: 'var(--text-muted)' }}>
                {navSection.section}
              </p>
              <ul className="space-y-0.5">
                {navSection.items.map(({ to, icon: Icon, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                         transition-all duration-150 group
                         ${isActive
                           ? 'bg-brand-blue/15 text-brand-blue font-semibold border border-brand-blue/20'
                           : 'text-gray-400 hover:bg-brand-card hover:text-white'}`
                      }
                    >
                      <Icon size={16} aria-hidden="true" className="shrink-0" />
                      <span className="truncate">{label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          // Default Navigation
          <>
            <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-3" style={{ color: 'var(--text-muted)' }}>
              Navigation
            </p>
            <ul className="space-y-0.5">
              {NAV_ITEMS.map(({ to, icon: Icon, label, disabled, adminOnly }) => {
                if (adminOnly && user?.role !== 'Admin') return null;
                return (
                  <li key={to}>
                    {disabled ? (
                      <span
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                                   text-brand-muted cursor-not-allowed opacity-50"
                        title="Coming soon"
                      >
                        <Icon size={16} aria-hidden="true" className="shrink-0" />
                        <span className="truncate">{label}</span>
                        <ChevronRight size={12} className="ml-auto opacity-50" aria-hidden="true" />
                      </span>
                    ) : (
                      <NavLink
                        to={to}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                           transition-all duration-150 group
                           ${isActive
                             ? 'bg-brand-blue/15 text-brand-blue font-semibold border border-brand-blue/20'
                             : 'text-gray-400 hover:bg-brand-card hover:text-white'}`
                        }
                      >
                        <Icon size={16} aria-hidden="true" className="shrink-0" />
                        <span className="truncate">{label}</span>
                      </NavLink>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </nav>

      {/* User info footer */}
      <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center
                       text-white text-xs font-bold shrink-0"
            aria-hidden="true"
          >
            {`${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-main)' }}>
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/*  Case Detail Sidebar (FRD v2.0)                                     */
/* ------------------------------------------------------------------ */
function CaseDetailSidebar({ navigate }) {
  const handleBack = () => navigate('/cases');

  const quickLinks = [
    { icon: Clipboard, label: 'Work Orders', count: 2, to: '#' },
    { icon: Box,       label: 'Parts Requests', count: 1, to: '#' },
    { icon: Archive,   label: 'Fleet Units', count: 4, to: '#' },
    { icon: Building2, label: 'Account', text: 'PUTRA PERKASA ABADI', to: '#' },
  ];

  return (
    <div className="flex flex-col gap-5 animate-fadeIn">
      {/* Back Navigation */}
      <div className="px-1">
        <button
          onClick={handleBack}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium
                     transition-all duration-150 group border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border)',
            color: 'var(--text-main)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-base)';
            e.currentTarget.style.borderColor = 'var(--text-muted)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-card)';
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back to All Cases</span>
        </button>
      </div>

      {/* Quick Links */}
      <div className="px-1">
        <p
          className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2"
          style={{ color: 'var(--text-muted)' }}
        >
          Quick Links to Related Objects
        </p>
        <ul className="space-y-1.5">
          {quickLinks.map(({ icon: Icon, label, count, text, to }) => (
            <li key={label}>
              <NavLink
                to={to}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm
                           transition-all duration-150 group border"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-main)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-base)';
                  e.currentTarget.style.borderColor = 'var(--text-muted)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <Icon size={16} aria-hidden="true" className="shrink-0" style={{ color: 'var(--text-muted)' }} />
                <span className="flex-1 truncate">{label}</span>
                {count !== undefined && (
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-muted)' }}
                  >
                    {count}
                  </span>
                )}
                {text && (
                  <span
                    className="text-[11px] truncate max-w-[80px]"
                    style={{ color: 'var(--text-muted)' }}
                    title={text}
                  >
                    {text}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Work Order Detail Sidebar (FRD WO Module)                           */
/* ------------------------------------------------------------------ */
function WorkOrderDetailSidebar({ navigate }) {
  const handleBack = () => navigate('/workorders');

  const quickLinks = [
    { icon: ClipboardList, label: 'Work Plans', count: 2, to: '#' },
    { icon: Wrench, label: 'Work Steps', count: 3, to: '#' },
    { icon: Calendar, label: 'Service Appointments', count: 1, to: '#' },
    { icon: FileText, label: 'Case', text: '01553477', to: '#' },
    { icon: Building2, label: 'Account', text: 'SIMS JAYA KALTIM', to: '#' },
  ];

  return (
    <div className="flex flex-col gap-5 animate-fadeIn">
      {/* Back Navigation */}
      <div className="px-1">
        <button
          onClick={handleBack}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium
                     transition-all duration-150 group border"
          style={{
            backgroundColor: 'var(--accent)',
            borderColor: 'var(--accent)',
            color: '#1a1a1a'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e6c200';
            e.currentTarget.style.borderColor = '#e6c200';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent)';
            e.currentTarget.style.borderColor = 'var(--accent)';
          }}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back to Work</span>
        </button>
      </div>

      {/* Quick Links */}
      <div className="px-1">
        <p
          className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2"
          style={{ color: 'var(--text-muted)' }}
        >
          Quick Links to Related Objects
        </p>
        <ul className="space-y-1.5">
          {quickLinks.map(({ icon: Icon, label, count, text, to }) => (
            <li key={label}>
              <NavLink
                to={to}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm
                           transition-all duration-150 group border"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-main)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-base)';
                  e.currentTarget.style.borderColor = 'var(--text-muted)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <Icon size={16} aria-hidden="true" className="shrink-0" style={{ color: 'var(--text-muted)' }} />
                <span className="flex-1 truncate">{label}</span>
                {count !== undefined && (
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-muted)' }}
                  >
                    {count}
                  </span>
                )}
                {text && (
                  <span
                    className="text-[11px] truncate max-w-[80px]"
                    style={{ color: 'var(--text-muted)' }}
                    title={text}
                  >
                    {text}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
