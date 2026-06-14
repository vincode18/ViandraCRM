# Product Requirements Document
## PRD-01 — Data Integration & Dynamic Module Upgrade
### UT Service Console — Full-Stack Supabase Integration

**Document Version:** 1.0  
**Status:** Draft — For Engineering Review  
**Date:** 2026-06-06  
**Prepared By:** Product Team  
**Scope:** All Modules — Case · Work Order · Service Appointment · Field Service · Shift · Plant · Work Center · Service Territory · Asset · Account · Contact  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [Current State & Pain Points](#3-current-state--pain-points)
4. [Supabase Database Architecture](#4-supabase-database-architecture)
5. [Module-by-Module Integration Specification](#5-module-by-module-integration-specification)
   - 5.1 Case
   - 5.2 Work Order
   - 5.3 Service Appointment
   - 5.4 Field Service
   - 5.5 Shift
   - 5.6 Plant
   - 5.7 Work Center
   - 5.8 Service Territory
   - 5.9 Asset
   - 5.10 Account
   - 5.11 Contact
6. [Create Forms — Dynamic Data Binding](#6-create-forms--dynamic-data-binding)
7. [Inline Edit — Admin-Level Field Editing](#7-inline-edit--admin-level-field-editing)
8. [Cross-Module Data Relationships](#8-cross-module-data-relationships)
9. [API Layer Specification](#9-api-layer-specification)
10. [Real-Time & Reactive Data](#10-real-time--reactive-data)
11. [Row-Level Security (RLS) Policy](#11-row-level-security-rls-policy)
12. [Acceptance Criteria](#12-acceptance-criteria)
13. [Open Issues & Future Scope](#13-open-issues--future-scope)

---

## 1. Executive Summary

The UT Service Console currently operates with statically rendered UI components that do not persist data to a backend database. This PRD specifies the complete integration of all modules with a **Supabase PostgreSQL backend**, enabling:

- **Dynamic, live data** across all modules (Cases, Work Orders, Service Appointments, Field Service, Shifts, Plant, Work Center, Service Territory, Asset, Account, Contact)
- **Create forms** that write records directly to Supabase tables with real-time feedback
- **Admin-level inline editing** of any field in any record, with save-to-database capability
- **Cross-module relational data** — records link to each other as they do in a real service CRM (Case → Account → Contact → Asset → Work Order → Service Appointment → Shift)
- **Organization-scoped data isolation** using `organization_id` and Row-Level Security (RLS) for multi-tenant safety

This PRD covers the data layer, API contracts, UI interaction patterns, and the integration logic that binds every module together.

---

## 2. Goals & Success Metrics

### 2.1 Goals

| # | Goal |
|---|------|
| G-01 | Every module list view pulls live data from Supabase |
| G-02 | Every create form writes a new record to the corresponding Supabase table |
| G-03 | Admin users can click any field in a detail view, edit it inline, and save it to the database |
| G-04 | Related data panels (e.g., Work Orders on a Case, SAs on a Work Order) load from JOIN queries |
| G-05 | All dropdown/lookup fields in forms show real data from their source tables |
| G-06 | Optimistic UI updates so admin edits feel instant, with rollback on failure |
| G-07 | Data changes broadcast in real-time to other open sessions via Supabase Realtime |

### 2.2 Success Metrics

| Metric | Target |
|--------|--------|
| API response time (list queries) | < 500ms |
| API response time (single record) | < 200ms |
| Form submission success rate | > 99.5% |
| Inline edit round-trip (save + confirm) | < 300ms perceived |
| RLS policy coverage | 100% of tables |

---

## 3. Current State & Pain Points

| Pain Point | Impact |
|------------|--------|
| Module data is hardcoded/mocked | Cannot track real service operations |
| Create forms do not persist | Records disappear on refresh |
| No relational data — e.g., no Work Orders linked to Cases | Agents cannot see full service history |
| No admin edit capability | Cannot correct field values post-creation |
| Lookup fields show static lists | Cannot reflect real Accounts, Contacts, Resources |
| No multi-user state sync | Two agents see different "versions" of the same record |

---

## 4. Supabase Database Architecture

### 4.1 Multi-Tenant Foundation

All tables include `organization_id` as a mandatory foreign key to the `organizations` table. Supabase RLS enforces data isolation between tenants.

```sql
-- Core tenant anchor
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 4.2 Full Table Catalogue

#### `accounts`
```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  account_number TEXT UNIQUE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('Customer', 'Partner', 'Prospect', 'Vendor')),
  industry TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  billing_address JSONB,
  shipping_address JSONB,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  owner_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `contacts`
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  mobile TEXT,
  title TEXT,
  department TEXT,
  role TEXT CHECK (role IN ('Admin', 'User', 'Viewer', 'Technician', 'Manager')),
  is_portal_user BOOLEAN DEFAULT FALSE,
  portal_access_level TEXT CHECK (portal_access_level IN ('Full', 'Limited', 'ReadOnly')),
  status TEXT DEFAULT 'Active',
  owner_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `assets`
```sql
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  asset_number TEXT UNIQUE,
  name TEXT NOT NULL,
  type TEXT,
  serial_number TEXT,
  model TEXT,
  manufacturer TEXT,
  install_date DATE,
  warranty_expiry DATE,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Retired', 'Under Maintenance')),
  location TEXT,
  plant_id UUID REFERENCES plants(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `plants`
```sql
CREATE TABLE plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  plant_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  site_type TEXT CHECK (site_type IN ('BRANCH', 'SITE', 'HQ', 'SATELLITE')),
  address TEXT,
  city TEXT,
  province TEXT,
  country TEXT DEFAULT 'Indonesia',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  phone TEXT,
  email TEXT,
  timezone TEXT DEFAULT 'Asia/Jakarta',
  operating_hours_id UUID REFERENCES operating_hours(id),
  parent_plant_id UUID REFERENCES plants(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `work_centers`
```sql
CREATE TABLE work_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  plant_id UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  wc_code TEXT NOT NULL,
  name TEXT NOT NULL,
  wc_type TEXT NOT NULL CHECK (wc_type IN ('FD', 'FM')),
  capacity INTEGER DEFAULT 1,
  -- FM-specific fields (nullable for FD)
  fm_contract_reference TEXT,
  fm_scope_of_work TEXT,
  fm_contract_value DECIMAL(15,2),
  fm_sla_priority TEXT CHECK (fm_sla_priority IN ('Critical', 'High', 'Medium', 'Low')),
  fm_resource_count INTEGER,
  fm_pm_schedule TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `service_territories`
```sql
CREATE TABLE service_territories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  plant_id UUID NOT NULL REFERENCES plants(id),
  work_center_id UUID NOT NULL REFERENCES work_centers(id),
  territory_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  province TEXT,
  operating_hours_id UUID REFERENCES operating_hours(id),
  avg_travel_time_minutes INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `service_resources`
```sql
CREATE TABLE service_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id),
  resource_number TEXT UNIQUE,
  name TEXT NOT NULL,
  resource_type TEXT CHECK (resource_type IN ('Technician', 'Crew', 'Virtual')),
  is_active BOOLEAN DEFAULT TRUE,
  capacity_type TEXT CHECK (capacity_type IN ('Per Hour', 'Per Case')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `shifts`
```sql
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  shift_number TEXT UNIQUE NOT NULL DEFAULT ('SH-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(nextval('shift_seq')::text, 4, '0')),
  service_resource_id UUID REFERENCES service_resources(id),
  service_territory_id UUID REFERENCES service_territories(id),
  plant_id UUID REFERENCES plants(id),
  job_profile_id UUID REFERENCES job_profiles(id),
  shift_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  type TEXT CHECK (type IN ('Standard', 'Overtime', 'On-Call', 'Emergency')),
  status TEXT DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'In Progress', 'Completed', 'Cancelled')),
  color_hex TEXT DEFAULT '#4A90E2',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `cases`
```sql
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  case_number TEXT UNIQUE NOT NULL DEFAULT ('CASE-' || lpad(nextval('case_seq')::text, 6, '0')),
  subject TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'Assigned', 'In Progress', 'Resolved', 'Closed')),
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
  case_type TEXT,
  case_origin TEXT,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
  owner_user_id UUID REFERENCES auth.users(id),
  plant_id UUID REFERENCES plants(id),
  -- Customer Information
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  -- Billing
  billing_status TEXT,
  billing_amount DECIMAL(15,2),
  -- SLA
  sla_start_time TIMESTAMPTZ,
  sla_due_date TIMESTAMPTZ,
  sla_status TEXT,
  -- Completion
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `work_orders`
```sql
CREATE TABLE work_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  work_order_number TEXT UNIQUE NOT NULL DEFAULT ('WO-' || lpad(nextval('wo_seq')::text, 6, '0')),
  case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  plant_id UUID REFERENCES plants(id),
  work_center_id UUID REFERENCES work_centers(id),
  service_territory_id UUID REFERENCES service_territories(id),
  subject TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Completed', 'Cancelled', 'On Hold', 'Scheduled')),
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
  wo_type TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  estimated_duration_minutes INTEGER,
  actual_duration_minutes INTEGER,
  owner_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `service_appointments`
```sql
CREATE TABLE service_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  appointment_number TEXT UNIQUE NOT NULL DEFAULT ('SA-' || lpad(nextval('sa_seq')::text, 6, '0')),
  work_order_id UUID REFERENCES work_orders(id) ON DELETE CASCADE,
  case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
  service_territory_id UUID REFERENCES service_territories(id),
  subject TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Dispatched', 'In Progress', 'Completed', 'Cancelled', 'Cannot Complete')),
  scheduled_start TIMESTAMPTZ,
  scheduled_end TIMESTAMPTZ,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  arrival_window_start TIMESTAMPTZ,
  arrival_window_end TIMESTAMPTZ,
  duration_minutes INTEGER,
  is_emergency BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `assigned_resources`
```sql
CREATE TABLE assigned_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  service_appointment_id UUID NOT NULL REFERENCES service_appointments(id) ON DELETE CASCADE,
  service_resource_id UUID NOT NULL REFERENCES service_resources(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT TRUE,
  travel_mode TEXT,
  estimated_travel_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### `field_service_logs`
```sql
CREATE TABLE field_service_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  service_appointment_id UUID NOT NULL REFERENCES service_appointments(id) ON DELETE CASCADE,
  service_resource_id UUID REFERENCES service_resources(id),
  log_type TEXT CHECK (log_type IN ('Check-In', 'Check-Out', 'Status Change', 'Note', 'Photo', 'Signature')),
  log_time TIMESTAMPTZ DEFAULT now(),
  notes TEXT,
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### `case_history`
```sql
CREATE TABLE case_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT CHECK (event_type IN ('Created', 'Status Change', 'Field Edit', 'Comment', 'File Upload', 'Assignment')),
  old_value JSONB,
  new_value JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### `operating_hours`
```sql
CREATE TABLE operating_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  timezone TEXT DEFAULT 'Asia/Jakarta',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE operating_hour_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operating_hours_id UUID NOT NULL REFERENCES operating_hours(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);
```

### 4.3 Auto-Increment Sequences

```sql
CREATE SEQUENCE case_seq START 1;
CREATE SEQUENCE wo_seq START 1;
CREATE SEQUENCE sa_seq START 1;
CREATE SEQUENCE shift_seq START 1;
```

### 4.4 Updated-At Trigger (Applied to All Tables)

```sql
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to each table
CREATE TRIGGER trg_cases_updated_at BEFORE UPDATE ON cases
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
-- (repeat for work_orders, service_appointments, shifts, etc.)
```

---

## 5. Module-by-Module Integration Specification

### 5.1 Case Module

#### List View Data Source
```sql
SELECT 
  c.id, c.case_number, c.subject, c.status, c.priority,
  c.created_at, c.sla_due_date,
  a.name AS account_name,
  ct.first_name || ' ' || ct.last_name AS contact_name,
  u.email AS owner_email
FROM cases c
LEFT JOIN accounts a ON c.account_id = a.id
LEFT JOIN contacts ct ON c.contact_id = ct.id
LEFT JOIN auth.users u ON c.owner_user_id = u.id
WHERE c.organization_id = :org_id
ORDER BY c.created_at DESC;
```

#### Detail View Panels — Dynamic Data Loading

| Panel | Query Source |
|-------|-------------|
| Center — Customer Information | `cases` JOIN `accounts` JOIN `contacts` |
| Center — Case Details | `cases` own fields |
| Left — Work Orders | `work_orders WHERE case_id = :case_id` |
| Left — Account Info | `accounts WHERE id = cases.account_id` |
| Left — Asset Info | `assets WHERE id = cases.asset_id` |
| Right — Case History | `case_history WHERE case_id = :case_id ORDER BY created_at DESC` |
| Right — Related Work Orders | `work_orders WHERE case_id = :case_id` |
| Right — Service Appointments | `service_appointments WHERE case_id = :case_id` |
| Right — Files | `case_files WHERE case_id = :case_id` |

#### Create Case Form — Dynamic Lookups

| Field | Source Table | Query |
|-------|-------------|-------|
| Account | `accounts` | `WHERE organization_id = :org AND status = 'Active'` |
| Contact | `contacts` | `WHERE account_id = :selected_account_id` (dependent on Account) |
| Asset | `assets` | `WHERE account_id = :selected_account_id` (dependent on Account) |
| Owner | `auth.users` + `profiles` | Active users in org |
| Plant | `plants` | `WHERE organization_id = :org AND is_active = TRUE` |

---

### 5.2 Work Order Module

#### List View Data Source
```sql
SELECT 
  wo.id, wo.work_order_number, wo.subject, wo.status, wo.priority,
  wo.start_date, wo.end_date,
  c.case_number,
  a.name AS account_name,
  ast.name AS asset_name,
  p.name AS plant_name
FROM work_orders wo
LEFT JOIN cases c ON wo.case_id = c.id
LEFT JOIN accounts a ON wo.account_id = a.id
LEFT JOIN assets ast ON wo.asset_id = ast.id
LEFT JOIN plants p ON wo.plant_id = p.id
WHERE wo.organization_id = :org_id
ORDER BY wo.created_at DESC;
```

#### Create Work Order Form — Dynamic Lookups

| Field | Source |
|-------|--------|
| Case | `cases WHERE status NOT IN ('Closed')` |
| Account | `accounts` |
| Asset | `assets WHERE account_id = :selected_account` |
| Contact | `contacts WHERE account_id = :selected_account` |
| Plant | `plants` |
| Work Center | `work_centers WHERE plant_id = :selected_plant` |
| Service Territory | `service_territories WHERE work_center_id = :selected_wc` |
| Owner | `auth.users` |

---

### 5.3 Service Appointment Module

#### Create SA Form — Dynamic Lookups

| Field | Source |
|-------|--------|
| Work Order | `work_orders WHERE status NOT IN ('Completed', 'Cancelled')` |
| Service Territory | `service_territories` |
| Assigned Resource | `service_resources WHERE is_active = TRUE` |
| Account | Inherited from Work Order |
| Asset | Inherited from Work Order |

#### Dispatch Board — Gantt Data Query
```sql
SELECT 
  sa.id, sa.appointment_number, sa.subject, sa.status,
  sa.scheduled_start, sa.scheduled_end,
  sr.name AS resource_name,
  st.name AS territory_name
FROM service_appointments sa
LEFT JOIN assigned_resources ar ON ar.service_appointment_id = sa.id AND ar.is_primary = TRUE
LEFT JOIN service_resources sr ON ar.service_resource_id = sr.id
LEFT JOIN service_territories st ON sa.service_territory_id = st.id
WHERE sa.organization_id = :org_id
  AND sa.scheduled_start >= :range_start
  AND sa.scheduled_end <= :range_end
ORDER BY sa.scheduled_start;
```

---

### 5.4 Field Service Module

The Field Service module aggregates data from `service_appointments`, `assigned_resources`, `field_service_logs`, and `service_resources`.

#### Live Dispatch View Data
```sql
SELECT 
  sa.id, sa.appointment_number, sa.status,
  sa.scheduled_start, sa.actual_start,
  sr.name AS technician,
  wo.work_order_number,
  a.name AS account_name,
  ast.name AS asset_name,
  st.name AS territory
FROM service_appointments sa
JOIN assigned_resources ar ON ar.service_appointment_id = sa.id AND ar.is_primary = TRUE
JOIN service_resources sr ON ar.service_resource_id = sr.id
LEFT JOIN work_orders wo ON sa.work_order_id = wo.id
LEFT JOIN accounts a ON sa.account_id = a.id
LEFT JOIN assets ast ON sa.asset_id = ast.id
LEFT JOIN service_territories st ON sa.service_territory_id = st.id
WHERE sa.organization_id = :org_id
  AND sa.status IN ('Scheduled', 'Dispatched', 'In Progress')
ORDER BY sa.scheduled_start;
```

---

### 5.5 Shift Module

#### Create Shift Form — Dynamic Lookups

| Field | Source |
|-------|--------|
| Service Resource | `service_resources WHERE is_active = TRUE` |
| Service Territory | `service_territories WHERE is_active = TRUE` |
| Plant | `plants WHERE is_active = TRUE` |
| Job Profile | `job_profiles` |
| Shift Type | Static enum: `Standard, Overtime, On-Call, Emergency` |

#### Shift Calendar — Data Query
```sql
SELECT 
  s.id, s.shift_number, s.shift_date, s.start_time, s.end_time,
  s.type, s.status, s.color_hex,
  sr.name AS resource_name,
  st.name AS territory_name,
  p.name AS plant_name
FROM shifts s
LEFT JOIN service_resources sr ON s.service_resource_id = sr.id
LEFT JOIN service_territories st ON s.service_territory_id = st.id
LEFT JOIN plants p ON s.plant_id = p.id
WHERE s.organization_id = :org_id
  AND s.shift_date BETWEEN :start_date AND :end_date
ORDER BY s.shift_date, s.start_time;
```

---

### 5.6 Plant Module

Standard CRUD with `plants` table. List view includes child count of Work Centers and Service Territories.

```sql
SELECT 
  p.*,
  COUNT(DISTINCT wc.id) AS work_center_count,
  COUNT(DISTINCT st.id) AS territory_count
FROM plants p
LEFT JOIN work_centers wc ON wc.plant_id = p.id AND wc.is_active = TRUE
LEFT JOIN service_territories st ON st.plant_id = p.id AND st.is_active = TRUE
WHERE p.organization_id = :org_id
GROUP BY p.id;
```

---

### 5.7 Work Center Module

Standard CRUD with `work_centers` table. FM-specific fields only displayed/saved when `wc_type = 'FM'`.

---

### 5.8 Service Territory Module

Standard CRUD with `service_territories` table. Includes Mechanic Assignment sub-table (`service_territory_members`).

---

### 5.9 Asset Module

Standard CRUD with `assets` table. Detail view shows linked Cases, Work Orders, and Service Appointments.

---

### 5.10 Account Module

Standard CRUD with `accounts` table. Detail view panels:
- Contacts (from `contacts WHERE account_id`)
- Assets (from `assets WHERE account_id`)
- Cases (from `cases WHERE account_id`)
- Work Orders (from `work_orders WHERE account_id`)

---

### 5.11 Contact Module

Standard CRUD with `contacts` table. Detail view includes the **Settings Panel** — see PRD-02 for full specification. This panel controls which fields the Contact (as a User) can view and edit.

---

## 6. Create Forms — Dynamic Data Binding

### 6.1 Binding Pattern

All create forms follow this pattern:

```
1. Form mounts → fetch all lookup data in parallel (Promise.all)
2. User selects a parent field (e.g., Account) → child fields re-query filtered data
3. User fills in form → client-side validation runs
4. User submits → POST to Supabase via supabase-js client
5. On success → record added to list view via optimistic update OR Realtime subscription
6. On error → toast notification with error message, form remains open
```

### 6.2 Create Shift — Full Field Specification

| Field | Type | Source | Validation |
|-------|------|--------|-----------|
| Shift Date | Date picker | — | Required, not in past |
| Start Time | Time picker | — | Required |
| End Time | Time picker | — | Required, > Start Time |
| Type | Select | Enum | Required |
| Service Resource | Lookup | `service_resources` | Required |
| Service Territory | Lookup | `service_territories` | Required |
| Plant | Lookup | `plants` | Required |
| Job Profile | Lookup | `job_profiles` | Optional |
| Color | Color picker | — | Optional, default `#4A90E2` |
| Notes | Textarea | — | Optional |

#### Supabase Insert
```javascript
const { data, error } = await supabase
  .from('shifts')
  .insert({
    organization_id: currentOrgId,
    shift_date: formValues.shift_date,
    start_time: formValues.start_time,
    end_time: formValues.end_time,
    type: formValues.type,
    service_resource_id: formValues.service_resource_id,
    service_territory_id: formValues.service_territory_id,
    plant_id: formValues.plant_id,
    job_profile_id: formValues.job_profile_id,
    color_hex: formValues.color_hex,
    notes: formValues.notes,
    created_by: currentUserId,
  })
  .select()
  .single();
```

### 6.3 Create Case — Full Field Specification

| Field | Type | Source | Validation |
|-------|------|--------|-----------|
| Subject | Text | — | Required, max 255 |
| Description | Textarea | — | Optional |
| Status | Select | Enum | Required, default 'Open' |
| Priority | Select | Enum | Required, default 'Medium' |
| Case Type | Select | Enum | Required |
| Case Origin | Select | Enum | Required |
| Account | Lookup + Search | `accounts` | Required |
| Contact | Lookup (dependent) | `contacts WHERE account_id` | Optional |
| Asset | Lookup (dependent) | `assets WHERE account_id` | Optional |
| Owner | Lookup | `auth.users` | Required |
| Plant | Lookup | `plants` | Optional |

### 6.4 Create Work Order — Full Field Specification

| Field | Type | Source | Validation |
|-------|------|--------|-----------|
| Subject | Text | — | Required |
| Description | Textarea | — | Optional |
| Status | Select | Enum | Required |
| Priority | Select | Enum | Required |
| WO Type | Select | Enum | Required |
| Case | Lookup | `cases` | Optional |
| Account | Lookup | `accounts` | Required |
| Asset | Lookup (dependent) | `assets` | Optional |
| Contact | Lookup (dependent) | `contacts` | Optional |
| Plant | Lookup | `plants` | Required |
| Work Center | Lookup (dependent) | `work_centers WHERE plant_id` | Required |
| Service Territory | Lookup (dependent) | `service_territories WHERE wc_id` | Optional |
| Start Date | DateTime | — | Optional |
| End Date | DateTime | — | Optional, > Start |

### 6.5 Create Service Appointment — Full Field Specification

| Field | Type | Source | Validation |
|-------|------|--------|-----------|
| Subject | Text | — | Required |
| Work Order | Lookup | `work_orders` | Required |
| Service Territory | Lookup | `service_territories` | Required |
| Scheduled Start | DateTime | — | Required |
| Scheduled End | DateTime | — | Required |
| Arrival Window Start | DateTime | — | Optional |
| Arrival Window End | DateTime | — | Optional |
| Assigned Resource | Lookup | `service_resources` | Required |
| Is Emergency | Toggle | — | Default FALSE |
| Description | Textarea | — | Optional |

---

## 7. Inline Edit — Admin-Level Field Editing

### 7.1 Overview

Admin users can edit any field in any record detail view without navigating to a separate edit form. The interaction is:

1. Admin user sees field value rendered in read mode
2. Admin clicks field (or pencil icon) → field transitions to edit mode (input/select/datepicker appears inline)
3. Admin changes value
4. Admin clicks ✓ (confirm) or presses Enter → save fires
5. Field returns to read mode showing new value + audit trail entry is created
6. If admin clicks ✗ or presses Escape → original value is restored

### 7.2 UI Interaction Pattern

```
Read Mode:
┌─────────────────────────────────────────────┐
│ Priority     [High ▓▓▓]         ✎ (on hover)│
└─────────────────────────────────────────────┘

Edit Mode (after click):
┌─────────────────────────────────────────────┐
│ Priority     [High ▼]           ✓  ✗        │
└─────────────────────────────────────────────┘
```

### 7.3 Field Type → Edit Control Mapping

| Field Type | Edit Control |
|------------|-------------|
| Short text | `<input type="text">` with `.input-field` class |
| Long text | `<textarea>` with `.input-field` class |
| Date | Date picker (popover) |
| DateTime | DateTime picker |
| Status | `<select>` with status options |
| Priority | `<select>` with priority options |
| Lookup (Account, Contact, etc.) | Searchable dropdown with live query |
| Boolean/Toggle | Toggle switch |
| Number | `<input type="number">` |
| Currency | `<input type="number">` with currency prefix |
| Color | Color picker |

### 7.4 Save Logic

```javascript
async function saveFieldEdit(table, recordId, field, newValue, oldValue) {
  // Optimistic update
  updateUIField(field, newValue);

  const { error } = await supabase
    .from(table)
    .update({ [field]: newValue, updated_at: new Date().toISOString() })
    .eq('id', recordId)
    .eq('organization_id', currentOrgId);

  if (error) {
    // Rollback
    updateUIField(field, oldValue);
    showToast('error', `Failed to save ${field}: ${error.message}`);
    return;
  }

  // Log to audit/history table
  await supabase.from('case_history').insert({
    organization_id: currentOrgId,
    case_id: recordId,
    user_id: currentUserId,
    event_type: 'Field Edit',
    old_value: { [field]: oldValue },
    new_value: { [field]: newValue },
  });

  showToast('success', 'Saved');
}
```

### 7.5 Editable Fields Per Module

#### Case — All Editable Admin Fields
`subject`, `description`, `status`, `priority`, `case_type`, `case_origin`, `account_id`, `contact_id`, `asset_id`, `owner_user_id`, `plant_id`, `customer_name`, `customer_email`, `customer_phone`, `billing_status`, `billing_amount`, `sla_due_date`, `resolution_notes`

#### Work Order — All Editable Admin Fields
`subject`, `description`, `status`, `priority`, `wo_type`, `case_id`, `account_id`, `asset_id`, `contact_id`, `plant_id`, `work_center_id`, `service_territory_id`, `start_date`, `end_date`, `estimated_duration_minutes`, `owner_user_id`

#### Service Appointment — All Editable Admin Fields
`subject`, `description`, `status`, `scheduled_start`, `scheduled_end`, `arrival_window_start`, `arrival_window_end`, `is_emergency`

#### Shift — All Editable Admin Fields
`shift_date`, `start_time`, `end_time`, `type`, `status`, `service_resource_id`, `service_territory_id`, `plant_id`, `job_profile_id`, `color_hex`, `notes`

#### Contact — All Editable Admin Fields
`first_name`, `last_name`, `email`, `phone`, `mobile`, `title`, `department`, `role`, `is_portal_user`, `portal_access_level`, `status`, `account_id`

### 7.6 Audit Trail

Every save via inline edit appends a record to `case_history` (for cases) or `field_edit_log` (for other modules):

```sql
CREATE TABLE field_edit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  edited_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 8. Cross-Module Data Relationships

### 8.1 Full Relationship Map

```
Organization
 ├── Account (Customer/Partner)
 │    ├── Contact (Person) ────────────────────┐
 │    └── Asset (Equipment)                    │
 │                                             │
 ├── Plant                                     │
 │    └── Work Center (FD / FM)               │
 │         └── Service Territory              │
 │              └── Service Territory Members │
 │                   └── Service Resource ◄───┘ (linked to Contact)
 │
 ├── Case (created from Account + Contact + Asset)
 │    ├── Work Order (child of Case OR standalone)
 │    │    └── Service Appointment (scheduled from WO)
 │    │         └── Assigned Resources (SA ↔ Service Resource)
 │    │              └── Field Service Log (check-in/out events)
 │    └── Case History (audit trail)
 │
 └── Shift (standalone, linked to Service Resource + Territory + Plant)
      └── Service Appointments within shift window (time-based join)
```

### 8.2 Cascading Delete Rules

| Parent deleted | Child action |
|---------------|-------------|
| Account | Cases → SET NULL on account_id |
| Account | Contacts → SET NULL on account_id |
| Account | Assets → SET NULL on account_id |
| Work Order | Service Appointments → CASCADE DELETE |
| Service Appointment | Assigned Resources → CASCADE DELETE |
| Service Appointment | Field Service Logs → CASCADE DELETE |
| Plant | Work Centers → RESTRICT (cannot delete plant with active WCs) |
| Work Center | Service Territories → RESTRICT |

### 8.3 Referential Integrity Rules

- A Work Order cannot be set to `Completed` if it has open (non-completed/cancelled) Service Appointments
- A Case cannot be `Closed` if it has open Work Orders
- A Shift cannot be deleted if it has linked Service Appointments within its time window
- A Service Territory cannot be deactivated if it has future scheduled Service Appointments

---

## 9. API Layer Specification

### 9.1 Supabase Client Configuration

```javascript
// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
```

### 9.2 Query Patterns

#### List with Pagination
```javascript
const { data, count, error } = await supabase
  .from('cases')
  .select('*, accounts(name), contacts(first_name, last_name)', { count: 'exact' })
  .eq('organization_id', orgId)
  .order('created_at', { ascending: false })
  .range(page * pageSize, (page + 1) * pageSize - 1);
```

#### Single Record with Relations
```javascript
const { data, error } = await supabase
  .from('cases')
  .select(`
    *,
    accounts(*),
    contacts(*),
    assets(*),
    plants(*),
    work_orders(*, service_appointments(*))
  `)
  .eq('id', caseId)
  .eq('organization_id', orgId)
  .single();
```

#### Search/Autocomplete
```javascript
const { data } = await supabase
  .from('accounts')
  .select('id, name, account_number')
  .eq('organization_id', orgId)
  .eq('status', 'Active')
  .ilike('name', `%${searchTerm}%`)
  .limit(10);
```

#### Update Single Field
```javascript
const { error } = await supabase
  .from('cases')
  .update({ status: newStatus, updated_at: new Date() })
  .eq('id', caseId)
  .eq('organization_id', orgId);
```

### 9.3 Error Handling Standards

All API calls must handle:
- `23503` — Foreign key violation → Show friendly "Linked record not found"
- `23505` — Unique constraint violation → Show "Record with this number already exists"
- `PGRST116` — No rows found → Return null gracefully
- Network errors → Show "Connection error, please retry" toast
- Auth errors → Redirect to login

---

## 10. Real-Time & Reactive Data

### 10.1 Supabase Realtime Subscriptions

Enable real-time for tables that benefit from live updates:

```javascript
// Subscribe to case status changes
const channel = supabase
  .channel('case-updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'cases',
    filter: `organization_id=eq.${orgId}`,
  }, (payload) => {
    updateCaseInUI(payload.new);
  })
  .subscribe();
```

### 10.2 Tables with Realtime Enabled

| Table | Events | Use Case |
|-------|--------|---------|
| `cases` | UPDATE | Status change visible to all agents instantly |
| `service_appointments` | INSERT, UPDATE | Dispatch board updates live |
| `field_service_logs` | INSERT | Field technician check-in/out visible in real time |
| `shifts` | INSERT, UPDATE, DELETE | Shift calendar refreshes automatically |
| `work_orders` | UPDATE | WO status visible cross-module |

---

## 11. Row-Level Security (RLS) Policy

### 11.1 Standard Pattern (Applied to All Tables)

```sql
-- Enable RLS
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see records from their own organization
CREATE POLICY "org_isolation" ON cases
  FOR ALL
  USING (
    organization_id = (
      SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
    )
  );
```

### 11.2 Admin vs User Policy

Admin-level write policies check the user's role from `user_profiles`:

```sql
-- Policy: Only Admins can update any field
CREATE POLICY "admin_update" ON cases
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND organization_id = cases.organization_id
      AND role IN ('Admin', 'Super Admin')
    )
  );

-- Policy: Regular users can update only their own assigned cases
CREATE POLICY "user_update_own" ON cases
  FOR UPDATE
  USING (
    owner_user_id = auth.uid()
    AND organization_id = (
      SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
    )
  );
```

---

## 12. Acceptance Criteria

| ID | Criteria | Module |
|----|----------|--------|
| AC-01 | Case list view loads real data from `cases` table with Account and Contact names | Case |
| AC-02 | Creating a new Case via the Create form inserts a row in `cases` with auto-generated case_number | Case |
| AC-03 | Contact dropdown in Create Case form shows only Contacts belonging to the selected Account | Case |
| AC-04 | Admin clicking the Priority field in Case detail enters inline edit mode | Case |
| AC-05 | Saving an inline edit updates the database AND creates a `field_edit_log` entry | All |
| AC-06 | Cancelling an inline edit restores the original value without any database call | All |
| AC-07 | Work Order list shows linked Case number and Account name from JOIN | WO |
| AC-08 | Create Shift form loads Service Resources, Territories, and Plants from live data | Shift |
| AC-09 | Shift Gantt/Calendar shows shifts colored by `color_hex` value | Shift |
| AC-10 | Service Appointment dispatch board updates without page refresh when a technician checks in | Field Service |
| AC-11 | Deleting a Work Order that has active Service Appointments returns a validation error | WO |
| AC-12 | All tables have RLS policies that prevent cross-organization data access | All |
| AC-13 | Field edit log is visible in the record history/audit trail panel | All |
| AC-14 | Lookup dropdowns support debounced search (300ms delay, min 2 chars) | All |
| AC-15 | All create forms validate required fields before submission | All |

---

## 13. Open Issues & Future Scope

| ID | Topic | Status | Notes |
|----|-------|--------|-------|
| OI-001 | Offline support for field technicians | Future | PWA + background sync required |
| OI-002 | Bulk edit / mass update | Future | Select multiple records and update a field at once |
| OI-003 | File/attachment upload to Supabase Storage | Open | Linked to Case, WO, SA records |
| OI-004 | Duplicate detection on Account/Contact create | Open | Fuzzy match on name + email |
| OI-005 | Import / CSV upload for bulk record creation | Future | Required for onboarding existing customers |
| OI-006 | Webhook outbound notifications on record changes | Future | For external system integration |
| OI-007 | Advanced search & filtering across all modules | Open | Filter builder UI on list views |

---

*End of PRD-01 — Data Integration & Dynamic Module Upgrade*  
*Document Version 1.0 | UT Service Console | 2026-06-06*
