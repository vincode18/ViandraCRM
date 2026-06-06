/**
 * Service Area module shared data + helpers
 * ------------------------------------------------------------------
 * Implements the schema from:
 *   - PRD_ServiceArea_Module1.md
 *   - PRD_ServiceArea_Module2.md (v2.0)
 *
 * Three interconnected sub-modules:
 *   Plant → Work Center (FD | FM) → Service Territory → Territory Members
 *
 * No backend endpoints exist yet, so this module provides mock sample
 * records (matching the design references under E. DesignUIUX/UI_Design_Shift)
 * consumed by the Plant / Work Center / Service Territory pages and linked
 * from Work Order / Field Service.
 */

// ── Enums (PRD M2 §3.2 / §4.2) ──────────────────────────────────────
export const SITE_TYPES = [
  { code: 'BRANCH',    label: 'Branch' },
  { code: 'SITE',      label: 'Site' },
  { code: 'HQ',        label: 'Headquarters' },
  { code: 'SATELLITE', label: 'Satellite' },
];

export const WORK_CENTER_TYPES = [
  { code: 'FD', label: 'Field Service (Regular)' },
  { code: 'FM', label: 'Facilities Management (Full Contract)' },
];

export const TERRITORY_TYPES = ['Primary', 'Secondary', 'Relocation'];
export const TRAVEL_MODES = ['Driving', 'Motorcycle', 'Walking', 'Public Transit'];
export const PM_SCHEDULES = ['Weekly', 'Monthly', 'Quarterly', 'Annual'];
export const SLA_PRIORITIES = ['Standard', 'Priority', 'Critical'];

// ── Plants (PRD M2 §3.3) ────────────────────────────────────────────
export const PLANTS = [
  {
    plant_id: 'PLT-0001', plant_name: 'PDG', plant_code: 'PDG', site_type: 'BRANCH',
    address: 'Jl. By Pass KM 12, Padang', city: 'Padang', region: 'Sumatera Barat', country: 'Indonesia',
    latitude: -0.947083, longitude: 100.417181, is_active: true, parent_plant_id: '',
    operating_hours: 'Standard Business Hours', description: 'Padang branch — West Sumatera field operations hub.',
    created_by: 'Admin User', created_date: '2023-10-24T08:30', modified_by: 'Admin User', modified_date: '2023-11-02T14:15',
    capacity_pct: 87, status: 'Operational',
  },
  {
    plant_id: 'PLT-0002', plant_name: 'Balikpapan HQ', plant_code: 'BPN', site_type: 'HQ',
    address: 'Jl. Soekarno Hatta KM 8', city: 'Balikpapan', region: 'Kalimantan Timur', country: 'Indonesia',
    latitude: -1.236355, longitude: 116.853027, is_active: true, parent_plant_id: '',
    operating_hours: 'Standard 24/7 Mining Ops', description: 'Central command HQ for Kalimantan mining operations.',
    created_by: 'System Admin', created_date: '2023-01-15T09:00', modified_by: 'Admin User', modified_date: '2023-10-24T10:00',
    capacity_pct: 92, status: 'Operational',
  },
  {
    plant_id: 'PLT-0003', plant_name: 'Sangkulirang Site', plant_code: 'SKL', site_type: 'SITE',
    address: 'Sangkulirang Mining Zone', city: 'Sangkulirang', region: 'Kalimantan Timur', country: 'Indonesia',
    latitude: 0.987000, longitude: 117.998000, is_active: true, parent_plant_id: 'PLT-0002',
    operating_hours: 'Standard 24/7 Mining Ops', description: 'Dedicated mining extraction site under Balikpapan HQ.',
    created_by: 'System Admin', created_date: '2023-02-01T09:00', modified_by: 'Shift Supervisor A', modified_date: '2023-10-23T09:15',
    capacity_pct: 74, status: 'Operational',
  },
  {
    plant_id: 'PLT-0004', plant_name: 'Jakarta Satellite', plant_code: 'JKT-S', site_type: 'SATELLITE',
    address: 'Jl. Industri Raya No.12', city: 'Jakarta', region: 'DKI Jakarta', country: 'Indonesia',
    latitude: -6.121435, longitude: 106.774124, is_active: false, parent_plant_id: 'PLT-0002',
    operating_hours: 'Standard Business Hours', description: 'Satellite office supporting Jakarta-area dispatch.',
    created_by: 'Admin User', created_date: '2023-03-10T11:00', modified_by: 'Admin User', modified_date: '2023-09-20T16:30',
    capacity_pct: 41, status: 'Idle',
  },
];

