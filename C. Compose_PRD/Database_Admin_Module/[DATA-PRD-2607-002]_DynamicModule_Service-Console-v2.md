# Product Requirements Document (PRD)
## UT Service Console — Dynamic Data Layer, Contacts Module & Admin Settings

| | |
|---|---|
| **Product** | UT Service Console |
| **Version** | 2.0 |
| **Status** | Draft |
| **Author** | Product Team |
| **Created** | 2026-06-06 |
| **Last Updated** | 2026-06-06 |
| **Stakeholders** | Engineering Lead, UX Lead, QA Lead, Operations Manager |

---

## 1. Executive Summary

The UT Service Console currently operates as a largely static prototype serving Dashboard, Cases, Work Orders, Service Appointments, and Field Service modules. Version 2.0 introduces three major capabilities:

1. **Dynamic Data Layer** — replaces static/mock data with a fully live database backend; every record can be created, read, updated, and deleted in real time.
2. **Contacts Module** — a new first-class module that manages both internal system users and external customer contacts, with embedded User Profile and Role-Based Access Control (RBAC) governance.
3. **Admin Settings Panel** — a privileged configuration surface (accessed via the Settings button) enabling administrators to manage users, define roles and profiles, and control per-object field behaviour (editable, required, or read-only) without any code changes.

These capabilities transform the console from a UI prototype into a production-grade field-service CRM.

---

## 2. Problem Statement

### 2.1 Current Limitations

| Pain Point | Impact |
|-----------|--------|
| All data is hard-coded / mocked | No real operational value; changes don't persist across sessions |
| No user identity or access control | Anyone with the URL has full access to all modules |
| No way to manage who can do what | Operations managers cannot restrict sensitive actions to specific roles |
| No contact/customer record management | Agents must switch to external tools to look up customer details |
| Field validation and layout are hard-coded | Business rule changes require developer intervention |

### 2.2 Opportunity

Field service operations depend on real-time data accuracy. By connecting the console to a live database and adding structured user governance, UT can:
- Eliminate double-entry between systems
- Enforce role-appropriate data access
- Reduce onboarding friction by configuring fields per team without code changes
- Build a single source of truth for contacts linked to cases and work orders

---

## 3. Goals & Success Metrics

### 3.1 Goals

| # | Goal | Measurable Target |
|---|------|-------------------|
| G1 | All five existing modules read/write live data | 100% of list and detail views fully wired by launch |
| G2 | Contacts module is production-ready | Contacts, Users, Roles, Profiles CRUD fully functional |
| G3 | Admins can configure user access without engineering | Zero code changes required to add a user or change a role |
| G4 | Admins can adjust field behaviour per object | Field config changes reflected in UI within 30 seconds, no deployment |
| G5 | System is secure by default | All routes protected; 403 returned on unauthorised access |

### 3.2 Success Metrics (90 days post-launch)

- **Data completeness:** ≥ 95% of cases and work orders have a linked contact
- **Admin self-service rate:** ≥ 80% of user/role changes made by admins without engineering tickets
- **API error rate:** < 0.5% of API calls return 5xx errors
- **Field config adoption:** ≥ 3 objects have custom field configs applied by business admins
- **Page load performance:** P95 list page load < 1.5 seconds on standard office network

---

## 4. User Personas

### 4.1 Field Technician (Primary)
- Uses the console on a tablet in the field
- Needs fast access to their assigned work orders and service appointments
- Should not be able to delete records or access admin settings
- Expects simple, mobile-friendly forms

### 4.2 Dispatcher
- Creates and assigns cases, work orders, and appointments
- Needs to look up contacts and accounts quickly
- Requires create and update rights across all operational modules
- Does not need access to Settings or user management

### 4.3 Operations Manager / Admin
- Manages the team roster and access levels
- Needs to add/deactivate users, assign roles, adjust permissions
- Needs to customise which fields appear on forms and how they behave
- Is the target user for the Admin Settings Panel

### 4.4 Viewer / Read-Only User
- Auditors, senior management, or external partners
- Read-only access across permitted modules
- Cannot create, update, or delete any records

---

## 5. Feature Specifications

---

### FEATURE 1 — Dynamic Data Layer

#### 5.1.1 Overview
Replace all static/mock data throughout the five existing modules with live API calls backed by a relational database.

#### 5.1.2 User Stories

