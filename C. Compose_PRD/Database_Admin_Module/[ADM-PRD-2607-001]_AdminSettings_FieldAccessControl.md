# Product Requirements Document
## PRD-02 — Admin Settings & User-Level Field Access Control
### UT Service Console — Contact-Based User Permissions & Settings Panel

**Document Version:** 1.0  
**Status:** Draft — For Engineering Review  
**Date:** 2026-06-06  
**Prepared By:** Product Team  
**Scope:** Admin Settings Module · Contact Settings Panel · Field-Level Access Control · User Permission System

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Glossary](#2-glossary)
3. [Permission Model Overview](#3-permission-model-overview)
4. [Admin Settings Module — Global Configuration](#4-admin-settings-module--global-configuration)
5. [Field Access Control — Architecture](#5-field-access-control--architecture)
6. [Contact Record — Settings Panel](#6-contact-record--settings-panel)
7. [Database Schema](#7-database-schema)
8. [UI Specification — Admin Settings](#8-ui-specification--admin-settings)
9. [UI Specification — Contact Settings Panel](#9-ui-specification--contact-settings-panel)
10. [Permission Evaluation Logic](#10-permission-evaluation-logic)
11. [Module & Field Registry](#11-module--field-registry)
12. [API & RLS Integration](#12-api--rls-integration)
13. [Acceptance Criteria](#13-acceptance-criteria)
14. [Open Issues & Future Scope](#14-open-issues--future-scope)

---

## 1. Executive Summary

This PRD specifies the **Admin-level Settings system** and the **User-level field access control** mechanism for the UT Service Console.

The system works on two tiers:

**Tier 1 — Admin Settings (Global)**  
Admin users access a dedicated Settings module where they define, for each module and each field, which *user roles* can:
- **View** the field (field is visible)
- **Edit** the field (field is editable)
- **Hide** the field (field does not appear)

**Tier 2 — Contact Settings Panel (Per-User Override)**  
Each Contact record that is linked to a portal user has a **Settings Panel** in the Contact detail view. Admin users can use this panel to apply per-user overrides — granting or restricting specific field permissions for that individual user, overriding the global role defaults.

This two-tier model means:
- Role defaults set the baseline for groups of users
- Per-contact overrides allow fine-grained control for individual users without changing the entire role's settings

When a user logs into the UT Service Console, their effective permissions are resolved from their role defaults plus any personal overrides set on their linked Contact record.

---

## 2. Glossary

| Term | Definition |
|------|------------|
| **Admin User** | A user with role = `Admin` or `Super Admin` in `user_profiles`. Has full access to the Settings module |
| **User** | A user with role = `User`, `Viewer`, `Technician`, or `Manager`. Subject to field access rules |
| **Contact** | A record in the `contacts` table. When `is_portal_user = TRUE`, this Contact is linked to a CRM login account |
| **Portal User** | A Contact who can log into the UT Service Console (has a Supabase auth account) |
| **Role Default** | Field access settings defined at the Role level in Admin Settings (applies to all users of that role) |
| **Contact Override** | Field access settings defined specifically on a Contact record. Overrides the role default for that individual |
| **Field Access Level** | One of: `View` (read only), `Edit` (read + write), `Hidden` (not displayed) |
| **Module** | A top-level section of the UT Service Console (Case, Work Order, Shift, etc.) |
| **Field** | A specific data field within a module (e.g., `priority`, `billing_amount`, `sla_due_date`) |
| **Settings Panel** | A dedicated tab/section inside the Contact detail view for managing that user's permissions |

---

## 3. Permission Model Overview

### 3.1 Two-Tier Hierarchy

```
TIER 1: Role Default (Global)
 └─ Admin sets field-level access per Role, per Module
    Example: "Technician role → Work Order module → billing_amount → HIDDEN"

TIER 2: Contact Override (Per-User)
 └─ Admin opens a specific Contact's Settings Panel
    Example: "John Doe (Technician) → Work Order → billing_amount → VIEW"
    (This overrides the role default for John Doe only)
```

### 3.2 Permission Resolution Order

When the system evaluates what a user can see/edit:

```
1. Check field_access_overrides WHERE contact_id = user's contact AND module = X AND field = Y
   → If override exists: USE override value

2. Else check role_field_access WHERE role = user's role AND module = X AND field = Y
   → If role setting exists: USE role value

3. Else: default to EDIT (most permissive, fallback for unmapped fields)
```

### 3.3 Access Level Definitions

| Level | Field Visible? | Field Editable? | Notes |
|-------|---------------|----------------|-------|
| `Edit` | ✅ Yes | ✅ Yes | Full access — user can read and change value |
| `View` | ✅ Yes | ❌ No | Read-only — user sees the value but cannot change it |
| `Hidden` | ❌ No | ❌ No | Field does not appear in the UI at all |

### 3.4 Role Hierarchy

| Role | Can Access Admin Settings? | Default Permissions |
|------|--------------------------|---------------------|
| `Super Admin` | Full access | Everything = Edit |
| `Admin` | Full access | Everything = Edit |
| `Manager` | View only | As configured |
| `User` | No | As configured |
| `Technician` | No | As configured |
| `Viewer` | No | As configured |

---

## 4. Admin Settings Module — Global Configuration

### 4.1 Module Access

Admin Settings is accessible from:
- Header → Settings icon (gear) → "Admin Settings"
- Sidebar → "Settings" section (only visible to Admin / Super Admin roles)

### 4.2 Admin Settings Navigation Structure

```
⚙ Admin Settings
├── 👥 User Management
│    ├── Users List
│    ├── Roles
│    └── Invite User
│
├── 🔐 Field Access Control       ← Primary focus of this PRD
│    ├── By Role
│    │    ├── Case
│    │    ├── Work Order
│    │    ├── Service Appointment
│    │    ├── Field Service
│    │    ├── Shift
│    │    ├── Plant
│    │    ├── Work Center
│    │    ├── Service Territory
│    │    ├── Asset
│    │    ├── Account
│    │    └── Contact
│    └── By User (links to Contact Settings Panel)
│
├── 🏢 Organization Settings
│    ├── Company Profile
│    ├── Timezone & Locale
│    └── Business Hours
│
├── 📧 Notification Settings
│    ├── Email Templates
│    └── Notification Rules
│
└── 🔗 Integration Settings
     ├── API Keys
     └── Webhooks
```

### 4.3 Field Access Control — By Role

This is the primary configuration screen. It allows an Admin to configure which fields each role can see and edit, per module.

#### Layout: Role + Module Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ⚙ Field Access Control                                          [Save Changes]│
├─────────────────────────────────────────────────────────────────────────────┤
│ Role: [Manager ▼]        Module: [Case ▼]                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ Section: Customer Information                                                │
│ ┌──────────────────────────────┬─────────────────────────────────────────┐  │
│ │ Field                        │ Access Level                            │  │
│ ├──────────────────────────────┼─────────────────────────────────────────┤  │
│ │ Subject                      │ ◉ Edit  ○ View  ○ Hidden                │  │
│ │ Account                      │ ○ Edit  ◉ View  ○ Hidden                │  │
│ │ Contact                      │ ◉ Edit  ○ View  ○ Hidden                │  │
│ │ Priority                     │ ◉ Edit  ○ View  ○ Hidden                │  │
│ │ Status                       │ ○ Edit  ○ View  ◉ Hidden                │  │
│ │ Billing Amount               │ ○ Edit  ○ View  ◉ Hidden                │  │
│ │ SLA Due Date                 │ ○ Edit  ◉ View  ○ Hidden                │  │
│ │ Resolution Notes             │ ◉ Edit  ○ View  ○ Hidden                │  │
│ └──────────────────────────────┴─────────────────────────────────────────┘  │
│                                                                              │
│ Section: System Information                                                  │
│ ┌──────────────────────────────┬─────────────────────────────────────────┐  │
│ │ Case Number                  │ ○ Edit  ◉ View  ○ Hidden                │  │
│ │ Created At                   │ ○ Edit  ◉ View  ○ Hidden                │  │
│ │ Updated At                   │ ○ Edit  ◉ View  ○ Hidden                │  │
│ │ Owner                        │ ◉ Edit  ○ View  ○ Hidden                │  │
│ └──────────────────────────────┴─────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Quick Actions

- **Copy from Role** — Copy all settings from another role as a starting point
- **Reset to Default** — Reset all fields to `Edit` for this role/module
- **Bulk Set** — Select multiple fields and apply one access level to all

---

## 5. Field Access Control — Architecture

### 5.1 How the Frontend Consumes Permissions

When a user's session starts, the app loads their effective permissions into a client-side store:

```javascript
// Fetched on login / session start
const effectivePermissions = await resolveUserPermissions(userId, orgId);

// Structure:
// {
//   "case": {
//     "subject": "edit",
//     "priority": "edit",
//     "billing_amount": "hidden",
//     "sla_due_date": "view",
//     ...
//   },
//   "work_order": { ... },
//   "shift": { ... },
//   ...
// }
```

### 5.2 Field Rendering Based on Permission

In every detail view and create form, each field checks the permission store:

```jsx
function FieldWrapper({ module, fieldName, children, editComponent, value }) {
  const perm = usePermission(module, fieldName); // 'edit' | 'view' | 'hidden'

  if (perm === 'hidden') return null;

  if (perm === 'view') {
    return (
      <div className="field-read-only">
        <span style={{ color: 'var(--text-tertiary)' }}>{fieldName}</span>
        <span style={{ color: 'var(--text-secondary)' }}>{value}</span>
      </div>
    );
  }

  // perm === 'edit'
  return children; // Full edit component rendered
}
```

### 5.3 Admin Override Visual Indicator

When an Admin views a Contact's Settings Panel, fields with an active override are visually differentiated:

- **Role Default** — shown with a label `Role Default` in muted text
- **Overridden** — shown with a golden indicator `◆ Override` in `var(--accent)` color

### 5.4 Security: Server-Side Enforcement

Frontend permission checks are UI-only (UX convenience). The actual security is enforced in:

1. **Supabase RLS policies** — restrict SELECT/UPDATE at the database level based on role
2. **Supabase Functions (Edge Functions)** — validate field-level permissions before applying updates

```sql
-- Example: Prevent Users from updating billing_amount
CREATE POLICY "restrict_billing_field" ON cases
  FOR UPDATE
  USING (
    -- Allow if user is Admin
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role IN ('Admin', 'Super Admin')
    )
    OR
    -- Allow if user's contact has an Edit override for billing_amount
    EXISTS (
      SELECT 1 FROM field_access_overrides fao
      JOIN contacts c ON fao.contact_id = c.id
      WHERE c.linked_user_id = auth.uid()
        AND fao.module = 'case'
        AND fao.field_name = 'billing_amount'
        AND fao.access_level = 'edit'
    )
  );
```

---

## 6. Contact Record — Settings Panel

### 6.1 Overview

Every Contact record that has `is_portal_user = TRUE` displays an additional **Settings** tab in the Contact detail view. This tab is only visible and editable by Admin users.

The Settings Panel has two sections:
1. **Account Overview** — shows the portal user's login email, role, last login, and status
2. **Field Access Overrides** — allows Admin to set per-field, per-module overrides for this specific user

### 6.2 Settings Panel Access Path

```
Contact Module
 └── Open a Contact Record
      └── Tabs: [Details] [Activity] [Settings]  ← (only visible if is_portal_user = TRUE AND current user is Admin)
           └── Settings Tab
                ├── Portal Account Summary
                └── Field Access Overrides
```

### 6.3 Settings Tab — Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 👤 John Doe                                                                 │
│ Technician · Sutera Engineering                                             │
├──────────────┬──────────────────────────────────────────────────────────────┤
│ [Details]    │  [Activity]  │  [Settings ⚙]                                │
├──────────────┴──────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─ Portal Account ──────────────────────────────────────────────────────┐  │
│  │  Login Email    john.doe@sutera.co.id              [Verified ✓]       │  │
│  │  Role           Technician                         [Change Role ▼]    │  │
│  │  Last Login     Today, 08:34                                          │  │
│  │  Status         Active                             [Deactivate]       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌─ Field Access Overrides ──────────────────────────────────────────────┐  │
│  │                                                                        │  │
│  │  Module: [Case ▼]   [+ Add Override]   [Reset All to Role Default]   │  │
│  │                                                                        │  │
│  │  ℹ Role Default for Technician applied. 3 overrides active.           │  │
│  │                                                                        │  │
│  │  ┌──────────────────────────┬──────────────────┬────────────────────┐ │  │
│  │  │ Field                    │ Role Default     │ This User          │ │  │
│  │  ├──────────────────────────┼──────────────────┼────────────────────┤ │  │
│  │  │ Subject                  │ Edit             │ — (same)           │ │  │
│  │  │ Priority                 │ View             │ ◆ Edit             │ │  │
│  │  │ Billing Amount           │ Hidden           │ ◆ View             │ │  │
│  │  │ SLA Due Date             │ View             │ — (same)           │ │  │
│  │  │ Resolution Notes         │ Edit             │ ◆ Hidden           │ │  │
│  │  │ Account                  │ View             │ — (same)           │ │  │
│  │  └──────────────────────────┴──────────────────┴────────────────────┘ │  │
│  │                                                [Save Overrides]       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.4 Settings Panel — Interaction Details

#### Viewing Overrides
- Each module is shown in a collapsible section (default: all collapsed)
- Admin selects a module from the dropdown to expand its fields
- Each field row shows: Field Name | Role Default | This User's Override
- Fields with active overrides display the ◆ indicator in `var(--accent)` color

#### Adding an Override
1. Admin clicks "**+ Add Override**" or clicks the "—" cell in the "This User" column
2. An inline select dropdown appears with options: `Edit | View | Hidden`
3. Admin selects the desired level → row updates to show the new override with ◆ indicator
4. Admin clicks **Save Overrides** → saved to `field_access_overrides` table

#### Removing an Override
- Click the ◆ indicator → confirmation tooltip "Remove override and revert to role default?"
- Click **Remove** → override row deleted from `field_access_overrides`

#### Reset All
- "Reset All to Role Default" → prompts confirmation → deletes all `field_access_overrides` rows for this contact
- User then falls back entirely to role defaults

#### Change Role
- Admin can change the user's role directly from the Portal Account card
- Role change immediately affects all role defaults
- Existing overrides are preserved (admin can review them after role change)

### 6.5 Non-Portal Contacts

If `is_portal_user = FALSE`, the Settings tab is not shown in the Contact detail view. If Admin later enables portal access, the Settings tab appears.

---

## 7. Database Schema

### 7.1 Role Field Access (Global Defaults)

```sql
CREATE TABLE role_field_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('Super Admin', 'Admin', 'Manager', 'User', 'Technician', 'Viewer')),
  module TEXT NOT NULL, -- 'case', 'work_order', 'shift', etc.
  field_name TEXT NOT NULL,
  access_level TEXT NOT NULL CHECK (access_level IN ('edit', 'view', 'hidden')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (organization_id, role, module, field_name)
);
```

### 7.2 Contact Field Access Overrides (Per-User)

```sql
CREATE TABLE field_access_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  module TEXT NOT NULL,
  field_name TEXT NOT NULL,
  access_level TEXT NOT NULL CHECK (access_level IN ('edit', 'view', 'hidden')),
  override_reason TEXT, -- Optional: admin note explaining why override was added
  set_by_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (organization_id, contact_id, module, field_name)
);
```

### 7.3 User Profiles (Links Supabase Auth User to Contact)

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  role TEXT NOT NULL DEFAULT 'User' CHECK (role IN ('Super Admin', 'Admin', 'Manager', 'User', 'Technician', 'Viewer')),
  display_name TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 7.4 Permission Resolution View

A database view that resolves effective permissions (used by Edge Functions and the permission cache):

```sql
CREATE OR REPLACE VIEW effective_user_permissions AS
SELECT
  up.user_id,
  up.organization_id,
  up.role,
  up.contact_id,
  COALESCE(fao.module, rfa.module) AS module,
  COALESCE(fao.field_name, rfa.field_name) AS field_name,
  CASE
    WHEN fao.access_level IS NOT NULL THEN fao.access_level  -- Override wins
    ELSE rfa.access_level                                     -- Role default
  END AS access_level,
  fao.id IS NOT NULL AS is_overridden
FROM user_profiles up
LEFT JOIN role_field_access rfa
  ON rfa.organization_id = up.organization_id
  AND rfa.role = up.role
LEFT JOIN field_access_overrides fao
  ON fao.contact_id = up.contact_id
  AND fao.organization_id = up.organization_id
  AND fao.module = rfa.module
  AND fao.field_name = rfa.field_name;
```

### 7.5 Indexes

```sql
CREATE INDEX idx_role_field_access_lookup 
  ON role_field_access (organization_id, role, module);

CREATE INDEX idx_field_access_overrides_contact 
  ON field_access_overrides (contact_id, organization_id, module);

CREATE INDEX idx_user_profiles_user_id 
  ON user_profiles (user_id);

CREATE INDEX idx_user_profiles_contact_id 
  ON user_profiles (contact_id);
```

---

## 8. UI Specification — Admin Settings

### 8.1 Navigation & Layout

The Admin Settings module uses the standard UT Service Console layout:
- Left sidebar with Settings sub-navigation
- Main content area with the configuration panel
- All UI tokens from the Design System (Design_System.md v1.0)

### 8.2 Field Access Control Screen — Design Tokens

| Element | Token |
|---------|-------|
| Page heading | `text-2xl font-bold`, `var(--text-main)` |
| Section headers | `text-lg font-semibold`, `var(--text-main)` |
| Table header row | `bg: var(--bg-light)`, `text-xs font-bold uppercase tracking-wider`, `var(--text-muted)` |
| Table row (default) | `bg: var(--bg-card)` |
| Table row (hover) | `bg: var(--bg-light)` |
| Role dropdown | `.input-field` class |
| Module dropdown | `.input-field` class |
| Radio buttons | Custom styled with accent gold for selected state |
| Selected radio | `background: var(--accent)`, `border: 2px solid var(--accent-dark)` |
| Save button | `.btn-primary` |
| Copy/Reset buttons | `.btn-secondary` |

### 8.3 Access Level Radio Group (Field-Level)

Each row in the table has a 3-option radio group:

```jsx
<div className="flex items-center gap-4">
  {['edit', 'view', 'hidden'].map(level => (
    <label key={level} className="flex items-center gap-1.5 cursor-pointer">
      <input
        type="radio"
        name={`${fieldName}-access`}
        value={level}
        checked={currentValue === level}
        onChange={() => handleChange(fieldName, level)}
        className="accent-[var(--accent)]"
      />
      <span className="text-sm text-[var(--text-secondary)] capitalize">
        {level}
      </span>
    </label>
  ))}
</div>
```

### 8.4 Copy from Role Dialog

Modal appears when Admin clicks "Copy from Role":

```
┌─────────────────────────────────────────────┐
│ Copy Settings From Role                      │
│                                              │
│ You are configuring: Technician · Case       │
│                                              │
│ Copy settings from:                          │
│ [Manager ▼]                                 │
│                                              │
│ ⚠ This will overwrite all current settings  │
│   for the Technician role in the Case        │
│   module. This cannot be undone.             │
│                                              │
│              [Cancel]   [Copy Settings]      │
└─────────────────────────────────────────────┘
```

### 8.5 Saved State Feedback

- Changes are tracked client-side (dirty state)
- Unsaved changes indicator: a yellow dot `●` next to "Field Access Control" in sidebar
- On Save: success toast "Field access settings saved for Technician · Case"
- On error: error toast with retry action

---

## 9. UI Specification — Contact Settings Panel

### 9.1 Settings Tab Visibility Logic

```jsx
// In Contact detail view tab bar
const showSettingsTab = (
  currentContact.is_portal_user === true &&
  currentUserRole === 'Admin' || currentUserRole === 'Super Admin'
);
```

### 9.2 Portal Account Card — Design

```
┌────────────────────────────────────────────────────┐
│ Portal Account                              [Active]│
├────────────────────────────────────────────────────┤
│ Login Email    john.doe@sutera.co.id  [✓ Verified] │
│ Role           Technician             [Change ▼]   │
│ Last Login     Today, 08:34 WIB                    │
│ Member Since   2025-01-15                          │
├────────────────────────────────────────────────────┤
│          [Reset Password]     [Deactivate Account] │
└────────────────────────────────────────────────────┘
```

| Element | Token |
|---------|-------|
| Card | `.card` class |
| Card title | `text-[11px] font-bold uppercase tracking-wider`, `var(--text-muted)` |
| Status badge (Active) | `badge-resolved` style |
| Status badge (Inactive) | `badge-closed` style |
| Field labels | `text-xs`, `var(--text-tertiary)` |
| Field values | `text-sm font-medium`, `var(--text-secondary)` |
| Reset Password btn | `.btn-secondary` (compact) |
| Deactivate btn | `text-[var(--color-danger)] border-[var(--color-danger)]` |

### 9.3 Field Access Overrides Table — Design

#### Override indicator (◆ icon)
- Color: `var(--accent)` (#F5C800)
- Size: 8px solid diamond
- Tooltip on hover: "Override active – click to remove"

#### "This User" column states

| State | Display |
|-------|---------|
| No override | `—` in `var(--text-muted)` |
| Override = Edit | `◆ Edit` in `var(--accent)` |
| Override = View | `◆ View` in `var(--accent)` |
| Override = Hidden | `◆ Hidden` in `var(--accent)` |

#### Inline override editor (when Admin clicks "—" or override value)
```
[Edit ▼]    ← Appears inline in the "This User" cell
```
Options:
- `Edit` — full access
- `View` — read only
- `Hidden` — not visible
- `Remove Override` — reverts to role default (only shown if override exists)

### 9.4 Module Selector

Admin selects which module's fields to view/edit in the Settings Panel. Modules available:

```
[Case] [Work Order] [Service Appointment] [Field Service] [Shift]
[Plant] [Work Center] [Service Territory] [Asset] [Account] [Contact]
```

Rendered as a horizontal pill tab strip using the Design System's tab pattern.

### 9.5 Save Overrides Button

- Position: Bottom right of the Field Access Overrides card
- Style: `.btn-primary`
- Disabled state when no changes are pending
- On click: saves all dirty override rows in a single batch upsert

```javascript
const { error } = await supabase
  .from('field_access_overrides')
  .upsert(
    dirtyOverrides.map(o => ({
      organization_id: orgId,
      contact_id: contactId,
      module: o.module,
      field_name: o.fieldName,
      access_level: o.accessLevel,
      set_by_user_id: currentUserId,
    })),
    { onConflict: 'organization_id,contact_id,module,field_name' }
  );
```

---

## 10. Permission Evaluation Logic

### 10.1 Client-Side Permission Cache

On session start (or when user permissions change), the app fetches and caches:

```javascript
async function loadUserPermissions(userId, orgId) {
  const { data } = await supabase
    .from('effective_user_permissions')
    .select('module, field_name, access_level, is_overridden')
    .eq('user_id', userId)
    .eq('organization_id', orgId);

  // Build lookup map
  const permMap = {};
  data.forEach(({ module, field_name, access_level }) => {
    if (!permMap[module]) permMap[module] = {};
    permMap[module][field_name] = access_level;
  });

  return permMap;
}
```

### 10.2 Permission Hook

```javascript
function usePermission(module, fieldName) {
  const { permissions } = usePermissionsContext();
  const { role } = useUser();
  
  // Admins always have full edit access
  if (role === 'Admin' || role === 'Super Admin') return 'edit';
  
  return permissions?.[module]?.[fieldName] ?? 'edit'; // Default: edit
}
```

### 10.3 Bulk Permission Check (for forms)

```javascript
function useModulePermissions(module) {
  const { permissions } = usePermissionsContext();
  return {
    can: (fieldName, level = 'edit') => {
      const actual = permissions?.[module]?.[fieldName] ?? 'edit';
      const levels = ['hidden', 'view', 'edit'];
      return levels.indexOf(actual) >= levels.indexOf(level);
    },
    accessLevel: (fieldName) => permissions?.[module]?.[fieldName] ?? 'edit',
  };
}

// Usage in a form component:
const { can, accessLevel } = useModulePermissions('case');
can('billing_amount', 'view')  // → true/false
accessLevel('priority')         // → 'edit' | 'view' | 'hidden'
```

### 10.4 Permission Cache Invalidation

Permissions cache is invalidated (and re-fetched) when:
- Admin saves changes in Field Access Control (Admin Settings)
- Admin saves overrides in a Contact's Settings Panel
- User's role is changed
- User's account is deactivated

Cache refresh uses Supabase Realtime channel on `role_field_access` and `field_access_overrides` tables.

---

## 11. Module & Field Registry

This registry defines all fields that are subject to permission control, organized by module.

### 11.1 Case

| Field Name | Label | Default (User) | Default (Technician) | Default (Manager) |
|------------|-------|---------------|---------------------|------------------|
| `subject` | Subject | Edit | Edit | Edit |
| `description` | Description | Edit | Edit | Edit |
| `status` | Status | View | View | Edit |
| `priority` | Priority | View | View | Edit |
| `case_type` | Case Type | View | View | Edit |
| `case_origin` | Case Origin | View | View | Edit |
| `account_id` | Account | View | View | Edit |
| `contact_id` | Contact | Edit | Edit | Edit |
| `asset_id` | Asset | View | View | Edit |
| `owner_user_id` | Owner | View | Hidden | Edit |
| `plant_id` | Plant | View | View | Edit |
| `billing_status` | Billing Status | Hidden | Hidden | View |
| `billing_amount` | Billing Amount | Hidden | Hidden | View |
| `sla_due_date` | SLA Due Date | View | View | Edit |
| `sla_status` | SLA Status | View | View | View |
| `resolution_notes` | Resolution Notes | Edit | Edit | Edit |
| `case_number` | Case Number | View | View | View |
| `created_at` | Created At | View | View | View |

### 11.2 Work Order

| Field Name | Label | Default (User) | Default (Technician) | Default (Manager) |
|------------|-------|---------------|---------------------|------------------|
| `subject` | Subject | Edit | Edit | Edit |
| `description` | Description | Edit | Edit | Edit |
| `status` | Status | View | View | Edit |
| `priority` | Priority | View | View | Edit |
| `wo_type` | WO Type | View | View | Edit |
| `case_id` | Case | View | View | Edit |
| `account_id` | Account | View | View | Edit |
| `asset_id` | Asset | View | View | Edit |
| `plant_id` | Plant | View | View | Edit |
| `work_center_id` | Work Center | View | View | Edit |
| `service_territory_id` | Service Territory | View | View | Edit |
| `start_date` | Start Date | View | View | Edit |
| `end_date` | End Date | View | View | Edit |
| `estimated_duration_minutes` | Est. Duration | View | Edit | Edit |
| `actual_duration_minutes` | Actual Duration | View | Edit | Edit |
| `owner_user_id` | Owner | View | Hidden | Edit |

### 11.3 Service Appointment

| Field Name | Label | Default (User) | Default (Technician) | Default (Manager) |
|------------|-------|---------------|---------------------|------------------|
| `subject` | Subject | View | View | Edit |
| `status` | Status | View | Edit | Edit |
| `scheduled_start` | Scheduled Start | View | View | Edit |
| `scheduled_end` | Scheduled End | View | View | Edit |
| `actual_start` | Actual Start | Hidden | Edit | Edit |
| `actual_end` | Actual End | Hidden | Edit | Edit |
| `is_emergency` | Is Emergency | View | View | Edit |
| `description` | Description | View | Edit | Edit |

### 11.4 Shift

| Field Name | Label | Default (User) | Default (Technician) | Default (Manager) |
|------------|-------|---------------|---------------------|------------------|
| `shift_date` | Shift Date | View | View | Edit |
| `start_time` | Start Time | View | View | Edit |
| `end_time` | End Time | View | View | Edit |
| `type` | Shift Type | View | View | Edit |
| `status` | Status | View | View | Edit |
| `service_resource_id` | Service Resource | View | View | Edit |
| `service_territory_id` | Service Territory | View | View | Edit |
| `plant_id` | Plant | View | View | Edit |
| `notes` | Notes | View | Edit | Edit |

### 11.5 Contact

| Field Name | Label | Default (User) | Default (Technician) | Default (Manager) |
|------------|-------|---------------|---------------------|------------------|
| `first_name` | First Name | Edit | Edit | Edit |
| `last_name` | Last Name | Edit | Edit | Edit |
| `email` | Email | Edit | Edit | Edit |
| `phone` | Phone | Edit | Edit | Edit |
| `mobile` | Mobile | Edit | Edit | Edit |
| `title` | Title | Edit | Edit | Edit |
| `department` | Department | View | View | Edit |
| `role` | Role | Hidden | Hidden | View |
| `is_portal_user` | Portal User | Hidden | Hidden | Hidden |
| `portal_access_level` | Portal Access Level | Hidden | Hidden | Hidden |
| `status` | Status | View | View | Edit |
| `account_id` | Account | View | View | Edit |

---

## 12. API & RLS Integration

### 12.1 RLS for role_field_access (Admin only write)

```sql
ALTER TABLE role_field_access ENABLE ROW LEVEL SECURITY;

-- All users in org can read (for client-side permission loading)
CREATE POLICY "read_role_access" ON role_field_access
  FOR SELECT
  USING (
    organization_id = (
      SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
    )
  );

-- Only Admins can write
CREATE POLICY "admin_write_role_access" ON role_field_access
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
        AND organization_id = role_field_access.organization_id
        AND role IN ('Admin', 'Super Admin')
    )
  );
```

### 12.2 RLS for field_access_overrides (Admin only write, owner can read)

```sql
ALTER TABLE field_access_overrides ENABLE ROW LEVEL SECURITY;

-- Users can read their own overrides
CREATE POLICY "user_read_own_overrides" ON field_access_overrides
  FOR SELECT
  USING (
    contact_id = (
      SELECT contact_id FROM user_profiles WHERE user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
        AND organization_id = field_access_overrides.organization_id
        AND role IN ('Admin', 'Super Admin')
    )
  );

-- Only Admins can write
CREATE POLICY "admin_write_overrides" ON field_access_overrides
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
        AND organization_id = field_access_overrides.organization_id
        AND role IN ('Admin', 'Super Admin')
    )
  );
```

### 12.3 Supabase Edge Function — resolvePermissions

```typescript
// /functions/resolve-permissions/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { user_id, org_id } = await req.json();

  const { data } = await supabase
    .from('effective_user_permissions')
    .select('module, field_name, access_level, is_overridden')
    .eq('user_id', user_id)
    .eq('organization_id', org_id);

  const permMap: Record<string, Record<string, string>> = {};
  data?.forEach(({ module, field_name, access_level }) => {
    if (!permMap[module]) permMap[module] = {};
    permMap[module][field_name] = access_level;
  });

  return new Response(JSON.stringify(permMap), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

---

## 13. Acceptance Criteria

| ID | Criteria | Feature Area |
|----|----------|-------------|
| AC-01 | Admin can navigate to Settings → Field Access Control | Admin Settings |
| AC-02 | Admin can select a Role and a Module and see all fields with their current access levels | Admin Settings |
| AC-03 | Admin can change a field's access level and save it; the change is persisted to `role_field_access` | Admin Settings |
| AC-04 | "Copy from Role" correctly copies all settings from the source role to the target role/module | Admin Settings |
| AC-05 | "Reset to Default" sets all fields to `edit` for the selected role/module | Admin Settings |
| AC-06 | After saving role settings, users with that role see the updated field behavior within 1 session refresh | Admin Settings |
| AC-07 | Contact Settings tab is only visible when `is_portal_user = TRUE` AND current viewer is Admin | Contact Settings |
| AC-08 | Contact Settings tab is not visible to non-Admin users | Contact Settings |
| AC-09 | Admin can view the portal account summary (email, role, last login, status) in the Settings tab | Contact Settings |
| AC-10 | Admin can add, change, or remove a field access override for a specific Contact | Contact Settings |
| AC-11 | Fields with active overrides display the ◆ indicator | Contact Settings |
| AC-12 | "Reset All to Role Default" removes all overrides for the contact and confirms with the admin | Contact Settings |
| AC-13 | Override settings are saved to `field_access_overrides` with correct contact_id, module, field_name | DB |
| AC-14 | Permission resolution correctly prioritizes override over role default | Permission Logic |
| AC-15 | Admin and Super Admin always see all fields as Edit regardless of role_field_access settings | Permission Logic |
| AC-16 | A field set to `hidden` for a user does not appear in the detail view or create form | Frontend |
| AC-17 | A field set to `view` for a user renders as read-only — no edit control, no inline edit trigger | Frontend |
| AC-18 | A field set to `edit` for a user renders fully interactive with inline edit capability | Frontend |
| AC-19 | Permission cache is invalidated and refreshed after admin saves field access settings | Cache |
| AC-20 | Server-side (RLS/Edge Function) rejects write attempts to restricted fields even if frontend is bypassed | Security |

---

## 14. Open Issues & Future Scope

| ID | Topic | Status | Notes |
|----|-------|--------|-------|
| OI-001 | Section-level visibility (hide entire card/section for a role) | Future | Currently field-level only |
| OI-002 | Conditional field visibility (show field X only if field Y = value Z) | Future | Rule-builder UI required |
| OI-003 | Permission templates — save a set of overrides as a reusable template | Future | Apply templates to multiple contacts at once |
| OI-004 | Audit log for permission changes | Open | Who changed what permission and when |
| OI-005 | Self-service user preference settings (not admin-controlled) | Future | Dark mode, language, notification prefs accessible to all users |
| OI-006 | Mobile field technician app — permission model applies to mobile views | Future | Same permission tables, different rendering |
| OI-007 | Programmatic permission grants via API (for external integrations) | Future | Service account + scoped permissions |

---

*End of PRD-02 — Admin Settings & User-Level Field Access Control*  
*Document Version 1.0 | UT Service Console | 2026-06-06*
