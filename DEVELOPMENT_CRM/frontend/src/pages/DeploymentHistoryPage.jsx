/* ─────────────────────────────────────────────────────────────────────────
   Deployment History Page
   Filterable deployment history log
   ───────────────────────────────────────────────────────────────────────── */

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Filter } from 'lucide-react';
import { loadDeploymentHistory } from '../services/deploymentService';

export default function DeploymentHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    environment: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    loadHistory();
  }, [filters]);

  const loadHistory = async () => {
    setLoading(true);
    const response = await loadDeploymentHistory(filters);
    if (response.success) {
      setHistory(response.data);
    }
    setLoading(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div>
          <h1 className="text-2xl font-bold">Deployment History</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            Audit log of all deployment actions across environments
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 flex gap-3">
        <div className="flex items-center gap-2">
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        <select
          value={filters.environment}
          onChange={e => setFilters({ ...filters, environment: e.target.value })}
          className="input-field text-sm"
        >
          <option value="">All Environments</option>
          <option value="dev">Development</option>
          <option value="test">Testing</option>
          <option value="prod">Production</option>
        </select>
        <select
          value={filters.status}
          onChange={e => setFilters({ ...filters, status: e.target.value })}
          className="input-field text-sm"
        >
          <option value="">All Statuses</option>
          <option value="Succeeded">Succeeded</option>
          <option value="Failed">Failed</option>
          <option value="In Progress">In Progress</option>
        </select>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={e => setFilters({ ...filters, dateFrom: e.target.value })}
          className="input-field text-sm"
        />
        <input
          type="date"
          value={filters.dateTo}
          onChange={e => setFilters({ ...filters, dateTo: e.target.value })}
          className="input-field text-sm"
        />
        <button
          onClick={() => setFilters({ environment: '', status: '', dateFrom: '', dateTo: '' })}
          className="btn-secondary px-3 py-1.5 text-sm"
        >
          Clear
        </button>
      </div>

      {/* History Table */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="card overflow-hidden">
          {loading ? (
            <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
              Loading history...
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-lg font-semibold mb-1">No deployment history</p>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Deployment actions will appear here
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Change Set
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    From
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    To
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Actor
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Time
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry) => (
                  <tr key={entry.id} className="border-b hover:bg-brand-light transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-4 py-3 font-medium">{entry.changeSetName}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: 'var(--color-info-pale)', color: 'var(--color-info)' }}>
                        {entry.sourceEnv.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: 'var(--color-warning-pale)', color: 'var(--color-warning)' }}>
                        {entry.targetEnv.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {entry.actor}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {formatDate(entry.startedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-xs" style={{ color: entry.status === 'Succeeded' ? 'var(--color-success)' : entry.status === 'Failed' ? 'var(--color-danger)' : 'var(--color-warning)' }}>
                        {entry.status === 'Succeeded' && <CheckCircle size={12} />}
                        {entry.status === 'Failed' && <XCircle size={12} />}
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