| ID | Story | Priority |
|----|-------|---------|
| DL-01 | As a dispatcher, I want case list data to refresh automatically so I always see the latest status without manually reloading | High |
| DL-02 | As a technician, I want to update a work order status inline so I don't lose context navigating away | High |
| DL-03 | As any user, I want to see a loading skeleton while data is fetching so the page doesn't feel broken | High |
| DL-04 | As any user, I want to see an error message with a retry button if an API call fails | High |
| DL-05 | As a dispatcher, I want my search and filter choices remembered within a session so I don't re-apply them after navigating | Medium |
| DL-06 | As any user, I want changes I make to persist if I navigate away and come back | High |
| DL-07 | As a dispatcher, I want to create and edit records using validated forms | High |

#### 5.1.3 Functional Requirements

**List Pages**
- Paginate server-side (default 25 rows/page, options: 10/25/50/100)
- Sort by any column header (click to toggle asc/desc)
- Filter sidebar/bar with multi-value support per column
- Full-text search bar across key fields
- Background auto-refresh every 30 seconds (silent, no flash)
- Preserve filter/sort state in URL query parameters for shareability

**Detail Pages**
- All fields render as read-only text by default
- Clicking any editable field transitions it to an input control
- Changes are saved automatically on blur or Enter key
- Unsaved draft is indicated by a subtle highlight on the field
- Escape key cancels the draft and reverts the value
- Related records (linked Cases, WOs, Appointments) appear in a Related tab with their own mini-lists

**Create / Edit Forms**
- Modal or slide-out panel (not full page navigation)
- Client-side validation on blur and on submit
- Server-side validation errors mapped back to individual fields
- Discard confirmation dialog if the user closes with unsaved changes

**Empty & Error States**
- Empty list: illustrated empty state + "Create your first [entity]" CTA
- API error: inline alert with error code, human-readable message, and retry button
- Network offline: persistent banner at top of page

#### 5.1.4 Non-Functional Requirements
- API response time P95 < 300ms for list queries, < 150ms for single-record fetches
- Optimistic UI for all PATCH operations (instant visual update, rollback on error)
- All mutations are idempotent (safe to retry)

---

### FEATURE 2 — Contacts Module

#### 5.2.1 Overview
A new top-level module (sidebar position: between Cases and Work Orders) that unifies contact management — both internal system users and external customer contacts — with embedded role and profile governance.

#### 5.2.2 User Stories

| ID | Story | Priority |
|----|-------|---------|
| CM-01 | As a dispatcher, I want to search for a contact by name or email so I can link them to a case | High |
| CM-02 | As a dispatcher, I want to see all cases and work orders linked to a contact on their detail page | High |
| CM-03 | As an admin, I want to see which role and profile a user has on their contact detail page | High |
| CM-04 | As an admin, I want to deactivate a contact/user without deleting their historical records | High |
| CM-05 | As a technician, I want to view contact details for the customer whose appointment I'm attending | High |
| CM-06 | As a dispatcher, I want to create a new customer contact with name, email, phone, and account | Medium |
| CM-07 | As an admin, I want to see the last login date and MFA status of each internal user | Medium |
| CM-08 | As an admin, I want to reset a user's password from the contact detail page | Medium |

#### 5.2.3 Module Structure

**Contacts List Page (`/contacts`)**

| Element | Specification |
|---------|---------------|
| Page header | "Contacts" · record count badge · search bar · filter dropdown · "+ New Contact" button |
| Table columns | Avatar + Full Name · Email · Phone · Type (User/Customer badge) · Account · Role · Status · Last Modified |
| Row actions | Click → detail page; Kebab → Edit / Deactivate / Delete |
| Filters | Type · Role · Status (Active/Inactive) · Account |
| Default sort | Last Modified, descending |

**Contact Detail Page (`/contacts/:id`)**

Two-column layout:

*Left sidebar (240px, sticky):*
- Avatar with upload affordance
- Full name, job title, account name
- Contact quick-actions: Send Email · Assign Case · Edit
- At-a-glance stats: Open Cases count · Open WOs count

*Main area (tabbed):*

| Tab | Content |
|-----|---------|
| Details | All contact fields, inline-editable per field config |
| Related | Linked Cases (mini-list), Linked Work Orders (mini-list), Linked Appointments (mini-list) |
| Activity | Chronological timeline of system events (case created, WO updated, etc.) |
| User Access | Visible only if contact type = "user": username, role, profile, last login, MFA toggle, reset password, lock/unlock account |

#### 5.2.4 Contact Type Behaviour