// ── Work Centers (PRD M2 §4.3) ──────────────────────────────────────
export const WORK_CENTERS = [
  {
    wc_id: 'WC-0001', wc_name: 'PDG Field Service', wc_code: 'PDG-FD', wc_type: 'FD',
    plant_id: 'PLT-0001', description: 'Regular field dispatch for Padang branch.', is_active: true,
    service_lead_id: 'Budi Santoso', operating_hours_id: 'Standard Business Hours', default_sla_hours: 24,
    created_date: '2023-10-24T08:35', modified_date: '2023-11-02T14:20',
    fm_contract_ref: '', fm_contract_start: '', fm_contract_end: '', fm_client_name: '',
    fm_scope_of_work: '', fm_pm_schedule: '', fm_resource_count: '', fm_contract_value: '', fm_sla_priority: '',
  },
  {
    wc_id: 'WC-0002', wc_name: 'FM-SKLPM', wc_code: 'FM-SKLPM', wc_type: 'FM',
    plant_id: 'PLT-0003', description: 'Full facilities-management contract for Sangkulirang mining facility.', is_active: true,
    service_lead_id: 'Agus Mizni', operating_hours_id: 'Standard 24/7 Mining Ops', default_sla_hours: 4,
    created_date: '2023-10-27T14:32', modified_date: '2023-10-27T14:32',
    fm_contract_ref: 'CTR-2023-SKL-019', fm_contract_start: '2023-01-01', fm_contract_end: '2025-12-31',
    fm_client_name: 'Sangkulirang FMC', fm_scope_of_work: 'End-to-end maintenance of mining extraction zones and associated heavy equipment.',
    fm_pm_schedule: 'Monthly', fm_resource_count: 12, fm_contract_value: 4800000000, fm_sla_priority: 'Critical',
  },
  {
    wc_id: 'WC-0003', wc_name: 'BPN Field Service', wc_code: 'BPN-FD', wc_type: 'FD',
    plant_id: 'PLT-0002', description: 'Regular field dispatch for Balikpapan HQ region.', is_active: true,
    service_lead_id: 'Sarah Jenkins', operating_hours_id: 'Standard 24/7 Mining Ops', default_sla_hours: 12,
    created_date: '2023-01-16T09:00', modified_date: '2023-10-20T10:00',
    fm_contract_ref: '', fm_contract_start: '', fm_contract_end: '', fm_client_name: '',
    fm_scope_of_work: '', fm_pm_schedule: '', fm_resource_count: '', fm_contract_value: '', fm_sla_priority: '',
  },
];

// ── Service Territories (PRD M2 §5.2.1) ─────────────────────────────
export const TERRITORIES = [
  {
    territory_id: 'ST-0001', territory_name: 'Sangkulirang FMC ST', plant_id: 'PLT-0003', work_center_id: 'WC-0002',
    is_active: true, address: 'Sangkulirang Mining Zone, Kalimantan Timur', operating_hours_id: 'Standard 24/7 Mining Ops',
    parent_territory_id: 'ST-0003', top_level_territory: 'Kalimantan Timur Hub', travel_mode: 'Driving',
    avg_travel_time_minutes: 45, typical_in_territory_travel: 20,
    description: 'Sangkulirang FMC (Facility Management Center) Service Territory covering primary mining extraction zones and associated heavy equipment maintenance facilities.',
    created_by: 'System Admin', created_date: '2023-01-15', modified_date: '2023-10-24',
  },
  {
    territory_id: 'ST-0002', territory_name: 'Padang ST', plant_id: 'PLT-0001', work_center_id: 'WC-0001',
    is_active: true, address: 'Jl. By Pass KM 12, Padang', operating_hours_id: 'Standard Business Hours',
    parent_territory_id: '', top_level_territory: 'Padang ST', travel_mode: 'Motorcycle',
    avg_travel_time_minutes: 30, typical_in_territory_travel: 15,
    description: 'West Sumatera regular field service territory.',
    created_by: 'Admin User', created_date: '2023-10-24', modified_date: '2023-11-02',
  },
  {
    territory_id: 'ST-0003', territory_name: 'Kalimantan Timur Hub', plant_id: 'PLT-0002', work_center_id: 'WC-0003',
    is_active: true, address: 'Jl. Soekarno Hatta KM 8, Balikpapan', operating_hours_id: 'Standard 24/7 Mining Ops',
    parent_territory_id: '', top_level_territory: 'Kalimantan Timur Hub', travel_mode: 'Driving',
    avg_travel_time_minutes: 60, typical_in_territory_travel: 35,
    description: 'Top-level East Kalimantan territory hub.',
    created_by: 'System Admin', created_date: '2023-01-15', modified_date: '2023-10-20',
  },
];

