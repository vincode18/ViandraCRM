# PRD-01 — Deployment Pipeline & Environment Architecture
**UT Service Console · Deployment Module**

> **Document Version:** 1.0
> **Last Updated:** 2026-06-13
> **Status:** Draft — Pending Stakeholder Review
> **Author:** Product Team
> **Related Doc:** PRD-02 — Change Set Management & Role-Based Deployment

---

## 1. Executive Summary

This PRD defines the three-tier deployment environment architecture for the UT Service Console: **Development (dev)**, **Testing (test)**, and **Production (prod)**. It establishes the flow of code and configuration changes from sandbox creation through to live production, the UI representation of the environment pipeline, and the structural guard rails that prevent unvalidated changes from reaching production.

---

## 2. Problem Statement

Currently, the UT Service Console has no formalised promotion pipeline. Changes made by developers go directly to production, bypassing structured quality gates. This creates:

- **Risk of regressions** — untested changes break live users' workflows
- **No audit trail** — no record of what was deployed, when, and by whom
- **No rollback mechanism** — failed deployments cannot be traced or reversed cleanly
- **No separation of concerns** — dev, test, and prod environments share state inconsistently

---

## 3. Goals

| # | Goal | Success Metric |
|---|------|---------------|
| G1 | Define three distinct, isolated environments | Each environment has a unique URL, database, and configuration |
| G2 | Enforce linear promotion: dev → test → prod | No change set can skip the test stage |
| G3 | Surface environment health visually in the app | Pipeline view shows real-time status of all three environments |
| G4 | Give System Admins full control over promotion | Only `SYSTEM_ADMIN` role can validate and deploy between stages |
| G5 | Provide an audit log for every deployment action | All actions stored with actor, timestamp, status, and environment |

---

## 4. Non-Goals (Out of Scope for v1.0)

- Automated CI/CD integration (GitHub Actions, Jenkins pipelines)
- Automatic rollback triggered by error thresholds
- Blue/green or canary deployment strategies
- Multi-tenant environment management
- Environment branching (feature-branch environments)

---

## 5. Environment Definitions

### 5.1 Overview Table

| Environment | Label | Purpose | Access Level | Data |
|-------------|-------|---------|-------------|------|
| Development | `dev` | Active feature development, experimentation | Developers + System Admins | Synthetic / anonymised |
| Testing | `test` | QA validation, UAT, regression testing | QA Team + System Admins | Synthetic / anonymised |
| Production | `prod` | Live end-users, real operational data | System Admins only (for deploy) | Real |

### 5.2 Development Environment (`dev`)

- **Purpose:** The sandbox where all new features, configurations, and customisations originate.
- **Refresh Cadence:** Weekly full sandbox refresh (or on-demand by System Admin).
- **Data Policy:** Contains only anonymised or synthetic data. No real customer records.
- **Key Rules:**
  - Changes cannot be promoted directly to `prod` — must pass through `test`.
  - Any developer can create or modify objects.
  - Deployments to `dev` do not require System Admin approval.
- **Environment URL Pattern:** `dev.console.ut-service.internal`

### 5.3 Testing Environment (`test`)

- **Purpose:** Receives promoted change sets from `dev`. Used by QA engineers and business stakeholders for acceptance testing before go-live.
- **Refresh Cadence:** Refreshed from `prod` snapshot monthly, or before major UAT cycles.
- **Data Policy:** Uses a sanitised copy of production data (PII masked).
- **Key Rules:**
  - Only System Admins can deploy inbound change sets from `dev`.
  - A change set must have `Validated` status in `dev` before it can be promoted.
  - Failed test deployments are logged but do not affect `prod`.
- **Environment URL Pattern:** `test.console.ut-service.internal`

### 5.4 Production Environment (`prod`)

- **Purpose:** The live system accessed by end-users (field agents, service managers, dispatchers).
- **Refresh Cadence:** Never refreshed from another environment — source of truth for data.
- **Data Policy:** Real operational data; full PII protections apply.
- **Key Rules:**
  - Only change sets that have `Succeeded` validation AND deployment in `test` can be deployed to `prod`.
  - Two-step confirmation required before any `prod` deployment.
  - All deployments to `prod` trigger an email notification to the System Admin group.
