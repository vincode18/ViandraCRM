import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Edit, User, ChevronDown, RefreshCw, MapPin, Phone, Mail,
  AlertTriangle, CheckCircle, Clock, TrendingUp, Filter,
  History, FileText, AlertCircle, MoreVertical,
  Bold, Italic, AtSign, Paperclip, Heart, MessageSquare,
  ClipboardList, Package, Download, Search, X, ArrowRight,
  ChevronRight, Circle, Check, CircleDot
} from 'lucide-react';
import api from '../utils/api';

/* ── helpers ────────────────────────────────────────────── */
const statusColor = (s) => {
  if (s === 'Closed') return 'bg-green-500/20 text-green-400';
  if (s === 'In Progress') return 'bg-yellow-500/20 text-yellow-400';
  if (s === 'Resolved') return 'bg-blue-500/20 text-blue-400';
  if (s === 'Open') return 'bg-gray-500/20 text-gray-400';
  if (s === 'Assigned') return 'bg-indigo-500/20 text-indigo-400';
  return 'bg-gray-500/20 text-gray-400';
};

const priorityColor = (p) => {
  if (p === 'Critical') return 'bg-red-500/20 text-red-400';
  if (p === 'High') return 'bg-orange-500/20 text-orange-400';
  if (p === 'Medium') return 'bg-yellow-500/20 text-yellow-400';
  return 'bg-green-500/20 text-green-400';
};

