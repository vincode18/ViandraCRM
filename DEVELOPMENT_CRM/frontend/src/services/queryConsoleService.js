/* ─────────────────────────────────────────────────────────────────────────
   Query Console Service
   Handles query execution for SOQL/SOSL/DML with fallback to mock data
   ───────────────────────────────────────────────────────────────────────── */

import { supabase, queryTable, insertRecord, updateRecord, deleteRecord } from '../utils/supabaseClient';

/* ── Mock query results for demonstration ────────────────────────────── */
function getMockQueryResults(query, mode) {
  const lowerQuery = query.toLowerCase();

  // Case queries
  if (lowerQuery.includes('case') || lowerQuery.includes('cases')) {
    return {
      columns: ['id', 'case_number', 'subject', 'status', 'priority', 'created_at'],
      rows: [
        ['500xx000001', 'CASE-001', 'HVAC System Failure', 'Open', 'High', '2026-06-10T08:00:00Z'],
        ['500xx000002', 'CASE-002', 'Maintenance Request', 'In Progress', 'Medium', '2026-06-09T14:30:00Z'],
        ['500xx000003', 'CASE-003', 'Equipment Upgrade', 'Closed', 'Low', '2026-06-08T10:00:00Z'],
        ['500xx000004', 'CASE-004', 'Emergency Repair', 'Open', 'Critical', '2026-06-12T07:45:00Z'],
        ['500xx000005', 'CASE-005', 'Preventive Maintenance', 'Scheduled', 'Medium', '2026-06-11T09:15:00Z'],
      ],
      executionTimeMs: 142,
      totalRows: 5,
    };
  }

  // Work Order queries
  if (lowerQuery.includes('workorder') || lowerQuery.includes('work_order')) {
    return {
      columns: ['id', 'wo_number', 'subject', 'status', 'priority', 'scheduled_date'],
      rows: [
        ['WO-001', 'WO-2026-001', 'HVAC Repair - Building A', 'In Progress', 'High', '2026-06-15'],
        ['WO-002', 'WO-2026-002', 'Routine Maintenance', 'Scheduled', 'Medium', '2026-06-16'],
        ['WO-003', 'WO-2026-003', 'Emergency Repair', 'Open', 'Critical', '2026-06-13'],
        ['WO-004', 'WO-2026-004', 'Equipment Inspection', 'Completed', 'Low', '2026-06-10'],
      ],
      executionTimeMs: 98,
      totalRows: 4,
    };
  }

  // Contact queries
  if (lowerQuery.includes('contact')) {
    return {
      columns: ['id', 'first_name', 'last_name', 'email', 'phone', 'account_name'],
      rows: [
        ['con-001', 'Sarah', 'Lin', 'sarah.lin@acme.com', '+1-555-0101', 'Acme Corporation'],
        ['con-002', 'Michael', 'Chen', 'michael.chen@techglobal.com', '+1-555-0102', 'TechGlobal Solutions'],
        ['con-003', 'Robert', 'Williams', 'robert.williams@metrohealth.com', '+1-555-0103', 'Metro Healthcare'],
      ],
      executionTimeMs: 76,
      totalRows: 3,
    };
  }

  // Account queries
  if (lowerQuery.includes('account')) {
    return {
      columns: ['id', 'name', 'industry', 'billing_city', 'status'],
      rows: [
        ['acc-001', 'Acme Corporation', 'Manufacturing', 'New York', 'Active'],
        ['acc-002', 'TechGlobal Solutions', 'Technology', 'San Francisco', 'Active'],
        ['acc-003', 'Metro Healthcare Network', 'Healthcare', 'Chicago', 'Active'],
      ],
      executionTimeMs: 64,
      totalRows: 3,
    };
  }

  // Default empty result
  return {
    columns: [],
    rows: [],
    executionTimeMs: 23,
    totalRows: 0,
  };
}

/* ── Execute SOQL/SOSL/DML query ─────────────────────────────────────── */
export async function executeQuery(query, mode = 'SOQL') {
  try {
    // In production, this would call your backend API that executes the query
    // For now, return mock data based on the query content
    console.log(`Executing ${mode} query:`, query.substring(0, 100) + '...');

    const result = getMockQueryResults(query, mode);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, result.executionTimeMs));

    return {
      success: true,
      data: result,
      isMock: true,
    };
  } catch (error) {
    console.error('Query execution error:', error);
    return {
      success: false,
      error: error.message,
      data: null,
    };
  }
}

