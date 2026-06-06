import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, Filter, ChevronLeft, ChevronRight, Calendar, Map as MapIcon,
  LayoutGrid, GripVertical, Clock, MapPin, X, ExternalLink, Phone, MessageSquare,
} from 'lucide-react';
import {
  SAMPLE_SAS, SERVICE_RESOURCES, SERVICE_TERRITORIES, formatDateTime, formatTime,
  formatDate, durationLabel, resourceById, isOverdue,
} from '../utils/saData';
import SAStatusBadge from '../components/SAStatusBadge';
import BookAppointmentModal from '../components/BookAppointmentModal';

// Gantt time axis (FRD §7.2) — hourly columns
const GANTT_START_HOUR = 7;
const GANTT_END_HOUR = 18;
const HOURS = Array.from({ length: GANTT_END_HOUR - GANTT_START_HOUR + 1 }, (_, i) => GANTT_START_HOUR + i);
const COL_WIDTH = 84; // px per hour
const GANTT_DAY = '2026-05-23';

function hourFloat(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.getHours() + d.getMinutes() / 60;
}

function CapacityBar({ used, max, dark }) {
  const pct = Math.min(100, Math.round((used / max) * 100));
  const color = pct >= 100 ? 'var(--color-danger)' : 'var(--accent)';
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-[10px] mb-0.5" style={{ color: 'var(--text-muted)' }}>
        <span>{used}/{max}h</span>
        <span style={{ color: pct >= 80 ? color : 'var(--text-muted)', fontWeight: pct >= 80 ? 700 : 400 }}>{pct}%</span>
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-light)' }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

/**
 * Field Service Module — Three-panel dispatch console
 * DESIGN-SA-FieldService-Module §4 (Gantt + Map + side sheet)
 * FRD-Field-Service-Tracking §7 (resource assignment via drag & drop)
 */
