/* ─────────────────────────────────────────────────────────────────────────
   Task List & Timesheet — Mock Data Layer
   PRD: DESIGN-TL-001 / DESIGN-TS-001
   ───────────────────────────────────────────────────────────────────────── */

/* ── Task List Code (catalogue) ─────────────────────────────────────────── */
export const TASK_LIST_CODES = [
  {
    id: 'TLC-001',
    code: 'DE7AP20',
    name: 'Annual Pump Station Maintenance',
    durationType: 'Hours',
    estimatedDuration: 4.0,
    uom: 'H',
    description: 'Standard annual maintenance procedure for pump station units. Covers preparation, travel, inspection, field guide review and reporting.',
    requiredSkill: 'Hydraulic Systems Technician',
    recommendedCrewSize: 2,
    minimumCrewSize: 1,
    operatingHours: '07:00 – 17:00',
    autoCreateSA: true,
    serviceReportTemplate: 'SRT-PUMP-001',
    createdBy: 'UT.Integration',
    createdAt: '21/02/2020, 17:21',
    lastModifiedBy: 'UT.Integration',
    lastModifiedAt: '13/02/2025, 02:30',
    sfWorktypeId: 'DE7AP20',
  },
  {
    id: 'TLC-002',
    code: 'DE8BQ30',
    name: 'Excavator 500-Hour Service',
    durationType: 'Hours',
    estimatedDuration: 6.0,
    uom: 'H',
    description: 'Scheduled 500-hour service for excavator units. Includes oil change, filter replacement, track inspection.',
    requiredSkill: 'Heavy Equipment Technician',
    recommendedCrewSize: 3,
    minimumCrewSize: 2,
    operatingHours: '07:00 – 17:00',
    autoCreateSA: true,
    serviceReportTemplate: 'SRT-EXC-001',
    createdBy: 'UT.Integration',
    createdAt: '15/03/2021, 09:00',
    lastModifiedBy: 'UT.Integration',
    lastModifiedAt: '10/01/2025, 08:00',
    sfWorktypeId: 'DE8BQ30',
  },
];

/* ── Task List Items (Work Order Task Lists) ─────────────────────────────── */
export const TASK_LIST_ITEMS = [
  { id: 'TLI-0001', workOrderId: 'WO-00001', taskListCodeId: 'TLC-001', operationNumber: '0010', description: 'Preparation',  duration: 1, uom: 'H', status: 'Completed',   isSAPOverride: false, startTime: '2026-05-18T08:00', completeTime: '2026-05-18T09:00' },
  { id: 'TLI-0002', workOrderId: 'WO-00001', taskListCodeId: 'TLC-001', operationNumber: '0020', description: 'Traveling',    duration: 0, uom: 'H', status: 'Completed',   isSAPOverride: false, startTime: '2026-05-18T09:00', completeTime: '2026-05-18T09:45' },
  { id: 'TLI-0003', workOrderId: 'WO-00001', taskListCodeId: 'TLC-001', operationNumber: '0030', description: 'Inspection',   duration: 1, uom: 'H', status: 'In Progress',  isSAPOverride: false, startTime: '2026-05-18T10:00', completeTime: null },
  { id: 'TLI-0004', workOrderId: 'WO-00001', taskListCodeId: 'TLC-001', operationNumber: '0040', description: 'Field Guide',  duration: 1, uom: 'H', status: 'Not Started',  isSAPOverride: false, startTime: null,                completeTime: null },
  { id: 'TLI-0005', workOrderId: 'WO-00001', taskListCodeId: 'TLC-001', operationNumber: '0050', description: 'Reporting',    duration: 1, uom: 'H', status: 'Not Started',  isSAPOverride: true,  startTime: null,                completeTime: null },
  { id: 'TLI-0006', workOrderId: 'WO-00002', taskListCodeId: 'TLC-002', operationNumber: '0010', description: 'Pre-Check',    duration: 1, uom: 'H', status: 'Not Started',  isSAPOverride: false, startTime: null,                completeTime: null },
  { id: 'TLI-0007', workOrderId: 'WO-00002', taskListCodeId: 'TLC-002', operationNumber: '0020', description: 'Oil Change',   duration: 2, uom: 'H', status: 'Not Started',  isSAPOverride: false, startTime: null,                completeTime: null },
  { id: 'TLI-0008', workOrderId: 'WO-00002', taskListCodeId: 'TLC-002', operationNumber: '0030', description: 'Filter Swap',  duration: 1, uom: 'H', status: 'Not Started',  isSAPOverride: false, startTime: null,                completeTime: null },
];

