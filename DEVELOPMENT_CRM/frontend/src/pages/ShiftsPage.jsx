import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, Plus, Search, X, ExternalLink, Star, GripVertical,
  CalendarDays, ChevronLeft, ChevronRight, Save, Trash2,
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

// ── Helpers ──────────────────────────────────────────────────────────
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

const DAY_NAMES = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
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
  const [detailMode, setDetailMode] = useState('view'); // 'view' | 'edit'
  const [dragCand, setDragCand] = useState(null);
  const [hoverRow, setHoverRow] = useState(null);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('Day');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPrefill, setModalPrefill] = useState(null);
  const [toast, setToast] = useState('');
  const [weekStart, setWeekStart] = useState(() => getMondayOf(new Date()));
  const [threeDayStart, setThreeDayStart] = useState(() => getMondayOf(new Date()));
  const [dayStart, setDayStart] = useState(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; });
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [threeDayPickerOpen, setThreeDayPickerOpen] = useState(false);
  const [pickerMonth, setPickerMonth] = useState(new Date());
  const timelineRef = useRef(null);

  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  const candidates = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SHIFT_CANDIDATES.filter(c => !q || c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q));
  }, [search]);

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

  const updateShift = (updatedShift) => {
    if (viewMode === 'Week') {
      setWeeklyShifts(prev => prev.map(s => s.name === updatedShift.name ? updatedShift : s));
    } else {
      setShifts(prev => prev.map(s => s.name === updatedShift.name ? updatedShift : s));
    }
    setSelected(updatedShift);
    setDetailMode('view');
    notify(`Shift ${updatedShift.name} updated.`);
  };

  const shiftList = viewMode === 'Week' ? weeklyShifts : shifts;

  // Handle Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setSelected(null);
        setDatePickerOpen(false);
        setThreeDayPickerOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

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
              <button key={m} type="button"
                onClick={() => {
                  setViewMode(m);
                  setThreeDayPickerOpen(false);
                  setDatePickerOpen(false);
                }}
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

        {/* Centre: week/3-day/day navigator */}
        {viewMode === 'Week' && (
          <div className="flex items-center gap-1.5 mx-auto relative">
            <button type="button" onClick={() => setWeekStart(d => addDays(d, -7))} aria-label="Previous week"
              className="flex items-center justify-center rounded"
              style={{ width: 32, height: 32, backgroundColor: 'var(--bg-light)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <ChevronLeft size={14} />
            </button>
            <button type="button"
              onClick={() => setDatePickerOpen(o => !o)}
              style={{ minWidth: 180, textAlign: 'center', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: datePickerOpen ? 'underline dashed' : 'none' }}
              className="text-sm font-medium">
              {formatWeekRange(weekStart)}
            </button>
            {datePickerOpen && (
              <DatePicker
                month={pickerMonth}
                onMonthChange={setPickerMonth}
                onSelectDate={(d) => {
                  setWeekStart(getMondayOf(d));
                  setDatePickerOpen(false);
                }}
                currentWeekStart={weekStart}
              />
            )}
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

        {viewMode === '3-Day' && (
          <div className="flex items-center gap-1.5 mx-auto relative">
            <button type="button" onClick={() => setThreeDayStart(d => addDays(d, -1))} aria-label="Previous day"
              className="flex items-center justify-center rounded"
              style={{ width: 32, height: 32, backgroundColor: 'var(--bg-light)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <ChevronLeft size={14} />
            </button>
            <button type="button"
              onClick={() => setThreeDayPickerOpen(o => !o)}
              style={{ minWidth: 180, textAlign: 'center', color: 'var(--text-secondary)' }}
              className="text-sm font-medium">
              {threeDayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {addDays(threeDayStart, 2).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </button>
            {threeDayPickerOpen && (
              <DatePickerThreeDay
                month={pickerMonth}
                onMonthChange={setPickerMonth}
                onSelectDate={(d) => {
                  setThreeDayStart(d);
                  setThreeDayPickerOpen(false);
                }}
                selectedStart={threeDayStart}
              />
            )}
            <button type="button" onClick={() => setThreeDayStart(d => addDays(d, 1))} aria-label="Next day"
              className="flex items-center justify-center rounded"
              style={{ width: 32, height: 32, backgroundColor: 'var(--bg-light)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <ChevronRight size={14} />
            </button>
            <button type="button" onClick={() => setThreeDayStart(today)}
              className="px-3 text-xs font-bold uppercase tracking-wide rounded"
              style={{
                height: 32, backgroundColor: 'var(--bg-light)', border: '1px solid var(--border)',
                color: isSameDay(threeDayStart, today) ? 'var(--text-muted)' : 'var(--text-secondary)',
                cursor: isSameDay(threeDayStart, today) ? 'default' : 'pointer',
              }}>TODAY</button>
          </div>
        )}

        {viewMode === 'Day' && (
          <div className="flex items-center gap-1.5 mx-auto">
            <button type="button" onClick={() => setDayStart(d => addDays(d, -1))} aria-label="Previous day"
              className="flex items-center justify-center rounded"
              style={{ width: 32, height: 32, backgroundColor: 'var(--bg-light)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <ChevronLeft size={14} />
            </button>
            <span className="text-sm font-medium text-center" style={{ minWidth: 180, color: 'var(--text-secondary)' }}>
              {dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <button type="button" onClick={() => setDayStart(d => addDays(d, 1))} aria-label="Next day"
              className="flex items-center justify-center rounded"
              style={{ width: 32, height: 32, backgroundColor: 'var(--bg-light)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <ChevronRight size={14} />
            </button>
            <button type="button" onClick={() => setDayStart(today)}
              disabled={isSameDay(dayStart, today)}
              className="px-3 text-xs font-bold uppercase tracking-wide rounded"
              style={{
                height: 32, backgroundColor: 'var(--bg-light)', border: '1px solid var(--border)',
                color: isSameDay(dayStart, today) ? 'var(--text-muted)' : 'var(--text-secondary)',
                cursor: isSameDay(dayStart, today) ? 'default' : 'pointer',
              }}>TODAY</button>
          </div>
        )}

        {/* Right: stats + CTA */}
        <div className={`flex items-center gap-3 ${['Week', '3-Day'].includes(viewMode) ? '' : 'ml-auto'}`}>
          <span className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
            <Clock size={13} style={{ color: 'var(--text-tertiary)' }} />
            {shiftList.filter(s => s.status !== 'Cancelled').reduce((acc, s) => acc + shiftDurationHours(s), 0).toFixed(1)}h
            <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>
              scheduled
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

      {/* Body — Full width grid */}
      <div className="flex-1 overflow-hidden relative" style={{ backgroundColor: 'var(--bg-base)' }}>
        {viewMode === 'Week' && (
          <WeeklyCalendarGrid
            weekStart={weekStart}
            shifts={weeklyShifts}
            resources={SERVICE_RESOURCES}
            today={today}
            onShiftClick={(s) => { setSelected(s); setDetailMode('view'); }}
            onCellClick={(resourceId, dateStr) => {
              setModalPrefill({ serviceResourceId: resourceId, startTime: `${dateStr}T08:00`, endTime: `${dateStr}T17:00` });
              setModalOpen(true);
            }}
          />
        )}
        {viewMode === '3-Day' && (
          <ThreeDayCalendarGrid
            startDate={threeDayStart}
            shifts={weeklyShifts}
            resources={SERVICE_RESOURCES}
            today={today}
            onShiftClick={(s) => { setSelected(s); setDetailMode('view'); }}
            onCellClick={(resourceId, dateStr) => {
              setModalPrefill({ serviceResourceId: resourceId, startTime: `${dateStr}T08:00`, endTime: `${dateStr}T17:00` });
              setModalOpen(true);
            }}
          />
        )}
        {viewMode === 'Day' && (
          <DayGanttView
            dayStart={dayStart}
            shifts={shifts}
            candidates={candidates}
            search={search}
            setSearch={setSearch}
            dragCand={dragCand}
            setDragCand={setDragCand}
            hoverRow={hoverRow}
            setHoverRow={setHoverRow}
            timelineRef={timelineRef}
            handleDrop={handleDrop}
          />
        )}

        {/* Right-side detail panel */}
        {selected && (
          <ShiftDetailPanel
            shift={selected}
            mode={detailMode}
            onClose={() => { setSelected(null); setDetailMode('view'); }}
            onEdit={() => setDetailMode('edit')}
            onUpdate={updateShift}
            navigate={navigate}
          />
        )}
      </div>

      {modalOpen && (
        <NewShiftModal prefill={modalPrefill} onClose={() => setModalOpen(false)}
          onCreate={(s) => { createShift(s); setModalOpen(false); }}
          existingCount={shifts.length + weeklyShifts.length} />
      )}
    </div>
  );
}

// ── Date Picker Popover (Week mode) ──────────────────────────────────
function DatePicker({ month, onMonthChange, onSelectDate, currentWeekStart }) {
  const days = getDaysInMonth(month);
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const cells = [...Array(firstDay), ...days];

  const currentWeekEnd = addDays(currentWeekStart, 6);

  return (
    <div style={{
      position: 'absolute', top: '100%', left: 0, marginTop: 8, zIndex: 600,
      backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      padding: 12, minWidth: 300, animation: 'fadeIn 200ms ease-out'
    }}>
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={() => onMonthChange(addDays(month, -32))} className="p-1"
          style={{ color: 'var(--text-tertiary)' }}>
          <ChevronLeft size={14} />
        </button>
        <span className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>
          {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <button type="button" onClick={() => onMonthChange(addDays(month, 32))} className="p-1"
          style={{ color: 'var(--text-tertiary)' }}>
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-3 text-center">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
          <span key={d} className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-3">
        {cells.map((day, i) => (
          <button key={i} type="button"
            disabled={!day}
            onClick={() => day && onSelectDate(new Date(month.getFullYear(), month.getMonth(), day))}
            style={{
              width: 32, height: 32, borderRadius: 4, fontSize: 12,
              backgroundColor: !day ? 'transparent' :
                isSameDay(new Date(month.getFullYear(), month.getMonth(), day), new Date(month.getFullYear(), month.getMonth(), 1)) &&
                new Date(month.getFullYear(), month.getMonth(), day) >= currentWeekStart &&
                new Date(month.getFullYear(), month.getMonth(), day) <= currentWeekEnd ? 'var(--accent-pale)' : 'transparent',
              color: !day ? 'var(--text-muted)' :
                new Date(month.getFullYear(), month.getMonth(), day) >= currentWeekStart &&
                new Date(month.getFullYear(), month.getMonth(), day) <= currentWeekEnd ? 'var(--accent-dark)' : 'var(--text-secondary)',
              cursor: day ? 'pointer' : 'default',
              border: 'none',
              fontWeight: new Date(month.getFullYear(), month.getMonth(), day) >= currentWeekStart &&
                new Date(month.getFullYear(), month.getMonth(), day) <= currentWeekEnd ? 600 : 400,
            }}>
            {day || ''}
          </button>
        ))}
      </div>

      <button type="button" onClick={() => onSelectDate(new Date())}
        className="w-full text-xs font-semibold px-3 py-2 rounded"
        style={{ backgroundColor: 'var(--accent)', color: '#1A1A1A', border: 'none', cursor: 'pointer' }}>
        Today
      </button>
    </div>
  );
}

// ── 3-Day Date Picker Popover ────────────────────────────────────────
function DatePickerThreeDay({ month, onMonthChange, onSelectDate, selectedStart }) {
  const days = getDaysInMonth(month);
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const cells = [...Array(firstDay), ...days];
  const selectedEnd = addDays(selectedStart, 2);

  return (
    <div style={{
      position: 'absolute', top: '100%', left: 0, marginTop: 8, zIndex: 600,
      backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      padding: 12, minWidth: 280, animation: 'fadeIn 200ms ease-out'
    }}>
      <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
        Select 3-Day Start
      </div>

      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={() => onMonthChange(addDays(month, -32))} className="p-1"
          style={{ color: 'var(--text-tertiary)' }}>
          <ChevronLeft size={14} />
        </button>
        <span className="text-xs font-semibold" style={{ color: 'var(--text-main)' }}>
          {month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </span>
        <button type="button" onClick={() => onMonthChange(addDays(month, 32))} className="p-1"
          style={{ color: 'var(--text-tertiary)' }}>
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-3 text-center">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
          <span key={d} className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-3">
        {cells.map((day, i) => {
          const cellDate = day ? new Date(month.getFullYear(), month.getMonth(), day) : null;
          const isStart = day && isSameDay(cellDate, selectedStart);
          const inRange = day && cellDate >= selectedStart && cellDate <= selectedEnd;
          return (
            <button key={i} type="button"
              disabled={!day}
              onClick={() => day && onSelectDate(cellDate)}
              style={{
                width: 30, height: 30, borderRadius: 4, fontSize: 11,
                backgroundColor: !day ? 'transparent' :
                  isStart ? 'var(--accent)' :
                  inRange ? 'var(--accent-pale)' : 'transparent',
                color: !day ? 'var(--text-muted)' :
                  isStart ? '#1A1A1A' :
                  inRange ? 'var(--accent-dark)' : 'var(--text-secondary)',
                cursor: day ? 'pointer' : 'default',
                border: 'none',
                fontWeight: isStart ? 700 : 400,
              }}>
              {day || ''}
            </button>
          );
        })}
      </div>

      <div className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
        Selected: {selectedStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {selectedEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} →
      </div>

      <button type="button" onClick={() => onSelectDate(selectedStart)}
        className="w-full text-xs font-semibold px-3 py-2 rounded"
        style={{ backgroundColor: 'var(--accent)', color: '#1A1A1A', border: 'none', cursor: 'pointer' }}>
        Apply
      </button>
    </div>
  );
}

function getDaysInMonth(date) {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return Array.from({ length: lastDay }, (_, i) => i + 1);
}

// ── Weekly Calendar Grid ─────────────────────────────────────────────
function WeeklyCalendarGrid({ weekStart, shifts, resources, today, onShiftClick, onCellClick }) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        <table style={{ borderCollapse: 'collapse', minWidth: '100%', animation: 'fadeIn 300ms ease-out' }}>
          <thead>
            <tr>
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
                            {weeklyCount} shift{weeklyCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
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

// ── 3-Day Calendar Grid ──────────────────────────────────────────────
function ThreeDayCalendarGrid({ startDate, shifts, resources, today, onShiftClick, onCellClick }) {
  const days = Array.from({ length: 3 }, (_, i) => addDays(startDate, i));

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        <table style={{ borderCollapse: 'collapse', minWidth: '100%', animation: 'fadeIn 300ms ease-out' }}>
          <thead>
            <tr>
              <th style={{
                position: 'sticky', left: 0, top: 0, zIndex: 20,
                minWidth: 180, padding: '10px 12px',
                backgroundColor: 'var(--bg-base)',
                border: '1px solid var(--border)',
                borderBottom: '2px solid var(--border)',
              }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                  RESOURCE
                </span>
              </th>
              {days.map((day, i) => {
                const isToday = isSameDay(day, today);
                const dayStr = toDateStr(day);
                const count = shifts.filter(s => s.startTime.startsWith(dayStr)).length;
                return (
                  <th key={i} aria-current={isToday ? 'date' : undefined}
                    style={{
                      position: 'sticky', top: 0, zIndex: 10,
                      flex: 1, minWidth: 200, padding: '8px',
                      textAlign: 'center',
                      backgroundColor: isToday ? 'var(--accent-pale)' : 'var(--bg-base)',
                      border: '1px solid var(--border)',
                      borderBottom: isToday ? '2px solid var(--accent)' : '2px solid var(--border)',
                    }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: isToday ? 'var(--accent-dark)' : 'var(--text-muted)' }}>
                      {DAY_NAMES[day.getDay() === 0 ? 6 : day.getDay() - 1]}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: isToday ? 700 : 400, color: isToday ? 'var(--accent-dark)' : 'var(--text-secondary)' }}>
                      {day.getDate()}
                    </div>
                    {count > 0 && (
                      <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>
                        {count} shift{count !== 1 ? 's' : ''}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {resources.map((res) => (
              <tr key={res.id}>
                <td style={{
                  position: 'sticky', left: 0, zIndex: 10,
                  verticalAlign: 'top', padding: 12, minWidth: 180,
                  backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backgroundColor: 'var(--accent-pale)', border: '1px solid var(--accent)',
                      fontSize: 10, fontWeight: 700, color: 'var(--accent-dark)',
                    }}>{res.name.split(' ').map(w => w[0]).slice(0, 2).join('')}</div>
                    <div style={{ minWidth: 0, fontSize: 12 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', truncate: true }}>{res.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{res.level}</div>
                    </div>
                  </div>
                </td>
                {days.map((day, i) => {
                  const isToday = isSameDay(day, today);
                  const dayStr = toDateStr(day);
                  const dayShifts = shifts.filter(s => s.serviceResourceId === res.id && s.startTime.startsWith(dayStr));
                  const isEmpty = dayShifts.length === 0;
                  return (
                    <DayCell key={i} isToday={isToday} isEmpty={isEmpty} dayShifts={dayShifts}
                      onEmpty={() => onCellClick(res.id, dayStr)}
                      onShiftClick={onShiftClick} />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <LegendBar />
    </div>
  );
}

// ── Day Cell ─────────────────────────────────────────────────────────
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

// ── Shift Card ───────────────────────────────────────────────────────
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
      <div style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-tertiary)' }}>
        {formatShiftTime(shift.startTime)}–{formatShiftTime(shift.endTime)}
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: cfg.color }}>
        {shift.label || shift.shiftType || shift.timeSlotType}
      </div>
    </div>
  );
}

// ── Legend Bar ───────────────────────────────────────────────────────
function LegendBar() {
  return (
    <div style={{ borderTop: '1px solid var(--border)', padding: '10px 24px 4px', marginTop: 0 }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, border: '1px dashed var(--border)', backgroundColor: 'transparent', flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)' }}>Tentative</span>
        </div>
      </div>
    </div>
  );
}

// ── Day Gantt View ───────────────────────────────────────────────────
function DayGanttView({ dayStart, shifts, candidates, search, setSearch, dragCand, setDragCand, hoverRow, setHoverRow, timelineRef, handleDrop }) {
  const [selected, setSelected] = useState(null);
  return (
    <div className="flex-1 flex overflow-hidden">
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
              </div>
            );
          })}
        </div>
      </aside>

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
                        <div className="text-[10px] truncate opacity-90">{formatShiftTime(s.startTime)}–{formatShiftTime(s.endTime)}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {selected && <ShiftDetailPanel shift={selected} mode="view" onClose={() => setSelected(null)} onEdit={() => {}} onUpdate={() => {}} navigate={() => {}} />}
    </div>
  );
}

// ── Shift Detail Panel (Right-side, fixed position) ──────────────────
function ShiftDetailPanel({ shift, mode, onClose, onEdit, onUpdate, navigate }) {
  const [formData, setFormData] = useState(shift);
  const [saving, setSaving] = useState(false);
  const cfg = getShiftTypeConfig(shift);
  const sb = shiftStatusStyle(shift.status);
  const res = SERVICE_RESOURCES.find(r => r.id === shift.serviceResourceId);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      onUpdate(formData);
      setSaving(false);
    }, 500);
  };

  return (
    <div
      style={{
        position: 'fixed', top: 0, right: 0, width: 320, height: '100vh', zIndex: 500,
        backgroundColor: 'var(--bg-card)', borderLeft: '1px solid var(--border)',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.10)',
        animation: 'slideInRight 250ms ease-out',
        display: 'flex', flexDirection: 'column',
        pt: 16,
      }}
      onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 4 }}>
          {mode === 'edit' ? 'EDIT SHIFT' : 'SHIFT DETAILS'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>{shift.name}</span>
          <button type="button" onClick={onClose} aria-label="Close"
            style={{
              width: 28, height: 28, borderRadius: 4, backgroundColor: 'var(--bg-light)',
              border: '1px solid var(--border)', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
        {mode === 'view' ? (
          <>
            {/* Status Badge */}
            <div style={{ marginTop: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, backgroundColor: sb.bg, color: sb.color }}>
                {shift.status}
              </span>
            </div>

            {/* Type Card */}
            <div style={{ borderLeft: `3px solid ${cfg.color}`, backgroundColor: cfg.bg, borderRadius: 4, padding: '10px 12px', marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: cfg.color }}>
                {formatShiftTime(shift.startTime)} – {formatShiftTime(shift.endTime)}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: cfg.color, marginTop: 4 }}>
                {shift.label || shift.shiftType || shift.timeSlotType}
              </div>
            </div>

            {/* Info Rows */}
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 8, marginTop: 12 }}>
              SHIFT INFORMATION
            </div>
            {[
              ['Start Time', formatShiftTime(shift.startTime)],
              ['End Time', formatShiftTime(shift.endTime)],
              ['Date', toDateStr(new Date(shift.startTime)).split('T')[0]],
              ['Resource', res?.name || '—'],
              ['Role', res?.level || '—'],
              ['Status', shift.status],
              ['Shift Type', shift.label || shift.shiftType],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 6, borderBottom: '1px solid var(--border)', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{k}</span>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500, textAlign: 'right' }}>{v}</span>
              </div>
            ))}
          </>
        ) : (
          <>
            {/* Edit Form */}
            <div style={{ marginTop: 16, space: 16 }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 4, display: 'block' }}>Shift Type</label>
                <select value={formData.shiftType || ''} onChange={(e) => setFormData({ ...formData, shiftType: e.target.value })}
                  className="input-field" style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid var(--border)', backgroundColor: 'var(--bg-base)', color: 'var(--text-secondary)' }}>
                  {Object.keys(SHIFT_TYPE_CONFIG).filter(k => k !== 'Unknown').map(k => <option key={k}>{k}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 4, display: 'block' }}>Date</label>
                <input type="date" value={toDateStr(new Date(formData.startTime)).split('T')[0]}
                  onChange={(e) => {
                    const oldStart = new Date(formData.startTime);
                    const newDate = new Date(e.target.value);
                    const startHour = oldStart.getHours();
                    const startMin = oldStart.getMinutes();
                    newDate.setHours(startHour, startMin, 0);
                    const startStr = newDate.toISOString();
                    const oldEnd = new Date(formData.endTime);
                    const endHour = oldEnd.getHours();
                    const endMin = oldEnd.getMinutes();
                    newDate.setHours(endHour, endMin, 0);
                    setFormData({ ...formData, startTime: startStr, endTime: newDate.toISOString() });
                  }}
                  className="input-field" style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid var(--border)', backgroundColor: 'var(--bg-base)', color: 'var(--text-secondary)' }} />
              </div>

              <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 4, display: 'block' }}>Start Time</label>
                  <input type="time" value={new Date(formData.startTime).toTimeString().slice(0, 5)}
                    onChange={(e) => {
                      const [h, m] = e.target.value.split(':');
                      const d = new Date(formData.startTime);
                      d.setHours(parseInt(h), parseInt(m), 0);
                      setFormData({ ...formData, startTime: d.toISOString() });
                    }}
                    className="input-field" style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid var(--border)', backgroundColor: 'var(--bg-base)', color: 'var(--text-secondary)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 4, display: 'block' }}>End Time</label>
                  <input type="time" value={new Date(formData.endTime).toTimeString().slice(0, 5)}
                    onChange={(e) => {
                      const [h, m] = e.target.value.split(':');
                      const d = new Date(formData.endTime);
                      d.setHours(parseInt(h), parseInt(m), 0);
                      setFormData({ ...formData, endTime: d.toISOString() });
                    }}
                    className="input-field" style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid var(--border)', backgroundColor: 'var(--bg-base)', color: 'var(--text-secondary)' }} />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 4, display: 'block' }}>Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input-field" style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid var(--border)', backgroundColor: 'var(--bg-base)', color: 'var(--text-secondary)' }}>
                  {SHIFT_STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 4, display: 'block' }}>Resource</label>
                <select value={formData.serviceResourceId} onChange={(e) => setFormData({ ...formData, serviceResourceId: e.target.value })}
                  className="input-field" style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid var(--border)', backgroundColor: 'var(--bg-base)', color: 'var(--text-secondary)' }}>
                  {SERVICE_RESOURCES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--border)', padding: 16, display: 'flex', gap: 8, flexShrink: 0 }}>
        {mode === 'view' ? (
          <>
            <button type="button" onClick={onEdit}
              className="flex-1 text-sm font-semibold rounded"
              style={{ padding: '11px 16px', backgroundColor: 'var(--accent)', color: '#1A1A1A', border: 'none', cursor: 'pointer', minHeight: 44 }}>
              Edit Shift
            </button>
            <button type="button"
              className="flex-1 text-sm font-medium rounded"
              style={{ padding: '11px 16px', backgroundColor: 'var(--bg-light)', color: 'var(--color-danger, #C62828)', border: '1px solid var(--color-danger, #C62828)', cursor: 'pointer', minHeight: 44 }}>
              Delete
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={handleSave} disabled={saving}
              className="flex-1 text-sm font-semibold rounded flex items-center justify-center gap-2"
              style={{ padding: '11px 16px', backgroundColor: saving ? 'rgba(245,200,0,0.6)' : 'var(--accent)', color: '#1A1A1A', border: 'none', cursor: saving ? 'default' : 'pointer', minHeight: 44, opacity: saving ? 0.75 : 1 }}>
              {saving ? <><Clock size={14} /> Saving…</> : <><Save size={14} /> Save Changes</>}
            </button>
            <button type="button" onClick={() => { setFormData(shift); onEdit(); }}
              className="flex-1 text-sm font-medium rounded"
              style={{ padding: '11px 16px', backgroundColor: 'var(--bg-light)', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer', minHeight: 44 }}>
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── New Shift Modal ──────────────────────────────────────────────────
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
  });

  const submit = () => {
    const name = `SFT-${3061104 + existingCount}`;
    onCreate({ ...form, name });
  };

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="w-full max-w-2xl rounded-lg overflow-hidden flex flex-col max-h-[90vh]"
           style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }} onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-base font-bold" style={{ color: 'var(--text-main)' }}>New Shift</h2>
          <button onClick={onClose} aria-label="Close" style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <label>
              <span style={{ display: 'block', fontSize: 11, marginBottom: 4, color: 'var(--text-tertiary)' }}>Shift Type</span>
              <select value={form.shiftType} onChange={(e) => setForm({ ...form, shiftType: e.target.value })}
                className="input-field" style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid var(--border)', backgroundColor: 'var(--bg-base)', color: 'var(--text-secondary)' }}>
                {Object.keys(SHIFT_TYPE_CONFIG).filter(k => k !== 'Unknown').map(k => <option key={k}>{k}</option>)}
              </select>
            </label>
            <label>
              <span style={{ display: 'block', fontSize: 11, marginBottom: 4, color: 'var(--text-tertiary)' }}>Date</span>
              <input type="date" value={SHIFT_GANTT_DAY} className="input-field"
                style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid var(--border)', backgroundColor: 'var(--bg-base)', color: 'var(--text-secondary)' }} />
            </label>
            <label>
              <span style={{ display: 'block', fontSize: 11, marginBottom: 4, color: 'var(--text-tertiary)' }}>Start Time</span>
              <input type="time" value={form.startTime.split('T')[1] || '07:00'} className="input-field"
                style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid var(--border)', backgroundColor: 'var(--bg-base)', color: 'var(--text-secondary)' }} />
            </label>
            <label>
              <span style={{ display: 'block', fontSize: 11, marginBottom: 4, color: 'var(--text-tertiary)' }}>End Time</span>
              <input type="time" value={form.endTime.split('T')[1] || '17:00'} className="input-field"
                style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid var(--border)', backgroundColor: 'var(--bg-base)', color: 'var(--text-secondary)' }} />
            </label>
            <label>
              <span style={{ display: 'block', fontSize: 11, marginBottom: 4, color: 'var(--text-tertiary)' }}>Status</span>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="input-field" style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid var(--border)', backgroundColor: 'var(--bg-base)', color: 'var(--text-secondary)' }}>
                {SHIFT_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label>
              <span style={{ display: 'block', fontSize: 11, marginBottom: 4, color: 'var(--text-tertiary)' }}>Resource</span>
              <select value={form.serviceResourceId} onChange={(e) => setForm({ ...form, serviceResourceId: e.target.value })}
                className="input-field" style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid var(--border)', backgroundColor: 'var(--bg-base)', color: 'var(--text-secondary)' }}>
                {SERVICE_RESOURCES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </label>
          </div>
        </div>

        <div className="px-5 py-3 flex items-center justify-end gap-2" style={{ borderTop: '1px solid var(--border)' }}>
          <button className="px-4 py-2 text-sm rounded" style={{ backgroundColor: 'var(--bg-light)', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer' }} onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 text-sm font-semibold rounded" style={{ backgroundColor: 'var(--accent)', color: '#1A1A1A', border: 'none', cursor: 'pointer' }} onClick={submit}>Create Shift</button>
        </div>
      </div>
    </div>
  );
}
