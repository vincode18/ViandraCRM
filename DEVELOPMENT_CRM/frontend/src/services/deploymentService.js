/* ─────────────────────────────────────────────────────────────────────────
   Deployment Service
   Manages change sets, environments, and deployment history
   ───────────────────────────────────────────────────────────────────────── */

/* ─── Environments ─────────────────────────────────────────────────────────── */
export const ENVIRONMENTS = [
  { id: 'dev', label: 'Development', shortLabel: 'DEV', url: 'dev.console.ut-service.internal', color: 'info' },
  { id: 'test', label: 'Testing', shortLabel: 'TEST', url: 'test.console.ut-service.internal', color: 'warning' },
  { id: 'prod', label: 'Production', shortLabel: 'PROD', url: 'console.ut-service.internal', color: 'success' },
];

/* ─── Change Set Statuses ───────────────────────────────────────────────────── */
export const CHANGE_SET_STATUS = {
  DRAFT: 'Draft',
  OPEN: 'Open',
  VALIDATING: 'Validating',
  VALIDATED: 'Validated',
  DEPLOYING: 'Deploying',
  SUCCEEDED: 'Succeeded',
  FAILED: 'Failed',
};

/* ─── Status Colors ─────────────────────────────────────────────────────────── */
export const getStatusColor = (status) => {
  const colors = {
    [CHANGE_SET_STATUS.DRAFT]: 'text-muted',
    [CHANGE_SET_STATUS.OPEN]: 'info',
    [CHANGE_SET_STATUS.VALIDATING]: 'warning',
    [CHANGE_SET_STATUS.VALIDATED]: 'success',
    [CHANGE_SET_STATUS.DEPLOYING]: 'warning',
    [CHANGE_SET_STATUS.SUCCEEDED]: 'success',
    [CHANGE_SET_STATUS.FAILED]: 'danger',
  };
  return colors[status] || 'text-muted';
};

/* ─── Environment Health ────────────────────────────────────────────────────── */
export const HEALTH_STATUS = {
  HEALTHY: 'Healthy',
  DEPLOYING: 'Deploying',
  FAILED: 'Failed',
};

/* ─── Default Change Sets ───────────────────────────────────────────────────── */
const DEFAULT_CHANGE_SETS = [
  {
    id: 'cs-001',
    name: 'Case Module v3',
    description: 'Adds priority field to Case object',
    type: 'outbound',
    sourceEnv: 'dev',
    targetEnv: 'test',
    status: CHANGE_SET_STATUS.OPEN,
    components: [
      { type: 'field', name: 'Case.Priority', action: 'create' },
      { type: 'field', name: 'Case.SLA_Breach_Reason__c', action: 'update' },
    ],
    createdBy: 'developer@company.com',
    createdDate: '2026-06-13T09:00:00Z',
    modifiedDate: '2026-06-13T10:30:00Z',
    expirationDate: '2026-07-13T00:00:00Z',
  },
  {
    id: 'cs-002',
    name: 'WO Statuses Update',
    description: 'Updates work order status values',
    type: 'outbound',
    sourceEnv: 'dev',
    targetEnv: 'test',
    status: CHANGE_SET_STATUS.VALIDATED,
    components: [
      { type: 'field', name: 'WorkOrder.Status', action: 'update' },
    ],
    createdBy: 'developer@company.com',
    createdDate: '2026-06-12T08:00:00Z',
    modifiedDate: '2026-06-12T14:00:00Z',
    expirationDate: '2026-07-12T00:00:00Z',
  },
  {
    id: 'cs-003',
    name: 'SA Templates',
    description: 'Service appointment templates for scheduling',
    type: 'outbound',
    sourceEnv: 'test',
    targetEnv: 'prod',
    status: CHANGE_SET_STATUS.SUCCEEDED,
    components: [
      { type: 'object', name: 'SA_Template__c', action: 'create' },
    ],
    createdBy: 'admin@company.com',
    createdDate: '2026-06-10T07:00:00Z',
    modifiedDate: '2026-06-10T09:00:00Z',
    expirationDate: '2026-07-10T00:00:00Z',
  },
];

