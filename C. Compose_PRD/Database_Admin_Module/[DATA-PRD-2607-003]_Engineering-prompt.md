# Engineering Prompt — UT Service Console
## Dynamic Data Layer · Contacts Module · Admin Settings Panel

> **Target Audience:** Full-stack engineers, frontend engineers, backend engineers  
> **Stack Assumption:** React (Vite) + Tailwind CSS + Node.js/Express or similar REST API backend + PostgreSQL  
> **Design System Reference:** `Design_System.md` v1.0 (tokens, components, spacing, typography)

---

## CONTEXT

The UT Service Console is an internal field-service CRM covering five modules:
**Dashboard · Cases · Work Orders · Service Appointments · Field Service.**

Currently the application renders static/mock data. This prompt covers three scopes of work:

1. **Dynamic Data Layer** — wire every existing module to a real database via a REST (or GraphQL) API; all fields must be read, created, updated, and deleted through the API.
2. **Contacts Module** — a new top-level module that manages end-user records with User Profiles and Role-Based Access Control (RBAC).
3. **Admin Settings Panel** — accessible via the existing **Settings** button; allows administrators to create users, manage profiles & roles, and configure per-object field behaviour (editable / required / read-only).

---

## SCOPE 1 — DYNAMIC DATA LAYER

### 1.1 Backend API Requirements

#### Database Schema (minimum)
Every existing entity must have a persisted table:

| Entity | Key Fields |
|--------|-----------|
| `cases` | id, case_number, subject, status, priority, account_id, contact_id, owner_id, created_at, updated_at |
| `work_orders` | id, wo_number, title, status, priority, case_id, assigned_to, scheduled_date, created_at, updated_at |
| `service_appointments` | id, sa_number, subject, status, work_order_id, scheduled_start, scheduled_end, actual_start, actual_end, technician_id |
| `field_service_tasks` | id, task_number, title, status, appointment_id, assignee_id |

#### REST Endpoints Pattern
For every entity above, expose:

```
GET    /api/v1/{entity}             → paginated list (filter, sort, search)
GET    /api/v1/{entity}/:id         → single record + related data
POST   /api/v1/{entity}             → create
PATCH  /api/v1/{entity}/:id         → partial update
DELETE /api/v1/{entity}/:id         → soft delete (set deleted_at)
```

#### Query Parameters (list endpoints)
```
?page=1&limit=25
?sort=created_at&order=desc
?search=<term>          → full-text across key fields
?status=open,inprogress → multi-value filter
?priority=critical,high
?owner_id=<uuid>
```

#### Response Envelope
```json
{
  "data": [...],
  "meta": {
    "total": 124,
    "page": 1,
    "limit": 25,
    "pages": 5
  },
  "errors": null
}
```

### 1.2 Frontend Integration Requirements

#### State Management
- Use **React Query (TanStack Query v5)** for all server state.
- Use local `useState` / `useReducer` only for UI state (modals open/closed, form draft, etc.).
- No Redux or Zustand unless already present in the project.

#### Data Fetching Pattern
```javascript
// Example — useCase hook
export const useCase = (id) =>
  useQuery({ queryKey: ['cases', id], queryFn: () => api.get(`/cases/${id}`) });

export const useUpdateCase = () =>
  useMutation({
    mutationFn: ({ id, data }) => api.patch(`/cases/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cases'] }),
  });
