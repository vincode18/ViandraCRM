import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Edit, Trash2, Heart, MapPin, ExternalLink } from 'lucide-react';
import { accountById, formatCurrency, isCreditBlocked } from '../utils/accountData';
import { contactsByAccount } from '../utils/contactData';

export default function AccountDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const account = accountById(id);
  const contacts = contactsByAccount(id);
  const [expandedSections, setExpandedSections] = useState({
    core: true,
    financial: true,
    address: true,
    system: true,
  });

  if (!account) {
    return <div style={{ padding: 24 }}>Account not found</div>;
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const FieldRow = ({ label, value, link, mono }) => (
    <div style={{
      marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--border)'
    }}>
      <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 4 }}>{label}</div>
      <div style={{
        fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)',
        fontFamily: mono ? 'monospace' : 'inherit'
      }}>
        {link ? (
          <a href={link.startsWith('http') ? link : `tel:${link}`}
            style={{ color: '#1976D2', textDecoration: 'none' }}>
            {value || '—'}
          </a>
        ) : (
          value || '—'
        )}
      </div>
    </div>
  );

  const SectionCard = ({ title, children, section }) => (
    <div style={{
      backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 8, marginBottom: 16, overflow: 'hidden'
    }}>
      <button
        onClick={() => toggleSection(section)}
        style={{
          width: '100%', padding: 16, display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', backgroundColor: 'transparent', border: 'none',
          cursor: 'pointer', borderBottom: expandedSections[section] ? '1px solid var(--border)' : 'none'
        }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>{title}</h3>
        {expandedSections[section] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {expandedSections[section] && (
        <div style={{ padding: 16 }}>
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-base)' }}>
      {/* Header */}
      <div style={{
        padding: '24px', borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--bg-panel)'
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Account
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12 }}>
          {account.name}
        </h1>
        <div style={{
          display: 'flex', gap: 8, marginBottom: 16, fontSize: 14, color: 'var(--text-secondary)'
        }}>
          <span><strong>Phone:</strong> {account.phone}</span>
          <span><strong>SAP ID:</strong> {account.sapAccountId}</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button style={{
            padding: '10px 16px', borderRadius: 4, backgroundColor: 'var(--bg-light)',
            border: '1px solid var(--border)', color: 'var(--text-secondary)',
            cursor: 'pointer', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6
          }}>
            <Heart size={14} /> Follow
          </button>
          <button
            onClick={() => navigate(`/accounts/${id}/edit`)}
            style={{
              padding: '10px 16px', borderRadius: 4, backgroundColor: 'var(--bg-light)',
              border: '1px solid var(--border)', color: 'var(--text-secondary)',
              cursor: 'pointer', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6
            }}>
            <Edit size={14} /> Edit
          </button>
          <button style={{
            padding: '10px 16px', borderRadius: 4, backgroundColor: 'var(--accent)',
            border: 'none', color: '#1A1A1A', cursor: 'pointer', fontSize: 13, fontWeight: 600
          }}>
            Submit for Approval
          </button>
          <button style={{
            padding: '10px 16px', borderRadius: 4, backgroundColor: 'var(--bg-light)',
            border: '1px solid var(--border)', color: 'var(--text-secondary)',
            cursor: 'pointer', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6
          }}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Main Column */}
        <div>
          {/* Credit Block Warning */}
          {isCreditBlocked(account) && (
            <div style={{
              padding: 12, borderRadius: 8, backgroundColor: '#FFEBEE',
              border: '1px solid #C62828', marginBottom: 16, color: '#C62828', fontSize: 13
            }}>
              ⚠ <strong>Credit Block Active:</strong> This account cannot create new Work Orders until cleared by Finance.
            </div>
          )}

          {/* Core Information (No collapse header) */}
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16 }}>Core Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FieldRow label="Account Name" value={account.name} />
              <FieldRow label="Phone" value={account.phone} link={account.phone} />
              <FieldRow label="Fax" value={account.fax} />
              <FieldRow label="Website" value={account.website} link={account.website} />
              <FieldRow label="Industry" value={account.industry} />
              <FieldRow label="Type" value={account.type} />
              <FieldRow label="Customer Clustering" value={account.customerClustering} />
              <FieldRow label="Customer Support Type" value={account.customerSupportType} />
              <FieldRow label="Sales Organisation" value={account.salesOrganisation} />
              <FieldRow label="Account Status" value={account.status} />
              <FieldRow label="Account Owner" value={account.accountOwner.name} />
              <FieldRow label="Annual Revenue" value={formatCurrency(account.annualRevenue)} />
            </div>
          </div>

          {/* Financial Information */}
          <SectionCard title="Financial Information" section="financial">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FieldRow label="Remain Credit Limit" value={formatCurrency(account.remainCreditLimit)} />
              <FieldRow label="Credit Limit as of Date" value={account.creditLimitAsOfDate} />
              <FieldRow label="Credit Limit Block" value={account.creditLimitBlock ? 'Yes' : 'No'} />
              <FieldRow label="AR Limit Block" value={account.arLimitBlock ? 'Yes' : 'No'} />
              <FieldRow label="Financial Support" value={account.financialSupport} />
              <FieldRow label="Financial Support Expiry" value={account.financialSupportExpiryDate} />
            </div>
          </SectionCard>

          {/* Address Information */}
          <SectionCard title="Address Information" section="address">
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Billing Address</h4>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {account.billingStreet}<br />
                {account.billingCity}, {account.billingState} {account.billingPostalCode}<br />
                {account.billingCountry}
              </div>
              <div style={{ marginTop: 12, width: 230, height: 120, borderRadius: 4, border: '1px solid var(--border)', overflow: 'hidden' }}>
                <iframe
                  width="100%" height="100%"
                  style={{ border: 'none' }}
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDummyKey&q=${encodeURIComponent(account.billingStreet + ' ' + account.billingCity)}`}
                />
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Shipping Address</h4>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {account.shippingStreet}<br />
                {account.shippingCity}, {account.shippingState} {account.shippingPostalCode}<br />
                {account.shippingCountry}
              </div>
            </div>
          </SectionCard>

          {/* System Information */}
          <SectionCard title="System Information" section="system">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FieldRow label="Created By" value={`${account.createdBy.name} - ${new Date(account.createdDate).toLocaleString()}`} />
              <FieldRow label="Last Modified By" value={`${account.lastModifiedBy.name} - ${new Date(account.lastModifiedDate).toLocaleString()}`} />
              <FieldRow label="SAP Account Id" value={account.sapAccountId} mono />
            </div>
          </SectionCard>
        </div>

        {/* Sidebar */}
        <div>
          {/* Duplicate Alert */}
          <div style={{
            padding: 12, borderRadius: 8, backgroundColor: '#FFF3E0',
            border: '1px solid #F57C00', marginBottom: 16, fontSize: 12, color: '#F57C00'
          }}>
            ⚠ We found no potential duplicates of this Account.
          </div>

          {/* Related Lists Quick Links */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16
          }}>
            <a href="#" style={{ fontSize: 12, color: '#1976D2', textDecoration: 'none' }}>Cases (8)</a>
            <a href="#" style={{ fontSize: 12, color: '#1976D2', textDecoration: 'none' }}>Related Contacts (3)</a>
            <a href="#" style={{ fontSize: 12, color: '#1976D2', textDecoration: 'none' }}>Work Orders (12)</a>
            <a href="#" style={{ fontSize: 12, color: '#1976D2', textDecoration: 'none' }}>Opportunities (2)</a>
            <a href="#" style={{ fontSize: 12, color: '#1976D2', textDecoration: 'none' }}>Contracts (1)</a>
            <a href="#" style={{ fontSize: 12, color: '#1976D2', textDecoration: 'none' }}>Files (5)</a>
          </div>

          {/* Cases Card */}
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 16, overflow: 'hidden' }}>
            <div style={{ padding: 12, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>Cases (8)</h4>
              <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div style={{ padding: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
              <div style={{ marginBottom: 8 }}>
                <a href="#" style={{ fontWeight: 600, color: '#1976D2', textDecoration: 'none' }}>00016452</a>
                <div>Status: Open</div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>07/06/2026 09:28</div>
              </div>
            </div>
            <div style={{ padding: 12, borderTop: '1px solid var(--border)', fontSize: 12 }}>
              <a href="#" style={{ color: '#1976D2', textDecoration: 'none' }}>View All</a>
            </div>
          </div>

          {/* Related Contacts Card */}
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 16, overflow: 'hidden' }}>
            <div style={{ padding: 12, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>Related Contacts ({contacts.length})</h4>
              <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div style={{ padding: 12 }}>
              {contacts.map((contact, i) => (
                <div key={i} style={{ marginBottom: i < contacts.length - 1 ? 12 : 0, paddingBottom: i < contacts.length - 1 ? 12 : 0, borderBottom: i < contacts.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <a href={`/contacts/${contact.id}`}
                    style={{ fontSize: 12, fontWeight: 600, color: '#1976D2', textDecoration: 'none', display: 'block', marginBottom: 4 }}>
                    {contact.firstName} {contact.lastName}
                  </a>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                    {contact.title} {contact.isActive ? '✓' : '(Inactive)'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