/* ─── Default Deployment History ─────────────────────────────────────────────── */
const DEFAULT_DEPLOYMENT_HISTORY = [
  {
    id: 'dh-001',
    changeSetId: 'cs-002',
    changeSetName: 'WO Statuses Update',
    sourceEnv: 'dev',
    targetEnv: 'test',
    action: 'Validate',
    actor: 'admin@company.com',
    startedAt: '2026-06-13T09:05:00Z',
    completedAt: '2026-06-13T09:05:30Z',
    status: 'Succeeded',
    errorDetail: null,
  },
  {
    id: 'dh-002',
    changeSetId: 'cs-003',
    changeSetName: 'SA Templates',
    sourceEnv: 'test',
    targetEnv: 'prod',
    action: 'Deploy',
    actor: 'admin@company.com',
    startedAt: '2026-06-10T14:00:00Z',
    completedAt: '2026-06-10T14:05:00Z',
    status: 'Succeeded',
    errorDetail: null,
  },
  {
    id: 'dh-003',
    changeSetId: 'cs-001',
    changeSetName: 'Case Module v3',
    sourceEnv: 'dev',
    targetEnv: 'test',
    action: 'Deploy',
    actor: 'admin@company.com',
    startedAt: '2026-06-11T16:00:00Z',
    completedAt: '2026-06-11T16:02:00Z',
    status: 'Failed',
    errorDetail: 'Field validation failed: Case.Priority already exists in target environment',
  },
];

/* ─── Environment State ─────────────────────────────────────────────────────── */
const DEFAULT_ENVIRONMENT_STATE = {
  dev: {
    health: HEALTH_STATUS.HEALTHY,
    version: 'v2.4.1',
    lastDeployed: '2026-06-13T09:00:00Z',
  },
  test: {
    health: HEALTH_STATUS.HEALTHY,
    version: 'v2.3.8',
    lastDeployed: '2026-06-12T14:00:00Z',
  },
  prod: {
    health: HEALTH_STATUS.HEALTHY,
    version: 'v2.3.7',
    lastDeployed: '2026-06-10T14:05:00Z',
  },
};

/* ─── Load Change Sets ───────────────────────────────────────────────────────── */
export async function loadChangeSets(type = 'outbound') {
  try {
    const saved = localStorage.getItem('deployment-change-sets');
    if (saved) {
      const all = JSON.parse(saved);
      return { success: true, data: all.filter(cs => cs.type === type) };
    }
    return { success: true, data: DEFAULT_CHANGE_SETS.filter(cs => cs.type === type) };
  } catch (error) {
    console.error('Error loading change sets:', error);
    return { success: false, error: error.message, data: DEFAULT_CHANGE_SETS.filter(cs => cs.type === type) };
  }
}

/* ─── Save Change Set ─────────────────────────────────────────────────────────── */
export async function saveChangeSet(changeSet) {
  try {
    const response = await loadChangeSets('outbound');
    const all = response.success ? [...response.data] : DEFAULT_CHANGE_SETS;
    const index = all.findIndex(cs => cs.id === changeSet.id);
    
    if (index > -1) {
      all[index] = { ...all[index], ...changeSet, modifiedDate: new Date().toISOString() };
    } else {
      all.push({
        ...changeSet,
        id: changeSet.id || `cs-${Date.now()}`,
        createdDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
      });
    }
    
    localStorage.setItem('deployment-change-sets', JSON.stringify(all));
    return { success: true, message: 'Change set saved successfully' };
  } catch (error) {
    console.error('Error saving change set:', error);
    return { success: false, error: error.message };
  }
}

/* ─── Delete Change Set ───────────────────────────────────────────────────────── */
export async function deleteChangeSet(changeSetId) {
  try {
    const response = await loadChangeSets('outbound');
    const all = response.success ? [...response.data] : DEFAULT_CHANGE_SETS;
    const filtered = all.filter(cs => cs.id !== changeSetId);
    
    localStorage.setItem('deployment-change-sets', JSON.stringify(filtered));
    return { success: true, message: 'Change set deleted successfully' };
  } catch (error) {
    console.error('Error deleting change set:', error);
    return { success: false, error: error.message };
  }
}

/* ─── Load Change Set by ID ───────────────────────────────────────────────────── */
export async function loadChangeSetById(changeSetId) {
  try {
    const response = await loadChangeSets('outbound');
    const all = response.success ? response.data : DEFAULT_CHANGE_SETS;
    const changeSet = all.find(cs => cs.id === changeSetId);
    
    if (!changeSet) {
      return { success: false, error: 'Change set not found', data: null };
    }
    
    return { success: true, data: changeSet };
  } catch (error) {
    console.error('Error loading change set:', error);
    return { success: false, error: error.message, data: null };
  }
}

/* ─── Validate Change Set ─────────────────────────────────────────────────────── */
export async function validateChangeSet(changeSetId) {
  try {
    const response = await loadChangeSetById(changeSetId);
    if (!response.success) return response;
    
    const changeSet = response.data;
    // Mock validation - randomly succeed or fail
    const success = Math.random() > 0.2;
    
    const updatedChangeSet = {
      ...changeSet,
      status: success ? CHANGE_SET_STATUS.VALIDATED : CHANGE_SET_STATUS.FAILED,
    };
    
    await saveChangeSet(updatedChangeSet);
    
    // Add to deployment history
    await addDeploymentHistory({
      changeSetId,
      changeSetName: changeSet.name,
      sourceEnv: changeSet.sourceEnv,
      targetEnv: changeSet.targetEnv,
      action: 'Validate',
      actor: 'admin@company.com',
      status: success ? 'Succeeded' : 'Failed',
      errorDetail: success ? null : 'Validation failed: Component dependency check failed',
    });
    
    return { success, message: success ? 'Validation successful' : 'Validation failed' };
  } catch (error) {
    console.error('Error validating change set:', error);
    return { success: false, error: error.message };
  }
}

