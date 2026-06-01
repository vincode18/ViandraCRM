import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Edit, User, MapPin, Phone, Mail,
  AlertTriangle, CheckCircle, Clock, TrendingUp,
  History, FileText, AlertCircle, MoreVertical,
  Bold, Italic, AtSign, Paperclip, Heart, MessageSquare,
  ClipboardList, Package, Download, X, ArrowRight,
  Check
} from 'lucide-react';
import api from '../utils/api';
import EditableField from '../components/EditableField';

/* ── Status Mapping (UIC-001) ────────────────────────────────────────────── */
const CASE_STATUS_MAPPING = {
  Open: { color: '#4A90E2', bg: 'rgba(74, 144, 226, 0.1)', workflow: 0 },
  Assigned: { color: '#0073E6', bg: 'rgba(0, 115, 230, 0.1)', workflow: 1 },
  'In Progress': { color: '#FFB81C', bg: 'rgba(255, 184, 28, 0.1)', workflow: 2 },
  Resolved: { color: '#34C759', bg: 'rgba(52, 199, 89, 0.1)', workflow: 3 },
  Closed: { color: '#6C7681', bg: 'rgba(108, 118, 129, 0.1)', workflow: 4 },
};

const statusColor = (s) => {
  const mapping = CASE_STATUS_MAPPING[s];
  if (!mapping) return 'bg-gray-500/20 text-gray-400';
  return { backgroundColor: mapping.bg, color: mapping.color };
};

const statusBadgeClass = (s) => {
  const mapping = CASE_STATUS_MAPPING[s];
  if (!mapping) return 'bg-gray-500/20 text-gray-400';
  return { backgroundColor: mapping.bg, color: mapping.color, border: `1px solid ${mapping.color}` };
};

const priorityColor = (p) => {
  if (p === 'Critical') return { backgroundColor: 'rgba(231, 76, 60, 0.1)', color: '#E74C3C', border: '1px solid #E74C3C' };
  if (p === 'High') return { backgroundColor: 'rgba(255, 159, 10, 0.1)', color: '#FF9F0A', border: '1px solid #FF9F0A' };
  if (p === 'Medium') return { backgroundColor: 'rgba(255, 184, 28, 0.1)', color: '#FFB81C', border: '1px solid #FFB81C' };
  return { backgroundColor: 'rgba(52, 199, 89, 0.1)', color: '#34C759', border: '1px solid #34C759' };
};

