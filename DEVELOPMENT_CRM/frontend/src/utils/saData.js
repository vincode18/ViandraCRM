/**
 * Service Appointment (SA) shared data + helpers
 * ------------------------------------------------------------------
 * Implements the field schema from FRD-SA-Fields.md and the status
 * lifecycle / badge colours from FRD-Field-Service-Tracking.md.
 *
 * No SA backend endpoints exist yet, so this module provides mock
 * sample records (matching the design references) consumed by:
 *   - ServiceAppointmentsPage      (SA list view)
 *   - ServiceAppointmentDetailPage (8-section detail view)
 *   - FieldServicePage             (Gantt queue + dispatch console)
 *   - BookAppointmentModal         (SA creation from WO Feed tab)
 */

// ── Status lifecycle (FRD-SA-Fields §6) ─────────────────────────────
export const SA_STATUSES = [
  'None',
  'Scheduled',
  'Dispatched',
  'In Progress',
  'Completed',
  'Cannot Complete',
  'Canceled',
];

export const DURATION_TYPES = ['Hours', 'Minutes'];

/**
 * Status badge colour pairs.
 * Returns { bg, text } using literal hex from the FRD §8.3 spec.
 * `dark` selects the dark-mode variant.
 */
export function saStatusStyle(status, dark = false) {
  const map = {
    None:              { light: { bg: '#eeeeee', text: '#4d4632' }, dark: { bg: '#2a2c2d', text: '#c6c6c6' } },
    NEW:               { light: { bg: '#f5c800', text: '#695400' }, dark: { bg: '#695400', text: '#eec200' } },
    Scheduled:         { light: { bg: '#f5c800', text: '#695400' }, dark: { bg: '#695400', text: '#f5c800' } },
    Dispatched:        { light: { bg: '#e5e2e1', text: '#1c1b1b' }, dark: { bg: '#474646', text: '#e5e2e1' } },
    'In Progress':     { light: { bg: '#f5c800', text: '#695400' }, dark: { bg: '#695400', text: '#f5c800' } },
    'On-Site':         { light: { bg: '#1a1c1c', text: '#f1f1f1' }, dark: { bg: '#f1f1f1', text: '#1a1c1c' } },
    Completed:         { light: { bg: '#dadada', text: '#1a1c1c' }, dark: { bg: '#2f3131', text: '#c6c6c6' } },
    'Cannot Complete': { light: { bg: '#ffdad6', text: '#93000a' }, dark: { bg: '#93000a', text: '#ffdad6' } },
    Canceled:          { light: { bg: '#ffdad6', text: '#93000a' }, dark: { bg: '#93000a', text: '#ffdad6' } },
    Overdue:           { light: { bg: '#ba1a1a', text: '#ffffff' }, dark: { bg: '#ff897d', text: '#1a1c1c' } },
  };
  const entry = map[status] || map.None;
  return dark ? entry.dark : entry.light;
}

// ── Service Resources (Gantt rows / dispatch) ───────────────────────
export const SERVICE_RESOURCES = [
  { id: 'SR-01', name: 'Budi Santoso',  level: 'Senior · Heavy Equipment', avatar: 'BS', territory: 'JKT ST', capacityUsed: 32, capacityMax: 40 },
  { id: 'SR-02', name: 'Agus Mizni',    level: 'Senior · Preventive Maint', avatar: 'AM', territory: 'JKT ST', capacityUsed: 38, capacityMax: 40 },
  { id: 'SR-03', name: 'Sarah Jenkins', level: 'Field · Diagnostics',       avatar: 'SJ', territory: 'BDG ST', capacityUsed: 40, capacityMax: 40 },
  { id: 'SR-04', name: 'Rudi Hartono',  level: 'Field · Hydraulics',        avatar: 'RH', territory: 'JKT ST', capacityUsed: 18, capacityMax: 40 },
  { id: 'SR-05', name: 'Dewi Lestari',  level: 'Junior · Inspection',       avatar: 'DL', territory: 'SBY ST', capacityUsed: 24, capacityMax: 40 },
];

export const SERVICE_TERRITORIES = [
  { id: 'JKT', name: 'JKT ST (Jakarta)' },
  { id: 'BDG', name: 'BDG ST (Bandung)' },
  { id: 'SBY', name: 'SBY ST (Surabaya)' },
  { id: 'BPN', name: 'BPN ST (Balikpapan)' },
];

export const WORK_TYPES = [
  'Preventive Maintenance',
  'Emergency Repair',
  'Inspection Routine',
  'Component Replacement',
  'Diagnostics',
];

