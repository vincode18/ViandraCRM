# PRD-02 — Change Set Management & Role-Based Deployment
**UT Service Console · App Settings > Deployment**

> **Document Version:** 1.0
> **Last Updated:** 2026-06-13
> **Status:** Draft — Pending Stakeholder Review
> **Author:** Product Team
> **Related Doc:** PRD-01 — Deployment Pipeline & Environment Architecture

---

## 1. Executive Summary

This PRD defines the **Change Set Management** feature within App Settings. It covers the full lifecycle of inbound and outbound change sets — creation, component selection, validation, deployment, and history — as well as the **role-based access controls** that gate every deployment action. Only users with the `SYSTEM_ADMIN` role may validate and deploy change sets. All other users have read-only visibility where permitted by their role.

---

## 2. Problem Statement

Without a structured change set system, the promotion of objects, configurations, and customisations between environments is undocumented and error-prone. There is no UI within the UT Service Console itself to:

- Create and manage outbound change sets from the current environment
- Receive and inspect inbound change sets from a lower environment
- Validate a change set before committing a live deployment
- Restrict deployment actions to authorised users only
- Track deployment history per change set

This PRD specifies the UI, data model, and role enforcement to solve these gaps.

---

## 3. Goals

| # | Goal | Success Metric |
|---|------|---------------|
| G1 | System Admins can create, validate, and deploy change sets from within the app | End-to-end flow completable without external tooling |
| G2 | Inbound and outbound change sets are clearly differentiated in the UI | Zero support tickets from admin confusion between in/out |
| G3 | Role enforcement blocks non-admins from deployment actions | 100% of deploy/validate actions require `SYSTEM_ADMIN` role |
| G4 | Deployment History is visible and filterable for audit purposes | History retained for minimum 12 months |
| G5 | Validation runs before any deployment — it cannot be bypassed | Deploy button is disabled until Validate returns `Succeeded` |

---

## 4. Non-Goals (Out of Scope for v1.0)

- Automated deployment scheduling (time-triggered deploys)
- Change set diff viewer (visual comparison of before/after object state)
- Dependency resolution for component ordering
- Integration with external version control systems (Git)
- Self-service deployment for non-admin roles

---

## 5. User Roles & Permissions

### 5.1 Role Definitions

| Role | Code | Description |
|------|------|-------------|
| System Administrator | `SYSTEM_ADMIN` | Full access to all deployment features. Only role that can validate and deploy. |
| Developer | `DEVELOPER` | Can create change sets and add components. Cannot validate or deploy. |
| QA Engineer | `QA_ENGINEER` | Read-only access to change sets and deployment history. |
| Field Agent / End User | `FIELD_USER` | No access to Deployment section. |

### 5.2 Permission Matrix

| Action | SYSTEM_ADMIN | DEVELOPER | QA_ENGINEER | FIELD_USER |
|--------|-------------|----------|------------|-----------|
| View Deployment section in App Settings | ✅ | ✅ | ✅ | ❌ |
| Create outbound change set | ✅ | ✅ | ❌ | ❌ |
| Add components to change set | ✅ | ✅ | ❌ | ❌ |
| Edit change set metadata | ✅ | ✅ | ❌ | ❌ |
| **Validate change set** | ✅ | ❌ | ❌ | ❌ |
| **Deploy change set** | ✅ | ❌ | ❌ | ❌ |
| Delete change set | ✅ | ❌ | ❌ | ❌ |
| View deployment history | ✅ | ✅ | ✅ | ❌ |
| View inbound change sets | ✅ | ✅ | ✅ | ❌ |

> ⚠️ **Critical Gate:** The **Validate** and **Deploy** buttons must be rendered as disabled (not hidden) for non-SYSTEM_ADMIN users, with a tooltip: *"System Administrator access required."* This ensures users understand the permission model rather than assuming a broken UI.

---

## 6. Feature Specification

### 6.1 App Settings Navigation

**Location:** `App Settings > Deployment`

The Deployment section appears in the App Settings sidebar as a collapsible group:

```
App Settings
  ├── General
  ├── Users & Roles
  ├── Notifications
  └── Deployment                    ← New section
        ├── Pipeline Overview       (→ PRD-01)
        ├── Outbound Change Sets    ← This PRD
        ├── Inbound Change Sets     ← This PRD
        └── Deployment Connections
```

