# Functional Requirements Document
## Shift Management Module — Service Resources
### Field Service | Gantt-Based Scheduling & Drag-and-Drop Shift Creation

---

| Field | Value |
|---|---|
| **Document ID** | FRD-FSM-001 |
| **Version** | 1.0 |
| **Status** | Draft |
| **Date** | June 2026 |
| **Owner** | Field Service Product Team |
| **Reviewer** | Technical Architecture |
| **Module** | Shift Management |
| **Platform** | Salesforce Field Service |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Module Overview](#2-module-overview)
3. [Functional Scope](#3-functional-scope)
4. [Gantt Calendar View – Shift Creation](#4-gantt-calendar-view--shift-creation)
5. [Drag-and-Drop Scheduling](#5-drag-and-drop-scheduling)
6. [Shift Form & New Shift Modal](#6-shift-form--new-shift-modal)
7. [Service Resource Availability Logic](#7-service-resource-availability-logic)
8. [Display Panels & Field Definitions](#8-display-panels--field-definitions)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [Acceptance Criteria](#10-acceptance-criteria)

---

## 1. Executive Summary

This Functional Requirements Document defines the specifications for the **Shift Management Module** within the Field Service platform. The module empowers dispatchers and field service managers to create, manage, and visualize resource shifts directly on a Gantt-style calendar, with integrated drag-and-drop functionality from the service resource pool to the schedule board.

The module bridges shift creation with service appointment scheduling by validating resource availability against existing service appointments before confirming a shift assignment. All created shifts are surfaced in the Service Field display, enabling real-time operational awareness.

> **Key Objectives**
> - Enable Gantt-chart-based shift creation for individual service resources within a plant/service territory
> - Support drag-and-drop interaction from the resource list panel to the calendar grid
> - Validate shift availability against service appointments before confirming assignments
> - Provide shift details panel with two-column layout, related links, and side panel navigation

---

## 2. Module Overview

### 2.1 Purpose

The Shift Management Module serves as the central scheduling interface for field service operations. It integrates resource management, shift planning, and service appointment visibility into a single cohesive view, reducing scheduling conflicts and improving resource utilization.

### 2.2 System Context

| Component | Description | Integration Point |
|---|---|---|
| **Gantt Calendar** | Visual timeline grid showing shifts per resource per day/week | Shift records, SA records |
| **Resource Panel (Left)** | List of available service resources in the plant/territory | Service Resource object |
| **Shift Modal (Form)** | New Shift creation form with fields, filters, and recordset criteria | Shift object, SA availability |
| **Service Territory** | Geographic/logical grouping of resources and appointments | Territory object, related links |
| **Side Panel** | Contextual details, related SA history, quick actions | SA History, Assignments |

---

## 3. Functional Scope

### 3.1 In-Scope Features

- Create, edit, and delete shifts on individual service resources
- Gantt calendar view with day, 3-day, and week display modes
- Drag-and-drop resource assignment from the left panel to the calendar
- Service appointment availability validation prior to shift confirmation
- Shift details panel: two-column layout with related links
- Side panel: SA history, territory links, assignment records
- Recordset Filter Criteria on the New Shift modal
- Background color customization per shift
- Holiday Shift designation
- Non-Standard shift flag

### 3.2 Out of Scope

- Payroll or time-tracking integrations
- Mobile shift approval workflows
- Third-party calendar sync (Google Calendar, Outlook)

---

## 4. Gantt Calendar View – Shift Creation

### 4.1 Layout Overview

The Gantt calendar is the primary interface for visualizing and managing resource shifts. The canvas is divided horizontally by date columns and vertically by service resource rows.

| Zone | Description | Behavior |
|---|---|---|
| **Resource Rows** | Each row represents one service resource or resource group | Scroll vertically; expand groups |
| **Date/Time Columns** | Hourly columns across the selected date range | Scroll horizontally; zoom in/out |
| **Shift Blocks** | Colored blocks representing created shifts | Drag to move; click to edit |
| **Availability Overlay** | Shaded areas showing SA-based availability windows | Read-only; color-coded |
| **Header Bar** | Date labels, utilization %, view toggle | Controls date range selection |

### 4.2 View Modes

| Mode | Granularity | Use Case |
|---|---|---|
| **Day View** | Hourly | Detailed single-day resource planning |
| **3-Day View** | Half-hourly | Short-range scheduling with context |
| **Week View** | Daily | High-level weekly capacity overview |

### 4.3 Candidate Panel (Left Side)

The left panel lists recommended and available service resource candidates for a selected service appointment. Each candidate displays:

- Resource name and role (e.g., Field Supervisor, Installation Expert)
- Graded score (e.g., 100/100, 81/100) color-coded by threshold
- Number of available scheduling options
- **Assign Recommended** button for top-ranked candidates

**Score Color Coding:**

| Score Range | Color | Interpretation |
|---|---|---|
| 90–100 | 🟢 Green | Highly recommended; ideal availability and skill match |
| 70–89 | 🟡 Amber | Acceptable match; minor availability constraints |
| Below 70 | 🔴 Red | Low compatibility; conflicts or skill gaps present |

---

## 5. Drag-and-Drop Scheduling

### 5.1 Interaction Flow

1. Dispatcher opens the Gantt view for the target service appointment
2. Left panel populates with available service resource candidates
3. Dispatcher drags a resource from the candidate panel onto the calendar grid at the desired time slot
4. System checks resource availability against existing service appointments
5. If available: shift block is created and the schedule is tentatively confirmed
6. If conflict detected: system displays a conflict warning with override option
7. Dispatcher confirms or adjusts; shift record is saved

### 5.2 Availability Validation Rules

| Check | Rule | Outcome on Fail |
|---|---|---|
| **SA Overlap** | Resource must not have confirmed SA during shift window | Warning + block highlight |
| **Time Slot Type** | Shift must align with configured time slot type (Normal/Emergency) | Validation error |
| **Working Hours** | Shift must fall within resource's defined working hours | Warning |
| **Territory Match** | Resource must belong to the same service territory | Error; block drop rejected |
| **Holiday Flag** | If holiday shift flag is set, special approval required | Approval workflow triggered |

### 5.3 Visual Feedback

- Drop zone highlights **green** when a valid placement is detected
- Drop zone highlights **red** when a conflict is detected
- Shift block shows candidate score badge after placement
- Utilization percentage updates in real-time in the header bar

---

## 6. Shift Form & New Shift Modal

### 6.1 Modal Trigger

The New Shift modal is triggered by:
1. Clicking a blank cell on the Gantt grid
2. Using the **New Shift** action button
3. Dropping a resource candidate onto the calendar grid

### 6.2 Form Field Definitions

| Field | Type | Required | Description |
|---|---|---|---|
| **Start Time** | Date + Time | ✅ Yes | Start date and time of the shift (default: current date, 7:00 AM) |
| **End Time** | Date + Time | ✅ Yes | End date and time of the shift (default: current date, 9:00 PM) |
| **Status** | Dropdown | ✅ Yes | Shift status: Tentative, Confirmed, Cancelled |
| **Job Profile** | Lookup | No | Links shift to a specific job profile for skill filtering |
| **Service Territory** | Lookup | No | Associates the shift with a service territory |
| **Service Resource** | Lookup | No | The specific service resource assigned to this shift |
| **Time Slot Type** | Dropdown | ✅ Yes | Type of shift slot: Normal, Emergency, Extended |
| **Label** | Text | No | Free-text label for quick identification on the Gantt block |
| **Non-Standard** | Checkbox | No | Flag for shifts outside standard operating hours |
| **Recordset Filter Criteria** | Lookup/Tag | No | Filter tag applied to scope eligible resources (e.g., Emergency Only) |
| **Background Color** | Color Picker | No | Custom hex color for Gantt block visualization |
| **Holiday Shift** | Checkbox | No | Designates this shift as occurring on a public holiday |
| **Shift Cell Preview** | Read-only | No | Live preview of how the shift block will render on the Gantt calendar |

### 6.3 Recordset Filter Criteria

The Recordset Filter Criteria field allows dispatchers to pre-filter the pool of eligible service resources shown in the candidate panel. Tags such as `Emergency Only` restrict the visible candidates to those matching that filter, reducing noise in high-priority scheduling scenarios.

> **Configuration Note**
> - Recordset filter tags are configured by the system administrator
> - Multiple tags can be applied; resources must match ALL applied tags
> - Tags are displayed as removable chips in the modal field

---

## 7. Service Resource Availability Logic

### 7.1 Availability Sources

The system evaluates resource availability from three primary sources before permitting shift creation:

| Source | Object | Evaluation Method |
|---|---|---|
| **Service Appointments** | `ServiceAppointment` | Check for confirmed/dispatched SAs overlapping shift window |
| **Operating Hours** | `OperatingHours` | Verify shift falls within resource's assigned operating hours template |
| **Absence Records** | `ResourceAbsence` | Block shifts that overlap approved absence periods |
| **Existing Shifts** | `Shift` | Prevent double-booking on the same time block |

### 7.2 Grading Algorithm

Each candidate resource receives a score (0–100) based on a weighted evaluation:

| Factor | Weight | Calculation |
|---|---|---|
| **Skill Match** | 40% | Percentage of required skills the resource possesses |
| **Availability Window** | 30% | How well the resource's free window fits the appointment duration |
| **Proximity** | 20% | Distance from resource's last known location to appointment site |
| **Priority Bonus** | 10% | Bonus for resources with Emergency Only or priority tags |

---

## 8. Display Panels & Field Definitions

The Shift Detail view uses a structured layout with two main column panels and a collapsible side panel. This view is accessible by clicking any shift block on the Gantt calendar.

### 8.1 Left Column Panel – Shift Details

#### 8.1.1 Shift Information Section

| Field Label | API Field | Type | Description |
|---|---|---|---|
| **Shift Name** | `Name` | Auto-Number | System-generated unique identifier for the shift |
| **Status** | `Status__c` | Picklist | Current status: Tentative, Confirmed, Cancelled |
| **Start Time** | `StartTime` | DateTime | Scheduled start date and time of the shift |
| **End Time** | `EndTime` | DateTime | Scheduled end date and time of the shift |
| **Duration (hrs)** | `Duration__c` | Formula | Calculated duration in hours from start to end |
| **Time Slot Type** | `TimeSlotType__c` | Picklist | Normal, Emergency, Extended, Holiday |
| **Label** | `Label__c` | Text(80) | Optional short display label shown on Gantt block |
| **Non-Standard** | `IsNonStandard__c` | Checkbox | True if shift falls outside standard hours |
| **Holiday Shift** | `IsHoliday__c` | Checkbox | True if this is a designated holiday shift |
| **Background Color** | `BackgroundColor__c` | Text(7) | Hex color code for Gantt block display |
| **Recordset Filter** | `RecordsetFilterCriteria__c` | Lookup | Applied recordset filter tag (e.g., Emergency Only) |

#### 8.1.2 Resource & Territory Section

| Field Label | API Field | Type | Description |
|---|---|---|---|
| **Service Resource** | `ServiceResourceId` | Lookup | The resource assigned to this shift |
| **Resource Type** | `ResourceType__c` | Formula | Technician, Crew, or Virtual – derived from SR record |
| **Job Profile** | `JobProfileId__c` | Lookup | Skill profile associated with this shift |
| **Service Territory** | `ServiceTerritoryId` | Lookup | Territory in which the shift operates |
| **Plant / Location** | `PlantLocation__c` | Text | Physical plant or depot the resource reports to |

---

### 8.2 Right Column Panel – Related Links

#### 8.2.1 Service Territory Links

| Related Record | Object | Display Columns | Actions |
|---|---|---|---|
| **Territory Name** | `ServiceTerritory` | Name, Operating Hours, Parent Territory | View, Edit |
| **Territory Members** | `ServiceTerritoryMember` | Resource Name, Role, Territory | View, Remove |
| **Operating Hours** | `OperatingHours` | Name, Time Zone, Active | View |

#### 8.2.2 Service Appointment History (SA History)

| Column | Source Field | Description |
|---|---|---|
| **SA Number** | `ServiceAppointment.AppointmentNumber` | Unique identifier of the service appointment |
| **Subject** | `ServiceAppointment.Subject` | Brief description of the service appointment |
| **Scheduled Start** | `ServiceAppointment.SchedStartTime` | Planned start time of the SA |
| **Scheduled End** | `ServiceAppointment.SchedEndTime` | Planned end time of the SA |
| **Status** | `ServiceAppointment.Status` | Current SA status (Scheduled, Dispatched, Completed) |
| **Work Order** | `WorkOrder.WorkOrderNumber` | Parent work order linked to the SA |
| **Resource** | `AssignedResource.Name` | Resource assigned to the SA during the shift window |

---

### 8.3 Side Panel

A collapsible side panel provides contextual quick-access information. Triggered by the side panel toggle icon on the shift detail view.

| Panel Section | Content | Behavior |
|---|---|---|
| **Shift Summary** | Quick view of start/end time, status, resource name, territory | Read-only; auto-populates from shift record |
| **SA Assignments** | List of SAs assigned to this resource during the shift window | Clickable; opens SA record in new tab |
| **SA History Timeline** | Chronological list of past SAs fulfilled by this resource in this territory | Scrollable; filterable by date range |
| **Territory Quick Links** | Direct links to Service Territory, Operating Hours, Territory Members | Opens related record inline |
| **Resource Availability** | Visual mini-calendar showing resource's availability for the week | Read-only; color overlay for booked/free periods |
| **Actions** | Edit Shift, Clone Shift, Cancel Shift, Reassign Resource | Triggers respective modal or inline edit |

---

## 9. Non-Functional Requirements

| Category | Requirement | Target |
|---|---|---|
| **Performance** | Gantt calendar must load with up to 50 resources and 7 days of shifts | < 3 seconds initial load |
| **Performance** | Drag-and-drop placement and availability check must resolve | < 1 second response |
| **Scalability** | Module must support organizations with up to 5,000 service resources | No degradation in UX |
| **Accessibility** | All interactive elements must be keyboard navigable | WCAG 2.1 AA compliant |
| **Data Integrity** | Shift records must not be created if availability validation fails without user override | Zero silent failures |
| **Auditability** | All shift create/edit/delete actions must be logged with user, timestamp, and change delta | Full audit trail on Shift object |
| **Concurrency** | Multiple dispatchers editing the same resource simultaneously must see real-time updates | Optimistic locking with conflict notification |

---

## 10. Acceptance Criteria

| ID | Scenario | Expected Outcome |
|---|---|---|
| **AC-001** | Dispatcher drags a resource with score 100/100 onto an empty Gantt slot | Shift block created; SA availability confirmed; shift saved with status Tentative |
| **AC-002** | Dispatcher drags a resource onto a slot overlapping an existing confirmed SA | Red drop zone highlight; warning modal shown; no shift created unless overridden |
| **AC-003** | New Shift modal opened with 'Emergency Only' recordset filter applied | Only resources tagged Emergency Only appear in the candidate panel |
| **AC-004** | Dispatcher clicks a shift block on the Gantt calendar | Shift details open in two-column panel; related SA history and territory links visible |
| **AC-005** | Side panel toggle clicked on shift detail view | Side panel expands with SA assignments, availability mini-calendar, and action buttons |
| **AC-006** | Dispatcher sets Background Color on New Shift modal | Shift block renders on Gantt in the selected color; Shift Cell Preview updates in real-time |
| **AC-007** | Holiday Shift checkbox enabled on a shift record | Shift block displays holiday indicator; approval workflow is triggered |
| **AC-008** | Territory Member removed from territory while shift is active | System raises a warning flag on the shift; shift remains but is flagged for review |

---

> **Document Control**
> This document is subject to change management procedures. All updates must be reviewed by the Field Service Product Owner and Technical Architect. Version history is maintained in the project repository.

---
*FRD-FSM-001 | Field Service – Shift Management Module | v1.0 | June 2026 | CONFIDENTIAL*
