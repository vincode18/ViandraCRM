/**
 * Asset Management module shared data + helpers
 * ------------------------------------------------------------------
 * Implements the schema & UI model from:
 *   - FRD-Asset-Management.md            (Asset + Asset Relationship objects)
 *   - DESIGN-Asset-Management-Panel.md   (List / Detail / Hierarchy / widgets)
 *
 * Unit Field / Fleet Management context: an Asset represents a vehicle or
 * unit in the fleet. Provides mock records, hierarchy + relationship graphs,
 * status lifecycle, and related lists (Cases / Work Orders / SAs / History).
 *
 * No backend Asset endpoints exist yet, so this acts as the single source of
 * truth consumed by the Asset pages and cross-linked from Work Order / Case.
 */

// ── Status lifecycle (FRD §8) ───────────────────────────────────────
export const ASSET_STATUSES = ['Purchased', 'Shipped', 'Installed', 'Registered', 'Obsolete'];

/** Status badge tokens (DESIGN §1.2) — light/dark aware via CSS prefers? we inline both. */
export const ASSET_STATUS_TOKENS = {
  Purchased:  { lightBg: '#e8f0fe', lightText: '#1967d2', darkBg: '#1a2a4a', darkText: '#8ab4f8' },
  Shipped:    { lightBg: '#fef3e2', lightText: '#b06000', darkBg: '#3a2200', darkText: '#ffa040' },
  Installed:  { lightBg: '#e6f4ea', lightText: '#137333', darkBg: '#0d2e1a', darkText: '#4caf6e' },
  Registered: { lightBg: '#f3e8fd', lightText: '#7b1fa2', darkBg: '#2a1040', darkText: '#c58af9' },
  Obsolete:   { lightBg: '#f1f3f4', lightText: '#5f6368', darkBg: '#2e3030', darkText: '#9aa0a6' },
};

export const RELATIONSHIP_TYPES = ['Replacement', 'Upgrade', 'Crossgrade'];
export const PRODUCT_FAMILIES = ['Heavy Trucks', 'Excavators', 'Compressors', 'IT Equipment', 'Generators'];

// Asset type icon hint (DESIGN §3.3): local_shipping / settings / computer / build
export const ASSET_ICON_MAP = {
  vehicle: 'truck',
  equipment: 'settings',
  it: 'computer',
  tool: 'tool',
};

// ── Accounts (fleet owners) ─────────────────────────────────────────
export const ASSET_ACCOUNTS = [
  { id: 'ACC-01', name: 'Northern Region Fleet', industry: 'Transport', phone: '+62 555 000 0001', owner: 'Jane Carter', since: '2021-03-12', sla: 'Gold' },
  { id: 'ACC-02', name: 'Central Workshop',       industry: 'Maintenance', phone: '+62 555 000 0002', owner: 'Budi Santoso', since: '2022-06-01', sla: 'Silver' },
  { id: 'ACC-03', name: 'Eastern Fleet Account',  industry: 'Mining', phone: '+62 555 000 0003', owner: 'Sarah Jenkins', since: '2020-11-20', sla: 'Gold' },
  { id: 'ACC-INT', name: 'Internal Assets',       industry: 'Internal', phone: '—', owner: 'System Admin', since: '2023-01-01', sla: 'Bronze' },
];

// ── Products ────────────────────────────────────────────────────────
export const ASSET_PRODUCTS = [
  { id: 'PRD-01', name: 'Komatsu HD785 Dump Truck', code: 'HD785', family: 'Heavy Trucks', sku: 'KMT-HD785-7', description: '91-tonne class rigid dump truck for high-production mining haulage.' },
  { id: 'PRD-02', name: 'Caterpillar 390F Excavator', code: 'CAT390F', family: 'Excavators', sku: 'CAT-390F-1', description: 'Large hydraulic excavator optimized for heavy-duty digging and loading.' },
  { id: 'PRD-03', name: 'Atlas Copco GA160 Compressor', code: 'GA160', family: 'Compressors', sku: 'ATC-GA160', description: 'Oil-injected rotary screw air compressor, 160 kW.' },
  { id: 'PRD-04', name: 'Trimble GPS Telemetry Unit', code: 'TRM-GPS44', family: 'IT Equipment', sku: 'TRM-GPS-4421', description: 'Vehicle GPS + telemetry tracking module.' },
  { id: 'PRD-05', name: 'Bosch Diagnostic Tablet', code: 'BSH-DT7', family: 'IT Equipment', sku: 'BSH-DT-7', description: 'Field diagnostic tool tablet for equipment servicing.' },
];