**Access Guard:** If the authenticated user's role is `FIELD_USER`, the **Deployment** section is hidden entirely from the sidebar. For all other roles, it is visible but individual actions are permission-gated.

---

### 6.2 Outbound Change Sets

**Route:** `/settings/deployment/outbound`

#### 6.2.1 Page Layout

```
┌─────────────────────────────────────────────────────────┐
│  App Settings > Deployment > Outbound Change Sets       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Outbound Change Sets              [+ New Change Set]   │
│                                                         │
│  An outbound change set contains customisations you     │
│  want to send from this environment to a connected      │
│  environment (e.g. dev → test, test → prod).            │
│                                                         │
│  CHANGE SETS                                            │
│  ─────────────────────────────────────────────────────  │
│  Name            Status      Modified       Action      │
│  Case Module v3  Open        13 Jun 2026    [Open]      │
│  WO Statuses     Validated   12 Jun 2026    [Open]      │
│  SA Templates    Succeeded   10 Jun 2026    [Open]      │
│                                                         │
│  No additional change sets.                             │
└─────────────────────────────────────────────────────────┘
```

#### 6.2.2 Change Set Statuses

| Status | Colour Token | Meaning |
|--------|-------------|---------|
| `Draft` | `var(--text-muted)` | Created but no components added |
| `Open` | `var(--color-info)` | Components added, not yet validated |
| `Validating` | `var(--color-warning)` | Validation in progress |
| `Validated` | `var(--color-success)` | Passed validation, ready to deploy |
| `Deploying` | `var(--color-warning)` | Deployment in progress |
| `Succeeded` | `var(--color-success)` | Deployment completed successfully |
| `Failed` | `var(--color-danger)` | Validation or deployment failed |

> Badge styles reference **Section 7.4 (Inline Status Badge)** of the Design System — use `backgroundColor: mapping.bg` and `border: 1px solid mapping.color`.

---

### 6.3 Change Set Detail Page

**Route:** `/settings/deployment/outbound/:changeSetId`

#### 6.3.1 Layout

```
┌────────────────────────────────────────────────────────────────┐
│  Change Set Detail                [Validate]  [Deploy]  [Delete]│
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Change Set Name   Case Module Updates v3                      │
│  Description       Adds priority field to Case object          │
│  Expiration Date   2026-07-13                                  │
│                                                                │
│  SOURCE INFORMATION                                            │
│  ──────────────────────────────────────────────────────────── │
│  Source Deployment                                             │
│  Connection        dev → test                  [Upload File]   │
│                                                                │
│                              [Validate]  [Deploy]  [Delete]    │
│                                                                │
│  DEPLOYMENT HISTORY                                            │
│  ──────────────────────────────────────────────────────────── │
│  Action        Start Time        End Time          Status      │
│  View Results  13 Jun 9:05 AM    13 Jun 9:05 AM   ✅ Succeeded │
│  View Results  12 Jun 4:22 PM    12 Jun 4:23 PM   ❌ Failed    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

#### 6.3.2 Action Buttons — State Logic

| Button | Enabled When | Disabled When | Role Required |
|--------|-------------|--------------|--------------|
| **Validate** | Status is `Open` or `Failed` | Status is `Validated`, `Deploying`, `Succeeded` | `SYSTEM_ADMIN` |
| **Deploy** | Status is `Validated` | Status is anything other than `Validated` | `SYSTEM_ADMIN` |
| **Delete** | Status is `Draft`, `Open`, or `Failed` | Status is `Deploying`, `Succeeded` | `SYSTEM_ADMIN` |

#### 6.3.3 Validate Flow

1. System Admin clicks **[Validate]**
2. Button enters loading state: `Validating...` with spinner icon
3. System runs dependency checks and compatibility validation against target environment
4. On success → Status updates to `Validated`; toast: *"Change set validated successfully."*
5. On failure → Status updates to `Failed`; error panel renders below with component-level failure list

#### 6.3.4 Deploy Flow

1. System Admin clicks **[Deploy]**
2. **Confirmation modal** renders:
   ```
   ┌─────────────────────────────────────┐
   │  Confirm Deployment                 │
   │                                     │
   │  You are about to deploy:           │
   │  "Case Module Updates v3"           │
   │  From: DEV → TEST                   │
   │                                     │
   │  This action cannot be undone.      │
   │                                     │
   │         [Cancel]   [Deploy Now]     │
   └─────────────────────────────────────┘
   ```
3. System Admin clicks **[Deploy Now]**
4. Button enters loading state: `Deploying...`
5. On success → Status updates to `Succeeded`; new row added to Deployment History
6. On failure → Status updates to `Failed`; error panel with component-level failure details

---

### 6.4 Inbound Change Sets

**Route:** `/settings/deployment/inbound`

#### 6.4.1 Overview

Inbound change sets are change sets that **this environment receives** from a lower environment. For example, `test` receives inbound change sets from `dev`; `prod` receives inbound change sets from `test`.

```
┌─────────────────────────────────────────────────────────┐
│  App Settings > Deployment > Inbound Change Sets        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Inbound Change Sets                                    │
│                                                         │
│  This environment receives change sets from connected   │
│  lower environments. System Admins must validate and    │
│  deploy each inbound change set to apply it.            │
│                                                         │
│  PENDING INBOUND                                        │
│  ─────────────────────────────────────────────────────  │
│  Name            Source    Received       Status        │
│  WO Fields v2    dev       13 Jun 2026    🟡 Pending    │
│  SA Templates    dev       11 Jun 2026    ✅ Deployed   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 6.4.2 Inbound Change Set Detail

