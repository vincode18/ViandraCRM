/* ─────────────────────────────────────────────────────────────────────────
   Query Console Page (PRD-01)
   Raw SQL editor for developers/admins with SOQL/SOSL/DML support
   ───────────────────────────────────────────────────────────────────────── */

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Trash2, Copy, Download, Database, X, ChevronDown, Search } from 'lucide-react';
import { executeQuery, getSchemaMetadata, logQueryExecution } from '../services/queryConsoleService';
import { useAuth } from '../contexts/AuthContext';

const QUERY_MODES = ['SOQL', 'SOSL', 'DML'];

const PLACEHOLDERS = {
  SOQL: 'SELECT Id, Name, Status__c FROM Case WHERE Status__c = \'Open\' LIMIT 20',
  SOSL: 'FIND {Grand Hotels} IN ALL FIELDS RETURNING Account(Id, Name), Contact(FirstName, LastName)',
  DML: 'UPDATE Case SET Status__c = \'Closed\' WHERE Id = \'500xx000001234\'',
};

function SchemaBrowser({ isOpen, onClose, onInsertField }) {
  const [schema, setSchema] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedObject, setSelectedObject] = useState(null);

  useEffect(() => {
    if (isOpen) {
      getSchemaMetadata().then(data => setSchema(data.objects));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredObjects = schema?.filter(obj =>
    obj.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="fixed inset-0 z-50" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="absolute right-0 top-0 h-full w-[400px] card overflow-hidden flex flex-col"
        style={{ animation: 'slideInRight 0.25s ease-out' }}>
        <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <span className="font-bold flex items-center gap-2">
            <Database size={18} style={{ color: 'var(--accent)' }} />
            Schema Browser
          </span>
          <button onClick={onClose} className="p-1 rounded hover:bg-brand-light">
            <X size={18} />
          </button>
        </div>
        <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search objects..."
              className="input-field pl-9 text-sm"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredObjects.map(obj => (
            <div key={obj.name} className="border-b" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={() => setSelectedObject(selectedObject === obj.name ? null : obj.name)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-brand-light transition-colors"
              >
                <span className="font-medium text-sm">{obj.name}</span>
                <ChevronDown size={14} style={{ transform: selectedObject === obj.name ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }} />
              </button>
              {selectedObject === obj.name && (
                <div className="px-4 pb-3">
                  <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                    Fields:
                  </div>
                  {obj.fields.map(field => (
                    <button
                      key={field.name}
                      onClick={() => onInsertField(field.name)}
                      className="w-full text-left px-2 py-1 text-xs rounded hover:bg-brand-light mb-1 flex items-center justify-between"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <span>{field.name}</span>
                      <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{field.type}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function QueryConsolePage() {
  const { user } = useAuth();
  const [queryMode, setQueryMode] = useState(() => localStorage.getItem('queryConsoleMode') || 'SOQL');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showSchema, setShowSchema] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const editorRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('queryConsoleMode', queryMode);
  }, [queryMode]);

  const handleExecute = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await executeQuery(query, queryMode);

      if (response.success) {
        setResults(response.data);
        setHistory(prev => [{ query, mode: queryMode, timestamp: new Date() }, ...prev].slice(0, 20));
        await logQueryExecution({
          userId: user?.id,
          userEmail: user?.email,
          mode: queryMode,
          query,
          rowsAffected: response.data.totalRows,
          executionTimeMs: response.data.executionTimeMs,
        });
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleExecute();
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = query.substring(0, start) + '  ' + query.substring(end);
      setQuery(newValue);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleLoadHistory = (item) => {
    setQuery(item.query);
    setQueryMode(item.mode);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleInsertField = (fieldName) => {
    if (editorRef.current) {
      const start = editorRef.current.selectionStart;
      const end = editorRef.current.selectionEnd;
      const newValue = query.substring(0, start) + fieldName + query.substring(end);
      setQuery(newValue);
      setTimeout(() => {
        editorRef.current.selectionStart = editorRef.current.selectionEnd = start + fieldName.length;
        editorRef.current.focus();
      }, 0);
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
    a.download = `query_results_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!results || results.rows.length === 0) return;

    const headers = results.columns.join('\t');
    const rows = results.rows.map(row => row.join('\t'));
    const text = [headers, ...rows].join('\n');

    navigator.clipboard.writeText(text);
  };

  const paginatedRows = results
    ? results.rows.slice((page - 1) * pageSize, page * pageSize)
    : [];
  const totalPages = results ? Math.ceil(results.rows.length / pageSize) : 1;

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      <SchemaBrowser
        isOpen={showSchema}
        onClose={() => setShowSchema(false)}
        onInsertField={handleInsertField}
      />

      {/* Header */}
      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ArrowLeft size={18} className="cursor-pointer" style={{ color: 'var(--text-muted)' }} />
            <h1 className="text-xl font-bold">Query Console</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSchema(true)}
              className="btn-secondary px-3 py-2 text-sm flex items-center gap-2"
            >
              <Database size={16} /> Schema
            </button>
          </div>
        </div>
      </div>

      {/* Query Mode Tabs */}
      <div className="px-6 pt-4 flex gap-1">
        {QUERY_MODES.map(mode => (
          <button
            key={mode}
            onClick={() => {
              setQueryMode(mode);
              setQuery('');
              setResults(null);
              setError(null);
            }}
            className="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
            style={{
              borderBottomColor: queryMode === mode ? '#F5C800' : 'transparent',
              backgroundColor: queryMode === mode ? 'var(--accent-pale)' : 'transparent',
              color: queryMode === mode ? 'var(--text-main)' : 'var(--text-tertiary)',
            }}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-6 px-6 pb-6 overflow-hidden">
        {/* Left Panel - Editor & Results */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Query Editor */}
          <div className="mb-4">
            <div className="card p-0 overflow-hidden">
              <textarea
                ref={editorRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={PLACEHOLDERS[queryMode]}
                className="w-full h-40 p-4 font-mono text-sm resize-none focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                }}
                maxLength={10000}
              />
              <div className="px-4 py-2 border-t flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {query.length} / 10,000 characters
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setQuery('');
                      setResults(null);
                      setError(null);
                    }}
                    className="btn-secondary px-3 py-1.5 text-xs flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Clear
                  </button>
                  <button
                    onClick={handleExecute}
                    disabled={loading || !query.trim()}
                    className="btn-primary px-4 py-1.5 text-xs flex items-center gap-1 disabled:opacity-50"
                  >
                    <Play size={14} /> Run
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          {error && (
            <div className="mb-4 px-4 py-2 rounded text-sm" style={{ backgroundColor: '#FFEBEE', color: '#C62828', border: '1px solid #C62828' }}>
              Error: {error}
            </div>
          )}
          {results && (
            <div className="mb-4 px-4 py-2 rounded text-sm flex justify-between" style={{ backgroundColor: 'var(--bg-panel)' }}>
              <span>Executed in {results.executionTimeMs}ms</span>
              <span>Total Rows: {results.totalRows}</span>
            </div>
          )}

          {/* Results Grid */}
          {results && (
            <div className="flex-1 card overflow-hidden flex flex-col">
              <div className="px-4 py-2 border-b flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Query Results — Total Rows: {results.totalRows}
                </span>
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="btn-secondary px-3 py-1 text-xs flex items-center gap-1">
                    <Copy size={12} /> Copy
                  </button>
                  <button onClick={handleExportCSV} className="btn-secondary px-3 py-1 text-xs flex items-center gap-1">
                    <Download size={12} /> Export CSV
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                {results.rows.length === 0 ? (
                  <div className="h-full flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
                    No records matched your query.
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="sticky top-0" style={{ backgroundColor: 'var(--bg-light)' }}>
                      <tr>
                        {results.columns.map((col, i) => (
                          <th key={i} className="px-4 py-2 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRows.map((row, i) => (
                        <tr key={i} className="border-b" style={{ borderColor: 'var(--border)' }}>
                          {row.map((cell, j) => (
                            <td key={j} className="px-4 py-2 font-mono text-xs">
                              {cell}
                            </td>
                          ))}
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

        {/* Right Panel - History */}
        <div className="w-72 flex-shrink-0">
          <div className="card h-full overflow-hidden flex flex-col">
            <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                History
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {history.length === 0 ? (
                <div className="p-4 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                  No queries executed yet
                </div>
              ) : (
                history.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleLoadHistory(item)}
                    className="w-full px-4 py-3 text-left border-b hover:bg-brand-light transition-colors"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--accent-pale)', color: 'var(--accent)' }}>
                        {item.mode}
                      </span>
                      <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-xs font-mono line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                      {item.query.substring(0, 60)}
                      {item.query.length > 60 && '...'}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
