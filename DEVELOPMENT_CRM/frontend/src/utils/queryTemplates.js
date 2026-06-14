/* ─────────────────────────────────────────────────────────────────────────
   Query Templates Mock Data
   Pre-built query templates for the Console App Query Interface
   ───────────────────────────────────────────────────────────────────────── */

export const QUERY_TEMPLATES = [
  {
    id: 'tmpl-001',
    name: 'Open Critical Cases',
    object: 'Case',
    description: 'All open cases with Priority = Critical, sorted by age',
    filters: {
      status: ['Open', 'Assigned', 'In Progress'],
      priority: ['Critical'],
    },
    orderBy: 'created_date',
    orderDirection: 'DESC',
    requiresInput: false,
  },
  {
    id: 'tmpl-002',
    name: 'My Assigned Cases',
    object: 'Case',
    description: 'Cases assigned to the current user, not closed',
    filters: {
      status: ['Open', 'Assigned', 'In Progress'],
      assignedTo: 'current_user',
    },
    orderBy: 'created_date',
    orderDirection: 'DESC',
    requiresInput: false,
  },
  {
    id: 'tmpl-003',
    name: 'Overdue Work Orders',
    object: 'WorkOrder',
    description: 'Scheduled date is in the past, status is not Completed',
    filters: {
      status: ['Open', 'In Progress', 'Scheduled'],
      scheduledDate: 'past',
    },
    orderBy: 'scheduled_date',
    orderDirection: 'ASC',
    requiresInput: false,
  },
  {
    id: 'tmpl-004',
    name: "Today's Appointments",
    object: 'ServiceAppointment',
    description: 'Appointments scheduled for today',
    filters: {
      appointmentDate: 'today',
    },
    orderBy: 'appointment_date',
    orderDirection: 'ASC',
    requiresInput: false,
  },
  {
    id: 'tmpl-005',
    name: 'Unassigned Work Orders',
    object: 'WorkOrder',
    description: 'Work orders with no assigned technician',
    filters: {
      technician: null,
      status: ['Open', 'Scheduled'],
    },
    orderBy: 'scheduled_date',
    orderDirection: 'ASC',
    requiresInput: false,
  },
  {
    id: 'tmpl-006',
    name: 'Cases Escalated This Week',
    object: 'Case',
    description: 'Cases with escalation flag set, this calendar week',
    filters: {
      escalated: true,
      createdDate: 'this_week',
    },
    orderBy: 'created_date',
    orderDirection: 'DESC',
    requiresInput: false,
  },
  {
    id: 'tmpl-007',
    name: 'Contacts Without Cases',
    object: 'Contact',
    description: 'Contacts who have no linked open cases',
    filters: {
      hasOpenCases: false,
    },
    orderBy: 'last_name',
    orderDirection: 'ASC',
    requiresInput: false,
  },
  {
    id: 'tmpl-008',
    name: 'Cases by Account',
    object: 'Case',
    description: 'Filter by a specific account',
    filters: {
      account: null, // Requires user input
    },
    orderBy: 'created_date',
    orderDirection: 'DESC',
    requiresInput: true,
    inputPrompt: 'Enter account name',
    inputType: 'text',
  },
  {
    id: 'tmpl-009',
    name: 'Work Orders by Territory',
    object: 'WorkOrder',
    description: 'Filter by territory',
    filters: {
      territory: null, // Requires user input
    },
    orderBy: 'scheduled_date',
    orderDirection: 'ASC',
    requiresInput: true,
    inputPrompt: 'Select territory',
    inputType: 'select',
    inputOptions: ['North', 'South', 'East', 'West', 'Central'],
  },
  {
    id: 'tmpl-010',
    name: 'SLA Breach Risk',
    object: 'Case',
    description: 'Cases nearing SLA deadline (within 2 hours)',
    filters: {
      slaStatus: 'at_risk',
    },
    orderBy: 'sla_deadline',
    orderDirection: 'ASC',
    requiresInput: false,
  },
];

export const OBJECT_TABS = [
  { id: 'case', label: 'Cases', object: 'Case', defaultSort: 'created_date', defaultSortDir: 'DESC' },
  { id: 'workorder', label: 'Work Orders', object: 'WorkOrder', defaultSort: 'scheduled_date', defaultSortDir: 'ASC' },
  { id: 'serviceappointment', label: 'Service Appointments', object: 'ServiceAppointment', defaultSort: 'appointment_date', defaultSortDir: 'ASC' },
  { id: 'contact', label: 'Contacts', object: 'Contact', defaultSort: 'last_name', defaultSortDir: 'ASC' },
];

export const FILTER_OPTIONS = {
  Case: {
    status: ['All', 'Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
    priority: ['All', 'Critical', 'High', 'Medium', 'Low'],
  },
  WorkOrder: {
    status: ['All', 'Open', 'In Progress', 'Completed', 'On Hold', 'Scheduled', 'Cancelled'],
    priority: ['All', 'Critical', 'High', 'Medium', 'Low'],
  },
  ServiceAppointment: {
    status: ['All', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'],
  },
  Contact: {
    status: ['All', 'Active', 'Inactive'],
  },
};

export const BULK_ACTIONS = [
  { id: 'update_status', label: 'Update Status', objects: ['Case', 'WorkOrder', 'ServiceAppointment'], requiresConfirmation: true },
  { id: 'reassign', label: 'Reassign', objects: ['Case', 'WorkOrder', 'ServiceAppointment'], requiresConfirmation: true },
  { id: 'close', label: 'Close (Bulk)', objects: ['Case', 'WorkOrder'], requiresConfirmation: true },
  { id: 'export', label: 'Export Selection', objects: ['Case', 'WorkOrder', 'ServiceAppointment', 'Contact'], requiresConfirmation: false },
  { id: 'add_to_queue', label: 'Add to Queue', objects: ['Case', 'WorkOrder'], requiresConfirmation: true },
];
