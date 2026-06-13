/* ─────────────────────────────────────────────────────────────────────────
   Admin Settings — Field Access Control Mock Data Layer
   PRD: ADM-PRD-2607-001
   ───────────────────────────────────────────────────────────────────────── */

export const ROLES = ['Super Admin', 'Admin', 'Manager', 'User', 'Technician', 'Viewer'];

export const MODULES_LIST = [
  { key: 'case',                label: 'Case' },
  { key: 'work_order',          label: 'Work Order' },
  { key: 'service_appointment', label: 'Service Appointment' },
  { key: 'field_service',       label: 'Field Service' },
  { key: 'shift',               label: 'Shift' },
  { key: 'plant',               label: 'Plant' },
  { key: 'work_center',         label: 'Work Center' },
  { key: 'service_territory',   label: 'Service Territory' },
  { key: 'asset',               label: 'Asset' },
  { key: 'account',             label: 'Account' },
  { key: 'contact',             label: 'Contact' },
  { key: 'emr',                 label: 'EMR' },
  { key: 'timesheet',           label: 'Timesheet' },
];

export const MODULE_FIELDS = {
  case: [
    { name: 'subject',          label: 'Subject',           section: 'Customer Information' },
    { name: 'description',      label: 'Description',       section: 'Customer Information' },
    { name: 'status',           label: 'Status',            section: 'Customer Information' },
    { name: 'priority',         label: 'Priority',          section: 'Customer Information' },
    { name: 'case_type',        label: 'Case Type',         section: 'Customer Information' },
    { name: 'case_origin',      label: 'Case Origin',       section: 'Customer Information' },
    { name: 'account_id',       label: 'Account',           section: 'Customer Information' },
    { name: 'contact_id',       label: 'Contact',           section: 'Customer Information' },
    { name: 'asset_id',         label: 'Asset',             section: 'Customer Information' },
    { name: 'billing_amount',   label: 'Billing Amount',    section: 'Customer Information' },
    { name: 'sla_due_date',     label: 'SLA Due Date',      section: 'Customer Information' },
    { name: 'resolution_notes', label: 'Resolution Notes',  section: 'Customer Information' },
    { name: 'case_number',      label: 'Case Number',       section: 'System Information' },
    { name: 'created_at',       label: 'Created At',        section: 'System Information' },
    { name: 'updated_at',       label: 'Updated At',        section: 'System Information' },
    { name: 'owner_user_id',    label: 'Owner',             section: 'System Information' },
  ],
  work_order: [
    { name: 'subject',          label: 'Subject',           section: 'Work Order Details' },
    { name: 'description',      label: 'Description',       section: 'Work Order Details' },
    { name: 'status',           label: 'Status',            section: 'Work Order Details' },
    { name: 'priority',         label: 'Priority',          section: 'Work Order Details' },
    { name: 'wo_type',          label: 'WO Type',           section: 'Work Order Details' },
    { name: 'start_date',       label: 'Start Date',        section: 'Work Order Details' },
    { name: 'end_date',         label: 'End Date',          section: 'Work Order Details' },
    { name: 'account_id',       label: 'Account',           section: 'Work Order Details' },
    { name: 'asset_id',         label: 'Asset',             section: 'Work Order Details' },
    { name: 'plant_id',         label: 'Plant',             section: 'Work Order Details' },
    { name: 'work_number',      label: 'Work Order Number', section: 'System Information' },
    { name: 'owner_user_id',    label: 'Owner',             section: 'System Information' },
  ],
  shift: [
    { name: 'shift_date',       label: 'Shift Date',        section: 'Shift Details' },
    { name: 'start_time',       label: 'Start Time',        section: 'Shift Details' },
    { name: 'end_time',         label: 'End Time',          section: 'Shift Details' },
    { name: 'type',             label: 'Type',              section: 'Shift Details' },
    { name: 'status',           label: 'Status',            section: 'Shift Details' },
    { name: 'service_resource_id', label: 'Service Resource', section: 'Shift Details' },
    { name: 'color_hex',        label: 'Color',             section: 'Shift Details' },
    { name: 'notes',            label: 'Notes',             section: 'Shift Details' },
  ],
  emr: [
    { name: 'emr_name',         label: 'EMR Name',          section: 'EMR Core' },
    { name: 'status',           label: 'EMR Status',        section: 'EMR Core' },
    { name: 'owner',            label: 'Owner',             section: 'EMR Core' },
    { name: 'billing_amount',   label: 'Billing Amount',    section: 'EMR Core' },
    { name: 'hours_on_component', label: 'Hours on Component', section: 'EMR Core' },
    { name: 'smr_trouble',      label: 'SMR Trouble',       section: 'EMR Information' },
    { name: 'smr_rfu',          label: 'SMR RFU',           section: 'EMR Information' },
    { name: 'lead_time_hours',  label: 'Lead Time (Hours)', section: 'EMR Information' },
    { name: 'warranty_remarks', label: 'Warranty Remarks',  section: 'Customer Information' },
    { name: 'account',          label: 'Account',           section: 'Customer Information' },
    { name: 'submit_to_claim',  label: 'Submit to Claim',   section: 'Other Information' },
    { name: 'need_support_ho',  label: 'Need Support HO',   section: 'Other Information' },
  ],
  account: [
    { name: 'name',             label: 'Account Name',      section: 'Account Details' },
    { name: 'type',             label: 'Type',              section: 'Account Details' },
    { name: 'industry',         label: 'Industry',          section: 'Account Details' },
    { name: 'phone',            label: 'Phone',             section: 'Account Details' },
    { name: 'email',            label: 'Email',             section: 'Account Details' },
    { name: 'billing_amount',   label: 'Billing Amount',    section: 'Financial' },
    { name: 'status',           label: 'Status',            section: 'Account Details' },
  ],
  contact: [
    { name: 'first_name',       label: 'First Name',        section: 'Contact Details' },
    { name: 'last_name',        label: 'Last Name',         section: 'Contact Details' },
    { name: 'email',            label: 'Email',             section: 'Contact Details' },
    { name: 'phone',            label: 'Phone',             section: 'Contact Details' },
    { name: 'role',             label: 'Role',              section: 'Contact Details' },
    { name: 'portal_access_level', label: 'Portal Access Level', section: 'Portal Access' },
    { name: 'is_portal_user',   label: 'Is Portal User',    section: 'Portal Access' },
  ],
};