| Behaviour | Internal User | External Customer |
|-----------|--------------|-------------------|
| Can log in to console | ✅ | ❌ |
| Has Role | ✅ | ❌ |
| Has Profile | ✅ | ❌ |
| Can be linked to Cases | ✅ | ✅ |
| User Access tab visible | ✅ | ❌ |
| Can be deactivated | ✅ (locks login) | ✅ |

#### 5.2.5 RBAC — Access to Contacts Module

| Role | Read | Create | Update | Delete |
|------|------|--------|--------|--------|
| Administrator | ✅ | ✅ | ✅ | ✅ |
| Dispatcher | ✅ | ✅ | ✅ | ❌ |
| Technician | ✅ (own assignments only) | ❌ | ❌ | ❌ |
| Viewer | ✅ | ❌ | ❌ | ❌ |

---

### FEATURE 3 — Admin Settings Panel

#### 5.3.1 Overview
A privileged, fully self-contained settings area accessible via the Settings button in the sidebar footer. Restricted to users with Administrator role. Contains three sub-sections: General, Users & Access, and Field Configuration.

#### 5.3.2 Access Control
- Only Administrator role can access `/settings` and all sub-routes
- Other roles are redirected to a `/403` page with a "Contact your administrator" message
- The Settings button in the sidebar is hidden for non-admin roles

---

#### 5.3.3 Users Management (`/settings/users`)

**User Stories**

| ID | Story | Priority |
|----|-------|---------|
| UA-01 | As an admin, I want to create a new internal user with credentials and assign them a role and profile | High |
| UA-02 | As an admin, I want to edit any user's role, profile, or contact details | High |
| UA-03 | As an admin, I want to deactivate a user so they cannot log in but their records are preserved | High |
| UA-04 | As an admin, I want to reset a user's password and send them a reset email | Medium |
| UA-05 | As an admin, I want to lock a user account after suspicious activity | Medium |
| UA-06 | As an admin, I want to see when each user last logged in | Medium |

**UI Specification**

*List:* Table with avatar, name, email, role badge, profile, status toggle, last login timestamp, and actions (Edit · Reset Password · Lock/Unlock · Delete).

*Create/Edit User — slide-out panel (540px):*

Sections:
1. **Personal Information** — First Name*, Last Name*, Email*, Phone, Mobile, Job Title, Department, Account
2. **User Access** — Username*, Password (create only)*, Confirm Password (create only)*, Role*, Profile, Status toggle
3. **Preferences** — Theme (Light/Dark/System), Locale, Timezone

Validation:
- Unique email checked against live API on blur
- Password: min 8 chars, 1 uppercase, 1 digit, 1 special character; strength indicator shown
- All `*` fields required; inline error messages

---

#### 5.3.4 Roles Management (`/settings/roles`)

**User Stories**

| ID | Story | Priority |
|----|-------|---------|
| RL-01 | As an admin, I want to create a custom role with a specific permission set | High |
| RL-02 | As an admin, I want to see exactly which permissions are granted to each role | High |
| RL-03 | As an admin, I want to edit an existing role's permissions without deleting it | High |
| RL-04 | As an admin, I want system default roles (Administrator, Dispatcher, Technician, Viewer) to be protected from deletion | High |

**UI Specification**

*List:* Card grid (3 columns). Each card shows role name, description, user count, condensed permission summary, and Edit/Delete actions. System roles show a lock icon.

*Create/Edit Role — slide-out panel (520px):*
- Role Name* and Description fields
- **Permissions Matrix:** Rows = modules (Dashboard, Cases, Work Orders, Service Appointments, Field Service, Contacts, Settings). Columns = actions (Read, Create, Update, Delete, Export). Checkbox cells with "Select All" shortcuts per row and per column.
- Warning banner if the admin tries to delete a role that has active users assigned.

---

#### 5.3.5 Profiles Management (`/settings/profiles`)

**User Stories**

| ID | Story | Priority |
|----|-------|---------|
| PR-01 | As an admin, I want to create a profile template that pre-fills user preferences | Medium |
| PR-02 | As an admin, I want to associate a profile with a default role | Medium |
| PR-03 | As an admin, I want to edit or delete profiles without affecting existing users | Medium |

**UI Specification**

*List:* Card grid. Each card shows profile name, description, associated role, user count, Edit/Delete.

*Create/Edit Profile — modal:*
- Profile Name*, Description, Associated Role*, Default Theme, Default Locale, Default Timezone.

---

#### 5.3.6 Field Configuration (`/settings/fields/:object`)

This is the highest-value admin capability. It allows non-technical administrators to control how every field behaves in every module's forms and detail views.

**User Stories**

