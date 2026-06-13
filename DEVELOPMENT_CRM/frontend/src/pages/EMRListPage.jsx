import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Activity, Filter, Loader } from 'lucide-react';
import { EMR_STATUS_TOKENS } from '../utils/emrData';
import { fetchEMRs } from '../services/emrService';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';

function EMRStatusBadge({ status }) {
  const t = EMR_STATUS_TOKENS[status] || { color: '#6C7681', bg: 'rgba(108,118,129,0.1)', border: '#6C7681' };
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: t.bg, color: t.color, border: `1px solid ${t.border}` }}>
      {status}
    </span>
  );
}

function TypeBadge({ type }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase"
      style={{
        backgroundColor: type === 'U' ? 'rgba(245,200,0,0.12)' : 'rgba(74,144,226,0.12)',
        color: type === 'U' ? '#8B7500' : '#1565C0',
        border: `1px solid ${type === 'U' ? '#F5C80040' : '#4A90E240'}`,
      }}>
      {type === 'U' ? 'U-type' : 'S-type'}
    </span>
  );
}

const STATUS_OPTIONS = ['All', 'Open', 'In Progress', 'Submit EMR', 'Assign TO', 'Not Complete', 'Resubmit', 'Closed'];
const TYPE_OPTIONS = ['All', 'U', 'S'];

export default function EMRListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Fetch EMRs from Supabase with fallback to mock data
  const fetchFn = useCallback(() => fetchEMRs({}, { orderBy: 'created_at', ascending: false }), []);
  const { data: emrs = [], loading, error, isMock } = useSupabaseQuery(fetchFn, []);

  const filtered = useMemo(() => {
    return (emrs || []).filter(e => {
      const matchSearch = !search ||
        (e.id || '').toLowerCase().includes(search.toLowerCase()) ||
        (e.subject || '').toLowerCase().includes(search.toLowerCase()) ||
        (e.account || '').toLowerCase().includes(search.toLowerCase()) ||
        (e.asset || '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || e.status === statusFilter;
      const matchType = typeFilter === 'All' || e.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [emrs, search, statusFilter, typeFilter]);

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="px-6 py-5" style={{ backgroundColor: 'var(--bg-panel)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Activity size={22} style={{ color: 'var(--accent)' }} />
            <div>
              <h1 className="text-2xl font-bold">Equipment Maintenance Reports</h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {loading ? 'Loading...' : `${filtered.length} of ${(emrs || []).length} records`}
                {isMock && !loading && <span style={{ marginLeft: '8px', fontSize: '10px', color: 'var(--text-muted)' }}>(Mock Data)</span>}
              </p>
            </div>
          </div>
          <button
            onClick={() => {}}
            className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
            style={{ backgroundColor: 'var(--accent)', color: '#1a1a1a' }}>
            <Plus size={16} /> New EMR
          </button>
        </div>

        {/* Search + Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search EMR, subject, account, asset..."
              className="w-full text-sm rounded-lg pl-8 pr-3 py-2"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1">
            <Filter size={13} style={{ color: 'var(--text-muted)' }} />
            {TYPE_OPTIONS.map(t => (
              <button key={t}
                onClick={() => setTypeFilter(t)}
                className="px-2.5 py-1 rounded-full text-xs font-medium transition-colors"
                style={{
                  backgroundColor: typeFilter === t ? 'var(--accent)' : 'var(--bg-card)',
                  color: typeFilter === t ? '#1a1a1a' : 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}>
                {t === 'All' ? 'All Types' : t === 'U' ? 'U-type' : 'S-type'}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-sm rounded-lg px-3 py-2"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)' }}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader size={40} className="mb-3 animate-spin" style={{ color: 'var(--accent)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading EMR records...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Activity size={40} className="mb-3" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No EMR records match your filter.</p>
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
                  {['EMR Name', 'Type', 'Subject', 'Account', 'Asset', 'Status', 'Owner', 'Last Modified'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((emr, idx) => (
                  <tr key={emr.id}
                    className="border-b transition-colors cursor-pointer"
                    style={{ borderColor: 'var(--border)', backgroundColor: idx % 2 === 0 ? 'var(--bg-base)' : 'var(--bg-card)' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-light)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? 'var(--bg-base)' : 'var(--bg-card)'}
                    onClick={() => navigate(`/emr/${encodeURIComponent(emr.id)}`)}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-bold" style={{ color: 'var(--accent)' }}>{emr.id}</span>
                    </td>
                    <td className="px-4 py-3"><TypeBadge type={emr.type} /></td>
                    <td className="px-4 py-3 max-w-[280px]">
                      <div className="font-medium truncate" style={{ color: 'var(--text-main)' }}>{emr.subject}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>WO: {emr.workOrder}</div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{emr.account}</td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{emr.asset}</div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{emr.machineModel} · {emr.serialNumber}</div>
                    </td>
                    <td className="px-4 py-3"><EMRStatusBadge status={emr.status} /></td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{emr.owner}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {emr.lastModifiedAt ? new Date(emr.lastModifiedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