/* ── Time Sheet Records (TST) ───────────────────────────────────────────── */
export const TIMESHEETS = [
  {
    id: 'TST-2606668',
    workOrderId: 'WO-00001',
    taskListCodeId: 'TLC-001',
    serviceResource: 'Mohammad Ficri Kaban',
    serviceTerritory: 'Padang.ST',
    startDate: '18/05/2026',
    endDate: '18/05/2026',
    status: 'Approved',
    totalDuration: 8.50,
    currencyISOCode: 'IDR',
    entryCount: 5,
    submittedAt: '18/05/2026, 11:53',
    approvedAt: '23/05/2026, 11:36',
    postedToSAP: true,
    postedAt: '23/05/2026, 11:40',
    createdBy: 'SARIEF RAHMATTULLOH',
    createdAt: '18/05/2026, 11:49',
    lastModifiedBy: 'SARIEF RAHMATTULLOH',
    lastModifiedAt: '23/05/2026, 11:36',
    jaJe: 'May 2026',
    workOrderRef: '01269822',
    workOrderSFId: '0WOMg0000GbA8rOAF',
    owner: 'Mohammad Ficri Kaban',
  },
  {
    id: 'TST-2606701',
    workOrderId: 'WO-00002',
    taskListCodeId: 'TLC-002',
    serviceResource: 'Budi Santoso',
    serviceTerritory: 'Balikpapan.ST',
    startDate: '18/05/2026',
    endDate: '18/05/2026',
    status: 'Submitted',
    totalDuration: 8.0,
    currencyISOCode: 'IDR',
    entryCount: 3,
    submittedAt: '18/05/2026, 16:10',
    approvedAt: null,
    postedToSAP: false,
    postedAt: null,
    createdBy: 'BUDI SANTOSO',
    createdAt: '18/05/2026, 15:00',
    lastModifiedBy: 'BUDI SANTOSO',
    lastModifiedAt: '18/05/2026, 16:10',
    jaJe: null,
    workOrderRef: 'WO-00002',
    workOrderSFId: null,
    owner: 'Budi Santoso',
  },
  {
    id: 'TST-2606715',
    workOrderId: 'WO-00003',
    taskListCodeId: 'TLC-001',
    serviceResource: 'Ari Wibowo',
    serviceTerritory: 'Makassar.ST',
    startDate: '19/05/2026',
    endDate: '19/05/2026',
    status: 'Submitted',
    totalDuration: 9.50,
    currencyISOCode: 'IDR',
    entryCount: 5,
    submittedAt: '19/05/2026, 08:22',
    approvedAt: null,
    postedToSAP: false,
    postedAt: null,
    createdBy: 'ARI WIBOWO',
    createdAt: '19/05/2026, 07:00',
    lastModifiedBy: 'ARI WIBOWO',
    lastModifiedAt: '19/05/2026, 08:22',
    jaJe: null,
    workOrderRef: 'WO-00003',
    workOrderSFId: null,
    owner: 'Ari Wibowo',
  },
];

