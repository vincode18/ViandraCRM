/* ─────────────────────────────────────────────────────────────────────────
   Opportunity Detail Page
   Displays full opportunity details with chevron navigator and related panels
   ───────────────────────────────────────────────────────────────────────── */

import React, { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Lock, MoreHorizontal, CheckCircle, XCircle, Phone, Mail, Calendar, FileText, Building2, User, Package, ChevronDown } from 'lucide-react';
import { fetchOpportunityById } from '../services/opportunityService';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';
import { STAGES } from '../utils/opportunityData';

const STAGE_PROBABILITIES = {
  'Prospecting': 10,
  'Qualification': 20,
  'Needs Analysis': 30,
  'Value Proposition': 50,
  'Proposal / Price Quote': 65,
  'Negotiation / Review': 80,
  'Closed Won': 100,
  'Closed Lost': 0,
};

function ChevronNavigator({ currentStage, onStageChange, isClosed }) {
  const currentIndex = STAGES.indexOf(currentStage);

  const getStageColor = (index) => {
    if (index < currentIndex) return 'rgba(245, 200, 0, 0.3)';
    if (index === currentIndex) return '#F5C800';
    if (STAGES[index] === 'Closed Won') return '#388E3C';
    if (STAGES[index] === 'Closed Lost') return '#C62828';
    return 'var(--bg-light)';
  };

  const getTextColor = (index) => {
    if (index === currentIndex) return '#1A1A1A';
    if (STAGES[index] === 'Closed Won' || STAGES[index] === 'Closed Lost') return '#FFFFFF';
    return 'var(--text-tertiary)';
  };

  return (
    <div className="w-full mb-6">
      <div className="flex items-stretch" style={{ gap: '-4px' }}>
        {STAGES.map((stage, index) => (
          <button
            key={stage}
            onClick={() => !isClosed && onStageChange(stage)}
            disabled={isClosed}
            className="flex-1 relative transition-all duration-300"
            style={{
              height: '52px',
              clipPath: index === 0
                ? 'polygon(0% 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 0% 100%)'
                : index === STAGES.length - 1
                ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 16px 50%)'
                : 'polygon(0% 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 0% 100%, 16px 50%)',
              backgroundColor: getStageColor(index),
              cursor: isClosed ? 'not-allowed' : 'pointer',
            }}
            title={stage}
          >
            <div className="flex flex-col items-center justify-center h-full px-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: getTextColor(index) }}>
                {stage.split(' ')[0]}
              </span>
              <span className="text-[10px] font-normal" style={{ color: getTextColor(index) }}>
                {STAGE_PROBABILITIES[stage]}%
              </span>
            </div>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-2 px-2">
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          Stage: {currentStage}
        </span>
        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
          In this stage: 4 days
        </span>
      </div>
    </div>
  );
}

function RelatedPanel({ title, children, expanded = true, onToggle }) {
  return (
    <div className="card mb-4">
      <button
        onClick={onToggle}
        className="w-full px-4 py-2 flex items-center justify-between transition-colors"
        style={{ color: 'var(--text-muted)' }}
      >
        <span className="text-[11px] font-bold uppercase tracking-wider">{title}</span>
        <ChevronDown size={14} style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }} />
      </button>
      {expanded && <div className="px-4 pb-4 pt-2">{children}</div>}
    </div>
  );
}

