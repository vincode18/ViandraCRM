# Supabase Database Schema
## UT Service Console — PostgreSQL Backend

### Tables Overview

#### `emr` — Equipment Maintenance Reports
```sql
CREATE TABLE emr (
  id TEXT PRIMARY KEY,
  type CHAR(1) NOT NULL, -- 'U' = Unscheduled, 'S' = Scheduled
  status VARCHAR(50) NOT NULL,
  subject TEXT NOT NULL,
  owner TEXT,
  account TEXT,
  asset TEXT,
  work_order TEXT,
  case_id TEXT,
  machine_model TEXT,
  serial_number TEXT,
  hours_on_component INTEGER,
  smr_trouble INTEGER,
  smr_rfu INTEGER,
  lead_time_hours DECIMAL,
  flag_azure BOOLEAN DEFAULT FALSE,
  part_supply BOOLEAN DEFAULT FALSE,
  submit_to_claim BOOLEAN DEFAULT FALSE,
  need_support_ho BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by TEXT,
  last_modified_by TEXT
);
```

#### `emr_additional_groups` — EMR Document Groups
```sql
CREATE TABLE emr_additional_groups (
  id TEXT PRIMARY KEY,
  emr_id TEXT NOT NULL REFERENCES emr(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  group_type VARCHAR(20), -- 'Desktop' or 'FSL'
  order_number TEXT,
  has_revise BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `emila_photos` — EMILA Structured Photos
```sql
CREATE TABLE emila_photos (
  id TEXT PRIMARY KEY,
  emr_id TEXT NOT NULL REFERENCES emr(id) ON DELETE CASCADE,
  category CHAR(1) NOT NULL, -- 'E', 'M', 'I', 'L', 'A'
  description TEXT,
  file_path TEXT,
  file_url TEXT,
  order_number INTEGER,
  group_type VARCHAR(20), -- 'Desktop' or 'FSL'
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `emr_history` — EMR Audit Trail
```sql
CREATE TABLE emr_history (
  id TEXT PRIMARY KEY,
  emr_id TEXT NOT NULL REFERENCES emr(id) ON DELETE CASCADE,
  field VARCHAR(100),
  old_value TEXT,
  new_value TEXT,
  changed_by TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

#### `timesheet` — Time Sheet Records
```sql
CREATE TABLE timesheet (
  id TEXT PRIMARY KEY,
  work_order_id TEXT NOT NULL,
  task_list_code_id TEXT,
  service_resource TEXT,
  service_territory TEXT,
  start_date DATE,
  end_date DATE,
  status VARCHAR(50), -- 'Draft', 'Submitted', 'Approved', 'Rejected'
  total_duration DECIMAL,
  entry_count INTEGER,
  submitted_at TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by TEXT,
  rejected_at TIMESTAMP,
  rejected_by TEXT,
  rejection_reason TEXT,
  posted_to_sap BOOLEAN DEFAULT FALSE,
  posted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by TEXT,
  last_modified_by TEXT
);
```

#### `timesheet_entry` — Individual Timesheet Entries
```sql
CREATE TABLE timesheet_entry (
  id TEXT PRIMARY KEY,
  timesheet_id TEXT NOT NULL REFERENCES timesheet(id) ON DELETE CASCADE,
  work_order_id TEXT,
  operation_number VARCHAR(10),
  subject TEXT,
  actual_duration DECIMAL,
  planned_duration DECIMAL,
  status VARCHAR(50), -- 'Draft', 'Submitted', 'Approved', 'Rejected'
  sent_to_sap BOOLEAN DEFAULT FALSE,
  remarks TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `task_list_item` — Work Order Task List Items
```sql
CREATE TABLE task_list_item (
  id TEXT PRIMARY KEY,
  work_order_id TEXT NOT NULL,
  task_list_code_id TEXT,
  operation_number VARCHAR(10),
  description TEXT,
  duration DECIMAL,
  uom VARCHAR(5), -- 'H' for hours
  status VARCHAR(50), -- 'Not Started', 'In Progress', 'Completed'
  is_sap_override BOOLEAN DEFAULT FALSE,
  start_time TIMESTAMP,
  complete_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `work_order` — Work Orders
```sql
CREATE TABLE work_order (
  id TEXT PRIMARY KEY,
  work_order_number TEXT UNIQUE,
  status VARCHAR(50),
  priority VARCHAR(20),
  subject TEXT,
  case_id TEXT,
  account_id TEXT,
  asset_id TEXT,
  plant_id TEXT,
  work_center_id TEXT,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by TEXT,
  last_modified_by TEXT
);
```

### Row-Level Security (RLS) Policies

All tables should have RLS enabled with policies:

```sql
-- Example RLS policy for EMR table
ALTER TABLE emr ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view EMRs in their organization"
  ON emr FOR SELECT
  USING (auth.jwt() ->> 'org_id' = organization_id);

CREATE POLICY "Admins can update any EMR"
  ON emr FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can update their own EMRs"
  ON emr FOR UPDATE
  USING (auth.jwt() ->> 'user_id' = created_by);
```

### Indexes for Performance

```sql
-- EMR indexes
CREATE INDEX idx_emr_status ON emr(status);
CREATE INDEX idx_emr_work_order ON emr(work_order);
CREATE INDEX idx_emr_created_at ON emr(created_at DESC);

-- Timesheet indexes
CREATE INDEX idx_timesheet_status ON timesheet(status);
CREATE INDEX idx_timesheet_work_order ON timesheet(work_order_id);
CREATE INDEX idx_timesheet_created_at ON timesheet(created_at DESC);

-- Task list indexes
CREATE INDEX idx_task_list_work_order ON task_list_item(work_order_id);
CREATE INDEX idx_task_list_status ON task_list_item(status);
```

### Real-time Subscriptions

Tables with real-time enabled:
- `emr` — for live EMR status updates
- `timesheet` — for approval queue updates
- `task_list_item` — for task progress tracking

### Storage Buckets

- `emr-photos` — EMILA photo uploads
  - Path: `{emr_id}/{category}/{timestamp}-{filename}`
  - Public access for authenticated users

### Edge Functions

- `post-timesheet-sap` — Posts approved timesheets to SAP
  - Triggered by timesheet approval
  - Handles SAP integration and error logging

### Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Migration Steps

1. Create all tables in Supabase PostgreSQL
2. Enable RLS on all tables
3. Create RLS policies for organization isolation
4. Create indexes for performance
5. Enable real-time on required tables
6. Create storage bucket for EMR photos
7. Deploy Edge Functions for SAP integration
8. Test with frontend using mock data fallback
