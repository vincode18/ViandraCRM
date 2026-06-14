/* ─────────────────────────────────────────────────────────────────────────
   Report Builder Service
   Handles saving/loading reports, field metadata, and permissions
   ───────────────────────────────────────────────────────────────────────── */

/* ─── Report Modules ─────────────────────────────────────────────────────────── */
export const REPORT_MODULES = [
  { id: 'cases', label: 'Cases', icon: '📋' },
  { id: 'workorders', label: 'Work Orders', icon: '🔧' },
  { id: 'serviceappointments', label: 'Service Appointments', icon: '📅' },
  { id: 'fieldservice', label: 'Field Service', icon: '🚛' },
];

/* ─── Field Schema per Module ─────────────────────────────────────────────────── */
export const FIELD_SCHEMA = {
  cases: {
    groups: [
      {
        name: 'Record Info',
        fields: [
          { id: 'CaseNumber', label: 'Case Number', type: 'text' },
          { id: 'Subject', label: 'Subject', type: 'text' },
          { id: 'Description', label: 'Description', type: 'textarea' },
        ],
      },
      {
        name: 'Customer',
        fields: [
          { id: 'AccountName', label: 'Account Name', type: 'text' },
          { id: 'ContactName', label: 'Contact Name', type: 'text' },
          { id: 'Email', label: 'Email', type: 'text', pii: true },
          { id: 'Phone', label: 'Phone', type: 'text', pii: true },
        ],
      },
      {
        name: 'Status & Priority',
        fields: [
          { id: 'Status', label: 'Status', type: 'status' },
          { id: 'Priority', label: 'Priority', type: 'status' },
          { id: 'Origin', label: 'Case Origin', type: 'status' },
        ],
      },
      {
        name: 'Dates',
        fields: [
          { id: 'CreatedDate', label: 'Created Date', type: 'date' },
          { id: 'ClosedDate', label: 'Closed Date', type: 'date' },
          { id: 'LastModifiedDate', label: 'Last Modified', type: 'date' },
        ],
      },
      {
        name: 'Assignment',
        fields: [
          { id: 'OwnerId', label: 'Case Owner', type: 'text' },
          { id: 'OwnerName', label: 'Owner Name', type: 'text' },
        ],
      },
      {
        name: 'SLA',
        fields: [
          { id: 'SLAHours', label: 'SLA Hours Remaining', type: 'number' },
          { id: 'SLABreachReason', label: 'SLA Breach Reason', type: 'text', pii: true },
        ],
      },
    ],
  },
  workorders: {
    groups: [
      {
        name: 'Record Info',
        fields: [
          { id: 'WorkOrderNumber', label: 'Work Order Number', type: 'text' },
          { id: 'Subject', label: 'Subject', type: 'text' },
          { id: 'Description', label: 'Description', type: 'textarea' },
        ],
      },
      {
        name: 'Asset',
        fields: [
          { id: 'AssetName', label: 'Asset Name', type: 'text' },
          { id: 'AssetId', label: 'Asset ID', type: 'text' },
          { id: 'Location', label: 'Location', type: 'text' },
        ],
      },
      {
        name: 'Status',
        fields: [
          { id: 'Status', label: 'Status', type: 'status' },
          { id: 'Priority', label: 'Priority', type: 'status' },
        ],
      },
      {
        name: 'Dates',
        fields: [
          { id: 'StartDate', label: 'Start Date', type: 'date' },
          { id: 'EndDate', label: 'End Date', type: 'date' },
          { id: 'CreatedDate', label: 'Created Date', type: 'date' },
        ],
      },
      {
        name: 'Assignment',
        fields: [
          { id: 'AssignedTo', label: 'Assigned To', type: 'text' },
          { id: 'TechnicianName', label: 'Technician Name', type: 'text' },
        ],
      },
      {
        name: 'Location',
        fields: [
          { id: 'SiteName', label: 'Site Name', type: 'text' },
          { id: 'Address', label: 'Address', type: 'text' },
          { id: 'Region', label: 'Region', type: 'status' },
        ],
      },
    ],
  },
  serviceappointments: {
    groups: [
      {
        name: 'Record Info',
        fields: [
          { id: 'AppointmentNumber', label: 'Appointment Number', type: 'text' },
          { id: 'Subject', label: 'Subject', type: 'text' },
        ],
      },
      {
        name: 'Scheduling',
        fields: [
          { id: 'ScheduledStart', label: 'Scheduled Start', type: 'datetime' },
          { id: 'ScheduledEnd', label: 'Scheduled End', type: 'datetime' },
          { id: 'ActualStart', label: 'Actual Start', type: 'datetime' },
          { id: 'ActualEnd', label: 'Actual End', type: 'datetime' },
        ],
      },
      {
        name: 'Resource',
        fields: [
          { id: 'ResourceName', label: 'Resource Name', type: 'text' },
          { id: 'TechnicianId', label: 'Technician ID', type: 'text' },
        ],
      },
      {
        name: 'Status',
        fields: [
          { id: 'Status', label: 'Status', type: 'status' },
          { id: 'AppointmentType', label: 'Appointment Type', type: 'status' },
        ],
      },
      {
        name: 'Location',
        fields: [
          { id: 'SiteName', label: 'Site Name', type: 'text' },
          { id: 'Address', label: 'Address', type: 'text' },
          { id: 'TravelTime', label: 'Travel Time (min)', type: 'number' },
        ],
      },
    ],
  },
  fieldservice: {
    groups: [
      {
        name: 'Record Info',
        fields: [
          { id: 'ServiceId', label: 'Service ID', type: 'text' },
          { id: 'ServiceType', label: 'Service Type', type: 'status' },
        ],
      },
      {
        name: 'Technician',
        fields: [
          { id: 'TechnicianName', label: 'Technician Name', type: 'text' },
          { id: 'TechnicianId', label: 'Technician ID', type: 'text' },
          { id: 'Email', label: 'Email', type: 'text', pii: true },
        ],
      },
      {
        name: 'Dispatch',
        fields: [
          { id: 'DispatchDate', label: 'Dispatch Date', type: 'datetime' },
          { id: 'ArrivalTime', label: 'Arrival Time', type: 'datetime' },
          { id: 'DepartureTime', label: 'Departure Time', type: 'datetime' },
        ],
      },
      {
        name: 'Status',
        fields: [
          { id: 'Status', label: 'Status', type: 'status' },
          { id: 'CompletionStatus', label: 'Completion Status', type: 'status' },
        ],
      },
      {
        name: 'Time Tracking',
        fields: [
          { id: 'TravelTime', label: 'Travel Time (min)', type: 'number' },
          { id: 'ServiceTime', label: 'Service Time (min)', type: 'number' },
          { id: 'TotalTime', label: 'Total Time (min)', type: 'number' },
        ],
      },
    ],
  },
};

