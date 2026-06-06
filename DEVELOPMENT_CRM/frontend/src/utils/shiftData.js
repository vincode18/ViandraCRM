/**
 * Shift Management module shared data + helpers
 * ------------------------------------------------------------------
 * Implements the schema & UI model from:
 *   - FRD_Shift_Management_Module.md      (FRD-FSM-001)
 *   - FRD_Shift_Module_Panel_Explanation.md (FRD-FSM-002)
 *
 * Provides mock Shift records, candidate grading, and helpers consumed
 * by the Gantt Schedule Board and the Shift Detail two-column view.
 */

import { SERVICE_RESOURCES, SAMPLE_SAS } from './saData';

// ── Picklists (FRD-FSM-001 §6.2 / §8.1) ─────────────────────────────
export const SHIFT_STATUSES = ['Tentative', 'Confirmed', 'Cancelled'];
export const TIME_SLOT_TYPES = ['Normal', 'Emergency', 'Extended', 'Holiday'];
export const RECORDSET_FILTERS = ['Emergency Only', 'Certified Welders', 'Night Shift', 'Hydraulics Specialist'];

// Gantt time axis — hourly columns
export const SHIFT_GANTT_START_HOUR = 6;
export const SHIFT_GANTT_END_HOUR = 22;
export const SHIFT_HOURS = Array.from(
  { length: SHIFT_GANTT_END_HOUR - SHIFT_GANTT_START_HOUR + 1 },
  (_, i) => SHIFT_GANTT_START_HOUR + i,
);
export const SHIFT_GANTT_DAY = '2026-05-23';

// ── Sample Shift records (FRD-FSM-002 §6 object model) ──────────────
export const SAMPLE_SHIFTS = [
  {
    name: 'SFT-3061099', status: 'Confirmed', startTime: '2026-05-23T08:00', endTime: '2026-05-23T17:00',
    timeSlotType: 'Normal', label: 'Day Shift', isNonStandard: false, isHoliday: false,
    backgroundColor: '#0070D2', recordsetFilter: '', serviceResourceId: 'SR-01', jobProfile: 'Field Supervisor',
    serviceTerritoryId: 'ST-0001', plantLocation: 'Sangkulirang Site', shiftTemplate: 'DAY',
  },
  {
    name: 'SFT-3061100', status: 'Tentative', startTime: '2026-05-23T07:00', endTime: '2026-05-23T15:00',
    timeSlotType: 'Normal', label: '', isNonStandard: false, isHoliday: false,
    backgroundColor: '#00897B', recordsetFilter: '', serviceResourceId: 'SR-02', jobProfile: 'Preventive Maint Tech',
    serviceTerritoryId: 'ST-0001', plantLocation: 'Sangkulirang Site', shiftTemplate: 'DAY',
  },
  {
    name: 'SFT-3061101', status: 'Confirmed', startTime: '2026-05-23T14:00', endTime: '2026-05-23T22:00',
    timeSlotType: 'Emergency', label: 'Emergency Standby', isNonStandard: true, isHoliday: false,
    backgroundColor: '#C62828', recordsetFilter: 'Emergency Only', serviceResourceId: 'SR-03', jobProfile: 'Diagnostics Expert',
    serviceTerritoryId: 'ST-0003', plantLocation: 'Balikpapan HQ', shiftTemplate: 'EVENING',
  },
  {
    name: 'SFT-3061102', status: 'Confirmed', startTime: '2026-05-23T09:00', endTime: '2026-05-23T18:00',
    timeSlotType: 'Normal', label: 'Day Shift', isNonStandard: false, isHoliday: false,
    backgroundColor: '#F57C00', recordsetFilter: '', serviceResourceId: 'SR-04', jobProfile: 'Hydraulics Tech',
    serviceTerritoryId: 'ST-0002', plantLocation: 'PDG', shiftTemplate: 'DAY',
  },
  {
    name: 'SFT-3061103', status: 'Cancelled', startTime: '2026-05-23T08:00', endTime: '2026-05-23T16:00',
    timeSlotType: 'Normal', label: '', isNonStandard: false, isHoliday: true,
    backgroundColor: '#757575', recordsetFilter: '', serviceResourceId: 'SR-05', jobProfile: 'Inspection',
    serviceTerritoryId: 'ST-0001', plantLocation: 'Sangkulirang Site', shiftTemplate: 'DAY',
  },
];

// ── Candidate grading (FRD-FSM-001 §4.3 / §7.2) ─────────────────────
// Each candidate resource receives a 0–100 weighted score.
export const SHIFT_CANDIDATES = [
  { id: 'SR-01', name: 'Bambang Suraji', role: 'Field Supervisor',    score: 100, options: 3, territory: 'ST-0001' },
  { id: 'SR-04', name: 'Rudi Hartono',   role: 'Hydraulics Tech',     score: 81,  options: 2, territory: 'ST-0002' },
  { id: 'SR-02', name: 'Arrochman',      role: 'Preventive Maint',    score: 64,  options: 2, territory: 'ST-0001' },
  { id: 'SR-03', name: 'Sarah Jenkins',  role: 'Diagnostics Expert',  score: 49,  options: 1, territory: 'ST-0003' },
  { id: 'SR-05', name: 'Edi Prayitno',   role: 'Inspection',          score: 48,  options: 1, territory: 'ST-0001' },
];

/** Score band → color coding (FRD-FSM-001 §4.3) */
export function scoreBand(score) {
  if (score >= 90) return { label: 'high',   color: '#388E3C', bg: '#E8F5E9' };
  if (score >= 70) return { label: 'medium', color: '#F57C00', bg: '#FFF3E0' };
  return { label: 'low', color: '#C62828', bg: '#FFEBEE' };
}

/** Shift status → pill badge style */
export function shiftStatusStyle(status) {
  const map = {
    Tentative: { color: '#F57C00', bg: 'rgba(245,124,0,0.12)' },
    Confirmed: { color: '#388E3C', bg: 'rgba(56,142,60,0.12)' },
    Cancelled: { color: '#757575', bg: 'rgba(117,117,117,0.12)' },
  };
  return map[status] || map.Tentative;
}

// ── Helpers ─────────────────────────────────────────────────────────
export function shiftByName(name) { return SAMPLE_SHIFTS.find(s => s.name === name) || null; }
export function shiftsForResource(resId) { return SAMPLE_SHIFTS.filter(s => s.serviceResourceId === resId); }

export function shiftHourFloat(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.getHours() + d.getMinutes() / 60;
}

export function shiftDurationHours(shift) {
  if (!shift.startTime || !shift.endTime) return 0;
  const s = new Date(shift.startTime).getTime();
  const e = new Date(shift.endTime).getTime();
  return Math.round(((e - s) / 3600000) * 10) / 10;
}

export function formatShiftTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function formatShiftDateTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
}

/**
 * SA history for a resource during/around the shift window
 * (FRD-FSM-002 §4.3.2). Pulls from the shared SA sample set.
 */
export function saHistoryForResource(resId) {
  return SAMPLE_SAS.filter(sa => sa.assignedResource === resId);
}

export { SERVICE_RESOURCES };
