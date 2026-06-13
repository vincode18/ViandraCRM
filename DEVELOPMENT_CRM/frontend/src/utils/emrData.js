/* ─────────────────────────────────────────────────────────────────────────
   EMR (Equipment Maintenance Report) — Mock Data Layer
   PRD: EMR-PRD-2607-001 / EMR-DSG-2607-001
   ───────────────────────────────────────────────────────────────────────── */

export const EMR_STATUSES = ['Open', 'In Progress', 'Submit EMR', 'Assign TO', 'Not Complete', 'Resubmit', 'Closed'];
export const EMR_S_STATUSES = ['Open', 'In Progress', 'Closed'];

export const EMR_STATUS_TOKENS = {
  'Open':         { color: '#4A90E2', bg: 'rgba(74,144,226,0.1)',   border: '#4A90E2' },
  'In Progress':  { color: '#FFB81C', bg: 'rgba(255,184,28,0.1)',   border: '#FFB81C' },
  'Submit EMR':   { color: '#7B1FA2', bg: 'rgba(123,31,162,0.1)',   border: '#7B1FA2' },
  'Assign TO':    { color: '#0073E6', bg: 'rgba(0,115,230,0.1)',    border: '#0073E6' },
  'Not Complete': { color: '#C62828', bg: 'rgba(198,40,40,0.1)',    border: '#C62828' },
  'Resubmit':     { color: '#F57C00', bg: 'rgba(245,124,0,0.1)',    border: '#F57C00' },
  'Closed':       { color: '#6C7681', bg: 'rgba(108,118,129,0.1)',  border: '#6C7681' },
};

export const EMILA_CATEGORIES = [
  { code: 'E', label: 'Environment' },
  { code: 'M', label: 'Machine' },
  { code: 'I', label: 'Identification' },
  { code: 'L', label: 'Location' },
  { code: 'A', label: 'Abnormality' },
];

export const EMR_GROUP_TYPES = ['Desktop', 'FSL'];

