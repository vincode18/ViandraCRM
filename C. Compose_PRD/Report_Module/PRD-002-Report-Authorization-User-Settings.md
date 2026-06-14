# PRD-002 — Report Authorization & User Settings Assignment
## UT Service Console · Report Access Control & User-Level Configuration

> **Document Version:** 1.0
> **Status:** Draft
> **Last Updated:** 2026-06-13
> **Author:** Product Team
> **Reviewers:** Engineering Lead, Security Lead, UX Lead

---

## 1. Overview

### 1.1 Summary

This PRD covers the **authorization layer** for the Report Builder Module (PRD-001). It defines how system administrators assign report-creation permissions to users, configure which modules and fields each user or role can access within the report builder, and how users manage their own report preferences from the User Settings panel.

The goal is a fine-grained, role-aware access control system that ensures users only see, build, and export reports within their authorised data scope — without requiring engineering involvement for each permission change.

### 1.2 Problem Statement

Without a structured permission model tied to the Report Builder, two failure modes emerge:

1. **Over-permissioned users** — anyone can build reports on any module and export sensitive data (customer PII, financial figures, SLA breach data) they shouldn't have access to.
2. **Under-permissioned users** — legitimate operational users can't access the builder at all, reverting to the old IT-request model the Report Builder was designed to replace.

A per-user, per-role authorization framework resolves both failure modes.

### 1.3 Goals

| # | Goal | Success Metric |
|---|------|---------------|
| G1 | Admins can configure report access per user or role without engineering help | 100% of permission changes handled via Admin UI, 0 code deploys required |
| G2 | Users can only access modules and fields their role permits | 0 unauthorized data access incidents in first 90 days |
| G3 | Users can manage their own report preferences (defaults, templates) in User Settings | User Settings adoption > 60% of active report users |
| G4 | All permission changes are logged for compliance | Audit log available for all changes within 5 minutes of change |

### 1.4 Non-Goals

- This PRD does not cover real-time data row-level security (e.g. "a technician only sees their own records") — that is a v2 security milestone
- SSO/SAML role sync is out of scope for v1; roles are managed manually in the Admin panel
- This PRD does not define the visual report builder experience — see PRD-001

---

## 2. User Stories

### 2.1 Primary Personas

**Persona A — System Administrator (Priya)**
> "I need to control exactly which modules each team can build reports on, and which fields within those modules they can include — especially making sure field techs can't export customer PII."

**Persona B — Operations Manager (Maya)**
> "I want to set my default export format to Excel and have my most-used report templates pinned so I can access them without searching."

**Persona C — New User (Tom)**
> "I want to know at a glance which modules I'm allowed to create reports on, without accidentally hitting permission errors mid-build."

### 2.2 User Stories

| ID | As a… | I want to… | So that… |
|----|-------|-----------|---------|
| US-01 | Admin | Assign the "Report Builder" permission to a user or role from User Settings | That user gains access to the Report Builder module |
| US-02 | Admin | Set which source modules (Cases, Work Orders, etc.) a role can access in Report Builder | Field techs can only report on WOs, not on Cases or billing data |
| US-03 | Admin | Control which fields within a module are visible in the Field Panel per role | Sensitive fields (e.g. customer email, SLA breach reason) are hidden for restricted roles |
| US-04 | Admin | View an audit log of all report permission changes | I can demonstrate compliance in access reviews |
| US-05 | Admin | Bulk-assign report permissions to a role that applies to all members | I don't have to configure each user individually |
| US-06 | User | See which modules I'm allowed to report on before I start building | I don't waste time discovering a permission block mid-build |
| US-07 | User | Set my preferred default export format (CSV or Excel) in User Settings | Every export defaults to my preferred format |
| US-08 | User | Pin up to 5 favourite reports for quick access | I can open frequently used reports in one click |
| US-09 | User | Set a default module for the Report Builder | The builder opens on my most-used module |
| US-10 | Admin | Revoke report access from a user immediately | When someone leaves or changes role, access is cut off at once |