/* ─── Default Reports ─────────────────────────────────────────────────────────── */
const DEFAULT_REPORTS = [
  {
    id: 'report-001',
    name: 'Weekly Open Work Orders - My Team',
    module: 'workorders',
    description: 'All open work orders assigned to my team for the current week',
    createdDate: '2026-06-10T09:00:00Z',
    lastRun: '2026-06-12T14:30:00Z',
    createdBy: 'maya@company.com',
    fields: ['WorkOrderNumber', 'Subject', 'Status', 'Priority', 'AssignedTo', 'StartDate', 'EndDate'],
    filters: [
      { field: 'Status', operator: 'equals', value: 'Open' },
      { field: 'Status', operator: 'equals', value: 'In Progress' },
    ],
    sorts: [{ field: 'Priority', direction: 'desc' }],
  },
  {
    id: 'report-002',
    name: 'Service Appointments by Region',
    module: 'serviceappointments',
    description: 'Service appointments grouped by region',
    createdDate: '2026-06-08T10:00:00Z',
    lastRun: '2026-06-11T16:45:00Z',
    createdBy: 'james@company.com',
    fields: ['AppointmentNumber', 'Subject', 'Status', 'SiteName', 'Region', 'ScheduledStart', 'ResourceName'],
    filters: [],
    sorts: [{ field: 'ScheduledStart', direction: 'asc' }],
  },
  {
    id: 'report-003',
    name: 'High Priority Cases - Open',
    module: 'cases',
    description: 'All open cases with high or critical priority',
    createdDate: '2026-06-05T14:00:00Z',
    lastRun: '2026-06-12T09:15:00Z',
    createdBy: 'maya@company.com',
    fields: ['CaseNumber', 'Subject', 'Status', 'Priority', 'AccountName', 'ContactName', 'OwnerId', 'SLAHours'],
    filters: [
      { field: 'Status', operator: 'equals', value: 'Open' },
      { field: 'Priority', operator: 'equals', value: 'High' },
      { field: 'Priority', operator: 'equals', value: 'Critical' },
    ],
    sorts: [{ field: 'SLAHours', direction: 'asc' }],
  },
];

