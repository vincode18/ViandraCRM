/* ─────────────────────────────────────────────────────────────────────────
   Quote Detail Page
   Displays full quote details with tabs and approval workflow
   ───────────────────────────────────────────────────────────────────────── */

import React, { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Building2, User, Package, Pencil, Trash2, Plus, CheckCircle, XCircle, ChevronDown, GitBranch } from 'lucide-react';
import { fetchQuoteById } from '../services/quoteService';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';

const STATUS_COLORS = {
  'Draft': 'text-gray-400',
  'Submitted': 'text-blue-400',
  'Pending Approval': 'text-yellow-400',
  'Approved': 'text-green-400',
  'Rejected': 'text-red-400',
  'Superseded': 'text-purple-400',
};

function StatusBadge({ value }) {
  return <span className={`badge ${STATUS_COLORS[value] || 'badge-open'}`}>{value}</span>;
}

function RelatedLink({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 py-2 px-2 rounded-md text-sm transition-colors"
      style={{ color: 'var(--text-secondary)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--bg-light)';
        e.currentTarget.style.color = 'var(--color-info)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = 'var(--text-secondary)';
      }}
    >
      <Icon size={14} />
      <span className="flex-1 text-left">{label}</span>
    </button>
  );
}

export default function QuoteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [panels, setPanels] = useState({
    opportunity: true,
    account: true,
    contact: true,
  });

  const fetchFn = useCallback(() => fetchQuoteById(id), [id]);
  const { data: quote, loading, error, isMock } = useSupabaseQuery(fetchFn, []);

  const formatCurrency = (amount) => {
    if (!amount) return '—';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB');
  };

  const handleApprove = () => {
    console.log('Approve quote:', id);
  };

  const handleReject = () => {
    console.log('Reject quote:', id);
  };

  const handleSubmit = () => {
    console.log('Submit quote:', id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: 'var(--text-secondary)' }}>
        Loading...
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p style={{ color: 'var(--text-secondary)' }}>Quote not found</p>
        <button onClick={() => navigate('/quotes')} className="mt-4 btn-primary">
          Back to Quotations
        </button>
      </div>
    );
  }

  const lineItems = quote.lineItems || [];

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <button onClick={() => navigate('/quotes')} className="flex items-center gap-2 text-sm mb-2" style={{ color: 'var(--text-tertiary)' }}>
          <ArrowLeft size={14} /> Quotations
        </button>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold">{quote.name}</h1>
              <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: '#F5C800', color: '#1a1a1a' }}>
                v{quote.version}
              </span>
              <StatusBadge value={quote.status} />
            </div>
            <p className="text-sm mb-1" style={{ color: 'var(--text-tertiary)' }}>
              Opportunity:{' '}
              <span className="font-medium" style={{ color: 'var(--color-info)', textDecoration: 'underline', cursor: 'pointer' }}>
                {quote.opportunityName}
              </span>
            </p>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Account: {quote.accountName} · Contact: {quote.contactName || '—'} · Exp: {formatDate(quote.expirationDate)}
            </p>
          </div>
          <div className="flex gap-2">
            {quote.status === 'Draft' && (
              <>
                <button onClick={handleSubmit} className="btn-primary px-4 py-2 text-sm">Submit for Approval</button>
                <button className="btn-secondary px-4 py-2 text-sm">Save Draft</button>
              </>
            )}
            {quote.status === 'Pending Approval' && (
              <>
                <button onClick={handleApprove} className="btn-primary px-4 py-2 text-sm">Approve</button>
                <button onClick={handleReject} className="btn-secondary px-4 py-2 text-sm">Reject</button>
              </>
            )}
            {quote.status === 'Rejected' && (
              <button className="btn-primary px-4 py-2 text-sm">Submit Revised Quote</button>
            )}
            <button className="btn-secondary px-4 py-2 text-sm">View History</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-6 px-6 pb-6 overflow-hidden">
        {/* Left Panel - Related Links */}
        <div className="w-64 flex-shrink-0">
          <div className="card p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider mb-4 block" style={{ color: 'var(--text-muted)' }}>
              RELATED
            </span>
            <div className="space-y-1">
              <RelatedLink icon={ExternalLink} label={quote.opportunityName} onClick={() => navigate(`/opportunities/${quote.opportunityId}`)} />
              <RelatedLink icon={Building2} label={quote.accountName} onClick={() => navigate(`/accounts/${quote.accountId}`)} />
              {quote.contactId && (
                <RelatedLink icon={User} label={quote.contactName} onClick={() => navigate(`/contacts/${quote.contactId}`)} />
              )}
              {quote.version > 1 && (
                <RelatedLink icon={GitBranch} label={`Prior Quote (v${quote.version - 1})`} onClick={() => {}} />
              )}
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b mb-4" style={{ borderColor: 'var(--border)' }}>
            {['details', 'quoteItems', 'versionHistory'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors capitalize"
                style={{
                  borderBottomColor: activeTab === tab ? '#F5C800' : 'transparent',
                  color: activeTab === tab ? 'var(--text-main)' : 'var(--text-tertiary)',
                }}
              >
                {tab === 'quoteItems' ? 'Quote Items' : tab}
                {tab === 'quoteItems' && lineItems.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-tertiary)' }}>
                    {lineItems.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'details' && (
              <div className="card">
                <div className="px-4 py-2 col-span-2 text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}>
                  Quote Information
                </div>
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Quote Name</label>
                      <div className="text-sm font-medium">{quote.name}</div>
                    </div>
                    <div>
                      <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Status</label>
                      <div className="text-sm font-medium"><StatusBadge value={quote.status} /></div>
                    </div>
                    <div>
                      <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Version</label>
                      <div className="text-sm font-medium">Version {quote.version}</div>
                    </div>
                    <div>
                      <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Expiration Date</label>
                      <div className="text-sm font-medium">{formatDate(quote.expirationDate)}</div>
                    </div>
                    <div>
                      <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Currency</label>
                      <div className="text-sm font-medium">{quote.currencyIsoCode}</div>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 border-t my-2" style={{ borderColor: 'var(--border)' }} />
                <div className="px-4 py-2 col-span-2 text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}>
                  Linked Records
                </div>
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Opportunity</label>
                      <div className="text-sm font-medium" style={{ color: 'var(--color-info)' }}>{quote.opportunityName}</div>
                    </div>
                    <div>
                      <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Account</label>
                      <div className="text-sm font-medium" style={{ color: 'var(--color-info)' }}>{quote.accountName}</div>
                    </div>
                    {quote.contactId && (
                      <div>
                        <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Contact</label>
                        <div className="text-sm font-medium" style={{ color: 'var(--color-info)' }}>{quote.contactName}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-span-2 border-t my-2" style={{ borderColor: 'var(--border)' }} />
                <div className="px-4 py-2 col-span-2 text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}>
                  Pricing Summary
                </div>
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Subtotal</label>
                      <div className="text-sm font-medium text-right font-mono">{formatCurrency(quote.subtotal)}</div>
                    </div>
                    <div>
                      <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Discount</label>
                      <div className="text-sm font-medium text-right font-mono">{quote.discount}%</div>
                    </div>
                    <div>
                      <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Tax</label>
                      <div className="text-sm font-medium text-right font-mono">{formatCurrency(quote.tax)}</div>
                    </div>
                    <div>
                      <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Shipping & Handling</label>
                      <div className="text-sm font-medium text-right font-mono">{formatCurrency(quote.shippingHandling)}</div>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Grand Total</label>
                      <div className="text-lg font-bold text-right font-mono">{formatCurrency(quote.grandTotal)}</div>
                    </div>
                  </div>
                </div>

                {quote.status !== 'Draft' && (
                  <>
                    <div className="col-span-2 border-t my-2" style={{ borderColor: 'var(--border)' }} />
                    <div className="px-4 py-2 col-span-2 text-[11px] font-bold uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)' }}>
                      Approval Information
                    </div>
                    <div className="px-4 pb-4">
                      <div className="grid grid-cols-2 gap-4">
                        {quote.submittedBy && (
                          <>
                            <div>
                              <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Submitted By</label>
                              <div className="text-sm font-medium">{quote.submittedBy}</div>
                            </div>
                            <div>
                              <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Submitted Date</label>
                              <div className="text-sm font-medium">{formatDate(quote.submittedAt)}</div>
                            </div>
                          </>
                        )}
                        {quote.reviewedBy && (
                          <>
                            <div>
                              <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Reviewed By</label>
                              <div className="text-sm font-medium">{quote.reviewedBy}</div>
                            </div>
                            <div>
                              <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Review Date</label>
                              <div className="text-sm font-medium">{formatDate(quote.reviewedAt)}</div>
                            </div>
                          </>
                        )}
                      </div>
                      {quote.approvalComments && (
                        <div className="mt-4">
                          <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Approval Comments</label>
                          <div className="text-sm mt-1 p-2 rounded" style={{ backgroundColor: 'var(--bg-light)' }}>
                            {quote.approvalComments}
                          </div>
                        </div>
                      )}
                      {quote.rejectionReason && (
                        <div className="mt-4">
                          <label className="text-xs" style={{ color: 'var(--color-danger)' }}>Rejection Reason</label>
                          <div className="text-sm mt-1 p-2 rounded"
                            style={{ backgroundColor: '#FFEBEE', color: '#C62828', borderLeft: '3px solid #C62828' }}>
                            {quote.rejectionReason}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {quote.internalNotes && (
                  <>
                    <div className="col-span-2 border-t my-2" style={{ borderColor: 'var(--border)' }} />
                    <div className="px-4 py-2 col-span-2 text-[11px] font-bold uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)' }}>
                      Notes / Description
                    </div>
                    <div className="px-4 pb-4">
                      <div className="text-sm">{quote.internalNotes}</div>
                    </div>
                  </>
                )}

                {isMock && <div className="px-4 pb-4 text-xs text-amber-500">(Mock Data)</div>}
              </div>
            )}

            {activeTab === 'quoteItems' && (
              <div className="card">
                <div className="px-4 py-2 flex justify-between items-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Quote Items
                  </span>
                  {quote.status === 'Draft' && (
                    <button className="btn-secondary px-3 py-1 text-xs flex items-center gap-1">
                      <Plus size={12} /> Add Item
                    </button>
                  )}
                </div>
                <div className="px-4 pb-2 text-sm font-medium flex gap-4"
                  style={{ color: 'var(--text-secondary)' }}>
                  Subtotal: {formatCurrency(quote.subtotal)} · Discount: {quote.discount}% · Tax: {formatCurrency(quote.tax)} ·
                  Grand Total: <span className="font-bold">{formatCurrency(quote.grandTotal)}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[11px] font-bold uppercase tracking-wider px-3 py-2 text-left"
                        style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-light)', borderBottom: '1px solid var(--border)' }}>
                        <th className="px-3 py-2 w-10 text-center">#</th>
                        <th className="px-3 py-2 min-w-[192px]">Product / Part</th>
                        <th className="px-3 py-2 w-32">SKU</th>
                        <th className="px-3 py-2 w-20 text-right">Qty</th>
                        <th className="px-3 py-2 w-32 text-right">Unit Price</th>
                        <th className="px-3 py-2 w-24 text-right">Disc (%)</th>
                        <th className="px-3 py-2 w-32 text-right font-medium">Total</th>
                        {quote.status === 'Draft' && <th className="px-3 py-2 w-16 text-center">Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {lineItems.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-16 text-center" style={{ color: 'var(--text-muted)' }}>
                            <Package size={48} className="mx-auto mb-3" />
                            <p className="text-sm font-medium mb-1">No items added yet</p>
                            <p className="text-xs mb-4">Add the products or parts you want to quote.</p>
                            {quote.status === 'Draft' && (
                              <button className="btn-secondary px-4 py-2 text-sm">+ Add First Item</button>
                            )}
                          </td>
                        </tr>
                      ) : (
                        lineItems.map((item, index) => (
                          <tr key={item.id} className="border-b transition-colors"
                            style={{ borderColor: 'var(--border)' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-light)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <td className="px-3 py-3 text-center">{index + 1}</td>
                            <td className="px-3 py-3">{item.productName}</td>
                            <td className="px-3 py-3 font-mono text-xs">{item.sku}</td>
                            <td className="px-3 py-3 text-right">{item.quantity}</td>
                            <td className="px-3 py-3 text-right font-mono">{formatCurrency(item.unitPrice)}</td>
                            <td className="px-3 py-3 text-right">{item.discount}%</td>
                            <td className="px-3 py-3 text-right font-medium font-mono">{formatCurrency(item.total)}</td>
                            {quote.status === 'Draft' && (
                              <td className="px-3 py-3 text-center">
                                <div className="flex gap-1 justify-center">
                                  <button className="p-1 rounded" style={{ color: 'var(--text-muted)' }}><Pencil size={14} /></button>
                                  <button className="p-1 rounded" style={{ color: 'var(--color-danger)' }}><Trash2 size={14} /></button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'versionHistory' && (
              <div className="space-y-3">
                <div className="p-4 rounded-lg" style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderLeft: '3px solid #388E3C',
                }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-semibold">{quote.name} v{quote.version}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                        Submitted by: {quote.submittedBy || '—'} · Reviewed by: {quote.reviewedBy || '—'}
                      </div>
                      <div className="text-sm font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>
                        Grand Total: {formatCurrency(quote.grandTotal)}
                      </div>
                    </div>
                    <StatusBadge value={quote.status} />
                  </div>
                  {quote.approvalComments && (
                    <div className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {quote.approvalComments}
                    </div>
                  )}
                  {quote.rejectionReason && (
                    <div className="mt-2 p-2 rounded text-xs"
                      style={{ backgroundColor: '#FFEBEE', color: '#C62828', borderLeft: '3px solid #C62828' }}>
                      {quote.rejectionReason}
                    </div>
                  )}
                </div>

                {quote.version > 1 && (
                  <div className="p-4 rounded-lg" style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderLeft: '3px solid #C62828',
                  }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-semibold">{quote.name} v{quote.version - 1}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                          Submitted by: {quote.submittedBy || '—'} · Reviewed by: {quote.reviewedBy || '—'}
                        </div>
                        <div className="text-sm font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>
                          Grand Total: {formatCurrency(quote.grandTotal * 1.1)}
                        </div>
                      </div>
                      <StatusBadge value="Rejected" />
                    </div>
                    <div className="mt-2 p-2 rounded text-xs"
                      style={{ backgroundColor: '#FFEBEE', color: '#C62828', borderLeft: '3px solid #C62828' }}>
                      Unit prices exceed approved vendor list by 12% for parts. Revise to list prices.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
