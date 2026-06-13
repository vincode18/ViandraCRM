/* ─────────────────────────────────────────────────────────────────────────
   Application Log Page
   Read-only audit trail for object changes and API events
   ───────────────────────────────────────────────────────────────────────── */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, SlidersHorizontal, CalendarDays, X, ChevronRight, SearchX, FileText, Database, CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import { fetchLogEntries, fetchFilterOptions } from '../services/appLogService';

const EVENT_TYPE_LABELS = {
  'OBJECT_CREATE': 'Object Change',
  'OBJECT_UPDATE': 'Object Change',
  'OBJECT_DELETE': 'Object Change',
  'OBJECT_STATUS_CHANGE': 'Object Change',
  'REST_API_INBOUND': 'REST API — Inbound',
  'REST_API_OUTBOUND': 'REST API — Outbound',
};

const EVENT_TYPE_COLORS = {
  'Object Change': { bg: '#E0F2F1', text: '#00897B' },
  'REST API — Inbound': { bg: '#E3F2FD', text: '#1976D2' },
  'REST API — Outbound': { bg: '#FFF3E0', text: '#F57C00' },
};

function FilterPanel({ isOpen, onClose, filters, onFilterChange, onApply, onClear, options }) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="Activity Filters"
      className="absolute top-full left-0 mt-2 w-[360px] rounded-lg shadow-xl z-50"
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <div className="px-4 py-3 flex items-center justify-between border-b" style={{ borderColor: 'var(--border)' }}>
        <span className="font-bold text-sm">Activity Filters</span>
        <button onClick={onClose} className="p-1 rounded hover:bg-brand-light">
          <X size={16} />
        </button>
      </div>

      <div className="py-2">
        {/* User Filter */}
        <div className="px-4 py-3 flex justify-between items-center border-b" style={{ borderColor: 'var(--border)' }}>
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            👤 User
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {filters.actorId?.length || 0} selected
            </span>
            <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
          </div>
        </div>

        {/* Event Type Filter */}
        <div className="px-4 py-3 flex justify-between items-center border-b" style={{ borderColor: 'var(--border)' }}>
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            ▣ Event Type
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {filters.eventType?.length || 0} selected
            </span>
            <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
          </div>
        </div>

        {/* Object/Module Filter */}
        <div className="px-4 py-3 flex justify-between items-center border-b" style={{ borderColor: 'var(--border)' }}>
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            📦 Object / Module
          </span>
          <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
        </div>

        {/* Date Range Filter */}
        <div className="px-4 py-3 flex justify-between items-center border-b" style={{ borderColor: 'var(--border)' }}>
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            📅 Date Range
          </span>
          <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
        </div>

        {/* Request Status Filter */}
        <div className="px-4 py-3 flex justify-between items-center">
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            ⚡ Request Status
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onFilterChange('requestStatus', filters.requestStatus === 'S' ? null : 'S')}
              className={`px-2 py-1 text-xs rounded ${filters.requestStatus === 'S' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
            >
              Success
            </button>
            <button
              onClick={() => onFilterChange('requestStatus', filters.requestStatus === 'F' ? null : 'F')}
              className={`px-2 py-1 text-xs rounded ${filters.requestStatus === 'F' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}
            >
              Failure
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-t flex gap-2" style={{ borderColor: 'var(--border)' }}>
        <button onClick={onApply} className="btn-primary flex-1 py-2 text-sm">Apply filters</button>
        <button onClick={onClear} className="btn-secondary py-2 text-sm">Clear all</button>
      </div>
    </div>
  );
}

function EventTypeBadge({ eventType }) {
  const label = EVENT_TYPE_LABELS[eventType] || eventType;
  const colors = EVENT_TYPE_COLORS[label] || { bg: 'var(--bg-light)', text: 'var(--text-secondary)' };
  return (
    <span
      className="badge px-3 py-1 rounded-full text-xs font-medium h-[28px] inline-flex items-center"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {label}
    </span>
  );
}

function StatusBadge({ status }) {
  if (status === 'S') {
    return (
      <span
        className="badge px-3 py-1 rounded-full text-xs font-medium"
        style={{ backgroundColor: '#E8F5E9', color: '#388E3C' }}
      >
        Success
      </span>
    );
  }
  return (
    <span
      className="badge px-3 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: '#FFEBEE', color: '#C62828' }}
    >
      Failure
    </span>
  );
}