/* ─── Mock Report Data ─────────────────────────────────────────────────────────── */
const MOCK_REPORT_DATA = {
  cases: [
    { CaseNumber: 'CAS-0001', Subject: 'HVAC System Failure', Status: 'Open', Priority: 'High', AccountName: 'ABC Corp', ContactName: 'John Smith', OwnerId: 'USR-001', SLAHours: 24 },
    { CaseNumber: 'CAS-0002', Subject: 'Power Outage', Status: 'In Progress', Priority: 'Critical', AccountName: 'XYZ Ltd', ContactName: 'Jane Doe', OwnerId: 'USR-002', SLAHours: 4 },
    { CaseNumber: 'CAS-0003', Subject: 'Equipment Maintenance', Status: 'Open', Priority: 'Medium', AccountName: 'ABC Corp', ContactName: 'Bob Johnson', OwnerId: 'USR-001', SLAHours: 72 },
    { CaseNumber: 'CAS-0004', Subject: 'System Upgrade', Status: 'Closed', Priority: 'Low', AccountName: 'Tech Solutions', ContactName: 'Alice Brown', OwnerId: 'USR-003', SLAHours: 120 },
    { CaseNumber: 'CAS-0005', Subject: 'Network Issues', Status: 'Open', Priority: 'High', AccountName: 'XYZ Ltd', ContactName: 'Charlie Wilson', OwnerId: 'USR-002', SLAHours: 12 },
  ],
  workorders: [
    { WorkOrderNumber: 'WO-0001', Subject: 'Repair HVAC Unit', Status: 'Open', Priority: 'High', AssignedTo: 'Tom Technician', StartDate: '2026-06-15', EndDate: '2026-06-16' },
    { WorkOrderNumber: 'WO-0002', Subject: 'Install New Server', Status: 'In Progress', Priority: 'Medium', AssignedTo: 'Sarah Tech', StartDate: '2026-06-14', EndDate: '2026-06-18' },
    { WorkOrderNumber: 'WO-0003', Subject: 'Replace Power Supply', Status: 'Open', Priority: 'Critical', AssignedTo: 'Mike Engineer', StartDate: '2026-06-13', EndDate: '2026-06-13' },
    { WorkOrderNumber: 'WO-0004', Subject: 'Network Cabling', Status: 'Closed', Priority: 'Low', AssignedTo: 'Lisa Installer', StartDate: '2026-06-10', EndDate: '2026-06-11' },
    { WorkOrderNumber: 'WO-0005', Subject: 'Software Update', Status: 'Open', Priority: 'Medium', AssignedTo: 'Tom Technician', StartDate: '2026-06-16', EndDate: '2026-06-17' },
  ],
  serviceappointments: [
    { AppointmentNumber: 'SA-0001', Subject: 'HVAC Maintenance', Status: 'Scheduled', SiteName: 'ABC Corp HQ', Region: 'North', ScheduledStart: '2026-06-15T09:00:00', ResourceName: 'Tom Technician' },
    { AppointmentNumber: 'SA-0002', Subject: 'Server Installation', Status: 'In Progress', SiteName: 'XYZ Ltd Warehouse', Region: 'South', ScheduledStart: '2026-06-14T08:00:00', ResourceName: 'Sarah Tech' },
    { AppointmentNumber: 'SA-0003', Subject: 'Emergency Repair', Status: 'Completed', SiteName: 'Tech Solutions Office', Region: 'East', ScheduledStart: '2026-06-13T14:00:00', ResourceName: 'Mike Engineer' },
    { AppointmentNumber: 'SA-0004', Subject: 'Preventive Maintenance', Status: 'Scheduled', SiteName: 'ABC Corp Branch', Region: 'West', ScheduledStart: '2026-06-16T10:00:00', ResourceName: 'Lisa Installer' },
    { AppointmentNumber: 'SA-0005', Subject: 'System Check', Status: 'Cancelled', SiteName: 'XYZ Ltd HQ', Region: 'North', ScheduledStart: '2026-06-17T13:00:00', ResourceName: 'Tom Technician' },
  ],
  fieldservice: [
    { ServiceId: 'FS-0001', ServiceType: 'Installation', TechnicianName: 'Tom Tech', TechnicianId: 'TECH-001', DispatchDate: '2026-06-15T08:00:00', ArrivalTime: '2026-06-15T08:30:00', Status: 'In Progress', TravelTime: 30, ServiceTime: 120, TotalTime: 150 },
    { ServiceId: 'FS-0002', ServiceType: 'Repair', TechnicianName: 'Sarah Eng', TechnicianId: 'TECH-002', DispatchDate: '2026-06-14T09:00:00', ArrivalTime: '2026-06-14T09:45:00', Status: 'Completed', TravelTime: 45, ServiceTime: 180, TotalTime: 225 },
    { ServiceId: 'FS-0003', ServiceType: 'Maintenance', TechnicianName: 'Mike Spec', TechnicianId: 'TECH-003', DispatchDate: '2026-06-13T10:00:00', ArrivalTime: '2026-06-13T10:15:00', Status: 'Completed', TravelTime: 15, ServiceTime: 60, TotalTime: 75 },
    { ServiceId: 'FS-0004', ServiceType: 'Inspection', TechnicianName: 'Lisa Insp', TechnicianId: 'TECH-004', DispatchDate: '2026-06-16T11:00:00', ArrivalTime: null, Status: 'Scheduled', TravelTime: null, ServiceTime: null, TotalTime: null },
    { ServiceId: 'FS-0005', ServiceType: 'Installation', TechnicianName: 'Tom Tech', TechnicianId: 'TECH-001', DispatchDate: '2026-06-17T07:00:00', ArrivalTime: null, Status: 'Scheduled', TravelTime: null, ServiceTime: null, TotalTime: null },
  ],
};