```

#### Optimistic Updates
All PATCH operations must apply optimistic UI updates via React Query's `onMutate` callback so the UI feels instant.

#### Loading & Error States
Every data-dependent component must handle:
- **Loading** → skeleton loaders matching the component's layout (not spinners)
- **Error** → inline error message with a retry button
- **Empty** → illustrated empty state with a CTA where applicable

#### Real-time / Polling
- List pages poll every **30 seconds** (`refetchInterval: 30_000`) for background freshness.
- Detail pages poll every **60 seconds**.

#### Inline Field Editing
All editable fields in detail views must support **inline editing**:
1. Field renders as read-only text by default.
2. On click (or keyboard Enter/Space), field transitions to an input/select.
3. On blur or Enter, PATCH is sent immediately.
4. Escape reverts the draft without saving.
5. Respect the field's configured editability (see Scope 3 — Field Configuration).

---

## SCOPE 2 — CONTACTS MODULE

### 2.1 Overview

The Contacts module is a new top-level navigation item (add to sidebar between Cases and Work Orders, icon: `Users` from lucide-react). It manages **system users** who can log in to the console (internal users / technicians / admins) as well as **external contacts** (customers).

### 2.2 Data Model

#### `contacts` table
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
type            ENUM('user', 'customer')  -- internal user vs external contact
first_name      VARCHAR(100) NOT NULL
last_name       VARCHAR(100) NOT NULL
email           VARCHAR(255) UNIQUE NOT NULL
phone           VARCHAR(50)
mobile          VARCHAR(50)
job_title       VARCHAR(150)
department      VARCHAR(150)
account_id      UUID REFERENCES accounts(id)
address_line1   VARCHAR(255)
address_line2   VARCHAR(255)
city            VARCHAR(100)
state           VARCHAR(100)
postal_code     VARCHAR(20)
country         VARCHAR(100)
avatar_url      TEXT
notes           TEXT
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMPTZ DEFAULT now()
updated_at      TIMESTAMPTZ DEFAULT now()
```

#### `users` table (extends contacts for internal users)
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
contact_id      UUID REFERENCES contacts(id) UNIQUE
username        VARCHAR(100) UNIQUE NOT NULL
password_hash   TEXT NOT NULL
role_id         UUID REFERENCES roles(id)
profile_id      UUID REFERENCES profiles(id)
last_login      TIMESTAMPTZ
mfa_enabled     BOOLEAN DEFAULT false
is_locked       BOOLEAN DEFAULT false
failed_attempts INTEGER DEFAULT 0
```

#### `roles` table
```sql
id              UUID PRIMARY KEY
name            VARCHAR(100) UNIQUE NOT NULL   -- e.g. "Administrator", "Technician", "Dispatcher", "Viewer"
description     TEXT
is_system       BOOLEAN DEFAULT false          -- system roles cannot be deleted
created_at      TIMESTAMPTZ DEFAULT now()
```

#### `permissions` table
```sql
id              UUID PRIMARY KEY
role_id         UUID REFERENCES roles(id)
module          VARCHAR(100)   -- e.g. "cases", "work_orders", "contacts", "settings"
action          ENUM('read', 'create', 'update', 'delete', 'export')
is_granted      BOOLEAN DEFAULT true
```

#### `profiles` table
```sql
id              UUID PRIMARY KEY
name            VARCHAR(100) UNIQUE NOT NULL   -- e.g. "Field Technician", "Senior Dispatcher"
description     TEXT
role_id         UUID REFERENCES roles(id)
theme_preference ENUM('light', 'dark', 'system') DEFAULT 'system'
locale          VARCHAR(10) DEFAULT 'en-US'
timezone        VARCHAR(50) DEFAULT 'UTC'
created_at      TIMESTAMPTZ DEFAULT now()
```

### 2.3 Contacts Module UI — Pages

#### 2.3.1 Contacts List Page (`/contacts`)

Layout: same list pattern as Cases.

**Columns:** Avatar + Full Name · Email · Phone · Type (badge) · Account · Role (for users) · Status (Active/Inactive badge) · Last Modified

**Filters:** Type (User / Customer / All) · Role · Status · Account

**Actions per row:**
- Click row → navigate to Contact Detail
- Kebab menu → Edit / Deactivate / Delete

#### 2.3.2 Contact Detail Page (`/contacts/:id`)

Two-column layout (sidebar + main):

**Left Sidebar (240px):**
- Avatar (with upload capability)
- Full name, job title, company
- Quick actions: Send Email / Assign Case / Edit
- Activity feed (linked cases, WOs, appointments)

**Main Area (tabs):**
- **Details tab** — all contact fields, inline editable
- **Related tab** — linked Cases, Work Orders, Service Appointments
- **Activity tab** — timeline of all interactions
- **User Access tab** (only if `type = 'user'`) — username, role, profile, last login, MFA status, reset password button

### 2.4 REST API — Contacts

```
GET    /api/v1/contacts
GET    /api/v1/contacts/:id
POST   /api/v1/contacts
PATCH  /api/v1/contacts/:id
DELETE /api/v1/contacts/:id