/* ── component ──────────────────────────────────────────── */
export default function CaseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fallbackDetail = {
    caseNumber: '01532785',
    priority: 'Medium',
    status: 'Closed',
    progress: ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
    owner: 'System User',
    startDate: '26/05/2026, 07:31',
    targetDate: '02/06/2026, 07:31',
    subject: 'Hydraulic Leak on Right Cylinder',
    description: 'Operator reported significant hydraulic fluid leak near the right cylinder during morning inspection. Machine grounded pending repair. Suspect blown seal or damaged hose fitting. Requires immediate inspection and replacement parts.',
    accountName: 'PUTRA PERKASA ABADI',
    accountTier: 'Tier 1 Enterprise',
    primaryContact: 'Andi Wijaya',
    contactPhone: '+62-811-111-2222',
    contactEmail: 'andi@putraabadi.co.id',
    assetId: 'EQ-HT-9942',
    assetModel: 'Komatsu D85ESS-2',
    location: 'Site B - Pit 4',
    slaStatus: 'Breached',
    slaDaysOverdue: 17,
    slaCompliance: 0,
    createdDate: '26/05/2026',
    createdBy: 'System User',
    lastUpdatedDate: '26/10/2026',
    lastUpdatedBy: 'System User',
    targetDateOTF: '26/05/2026, 11:31',
    startDateSLA: '26/05/2026, 07:31',
    targetDateSLA: '02/06/2026, 07:31',
    backdateReason: 'Standard case processing',
  };

  const [caseData, setCaseData] = useState(fallbackDetail);

  useEffect(() => {
    let alive = true;
    const loadCaseDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/cases/detail/${encodeURIComponent(id)}`);
        const payload = response.data?.data;
        if (!alive) return;
        if (!payload) {
          setCaseData(fallbackDetail);
          setError('Case detail data was empty. Showing fallback layout.');
          return;
        }
        setCaseData({
          caseNumber: payload.caseNumber || id,
          priority: payload.priority || 'Medium',
          status: payload.status || 'Closed',
          progress: payload.progressSteps?.length ? payload.progressSteps : fallbackDetail.progress,
          owner: payload.owner || 'System User',
          startDate: payload.slaTracking?.startDateOtfMechanic
            ? new Date(payload.slaTracking.startDateOtfMechanic).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            : fallbackDetail.startDate,
          targetDate: payload.slaTracking?.targetDateSla
            ? new Date(payload.slaTracking.targetDateSla).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            : fallbackDetail.targetDate,
          subject: payload.subject || fallbackDetail.subject,
          description: payload.description || fallbackDetail.description,
          accountName: payload.accountContext?.accountName || fallbackDetail.accountName,
          accountTier: payload.accountContext?.accountTier || fallbackDetail.accountTier,
          primaryContact: payload.accountContext?.primaryContactName || fallbackDetail.primaryContact,
          contactPhone: payload.accountContext?.primaryContactPhone || fallbackDetail.contactPhone,
          contactEmail: payload.accountContext?.primaryContactEmail || fallbackDetail.contactEmail,
          assetId: payload.affectedUnit?.assetId || fallbackDetail.assetId,
          assetModel: payload.affectedUnit?.model || fallbackDetail.assetModel,
          location: payload.affectedUnit?.location || fallbackDetail.location,
          slaStatus: payload.slaStatus?.status === 'breached' ? 'Breached' : 'On Track',
          slaDaysOverdue: payload.slaStatus?.daysOverdue ?? fallbackDetail.slaDaysOverdue,
          slaCompliance: payload.slaStatus?.complianceScore ?? fallbackDetail.slaCompliance,
          createdDate: payload.createdDate
            ? new Date(payload.createdDate).toLocaleDateString('en-GB')
            : fallbackDetail.createdDate,
          createdBy: payload.createdBy || fallbackDetail.createdBy,
          lastUpdatedDate: payload.lastUpdatedDate
            ? new Date(payload.lastUpdatedDate).toLocaleDateString('en-GB')
            : fallbackDetail.lastUpdatedDate,
          lastUpdatedBy: payload.lastUpdatedBy || fallbackDetail.lastUpdatedBy,
          targetDateOTF: payload.slaTracking?.targetDateOtfMechanic
            ? new Date(payload.slaTracking.targetDateOtfMechanic).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            : fallbackDetail.targetDateOTF,
          startDateSLA: payload.slaTracking?.startDateSla
            ? new Date(payload.slaTracking.startDateSla).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            : fallbackDetail.startDateSLA,
          targetDateSLA: payload.slaTracking?.targetDateSla
            ? new Date(payload.slaTracking.targetDateSla).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            : fallbackDetail.targetDateSLA,
          backdateReason: payload.slaTracking?.backdateValidation?.backdateReason || fallbackDetail.backdateReason,
        });
      } catch (fetchError) {
        if (!alive) return;
        setError('Unable to load case detail from the backend. Showing fallback dummy UI.');
        setCaseData(fallbackDetail);
      } finally {
        if (alive) setLoading(false);
      }
    };
    loadCaseDetail();
    return () => { alive = false; };
  }, [id]);

  /* ── mock data for tabs ───────────────────────────────── */
  const fleetUnits = [
    { id: 'GD-829', model: 'Komatsu D85ESS-2', status: 'Active', hours: 14250, location: 'Site 8-Pit 4' },
    { id: 'GD-830', model: 'PC200-8', status: 'Maint. Req.', hours: 12500, location: 'Site A-Loading' },
    { id: 'GD-831', model: 'WA200-6', status: 'Operational', hours: 16750, location: 'Transportation' },
    { id: 'GD-832', model: 'D65EX-12', status: 'In Repair', hours: 11200, location: 'Workshop' },
  ];

  const timeline = [
    { date: '26/10/2026', time: '14:30', title: 'CASE CLOSED', description: 'System User - SLA review completed.' },
    { date: '28/05/2026', time: '16:45', title: 'COMPLETION NOTE', description: '"All repairs completed. System tested and verified."' },
    { date: '27/05/2026', time: '09:00', title: 'PARTS ARRIVED', description: 'Warehouse - Items verified and issued to technician.' },
    { date: '26/05/2026', time: '07:31', title: 'CASE CREATED', description: 'System User - Automated case creation from inspection.' },
  ];

  const pastCases = [
    { id: '01555475', subject: 'Hydraulic Leak', ref: 'HO785:7-BO76', status: 'IN PROGRESS' },
    { id: '01473917', subject: 'Engine Overheat', ref: 'GD-830', status: 'CLOSED' },
  ];

  const feedItems = [
    { id: 1, type: 'status-change', author: 'System Auto-Process', timestamp: '10 mins ago', fromStatus: 'In Progress', toStatus: 'Escalated' },
    { id: 2, type: 'comment', author: 'Mechanic Rudi', timestamp: '1 hour ago', comment: 'Inspected EX-8902. Found severe scoring on the main hydraulic pump housing. Requires immediate replacement. Cannot patch on site. Awaiting approval for parts order #PO-9921.', likes: 2 },
    { id: 3, type: 'system', author: 'System', timestamp: '3 hours ago', description: 'Case #01532785 created via Telemetry' },
  ];

  const workOrders = [
    { id: 'WO-88392', number: 'WO-88392', status: 'In Progress', description: 'Replace impeller seals and inspect housing.', technician: 'M. Rivera', dueDate: 'Today', progress: 75 },
    { id: 'WO-88340', number: 'WO-88340', status: 'Closed', description: 'Initial diagnostic inspection.', technician: 'A. Chen', dueDate: '2d ago', progress: 100 },
  ];

  const parts = [
    { id: 'PRT-992-B', description: 'Seal Kit - High Temp', partNumber: 'PRT-992-B', quantity: 2, status: 'In Transit' },
  ];

  const documents = [
    { id: 1, name: 'Scope of Work.pdf', size: '1.2 MB' },
    { id: 2, name: 'Technical Specifications.pdf', size: '3.4 MB' },
    { id: 3, name: 'Service Report.pdf', size: '890 KB' },
  ];

  const auditLog = [
    { id: 1, timestamp: '2026-10-26T14:30:00', date: 'Oct 26, 2026', time: '14:30', user: 'System User', field: 'Status', type: 'field-update', oldValue: 'In Progress', newValue: 'Closed' },
    { id: 2, timestamp: '2026-10-26T16:45:00', date: 'Oct 26, 2026', time: '16:45', user: 'System User', field: 'Target Date', type: 'field-update', oldValue: '02/06/2026', newValue: '26/10/2026' },
    { id: 3, timestamp: '2026-10-25T11:00:00', date: 'Oct 25, 2026', time: '11:00', user: 'Mechanic Rudi', field: 'Description', type: 'text-update', oldValue: 'Operator reported leak...', newValue: 'Inspected EX-8902. Found severe scoring...' },
    { id: 4, timestamp: '2026-10-24T07:31:00', date: 'Oct 24, 2026', time: '07:31', user: 'System', field: 'Case', type: 'system-event', description: 'Case #01532785 created via Telemetry' },
  ];

  const currentStepIndex = caseData.progress.indexOf(caseData.status);

  /* ── render ─────────────────────────────────────────────── */
  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      {/* Error banner */}
      {error && (
        <div className="pl-[15px] pr-6 py-2 text-sm" style={{ backgroundColor: 'rgba(245, 166, 35, 0.12)', color: 'var(--text-main)' }}>
          {error}
        </div>
      )}

      {/* ── Case Header ───────────────────────────────────── */}
      <div className="pl-[15px] pr-6 py-4" style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-panel)' }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-xl font-bold">Case #: {loading ? 'Loading…' : caseData.caseNumber}</h1>
              <button
                onClick={() => navigate(`/cases/${id}/edit`)}
                className="px-3 py-1.5 text-sm rounded-lg flex items-center gap-2 transition-colors"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
              >
                <Edit size={14} /> Edit
              </button>
              <button className="px-3 py-1.5 text-sm rounded-lg flex items-center gap-2 transition-colors"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
              >
                <User size={14} /> Change Owner
              </button>
              <button className="p-1.5 rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              >
                <MoreVertical size={16} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColor(caseData.priority)}`}>
                {caseData.priority} Priority
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColor(caseData.status)}`}>
                {caseData.status}
              </span>
            </div>
          </div>
        </div>

        {/* ── Milestone / Progress Steps (FRD v2.0) ───────── */}
        <div className="mt-5">
          <div className="flex items-center gap-0">
            {caseData.progress.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isActive = idx === currentStepIndex;
              const isLast = idx === caseData.progress.length - 1;
              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center gap-1.5 min-w-[80px]">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                        ${isCompleted ? 'bg-brand-blue text-white' :
                          isActive ? 'bg-brand-blue/20 text-brand-blue ring-2 ring-brand-blue' :
                          'bg-gray-700 text-gray-500'}`}
                    >
                      {isCompleted ? <Check size={14} /> : isActive ? <CircleDot size={14} /> : <Circle size={14} />}
                    </div>
                    <span
                      className={`text-[11px] font-medium text-center leading-tight max-w-[90px]
                        ${isCompleted ? 'text-brand-blue' : isActive ? 'text-white' : 'text-gray-500'}`}
                    >
                      {step}
                    </span>
                  </div>
                  {!isLast && (
                    <div className={`flex-1 h-0.5 mx-1 self-start mt-4 transition-all
                      ${idx < currentStepIndex ? 'bg-brand-blue' : 'bg-gray-700'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ────────────────────────────────── */}
      <div className="pl-[15px] pr-6 flex gap-6 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-panel)' }}>
        {['Details', 'Feed', 'Related', 'Log'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-1 py-3 text-sm font-medium border-b-2 transition-colors
              ${activeTab === tab.toLowerCase() ? 'border-brand-blue text-brand-blue' : 'border-transparent'}`}
            style={{ color: activeTab === tab.toLowerCase() ? 'var(--text-main)' : 'var(--text-muted)' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── 3-Column Layout ───────────────────────────────── */}
      <div className="flex-1 overflow-hidden flex">
        {/* ── Left Panel ────────────────────────────────── */}
        <div className="w-72 flex-shrink-0 overflow-y-auto p-4 border-r" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-panel)' }}>
          {/* Fleet Units */}
          <Card title={`Fleet Units (${fleetUnits.length})`} icon={<RefreshCw size={14} />}>
            <div className="space-y-3">
              {fleetUnits.map(unit => (
                <div key={unit.id} className="p-2.5 rounded-md" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{unit.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${unit.status === 'Active' ? 'text-green-400 bg-green-500/10' : 'text-yellow-400 bg-yellow-500/10'}`}>
                      {unit.status}
                    </span>
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{unit.model}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>HM: {unit.hours.toLocaleString()} hrs</div>
                  <div className="text-xs flex items-center gap-1 mt-1" style={{ color: 'var(--text-muted)' }}>
                    <MapPin size={10} /> {unit.location}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Affected Unit */}
          <Card title="Affected Unit">
            <div className="space-y-3">
              <InfoField label="Asset ID" value={caseData.assetId} />
              <InfoField label="Model" value={caseData.assetModel} />
              <InfoField label="Location" value={
                <span className="flex items-center gap-1"><MapPin size={12} /> {caseData.location}</span>
              } />
            </div>
          </Card>

          {/* Account Details */}
          <Card title="Account Details">
            <div className="font-medium text-sm mb-1">{caseData.accountName}</div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-brand-blue/15 text-brand-blue font-medium">
              {caseData.accountTier}
            </span>
            <div className="mt-3 pt-3 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Primary Contact</div>
              <div className="text-sm">{caseData.primaryContact}</div>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <Mail size={12} /> {caseData.contactEmail}
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <Phone size={12} /> {caseData.contactPhone}
              </div>
            </div>
          </Card>
        </div>

        {/* ── Center Panel ──────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: 'var(--bg-base)' }}>
          <div className="max-w-5xl space-y-5">
            {activeTab === 'details' && <DetailsTab caseData={caseData} />}
            {activeTab === 'feed' && <FeedTab feedItems={feedItems} />}
            {activeTab === 'related' && <RelatedTab workOrders={workOrders} parts={parts} documents={documents} navigate={navigate} />}
            {activeTab === 'log' && <LogTab auditLog={auditLog} />}
          </div>
        </div>

        {/* ── Right Panel ───────────────────────────────── */}
        <div className="w-80 flex-shrink-0 overflow-y-auto p-4 border-l" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-panel)' }}>
          {/* SLA Status */}
          <div className="mb-4 rounded-lg p-4 border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'rgba(239,68,68,0.4)' }}>
            <div className="flex items-start gap-3 mb-3">
              <AlertTriangle className="text-red-500 shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-red-500 text-sm">OVER SLA - BREACHED</h3>
                <span className="text-2xl font-bold text-red-500">{caseData.slaDaysOverdue} Days</span>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--text-muted)' }}>OTF Mechanic:</span>
                <span className="text-red-400 font-medium">FAILED (+6.0d)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--text-muted)' }}>OTF Solution:</span>
                <span className="text-yellow-400 font-medium">PENDING</span>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span style={{ color: 'var(--text-muted)' }}>SLA Compliance Score:</span>
                <span className="text-red-400 font-medium">{caseData.slaCompliance}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-700">
                <div className="h-full rounded-full bg-red-500" style={{ width: `${caseData.slaCompliance}%` }} />
              </div>
            </div>
            <button className="w-full py-2 rounded-lg text-sm font-medium bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors">
              Acknowledge Breach
            </button>
          </div>

          {/* Performance Metrics */}
          <Card title="Performance Metrics" icon={<TrendingUp size={14} />}>
            <div className="space-y-2">
              <MetricRow label="1st Response" target="Target: 4h" value="0.5h" status="good" />
              <MetricRow label="Resolution" target="Target: 5d" value="153d" status="bad" />
            </div>
          </Card>

          {/* Timeline Flow */}
          <Card title="Timeline Flow" icon={<History size={14} />} action={<Filter size={12} />}>
            <div className="space-y-4">
              {timeline.map((event, idx) => (
                <div key={idx} className="relative pl-4 pb-2" style={{ borderLeft: '2px solid var(--border)' }}>
                  <div className="absolute left-0 top-0 w-2 h-2 rounded-full -translate-x-1/2" style={{ backgroundColor: 'var(--border)' }} />
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{event.date}</div>
                  <div className="text-xs font-medium">{event.time}</div>
                  <div className="text-xs font-bold mt-1">{event.title}</div>
                  <div className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{event.description}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Past Cases */}
          <Card title={`Past Cases for Asset (${pastCases.length})`} icon={<FileText size={14} />}>
            <div className="space-y-2">
              {pastCases.map((pastCase, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(`/cases/${pastCase.id}`)}
                  className="w-full text-left p-2.5 rounded-md hover:bg-brand-blue/10 transition-colors"
                  style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{pastCase.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium
                      ${pastCase.status === 'IN PROGRESS' ? 'bg-yellow-500/15 text-yellow-400' : 'bg-green-500/15 text-green-400'}`}>
                      {pastCase.status}
                    </span>
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{pastCase.subject}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{pastCase.ref}</div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════════════════ */

function Card({ title, children, icon, action }) {
  return (
    <div className="mb-4 rounded-lg p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon && <span style={{ color: 'var(--text-muted)' }}>{icon}</span>}
          <h3 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            {title}
          </h3>
        </div>
        {action && (
          <button className="p-1 rounded hover:bg-gray-500/20 transition-colors" style={{ color: 'var(--text-muted)' }}>
            {action}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function InfoField({ label, value }) {
  return (
    <div>
      <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <div className="text-sm mt-0.5">{value}</div>
    </div>
  );
}

function MetricRow({ label, target, value, status }) {
  return (
    <div className="grid grid-cols-3 gap-2 text-xs p-2.5 rounded-md" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)' }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ color: 'var(--text-muted)' }}>{target}</span>
      <span className={`flex items-center gap-1 font-medium ${status === 'good' ? 'text-green-400' : 'text-red-400'}`}>
        {value} {status === 'good' ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
      </span>
    </div>
  );
}

/* ── Details Tab ─────────────────────────────────────────── */
function DetailsTab({ caseData }) {
  return (
    <>
      {/* Section 1: Completion & SLA Tracking */}
      <div className="rounded-lg p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-main)' }}>
          1. Completion & SLA Tracking
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Start Date OTF Mechanic', value: caseData.startDate },
            { label: 'Target Date OTF Mechanic', value: caseData.targetDateOTF },
            { label: 'Start Date SLA', value: caseData.startDateSLA },
            { label: 'Target Date SLA', value: caseData.targetDateSLA },
          ].map(field => (
            <div key={field.label} className="group">
              <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{field.label}</label>
              <div className="flex items-center justify-between mt-1 px-3 py-2 rounded-md" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)' }}>
                <span className="text-sm font-medium">{field.value}</span>
                <button className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }}>
                  <Edit size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Backdate Validation */}
        <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
          <h4 className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-main)' }}>
            Backdate Validation
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Mechanic Start</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">26/05/2026, 07:31</span>
                <CheckCircle size={14} className="text-green-500" />
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Job Complete</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">26/05/2026, 15:30</span>
                <input type="checkbox" className="rounded" defaultChecked readOnly />
              </div>
            </div>
          </div>
          <div className="mt-3">
            <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Reason</label>
            <textarea
              rows={3}
              maxLength={500}
              defaultValue={caseData.backdateReason}
              className="w-full mt-1 px-3 py-2 rounded-md text-sm resize-none"
              style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
              placeholder="Provide reason for backdating..."
            />
          </div>
        </div>
      </div>

      {/* Section 2: Case Information */}
      <div className="rounded-lg p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-main)' }}>
          2A. Case Information
        </h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <InfoRow label="Case Owner" value={caseData.owner} />
          <InfoRow label="Status" badge={caseData.status} badgeColor={statusColor(caseData.status)} />
          <InfoRow label="Case Number" value={caseData.caseNumber} />
          <InfoRow label="Priority" badge={caseData.priority} badgeColor={priorityColor(caseData.priority)} />
          <InfoRow label="Created Date" value={caseData.createdDate} />
          <InfoRow label="Created By" value={caseData.createdBy} />
          <InfoRow label="Last Updated" value={caseData.lastUpdatedDate} />
          <InfoRow label="Last Updated By" value={caseData.lastUpdatedBy} />
        </div>
      </div>

      {/* Section 3: Subject & Description */}
      <div className="rounded-lg p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-main)' }}>
          2B. Subject & Description
        </h3>
        <div className="mb-5">
          <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Subject</label>
          <p className="text-base font-semibold mt-1.5 leading-relaxed">{caseData.subject}</p>
        </div>
        <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
          <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Detailed Description</label>
          <div className="relative mt-1.5 p-3 rounded-md group" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)' }}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{caseData.description}</p>
            <button className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }}>
              <Edit size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function InfoRow({ label, value, badge, badgeColor }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</span>
      {badge ? (
        <span className={`inline-block self-start px-2 py-0.5 rounded text-xs font-medium ${badgeColor}`}>
          {badge}
        </span>
      ) : (
        <span className="text-sm font-medium">{value}</span>
      )}
    </div>
  );
}

/* ── Feed Tab ────────────────────────────────────────────── */
function FeedTab({ feedItems }) {
  const [composerText, setComposerText] = useState('');

  return (
    <div className="space-y-5">
      {/* Composer */}
      <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-white text-xs font-bold shrink-0">
            U
          </div>
          <textarea
            rows={3}
            placeholder="Share an update, log a call, or attach a file..."
            value={composerText}
            onChange={e => setComposerText(e.target.value)}
            className="flex-1 px-3 py-2 rounded-md text-sm resize-none"
            style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
          />
        </div>
        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <ToolbarBtn icon={<Bold size={14} />} />
            <ToolbarBtn icon={<Italic size={14} />} />
            <ToolbarBtn icon={<AtSign size={14} />} title="Mention" />
            <ToolbarBtn icon={<Paperclip size={14} />} title="Attach" />
          </div>
          <button
            disabled={!composerText.trim()}
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
            style={{ backgroundColor: 'var(--accent)', color: '#1f2937' }}
          >
            Post Update
          </button>
        </div>
      </div>

      {/* Feed Items */}
      <div className="space-y-4">
        {feedItems.map(item => (
          <div key={item.id} className="rounded-lg p-4 transition-colors hover:opacity-95" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-start gap-3">
              {item.type === 'system' || item.type === 'status-change' ? (
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center shrink-0">
                  <Clock size={14} className="text-gray-300" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue text-xs font-bold shrink-0">
                  {item.author.split(' ').map(n => n[0]).join('')}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold">{item.author}</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.timestamp}</span>
                </div>

                {item.type === 'status-change' && (
                  <div className="flex items-center gap-2 p-2.5 rounded-md" style={{ backgroundColor: 'var(--bg-base)' }}>
                    <span className="text-xs px-2 py-0.5 rounded font-medium bg-blue-500/15 text-blue-400">{item.fromStatus}</span>
                    <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} />
                    <span className="text-xs px-2 py-0.5 rounded font-medium bg-red-500/15 text-red-400">{item.toStatus}</span>
                  </div>
                )}

                {item.type === 'comment' && (
                  <p className="text-sm leading-relaxed">{item.comment}</p>
                )}

                {item.type === 'system' && (
                  <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
                )}

                {item.type === 'comment' && (
                  <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                    <button className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <Heart size={12} /> {item.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <MessageSquare size={12} /> Comment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ToolbarBtn({ icon, title }) {
  return (
    <button
      title={title}
      className="p-1.5 rounded transition-colors hover:bg-gray-500/20"
      style={{ color: 'var(--text-muted)' }}
    >
      {icon}
    </button>
  );
}

/* ── Related Tab ─────────────────────────────────────────── */
function RelatedTab({ workOrders, parts, documents }) {
  return (
    <div className="space-y-5">
      {/* Work Orders */}
      <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <ClipboardList size={16} style={{ color: 'var(--text-muted)' }} />
            Work Orders ({workOrders.length})
          </h3>
          <button className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'var(--accent)', color: '#1f2937' }}>
            New WO
          </button>
        </div>
        <div className="space-y-3">
          {workOrders.map(wo => (
            <div key={wo.id} className="p-3 rounded-md cursor-pointer transition-colors hover:opacity-90" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-sm">{wo.number}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${statusColor(wo.status)}`}>
                  {wo.status}
                </span>
              </div>
              <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{wo.description}</p>
              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>Tech: {wo.technician}</span>
                <span>Due: {wo.dueDate}</span>
              </div>
              {wo.progress !== undefined && (
                <div className="mt-2">
                  <div className="w-full h-1.5 rounded-full bg-gray-700">
                    <div className="h-full rounded-full bg-brand-blue" style={{ width: `${wo.progress}%` }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {workOrders.length > 0 && (
          <button className="mt-3 text-xs font-medium text-brand-blue hover:underline">
            View All {workOrders.length} Work Orders →
          </button>
        )}
      </div>

      {/* Parts Requests */}
      <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Package size={16} style={{ color: 'var(--text-muted)' }} />
            Parts Requests ({parts.length})
          </h3>
          <button className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'var(--accent)', color: '#1f2937' }}>
            Request Part
          </button>
        </div>
        <div className="space-y-3">
          {parts.map(part => (
            <div key={part.id} className="p-3 rounded-md" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-sm">{part.description}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-muted)' }}>
                  Qty: {part.quantity}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>Part: {part.partNumber}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${statusColor(part.status)}`}>
                  {part.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents */}
      <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
          <FileText size={16} style={{ color: 'var(--text-muted)' }} />
          Documents
        </h3>
        <div className="space-y-2">
          {documents.map(doc => (
            <div
              key={doc.id}
              className="flex items-center gap-3 p-2.5 rounded-md cursor-pointer transition-colors hover:opacity-90"
              style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)' }}
            >
              <FileText size={16} style={{ color: 'var(--text-muted)' }} />
              <span className="flex-1 text-sm font-medium truncate">{doc.name}</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{doc.size}</span>
              <button className="p-1 rounded hover:bg-gray-500/20" style={{ color: 'var(--text-muted)' }}>
                <Download size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Log Tab ─────────────────────────────────────────────── */
function LogTab({ auditLog }) {
  const [userFilter, setUserFilter] = useState('');
  const [fieldFilter, setFieldFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const users = [...new Set(auditLog.map(e => e.user))];
  const fields = [...new Set(auditLog.map(e => e.field))];

  const filtered = auditLog.filter(e => {
    if (userFilter && e.user !== userFilter) return false;
    if (fieldFilter && e.field !== fieldFilter) return false;
    if (dateFilter && !e.date.includes(dateFilter)) return false;
    return true;
  });

  const hasFilters = userFilter || fieldFilter || dateFilter;

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <select
          value={userFilter}
          onChange={e => setUserFilter(e.target.value)}
          className="px-3 py-2 rounded-md text-sm min-w-[140px]"
          style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
        >
          <option value="">Filter by User</option>
          {users.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        <select
          value={fieldFilter}
          onChange={e => setFieldFilter(e.target.value)}
          className="px-3 py-2 rounded-md text-sm min-w-[140px]"
          style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
        >
          <option value="">Filter by Field</option>
          {fields.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <select
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          className="px-3 py-2 rounded-md text-sm min-w-[140px]"
          style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
        >
          <option value="">Filter by Date</option>
          <option value="Oct 26">Oct 26, 2026</option>
          <option value="Oct 25">Oct 25, 2026</option>
          <option value="Oct 24">Oct 24, 2026</option>
        </select>
        {hasFilters && (
          <button
            onClick={() => { setUserFilter(''); setFieldFilter(''); setDateFilter(''); }}
            className="px-3 py-2 rounded-md text-sm flex items-center gap-1"
            style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          >
            <X size={12} /> Clear All
          </button>
        )}
      </div>

      {/* Entries */}
      <div className="space-y-4">
        {filtered.map(entry => (
          <div key={entry.id} className="rounded-lg p-4 transition-colors hover:opacity-95" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-start gap-4">
              <div className="min-w-[90px]">
                <div className="text-xs font-semibold">{entry.date}</div>
                <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{entry.time}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue text-[10px] font-bold">
                    {entry.user.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-sm font-semibold">{entry.user}</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>updated</span>
                  <span className="text-sm font-medium">{entry.field}</span>
                </div>

                {entry.type === 'field-update' && (
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>From:</span>
                    <span className="text-xs px-2 py-0.5 rounded font-mono bg-red-500/15 text-red-400">{entry.oldValue}</span>
                    <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} />
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>To:</span>
                    <span className="text-xs px-2 py-0.5 rounded font-mono bg-green-500/15 text-green-400">{entry.newValue}</span>
                  </div>
                )}

                {entry.type === 'text-update' && (
                  <details className="mt-2">
                    <summary className="text-xs font-medium text-brand-blue cursor-pointer">View changes</summary>
                    <div className="grid grid-cols-2 gap-3 mt-2 p-2.5 rounded-md" style={{ backgroundColor: 'var(--bg-base)' }}>
                      <div className="p-2 rounded-md bg-red-500/10 border border-red-500/20">
                        <strong className="text-[11px] block mb-1 text-red-400">Previous:</strong>
                        <p className="text-xs font-mono whitespace-pre-wrap">{entry.oldValue}</p>
                      </div>
                      <div className="p-2 rounded-md bg-green-500/10 border border-green-500/20">
                        <strong className="text-[11px] block mb-1 text-green-400">Current:</strong>
                        <p className="text-xs font-mono whitespace-pre-wrap">{entry.newValue}</p>
                      </div>
                    </div>
                  </details>
                )}

                {entry.type === 'system-event' && (
                  <p className="text-sm italic mt-1" style={{ color: 'var(--text-muted)' }}>{entry.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>
            No log entries match the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
