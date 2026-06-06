# Functional Requirements Document
## Field Service Tracking — End-to-End Appointment Workflow
### OPERATIONS Platform · v4.2.0-stable

---

**Document Type:** Functional Requirements Document (FRD)  
**Module:** Field Service — Appointment Lifecycle & Gantt Scheduling  
**Platform:** OPERATIONS CRM · Field Service Module  
**Version:** 1.0.0  
**Status:** Draft  
**Last Updated:** 2026-06-06  

---

## 1. Purpose

This document defines the **end-to-end functional requirements** for Field Service appointment tracking within the OPERATIONS platform. It covers the complete lifecycle from initial appointment booking — initiated via the **Feed tab on a Work Order** — through **Service Appointment (SA) creation**, and culminating in **resource assignment on the Gantt Chart Dispatch Console**.

The UI is required to support both **Light Mode** and **Dark Mode** rendering, using the design token system defined in `code.html` (v4.2.0-stable).

---

## 2. Scope

| Area | In Scope |
|---|---|
| Work Order Feed Tab — Book Appointment action | ✅ |
| Service Appointment (SA) auto-creation flow | ✅ |
| SA field population at creation | ✅ |
| SA detail view (light + dark mode) | ✅ |
| Gantt Chart resource assignment | ✅ |
| Dispatch Console SA block rendering | ✅ |
| Status transitions throughout lifecycle | ✅ |
| SA field schema (full detail) | See FRD-SA-Fields.md |

---

## 3. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        OPERATIONS CRM                           │
│                                                                 │
│  ┌──────────────┐    Feed Action    ┌──────────────────────┐   │
│  │  Work Order  │ ──────────────► │  Book Appointment     │   │
│  │  (WO-XXXX)   │                  │  Modal / Form         │   │
│  └──────────────┘                  └──────────┬───────────┘   │
│                                               │ Creates SA      │
│                                               ▼                 │
│                                    ┌──────────────────────┐   │
│                                    │  Service Appointment  │   │
│                                    │  (SA-XXXXX)           │   │
│                                    │  Status: Scheduled    │   │
│                                    └──────────┬───────────┘   │
│                                               │                 │
│                         ┌─────────────────────┴─────────┐      │
│                         │                               │      │
│                         ▼                               ▼      │
│              ┌──────────────────┐           ┌──────────────┐  │
│              │  Schedule Tab    │           │  Dispatch    │  │
│              │  (Gantt Chart)   │           │  Console     │  │
│              │  Resource View   │           │  (Map + SA   │  │
│              └──────────────────┘           │  List)       │  │
│                                             └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. User Roles

| Role | Permissions |
|---|---|
| Dispatcher | Create/edit SA, assign to Gantt resources, change status |
| Field Technician | View assigned SA, update Actual Start/End, add Service Note |
| Administrator | Full access, configure field visibility and picklist values |
| Manager / Read-Only | View SA and Gantt, export analytics |

---

## 5. Workflow Step 1 — Work Order Feed Tab: Book Appointment

### 5.1 Trigger Point

The Field Service tracking lifecycle begins when a user navigates to a **Work Order record** and initiates the **"Book Appointment"** action from the **Feed tab**.

### 5.2 UI Requirements — Feed Tab

| Element | Requirement |
|---|---|
| Location | Work Order record page → Feed tab (chatter/activity feed) |
| Action Button Label | `+ Book Appointment` |
| Button Style | Primary action, styled with `bg-primary-container` color (`#f5c800`) |
| Placement | Pinned to the top of the Feed tab action bar |
| Visibility | Visible to Dispatcher and Administrator roles only |
| Dark Mode | Button background uses `primary-fixed-dim` (`#eec200`) token |

### 5.3 Book Appointment Modal — Field Requirements

When the user clicks **"+ Book Appointment"**, a modal dialog opens with the following fields:

