import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, CheckCircle, XCircle, AlertTriangle, ChevronRight, Search } from 'lucide-react';
import { getPendingApprovals, entriesByTimesheet, TSE_STATUS_TOKENS, hasDeviation, TIMESHEETS } from '../utils/taskData';

function TSEStatusChip({ status }) {
  const t = TSE_STATUS_TOKENS[status] || TSE_STATUS_TOKENS['Draft'];
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
      style={{ backgroundColor: t.bg, color: t.text, border: `1px solid ${t.border}` }}>
      {t.label}
    </span>
  );
}

export default function TimesheetApprovalPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Submitted');
  const [approvedIds, setApprovedIds] = useState([]);
  const [rejectedIds, setRejectedIds] = useState([]);
  const [confirmAll, setConfirmAll] = useState(false);

  const allSheets = TIMESHEETS;
  const filtered = allSheets.filter(s => {
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    const matchSearch = !search ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.serviceResource.toLowerCase().includes(search.toLowerCase()) ||
      s.workOrderRef.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const pending = filtered.filter(s => s.status === 'Submitted');
  const pendingCount = getPendingApprovals().length;

  function handleApprove(id) {
    setApprovedIds(p => [...p, id]);
    setRejectedIds(p => p.filter(x => x !== id));
  }
  function handleReject(id) {
    setRejectedIds(p => [...p, id]);
    setApprovedIds(p => p.filter(x => x !== id));
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>

      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="px-6 py-5" style={{ backgroundColor: 'var(--bg-panel)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>Timesheet Approval Queue</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {pendingCount} timesheet{pendingCount !== 1 ? 's' : ''} pending approval
            </p>
          </div>
          <div className="flex items-center gap-2">
            {pending.length > 0 && (
              <button
                onClick={() => setConfirmAll(true)}
                className="px-4 py-2 rounded text-sm font-semibold flex items-center gap-2"
                style={{ backgroundColor: '#388E3C', color: '#fff' }}>
                <CheckCircle size={15} /> Approve All ({pending.length})
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mt-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by ID, resource, WO..."
              className="w-full text-sm rounded-lg pl-8 pr-3 py-2"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
            />
          </div>
          <div className="flex items-center gap-1">
            {['All', 'Submitted', 'Approved', 'Rejected'].map(s => (
              <button key={s}
                onClick={() => setStatusFilter(s)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                style={{
                  backgroundColor: statusFilter === s ? 'var(--accent)' : 'var(--bg-card)',
                  color: statusFilter === s ? '#1a1a1a' : 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}>
                {s}
                {s === 'Submitted' && pendingCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ backgroundColor: '#C62828', color: '#fff' }}>{pendingCount}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Timer size={40} className="mb-3" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No timesheets found for the selected filter.</p>
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
                  {['Timesheet ID', 'Resource', 'Work Order', 'Date', 'Duration', 'Entries', 'Deviation', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((sheet, idx) => {
                  const entries = entriesByTimesheet(sheet.id);
                  const devFlag = hasDeviation(entries);
                  const isApproved = approvedIds.includes(sheet.id);
                  const isRejected = rejectedIds.includes(sheet.id);
                  const effectiveStatus = isApproved ? 'Approved' : isRejected ? 'Rejected' : sheet.status;

                  return (
                    <tr key={sheet.id}
                      className="border-b transition-colors"
                      style={{ borderColor: 'var(--border)', backgroundColor: idx % 2 === 0 ? 'var(--bg-base)' : 'var(--bg-card)' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-light)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? 'var(--bg-base)' : 'var(--bg-card)'}
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate(`/timesheets/${sheet.id}`)}
                          className="font-mono text-xs font-semibold hover:underline"
                          style={{ color: 'var(--accent)' }}>
                          {sheet.id}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-main)' }}>{sheet.serviceResource}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate(`/workorders/${encodeURIComponent(sheet.workOrderRef)}`)}
                          className="text-xs font-medium hover:underline flex items-center gap-1"
                          style={{ color: 'var(--text-secondary)' }}>
                          {sheet.workOrderRef} <ChevronRight size={10} />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{sheet.startDate}</td>
                      <td className="px-4 py-3 font-mono text-sm font-semibold" style={{ color: 'var(--text-main)' }}>{sheet.totalDuration}H</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{sheet.entryCount}</td>
                      <td className="px-4 py-3">
                        {devFlag ? (
                          <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#C62828' }}>
                            <AlertTriangle size={12} /> Deviation
                          </span>
                        ) : (
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>
                      <td className="px-4 py-3"><TSEStatusChip status={effectiveStatus} /></td>
                      <td className="px-4 py-3">
                        {(effectiveStatus === 'Submitted') && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleApprove(sheet.id)}
                              className="px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                              style={{ backgroundColor: '#388E3C', color: '#fff' }}>
                              <CheckCircle size={11} /> Approve
                            </button>
                            <button
                              onClick={() => handleReject(sheet.id)}
                              className="px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                              style={{ backgroundColor: '#C62828', color: '#fff' }}>
                              <XCircle size={11} /> Reject
                            </button>
                          </div>
                        )}
                        {effectiveStatus === 'Approved' && (
                          <span className="text-xs font-medium flex items-center gap-1" style={{ color: '#34C759' }}>
                            <CheckCircle size={11} /> Approved
                          </span>
                        )}
                        {effectiveStatus === 'Rejected' && (
                          <span className="text-xs font-medium flex items-center gap-1" style={{ color: '#C62828' }}>
                            <XCircle size={11} /> Rejected
                          </span>
                        )}
                        {effectiveStatus !== 'Submitted' && effectiveStatus !== 'Approved' && effectiveStatus !== 'Rejected' && (
                          <button onClick={() => navigate(`/timesheets/${sheet.id}`)}
                            className="text-xs px-2.5 py-1 rounded"
                            style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Confirm All Modal ───────────────────────────────── */}
      {confirmAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl p-6 shadow-2xl"
            style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
            <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-main)' }}>Approve All Timesheets?</h3>
            <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
              You are about to approve <strong>{pending.length}</strong> timesheet{pending.length !== 1 ? 's' : ''}. This action will mark them as approved and queue them for SAP posting.
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmAll(false)}
                className="px-4 py-2 rounded text-sm"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                Cancel
              </button>
              <button onClick={() => {
                setApprovedIds(p => [...p, ...pending.map(s => s.id)]);
                setConfirmAll(false);
              }}
                className="px-4 py-2 rounded text-sm font-semibold"
                style={{ backgroundColor: '#388E3C', color: '#fff' }}>
                Confirm Approve All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
