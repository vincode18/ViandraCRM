-- ── Supabase Seed Data for Viandra CRM ──────────────────────────────────────
-- Run this in Supabase SQL Editor AFTER running supabase_schema.sql

-- Step 1: Accounts
INSERT INTO accounts (account_name, tier) VALUES 
  ('PUTRA PERKASA ABADI', 'Tier 1 Enterprise'),
  ('PT. JAYA ABADI', 'Tier 2'),
  ('CV. MITRA TAMBANG', 'Tier 3')
ON CONFLICT DO NOTHING;

-- Step 2: Contacts
INSERT INTO contacts (account_id, name, phone, email) VALUES
  ((SELECT id FROM accounts WHERE account_name = 'PUTRA PERKASA ABADI'), 'Andi Wijaya', '+62-811-111-2222', 'andi@putraabadi.co.id'),
  ((SELECT id FROM accounts WHERE account_name = 'PT. JAYA ABADI'), 'Budi Santoso', '+62-812-333-4444', 'budi@jayaabadi.co.id'),
  ((SELECT id FROM accounts WHERE account_name = 'CV. MITRA TAMBANG'), 'Cahya Nugraha', '+62-813-555-6666', 'cahya@mitratambang.co.id')
ON CONFLICT DO NOTHING;

-- Step 3: Assets
INSERT INTO assets (asset_id, model, location) VALUES
  ('EQ-HT-9942', 'Komatsu D85ESS-2', 'Site B - Pit 4'),
  ('EQ-PC-1101', 'Komatsu PC200-8M0', 'Site A - Loading'),
  ('EQ-WA-3302', 'Komatsu WA470-8', 'Hauling Road - Block C')
ON CONFLICT DO NOTHING;

-- Step 4: Cases
INSERT INTO cases (
  case_number, subject, description, priority, status,
  progress_steps, current_step, case_parameter,
  account_id, contact_id, asset_id,
  owner, created_by, last_updated_by,
  created_date, last_updated_date,
  start_date, target_date,
  sla_status, sla_days_overdue, sla_compliance,
  start_date_sla, target_date_sla
) VALUES
(
  'CASE-20260526-00101',
  'Hydraulic Leak on Right Cylinder',
  'Operator reported significant hydraulic fluid leak near the right cylinder during morning inspection. Machine grounded pending repair. Suspect blown seal or damaged hose fitting. Requires immediate inspection and replacement parts.',
  'Medium', 'Closed',
  '["Open","Assigned","In Progress","Resolved","Closed"]', 4, 5,
  (SELECT id FROM accounts WHERE account_name = 'PUTRA PERKASA ABADI'),
  (SELECT id FROM contacts WHERE name = 'Andi Wijaya'),
  (SELECT id FROM assets WHERE asset_id = 'EQ-HT-9942'),
  'System User', 'System User', 'System User',
  '2026-05-26 07:31:00', '2026-10-26 14:30:00',
  '2026-05-26 07:31:00', '2026-06-02 07:31:00',
  'Breached', 17, 0,
  '2026-05-26 07:31:00', '2026-06-02 07:31:00'
),
(
  'CASE-20260525-00100',
  'Engine Overheating at High Load',
  'Unit reported sudden temperature spike during peak operation hours. Operator shut down unit immediately. Coolant level normal, suspect radiator blockage or faulty thermostat. Awaiting inspection by mechanic.',
  'High', 'In Progress',
  '["Open","Assigned","In Progress","Resolved","Closed"]', 2, 3,
  (SELECT id FROM accounts WHERE account_name = 'PT. JAYA ABADI'),
  (SELECT id FROM contacts WHERE name = 'Budi Santoso'),
  (SELECT id FROM assets WHERE asset_id = 'EQ-PC-1101'),
  'John Doe', 'System User', 'John Doe',
  '2026-05-25 09:00:00', '2026-05-29 11:00:00',
  '2026-05-25 09:00:00', '2026-06-01 09:00:00',
  'On Track', 0, 85,
  '2026-05-25 09:00:00', '2026-06-01 09:00:00'
),
(
  'CASE-20260524-00099',
  'Transmission Slipping - 3rd Gear',
  'Operator noted gear slippage when shifting to 3rd during uphill operation. No error codes displayed. Requires diagnostic inspection of torque converter and transmission fluid check.',
  'Low', 'Open',
  '["Open","Assigned","In Progress","Resolved","Closed"]', 0, 1,
  (SELECT id FROM accounts WHERE account_name = 'CV. MITRA TAMBANG'),
  (SELECT id FROM contacts WHERE name = 'Cahya Nugraha'),
  (SELECT id FROM assets WHERE asset_id = 'EQ-WA-3302'),
  'System User', 'System User', 'System User',
  '2026-05-24 08:00:00', '2026-05-29 08:00:00',
  '2026-05-24 08:00:00', '2026-05-31 08:00:00',
  'On Track', 0, 100,
  '2026-05-24 08:00:00', '2026-05-31 08:00:00'
)
ON CONFLICT (case_number) DO NOTHING;

-- Step 5: Audit Log entries for CASE-20260526-00101
INSERT INTO audit_log (case_number, log_timestamp, log_date, log_time, user_name, field, entry_type, old_value, new_value, note) VALUES
  ('CASE-20260526-00101', '2026-10-26 14:30:00', '26/10/2026', '14:30', 'System User', 'Status', 'field-update', 'Resolved', 'Closed', '2026-10-26T14:30:00.000Z - Status: Resolved → Closed (Parameter updated: 5)'),
  ('CASE-20260526-00101', '2026-06-02 10:00:00', '02/06/2026', '10:00', 'System User', 'Status', 'field-update', 'In Progress', 'Resolved', '2026-06-02T10:00:00.000Z - Status: In Progress → Resolved (Parameter updated: 4)'),
  ('CASE-20260526-00101', '2026-05-28 09:00:00', '28/05/2026', '09:00', 'John Doe',    'Status', 'field-update', 'Assigned',   'In Progress', '2026-05-28T09:00:00.000Z - Status: Assigned → In Progress (Parameter updated: 3)'),
  ('CASE-20260526-00101', '2026-05-27 08:00:00', '27/05/2026', '08:00', 'System User', 'Status', 'field-update', 'Open',       'Assigned',    '2026-05-27T08:00:00.000Z - Status: Open → Assigned (Parameter updated: 2)')
ON CONFLICT DO NOTHING;