/* ── Time Sheet Entries (TSE) ───────────────────────────────────────────── */
export const TIMESHEET_ENTRIES = [
  { id: 'TSE-0001', timesheetId: 'TST-2606668', workOrderId: 'WO-00001', operationNumber: '0010', subject: 'Preparation',  startTime: '18/05/2026, 11:51', actualDuration: 1.00, plannedDuration: 1.00, status: 'Approved', sentToSAP: true,  approvedAt: '23/05, 11:36', remarks: '',                                   rejectionReason: null },
  { id: 'TSE-0002', timesheetId: 'TST-2606668', workOrderId: 'WO-00001', operationNumber: '0020', subject: 'Traveling',    startTime: '18/05/2026, 11:51', actualDuration: 4.00, plannedDuration: 0.00, status: 'Approved', sentToSAP: true,  approvedAt: '23/05, 11:36', remarks: '',                                   rejectionReason: null },
  { id: 'TSE-0003', timesheetId: 'TST-2606668', workOrderId: 'WO-00001', operationNumber: '0030', subject: 'Inspection',   startTime: '18/05/2026, 11:51', actualDuration: 1.50, plannedDuration: 1.00, status: 'Approved', sentToSAP: true,  approvedAt: '23/05, 11:36', remarks: 'Extra time due to valve seizure',      rejectionReason: null },
  { id: 'TSE-0004', timesheetId: 'TST-2606668', workOrderId: 'WO-00001', operationNumber: '0040', subject: 'Field Guide',  startTime: '18/05/2026, 11:51', actualDuration: 1.00, plannedDuration: 1.00, status: 'Approved', sentToSAP: true,  approvedAt: '23/05, 11:36', remarks: '',                                   rejectionReason: null },
  { id: 'TSE-0005', timesheetId: 'TST-2606668', workOrderId: 'WO-00001', operationNumber: '0050', subject: 'Reporting',    startTime: '18/05/2026, 11:51', actualDuration: 1.00, plannedDuration: 1.00, status: 'Approved', sentToSAP: true,  approvedAt: '23/05, 11:36', remarks: '',                                   rejectionReason: null },
  { id: 'TSE-0006', timesheetId: 'TST-2606701', workOrderId: 'WO-00002', operationNumber: '0010', subject: 'Pre-Check',    startTime: '18/05/2026, 15:00', actualDuration: 1.00, plannedDuration: 1.00, status: 'Submitted', sentToSAP: false, approvedAt: null,           remarks: '',                                   rejectionReason: null },
  { id: 'TSE-0007', timesheetId: 'TST-2606701', workOrderId: 'WO-00002', operationNumber: '0020', subject: 'Oil Change',   startTime: '18/05/2026, 15:00', actualDuration: 3.00, plannedDuration: 2.00, status: 'Submitted', sentToSAP: false, approvedAt: null,           remarks: 'Used synthetic oil — extra mixing time', rejectionReason: null },
  { id: 'TSE-0008', timesheetId: 'TST-2606701', workOrderId: 'WO-00002', operationNumber: '0030', subject: 'Filter Swap',  startTime: '18/05/2026, 15:00', actualDuration: 1.00, plannedDuration: 1.00, status: 'Submitted', sentToSAP: false, approvedAt: null,           remarks: '',                                   rejectionReason: null },
];

/* ── Helpers ─────────────────────────────────────────────────────────────── */
export function taskListItemsByWO(workOrderId) {
  return TASK_LIST_ITEMS.filter(t => t.workOrderId === workOrderId)
    .sort((a, b) => a.operationNumber.localeCompare(b.operationNumber));
}

export function taskListCodeById(id) {
  return TASK_LIST_CODES.find(c => c.id === id) || null;
}

export function timesheetsByWO(workOrderId) {
  return TIMESHEETS.filter(t => t.workOrderId === workOrderId);
}

export function timesheetById(id) {
  return TIMESHEETS.find(t => t.id === id) || null;
}

export function entriesByTimesheet(timesheetId) {
  return TIMESHEET_ENTRIES.filter(e => e.timesheetId === timesheetId)
    .sort((a, b) => a.operationNumber.localeCompare(b.operationNumber));
}

export const OPERATION_STATUS_TOKENS = {
  'Not Started': { bg: '#F5F5F5',                 text: '#757575', icon: '●' },
  'In Progress':  { bg: 'rgba(245,200,0,0.12)',    text: '#8B7500', icon: '◑' },
  'Completed':    { bg: '#E8F5E9',                 text: '#388E3C', icon: '✓' },
};

export const TSE_STATUS_TOKENS = {
  Draft:     { bg: '#F5F5F5',  text: '#757575', border: '#75757540', label: '○ Draft' },
  Submitted: { bg: '#E3F2FD',  text: '#1976D2', border: '#1976D240', label: '⏳ Submitted' },
  Approved:  { bg: '#E8F5E9',  text: '#388E3C', border: '#388E3C40', label: '✓ Approved' },
  Rejected:  { bg: '#FFEBEE',  text: '#C62828', border: '#C6282840', label: '✕ Rejected' },
};

export function getPendingApprovals() {
  return TIMESHEETS.filter(t => t.status === 'Submitted');
}

export function hasDeviation(entries) {
  return entries.some(e => e.actualDuration !== e.plannedDuration);
}
