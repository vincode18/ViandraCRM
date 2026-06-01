import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, RefreshCw, ChevronLeft, ChevronRight, Wrench, Filter } from 'lucide-react';
import api from '../utils/api';

const STATUSES = ['', 'Open', 'In Progress', 'Completed', 'Cancelled', 'On Hold'];
const PRIORITIES = ['', 'Critical', 'High', 'Medium', 'Low'];

// Work Order Status Mapping (UIC-001)
const WO_STATUS_MAPPING = {
  Open: { color: '#4A90E2', bg: 'rgba(74, 144, 226, 0.1)' },
  'In Progress': { color: '#FFB81C', bg: 'rgba(255, 184, 28, 0.1)' },
  Completed: { color: '#34C759', bg: 'rgba(52, 199, 89, 0.1)' },
  Cancelled: { color: '#6C7681', bg: 'rgba(108, 118, 129, 0.1)' },
  'On Hold': { color: '#FF9F0A', bg: 'rgba(255, 159, 10, 0.1)' },
};

function PriorityBadge({ value }) {
  const map = { 
    Critical: 'badge-critical', 
    High: 'badge-high', 
    Medium: 'badge-medium', 
    Low: 'badge-low' 
  };
  return <span className={map[value] ?? 'badge badge-medium'}>{value}</span>;
}

function StatusBadge({ value }) {
  const mapping = WO_STATUS_MAPPING[value];
  if (!mapping) return <span className="badge badge-open">{value}</span>;
  return (
    <span style={{ backgroundColor: mapping.bg, color: mapping.color, border: `1px solid ${mapping.color}` }} className="px-2 py-0.5 rounded text-xs font-medium">
      {value}
    </span>
  );
}

export default function WorkOrdersPage() {
  const navigate = useNavigate();
  const [workOrders, setWorkOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const totalPages = Math.ceil(total / pageSize);

  const fetchWOs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page, pageSize });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      if (priorityFilter) params.set('priority', priorityFilter);
      const res = await api.get(`/workorders?${params}`);
      const d = res.data?.data;
      setWorkOrders(d?.items ?? []);
      setTotal(d?.totalCount ?? 0);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to load work orders.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter, priorityFilter]);

  useEffect(() => { fetchWOs(); }, [fetchWOs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>Work Orders</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            {total} work order{total !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={fetchWOs}
            className="btn-secondary"
            aria-label="Refresh work orders"
            disabled={loading}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => navigate('/workorders/new')}
            className="btn-primary"
          >
            <Plus size={15} aria-hidden="true" />
            New Work Order
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-3 items-end">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[220px]">
            <label htmlFor="wo-search" className="sr-only">Search work orders</label>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
                <Search size={14} aria-hidden="true" />
              </span>
              <input
                id="wo-search"
                type="search"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search WO number, subject…"
                className="input-field pl-9 text-sm"
              />
            </div>
            <button type="submit" className="btn-primary px-4">
              <Search size={14} aria-hidden="true" />
            </button>
          </form>

          <div className="flex flex-col gap-1 min-w-[140px]">
            <label htmlFor="wo-status-filter" className="text-xs" style={{ color: 'var(--text-muted)' }}>Status</label>
            <select
              id="wo-status-filter"
              value={statusFilter}
              onChange={handleFilterChange(setStatusFilter)}
              className="input-field text-sm"
            >
              {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1 min-w-[140px]">
            <label htmlFor="wo-priority-filter" className="text-xs" style={{ color: 'var(--text-muted)' }}>Priority</label>
            <select
              id="wo-priority-filter"
              value={priorityFilter}
              onChange={handleFilterChange(setPriorityFilter)}
              className="input-field text-sm"
            >
              {PRIORITIES.map(p => <option key={p} value={p}>{p || 'All Priorities'}</option>)}
            </select>
          </div>

          {(search || statusFilter || priorityFilter) && (
            <button
              type="button"
              onClick={() => { setSearch(''); setSearchInput(''); setStatusFilter(''); setPriorityFilter(''); setPage(1); }}
              className="btn-secondary text-xs"
            >
              <Filter size={13} aria-hidden="true" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div role="alert" className="card text-sm" style={{ borderColor: 'rgba(231, 76, 60, 0.4)', backgroundColor: 'rgba(231, 76, 60, 0.1)', color: '#E74C3C' }}>
          {error}
        </div>
      )}

      {/* Table */}
      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm" aria-label="Work orders list">
          <thead>
            <tr className="border-b text-xs uppercase tracking-wider" style={{ borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}>
              {['WO #', 'Subject', 'Account', 'Asset', 'Technician', 'Priority', 'Status', 'Created'].map(h => (
                <th key={h} scope="col" className="px-4 py-3 text-left font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b" style={{ borderColor: 'var(--border)/0.3' }}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 rounded animate-pulse w-full max-w-[110px]" style={{ backgroundColor: 'var(--bg-card)' }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : workOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center" style={{ color: 'var(--text-muted)' }}>
                  <div className="flex flex-col items-center gap-3">
                    <Wrench size={32} style={{ color: 'var(--border)' }} aria-hidden="true" />
                    <span>No work orders match your filters.</span>
                  </div>
                </td>
              </tr>
            ) : (
              workOrders.map(wo => (
                <tr
                  key={wo.workOrderID}
                  className="border-b hover:transition-colors" style={{ borderColor: 'var(--border)/0.5' }}
                >
                  <td className="px-4 py-3 font-mono text-xs whitespace-nowrap" style={{ color: 'var(--accent)' }}>
                    <button
                      type="button"
                      onClick={() => navigate(`/workorders/${encodeURIComponent(wo.workOrderNumber)}`)}
                      className="text-left hover:underline focus:outline-none focus:underline"
                      aria-label={`Open work order ${wo.workOrderNumber}`}
                      title="Open work order detail"
                    >
                      {wo.workOrderNumber}
                    </button>
                  </td>
                  <td className="px-4 py-3 max-w-[200px]" style={{ color: 'var(--text-secondary)' }}>
                    <span className="line-clamp-1" title={wo.subject}>{wo.subject}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>{wo.accountName ?? '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>{wo.assetName ?? '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>{wo.assignedMechanicName ?? '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap"><PriorityBadge value={wo.priority} /></td>
                  <td className="px-4 py-3 whitespace-nowrap"><StatusBadge value={wo.status} /></td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>
                    {wo.createdDate ? new Date(wo.createdDate).toLocaleDateString('en-GB') : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="btn-secondary px-3 py-2 text-xs"
                aria-label="Previous page"
              >
                <ChevronLeft size={14} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="btn-secondary px-3 py-2 text-xs"
                aria-label="Next page"
              >
                <ChevronRight size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
