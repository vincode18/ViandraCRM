import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Edit, Trash2, Heart, Heart as HeartFilled, Mail, Phone, MessageCircle, Check, AlertTriangle } from 'lucide-react';
import { contactById, getFullName, getCommunicationChannels } from '../utils/contactData';
import { accountById } from '../utils/accountData';

export default function ContactDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const contact = contactById(id);
  const account = contact ? accountById(contact.accountId) : null;
  const [expandedSections, setExpandedSections] = useState({
    address: true,
    management: true,
    system: true,
  });
  const [isFollowing, setIsFollowing] = useState(false);

  if (!contact) {
    return <div style={{ padding: 24 }}>Contact not found</div>;
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const FieldRow = ({ label, value, link, mono, highlight }) => (
    <div style={{
      marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--border)',
      display: 'grid', gridTemplateColumns: '1fr 1fr'
    }}>
      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{label}</div>
      <div style={{
        fontSize: 13, fontWeight: 500, color: highlight ? 'var(--accent-dark)' : 'var(--text-secondary)',
        fontFamily: mono ? 'monospace' : 'inherit'
      }}>
        {link ? (
          <a href={link.startsWith('http') || link.startsWith('mailto') ? link : `tel:${link}`}
            style={{ color: '#1976D2', textDecoration: 'none' }}>
            {value || '—'}
          </a>
        ) : (
          value || '—'
        )}
      </div>
    </div>
  );

  const CheckboxField = ({ label, checked }) => (
    <div style={{
      marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--border)',
      display: 'grid', gridTemplateColumns: '1fr auto'
    }}>
      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{label}</div>
      <div style={{
        width: 16, height: 16, borderRadius: 2, border: '1px solid var(--border)',
        backgroundColor: checked ? 'var(--accent)' : 'var(--bg-base)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {checked && <Check size={12} style={{ color: '#1A1A1A' }} />}
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
        <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{title}</h3>
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
          Contact
        </div>
        <h1 style={{
          fontSize: 28, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12,
          opacity: !contact.isActive ? 0.6 : 1
        }}>
          {getFullName(contact)}
        </h1>
        <div style={{
          display: 'flex', gap: 12, marginBottom: 16, fontSize: 13, color: 'var(--text-secondary)', flexWrap: 'wrap'
        }}>
          <span><strong>Title:</strong> {contact.title}</span>
          <span><strong>Title Contact:</strong> {contact.titleContact}</span>
          {account && <span><a href={`/accounts/${account.id}`} style={{ color: '#1976D2', textDecoration: 'none' }}><strong>Account:</strong> {account.name}</a></span>}
          <span><strong>Phone:</strong> {contact.mobile}</span>
          <span><strong>Email:</strong> <a href={`mailto:${contact.email}`} style={{ color: '#1976D2', textDecoration: 'none' }}>{contact.email}</a></span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            style={{
              padding: '10px 16px', borderRadius: 4, backgroundColor: isFollowing ? 'var(--accent-pale)' : 'var(--bg-light)',
              border: '1px solid var(--border)', color: isFollowing ? 'var(--accent-dark)' : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6
            }}>
            {isFollowing ? <HeartFilled size={14} fill="currentColor" /> : <Heart size={14} />}
            {isFollowing ? 'Following' : 'Follow'}
          </button>
          <button style={{
            padding: '10px 16px', borderRadius: 4, backgroundColor: contact.isActive ? 'var(--bg-light)' : 'var(--accent)',
            border: '1px solid var(--border)', color: contact.isActive ? 'var(--text-secondary)' : '#1A1A1A',
            cursor: 'pointer', fontSize: 13, fontWeight: 500
          }}>
            {contact.isActive ? 'Deactivate Contact' : 'Activate Contact'}
          </button>
          <button style={{
            padding: '10px 16px', borderRadius: 4, backgroundColor: 'var(--bg-light)',
            border: '1px solid var(--border)', color: 'var(--text-secondary)',
            cursor: 'pointer', fontSize: 13, fontWeight: 500
          }}>
            <Edit size={14} style={{ display: 'inline', marginRight: 6 }} /> Edit
          </button>
          <button style={{
            padding: '10px 16px', borderRadius: 4, backgroundColor: 'var(--bg-light)',
            border: '1px solid var(--border)', color: 'var(--text-secondary)',
            cursor: 'pointer', fontSize: 13, fontWeight: 500
          }}>
            <Trash2 size={14} style={{ display: 'inline', marginRight: 6 }} /> Delete
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Main Column */}
        <div>
          {/* Core Fields (No collapse) */}
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16 }}>Core Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FieldRow label="Name" value={getFullName(contact)} />
              <FieldRow label="Account" value={account?.name} link={account ? `/accounts/${account.id}` : undefined} />
              <FieldRow label="Title" value={contact.title} />
              <FieldRow label="Title Contact" value={contact.titleContact} />
              <FieldRow label="Branch/Site Support" value={contact.branchSiteSupport} />
              <FieldRow label="Email" value={contact.email} link={`mailto:${contact.email}`} />
              <FieldRow label="Email 2" value={contact.email2} link={contact.email2 ? `mailto:${contact.email2}` : undefined} />
              <FieldRow label="Mobile" value={contact.mobile} link={contact.mobile} />
              <FieldRow label="Mobile 2" value={contact.mobile2} link={contact.mobile2} />
              <FieldRow label="Phone" value={contact.phone} link={contact.phone} />
              <FieldRow label="Broadcast" value={contact.broadcast ? 'Yes' : 'No'} />
              <FieldRow label="External ID" value={contact.externalId} mono />
            </div>
          </div>

          {/* Address Information */}
          <SectionCard title="Address Information" section="address">
            <FieldRow label="Mailing Street" value={contact.mailingStreet} />
            <FieldRow label="Mailing City" value={contact.mailingCity} />
            <FieldRow label="Mailing State/Province" value={contact.mailingState} />
            <FieldRow label="Mailing Postal Code" value={contact.mailingPostalCode} />
            <FieldRow label="Mailing Country" value={contact.mailingCountry} />
          </SectionCard>

          {/* Contact Management */}
          <SectionCard title="Contact Management" section="management">
            <CheckboxField label="Need Follow Up" checked={contact.needFollowUp} />
            <FieldRow label="Previous Follow Up" value={contact.previousFollowUp} />
            <FieldRow label="Next Follow Up" value={contact.nextFollowUp} highlight={contact.needFollowUp} />
            <FieldRow label="Activation Contact Date" value={contact.activationContactDate} />
            <FieldRow label="Source" value={contact.source} />
            <FieldRow label="Email Support" value={contact.emailSupport} link={contact.emailSupport ? `mailto:${contact.emailSupport}` : undefined} />
            <CheckboxField label="Active Email" checked={contact.activeEmail} />
            <CheckboxField label="Have Email" checked={contact.haveEmail} />
            <CheckboxField label="Active WhatsApp" checked={contact.activeWhatsApp} />
            <CheckboxField label="Have WhatsApp" checked={contact.haveWhatsApp} />
          </SectionCard>

          {/* System Information */}
          <SectionCard title="System Information" section="system">
            <FieldRow label="Created By" value={`${contact.createdBy.name} - ${new Date(contact.createdDate).toLocaleString()}`} />
            <FieldRow label="Last Modified By" value={`${contact.lastModifiedBy.name} - ${new Date(contact.lastModifiedDate).toLocaleString()}`} />
          </SectionCard>
        </div>

        {/* Sidebar */}
        <div>
          {/* Duplicate Alert */}
          {!contact.verified && (
            <div style={{
              padding: 12, borderRadius: 8, backgroundColor: '#FFF3E0',
              border: '1px solid #F57C00', marginBottom: 16, fontSize: 12, color: '#F57C00', display: 'flex', gap: 8
            }}>
              <AlertTriangle size={14} style={{ flexShrink: 0 }} />
              <div>We found 1 potential duplicate of this Contact.</div>
            </div>
          )}

          {/* Quick Links */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16, fontSize: 12
          }}>
            <a href="#" style={{ color: '#1976D2', textDecoration: 'none' }}>Contact History (3)</a>
            <a href="#" style={{ color: '#1976D2', textDecoration: 'none' }}>Opportunities (0)</a>
            <a href="#" style={{ color: '#1976D2', textDecoration: 'none' }}>Related Accounts (1)</a>
            <a href="#" style={{ color: '#1976D2', textDecoration: 'none' }}>Cases (10+)</a>
          </div>

          {/* Contact History Card */}
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 16, overflow: 'hidden' }}>
            <div style={{ padding: 12, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>Contact History (3+)</h4>
              <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div style={{ padding: 12, fontSize: 11, color: 'var(--text-secondary)' }}>
              <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                <div style={{ color: 'var(--text-tertiary)', marginBottom: 4 }}>21/01/2026, 08:10</div>
                <div><strong>Field:</strong> Is Active</div>
                <div><strong>User:</strong> <a href="#" style={{ color: '#1976D2', textDecoration: 'none' }}>Bambang Suraji</a></div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>From: false → To: true</div>
              </div>
            </div>
            <div style={{ padding: 12, borderTop: '1px solid var(--border)', fontSize: 12 }}>
              <a href="#" style={{ color: '#1976D2', textDecoration: 'none' }}>View All</a>
            </div>
          </div>

          {/* Related Accounts Card */}
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: 12, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>Related Accounts</h4>
              <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div style={{ padding: 12 }}>
              {account && (
                <div style={{ display: 'flex', gap: 8, fontSize: 12 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 4, backgroundColor: '#5B8FF9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <span style={{ color: 'white', fontSize: 12 }}>📦</span>
                  </div>
                  <div>
                    <a href={`/accounts/${account.id}`}
                      style={{ color: '#1976D2', textDecoration: 'none', fontWeight: 600, display: 'block' }}>
                      {account.name}
                    </a>
                    <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>Direct: ✓</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