export default function ApplicationLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ totalRecords: 0, totalPages: 0 });

  useEffect(() => {
    loadLogs();
  }, [page, pageSize, filters]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const response = await fetchLogEntries(
        {
          ...filters,
          objectId: searchTerm || filters.objectId,
          moduleId: searchTerm || filters.moduleId,
        },
        { page, pageSize, sortBy: 'timestamp', sortOrder: 'desc' }
      );

      if (response.success) {
        setLogs(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setPage(1);
    setShowFilterPanel(false);
    loadLogs();
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setPage(1);
    setShowFilterPanel(false);
    loadLogs();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      setPage(1);
      loadLogs();
    }
  };

  const removeFilter = (key) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    setPage(1);
    loadLogs();
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const activeFilterCount = Object.keys(filters).filter(k => filters[k] !== null && filters[k] !== undefined).length;

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <ArrowLeft size={18} className="cursor-pointer" style={{ color: 'var(--text-muted)' }} />
          <div>
            <h1 className="text-2xl font-bold">Application Log</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
              Showing changes to objects and integration API events
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-4">
        <div className="flex gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              onKeyDown={handleSearchSubmit}
              placeholder="Search by Object ID or Module ID…"
              className="input-field pl-9 text-sm min-h-[44px]"
            />
          </div>

          {/* Filters Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="btn-secondary px-4 py-2 text-sm flex items-center gap-2 min-h-[44px]"
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-[var(--accent)] text-[var(--text-main)] text-xs font-medium rounded-full px-1.5 py-0.5">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <FilterPanel
              isOpen={showFilterPanel}
              onClose={() => setShowFilterPanel(false)}
              filters={filters}
              onFilterChange={handleFilterChange}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
              options={{}}
            />
          </div>

          {/* Date Range Button */}
          <button className="btn-secondary px-4 py-2 text-sm flex items-center gap-2 min-h-[44px]">
            <CalendarDays size={16} />
            Date Range
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="px-6 pb-4 flex flex-wrap gap-2">
          {filters.requestStatus && (
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-full border"
              style={{ backgroundColor: 'var(--accent-pale)', borderColor: 'var(--accent)' }}
            >
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Status: {filters.requestStatus === 'S' ? 'Success' : 'Failure'}
              </span>
              <button onClick={() => removeFilter('requestStatus')} className="hover:text-red-500">
                <X size={12} />
              </button>
            </div>
          )}
          {filters.eventType && filters.eventType.length > 0 && (
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-full border"
              style={{ backgroundColor: 'var(--accent-pale)', borderColor: 'var(--accent)' }}
            >
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Event Type: {filters.eventType.length} selected
              </span>
              <button onClick={() => removeFilter('eventType')} className="hover:text-red-500">
                <X size={12} />
              </button>
            </div>
          )}
          <button
            onClick={handleClearFilters}
            className="text-sm font-medium underline"
            style={{ color: 'var(--color-info)' }}
          >
            Clear all
          </button>
        </div>
      )}

      {/* Log Table */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12" style={{ color: 'var(--text-secondary)' }}>
              Loading...
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <SearchX size={48} className="mb-3" style={{ color: 'var(--text-muted)' }} />
              <p className="text-lg font-semibold mb-1">No log entries match your filters</p>
              <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
                Try adjusting the date range or clearing filters
              </p>
              <button onClick={handleClearFilters} className="btn-secondary px-4 py-2 text-sm">
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                    <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase w-[160px]" style={{ color: 'var(--text-tertiary)' }}>
                      Timestamp
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase w-[160px]" style={{ color: 'var(--text-tertiary)' }}>
                      Event Type
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase w-[180px]" style={{ color: 'var(--text-tertiary)' }}>
                      Object / Module
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase flex-1" style={{ color: 'var(--text-tertiary)' }}>
                      Description
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase w-[160px]" style={{ color: 'var(--text-tertiary)' }}>
                      User / Source
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase w-[100px]" style={{ color: 'var(--text-tertiary)' }}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <React.Fragment key={log.id}>
                      <tr
                        className="border-b hover:bg-brand-light cursor-pointer transition-colors"
                        style={{ borderColor: 'var(--border)', minHeight: '44px' }}
                        onClick={() => setExpandedRow(expandedRow === log.id ? null : log.id)}
                      >
                        <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          {formatDate(log.timestamp)}
                        </td>
                        <td className="px-4 py-3">
                          <EventTypeBadge eventType={log.eventType} />
                        </td>
                        <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                          <div className="truncate" title={`${log.objectType}: ${log.objectId}`}>
                            {log.objectType}: {log.objectId}
                          </div>
                        </td>
                        <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                          {log.description}
                        </td>
                        <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                          {log.actorType === 'USER' ? (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-brand-blue flex items-center justify-center text-white text-xs">
                                {log.actorLabel.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-xs">{log.actorLabel}</span>
                            </div>
                          ) : (
                            <span className="text-xs">{log.actorLabel}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={log.requestStatus} />
                        </td>
                      </tr>
                      {expandedRow === log.id && (
                        <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                          <td colSpan={6} className="p-0">
                            <div className="px-6 py-4" style={{ backgroundColor: 'var(--bg-light)' }}>
                              {log.eventType.startsWith('OBJECT_') && log.metadata.changedFields ? (
                                <>
                                  <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                        Object ID
                                      </label>
                                      <div className="text-sm font-mono">{log.objectId}</div>
                                    </div>
                                    <div>
                                      <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                        Module ID
                                      </label>
                                      <div className="text-sm font-mono">{log.moduleId}</div>
                                    </div>
                                    <div>
                                      <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                        Changed By
                                      </label>
                                      <div className="text-sm">{log.actorLabel}</div>
                                    </div>
                                    <div>
                                      <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                        Changed At
                                      </label>
                                      <div className="text-sm font-mono">{formatDate(log.timestamp)}</div>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-muted)' }}>
                                      Fields Changed
                                    </label>
                                    {log.metadata.changedFields.map((field, i) => (
                                      <div key={i} className="flex items-center gap-4 py-1">
                                        <span className="text-xs font-medium w-[180px]" style={{ color: 'var(--text-secondary)' }}>
                                          {field.displayLabel}
                                        </span>
                                        <span className="text-xs font-mono" style={{ color: 'var(--color-danger)', textDecoration: 'line-through' }}>
                                          {field.oldValue || '—'}
                                        </span>
                                        <span style={{ color: 'var(--text-muted)' }}>→</span>
                                        <span className="text-xs font-mono" style={{ color: 'var(--color-success)' }}>
                                          {field.newValue}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              ) : log.eventType.startsWith('REST_API_') ? (
                                <>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                        Module ID
                                      </label>
                                      <div className="text-sm font-mono">{log.moduleId}</div>
                                    </div>
                                    <div>
                                      <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                        Direction
                                      </label>
                                      <div className="text-sm">{log.metadata.direction}</div>
                                    </div>
                                    <div>
                                      <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                        Method
                                      </label>
                                      <div className="text-sm font-mono">{log.metadata.method}</div>
                                    </div>
                                    <div>
                                      <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                        Entity
                                      </label>
                                      <div className="text-sm">{log.metadata.entityName}</div>
                                    </div>
                                    {log.metadata.query && (
                                      <div className="col-span-2">
                                        <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                          Query
                                        </label>
                                        <div className="text-sm font-mono mt-1">{log.metadata.query}</div>
                                      </div>
                                    )}
                                    <div>
                                      <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                        Response Size
                                      </label>
                                      <div className="text-sm">{log.metadata.responseSize.toLocaleString()} bytes</div>
                                    </div>
                                    <div>
                                      <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                        Rows Processed
                                      </label>
                                      <div className="text-sm">{log.metadata.rowsProcessed}</div>
                                    </div>
                                    <div>
                                      <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                        Status
                                      </label>
                                      <div className="text-sm">{log.requestStatus === 'S' ? 'Success' : 'Failure'}</div>
                                    </div>
                                    <div>
                                      <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                        Duration
                                      </label>
                                      <div className="text-sm">{log.metadata.durationMs}ms</div>
                                    </div>
                                  </div>
                                </>
                              ) : null}
                              {log.errorMessage && (
                                <div className="mt-4 p-3 rounded" style={{ backgroundColor: '#FFEBEE', color: '#C62828', border: '1px solid #C62828' }}>
                                  <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1">Error</label>
                                  <div className="text-sm">{log.errorMessage}</div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-4 py-3 border-t flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    Page {page} of {pagination.totalPages}
                  </span>
                  <select
                    value={pageSize}
                    onChange={e => setPageSize(Number(e.target.value))}
                    className="input-field text-xs py-1 px-2"
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-50"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-50"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
