/* ─────────────────────────────────────────────────────────────────────────
   Work Order Detail - Mobile View
   Shows work order details with floating action bar for quick actions
   ───────────────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, FileText, Clock, MapPin, Phone, ChevronDown } from 'lucide-react';
import BottomSheet from '../components/mobile/BottomSheet';
import PhotoCapture from '../components/mobile/PhotoCapture';
import { saveOfflineSubmission, isOnline } from '../services/offlineStorageService';

export default function WorkOrderDetailMobile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [status, setStatus] = useState('In Progress');
  const [showStatusSheet, setShowStatusSheet] = useState(false);
  const [showPhotoSheet, setShowPhotoSheet] = useState(false);
  const [showNoteSheet, setShowNoteSheet] = useState(false);
  const [showLogHoursSheet, setShowLogHoursSheet] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteSaving, setNoteSaving] = useState(false);
  const [logDate, setLogDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [logHours, setLogHours] = useState(1);
  const [logType, setLogType] = useState('Regular');
  const [logNote, setLogNote] = useState('');
  const [logSaving, setLogSaving] = useState(false);

  const statuses = ['Open', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];

  const job = {
    id: id,
    title: 'Hydraulic pump failure on Unit 7',
    status: status,
    priority: 'High',
    type: 'Maintenance',
    description: 'Hydraulic pump showing signs of wear and reduced pressure output. Requires inspection and potential replacement.',
    createdDate: '2026-06-13',
    location: {
      site: 'Site A',
      address: 'Building 3, Floor 12',
      city: 'Jakarta',
    },
    customer: {
      name: 'Apex Manufacturing',
      contact: '+1 (555) 820-4400',
      equipmentId: 'EQ-2026-04812',
    },
    parts: [
      { name: 'Hydraulic Pump Kit', quantity: 1, status: 'Ordered' },
      { name: 'Seal Kit', quantity: 2, status: 'In Stock' },
    ],
    photos: [
      { id: 1, thumbnail: '/photos/thumb1.jpg' },
    ],
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setShowStatusSheet(false);
  };

  const handleSaveNote = async () => {
    if (!noteText.trim()) return;
    setNoteSaving(true);
    try {
      if (!isOnline()) {
        await saveOfflineSubmission({
          record_id: id,
          form_type: 'note',
          payload: { note: noteText, work_order_id: id },
          photo_count: 0,
        });
        alert('Note saved offline — will sync when connected');
      }
      setNoteText('');
      setShowNoteSheet(false);
    } finally {
      setNoteSaving(false);
    }
  };

  const handleSaveLogHours = async () => {
    setLogSaving(true);
    try {
      if (!isOnline()) {
        await saveOfflineSubmission({
          record_id: id,
          form_type: 'log_hours',
          payload: { work_order_id: id, date: logDate, hours: logHours, type: logType, note: logNote },
          photo_count: 0,
        });
        alert('Hours saved offline — will sync when connected');
      }
      setLogHours(1);
      setLogType('Regular');
      setLogNote('');
      setShowLogHoursSheet(false);
    } finally {
      setLogSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center gap-3 sticky top-0 z-40" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-panel)', minHeight: 'var(--mobile-header-height)' }}>
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft size={20} style={{ color: 'var(--text-secondary)' }} />
        </button>
        <div className="flex-1">
          <div className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>{job.id}</div>
        </div>
        <button
          onClick={() => setShowStatusSheet(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded"
          style={{ backgroundColor: 'var(--bg-light)', border: '1px solid var(--border)' }}
        >
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{status}</span>
          <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto px-4 pb-20" style={{ paddingBottom: 'calc(var(--bottom-nav-height) + var(--safe-bottom) + 80px)' }}>
        {/* Status Badge */}
        <div className="mt-4 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--color-success-pale)', color: 'var(--color-success)' }}>
            {status}
          </span>
        </div>

        {/* Job Info Section */}
        <Section title="Job Info">
          <div className="space-y-2">
            <InfoRow label="Description" value={job.description} />
            <InfoRow label="Priority" value={job.priority} />
            <InfoRow label="Type" value={job.type} />
            <InfoRow label="Created" value={job.createdDate} />
          </div>
        </Section>

        {/* Location Section */}
        <Section title="Location">
          <div className="space-y-2">
            <InfoRow label="Site" value={job.location.site} />
            <InfoRow label="Address" value={job.location.address} />
            <InfoRow label="City" value={job.location.city} />
            <button className="btn-primary w-full mt-2">
              <MapPin size={14} />
              Open in Maps
            </button>
          </div>
        </Section>

        {/* Customer Section */}
        <Section title="Customer">
          <div className="space-y-2">
            <InfoRow label="Name" value={job.customer.name} />
            <InfoRow label="Contact" value={job.customer.contact} />
            <InfoRow label="Equipment ID" value={job.customer.equipmentId} />
            <button className="btn-secondary w-full mt-2">
              <Phone size={14} />
              Call Customer
            </button>
          </div>
        </Section>

        {/* Parts Section */}
        <Section title="Parts & Materials">
          <div className="space-y-2">
            {job.parts.map((part, index) => (
              <div key={index} className="p-3 rounded" style={{ backgroundColor: 'var(--bg-light)' }}>
                <div className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>{part.name}</div>
                <div className="flex justify-between text-xs mt-1">
                  <span style={{ color: 'var(--text-tertiary)' }}>Qty: {part.quantity}</span>
                  <span style={{ color: part.status === 'In Stock' ? 'var(--color-success)' : 'var(--color-warning)' }}>{part.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Attachments Section */}
        <Section title="Attachments">
          <div className="grid grid-cols-3 gap-2">
            {job.photos.map((photo) => (
              <div key={photo.id} className="aspect-square rounded" style={{ backgroundColor: 'var(--bg-light)' }}>
                {/* Photo thumbnail would go here */}
              </div>
            ))}
            <button className="aspect-square rounded flex items-center justify-center border-2 border-dashed" style={{ borderColor: 'var(--border)' }}>
              <span className="text-2xl" style={{ color: 'var(--text-muted)' }}>+</span>
            </button>
          </div>
        </Section>

        {/* Notes Section */}
        <Section title="Notes / Activity">
          <div className="space-y-2">
            <div className="p-3 rounded" style={{ backgroundColor: 'var(--bg-light)' }}>
              <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Today, 09:30</div>
              <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Initial inspection completed. Pump showing signs of wear.</div>
            </div>
          </div>
        </Section>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden" style={{ backgroundColor: 'var(--bg-panel)', borderTop: '1px solid var(--border)', paddingBottom: 'var(--safe-bottom)', height: 'calc(60px + var(--safe-bottom))' }}>
        <div className="flex items-center justify-around h-full px-4">
          <button onClick={() => setShowPhotoSheet(true)} className="flex flex-col items-center gap-1">
            <div className="p-2 rounded-full" style={{ backgroundColor: 'var(--bg-light)' }}>
              <Camera size={20} style={{ color: 'var(--text-secondary)' }} />
            </div>
            <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Photo</span>
          </button>
          <button onClick={() => setShowNoteSheet(true)} className="flex flex-col items-center gap-1">
            <div className="p-2 rounded-full" style={{ backgroundColor: 'var(--bg-light)' }}>
              <FileText size={20} style={{ color: 'var(--text-secondary)' }} />
            </div>
            <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Note</span>
          </button>
          <button onClick={() => setShowLogHoursSheet(true)} className="flex flex-col items-center gap-1">
            <div className="p-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }}>
              <Clock size={20} style={{ color: 'var(--text-main)' }} />
            </div>
            <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Log Hours</span>
          </button>
        </div>
      </div>

      {/* Status Change Bottom Sheet */}
      <BottomSheet open={showStatusSheet} onClose={() => setShowStatusSheet(false)} title="Update Status">
        <div className="space-y-2">
          {statuses.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStatusChange(s)}
              className="w-full p-3 rounded flex items-center gap-3"
              style={{
                backgroundColor: 'var(--bg-light)',
                border: `2px solid ${status === s ? 'var(--accent)' : 'transparent'}`,
              }}
            >
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${status === s ? 'var(--accent)' : 'var(--border)'}`, backgroundColor: status === s ? 'var(--accent)' : 'transparent', flexShrink: 0 }} />
              <span className="text-sm font-medium flex-1 text-left">{s}</span>
              {status === s && <span style={{ color: 'var(--color-success)' }}>✓</span>}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setShowStatusSheet(false)} className="btn-secondary w-full mt-4">
          Cancel
        </button>
      </BottomSheet>

      {/* Photo Sheet */}
      <BottomSheet open={showPhotoSheet} onClose={() => setShowPhotoSheet(false)} title="Add Photos">
        <PhotoCapture
          submissionId={id}
          onPhotosChange={() => {}}
        />
      </BottomSheet>

      {/* Note Sheet */}
      <BottomSheet open={showNoteSheet} onClose={() => setShowNoteSheet(false)} title="Add Note">
        <textarea
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
          placeholder="Enter note…"
          rows={5}
          style={{
            width: '100%', borderRadius: 8, padding: 12,
            border: '1px solid var(--border)', backgroundColor: 'var(--bg-light)',
            color: 'var(--text-main)', fontSize: 14, resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
        <button
          type="button"
          className="btn-primary w-full mt-4"
          style={{ minHeight: 44 }}
          disabled={noteSaving || !noteText.trim()}
          onClick={handleSaveNote}
        >
          {noteSaving ? 'Saving…' : 'Save Note'}
        </button>
      </BottomSheet>

      {/* Log Hours Sheet */}
      <BottomSheet open={showLogHoursSheet} onClose={() => setShowLogHoursSheet(false)} title="Log Hours">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', display: 'block', marginBottom: 4 }}>Date</label>
            <input
              type="date"
              value={logDate}
              onChange={e => setLogDate(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-light)', color: 'var(--text-main)', fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', display: 'block', marginBottom: 4 }}>Hours</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button type="button" onClick={() => setLogHours(h => Math.max(0.5, +(h - 0.5).toFixed(1)))} style={{ width: 40, height: 40, borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-light)', fontSize: 18, cursor: 'pointer', color: 'var(--text-main)' }}>−</button>
              <span style={{ fontSize: 20, fontWeight: 700, minWidth: 40, textAlign: 'center', color: 'var(--text-main)' }}>{logHours.toFixed(1)}</span>
              <button type="button" onClick={() => setLogHours(h => Math.min(24, +(h + 0.5).toFixed(1)))} style={{ width: 40, height: 40, borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-light)', fontSize: 18, cursor: 'pointer', color: 'var(--text-main)' }}>+</button>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', display: 'block', marginBottom: 4 }}>Work Type</label>
            <select value={logType} onChange={e => setLogType(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-light)', color: 'var(--text-main)', fontSize: 14, boxSizing: 'border-box' }}>
              {['Regular', 'Overtime', 'Travel', 'Training'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', display: 'block', marginBottom: 4 }}>Note (optional)</label>
            <input
              type="text"
              value={logNote}
              onChange={e => setLogNote(e.target.value)}
              placeholder="What did you work on?"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-light)', color: 'var(--text-main)', fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>
          <button
            type="button"
            className="btn-primary w-full"
            style={{ minHeight: 44 }}
            disabled={logSaving}
            onClick={handleSaveLogHours}
          >
            {logSaving ? 'Saving…' : 'Save Hours'}
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-main)' }}>{title}</h3>
      <div className="card p-4" style={{ padding: '16px' }}>
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>{label}</div>
      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{value}</div>
    </div>
  );
}