| Field | Type | Required | Pre-filled From |
|---|---|---|---|
| Subject | Short Text | Yes | Work Order Subject (editable) |
| Service Territory | Reference Lookup | Yes | Work Order Service Territory |
| Scheduled Start | DateTime Picker | Yes | — (user selects) |
| Scheduled End | DateTime Picker | Yes | Auto-calculated from Duration |
| Duration | Number | Yes | Inherited from Work Order |
| Duration Type | Picklist (Hours/Minutes) | Yes | Inherited from Work Order |
| Earliest Start Permitted | DateTime Picker | No | Work Order SLA Start |
| Due Date | DateTime Picker | No | Work Order SLA Due Date |
| Arrival Window Start | DateTime Picker | No | — |
| Arrival Window End | DateTime Picker | No | — |
| Description | Long Text | No | Work Order Description |
| Offsite Appointment | Checkbox | No | `false` |

### 5.4 Validation Rules — Booking Modal

- `Scheduled End` must be after `Scheduled Start`
- `Due Date` must be after `Earliest Start Permitted` if both are provided
- `Arrival Window End` must be after `Arrival Window Start` if both are provided
- `Duration` must be a positive number greater than zero
- If `Offsite Appointment` is checked, display a confirmation prompt: *"This appointment will not include travel time in the schedule."*

### 5.5 Confirmation & SA Creation

On successful modal submission:

1. A new `ServiceAppointment` record is created with `Status = Scheduled`
2. `Appointment Number` is auto-assigned
3. `Parent Record` is set to the originating Work Order (locked — cannot be changed)
4. User receives an inline success notification: *"Service Appointment [SA-XXXXX] created successfully."*
5. The Feed tab displays a new Feed entry: *"Service Appointment SA-XXXXX booked for [Scheduled Start]"*

---

## 6. Workflow Step 2 — Service Appointment (SA) Record

### 6.1 SA Detail View Requirements

The SA detail view must be accessible from:

- Work Order → Related SA list
- Schedule Tab → Gantt Chart appointment block (click to open)
- Dispatch Console → SA list item → detail panel

### 6.2 SA Detail Page — Section Layout

The SA detail page is organized into the following collapsible sections:

#### Section 1: Appointment Header *(Always visible)*
Displays: `Appointment Number`, `Subject`, `Status` badge, `Parent Record` link

#### Section 2: Scheduling
Fields: `Scheduled Start`, `Scheduled End`, `Duration`, `Duration Type`, `Earliest Start Permitted`, `Due Date`, `Arrival Window Start`, `Arrival Window End`

#### Section 3: Location
Fields: `Address`, `Service Territory`, `Latitude` (admin only), `Longitude` (admin only), `Offsite Appointment`

#### Section 4: Stakeholders
Fields: `Account`, `Contact`, `Work Type`, `Parent Record Type`, `Parent Record Status Category`

#### Section 5: Actuals *(Editable by Technician)*
Fields: `Actual Start`, `Actual End`, `Actual Duration (Minutes)` (auto-filled, editable), `Service Note`

#### Section 6: Description & Notes
Fields: `Description`, `Service Note`

#### Section 7: Bundle Configuration *(Visible only when Bundle or Bundle Member = true)*
Fields: `Bundle`, `Bundle Member`, `Bundle Policy`, `Related Bundle`, `Manually Bundled`

#### Section 8: System Information *(Read-only, collapsible)*
Fields: `Schedule Mode`, `Transaction`, `DurationInMinutes`

---

### 6.3 Light Mode — SA Detail View Token Mapping

