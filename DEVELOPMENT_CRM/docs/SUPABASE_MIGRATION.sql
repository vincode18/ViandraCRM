-- ============================================================================
-- UT Service Console — Supabase PostgreSQL Migration
-- Run this in Supabase SQL Editor to create all tables and RLS policies
-- ============================================================================

-- ============================================================================
-- 1. CREATE TABLES
-- ============================================================================

-- EMR (Equipment Maintenance Reports)
CREATE TABLE IF NOT EXISTS public.emr (
  id TEXT PRIMARY KEY,
  type CHAR(1) NOT NULL CHECK (type IN ('U', 'S')), -- 'U' = Unscheduled, 'S' = Scheduled
  status VARCHAR(50) NOT NULL DEFAULT 'Open',
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
  organization_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT,
  last_modified_by TEXT
);

-- EMR Additional Groups
CREATE TABLE IF NOT EXISTS public.emr_additional_groups (
  id TEXT PRIMARY KEY,
  emr_id TEXT NOT NULL REFERENCES public.emr(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  group_type VARCHAR(20), -- 'Desktop' or 'FSL'
  order_number TEXT,
  has_revise BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- EMILA Photos
CREATE TABLE IF NOT EXISTS public.emila_photos (
  id TEXT PRIMARY KEY,
  emr_id TEXT NOT NULL REFERENCES public.emr(id) ON DELETE CASCADE,
  category CHAR(1) NOT NULL CHECK (category IN ('E', 'M', 'I', 'L', 'A')),
  description TEXT,
  file_path TEXT,
  file_url TEXT,
  order_number INTEGER,
  group_type VARCHAR(20), -- 'Desktop' or 'FSL'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- EMR History (Audit Trail)
CREATE TABLE IF NOT EXISTS public.emr_history (
  id TEXT PRIMARY KEY,
  emr_id TEXT NOT NULL REFERENCES public.emr(id) ON DELETE CASCADE,
  field VARCHAR(100),
  old_value TEXT,
  new_value TEXT,
  changed_by TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timesheet
CREATE TABLE IF NOT EXISTS public.timesheet (
  id TEXT PRIMARY KEY,
  work_order_id TEXT NOT NULL,
  task_list_code_id TEXT,
  service_resource TEXT,
  service_territory TEXT,
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'Draft', -- 'Draft', 'Submitted', 'Approved', 'Rejected'
  total_duration DECIMAL,
  entry_count INTEGER,
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by TEXT,
  rejected_at TIMESTAMP WITH TIME ZONE,
  rejected_by TEXT,
  rejection_reason TEXT,
  posted_to_sap BOOLEAN DEFAULT FALSE,
  posted_at TIMESTAMP WITH TIME ZONE,
  organization_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT,
  last_modified_by TEXT
);

-- Timesheet Entry
CREATE TABLE IF NOT EXISTS public.timesheet_entry (
  id TEXT PRIMARY KEY,
  timesheet_id TEXT NOT NULL REFERENCES public.timesheet(id) ON DELETE CASCADE,
  work_order_id TEXT,
  operation_number VARCHAR(10),
  subject TEXT,
  actual_duration DECIMAL,
  planned_duration DECIMAL,
  status VARCHAR(50) DEFAULT 'Draft', -- 'Draft', 'Submitted', 'Approved', 'Rejected'
  sent_to_sap BOOLEAN DEFAULT FALSE,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task List Item
CREATE TABLE IF NOT EXISTS public.task_list_item (
  id TEXT PRIMARY KEY,
  work_order_id TEXT NOT NULL,
  task_list_code_id TEXT,
  operation_number VARCHAR(10),
  description TEXT,
  duration DECIMAL,
  uom VARCHAR(5) DEFAULT 'H', -- 'H' for hours
  status VARCHAR(50) DEFAULT 'Not Started', -- 'Not Started', 'In Progress', 'Completed'
  is_sap_override BOOLEAN DEFAULT FALSE,
  start_time TIMESTAMP WITH TIME ZONE,
  complete_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Work Order
CREATE TABLE IF NOT EXISTS public.work_order (
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
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  organization_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT,
  last_modified_by TEXT
);

-- ============================================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- EMR indexes
CREATE INDEX IF NOT EXISTS idx_emr_status ON public.emr(status);
CREATE INDEX IF NOT EXISTS idx_emr_work_order ON public.emr(work_order);
CREATE INDEX IF NOT EXISTS idx_emr_created_at ON public.emr(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_emr_organization ON public.emr(organization_id);

-- Timesheet indexes
CREATE INDEX IF NOT EXISTS idx_timesheet_status ON public.timesheet(status);
CREATE INDEX IF NOT EXISTS idx_timesheet_work_order ON public.timesheet(work_order_id);
CREATE INDEX IF NOT EXISTS idx_timesheet_created_at ON public.timesheet(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_timesheet_organization ON public.timesheet(organization_id);

-- Task list indexes
CREATE INDEX IF NOT EXISTS idx_task_list_work_order ON public.task_list_item(work_order_id);
CREATE INDEX IF NOT EXISTS idx_task_list_status ON public.task_list_item(status);

-- Work order indexes
CREATE INDEX IF NOT EXISTS idx_work_order_status ON public.work_order(status);
CREATE INDEX IF NOT EXISTS idx_work_order_organization ON public.work_order(organization_id);

-- ============================================================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.emr ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emr_additional_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emila_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emr_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timesheet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timesheet_entry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_list_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_order ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. CREATE RLS POLICIES
-- ============================================================================

-- EMR Policies
CREATE POLICY "Users can view EMRs in their organization"
  ON public.emr FOR SELECT
  USING (organization_id = (auth.jwt() ->> 'org_id')::TEXT);

CREATE POLICY "Users can create EMRs in their organization"
  ON public.emr FOR INSERT
  WITH CHECK (organization_id = (auth.jwt() ->> 'org_id')::TEXT);

CREATE POLICY "Users can update EMRs in their organization"
  ON public.emr FOR UPDATE
  USING (organization_id = (auth.jwt() ->> 'org_id')::TEXT);

CREATE POLICY "Admins can delete EMRs"
  ON public.emr FOR DELETE
  USING ((auth.jwt() ->> 'role')::TEXT = 'admin' AND organization_id = (auth.jwt() ->> 'org_id')::TEXT);

-- EMR Additional Groups Policies
CREATE POLICY "Users can view EMR groups in their organization"
  ON public.emr_additional_groups FOR SELECT
  USING (
    emr_id IN (
      SELECT id FROM public.emr WHERE organization_id = (auth.jwt() ->> 'org_id')::TEXT
    )
  );

CREATE POLICY "Users can manage EMR groups in their organization"
  ON public.emr_additional_groups FOR INSERT
  WITH CHECK (
    emr_id IN (
      SELECT id FROM public.emr WHERE organization_id = (auth.jwt() ->> 'org_id')::TEXT
    )
  );

-- EMILA Photos Policies
CREATE POLICY "Users can view EMILA photos in their organization"
  ON public.emila_photos FOR SELECT
  USING (
    emr_id IN (
      SELECT id FROM public.emr WHERE organization_id = (auth.jwt() ->> 'org_id')::TEXT
    )
  );

CREATE POLICY "Users can upload EMILA photos in their organization"
  ON public.emila_photos FOR INSERT
  WITH CHECK (
    emr_id IN (
      SELECT id FROM public.emr WHERE organization_id = (auth.jwt() ->> 'org_id')::TEXT
    )
  );

-- EMR History Policies
CREATE POLICY "Users can view EMR history in their organization"
  ON public.emr_history FOR SELECT
  USING (
    emr_id IN (
      SELECT id FROM public.emr WHERE organization_id = (auth.jwt() ->> 'org_id')::TEXT
    )
  );

-- Timesheet Policies
CREATE POLICY "Users can view timesheets in their organization"
  ON public.timesheet FOR SELECT
  USING (organization_id = (auth.jwt() ->> 'org_id')::TEXT);

CREATE POLICY "Users can create timesheets in their organization"
  ON public.timesheet FOR INSERT
  WITH CHECK (organization_id = (auth.jwt() ->> 'org_id')::TEXT);

CREATE POLICY "Users can update timesheets in their organization"
  ON public.timesheet FOR UPDATE
  USING (organization_id = (auth.jwt() ->> 'org_id')::TEXT);

-- Timesheet Entry Policies
CREATE POLICY "Users can view timesheet entries in their organization"
  ON public.timesheet_entry FOR SELECT
  USING (
    timesheet_id IN (
      SELECT id FROM public.timesheet WHERE organization_id = (auth.jwt() ->> 'org_id')::TEXT
    )
  );

CREATE POLICY "Users can manage timesheet entries in their organization"
  ON public.timesheet_entry FOR INSERT
  WITH CHECK (
    timesheet_id IN (
      SELECT id FROM public.timesheet WHERE organization_id = (auth.jwt() ->> 'org_id')::TEXT
    )
  );

-- Task List Item Policies
CREATE POLICY "Users can view task list items in their organization"
  ON public.task_list_item FOR SELECT
  USING (
    work_order_id IN (
      SELECT id FROM public.work_order WHERE organization_id = (auth.jwt() ->> 'org_id')::TEXT
    )
  );

CREATE POLICY "Users can manage task list items in their organization"
  ON public.task_list_item FOR INSERT
  WITH CHECK (
    work_order_id IN (
      SELECT id FROM public.work_order WHERE organization_id = (auth.jwt() ->> 'org_id')::TEXT
    )
  );

-- Work Order Policies
CREATE POLICY "Users can view work orders in their organization"
  ON public.work_order FOR SELECT
  USING (organization_id = (auth.jwt() ->> 'org_id')::TEXT);

CREATE POLICY "Users can create work orders in their organization"
  ON public.work_order FOR INSERT
  WITH CHECK (organization_id = (auth.jwt() ->> 'org_id')::TEXT);

CREATE POLICY "Users can update work orders in their organization"
  ON public.work_order FOR UPDATE
  USING (organization_id = (auth.jwt() ->> 'org_id')::TEXT);

-- ============================================================================
-- 5. ENABLE REAL-TIME SUBSCRIPTIONS
-- ============================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.emr;
ALTER PUBLICATION supabase_realtime ADD TABLE public.timesheet;
ALTER PUBLICATION supabase_realtime ADD TABLE public.task_list_item;

-- ============================================================================
-- 6. CREATE STORAGE BUCKET (via Supabase Dashboard)
-- ============================================================================

-- NOTE: Storage buckets must be created via Supabase Dashboard:
-- 1. Go to Storage > Buckets
-- 2. Create bucket named "emr-photos"
-- 3. Set to Public
-- 4. Add RLS policy:
--    - Allow authenticated users to upload to their organization folder
--    - Allow public read access

-- ============================================================================
-- 7. SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Insert sample EMR
INSERT INTO public.emr (
  id, type, status, subject, owner, account, asset, work_order,
  organization_id, created_by, last_modified_by
) VALUES (
  'EMR-TEST-001', 'U', 'Open', 'Test Equipment Damage',
  'John Doe', 'ACME Corp', 'Unit-123', 'WO-001',
  'org-123', 'admin@example.com', 'admin@example.com'
) ON CONFLICT DO NOTHING;

-- Insert sample Timesheet
INSERT INTO public.timesheet (
  id, work_order_id, status, total_duration, entry_count,
  organization_id, created_by, last_modified_by
) VALUES (
  'TS-TEST-001', 'WO-001', 'Draft', 8, 1,
  'org-123', 'tech@example.com', 'tech@example.com'
) ON CONFLICT DO NOTHING;

-- Insert sample Task List Item
INSERT INTO public.task_list_item (
  id, work_order_id, operation_number, description, duration, status
) VALUES (
  'TASK-TEST-001', 'WO-001', '0010', 'Inspect equipment', 2, 'Not Started'
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- All tables, indexes, RLS policies, and real-time subscriptions are now active.
-- Next steps:
-- 1. Create storage bucket "emr-photos" in Supabase Dashboard
-- 2. Update .env.local with your Supabase credentials
-- 3. Test the application
