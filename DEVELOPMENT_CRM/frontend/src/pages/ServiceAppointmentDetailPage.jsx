import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ChevronDown, Save, MapPin, CalendarClock, Users,
  ClipboardList, FileText, Boxes, Cog, Clock,
} from 'lucide-react';
import {
  SAMPLE_SAS, SA_STATUSES, formatDateTime, formatDate, durationLabel,
  resourceById, isOverdue,
} from '../utils/saData';
import SAStatusBadge from '../components/SAStatusBadge';

/* ── small presentational helpers ─────────────────────────────────── */
function Field({ label, value, mono }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</div>
      <div className={`text-sm mt-0.5 ${mono ? 'font-mono' : ''}`} style={{ color: 'var(--text-secondary)' }}>
        {value || <span style={{ color: 'var(--text-muted)' }}>—</span>}
      </div>
    </div>
  );
}

function Section({ title, icon, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <button type="button" onClick={() => setOpen((o) => !o)}
              className="w-full px-4 py-3 flex items-center justify-between transition-colors hover:bg-gray-500/5">
        <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          {icon} {title}
        </span>
        <ChevronDown size={15} className={`transition-transform ${open ? '' : '-rotate-90'}`} style={{ color: 'var(--text-muted)' }} />
      </button>
      {open && <div className="px-4 pb-4 pt-1" style={{ borderTop: '1px solid var(--border)' }}>{children}</div>}
    </div>
  );
}

/**
 * Service Appointment — Detail View
 * FRD-Field-Service-Tracking §6.2 (8-section layout)
 * FRD-SA-Fields (full field schema)
 */
