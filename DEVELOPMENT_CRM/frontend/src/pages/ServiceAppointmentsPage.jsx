import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, CalendarClock, MapPin } from 'lucide-react';
import {
  SAMPLE_SAS, formatDateTime, resourceById, isOverdue, durationLabel,
} from '../utils/saData';
import SAStatusBadge from '../components/SAStatusBadge';
import BookAppointmentModal from '../components/BookAppointmentModal';

const FILTER_CHIPS = ['All', 'Scheduled', 'Dispatched', 'In Progress', 'Completed', 'Overdue'];

/**
 * Service Appointments — List View
 * DESIGN-SA-FieldService-Module §3.1 / §3.2
 */
export default function ServiceAppointmentsPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState(SAMPLE_SAS);
  const [activeChip, setActiveChip] = useState('All');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState('');

  const filtered = useMemo(() => {
    return appointments.filter((sa) => {
      const q = search.trim().toLowerCase();
      const matchesSearch = !q ||
        sa.appointmentNumber.toLowerCase().includes(q) ||
        sa.subject.toLowerCase().includes(q) ||
        sa.account.toLowerCase().includes(q);
      let matchesChip = true;
      if (activeChip === 'Overdue') matchesChip = isOverdue(sa);
      else if (activeChip !== 'All') matchesChip = sa.status === activeChip;
      return matchesSearch && matchesChip;
    });
  }, [appointments, search, activeChip]);

  const handleCreate = (sa) => {
    setAppointments((prev) => [{ ...sa, account: '—', contact: '—' }, ...prev]);
    setToast(`Service Appointment ${sa.appointmentNumber} created successfully.`);
    setTimeout(() => setToast(''), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast */}
      {toast && (
        <div role="status" className="px-4 py-2.5 rounded-lg text-sm flex items-center gap-2"
             style={{ backgroundColor: 'rgba(245,200,0,0.15)', border: '1px solid var(--accent)', color: 'var(--text-main)' }}>
          <CalendarClock size={15} style={{ color: 'var(--accent-dark)' }} /> {toast}
        </div>
      )}

      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>Service Appointments</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            {filtered.length} of {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => navigate('/fieldservice')} className="btn-secondary">
            <MapPin size={15} /> Open Dispatch
          </button>
          <button type="button" onClick={() => setModalOpen(true)} className="btn-primary">
            <Plus size={15} /> New SA
          </button>
        </div>
      </header>

      {/* Filter bar */}
      <div className="card space-y-3">
        <div className="relative max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
            <Search size={14} />
          </span>
          <input
            type="search" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SA #, subject, account…"
            className="input-field pl-9 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTER_CHIPS.map((chip) => {
            const active = activeChip === chip;
            return (
              <button
                key={chip}
                type="button"
                onClick={() => setActiveChip(chip)}
                className="px-3 py-1 rounded-full text-xs font-medium font-mono transition-colors"
                style={active
                  ? { backgroundColor: 'var(--accent)', color: '#1a1a1a' }
                  : { backgroundColor: 'var(--bg-light)', color: 'var(--text-tertiary)', border: '1px solid var(--border)' }}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm" aria-label="Service appointments list">
          <thead>
            <tr className="border-b text-xs uppercase tracking-wider"
                style={{ borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}>
              {['SA #', 'Subject', 'Scheduled', 'Resource', 'Territory', 'Status', ''].map((h) => (
                <th key={h} scope="col" className="px-4 py-3 text-left font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center" style={{ color: 'var(--text-muted)' }}>
                  <div className="flex flex-col items-center gap-3">
                    <CalendarClock size={32} style={{ color: 'var(--border)' }} />
                    <span>No service appointments match your filters.</span>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((sa) => {
                const res = resourceById(sa.assignedResource);
                const overdue = isOverdue(sa);
                return (
                  <tr key={sa.appointmentNumber}
                      className="border-b hover:bg-gray-500/5 transition-colors cursor-pointer"
                      style={{ borderColor: 'var(--border)' }}
                      onClick={() => navigate(`/serviceappointments/${encodeURIComponent(sa.appointmentNumber)}`)}>
                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap" style={{ color: 'var(--accent-dark)' }}>
                      {sa.appointmentNumber}
                    </td>
                    <td className="px-4 py-3 max-w-[240px]">
                      <div className="line-clamp-1 font-medium" style={{ color: 'var(--text-main)' }}>{sa.subject}</div>
                      <div className="text-xs line-clamp-1" style={{ color: 'var(--text-tertiary)' }}>{sa.account}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {formatDateTime(sa.schedStart)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                      {res ? res.name : <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {sa.serviceTerritory}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <SAStatusBadge status={sa.status} />
                        {overdue && <SAStatusBadge status="Overdue" />}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-xs" style={{ color: 'var(--text-muted)' }}>
                      {durationLabel(sa)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <BookAppointmentModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreate} />
    </div>
  );
}