export const EMRS = [
  {
    id: 'U-00022418',
    type: 'U',
    status: 'Assign TO',
    subject: 'FSL New Enhancement Report Specialization Mechanic UT at SalesForce',
    owner: 'UT Integration',
    flagAzure: false,
    partSupply: false,
    supervisisiAwal: 'Ensure all safety protocols followed before commencing maintenance.',
    agingAssignTO: 3,
    agingApprovalTO: 5,
    utAssignTO: 'Rudi Hartono',
    utApprovalTO: '',
    utSubmit: '2026-05-18T11:53',
    agingPendingSubmit: 20,
    hoursOnComponent: 2450,
    reOpenReason: '',
    asset: 'PC200-DBCH2895',
    // Customer Information
    machineModel: 'PC200',
    machineProduct: 'Hydraulic Excavator',
    serialNumber: 'DBCH2895',
    machineCode: 'PC200-8M0',
    engineModel: 'SAA6D107E-3',
    engineNumber: '07E-3-201234',
    branchSite: 'PDG',
    serviceArea: 'Padang Service Area',
    deliveryDate: '2020-03-15',
    account: 'RAJAWALI LINTAS',
    warrantyRemarks: 'Extended warranty — expires 2025-03-15',
    machineGroup: 'Excavator',
    // EMR Information
    emrPlant: 'PDG',
    workOrder: '01269822',
    case: '01553205',
    pmactType: 'Unscheduled Maintenance',
    woSAPNo: '0001269822',
    subCallType: 'Internal - Unschedule Inspection Warranty',
    agingDay: 7,
    troubleDate: '2026-05-15T08:00',
    finishBDDatetime: '2026-05-18T14:30',
    startBDDatetime: '2026-05-15T08:00',
    smrTrouble: 2447,
    smrRFU: 2450,
    kmMileage: '',
    leadTimeHours: 62.5,
    // Other Information
    unitLocation: 'Tambang Batubara Site A, Kalimantan Timur',
    shift: '2',
    informasi: 'Breakdown',
    subInformasi: 'Hydraulic System',
    problemStatus: 'Warranty',
    machineStatus: 'Machine Normal Operation',
    application: 'Mining',
    manufacture: 'Komatsu',
    responsibility: 'Customer',
    submitToClaim: false,
    needSupportHO: false,
    hoDate: null,
    resto: 'Full Restoration',
    restoManPower: 'Team A (3 persons)',
    createdBy: 'NOVIANDRA SALLASA',
    createdAt: '2026-05-15T09:00',
    lastModifiedBy: 'NOVIANDRA SALLASA',
    lastModifiedAt: '2026-05-23T11:36',
  },
  {
    id: 'S-00074662',
    type: 'S',
    status: 'Closed',
    subject: 'Scheduled PM — Dozer D375A Balikpapan Site',
    owner: 'UT Integration',
    flagAzure: true,
    partSupply: true,
    supervisisiAwal: 'Standard PM procedure per OEM manual.',
    agingAssignTO: 0,
    agingApprovalTO: 0,
    utAssignTO: 'Budi Santoso',
    utApprovalTO: 'Rudi Hartono',
    utSubmit: '2026-04-10T09:00',
    agingPendingSubmit: 0,
    hoursOnComponent: 5000,
    reOpenReason: '',
    asset: 'D375A-BTPN',
    machineModel: 'D375A',
    machineProduct: 'Bulldozer',
    serialNumber: 'BTPN-10294',
    machineCode: 'D375A-5',
    engineModel: 'SAA6D170E-5',
    engineNumber: '170E-5-009812',
    branchSite: 'BPN',
    serviceArea: 'Balikpapan Service Area',
    deliveryDate: '2019-06-01',
    account: 'SIMS JAYA KALTIM',
    warrantyRemarks: 'Standard warranty expired',
    machineGroup: 'Dozer',
    emrPlant: 'BPN',
    workOrder: '01292010',
    case: '01561030',
    pmactType: 'Scheduled PM',
    woSAPNo: '0001292010',
    subCallType: 'Internal - Scheduled Inspection',
    agingDay: 0,
    troubleDate: '2026-04-08T07:00',
    finishBDDatetime: '2026-04-10T14:00',
    startBDDatetime: '2026-04-08T07:00',
    smrTrouble: 4998,
    smrRFU: 5000,
    kmMileage: '',
    leadTimeHours: 55,
    unitLocation: 'Coal Mine Site B, Kalimantan Timur',
    shift: '1',
    informasi: 'Scheduled PM',
    subInformasi: '5000H Service',
    problemStatus: 'PM Service',
    machineStatus: 'Machine Normal Operation',
    application: 'Mining',
    manufacture: 'Komatsu',
    responsibility: 'UT',
    submitToClaim: false,
    needSupportHO: false,
    hoDate: null,
    resto: '',
    restoManPower: 'Team B (2 persons)',
    createdBy: 'UT.Integration',
    createdAt: '2026-04-08T07:30',
    lastModifiedBy: 'UT.Integration',
    lastModifiedAt: '2026-04-10T15:00',
  },
  {
    id: 'U-00021394',
    type: 'U',
    status: 'Closed',
    subject: 'Emergency Repair — Grader GD705A Engine Failure Makassar',
    owner: 'Ari Wibowo',
    flagAzure: false,
    partSupply: true,
    supervisisiAwal: 'Priority emergency — customer production halt.',
    agingAssignTO: 1,
    agingApprovalTO: 2,
    utAssignTO: 'Ari Wibowo',
    utApprovalTO: 'Rudi Hartono',
    utSubmit: '2026-03-22T18:00',
    agingPendingSubmit: 0,
    hoursOnComponent: 8900,
    reOpenReason: '',
    asset: 'GD705A-MKS',
    machineModel: 'GD705A',
    machineProduct: 'Motor Grader',
    serialNumber: 'MKS-20198',
    machineCode: 'GD705A-4',
    engineModel: 'SAA6D125E-5',
    engineNumber: '125E-5-881234',
    branchSite: 'MKS',
    serviceArea: 'Makassar Service Area',
    deliveryDate: '2017-09-01',
    account: 'INTI KARYA BERSAMA',
    warrantyRemarks: 'Out of warranty',
    machineGroup: 'Grader',
    emrPlant: 'MKS',
    workOrder: '01275500',
    case: '01557700',
    pmactType: 'Emergency Repair',
    woSAPNo: '0001275500',
    subCallType: 'Internal - Emergency',
    agingDay: 0,
    troubleDate: '2026-03-20T11:00',
    finishBDDatetime: '2026-03-22T17:00',
    startBDDatetime: '2026-03-20T13:00',
    smrTrouble: 8897,
    smrRFU: 8900,
    kmMileage: '',
    leadTimeHours: 54,
    unitLocation: 'Road Construction Site C, Sulawesi Selatan',
    shift: '1',
    informasi: 'Breakdown',
    subInformasi: 'Engine Failure',
    problemStatus: 'Out of Warranty',
    machineStatus: 'Machine Normal Operation',
    application: 'Construction',
    manufacture: 'Komatsu',
    responsibility: 'Customer',
    submitToClaim: true,
    needSupportHO: true,
    hoDate: '2026-03-21',
    resto: 'Engine Overhaul',
    restoManPower: 'Team C (4 persons)',
    createdBy: 'ARI WIBOWO',
    createdAt: '2026-03-20T13:30',
    lastModifiedBy: 'RUDI HARTONO',
    lastModifiedAt: '2026-03-23T09:00',
  },
];