export default function FieldServicePage() {
  const navigate = useNavigate();
  const [view, setView] = useState('gantt'); // 'gantt' | 'map'
  const [appointments, setAppointments] = useState(SAMPLE_SAS);
  const [selected, setSelected] = useState(null);     // SA in side sheet
  const [dragId, setDragId] = useState(null);
  const [hoverRow, setHoverRow] = useState(null);
  const [search, setSearch] = useState('');
  const [territory, setTerritory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState('');
  const timelineRef = useRef(null);

  const filteredAll = useMemo(() => appointments.filter((sa) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || sa.appointmentNumber.toLowerCase().includes(q) || sa.subject.toLowerCase().includes(q);
    const matchesTerr = !territory || sa.serviceTerritory === territory;
    return matchesSearch && matchesTerr;
  }), [appointments, search, territory]);

  const unassigned = filteredAll.filter((sa) => !sa.assignedResource || !sa.schedStart);
  const scheduled = filteredAll.filter((sa) => sa.assignedResource && sa.schedStart);

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  // ── Drag & Drop assignment (FRD §7.5 / §7.6) ──────────────────────
  const handleDrop = (resource) => (e) => {
    e.preventDefault();
    setHoverRow(null);
    if (!dragId) return;
    const sa = appointments.find((a) => a.appointmentNumber === dragId);
    if (!sa) return;

    // Compute drop hour from cursor X within the timeline
    const rect = timelineRef.current?.getBoundingClientRect();
    let startHour = GANTT_START_HOUR;
    if (rect) {
      const x = e.clientX - rect.left + (timelineRef.current?.scrollLeft || 0);
      startHour = Math.max(GANTT_START_HOUR, Math.min(GANTT_END_HOUR - 1, GANTT_START_HOUR + Math.floor(x / COL_WIDTH)));
    }
    const durH = sa.durationType === 'Minutes' ? sa.durationInMinutes / 60 : sa.duration;
    const newStart = `${GANTT_DAY}T${String(startHour).padStart(2, '0')}:00`;
    const endDate = new Date(new Date(newStart).getTime() + durH * 3600000);
    const pad = (n) => String(n).padStart(2, '0');
    const newEnd = `${GANTT_DAY}T${pad(endDate.getHours())}:${pad(endDate.getMinutes())}`;

    // Conflict detection against existing blocks on that resource
    const conflict = appointments.some((a) =>
      a.assignedResource === resource.id && a.appointmentNumber !== sa.appointmentNumber && a.schedStart &&
      hourFloat(a.schedStart) < startHour + durH && hourFloat(a.schedEnd) > startHour);
    if (conflict && !window.confirm(`This slot overlaps with another appointment on ${resource.name}. Proceed?`)) {
      setDragId(null);
      return;
    }

    setAppointments((prev) => prev.map((a) => a.appointmentNumber === sa.appointmentNumber
      ? { ...a, assignedResource: resource.id, schedStart: newStart, schedEnd: newEnd, scheduleMode: 'Drag and Drop', status: a.status === 'None' ? 'Scheduled' : a.status }
      : a));
    notify(`${sa.appointmentNumber} assigned to ${resource.name} starting ${formatTime(newStart)}.`);
    setDragId(null);
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* ── Top toolbar ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3 flex-wrap"
           style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-panel)' }}>
        <div className="flex items-center gap-2">
          <MapPin size={18} style={{ color: 'var(--accent-dark)' }} />
          <h1 className="text-lg font-bold" style={{ color: 'var(--text-main)' }}>Field Service</h1>
        </div>

        {/* View toggle */}
        <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          {[{ k: 'gantt', label: 'Gantt', icon: LayoutGrid }, { k: 'map', label: 'Map', icon: MapIcon }].map(({ k, label, icon: Icon }) => (
            <button key={k} type="button" onClick={() => setView(k)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors"
                    style={view === k
                      ? { backgroundColor: 'var(--accent)', color: '#1a1a1a' }
                      : { backgroundColor: 'var(--bg-card)', color: 'var(--text-tertiary)' }}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <select value={territory} onChange={(e) => setTerritory(e.target.value)}
                  className="px-2.5 py-1.5 rounded text-sm" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            <option value="">All Territories</option>
            {SERVICE_TERRITORIES.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
          </select>
          <button type="button" onClick={() => setModalOpen(true)} className="btn-primary px-3 py-1.5">
            <Plus size={14} /> New SA
          </button>
        </div>
      </div>

      {toast && (
        <div role="status" className="px-4 py-2 text-sm" style={{ backgroundColor: 'rgba(245,200,0,0.15)', color: 'var(--text-main)' }}>
          {toast}
        </div>
      )}

      {/* ── Three-panel body ─────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL — SA Queue (drag source) */}
        <aside className="w-80 flex-shrink-0 flex flex-col overflow-hidden"
               style={{ borderRight: '1px solid var(--border)', backgroundColor: 'var(--bg-panel)' }}>
          <div className="p-3 space-y-2" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider font-mono" style={{ color: 'var(--text-muted)' }}>
                {view === 'map' ? 'Active Dispatches' : 'Service Appointments'}
              </span>
              <span className="text-xs font-mono px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-tertiary)' }}>
                {view === 'map' ? scheduled.length : filteredAll.length}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}><Search size={13} /></span>
              <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search SA…"
                     className="w-full pl-8 pr-2 py-1.5 rounded text-sm" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {view === 'map' ? (
              <DispatchList scheduled={scheduled} selected={selected} onSelect={setSelected} />
            ) : (
              <>
                <QueueSection label={`Unassigned (${unassigned.length})`} sas={unassigned}
                              dragId={dragId} setDragId={setDragId} onOpen={setSelected} draggable />
                <QueueSection label={`Scheduled (${scheduled.length})`} sas={scheduled}
                              dragId={dragId} setDragId={setDragId} onOpen={setSelected} draggable />
              </>
            )}
          </div>
        </aside>

        {/* CENTER PANEL */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {view === 'gantt' ? (
            <GanttChart
              appointments={scheduled}
              hoverRow={hoverRow} setHoverRow={setHoverRow}
              dragId={dragId} onDrop={handleDrop} timelineRef={timelineRef}
              onOpen={setSelected}
            />
          ) : (
            <MapView scheduled={scheduled} selected={selected} onSelect={setSelected} />
          )}
        </main>

        {/* RIGHT PANEL — SA detail side sheet */}
        {selected && (
          <SideSheet sa={selected} onClose={() => setSelected(null)} navigate={navigate} />
        )}
      </div>

      <BookAppointmentModal open={modalOpen} onClose={() => setModalOpen(false)}
        onCreate={(sa) => { setAppointments((p) => [{ ...sa, account: '—', contact: '—', latitude: '', longitude: '' }, ...p]); notify(`Service Appointment ${sa.appointmentNumber} created.`); }} />
    </div>
  );
}

/* ── Left panel: SA queue section with draggable cards ──────────────── */
function QueueSection({ label, sas, dragId, setDragId, onOpen, draggable }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-widest font-mono mb-2" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
      <div className="space-y-2">
        {sas.length === 0 && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No appointments.</p>}
        {sas.map((sa) => (
          <SACard key={sa.appointmentNumber} sa={sa} dragging={dragId === sa.appointmentNumber}
                  draggable={draggable}
                  onDragStart={() => setDragId(sa.appointmentNumber)}
                  onDragEnd={() => setDragId(null)}
                  onClick={() => onOpen(sa)} />
        ))}
      </div>
    </div>
  );
}

function SACard({ sa, dragging, draggable, onDragStart, onDragEnd, onClick }) {
  const badge = sa.status === 'None' ? 'NEW' : sa.status;
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className="rounded-lg p-2.5 cursor-grab active:cursor-grabbing transition-all select-none"
      style={{
        backgroundColor: dragging ? 'var(--accent)' : 'var(--bg-card)',
        border: '1px solid var(--border)',
        opacity: dragging ? 0.9 : 1,
        boxShadow: dragging ? '0 8px 24px rgba(0,0,0,0.15)' : 'none',
      }}
    >
      <div className="flex items-center gap-2">
        <GripVertical size={14} style={{ color: 'var(--text-muted)' }} />
        <span className="font-mono text-xs flex-1" style={{ color: dragging ? '#695400' : 'var(--accent-dark)' }}>{sa.appointmentNumber}</span>
        <SAStatusBadge status={badge} />
      </div>
      <div className="text-sm font-semibold mt-1 line-clamp-1" style={{ color: dragging ? '#231b00' : 'var(--text-main)' }}>{sa.subject}</div>
      <div className="flex items-center gap-3 mt-1 text-[11px]" style={{ color: dragging ? '#5b4a00' : 'var(--text-tertiary)' }}>
        <span className="flex items-center gap-1"><Clock size={11} /> {durationLabel(sa)}</span>
        <span className="flex items-center gap-1 line-clamp-1"><MapPin size={11} /> {sa.serviceTerritory}</span>
      </div>
    </div>
  );
}

/* ── Center: Gantt chart (drop target) ──────────────────────────────── */
function GanttChart({ appointments, hoverRow, setHoverRow, dragId, onDrop, timelineRef, onOpen }) {
  const RES_COL = 200;
  return (
    <div className="flex-1 overflow-auto">
      <div className="inline-block min-w-full">
        {/* Header row */}
        <div className="flex sticky top-0 z-10" style={{ backgroundColor: 'var(--bg-panel)', borderBottom: '1px solid var(--border)' }}>
          <div className="flex-shrink-0 px-3 py-2 flex items-center justify-between"
               style={{ width: RES_COL, borderRight: '1px solid var(--border)' }}>
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono" style={{ color: 'var(--text-muted)' }}>Resources ({SERVICE_RESOURCES.length})</span>
          </div>
          <div className="flex" ref={timelineRef}>
            {HOURS.map((h) => (
              <div key={h} className="flex-shrink-0 px-2 py-2 text-center text-[11px] font-mono"
                   style={{ width: COL_WIDTH, borderRight: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                {String(h).padStart(2, '0')}:00
              </div>
            ))}
          </div>
        </div>

        {/* Resource rows */}
        {SERVICE_RESOURCES.map((res) => {
          const blocks = appointments.filter((a) => a.assignedResource === res.id && a.schedStart);
          return (
            <div key={res.id} className="flex" style={{ borderBottom: '1px solid var(--border)' }}>
              {/* Resource column */}
              <div className="flex-shrink-0 px-3 py-2 flex items-center gap-2"
                   style={{ width: RES_COL, borderRight: '1px solid var(--border)', backgroundColor: 'var(--bg-panel)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                     style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-secondary)' }}>{res.avatar}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold truncate" style={{ color: 'var(--text-main)' }}>{res.name}</div>
                  <CapacityBar used={res.capacityUsed} max={res.capacityMax} />
                </div>
              </div>

              {/* Timeline drop zone */}
              <div
                className="relative flex-1"
                style={{
                  minHeight: 56, width: HOURS.length * COL_WIDTH,
                  backgroundColor: hoverRow === res.id ? 'rgba(245,200,0,0.12)' : 'transparent',
                  outline: hoverRow === res.id ? '2px dashed var(--accent)' : 'none',
                  outlineOffset: -2,
                }}
                onDragOver={(e) => { if (dragId) { e.preventDefault(); setHoverRow(res.id); } }}
                onDragLeave={() => setHoverRow((r) => (r === res.id ? null : r))}
                onDrop={onDrop(res)}
              >
                {/* grid lines */}
                <div className="absolute inset-0 flex pointer-events-none">
                  {HOURS.map((h) => <div key={h} style={{ width: COL_WIDTH, borderRight: '1px solid var(--border)' }} />)}
                </div>
                {/* blocks */}
                {blocks.map((sa) => {
                  const start = hourFloat(sa.schedStart);
                  const end = hourFloat(sa.schedEnd);
                  if (start == null || end == null) return null;
                  const left = (start - GANTT_START_HOUR) * COL_WIDTH;
                  const width = Math.max(40, (end - start) * COL_WIDTH);
                  const overdue = isOverdue(sa);
                  const inProgress = sa.status === 'In Progress';
                  return (
                    <button key={sa.appointmentNumber} type="button" onClick={() => onOpen(sa)}
                      className="absolute top-1.5 bottom-1.5 rounded text-left px-2 py-1 overflow-hidden transition-transform hover:scale-[1.02]"
                      style={{
                        left, width,
                        backgroundColor: inProgress ? 'var(--accent)' : 'var(--bg-card)',
                        border: `1px solid ${overdue ? 'var(--color-danger)' : (inProgress ? 'var(--accent-dark)' : 'var(--border)')}`,
                        color: inProgress ? '#231b00' : 'var(--text-secondary)',
                      }}>
                      <div className="text-[10px] font-mono font-semibold truncate">{formatTime(sa.schedStart)} - {formatTime(sa.schedEnd)}</div>
                      <div className="text-[10px] truncate">{sa.parentRecord} · {sa.workType}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        <p className="px-3 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          Drag appointment cards from the left queue onto a resource row to assign. Click a block to open its detail.
        </p>
      </div>
    </div>
  );
}

/* ── Map / Dispatch console view ────────────────────────────────────── */
function DispatchList({ scheduled, selected, onSelect }) {
  return (
    <div className="space-y-2">
      {scheduled.map((sa) => {
        const res = resourceById(sa.assignedResource);
        const active = selected?.appointmentNumber === sa.appointmentNumber;
        return (
          <button key={sa.appointmentNumber} type="button" onClick={() => onSelect(sa)}
            className="w-full text-left rounded-lg p-2.5 transition-colors"
            style={{ backgroundColor: active ? 'rgba(245,200,0,0.12)' : 'var(--bg-card)', border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}` }}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs" style={{ color: 'var(--accent-dark)' }}>{sa.appointmentNumber}</span>
              <SAStatusBadge status={sa.status === 'In Progress' ? 'On-Site' : sa.status} />
            </div>
            <div className="text-sm font-medium mt-1" style={{ color: 'var(--text-main)' }}>{res?.name || 'Unassigned'}</div>
            <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>ETA: {sa.status === 'Dispatched' ? '14 mins' : '—'}</div>
          </button>
        );
      })}
    </div>
  );
}

function MapView({ scheduled, selected, onSelect }) {
  return (
    <div className="flex-1 flex flex-col p-4 gap-4 overflow-auto">
      <div className="flex-1 rounded-xl relative overflow-hidden min-h-[320px]"
           style={{ border: '1px solid var(--border)', background: 'linear-gradient(135deg, var(--bg-light), var(--bg-card))' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <MapIcon size={48} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
        </div>
        {/* pseudo map pins */}
        {scheduled.map((sa, i) => (
          <button key={sa.appointmentNumber} type="button" onClick={() => onSelect(sa)}
            className="absolute flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-mono shadow-md transition-transform hover:scale-110"
            style={{ top: `${20 + (i * 13) % 70}%`, left: `${15 + (i * 17) % 70}%`, backgroundColor: 'var(--bg-panel)', border: '1px solid var(--accent)', color: 'var(--text-secondary)' }}>
            <MapPin size={11} style={{ color: 'var(--accent-dark)' }} /> {sa.appointmentNumber}
          </button>
        ))}
      </div>

      {selected && (
        <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm" style={{ color: 'var(--accent-dark)' }}>SELECTED: {selected.appointmentNumber}</span>
            <SAStatusBadge status={selected.status === 'In Progress' ? 'On-Site' : selected.status} size="md" />
          </div>
          <div className="text-sm font-semibold mt-1" style={{ color: 'var(--text-main)' }}>{resourceById(selected.assignedResource)?.name || 'Unassigned'}</div>
          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{resourceById(selected.assignedResource)?.level}</div>
          <div className="flex gap-2 mt-3">
            <button className="btn-secondary px-3 py-1.5 text-xs"><Phone size={13} /> Call</button>
            <button className="btn-secondary px-3 py-1.5 text-xs"><MessageSquare size={13} /> Message</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Right panel: SA detail side sheet ──────────────────────────────── */
function SideSheet({ sa, onClose, navigate }) {
  const res = resourceById(sa.assignedResource);
  const addr = [sa.street, sa.city, sa.state].filter(Boolean).join(', ');
  const Row = ({ label, value }) => (
    <div className="flex items-start justify-between gap-3 py-1">
      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{label}</span>
      <span className="text-xs text-right font-medium" style={{ color: 'var(--text-secondary)' }}>{value || '—'}</span>
    </div>
  );
  const Header = ({ children }) => (
    <div className="text-[10px] font-bold uppercase tracking-widest font-mono mt-4 mb-1" style={{ color: 'var(--text-muted)' }}>{children}</div>
  );
  return (
    <aside className="w-[360px] flex-shrink-0 flex flex-col overflow-hidden"
           style={{ borderLeft: '1px solid var(--border)', backgroundColor: 'var(--bg-panel)', boxShadow: '-8px 0 24px rgba(0,0,0,0.08)', animation: 'slideInRight 0.25s ease-out' }}>
      <div className="px-4 py-3 flex items-start justify-between" style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-card)' }}>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm" style={{ color: 'var(--accent-dark)' }}>{sa.appointmentNumber}</span>
            <SAStatusBadge status={sa.status} />
          </div>
          <div className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text-main)' }}>{sa.subject}</div>
          <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Work Order: {sa.parentRecord}</div>
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="p-1 rounded hover:bg-gray-500/20" style={{ color: 'var(--text-muted)' }}><X size={16} /></button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <Header>Resource Assignment</Header>
        <Row label="Assigned To" value={res?.name} />
        <Header>Scheduling</Header>
        <Row label="Scheduled Start" value={formatDateTime(sa.schedStart)} />
        <Row label="Scheduled End" value={formatDateTime(sa.schedEnd)} />
        <Row label="Duration" value={durationLabel(sa)} />
        <Row label="Arrival Window" value={sa.arrivalWindowStart ? `${formatTime(sa.arrivalWindowStart)} – ${formatTime(sa.arrivalWindowEnd)}` : '—'} />
        <Row label="Due Date" value={formatDate(sa.dueDate)} />
        <Header>Location</Header>
        <Row label="Address" value={addr} />
        <Row label="Territory" value={sa.serviceTerritory} />
        <Header>Actuals</Header>
        <Row label="Actual Start" value={formatDateTime(sa.actualStart)} />
        <Row label="Actual End" value={formatDateTime(sa.actualEnd)} />
        <Row label="Actual Duration" value={sa.actualDuration ? `${sa.actualDuration} min` : '—'} />
      </div>

      <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
        <button className="btn-primary px-3 py-1.5 text-xs">Save Note</button>
        <button onClick={() => navigate(`/serviceappointments/${encodeURIComponent(sa.appointmentNumber)}`)}
                className="text-xs flex items-center gap-1 hover:underline" style={{ color: 'var(--accent-dark)' }}>
          Open Full Record <ExternalLink size={12} />
        </button>
      </div>
    </aside>
  );
}