/* ─── Deploy Change Set ───────────────────────────────────────────────────────── */
export async function deployChangeSet(changeSetId) {
  try {
    const response = await loadChangeSetById(changeSetId);
    if (!response.success) return response;
    
    const changeSet = response.data;
    if (changeSet.status !== CHANGE_SET_STATUS.VALIDATED) {
      return { success: false, error: 'Change set must be validated before deployment' };
    }
    
    // Mock deployment - randomly succeed or fail
    const success = Math.random() > 0.2;
    
    const updatedChangeSet = {
      ...changeSet,
      status: success ? CHANGE_SET_STATUS.SUCCEEDED : CHANGE_SET_STATUS.FAILED,
    };
    
    await saveChangeSet(updatedChangeSet);
    
    // Add to deployment history
    await addDeploymentHistory({
      changeSetId,
      changeSetName: changeSet.name,
      sourceEnv: changeSet.sourceEnv,
      targetEnv: changeSet.targetEnv,
      action: 'Deploy',
      actor: 'admin@company.com',
      status: success ? 'Succeeded' : 'Failed',
      errorDetail: success ? null : 'Deployment failed: Timeout while applying changes',
    });
    
    // Update environment state on success
    if (success) {
      await updateEnvironmentState(changeSet.targetEnv, {
        health: HEALTH_STATUS.HEALTHY,
        version: changeSet.name,
        lastDeployed: new Date().toISOString(),
      });
    }
    
    return { success, message: success ? 'Deployment successful' : 'Deployment failed' };
  } catch (error) {
    console.error('Error deploying change set:', error);
    return { success: false, error: error.message };
  }
}

/* ─── Load Deployment History ─────────────────────────────────────────────────── */
export async function loadDeploymentHistory(filters = {}) {
  try {
    const saved = localStorage.getItem('deployment-history');
    let history = saved ? JSON.parse(saved) : DEFAULT_DEPLOYMENT_HISTORY;
    
    // Apply filters
    if (filters.environment) {
      history = history.filter(h => h.sourceEnv === filters.environment || h.targetEnv === filters.environment);
    }
    if (filters.status) {
      history = history.filter(h => h.status === filters.status);
    }
    if (filters.dateFrom) {
      history = history.filter(h => new Date(h.startedAt) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      history = history.filter(h => new Date(h.startedAt) <= new Date(filters.dateTo));
    }
    
    // Sort by startedAt descending
    history.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
    
    return { success: true, data: history };
  } catch (error) {
    console.error('Error loading deployment history:', error);
    return { success: false, error: error.message, data: DEFAULT_DEPLOYMENT_HISTORY };
  }
}

/* ─── Add Deployment History ───────────────────────────────────────────────────── */
export async function addDeploymentHistory(entry) {
  try {
    const response = await loadDeploymentHistory();
    const history = response.success ? response.data : DEFAULT_DEPLOYMENT_HISTORY;
    
    const newEntry = {
      id: `dh-${Date.now()}`,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      ...entry,
    };
    
    history.unshift(newEntry);
    localStorage.setItem('deployment-history', JSON.stringify(history));
    return { success: true };
  } catch (error) {
    console.error('Error adding deployment history:', error);
    return { success: false, error: error.message };
  }
}

/* ─── Load Environment State ───────────────────────────────────────────────────── */
export async function loadEnvironmentState() {
  try {
    const saved = localStorage.getItem('deployment-environment-state');
    if (saved) {
      return { success: true, data: JSON.parse(saved) };
    }
    return { success: true, data: DEFAULT_ENVIRONMENT_STATE };
  } catch (error) {
    console.error('Error loading environment state:', error);
    return { success: false, error: error.message, data: DEFAULT_ENVIRONMENT_STATE };
  }
}

/* ─── Update Environment State ─────────────────────────────────────────────────── */
export async function updateEnvironmentState(envId, updates) {
  try {
    const response = await loadEnvironmentState();
    const state = response.success ? response.data : DEFAULT_ENVIRONMENT_STATE;
    
    state[envId] = { ...state[envId], ...updates };
    localStorage.setItem('deployment-environment-state', JSON.stringify(state));
    return { success: true };
  } catch (error) {
    console.error('Error updating environment state:', error);
    return { success: false, error: error.message };
  }
}