GET    /api/v1/contacts/:id/related   → linked cases, WOs, appointments
GET    /api/v1/contacts/:id/activity  → activity timeline

GET    /api/v1/users
GET    /api/v1/users/:id
POST   /api/v1/users          → creates contact + user record together
PATCH  /api/v1/users/:id
POST   /api/v1/users/:id/reset-password
POST   /api/v1/users/:id/lock
POST   /api/v1/users/:id/unlock

GET    /api/v1/roles
POST   /api/v1/roles
PATCH  /api/v1/roles/:id
DELETE /api/v1/roles/:id

GET    /api/v1/profiles
POST   /api/v1/profiles
PATCH  /api/v1/profiles/:id
DELETE /api/v1/profiles/:id
```

### 2.5 RBAC Enforcement

#### Frontend
- On app load, fetch `/api/v1/auth/me` which returns the current user's role + permissions array.
- Store in an `AuthContext`.
- Use a `usePermission(module, action)` hook to conditionally render buttons and routes.
- Protected routes: wrap with `<RequirePermission module="contacts" action="read">`.
- Never rely solely on frontend guards — all enforcement must happen on the backend too.

#### Backend
- Middleware `requirePermission(module, action)` checks `users.role_id → permissions` for every relevant route.
- Return `403 Forbidden` with a structured error body if permission is denied.

---

## SCOPE 3 — ADMIN SETTINGS PANEL

### 3.1 Entry Point

The existing **Settings** button (sidebar, bottom) opens a full-page settings route at `/settings`. Add a sub-navigation sidebar inside Settings with the following sections:

```
Settings
├── General
├── Users & Access
│   ├── Users
│   ├── Roles
│   └── Profiles
└── Field Configuration
    ├── Cases
    ├── Work Orders
    ├── Service Appointments
    ├── Field Service
    └── Contacts
```

Only users with `role = Administrator` can access `/settings`. Redirect others to `/403`.

### 3.2 Users Management (`/settings/users`)

#### List View
Table columns: Avatar · Name · Email · Role · Profile · Status · Last Login · Actions

Actions: **+ New User** (primary button, top-right) · Edit · Reset Password · Lock/Unlock · Delete

#### Create / Edit User Modal (or slide-out panel)

Fields:
```
Personal Information
  First Name *        Last Name *
  Email *             Phone
  Mobile              Job Title
  Department          Account (lookup)

User Access
  Username *
  Password *          (create only; on edit: "Reset Password" button)
  Confirm Password *  (create only)
  Role *              (dropdown — fetched from /api/v1/roles)
  Profile             (dropdown — fetched from /api/v1/profiles)
  Status              Active / Inactive toggle

Preferences
  Theme               Light / Dark / System
  Locale              (dropdown)
  Timezone            (dropdown)
```

Validation rules:
- Email: valid format + unique check via `POST /api/v1/users/check-email`
- Username: alphanumeric + underscores, 3–50 chars, unique check
- Password: min 8 chars, 1 uppercase, 1 number, 1 special character
- All `*` fields are required

### 3.3 Roles Management (`/settings/roles`)

#### List View
Cards grid (3 columns on desktop) showing: Role name · Description · User count · Permission summary · Edit / Delete buttons

System roles (is_system = true) show a lock icon and cannot be deleted.

#### Create / Edit Role Panel (slide-out, 480px)

```
Role Name *
Description

