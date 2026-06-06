import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, Plus, Search, X, ExternalLink, Star, GripVertical,
  CalendarDays, AlertTriangle, Settings as SettingsIcon,
} from 'lucide-react';
import {
  SAMPLE_SHIFTS, SHIFT_CANDIDATES, SHIFT_HOURS, SHIFT_GANTT_START_HOUR,
  SHIFT_GANTT_END_HOUR, SHIFT_GANTT_DAY, SHIFT_STATUSES, TIME_SLOT_TYPES,
  RECORDSET_FILTERS, SERVICE_RESOURCES, scoreBand, shiftStatusStyle,
  shiftHourFloat, shiftDurationHours, formatShiftTime, shiftsForResource,
} from '../utils/shiftData';
import { territoryById } from '../utils/serviceAreaData';

const COL_WIDTH = 64;
const RES_COL = 200;
const VIEW_MODES = ['Day', '3-Day', 'Week'];

export default function ShiftsPage() {
  const navigate = useNavigate();
  const [shifts, setShifts] = useState(SAMPLE_SHIFTS);
  const [selected, setSelected] = useState(null);
  const [dragCand, setDragCand] = useState(null);
  const [hoverRow, setHoverRow] = useState(null);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('Day');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPrefill, setModalPrefill] = useState(null);
  const [toast, setToast] = useState('');
  const timelineRef = useRef(null);

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  const candidates = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SHIFT_CANDIDATES.filter(c => !q || c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q));
  }, [search]);

  // Utilization summary
  const totalHours = shifts.filter(s => s.status !== 'Cancelled').reduce((acc, s) => acc + shiftDurationHours(s), 0);

  const handleDrop = (resource) => (e) => {
    e.preventDefault();
    setHoverRow(null);
    if (!dragCand) return;

    const rect = timelineRef.current?.getBoundingClientRect();
    let startHour = SHIFT_GANTT_START_HOUR;
    if (rect) {
      const x = e.clientX - rect.left + (timelineRef.current?.scrollLeft || 0);
      startHour = Math.max(SHIFT_GANTT_START_HOUR, Math.min(SHIFT_GANTT_END_HOUR - 8, SHIFT_GANTT_START_HOUR + Math.floor(x / COL_WIDTH)));
    }
    setModalPrefill({
      serviceResourceId: resource.id,
      startTime: `${SHIFT_GANTT_DAY}T${String(startHour).padStart(2, '0')}:00`,
      endTime: `${SHIFT_GANTT_DAY}T${String(Math.min(SHIFT_GANTT_END_HOUR, startHour + 8)).padStart(2, '0')}:00`,
      jobProfile: dragCand.role,
      candidateScore: dragCand.score,
    });
    setModalOpen(true);
    setDragCand(null);
  };

  const createShift = (shift) => {
    setShifts(prev => [...prev, shift]);
    notify(`Shift ${shift.name} created for ${SERVICE_RESOURCES.find(r => r.id === shift.serviceResourceId)?.name}.`);
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 flex-wrap"
           style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-panel)' }}>
        <div className="flex items-center gap-2">
          <Clock size={18} style={{ color: 'var(--accent-dark)' }} />
          <h1 className="text-lg font-bold" style={{ color: 'var(--text-main)' }}>Shift Management</h1>
        </div>

        <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          {VIEW_MODES.map((m) => (
            <button key={m} type="button" onClick={() => setViewMode(m)}
              className="px-3 py-1.5 text-sm font-medium transition-colors"
              style={viewMode === m
                ? { backgroundColor: 'var(--accent)', color: '#1a1a1a' }
                : { backgroundColor: 'var(--bg-card)', color: 'var(--text-tertiary)' }}>{m}</button>
          ))}
        </div>

        <div className="flex items-center gap-3 ml-auto text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
          <span className="flex items-center gap-1"><Clock size={13} /> {totalHours.toFixed(1)}h scheduled</span>
          <span className="flex items-center gap-1"><CalendarDays size={13} /> {SHIFT_GANTT_DAY}</span>
          <button type="button" onClick={() => { setModalPrefill(null); setModalOpen(true); }} className="btn-primary px-3 py-1.5">
            <Plus size={14} /> New Shift
          </button>
        </div>
      </div>

      {toast && (
        <div role="status" className="px-4 py-2 text-sm" style={{ backgroundColor: 'rgba(245,200,0,0.15)', color: 'var(--text-main)' }}>{toast}</div>
      )}

      {/* Three-zone body */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT — Candidate panel */}
        <aside className="w-72 flex-shrink-0 flex flex-col overflow-hidden"
               style={{ borderRight: '1px solid var(--border)', backgroundColor: 'var(--bg-panel)' }}>
          <div className="p-3 space-y-2" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="text-xs font-bold uppercase tracking-wider font-mono" style={{ color: 'var(--text-muted)' }}>
              Candidates ({candidates.length})
            </div>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}><Search size={13} /></span>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search mechanics…"
                     className="w-full pl-8 pr-2 py-1.5 rounded text-sm" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {candidates.map((c) => {
              const band = scoreBand(c.score);
              return (
                <div key={c.id} draggable onDragStart={() => setDragCand(c)} onDragEnd={() => setDragCand(null)}
                     className="rounded-lg p-2.5 cursor-grab active:cursor-grabbing transition-all select-none"
                     style={{ backgroundColor: dragCand?.id === c.id ? 'var(--accent)' : 'var(--bg-card)', border: '1px solid var(--border)', opacity: dragCand?.id === c.id ? 0.9 : 1 }}>
                  <div className="flex items-center gap-2">
                    <GripVertical size={14} style={{ color: 'var(--text-muted)' }} />
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                         style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-secondary)' }}>
                      {c.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-main)' }}>{c.name}</div>
                      <div className="text-[11px] truncate" style={{ color: 'var(--text-tertiary)' }}>{c.role}</div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold flex-shrink-0"
                          style={{ backgroundColor: band.bg, color: band.color }}>{c.score}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1.5 pl-9">
                    <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{c.options} options</span>
                    {c.score >= 90 && (
                      <button className="text-[11px] flex items-center gap-1 font-medium" style={{ color: 'var(--accent-dark)' }}>
                        <Star size={11} /> Assign Recommended
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            <p className="text-[11px] pt-2" style={{ color: 'var(--text-muted)' }}>
              Drag a candidate onto a resource row to open the New Shift form for that time slot.
            </p>
          </div>
        </aside>

        {/* CENTER — Gantt */}
        <main className="flex-1 overflow-auto">
          <div className="inline-block min-w-full">
            {/* Header */}
            <div className="flex sticky top-0 z-10" style={{ backgroundColor: 'var(--bg-panel)', borderBottom: '1px solid var(--border)' }}>
              <div className="flex-shrink-0 px-3 py-2" style={{ width: RES_COL, borderRight: '1px solid var(--border)' }}>
                <span className="text-[11px] font-bold uppercase tracking-wider font-mono" style={{ color: 'var(--text-muted)' }}>Resource</span>
              </div>
              <div className="flex" ref={timelineRef}>
                {SHIFT_HOURS.map((h) => (
                  <div key={h} className="flex-shrink-0 px-1 py-2 text-center text-[10px] font-mono"
                       style={{ width: COL_WIDTH, borderRight: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                    {String(h).padStart(2, '0')}:00
                  </div>
                ))}
              </div>
            </div>

            {/* Resource rows */}
            {SERVICE_RESOURCES.map((res) => {
              const blocks = shifts.filter(s => s.serviceResourceId === res.id);
              return (
                <div key={res.id} className="flex" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="flex-shrink-0 px-3 py-2 flex items-center gap-2"
                       style={{ width: RES_COL, borderRight: '1px solid var(--border)', backgroundColor: 'var(--bg-panel)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                         style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-secondary)' }}>{res.avatar}</div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate" style={{ color: 'var(--text-main)' }}>{res.name}</div>
                      <div className="text-[10px] truncate" style={{ color: 'var(--text-tertiary)' }}>{res.level}</div>
                    </div>
                  </div>

                  <div className="relative flex-1"
                       style={{ minHeight: 64, width: SHIFT_HOURS.length * COL_WIDTH,
                         backgroundColor: hoverRow === res.id ? 'rgba(245,200,0,0.12)' : 'transparent',
                         outline: hoverRow === res.id ? '2px dashed var(--accent)' : 'none', outlineOffset: -2 }}
                       onDragOver={(e) => { if (dragCand) { e.preventDefault(); setHoverRow(res.id); } }}
                       onDragLeave={() => setHoverRow(r => (r === res.id ? null : r))}
                       onDrop={handleDrop(res)}>
                    <div className="absolute inset-0 flex pointer-events-none">
                      {SHIFT_HOURS.map((h) => <div key={h} style={{ width: COL_WIDTH, borderRight: '1px solid var(--border)' }} />)}
                    </div>
                    {blocks.map((s) => {
                      const start = shiftHourFloat(s.startTime);
                      const end = shiftHourFloat(s.endTime);
                      if (start == null || end == null) return null;
                      const left = (start - SHIFT_GANTT_START_HOUR) * COL_WIDTH;
                      const width = Math.max(48, (end - start) * COL_WIDTH);
                      const cancelled = s.status === 'Cancelled';
                      const tentative = s.status === 'Tentative';
                      return (
                        <button key={s.name} type="button" onClick={() => setSelected(s)}
                          className="absolute top-2 bottom-2 rounded text-left px-2 py-1 overflow-hidden transition-transform hover:scale-[1.02]"
                          style={{
                            left, width,
                            backgroundColor: s.backgroundColor,
                            opacity: cancelled ? 0.45 : 1,
                            border: tentative ? '2px dashed rgba(255,255,255,0.7)' : '1px solid rgba(0,0,0,0.15)',
                            color: '#fff',
                            textDecoration: cancelled ? 'line-through' : 'none',
                          }}>
                          <div className="text-[10px] font-mono font-semibold truncate flex items-center gap-1">
                            {s.isHoliday && <Star size={9} />}{s.name}
                          </div>
                          <div className="text-[10px] truncate opacity-90">{formatShiftTime(s.startTime)}–{formatShiftTime(s.endTime)} · {s.label || s.timeSlotType}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* RIGHT — Shift detail side panel */}
        {selected && <ShiftSidePanel shift={selected} onClose={() => setSelected(null)} navigate={navigate} />}
      </div>

      {modalOpen && (
        <NewShiftModal prefill={modalPrefill} onClose={() => setModalOpen(false)}
          onCreate={(s) => { createShift(s); setModalOpen(false); }} existingCount={shifts.length} />
      )}
    </div>
  );
}

/* ── Shift detail side panel (FRD-FSM-002 §5) ──────────────────────── */
function ShiftSidePanel({ shift, onClose, navigate }) {
  const res = SERVICE_RESOURCES.find(r => r.id === shift.serviceResourceId);
  const terr = territoryById(shift.serviceTerritoryId);
  const sb = shiftStatusStyle(shift.status);
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
    <aside className="w-[340px] flex-shrink-0 flex flex-col overflow-hidden"
           style={{ borderLeft: '1px solid var(--border)', backgroundColor: 'var(--bg-panel)', boxShadow: '-8px 0 24px rgba(0,0,0,0.08)', animation: 'slideInRight 0.25s ease-out' }}>
      <div className="px-4 py-3 flex items-start justify-between" style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-card)' }}>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Shift Details</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--text-main)' }}>{shift.name}</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ backgroundColor: sb.bg, color: sb.color }}>{shift.status}</span>
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="p-1 rounded hover:bg-gray-500/20" style={{ color: 'var(--text-muted)' }}><X size={16} /></button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Cell preview */}
        <div className="mt-3 rounded px-3 py-2 text-white" style={{ backgroundColor: shift.backgroundColor }}>
          <div className="text-[11px] font-mono font-semibold">{formatShiftTime(shift.startTime)} – {formatShiftTime(shift.endTime)}</div>
          <div className="text-[11px] opacity-90">{shift.label || shift.timeSlotType}</div>
        </div>

        <Header>Shift Information</Header>
        <Row label="Start Time" value={formatShiftTime(shift.startTime)} />
        <Row label="End Time" value={formatShiftTime(shift.endTime)} />
        <Row label="Duration" value={`${shiftDurationHours(shift)} hrs`} />
        <Row label="Time Slot Type" value={shift.timeSlotType} />
        <Row label="Label" value={shift.label} />
        <Row label="Non-Standard" value={shift.isNonStandard ? 'Yes' : 'No'} />
        <Row label="Holiday Shift" value={shift.isHoliday ? 'Yes' : 'No'} />
        <Row label="Recordset Filter" value={shift.recordsetFilter} />

        <Header>Resource & Territory</Header>
        <Row label="Service Resource" value={res?.name} />
        <Row label="Job Profile" value={shift.jobProfile} />
        <Row label="Service Territory" value={terr?.territory_name} />
        <Row label="Plant / Location" value={shift.plantLocation} />

        <Header>SA Assignments</Header>
        {shiftsForResource(shift.serviceResourceId).length === 0 && (
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No assignments.</p>
        )}
      </div>

      <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex gap-2">
          <button className="btn-secondary px-3 py-1.5 text-xs">Edit</button>
          <button className="btn-primary px-3 py-1.5 text-xs">Approve</button>
        </div>
        <button onClick={() => navigate(`/shifts/${encodeURIComponent(shift.name)}`)}
                className="text-xs flex items-center gap-1 hover:underline" style={{ color: 'var(--accent-dark)' }}>
          Open Record <ExternalLink size={12} />
        </button>
      </div>
    </aside>
  );
}

/* ── New Shift modal (FRD-FSM-001 §6) ──────────────────────────────── */
function NewShiftModal({ prefill, onClose, onCreate, existingCount }) {
  const [form, setForm] = useState({
    startTime: prefill?.startTime || `${SHIFT_GANTT_DAY}T07:00`,
    endTime: prefill?.endTime || `${SHIFT_GANTT_DAY}T21:00`,
    status: 'Tentative',
    serviceResourceId: prefill?.serviceResourceId || SERVICE_RESOURCES[0].id,
    jobProfile: prefill?.jobProfile || '',
    serviceTerritoryId: 'ST-0001',
    timeSlotType: 'Normal',
    label: '',
    isNonStandard: false,
    isHoliday: false,
    recordsetFilter: '',
    backgroundColor: '#0070D2',
    plantLocation: 'Sangkulirang Site',
  });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const submit = () => {
    const name = `SFT-${3061104 + existingCount}`;
    onCreate({ ...form, name });
  };

  const dur = (() => {
    const s = new Date(form.startTime).getTime(), e = new Date(form.endTime).getTime();
    return Number.isNaN(s) || Number.isNaN(e) ? 0 : Math.round(((e - s) / 3600000) * 10) / 10;
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="w-full max-w-2xl rounded-lg overflow-hidden flex flex-col max-h-[90vh]"
           style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }} onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
            <Clock size={17} style={{ color: 'var(--accent-dark)' }} /> New Shift
            {prefill?.candidateScore != null && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold"
                    style={{ backgroundColor: scoreBand(prefill.candidateScore).bg, color: scoreBand(prefill.candidateScore).color }}>
                {prefill.candidateScore}/100
              </span>
            )}
          </h2>
          <button onClick={onClose} aria-label="Close" style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <L label="Start Time"><input type="datetime-local" className="input-field" value={form.startTime} onChange={set('startTime')} /></L>
          <L label="End Time"><input type="datetime-local" className="input-field" value={form.endTime} onChange={set('endTime')} /></L>
          <L label="Status"><select className="input-field" value={form.status} onChange={set('status')}>{SHIFT_STATUSES.map(s => <option key={s}>{s}</option>)}</select></L>
          <L label="Time Slot Type"><select className="input-field" value={form.timeSlotType} onChange={set('timeSlotType')}>{TIME_SLOT_TYPES.map(s => <option key={s}>{s}</option>)}</select></L>
          <L label="Service Resource"><select className="input-field" value={form.serviceResourceId} onChange={set('serviceResourceId')}>{SERVICE_RESOURCES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></L>
          <L label="Job Profile"><input className="input-field" value={form.jobProfile} onChange={set('jobProfile')} placeholder="e.g. Field Supervisor" /></L>
          <L label="Recordset Filter Criteria"><select className="input-field" value={form.recordsetFilter} onChange={set('recordsetFilter')}><option value="">None</option>{RECORDSET_FILTERS.map(s => <option key={s}>{s}</option>)}</select></L>
          <L label="Label"><input className="input-field" value={form.label} onChange={set('label')} placeholder="Gantt block label" /></L>
          <L label="Background Color">
            <div className="flex items-center gap-2">
              <input type="color" value={form.backgroundColor} onChange={set('backgroundColor')} className="w-10 h-10 rounded border-0 p-0" />
              <span className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>{form.backgroundColor}</span>
            </div>
          </L>
          <div className="flex items-center gap-4 self-end pb-2">
            <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <input type="checkbox" checked={form.isNonStandard} onChange={set('isNonStandard')} /> Non-Standard
            </label>
            <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <input type="checkbox" checked={form.isHoliday} onChange={set('isHoliday')} /> Holiday
            </label>
          </div>

          {/* Shift Cell Preview */}
          <div className="sm:col-span-2">
            <div className="text-[11px] mb-1" style={{ color: 'var(--text-tertiary)' }}>Shift Cell Preview · {dur} hrs</div>
            <div className="rounded px-3 py-2 text-white inline-flex flex-col" style={{ backgroundColor: form.backgroundColor, border: form.status === 'Tentative' ? '2px dashed rgba(255,255,255,0.7)' : '1px solid rgba(0,0,0,0.15)' }}>
              <span className="text-[11px] font-mono font-semibold flex items-center gap-1">{form.isHoliday && <Star size={9} />}{formatShiftTime(form.startTime)}–{formatShiftTime(form.endTime)}</span>
              <span className="text-[11px] opacity-90">{form.label || form.timeSlotType}{form.isNonStandard ? ' *' : ''}</span>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 flex items-center justify-end gap-2" style={{ borderTop: '1px solid var(--border)' }}>
          <button className="btn-secondary px-4 py-2 text-sm" onClick={onClose}>Cancel</button>
          <button className="btn-primary px-4 py-2 text-sm" onClick={submit}>Create Shift</button>
        </div>
      </div>
    </div>
  );
}

function L({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[11px] mb-1" style={{ color: 'var(--text-tertiary)' }}>{label}</span>
      {children}
    </label>
  );
}