/* ── Default Role Access Settings ──────────────────────────────────────── */
const EDIT = 'edit', VIEW = 'view', HIDDEN = 'hidden';

export const DEFAULT_ROLE_ACCESS = {
  Manager: {
    case: {
      subject: EDIT, description: EDIT, status: EDIT, priority: EDIT,
      case_type: EDIT, case_origin: EDIT, account_id: EDIT, contact_id: EDIT,
      asset_id: EDIT, billing_amount: VIEW, sla_due_date: VIEW, resolution_notes: EDIT,
      case_number: VIEW, created_at: VIEW, updated_at: VIEW, owner_user_id: EDIT,
    },
    work_order: {
      subject: EDIT, description: EDIT, status: EDIT, priority: EDIT,
      wo_type: EDIT, start_date: EDIT, end_date: EDIT, account_id: VIEW,
      asset_id: VIEW, plant_id: VIEW, work_number: VIEW, owner_user_id: EDIT,
    },
  },
  User: {
    case: {
      subject: EDIT, description: EDIT, status: VIEW, priority: VIEW,
      case_type: VIEW, case_origin: VIEW, account_id: VIEW, contact_id: EDIT,
      asset_id: VIEW, billing_amount: HIDDEN, sla_due_date: VIEW, resolution_notes: EDIT,
      case_number: VIEW, created_at: VIEW, updated_at: VIEW, owner_user_id: VIEW,
    },
  },
  Technician: {
    case: {
      subject: EDIT, description: EDIT, status: VIEW, priority: VIEW,
      case_type: VIEW, case_origin: VIEW, account_id: VIEW, contact_id: EDIT,
      asset_id: VIEW, billing_amount: HIDDEN, sla_due_date: HIDDEN, resolution_notes: EDIT,
      case_number: VIEW, created_at: VIEW, updated_at: VIEW, owner_user_id: VIEW,
    },
    emr: {
      emr_name: VIEW, status: VIEW, owner: VIEW, billing_amount: HIDDEN,
      hours_on_component: EDIT, smr_trouble: EDIT, smr_rfu: EDIT,
      lead_time_hours: VIEW, warranty_remarks: VIEW, account: VIEW,
      submit_to_claim: HIDDEN, need_support_ho: EDIT,
    },
  },
  Viewer: {
    case: {
      subject: VIEW, description: VIEW, status: VIEW, priority: VIEW,
      case_type: VIEW, case_origin: VIEW, account_id: VIEW, contact_id: VIEW,
      asset_id: VIEW, billing_amount: HIDDEN, sla_due_date: VIEW, resolution_notes: HIDDEN,
      case_number: VIEW, created_at: VIEW, updated_at: VIEW, owner_user_id: VIEW,
    },
  },
};

/* ── Mock per-contact overrides ─────────────────────────────────────────── */
export const MOCK_CONTACT_OVERRIDES = {
  'CON-00001': {
    case: {
      priority: EDIT,
      billing_amount: VIEW,
      resolution_notes: HIDDEN,
    },
  },
};

/* ── Sample Users for Admin Panel ──────────────────────────────────────── */
export const ADMIN_USERS = [
  { id: 'USR-001', displayName: 'Noviandra Sallasa',   email: 'noviandra@ut.co.id',    role: 'Admin',       contactId: 'CON-00001', isActive: true,  lastLogin: 'Today, 08:34',      memberSince: '2024-01-15' },
  { id: 'USR-002', displayName: 'Mohammad Ficri Kaban',email: 'ficri@ut.co.id',         role: 'Technician',  contactId: 'CON-00002', isActive: true,  lastLogin: 'Today, 07:50',      memberSince: '2024-03-01' },
  { id: 'USR-003', displayName: 'Budi Santoso',        email: 'budi@ut.co.id',          role: 'Technician',  contactId: 'CON-00003', isActive: true,  lastLogin: '2 days ago',        memberSince: '2024-02-12' },
  { id: 'USR-004', displayName: 'Rudi Hartono',        email: 'rudi@ut.co.id',          role: 'Manager',     contactId: 'CON-00004', isActive: true,  lastLogin: 'Yesterday, 16:20',  memberSince: '2023-11-05' },
  { id: 'USR-005', displayName: 'Sari Wulandari',      email: 'sari@ut.co.id',          role: 'User',        contactId: 'CON-00005', isActive: true,  lastLogin: 'Today, 09:10',      memberSince: '2024-05-20' },
  { id: 'USR-006', displayName: 'Ari Wibowo',          email: 'ari@ut.co.id',           role: 'Technician',  contactId: 'CON-00006', isActive: false, lastLogin: '7 days ago',        memberSince: '2023-08-15' },
];

export function getEffectivePermissions(role, module) {
  const defaults = DEFAULT_ROLE_ACCESS[role]?.[module] || {};
  const fields = MODULE_FIELDS[module] || [];
  return fields.reduce((acc, f) => {
    acc[f.name] = defaults[f.name] || EDIT;
    return acc;
  }, {});
}
