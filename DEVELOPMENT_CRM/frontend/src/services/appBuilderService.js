/* ─────────────────────────────────────────────────────────────────────────
   App Builder Service
   Handles saving and loading layout templates for the App Builder Canvas
   ───────────────────────────────────────────────────────────────────────── */

/* ─── Default Layout Templates ────────────────────────────────────────────── */
const DEFAULT_LAYOUTS = {
  Case: [
    {
      id: 's-001',
      label: 'Case Information',
      columns: 2,
      displayType: 'Detail Grid',
      collapsed: false,
      fields: [
        { apiName: 'CaseNumber', label: 'Case Number', type: 'Text', pinned: false, span: 1, showLabel: true, visible: true },
        { apiName: 'Subject', label: 'Subject', type: 'Text', pinned: false, span: 1, showLabel: true, visible: true },
        { apiName: 'Status', label: 'Status', type: 'Picklist', pinned: false, span: 1, showLabel: true, visible: true },
        { apiName: 'Priority', label: 'Priority', type: 'Picklist', pinned: false, span: 1, showLabel: true, visible: true },
      ],
    },
    {
      id: 's-002',
      label: 'Customer Details',
      columns: 2,
      displayType: 'Detail Grid',
      collapsed: false,
      fields: [
        { apiName: 'AccountId', label: 'Account Name', type: 'Lookup', pinned: false, span: 1, showLabel: true, visible: true },
        { apiName: 'ContactId', label: 'Contact Name', type: 'Lookup', pinned: false, span: 1, showLabel: true, visible: true },
        { apiName: 'OwnerId', label: 'Case Owner', type: 'Lookup', pinned: false, span: 1, showLabel: true, visible: true },
      ],
    },
    {
      id: 's-003',
      label: 'Additional Info',
      columns: 2,
      displayType: 'Detail Grid',
      collapsed: false,
      fields: [
        { apiName: 'Description', label: 'Description', type: 'TextArea', pinned: false, span: 2, showLabel: true, visible: true },
        { apiName: 'Origin', label: 'Case Origin', type: 'Picklist', pinned: false, span: 1, showLabel: true, visible: true },
      ],
    },
  ],
  'Work Order': [
    {
      id: 's-001',
      label: 'Work Order Details',
      columns: 2,
      displayType: 'Detail Grid',
      collapsed: false,
      fields: [
        { apiName: 'WorkOrderNumber', label: 'Work Order Number', type: 'Text', pinned: false, span: 1, showLabel: true, visible: true },
        { apiName: 'Status', label: 'Status', type: 'Picklist', pinned: false, span: 1, showLabel: true, visible: true },
        { apiName: 'Subject', label: 'Subject', type: 'Text', pinned: false, span: 1, showLabel: true, visible: true },
      ],
    },
    {
      id: 's-002',
      label: 'Schedule',
      columns: 2,
      displayType: 'Detail Grid',
      collapsed: false,
      fields: [
        { apiName: 'StartDate', label: 'Start Date', type: 'Date', pinned: false, span: 1, showLabel: true, visible: true },
        { apiName: 'EndDate', label: 'End Date', type: 'Date', pinned: false, span: 1, showLabel: true, visible: true },
        { apiName: 'Duration', label: 'Duration', type: 'Number', pinned: false, span: 1, showLabel: true, visible: true },
      ],
    },
  ],
  'Service Appointment': [
    {
      id: 's-001',
      label: 'Appointment Info',
      columns: 2,
      displayType: 'Detail Grid',
      collapsed: false,
      fields: [
        { apiName: 'AppointmentNumber', label: 'Appointment Number', type: 'Text', pinned: false, span: 1, showLabel: true, visible: true },
        { apiName: 'Status', label: 'Status', type: 'Picklist', pinned: false, span: 1, showLabel: true, visible: true },
        { apiName: 'Subject', label: 'Subject', type: 'Text', pinned: false, span: 1, showLabel: true, visible: true },
      ],
    },
    {
      id: 's-002',
      label: 'Schedule',
      columns: 2,
      displayType: 'Detail Grid',
      collapsed: false,
      fields: [
        { apiName: 'SchedStartTime', label: 'Scheduled Start', type: 'DateTime', pinned: false, span: 1, showLabel: true, visible: true },
        { apiName: 'SchedEndTime', label: 'Scheduled End', type: 'DateTime', pinned: false, span: 1, showLabel: true, visible: true },
      ],
    },
  ],
};

