import React, { useEffect, useState, useCallback } from 'react';
import { Search, Plus, RefreshCw, ChevronLeft, ChevronRight, Wrench } from 'lucide-react';
import api from '../utils/api';

const STATUSES = ['', 'New', 'InProgress', 'OnHold', 'Completed', 'Cancelled'];

function StatusBadge({ value }) {
  const map = {
    New:        'badge bg-blue-500/20 text-blue-300',
    InProgress: 'badge-inprogress',
    OnHold:     'badge bg-yellow-500/20 text-yellow-300',
    Completed:  'badge bg-green-500/20 text-green-300',
    Cancelled:  'badge-closed',
  };
  return <span className={map[value] ?? 'badge badge-open'}>{value}</span>;
}

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState([]);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [pageSize]                  = useState(20);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const totalPages = Math.ceil(total / pageSize);

  const fetchWOs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page, pageSize });
      if (search)       params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const res = await api.get(`/workorders?${params}`);
      const d = res.data?.data;
      setWorkOrders(d?.items ?? []);
      setTotal(d?.totalCount ?? 0);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to load work orders.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter]);

  useEffect(() => { fetchWOs(); }, [fetchWOs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Work Orders</h1>
          <p className="text-brand-muted text-sm mt-0.5">
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
          <button type="button" className="btn-primary" disabled>
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
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none">
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
            <label htmlFor="wo-status-filter" className="text-xs text-brand-muted">Status</label>
            <select
              id="wo-status-filter"
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="input-field text-sm"
            >
              {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
            </select>
          </div>

          {(search || statusFilter) && (
            <button
              type="button"
              onClick={() => { setSearch(''); setSearchInput(''); setStatusFilter(''); setPage(1); }}
              className="btn-secondary text-xs"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div role="alert" className="card border-brand-error/40 bg-red-500/10 text-brand-error text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm" aria-label="Work orders list">
          <thead>
            <tr className="border-b border-brand-border text-brand-muted text-xs uppercase tracking-wider">
              {['WO #', 'Subject', 'Case #', 'Account', 'Asset', 'Mechanic', 'Status', 'Start Date'].map(h => (
                <th key={h} scope="col" className="px-4 py-3 text-left font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-brand-border/30">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-brand-card rounded animate-pulse w-full max-w-[110px]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : workOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-brand-muted">
                  <div className="flex flex-col items-center gap-3">
                    <Wrench size={32} className="text-brand-border" aria-hidden="true" />
                    <span>No work orders match your filters.</span>
                  </div>
                </td>
              </tr>
            ) : (
              workOrders.map(wo => (
                <tr
                  key={wo.workOrderID}
                  className="border-b border-brand-border/50 hover:bg-brand-card/50 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-brand-blue whitespace-nowrap">
                    {wo.workOrderNumber}
                  </td>
                  <td className="px-4 py-3 text-gray-300 max-w-[200px]">
                    <span className="line-clamp-1" title={wo.subject}>{wo.subject}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-purple-400 whitespace-nowrap">
                    {wo.caseNumber}
                  </td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{wo.accountName ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{wo.assetName ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{wo.assignedMechanicName ?? '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap"><StatusBadge value={wo.status} /></td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                    {wo.startDate ? new Date(wo.startDate).toLocaleDateString('en-GB') : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-brand-border text-sm text-brand-muted">
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