export default function OpportunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [panels, setPanels] = useState({
    account: true,
    cases: true,
    assets: true,
    quotes: true,
  });

  const fetchFn = useCallback(() => fetchOpportunityById(id), [id]);
  const { data: opportunity, loading, error, isMock } = useSupabaseQuery(fetchFn, []);

  const formatCurrency = (amount) => {
    if (!amount) return '—';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: 'var(--text-secondary)' }}>
        Loading...
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p style={{ color: 'var(--text-secondary)' }}>Opportunity not found</p>
        <button onClick={() => navigate('/opportunities')} className="mt-4 btn-primary">
          Back to Opportunities
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <button onClick={() => navigate('/opportunities')} className="flex items-center gap-2 text-sm mb-2" style={{ color: 'var(--text-tertiary)' }}>
          <ArrowLeft size={14} /> Opportunities
        </button>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {opportunity.isPriorityRecord && <Star size={16} fill="#F5C800" stroke="#F5C800" />}
              {opportunity.isPrivate && <Lock size={14} style={{ color: 'var(--text-muted)' }} />}
              <h1 className="text-2xl font-bold">{opportunity.name}</h1>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Account: {opportunity.accountName} · Owner: {opportunity.ownerName} · {formatCurrency(opportunity.amount)}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary px-4 py-2 text-sm">Edit</button>
            <button className="btn-secondary px-4 py-2 text-sm">Log Activity</button>
            <button className="btn-secondary px-4 py-2 text-sm">New Quote</button>
            {!opportunity.isClosed && (
              <>
                <button className="btn-primary px-4 py-2 text-sm">Mark Won</button>
                <button className="btn-secondary px-4 py-2 text-sm">Mark Lost</button>
              </>
            )}
            <button className="btn-secondary px-2 py-2">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Chevron Navigator */}
      <div className="px-6 pt-4">
        <ChevronNavigator
          currentStage={opportunity.stageName}
          onStageChange={(stage) => console.log('Stage change:', stage)}
          isClosed={opportunity.isClosed}
        />
      </div>

      {/* Closed Banner */}
      {opportunity.isClosed && (
        <div className="mx-6 mb-4 px-4 py-2 rounded flex items-center gap-2" style={{
          backgroundColor: opportunity.isWon ? 'rgba(56, 142, 60, 0.15)' : 'rgba(198, 40, 40, 0.15)',
          border: `1px solid ${opportunity.isWon ? '#388E3C' : '#C62828'}`,
          color: opportunity.isWon ? '#388E3C' : '#C62828',
        }}>
          {opportunity.isWon ? <CheckCircle size={16} /> : <XCircle size={16} />}
          <span className="text-sm">
            This opportunity was closed as {opportunity.isWon ? 'Won' : 'Lost'} on {formatDate(opportunity.lastStageChangeDate)}.
          </span>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex gap-6 px-6 pb-6 overflow-hidden">
        {/* Left Column - 65% */}
        <div className="w-[65%] flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b mb-4" style={{ borderColor: 'var(--border)' }}>
            {['details', 'activity', 'history'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors capitalize"
                style={{
                  borderBottomColor: activeTab === tab ? '#F5C800' : 'transparent',
                  color: activeTab === tab ? 'var(--text-main)' : 'var(--text-tertiary)',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'details' && (
              <div className="space-y-4">
                {/* Opportunity Info Card */}
                <div className="card">
                  <div className="px-4 py-2 flex justify-between items-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Opportunity Information</span>
                    <button className="text-xs font-medium" style={{ color: 'var(--accent)' }}>Edit</button>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Opportunity Name</label>
                        <div className="text-sm font-medium">{opportunity.name}</div>
                      </div>
                      <div>
                        <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Account</label>
                        <div className="text-sm font-medium" style={{ color: 'var(--color-info)' }}>{opportunity.accountName}</div>
                      </div>
                      <div>
                        <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Contact</label>
                        <div className="text-sm font-medium">{opportunity.contactName || '—'}</div>
                      </div>
                      <div>
                        <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Close Date</label>
                        <div className="text-sm font-medium">{formatDate(opportunity.closeDate)}</div>
                      </div>
                      <div>
                        <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Stage</label>
                        <div className="text-sm font-medium">{opportunity.stageName}</div>
                      </div>
                      <div>
                        <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Probability</label>
                        <div className="text-sm font-medium">{opportunity.probability}%</div>
                      </div>
                      <div>
                        <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Amount</label>
                        <div className="text-sm font-medium text-right font-mono">{formatCurrency(opportunity.amount)}</div>
                      </div>
                      <div>
                        <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Expected Revenue</label>
                        <div className="text-sm font-medium text-right font-mono">{formatCurrency(opportunity.expectedRevenue)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Step Card */}
                <div className="card p-3" style={{ borderLeft: '3px solid #F5C800', backgroundColor: 'var(--bg-light)' }}>
                  <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>NEXT STEP</label>
                  <div className="text-sm mt-1">{opportunity.nextStep || 'No next step defined'}</div>
                </div>

                {/* Deal Metrics Card */}
                <div className="card">
                  <div className="px-4 py-2 flex justify-between items-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Deal Metrics</span>
                    <button className="text-xs font-medium" style={{ color: 'var(--accent)' }}>Edit</button>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Currency</label>
                        <div className="text-sm font-medium">{opportunity.currencyIsoCode}</div>
                      </div>
                      <div>
                        <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Forecast Category</label>
                        <div className="text-sm font-medium">{opportunity.forecastCategoryName}</div>
                      </div>
                      <div>
                        <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Type</label>
                        <div className="text-sm font-medium">{opportunity.type}</div>
                      </div>
                      <div>
                        <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Lead Source</label>
                        <div className="text-sm font-medium">{opportunity.leadSource}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {isMock && <div className="text-xs text-amber-500">(Mock Data)</div>}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4">
                <button className="btn-secondary px-4 py-2 text-sm">+ Log Activity</button>
                <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
                  <FileText size={32} className="mx-auto mb-2" />
                  <p>No activity logged yet</p>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                      <th className="px-2 py-2 text-left" style={{ color: 'var(--text-muted)' }}>Date/Time</th>
                      <th className="px-2 py-2 text-left" style={{ color: 'var(--text-muted)' }}>Changed By</th>
                      <th className="px-2 py-2 text-left" style={{ color: 'var(--text-muted)' }}>Field</th>
                      <th className="px-2 py-2 text-left" style={{ color: 'var(--text-muted)' }}>Old</th>
                      <th className="px-2 py-2 text-left" style={{ color: 'var(--text-muted)' }}>New</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-2 py-2 font-mono">{formatDate(opportunity.lastStageChangeDate)}</td>
                      <td className="px-2 py-2">{opportunity.ownerName}</td>
                      <td className="px-2 py-2 font-medium">Stage</td>
                      <td className="px-2 py-2" style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>Qualification</td>
                      <td className="px-2 py-2 font-medium">{opportunity.stageName}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - 35% */}
        <div className="w-[35%] overflow-y-auto">
          <RelatedPanel title="Account & Contact" expanded={panels.account} onToggle={() => setPanels(p => ({ ...p, account: !p.account }))}>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building2 size={14} style={{ color: 'var(--text-muted)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--color-info)' }}>{opportunity.accountName}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={14} style={{ color: 'var(--text-muted)' }} />
                <span className="text-sm">{opportunity.contactName || '—'}</span>
              </div>
              <button className="text-xs font-medium mt-2" style={{ color: 'var(--color-info)' }}>View Account</button>
            </div>
          </RelatedPanel>

          <RelatedPanel title="Quotes" expanded={panels.quotes} onToggle={() => setPanels(p => ({ ...p, quotes: !p.quotes }))}>
            <div className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>
              <Package size={24} className="mx-auto mb-2" />
              No quotes linked
            </div>
          </RelatedPanel>

          <RelatedPanel title="Cases" expanded={panels.cases} onToggle={() => setPanels(p => ({ ...p, cases: !p.cases }))}>
            <div className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>
              <FileText size={24} className="mx-auto mb-2" />
              No cases linked
            </div>
          </RelatedPanel>

          <RelatedPanel title="Assets" expanded={panels.assets} onToggle={() => setPanels(p => ({ ...p, assets: !p.assets }))}>
            <div className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>
              <Package size={24} className="mx-auto mb-2" />
              No assets linked
            </div>
          </RelatedPanel>
        </div>
      </div>
    </div>
  );
}