export default function ServiceAppointmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const initial = useMemo(
    () => SAMPLE_SAS.find((s) => s.appointmentNumber === id) || SAMPLE_SAS[0],
    [id],
  );
  const [sa, setSa] = useState(initial);
  const resource = resourceById(sa.assignedResource);
  const overdue = isOverdue(sa);
  const showBundle = sa.isBundle || sa.isBundleMember;

  const update = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSa((prev) => ({ ...prev, [key]: val }));
  };

  const inputStyle = { backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-secondary)' };
  const addr = [sa.street, sa.city, sa.state, sa.postalCode, sa.country].filter(Boolean).join(', ');

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* ── Section 1: Appointment Header (always visible) ─────────── */}
      <div className="rounded-lg p-5" style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
        <button onClick={() => navigate('/serviceappointments')}
                className="flex items-center gap-1.5 text-sm mb-3 hover:underline" style={{ color: 'var(--text-tertiary)' }}>
          <ArrowLeft size={15} /> Back to Service Appointments
        </button>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-sm" style={{ color: 'var(--accent-dark)' }}>{sa.appointmentNumber}</span>
              <SAStatusBadge status={sa.status} size="md" />
              {overdue && <SAStatusBadge status="Overdue" size="md" />}
            </div>
            <h1 className="text-xl font-bold mt-1" style={{ color: 'var(--text-main)' }}>{sa.subject}</h1>
            <div className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
              Parent Record:{' '}
              <button onClick={() => navigate(`/workorders/${encodeURIComponent(sa.parentRecord)}`)}
                      className="hover:underline font-medium" style={{ color: 'var(--accent-dark)' }}>
                {sa.parentRecord}
              </button>
              {resource && <> · {resource.name}</>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Status</label>
            <select value={sa.status} onChange={update('status')}
                    className="px-3 py-2 rounded text-sm font-medium" style={inputStyle}>
              {SA_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Two-column grid for the dense sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Section 2: Scheduling */}
        <Section title="Scheduling" icon={<CalendarClock size={13} />}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Scheduled Start" value={formatDateTime(sa.schedStart)} mono />
            <Field label="Scheduled End" value={formatDateTime(sa.schedEnd)} mono />
            <Field label="Duration" value={durationLabel(sa)} />
            <Field label="Duration Type" value={sa.durationType} />
            <Field label="Earliest Start Permitted" value={formatDateTime(sa.earliestStart)} mono />
            <Field label="Due Date" value={formatDateTime(sa.dueDate)} mono />
            <Field label="Arrival Window Start" value={formatDateTime(sa.arrivalWindowStart)} mono />
            <Field label="Arrival Window End" value={formatDateTime(sa.arrivalWindowEnd)} mono />
          </div>
        </Section>

        {/* Section 5: Actuals (editable by technician) */}
        <Section title="Actuals" icon={<Clock size={13} />}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>Actual Start</label>
              <input type="datetime-local" value={sa.actualStart} onChange={update('actualStart')}
                     className="w-full px-2.5 py-1.5 rounded text-sm" style={inputStyle} />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>Actual End</label>
              <input type="datetime-local" value={sa.actualEnd} onChange={update('actualEnd')}
                     className="w-full px-2.5 py-1.5 rounded text-sm" style={inputStyle} />
            </div>
            <div className="col-span-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>Actual Duration (Minutes)</label>
              <input type="number" value={sa.actualDuration} onChange={update('actualDuration')}
                     placeholder="Auto-filled on first Start/End entry"
                     className="w-full px-2.5 py-1.5 rounded text-sm" style={inputStyle} />
            </div>
          </div>
        </Section>
      </div>

      {/* Section 3: Location */}
      <Section title="Location" icon={<MapPin size={13} />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Address" value={addr} />
          <Field label="Service Territory" value={sa.serviceTerritory} />
          <Field label="Latitude (admin)" value={sa.latitude} mono />
          <Field label="Longitude (admin)" value={sa.longitude} mono />
          <Field label="Offsite Appointment" value={sa.isOffsiteAppointment ? 'Yes — no travel time' : 'No'} />
        </div>
      </Section>

      {/* Section 4: Stakeholders */}
      <Section title="Stakeholders" icon={<Users size={13} />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Account" value={sa.account} />
          <Field label="Contact" value={sa.contact} />
          <Field label="Work Type" value={sa.workType} />
          <Field label="Parent Record Type" value={sa.parentRecordType} />
          <Field label="Parent Record Status Category" value={sa.parentRecordStatusCategory} />
          <Field label="Status Category" value={sa.statusCategory} />
        </div>
      </Section>

      {/* Section 6: Description & Notes */}
      <Section title="Description & Notes" icon={<FileText size={13} />}>
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>Description</label>
            <textarea rows={2} value={sa.description} onChange={update('description')}
                      className="w-full px-3 py-2 rounded text-sm" style={inputStyle} />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>Service Note</label>
            <textarea rows={2} value={sa.serviceNote} onChange={update('serviceNote')}
                      placeholder="Field technician summary / recommendations…"
                      className="w-full px-3 py-2 rounded text-sm" style={inputStyle} />
          </div>
        </div>
      </Section>

      {/* Section 7: Bundle Configuration (conditional) */}
      {showBundle && (
        <Section title="Bundle Configuration" icon={<Boxes size={13} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Bundle" value={sa.isBundle ? 'Yes' : 'No'} />
            <Field label="Bundle Member" value={sa.isBundleMember ? 'Yes' : 'No'} />
            <Field label="Bundle Policy" value={sa.bundlePolicy} />
            <Field label="Related Bundle" value={sa.relatedBundle} />
            <Field label="Manually Bundled" value={sa.isManuallyBundled ? 'Yes' : 'No'} />
          </div>
        </Section>
      )}

      {/* Section 8: System Information (collapsed by default) */}
      <Section title="System Information" icon={<Cog size={13} />} defaultOpen={false}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Schedule Mode" value={sa.scheduleMode} />
          <Field label="Transaction" value={sa.transaction} mono />
          <Field label="Duration In Minutes" value={sa.durationInMinutes} mono />
        </div>
      </Section>

      {/* Save bar */}
      <div className="flex justify-end gap-2 pb-4">
        <button type="button" onClick={() => navigate('/serviceappointments')} className="btn-secondary">Cancel</button>
        <button type="button" className="btn-primary"><Save size={15} /> Save Changes</button>
      </div>
    </div>
  );
}
