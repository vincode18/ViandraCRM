/* ─────────────────────────────────────────────────────────────────────────
   Outbound Change Sets Page
   List of outbound change sets with actions
   ───────────────────────────────────────────────────────────────────────── */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Trash2 } from 'lucide-react';
import { loadChangeSets, deleteChangeSet, CHANGE_SET_STATUS, getStatusColor } from '../services/deploymentService';

export default function OutboundChangeSetsPage() {
  const navigate = useNavigate();
  const [changeSets, setChangeSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChangeSetsData();
  }, []);

  const loadChangeSetsData = async () => {
    setLoading(true);
    const response = await loadChangeSets('outbound');
    if (response.success) {
      setChangeSets(response.data);
    }
    setLoading(false);
  };

  const handleDelete = async (changeSetId) => {
    if (!confirm('Are you sure you want to delete this change set?')) return;
    const response = await deleteChangeSet(changeSetId);
    if (response.success) {
      await loadChangeSetsData();
    }
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

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
        <div>
          <h1 className="text-2xl font-bold">Outbound Change Sets</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            Manage change sets to deploy from this environment
          </p>
        </div>
        <button
          onClick={() => navigate('/settings/deployment/outbound/new')}
          className="btn-primary px-4 py-2 flex items-center gap-2"
        >
          <Plus size={16} /> New Change Set
        </button>
      </div>

      {/* Description */}
      <div className="px-6 py-4">
        <div className="card p-4" style={{ backgroundColor: 'var(--bg-lighter)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            An outbound change set contains customizations you want to send from this environment to a connected environment (e.g. dev → test, test → prod).
          </p>
        </div>
      </div>

      {/* Change Sets Table */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="card overflow-hidden">
          {loading ? (
            <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
              Loading change sets...
            </div>
          ) : changeSets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Plus size={48} className="mb-3" style={{ color: 'var(--text-muted)' }} />
              <p className="text-lg font-semibold mb-1">No change sets yet</p>
              <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
                Create your first outbound change set
              </p>
              <button
                onClick={() => navigate('/settings/deployment/outbound/new')}
                className="btn-primary px-4 py-2 flex items-center gap-2"
              >
                <Plus size={16} /> New Change Set
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Modified
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {changeSets.map(changeSet => (
                  <tr
                    key={changeSet.id}
                    className="border-b hover:bg-brand-light cursor-pointer transition-colors"
                    style={{ borderColor: 'var(--border)' }}
                    onClick={() => navigate(`/settings/deployment/outbound/${changeSet.id}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">{changeSet.name}</div>
                      {changeSet.description && (
                        <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{changeSet.description}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: `var(--color-${getStatusColor(changeSet.status)}-pale)`, color: `var(--color-${getStatusColor(changeSet.status)})` }}>
                        {changeSet.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {formatDate(changeSet.modifiedDate)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/settings/deployment/outbound/${changeSet.id}`)}
                          className="p-1.5 rounded hover:bg-brand-light"
                          title="Open"
                        >
                          <Eye size={14} style={{ color: 'var(--text-secondary)' }} />
                        </button>
                        <button
                          onClick={() => handleDelete(changeSet.id)}
                          className="p-1.5 rounded hover:bg-brand-light"
                          title="Delete"
                        >
                          <Trash2 size={14} style={{ color: 'var(--color-danger)' }} />
                        </button>
                      </div>
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
