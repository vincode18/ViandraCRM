import React, { useState } from 'react';
import { Settings, Users, Shield, Building2, Bell, Link, ChevronRight, Save, RotateCcw, Copy, UserCheck } from 'lucide-react';
import {
  ROLES, MODULES_LIST, MODULE_FIELDS, DEFAULT_ROLE_ACCESS, ADMIN_USERS,
  getEffectivePermissions
} from '../utils/adminData';

/* ── Helpers ─────────────────────────────────────────────────────────── */
const LEVELS = ['edit', 'view', 'hidden'];
const LEVEL_COLORS = { edit: '#388E3C', view: '#1976D2', hidden: '#9E9E9E' };
const LEVEL_LABELS = { edit: 'Edit', view: 'View', hidden: 'Hidden' };

/* ── Sidebar Navigation ──────────────────────────────────────────────── */
const SETTINGS_NAV = [
  {
    section: 'User Management',
    icon: Users,
    key: 'users',
    items: [
      { key: 'users-list', label: 'Users List' },
      { key: 'roles', label: 'Roles' },
      { key: 'invite', label: 'Invite User' },
    ],
  },
  {
    section: 'Field Access Control',
    icon: Shield,
    key: 'field-access',
    items: [
      { key: 'by-role', label: 'By Role' },
      { key: 'by-user', label: 'By User' },
    ],
  },
  {
    section: 'Organization',
    icon: Building2,
    key: 'org',
    items: [
      { key: 'company', label: 'Company Profile' },
      { key: 'timezone', label: 'Timezone & Locale' },
      { key: 'hours', label: 'Business Hours' },
    ],
  },
  {
    section: 'Notifications',
    icon: Bell,
    key: 'notifications',
    items: [
      { key: 'email-templates', label: 'Email Templates' },
      { key: 'notif-rules', label: 'Notification Rules' },
    ],
  },
  {
    section: 'Integration',
    icon: Link,
    key: 'integration',
    items: [
      { key: 'api-keys', label: 'API Keys' },
      { key: 'webhooks', label: 'Webhooks' },
    ],
  },
];

