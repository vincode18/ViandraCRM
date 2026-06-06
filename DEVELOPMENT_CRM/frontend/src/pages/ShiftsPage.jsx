import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, Plus, Search, X, ExternalLink, Star, GripVertical,
  CalendarDays, ChevronLeft, ChevronRight,
} from 'lucide-react';
import {
  SAMPLE_SHIFTS, WEEKLY_SAMPLE_SHIFTS, SHIFT_TYPE_CONFIG, SHIFT_CANDIDATES,
  SHIFT_HOURS, SHIFT_GANTT_START_HOUR, SHIFT_GANTT_END_HOUR, SHIFT_GANTT_DAY,
  SHIFT_STATUSES, TIME_SLOT_TYPES, RECORDSET_FILTERS, SERVICE_RESOURCES,
  scoreBand, shiftStatusStyle, shiftHourFloat, shiftDurationHours,
  formatShiftTime, shiftsForResource, getShiftTypeConfig,
} from '../utils/shiftData';
import { territoryById } from '../utils/serviceAreaData';

const COL_WIDTH = 64;
const RES_COL = 200;
const VIEW_MODES = ['Day', '3-Day', 'Week'];

// ── Week navigation helpers ──────────────────────────────────────────
function getMondayOf(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function toDateStr(date) {
  return date.toISOString().split('T')[0];
}

function formatWeekRange(monday) {
  const sunday = addDays(monday, 6);
  const mStr = monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const sStr = sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${mStr} – ${sStr}`;
}

// ── Shift type legend config ─────────────────────────────────────────
const LEGEND_ITEMS = [
  { label: 'Day Shift',         key: 'Day Shift' },
  { label: 'Normal',            key: 'Normal' },
  { label: 'Emergency Standby', key: 'Emergency Standby' },
  { label: 'Night Shift',       key: 'Night Shift' },
  { label: 'On Call',           key: 'On Call' },
];

export default function ShiftsPage() {
  const navigate = useNavigate();
  const [shifts, setShifts] = useState(SAMPLE_SHIFTS);
  const [weeklyShifts, setWeeklyShifts] = useState(WEEKLY_SAMPLE_SHIFTS);
  const [selected, setSelected] = useState(null);
  const [dragCand, setDragCand] = useState(null);
  const [hoverRow, setHoverRow] = useState(null);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('Day');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPrefill, setModalPrefill] = useState(null);
  const [toast, setToast] = useState('');
  const [weekStart, setWeekStart] = useState(() => getMondayOf(new Date()));
  const timelineRef = useRef(null);

  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  const candidates = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SHIFT_CANDIDATES.filter(c => !q || c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q));
  }, [search]);

  const totalHours = (viewMode === 'Week' ? weeklyShifts : shifts)
    .filter(s => s.status !== 'Cancelled')
    .reduce((acc, s) => acc + shiftDurationHours(s), 0);

  const isCurrentWeek = isSameDay(weekStart, getMondayOf(today));

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
    if (viewMode === 'Week') {
      setWeeklyShifts(prev => [...prev, shift]);
    } else {
      setShifts(prev => [...prev, shift]);
    }
    notify(`Shift ${shift.name} created.`);
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-6 py-3 flex-wrap"
           style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-panel)' }}>
        {/* Left: title + view tabs */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock size={16} style={{ color: 'var(--accent-dark)' }} />
            <h1 className="text-lg font-bold" style={{ color: 'var(--text-main)' }}>Shift Management</h1>
          </div>
          <div className="flex rounded overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            {VIEW_MODES.map((m, i) => (
              <button key={m} type="button" onClick={() => setViewMode(m)}
                className="px-4 py-1.5 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: viewMode === m ? 'var(--accent)' : 'var(--bg-base)',
                  color: viewMode === m ? '#1A1A1A' : 'var(--text-tertiary)',
                  borderRight: i < VIEW_MODES.length - 1 ? '1px solid var(--border)' : 'none',
                  minHeight: 36,
                }}>{m}</button>
            ))}
          </div>
        </div>

        {/* Centre: week navigator (Week mode only) */}
        {viewMode === 'Week' && (
          <div className="flex items-center gap-1.5 mx-auto">
            <button type="button" onClick={() => setWeekStart(d => addDays(d, -7))} aria-label="Previous week"
              className="flex items-center justify-center rounded"
              style={{ width: 32, height: 32, backgroundColor: 'var(--bg-light)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <ChevronLeft size={14} />
            </button>
            <span className="text-sm font-medium text-center" style={{ minWidth: 180, color: 'var(--text-secondary)' }}>
              {formatWeekRange(weekStart)}
            </span>
            <button type="button" onClick={() => setWeekStart(d => addDays(d, 7))} aria-label="Next week"
              className="flex items-center justify-center rounded"
              style={{ width: 32, height: 32, backgroundColor: 'var(--bg-light)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <ChevronRight size={14} />
            </button>
            <button type="button" onClick={() => setWeekStart(getMondayOf(today))}
              disabled={isCurrentWeek}
              className="px-3 text-xs font-bold uppercase tracking-wide rounded"
              style={{
                height: 32, backgroundColor: 'var(--bg-light)', border: '1px solid var(--border)',
                color: isCurrentWeek ? 'var(--text-muted)' : 'var(--text-secondary)',
                cursor: isCurrentWeek ? 'default' : 'pointer',
              }}>TODAY</button>
          </div>
        )}

        {/* Right: stats + CTA */}
        <div className={`flex items-center gap-3 ${viewMode === 'Week' ? '' : 'ml-auto'}`}>
          <span className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
            <Clock size={13} style={{ color: 'var(--text-tertiary)' }} />
            {totalHours.toFixed(1)}h
            <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>
              {viewMode === 'Week' ? 'this week' : 'scheduled'}
            </span>
          </span>
          <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <CalendarDays size={13} style={{ color: 'var(--text-tertiary)' }} />
            {SHIFT_GANTT_DAY}
          </span>
          <button type="button" onClick={() => { setModalPrefill(null); setModalOpen(true); }}
            className="flex items-center gap-1 text-sm font-semibold rounded px-4"
            style={{ backgroundColor: 'var(--accent)', color: '#1A1A1A', minHeight: 44, border: 'none', cursor: 'pointer' }}>
            <Plus size={14} /> New Shift
          </button>
        </div>
      </div>

      {toast && (
        <div role="status" className="px-4 py-2 text-sm" style={{ backgroundColor: 'rgba(245,200,0,0.15)', color: 'var(--text-main)' }}>{toast}</div>
      )}

      {/* Body */}
      {viewMode === 'Week' ? (
        <WeeklyCalendarGrid
          weekStart={weekStart}
          shifts={weeklyShifts}
          resources={SERVICE_RESOURCES}
          today={today}
          onShiftClick={(s) => setSelected(s)}
          onCellClick={(resourceId, dateStr) => {
            setModalPrefill({ serviceResourceId: resourceId, startTime: `${dateStr}T08:00`, endTime: `${dateStr}T17:00` });
            setModalOpen(true);
          }}
        />
      ) : (
        <GanttView
          shifts={shifts} candidates={candidates} search={search} setSearch={setSearch}
          dragCand={dragCand} setDragCand={setDragCand} hoverRow={hoverRow} setHoverRow={setHoverRow}
          timelineRef={timelineRef} selected={selected} setSelected={setSelected}
          handleDrop={handleDrop} navigate={navigate}
        />
      )}

      {selected && (
        <ShiftSidePanel shift={selected} onClose={() => setSelected(null)} navigate={navigate} />
      )}

      {modalOpen && (
        <NewShiftModal prefill={modalPrefill} onClose={() => setModalOpen(false)}
          onCreate={(s) => { createShift(s); setModalOpen(false); }}
          existingCount={shifts.length + weeklyShifts.length} />
      )}
    </div>
  );
}

// ── Weekly Calendar Grid (PRD-SM-002 §4) ────────────────────────────
const DAY_NAMES = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

function WeeklyCalendarGrid({ weekStart, shifts, resources, today, onShiftClick, onCellClick }) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        <table style={{ borderCollapse: 'collapse', minWidth: '100%', animation: 'fadeIn 300ms ease-out' }}>
          <thead>
            <tr>
              {/* B1: Resource column header */}
              <th style={{
                position: 'sticky', left: 0, top: 0, zIndex: 20,
                minWidth: 180, padding: '10px 12px',
                backgroundColor: 'var(--bg-base)',
                border: '1px solid var(--border)',
                borderBottom: '2px solid var(--border)',
                textAlign: 'left', verticalAlign: 'bottom',
              }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                  RESOURCE
                </span>
              </th>
              {/* B2: Day column headers */}
              {days.map((day, i) => {
                const isToday = isSameDay(day, today);
                const dayStr = toDateStr(day);
                const count = shifts.filter(s => s.startTime.startsWith(dayStr)).length;
                return (
                  <th key={i} aria-current={isToday ? 'date' : undefined}
                    style={{
                      position: 'sticky', top: 0, zIndex: 10,
                      minWidth: 140, padding: '8px',
                      textAlign: 'center', verticalAlign: 'bottom',
                      backgroundColor: isToday ? 'var(--accent-pale)' : 'var(--bg-base)',
                      border: '1px solid var(--border)',
                      borderBottom: isToday ? '2px solid var(--accent)' : '2px solid var(--border)',
                    }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: isToday ? 'var(--accent-dark)' : 'var(--text-muted)' }}>
                      {DAY_NAMES[i]}
                    </div>
                    <div style={{ fontSize: 22, fontWeight: isToday ? 700 : 400, lineHeight: 1.1, color: isToday ? 'var(--accent-dark)' : 'var(--text-secondary)' }}>
                      {day.getDate()}
                    </div>
                    {count > 0 && (
                      <div style={{ fontSize: 10, fontWeight: 400, marginTop: 2, color: 'var(--text-muted)' }}>
                        {count} shift{count !== 1 ? 's' : ''}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {resources.map((res) => {
              const weeklyCount = shifts.filter(s => s.serviceResourceId === res.id).length;
              const initials = res.name.split(' ').filter(Boolean).map(w => w[0].toUpperCase()).slice(0, 2).join('');
              return (
                <tr key={res.id}>
                  {/* B3: Resource cell */}
                  <td style={{
                    position: 'sticky', left: 0, zIndex: 10,
                    verticalAlign: 'top', padding: 12, minWidth: 180,
                    backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: 'var(--accent-pale)', border: '1px solid var(--accent)',
                        fontSize: 11, fontWeight: 700, color: 'var(--accent-dark)',
                      }}>{initials}</div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {res.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {res.level}
                        </div>
                        <div style={{ marginTop: 6 }}>
                          <span style={{
                            borderRadius: 9999, padding: '1px 8px',
                            fontSize: 10, fontWeight: weeklyCount > 0 ? 600 : 500,
                            backgroundColor: weeklyCount > 0 ? 'var(--accent-pale)' : 'var(--bg-lighter)',
                            color: weeklyCount > 0 ? 'var(--accent-dark)' : 'var(--text-muted)',
                          }}>
                            {weeklyCount} shift{weeklyCount !== 1 ? 's' : ''} this week
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* B4: Day cells */}
                  {days.map((day, i) => {
                    const isToday = isSameDay(day, today);
                    const dayStr = toDateStr(day);
                    const dayShifts = shifts.filter(s => s.serviceResourceId === res.id && s.startTime.startsWith(dayStr));
                    const isEmpty = dayShifts.length === 0;
                    return (
                      <DayCell key={i} isToday={isToday} isEmpty={isEmpty} dayShifts={dayShifts}
                        onEmpty={() => onCellClick(res.id, dayStr)}
                        onShiftClick={onShiftClick}
                        ariaLabel={`Add shift for ${res.name} on ${dayStr}`} />
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <LegendBar />
    </div>
  );
}

function DayCell({ isToday, isEmpty, dayShifts, onEmpty, onShiftClick, ariaLabel }) {
  const [hover, setHover] = useState(false);
  return (
    <td
      onClick={isEmpty ? onEmpty : undefined}
      onMouseEnter={() => isEmpty && setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={isEmpty ? ariaLabel : undefined}
      style={{
        verticalAlign: 'top', padding: 6, minWidth: 140,
        backgroundColor: isEmpty
          ? (hover ? 'var(--accent-pale)' : 'var(--bg-light)')
          : 'var(--bg-card)',
        border: isEmpty ? '1px dashed var(--border)' : '1px solid var(--border)',
        borderLeft: isToday ? '2px solid var(--accent)' : undefined,
        borderRight: isToday ? '2px solid var(--accent)' : undefined,
        cursor: isEmpty ? 'pointer' : 'default',
        transition: 'background 0.15s ease',
        minHeight: 52,
      }}>
      {isEmpty ? (
        <div style={{ minHeight: 52, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {hover && <span style={{ fontSize: 20, color: 'var(--text-muted)' }}>+</span>}
        </div>
      ) : (
        dayShifts.map(s => <ShiftCard key={s.name} shift={s} onClick={onShiftClick} />)
      )}
    </td>
  );
}

function ShiftCard({ shift, onClick }) {
  const [hover, setHover] = useState(false);
  const cfg = getShiftTypeConfig(shift);
  const isTentative = shift.status === 'Tentative';
  return (
    <div
      role="button" tabIndex={0}
      onClick={() => onClick(shift)}
      onKeyDown={(e) => e.key === 'Enter' && onClick(shift)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderLeft: `3px solid ${cfg.color}`,
        backgroundColor: cfg.bg,
        borderRadius: 4,
        padding: '6px 8px',
        marginBottom: 4,
        minHeight: 52,
        cursor: 'pointer',
        opacity: isTentative ? 0.75 : 1.0,
        boxShadow: hover ? '0 2px 8px rgba(0,0,0,0.14)' : 'none',
        transform: hover ? 'translateY(-1px)' : 'none',
        transition: 'box-shadow 0.15s ease, transform 0.1s ease',
        outline: 'none',
        display: 'flex', flexDirection: 'column', gap: 2,
      }}>
      {/* Row 1: shift ID + tentative badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
        <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace', fontSize: 10, fontWeight: 600, color: cfg.color, letterSpacing: '0.02em' }}>
          {shift.name}
        </span>
        {isTentative && (
          <span style={{ fontSize: 9, fontWeight: 500, color: 'var(--text-muted)', backgroundColor: 'var(--bg-lighter)', borderRadius: 3, padding: '1px 4px', letterSpacing: '0.02em' }}>
            TENTATIVE
          </span>
        )}
      </div>
      {/* Row 2: time range */}
      <div style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-tertiary)' }}>
        {formatShiftTime(shift.startTime)}–{formatShiftTime(shift.endTime)}
      </div>
      {/* Row 3: shift type label */}
      <div style={{ fontSize: 11, fontWeight: 600, color: cfg.color }}>
        {shift.label || shift.shiftType || shift.timeSlotType}
      </div>
    </div>
  );
}

function LegendBar() {
  return (
    <div style={{ borderTop: '1px solid var(--border)', padding: '10px 24px 4px', marginTop: 8 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
        {LEGEND_ITEMS.map(({ label, key }) => {
          const cfg = SHIFT_TYPE_CONFIG[key];
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: cfg.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)' }}>{label}</span>
            </div>
          );
        })}
        {/* Tentative special item */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, border: '1px dashed var(--border)', backgroundColor: 'transparent', flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)' }}>Tentative</span>
        </div>
      </div>
    </div>
  );
}

// ── Gantt view (Day / 3-Day) ─────────────────────────────────────────
function GanttView({ shifts, candidates, search, setSearch, dragCand, setDragCand, hoverRow, setHoverRow, timelineRef, selected, setSelected, handleDrop, navigate }) {
  return (
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
                   className="w-full pl-8 pr-2 py-1.5 rounded text-sm"
                   style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }} />
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

      {selected && <ShiftSidePanel shift={selected} onClose={() => setSelected(null)} navigate={navigate} />}
    </div>
  );
}

// ── Shift detail side panel ──────────────────────────────────────────
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
  const cfg = getShiftTypeConfig(shift);
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
        <div className="mt-3 rounded px-3 py-2" style={{ backgroundColor: cfg.bg, borderLeft: `3px solid ${cfg.color}` }}>
          <div className="text-[11px] font-mono font-semibold" style={{ color: cfg.color }}>{formatShiftTime(shift.startTime)} – {formatShiftTime(shift.endTime)}</div>
          <div className="text-[11px] font-semibold" style={{ color: cfg.color }}>{shift.label || shift.shiftType || shift.timeSlotType}</div>
        </div>

        <Header>Shift Information</Header>
        <Row label="Start Time" value={formatShiftTime(shift.startTime)} />
        <Row label="End Time" value={formatShiftTime(shift.endTime)} />
        <Row label="Duration" value={`${shiftDurationHours(shift)} hrs`} />
        <Row label="Shift Type" value={shift.shiftType || shift.label || shift.timeSlotType} />
        <Row label="Status" value={shift.status} />

        <Header>Resource & Territory</Header>
        <Row label="Service Resource" value={res?.name} />
        <Row label="Service Territory" value={terr?.territory_name} />
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

// ── New Shift modal ──────────────────────────────────────────────────
function NewShiftModal({ prefill, onClose, onCreate, existingCount }) {
  const [form, setForm] = useState({
    startTime: prefill?.startTime || `${SHIFT_GANTT_DAY}T07:00`,
    endTime: prefill?.endTime || `${SHIFT_GANTT_DAY}T21:00`,
    status: 'Tentative',
    serviceResourceId: prefill?.serviceResourceId || SERVICE_RESOURCES[0].id,
    shiftType: 'Day Shift',
    label: 'Day Shift',
    serviceTerritoryId: 'ST-0001',
    timeSlotType: 'Normal',
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
          </h2>
          <button onClick={onClose} aria-label="Close" style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <L label="Start Time"><input type="datetime-local" className="input-field" value={form.startTime} onChange={set('startTime')} /></L>
          <L label="End Time"><input type="datetime-local" className="input-field" value={form.endTime} onChange={set('endTime')} /></L>
          <L label="Status"><select className="input-field" value={form.status} onChange={set('status')}>{SHIFT_STATUSES.map(s => <option key={s}>{s}</option>)}</select></L>
          <L label="Shift Type">
            <select className="input-field" value={form.shiftType} onChange={(e) => setForm(f => ({ ...f, shiftType: e.target.value, label: e.target.value }))}>
              {Object.keys(SHIFT_TYPE_CONFIG).filter(k => k !== 'Unknown').map(k => <option key={k}>{k}</option>)}
            </select>
          </L>
          <L label="Service Resource"><select className="input-field" value={form.serviceResourceId} onChange={set('serviceResourceId')}>{SERVICE_RESOURCES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></L>
          <L label="Recordset Filter"><select className="input-field" value={form.recordsetFilter} onChange={set('recordsetFilter')}><option value="">None</option>{RECORDSET_FILTERS.map(s => <option key={s}>{s}</option>)}</select></L>

          <div className="sm:col-span-2">
            <div className="text-[11px] mb-2" style={{ color: 'var(--text-tertiary)' }}>Preview · {dur} hrs</div>
            <div style={{ borderLeft: `3px solid ${SHIFT_TYPE_CONFIG[form.shiftType]?.color || '#757575'}`, backgroundColor: SHIFT_TYPE_CONFIG[form.shiftType]?.bg || 'rgba(117,117,117,0.1)', borderRadius: 4, padding: '6px 10px', display: 'inline-flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 600, color: SHIFT_TYPE_CONFIG[form.shiftType]?.color }}>{`SFT-PREVIEW`}</span>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{formatShiftTime(form.startTime)}–{formatShiftTime(form.endTime)}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: SHIFT_TYPE_CONFIG[form.shiftType]?.color }}>{form.shiftType}</span>
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