/* ─── Load Reports ───────────────────────────────────────────────────────────── */
export async function loadReports() {
  try {
    const saved = localStorage.getItem('report-builder-reports');
    if (saved) {
      return { success: true, data: JSON.parse(saved) };
    }
    return { success: true, data: DEFAULT_REPORTS };
  } catch (error) {
    console.error('Error loading reports:', error);
    return { success: false, error: error.message, data: DEFAULT_REPORTS };
  }
}

/* ─── Save Report ─────────────────────────────────────────────────────────────── */
export async function saveReport(report) {
  try {
    const response = await loadReports();
    const reports = response.success ? response.data : DEFAULT_REPORTS;
    const index = reports.findIndex(r => r.id === report.id);
    
    if (index > -1) {
      reports[index] = { ...reports[index], ...report, lastRun: new Date().toISOString() };
    } else {
      reports.push({ ...report, createdDate: new Date().toISOString(), lastRun: new Date().toISOString() });
    }
    
    localStorage.setItem('report-builder-reports', JSON.stringify(reports));
    return { success: true, message: 'Report saved successfully' };
  } catch (error) {
    console.error('Error saving report:', error);
    return { success: false, error: error.message };
  }
}

/* ─── Delete Report ───────────────────────────────────────────────────────────── */
export async function deleteReport(reportId) {
  try {
    const response = await loadReports();
    const reports = response.success ? response.data : DEFAULT_REPORTS;
    const filtered = reports.filter(r => r.id !== reportId);
    
    localStorage.setItem('report-builder-reports', JSON.stringify(filtered));
    return { success: true, message: 'Report deleted successfully' };
  } catch (error) {
    console.error('Error deleting report:', error);
    return { success: false, error: error.message };
  }
}

