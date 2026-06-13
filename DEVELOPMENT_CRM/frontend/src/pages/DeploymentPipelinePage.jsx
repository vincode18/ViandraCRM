/* ─────────────────────────────────────────────────────────────────────────
   Deployment Pipeline Page
   Visual pipeline view showing dev, test, and prod environments
   ───────────────────────────────────────────────────────────────────────── */

import React, { useState, useEffect } from 'react';
import { RefreshCw, ArrowRight, CheckCircle, AlertCircle, Clock, History, Eye } from 'lucide-react';
import { ENVIRONMENTS, HEALTH_STATUS, loadEnvironmentState, loadDeploymentHistory } from '../services/deploymentService';

export default function DeploymentPipelinePage() {
  const [environmentState, setEnvironmentState] = useState({});
  const [deploymentHistory, setDeploymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [envResponse, historyResponse] = await Promise.all([
      loadEnvironmentState(),
      loadDeploymentHistory(),
    ]);
    
    if (envResponse.success) setEnvironmentState(envResponse.data);
    if (historyResponse.success) setDeploymentHistory(historyResponse.data.slice(0, 10));
    setLoading(false);
  };

  const getHealthIcon = (health) => {
    switch (health) {
      case HEALTH_STATUS.HEALTHY:
        return <CheckCircle size={20} style={{ color: 'var(--color-success)' }} />;
      case HEALTH_STATUS.DEPLOYING:
        return <Clock size={20} style={{ color: 'var(--color-warning)' }} />;
      case HEALTH_STATUS.FAILED:
        return <AlertCircle size={20} style={{ color: 'var(--color-danger)' }} />;
      default:
        return <Clock size={20} style={{ color: 'var(--text-muted)' }} />;
    }
  };

  const getHealthColor = (health) => {
    switch (health) {
      case HEALTH_STATUS.HEALTHY:
        return 'var(--color-success)';
      case HEALTH_STATUS.DEPLOYING:
        return 'var(--color-warning)';
      case HEALTH_STATUS.FAILED:
        return 'var(--color-danger)';
      default:
        return 'var(--text-muted)';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
        Loading pipeline...
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
        <div>
          <h1 className="text-2xl font-bold">Deployment Pipeline</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            Monitor and manage deployments across environments
          </p>
        </div>
        <button onClick={loadData} className="btn-secondary px-4 py-2 flex items-center gap-2">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Pipeline View */}
      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Environments</h2>
          <div className="flex items-center justify-between gap-4">
            {ENVIRONMENTS.map((env, index) => {
              const state = environmentState[env.id] || {};
              const isLast = index === ENVIRONMENTS.length - 1;
              
              return (
                <React.Fragment key={env.id}>
                  <div className="card flex-1 p-4" style={{ minHeight: '180px' }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: `var(--color-${env.color}-pale)`, color: `var(--color-${env.color})` }}>
                        {env.shortLabel}
                      </span>
                      {getHealthIcon(state.health)}
                    </div>
                    <h3 className="font-semibold mb-1">{env.label}</h3>
                    <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>{env.url}</p>
                    <div className="text-sm mb-1">
                      <span style={{ color: 'var(--text-tertiary)' }}>Version:</span>{' '}
                      <span className="font-medium">{state.version || 'Unknown'}</span>
                    </div>
                    <div className="text-sm mb-3">
                      <span style={{ color: 'var(--text-tertiary)' }}>Last Deployed:</span>{' '}
                      <span>{formatDate(state.lastDeployed)}</span>
                    </div>
                    <button className="text-xs flex items-center gap-1" style={{ color: 'var(--color-info)' }}>
                      <Eye size={12} /> View Change Sets
                    </button>
                  </div>
                  {!isLast && (
                    <div className="flex items-center justify-center px-2" style={{ color: 'var(--text-muted)' }}>
                      <ArrowRight size={24} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Deployment History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Deployment History</h2>
          </div>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Change Set
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    From
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    To
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Time
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
                {deploymentHistory.map((entry) => (
                  <tr key={entry.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-4 py-3 font-medium">{entry.changeSetName}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--color-info-pale)', color: 'var(--color-info)' }}>
                        {entry.sourceEnv.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--color-warning-pale)', color: 'var(--color-warning)' }}>
                        {entry.targetEnv.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {formatDate(entry.startedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-xs" style={{ color: entry.status === 'Succeeded' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                        {entry.status === 'Succeeded' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-xs flex items-center gap-1" style={{ color: 'var(--color-info)' }}>
                        <Eye size={12} /> View Results
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
