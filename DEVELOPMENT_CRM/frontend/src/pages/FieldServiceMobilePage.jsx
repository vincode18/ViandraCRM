/* ─────────────────────────────────────────────────────────────────────────
   Field Service Mobile Page - My Jobs
   Shows assigned work orders for the mechanic on mobile
   ───────────────────────────────────────────────────────────────────────── */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Search, MapPin, Clock } from 'lucide-react';

export default function FieldServiceMobilePage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    // Mock data - in production, this would fetch from API
    const mockJobs = [
      {
        id: 'WO-10042',
        title: 'Hydraulic pump failure on Unit 7',
        status: 'In Progress',
        priority: 'High',
        location: 'Site A, Building 3',
        dueTime: '14:00',
        customer: 'Apex Manufacturing',
      },
      {
        id: 'WO-10051',
        title: 'Compressor service - Unit 12',
        status: 'Scheduled',
        priority: 'Medium',
        location: 'Site B, Lot 4',
        dueTime: '16:30',
        customer: 'TechCorp Industries',
      },
      {
        id: 'WO-10063',
        title: 'HVAC inspection - Level 12',
        status: 'Open',
        priority: 'Critical',
        location: 'Sudirman Tower, Lt 12',
        dueTime: '10:00',
        customer: 'Sudirman Tower',
      },
    ];
    setJobs(mockJobs);
    setLoading(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Open': 'var(--color-info)',
      'Scheduled': 'var(--color-info)',
      'In Progress': 'var(--color-success)',
      'On Hold': 'var(--color-warning)',
      'Completed': 'var(--text-muted)',
      'Cancelled': 'var(--color-danger)',
    };
    return colors[status] || 'var(--text-muted)';
  };

  const getStatusBgColor = (status) => {
    const colors = {
      'Open': 'var(--color-info-pale)',
      'Scheduled': 'var(--color-info-pale)',
      'In Progress': 'var(--color-success-pale)',
      'On Hold': 'var(--color-warning-pale)',
      'Completed': 'var(--bg-lighter)',
      'Cancelled': 'var(--color-danger-pale)',
    };
    return colors[status] || 'var(--bg-lighter)';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Critical': 'var(--color-danger)',
      'High': 'var(--priority-high)',
      'Medium': 'var(--priority-medium)',
      'Low': 'var(--priority-low)',
    };
    return colors[priority] || 'var(--text-muted)';
  };

  const getCTALabel = (status) => {
    const labels = {
      'Scheduled': 'Start Job',
      'In Progress': 'Update',
      'On Hold': 'Resume',
      'Open': 'Start Job',
      'Completed': 'View',
    };
    return labels[status] || 'View';
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todayJobs = filteredJobs.filter(job => job.status === 'In Progress' || job.status === 'Open');
  const upcomingJobs = filteredJobs.filter(job => job.status === 'Scheduled');

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)', minHeight: 'var(--mobile-header-height)' }}>
        <h1 className="text-lg font-bold">My Jobs</h1>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded" style={{ backgroundColor: 'var(--bg-light)' }}>
            <Filter size={18} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 pb-4" style={{ paddingBottom: 'calc(var(--bottom-nav-height) + var(--safe-bottom) + 16px)' }}>
        {loading ? (
          <div className="flex items-center justify-center py-12" style={{ color: 'var(--text-secondary)' }}>
            Loading jobs...
          </div>
        ) : (
          <>
            {/* Today's Jobs */}
            {todayJobs.length > 0 && (
              <>
                <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
                  Today — {todayJobs.length} job{todayJobs.length !== 1 ? 's' : ''}
                </div>
                <div className="flex flex-col gap-3 mb-6">
                  {todayJobs.map(job => (
                    <JobCard key={job.id} job={job} getStatusColor={getStatusColor} getStatusBgColor={getStatusBgColor} getPriorityColor={getPriorityColor} getCTALabel={getCTALabel} navigate={navigate} />
                  ))}
                </div>
              </>
            )}

            {/* Upcoming Jobs */}
            {upcomingJobs.length > 0 && (
              <>
                <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
                  Upcoming — {upcomingJobs.length} job{upcomingJobs.length !== 1 ? 's' : ''}
                </div>
                <div className="flex flex-col gap-3">
                  {upcomingJobs.map(job => (
                    <JobCard key={job.id} job={job} getStatusColor={getStatusColor} getStatusBgColor={getStatusBgColor} getPriorityColor={getPriorityColor} getCTALabel={getCTALabel} navigate={navigate} />
                  ))}
                </div>
              </>
            )}

            {filteredJobs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <div style={{ color: 'var(--text-muted)' }}>
                  <Filter size={48} className="mx-auto mb-3" />
                  <p className="text-center text-sm">No jobs found</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function JobCard({ job, getStatusColor, getStatusBgColor, getPriorityColor, getCTALabel, navigate }) {
  const isOverdue = job.dueTime && new Date().getHours() > parseInt(job.dueTime.split(':')[0]);

  return (
    <div
      className="card p-4 cursor-pointer transition-colors"
      style={{ padding: '16px' }}
      onClick={() => navigate(`/field/jobs/${job.id}`)}
    >
      <div className="flex items-start justify-between mb-2">
        <span
          className="px-2 py-0.5 rounded text-xs font-medium"
          style={{ backgroundColor: getStatusBgColor(job.status), color: getStatusColor(job.status) }}
        >
          {job.status}
        </span>
        <span
          className="px-2 py-0.5 rounded text-xs font-medium"
          style={{ backgroundColor: getPriorityColor(job.priority) + '20', color: getPriorityColor(job.priority) }}
        >
          {job.priority} ▲
        </span>
      </div>
      
      <div className="text-xs mb-1 font-mono" style={{ color: 'var(--text-tertiary)' }}>
        {job.id}
      </div>
      
      <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-main)' }}>
        {job.title}
      </div>
      
      <div className="flex items-center gap-1 text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
        <MapPin size={12} />
        {job.location}
      </div>
      
      <div className="flex items-center gap-1 text-xs" style={{ color: isOverdue ? 'var(--color-danger)' : 'var(--text-tertiary)' }}>
        <Clock size={12} />
        Due {job.dueTime}
      </div>
      
      <button className="btn-primary px-3 py-1.5 text-xs mt-3 w-full">
        {getCTALabel(job.status)}
      </button>
    </div>
  );
}
