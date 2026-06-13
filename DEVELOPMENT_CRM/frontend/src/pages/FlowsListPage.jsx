/* ─────────────────────────────────────────────────────────────────────────
   Flows List Page
   Lists all flows in the current app context
   ───────────────────────────────────────────────────────────────────────── */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Zap, Play, Pause } from 'lucide-react';
import { loadFlows, deleteFlow, toggleFlowStatus, getFlowTypeColor, getStatusColor, FLOW_TYPES } from '../services/flowBuilderService';

export default function FlowsListPage() {
  const navigate = useNavigate();
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showWizard, setShowWizard] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    loadFlows();
  }, []);

  const loadFlows = async () => {
    setLoading(true);
    const response = await loadFlows();
    if (response.success) {
      setFlows(response.data);
    }
    setLoading(false);
  };

  const handleDelete = async (flowId) => {
    if (!confirm('Are you sure you want to delete this flow?')) return;
    const response = await deleteFlow(flowId);
    if (response.success) {
      await loadFlows();
    }
  };

  const handleToggleStatus = async (flowId) => {
    const response = await toggleFlowStatus(flowId);
    if (response.success) {
      await loadFlows();
    }
  };

  const handleCreateFlow = async () => {
    if (!selectedType) return;
    const { createFlow } = await import('../services/flowBuilderService');
    const response = await createFlow(selectedType.id, null, `New ${selectedType.label}`);
    if (response.success) {
      setShowWizard(false);
      setSelectedType(null);
      navigate(`/flows/builder/${response.data.id}`);
    }
  };

  const filteredFlows = flows.filter(flow =>
    flow.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flow.apiName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const FlowTypeBadge = ({ type }) => {
    const typeInfo = FLOW_TYPES.find(t => t.id === type);
    const color = typeInfo ? typeInfo.color : '#757575';
    return (
      <span
        className="px-2 py-0.5 rounded text-xs font-medium"
        style={{ backgroundColor: `${color}18`, color }}
      >
        {typeInfo ? typeInfo.label : type}
      </span>
    );
  };

  const StatusBadge = ({ status }) => {
    const colors = getStatusColor(status);
    const labels = { active: 'Active', inactive: 'Inactive', draft: 'Draft' };
    return (
      <span
        className="px-2 py-0.5 rounded text-xs font-medium"
        style={{ backgroundColor: colors.bg, color: colors.text }}
      >
        {labels[status] || status}
      </span>
    );
  };

  if (showWizard) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="card p-6 w-[600px]" style={{ maxWidth: '90%' }}>
          <h2 className="text-xl font-bold mb-2">Choose a Flow Type</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>Select the type of flow you want to create</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {FLOW_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type)}
                className="p-4 border-2 rounded-lg text-left transition-colors"
                style={{
                  borderColor: selectedType?.id === type.id ? 'var(--accent)' : 'var(--border)',
                  backgroundColor: selectedType?.id === type.id ? 'var(--accent-pale)' : 'var(--bg-card)',
                }}
              >
                <div className="text-3xl mb-2">{type.icon}</div>
                <div className="font-bold text-sm mb-1">{type.label}</div>
                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{type.description}</div>
              </button>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowWizard(false);
                setSelectedType(null);
              }}
              className="btn-secondary px-4 py-2"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateFlow}
              disabled={!selectedType}
              className="btn-primary px-4 py-2 disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Flows</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
              Automate business processes without code
            </p>
          </div>
          <button
            onClick={() => setShowWizard(true)}
            className="btn-primary px-4 py-2 flex items-center gap-2"
          >
            <Plus size={16} /> New Flow
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 py-4">
        <div className="relative max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search flows…"
            className="input-field pl-9 text-sm"
          />
        </div>
      </div>

      {/* Flow Table */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="card overflow-hidden">
          {loading ? (
            <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
              Loading flows...
            </div>
          ) : filteredFlows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Zap size={48} className="mb-3" style={{ color: 'var(--text-muted)' }} />
              <p className="text-lg font-semibold mb-1">No flows yet</p>
              <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
                Automate work by building your first flow
              </p>
              <button
                onClick={() => setShowWizard(true)}
                className="btn-primary px-4 py-2 flex items-center gap-2"
              >
                <Plus size={16} /> Create Flow
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Flow Label
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Type
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Object
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Last Modified
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFlows.map(flow => (
                  <tr
                    key={flow.id}
                    className="border-b hover:bg-brand-light cursor-pointer transition-colors"
                    style={{ borderColor: 'var(--border)' }}
                    onClick={() => navigate(`/flows/builder/${flow.id}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{flow.label}</span>
                      </div>
                      <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{flow.apiName}</div>
                    </td>
                    <td className="px-4 py-3">
                      <FlowTypeBadge type={flow.type} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={flow.status} />
                    </td>
                    <td className="px-4 py-3">
                      {flow.object || '-'}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {formatDate(flow.lastModified)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/flows/builder/${flow.id}`)}
                          className="p-1.5 rounded hover:bg-brand-light"
                          title="Edit"
                        >
                          <Edit size={14} style={{ color: 'var(--text-secondary)' }} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(flow.id)}
                          className="p-1.5 rounded hover:bg-brand-light"
                          title={flow.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {flow.status === 'active' ? (
                            <Pause size={14} style={{ color: 'var(--text-secondary)' }} />
                          ) : (
                            <Play size={14} style={{ color: 'var(--text-secondary)' }} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(flow.id)}
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
