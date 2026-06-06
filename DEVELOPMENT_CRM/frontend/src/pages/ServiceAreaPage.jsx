import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  Factory, Wrench, Map as MapIcon, Search, Plus, ChevronRight,
  CheckCircle2, XCircle, MapPin,
} from 'lucide-react';
import {
  PLANTS, WORK_CENTERS, TERRITORIES,
  siteTypeLabel, wcTypeLabel, plantById, workCenterById,
  membersForTerritory,
} from '../utils/serviceAreaData';

const TABS = [
  { key: 'plants',      label: 'Plants',           icon: Factory },
  { key: 'workcenters', label: 'Work Centers',     icon: Wrench },
  { key: 'territories', label: 'Service Territory', icon: MapIcon },
];

function ActivePill({ active }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
      style={active
        ? { backgroundColor: 'rgba(56,142,60,0.12)', color: '#388E3C' }
        : { backgroundColor: 'rgba(117,117,117,0.12)', color: '#757575' }}
    >
      {active ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

function TypeBadge({ label }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium"
          style={{ backgroundColor: 'var(--accent-pale)', color: 'var(--accent-dark)', border: '1px solid var(--accent)' }}>
      {label}
    </span>
  );
}

/**
 * Service Area Module — Plant · Work Center · Service Territory
 * Implements PRD_ServiceArea_Module1/2. List view with three tabs.
 */
export default function ServiceAreaPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  // Derive default tab from pathname (/workcenters, /territories) or ?tab=
  const pathTab = location.pathname.startsWith('/workcenters') ? 'workcenters'
    : location.pathname.startsWith('/territories') ? 'territories' : null;
  const tab = pathTab || params.get('tab') || 'plants';
  const [search, setSearch] = useState('');

  const setTab = (key) => {
    if (key === 'plants') navigate('/plants');
    else if (key === 'workcenters') navigate('/workcenters');
    else navigate('/territories');
  };

  const q = search.trim().toLowerCase();

  const plants = useMemo(() => PLANTS.filter(p =>
    !q || p.plant_name.toLowerCase().includes(q) || p.plant_code.toLowerCase().includes(q) || p.city.toLowerCase().includes(q)
  ), [q]);
  const workcenters = useMemo(() => WORK_CENTERS.filter(w =>
    !q || w.wc_name.toLowerCase().includes(q) || w.wc_code.toLowerCase().includes(q)
  ), [q]);
  const territories = useMemo(() => TERRITORIES.filter(t =>
    !q || t.territory_name.toLowerCase().includes(q)
  ), [q]);

  return (
    <div className="p-6 max-w-screen-2xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <MapPin size={20} style={{ color: 'var(--accent-dark)' }} />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>Service Area</h1>
        </div>
        <button type="button" className="btn-primary px-4 py-2.5">
          <Plus size={16} /> New {tab === 'plants' ? 'Plant' : tab === 'workcenters' ? 'Work Center' : 'Territory'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors"
            style={tab === key
              ? { borderColor: 'var(--accent)', color: 'var(--text-main)' }
              : { borderColor: 'transparent', color: 'var(--text-tertiary)' }}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-md">
        <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}><Search size={15} /></span>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${tab}…`}
               className="input-field pl-9" style={{ minHeight: 40 }} />
      </div>

      {/* Content */}
      {tab === 'plants' && (
        <Table
          headers={['Plant', 'Code', 'Site Type', 'City / Region', 'Work Centers', 'Status', '']}
          rows={plants.map(p => ({
            id: p.plant_id, onClick: () => navigate(`/plants/${p.plant_id}`),
            cells: [
              <span className="font-semibold" style={{ color: 'var(--text-main)' }}>{p.plant_name}</span>,
              <span className="font-mono text-xs" style={{ color: 'var(--accent-dark)' }}>{p.plant_code}</span>,
              <TypeBadge label={siteTypeLabel(p.site_type)} />,
              <span>{p.city}, {p.region}</span>,
              WORK_CENTERS.filter(w => w.plant_id === p.plant_id).length,
              <ActivePill active={p.is_active} />,
              <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />,
            ],
          }))}
        />
      )}

      {tab === 'workcenters' && (
        <Table
          headers={['Work Center', 'Code', 'Type', 'Plant', 'SLA (h)', 'Status', '']}
          rows={workcenters.map(w => {
            const plant = plantById(w.plant_id);
            return {
              id: w.wc_id, onClick: () => navigate(`/workcenters/${w.wc_id}`),
              cells: [
                <span className="font-semibold" style={{ color: 'var(--text-main)' }}>{w.wc_name}</span>,
                <span className="font-mono text-xs" style={{ color: 'var(--accent-dark)' }}>{w.wc_code}</span>,
                <TypeBadge label={w.wc_type} />,
                plant?.plant_name || '—',
                w.default_sla_hours ?? '—',
                <ActivePill active={w.is_active} />,
                <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />,
              ],
            };
          })}
        />
      )}

      {tab === 'territories' && (
        <Table
          headers={['Territory', 'Plant', 'Work Center', 'Members', 'Travel', 'Status', '']}
          rows={territories.map(t => {
            const plant = plantById(t.plant_id);
            const wc = workCenterById(t.work_center_id);
            return {
              id: t.territory_id, onClick: () => navigate(`/territories/${t.territory_id}`),
              cells: [
                <span className="font-semibold" style={{ color: 'var(--text-main)' }}>{t.territory_name}</span>,
                plant?.plant_name || '—',
                wc?.wc_name || '—',
                membersForTerritory(t.territory_id).length,
                <span className="text-xs">{t.travel_mode} · {t.avg_travel_time_minutes}m</span>,
                <ActivePill active={t.is_active} />,
                <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />,
              ],
            };
          })}
        />
      )}
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-light)' }}>
            {headers.map((h, i) => (
              <th key={i} className="text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={headers.length} className="px-4 py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No records found.</td></tr>
          )}
          {rows.map((row) => (
            <tr key={row.id} onClick={row.onClick}
                className="cursor-pointer transition-colors"
                style={{ borderTop: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-light)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              {row.cells.map((c, i) => (
                <td key={i} className="px-4 py-3 align-middle">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
