import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, MapPin, Clock } from 'lucide-react';

const STATUS_COLORS = {
  'Scheduled':  { color: '#4A90E2', bg: 'rgba(74,144,226,0.1)' },
  'In Progress':{ color: '#34C759', bg: 'rgba(52,199,89,0.1)' },
  'Completed':  { color: 'var(--text-muted)', bg: 'var(--bg-light)' },
  'Cancelled':  { color: '#C62828', bg: '#FFEBEE' },
  'On Hold':    { color: '#FFB81C', bg: 'rgba(255,184,28,0.1)' },
};

const ALL_STATUSES = ['All', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'];

const MOCK_APPOINTMENTS = [
  {
    id: 'SA-2026-00112',
    customer: 'Apex Manufacturing',
    address: 'Jl. Raya Bogor Km 32, Jakarta Timur',
    dateTime: '2026-06-13T14:00:00',
    workOrderId: 'WO-10042',
    status: 'Scheduled',
    technician: 'Ahmad Rifai',
  },
  {
    id: 'SA-2026-00108',
    customer: 'TechCorp Industries',
    address: 'Kawasan Industri Pulogadung Blok C12',
    dateTime: '2026-06-13T10:30:00',
    workOrderId: 'WO-10038',
    status: 'In Progress',
    technician: 'Ahmad Rifai',
  },
  {
    id: 'SA-2026-00099',
    customer: 'Sudirman Tower',
    address: 'Jl. Jend. Sudirman Kav. 52–53, Jakarta',
    dateTime: '2026-06-12T09:00:00',
    workOrderId: 'WO-10031',
    status: 'Completed',
    technician: 'Ahmad Rifai',
  },
  {
    id: 'SA-2026-00117',
    customer: 'PT Maju Bersama',
    address: 'Jl. Gatot Subroto No. 15, Jakarta Selatan',
    dateTime: '2026-06-14T08:00:00',
    workOrderId: 'WO-10051',
    status: 'Scheduled',
    technician: 'Ahmad Rifai',
  },
];

function formatDateTime(iso) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
    time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
  };
}

export default function ServiceAppointmentsMobilePage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAppointments(MOCK_APPOINTMENTS);
      setLoading(false);
    }, 300);
  }, []);

  const filtered = appointments.filter(a => {
    const matchesSearch =
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.workOrderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeStatus === 'All' || a.status === activeStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      {/* Header */}
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)', minHeight: 'var(--mobile-header-height)' }}>
        <h1 className="text-lg font-bold">Appointments</h1>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="px-4 pb-3 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {ALL_STATUSES.map(s => (
          <button
            key={s}
            type="button"
            onClick={() => setActiveStatus(s)}
            style={{
              flexShrink: 0,
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              border: '1px solid',
              borderColor: activeStatus === s ? 'var(--accent)' : 'var(--border)',
              backgroundColor: activeStatus === s ? 'var(--accent)' : 'transparent',
              color: activeStatus === s ? 'var(--text-main)' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 pb-4" style={{ paddingBottom: 'calc(var(--bottom-nav-height) + var(--safe-bottom) + 16px)' }}>
        {loading ? (
          <div className="flex items-center justify-center py-12" style={{ color: 'var(--text-secondary)' }}>
            Loading appointments...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Calendar size={48} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No appointments found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mt-1">
            {filtered.map(appt => {
              const { date, time } = formatDateTime(appt.dateTime);
              const badge = STATUS_COLORS[appt.status] || { color: 'var(--text-muted)', bg: 'var(--bg-light)' };
              return (
                <div
                  key={appt.id}
                  className="card cursor-pointer"
                  style={{ padding: 16 }}
                  onClick={() => navigate(`/field/appointments/${appt.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter') navigate(`/field/appointments/${appt.id}`); }}
                >
                  {/* Status + WO */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 600,
                        backgroundColor: badge.bg,
                        color: badge.color,
                      }}
                    >
                      {appt.status}
                    </span>
                    <span className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>{appt.workOrderId}</span>
                  </div>

                  {/* Appt number */}
                  <div className="text-xs font-mono mb-1" style={{ color: 'var(--text-tertiary)' }}>{appt.id}</div>

                  {/* Customer */}
                  <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-main)' }}>{appt.customer}</div>

                  {/* Date/time */}
                  <div className="flex items-center gap-1 text-xs mb-1" style={{ color: 'var(--accent-dark, var(--text-secondary))' }}>
                    <Clock size={12} />
                    <span className="font-semibold">{date} · {time}</span>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    <MapPin size={12} style={{ flexShrink: 0, marginTop: 1 }} />
                    {appt.address}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