/* ── Get schema metadata for Schema Browser ──────────────────────────── */
export async function getSchemaMetadata() {
  // Mock schema data
  return {
    objects: [
      {
        name: 'Account',
        label: 'Account',
        fields: [
          { name: 'Id', type: 'id', nullable: false },
          { name: 'Name', type: 'string', nullable: false },
          { name: 'Industry', type: 'picklist', nullable: true },
          { name: 'BillingCity', type: 'string', nullable: true },
          { name: 'BillingCountry', type: 'string', nullable: true },
          { name: 'Status', type: 'picklist', nullable: true },
          { name: 'CreatedDate', type: 'datetime', nullable: false },
          { name: 'LastModifiedDate', type: 'datetime', nullable: false },
        ],
      },
      {
        name: 'Contact',
        label: 'Contact',
        fields: [
          { name: 'Id', type: 'id', nullable: false },
          { name: 'FirstName', type: 'string', nullable: true },
          { name: 'LastName', type: 'string', nullable: false },
          { name: 'Email', type: 'email', nullable: true },
          { name: 'Phone', type: 'phone', nullable: true },
          { name: 'AccountId', type: 'reference', nullable: true, relationship: 'Account' },
          { name: 'CreatedDate', type: 'datetime', nullable: false },
        ],
      },
      {
        name: 'Case',
        label: 'Case',
        fields: [
          { name: 'Id', type: 'id', nullable: false },
          { name: 'CaseNumber', type: 'string', nullable: false },
          { name: 'Subject', type: 'string', nullable: false },
          { name: 'Description', type: 'textarea', nullable: true },
          { name: 'Status', type: 'picklist', nullable: false },
          { name: 'Priority', type: 'picklist', nullable: false },
          { name: 'AccountId', type: 'reference', nullable: true, relationship: 'Account' },
          { name: 'ContactId', type: 'reference', nullable: true, relationship: 'Contact' },
          { name: 'OwnerId', type: 'reference', nullable: false, relationship: 'User' },
          { name: 'CreatedDate', type: 'datetime', nullable: false },
          { name: 'ClosedDate', type: 'datetime', nullable: true },
        ],
      },
      {
        name: 'WorkOrder',
        label: 'Work Order',
        fields: [
          { name: 'Id', type: 'id', nullable: false },
          { name: 'WorkOrderNumber', type: 'string', nullable: false },
          { name: 'Subject', type: 'string', nullable: false },
          { name: 'Status', type: 'picklist', nullable: false },
          { name: 'Priority', type: 'picklist', nullable: false },
          { name: 'ScheduledDate', type: 'date', nullable: true },
          { name: 'CaseId', type: 'reference', nullable: true, relationship: 'Case' },
          { name: 'AccountId', type: 'reference', nullable: true, relationship: 'Account' },
          { name: 'OwnerId', type: 'reference', nullable: false, relationship: 'User' },
        ],
      },
      {
        name: 'ServiceAppointment',
        label: 'Service Appointment',
        fields: [
          { name: 'Id', type: 'id', nullable: false },
          { name: 'AppointmentNumber', type: 'string', nullable: false },
          { name: 'Subject', type: 'string', nullable: false },
          { name: 'Status', type: 'picklist', nullable: false },
          { name: 'AppointmentDate', type: 'datetime', nullable: true },
          { name: 'Duration', type: 'number', nullable: true },
          { name: 'WorkOrderId', type: 'reference', nullable: true, relationship: 'WorkOrder' },
          { name: 'ServiceTerritoryId', type: 'reference', nullable: true, relationship: 'ServiceTerritory' },
        ],
      },
      {
        name: 'Opportunity',
        label: 'Opportunity',
        fields: [
          { name: 'Id', type: 'id', nullable: false },
          { name: 'Name', type: 'string', nullable: false },
          { name: 'StageName', type: 'picklist', nullable: false },
          { name: 'Amount', type: 'currency', nullable: true },
          { name: 'CloseDate', type: 'date', nullable: true },
          { name: 'AccountId', type: 'reference', nullable: true, relationship: 'Account' },
          { name: 'Probability', type: 'percent', nullable: false },
          { name: 'OwnerId', type: 'reference', nullable: false, relationship: 'User' },
        ],
      },
      {
        name: 'Quote',
        label: 'Quote',
        fields: [
          { name: 'Id', type: 'id', nullable: false },
          { name: 'QuoteNumber', type: 'string', nullable: false },
          { name: 'Status', type: 'picklist', nullable: false },
          { name: 'GrandTotal', type: 'currency', nullable: false },
          { name: 'ExpirationDate', type: 'date', nullable: true },
          { name: 'OpportunityId', type: 'reference', nullable: true, relationship: 'Opportunity' },
          { name: 'AccountId', type: 'reference', nullable: true, relationship: 'Account' },
        ],
      },
    ],
  };
}

/* ── Log query execution for audit trail ─────────────────────────────── */
export async function logQueryExecution(queryData) {
  // In production, this would log to an audit table
  console.log('Audit Log:', {
    userId: queryData.userId,
    userEmail: queryData.userEmail,
    timestamp: new Date().toISOString(),
    queryMode: queryData.mode,
    queryText: queryData.query,
    rowsAffected: queryData.rowsAffected,
    executionTimeMs: queryData.executionTimeMs,
  });
  return { success: true };
}
