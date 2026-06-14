import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, RefreshCw, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchCases } from '../services/caseService';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';

const STATUSES  = ['', 'Open', 'Assigned', 'InProgress', 'Resolved', 'Closed'];
const PRIORITIES = ['', 'Critical', 'High', 'Medium', 'Low'];

function PriorityBadge({ value }) {
  const map = { Critical:'badge-critical', High:'badge-high', Medium:'badge-medium', Low:'badge-low' };
  return <span className={map[value] ?? 'badge badge-medium'}>{value}</span>;
}

function StatusBadge({ value }) {
  const map = { Open:'badge-open', Assigned:'badge-assigned', InProgress:'badge-inprogress', Resolved:'badge-resolved', Closed:'badge-closed' };
  return <span className={map[value] ?? 'badge badge-open'}>{value}</span>;
}

export default function CasesPage() {
  const navigate = useNavigate();
  const [page, setPage]         = useState(1);
  const [pageSize]              = useState(20);
  const [search, setSearch]     = useState('');
  const [statusFilter, setStatusFilter]     = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [searchInput, setSearchInput]       = useState('');

  // Fetch Cases from Supabase with fallback
  const fetchFn = useCallback(() => fetchCases(), []);
  const { data: cases = [], loading, error, isMock } = useSupabaseQuery(fetchFn, []);

  const total = cases.length;
  const totalPages = Math.ceil(total / pageSize);

  // Client-side pagination
  const paginatedCases = cases.slice((page - 1) * pageSize, page * pageSize);

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
          <h1 className="text-2xl font-bold text-white">Cases</h1>
          <p className="text-brand-muted text-sm mt-0.5">
            {total} case{total !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={fetchCases}
            className="btn-secondary"
            aria-label="Refresh cases"
            disabled={loading}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => navigate('/cases/new')}
            className="btn-primary"
          >
            <Plus size={15} aria-hidden="true" />
            New Case
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[220px]">
            <label htmlFor="case-search" className="sr-only">Search cases</label>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none">
                <Search size={14} aria-hidden="true" />
              </span>
              <input
                id="case-search"
                type="search"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search case number, subject…"
                className="input-field pl-9 text-sm"
              />
            </div>
            <button type="submit" className="btn-primary px-4">
              <Search size={14} aria-hidden="true" />
            </button>
          </form>

          {/* Status filter */}
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label htmlFor="status-filter" className="text-xs text-brand-muted">Status</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={handleFilterChange(setStatusFilter)}
              className="input-field text-sm"
            >
              {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
            </select>
          </div>

          {/* Priority filter */}
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label htmlFor="priority-filter" className="text-xs text-brand-muted">Priority</label>
            <select
              id="priority-filter"
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
        <div role="alert" className="card border-brand-error/40 bg-red-500/10 text-brand-error text-sm">
          {error}
        </div>
      )}
      {isMock && !loading && (
        <div className="text-xs text-amber-500 px-2">(Using offline mock data)</div>
      )}

      {/* Table */}
      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm" aria-label="Cases list">
          <thead>
            <tr className="border-b border-brand-border text-brand-muted text-xs uppercase tracking-wider">
              {['Case #', 'Subject', 'Account', 'Asset', 'Owner', 'Priority', 'Status', 'Created'].map(h => (
                <th key={h} scope="col" className="px-4 py-3 text-left font-medium whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-brand-border/30">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-brand-card rounded animate-pulse w-full max-w-[120px]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedCases.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-brand-muted">
                  No cases match your filters.
                </td>
              </tr>
            ) : (
              paginatedCases.map(c => (
                <tr
                  key={c.caseID}
                  className="border-b border-brand-border/50 hover:bg-brand-card/50 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-brand-blue whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => navigate(`/cases/${c.caseID}`)}
                      className="text-left hover:underline focus:outline-none focus:underline"
                      aria-label={`Open case ${c.caseNumber}`}
                      title="Open case detail"
                    >
                      {c.caseNumber}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-300 max-w-[200px]">
                    <span className="line-clamp-1" title={c.subject}>{c.subject}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{c.accountName ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{c.assetName ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{c.assignedOwnerName ?? '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap"><PriorityBadge value={c.priority} /></td>
                  <td className="px-4 py-3 whitespace-nowrap"><StatusBadge value={c.status} /></td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                    {new Date(c.createdDate).toLocaleDateString('en-GB')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
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