| UI Element | Token | Hex Value |
|---|---|---|
| Page Background | `background` | `#f9f9f9` |
| Card / Section Background | `surface` | `#f9f9f9` |
| Section Header Background | `surface-container-low` | `#f3f3f3` |
| Primary Text | `on-surface` | `#1a1c1c` |
| Secondary / Label Text | `on-surface-variant` | `#4d4632` |
| Border / Divider | `outline-variant` | `#d1c6ab` |
| Input Background | `surface-container-lowest` | `#ffffff` |
| Input Border | `outline` | `#7f7660` |
| Active / Required Indicator | `primary-container` | `#f5c800` |
| Status Badge — Scheduled | `primary-container` | `#f5c800` |
| Status Badge — In Progress | `secondary-container` | `#e5e2e1` |
| Status Badge — Completed | `surface-dim` | `#dadada` |
| Status Badge — Canceled | `error-container` | `#ffdad6` |
| Status Badge — Cannot Complete | `error-container` | `#ffdad6` |
| Status Badge Text — Canceled | `on-error-container` | `#93000a` |
| Save Button | `primary-container` | `#f5c800` |
| Save Button Text | `on-primary-container` | `#695400` |

---

### 6.4 Dark Mode — SA Detail View Token Mapping

> Dark mode is activated by adding `class="dark"` to the `<html>` element (as per `tailwind.config` in `code.html`).

| UI Element | Dark Mode Color | Notes |
|---|---|---|
| Page Background | `#1a1c1c` | Inverse of `on-surface` |
| Card / Section Background | `#2f3131` | `inverse-surface` |
| Section Header Background | `#252728` | Darkened surface-container |
| Primary Text | `#f1f1f1` | `inverse-on-surface` |
| Secondary / Label Text | `#c6c6c6` | `tertiary-fixed-dim` |
| Border / Divider | `#4d4632` | `on-surface-variant` |
| Input Background | `#2f3131` | `inverse-surface` |
| Input Border | `#7f7660` | `outline` |
| Active / Required Indicator | `#eec200` | `primary-fixed-dim` / `inverse-primary` |
| Status Badge — Scheduled | `#695400` | `on-primary-container` as background |
| Status Badge — In Progress | `#474646` | `on-secondary-fixed-variant` |
| Status Badge — Completed | `#454747` | `on-tertiary-fixed-variant` |
| Status Badge — Canceled | `#93000a` | `on-error-container` as background |
| Save Button | `#eec200` | `primary-fixed-dim` |
| Save Button Text | `#231b00` | `on-primary-fixed` |

---

## 7. Workflow Step 3 — Gantt Chart Resource Assignment

### 7.1 Overview

After an SA is created with `Status = Scheduled`, it appears in the **Unassigned** queue in the Schedule tab (Gantt Chart view). Dispatchers can assign it to a Service Resource by dragging the SA block onto the Gantt row, or using the right-click context menu.

### 7.2 Gantt Chart — UI Requirements

The Gantt Chart view is accessed via **Schedule → Gantt** and displays:

| Element | Requirement |
|---|---|
| View Modes | Day, Week, Month |
| Date Navigation | Previous/Next arrows + calendar date picker |
| Today Button | Highlighted in `primary-container` yellow |
| Filter Panel | Left sidebar with Territory, Skill Level, Resource Type filters |
| Resource Row | Shows technician avatar, name, level, capacity bar |
| Capacity Bar | Linear progress bar: green < 80%, yellow 80–99%, red at 100% |
| SA Block | Color-coded by status; shows time range + WO reference |
| SA Block — Confirmed | `bg-surface-container-lowest` with dark border |
| SA Block — Tentative | `bg-surface-container` with dashed border |
| SA Block — Absence | `bg-error-container` with `border-error` color |
| Current Day Column | Highlighted with `bg-surface-container-low` |
| Weekend Columns | Dimmed with `bg-surface-variant` + `opacity-30` |

### 7.3 Gantt Chart — Dark Mode Requirements

| Element | Dark Mode Appearance |
|---|---|
| Background | `#1a1c1c` |
| Grid Lines | `#2f3131` / `inverse-surface` |
| Resource Column | `#252728` |
| SA Block — Confirmed | `#2f3131` background, `#eec200` border |
| SA Block — Tentative | `#252728` background, dashed `#4d4632` border |
| SA Block — Absence | `#93000a` background, `#ba1a1a` border |
| Header Text | `#f1f1f1` |
| Resource Name | `#f1f1f1` |
| Resource Sublabel | `#c6c6c6` |
| Today Button | `#eec200` background, `#231b00` text |

