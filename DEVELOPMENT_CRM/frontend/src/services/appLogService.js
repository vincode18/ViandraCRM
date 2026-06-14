/* ─────────────────────────────────────────────────────────────────────────
   Application Log Service
   Handles fetching log entries with filters for the Application Log module
   ───────────────────────────────────────────────────────────────────────── */

import { supabase } from '../utils/supabaseClient';

/* ── Mock log entries for demonstration ─────────────────────────────────── */
function getMockLogEntries(filters = {}) {
  const mockData = [
    {
      id: 'log_001',
      timestamp: '2026-06-12T14:32:07Z',
      eventType: 'REST_API_OUTBOUND',
      moduleId: 'integration-salesforce',
      objectId: 'OPP-0091',
      objectType: 'Opportunity',
      actorType: 'INTEGRATION',
      actorId: 'int_salesforce_001',
      actorLabel: 'Salesforce Sync',
      description: 'Outbound POST to Salesforce Opportunity entity. 12 rows processed.',
      requestStatus: 'S',
      errorMessage: null,
      metadata: {
        method: 'POST',
        query: null,
        responseSize: 1204,
        rowsProcessed: 12,
        entityName: 'Opportunity',
        direction: 'OUTBOUND',
        integrationName: 'Salesforce Sync',
        httpStatusCode: 200,
        durationMs: 342,
      },
    },
    {
      id: 'log_002',
      timestamp: '2026-06-12T14:28:45Z',
      eventType: 'OBJECT_UPDATE',
      moduleId: 'work-orders',
      objectId: 'WO-00432',
      objectType: 'WorkOrder',
      actorType: 'USER',
      actorId: 'usr_001',
      actorLabel: 'alice@company.com',
      description: 'WorkOrder WO-00432 updated: Status changed from Open to In Progress',
      requestStatus: 'S',
      errorMessage: null,
      metadata: {
        changedFields: [
          {
            fieldName: 'status',
            displayLabel: 'Status',
            oldValue: 'Open',
            newValue: 'In Progress',
          },
          {
            fieldName: 'assignedToId',
            displayLabel: 'Assigned To',
            oldValue: null,
            newValue: 'usr_002',
          },
        ],
      },
    },
    {
      id: 'log_003',
      timestamp: '2026-06-12T14:15:22Z',
      eventType: 'OBJECT_CREATE',
      moduleId: 'cases',
      objectId: 'CASE-0091',
      objectType: 'Case',
      actorType: 'USER',
      actorId: 'usr_003',
      actorLabel: 'bob@company.com',
      description: 'Case CASE-0091 created',
      requestStatus: 'S',
      errorMessage: null,
      metadata: {
        changedFields: [
          {
            fieldName: 'caseNumber',
            displayLabel: 'Case Number',
            oldValue: null,
            newValue: 'CASE-0091',
          },
          {
            fieldName: 'subject',
            displayLabel: 'Subject',
            oldValue: null,
            newValue: 'HVAC System Failure',
          },
          {
            fieldName: 'status',
            displayLabel: 'Status',
            oldValue: null,
            newValue: 'Open',
          },
        ],
      },
    },
    {
      id: 'log_004',
      timestamp: '2026-06-12T13:55:10Z',
      eventType: 'REST_API_INBOUND',
      moduleId: 'integration-sap',
      objectId: 'WO-00431',
      objectType: 'WorkOrder',
      actorType: 'INTEGRATION',
      actorId: 'int_sap_001',
      actorLabel: 'SAP Integration',
      description: 'Inbound GET from SAP for WorkOrder WO-00431',
      requestStatus: 'S',
      errorMessage: null,
      metadata: {
        method: 'GET',
        query: null,
        responseSize: 856,
        rowsProcessed: 1,
        entityName: 'WorkOrder',
        direction: 'INBOUND',
        integrationName: 'SAP Integration',
        httpStatusCode: 200,
        durationMs: 189,
      },
    },
    {
      id: 'log_005',
      timestamp: '2026-06-12T13:42:33Z',
      eventType: 'OBJECT_STATUS_CHANGE',
      moduleId: 'work-orders',
      objectId: 'WO-00430',
      objectType: 'WorkOrder',
      actorType: 'USER',
      actorId: 'usr_001',
      actorLabel: 'alice@company.com',
      description: 'WorkOrder WO-00430 status changed to Completed',
      requestStatus: 'S',
      errorMessage: null,
      metadata: {
        changedFields: [
          {
            fieldName: 'status',
            displayLabel: 'Status',
            oldValue: 'In Progress',
            newValue: 'Completed',
          },
        ],
      },
    },
    {
      id: 'log_006',
      timestamp: '2026-06-12T13:30:15Z',
      eventType: 'REST_API_OUTBOUND',
      moduleId: 'integration-salesforce',
      objectId: 'ACC-00123',
      objectType: 'Account',
      actorType: 'INTEGRATION',
      actorId: 'int_salesforce_001',
      actorLabel: 'Salesforce Sync',
      description: 'Outbound PATCH to Salesforce Account entity failed',
      requestStatus: 'F',
      errorMessage: '404 Not Found: Account not found in Salesforce',
      metadata: {
        method: 'PATCH',
        query: null,
        responseSize: 245,
        rowsProcessed: 0,
        entityName: 'Account',
        direction: 'OUTBOUND',
        integrationName: 'Salesforce Sync',
        httpStatusCode: 404,
        durationMs: 156,
      },
    },
    {
      id: 'log_007',
      timestamp: '2026-06-12T13:15:44Z',
      eventType: 'OBJECT_DELETE',
      moduleId: 'service-appointments',
      objectId: 'SA-00234',
      objectType: 'ServiceAppointment',
      actorType: 'USER',
      actorId: 'usr_002',
      actorLabel: 'charlie@company.com',
      description: 'ServiceAppointment SA-00234 deleted',
      requestStatus: 'S',
      errorMessage: null,
      metadata: {
        changedFields: [
          {
            fieldName: 'status',
            displayLabel: 'Status',
            oldValue: 'Scheduled',
            newValue: null,
          },
        ],
      },
    },
    {
      id: 'log_008',
      timestamp: '2026-06-12T12:58:22Z',
      eventType: 'OBJECT_UPDATE',
      moduleId: 'cases',
      objectId: 'CASE-0090',
      objectType: 'Case',
      actorType: 'USER',
      actorId: 'usr_003',
      actorLabel: 'bob@company.com',
      description: 'Case CASE-0090 priority updated to Critical',
      requestStatus: 'S',
      errorMessage: null,
      metadata: {
        changedFields: [
          {
            fieldName: 'priority',
            displayLabel: 'Priority',
            oldValue: 'High',
            newValue: 'Critical',
          },
        ],
      },
    },
  ];

  // Apply filters
  let filtered = mockData;

  if (filters.objectId) {
    filtered = filtered.filter(log => log.objectId.toLowerCase().includes(filters.objectId.toLowerCase()));
  }
  if (filters.moduleId) {
    filtered = filtered.filter(log => log.moduleId.toLowerCase().includes(filters.moduleId.toLowerCase()));
  }
  if (filters.eventType && filters.eventType.length > 0) {
    filtered = filtered.filter(log => filters.eventType.includes(log.eventType));
  }
  if (filters.actorId && filters.actorId.length > 0) {
    filtered = filtered.filter(log => filters.actorId.includes(log.actorId));
  }
  if (filters.requestStatus) {
    filtered = filtered.filter(log => log.requestStatus === filters.requestStatus);
  }
  if (filters.from) {
    const fromDate = new Date(filters.from);
    filtered = filtered.filter(log => new Date(log.timestamp) >= fromDate);
  }
  if (filters.to) {
    const toDate = new Date(filters.to);
    filtered = filtered.filter(log => new Date(log.timestamp) <= toDate);
  }

  return filtered;
}

