/* ─────────────────────────────────────────────────────────────────────────
   Opportunities List Page
   Displays all opportunities with filtering and search
   ───────────────────────────────────────────────────────────────────────── */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, RefreshCw, Filter, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { fetchOpportunities } from '../services/opportunityService';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';

const STAGES = ['All', 'Prospecting', 'Qualification', 'Needs Analysis', 'Value Proposition', 'Proposal / Price Quote', 'Negotiation / Review', 'Closed Won', 'Closed Lost'];

function StageBadge({ value }) {
  const colors = {
    'Prospecting': 'text-blue-400',
    'Qualification': 'text-cyan-400',
    'Needs Analysis': 'text-indigo-400',
    'Value Proposition': 'text-purple-400',
    'Proposal / Price Quote': 'text-pink-400',
    'Negotiation / Review': 'text-orange-400',
    'Closed Won': 'text-green-400',
    'Closed Lost': 'text-red-400',
  };
  return <span className={`badge ${colors[value] || 'badge-open'}`}>{value}</span>;
}

function StatusIndicator({ isClosed, isWon }) {
  if (!isClosed) return null;
  if (isWon) return <span className="text-green-400">✓ Won</span>;
  return <span className="text-red-400">✗ Lost</span>;
}

export default function OpportunitiesListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [searchInput, setSearchInput] = useState('');

  // Fetch Opportunities from Supabase with fallback
  const fetchFn = useCallback(() => fetchOpportunities({}, { orderBy: 'created_at', ascending: false }), []);
  const { data: opportunities = [], loading, error, isMock } = useSupabaseQuery(fetchFn, []);

  const total = opportunities.length;
  const totalPages = Math.ceil(total / pageSize);

  // Client-side pagination
  const paginatedOpportunities = opportunities.slice((page - 1) * pageSize, page * pageSize);

  // Filter by search and stage
  const filtered = paginatedOpportunities.filter(o => {
    const matchSearch = !search ||
      (o.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.accountName || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.ownerName || '').toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === 'All' || o.stageName === stageFilter;
    return matchSearch && matchStage;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const formatCurrency = (amount) => {
    if (!amount) return '—';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB');
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      {/* Header */}
      <div className="px-6 py-5" style={{ backgroundColor: 'var(--bg-panel)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <TrendingUp size={22} style={{ color: 'var(--accent)' }} />
            <div>
              <h1 className="text-2xl font-bold">Opportunities</h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {loading ? 'Loading...' : `${filtered.length} of ${total} records`}
                {isMock && !loading && <span style={{ marginLeft: '8px', fontSize: '10px', color: 'var(--text-muted)' }}>(Mock Data)</span>}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/opportunities/new')}
            className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
            style={{ backgroundColor: 'var(--accent)', color: '#1a1a1a' }}
          >
            <Plus size={16} /> New Opportunity
          </button>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="flex flex-wrap gap-3 items-end">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[220px]">
              <label htmlFor="opp-search" className="sr-only">Search opportunities</label>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none">
                  <Search size={14} />
                </span>
                <input
                  id="opp-search"
                  type="search"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Search opportunity name, account…"
                  className="input-field pl-9 text-sm"
                />
              </div>
              <button type="submit" className="btn-primary px-4">
                <Search size={14} />
              </button>
            </form>

            {/* Stage filter */}
            <div className="flex flex-col gap-1 min-w-[140px]">
              <label htmlFor="stage-filter" className="text-xs text-brand-muted">Stage</label>
              <select
                id="stage-filter"
                value={stageFilter}
                onChange={handleFilterChange(setStageFilter)}
                className="input-field text-sm"
              >
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
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
        <table className="w-full text-sm" aria-label="Opportunities list">
          <thead>
            <tr className="border-b border-brand-border text-brand-muted text-xs uppercase tracking-wider">
              {['Opportunity Name', 'Account', 'Stage', 'Amount', 'Probability', 'Close Date', 'Owner', 'Last Activity'].map(h => (
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
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-brand-muted">
                  No opportunities match your filters.
                </td>
              </tr>
            ) : (
              filtered.map(opp => (
                <tr
                  key={opp.id}
                  onClick={() => navigate(`/opportunities/${opp.id}`)}
                  className="border-b border-brand-border/50 hover:bg-brand-card/50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 font-medium text-brand-blue whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {opp.isPriorityRecord && <span style={{ color: 'var(--accent)' }}>★</span>}
                      {opp.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{opp.accountName ?? '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StageBadge value={opp.stageName} />
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-gray-300 whitespace-nowrap">
                    {formatCurrency(opp.amount)}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {opp.probability}%
                  </td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                    {formatDate(opp.closeDate)}
                  </td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                    {opp.ownerName ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                    {formatDate(opp.lastActivityDate)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-sm text-brand-muted">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded border border-brand-border disabled:opacity-50"
              style={{ color: 'var(--text-main)' }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded border border-brand-border disabled:opacity-50"
              style={{ color: 'var(--text-main)' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