The Inbound Change Set Detail page mirrors the Outbound detail layout, with:
- Read-only source information (cannot be edited by the receiving environment)
- **[Validate]** and **[Deploy]** actions for `SYSTEM_ADMIN` users
- Full **Deployment History** panel

---

### 6.5 Deployment Connections

**Route:** `/settings/deployment/connections`

Deployment Connections define the authorised promotion paths between environments.

| Connection Name | Source | Target | Status |
|----------------|--------|--------|--------|
| Dev → Test | `dev` | `test` | Active |
| Test → Production | `test` | `prod` | Active |

- System Admins can activate/deactivate connections
- A deactivated connection prevents all outbound change sets from being deployed along that path
- New connections can only be created by `SYSTEM_ADMIN`

---

## 7. Deployment History

### 7.1 Global History View

**Route:** `/settings/deployment/history`

A consolidated log of all deployments across all change sets and environments.

```
┌────────────────────────────────────────────────────────────────────┐
│  Deployment History                                                │
│                                                                    │
│  Filter: [All Environments ▾]  [All Statuses ▾]  [Date Range ▾]   │
│                                                                    │
│  Change Set       From    To     Actor       Time          Status  │
│  Case Module v3   dev     test   A. Rahman   13 Jun 9AM   ✅ OK    │
│  WO Fields v2     dev     test   A. Rahman   12 Jun 4PM   ❌ Fail  │
│  SA Templates     test    prod   J. Okafor   10 Jun 2PM   ✅ OK    │
│                                                                    │
│  Showing 1–20 of 47 records            [← Prev]  [Next →]         │
└────────────────────────────────────────────────────────────────────┘
```

### 7.2 History Record Fields

| Field | Type | Description |
|-------|------|-------------|
| `change_set_id` | UUID | Foreign key to the change set |
| `change_set_name` | String | Human-readable name at time of deployment |
| `source_environment` | Enum | `dev` / `test` / `prod` |
| `target_environment` | Enum | `dev` / `test` / `prod` |
| `actor_user_id` | UUID | User who triggered the action |
| `action_type` | Enum | `Validate` / `Deploy` |
| `started_at` | Timestamp | UTC |
| `completed_at` | Timestamp | UTC |
| `status` | Enum | `Succeeded` / `Failed` / `In Progress` |
| `error_detail` | Text (nullable) | Component-level failure messages |

---

## 8. Planning Questions

The following five questions must be answered before this PRD moves to the engineering sprint:

---

### ❓ Q1 — Change Set Expiration Policy
> **"Should change sets have a mandatory expiration date, and what happens to a change set that expires before it is deployed?"**

*Context:* Stale change sets referencing outdated objects can cause deployment failures if they sit undeployed for weeks. A 30-day expiration with auto-archival is proposed. Confirm whether expired change sets should be auto-deleted or moved to an `Archived` state for audit purposes.

---

### ❓ Q2 — Component Scope for Change Sets
> **"Which object types should be supported as change set components in v1.0 — only custom fields and objects, or also page layouts, permission sets, flows, and reports?"**

