/* ─────────────────────────────────────────────────────────────────────────
   Inbound Change Sets Page
   List of inbound change sets received from lower environments
   ───────────────────────────────────────────────────────────────────────── */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, CheckCircle, Clock, XCircle } from 'lucide-react';
import { loadChangeSets, CHANGE_SET_STATUS, getStatusColor } from '../services/deploymentService';

export default function InboundChangeSetsPage() {
  const navigate = useNavigate();
  const [changeSets, setChangeSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChangeSetsData();
  }, []);

  const loadChangeSetsData = async () => {
    setLoading(true);
    const response = await loadChangeSets('inbound');
    if (response.success) {
      setChangeSets(response.data);
    }
    setLoading(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getInboundStatus = (status) => {
    if (status === CHANGE_SET_STATUS.SUCCEEDED) return 'Deployed';
    if (status === CHANGE_SET_STATUS.VALIDATED) return 'Ready';
    return 'Pending';
  };

  const getInboundStatusIcon = (status) => {
    if (status === CHANGE_SET_STATUS.SUCCEEDED) return <CheckCircle size={14} style={{ color: 'var(--color-success)' }} />;
    if (status === CHANGE_SET_STATUS.VALIDATED) return <CheckCircle size={14} style={{ color: 'var(--color-success)' }} />;
    return <Clock size={14} style={{ color: 'var(--color-warning)' }} />;
  };

  // Mock inbound change sets (simulating received from lower environments)
  const mockInboundChangeSets = [
    {
      id: 'inbound-001',
      name: 'WO Fields v2',
      description: 'Work order field updates from dev',
      type: 'inbound',
      sourceEnv: 'dev',
      targetEnv: 'test',
      status: CHANGE_SET_STATUS.VALIDATED,
      components: [],
      createdBy: 'developer@company.com',
      createdDate: '2026-06-13T09:00:00Z',
      modifiedDate: '2026-06-13T09:00:00Z',
    },
    {
      id: 'inbound-002',
      name: 'SA Templates',
      description: 'Service appointment templates from test',
      type: 'inbound',
      sourceEnv: 'test',
      targetEnv: 'prod',
      status: CHANGE_SET_STATUS.SUCCEEDED,
      components: [],
      createdBy: 'admin@company.com',
      createdDate: '2026-06-11T08:00:00Z',
      modifiedDate: '2026-06-11T08:00:00Z',
    },
  ];

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div>
          <h1 className="text-2xl font-bold">Inbound Change Sets</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            View change sets received from connected lower environments
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="px-6 py-4">
        <div className="card p-4" style={{ backgroundColor: 'var(--bg-lighter)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            This environment receives change sets from connected lower environments. System Admins must validate and deploy each inbound change set to apply it.
          </p>
        </div>
      </div>

      {/* Change Sets Table */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="card overflow-hidden">
          {loading ? (
            <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
              Loading inbound change sets...
            </div>
          ) : mockInboundChangeSets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-lg font-semibold mb-1">No pending inbound change sets</p>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Change sets from lower environments will appear here
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Source
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Received
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockInboundChangeSets.map(changeSet => (
                  <tr
                    key={changeSet.id}
                    className="border-b hover:bg-brand-light cursor-pointer transition-colors"
                    style={{ borderColor: 'var(--border)' }}
                    onClick={() => navigate(`/settings/deployment/inbound/${changeSet.id}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">{changeSet.name}</div>
                      {changeSet.description && (
                        <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{changeSet.description}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: 'var(--color-info-pale)', color: 'var(--color-info)' }}>
                        {changeSet.sourceEnv.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {formatDate(changeSet.modifiedDate)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-xs" style={{ color: changeSet.status === CHANGE_SET_STATUS.SUCCEEDED ? 'var(--color-success)' : 'var(--color-warning)' }}>
                        {getInboundStatusIcon(changeSet.status)}
                        {getInboundStatus(changeSet.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          navigate(`/settings/deployment/inbound/${changeSet.id}`);
                        }}
                        className="p-1.5 rounded hover:bg-brand-light"
                        title="View"
                      >
                        <Eye size={14} style={{ color: 'var(--text-secondary)' }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
