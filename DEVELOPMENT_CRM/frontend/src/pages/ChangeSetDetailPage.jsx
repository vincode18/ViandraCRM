/* ─────────────────────────────────────────────────────────────────────────
   Change Set Detail Page
   Detail view with Validate/Deploy/Delete actions
   ───────────────────────────────────────────────────────────────────────── */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Play, Trash2, UploadFile, History, AlertCircle } from 'lucide-react';
import { loadChangeSetById, validateChangeSet, deployChangeSet, deleteChangeSet, CHANGE_SET_STATUS, getStatusColor, loadDeploymentHistory } from '../services/deploymentService';

export default function ChangeSetDetailPage() {
  const navigate = useNavigate();
  const { changeSetId } = useParams();
  const [changeSet, setChangeSet] = useState(null);
  const [deploymentHistory, setDeploymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadChangeSetData();
  }, [changeSetId]);

  const loadChangeSetData = async () => {
    setLoading(true);
    const [csResponse, historyResponse] = await Promise.all([
      loadChangeSetById(changeSetId),
      loadDeploymentHistory({ changeSetId }),
    ]);
    
    if (csResponse.success) setChangeSet(csResponse.data);
    if (historyResponse.success) setDeploymentHistory(historyResponse.data);
    setLoading(false);
  };

  const handleValidate = async () => {
    setValidating(true);
    setError(null);
    const response = await validateChangeSet(changeSetId);
    if (response.success) {
      await loadChangeSetData();
    } else {
      setError(response.error || 'Validation failed');
    }
    setValidating(false);
  };

  const handleDeploy = async () => {
    setShowConfirmModal(true);
  };

  const confirmDeploy = async () => {
    setShowConfirmModal(false);
    setDeploying(true);
    setError(null);
    const response = await deployChangeSet(changeSetId);
    if (response.success) {
      await loadChangeSetData();
    } else {
      setError(response.error || 'Deployment failed');
    }
    setDeploying(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this change set?')) return;
    const response = await deleteChangeSet(changeSetId);
    if (response.success) {
      navigate('/settings/deployment/outbound');
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

  const isSystemAdmin = true; // TODO: Get from auth context

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
        Loading change set...
      </div>
    );
  }

  if (!changeSet) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
        Change set not found
      </div>
    );
  }

  const canValidate = isSystemAdmin && (changeSet.status === CHANGE_SET_STATUS.OPEN || changeSet.status === CHANGE_SET_STATUS.FAILED);
  const canDeploy = isSystemAdmin && changeSet.status === CHANGE_SET_STATUS.VALIDATED;
  const canDelete = isSystemAdmin && (changeSet.status === CHANGE_SET_STATUS.DRAFT || changeSet.status === CHANGE_SET_STATUS.OPEN || changeSet.status === CHANGE_SET_STATUS.FAILED);

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/settings/deployment/outbound')} className="btn-secondary p-1.5">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Change Set Detail</h1>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{changeSet.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isSystemAdmin ? (
            <>
              <button
                onClick={handleValidate}
                disabled={!canValidate || validating}
                className="btn-secondary px-3 py-1.5 text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <CheckCircle size={14} /> {validating ? 'Validating...' : 'Validate'}
              </button>
              <button
                onClick={handleDeploy}
                disabled={!canDeploy || deploying}
                className="btn-primary px-3 py-1.5 text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <Play size={14} /> {deploying ? 'Deploying...' : 'Deploy'}
              </button>
              <button
                onClick={handleDelete}
                disabled={!canDelete}
                className="btn-secondary px-3 py-1.5 text-sm flex items-center gap-2 disabled:opacity-50"
                style={{ color: 'var(--color-danger)' }}
              >
                <Trash2 size={14} /> Delete
              </button>
            </>
          ) : (
            <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--bg-lighter)', color: 'var(--text-muted)' }}>
              System Administrator access required for actions
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6">
        {/* Error Panel */}
        {error && (
          <div className="card p-4 mb-4 flex items-start gap-3" style={{ backgroundColor: '#FFEBEE', borderColor: 'var(--color-danger)' }}>
            <AlertCircle size={20} style={{ color: 'var(--color-danger)' }} />
            <div>
              <div className="font-semibold" style={{ color: 'var(--color-danger)' }}>Error</div>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        )}

        {/* Change Set Info */}
        <div className="card p-4 mb-4">
          <h2 className="font-semibold mb-3">Change Set Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span style={{ color: 'var(--text-tertiary)' }}>Name:</span>{' '}
              <span className="font-medium">{changeSet.name}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-tertiary)' }}>Status:</span>{' '}
              <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: `var(--color-${getStatusColor(changeSet.status)}-pale)`, color: `var(--color-${getStatusColor(changeSet.status)})` }}>
                {changeSet.status}
              </span>
            </div>
            <div>
              <span style={{ color: 'var(--text-tertiary)' }}>Description:</span>{' '}
              <span>{changeSet.description || '-'}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-tertiary)' }}>Expiration Date:</span>{' '}
              <span>{formatDate(changeSet.expirationDate)}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-tertiary)' }}>Created By:</span>{' '}
              <span>{changeSet.createdBy}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-tertiary)' }}>Created Date:</span>{' '}
              <span>{formatDate(changeSet.createdDate)}</span>
            </div>
          </div>
        </div>

        {/* Source Information */}
        <div className="card p-4 mb-4">
          <h2 className="font-semibold mb-3">Source Information</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span style={{ color: 'var(--text-tertiary)' }}>Source Deployment:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: 'var(--color-info-pale)', color: 'var(--color-info)' }}>
                  {changeSet.sourceEnv.toUpperCase()}
                </span>
                <span>→</span>
                <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: 'var(--color-warning-pale)', color: 'var(--color-warning)' }}>
                  {changeSet.targetEnv.toUpperCase()}
                </span>
              </div>
            </div>
            <button className="btn-secondary px-3 py-1.5 text-sm flex items-center gap-2">
              <UploadFile size={14} /> Upload File
            </button>
          </div>
        </div>

        {/* Components */}
        <div className="card p-4 mb-4">
          <h2 className="font-semibold mb-3">Components</h2>
          {changeSet.components && changeSet.components.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <th className="px-3 py-2 text-left text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>Type</th>
                  <th className="px-3 py-2 text-left text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>Name</th>
                  <th className="px-3 py-2 text-left text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {changeSet.components.map((component, index) => (
                  <tr key={index} className="border-b" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-3 py-2">{component.type}</td>
                    <td className="px-3 py-2 font-medium">{component.name}</td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--bg-lighter)', color: 'var(--text-secondary)' }}>
                        {component.action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No components added</div>
          )}
        </div>

        {/* Deployment History */}
        <div className="card p-4">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <History size={16} /> Deployment History
          </h2>
          {deploymentHistory.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <th className="px-3 py-2 text-left text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>Action</th>
                  <th className="px-3 py-2 text-left text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>Start Time</th>
                  <th className="px-3 py-2 text-left text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>End Time</th>
                  <th className="px-3 py-2 text-left text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {deploymentHistory.map((entry) => (
                  <tr key={entry.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-3 py-2">{entry.action}</td>
                    <td className="px-3 py-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>{formatDate(entry.startedAt)}</td>
                    <td className="px-3 py-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>{formatDate(entry.completedAt)}</td>
                    <td className="px-3 py-2">
                      <span className="flex items-center gap-1 text-xs" style={{ color: entry.status === 'Succeeded' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                        {entry.status === 'Succeeded' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No deployment history</div>
          )}
        </div>
      </div>

      {/* Confirm Deploy Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card p-6" style={{ maxWidth: '400px' }}>
            <h2 className="text-lg font-bold mb-4">Confirm Deployment</h2>
            <p className="text-sm mb-4">
              You are about to deploy:<br />
              <strong>"{changeSet.name}"</strong><br />
              From: {changeSet.sourceEnv.toUpperCase()} → {changeSet.targetEnv.toUpperCase()}
            </p>
            <p className="text-sm mb-4" style={{ color: 'var(--color-warning)' }}>
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowConfirmModal(false)} className="btn-secondary px-4 py-2">
                Cancel
              </button>
              <button onClick={confirmDeploy} className="btn-primary px-4 py-2">
                Deploy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
