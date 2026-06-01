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

-- ── Enable Row Level Security (Optional - for fine-grained access control) ──
-- ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;

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