/* ── Additional Groups ───────────────────────────────────────────────────── */
export const EMR_ADDITIONAL_GROUPS = [
  { id: 'AG-001', emrId: 'U-00022418', name: '* BAPP',                          groupType: 'Desktop', orderNumber: '',    hasRevise: false },
  { id: 'AG-002', emrId: 'U-00022418', name: 'Photo Damage Core',               groupType: 'Desktop', orderNumber: '1',   hasRevise: false },
  { id: 'AG-003', emrId: 'U-00022418', name: 'Photo Outcome Repair',            groupType: 'Desktop', orderNumber: '2',   hasRevise: true  },
  { id: 'AG-004', emrId: 'U-00022418', name: 'Photo Abnormality',               groupType: 'FSL',     orderNumber: '1',   hasRevise: false },
  { id: 'AG-005', emrId: 'U-00022418', name: 'Photo Environment',               groupType: 'FSL',     orderNumber: '2',   hasRevise: false },
  { id: 'AG-006', emrId: 'U-00022418', name: 'Photo Identification',            groupType: 'FSL',     orderNumber: '3',   hasRevise: false },
  { id: 'AG-007', emrId: 'U-00022418', name: 'Photo Location',                  groupType: 'FSL',     orderNumber: '4',   hasRevise: false },
  { id: 'AG-008', emrId: 'U-00022418', name: 'Photo Maintenance Condition',     groupType: 'FSL',     orderNumber: '5',   hasRevise: false },
  { id: 'AG-009', emrId: 'U-00022418', name: 'RPL',                             groupType: 'Desktop', orderNumber: '3',   hasRevise: false },
  { id: 'AG-010', emrId: 'U-00022418', name: 'TSR',                             groupType: 'Desktop', orderNumber: '4',   hasRevise: false },
  { id: 'AG-011', emrId: 'U-00022418', name: 'WO SAP',                          groupType: 'Desktop', orderNumber: '5',   hasRevise: false },
  { id: 'AG-012', emrId: 'U-00022418', name: 'Form QCC',                        groupType: 'Desktop', orderNumber: '6',   hasRevise: false },
  { id: 'AG-013', emrId: 'U-00022418', name: 'Invoice',                         groupType: 'Desktop', orderNumber: '7',   hasRevise: false },
  { id: 'AG-014', emrId: 'U-00022418', name: 'SN Component KRA',                groupType: 'Desktop', orderNumber: '8',   hasRevise: false },
  { id: 'AG-015', emrId: 'U-00022418', name: 'SN Patria',                       groupType: 'Desktop', orderNumber: '9',   hasRevise: false },
  { id: 'AG-016', emrId: 'U-00022418', name: 'SPB',                             groupType: 'Desktop', orderNumber: '10',  hasRevise: false },
  { id: 'AG-017', emrId: 'U-00022418', name: 'Others',                          groupType: 'Desktop', orderNumber: '11',  hasRevise: false },
];