// ── Sample Service Appointment records (full FRD field schema) ──────
export const SAMPLE_SAS = [
  {
    appointmentNumber: 'SA-09283',
    subject: 'PM Service - Excavator C320',
    status: 'Scheduled',
    statusCategory: 'Scheduled',
    parentRecord: 'WO-9921',
    parentRecordType: 'Work Order',
    parentRecordStatusCategory: 'In Progress',
    workType: 'Preventive Maintenance',
    account: 'PT Indotech',
    contact: 'Pak Rudi Hartono',
    street: 'Jl. Industri Raya No.12',
    city: 'Jakarta',
    state: 'DKI Jakarta',
    postalCode: '14140',
    country: 'Indonesia',
    serviceTerritory: 'JKT ST (Jakarta)',
    latitude: -6.121435,
    longitude: 106.774124,
    duration: 9,
    durationType: 'Hours',
    durationInMinutes: 540,
    earliestStart: '2026-05-20T08:00',
    dueDate: '2026-05-25T17:00',
    arrivalWindowStart: '2026-05-23T07:30',
    arrivalWindowEnd: '2026-05-23T09:00',
    schedStart: '2026-05-23T08:00',
    schedEnd: '2026-05-23T17:00',
    actualStart: '',
    actualEnd: '',
    actualDuration: '',
    scheduleMode: '—',
    description: 'Routine preventive maintenance for excavator C320 per scheduled SMR interval.',
    serviceNote: '',
    isBundle: false,
    isBundleMember: false,
    bundlePolicy: '',
    relatedBundle: '',
    isManuallyBundled: false,
    isOffsiteAppointment: false,
    transaction: '',
    assignedResource: 'SR-01',
  },
  {
    appointmentNumber: 'SA-09284',
    subject: 'Emergency Repair - Hydraulic',
    status: 'Dispatched',
    statusCategory: 'Dispatched',
    parentRecord: 'WO-4891',
    parentRecordType: 'Work Order',
    parentRecordStatusCategory: 'In Progress',
    workType: 'Emergency Repair',
    account: 'SIMS JAYA KALTIM',
    contact: 'Burhan',
    street: 'Kawasan Industri MM2100',
    city: 'Bekasi',
    state: 'Jawa Barat',
    postalCode: '17520',
    country: 'Indonesia',
    serviceTerritory: 'JKT ST (Jakarta)',
    latitude: -6.293270,
    longitude: 107.057800,
    duration: 4,
    durationType: 'Hours',
    durationInMinutes: 240,
    earliestStart: '2026-05-23T09:00',
    dueDate: '2026-05-25T17:00',
    arrivalWindowStart: '2026-05-23T10:30',
    arrivalWindowEnd: '2026-05-23T11:30',
    schedStart: '2026-05-23T11:00',
    schedEnd: '2026-05-23T15:00',
    actualStart: '',
    actualEnd: '',
    actualDuration: '',
    scheduleMode: 'Drag and Drop',
    description: 'Hydraulic system failure on HO785. Urgent on-site repair required.',
    serviceNote: '',
    isBundle: false,
    isBundleMember: false,
    bundlePolicy: '',
    relatedBundle: '',
    isManuallyBundled: false,
    isOffsiteAppointment: false,
    transaction: 'TXN-88210',
    assignedResource: 'SR-02',
  },
  {
    appointmentNumber: 'SA-09285',
    subject: 'Inspection Routine - Base',
    status: 'None',
    statusCategory: 'None',
    parentRecord: 'WO-9930',
    parentRecordType: 'Work Order',
    parentRecordStatusCategory: 'New',
    workType: 'Inspection Routine',
    account: 'PUTRA PERKASA ABADI',
    contact: 'Andi Wijaya',
    street: 'Base Camp Sector 4',
    city: 'Balikpapan',
    state: 'Kalimantan Timur',
    postalCode: '76127',
    country: 'Indonesia',
    serviceTerritory: 'BPN ST (Balikpapan)',
    latitude: -1.268226,
    longitude: 116.831200,
    duration: 90,
    durationType: 'Minutes',
    durationInMinutes: 90,
    earliestStart: '2026-05-24T08:00',
    dueDate: '2026-05-28T17:00',
    arrivalWindowStart: '',
    arrivalWindowEnd: '',
    schedStart: '',
    schedEnd: '',
    actualStart: '',
    actualEnd: '',
    actualDuration: '',
    scheduleMode: '—',
    description: 'Routine base camp equipment inspection.',
    serviceNote: '',
    isBundle: false,
    isBundleMember: false,
    bundlePolicy: '',
    relatedBundle: '',
    isManuallyBundled: false,
    isOffsiteAppointment: true,
    transaction: '',
    assignedResource: '',
  },
  {
    appointmentNumber: 'SA-09286',
    subject: 'Component Replacement - Pump',
    status: 'In Progress',
    statusCategory: 'In Progress',
    parentRecord: 'WO-5012',
    parentRecordType: 'Work Order',
    parentRecordStatusCategory: 'In Progress',
    workType: 'Component Replacement',
    account: 'PAMAPERSADA NUSANTARA',
    contact: 'Siti Rahma',
    street: 'Jl. Tambang Utara No.8',
    city: 'Bandung',
    state: 'Jawa Barat',
    postalCode: '40123',
    country: 'Indonesia',
    serviceTerritory: 'BDG ST (Bandung)',
    latitude: -6.917464,
    longitude: 107.619125,
    duration: 6,
    durationType: 'Hours',
    durationInMinutes: 360,
    earliestStart: '2026-05-23T07:00',
    dueDate: '2026-05-24T17:00',
    arrivalWindowStart: '2026-05-23T08:00',
    arrivalWindowEnd: '2026-05-23T09:00',
    schedStart: '2026-05-23T09:00',
    schedEnd: '2026-05-23T15:00',
    actualStart: '2026-05-23T09:12',
    actualEnd: '',
    actualDuration: '',
    scheduleMode: 'Schedule',
    description: 'Replace failed hydraulic pump assembly.',
    serviceNote: 'Pump removed, awaiting torque spec confirmation.',
    isBundle: false,
    isBundleMember: false,
    bundlePolicy: '',
    relatedBundle: '',
    isManuallyBundled: false,
    isOffsiteAppointment: false,
    transaction: 'TXN-88254',
    assignedResource: 'SR-03',
  },
  {
    appointmentNumber: 'SA-09287',
    subject: 'Diagnostics - Engine ECU',
    status: 'Completed',
    statusCategory: 'Completed',
    parentRecord: 'WO-4775',
    parentRecordType: 'Work Order',
    parentRecordStatusCategory: 'Completed',
    workType: 'Diagnostics',
    account: 'PT Indotech',
    contact: 'Pak Rudi Hartono',
    street: 'Jl. Industri Raya No.12',
    city: 'Jakarta',
    state: 'DKI Jakarta',
    postalCode: '14140',
    country: 'Indonesia',
    serviceTerritory: 'JKT ST (Jakarta)',
    latitude: -6.121435,
    longitude: 106.774124,
    duration: 2,
    durationType: 'Hours',
    durationInMinutes: 120,
    earliestStart: '2026-05-19T08:00',
    dueDate: '2026-05-21T17:00',
    arrivalWindowStart: '2026-05-20T08:30',
    arrivalWindowEnd: '2026-05-20T09:30',
    schedStart: '2026-05-20T09:00',
    schedEnd: '2026-05-20T11:00',
    actualStart: '2026-05-20T09:05',
    actualEnd: '2026-05-20T10:48',
    actualDuration: 103,
    scheduleMode: 'Global Optimization',
    description: 'ECU fault diagnostics and reflash.',
    serviceNote: 'ECU reflashed to latest firmware. No further faults detected.',
    isBundle: false,
    isBundleMember: false,
    bundlePolicy: '',
    relatedBundle: '',
    isManuallyBundled: false,
    isOffsiteAppointment: false,
    transaction: 'TXN-88001',
    assignedResource: 'SR-04',
  },
  {
    appointmentNumber: 'SA-09288',
    subject: 'PM Service - Bundle Parent',
    status: 'Scheduled',
    statusCategory: 'Scheduled',
    parentRecord: 'WO-6120',
    parentRecordType: 'Work Order',
    parentRecordStatusCategory: 'New',
    workType: 'Preventive Maintenance',
    account: 'PAMAPERSADA NUSANTARA',
    contact: 'Siti Rahma',
    street: 'Jl. Tambang Utara No.8',
    city: 'Bandung',
    state: 'Jawa Barat',
    postalCode: '40123',
    country: 'Indonesia',
    serviceTerritory: 'BDG ST (Bandung)',
    latitude: -6.917464,
    longitude: 107.619125,
    duration: 3,
    durationType: 'Hours',
    durationInMinutes: 180,
    earliestStart: '2026-05-24T08:00',
    dueDate: '2026-05-27T17:00',
    arrivalWindowStart: '',
    arrivalWindowEnd: '',
    schedStart: '2026-05-24T13:00',
    schedEnd: '2026-05-24T16:00',
    actualStart: '',
    actualEnd: '',
    actualDuration: '',
    scheduleMode: 'Drag and Drop',
    description: 'Bundle parent grouping multiple PM tasks on adjacent units.',
    serviceNote: '',
    isBundle: true,
    isBundleMember: false,
    bundlePolicy: 'Adjacent-Site Policy',
    relatedBundle: '',
    isManuallyBundled: true,
    isOffsiteAppointment: false,
    transaction: '',
    assignedResource: 'SR-05',
  },
];

// ── Formatting helpers ──────────────────────────────────────────────
export function formatDateTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('en-GB', {
    weekday: 'short', day: '2-digit', month: 'short',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
}

export function formatTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function durationLabel(sa) {
  if (!sa.duration) return '—';
  const unit = sa.durationType === 'Minutes' ? 'min' : 'h';
  return `${sa.duration}${unit} (${sa.durationInMinutes} min)`;
}

export function resourceById(id) {
  return SERVICE_RESOURCES.find(r => r.id === id) || null;
}

/** SLA overdue check (FRD §9.2) */
export function isOverdue(sa) {
  if (!sa.dueDate) return false;
  if (['Completed', 'Canceled'].includes(sa.status)) return false;
  return new Date(sa.dueDate).getTime() < Date.now();
}
