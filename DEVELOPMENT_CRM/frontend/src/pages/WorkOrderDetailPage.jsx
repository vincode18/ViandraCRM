import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Edit, ChevronDown, RefreshCw, MapPin, Phone, Mail, User, Calendar,
  Clock, FileText, ClipboardList, Wrench, Package, AlertCircle, MoreVertical,
  ChevronRight, CheckCircle, AlertTriangle, Plus, CalendarClock,
  ListChecks, Timer, ChevronUp, ExternalLink
} from 'lucide-react';
import api from '../utils/api';
import BookAppointmentModal from '../components/BookAppointmentModal';
import SAStatusBadge from '../components/SAStatusBadge';
import { formatDateTime } from '../utils/saData';
import {
  taskListItemsByWO, timesheetsByWO, entriesByTimesheet,
  OPERATION_STATUS_TOKENS, TSE_STATUS_TOKENS
} from '../utils/taskData';

// Work Order Status Mapping (UIC-001)
const WO_STATUS_MAPPING = {
  Open: { color: '#4A90E2', bg: 'rgba(74, 144, 226, 0.1)' },
  'In Progress': { color: '#FFB81C', bg: 'rgba(255, 184, 28, 0.1)' },
  Completed: { color: '#34C759', bg: 'rgba(52, 199, 89, 0.1)' },
  Cancelled: { color: '#6C7681', bg: 'rgba(108, 118, 129, 0.1)' },
  'On Hold': { color: '#FF9F0A', bg: 'rgba(255, 159, 10, 0.1)' },
  Scheduled: { color: '#0073E6', bg: 'rgba(0, 115, 230, 0.1)' },
};

function StatusBadge({ value }) {
  const mapping = WO_STATUS_MAPPING[value];
  if (!mapping) return <span className="badge badge-open">{value}</span>;
  return (
    <span style={{ backgroundColor: mapping.bg, color: mapping.color, border: `1px solid ${mapping.color}` }} className="px-2 py-0.5 rounded text-xs font-medium">
      {value}
    </span>
  );
}

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

/* ─── Task List Tab ─────────────────────────────────────────────────── */
function OperationStatusChip({ status }) {
  const t = OPERATION_STATUS_TOKENS[status] || OPERATION_STATUS_TOKENS['Not Started'];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
      style={{ backgroundColor: t.bg, color: t.text, border: `1px solid ${t.text}40` }}>
      <span style={{ fontSize: 9 }}>{t.icon}</span> {status}
    </span>
  );
}