*Context:* Expanding the component scope beyond fields/objects adds significant complexity to the validation engine. A phased approach (fields + objects in v1.0; layouts + flows in v1.1) is recommended. Stakeholder sign-off needed.

---

### ❓ Q3 — Deployment Windows
> **"Should production deployments be restricted to approved maintenance windows (e.g. weekends, off-peak hours), or can System Admins deploy to `prod` at any time?"**

*Context:* Unrestricted `prod` deployments increase risk during peak usage. A soft-enforcement model (warning if deploying during business hours) is proposed over hard blocking, but the business must decide the policy.

---

### ❓ Q4 — Multi-Admin Concurrent Deployments
> **"If two System Admins attempt to deploy different change sets to the same environment simultaneously, how should the system handle the conflict?"**

*Context:* Concurrent deployments can corrupt environment state. Options are: (a) queue deployments sequentially, (b) lock the environment during an active deployment, (c) allow concurrent but scope-check for object collisions. Decision needed before implementing the deploy backend.

---

### ❓ Q5 — Audit Log Retention & Export
> **"How long must deployment history be retained, and do System Admins need to export audit logs (e.g. for compliance reporting)?"**

*Context:* If the UT Service Console operates under any compliance framework (ISO 27001, SOC 2, GDPR Article 30), a minimum 12-month retention with exportable CSV/PDF logs may be mandated. Confirm with Legal/Compliance before implementing the history data model.

---

## 9. Acceptance Criteria

| ID | Criteria |
|----|---------|
| AC-01 | Deployment section appears in App Settings sidebar for all roles except `FIELD_USER` |
| AC-02 | Validate and Deploy buttons are disabled (not hidden) for non-SYSTEM_ADMIN users with tooltip |
| AC-03 | A change set cannot be deployed if its status is not `Validated` — Deploy button is disabled |
| AC-04 | Deploying to `prod` always shows a two-step confirmation modal before proceeding |
| AC-05 | Every Validate and Deploy action creates a record in Deployment History |
| AC-06 | Deployment History is filterable by environment, status, and date range |
| AC-07 | Failed deployments show a component-level error breakdown, not a generic error message |
| AC-08 | Inbound change sets are read-only to the receiving environment (cannot edit name/components) |
| AC-09 | Deployment Connections can only be created or modified by `SYSTEM_ADMIN` |
| AC-10 | System Admin receives an in-app notification and email on every `prod` deployment |
| AC-11 | The Validate step cannot be skipped — Deploy button remains disabled until Validate succeeds |

---

## 10. UI Component Reference (Design System)

All components in this feature must conform to the UT Service Console Design System.

| Component | Design System Reference | Notes |
|-----------|------------------------|-------|
| Section cards | Section 5.2 — Section Card | Use for Deployment History, Source Info |
| Action buttons | Section 4.1 — Primary Button | Validate = primary; Delete = secondary |
| Status badges | Section 7.4 — Inline Status Badge | Use WO status colour mapping as base |
| Form inputs | Section 6.1 — Input Field | Change set name, description fields |
| Confirmation modal | Section 5.1 — Standard Card | Overlay with two-button footer |
| Sidebar navigation | Section 8 — Light/Dark Mode | Follows global theme toggle |
| History table | Section 2.3 — `text-sm` body | Paginated, `text-xs` for metadata cells |

---

## 11. Dependencies

| Dependency | Owner | Status |
|-----------|-------|--------|
| Pipeline Overview (PRD-01) | Product Team | Draft |
| RBAC — SYSTEM_ADMIN role enforcement | Platform Team | In Progress |
| Change set validation engine (backend) | Engineering | Not Started |
| Deployment connection management API | Engineering | Not Started |
| In-app notification system | Platform Team | Existing |
| Email alert service | Platform Team | Existing |

---

## 12. Open Items

| # | Item | Owner | Due |
|---|------|-------|-----|
| OI-01 | Confirm component scope for v1.0 change sets (Q2) | Product + Engineering | — |
| OI-02 | Define deployment window policy (Q3) | Business Operations | — |
| OI-03 | Audit log retention requirements sign-off (Q5) | Legal / Compliance | — |
| OI-04 | Concurrent deployment conflict resolution strategy (Q4) | Engineering Lead | — |
| OI-05 | Confirm expiration policy for stale change sets (Q1) | Product | — |