/* ─── Field Schema ──────────────────────────────────────────────────────────── */
const FIELD_SCHEMA = {
  Case: {
    standard: [
      { apiName: 'CaseNumber', label: 'Case Number', type: 'Text' },
      { apiName: 'Subject', label: 'Subject', type: 'Text' },
      { apiName: 'Status', label: 'Status', type: 'Picklist' },
      { apiName: 'Priority', label: 'Priority', type: 'Picklist' },
      { apiName: 'Origin', label: 'Case Origin', type: 'Picklist' },
      { apiName: 'Description', label: 'Description', type: 'TextArea' },
      { apiName: 'AccountId', label: 'Account Name', type: 'Lookup' },
      { apiName: 'ContactId', label: 'Contact Name', type: 'Lookup' },
      { apiName: 'OwnerId', label: 'Case Owner', type: 'Lookup' },
      { apiName: 'CreatedDate', label: 'Created Date', type: 'DateTime' },
    ],
    custom: [
      { apiName: 'SLA_Hours__c', label: 'SLA Hours Remaining', type: 'Number' },
      { apiName: 'Escalation_Reason__c', label: 'Escalation Reason', type: 'Text' },
      { apiName: 'Resolution_Code__c', label: 'Resolution Code', type: 'Picklist' },
    ],
  },
  'Work Order': {
    standard: [
      { apiName: 'WorkOrderNumber', label: 'Work Order Number', type: 'Text' },
      { apiName: 'Status', label: 'Status', type: 'Picklist' },
      { apiName: 'Subject', label: 'Subject', type: 'Text' },
      { apiName: 'StartDate', label: 'Start Date', type: 'Date' },
      { apiName: 'EndDate', label: 'End Date', type: 'Date' },
      { apiName: 'AccountId', label: 'Account', type: 'Lookup' },
      { apiName: 'Duration', label: 'Duration', type: 'Number' },
    ],
    custom: [
      { apiName: 'Tech_Skills__c', label: 'Required Skills', type: 'MultiPicklist' },
      { apiName: 'Equipment_Used__c', label: 'Equipment Used', type: 'Text' },
    ],
  },
  'Service Appointment': {
    standard: [
      { apiName: 'AppointmentNumber', label: 'Appointment Number', type: 'Text' },
      { apiName: 'Status', label: 'Status', type: 'Picklist' },
      { apiName: 'SchedStartTime', label: 'Scheduled Start', type: 'DateTime' },
      { apiName: 'SchedEndTime', label: 'Scheduled End', type: 'DateTime' },
      { apiName: 'ActualStartTime', label: 'Actual Start', type: 'DateTime' },
      { apiName: 'Subject', label: 'Subject', type: 'Text' },
    ],
    custom: [
      { apiName: 'Travel_Time__c', label: 'Travel Time (min)', type: 'Number' },
      { apiName: 'Customer_Rating__c', label: 'Customer Rating', type: 'Number' },
    ],
  },
};

/* ─── Display Types ─────────────────────────────────────────────────────────── */
const DISPLAY_TYPES = ['Detail Grid', 'Metric Tile', 'Activity Timeline', 'Compact List'];

/* ─── Load Layout for Object ───────────────────────────────────────────────── */
export async function loadLayout(object) {
  try {
    // Try to load from localStorage first
    const saved = localStorage.getItem(`app-builder-layout-${object}`);
    if (saved) {
      return {
        success: true,
        data: JSON.parse(saved),
        isSaved: true,
      };
    }

    // Return default layout
    return {
      success: true,
      data: DEFAULT_LAYOUTS[object] || [],
      isSaved: false,
    };
  } catch (error) {
    console.error('Error loading layout:', error);
    return {
      success: false,
      error: error.message,
      data: DEFAULT_LAYOUTS[object] || [],
    };
  }
}

/* ─── Save Layout for Object ───────────────────────────────────────────────── */
export async function saveLayout(object, layout) {
  try {
    // Save to localStorage
    localStorage.setItem(`app-builder-layout-${object}`, JSON.stringify(layout));

    // In production, this would save to backend
    // await supabase.from('app_layouts').upsert({ object, layout_json: layout });

    return {
      success: true,
      message: 'Layout saved successfully',
    };
  } catch (error) {
    console.error('Error saving layout:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/* ─── Publish Layout ───────────────────────────────────────────────────────── */
export async function publishLayout(object, layout) {
  try {
    // Save as published version
    localStorage.setItem(`app-builder-layout-${object}-published`, JSON.stringify(layout));
    localStorage.setItem(`app-builder-layout-${object}`, JSON.stringify(layout));

    // In production, this would publish to backend
    // await supabase.from('app_layouts').upsert({ object, layout_json: layout, is_published: true });

    return {
      success: true,
      message: 'Layout published successfully',
    };
  } catch (error) {
    console.error('Error publishing layout:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/* ─── Revert to Published Layout ───────────────────────────────────────────── */
export async function revertToPublished(object) {
  try {
    const published = localStorage.getItem(`app-builder-layout-${object}-published`);
    if (published) {
      localStorage.setItem(`app-builder-layout-${object}`, published);
      return {
        success: true,
        data: JSON.parse(published),
        message: 'Reverted to published layout',
      };
    }

    return {
      success: false,
      error: 'No published layout found',
    };
  } catch (error) {
    console.error('Error reverting layout:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/* ─── Get Field Schema ─────────────────────────────────────────────────────── */
export function getFieldSchema(object) {
  return FIELD_SCHEMA[object] || { standard: [], custom: [] };
}

/* ─── Get Display Types ─────────────────────────────────────────────────────── */
export function getDisplayTypes() {
  return DISPLAY_TYPES;
}

/* ─── Get Available Objects ─────────────────────────────────────────────────── */
export function getAvailableObjects() {
  return ['Case', 'Work Order', 'Service Appointment'];
}

/* ─── Auto-save Draft ───────────────────────────────────────────────────────── */
let autoSaveTimer = null;

export function autoSaveDraft(object, layout, callback) {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer);
  }

  autoSaveTimer = setTimeout(() => {
    localStorage.setItem(`app-builder-layout-${object}-draft`, JSON.stringify(layout));
    if (callback) callback();
  }, 30000); // 30 seconds
}