### 7.4 Gantt SA Block — Content Requirements

Each SA block on the Gantt must display:

```
┌────────────────────────────────┐
│  08:00 - 17:00                 │
│  WO-9921 (Prev. Maint)         │
└────────────────────────────────┘
```

| Element | Source Field | Format |
|---|---|---|
| Time Range | `SchedStartTime` + `SchedEndTime` | `HH:MM - HH:MM` |
| Work Order Reference | `ParentRecord.Name` | `WO-XXXX` |
| Job Type Label | `WorkType.Name` | `(Type Name)` truncated |
| Status Color | `Status` | Color-coded background |

### 7.5 Resource Assignment — Drag & Drop

| Action | Behavior |
|---|---|
| Drag SA from Unassigned queue → Resource Row | Opens confirmation dialog; on confirm, sets `SchedStartTime`, `SchedEndTime`, and `AssignedResource` |
| Drop on occupied time slot | Shows conflict warning: *"This slot overlaps with [WO-XXXX]. Proceed?"* |
| Right-click SA block | Context menu: Edit, Reassign, Dispatch, Cancel |
| Double-click SA block | Opens SA detail panel (side sheet) |

### 7.6 After Assignment — SA Field Updates

When an SA is successfully assigned to a resource via the Gantt:

| Field | Updated Value |
|---|---|
| `SchedStartTime` | Set to the dropped time position |
| `SchedEndTime` | `SchedStartTime + Duration` |
| `Status` | Remains `Scheduled` (auto-advances to `Dispatched` when resource departs) |
| `Schedule Mode` | Set to `Drag and Drop` (or `Schedule` if done via optimizer) |
| `ServiceTerritoryMemberId` | Set to the assigned resource's territory member ID |

---

## 8. Workflow Step 4 — Dispatch & Status Transitions

### 8.1 Dispatch Console Integration

Assigned SAs appear in the **Dispatch Console** (Map view) under the `ACTIVE DISPATCHES` sidebar with:

- SA Number (`SA-XXXXX`)
- Technician name
- Status badge: `ON-SITE`, `IN TRANSIT`, `SCHEDULED`
- ETA (if in transit)

### 8.2 Status Transition Triggers

| From Status | To Status | Trigger |
|---|---|---|
| `Scheduled` | `Dispatched` | Technician marks "Depart" in mobile app |
| `Dispatched` | `In Progress` | Technician marks "Arrive" / Actual Start set |
| `In Progress` | `Completed` | Technician marks "Complete" / Actual End set |
| `In Progress` | `Cannot Complete` | Technician marks "Cannot Complete" with reason |
| Any | `Canceled` | Dispatcher cancels via SA record or Gantt context menu |

### 8.3 Status Badge — Visual Specification

| Status | Light Mode | Dark Mode |
|---|---|---|
| Scheduled | `#f5c800` bg / `#695400` text | `#695400` bg / `#f5c800` text |
| Dispatched | `#e5e2e1` bg / `#1c1b1b` text | `#474646` bg / `#e5e2e1` text |
| In Progress | `#f5c800` bg / `#695400` text | `#695400` bg / `#f5c800` text |
| Completed | `#dadada` bg / `#1a1c1c` text | `#2f3131` bg / `#c6c6c6` text |
| Cannot Complete | `#ffdad6` bg / `#93000a` text | `#93000a` bg / `#ffdad6` text |
| Canceled | `#ffdad6` bg / `#93000a` text | `#93000a` bg / `#ffdad6` text |

---

## 9. Notifications & Audit Trail

### 9.1 Feed Entry Requirements

Each of the following actions must produce a new **Feed entry** on both the SA record and the parent Work Order:

