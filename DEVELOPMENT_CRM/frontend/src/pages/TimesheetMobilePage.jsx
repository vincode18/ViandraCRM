/* ─────────────────────────────────────────────────────────────────────────
   Timesheet Mobile Page
   Week view for logging and managing work hours
   ───────────────────────────────────────────────────────────────────────── */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';

export default function TimesheetMobilePage() {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogHoursSheet, setShowLogHoursSheet] = useState(false);
  const [expandedDays, setExpandedDays] = useState({});

  useEffect(() => {
    loadTimesheet();
  }, [currentWeek]);

  const loadTimesheet = async () => {
    setLoading(true);
    // Mock data - in production, this would fetch from API
    const mockEntries = [
      {
        id: 'ts-001',
        day: 'Mon',
        date: '2026-06-09',
        totalHours: 8.0,
        entries: [
          { id: 'e1', workOrderId: 'WO-10038', type: 'Regular', hours: 6.0 },
          { id: 'e2', workOrderId: 'WO-10041', type: 'Travel', hours: 2.0 },
        ],
      },
      {
        id: 'ts-002',
        day: 'Tue',
        date: '2026-06-10',
        totalHours: 7.5,
        entries: [
          { id: 'e3', workOrderId: 'WO-10042', type: 'Regular', hours: 7.5 },
        ],
      },
      {
        id: 'ts-003',
        day: 'Wed',
        date: '2026-06-11',
        totalHours: 8.0,
        entries: [
          { id: 'e4', workOrderId: 'WO-10038', type: 'Regular', hours: 8.0 },
        ],
      },
      {
        id: 'ts-004',
        day: 'Thu',
        date: '2026-06-12',
        totalHours: 0,
        entries: [],
      },
      {
        id: 'ts-005',
        day: 'Fri',
        date: '2026-06-13',
        totalHours: 8.0,
        entries: [
          { id: 'e5', workOrderId: 'WO-10042', type: 'Regular', hours: 8.0 },
        ],
      },
    ];
    setEntries(mockEntries);
    setLoading(false);
  };

  const getWeekRange = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    return { start, end };
  };

  const weekRange = getWeekRange(currentWeek);
  const totalHours = entries.reduce((sum, day) => sum + day.totalHours, 0);
  const approvedHours = entries.reduce((sum, day) => sum + day.entries.filter(e => e.approved).reduce((s, e) => s + e.hours, 0), 0);

  const toggleDay = (dayId) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayId]: !prev[dayId],
    }));
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === 'prev' ? -7 : 7));
    setCurrentWeek(newDate);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)', minHeight: 'var(--mobile-header-height)' }}>
        <h1 className="text-lg font-bold">Timesheet</h1>
        <button className="btn-primary px-3 py-1.5 text-xs">
          Submit ↑
        </button>
      </div>

      {/* Week Navigator */}
      <div className="px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigateWeek('prev')} className="p-2">
          <ChevronLeft size={20} style={{ color: 'var(--text-secondary)' }} />
        </button>
        <div className="text-sm font-semibold">
          Week of {formatDate(weekRange.start)} – {formatDate(weekRange.end)}
        </div>
        <button onClick={() => navigateWeek('next')} className="p-2">
          <ChevronRight size={20} style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>

      {/* Summary */}
      <div className="px-4 py-2 flex justify-around text-sm border-b" style={{ borderColor: 'var(--border)' }}>
        <div>
          <span style={{ color: 'var(--text-tertiary)' }}>Total: </span>
          <span className="font-semibold">{totalHours.toFixed(1)} hrs</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-tertiary)' }}>Approved: </span>
          <span className="font-semibold" style={{ color: 'var(--color-success)' }}>{approvedHours.toFixed(1)} hrs</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 pb-4" style={{ paddingBottom: 'calc(var(--bottom-nav-height) + var(--safe-bottom) + 16px)' }}>
        {loading ? (
          <div className="flex items-center justify-center py-12" style={{ color: 'var(--text-secondary)' }}>
            Loading timesheet...
          </div>
        ) : (
          <div className="space-y-3 mt-3">
            {entries.map((day) => (
              <DayCard
                key={day.id}
                day={day}
                isExpanded={expandedDays[day.id]}
                onToggle={() => toggleDay(day.id)}
                onAddEntry={() => setShowLogHoursSheet(true)}
              />
            ))}
          </div>
        )}

        <button
          onClick={() => setShowLogHoursSheet(true)}
          className="btn-secondary w-full mt-4 flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Add Entry
        </button>
      </div>
    </div>
  );
}

function DayCard({ day, isExpanded, onToggle, onAddEntry }) {
  const isZeroHours = day.totalHours === 0;

  return (
    <div className="card p-4" style={{ padding: '16px' }}>
      <div className="flex items-center justify-between" onClick={onToggle}>
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>
            {day.day} {new Date(day.date).getDate()}
          </div>
          <div className="text-sm font-semibold" style={{ color: isZeroHours ? 'var(--text-muted)' : 'var(--text-main)' }}>
            {day.totalHours.toFixed(1)} hrs
          </div>
        </div>
        <button className="p-1.5 rounded" style={{ backgroundColor: 'var(--accent)' }} onClick={(e) => { e.stopPropagation(); onAddEntry(); }}>
          <Plus size={14} style={{ color: 'var(--text-main)' }} />
        </button>
      </div>

      {isExpanded && day.entries.length > 0 && (
        <div className="mt-3 space-y-2 pl-4">
          {day.entries.map((entry) => (
            <div key={entry.id} className="text-xs p-2 rounded" style={{ backgroundColor: 'var(--bg-light)' }}>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-info)' }}>{entry.workOrderId}</span>
                <span style={{ color: 'var(--text-tertiary)' }}>{entry.type}</span>
              </div>
              <div className="font-medium" style={{ color: 'var(--text-secondary)' }}>{entry.hours.toFixed(1)}h</div>
            </div>
          ))}
        </div>
      )}

      {isExpanded && day.entries.length === 0 && (
        <div className="mt-3 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          No entries for this day
        </div>
      )}
    </div>
  );
}
