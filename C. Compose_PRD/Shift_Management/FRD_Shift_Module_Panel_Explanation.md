# Functional Requirements Document
## Shift Management Module — UI & Panel Explanation
### Two-Column Detail Panel | Side Panel | Related Links & SA History

---

| Field | Value |
|---|---|
| **Document ID** | FRD-FSM-002 |
| **Version** | 1.0 |
| **Status** | Draft |
| **Date** | June 2026 |
| **Module** | Shift Management |
| **Companion Doc** | FRD-FSM-001 – Shift Management Module |
| **Platform** | Salesforce Field Service |

---

## Table of Contents

1. [Module Purpose & Overview](#1-module-purpose--overview)
2. [Full Module Layout Diagram](#2-full-module-layout-diagram)
3. [Shift Display – When the Shift is Shown](#3-shift-display--when-the-shift-is-shown)
4. [Shift Detail View – Two-Column Panel Layout](#4-shift-detail-view--two-column-panel-layout)
5. [Side Panel Specification](#5-side-panel-specification)
6. [Data Relationships & Object Model](#6-data-relationships--object-model)
7. [UX Behavior & Interaction Rules](#7-ux-behavior--interaction-rules)

---

## 1. Module Purpose & Overview

The Shift Management Module provides a unified interface for creating, viewing, and managing shifts assigned to service resources within a plant or service territory. This document explains the UI layout, the shift display logic, and the data architecture behind each panel in the module.

The module is composed of three primary UI zones:

- **Left Resource Panel** — Candidate list for drag-and-drop assignment
- **Main Content Area** — Gantt calendar (scheduling view) or Shift Detail (record view)
- **Side Panel** — Contextual links, SA history, and quick actions

> **Design Philosophy**
> The module follows a three-zone responsive layout aligned with Salesforce Lightning design principles. Each zone is independently scrollable and collapsible. Related data loads lazily on panel expansion to optimize performance.

---

## 2. Full Module Layout Diagram

The layout below represents the three-zone structure of the Shift Management Module as rendered in the Field Service application.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  Field Service   [SA-6129]   [All Service Appts]   [SA-6080]                   │
├──────────────────────────────────────────────────────────────────────────────── │
│  GANTT  MAP  ✉  💡          ⏱ 44h 0m  🚗 0h 11m  0/22  ⚠0  🔔0               │
├─────────────────┬───────────────────────────────────────────┬───────────────────┤
│                 │                                           │                   │
│  LEFT PANEL     │        MAIN CONTENT AREA                  │   SIDE PANEL      │
│  (20% width)    │        (57% width)                        │   (23% width)     │
│                 │                                           │                   │
│  Candidates     │  SAT NOV 9 │ SUN NOV 10 │ MON NOV 11     │  Shift Summary    │
│  for SA-5963    │  ──────────┼────────────┼────────────     │  ───────────────  │
│  ─────────────  │            │            │                 │  SA Assignments   │
│                 │  Alan Reed │            │ 64/100          │  ───────────────  │
│  Acme Partners  │  [100/100] │            │ 48/100          │  SA History       │
│  45/100 🟡      │            │            │ 49/100          │  ───────────────  │
│                 │  Harry Long│            │ 48/100          │  Territory Links  │
│  Alan Reed      │  [81/100]  │            │                 │  ───────────────  │
│  100/100 🟢     │            │            │                 │  Availability     │
│                 │  [1]       │            │ [2]             │  ───────────────  │
│  Harry Long     │  Sat Nov 9 │            │ Mon Nov 11      │  Actions          │
│  81/100 🟡      │  slots     │            │ slots           │                   │
│                 │            │            │                 │                   │
│  Matthew Parker │  Utilization: 8%        │ 35% booked      │  [ Edit Shift ]   │
│  49/100 🔴      │  0 hrs booked (0 sched) │ 7 hrs scheduled │  [ Clone Shift ]  │
│                 │                                           │  [ Cancel Shift ] │
│  Ralph Clark    │  America/Los_Angeles – Fri Nov 8, 2019    │  [ Reassign ]     │
│  48/100 🔴      │  1:23 PM                                  │                   │
│                 │                                           │                   │
│ [ASSIGN RECOM.] │  Search resources...  🔍  ▼              │                   │
└─────────────────┴───────────────────────────────────────────┴───────────────────┘
```

> **[1]** = Gantt blocks for Saturday November 9 — Alan Reed (100/100) and Harry Long (81/100)
> **[2]** = Gantt blocks for Monday November 11 — four resource candidates displayed with scores

### Zone Summary

| Zone | Width (approx.) | Scroll | Collapsible | Primary Role |
|---|---|---|---|---|
| **Left Resource Panel** | 20% | Vertical | Yes | Display candidates; drag source for shift creation |
| **Main Content Area** | 57% | Horizontal + Vertical | No | Gantt calendar or Shift Detail record view |
| **Side Panel** | 23% | Vertical | Yes | Contextual data: SA history, territory links, actions |

---

## 3. Shift Display – When the Shift is Shown

### 3.1 Gantt Calendar Display Triggers

Shift blocks are rendered on the Gantt calendar under the following conditions:

| Trigger | Condition | Visual Result |
|---|---|---|
| **Shift Created** | A Shift record exists with a Start Time and End Time for a given resource | Colored block appears in the resource row |
| **Status = Tentative** | Shift has not been confirmed | Block rendered with dashed border and muted color |
| **Status = Confirmed** | Shift has been approved and committed | Block rendered with solid border and full color |
| **Status = Cancelled** | Shift was cancelled | Block shown with strikethrough or greyed out style |
| **SA Overlap** | An SA exists in the same time window for the resource | Block shows overlap warning icon |
| **Holiday Shift** | `IsHoliday__c = true` on the shift record | Block shows holiday badge/icon in top corner |
| **Non-Standard** | `IsNonStandard__c = true` | Block shows asterisk or non-standard indicator |

### 3.2 Shift Cell Preview

When creating or editing a shift in the New Shift modal, a live **Shift Cell Preview** element shows the dispatcher exactly how the shift block will appear on the Gantt calendar. The preview reflects:

- Selected Background Color (hex picker)
- Label text
- Start and end times
- Holiday or Non-Standard badges if applicable

### 3.3 Shift Visibility in Service Field

Shifts are also surfaced in the **Service Field** display — a component visible on both the Gantt view and within service appointment records.

| Column | Description |
|---|---|
| **Shift Name** | Auto-generated shift identifier (e.g., SH-00012) |
| **Shift Time Window** | Formatted start-to-end time range |
| **Resource Name** | Assigned service resource |
| **Status** | Tentative / Confirmed / Cancelled |
| **Territory** | Associated service territory name |

---

## 4. Shift Detail View – Two-Column Panel Layout

When a dispatcher clicks a shift block on the Gantt calendar, the system opens the Shift Detail view. This view uses a **two-column panel layout** to organize shift data clearly.

### 4.1 Visual Representation

```
┌──────────────────────────────────────────┬──────────────────────────────────────┐
│  LEFT COLUMN — Shift Details             │  RIGHT COLUMN — Related Links        │
│  ══════════════════════════════          │  ══════════════════════════════       │
│                                          │                                      │
│  Shift Information                       │  Service Territory                   │
│  ─────────────────                       │  ─────────────────                   │
│  Shift Name:        SH-00012             │  Territory Name:   San Francisco  >  │
│  Status:            Tentative            │  Territory Members: 5 Members    >   │
│  Start Time:        5/22/2022  7:00 AM   │  Operating Hours:  Std. Business >  │
│  End Time:          5/22/2022  9:00 PM   │                                      │
│  Duration:          14 hours             │  SA History                          │
│  Time Slot Type:    Normal               │  ──────────────────                  │
│  Label:             (empty)              │  View All (8 Records)            >   │
│  Non-Standard:      No                   │  Last SA:          SA-5963           │
│  Holiday Shift:     No                   │  Status:           Dispatched        │
│  Background Color:  █ #0070D2            │  Work Order:       WO-00034      >   │
│  Recordset Filter:  [Emergency Only] ×   │  Assignments:      3 Active      >   │
│                                          │                                      │
│  Resource & Territory                    │                                      │
│  ─────────────────────                   │                                      │
│  Service Resource:  Alan Reed            │                                      │
│  Resource Type:     Field Supervisor     │                                      │
│  Job Profile:       Field Supervisor     │                                      │
│  Service Territory: San Francisco        │                                      │
│  Plant / Location:  SF North Depot       │                                      │
└──────────────────────────────────────────┴──────────────────────────────────────┘
```

### 4.2 Left Column Panel – Shift Details Specification

#### 4.2.1 Shift Information

| Field | Type | Display Format | Editable |
|---|---|---|---|
| **Shift Name** | Auto-Number | SH-XXXXX | No |
| **Status** | Picklist | Pill badge (Tentative / Confirmed / Cancelled) | Yes |
| **Start Time** | DateTime | MM/DD/YYYY  HH:MM AM/PM | Yes |
| **End Time** | DateTime | MM/DD/YYYY  HH:MM AM/PM | Yes |
| **Duration (hrs)** | Formula | Calculated, e.g., 14 hours 0 minutes | No |
| **Time Slot Type** | Picklist | Normal / Emergency / Extended | Yes |
| **Label** | Text(80) | Free text; shown on Gantt block | Yes |
| **Non-Standard** | Checkbox | Yes / No badge | Yes |
| **Holiday Shift** | Checkbox | Yes / No with holiday icon | Yes |
| **Background Color** | Text(7) | Color swatch + hex code | Yes |
| **Shift Cell Preview** | Read-only | Mini Gantt block preview | No |
| **Recordset Filter Criteria** | Lookup | Tag chip (e.g., Emergency Only) | Yes |

#### 4.2.2 Resource & Territory

| Field | Type | Display Format | Editable |
|---|---|---|---|
| **Service Resource** | Lookup | Resource name with avatar | Yes |
| **Resource Type** | Formula | Technician / Crew / Virtual | No |
| **Job Profile** | Lookup | Profile name; links to profile record | Yes |
| **Service Territory** | Lookup | Territory name; links to territory record | Yes |
| **Plant / Location** | Text | Physical depot or plant name | Yes |

---

### 4.3 Right Column Panel – Related Links

The right column contains related record links grouped into two sections.

#### 4.3.1 Service Territory Section

| Related Record | Object | Columns Shown | Available Actions |
|---|---|---|---|
| **Service Territory** | `ServiceTerritory` | Name, Parent Territory, Time Zone | View, Edit |
| **Territory Members** | `ServiceTerritoryMember` | Resource Name, Role, Start Date | View, Add, Remove |
| **Operating Hours** | `OperatingHours` | Name, Active, Time Zone | View |

#### 4.3.2 SA History Section

Displays past and current service appointments associated with the resource during the shift window, sorted by scheduled start time descending.

| Column | Field Source | Description |
|---|---|---|
| **SA Number** | `ServiceAppointment.AppointmentNumber` | Unique SA identifier; click to open record |
| **Subject** | `ServiceAppointment.Subject` | Short description of the service task |
| **Scheduled Start** | `SchedStartTime` | Planned SA start date/time |
| **Scheduled End** | `SchedEndTime` | Planned SA end date/time |
| **Status** | `ServiceAppointment.Status` | Scheduled / Dispatched / Completed / Cancelled |
| **Work Order** | `WorkOrder.WorkOrderNumber` | Parent WO; click to open |
| **Assigned Resource** | `AssignedResource.Name` | Resource confirmed on the SA |

---

## 5. Side Panel Specification

The Side Panel is a collapsible vertical panel anchored to the right edge of the Shift Detail view. It is triggered by clicking the **side panel toggle icon** within the detail view header.

### 5.1 Side Panel Sections

| Section | Description | Data Source | Behavior |
|---|---|---|---|
| **Shift Summary** | Compact display of shift name, status, time window, resource, and territory | Shift record fields | Read-only; always visible when panel is open |
| **SA Assignments** | List of SAs assigned to the resource during the shift window | AssignedResource + SA records | Clickable; opens SA record in overlay or new tab |
| **SA History Timeline** | Chronological list of past SAs fulfilled by this resource in this territory | SA history query on resource + territory | Scrollable; date-range filter available |
| **Territory Quick Links** | Direct links: Service Territory, Operating Hours, Territory Members | ServiceTerritory relationship | Opens related record inline; breadcrumb navigation |
| **Resource Availability** | Mini weekly calendar showing booked vs. free windows for the resource | Shift + SA records for the week | Read-only; color overlay: 🟢 free, 🟡 partial, 🔴 booked |
| **Actions** | Edit Shift, Clone Shift, Cancel Shift, Reassign Resource | UI action buttons | Each button triggers respective modal or inline edit form |

### 5.2 Side Panel Visual Mock-Up

```
┌─────────────────────────┐
│  ◀ SIDE PANEL           │
│═════════════════════════│
│  SHIFT SUMMARY          │
│  ─────────────────────  │
│  SH-00012 │ Tentative   │
│  7:00 AM – 9:00 PM      │
│  Alan Reed              │
│  San Francisco          │
│═════════════════════════│
│  SA ASSIGNMENTS (3)     │
│  ─────────────────────  │
│  > SA-5963  Dispatched  │
│  > SA-5940  Completed   │
│  > SA-5901  Completed   │
│═════════════════════════│
│  SA HISTORY (8)         │
│  ─────────────────────  │
│  [Filter by date range] │
│  > SA-5963  Nov 9       │
│  > SA-5940  Oct 28      │
│  > SA-5880  Oct 15      │
│  > SA-5821  Oct 2       │
│  [View All Records...]  │
│═════════════════════════│
│  TERRITORY LINKS        │
│  ─────────────────────  │
│  > San Francisco Terr.  │
│  > Operating Hours      │
│  > Territory Members    │
│═════════════════════════│
│  AVAILABILITY (This Wk) │
│  ─────────────────────  │
│  M  T  W  T  F  S  S   │
│  🟢 🟡 🟢 🔴 🟢 🟡 ⬜   │
│═════════════════════════│
│  ACTIONS                │
│  ─────────────────────  │
│  [ ✏ Edit Shift      ]  │
│  [ ⧉ Clone Shift     ]  │
│  [ ✕ Cancel Shift    ]  │
│  [ ↔ Reassign Res.   ]  │
└─────────────────────────┘
```

> **Side Panel Interaction Notes**
> - The panel slides in/out with a 200ms animation
> - Each section can be independently collapsed
> - **SA Assignments** updates in real-time when a new SA is dispatched
> - **Resource Availability** refreshes when the shift time window is edited
> - **Actions** persist regardless of section collapse state
> - The panel state (open/closed) is persisted per user preference

---

## 6. Data Relationships & Object Model

The following objects and relationships underpin the Shift Management Module:

| Object | API Name | Key Fields | Relationship to Shift |
|---|---|---|---|
| **Shift** | `Shift` | Name, Status, StartTime, EndTime, IsNonStandard, IsHoliday, BackgroundColor, LabelText | Primary object |
| **Service Resource** | `ServiceResource` | Name, ResourceType, IsActive, RelatedRecordId | Lookup on Shift |
| **Service Territory** | `ServiceTerritory` | Name, ParentTerritoryId, OperatingHoursId | Lookup on Shift |
| **Service Appointment** | `ServiceAppointment` | AppointmentNumber, SchedStartTime, SchedEndTime, Status | Used in SA History & availability check |
| **Assigned Resource** | `AssignedResource` | ServiceAppointmentId, ServiceResourceId, IsRequiredResource | Junction – SA to Resource |
| **Operating Hours** | `OperatingHours` | Name, TimeZone, IsActive | Linked via Service Territory |
| **Resource Absence** | `ResourceAbsence` | ResourceId, Start, End, Type | Checked during shift creation validation |
| **Recordset Filter Criteria** | `RecordsetFilterCriteria` | Name, FilterType, DeveloperName | Lookup on Shift modal |

### 6.1 Object Relationship Diagram

```
ServiceTerritory
    │
    ├── OperatingHours
    ├── ServiceTerritoryMember ──► ServiceResource
    │                                    │
    └────────────────────────────────────┤
                                         │
                        Shift ◄──────────┘
                          │
                          ├── RecordsetFilterCriteria
                          ├── JobProfile
                          │
                          └── (availability check)
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
             ServiceAppt     ResourceAbsence   OperatingHours
                    │
             AssignedResource ──► ServiceResource
```

---

## 7. UX Behavior & Interaction Rules

### 7.1 Panel State Management

| Interaction | Expected Behavior |
|---|---|
| User opens Shift Detail view | Two-column layout loads; left column shows shift data; right column shows related links with lazy-loaded counts |
| User clicks Side Panel toggle | Panel slides in from right; Shift Summary auto-expands; other sections collapsed by default |
| User edits a field in left column | Inline edit activates; Save/Cancel buttons appear; unsaved indicator shown in header |
| User clicks SA link in right column | SA record opens in the same tab with breadcrumb navigation back to shift |
| User clicks Territory link in right column | Territory record opens in overlay modal |
| User clicks 'View All' on SA History | Full list modal opens with sorting, filtering, and export options |
| User clicks Edit Shift in side panel | Edit modal pre-populated with current shift data; mirrors New Shift modal layout |
| User clicks Cancel Shift in side panel | Confirmation dialog appears; on confirm, status set to Cancelled; Gantt block updates immediately |

### 7.2 Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| **Desktop (≥ 1280px)** | Full three-zone layout; all panels visible simultaneously |
| **Tablet (900–1279px)** | Side panel collapses automatically; accessible via toggle button |
| **Tablet narrow (< 1024px)** | Two-column panel stacks to single column |
| **Mobile (< 768px)** | Module is read-only; full shift editing requires desktop |

### 7.3 Loading & Performance States

| State | Visual Treatment |
|---|---|
| **Initial load** | Skeleton loaders shown in each panel zone while data fetches |
| **Lazy load (related lists)** | Spinner shown in right column section headers; count badge shows `...` until resolved |
| **SA History pagination** | Load More button at bottom of list; max 10 records per page |
| **Availability refresh** | Mini calendar shows loading shimmer when shift window changes |

---

> **Document Control**
> FRD-FSM-002 complements FRD-FSM-001 (Shift Management Module – Functional Requirements). This document governs UI panel layout, field display, and interaction rules only. Data model changes must be reviewed by both Product Owner and Technical Architect. Version updates require sign-off from Field Service Program Manager.

---
*FRD-FSM-002 | Field Service – Module UI Specification | v1.0 | June 2026 | CONFIDENTIAL*