| Action | Feed Entry Text |
|---|---|
| SA Created | *"Service Appointment [SA-XXXXX] created and scheduled for [Date]."* |
| SA Assigned to Resource | *"[SA-XXXXX] assigned to [Technician Name] starting [Start Time]."* |
| Status → Dispatched | *"[Technician Name] has been dispatched for [SA-XXXXX]."* |
| Status → In Progress | *"Work has started on [SA-XXXXX] at [Actual Start Time]."* |
| Status → Completed | *"[SA-XXXXX] completed at [Actual End Time]. Duration: [X] min."* |
| Status → Cannot Complete | *"[SA-XXXXX] could not be completed. Reason: [Note]."* |
| Status → Canceled | *"[SA-XXXXX] has been canceled."* |

### 9.2 SLA Monitoring

- An **Overdue** indicator must appear on the SA record and the Gantt block if `Due Date` has passed and `Status` is not `Completed` or `Canceled`
- Overdue SAs are highlighted with `error` (`#ba1a1a`) border on the Gantt block
- The KPI Dashboard must reflect overdue count in the **OVERDUE** metric card with red border styling

---

## 10. Accessibility & Theme Requirements

### 10.1 Theme Toggle

The platform must support a **persistent theme preference** stored in user settings:

| Setting | Behavior |
|---|---|
| Light Mode | `<html class="light">` — Default |
| Dark Mode | `<html class="dark">` — User-selected |
| Toggle Control | Available in user profile menu (top-right) |
| Persistence | Stored in user preferences; survives page refresh |

### 10.2 Typography

| Element | Light Mode | Dark Mode |
|---|---|---|
| Font Family (Body) | Hanken Grotesk | Hanken Grotesk |
| Font Family (Labels/Mono) | JetBrains Mono | JetBrains Mono |
| Heading (H1) Size | 32px / `headline-lg` | 32px / `headline-lg` |
| Body Size | 16px / `body-md` | 16px / `body-md` |
| Label Size | 12px / `label-sm` | 12px / `label-sm` |

### 10.3 Accessibility

- All interactive elements must meet WCAG 2.1 AA contrast ratios
- SA status badges must include both color and text labeling (no color-only indicators)
- Modal dialogs must trap focus and support `Escape` to close
- Gantt chart must support keyboard navigation (Tab, Arrow keys, Enter to assign)

---

## 11. Acceptance Criteria

### 11.1 Feed Tab → SA Creation

- [ ] `+ Book Appointment` button is visible in the Work Order Feed tab for Dispatcher and Admin roles
- [ ] Modal opens with pre-filled fields from the Work Order
- [ ] SA is created on modal submit with `Status = Scheduled`
- [ ] `Appointment Number` is auto-assigned and read-only
- [ ] `Parent Record` is locked to the originating Work Order after creation
- [ ] Feed entry is created on both SA and Work Order

### 11.2 SA Detail View

- [ ] SA detail page renders all required sections
- [ ] Light mode and Dark mode render correctly using the defined token mapping
- [ ] `Actual Duration` auto-populates on first `Actual Start` / `Actual End` entry
- [ ] `Actual Duration` does NOT auto-recalculate on subsequent edits (manual only)
- [ ] Bundle section is hidden when `Bundle = false` AND `Bundle Member = false`
- [ ] System Information section is collapsed by default

### 11.3 Gantt Chart Assignment

- [ ] Unassigned SAs appear in the Gantt queue after creation
- [ ] Drag-and-drop assigns SA to resource and updates `SchedStartTime` / `SchedEndTime`
- [ ] Conflict detection warns on overlapping assignments
- [ ] `Schedule Mode` field updates to reflect assignment method
- [ ] SA block renders with correct time range, WO reference, and status color

### 11.4 Dark Mode

- [ ] All views (SA detail, Gantt, Dispatch Console, Feed) support dark mode
- [ ] All color tokens match the dark mode specification in Sections 6.4 and 7.3
- [ ] No hardcoded hex colors in dark mode — all styling via Tailwind token classes

---

## 12. Revision History

| Version | Date | Author | Change Summary |
|---|---|---|---|
| 1.0.0 | 2026-06-06 | System Admin | Initial draft — complete Field Service tracking FRD |

---

*OPERATIONS Platform · Field Service Module · Confidential Internal Document*