- **Environment URL Pattern:** `console.ut-service.internal` (apex domain)

---

## 6. Promotion Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT PIPELINE                              │
│                                                                     │
│  ┌──────────────┐    OUTBOUND     ┌──────────────┐    OUTBOUND     │
│  │              │  Change Set ──► │              │  Change Set ──► │
│  │     DEV      │                 │     TEST      │                 │
│  │   Sandbox    │ ◄── INBOUND     │   Sandbox    │ ◄── INBOUND     │
│  │              │  Change Set     │              │  Change Set     │
│  └──────────────┘                 └──────────────┘                 │
│         │                                │                         │
│         │   1. Developer creates         │   3. QA validates       │
│         │      change set in dev         │      in test            │
│         │   2. System Admin validates    │   4. System Admin       │
│         │      & deploys outbound        │      deploys to prod    │
│         │                                │                         │
│                                          ▼                         │
│                               ┌──────────────────┐                 │
│                               │                  │                 │
│                               │   PRODUCTION     │                 │
│                               │    (Live)        │                 │
│                               │                  │                 │
│                               └──────────────────┘                 │
│                                                                     │
│  Status indicators:  🟢 Healthy  🟡 Deploying  🔴 Failed           │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.1 Step-by-Step Promotion Sequence

| Step | Actor | Action | System Response |
|------|-------|--------|----------------|
| 1 | Developer | Creates/modifies objects in `dev` | Change tracked in dev environment |
| 2 | Developer | Creates an outbound change set in `dev` | Change set status: `Draft` |
| 3 | System Admin | Adds components to the change set | Change set status: `Open` |
| 4 | System Admin | Clicks **Validate** (dev → test) | Status: `Validating...` → `Validated` or `Failed` |
| 5 | System Admin | Clicks **Deploy** (outbound from dev) | Status: `Deploying` → `Succeeded` or `Failed` |
| 6 | QA Team | Tests changes in `test` environment | — |
| 7 | System Admin | Clicks **Validate** (test → prod) | Status: `Validating...` → `Validated` or `Failed` |
| 8 | System Admin | Clicks **Deploy** (outbound from test) | Status: `Deploying` → `Succeeded` or `Failed` |
| 9 | System | Sends deployment success notification | Email alert to System Admin group |

---

## 7. Pipeline View — UI Specification

### 7.1 Page: Deployment Pipeline Overview

**Route:** `/settings/deployment/pipeline`
**Access:** System Admin only

#### Layout

```
┌─────────────────────────────────────────────────────┐
│  App Settings > Deployment > Pipeline               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  DEPLOYMENT PIPELINE                  [Refresh ↺]  │
│                                                     │
│  ┌─────────────┐  ──►  ┌─────────────┐  ──►  ┌──────────────┐  │
│  │  DEV        │       │   TEST       │       │  PROD        │  │
│  │  Sandbox    │       │   Sandbox    │       │  Live        │  │
│  │             │       │             │       │              │  │
│  │  🟢 Healthy │       │  🟢 Healthy │       │  🟢 Healthy  │  │
│  │  v2.4.1     │       │  v2.3.8     │       │  v2.3.7      │  │
│  │             │       │             │       │              │  │
│  │  [View CS]  │       │  [View CS]  │       │  [View Log]  │  │
│  └─────────────┘       └─────────────┘       └──────────────┘  │
│                                                     │
│  DEPLOYMENT HISTORY                                 │
│  ─────────────────────────────────────────────────  │
│  Action       From   To     Time        Status      │
│  View Results dev    test   13 Jun 9AM  ✅ Succeeded │
│  View Results test   prod   12 Jun 4PM  ✅ Succeeded │
│  View Results dev    test   11 Jun 2PM  ❌ Failed    │
└─────────────────────────────────────────────────────┘
```

#### Environment Card Components

Each environment card (`dev`, `test`, `prod`) must display:

| Field | Description |
|-------|-------------|
| **Environment Label** | `DEV` / `TEST` / `PROD` badge |
| **Health Status** | 🟢 Healthy / 🟡 Deploying / 🔴 Failed |
| **Current Version** | Last successfully deployed change set version |
| **Last Deployed** | Relative timestamp (e.g. "2 hours ago") |
| **Quick Action** | `[View Change Sets]` or `[View Log]` |

