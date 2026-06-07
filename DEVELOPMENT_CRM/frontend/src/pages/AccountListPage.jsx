import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Edit, Trash2, Filter } from 'lucide-react';
import { SAMPLE_ACCOUNTS, ACCOUNT_STATUSES, INDUSTRIES, ACCOUNT_TYPES, formatCurrency } from '../utils/accountData';

export default function AccountListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [industryFilter, setIndustryFilter] = useState('All');

  const filteredAccounts = useMemo(() => {
    return SAMPLE_ACCOUNTS.filter(acc => {
      const matchSearch = !search ||
        acc.name.toLowerCase().includes(search.toLowerCase()) ||
        acc.accountNumber.includes(search);
      const matchStatus = statusFilter === 'All' || acc.status === statusFilter;
      const matchIndustry = industryFilter === 'All' || acc.industry === industryFilter;
      return matchSearch && matchStatus && matchIndustry;
    });
  }, [search, statusFilter, industryFilter]);

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Header */}
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-panel)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)' }}>Accounts</h1>
          <button
            onClick={() => navigate('/accounts/new')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '11px 16px',
              backgroundColor: 'var(--accent)', color: '#1A1A1A', border: 'none',
              borderRadius: 4, cursor: 'pointer', fontSize: '14px', fontWeight: 600
            }}>
            <Plus size={16} /> New Account
          </button>
        </div>

        {/* Search & Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12 }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} />
            <input
              type="text" placeholder="Search accounts..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                border: '1px solid var(--border)', borderRadius: 4,
                backgroundColor: 'var(--bg-base)', color: 'var(--text-secondary)',
                fontSize: 14
              }}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 4,
              backgroundColor: 'var(--bg-base)', color: 'var(--text-secondary)', fontSize: 14
            }}>
            <option>All Statuses</option>
            {ACCOUNT_STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>

          {/* Industry Filter */}
          <select
            value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)}
            style={{
              padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 4,
              backgroundColor: 'var(--bg-base)', color: 'var(--text-secondary)', fontSize: 14
            }}>
            <option>All Industries</option>
            {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
          </select>

          <button style={{
            padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 4,
            backgroundColor: 'var(--bg-light)', color: 'var(--text-secondary)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4
          }}>
            <Filter size={14} /> More
          </button>
        </div>
      </div>

      {/* Results */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16
        }}>
          {filteredAccounts.length > 0 ? (
            filteredAccounts.map(acc => (
              <div
                key={acc.id}
                style={{
                  padding: 16, borderRadius: 8, border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-card)', cursor: 'pointer',
                  transition: 'box-shadow 150ms', boxShadow: '0 0 0 0px rgba(0,0,0,0)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 0 0px rgba(0,0,0,0)'}
                onClick={() => navigate(`/accounts/${acc.id}`)}>
                {/* Header */}
                <div style={{ marginBottom: 12 }}>
                  <h3 style={{
                    fontSize: 14, fontWeight: 600, color: 'var(--text-main)',
                    marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {acc.name}
                  </h3>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{
                      fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 3,
                      backgroundColor: acc.status === 'Active' ? 'rgba(56,142,60,0.12)' : 'rgba(117,117,117,0.12)',
                      color: acc.status === 'Active' ? '#388E3C' : '#757575'
                    }}>
                      {acc.status}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                      {acc.type}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--text-secondary)', space: 4 }}>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>Phone: </span>
                    {acc.phone}
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>Industry: </span>
                    {acc.industry}
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>Owner: </span>
                    {acc.accountOwner.name}
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-tertiary)' }}>Credit Limit: </span>
                    <span style={{ color: acc.remainCreditLimit < 0 ? '#C62828' : 'var(--text-secondary)', fontWeight: 500 }}>
                      {formatCurrency(acc.remainCreditLimit)}
                    </span>
                  </div>
                </div>

                {/* Credit Block Warning */}
                {acc.creditLimitBlock && (
                  <div style={{
                    padding: 8, borderRadius: 4, backgroundColor: '#FFEBEE',
                    border: '1px solid #C62828', marginBottom: 12, fontSize: 11, color: '#C62828'
                  }}>
                    ⚠ Credit block active
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/accounts/${acc.id}`); }}
                    style={{
                      flex: 1, padding: '8px 12px', borderRadius: 4,
                      backgroundColor: 'var(--accent)', color: '#1A1A1A',
                      border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600
                    }}>
                    View
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/accounts/${acc.id}/edit`); }}
                    style={{
                      flex: 1, padding: '8px 12px', borderRadius: 4,
                      backgroundColor: 'var(--bg-light)', color: 'var(--text-secondary)',
                      border: '1px solid var(--border)', cursor: 'pointer', fontSize: 12
                    }}>
                    Edit
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              gridColumn: '1 / -1', textAlign: 'center', padding: 48,
              color: 'var(--text-muted)'
            }}>
              <p style={{ fontSize: 14, marginBottom: 8 }}>No accounts found</p>
              <p style={{ fontSize: 12 }}>Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
