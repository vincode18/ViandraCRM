-- ── Supabase Database Schema for Viandra CRM ───────────────────────────────
-- Run this in Supabase SQL Editor to create the required tables

-- ── Accounts Table ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_name VARCHAR(255) NOT NULL,
  tier VARCHAR(50) DEFAULT 'Tier 3',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Contacts Table ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Assets Table ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id VARCHAR(100) UNIQUE NOT NULL,
  model VARCHAR(255),
  location VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Cases Table ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number VARCHAR(100) UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  priority VARCHAR(50) DEFAULT 'Medium',
  status VARCHAR(50) DEFAULT 'Open',
  progress_steps JSONB DEFAULT '["Open", "Assigned", "In Progress", "Resolved", "Closed"]',
  current_step INTEGER DEFAULT 0,
  case_parameter INTEGER DEFAULT 1,
  
  -- Foreign Keys
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
  
  -- Owner Info
  owner VARCHAR(255),
  created_by VARCHAR(255),
  last_updated_by VARCHAR(255),
  
  -- Dates
  created_date TIMESTAMPTZ DEFAULT NOW(),
  last_updated_date TIMESTAMPTZ DEFAULT NOW(),
  start_date TIMESTAMPTZ,
  target_date TIMESTAMPTZ,
  
  -- SLA Tracking
  sla_status VARCHAR(50) DEFAULT 'On Track',
  sla_days_overdue INTEGER DEFAULT 0,
  sla_compliance INTEGER DEFAULT 100,
  start_date_sla TIMESTAMPTZ,
  target_date_sla TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Audit Log Table ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number VARCHAR(100) REFERENCES cases(case_number) ON DELETE CASCADE,
  log_timestamp TIMESTAMPTZ DEFAULT NOW(),
  log_date VARCHAR(50),
  log_time VARCHAR(50),
  user_name VARCHAR(255),
  field VARCHAR(100),
  entry_type VARCHAR(50),
  old_value TEXT,
  new_value TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Work Orders Table ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS work_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_number VARCHAR(100) UNIQUE NOT NULL,
  case_number VARCHAR(100) REFERENCES cases(case_number) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  description TEXT,
  priority VARCHAR(50) DEFAULT 'Medium',
  status VARCHAR(50) DEFAULT 'Open',
  
  -- Owner Info
  assigned_to VARCHAR(255),
  created_by VARCHAR(255),
  
  -- Dates
  created_date TIMESTAMPTZ DEFAULT NOW(),
  last_updated_date TIMESTAMPTZ DEFAULT NOW(),
  target_date TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes for Performance ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_cases_case_number ON cases(case_number);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_account_id ON cases(account_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_case_number ON audit_log(case_number);
CREATE INDEX IF NOT EXISTS idx_work_orders_case_number ON work_orders(case_number);
CREATE INDEX IF NOT EXISTS idx_work_orders_status ON work_orders(status);

-- ── EMR (Equipment Maintenance Reports) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS emr (
  id VARCHAR(50) PRIMARY KEY,
  type CHAR(1) NOT NULL CHECK (type IN ('U', 'S')),
  status VARCHAR(50) NOT NULL DEFAULT 'Open',
  subject TEXT NOT NULL,
  owner VARCHAR(255),
  account VARCHAR(255),
  asset VARCHAR(255),
  work_order VARCHAR(100) REFERENCES work_orders(work_order_number) ON DELETE SET NULL,
  case_id VARCHAR(100) REFERENCES cases(case_number) ON DELETE SET NULL,
  machine_model VARCHAR(255),
  serial_number VARCHAR(100),
  hours_on_component INTEGER,
  smr_trouble INTEGER,
  smr_rfu INTEGER,
  lead_time_hours DECIMAL,
  flag_azure BOOLEAN DEFAULT FALSE,
  part_supply BOOLEAN DEFAULT FALSE,
  submit_to_claim BOOLEAN DEFAULT FALSE,
  need_support_ho BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by VARCHAR(255),
  last_modified_by VARCHAR(255)
);

-- ── EMR Additional Groups ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS emr_additional_groups (
  id VARCHAR(50) PRIMARY KEY,
  emr_id VARCHAR(50) NOT NULL REFERENCES emr(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  group_type VARCHAR(20),
  order_number VARCHAR(20),
  has_revise BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── EMILA Photos ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS emila_photos (
  id VARCHAR(50) PRIMARY KEY,
  emr_id VARCHAR(50) NOT NULL REFERENCES emr(id) ON DELETE CASCADE,
  category CHAR(1) NOT NULL CHECK (category IN ('E', 'M', 'I', 'L', 'A')),
  description TEXT,
  file_path TEXT,
  file_url TEXT,
  order_number INTEGER,
  group_type VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── EMR History (Audit Trail) ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS emr_history (
  id VARCHAR(50) PRIMARY KEY,
  emr_id VARCHAR(50) NOT NULL REFERENCES emr(id) ON DELETE CASCADE,
  field VARCHAR(100),
  old_value TEXT,
  new_value TEXT,
  changed_by VARCHAR(255),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ── Timesheet ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS timesheet (
  id VARCHAR(50) PRIMARY KEY,
  work_order_id VARCHAR(100) REFERENCES work_orders(work_order_number) ON DELETE SET NULL,
  task_list_code_id VARCHAR(50),
  service_resource VARCHAR(255),
  service_territory VARCHAR(255),
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'Draft',
  total_duration DECIMAL,
  entry_count INTEGER DEFAULT 0,
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  approved_by VARCHAR(255),
  rejected_at TIMESTAMPTZ,
  rejected_by VARCHAR(255),
  rejection_reason TEXT,
  posted_to_sap BOOLEAN DEFAULT FALSE,
  posted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by VARCHAR(255),
  last_modified_by VARCHAR(255)
);

-- ── Timesheet Entry ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS timesheet_entry (
  id VARCHAR(50) PRIMARY KEY,
  timesheet_id VARCHAR(50) NOT NULL REFERENCES timesheet(id) ON DELETE CASCADE,
  work_order_id VARCHAR(100),
  operation_number VARCHAR(10),
  subject TEXT,
  actual_duration DECIMAL,
  planned_duration DECIMAL,
  status VARCHAR(50) DEFAULT 'Draft',
  sent_to_sap BOOLEAN DEFAULT FALSE,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Task List Item ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS task_list_item (
  id VARCHAR(50) PRIMARY KEY,
  work_order_id VARCHAR(100) REFERENCES work_orders(work_order_number) ON DELETE SET NULL,
  task_list_code_id VARCHAR(50),
  operation_number VARCHAR(10),
  description TEXT,
  duration DECIMAL,
  uom VARCHAR(5) DEFAULT 'H',
  status VARCHAR(50) DEFAULT 'Not Started',
  is_sap_override BOOLEAN DEFAULT FALSE,
  start_time TIMESTAMPTZ,
  complete_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Additional Indexes ─────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_emr_status ON emr(status);
CREATE INDEX IF NOT EXISTS idx_emr_work_order ON emr(work_order);
CREATE INDEX IF NOT EXISTS idx_emr_created_at ON emr(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_timesheet_status ON timesheet(status);
CREATE INDEX IF NOT EXISTS idx_timesheet_work_order ON timesheet(work_order_id);
CREATE INDEX IF NOT EXISTS idx_timesheet_created_at ON timesheet(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_task_list_work_order ON task_list_item(work_order_id);
CREATE INDEX IF NOT EXISTS idx_task_list_status ON task_list_item(status);

-- ── Enable Real-time Subscriptions ────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE emr;
ALTER PUBLICATION supabase_realtime ADD TABLE timesheet;
ALTER PUBLICATION supabase_realtime ADD TABLE task_list_item;

-- ── Enable Row Level Security (Optional - for fine-grained access control) ──
-- ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE emr ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE timesheet ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE task_list_item ENABLE ROW LEVEL SECURITY;

-- ── Insert Sample Data (Optional - for testing) ───────────────────────────
-- Uncomment the INSERT statements below to add sample data

-- INSERT INTO accounts (account_name, tier) VALUES 
--   ('PUTRA PERKASA ABADI', 'Tier 1 Enterprise'),
--   ('PT. JAYA ABADI', 'Tier 2');

-- INSERT INTO contacts (account_id, name, phone, email) VALUES
--   ((SELECT id FROM accounts WHERE account_name = 'PUTRA PERKASA ABADI' LIMIT 1), 'Andi Wijaya', '+62-811-111-2222', 'andi@putraabadi.co.id');

-- INSERT INTO assets (asset_id, model, location) VALUES
--   ('EQ-HT-9942', 'Komatsu D85ESS-2', 'Site B - Pit 4');

-- INSERT INTO cases (
--   case_number, subject, description, priority, status, 
--   account_id, contact_id, asset_id, owner,
--   start_date, target_date, sla_status, sla_days_overdue
-- ) VALUES
-- (
--   'CASE-20260526-00101',
--   'Hydraulic Leak on Right Cylinder',
--   'Operator reported significant hydraulic fluid leak near the right cylinder during morning inspection. Machine grounded pending repair. Suspect blown seal or damaged hose fitting. Requires immediate inspection and replacement parts.',
--   'Medium',
--   'Closed',
--   (SELECT id FROM accounts WHERE account_name = 'PUTRA PERKASA ABADI' LIMIT 1),
--   (SELECT id FROM contacts WHERE name = 'Andi Wijaya' LIMIT 1),
--   (SELECT id FROM assets WHERE asset_id = 'EQ-HT-9942' LIMIT 1),
--   'System User',
--   '2026-05-26 07:31:00',
--   '2026-06-02 07:31:00',
--   'Breached',
--   17
-- );