| ID | Story | Priority |
|----|-------|---------|
| FC-01 | As an admin, I want to mark a field as Required so agents cannot save without filling it in | High |
| FC-02 | As an admin, I want to mark a field as Read-Only so certain roles can see it but not change it | High |
| FC-03 | As an admin, I want to hide a field entirely from a module's form | Medium |
| FC-04 | As an admin, I want to change the display label of a field without changing the database column name | Medium |
| FC-05 | As an admin, I want to drag fields to reorder them within a section | Medium |
| FC-06 | As an admin, I want to add a custom field to an object with its type and validation rules | Medium |
| FC-07 | As an admin, I want to override field behaviour per role (e.g., Status is read-only for Technicians but editable for Dispatchers) | High |

**UI Specification**

*Layout:* Left panel — object tabs (Cases / Work Orders / Service Appointments / Field Service / Contacts). Right panel — field configuration table for the selected object.

*Field Configuration Table:*

| Column | Type | Notes |
|--------|------|-------|
| Field Label | Inline text edit | Overrides display name |
| Field Name | Read-only text | Database column name |
| Type | Badge | Not editable for system fields |
| Required | Pill toggle | Green = required |
| Editable | Pill toggle | Blue = editable |
| Read-Only | Pill toggle | Gray = read-only (overrides Editable if both set) |
| Hidden | Pill toggle | Orange = hidden |
| Section | Dropdown | Grouping on the form |
| Order | Drag handle | Re-order within section |
| Actions | Icon buttons | Overrides · Edit · Delete (custom fields only) |

*Adding a Custom Field — modal:*
- Label*, Field Name (auto-generated, editable), Type* (text / number / date / datetime / select / multiselect / lookup / boolean / textarea / email / phone / url)
- Section (dropdown, with "+ New Section" option)
- Help Text, Default Value
- Required / Editable / Read-Only / Hidden toggles
- For select/multiselect: dynamic list of options (label + value per row)
- For number: min/max value inputs
- Preview panel on the right showing how the field will render

*Role Override Panel — slide-out:*
- Triggered by "Overrides" action on any field row
- Table: Role · Required · Editable · Read-Only (toggle cells)
- "-" (dash) means "inherit from base config"
- Changes apply immediately to that role's view of the form

**Field Config Enforcement Rules**
1. `is_hidden = true` → field does not render at all in the UI
2. `is_readonly = true` → field renders as static text; input is never shown
3. `is_editable = false` → field renders as static text in edit mode
4. `is_required = true` → form cannot be submitted without a value; asterisk shown on label
5. Role override takes precedence over base config when the user's role has an explicit override
6. Admins always see all fields regardless of config (cannot lock themselves out)

---

## 6. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | List pages: P95 load < 1.5s. Detail pages: P95 load < 1s. API response: P95 < 300ms |
| **Security** | JWT auth, httpOnly refresh token cookie, RBAC on every API endpoint, input sanitisation, SQL parameterised queries |
| **Availability** | 99.5% uptime during business hours (07:00–22:00 local time) |
| **Accessibility** | WCAG 2.2 Level AA: keyboard navigable, screen-reader labels, min 44×44px touch targets, 4.5:1 contrast ratio |
| **Scalability** | Architecture supports up to 500 concurrent users without degradation |
| **Audit** | Every create/update/delete action logged with user ID, timestamp, and field-level diff |
| **Internationalisation** | Date/time formats respect user locale. Labels configurable per deployment. RTL layout not required in v2.0 |
| **Browser Support** | Chrome ≥ 110, Firefox ≥ 110, Safari ≥ 16, Edge ≥ 110 |
| **Dark Mode** | 100% dark-mode coverage per Design System v1.0 tokens |

---

## 7. Design Requirements

All new components **must** follow `Design_System.md` v1.0:

| Area | Requirement |
|------|-------------|
| Colour | CSS custom properties only (`var(--token)`); no hard-coded hex |
| Typography | Inter font family; sizes and weights per §2 of Design System |
| Spacing | 4px grid; spacing scale per §3 |
| Buttons | `.btn-primary` (gold) and `.btn-secondary` (neutral) per §4 |
| Cards | `.card` class with `var(--bg-card)` background per §5 |
| Inputs | `.input-field` class with gold focus ring per §6 |
| Badges | Status and priority badge classes per §7 |
| Dark Mode | All new components tested and verified in both light and dark modes per §8 |
| Icons | Lucide React exclusively; no mixing of icon libraries |
| Animations | `fadeIn` for page content, `slideIn` for panels per §10 |