// ── Service Territory Members (PRD M2 §5.2.2) ───────────────────────
export const TERRITORY_MEMBERS = [
  { member_id: 'TM-0001', member_number: 'MBR-0001', territory_id: 'ST-0001', mechanic_id: 'SR-01', mechanic_name: 'Bambang Suraji',  territory_type: 'Primary',   role: 'Technician', start_date: '2023-01-15', end_date: '' },
  { member_id: 'TM-0002', member_number: 'MBR-0002', territory_id: 'ST-0001', mechanic_id: 'SR-02', mechanic_name: 'Arrochman',       territory_type: 'Primary',   role: 'Technician', start_date: '2023-01-15', end_date: '' },
  { member_id: 'TM-0003', member_number: 'MBR-0003', territory_id: 'ST-0001', mechanic_id: 'SR-03', mechanic_name: 'Ade Saputra',     territory_type: 'Secondary', role: 'Support',    start_date: '2023-02-01', end_date: '' },
  { member_id: 'TM-0004', member_number: 'MBR-0004', territory_id: 'ST-0001', mechanic_id: 'SR-04', mechanic_name: 'Sholeh Setiawan', territory_type: 'Secondary', role: 'Support',    start_date: '2023-02-01', end_date: '' },
  { member_id: 'TM-0005', member_number: 'MBR-0005', territory_id: 'ST-0001', mechanic_id: 'SR-05', mechanic_name: 'Edi Prayitno',    territory_type: 'Secondary', role: 'Specialist', start_date: '2023-03-01', end_date: '' },
  { member_id: 'TM-0006', member_number: 'MBR-0006', territory_id: 'ST-0001', mechanic_id: 'SR-06', mechanic_name: 'Supriyadi',       territory_type: 'Secondary', role: 'Technician', start_date: '2023-03-01', end_date: '' },
  { member_id: 'TM-0007', member_number: 'MBR-0007', territory_id: 'ST-0002', mechanic_id: 'SR-04', mechanic_name: 'Rudi Hartono',    territory_type: 'Primary',   role: 'Technician', start_date: '2023-10-24', end_date: '' },
  { member_id: 'TM-0008', member_number: 'MBR-0008', territory_id: 'ST-0003', mechanic_id: 'SR-03', mechanic_name: 'Sarah Jenkins',   territory_type: 'Primary',   role: 'Lead',       start_date: '2023-01-15', end_date: '' },
];

// ── Cross-reference helpers ─────────────────────────────────────────
export function plantById(id)       { return PLANTS.find(p => p.plant_id === id) || null; }
export function workCenterById(id)  { return WORK_CENTERS.find(w => w.wc_id === id) || null; }
export function territoryById(id)    { return TERRITORIES.find(t => t.territory_id === id) || null; }

export function workCentersForPlant(plantId)  { return WORK_CENTERS.filter(w => w.plant_id === plantId); }
export function territoriesForPlant(plantId)  { return TERRITORIES.filter(t => t.plant_id === plantId); }
export function territoriesForWorkCenter(wcId){ return TERRITORIES.filter(t => t.work_center_id === wcId); }
export function membersForTerritory(tId)      { return TERRITORY_MEMBERS.filter(m => m.territory_id === tId); }

export function siteTypeLabel(code) { return (SITE_TYPES.find(s => s.code === code) || {}).label || code; }
export function wcTypeLabel(code)   { return (WORK_CENTER_TYPES.find(s => s.code === code) || {}).label || code; }

// ── Formatting ──────────────────────────────────────────────────────
export function formatSADate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
}

export function formatPlainDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatCurrencyIDR(value) {
  if (value === '' || value == null) return '—';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}
