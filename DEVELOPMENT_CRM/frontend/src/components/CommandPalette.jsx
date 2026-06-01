import React, { useState, useRef, useEffect, useCallback } from 'react';
import api from '../utils/api';

/**
 * Command Palette for global search of Accounts, Contacts, and Assets.
 * Triggered by Ctrl+K (Windows/Linux) or Cmd+K (Mac).
 * Results can be selected to populate form fields.
 */
export default function CommandPalette({ onSelectAccount, onSelectContact, onSelectAsset }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [searchMode, setSearchMode] = useState('all'); // 'all', 'account', 'contact', 'asset'

  const inputRef = useRef(null);
  const debounceTimer = useRef(null);

  // Register Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
        setQuery('');
        setResults([]);
        setHighlightedIndex(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when palette opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Debounced search
  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        query: searchQuery,
        limit: 8,
        offset: 0,
      });

      let allResults = [];

      // Search based on mode
      if (searchMode === 'all' || searchMode === 'account') {
        try {
          const res = await api.get(`/search/accounts?${params}`);
          const items = res.data?.data?.results || [];
          allResults.push(...items.map(item => ({ ...item, type: 'account' })));
        } catch (err) {
          console.error('Account search error:', err);
        }
      }

      if (searchMode === 'all' || searchMode === 'contact') {
        try {
          const res = await api.get(`/search/contacts?${params}`);
          const items = res.data?.data?.results || [];
          allResults.push(...items.map(item => ({ ...item, type: 'contact' })));
        } catch (err) {
          console.error('Contact search error:', err);
        }
      }

      if (searchMode === 'all' || searchMode === 'asset') {
        try {
          const res = await api.get(`/search/assets?${params}`);
          const items = res.data?.data?.results || [];
          allResults.push(...items.map(item => ({ ...item, type: 'asset' })));
        } catch (err) {
          console.error('Asset search error:', err);
        }
      }

      setResults(allResults);
      setHighlightedIndex(-1);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchMode]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      performSearch(val);
    }, 200);
  };

  const handleSelect = (item) => {
    if (item.type === 'account') {
      onSelectAccount?.(item);
    } else if (item.type === 'contact') {
      onSelectContact?.(item);
    } else if (item.type === 'asset') {
      onSelectAsset?.(item);
    }
    setOpen(false);
    setQuery('');
    setResults([]);
  };

  const handleKeyDown = (e) => {
    if (!open) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(i => (i < results.length - 1 ? i + 1 : i));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(i => (i > 0 ? i - 1 : -1));
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

  if (!open) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 9998,
        }}
        onClick={() => setOpen(false)}
      />

      {/* Palette Container */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 600,
          maxHeight: '70vh',
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Search Input */}
        <div style={{ padding: '16px', borderBottom: '1px solid #E4E4E4' }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%',
              padding: '12px 14px',
              fontSize: 15,
              border: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              color: '#1A1A1A',
            }}
          />
        </div>

        {/* Mode Selector */}
        <div style={{
          display: 'flex',
          gap: 8,
          padding: '8px 16px',
          borderBottom: '1px solid #F0F0F0',
          background: '#F7F7F5',
        }}>
          {[
            { value: 'all', label: '🔍 All' },
            { value: 'account', label: '🏢 Accounts' },
            { value: 'contact', label: '👥 Contacts' },
            { value: 'asset', label: '📦 Assets' },
          ].map(mode => (
            <button
              key={mode.value}
              onClick={() => {
                setSearchMode(mode.value);
                setResults([]);
                setHighlightedIndex(-1);
                if (query) performSearch(query);
              }}
              style={{
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 500,
                border: searchMode === mode.value ? '1px solid #0070D2' : '1px solid #E4E4E4',
                borderRadius: 6,
                background: searchMode === mode.value ? '#E8F1FF' : '#fff',
                color: searchMode === mode.value ? '#0070D2' : '#666',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 0',
        }}>
          {loading && (
            <div style={{
              padding: '20px',
              textAlign: 'center',
              color: '#999',
              fontSize: 13,
            }}>
              Searching...
            </div>
          )}

          {!loading && results.length === 0 && query && (
            <div style={{
              padding: '20px',
              textAlign: 'center',
              color: '#999',
              fontSize: 13,
            }}>
              No results found
            </div>
          )}

          {!loading && results.length === 0 && !query && (
            <div style={{
              padding: '20px',
              color: '#999',
              fontSize: 13,
            }}>
              <div style={{ marginBottom: 12, fontWeight: 600, color: '#666' }}>Suggestions</div>
              <div style={{ fontSize: 12, lineHeight: 1.6 }}>
                • Type to search accounts, contacts, or assets<br />
                • Use arrow keys to navigate<br />
                • Press Enter to select<br />
                • Press Esc to close<br />
              </div>
            </div>
          )}

          {results.map((item, idx) => (
            <div
              key={`${item.type}-${item.id}`}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setHighlightedIndex(idx)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                background: idx === highlightedIndex ? '#F7F7F5' : '#fff',
                borderLeft: idx === highlightedIndex ? '3px solid #0070D2' : '3px solid transparent',
                transition: 'all 0.1s',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              {/* Icon */}
              <span style={{ fontSize: 16, minWidth: 20 }}>
                {item.type === 'account' && '🏢'}
                {item.type === 'contact' && '👤'}
                {item.type === 'asset' && '📦'}
              </span>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#1A1A1A',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {item.name || item.title}
                </div>
                <div style={{
                  fontSize: 12,
                  color: '#999',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {item.type === 'account' && `${item.type} • ${item.city}`}
                  {item.type === 'contact' && `${item.email}`}
                  {item.type === 'asset' && `${item.model} • ${item.status}`}
                </div>
              </div>

              {/* Type Badge */}
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 4,
                background: item.type === 'account' ? '#E8F1FF' : item.type === 'contact' ? '#F0E8FF' : '#E8FFF0',
                color: item.type === 'account' ? '#0070D2' : item.type === 'contact' ? '#6B21A8' : '#0B7F3D',
              }}>
                {item.type}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '8px 16px',
          borderTop: '1px solid #F0F0F0',
          background: '#F7F7F5',
          fontSize: 11,
          color: '#999',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <span>↑↓ Navigate • ↵ Select • Esc Close</span>
          <span>⌘K to toggle</span>
        </div>
      </div>
    </>
  );
}