---

## 8. Out of Scope (v2.0)

The following are explicitly excluded from this release:

- Native mobile application (the web app is mobile-responsive but not a native app)
- Email / SMS notification system
- File attachment uploads to cases or work orders
- Advanced reporting / analytics dashboards
- Third-party CRM integration (Salesforce, ServiceNow)
- SSO / SAML authentication
- Offline-first / PWA capability
- RTL language support
- Customer-facing portal

---

## 9. Dependencies

| Dependency | Type | Notes |
|-----------|------|-------|
| Backend API | Blocker | Dynamic data layer requires API to be deployed |
| Database (PostgreSQL) | Blocker | All data persistence |
| Authentication service | Blocker | JWT + refresh token flow |
| Design System v1.0 | Dependency | All UI must comply |
| Lucide React | Frontend library | Icon system |
| TanStack Query v5 | Frontend library | Server state management |
| dnd-kit | Frontend library | Drag-to-reorder in Field Config |

---

## 10. Milestones & Phases

### Phase 1 — Foundation (Weeks 1–3)
- [ ] Database schema and migrations (all entities + new tables)
- [ ] REST API scaffolding with auth middleware
- [ ] `useQuery` / `useMutation` hooks wired for Cases module (pilot)
- [ ] Skeleton loading and error state components

### Phase 2 — Dynamic Data (Weeks 4–6)
- [ ] All five existing modules wired to live API
- [ ] Inline field editing on all detail pages
- [ ] Create/Edit modals for Cases and Work Orders
- [ ] RBAC middleware on all endpoints

### Phase 3 — Contacts Module (Weeks 7–9)
- [ ] Contacts list and detail pages
- [ ] User Access tab with role/profile display
- [ ] Link contacts to Cases and Work Orders
- [ ] Contact search in case/WO create forms

### Phase 4 — Admin Settings (Weeks 10–13)
- [ ] Users management (CRUD + password reset)
- [ ] Roles management + permissions matrix
- [ ] Profiles management
- [ ] Field Configuration UI (view + toggle)
- [ ] Role overrides per field

### Phase 5 — Field Config Engine (Weeks 14–16)
- [ ] Dynamic form engine consuming field config schema
- [ ] Add custom field flow
- [ ] Drag-to-reorder fields
- [ ] Field config applied to all five objects
- [ ] End-to-end testing and QA sign-off

---

## 11. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Field config engine complexity delays Phase 5 | Medium | High | Scope Phase 5 as MVP toggle-only (no drag/reorder) first; ship reorder as fast follow |
| RBAC misconfiguration exposes sensitive data | Low | Critical | Pen test RBAC layer before launch; default-deny principle |
| Database migration errors on existing mock data | Medium | Medium | Run migrations in staging first; maintain rollback scripts |
| Performance regression with live data vs mock | Medium | High | Load test with realistic data volume (10k+ records) in staging |
| Admin misconfigures field as hidden and can't find it | Low | Medium | Admins always see all fields; "hidden" only applies to non-admin roles |

---

## 12. Appendix

### 12.1 Glossary

| Term | Definition |
|------|-----------|
| **Contact** | A person record — either an internal user or an external customer |
| **User** | An internal Contact who can log in to the console |
| **Role** | A named permission set (e.g., Technician). Defines what a user can do. |
| **Profile** | A template of preferences (theme, locale, timezone) linked to a default role |
| **RBAC** | Role-Based Access Control — access is governed by the user's assigned role |
| **Field Config** | Admin-controlled settings for how a field behaves: required, editable, read-only, hidden |
| **Role Override** | A field-level override of base field config that applies to a specific role |
| **Inline Edit** | Editing a field value directly on the detail page without opening a full form |
| **Optimistic Update** | Immediately reflecting a change in the UI before the API confirms it |

### 12.2 Default System Roles

| Role | Description | Can Delete? |
|------|-------------|-------------|
| Administrator | Full access including Settings | No (system) |
| Dispatcher | Operational CRUD across all modules, no Settings | No (system) |
| Technician | Read + update own assigned records | No (system) |
| Viewer | Read-only across permitted modules | No (system) |

### 12.3 Default Field Sections per Object

**Cases:** Case Information · Assignment · Dates · Description · Resolution

**Work Orders:** Work Order Information · Assignment · Schedule · Details

**Service Appointments:** Appointment Information · Schedule · Technician · Notes

**Field Service:** Task Information · Assignment · Location · Completion

**Contacts:** Contact Information · Address · User Access (users only) · Notes