---

## 3. Functional Requirements

### 3.1 Admin: Report Permission Assignment

#### 3.1.1 Access From

Admin Panel → User Management → [User Profile] → **Permissions** tab
Admin Panel → Roles → [Role Name] → **Report Builder** section

#### 3.1.2 Report Builder Toggle (Per User / Per Role)

A master toggle: **Report Builder Access — Enabled / Disabled**

- Default: **Disabled** for all users on initial install
- When disabled, the Reports nav item is hidden from that user's sidebar
- When enabled, the Module Access settings below become configurable

#### 3.1.3 Module Access (Per Role)

A table showing all available report source modules. Each row has:

| Column | Type | Description |
|--------|------|-------------|
| Module Name | Label | Cases / Work Orders / Service Appointments / Field Service |
| Access | Toggle | Enabled / Disabled |
| Field Access | Button | "Configure Fields →" (opens field-level panel) |

- If a module is disabled, it does not appear in the Report Builder's module dropdown for that role
- At least one module must remain enabled if Report Builder Access is on (system prevents disabling all)

#### 3.1.4 Field-Level Access (Per Module Per Role)

Accessed via "Configure Fields" button from the module access table.

Opens a side sheet (right panel):
- Title: "Field Access — [Module Name] — [Role Name]"
- Lists all available fields for that module
- Each field has a toggle: **Visible / Hidden**
- Fields are grouped by category (matching the Report Builder's Field Panel grouping)
- A "Hide All / Show All" bulk toggle per category
- Search bar to find a specific field
- Warning indicator on fields tagged as containing PII (e.g. customer email, phone)
- Save button applies changes immediately (no page reload required)

#### 3.1.5 Inheritance Model

- Role-level settings are the baseline for all users in that role
- Individual user overrides are additive only (can restrict further, cannot expand beyond role)
- Visual indicator on user-level overrides: "Overriding role default" badge

```
Role: Field Technician
  └─ Report Builder: Enabled
      └─ Modules: Work Orders (Enabled), Cases (Disabled)
          └─ WO Fields: All Enabled except [Customer Email, Customer Phone]

User: Tom (Field Technician)
  └─ Inherits all role settings
  └─ Override: Work Orders module → additionally hide [SLA Breach Reason]
     → Shown as: "1 user-level field override active"
```

### 3.2 Admin: Report Audit Log

#### 3.2.1 Access From

Admin Panel → Reports → **Audit Log** tab

#### 3.2.2 Log Contents

Each entry records:

| Field | Example |
|-------|---------|
| Timestamp | `2026-06-13 09:42:17 UTC` |
| Actor | `priya@company.com (Admin)` |
| Action | `Permission Changed` / `Report Exported` / `Report Shared` |
| Target User | `tom@company.com` |
| Details | `Work Orders → SLA Breach Reason: Hidden` |
| IP Address | `192.168.1.45` |

#### 3.2.3 Log Filters

- Date range picker
- Actor (user who made the change)
- Target user
- Action type (Permission Changed, Report Exported, Report Shared, Report Deleted)
- Module

#### 3.2.4 Log Export

- Export audit log as CSV (same export engine as PRD-001)
- Retention: 12 months rolling

### 3.3 User Settings: Report Preferences

#### 3.3.1 Access From

User Avatar → Settings → **Reports** tab

#### 3.3.2 Preference Options

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Default Export Format | Select: CSV / Excel | CSV | Applied to all report exports by default |
| Default Module | Select: [modules user has access to] | None (user picks each time) | Pre-selects module when opening Report Builder |
| Date Format in Export | Select: `YYYY-MM-DD` / `DD/MM/YYYY` / `MM/DD/YYYY` | `YYYY-MM-DD` | Applied to date columns in all exports |
| Number Format | Select: Raw / Comma-separated | Raw | Applied to number columns in exports |
| Auto-run on open | Toggle: On/Off | Off | Runs the last saved report automatically when opening Reports |
| Rows per preview page | Select: 25 / 50 / 100 | 50 | Number of rows shown in the canvas preview |

#### 3.3.3 Pinned Reports

- Users can pin up to **5 reports** as favourites
- Pinned reports appear in a "Pinned" section at the top of the Reports list view
- Pin/unpin from the Reports list (star icon on each row)
- If a pinned report is deleted or access is revoked, the pin is silently removed and a toast notification shown: "1 pinned report was removed because you no longer have access."

#### 3.3.4 My Permissions (Read-Only View)

A read-only section within User Settings → Reports showing:

- **Report Builder Access:** Active / Inactive
- **Modules I can report on:** Visual list of accessible modules with icons
- **Restricted fields:** "Some fields are restricted in your role. Contact your admin for details." (no specific field names disclosed)

This gives users clarity about what they can access before they enter the builder.

### 3.4 Permission Error Handling (Report Builder)

When a user's permissions change while they have a report open or saved:

| Scenario | Behaviour |
|---------|---------|
| Module access revoked for a saved report's module | On next open: banner warning "You no longer have access to the [Module] module. This report cannot be run. Contact your admin." |
| A field in a saved report is hidden for the user's role | That column is silently removed from the canvas and a warning badge shown: "1 column was removed because you no longer have access to that field." |
| User tries to add a restricted field via drag | Field is not visible in the panel (never shown); no error needed |
| Export attempted without export permission | Button is disabled and shows tooltip: "You don't have export permission. Contact your admin." |

### 3.5 Bulk Role Assignment

#### 3.5.1 From Admin Panel → Roles

Admin can configure a role's report settings once and apply to all current members:

1. Select role → Report Builder section
2. Configure module and field access
3. Toggle: "Apply to all [N] current members of this role"
4. Confirm dialog: "This will override individual settings for [N] users. Continue?"
5. Change applied; each affected user shown in audit log

#### 3.5.2 From Admin Panel → User Management (Multi-select)

- Select multiple users via checkbox
- Bulk action: "Set Report Builder Access → Enable / Disable"
- Cannot bulk-set field-level overrides (must be done per user or via role)

---

## 4. Non-Functional Requirements

| Category | Requirement |
|----------|------------|
| Performance | Permission checks on report preview load must add < 50ms overhead |
| Security | Permission model enforced server-side; client-side visibility is cosmetic only |
| Security | Field stripping on export must occur server-side before file generation |
| Auditability | All permission changes logged within 5 seconds of action |
| Reliability | Permission cache invalidated within 30 seconds of admin change (no stale access) |
| Accessibility | All permission toggles and settings meet WCAG 2.2 AA keyboard and screen reader standards |
| Scalability | Permission model supports up to 500 users and 50 roles without performance degradation |

---

## 5. UI / UX Specifications

### 5.1 Admin Panel — Report Builder Permissions Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  User: Tom Nguyen                          [← Back to Users]     │
│  Role: Field Technician                                          │
├──────────────────────────────────────────────────────────────────┤
│  Permissions   |   Report Builder   |   Module Access   |  Log   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Report Builder Access           [●  Enabled        ]           │
│  ─────────────────────────────────────────────────────          │
│                                                                  │
│  Module Access                                                   │
│  ┌──────────────────────┬──────────┬──────────────────────┐     │
│  │ Module               │ Access   │ Fields               │     │
│  ├──────────────────────┼──────────┼──────────────────────┤     │
│  │ Cases                │ ○ Off    │ —                    │     │
│  │ Work Orders          │ ● On     │ Configure Fields →   │     │
│  │ Service Appointments │ ○ Off    │ —                    │     │
│  │ Field Service        │ ● On     │ Configure Fields →   │     │
│  └──────────────────────┴──────────┴──────────────────────┘     │
│                                                                  │
│  [Save Changes]                                                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 5.2 User Settings — Reports Tab Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  Settings                                                        │
│  ── Profile  ── Notifications  ── [Reports]  ── Security ──     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Report Preferences                                              │
│  ─────────────────────────────────────────────────────          │
│  Default Export Format        [ CSV ▾ ]                         │
│  Default Module               [ None — pick each time ▾ ]      │
│  Date Format in Export        [ YYYY-MM-DD ▾ ]                  │
│  Number Format                [ Raw ▾ ]                         │
│  Auto-run on open             [ ○ Off ]                         │
│  Rows per preview             [ 50 ▾ ]                          │
│                                                                  │
│  Pinned Reports (3/5)                                            │
│  ─────────────────────────────────────────────────────          │
│  ★ Weekly Open WOs - My Team                                     │
│  ★ SA by Region - This Month                                     │
│  ★ High Priority Cases - Open                                    │
│                                                                  │
│  My Report Access                                                │
│  ─────────────────────────────────────────────────────          │
│  Report Builder          ✓ Active                               │
│  Accessible Modules      Work Orders · Field Service            │
│                          ⓘ Some fields are restricted.          │
│                            Contact your admin for details.      │
│                                                                  │
│  [Save Preferences]                                              │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 5.3 Design Tokens (from Design System)

| Element | Token / Value |
|---------|--------------|
| Section backgrounds | `var(--bg-card)` |
| Toggle — active | `var(--accent)` background, `var(--text-main)` thumb |
| Toggle — inactive | `var(--bg-lighter)` background |
| PII field warning icon | `var(--color-warning)` `#F57C00` |
| "Overriding role default" badge | `.badge-medium` style (`#FFFDE7` bg / `#8B7500` text) |
| Permission active indicator | `var(--color-success)` `#388E3C` |
| Permission inactive indicator | `var(--text-muted)` `#BDBDBD` |
| Save button | `.btn-primary` |
| Cancel / Back | `.btn-secondary` |
| Audit log table | Standard `.card` with table inside |
| Admin warning dialog | `var(--color-danger)` border, `#FFEBEE` background |

### 5.4 Toast Notifications

| Event | Message | Duration |
|-------|---------|---------|
| Permissions saved | "Permissions updated for Tom Nguyen" | 3s |
| Bulk role apply complete | "Report Builder permissions applied to 12 users" | 4s |
| User preferences saved | "Report preferences saved" | 3s |
| Pinned report removed (access revoked) | "1 pinned report was removed — you no longer have access" | 5s |
| Permission change failed | "Failed to save. Please try again." | 5s + retry |

---

## 6. Technical Considerations

### 6.1 Permission Model (Data Schema)

```
ReportPermission {
  id: UUID
  user_id: UUID (nullable if role-level)
  role_id: UUID (nullable if user-level)
  report_builder_enabled: boolean
  module_access: {
    cases: boolean
    work_orders: boolean
    service_appointments: boolean
    field_service: boolean
  }
  field_overrides: {
    [module_key]: {
      [field_key]: "hidden" | "visible"
    }
  }
  created_at: timestamp
  updated_at: timestamp
  updated_by: UUID (admin user)
}
```

### 6.2 Permission Resolution Order

```
1. Check if Report Builder enabled for user → if not, deny all
2. Resolve module list: role setting ∩ user override
3. Resolve field list per module: role defaults → apply user overrides
4. Cache resolved permissions per user (TTL: 60 seconds)
5. Invalidate cache on any admin change to that user or their role
```

### 6.3 API Endpoints Required

| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET` | `/api/admin/users/:id/report-permissions` | Get user's report permissions |
| `PUT` | `/api/admin/users/:id/report-permissions` | Update user's report permissions |
| `GET` | `/api/admin/roles/:id/report-permissions` | Get role's report permissions |
| `PUT` | `/api/admin/roles/:id/report-permissions` | Update role's report permissions |
| `POST` | `/api/admin/roles/:id/report-permissions/apply-to-members` | Bulk apply role permissions |
| `GET` | `/api/admin/reports/audit-log` | Fetch audit log (paginated, filterable) |
| `GET` | `/api/user/settings/reports` | Get current user's report preferences |
| `PUT` | `/api/user/settings/reports` | Save current user's report preferences |
| `GET` | `/api/user/report-access` | Returns resolved permission summary for "My Access" view |

### 6.4 Cache Strategy
- Redis (or equivalent) stores resolved permissions per `user_id`
- TTL: 60 seconds
- Invalidation: pub/sub event triggered on any `PUT` to permissions endpoints
- Fallback: if cache miss, resolve from DB synchronously

---

## 7. Acceptance Criteria

| ID | Criteria |
|----|---------|
| AC-01 | Admin can enable/disable Report Builder for a specific user and the change is reflected immediately (within 60s cache TTL) |
| AC-02 | Admin can disable a module for a role and that module disappears from the builder dropdown for all role members |
| AC-03 | Admin can hide a field for a role and that field is absent from the Field Panel and stripped from any export for that role |
| AC-04 | All permission changes appear in the audit log within 5 seconds |
| AC-05 | User Settings → Reports tab shows the user's accessible modules and export preferences |
| AC-06 | User's default export format preference is applied to all subsequent exports |
| AC-07 | Pinned reports are visible at the top of the Reports list and persist across sessions |
| AC-08 | When a user's access to a report's module is revoked, opening that report shows the correct warning and disables Run |
| AC-09 | Field stripping occurs server-side — a user cannot retrieve hidden field data by modifying the export request |
| AC-10 | Bulk role permission application records individual audit log entries per affected user |

---

## 8. Open Questions

| # | Question | Owner | Due |
|---|---------|-------|-----|
| OQ-01 | Should report export itself require a separate "Export" sub-permission, or is it bundled with Report Builder access? | Security | Sprint 1 |
| OQ-02 | How should we handle permission changes mid-export (e.g. access revoked after job starts)? | Engineering | Sprint 2 |
| OQ-03 | Should user-level field overrides be restricted to admins, or can users hide their own fields? | Product | Sprint 1 |
| OQ-04 | For compliance, do we need to mask PII fields in the audit log itself? | Security/Legal | Sprint 1 |
| OQ-05 | Should shared reports inherit the sharer's permissions or the viewer's? (Current proposal: viewer's — stricter) | Product | Sprint 2 |

---

## 9. Dependencies

| Dependency | Team | Notes |
|-----------|------|-------|
| User Management Admin Panel | Frontend | Extend existing admin UI |
| Role model in backend | Backend | Existing; needs ReportPermission relation added |
| Redis / permission cache layer | Backend/Infra | May already exist; confirm with infra |
| PRD-001 Report Builder Module | Frontend | Permissions layer gates everything in PRD-001 |
| Audit log infrastructure | Backend | Extend existing audit log if present |

---

## 10. Milestones

| Milestone | Deliverable | Target |
|-----------|-----------|--------|
| M1 | Permission schema + API endpoints (backend) | Week 2 |
| M2 | Admin UI — Report Builder toggle per user | Week 3 |
| M3 | Admin UI — Module access config per role | Week 4 |
| M4 | Field-level access panel (per module per role) | Week 5 |
| M5 | Permission enforcement in Report Builder (PRD-001 integration) | Week 6 |
| M6 | User Settings — Reports preferences tab | Week 7 |
| M7 | Pinned reports + My Access view | Week 8 |
| M8 | Audit log UI + CSV export | Week 9 |
| M9 | Bulk role apply + permission inheritance | Week 10 |
| M10 | Security review, penetration test on export endpoints | Week 11 |
| M11 | Production release | Week 12 |

---

## 11. Related Documents

| Document | Link |
|---------|------|
| PRD-001 — Report Builder Module | `PRD-001-Report-Builder-Module.md` |
| Design System v1.0 | `Design_System.md` |
| User Management Admin Panel Spec | *(link to existing spec)* |
| Security & Data Classification Policy | *(link to internal policy)* |

---

*End of PRD-002*