// ── Assets (FRD §4) ─────────────────────────────────────────────────
// Hierarchy: ROOT (L1) → unit (L2) → component (L3)
export const ASSETS = [
  {
    id: 'AST-00140', name: 'Truck Fleet - Northern Region', assetType: 'vehicle',
    accountId: 'ACC-01', contactId: '', ownerId: 'Jane Carter',
    productId: '', serialNumber: '', status: 'Installed',
    price: '', quantity: 12, purchaseDate: '2022-01-10', installDate: '2022-02-01', usageEndDate: '2030-02-01',
    location: 'Northern Depot, Kalimantan Timur', description: 'Root grouping asset for the Northern Region truck fleet.',
    parentId: '', isCompetitor: false, isInternal: false, manufacturerId: '', servicedById: 'ACC-02', division: 'Transport',
  },
  {
    id: 'AST-00142', name: 'Truck 01 - NR', assetType: 'vehicle',
    accountId: 'ACC-01', contactId: '', ownerId: 'Jane Carter',
    productId: 'PRD-01', serialNumber: 'VIN-8842-NR01', status: 'Installed',
    price: 4200000000, quantity: 1, purchaseDate: '2022-01-10', installDate: '2022-02-15', usageEndDate: '2026-06-20',
    location: 'Northern Depot — Bay 4', description: 'Primary haulage unit operating the north extraction route.',
    parentId: 'AST-00140', isCompetitor: false, isInternal: false, manufacturerId: 'ACC-03', servicedById: 'ACC-02', division: 'Transport',
  },
  {
    id: 'AST-00143', name: 'Truck 02 - NR', assetType: 'vehicle',
    accountId: 'ACC-01', contactId: '', ownerId: 'Jane Carter',
    productId: 'PRD-01', serialNumber: 'VIN-8843-NR02', status: 'Installed',
    price: 4200000000, quantity: 1, purchaseDate: '2022-01-10', installDate: '2022-02-18', usageEndDate: '2030-02-18',
    location: 'Northern Depot — Bay 5', description: 'Secondary haulage unit, north route.',
    parentId: 'AST-00140', isCompetitor: false, isInternal: false, manufacturerId: 'ACC-03', servicedById: 'ACC-02', division: 'Transport',
  },
  {
    id: 'AST-00144', name: 'Truck 03 - NR', assetType: 'vehicle',
    accountId: 'ACC-01', contactId: '', ownerId: 'Jane Carter',
    productId: 'PRD-01', serialNumber: 'VIN-8844-NR03', status: 'Shipped',
    price: 4350000000, quantity: 1, purchaseDate: '2026-01-05', installDate: '', usageEndDate: '',
    location: 'In transit — Surabaya Port', description: 'New haulage unit awaiting commissioning.',
    parentId: 'AST-00140', isCompetitor: false, isInternal: false, manufacturerId: 'ACC-03', servicedById: 'ACC-02', division: 'Transport',
  },
  {
    id: 'AST-00150', name: 'GPS Unit #4421', assetType: 'it',
    accountId: 'ACC-01', contactId: '', ownerId: 'Jane Carter',
    productId: 'PRD-04', serialNumber: 'GPS-4421', status: 'Registered',
    price: 18000000, quantity: 1, purchaseDate: '2022-02-01', installDate: '2022-02-20', usageEndDate: '2027-02-20',
    location: 'Installed — Truck 01 - NR', description: 'Telemetry tracking module fitted to Truck 01.',
    parentId: 'AST-00142', isCompetitor: false, isInternal: false, manufacturerId: '', servicedById: '', division: 'Transport',
  },
  {
    id: 'AST-00210', name: 'Compressor Unit A', assetType: 'equipment',
    accountId: 'ACC-02', contactId: '', ownerId: 'Budi Santoso',
    productId: 'PRD-03', serialNumber: 'GA160-A-001', status: 'Registered',
    price: 950000000, quantity: 1, purchaseDate: '2021-08-01', installDate: '2021-09-01', usageEndDate: '2029-09-01',
    location: 'Central Workshop — Plant Room', description: 'Primary shop air compressor.',
    parentId: '', isCompetitor: false, isInternal: false, manufacturerId: '', servicedById: 'ACC-02', division: 'Maintenance',
  },
  {
    id: 'AST-00211', name: 'Compressor Unit B', assetType: 'equipment',
    accountId: 'ACC-02', contactId: '', ownerId: 'Budi Santoso',
    productId: 'PRD-03', serialNumber: 'GA160-B-002', status: 'Obsolete',
    price: 880000000, quantity: 1, purchaseDate: '2016-05-01', installDate: '2016-06-01', usageEndDate: '2024-06-01',
    location: 'Central Workshop — Decommission Yard', description: 'Legacy compressor, decommissioned 2024.',
    parentId: '', isCompetitor: true, isInternal: false, manufacturerId: '', servicedById: 'ACC-02', division: 'Maintenance',
  },
  {
    id: 'AST-00305', name: 'Diagnostic Tool #7', assetType: 'tool',
    accountId: 'ACC-INT', contactId: '', ownerId: 'System Admin',
    productId: 'PRD-05', serialNumber: 'BSH-DT7-007', status: 'Installed',
    price: 42000000, quantity: 1, purchaseDate: '2023-03-01', installDate: '2023-03-05', usageEndDate: '2028-03-05',
    location: 'Field Service Van 2', description: 'Internal diagnostic tablet used by field technicians.',
    parentId: '', isCompetitor: false, isInternal: true, manufacturerId: '', servicedById: 'ACC-INT', division: 'Internal',
  },
];

