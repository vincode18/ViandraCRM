/* ─────────────────────────────────────────────────────────────────────────
   Flow Builder Service
   Handles saving and loading flow definitions
   ───────────────────────────────────────────────────────────────────────── */

/* ─── Flow Types ───────────────────────────────────────────────────────────── */
export const FLOW_TYPES = [
  { id: 'screen', label: 'Screen Flow', icon: '🖥', description: 'User-triggered flow with UI screens', color: '#1976D2' },
  { id: 'schedule', label: 'Schedule-Triggered', icon: '⏱', description: 'Runs on a time-based schedule', color: '#00897B' },
  { id: 'autolaunched', label: 'Autolaunched', icon: '⚡', description: 'Invoked by other flows, APIs, or processes', color: '#FF9500' },
  { id: 'record', label: 'Record-Triggered', icon: '📋', description: 'Runs when a record is created/updated/deleted', color: '#E91E8C' },
  { id: 'platform', label: 'Platform Event-Triggered', icon: '📡', description: 'Runs when a platform event is received', color: '#7B1FA2' },
];

/* ─── Toolbox Elements ───────────────────────────────────────────────────────── */
export const TOOLBOX_ELEMENTS = {
  interaction: [
    { id: 'action', label: 'Action', icon: '⚙', category: 'interaction' },
    { id: 'subflow', label: 'Subflow', icon: '↩', category: 'interaction' },
  ],
  logic: [
    { id: 'assignment', label: 'Assignment', icon: '≡', category: 'logic' },
    { id: 'decision', label: 'Decision', icon: '◇', category: 'logic' },
    { id: 'pause', label: 'Pause', icon: '⏸', category: 'logic' },
    { id: 'loop', label: 'Loop', icon: '↻', category: 'logic' },
  ],
  data: [
    { id: 'create-records', label: 'Create Records', icon: '➕', category: 'data' },
    { id: 'update-records', label: 'Update Records', icon: '✏', category: 'data' },
    { id: 'get-records', label: 'Get Records', icon: '🔍', category: 'data' },
    { id: 'delete-records', label: 'Delete Records', icon: '🗑', category: 'data' },
  ],
};

/* ─── Default Flows ──────────────────────────────────────────────────────────── */
const DEFAULT_FLOWS = [
  {
    id: 'flow-001',
    label: 'Auto-Assign High Priority Cases',
    apiName: 'Auto_Assign_High_Priority_Cases',
    type: 'record',
    object: 'Case',
    status: 'active',
    lastModified: '2026-06-10T14:30:00Z',
    description: 'Automatically assigns high priority cases to senior technicians',
    nodes: [
      { id: 'start', type: 'start', x: 100, y: 50, label: 'Start' },
      { id: 'decision-1', type: 'decision', x: 100, y: 150, label: 'Is High Priority?' },
      { id: 'action-1', type: 'action', x: 50, y: 280, label: 'Assign to Senior Tech' },
      { id: 'end', type: 'end', x: 100, y: 400, label: 'End' },
    ],
    connections: [
      { from: 'start', to: 'decision-1' },
      { from: 'decision-1', to: 'action-1', label: 'Yes' },
      { from: 'decision-1', to: 'end', label: 'No' },
      { from: 'action-1', to: 'end' },
    ],
  },
  {
    id: 'flow-002',
    label: 'Daily SLA Reminder',
    apiName: 'Daily_SLA_Reminder',
    type: 'schedule',
    object: 'Case',
    status: 'active',
    lastModified: '2026-06-09T09:00:00Z',
    description: 'Sends reminder emails for cases approaching SLA breach',
    nodes: [
      { id: 'start', type: 'start', x: 100, y: 50, label: 'Start' },
      { id: 'get-1', type: 'get-records', x: 100, y: 150, label: 'Get Cases Near SLA' },
      { id: 'loop-1', type: 'loop', x: 100, y: 280, label: 'For Each Case' },
      { id: 'action-1', type: 'action', x: 100, y: 400, label: 'Send Email' },
      { id: 'end', type: 'end', x: 100, y: 520, label: 'End' },
    ],
    connections: [
      { from: 'start', to: 'get-1' },
      { from: 'get-1', to: 'loop-1' },
      { from: 'loop-1', to: 'action-1', label: 'For Each' },
      { from: 'action-1', to: 'loop-1', label: 'After Last' },
      { from: 'loop-1', to: 'end', label: 'After Last' },
    ],
  },
  {
    id: 'flow-003',
    label: 'Work Order Approval',
    apiName: 'Work_Order_Approval',
    type: 'screen',
    object: 'WorkOrder',
    status: 'draft',
    lastModified: '2026-06-12T16:45:00Z',
    description: 'Screen flow for work order approval process',
    nodes: [
      { id: 'start', type: 'start', x: 100, y: 50, label: 'Start' },
      { id: 'screen-1', type: 'screen', x: 100, y: 150, label: 'Review Details' },
      { id: 'decision-1', type: 'decision', x: 100, y: 280, label: 'Approved?' },
      { id: 'update-1', type: 'update-records', x: 50, y: 410, label: 'Set Status to Approved' },
      { id: 'update-2', type: 'update-records', x: 150, y: 410, label: 'Set Status to Rejected' },
      { id: 'end', type: 'end', x: 100, y: 530, label: 'End' },
    ],
    connections: [
      { from: 'start', to: 'screen-1' },
      { from: 'screen-1', to: 'decision-1' },
      { from: 'decision-1', to: 'update-1', label: 'Yes' },
      { from: 'decision-1', to: 'update-2', label: 'No' },
      { from: 'update-1', to: 'end' },
      { from: 'update-2', to: 'end' },
    ],
  },
];

