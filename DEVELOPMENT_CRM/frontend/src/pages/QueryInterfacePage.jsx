/* ─────────────────────────────────────────────────────────────────────────
   Query Interface Page (PRD-02)
   Guided query interface with filters and templates for operators
   ───────────────────────────────────────────────────────────────────────── */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, RefreshCw, Download, MoreVertical, X, ChevronDown, Grid3x3, FileText, Calendar, User, MapPin } from 'lucide-react';
import { OBJECT_TABS, QUERY_TEMPLATES, FILTER_OPTIONS, BULK_ACTIONS } from '../utils/queryTemplates';
import { executeQuery } from '../services/queryConsoleService';

function DetailDrawer({ isOpen, onClose, record }) {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="absolute right-0 top-0 h-full w-[400px] card overflow-hidden flex flex-col"
        style={{ animation: 'slideInRight 0.25s ease-out' }}>
        <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <span className="font-bold">Record Details</span>
          <button onClick={onClose} className="p-1 rounded hover:bg-brand-light">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-muted)' }}>
                Summary
              </label>
              <div className="space-y-2">
                {Object.entries(record).slice(0, 5).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-tertiary)' }}>{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
              <label className="text-[11px] font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-muted)' }}>
                Field Inspector
              </label>
              <div className="space-y-2">
                {Object.entries(record).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-xs py-1 border-b" style={{ borderColor: 'var(--border)' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>{key}</span>
                    <span className="font-mono">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex gap-2">
            <button className="btn-primary flex-1 py-2 text-sm">View Full Record</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QueryInterfacePage() {
  const [activeTab, setActiveTab] = useState(OBJECT_TABS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [showTemplates, setShowTemplates] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [detailDrawer, setDetailDrawer] = useState({ isOpen: false, record: null });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  const currentFilters = FILTER_OPTIONS[activeTab.object] || {};

  useEffect(() => {
    handleSearch();
  }, [activeTab]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const query = buildQuery();
      const response = await executeQuery(query, 'SOQL');
      if (response.success) {
        setResults(response.data);
        setPage(1);
        setSelectedRows(new Set());
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildQuery = () => {
    const object = activeTab.object;
    const fields = getDefaultFields(object);
    let query = `SELECT ${fields.join(', ')} FROM ${object}`;
    const conditions = [];

    if (searchTerm) {
      conditions.push(`Name LIKE '%${searchTerm}%'`);
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'All') {
        conditions.push(`${key} = '${value}'`);
      }
    });

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY ${activeTab.defaultSort} ${activeTab.defaultSortDir} LIMIT 100`;
    return query;
  };

  const getDefaultFields = (object) => {
    const fieldMap = {
      Case: ['Id', 'CaseNumber', 'Subject', 'Status', 'Priority', 'CreatedDate', 'AccountId'],
      WorkOrder: ['Id', 'WorkOrderNumber', 'Subject', 'Status', 'Priority', 'ScheduledDate', 'CaseId'],
      ServiceAppointment: ['Id', 'AppointmentNumber', 'Subject', 'Status', 'AppointmentDate', 'WorkOrderId'],
      Contact: ['Id', 'FirstName', 'LastName', 'Email', 'Phone', 'AccountId'],
    };
    return fieldMap[object] || ['Id', 'Name'];
  };

  const handleTemplateApply = (template) => {
    if (template.requiresInput) {
      const value = prompt(template.inputPrompt);
      if (value) {
        setFilters(template.filters);
        setSearchTerm(value);
        handleSearch();
      }
    } else {
      setFilters(template.filters);
      handleSearch();
    }
    setShowTemplates(false);
  };

  const handleRowSelect = (index) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    const paginatedRows = results?.rows.slice((page - 1) * pageSize, page * pageSize) || [];
    if (selectedRows.size === paginatedRows.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedRows.map((_, i) => (page - 1) * pageSize + i)));
    }
  };

  const handleExportCSV = () => {
    if (!results || results.rows.length === 0) return;

    const headers = results.columns.join(',');
    const rows = results.rows.map(row => row.join(','));
    const csv = [headers, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab.object}_query_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const paginatedRows = results
    ? results.rows.slice((page - 1) * pageSize, page * pageSize)
    : [];
  const totalPages = results ? Math.ceil(results.rows.length / pageSize) : 1;

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      <DetailDrawer
        isOpen={detailDrawer.isOpen}
        onClose={() => setDetailDrawer({ isOpen: false, record: null })}
        record={detailDrawer.record}
      />

      {/* Header */}
      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <ArrowLeft size={18} className="cursor-pointer" style={{ color: 'var(--text-muted)' }} />
          <h1 className="text-xl font-bold">Query Interface</h1>
        </div>
      </div>

      {/* Object Tabs */}
      <div className="px-6 pt-4 flex gap-1">
        {OBJECT_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab);
              setFilters({});
              setSearchTerm('');
              setResults(null);
            }}
            className="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
            style={{
              borderBottomColor: activeTab.id === tab.id ? '#F5C800' : 'transparent',
              backgroundColor: activeTab.id === tab.id ? 'var(--accent-pale)' : 'transparent',
              color: activeTab.id === tab.id ? 'var(--text-main)' : 'var(--text-tertiary)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="px-6 py-4 space-y-3">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={`Search ${activeTab.label.toLowerCase()} by subject, account, or name...`}
              className="input-field pl-9 text-sm"
            />
          </div>
          <button onClick={handleSearch} disabled={loading} className="btn-primary px-4 py-2 text-sm flex items-center gap-2">
            <Search size={14} /> Search
          </button>
          <button
            onClick={() => {
              setFilters({});
              setSearchTerm('');
              handleSearch();
            }}
            className="btn-secondary px-4 py-2 text-sm flex items-center gap-2"
          >
            <RefreshCw size={14} /> Reset
          </button>
          <div className="relative">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="btn-secondary px-4 py-2 text-sm flex items-center gap-2"
            >
              <Grid3x3 size={14} /> Templates <ChevronDown size={14} />
            </button>
            {showTemplates && (
              <div className="absolute top-full right-0 mt-1 card p-2 w-64 z-10" style={{ border: '1px solid var(--border)' }}>
                {QUERY_TEMPLATES.filter(t => t.object === activeTab.object).map(t => (
                  <button
                    key={t.id}
                    onClick={() => handleTemplateApply(t)}
                    className="w-full text-left px-3 py-2 text-sm rounded hover:bg-brand-light transition-colors"
                  >
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{t.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap gap-3">
          {currentFilters.status && (
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Status</label>
              <select
                value={filters.status || 'All'}
                onChange={e => setFilters({ ...filters, status: e.target.value })}
                className="input-field text-xs py-1.5"
              >
                {currentFilters.status.map(opt => <option key={opt} value={opt === 'All' ? '' : opt}>{opt}</option>)}
              </select>
            </div>
          )}
          {currentFilters.priority && (
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Priority</label>
              <select
                value={filters.priority || 'All'}
                onChange={e => setFilters({ ...filters, priority: e.target.value })}
                className="input-field text-xs py-1.5"
              >
                {currentFilters.priority.map(opt => <option key={opt} value={opt === 'All' ? '' : opt}>{opt}</option>)}
              </select>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Date Range</label>
            <input type="date" className="input-field text-xs py-1.5" />
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="flex-1 flex flex-col overflow-hidden px-6 pb-6">
        {results && (
          <div className="card flex-1 overflow-hidden flex flex-col">
            <div className="px-4 py-2 border-b flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Query Results — Total Rows: {results.totalRows}
              </span>
              <div className="flex gap-2">
                <button onClick={handleExportCSV} className="btn-secondary px-3 py-1 text-xs flex items-center gap-1">
                  <Download size={12} /> Export CSV
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    disabled={selectedRows.size === 0}
                    className="btn-secondary px-3 py-1 text-xs flex items-center gap-1 disabled:opacity-50"
                  >
                    <MoreVertical size={12} /> Bulk Action
                  </button>
                  {showBulkActions && selectedRows.size > 0 && (
                    <div className="absolute top-full right-0 mt-1 card p-2 w-48 z-10" style={{ border: '1px solid var(--border)' }}>
                      {BULK_ACTIONS.filter(a => a.objects.includes(activeTab.object)).map(action => (
                        <button
                          key={action.id}
                          onClick={() => {
                            alert(`${action.label} on ${selectedRows.size} records`);
                            setShowBulkActions(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm rounded hover:bg-brand-light transition-colors"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              {results.rows.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center" style={{ color: 'var(--text-muted)' }}>
                  <FileText size={48} className="mb-3" />
                  <p className="text-sm font-medium mb-1">No records matched your filters</p>
                  <button onClick={() => {
                    setFilters({});
                    setSearchTerm('');
                    handleSearch();
                  }} className="text-xs font-medium" style={{ color: 'var(--color-info)' }}>
                    Reset filters
                  </button>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="sticky top-0" style={{ backgroundColor: 'var(--bg-light)' }}>
                    <tr>
                      <th className="px-4 py-2 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={selectedRows.size === paginatedRows.length && paginatedRows.length > 0}
                          onChange={handleSelectAll}
                        />
                      </th>
                      {results.columns.map((col, i) => (
                        <th key={i} className="px-4 py-2 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                          {col}
                        </th>
                      ))}
                      <th className="px-4 py-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRows.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b hover:bg-brand-light transition-colors"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <td className="px-4 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={selectedRows.has((page - 1) * pageSize + i)}
                            onChange={() => handleRowSelect((page - 1) * pageSize + i)}
                          />
                        </td>
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-2 text-xs font-mono">
                            {j === 0 ? (
                              <span className="text-brand-blue cursor-pointer hover:underline">{cell}</span>
                            ) : (
                              cell
                            )}
                          </td>
                        ))}
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => setDetailDrawer({ isOpen: true, record: Object.fromEntries(results.columns.map((c, idx) => [c, row[idx]])) })}
                            className="p-1 rounded hover:bg-brand-light"
                          >
                            <MoreVertical size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-2 border-t flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, results.rows.length)} of {results.rows.length}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-2 py-1 rounded border disabled:opacity-50"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    ←
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className="px-3 py-1 rounded text-xs"
                      style={{
                        backgroundColor: page === p ? 'var(--accent-pale)' : 'transparent',
                        color: page === p ? 'var(--text-main)' : 'var(--text-secondary)',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-2 py-1 rounded border disabled:opacity-50"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
