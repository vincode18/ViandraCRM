import React, { useState, useRef, useEffect, useCallback } from 'react';
import api from '../utils/api';

export default function SearchableSelect({
  label,
  placeholder = 'Search...',
  endpoint,
  value,
  onChange,
  onClear,
  disabled = false,
  required = false,
  error = '',
  dependentValue = null,
  maxResults = 10,
  debounceMs = 300,
  renderOption = null,
  renderValue = null,
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [total, setTotal] = useState(0);

  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const debounceTimer = useRef(null);
  const mouseDownOnDropdown = useRef(false);

  // Debounced search
  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim() && !dependentValue) {
      setResults([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        query: searchQuery,
        limit: maxResults,
        offset: 0,
      });

      // Add dependent filter if provided (e.g., accountId)
      if (dependentValue) {
        params.append('accountId', dependentValue);
      }

      const res = await api.get(`${endpoint}?${params}`);
      const { results: items = [], total: count = 0 } = res.data?.data || {};
      setResults(items);
      setTotal(count);
      setHighlightedIndex(-1);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [endpoint, dependentValue, maxResults]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setHighlightedIndex(-1);
    setOpen(true);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => performSearch(val), debounceMs);
  };

  const handleSelect = (item) => {
    mouseDownOnDropdown.current = false;
    onChange(item);
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setQuery('');
    setResults([]);
    setOpen(false);
    onClear?.();
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(i => Math.min(i + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && results[highlightedIndex]) {
          handleSelect(results[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
      default:
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear dependent fields when dependent value is cleared
  useEffect(() => {
    if (dependentValue === null || dependentValue === undefined) {
      setQuery('');
      setResults([]);
      setOpen(false);
    }
  }, [dependentValue]);

  const defaultRenderOption = (item) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontWeight: 500 }}>{item.name || item.title || 'Unknown'}</span>
      <span style={{ fontSize: 12, color: '#999' }}>
        {item.email || item.model || item.type || ''}
      </span>
    </div>
  );

  const defaultRenderValue = (item) => item.name || item.title || 'Unknown';

  return (
    <div ref={containerRef} style={{ position: 'relative', marginBottom: 16 }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 8,
          color: '#1A1A1A',
        }}>
          {label}
          {required && <span style={{ color: '#C0392B' }}> *</span>}
        </label>
      )}

      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        {value ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            border: '1px solid #E4E4E4',
            borderRadius: 10,
            background: '#F7F7F5',
            flex: 1,
            minHeight: 48,
          }}>
            <span style={{ flex: 1, color: '#1A1A1A', fontSize: 14 }}>
              {renderValue ? renderValue(value) : defaultRenderValue(value)}
            </span>
            <button
              type="button"
              onClick={handleClear}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#999',
                fontSize: 18,
                padding: 0,
              }}
              aria-label="Clear selection"
            >
              ✕
            </button>
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (query || results.length > 0) setOpen(true); }}
            disabled={disabled}
            style={{
              flex: 1,
              padding: '12px 14px',
              border: `1px solid ${error ? '#C0392B' : open ? '#0070D2' : '#E4E4E4'}`,
              borderRadius: 10,
              fontSize: 14,
              fontFamily: 'inherit',
              background: disabled ? '#F0F0F0' : '#fff',
              color: '#1A1A1A',
              cursor: disabled ? 'not-allowed' : 'text',
              outline: 'none',
              transition: 'border-color 0.15s',
              boxShadow: open && !error ? '0 0 0 3px rgba(0,112,210,.12)' : error ? '0 0 0 3px rgba(192,57,43,.15)' : 'none',
            }}
            onBlur={() => {
              if (!mouseDownOnDropdown.current) setOpen(false);
            }}
            aria-label={label}
            aria-invalid={!!error}
            aria-describedby={error ? `${label}-error` : undefined}
          />
        )}

        {loading && (
          <div style={{
            position: 'absolute',
            right: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            animation: 'spin 1s linear infinite',
          }}>
            ⟳
          </div>
        )}
      </div>

      {error && (
        <p
          id={`${label}-error`}
          style={{
            color: '#C0392B',
            fontSize: 12,
            marginTop: 6,
            margin: 0,
          }}
        >
          {error}
        </p>
      )}

      {open && !value && (loading || query || results.length > 0) && (
        <div
          onMouseDown={() => { mouseDownOnDropdown.current = true; }}
          onMouseUp={() => { mouseDownOnDropdown.current = false; }}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            background: '#fff',
            border: '1px solid #E4E4E4',
            borderRadius: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,.12)',
            zIndex: 1000,
            maxHeight: 320,
            overflowY: 'auto',
          }}>
          {loading && (
            <div style={{
              padding: '14px',
              textAlign: 'center',
              color: '#999',
              fontSize: 13,
            }}>
              Searching...
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              {results.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  style={{
                    padding: '12px 14px',
                    cursor: 'pointer',
                    background: idx === highlightedIndex ? '#F7F7F5' : '#fff',
                    borderBottom: '1px solid #F0F0F0',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                >
                  {renderOption ? renderOption(item) : defaultRenderOption(item)}
                </div>
              ))}
              {total > maxResults && (
                <div style={{
                  padding: '10px 14px',
                  fontSize: 12,
                  color: '#999',
                  textAlign: 'center',
                  borderTop: '1px solid #F0F0F0',
                }}>
                  Showing {results.length} of {total} results
                </div>
              )}
            </>
          )}

          {!loading && results.length === 0 && query && (
            <div style={{
              padding: '14px',
              textAlign: 'center',
              color: '#999',
              fontSize: 13,
            }}>
              No results found
            </div>
          )}
        </div>
      )}


      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