/* ── Additional Information ─────────────────────────────────────────────── */
export const EMR_ADDITIONAL_INFO = [
  { id: 'AI-001', emrId: 'U-00022418', description: 'Engine oil analysis report', showImage: false, url: '#' },
  { id: 'AI-002', emrId: 'U-00022418', description: 'Hydraulic pressure test sheet', showImage: true, url: '#' },
];

/* ── EMR History ─────────────────────────────────────────────────────────── */
export const EMR_HISTORY = [
  { id: 'EH-001', emrId: 'U-00022418', timestamp: '23/05/2026, 11:36', field: 'EMR Status', oldValue: 'Assign TO',    newValue: 'Closed',      user: 'NOVIANDRA SALLASA' },
  { id: 'EH-002', emrId: 'U-00022418', timestamp: '22/05/2026, 08:10', field: 'UT Approval TO', oldValue: '',         newValue: 'Rudi Hartono', user: 'RUDI HARTONO' },
  { id: 'EH-003', emrId: 'U-00022418', timestamp: '20/05/2026, 14:22', field: 'EMR Status', oldValue: 'Submit EMR',  newValue: 'Assign TO',   user: 'SARIEF RAHMATTULLOH' },
  { id: 'EH-004', emrId: 'U-00022418', timestamp: '18/05/2026, 11:53', field: 'EMR Status', oldValue: 'In Progress', newValue: 'Submit EMR',  user: 'MOHAMMAD FICRI KABAN' },
  { id: 'EH-005', emrId: 'U-00022418', timestamp: '15/05/2026, 09:00', field: 'EMR Status', oldValue: 'Open',        newValue: 'In Progress', user: 'MOHAMMAD FICRI KABAN' },
];

/* ── EMILA Photos ─────────────────────────────────────────────────────────── */
export const EMILA_PHOTOS = [
  { id: 'EP-001', emrId: 'U-00022418', category: 'E', description: 'Site overview — muddy conditions', orderNumber: 1, groupType: 'FSL', url: null },
  { id: 'EP-002', emrId: 'U-00022418', category: 'M', description: 'Front view of unit PC200-DBCH2895', orderNumber: 1, groupType: 'FSL', url: null },
  { id: 'EP-003', emrId: 'U-00022418', category: 'I', description: 'Serial number plate close-up', orderNumber: 1, groupType: 'FSL', url: null },
  { id: 'EP-004', emrId: 'U-00022418', category: 'L', description: 'Hydraulic hose connection point', orderNumber: 1, groupType: 'FSL', url: null },
  { id: 'EP-005', emrId: 'U-00022418', category: 'A', description: 'Hydraulic oil leak — main boom cylinder', orderNumber: 1, groupType: 'FSL', url: null },
];

/* ── Helpers ─────────────────────────────────────────────────────────────── */
export function emrById(id) {
  return EMRS.find(e => e.id === id) || null;
}

export function additionalGroupsByEMR(emrId) {
  return EMR_ADDITIONAL_GROUPS.filter(g => g.emrId === emrId);
}

export function additionalInfoByEMR(emrId) {
  return EMR_ADDITIONAL_INFO.filter(i => i.emrId === emrId);
}

export function historyByEMR(emrId) {
  return EMR_HISTORY.filter(h => h.emrId === emrId);
}

export function photosByEMR(emrId, category = null) {
  const all = EMILA_PHOTOS.filter(p => p.emrId === emrId);
  return category ? all.filter(p => p.category === category) : all;
}

export function getStagesForType(type) {
  return type === 'S' ? EMR_S_STATUSES : EMR_STATUSES;
}

export function getStageState(stages, currentStatus, stepLabel) {
  const currentIndex = stages.indexOf(currentStatus);
  const stepIndex = stages.indexOf(stepLabel);
  if (stepIndex < currentIndex) return 'completed';
  if (stepIndex === currentIndex) return 'active';
  return 'pending';
}