/* ─── Load Report by ID ───────────────────────────────────────────────────────── */
export async function loadReportById(reportId) {
  try {
    const response = await loadReports();
    const reports = response.success ? response.data : DEFAULT_REPORTS;
    const report = reports.find(r => r.id === reportId);
    
    if (!report) {
      return { success: false, error: 'Report not found', data: null };
    }
    
    return { success: true, data: report };
  } catch (error) {
    console.error('Error loading report:', error);
    return { success: false, error: error.message, data: null };
  }
}

/* ─── Get Report Data (Preview) ───────────────────────────────────────────────── */
export async function getReportData(module, fields, filters, sorts, limit = 50) {
  try {
    let data = MOCK_REPORT_DATA[module] || [];
    
    // Apply filters
    filters.forEach(filter => {
      if (filter.operator === 'equals') {
        data = data.filter(row => row[filter.field] === filter.value);
      } else if (filter.operator === 'contains') {
        data = data.filter(row => String(row[filter.field]).toLowerCase().includes(String(filter.value).toLowerCase()));
      }
    });
    
    // Apply sorts
    sorts.forEach(sort => {
      data.sort((a, b) => {
        const aVal = a[sort.field];
        const bVal = b[sort.field];
        if (sort.direction === 'asc') {
          return aVal > bVal ? 1 : -1;
        }
        return aVal < bVal ? 1 : -1;
      });
    });
    
    // Limit
    data = data.slice(0, limit);
    
    return { success: true, data, total: MOCK_REPORT_DATA[module]?.length || 0 };
  } catch (error) {
    console.error('Error fetching report data:', error);
    return { success: false, error: error.message, data: [], total: 0 };
  }
}

/* ─── Export Report (CSV) ─────────────────────────────────────────────────────── */
export async function exportReportCSV(report, data) {
  try {
    const headers = report.fields;
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
      const values = headers.map(field => {
        const value = row[field] || '';
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    });
    
    const csv = csvRows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.name}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    return { success: true, message: 'Export successful' };
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return { success: false, error: error.message };
  }
}

/* ─── User Report Preferences ─────────────────────────────────────────────────── */
export async function getUserReportPreferences() {
  try {
    const saved = localStorage.getItem('report-user-preferences');
    if (saved) {
      return { success: true, data: JSON.parse(saved) };
    }
    return {
      success: true,
      data: {
        defaultExportFormat: 'csv',
        defaultModule: null,
        dateFormat: 'YYYY-MM-DD',
        numberFormat: 'raw',
        autoRun: false,
        rowsPerPage: 50,
        pinnedReports: [],
      },
    };
  } catch (error) {
    console.error('Error loading preferences:', error);
    return { success: false, error: error.message, data: null };
  }
}

/* ─── Save User Report Preferences ─────────────────────────────────────────────── */
export async function saveUserReportPreferences(preferences) {
  try {
    localStorage.setItem('report-user-preferences', JSON.stringify(preferences));
    return { success: true, message: 'Preferences saved' };
  } catch (error) {
    console.error('Error saving preferences:', error);
    return { success: false, error: error.message };
  }
}