/* ── Fetch log entries with filters ───────────────────────────────────── */
export async function fetchLogEntries(filters = {}, options = {}) {
  try {
    // In production, this would call the backend API
    const data = getMockLogEntries(filters);

    // Sort
    const sortBy = options.sortBy || 'timestamp';
    const sortOrder = options.sortOrder || 'desc';
    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (sortOrder === 'desc') {
        return new Date(bVal) - new Date(aVal);
      }
      return new Date(aVal) - new Date(bVal);
    });

    // Paginate
    const page = options.page || 1;
    const pageSize = options.pageSize || 50;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = sorted.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginated,
      pagination: {
        page,
        pageSize,
        totalRecords: sorted.length,
        totalPages: Math.ceil(sorted.length / pageSize),
      },
      isMock: true,
    };
  } catch (error) {
    console.error('Log entries fetch error:', error);
    return {
      success: false,
      error: error.message,
      data: [],
      pagination: { page: 1, pageSize: 50, totalRecords: 0, totalPages: 0 },
    };
  }
}

/* ── Fetch single log entry by ID ─────────────────────────────────────── */
export async function fetchLogEntryById(id) {
  try {
    const data = getMockLogEntries();
    const entry = data.find(log => log.id === id);

    if (!entry) {
      return { success: false, error: 'Log entry not found', data: null };
    }

    return { success: true, data: entry, isMock: true };
  } catch (error) {
    console.error('Log entry fetch error:', error);
    return { success: false, error: error.message, data: null };
  }
}

/* ── Fetch filter options (users, modules, etc.) ──────────────────────── */
export async function fetchFilterOptions() {
  return {
    success: true,
    data: {
      users: [
        { id: 'usr_001', label: 'alice@company.com' },
        { id: 'usr_002', label: 'bob@company.com' },
        { id: 'usr_003', label: 'charlie@company.com' },
      ],
      modules: [
        { id: 'work-orders', label: 'Work Orders' },
        { id: 'cases', label: 'Cases' },
        { id: 'service-appointments', label: 'Service Appointments' },
        { id: 'integration-salesforce', label: 'Salesforce Sync' },
        { id: 'integration-sap', label: 'SAP Integration' },
      ],
      objectTypes: ['WorkOrder', 'Case', 'ServiceAppointment', 'Opportunity', 'Account'],
      eventTypes: [
        'OBJECT_CREATE',
        'OBJECT_UPDATE',
        'OBJECT_DELETE',
        'OBJECT_STATUS_CHANGE',
        'REST_API_INBOUND',
        'REST_API_OUTBOUND',
      ],
    },
    isMock: true,
  };
}
