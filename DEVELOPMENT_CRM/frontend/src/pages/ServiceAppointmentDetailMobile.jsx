import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Clock, Calendar } from 'lucide-react';

const STATUS_COLORS = {
  'Scheduled':  { color: '#4A90E2', bg: 'rgba(74,144,226,0.1)' },
  'In Progress':{ color: '#34C759', bg: 'rgba(52,199,89,0.1)' },
  'Completed':  { color: 'var(--text-muted)', bg: 'var(--bg-light)' },
  'Cancelled':  { color: '#C62828', bg: '#FFEBEE' },
  'On Hold':    { color: '#FFB81C', bg: 'rgba(255,184,28,0.1)' },
};

const MOCK_APPOINTMENTS = {
  'SA-2026-00112': {
    id: 'SA-2026-00112',
    status: 'Scheduled',
    subject: 'Hydraulic Pump Inspection — Unit 7',
    dateTime: '2026-06-13T14:00:00',
    durationMinutes: 120,
    workOrderId: 'WO-10042',
    customer: { name: 'Apex Manufacturing', phone: '+62 21 820 4400' },
    address: 'Jl. Raya Bogor Km 32, Jakarta Timur',
    lat: -6.2088,
    lng: 106.8456,
    technician: 'Ahmad Rifai',
    notes: 'Customer has requested arrival before 14:30. Gate B is the entry point.',
  },
  'SA-2026-00108': {
    id: 'SA-2026-00108',
    status: 'In Progress',
    subject: 'Compressor Service — Unit 12',
    dateTime: '2026-06-13T10:30:00',
    durationMinutes: 90,
    workOrderId: 'WO-10038',
    customer: { name: 'TechCorp Industries', phone: '+62 21 460 0200' },
    address: 'Kawasan Industri Pulogadung Blok C12, Jakarta',
    lat: -6.1921,
    lng: 106.9000,
    technician: 'Ahmad Rifai',
    notes: '',
  },
};

function formatDateTime(iso) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
  };
}

export default function ServiceAppointmentDetailMobile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [appt, setAppt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAppt(MOCK_APPOINTMENTS[id] || null);
      setLoading(false);
    }, 200);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: 'var(--text-secondary)' }}>
        Loading…
      </div>
    );
  }

  if (!appt) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-4">
        <p style={{ color: 'var(--text-muted)' }}>Appointment not found.</p>
        <button className="btn-secondary" onClick={() => navigate(-1)}>Go back</button>
      </div>
    );
  }

  const badge = STATUS_COLORS[appt.status] || { color: 'var(--text-muted)', bg: 'var(--bg-light)' };
  const { date, time } = formatDateTime(appt.dateTime);
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${appt.lat},${appt.lng}`;
  const geoUrl = `geo:${appt.lat},${appt.lng}?q=${encodeURIComponent(appt.address)}`;

  const handleNavigate = () => {
    if (/android/i.test(navigator.userAgent)) {
      window.open(geoUrl, '_blank');
    } else {
      window.open(mapsUrl, '_blank');
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center gap-3 sticky top-0 z-40" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-panel)', minHeight: 'var(--mobile-header-height)' }}>
        <button onClick={() => navigate(-1)} className="p-1 min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ArrowLeft size={20} style={{ color: 'var(--text-secondary)' }} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-mono truncate" style={{ color: 'var(--text-tertiary)' }}>{appt.id}</div>
        </div>
        <span
          style={{
            padding: '3px 10px',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
            backgroundColor: badge.bg,
            color: badge.color,
            flexShrink: 0,
          }}
        >
          {appt.status}
        </span>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-auto px-4 py-4" style={{ paddingBottom: 'calc(var(--bottom-nav-height) + var(--safe-bottom) + 16px)' }}>
        {/* Title + date/time */}
        <div className="mb-5">
          <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-main)' }}>{appt.subject}</h2>
          <div className="flex items-center gap-2 text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
            <Calendar size={14} />
            <span className="font-semibold">{date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <Clock size={14} />
            <span>{time} · {appt.durationMinutes} min</span>
          </div>
        </div>

        {/* Location */}
        <div className="card p-4 mb-4" style={{ padding: 16 }}>
          <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>Location</div>
          <div className="flex items-start gap-2 text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            <MapPin size={14} style={{ flexShrink: 0, marginTop: 2 }} />
            {appt.address}
          </div>
          <button
            type="button"
            className="btn-primary w-full"
            style={{ minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            onClick={handleNavigate}
          >
            <MapPin size={16} />
            Navigate to Location
          </button>
        </div>

        {/* Customer */}
        <div className="card p-4 mb-4" style={{ padding: 16 }}>
          <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>Customer</div>
          <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-main)' }}>{appt.customer.name}</div>
          <div className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{appt.customer.phone}</div>
          <a
            href={`tel:${appt.customer.phone}`}
            className="btn-secondary w-full"
            style={{ minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none' }}
          >
            <Phone size={16} />
            Call Customer
          </a>
        </div>

        {/* Linked WO */}
        <div className="card p-4 mb-4" style={{ padding: 16 }}>
          <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>Linked Work Order</div>
          <Link
            to={`/field/jobs/${appt.workOrderId}`}
            style={{ color: 'var(--accent-dark, var(--accent))', fontSize: 14, fontWeight: 600, fontFamily: 'monospace' }}
          >
            {appt.workOrderId}
          </Link>
        </div>

        {/* Notes */}
        {appt.notes && (
          <div className="card p-4" style={{ padding: 16 }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>Notes</div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{appt.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
