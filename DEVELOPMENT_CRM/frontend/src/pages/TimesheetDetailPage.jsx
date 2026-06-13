import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Timer, CheckCircle, XCircle, Clock, User, Calendar, FileText, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { timesheetById, entriesByTimesheet, TSE_STATUS_TOKENS } from '../utils/taskData';

function TSEStatusChip({ status }) {
  const t = TSE_STATUS_TOKENS[status] || TSE_STATUS_TOKENS['Draft'];
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: t.bg, color: t.text, border: `1px solid ${t.border}` }}>
      {t.label}
    </span>
  );
}

function InfoRow({ label, value, mono }) {
  return (
    <div className="flex items-start py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
      <span className="w-48 text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span className={`text-sm flex-1 ${mono ? 'font-mono' : ''}`} style={{ color: 'var(--text-secondary)' }}>
        {value ?? '—'}
      </span>
    </div>
  );
}

function CollapsibleSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)' }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold transition-colors hover:bg-gray-500/5"
        style={{ color: 'var(--text-main)' }}
      >
        {title}
        {open ? <ChevronUp size={15} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={15} style={{ color: 'var(--text-muted)' }} />}
      </button>
      {open && <div className="px-5 pb-4">{children}</div>}
    </div>
  );
}

export default function TimesheetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');

  const sheet = timesheetById(id);
  const entries = sheet ? entriesByTimesheet(sheet.id) : [];

  if (!sheet) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-base)' }}>
        <div className="text-center">
          <Timer size={40} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Timesheet not found: {id}</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-xs px-3 py-1.5 rounded"
            style={{ backgroundColor: 'var(--accent)', color: '#1a1a1a' }}>← Go Back</button>
        </div>
      </div>
    );
  }

  const totalActual = entries.reduce((s, e) => s + e.actualDuration, 0);
  const totalPlanned = entries.reduce((s, e) => s + e.plannedDuration, 0);
  const totalDev = totalActual - totalPlanned;

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ backgroundColor: 'var(--accent)', padding: '0 24px' }}>
        <div className="flex items-center gap-3 py-1.5">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs font-medium opacity-70 hover:opacity-100 transition-opacity" style={{ color: '#1a1a1a' }}>
            <ArrowLeft size={14} /> Back
          </button>
        </div>
        <div className="pb-4">
          <div className="flex items-center gap-3 mb-1">
            <Timer size={20} style={{ color: '#1a1a1a' }} />
            <h1 className="text-xl font-bold" style={{ color: '#1a1a1a' }}>{sheet.id}</h1>
            <TSEStatusChip status={sheet.status} />
          </div>
          <p className="text-sm font-medium" style={{ color: '#3a3a3a' }}>{sheet.workOrderRef} · {sheet.serviceResource}</p>
        </div>
      </div>

      {/* ── Action Bar ─────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-6 py-2.5" style={{ backgroundColor: 'var(--bg-panel)', borderBottom: '1px solid var(--border)' }}>
        {sheet.status === 'Submitted' && (
          <>
            <button className="px-4 py-1.5 rounded text-sm font-semibold flex items-center gap-2 transition-colors"
              style={{ backgroundColor: '#388E3C', color: '#fff' }}>
              <CheckCircle size={14} /> Approve
            </button>
            <button className="px-4 py-1.5 rounded text-sm font-semibold flex items-center gap-2 transition-colors"
              style={{ backgroundColor: '#C62828', color: '#fff' }}>
              <XCircle size={14} /> Reject
            </button>
          </>
        )}
        <button className="px-3 py-1.5 rounded text-sm flex items-center gap-2"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
          <Edit size={14} /> Edit
        </button>
        <button onClick={() => navigate(`/workorders/${encodeURIComponent(sheet.workOrderRef)}`)}
          className="px-3 py-1.5 rounded text-sm flex items-center gap-2"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
          <ExternalLink size={14} /> Open Work Order
        </button>
        {sheet.postedToSAP && (
          <span className="ml-2 text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{ backgroundColor: 'rgba(52,199,89,0.1)', color: '#34C759', border: '1px solid #34C75940' }}>
            ✓ Sent to SAP
          </span>
        )}
      </div>

      {/* ── Tabs ───────────────────────────────────────────── */}
      <div className="px-6 flex gap-5" style={{ backgroundColor: 'var(--bg-panel)', borderBottom: '1px solid var(--border)' }}>
        {['Details', 'Related'].map(tab => (
          <button key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-1 py-3 text-sm font-medium border-b-2 transition-colors
              ${activeTab === tab.toLowerCase() ? 'border-brand-blue' : 'border-transparent'}`}
            style={{ color: activeTab === tab.toLowerCase() ? 'var(--text-main)' : 'var(--text-muted)' }}>
            {tab}
          </button>
        ))}
      </div>

      {/* ── Two-Panel Body ─────────────────────────────────── */}
      <div className="flex-1 overflow-hidden flex">

        {/* Main Content (65%) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'details' && (
            <>
              {/* Summary Banner */}
              <div className="grid grid-cols-4 gap-4 rounded-lg p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                {[
                  { label: 'Total Actual', value: `${totalActual}H`, color: 'var(--text-main)' },
                  { label: 'Total Planned', value: `${totalPlanned}H`, color: 'var(--text-muted)' },
                  { label: 'Deviation', value: totalDev !== 0 ? `${totalDev > 0 ? '+' : ''}${totalDev}H` : '—', color: totalDev > 0 ? '#C62828' : totalDev < 0 ? '#388E3C' : 'var(--text-muted)' },
                  { label: 'Entries', value: entries.length, color: 'var(--text-main)' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className="text-xl font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Timesheet Entries Table */}
              <CollapsibleSection title="Timesheet Entries">
                <div className="rounded-lg overflow-hidden -mx-1 mt-1" style={{ border: '1px solid var(--border)' }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: 'var(--bg-base)', borderBottom: '1px solid var(--border)' }}>
                        {['Op #', 'Subject', 'Actual (H)', 'Planned (H)', 'Δ Deviation', 'Status', 'SAP', 'Remarks'].map(h => (
                          <th key={h} className="text-left px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider"
                            style={{ color: 'var(--text-muted)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((e, idx) => {
                        const dev = e.actualDuration - e.plannedDuration;
                        return (
                          <tr key={e.id} className="border-b"
                            style={{ borderColor: 'var(--border)', backgroundColor: idx % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-base)' }}>
                            <td className="px-3 py-2.5 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{e.operationNumber}</td>
                            <td className="px-3 py-2.5 text-sm font-medium" style={{ color: 'var(--text-main)' }}>{e.subject}</td>
                            <td className="px-3 py-2.5 font-mono text-sm">{e.actualDuration}</td>
                            <td className="px-3 py-2.5 font-mono text-sm" style={{ color: 'var(--text-muted)' }}>{e.plannedDuration}</td>
                            <td className="px-3 py-2.5 font-mono text-sm font-semibold"
                              style={{ color: dev > 0 ? '#C62828' : dev < 0 ? '#388E3C' : 'var(--text-muted)' }}>
                              {dev > 0 ? `+${dev}` : dev < 0 ? `${dev}` : '—'}
                            </td>
                            <td className="px-3 py-2.5"><TSEStatusChip status={e.status} /></td>
                            <td className="px-3 py-2.5">
                              {e.sentToSAP
                                ? <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(52,199,89,0.1)', color: '#34C759' }}>✓</span>
                                : <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>—</span>}
                            </td>
                            <td className="px-3 py-2.5 text-xs max-w-[160px] truncate" style={{ color: 'var(--text-tertiary)' }} title={e.remarks}>{e.remarks || '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CollapsibleSection>

              {/* Information Section */}
              <CollapsibleSection title="Information">
                <InfoRow label="Timesheet ID" value={sheet.id} mono />
                <InfoRow label="Work Order" value={sheet.workOrderRef} />
                <InfoRow label="Service Resource" value={sheet.serviceResource} />
                <InfoRow label="Service Territory" value={sheet.serviceTerritory} />
                <InfoRow label="Start Date" value={sheet.startDate} />
                <InfoRow label="End Date" value={sheet.endDate} />
                <InfoRow label="Total Duration" value={`${sheet.totalDuration}H`} mono />
                <InfoRow label="Entry Count" value={sheet.entryCount} />
                <InfoRow label="JA/JE Period" value={sheet.jaJe} />
                <InfoRow label="Submitted At" value={sheet.submittedAt} />
                <InfoRow label="Approved At" value={sheet.approvedAt} />
              </CollapsibleSection>

              {/* System Information */}
              <CollapsibleSection title="System Information" defaultOpen={false}>
                <InfoRow label="Created By" value={sheet.createdBy} />
                <InfoRow label="Created At" value={sheet.createdAt} />
                <InfoRow label="Last Modified By" value={sheet.lastModifiedBy} />
                <InfoRow label="Last Modified At" value={sheet.lastModifiedAt} />
                <InfoRow label="WO SF ID" value={sheet.workOrderSFId} mono />
                <InfoRow label="Owner" value={sheet.owner} />
              </CollapsibleSection>
            </>
          )}

          {activeTab === 'related' && (
            <div className="rounded-lg p-6 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No related records configured.</p>
            </div>
          )}
        </div>

        {/* Related Panel (35%) */}
        <div className="w-80 shrink-0 overflow-y-auto p-4 space-y-4" style={{ borderLeft: '1px solid var(--border)', backgroundColor: 'var(--bg-panel)' }}>
          {/* Work Order Link */}
          <div className="rounded-lg p-4" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Work Order</p>
            <button onClick={() => navigate(`/workorders/${encodeURIComponent(sheet.workOrderRef)}`)}
              className="flex items-center gap-2 text-sm font-semibold hover:underline"
              style={{ color: 'var(--accent)' }}>
              <FileText size={14} /> {sheet.workOrderRef}
            </button>
          </div>

          {/* Resource */}
          <div className="rounded-lg p-4" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Service Resource</p>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <User size={14} style={{ color: 'var(--text-muted)' }} /> {sheet.serviceResource}
            </div>
            <div className="flex items-center gap-2 text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              <Calendar size={11} /> {sheet.startDate}
            </div>
          </div>

          {/* Status History */}
          <div className="rounded-lg p-4" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Status Timeline</p>
            <div className="space-y-3">
              {[
                { label: 'Created', time: sheet.createdAt, done: true },
                { label: 'Submitted', time: sheet.submittedAt, done: !!sheet.submittedAt },
                { label: 'Approved', time: sheet.approvedAt, done: !!sheet.approvedAt },
                { label: 'Posted to SAP', time: sheet.postedAt, done: sheet.postedToSAP },
              ].map(s => (
                <div key={s.label} className="flex items-start gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold ${s.done ? 'bg-green-500/20' : 'bg-gray-500/10'}`}
                    style={{ color: s.done ? '#34C759' : 'var(--text-muted)' }}>
                    {s.done ? '✓' : '○'}
                  </div>
                  <div>
                    <div className="text-xs font-medium" style={{ color: s.done ? 'var(--text-secondary)' : 'var(--text-muted)' }}>{s.label}</div>
                    {s.time && <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{s.time}</div>}
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