function TaskListTab({ workOrderId, navigate }) {
  const items = taskListItemsByWO(workOrderId);
  const [sortField, setSortField] = useState('operationNumber');
  const [showNewModal, setShowNewModal] = useState(false);

  const sorted = [...items].sort((a, b) =>
    a[sortField]?.localeCompare?.(b[sortField]) ?? 0
  );

  const completed = items.filter(i => i.status === 'Completed').length;
  const total = items.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-main)' }}>Task List</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {completed}/{total} operations completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setSortField(sortField === 'operationNumber' ? 'status' : 'operationNumber')}
            className="text-xs px-3 py-1.5 rounded flex items-center gap-1"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            <ListChecks size={13} /> Sort by {sortField === 'operationNumber' ? 'Status' : 'Op#'}
          </button>
          <button onClick={() => setShowNewModal(true)}
            className="text-xs px-3 py-1.5 rounded flex items-center gap-1 font-semibold"
            style={{ backgroundColor: 'var(--accent)', color: '#1a1a1a' }}>
            <Plus size={13} /> New Task
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between text-xs mb-2">
          <span style={{ color: 'var(--text-muted)' }}>Progress</span>
          <span style={{ color: 'var(--text-secondary)' }}>{total > 0 ? Math.round((completed / total) * 100) : 0}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-base)' }}>
          <div className="h-full rounded-full transition-all"
            style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%`, backgroundColor: '#34C759' }} />
        </div>
      </div>

      {/* Operations Table */}
      {sorted.length === 0 ? (
        <div className="rounded-lg p-8 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <ListChecks size={32} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No task list items found for this Work Order.</p>
          <button onClick={() => setShowNewModal(true)} className="mt-3 text-xs px-3 py-1.5 rounded font-semibold"
            style={{ backgroundColor: 'var(--accent)', color: '#1a1a1a' }}>+ Add First Task</button>
        </div>
      ) : (
        <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
                {['Op #', 'Description', 'Duration', 'Status', 'Start Time', 'Complete Time', ''].map(h => (
                  <th key={h} className="text-left px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((item, idx) => (
                <tr key={item.id}
                  className="border-b transition-colors"
                  style={{ borderColor: 'var(--border)', backgroundColor: idx % 2 === 0 ? 'var(--bg-base)' : 'var(--bg-card)' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-light)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? 'var(--bg-base)' : 'var(--bg-card)'}
                >
                  <td className="px-3 py-2.5 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{item.operationNumber}</td>
                  <td className="px-3 py-2.5">
                    <div className="font-medium text-sm" style={{ color: 'var(--text-main)' }}>{item.description}</div>
                    {item.isSAPOverride && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded mt-0.5 inline-block"
                        style={{ backgroundColor: 'rgba(74,144,226,0.1)', color: '#4A90E2' }}>Override</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>{item.duration} {item.uom}</td>
                  <td className="px-3 py-2.5"><OperationStatusChip status={item.status} /></td>
                  <td className="px-3 py-2.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {item.startTime ? new Date(item.startTime).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td className="px-3 py-2.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {item.completeTime ? new Date(item.completeTime).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td className="px-3 py-2.5">
                    <button className="text-[10px] px-2 py-1 rounded" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Task Modal */}
      {showNewModal && (
        <NewTaskModal onClose={() => setShowNewModal(false)} />
      )}
    </div>
  );
}

function NewTaskModal({ onClose }) {
  const [desc, setDesc] = useState('');
  const [dur, setDur] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl p-6 shadow-2xl"
        style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
        <h3 className="text-base font-bold mb-4" style={{ color: 'var(--text-main)' }}>Add Manual Task</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Description *</label>
            <input value={desc} onChange={e => setDesc(e.target.value)}
              className="mt-1 w-full text-sm rounded-lg px-3 py-2"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
              placeholder="Task description" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Estimated Duration (H)</label>
            <input type="number" value={dur} onChange={e => setDur(e.target.value)}
              className="mt-1 w-full text-sm rounded-lg px-3 py-2"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
              placeholder="0" />
          </div>
          <div className="bg-yellow-500/10 rounded-lg p-3 text-xs" style={{ color: '#8B7500' }}>
            ⚠ This will create a manual task item. Manual items are marked with an Override badge.
          </div>
        </div>
        <div className="flex gap-2 mt-5 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded text-sm"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>Cancel</button>
          <button onClick={onClose} disabled={!desc}
            className="px-4 py-2 rounded text-sm font-semibold disabled:opacity-40"
            style={{ backgroundColor: 'var(--accent)', color: '#1a1a1a' }}>Add Task</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Timesheet Tab ──────────────────────────────────────────────────── */
function TSEStatusChip({ status }) {
  const t = TSE_STATUS_TOKENS[status] || TSE_STATUS_TOKENS['Draft'];
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
      style={{ backgroundColor: t.bg, color: t.text, border: `1px solid ${t.border}` }}>
      {t.label}
    </span>
  );
}

function TimesheetTab({ workOrderId, navigate }) {
  const sheets = timesheetsByWO(workOrderId);
  const [expandedId, setExpandedId] = useState(null);

  if (sheets.length === 0) {
    return (
      <div className="rounded-lg p-8 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <Timer size={32} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No timesheet entries found for this Work Order.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold" style={{ color: 'var(--text-main)' }}>Time Sheet Entries</h3>
        <button onClick={() => navigate('/timesheets/approval')}
          className="text-xs px-3 py-1.5 rounded flex items-center gap-1 font-semibold"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
          <ExternalLink size={12} /> Approval Queue
        </button>
      </div>

      <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
              {['Timesheet ID', 'Resource', 'Date', 'Duration', 'Status', 'SAP Posted', ''].map(h => (
                <th key={h} className="text-left px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sheets.map((sheet, idx) => {
              const entries = entriesByTimesheet(sheet.id);
              const isExpanded = expandedId === sheet.id;
              return (
                <React.Fragment key={sheet.id}>
                  <tr className="border-b transition-colors cursor-pointer"
                    style={{ borderColor: 'var(--border)', backgroundColor: idx % 2 === 0 ? 'var(--bg-base)' : 'var(--bg-card)' }}
                    onClick={() => setExpandedId(isExpanded ? null : sheet.id)}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-light)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? 'var(--bg-base)' : 'var(--bg-card)'}
                  >
                    <td className="px-3 py-2.5 font-mono text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                      <button onClick={e => { e.stopPropagation(); navigate(`/timesheets/${sheet.id}`); }}
                        className="hover:underline">{sheet.id}</button>
                    </td>
                    <td className="px-3 py-2.5 text-sm" style={{ color: 'var(--text-main)' }}>{sheet.serviceResource}</td>
                    <td className="px-3 py-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>{sheet.startDate}</td>
                    <td className="px-3 py-2.5 font-mono text-xs" style={{ color: 'var(--text-main)' }}>{sheet.totalDuration}H</td>
                    <td className="px-3 py-2.5"><TSEStatusChip status={sheet.status} /></td>
                    <td className="px-3 py-2.5">
                      {sheet.postedToSAP
                        ? <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(52,199,89,0.1)', color: '#34C759' }}>Posted</span>
                        : <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-muted)' }}>—</span>}
                    </td>
                    <td className="px-3 py-2.5">
                      {isExpanded ? <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} />
                        : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr style={{ backgroundColor: 'var(--bg-light)' }}>
                      <td colSpan={7} className="px-4 py-3">
                        <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Timesheet Entries</div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                {['Op #', 'Subject', 'Actual', 'Planned', 'Deviation', 'Status', 'Remarks'].map(h => (
                                  <th key={h} className="text-left px-2 py-1.5 font-semibold"
                                    style={{ color: 'var(--text-muted)' }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {entries.map(e => {
                                const dev = e.actualDuration - e.plannedDuration;
                                return (
                                  <tr key={e.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                                    <td className="px-2 py-1.5 font-mono" style={{ color: 'var(--text-muted)' }}>{e.operationNumber}</td>
                                    <td className="px-2 py-1.5" style={{ color: 'var(--text-secondary)' }}>{e.subject}</td>
                                    <td className="px-2 py-1.5 font-mono">{e.actualDuration}H</td>
                                    <td className="px-2 py-1.5 font-mono" style={{ color: 'var(--text-muted)' }}>{e.plannedDuration}H</td>
                                    <td className="px-2 py-1.5 font-mono"
                                      style={{ color: dev > 0 ? '#C62828' : dev < 0 ? '#388E3C' : 'var(--text-muted)' }}>
                                      {dev > 0 ? `+${dev}H` : dev < 0 ? `${dev}H` : '—'}
                                    </td>
                                    <td className="px-2 py-1.5"><TSEStatusChip status={e.status} /></td>
                                    <td className="px-2 py-1.5" style={{ color: 'var(--text-tertiary)' }}>{e.remarks || '—'}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div className="flex gap-2 mt-3 justify-end">
                          <button onClick={() => navigate(`/timesheets/${sheet.id}`)}
                            className="text-xs px-3 py-1.5 rounded flex items-center gap-1"
                            style={{ backgroundColor: 'var(--accent)', color: '#1a1a1a' }}>
                            <ExternalLink size={11} /> Open Timesheet Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function WorkOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookOpen, setBookOpen] = useState(false);
  const [feedEntries, setFeedEntries] = useState([]);

  const fallbackDetail = {
    workOrderNumber: '01275781',
    status: 'In Progress',
    priority: 'High',
    subject: 'TRS HYDRAULIK SYSTEM HO785',
    caseNumber: '01553477',
    accountName: 'SIMS JAYA KALTIM',
    assetName: 'GD785-7 : BO76',
    serialNumber: 'SN-785-BO76-2024',
    unitModel: 'Komatsu D85ESS-2',
    smr: '14,250',
    contactName: 'BURHAN',
    contactRole: 'Site Manager',
    contactPhone: '+62-811-222-3333',
    contactEmail: 'burhan@simsjayakaltim.co.id',
    createdDate: '20/05/2026',
    createdBy: 'System',
    startDate: '20/05/2026',
    targetDate: '25/05/2026',
    assignedMechanic: 'M. Rivera',
    plant: 'JBI',
    workCenter: 'FD-JBI',
  };

  const [woData, setWoData] = useState(fallbackDetail);

  useEffect(() => {
    let alive = true;
    const loadWoDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/workorders/detail/${encodeURIComponent(id)}`);
        const payload = response.data?.data;
        if (!alive) return;
        if (!payload) {
          setWoData(fallbackDetail);
          setError('Work order detail data was empty. Showing fallback layout.');
          return;
        }
        setWoData({
          workOrderNumber: payload.workOrderNumber || id,
          status: payload.status || 'Open',
          priority: payload.priority || 'Medium',
          subject: payload.subject || fallbackDetail.subject,
          caseNumber: payload.caseNumber || fallbackDetail.caseNumber,
          accountName: payload.accountName || fallbackDetail.accountName,
          assetName: payload.assetName || fallbackDetail.assetName,
          serialNumber: payload.serialNumber || fallbackDetail.serialNumber,
          unitModel: payload.unitModel || fallbackDetail.unitModel,
          smr: payload.smr || fallbackDetail.smr,
          contactName: payload.contactName || fallbackDetail.contactName,
          contactRole: payload.contactRole || fallbackDetail.contactRole,
          contactPhone: payload.contactPhone || fallbackDetail.contactPhone,
          contactEmail: payload.contactEmail || fallbackDetail.contactEmail,
          createdDate: payload.createdDate
            ? new Date(payload.createdDate).toLocaleDateString('en-GB')
            : fallbackDetail.createdDate,
          createdBy: payload.createdBy || fallbackDetail.createdBy,
          startDate: payload.startDate
            ? new Date(payload.startDate).toLocaleDateString('en-GB')
            : fallbackDetail.startDate,
          targetDate: payload.targetDate
            ? new Date(payload.targetDate).toLocaleDateString('en-GB')
            : fallbackDetail.targetDate,
          assignedMechanic: payload.assignedMechanic || fallbackDetail.assignedMechanic,
          plant: payload.plant || fallbackDetail.plant,
          workCenter: payload.workCenter || fallbackDetail.workCenter,
        });
      } catch (fetchError) {
        if (!alive) return;
        setError('Unable to load work order detail from the backend. Showing fallback dummy UI.');
        setWoData(fallbackDetail);
      } finally {
        if (alive) setLoading(false);
      }
    };
    loadWoDetail();
    return () => { alive = false; };
  }, [id]);

  // Mock data for related objects
  const relatedObjects = {
    workPlans: [
      { id: 1, name: 'Plan A - Hydraulic System Repair', status: 'Active' },
      { id: 2, name: 'Plan B - Component Replacement', status: 'Pending' },
    ],
    workSteps: [
      { id: 1, name: 'Initial Inspection', status: 'Completed' },
      { id: 2, name: 'Diagnosis', status: 'Completed' },
      { id: 3, name: 'Repair Execution', status: 'In Progress' },
    ],
    serviceAppointments: [
      { id: 1, appointmentId: 'SA-001', status: 'Scheduled', date: '25/05/2026, 09:00' },
    ],
    workOrderLines: [
      { id: 1, item: 'Hydraulic Pump Kit', quantity: 1, status: 'Ordered' },
      { id: 2, item: 'Seal Kit', quantity: 2, status: 'In Stock' },
      { id: 3, item: 'Filter Element', quantity: 1, status: 'In Stock' },
    ],
    files: [],
    articles: [],
    serviceReports: [],
    taskLists: [
      { id: 1, name: 'Complete hydraulic inspection', status: 'Pending' },
      { id: 2, name: 'Replace damaged components', status: 'Pending' },
      { id: 3, name: 'Test system pressure', status: 'Pending' },
    ],
    timeSheetEntries: [],
    problems: [],
    serviceProducts: [],
    partsRequests: [],
    workOrderHistory: [
      { id: 1, action: 'Created', date: '20/05/2026', user: 'System' },
      { id: 2, action: 'Assigned', date: '20/05/2026', user: 'Admin' },
      { id: 3, action: 'Status Changed', date: '21/05/2026', user: 'M. Rivera' },
    ],
    opportunities: [],
    emr: [],
    pcvs: [],
    competitorInfo: [],
    partsSupplied: [],
  };

  // SA creation from the Feed tab (FRD-Field-Service-Tracking §5.5)
  const handleBookAppointment = (sa) => {
    setFeedEntries((prev) => [
      { id: Date.now(), sa, text: `Service Appointment ${sa.appointmentNumber} booked for ${formatDateTime(sa.schedStart)}`, ts: new Date() },
      ...prev,
    ]);
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      <BookAppointmentModal
        open={bookOpen}
        onClose={() => setBookOpen(false)}
        onCreate={handleBookAppointment}
        workOrder={{ workOrderNumber: woData.workOrderNumber, subject: woData.subject }}
      />
      {/* Error banner */}
      {error && (
        <div className="pl-[15px] pr-6 py-2 text-sm" style={{ backgroundColor: 'rgba(245, 166, 35, 0.12)', color: 'var(--text-main)' }}>
          {error}
        </div>
      )}

      {/* ── Work Order Header ───────────────────────────────────── */}
      <div className="pl-[15px] pr-6 py-4" style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-panel)' }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-xl font-bold">WO #: {loading ? 'Loading…' : woData.workOrderNumber}</h1>
              <button
                onClick={() => navigate(`/workorders/${id}/edit`)}
                className="px-3 py-1.5 text-sm rounded-lg flex items-center gap-2 transition-colors"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
              >
                <Edit size={14} /> Edit
              </button>
              <button className="p-1.5 rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              >
                <MoreVertical size={16} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>{woData.subject}</h2>
              <StatusBadge value={woData.status} />
            </div>
            <div className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
              Case #: <button onClick={() => navigate(`/cases/${encodeURIComponent(woData.caseNumber)}`)} className="hover:underline" style={{ color: 'var(--accent)' }}>{woData.caseNumber}</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ────────────────────────────────── */}
      <div className="pl-[15px] pr-6 flex gap-6 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-panel)' }}>
        {['Details', 'Feed', 'Task List', 'Timesheet', 'Related', 'Log'].map(tab => (
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
        {/* ── Column 1: Asset & Contact (Left - 20%) ───────── */}
        <div className="w-72 flex-shrink-0 overflow-y-auto p-4 border-r" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-panel)' }}>
          {/* Asset Details */}
          <Card title="ASSET DETAILS" icon={<Wrench size={14} />}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <button onClick={() => navigate('/assets/AST-00142')} className="font-bold text-sm hover:underline text-left" style={{ color: 'var(--accent)' }}>
                  {woData.assetName}
                </button>
                <button className="p-1 rounded hover:bg-gray-500/20" style={{ color: 'var(--text-muted)' }}>
                  <Edit size={12} />
                </button>
              </div>
              <InfoField label="Serial Number" value={woData.serialNumber} />
              <InfoField label="Unit Model" value={woData.unitModel} />
              <InfoField label="SMR" value={`${woData.smr} hrs`} />
            </div>
          </Card>

          {/* Contact Information */}
          <Card title="CONTACT INFORMATION" icon={<User size={14} />}>
            <div className="space-y-3">
              <div className="font-bold text-sm">{woData.contactName}</div>
              <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{woData.contactRole}</div>
              <div className="mt-3 pt-3 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Phone size={12} /> {woData.contactPhone}
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Mail size={12} /> {woData.contactEmail}
                </div>
              </div>
            </div>
          </Card>

          {/* Account Information */}
          <Card title="ACCOUNT INFORMATION" icon={<FileText size={14} />}>
            <div className="space-y-3">
              <div className="font-bold text-sm">{woData.accountName}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Status: Active</div>
              <button className="text-xs mt-2" style={{ color: 'var(--accent)' }}>View Account Details →</button>
            </div>
          </Card>

          {/* Service Area & Shift (linked from Service Area + Shift modules) */}
          <Card title="SERVICE AREA & SHIFT" icon={<MapPin size={14} />}>
            <div className="space-y-2.5">
              <button onClick={() => navigate('/plants/PLT-0003')}
                className="w-full flex items-center justify-between text-left text-xs px-2 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--bg-light)', border: '1px solid var(--border)' }}>
                <span className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                  <MapPin size={13} style={{ color: 'var(--text-muted)' }} /> Plant: <strong>Sangkulirang Site</strong>
                </span>
                <ChevronRight size={13} style={{ color: 'var(--text-muted)' }} />
              </button>
              <button onClick={() => navigate('/territories/ST-0001')}
                className="w-full flex items-center justify-between text-left text-xs px-2 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--bg-light)', border: '1px solid var(--border)' }}>
                <span className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                  <MapPin size={13} style={{ color: 'var(--text-muted)' }} /> Territory: <strong>Sangkulirang FMC ST</strong>
                </span>
                <ChevronRight size={13} style={{ color: 'var(--text-muted)' }} />
              </button>
              <button onClick={() => navigate('/shifts/SFT-3061099')}
                className="w-full flex items-center justify-between text-left text-xs px-2 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--bg-light)', border: '1px solid var(--border)' }}>
                <span className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                  <Clock size={13} style={{ color: 'var(--text-muted)' }} /> Shift: <strong>SFT-3061099</strong>
                </span>
                <ChevronRight size={13} style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>
          </Card>
        </div>

        {/* ── Column 2: Work Order Details (Middle - 50%) ──── */}
        <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: 'var(--bg-base)' }}>
          <div className="max-w-5xl space-y-5">
            {activeTab === 'details' && (
              <>
                {/* General Information */}
                <div className="rounded-lg p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold" style={{ color: 'var(--text-main)' }}>General Information</h3>
                    <button className="p-1 rounded hover:bg-gray-500/20" style={{ color: 'var(--text-muted)' }}>
                      <Edit size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoField label="Work Order Number" value={woData.workOrderNumber} />
                    <InfoField label="System Status" value={<StatusBadge value={woData.status} />} />
                    <InfoField label="Case ID" value={woData.caseNumber} />
                    <InfoField label="Account" value={woData.accountName} />
                    <InfoField label="Contact" value={woData.contactName} />
                    <InfoField label="Subject" value={woData.subject} />
                  </div>
                </div>

                {/* Expandable Sections */}
                {[
                  { title: 'Status & Completion', content: 'Status information and completion details...' },
                  { title: 'Technical & Service Details', content: 'Technical specifications and service details...' },
                  { title: 'Lead Time & Scheduling', content: 'Lead time and scheduling information...' },
                  { title: 'Lokasi Pemberanan (Location Information)', content: 'Location and deployment details...' },
                  { title: 'KC Information (SAP Integration)', content: 'SAP integration key figures...' },
                  { title: 'Information - Object Part', content: 'Object and part information...' },
                  { title: 'Additional Information', content: 'Additional notes and information...' },
                  { title: 'SA Information', content: 'Service agreement information...' },
                  { title: 'Description', content: woData.subject },
                  { title: 'System Information', content: `Created: ${woData.createdDate} by ${woData.createdBy}` },
                ].map((section, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <button className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium hover:bg-gray-500/10 transition-colors">
                      <span style={{ color: 'var(--text-main)' }}>{section.title}</span>
                      <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
                    </button>
                    <div className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)', borderTop: '1px solid var(--border)' }}>
                      {section.content}
                    </div>
                  </div>
                ))}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setBookOpen(true)} className="px-4 py-2 rounded text-sm font-medium flex items-center gap-2" style={{ backgroundColor: 'var(--accent)', color: '#1a1a1a' }}>
                    <CalendarClock size={15} /> Book Appointment
                  </button>
                  <button className="px-4 py-2 rounded text-sm font-medium" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                    Approve/Reject WO
                  </button>
                  <button className="px-4 py-2 rounded text-sm font-medium" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                    Generate PDF
                  </button>
                  <button className="px-4 py-2 rounded text-sm font-medium" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                    Send Job Data to SAP
                  </button>
                  <button className="px-4 py-2 rounded text-sm font-medium" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                    Recommend Mechanic
                  </button>
                </div>
              </>
            )}
            {activeTab === 'feed' && (
              <div className="space-y-4">
                {/* Pinned Book Appointment action (FRD §5.2) */}
                <div className="flex items-center justify-between rounded-lg p-3"
                     style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Activity Feed</span>
                  <button onClick={() => setBookOpen(true)}
                          className="px-3 py-1.5 rounded text-sm font-semibold flex items-center gap-1.5"
                          style={{ backgroundColor: 'var(--accent)', color: '#1a1a1a' }}>
                    <Plus size={14} /> Book Appointment
                  </button>
                </div>

                {feedEntries.length === 0 ? (
                  <div className="rounded-lg p-6 text-center text-sm" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                    No feed activity yet. Use <strong>Book Appointment</strong> to schedule a Service Appointment.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {feedEntries.map((entry) => (
                      <div key={entry.id} className="rounded-lg p-3 flex items-start gap-3"
                           style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                        <span className="mt-0.5" style={{ color: 'var(--accent-dark)' }}><CalendarClock size={16} /></span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm" style={{ color: 'var(--text-main)' }}>{entry.text}</span>
                            <SAStatusBadge status={entry.sa.status} />
                          </div>
                          <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {entry.ts.toLocaleString('en-GB')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'task list' && (
              <TaskListTab workOrderId={id} navigate={navigate} />
            )}
            {activeTab === 'timesheet' && (
              <TimesheetTab workOrderId={id} navigate={navigate} />
            )}
            {activeTab === 'related' && (
              <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--text-muted)' }}>Related tab content...</p>
              </div>
            )}
            {activeTab === 'log' && (
              <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--text-muted)' }}>Log tab content...</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Column 3: Related Objects (Right - 30%) ───────── */}
        <div className="w-80 flex-shrink-0 overflow-y-auto p-4 border-l" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-panel)' }}>
          {[
            { title: 'Work Plans', count: relatedObjects.workPlans.length, items: relatedObjects.workPlans },
            { title: 'Work Steps', count: relatedObjects.workSteps.length, items: relatedObjects.workSteps },
            { title: 'Service Appointments', count: relatedObjects.serviceAppointments.length, items: relatedObjects.serviceAppointments, expandable: true },
            { title: 'Work Order Line Items', count: relatedObjects.workOrderLines.length, items: relatedObjects.workOrderLines },
            { title: 'Files', count: relatedObjects.files.length, items: relatedObjects.files },
            { title: 'Articles', count: relatedObjects.articles.length, items: relatedObjects.articles },
            { title: 'Service Reports', count: relatedObjects.serviceReports.length, items: relatedObjects.serviceReports },
            { title: 'Task Lists', count: relatedObjects.taskLists.length, items: relatedObjects.taskLists },
            { title: 'Time Sheet Entries', count: relatedObjects.timeSheetEntries.length, items: relatedObjects.timeSheetEntries },
            { title: 'Problems', count: relatedObjects.problems.length, items: relatedObjects.problems },
            { title: 'Service Products', count: relatedObjects.serviceProducts.length, items: relatedObjects.serviceProducts },
            { title: 'Parts Requests', count: relatedObjects.partsRequests.length, items: relatedObjects.partsRequests },
            { title: 'Work Order History', count: relatedObjects.workOrderHistory.length, items: relatedObjects.workOrderHistory },
            { title: 'Opportunities', count: relatedObjects.opportunities.length, items: relatedObjects.opportunities },
            { title: 'EMR', count: relatedObjects.emr.length, items: relatedObjects.emr },
            { title: 'PCVs', count: relatedObjects.pcvs.length, items: relatedObjects.pcvs },
            { title: 'Competitor Info', count: relatedObjects.competitorInfo.length, items: relatedObjects.competitorInfo },
            { title: 'Parts Supplied', count: relatedObjects.partsSupplied.length, items: relatedObjects.partsSupplied },
          ].map((section, idx) => (
            <Card key={idx} title={`${section.title} (${section.count})`} icon={<ClipboardList size={14} />} action={section.title === 'Task Lists' ? <button onClick={() => setActiveTab('task list')} className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--accent)', color: '#1a1a1a' }}>View All</button> : section.title === 'Time Sheet Entries' ? <button onClick={() => setActiveTab('timesheet')} className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--accent)', color: '#1a1a1a' }}>View All</button> : null}>
              {section.items.length === 0 ? (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No items</p>
              ) : (
                <div className="space-y-2">
                  {section.items.slice(0, 3).map((item, itemIdx) => (
                    <div key={itemIdx} className="p-2 rounded" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)' }}>
                      <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {item.name || item.item || item.appointmentId || item.action}
                      </div>
                      {item.status && (
                        <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{item.status}</div>
                      )}
                      {item.date && (
                        <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{item.date}</div>
                      )}
                    </div>
                  ))}
                  {section.items.length > 3 && (
                    <button className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
                      View All ({section.items.length}) →
                    </button>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