// ── Asset Relationships (FRD §5) ────────────────────────────────────
export const ASSET_RELATIONSHIPS = [
  { id: 'ASR-0001', assetId: 'AST-00144', relatedAssetId: 'AST-00142', type: 'Replacement', fromDate: '2026-06-01', toDate: '' },
  { id: 'ASR-0002', assetId: 'AST-00210', relatedAssetId: 'AST-00211', type: 'Upgrade', fromDate: '2024-06-01', toDate: '2024-06-01' },
];

// ── Related lists per asset (DESIGN §5) ─────────────────────────────
export const ASSET_CASES = {
  'AST-00142': [
    { id: 'CS-10421', subject: 'Engine overheating', status: 'Open', date: '2026-05-14' },
    { id: 'CS-10187', subject: 'Brake inspection', status: 'Closed', date: '2026-04-02' },
    { id: 'CS-10044', subject: 'Coolant leak', status: 'Closed', date: '2026-02-19' },
  ],
  'AST-00210': [
    { id: 'CS-09980', subject: 'Pressure drop fault', status: 'In Progress', date: '2026-05-30' },
  ],
};

export const ASSET_WORKORDERS = {
  'AST-00142': [
    { id: 'WO-00891', subject: 'Quarterly maintenance', status: 'In Progress', due: '2026-06-10' },
    { id: 'WO-00762', subject: 'Oil change & filter', status: 'Completed', due: '2026-02-28' },
  ],
  'AST-00210': [
    { id: 'WO-00905', subject: 'Annual overhaul', status: 'Scheduled', due: '2026-07-01' },
  ],
};

export const ASSET_APPOINTMENTS = {
  'AST-00142': [
    { id: 'SA-00341', subject: 'Preventive Service', status: 'Scheduled', when: '2026-06-08T09:00' },
    { id: 'SA-00298', subject: 'Emergency call-out', status: 'Completed', when: '2026-05-01T13:00' },
  ],
};

