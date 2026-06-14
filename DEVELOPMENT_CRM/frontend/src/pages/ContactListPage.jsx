import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Mail, Phone, MessageCircle } from 'lucide-react';
import { SAMPLE_CONTACTS, getFullName, getCommunicationChannels } from '../utils/contactData';

export default function ContactListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredContacts = useMemo(() => {
    return SAMPLE_CONTACTS.filter(contact => {
      const fullName = getFullName(contact);
      const matchSearch = !search ||
        fullName.toLowerCase().includes(search.toLowerCase()) ||
        contact.accountName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' ||
        (statusFilter === 'Active' && contact.isActive) ||
        (statusFilter === 'Inactive' && !contact.isActive);
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Header */}
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-panel)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)' }}>Contacts</h1>
          <button
            onClick={() => navigate('/contacts/new')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '11px 16px',
              backgroundColor: 'var(--accent)', color: '#1A1A1A', border: 'none',
              borderRadius: 4, cursor: 'pointer', fontSize: '14px', fontWeight: 600
            }}>
            <Plus size={16} /> New Contact
          </button>
        </div>

        {/* Search & Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} />
            <input
              type="text" placeholder="Search contacts..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                border: '1px solid var(--border)', borderRadius: 4,
                backgroundColor: 'var(--bg-base)', color: 'var(--text-secondary)',
                fontSize: 14
              }}
            />
          </div>
          <select
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 4,
              backgroundColor: 'var(--bg-base)', color: 'var(--text-secondary)', fontSize: 14
            }}>
            <option>All Statuses</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {filteredContacts.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '12px', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '12px', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account</th>
                <th style={{ textAlign: 'left', padding: '12px', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</th>
                <th style={{ textAlign: 'left', padding: '12px', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Channels</th>
                <th style={{ textAlign: 'left', padding: '12px', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '12px', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact, i) => (
                <tr key={i} style={{
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'background-color 150ms',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-pale)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => navigate(`/contacts/${contact.id}`)}>
                  <td style={{ padding: '12px', fontSize: 13, color: 'var(--text-main)', fontWeight: 500 }}>
                    {getFullName(contact)}
                    {!contact.isActive && (
                      <span style={{
                        marginLeft: 8, fontSize: 10, padding: '2px 6px', borderRadius: 2,
                        backgroundColor: 'var(--bg-lighter)', color: 'var(--text-muted)'
                      }}>
                        Inactive
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px', fontSize: 13, color: '#1976D2' }}>
                    {contact.accountName}
                  </td>
                  <td style={{ padding: '12px', fontSize: 13, color: 'var(--text-secondary)' }}>
                    {contact.title}
                  </td>
                  <td style={{ padding: '12px', fontSize: 12, color: 'var(--text-tertiary)' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {contact.activeEmail && <Mail size={14} style={{ color: '#1976D2' }} />}
                      {contact.haveWhatsApp && <MessageCircle size={14} style={{ color: '#1976D2' }} />}
                      <Phone size={14} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  </td>
                  <td style={{ padding: '12px', fontSize: 12 }}>
                    <span style={{
                      padding: '3px 8px', borderRadius: 3, backgroundColor: 'var(--accent-pale)',
                      color: 'var(--accent-dark)', fontWeight: 500
                    }}>
                      {contact.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/contacts/${contact.id}`); }}
                      style={{
                        padding: '6px 12px', borderRadius: 4, backgroundColor: 'var(--accent)',
                        color: '#1A1A1A', border: 'none', cursor: 'pointer',
                        fontSize: 12, fontWeight: 600
                      }}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{
            textAlign: 'center', padding: 48,
            color: 'var(--text-muted)'
          }}>
            <p style={{ fontSize: 14, marginBottom: 8 }}>No contacts found</p>
            <p style={{ fontSize: 12 }}>Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
