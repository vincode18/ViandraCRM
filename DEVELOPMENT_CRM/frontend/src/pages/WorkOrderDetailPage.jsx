import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Edit, ChevronDown, RefreshCw, MapPin, Phone, Mail, User, Calendar,
  Clock, FileText, ClipboardList, Wrench, Package, AlertCircle, MoreVertical,
  ChevronRight, CheckCircle, AlertTriangle
} from 'lucide-react';
import api from '../utils/api';

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

export default function WorkOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
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
        {/* ── Column 1: Asset & Contact (Left - 20%) ───────── */}
        <div className="w-72 flex-shrink-0 overflow-y-auto p-4 border-r" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-panel)' }}>
          {/* Asset Details */}
          <Card title="ASSET DETAILS" icon={<Wrench size={14} />}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">{woData.assetName}</span>
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
                  <button className="px-4 py-2 rounded text-sm font-medium" style={{ backgroundColor: 'var(--accent)', color: '#1a1a1a' }}>
                    Book Appointment
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
              <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--text-muted)' }}>Feed tab content...</p>
              </div>
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
            <Card key={idx} title={`${section.title} (${section.count})`} icon={<ClipboardList size={14} />}>
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