Permissions Matrix (grouped by module):
┌─────────────────┬───────┬────────┬────────┬────────┬────────┐
│ Module          │ Read  │ Create │ Update │ Delete │ Export │
├─────────────────┼───────┼────────┼────────┼────────┼────────┤
│ Dashboard       │  ☑   │        │        │        │        │
│ Cases           │  ☑   │  ☑    │  ☑    │        │  ☑    │
│ Work Orders     │  ☑   │  ☑    │  ☑    │        │        │
│ Service Appts   │  ☑   │  ☑    │  ☑    │        │        │
│ Field Service   │  ☑   │        │  ☑    │        │        │
│ Contacts        │  ☑   │  ☑    │  ☑    │  ☑    │  ☑    │
│ Settings        │       │        │        │        │        │
└─────────────────┴───────┴────────┴────────┴────────┴────────┘

"Select All" per row and per column shortcuts.
```

Save button → `POST /api/v1/roles` or `PATCH /api/v1/roles/:id`.

### 3.4 Profiles Management (`/settings/profiles`)

Similar card-grid layout to Roles.

#### Create / Edit Profile Panel

```
Profile Name *
Description
Associated Role *     (dropdown)
Default Theme         Light / Dark / System
Default Locale
Default Timezone
```

Profiles are templates that pre-fill user preferences when a new user is created with that profile.

### 3.5 Field Configuration (`/settings/fields/:object`)

This is the most complex section. It allows admins to control how each field behaves for each object.

#### 3.5.1 Data Model

```sql
-- field_configs table
id              UUID PRIMARY KEY
object_name     VARCHAR(100)   -- 'cases', 'work_orders', 'service_appointments', 'contacts', etc.
field_name      VARCHAR(100)   -- matches the actual database column name
label           VARCHAR(150)   -- display label (overridable per deployment)
field_type      ENUM('text', 'number', 'date', 'datetime', 'select', 'multiselect', 'lookup', 'boolean', 'textarea', 'email', 'phone', 'url')
is_required     BOOLEAN DEFAULT false
is_editable     BOOLEAN DEFAULT true
is_readonly     BOOLEAN DEFAULT false
is_hidden       BOOLEAN DEFAULT false
display_order   INTEGER DEFAULT 0
section         VARCHAR(100)   -- which UI section/card this field appears in
help_text       TEXT
default_value   TEXT
validation_rule JSONB          -- {"min": 0, "max": 100} or {"pattern": "^[A-Z]"}
options         JSONB          -- for select/multiselect: [{"value": "open", "label": "Open"}]
role_overrides  JSONB          -- {"technician": {"is_readonly": true}, "admin": {"is_editable": true}}
created_at      TIMESTAMPTZ DEFAULT now()
updated_at      TIMESTAMPTZ DEFAULT now()

UNIQUE(object_name, field_name)
```

#### 3.5.2 Field Configuration UI

Left panel: Object selector tabs (Cases / Work Orders / Service Appointments / Field Service / Contacts)

Right panel: Field list table

```
Columns: Field Label · Field Name · Type · Required · Editable · Read-Only · Hidden · Section · Order · Actions
```

Each row is inline-editable. Toggle cells for boolean flags (Required / Editable / Read-Only / Hidden) use pill toggles.

**Drag to reorder** (within the same section) using dnd-kit.

**+ Add Custom Field** button → opens a modal:
```
Field Label *
Field Name *      (auto-generated from label, editable, snake_case)
Field Type *      (dropdown)
Section           (dropdown — existing sections or "New Section…")
Display Order
Help Text
Default Value
Is Required       toggle
Is Editable       toggle
Is Read-Only      toggle
Is Hidden         toggle

[If type = select/multiselect]
Options           Dynamic list: + Add Option (label + value per row)

[If type = number]
Min Value / Max Value