/* ─── Load Flows ─────────────────────────────────────────────────────────────── */
export async function loadFlows() {
  try {
    const saved = localStorage.getItem('flow-builder-flows');
    if (saved) {
      return { success: true, data: JSON.parse(saved) };
    }
    return { success: true, data: DEFAULT_FLOWS };
  } catch (error) {
    console.error('Error loading flows:', error);
    return { success: false, error: error.message, data: DEFAULT_FLOWS };
  }
}

/* ─── Save Flow ───────────────────────────────────────────────────────────────── */
export async function saveFlow(flow) {
  try {
    const response = await loadFlows();
    const flows = response.success ? response.data : DEFAULT_FLOWS;
    const index = flows.findIndex(f => f.id === flow.id);
    
    if (index > -1) {
      flows[index] = { ...flows[index], ...flow, lastModified: new Date().toISOString() };
    } else {
      flows.push({ ...flow, lastModified: new Date().toISOString() });
    }
    
    localStorage.setItem('flow-builder-flows', JSON.stringify(flows));
    return { success: true, message: 'Flow saved successfully' };
  } catch (error) {
    console.error('Error saving flow:', error);
    return { success: false, error: error.message };
  }
}

/* ─── Delete Flow ─────────────────────────────────────────────────────────────── */
export async function deleteFlow(flowId) {
  try {
    const response = await loadFlows();
    const flows = response.success ? response.data : DEFAULT_FLOWS;
    const filtered = flows.filter(f => f.id !== flowId);
    
    localStorage.setItem('flow-builder-flows', JSON.stringify(filtered));
    return { success: true, message: 'Flow deleted successfully' };
  } catch (error) {
    console.error('Error deleting flow:', error);
    return { success: false, error: error.message };
  }
}

/* ─── Load Flow by ID ─────────────────────────────────────────────────────────── */
export async function loadFlowById(flowId) {
  try {
    const response = await loadFlows();
    const flows = response.success ? response.data : DEFAULT_FLOWS;
    const flow = flows.find(f => f.id === flowId);
    
    if (!flow) {
      return { success: false, error: 'Flow not found', data: null };
    }
    
    return { success: true, data: flow };
  } catch (error) {
    console.error('Error loading flow:', error);
    return { success: false, error: error.message, data: null };
  }
}

/* ─── Create New Flow ─────────────────────────────────────────────────────────── */
export async function createFlow(type, object, label) {
  const newFlow = {
    id: `flow-${Date.now()}`,
    label: label || 'New Flow',
    apiName: label ? label.replace(/\s+/g, '_') : 'New_Flow',
    type,
    object,
    status: 'draft',
    lastModified: new Date().toISOString(),
    description: '',
    nodes: [
      { id: 'start', type: 'start', x: 100, y: 50, label: 'Start' },
      { id: 'end', type: 'end', x: 100, y: 300, label: 'End' },
    ],
    connections: [
      { from: 'start', to: 'end' },
    ],
  };
  
  return saveFlow(newFlow);
}

/* ─── Activate/Deactivate Flow ────────────────────────────────────────────────── */
export async function toggleFlowStatus(flowId) {
  try {
    const response = await loadFlowById(flowId);
    if (!response.success) return response;
    
    const flow = response.data;
    flow.status = flow.status === 'active' ? 'inactive' : 'active';
    flow.lastModified = new Date().toISOString();
    
    return saveFlow(flow);
  } catch (error) {
    console.error('Error toggling flow status:', error);
    return { success: false, error: error.message };
  }
}

/* ─── Get Flow Type Badge Color ───────────────────────────────────────────────── */
export function getFlowTypeColor(type) {
  const typeInfo = FLOW_TYPES.find(t => t.id === type);
  return typeInfo ? typeInfo.color : '#757575';
}

/* ─── Get Status Badge Color ──────────────────────────────────────────────────── */
export function getStatusColor(status) {
  const colors = {
    active: { bg: 'rgba(56, 142, 60, 0.1)', text: '#388E3C' },
    inactive: { bg: 'rgba(117, 117, 117, 0.1)', text: '#757575' },
    draft: { bg: 'rgba(245, 124, 0, 0.1)', text: '#F57C00' },
  };
  return colors[status] || colors.inactive;
}