#### Design Tokens (from Design System)

- Environment cards → use `.card` class with `var(--bg-card)` and `var(--border)`
- `DEV` label badge → `var(--color-info)` background tint
- `TEST` label badge → `var(--color-warning)` background tint
- `PROD` label badge → `var(--color-success)` background tint
- Arrow connectors between cards → `var(--text-muted)` colour
- Status indicators align with **Section 1.7 Semantic Colours** of the Design System

---

## 8. Planning Questions

The following five questions must be answered before this PRD moves to the engineering sprint:

---

### ❓ Q1 — Sandbox Refresh Strategy
> **"How frequently should the `test` environment be refreshed from `prod`, and who owns the scheduling of that refresh?"**

*Context:* If `test` data diverges too far from `prod` data, UAT results become unreliable. A monthly automated refresh is proposed, but stakeholders must align on whether QA owns this trigger or it is automated via a cron job.

---

### ❓ Q2 — Partial vs. Full Change Sets
> **"Should the system support partial component deployments (individual objects/fields) or must all changes be bundled in a full change set?"**

*Context:* Partial deployments are faster for hotfixes but harder to track atomically. Full change sets provide cleaner rollback paths. The decision affects the change set builder UI and validation logic.

---

### ❓ Q3 — Failed Deployment Recovery
> **"When a deployment to `prod` fails mid-way, what is the expected recovery behaviour — manual rollback, automatic rollback, or freeze-and-alert?"**

*Context:* A failed partial deployment to `prod` can leave the system in an inconsistent state. A defined policy (even if it's "manual rollback by System Admin within 30 minutes") must be documented before shipping this feature.

---

### ❓ Q4 — Notification & Alerting Scope
> **"Who receives deployment notifications, and at what granularity — only System Admins, or also team leads and module owners?"**

*Context:* Over-notifying creates noise; under-notifying delays incident response. The proposal is: System Admins always notified; module owners notified only on `prod` deployments affecting their module. Confirm or revise.

---

### ❓ Q5 — Environment Version Labelling Scheme
> **"What versioning scheme will be used to label change sets — semantic versioning (v2.4.1), date-stamps (2026-06-13), or a custom change set ID?"**

*Context:* The Pipeline Overview UI must display a "current version" for each environment. Without an agreed scheme, the display field is ambiguous and engineers cannot implement it consistently.

---

## 9. Acceptance Criteria

| ID | Criteria |
|----|---------|
| AC-01 | Three environments (`dev`, `test`, `prod`) exist as isolated instances with separate URLs |
| AC-02 | A change set created in `dev` cannot be deployed to `prod` without first succeeding in `test` |
| AC-03 | The Pipeline Overview page renders all three environment cards with health status |
| AC-04 | All deployment actions are logged with actor, timestamp, source env, target env, and status |
| AC-05 | Only users with `SYSTEM_ADMIN` role can access the Deployment section in App Settings |
| AC-06 | A deployment to `prod` requires a two-step confirmation modal |
| AC-07 | Failed deployments display an actionable error message (not a generic failure notice) |
| AC-08 | The Deployment History table is paginated and filterable by environment and status |

---

## 10. Dependencies

| Dependency | Owner | Status |
|-----------|-------|--------|
| Role-based access control (RBAC) system | Platform Team | In Progress |
| Change Set Management UI (PRD-02) | Product Team | Draft |
| Environment provisioning (dev/test/prod infra) | DevOps | Not Started |
| Email notification service | Platform Team | Existing |
| Audit log backend | Platform Team | Existing |

---

## 11. Open Items

| # | Item | Owner | Due |
|---|------|-------|-----|
| OI-01 | Confirm environment URL patterns with DevOps | DevOps Lead | — |
| OI-02 | Align on change set versioning scheme (Q5) | Product + Engineering | — |
| OI-03 | Define PII masking rules for test data refresh | Data Team | — |
| OI-04 | Legal sign-off on data residency in test env | Legal | — |