Validation Rule   (advanced — raw JSON, collapsible)
```

#### 3.5.3 Role Override Panel

Each field row has an **"Overrides"** action that opens a side panel showing per-role overrides:

```
Field: Status
Object: Cases

┌──────────────┬──────────┬──────────┬───────────┐
│ Role         │ Required │ Editable │ Read-Only │
├──────────────┼──────────┼──────────┼───────────┤
│ Administrator│    -     │    ✓    │     -     │
│ Dispatcher   │    -     │    ✓    │     -     │
│ Technician   │    -     │    -    │     ✓    │
│ Viewer       │    -     │    -    │     ✓    │
└──────────────┴──────────┴──────────┴───────────┘

"-" means "inherit from base config"
```

#### 3.5.4 API — Field Configuration

```
GET    /api/v1/field-configs/:object              → all fields for an object
PATCH  /api/v1/field-configs/:object/:fieldName   → update single field config
POST   /api/v1/field-configs/:object              → add custom field
DELETE /api/v1/field-configs/:object/:fieldName   → remove custom field only
POST   /api/v1/field-configs/:object/reorder      → save display order array

GET    /api/v1/field-configs/:object/schema       → resolved schema for current user's role
                                                    (used by frontend to build forms dynamically)
```

#### 3.5.5 Frontend Form Engine

The frontend must consume `/api/v1/field-configs/:object/schema` to dynamically render forms and detail views:

```javascript
// DynamicForm component
const DynamicForm = ({ object, record, onSave }) => {
  const { data: schema } = useFieldSchema(object); // fetches /field-configs/:object/schema
  // Groups fields by `section`, orders by `display_order`
  // Renders correct input type per `field_type`
  // Enforces `is_required`, `is_readonly`, `is_hidden` per current user's role
};
```

The schema response must be **role-resolved** — the backend applies `role_overrides` before sending, so the frontend receives a clean, flat schema without needing to resolve overrides itself.

---

## TECHNICAL IMPLEMENTATION NOTES

### Authentication
- JWT-based auth: `POST /api/v1/auth/login` → `{ access_token, refresh_token }`
- Store access token in memory (not localStorage). Store refresh token in `httpOnly` cookie.
- `GET /api/v1/auth/me` → current user with role + resolved permissions.
- Axios interceptor automatically refreshes token on 401.

### Error Handling
All API errors must use this envelope:
```json
{
  "errors": [
    { "field": "email", "code": "DUPLICATE", "message": "Email already in use." }
  ]
}
```
Frontend maps field-level errors back to form controls using the `field` key.

### Audit Log
Every `POST`, `PATCH`, `DELETE` operation must write to an `audit_logs` table:
```sql
id, user_id, action, object_name, object_id, changes (JSONB), ip_address, created_at
```

### Database Migrations
Use a migration tool (Flyway / Knex migrations / Prisma Migrate). Every schema change must be in a versioned migration file. Seed data must include:
- Default roles: `Administrator`, `Dispatcher`, `Technician`, `Viewer`
- Default profiles for each role
- Default field configurations for all 5 objects

---

## ACCEPTANCE CRITERIA

| # | Criterion |
|---|-----------|
| 1 | All list pages fetch data from the API with pagination, sorting, and filtering |
| 2 | All detail pages support inline field editing with PATCH on blur |
| 3 | Create/Edit forms validate required fields before submission |
| 4 | Contacts module lists, detail, and user-access tab all function end-to-end |
| 5 | Admin can create a user with username, password, role, and profile |
| 6 | Admin can create a role and set permissions per module per action |
| 7 | Admin can configure any field as required / editable / read-only / hidden |
| 8 | Role overrides on fields are respected in the UI for non-admin users |
| 9 | Dynamic form engine renders forms based on field config schema |
| 10 | All protected routes redirect to `/403` when permission is denied |
| 11 | Loading, error, and empty states are handled on every data-dependent component |
| 12 | Dark mode is fully supported across all new components per Design System tokens |
