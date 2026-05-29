import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FolderOpen, Wrench, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="card flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} aria-hidden="true" style={{ color: 'white' }} />
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>{value}</p>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{label}</p>
        {sub && <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{sub}</p>}
      </div>
    </div>
  );
}

export default function ConsolePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ cases: null, workOrders: null });
  const [recentCases, setRecentCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [casesRes, woRes] = await Promise.all([
          api.get('/cases?page=1&pageSize=5'),
          api.get('/workorders?page=1&pageSize=5'),
        ]);
        setStats({
          cases:      casesRes.data?.data?.totalCount ?? 0,
          workOrders: woRes.data?.data?.totalCount ?? 0,
        });
        setRecentCases(casesRes.data?.data?.items ?? []);
      } catch {
        // Use placeholder values if API not ready yet
        setStats({ cases: 3, workOrders: 3 });
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const statCards = [
    { icon: FolderOpen,     label: 'Total Cases',       value: loading ? '—' : stats.cases,      color: 'bg-blue-600',   sub: 'All time' },
    { icon: Wrench,         label: 'Work Orders',       value: loading ? '—' : stats.workOrders,  color: 'bg-violet-600', sub: 'All time' },
    { icon: AlertTriangle,  label: 'SLA Breaches',      value: '0',   color: 'bg-red-600',    sub: 'This month' },
    { icon: CheckCircle,    label: 'Resolved Today',    value: '0',   color: 'bg-green-600',  sub: 'Last 24 h' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome */}
      <header>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>
          Welcome back, {user?.firstName ?? 'User'} 👋
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-tertiary)' }}>
          Here's what's happening in UT Service Console today.
        </p>
      </header>

      {/* Stat cards */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Dashboard statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map(s => <StatCard key={s.label} {...s} />)}
        </div>
      </section>

      {/* Quick actions */}
      <section aria-labelledby="quick-actions-heading">
        <h2 id="quick-actions-heading" className="text-base font-semibold mb-3" style={{ color: 'var(--text-main)' }}>
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/cases"
            className="btn-primary"
          >
            <FolderOpen size={16} aria-hidden="true" />
            View All Cases
          </Link>
          <Link
            to="/workorders"
            className="btn-secondary"
          >
            <Wrench size={16} aria-hidden="true" />
            View Work Orders
          </Link>
        </div>
      </section>

      {/* Recent cases table */}
      <section aria-labelledby="recent-cases-heading">
        <div className="flex items-center justify-between mb-3">
          <h2 id="recent-cases-heading" className="text-base font-semibold" style={{ color: 'var(--text-main)' }}>
            Recent Cases
          </h2>
          <Link
            to="/cases"
            className="text-sm hover:underline" style={{ color: 'var(--accent)' }}
          >
            View all →
          </Link>
        </div>

        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm" aria-label="Recent cases">
            <thead>
              <tr className="border-b text-xs uppercase tracking-wider" style={{ borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}>
                {['Case #', 'Subject', 'Account', 'Priority', 'Status', 'Created'].map(h => (
                  <th key={h} scope="col" className="px-4 py-3 text-left font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center" style={{ color: 'var(--text-tertiary)' }}>
                    <div className="flex items-center justify-center gap-2">
                      <Clock size={16} className="animate-spin" aria-hidden="true" />
                      Loading…
                    </div>
                  </td>
                </tr>
              ) : recentCases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center" style={{ color: 'var(--text-tertiary)' }}>
                    No cases found.
                  </td>
                </tr>
              ) : (
                recentCases.map(c => (
                  <tr
                    key={c.caseID}
                    className="hover:transition-colors" style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap" style={{ color: 'var(--accent)' }}>
                      <button
                        type="button"
                        onClick={() => navigate(`/cases/${encodeURIComponent(c.caseNumber)}`)}
                        className="text-left hover:underline focus:outline-none focus:underline"
                        aria-label={`Open case ${c.caseNumber}`}
                        title="Open case detail"
                      >
                        {c.caseNumber}
                      </button>
                    </td>
                    <td className="px-4 py-3 max-w-[220px] truncate" style={{ color: 'var(--text-secondary)' }}>
                      {c.subject}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>
                      {c.accountName ?? '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <PriorityBadge value={c.priority} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge value={c.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {new Date(c.createdDate).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function PriorityBadge({ value }) {
  const map = {
    Critical: 'badge-critical',
    High:     'badge-high',
    Medium:   'badge-medium',
    Low:      'badge-low',
  };
  return <span className={map[value] ?? 'badge badge-medium'}>{value}</span>;
}

function StatusBadge({ value }) {
  const map = {
    Open:       'badge-open',
    Assigned:   'badge-assigned',
    InProgress: 'badge-inprogress',
    Resolved:   'badge-resolved',
    Closed:     'badge-closed',
  };
  return <span className={map[value] ?? 'badge badge-open'}>{value}</span>;
}