export const ASSET_HISTORY = {
  'AST-00142': [
    { user: 'JC', action: 'Status changed', detail: 'Shipped → Installed', ts: '2026-06-06T14:32', group: 'Today' },
    { user: 'SA', action: 'Serial Number set', detail: '— → VIN-8842-NR01', ts: '2026-06-05T09:15', group: 'Yesterday' },
    { user: 'SYS', action: 'Asset created', detail: 'via import', ts: '2026-06-03T11:02', group: '03 Jun 2026' },
  ],
};

export const ASSET_FILES = {
  'AST-00142': [
    { name: 'Service_Manual.pdf', size: '2.4 MB', date: 'Jun 2025' },
    { name: 'Registration.pdf', size: '0.8 MB', date: 'Mar 2024' },
    { name: 'Inspection_2026.pdf', size: '1.1 MB', date: 'May 2026' },
    { name: 'Warranty.pdf', size: '0.3 MB', date: 'Jan 2022' },
  ],
};

// ── Lookups ─────────────────────────────────────────────────────────
export function assetById(id)        { return ASSETS.find(a => a.id === id) || null; }
export function accountById(id)      { return ASSET_ACCOUNTS.find(a => a.id === id) || null; }
export function productById(id)      { return ASSET_PRODUCTS.find(p => p.id === id) || null; }
export function childrenOf(id)       { return ASSETS.filter(a => a.parentId === id); }
export function casesForAsset(id)    { return ASSET_CASES[id] || []; }
export function workOrdersForAsset(id) { return ASSET_WORKORDERS[id] || []; }
export function appointmentsForAsset(id) { return ASSET_APPOINTMENTS[id] || []; }
export function historyForAsset(id)  { return ASSET_HISTORY[id] || []; }
export function filesForAsset(id)    { return ASSET_FILES[id] || []; }

// Relationships where this asset is the successor (Primary) / predecessor (Related)
export function primaryRelationships(id) { return ASSET_RELATIONSHIPS.filter(r => r.assetId === id); }
export function relatedRelationships(id) { return ASSET_RELATIONSHIPS.filter(r => r.relatedAssetId === id); }

// ── Hierarchy computation (FRD §6.3 / §6.4) ─────────────────────────
export function assetLevel(id) {
  let level = 1, cur = assetById(id);
  while (cur && cur.parentId) { level += 1; cur = assetById(cur.parentId); if (level > 20) break; }
  return level;
}

export function rootAsset(id) {
  let cur = assetById(id);
  if (!cur) return null;
  let guard = 0;
  while (cur.parentId && guard < 20) { const p = assetById(cur.parentId); if (!p) break; cur = p; guard += 1; }
  return cur;
}

/** Ancestor chain from root → this asset (inclusive), for the mini-tree. */
export function ancestorChain(id) {
  const chain = [];
  let cur = assetById(id);
  let guard = 0;
  while (cur && guard < 20) { chain.unshift(cur); cur = cur.parentId ? assetById(cur.parentId) : null; guard += 1; }
  return chain;
}

/** Returns descendant ids (for circular-reference exclusion in parent lookup). */
export function descendantIds(id) {
  const out = [];
  const walk = (pid) => childrenOf(pid).forEach(c => { out.push(c.id); walk(c.id); });
  walk(id);
  return out;
}

/** Build a nested tree rooted at the given asset id (for hierarchy view). */
export function buildTree(rootId) {
  const node = assetById(rootId);
  if (!node) return null;
  const build = (a) => ({ ...a, level: assetLevel(a.id), children: childrenOf(a.id).map(build) });
  return build(node);
}

// ── Formatting ──────────────────────────────────────────────────────
export function formatAssetDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatAssetDateTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
}

export function formatAssetCurrency(value) {
  if (value === '' || value == null) return '—';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

/** True if usage end date is within `days` of today (DESIGN §4.5 amber warning). */
export function isUsageEndingSoon(value, days = 30) {
  if (!value) return false;
  const d = new Date(value).getTime();
  if (Number.isNaN(d)) return false;
  const diff = (d - Date.now()) / 86400000;
  return diff >= 0 && diff <= days;
}

export function isOverdue(value) {
  if (!value) return false;
  const d = new Date(value).getTime();
  return !Number.isNaN(d) && d < Date.now();
}