/* ── component ──────────────────────────────────────────── */
export default function CaseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [statusToast, setStatusToast] = useState(null);
  const [caseParameter, setCaseParameter] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  /* Close dropdown when clicking outside */
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const [caseData, setCaseData] = useState(null);

  const fmtDT = (v) => v
    ? new Date(v).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '';
  const fmtD = (v) => v ? new Date(v).toLocaleDateString('en-GB') : '';

  const mapApiDto = (dto) => ({
    // Identity
    caseID:         dto.caseID,
    caseNumber:     dto.caseNumber,
    caseType:       dto.caseType ?? '',
    priority:       dto.priority ?? '',
    status:         dto.status ?? 'Open',
    milestoneStatus: dto.milestoneStatus ?? 'Open',
    progress:       ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'],

    // Section 1: Case Information
    accountID:      dto.accountID ?? null,
    accountName:    dto.accountName ?? '',
    accountTier:    '',
    contactID:      dto.contactID ?? null,
    primaryContact: dto.contactName ?? '',
    contactEmail:   dto.contactEmail ?? '',
    contactPhone:   '',
    contactTitle:   dto.contactTitle ?? '',
    assetID:        dto.assetID ?? null,
    assetName:      dto.assetName ?? '',
    assetId:        dto.assetID ?? '',
    assetModel:     '',
    location:       dto.location ?? '',
    plant:          dto.plant ?? '',
    serviceArea:    dto.serviceArea ?? '',
    owner:          dto.assignedOwnerName ?? 'Unassigned',

    // Section 2: Case Informant
    informantName:     dto.informantName ?? '',
    informantEmail:    dto.informantEmail ?? '',
    informantPosition: dto.informantPosition ?? '',

    // Section 3: Case Details
    subject:           dto.subject ?? '',
    parentCaseID:      dto.parentCaseID ?? '',
    description:       dto.description ?? '',
    direction:         dto.direction ?? '',
    caseOrigin:        dto.caseOrigin ?? '',
    smrProblem:        dto.smrProblem ?? '',
    dateTimeOpened:    fmtDT(dto.dateTimeOpened),
    objectPart:        dto.objectPart ?? '',
    specificObjectPart: dto.specificObjectPart ?? '',
    cause:             dto.cause ?? '',
    callType:          dto.callType ?? '',
    damage:            dto.damage ?? '',
    subcallType:       dto.subcallType ?? '',
    descriptionUpdate: dto.descriptionUpdate ?? '',
    sapStatus:         dto.sapStatus ?? '',
    csRating:          dto.csRating ?? '',
    closeReason:       dto.closeReason ?? '',
    emr:               dto.emr ?? '',
    waUpdateProgress:  dto.waUpdateProgress ?? '',
    troubleDate:       fmtD(dto.troubleDate),
    waClosingUpdate:   dto.waClosingUpdate ?? '',
    waNumber:          dto.waNumber ?? '',
    waDescription:     dto.waDescription ?? '',
    category:          dto.category ?? '',
    subCategory:       dto.subCategory ?? '',

    // Section 4: Completion OTIF
    otifMechStart:  fmtDT(dto.otifMechStart),
    otifMechTarget: fmtDT(dto.otifMechTarget),
    otifSolStart:   fmtDT(dto.otifSolStart),
    otifSolTarget:  fmtDT(dto.otifSolTarget),

    // Section 5: Backdate
    backdateMech:   fmtDT(dto.backdateMech),
    backdateSol:    fmtDT(dto.backdateSol),
    reasonBackdate: dto.reasonBackdate ?? '',
    reasonOthers:   dto.reasonOthers ?? '',

    // Section 6: OTIF Status
    otifMechStatus:    dto.otifMechStatus ?? '',
    notOtifMech:       dto.notOtifMech ?? false,
    notOtifMechReason: dto.notOtifMechReason ?? '',
    omCompensation:    dto.omCompensation ?? '',
    otifSolStatus:     dto.otifSolStatus ?? '',
    notOtifSol:        dto.notOtifSol ?? false,
    notOtifSolReason:  dto.notOtifSolReason ?? '',

    // Section 7: Billing
    billingAccount:         dto.billingAccount ?? '',
    billingSalesOffice:     dto.billingSalesOffice ?? '',
    billingDivision:        dto.billingDivision ?? '',
    billingSalesOfficeCode: dto.billingSalesOfficeCode ?? '',
    billingContactName:     dto.billingContactName ?? '',

    // Section 8: Additional Info
    dtAssigned:         fmtDT(dto.dtAssigned),
    approvalStatus:     dto.approvalStatus ?? '',
    dtInProgress:       fmtDT(dto.dtInProgress),
    needManPower:       dto.needManPower ?? false,
    dtResolved:         fmtDT(dto.dtResolved),
    caseCancel:         dto.caseCancel ?? false,
    dtSupervisorApprove: fmtDT(dto.dtSupervisorApprove),

    // Section 9: System
    createdDate:     fmtD(dto.createdDate),
    createdBy:       dto.createdBy ? String(dto.createdBy) : 'System',
    lastUpdatedDate: fmtD(dto.lastModifiedDate),
    lastUpdatedBy:   dto.lastModifiedBy ? String(dto.lastModifiedBy) : 'System',
    sfCaseNumber:    dto.caseNumber ?? '',

    // SLA
    slaStatus:           dto.slaStatus ?? 'OnTrack',
    slaResponseTarget:   fmtDT(dto.slaResponseTarget),
    slaResolutionTarget: fmtDT(dto.slaResolutionTarget),
    slaDaysOverdue:      0,
    slaCompliance:       dto.complianceScore ?? null,
    startDate:           fmtDT(dto.startDate),
    targetDate:          fmtDT(dto.targetResolutionDate),
    completionNote:      dto.completionNote ?? '',
    closedDate:          fmtDT(dto.closedDate),
  });

  useEffect(() => {
    let alive = true;
    const loadCaseDetail = async () => {
      setLoading(true);
      setError('');

      // Primary: /cases/{id} using integer caseID
      try {
        const res = await api.get(`/cases/${id}`);
        const dto = res.data?.data;
        if (alive && dto) {
          setCaseData(mapApiDto(dto));
          if (alive) setLoading(false);
          return;
        }
      } catch (apiErr) {
        console.warn('Direct API fetch failed:', apiErr.message);
      }

      // Fallback: /cases/detail/{id} also accepts case number strings
      try {
        const res2 = await api.get(`/cases/detail/${encodeURIComponent(id)}`);
        const dto2 = res2.data?.data;
        if (alive && dto2) {
          setCaseData(mapApiDto(dto2));
          if (alive) setLoading(false);
          return;
        }
      } catch (apiErr2) {
        console.warn('Detail endpoint also failed:', apiErr2.message);
      }

      if (alive) {
        setError('Case not found.');
        setLoading(false);
      }
    };
    loadCaseDetail();
    return () => { alive = false; };
  }, [id]);

  /* ── live data (empty until API integration) ─────────── */
  const feedItems = [];
  const workOrders = [];
  const parts = [];
  const documents = [];
  const [auditLog, setAuditLog] = useState([]);

  const currentStepIndex = caseData ? caseData.progress.indexOf(caseData.status) : -1;
  const effectiveCaseParam = caseParameter !== null ? caseParameter : currentStepIndex + 1;

  const handleMilestoneClick = (idx) => {
    // Any future (not-yet-accessed) stage is selectable for highlighting.
    // The Mark Status button enforces the single-stage-advance rule separately.
    if (idx > currentStepIndex) {
      setSelectedMilestone(idx === selectedMilestone ? null : idx);
    }
  };

  const handleMarkStatus = () => {
    if (selectedMilestone === null) return;
    // Validation: selectedParam must be exactly currentParam + 1 (no skipping)
    const currentParam = currentStepIndex + 1;
    const selectedParam = selectedMilestone + 1;
    if (selectedParam !== currentParam + 1) return;

    const oldStatus = caseData.status;
    const newStatus = caseData.progress[selectedMilestone];
    const newParam = selectedParam;

    // Build timestamp for the new timeline entry
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const newEntry = {
      id: Date.now(),
      timestamp: now.toISOString(),
      date: dateStr,
      time: timeStr,
      user: 'System User',
      field: 'Status',
      type: 'field-update',
      oldValue: oldStatus,
      newValue: newStatus,
      note: `${now.toISOString()} - Status: ${oldStatus} → ${newStatus} (Parameter updated: ${newParam})`,
    };

    // Update case_parameter + status (persisted to backend in a real deployment)
    setCaseData(prev => ({ ...prev, status: newStatus, lastUpdatedDate: `${dateStr}, ${timeStr}` }));
    setCaseParameter(newParam);
    setAuditLog(prev => [newEntry, ...prev]);
    setStatusToast(`Status updated to: ${newStatus} (Parameter: ${newParam})`);
    setSelectedMilestone(null);
    setTimeout(() => setStatusToast(null), 3500);
  };

  // Button only valid when the selected stage is exactly one ahead of current
  const isMilestoneButtonEnabled =
    selectedMilestone !== null &&
    selectedMilestone === currentStepIndex + 1;

  /* ── render ─────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-muted)' }}>
        <div className="text-sm animate-pulse">Loading case details…</div>
      </div>
    );
  }
  if (!caseData) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-muted)' }}>
        <div className="text-sm">{error || 'Case not found.'}</div>
      </div>
    );
  }

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

        {/* Top row: title+inline buttons LEFT  |  action buttons RIGHT */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>

          {/* LEFT — case title + Edit + Change Owner + ⋮ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div>
              <h1 className="text-xl font-bold" style={{ lineHeight: 1.2 }}>
                Case #: {loading ? 'Loading…' : caseData.caseNumber}
              </h1>
              {!loading && caseData.subject && (
                <p className="text-sm" style={{ color: 'var(--text-muted)', marginTop: 2, fontWeight: 400 }}>
                  {caseData.subject}
                </p>
              )}
            </div>
            <button
              onClick={() => navigate(`/cases/${id}/edit`)}
              className="flex items-center gap-1.5 text-sm transition-colors"
              style={{ padding: '5px 11px', border: '1px solid var(--border)', borderRadius: 4, background: 'var(--bg-card)', color: '#0070d2', fontWeight: 500 }}
            >
              <Edit size={13} /> Edit
            </button>
            <button
              className="flex items-center gap-1.5 text-sm transition-colors"
              style={{ padding: '5px 11px', border: '1px solid var(--border)', borderRadius: 4, background: 'var(--bg-card)', color: '#0070d2', fontWeight: 500 }}
            >
              <User size={13} /> Change Owner
            </button>
            <button
              className="flex items-center justify-center transition-colors"
              style={{ width: 30, height: 30, border: '1px solid var(--border)', borderRadius: 4, background: 'var(--bg-card)', color: 'var(--text-muted)' }}
            >
              <MoreVertical size={15} />
            </button>
          </div>

          {/* RIGHT — + Follow, New Note, Accept, Delete, ▼ dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }} ref={dropdownRef}>
            {['+  Follow', 'New Note', 'Accept', 'Delete'].map(label => (
              <button
                key={label}
                className="flex items-center gap-1.5 text-sm transition-colors"
                style={{ padding: '5px 11px', border: '1px solid #c9d1d9', borderRadius: 4, background: '#fff', color: '#0070d2', fontWeight: 500, whiteSpace: 'nowrap' }}
              >
                {label}
              </button>
            ))}

            {/* Dropdown caret ▼ */}
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              aria-label="More actions"
              aria-expanded={dropdownOpen}
              style={{ width: 30, height: 30, border: '1px solid #c9d1d9', borderRadius: 4, background: '#fff', color: '#0070d2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}
            >
              ▼
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, minWidth: 210, background: '#fff', border: '1px solid #d6dde4', borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.18)', padding: '6px 0', zIndex: 100 }}>
                {[
                  { label: 'Change Record Type' },
                  { label: 'Clone' },
                  { label: 'Printable View' },
                  { label: 'Change Owner' },
                  { divider: true },
                  { label: 'Edit', action: () => navigate(`/cases/${id}/edit`) },
                  { label: 'Sharing' },
                  { divider: true },
                  { label: 'Send WA Update' },
                  { label: 'Send Closing WA Update' },
                ].map((item, i) =>
                  item.divider
                    ? <div key={i} style={{ height: 1, background: '#e5e9ee', margin: '5px 0' }} />
                    : (
                        <div
                          key={item.label}
                          onClick={() => { setDropdownOpen(false); item.action && item.action(); /* add item-specific action here */ }}
                          style={{ display: 'block', padding: '7px 16px', fontSize: 13, color: '#0070d2', cursor: 'pointer', whiteSpace: 'nowrap' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f0f6fd'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          {item.label}
                        </div>
                      )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Badges row — priority + status */}
        <div className="flex items-center gap-3" style={{ marginTop: 10 }}>
          <span className="px-2 py-0.5 rounded text-xs font-medium" style={priorityColor(caseData.priority)}>
            {caseData.priority} Priority
          </span>
          <span className="px-2 py-0.5 rounded text-xs font-medium" style={statusBadgeClass(caseData.status)}>
            {caseData.status}
          </span>
        </div>

        {/* ── Interactive Chevron Milestone Bar — sample.html approach ── */}

        {/* Outer card: uses CSS vars so it inverts correctly in dark mode */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, padding: '16px 16px 16px 14px', marginTop: 14 }}>

          {/* Inner flex row: milestones + Mark Status button */}
          <div
            role="progressbar"
            aria-label="Case status workflow"
            aria-valuemin={1}
            aria-valuemax={caseData.progress.length}
            aria-valuenow={currentStepIndex + 1}
            style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}
          >
            {/* Chevron segments — direct children, no wrapper div */}
            {caseData.progress.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isActive    = idx === currentStepIndex;
              const isFuture    = idx > currentStepIndex;
              const isSelected  = selectedMilestone === idx;
              const paramValue  = idx + 1;
              const statusText  = isCompleted ? 'completed' : isActive ? 'active' : 'disabled';

              /* --tip value: depth of arrow tip and V-notch (keep consistent) */
              const TIP = 20;

              /* clip-path: first segment has straight left, rest have V-notch */
              const clipFirst = `polygon(0 0, calc(100% - ${TIP}px) 0, 100% 50%, calc(100% - ${TIP}px) 100%, 0 100%)`;
              const clipRest  = `polygon(0 0, calc(100% - ${TIP}px) 0, 100% 50%, calc(100% - ${TIP}px) 100%, 0 100%, ${TIP}px 50%)`;

              /* Colors — todo uses CSS vars so dark mode inverts correctly */
              const bg = isCompleted ? '#2bbb4e' : isActive ? '#1d7ed8' : 'var(--bg-lighter)';
              const fg = isFuture ? 'var(--text-tertiary)' : '#fff';

              return (
                <div
                  key={step}
                  data-parameter={paramValue}
                  onClick={() => isFuture ? handleMilestoneClick(idx) : undefined}
                  role={isFuture ? 'button' : undefined}
                  tabIndex={isFuture ? 0 : undefined}
                  onKeyDown={e => isFuture && (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), handleMilestoneClick(idx))}
                  aria-label={`Stage ${idx + 1}: ${step}, Parameter: ${paramValue}, Status: ${statusText}`}
                  aria-current={isActive ? 'step' : undefined}
                  style={{
                    flex: 1,
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: bg,
                    color: fg,
                    fontWeight: 600,
                    fontSize: 14,
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                    cursor: isFuture ? 'pointer' : 'default',
                    transition: 'filter 0.2s ease, box-shadow 0.2s ease',
                    /* Negative margin creates interlocking overlap — same formula as sample.html */
                    marginLeft: idx === 0 ? 0 : -(TIP - 2),
                    /* Text padding compensates for V-notch so label stays centred */
                    paddingLeft: idx === 0 ? 8 : TIP,
                    clipPath: idx === 0 ? clipFirst : clipRest,
                    boxShadow: isSelected ? 'inset 0 0 0 3px #FFD700' : 'none',
                  }}
                >
                  {(isCompleted || isActive) && (
                    <Check size={13} strokeWidth={3} style={{ marginRight: 6, flexShrink: 0 }} />
                  )}
                  {step}
                </div>
              );
            })}

            {/* Mark Status button — same height as chevrons, aligned in the same flex row */}
            <button
              onClick={handleMarkStatus}
              disabled={!isMilestoneButtonEnabled}
              aria-label={isMilestoneButtonEnabled ? `Mark status as ${caseData.progress[selectedMilestone]}` : 'Select a milestone to advance status'}
              style={{
                flexShrink: 0,
                height: 56,
                marginLeft: 12,
                padding: '0 20px',
                background: isMilestoneButtonEnabled ? '#1d7ed8' : 'var(--bg-lighter)',
                color: isMilestoneButtonEnabled ? '#fff' : 'var(--text-tertiary)',
                border: 'none',
                borderRadius: 4,
                fontWeight: 600,
                fontSize: 13,
                cursor: isMilestoneButtonEnabled ? 'pointer' : 'not-allowed',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              {isMilestoneButtonEnabled ? 'Mark Status ↗' : 'Select a Milestone'}
            </button>
          </div>
        </div>
        {/* Success Toast */}
        {statusToast && (
          <div
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-xl"
            style={{
              backgroundColor: '#34C759',
              color: '#fff',
              fontWeight: 600,
              fontSize: 14,
              animation: 'slideInRight 0.3s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            <Check size={16} /> {statusToast}
          </div>
        )}
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
        {/* ── Left Panel (FRD §5: Customer Personal Data) ─ */}
        <div className="w-72 flex-shrink-0 overflow-y-auto p-4 border-r" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-panel)' }}>
          {/* Account Details */}
          <Card title="Account" icon={<User size={14} />}>
            <div className="font-semibold text-sm mb-1">{caseData.accountName || <span style={{ color: 'var(--text-muted)' }}>—</span>}</div>
            {caseData.accountTier && (
              <span className="text-[10px] px-2 py-0.5 rounded font-medium" style={{ backgroundColor: 'rgba(74,144,226,0.12)', color: '#4A90E2' }}>
                {caseData.accountTier}
              </span>
            )}
            {caseData.serviceArea && (
              <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Service Area: {caseData.serviceArea}</div>
            )}
            {caseData.plant && (
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Plant: {caseData.plant}</div>
            )}
          </Card>

          {/* Primary Contact */}
          <Card title="Primary Contact" icon={<Phone size={14} />}>
            <div className="text-sm font-semibold">{caseData.primaryContact || <span style={{ color: 'var(--text-muted)' }}>—</span>}</div>
            {caseData.contactTitle && <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{caseData.contactTitle}</div>}
            <div className="mt-2 space-y-1.5">
              {caseData.contactEmail && (
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Mail size={11} /> {caseData.contactEmail}
                </div>
              )}
              {caseData.contactPhone && (
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Phone size={11} /> {caseData.contactPhone}
                </div>
              )}
            </div>
          </Card>

          {/* Affected Asset */}
          {(caseData.assetName || caseData.assetId) && (
            <Card title="Affected Asset" icon={<ClipboardList size={14} />}>
              <div className="space-y-2">
                {caseData.assetName && <InfoField label="Asset" value={caseData.assetName} />}
                {caseData.assetId && <InfoField label="Asset ID" value={String(caseData.assetId)} />}
                {caseData.assetModel && <InfoField label="Model" value={caseData.assetModel} />}
                {caseData.location && (
                  <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <MapPin size={11} /> {caseData.location}
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Mini Work Orders placeholder (FRD LP-2) */}
          <Card title="Work Orders (0)" icon={<FileText size={14} />}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No linked Work Orders yet.</p>
          </Card>
        </div>

        {/* ── Center Panel ──────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: 'var(--bg-base)' }}>
          <div className="max-w-5xl space-y-5">
            {activeTab === 'details' && <DetailsTab caseData={caseData} caseParameter={effectiveCaseParam} onFieldSaved={(field, val) => setCaseData(prev => ({ ...prev, [field]: val }))} />}
            {activeTab === 'feed' && <FeedTab feedItems={feedItems} />}
            {activeTab === 'related' && <RelatedTab workOrders={workOrders} parts={parts} documents={documents} navigate={navigate} />}
            {activeTab === 'log' && <LogTab auditLog={auditLog} />}
          </div>
        </div>

        {/* ── Right Panel ───────────────────────────────── */}
        <div className="w-80 flex-shrink-0 overflow-y-auto p-4 border-l" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-panel)' }}>
          {/* SLA Status (Dynamic - FRD BR-201-A) */}
          {(() => {
            const sla = caseData?.slaStatus || 'OnTrack';
            const isBreached = sla === 'Breached';
            const isAtRisk   = sla === 'AtRisk';
            const slaColor   = isBreached ? '#E74C3C' : isAtRisk ? '#FFB81C' : '#34C759';
            const slaBg      = isBreached ? 'rgba(231,76,60,0.1)' : isAtRisk ? 'rgba(255,184,28,0.1)' : 'rgba(52,199,89,0.1)';
            const slaLabel   = isBreached ? 'OVER SLA – BREACHED' : isAtRisk ? 'SLA AT RISK' : 'SLA ON TRACK';
            const SlaIcon    = isBreached ? AlertTriangle : isAtRisk ? AlertCircle : CheckCircle;
            return (
              <div className="mb-4 rounded-lg p-4 border" style={{ backgroundColor: slaBg, borderColor: slaColor }}>
                <div className="flex items-start gap-3 mb-3">
                  <SlaIcon className="shrink-0" size={22} style={{ color: slaColor }} />
                  <div>
                    <h3 className="font-bold text-sm" style={{ color: slaColor }}>{slaLabel}</h3>
                    <span className="text-xs mt-1 block" style={{ color: 'var(--text-muted)' }}>
                      {caseData?.priority ? `Priority: ${caseData.priority}` : ''}
                      {caseData?.category ? ` · ${caseData.category}` : ''}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 mb-3 text-sm">
                  {caseData?.slaResponseTarget && (
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-tertiary)' }}>Response Target:</span>
                      <span className="font-medium text-xs" style={{ color: slaColor }}>{caseData.slaResponseTarget}</span>
                    </div>
                  )}
                  {caseData?.slaResolutionTarget && (
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-tertiary)' }}>Resolution Target:</span>
                      <span className="font-medium text-xs" style={{ color: slaColor }}>{caseData.slaResolutionTarget}</span>
                    </div>
                  )}
                  {caseData?.slaDaysOverdue > 0 && (
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-tertiary)' }}>Overdue:</span>
                      <span className="font-medium" style={{ color: '#E74C3C' }}>{caseData.slaDaysOverdue} Days</span>
                    </div>
                  )}
                </div>
                {caseData?.slaCompliance != null && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span style={{ color: 'var(--text-tertiary)' }}>SLA Compliance:</span>
                      <span className="font-medium" style={{ color: slaColor }}>{caseData.slaCompliance}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
                      <div className="h-full rounded-full" style={{ width: `${caseData.slaCompliance}%`, backgroundColor: slaColor }} />
                    </div>
                  </div>
                )}
                {isBreached && (
                  <button className="w-full py-2 rounded-lg text-sm font-medium transition-colors" style={{ backgroundColor: 'rgba(231,76,60,0.2)', color: '#E74C3C', border: '1px solid #E74C3C' }}>
                    Acknowledge Breach
                  </button>
                )}
              </div>
            );
          })()}

          {/* Performance Metrics */}
          {(caseData.slaResponseTarget || caseData.slaResolutionTarget) && (
            <Card title="Performance Metrics" icon={<TrendingUp size={14} />}>
              <div className="space-y-2">
                {caseData.slaResponseTarget && (
                  <div className="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-md" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>Response Target</span>
                    <span className="font-medium text-right" style={{ color: 'var(--text-main)' }}>{caseData.slaResponseTarget}</span>
                  </div>
                )}
                {caseData.slaResolutionTarget && (
                  <div className="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-md" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>Resolution Target</span>
                    <span className="font-medium text-right" style={{ color: 'var(--text-main)' }}>{caseData.slaResolutionTarget}</span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Case History (FRD RP-1) */}
          <Card title="Case History" icon={<History size={14} />}>
            <div className="space-y-3">
              {caseData.createdDate && (
                <div className="relative pl-4" style={{ borderLeft: '2px solid var(--border)' }}>
                  <div className="absolute left-0 top-1 w-2 h-2 rounded-full -translate-x-1/2" style={{ backgroundColor: 'var(--accent)' }} />
                  <div className="text-[11px] font-bold">CASE CREATED</div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{caseData.createdDate}</div>
                </div>
              )}
              {caseData.dtAssigned && (
                <div className="relative pl-4" style={{ borderLeft: '2px solid var(--border)' }}>
                  <div className="absolute left-0 top-1 w-2 h-2 rounded-full -translate-x-1/2" style={{ backgroundColor: '#4A90E2' }} />
                  <div className="text-[11px] font-bold">ASSIGNED</div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{caseData.dtAssigned}</div>
                </div>
              )}
              {caseData.dtInProgress && (
                <div className="relative pl-4" style={{ borderLeft: '2px solid var(--border)' }}>
                  <div className="absolute left-0 top-1 w-2 h-2 rounded-full -translate-x-1/2" style={{ backgroundColor: '#FFB81C' }} />
                  <div className="text-[11px] font-bold">IN PROGRESS</div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{caseData.dtInProgress}</div>
                </div>
              )}
              {caseData.dtResolved && (
                <div className="relative pl-4" style={{ borderLeft: '2px solid var(--border)' }}>
                  <div className="absolute left-0 top-1 w-2 h-2 rounded-full -translate-x-1/2" style={{ backgroundColor: '#34C759' }} />
                  <div className="text-[11px] font-bold">RESOLVED</div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{caseData.dtResolved}</div>
                </div>
              )}
              {caseData.closedDate && (
                <div className="relative pl-4" style={{ borderLeft: '2px solid var(--border)' }}>
                  <div className="absolute left-0 top-1 w-2 h-2 rounded-full -translate-x-1/2" style={{ backgroundColor: '#6C7681' }} />
                  <div className="text-[11px] font-bold">CLOSED</div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{caseData.closedDate}</div>
                </div>
              )}
              {!caseData.createdDate && !caseData.dtAssigned && (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No history yet.</p>
              )}
            </div>
          </Card>

          {/* Action Buttons (UIC-001) */}
          <Card title="ACTION BUTTONS" icon={<AlertCircle size={14} />}>
            <div className="space-y-2">
              <button className="w-full px-3 py-2 rounded text-xs font-medium flex items-center gap-2 transition-colors" style={{ backgroundColor: 'var(--accent)', color: '#1a1a1a' }}>
                <Check size={14} /> Mark Status as Complete
              </button>
              <button className="w-full px-3 py-2 rounded text-xs font-medium flex items-center gap-2 transition-colors" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <CheckCircle size={14} /> Accept
              </button>
              <button className="w-full px-3 py-2 rounded text-xs font-medium flex items-center gap-2 transition-colors" style={{ backgroundColor: 'rgba(231, 76, 60, 0.1)', border: '1px solid #E74C3C', color: '#E74C3C' }}>
                <AlertTriangle size={14} /> Acknowledge Breach
              </button>
              <button className="w-full px-3 py-2 rounded text-xs font-medium flex items-center gap-2 transition-colors" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <MessageSquare size={14} /> New Note
              </button>
              <button className="w-full px-3 py-2 rounded text-xs font-medium flex items-center gap-2 transition-colors" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <Heart size={14} /> Follow
              </button>
              <button className="w-full px-3 py-2 rounded text-xs font-medium flex items-center gap-2 transition-colors" style={{ backgroundColor: 'rgba(231, 76, 60, 0.1)', border: '1px solid #E74C3C', color: '#E74C3C' }}>
                <X size={14} /> Delete
              </button>
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
      <span style={{ color: 'var(--text-tertiary)' }}>{label}</span>
      <span style={{ color: 'var(--text-tertiary)' }}>{target}</span>
      <span className={`flex items-center gap-1 font-medium`} style={{ color: status === 'good' ? '#34C759' : '#E74C3C' }}>
        {value} {status === 'good' ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
      </span>
    </div>
  );
}

/* ── Details Tab — 9 sections per FRD 1.4.1 ─────────────── */
function DetailsTab({ caseData, caseParameter, onFieldSaved }) {
  const F = ({ label, value }) => (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</div>
      <div className="text-sm font-medium min-h-[1.25rem]">{value || <span style={{ color: 'var(--text-muted)' }}>—</span>}</div>
    </div>
  );
  const Section = ({ num, title, children }) => (
    <div className="rounded-lg p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-main)' }}>{num}. {title}</h3>
      {children}
    </div>
  );
  return (
    <>
      {/* Section 1 — Case Information */}
      <Section num="1" title="Case Information">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <F label="Account" value={caseData.accountName} />
          <F label="Contact" value={caseData.primaryContact} />
          <F label="Asset" value={caseData.assetName || (caseData.assetId ? String(caseData.assetId) : '')} />
          <F label="Plant" value={caseData.plant} />
          <F label="Service Area" value={caseData.serviceArea} />
          <F label="Case Owner" value={caseData.owner} />
        </div>
      </Section>

      {/* Section 2 — Case Informant */}
      <Section num="2" title="Case Informant">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <F label="Name (Case Creator)" value={caseData.informantName} />
          <F label="Email" value={caseData.informantEmail} />
          <F label="Position" value={caseData.informantPosition} />
        </div>
      </Section>

      {/* Section 3 — Case Details */}
      <Section num="3" title="Case Details">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div className="col-span-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>Subject</div>
            <div className="mt-1">
              <EditableField
                caseNumber={caseData.caseNumber}
                fieldName="subject"
                label="Subject"
                value={caseData.subject}
                type="text"
                onSaved={v => onFieldSaved('subject', v)}
              />
            </div>
          </div>
          <F label="Parent Case" value={caseData.parentCaseID} />
          <F label="Direction" value={caseData.direction} />
          <F label="Location" value={caseData.location} />
          <F label="Case Origin" value={caseData.caseOrigin} />
          <F label="SMR Problem" value={caseData.smrProblem} />
          <F label="Date/Time Opened" value={caseData.dateTimeOpened} />
          <F label="Object Part" value={caseData.objectPart} />
          <F label="Specific Object Part" value={caseData.specificObjectPart} />
          <F label="Case Type" value={
            <EditableField
              caseNumber={caseData.caseNumber}
              fieldName="caseType"
              label="Case Type"
              value={caseData.caseType}
              type="select"
              options={['Request','Incident','Problem','Change','Breakdown']}
              onSaved={v => onFieldSaved('caseType', v)}
            />
          } />
          <F label="Call Type" value={
            <EditableField
              caseNumber={caseData.caseNumber}
              fieldName="callType"
              label="Call Type"
              value={caseData.callType}
              type="select"
              options={['Inbound','Outbound','Internal','Escalation']}
              onSaved={v => onFieldSaved('callType', v)}
            />
          } />
          <F label="Cause" value={caseData.cause} />
          <F label="Damage" value={caseData.damage} />
          <F label="Subcall Type" value={caseData.subcallType} />
          <F label="Category" value={caseData.category} />
          <F label="Sub-Category" value={caseData.subCategory} />
          <F label="Status" value={
            <EditableField
              caseNumber={caseData.caseNumber}
              fieldName="status"
              label="Status"
              value={caseData.status}
              type="select"
              options={['Open','Assigned','In Progress','Resolved','Closed']}
              onSaved={v => onFieldSaved('status', v)}
            />
          } />
          <F label="Priority" value={
            <EditableField
              caseNumber={caseData.caseNumber}
              fieldName="priority"
              label="Priority"
              value={caseData.priority}
              type="select"
              options={['Critical','High','Medium','Low']}
              onSaved={v => onFieldSaved('priority', v)}
            />
          } />
          <F label="SAP Status" value={caseData.sapStatus} />
          <F label="CS Rating" value={caseData.csRating} />
          <F label="EMR" value={caseData.emr} />
          <F label="Trouble Date" value={caseData.troubleDate} />
          <F label="WA Number" value={caseData.waNumber} />
          <F label="Close Reason" value={caseData.closeReason} />
          <div className="col-span-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>Case Description</div>
            <div className="mt-1">
              <EditableField
                caseNumber={caseData.caseNumber}
                fieldName="description"
                label="Case Description"
                value={caseData.description}
                type="textarea"
                onSaved={v => onFieldSaved('description', v)}
              />
            </div>
          </div>
          {caseData.descriptionUpdate && (
            <div className="col-span-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>Description Update</div>
              <div className="text-sm whitespace-pre-wrap p-3 rounded-md" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)' }}>{caseData.descriptionUpdate}</div>
            </div>
          )}
          {caseData.waUpdateProgress && (
            <div className="col-span-2"><F label="WhatsApp Update Progress" value={caseData.waUpdateProgress} /></div>
          )}
          {caseData.waClosingUpdate && (
            <div className="col-span-2"><F label="WhatsApp Closing Update" value={caseData.waClosingUpdate} /></div>
          )}
          {caseData.waDescription && (
            <div className="col-span-2"><F label="WhatsApp Description" value={caseData.waDescription} /></div>
          )}
        </div>
      </Section>

      {/* Section 4 — Completion OTIF */}
      <Section num="4" title="Completion OTIF">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <F label="Start Date OTIF Mechanic" value={caseData.otifMechStart} />
          <F label="Target Date OTIF Mechanic" value={caseData.otifMechTarget} />
          <F label="Start Date OTIF Solution" value={caseData.otifSolStart} />
          <F label="Target Date OTIF Solution" value={caseData.otifSolTarget} />
        </div>
      </Section>

      {/* Section 5 — Backdate */}
      <Section num="5" title="Backdate">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <F label="Backdate OTIF Mechanic" value={caseData.backdateMech} />
          <F label="Backdate OTIF Solution" value={caseData.backdateSol} />
          <F label="Reason Backdate" value={caseData.reasonBackdate} />
          <F label="Reason for Others" value={caseData.reasonOthers} />
        </div>
      </Section>

      {/* Section 6 — OTIF Status */}
      <Section num="6" title="OTIF Status">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <F label="OTIF Mechanic Status" value={caseData.otifMechStatus} />
          <F label="NOT OTIF Mechanic" value={caseData.notOtifMech ? 'Yes' : 'No'} />
          <F label="NOT OTIF Mechanic Reason" value={caseData.notOtifMechReason} />
          <F label="OM Compensation Status" value={caseData.omCompensation} />
          <F label="OTIF Solution Status" value={caseData.otifSolStatus} />
          <F label="NOT OTIF Solution" value={caseData.notOtifSol ? 'Yes' : 'No'} />
          <F label="NOT OTIF Solution Reason" value={caseData.notOtifSolReason} />
        </div>
      </Section>

      {/* Section 7 — Billing */}
      <Section num="7" title="Billing">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <F label="Billing Account" value={caseData.billingAccount || caseData.accountName} />
          <F label="Billing Sales Office" value={caseData.billingSalesOffice} />
          <F label="Billing Division" value={caseData.billingDivision} />
          <F label="Billing Sales Office Code" value={caseData.billingSalesOfficeCode} />
          <F label="Billing Contact Name" value={caseData.billingContactName || caseData.primaryContact} />
        </div>
      </Section>

      {/* Section 8 — Additional Info */}
      <Section num="8" title="Additional Info">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <F label="Date/Time Assigned" value={caseData.dtAssigned} />
          <F label="Approval Status" value={caseData.approvalStatus} />
          <F label="Date/Time In Progress" value={caseData.dtInProgress} />
          <F label="Need Man Power" value={caseData.needManPower ? 'Yes' : 'No'} />
          <F label="Date/Time Resolved" value={caseData.dtResolved} />
          <F label="Case Cancel" value={caseData.caseCancel ? 'Yes' : 'No'} />
          <F label="Date/Time Supervisor Approve" value={caseData.dtSupervisorApprove} />
        </div>
      </Section>

      {/* Section 9 — System */}
      <Section num="9" title="System">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <F label="SF Case Number" value={caseData.caseNumber} />
          <F label="Milestone Status" value={caseData.milestoneStatus} />
          <F label="Created By" value={caseData.createdBy} />
          <F label="Created Date" value={caseData.createdDate} />
          <F label="Last Modified" value={caseData.lastUpdatedDate} />
          <F label="Last Modified By" value={caseData.lastUpdatedBy} />
        </div>
      </Section>
    </>
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

/* ── Related Tab (UIC-001) ─────────────────────────────────────────── */
function RelatedTab({ workOrders, parts, documents }) {
  return (
    <div className="space-y-5">
      {/* Work Order Object Structure (UIC-001) */}
      <div className="rounded-lg p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <ClipboardList size={16} style={{ color: 'var(--text-muted)' }} />
            WORK ORDER
          </h3>
          <button className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'var(--accent)', color: '#1a1a1a' }}>
            New WO
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <InfoField label="WO Number" value="SAP-21315419" />
            <InfoField label="Created" value="20/05/2026, 15:27" />
            <InfoField label="Plant" value="JBI" />
            <InfoField label="Work Center" value="FD-JBI" />
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
            <div className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>Schedule</div>
            <div className="space-y-2 text-xs pl-2 border-l-2" style={{ borderColor: 'var(--border)' }}>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-tertiary)' }}>Start:</span>
                <span style={{ color: 'var(--text-secondary)' }}>20/05/2026, 15:27</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-tertiary)' }}>End:</span>
                <span style={{ color: 'var(--text-tertiary)' }}>[Pending Assignment]</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-tertiary)' }}>Duration:</span>
                <span style={{ color: 'var(--text-tertiary)' }}>[Calculated]</span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
            <div className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>Work Details</div>
            <div className="space-y-2 text-xs pl-2 border-l-2" style={{ borderColor: 'var(--border)' }}>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-tertiary)' }}>Object Type:</span>
                <span style={{ color: 'var(--text-secondary)' }}>Equipment Repair</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-tertiary)' }}>Breakdown:</span>
                <span style={{ color: 'var(--text-secondary)' }}>[Standard breakdown]</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-tertiary)' }}>Cause Test:</span>
                <span style={{ color: '#FFB81C' }}>[In Progress]</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-tertiary)' }}>Damage Test:</span>
                <span style={{ color: 'var(--text-tertiary)' }}>[Pending]</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button className="px-3 py-2 rounded text-xs font-medium flex items-center gap-2" style={{ backgroundColor: 'var(--accent)', color: '#1a1a1a' }}>
              <Package size={12} /> Check Parts Availability
            </button>
            <button className="px-3 py-2 rounded text-xs font-medium flex items-center gap-2" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <Paperclip size={12} /> Upload Files
            </button>
          </div>
        </div>
      </div>

      {/* Work Orders List */}
      <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
          <ClipboardList size={16} style={{ color: 'var(--text-muted)' }} />
          Related Work Orders ({workOrders.length})
        </h3>
        <div className="space-y-3">
          {workOrders.map(wo => (
            <div key={wo.id} className="p-3 rounded-md cursor-pointer transition-colors hover:opacity-90" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-sm">{wo.number}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={statusBadgeClass(wo.status)}>
                  {wo.status}
                </span>
              </div>
              <p className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>{wo.description}</p>
              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-tertiary)' }}>
                <span>Tech: {wo.technician}</span>
                <span>Due: {wo.dueDate}</span>
              </div>
              {wo.progress !== undefined && (
                <div className="mt-2">
                  <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
                    <div className="h-full rounded-full" style={{ width: `${wo.progress}%`, backgroundColor: '#4A90E2' }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Parts Requests */}
      <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Package size={16} style={{ color: 'var(--text-muted)' }} />
            Parts Requests ({parts.length})
          </h3>
          <button className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'var(--accent)', color: '#1a1a1a' }}>
            Request Part
          </button>
        </div>
        <div className="space-y-3">
          {parts.map(part => (
            <div key={part.id} className="p-3 rounded-md" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-sm">{part.description}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-tertiary)' }}>
                  Qty: {part.quantity}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-tertiary)' }}>
                <span>Part: {part.partNumber}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={statusBadgeClass(part.status)}>
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
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{doc.size}</span>
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
                  <>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>From:</span>
                      <span className="text-xs px-2 py-0.5 rounded font-mono bg-red-500/15 text-red-400">{entry.oldValue}</span>
                      <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} />
                      <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>To:</span>
                      <span className="text-xs px-2 py-0.5 rounded font-mono bg-green-500/15 text-green-400">{entry.newValue}</span>
                    </div>
                    {entry.note && (
                      <p className="text-xs italic mt-1.5" style={{ color: 'var(--text-muted)' }}>{entry.note}</p>
                    )}
                  </>
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
