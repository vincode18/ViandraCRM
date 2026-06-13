/* ─────────────────────────────────────────────────────────────────────────
   Work Order Detail - Mobile View
   Shows work order details with floating action bar for quick actions
   ───────────────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, FileText, Clock, MapPin, Phone, ChevronDown } from 'lucide-react';

export default function WorkOrderDetailMobile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [status, setStatus] = useState('In Progress');
  const [showStatusSheet, setShowStatusSheet] = useState(false);
  const [showPhotoSheet, setShowPhotoSheet] = useState(false);
  const [showNoteSheet, setShowNoteSheet] = useState(false);
  const [showLogHoursSheet, setShowLogHoursSheet] = useState(false);

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
      {showStatusSheet && (
        <BottomSheet onClose={() => setShowStatusSheet(false)}>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Update Status</h3>
            <div className="space-y-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`w-full p-3 rounded flex items-center gap-3 ${status === s ? 'border-2' : ''}`}
                  style={{
                    backgroundColor: 'var(--bg-light)',
                    borderColor: status === s ? 'var(--accent)' : 'transparent',
                  }}
                >
                  <div className={`w-4 h-4 rounded-full border-2 ${status === s ? 'border-solid' : 'border-gray-300'}`} style={{ borderColor: status === s ? 'var(--accent)' : 'var(--border)', backgroundColor: status === s ? 'var(--accent)' : 'transparent' }} />
                  <span className="text-sm font-medium">{s}</span>
                  {status === s && <span style={{ color: 'var(--color-success)' }}>✓</span>}
                </button>
              ))}
            </div>
            <button onClick={() => setShowStatusSheet(false)} className="btn-secondary w-full mt-4">
              Cancel
            </button>
          </div>
        </BottomSheet>
      )}
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

function BottomSheet({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-full bg-white rounded-t-2xl p-4" style={{ backgroundColor: 'var(--bg-panel)' }} onClick={(e) => e.stopPropagation()}>
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" style={{ backgroundColor: 'var(--border)' }} />
        {children}
      </div>
    </div>
  );
}