/* ── Field Access Control — By Role ─────────────────────────────────── */
function FieldAccessByRole() {
  const [selectedRole, setSelectedRole] = useState('Technician');
  const [selectedModule, setSelectedModule] = useState('case');
  const [permissions, setPermissions] = useState(() => getEffectivePermissions('Technician', 'case'));
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  function loadPermissions(role, mod) {
    setPermissions(getEffectivePermissions(role, mod));
    setDirty(false);
    setSaved(false);
  }

  function handleRoleChange(role) {
    setSelectedRole(role);
    loadPermissions(role, selectedModule);
  }

  function handleModuleChange(mod) {
    setSelectedModule(mod);
    loadPermissions(selectedRole, mod);
  }

  function handleAccessChange(fieldName, level) {
    setPermissions(p => ({ ...p, [fieldName]: level }));
    setDirty(true);
    setSaved(false);
  }

  function handleSave() {
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleReset() {
    loadPermissions(selectedRole, selectedModule);
  }

  const fields = MODULE_FIELDS[selectedModule] || [];
  const grouped = fields.reduce((acc, f) => {
    if (!acc[f.section]) acc[f.section] = [];
    acc[f.section].push(f);
    return acc;
  }, {});

  return (
    <div>
      {/* Controls Row */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>Role</label>
          <select value={selectedRole} onChange={e => handleRoleChange(e.target.value)}
            className="text-sm rounded-lg px-3 py-2 min-w-[160px]"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)' }}>
            {ROLES.filter(r => !['Super Admin', 'Admin'].includes(r)).map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>Module</label>
          <select value={selectedModule} onChange={e => handleModuleChange(e.target.value)}
            className="text-sm rounded-lg px-3 py-2 min-w-[180px]"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)' }}>
            {MODULES_LIST.map(m => (
              <option key={m.key} value={m.key}>{m.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2 ml-auto">
          <button onClick={handleReset}
            className="px-3 py-2 rounded-lg text-sm flex items-center gap-1.5"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            <RotateCcw size={13} /> Reset to Default
          </button>
          <button onClick={handleSave} disabled={!dirty}
            className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 disabled:opacity-40"
            style={{ backgroundColor: dirty ? 'var(--accent)' : 'var(--bg-card)', color: dirty ? '#1a1a1a' : 'var(--text-muted)', border: `1px solid ${dirty ? 'var(--accent)' : 'var(--border)'}` }}>
            <Save size={13} /> {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Unsaved indicator */}
      {dirty && (
        <div className="mb-3 px-3 py-2 rounded-lg text-xs flex items-center gap-2"
          style={{ backgroundColor: 'rgba(245,200,0,0.1)', border: '1px solid rgba(245,200,0,0.3)', color: '#8B7500' }}>
          ● Unsaved changes for <strong>{selectedRole}</strong> · <strong>{MODULES_LIST.find(m => m.key === selectedModule)?.label}</strong>
        </div>
      )}

      {/* Fields Table by Section */}
      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-10 text-sm" style={{ color: 'var(--text-muted)' }}>
          No field registry for this module yet.
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([section, sectionFields]) => (
            <div key={section} className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <div className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider"
                style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                {section}
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
                    <th className="text-left px-4 py-2 text-[10px] font-bold uppercase tracking-wider w-64" style={{ color: 'var(--text-muted)' }}>Field</th>
                    <th className="text-left px-4 py-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Access Level</th>
                  </tr>
                </thead>
                <tbody>
                  {sectionFields.map((field, idx) => {
                    const current = permissions[field.name] || 'edit';
                    return (
                      <tr key={field.name}
                        style={{ borderBottom: '1px solid var(--border)', backgroundColor: idx % 2 === 0 ? 'var(--bg-base)' : 'var(--bg-card)' }}>
                        <td className="px-4 py-2.5">
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{field.label}</span>
                          <span className="ml-2 text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{field.name}</span>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-4">
                            {LEVELS.map(level => (
                              <label key={level} className="flex items-center gap-1.5 cursor-pointer select-none">
                                <input
                                  type="radio"
                                  name={`${field.name}-access`}
                                  value={level}
                                  checked={current === level}
                                  onChange={() => handleAccessChange(field.name, level)}
                                  className="cursor-pointer"
                                  style={{ accentColor: LEVEL_COLORS[level] }}
                                />
                                <span className="text-xs font-medium capitalize"
                                  style={{ color: current === level ? LEVEL_COLORS[level] : 'var(--text-muted)' }}>
                                  {LEVEL_LABELS[level]}
                                </span>
                              </label>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Users List ──────────────────────────────────────────────────────── */
function UsersList() {
  const [search, setSearch] = useState('');
  const filtered = ADMIN_USERS.filter(u =>
    !search ||
    u.displayName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search users..."
          className="text-sm rounded-lg px-3 py-2 flex-1 max-w-xs"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)' }} />
        <button className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
          style={{ backgroundColor: 'var(--accent)', color: '#1a1a1a' }}>
          + Invite User
        </button>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
              {['Name', 'Email', 'Role', 'Status', 'Last Login', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, idx) => (
              <tr key={u.id} className="border-b"
                style={{ borderColor: 'var(--border)', backgroundColor: idx % 2 === 0 ? 'var(--bg-base)' : 'var(--bg-card)' }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-brand-blue/20 flex items-center justify-center text-xs font-bold"
                      style={{ color: 'var(--accent)' }}>
                      {u.displayName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <span className="font-medium" style={{ color: 'var(--text-main)' }}>{u.displayName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ backgroundColor: 'rgba(74,144,226,0.1)', color: '#1565C0' }}>{u.role}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium`}
                    style={{
                      backgroundColor: u.isActive ? 'rgba(52,199,89,0.1)' : 'rgba(198,40,40,0.1)',
                      color: u.isActive ? '#34C759' : '#C62828',
                    }}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{u.lastLogin}</td>
                <td className="px-4 py-3">
                  <button className="text-xs px-2.5 py-1 rounded"
                    style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Placeholder panel ───────────────────────────────────────────────── */
function PlaceholderPanel({ title }) {
  return (
    <div className="flex flex-col items-center justify-center py-20" style={{ color: 'var(--text-muted)' }}>
      <Settings size={32} className="mb-3" />
      <p className="text-sm">{title} configuration will be available here.</p>
    </div>
  );
}

/* ── Main AdminSettingsPage ──────────────────────────────────────────── */
export default function AdminSettingsPage() {
  const [activeKey, setActiveKey] = useState('by-role');

  function renderContent() {
    switch (activeKey) {
      case 'by-role': return <FieldAccessByRole />;
      case 'users-list': return <UsersList />;
      default: return <PlaceholderPanel title={SETTINGS_NAV.flatMap(s => s.items).find(i => i.key === activeKey)?.label ?? activeKey} />;
    }
  }

  const activeLabel = SETTINGS_NAV.flatMap(s => s.items).find(i => i.key === activeKey)?.label ?? activeKey;
  const activeSection = SETTINGS_NAV.find(s => s.items.some(i => i.key === activeKey))?.section ?? '';

  return (
    <div className="h-full flex" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>

      {/* ── Settings Sidebar ─────────────────────────────────── */}
      <aside className="w-60 shrink-0 overflow-y-auto py-4" style={{ borderRight: '1px solid var(--border)', backgroundColor: 'var(--bg-panel)' }}>
        <div className="px-4 mb-4">
          <div className="flex items-center gap-2">
            <Settings size={18} style={{ color: 'var(--accent)' }} />
            <h2 className="text-sm font-bold" style={{ color: 'var(--text-main)' }}>Admin Settings</h2>
          </div>
        </div>

        {SETTINGS_NAV.map(section => (
          <div key={section.key} className="mb-3">
            <p className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest"
              style={{ color: 'var(--text-muted)' }}>
              {section.section}
            </p>
            <ul className="space-y-0.5 px-2">
              {section.items.map(item => (
                <li key={item.key}>
                  <button
                    onClick={() => setActiveKey(item.key)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left`}
                    style={{
                      backgroundColor: activeKey === item.key ? 'var(--accent)' : 'transparent',
                      color: activeKey === item.key ? '#1a1a1a' : 'var(--text-secondary)',
                      fontWeight: activeKey === item.key ? 600 : 400,
                    }}>
                    <span>{item.label}</span>
                    <ChevronRight size={12} style={{ opacity: 0.5 }} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* ── Content Area ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {/* Breadcrumb header */}
        <div className="px-8 py-5" style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-panel)' }}>
          <div className="flex items-center gap-2 text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
            <Settings size={12} /> Settings <span>›</span>
            <span>{activeSection}</span> <span>›</span>
            <span style={{ color: 'var(--text-secondary)' }}>{activeLabel}</span>
          </div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>{activeLabel}</h1>
        </div>

        <div className="px-8 py-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
