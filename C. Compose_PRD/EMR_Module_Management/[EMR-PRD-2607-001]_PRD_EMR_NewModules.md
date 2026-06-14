# Product Requirements Document — EMR Module
## UT Service Console

> **Module:** Equipment Maintenance Report (EMR)
> **Version:** 1.0
> **Last Updated:** 2026-06-07
> **Status:** Draft
> **Owner:** UT Service Console Product Team

---

## 1. Overview

### 1.1 Purpose

The EMR (Equipment Maintenance Report) module is a digital field report system that enables field mechanics to document equipment damage, maintenance activities, and inspection findings during on-site visits. The EMR acts as the primary structured data-capture layer between a Work Order and the physical condition of a customer's unit in the field.

### 1.2 Business Context

Field Service teams require a structured, mobile-friendly form to:
- Record unit damage, abnormalities, and environmental conditions at the customer site
- Attach photographic evidence organised by EMILA categories (Environment, Machine, Identification, Location, Abnormality)
- Document damage core and repair outcome with associated photo groups
- Track approval and review stages through a defined lifecycle (Chevron workflow)

### 1.3 Scope

| In Scope | Out of Scope |
|----------|-------------|
| Automatic EMR creation from Work Orders | EMR creation from non-WO sources |
| Two EMR types: U-type (Unscheduled) and S-type (Scheduled) | Manual EMR numbering |
| EMILA photo group input | Video file uploads |
| Damage Core and Outcome Repair documentation | Billing or invoicing logic |
| Chevron stage workflow (3-stage and 7-stage) | Parts/inventory management |
| Related panel integration (WO, Cases, EMR Additional Group, EMR Additional Information, EMR History) | Third-party ERP push (SAP) |

---

## 2. EMR Types & Naming Convention

### 2.1 Type Determination

EMR objects are **automatically created** when a Work Order (WO) is created or already exists in the system. The EMR type is derived from the parent Case type:

| Case Type | Trigger Source | EMR Prefix | Example |
|-----------|---------------|------------|---------|
| **Request** | Manual case creation by operator/customer | `U-` (Unscheduled) | `U-00022418` |
| **Automatic Schedule** (from SAP) | SAP integration auto-schedule | `S-` (Scheduled) | `S-00074662` |

### 2.2 Numbering Format

- Prefix: `U-` or `S-`
- Sequence: 8-digit zero-padded integer, auto-incremented per type
- Examples: `U-00022418`, `S-00074662`

### 2.3 Trigger Rule

```
WO Created / WO Exists
  └── Parent Case.Type == "Request"
        └── Create EMR with prefix U-
  └── Parent Case.Type == "Automatic Schedule" (SAP)
        └── Create EMR with prefix S-
```

The system must prevent duplicate EMR creation per WO. One WO → One EMR.

---

## 3. Lifecycle & Chevron Workflow

### 3.1 Scheduled EMR (S-type) — 3 Stages

```
Open  ──────────►  In Progress  ──────────►  Closed
 [1]                   [2]                    [3]
```

| Stage | Actor | Description |
|-------|-------|-------------|
| **Open** | System | EMR auto-created when WO exists; awaiting mechanic assignment |
| **In Progress** | Mechanic | Mechanic has started filling in the field report |
| **Closed** | Supervisor / System | Report reviewed and finalised |

### 3.2 Unscheduled EMR (U-type) — 7 Stages

```
Open ──► In Progress ──► Submit EMR ──► Assign TO ──► Not Complete ──► Resubmit ──► Closed
 [1]         [2]             [3]           [4]             [5]            [6]          [7]
```

| Stage | Actor | Description |
|-------|-------|-------------|
| **Open** | System | EMR auto-created; awaiting mechanic |
| **In Progress** | Mechanic | Field data entry in progress |
| **Submit EMR** | Mechanic | Mechanic submits completed report for review |
| **Assign TO** | Supervisor | Technical Officer (TO) assigned to review |
| **Not Complete** | TO / Reviewer | Report returned to mechanic; incomplete or requires correction |
| **Resubmit** | Mechanic | Mechanic makes corrections and resubmits |
| **Closed** | TO / System | Report approved and finalised |

### 3.3 Stage Transition Rules

| From | To | Allowed By | Condition |
|------|----|-----------|-----------|
| Open | In Progress | Mechanic | WO assigned to mechanic |
| In Progress | Submit EMR | Mechanic | All mandatory fields completed |
| Submit EMR | Assign TO | Supervisor | Supervisor triggers TO assignment |
| Assign TO | Not Complete | TO | TO finds deficiencies |
| Assign TO | Closed | TO | Report passes review |
| Not Complete | Resubmit | Mechanic | Mechanic corrects and resubmits |
| Resubmit | Assign TO | System | Auto-routes back for review |
| Resubmit | Closed | TO | Report passes second review |

---

## 4. Data Model

### 4.1 EMR Object (Core Fields)

#### Identity & Status

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `EMR Name` | Text (Auto) | Yes | Auto-generated (e.g. `U-00022418`, `S-00074662`) |
| `EMR Status` | Picklist | Yes | Current Chevron stage |
| `Owner` | Lookup (User) | Yes | Assigned mechanic or TO |
| `Flag Azure` | Checkbox | No | Azure file-sync flag |

#### Supervisor & Assignment

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `Supervisisi Awal` | Long Text | No | Initial supervisor instructions/notes |
| `Aging Assign TO` | Number | No | Days elapsed since TO assignment |
| `Aging Approval TO` | Number | No | Days elapsed since approval sent to TO |
| `UT Assign TO` | Lookup (User) | No | Technical Officer assigned |
| `UT Approval TO` | Lookup (User) | No | TO who approved |
| `UT Submit` | Date/Time | No | Timestamp of mechanic submission |
| `Aging Pending Submit` | Number | No | Days pending since last submission |

#### Unit & Asset

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `Asset` | Lookup (Asset) | No | Linked equipment asset |
| `Part Supply` | Checkbox | No | Indicates parts supplied |
| `Hours on Component (H)` | Number | No | Operating hours on component |
| `Re-Open Reason` | Text | No | Reason if EMR was re-opened |

#### Customer Information Section

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `Machine Model` | Text | No | Machine model name |
| `Machine Product` | Text | No | Product line/category |
| `Serial Number` | Text | No | Unit serial number |
| `Machine Code` | Text | No | Internal machine code |
| `Engine Model` | Text | No | Engine designation |
| `Engine Number` | Text | No | Engine serial number |
| `Branch / Site` | Text | No | Branch or site code (e.g. PDG, TJE) |
| `Service Area` | Text | No | Service area name |
| `Delivery Date` | Date | No | Unit delivery date |
| `Account` | Lookup (Account) | No | Customer account |
| `Warranty Remarks` | Text | No | Warranty type/notes |
| `Machine Group` | Text | No | Machine classification group |

#### EMR Information Section

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `EMR Plant` | Lookup / Text | No | Plant location |
| `Work Order` | Lookup (WO) | Yes | Parent Work Order |
| `Case` | Lookup (Case) | Yes | Parent Case |
| `PMact Type` | Picklist | No | Preventive Maintenance action type |
| `WO SAP No` | Text | No | SAP Work Order number |
| `Sub Call Type` | Text | No | Sub-type of call (e.g. Internal - Delivery, Internal - Unschedule Inspection Warranty) |
| `Aging Day` | Number | No | Days since EMR open |
| `Trouble Date` | Date/Time | No | Date/time issue was identified |
| `Finish B/D Datetime` | Date/Time | No | Actual finish date/time |
| `Start B/D Datetime` | Date/Time | No | Actual start date/time |
| `SMR Trouble` | Number | No | Service Meter Reading at trouble |
| `SMR RFU` | Number | No | SMR at Ready For Use |
| `KM/Mileage` | Number/Text | No | Mileage (if applicable) |
| `Lead Time (Hours)` | Number | No | Total lead time in hours |

#### Other Information Section

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `Unit Location` | Text | No | Physical location of unit |
| `Shift` | Text / Number | No | Work shift |
| `Informasi` | Picklist | No | Primary information type |
| `Sub Informasi` | Picklist | No | Sub-category of information |
| `Problem Status` | Text | No | e.g. Warranty |
| `Machine Status` | Text | No | e.g. Machine Normal Operation |
| `Application` | Text | No | Application type (e.g. Mining) |
| `Manufacture` | Text | No | Manufacturer name |
| `Responsibility` | Text | No | Responsibility party |
| `Submit to Claim` | Checkbox | No | Whether submitted to claim |
| `Need Support HO` | Checkbox | No | Requires Head Office support |
| `HO Date` | Date | No | Head Office response date |
| `Resto` | Text | No | Restoration type |
| `Resto Man Power` | Text | No | Manpower for restoration |

### 4.2 EMILA Photo Groups

EMILA is the structured photographic evidence system. Each EMR can contain one or more photo entries per EMILA category.

| Category | Code | Description |
|----------|------|-------------|
| **Environment** | E | Photos showing site/work environment |
| **Machine** | M | Photos of the full machine or unit |
| **Identification** | I | Identification plates, serial numbers, name tags |
| **Location** | L | Location-specific damage or condition shots |
| **Abnormality** | A | Close-up of defects, leaks, wear, damage |

Each EMILA entry captures:
- Category (E / M / I / L / A)
- Photo file (image upload)
- Caption / description
- Order Number (for sequencing)
- Group Type: `FSL` (Field Service Lightning / mobile) or `Desktop`

### 4.3 EMR Additional Groups

Beyond EMILA, the following document groups are supported:

| Group Name | Group Type | Notes |
|-----------|-----------|-------|
| BAPP | Desktop / FSL | Delivery/handover report |
| Photo Damage Core | Desktop | Core damage evidence photos |
| Photo Outcome Repair & Maintenance | Desktop | Post-repair outcome photos |
| RPL | Desktop | Return Parts List |
| TSR | Desktop | Technical Service Report |
| WO SAP | Desktop | SAP Work Order document |
| Form QCC | Desktop | Quality Control Check |
| Invoice | Desktop | Invoice documents |
| Others | Desktop | Miscellaneous attachments |
| Photo Abnormality | FSL | EMILA — Abnormality photos (ordered) |
| Photo Environment | FSL | EMILA — Environment photos (ordered) |
| Photo Identification | FSL | EMILA — Identification photos (ordered) |
| Photo Location | FSL | EMILA — Location photos (ordered) |
| Photo Maintenance Condition | FSL | EMILA — Machine/Maintenance condition photos |
| SN Component KRA | Desktop | Component serial number for KRA |
| SN Patria | Desktop | Patria serial number document |
| SPB | Desktop | SPB document |

### 4.4 EMR Additional Information

Stores individual file/document references per EMR. Each entry includes:
- Description
- Show Image (checkbox or preview flag)
- URL (link to file or image)

### 4.5 EMR History

Audit log of all field-level changes:
- Date / Timestamp
- Field name changed
- Original Value
- New Value
- User who made the change

---

## 5. Functional Requirements

### 5.1 Auto-Creation

| ID | Requirement |
|----|-------------|
| EMR-F-01 | The system SHALL automatically create an EMR record when a Work Order (WO) is created or already exists |
| EMR-F-02 | The system SHALL derive EMR type (U or S) from the parent Case's Type field |
| EMR-F-03 | EMR Name SHALL be auto-generated using the appropriate prefix and a zero-padded 8-digit sequence number |
| EMR-F-04 | The system SHALL NOT create a duplicate EMR if one already exists for the WO |
| EMR-F-05 | The newly created EMR SHALL default to `Open` status |

### 5.2 Chevron Workflow

| ID | Requirement |
|----|-------------|
| EMR-F-06 | S-type EMRs SHALL follow a 3-stage Chevron: Open → In Progress → Closed |
| EMR-F-07 | U-type EMRs SHALL follow a 7-stage Chevron: Open → In Progress → Submit EMR → Assign TO → Not Complete → Resubmit → Closed |
| EMR-F-08 | Each stage SHALL visually highlight the current active stage in the Chevron component |
| EMR-F-09 | Completed stages SHALL display a checkmark indicator |
| EMR-F-10 | Stage transitions SHALL enforce actor-based permissions (mechanic, supervisor, TO) |

### 5.3 Form Sections

| ID | Requirement |
|----|-------------|
| EMR-F-11 | The EMR detail page SHALL display a Details tab and a Feed tab by default |
| EMR-F-12 | U-type EMRs SHALL additionally display FAR, TSI, and TSR tabs |
| EMR-F-13 | Form sections SHALL be collapsible: Customer Information, EMR Information, Other Information |
| EMR-F-14 | Each field SHALL be individually editable via an inline edit icon (pencil) |
| EMR-F-15 | Mandatory fields SHALL be validated before stage progression |

### 5.4 EMILA Photo Input

| ID | Requirement |
|----|-------------|
| EMR-F-16 | Mechanics SHALL be able to add photo entries for each EMILA category |
| EMR-F-17 | Each photo entry SHALL support image upload, description, and order number |
| EMR-F-18 | Photo groups with Group Type `FSL` SHALL be accessible from the mobile field service app |
| EMR-F-19 | The system SHALL display a photo thumbnail preview in the Related panel |

### 5.5 Damage Core & Outcome Repair

| ID | Requirement |
|----|-------------|
| EMR-F-20 | The EMR SHALL include a "Photo Damage Core" group for documenting initial damage evidence |
| EMR-F-21 | The EMR SHALL include a "Photo Outcome Repair & Maintenance" group for documenting post-repair condition |
| EMR-F-22 | Both groups SHALL support multiple image uploads with captions |

### 5.6 Related Panel

| ID | Requirement |
|----|-------------|
| EMR-F-23 | The Related panel SHALL display: Work Orders, EMR Additional Group, EMR Additional Information, EMR History |
| EMR-F-24 | Each related list SHALL show a count and a "View All" link |
| EMR-F-25 | EMR History SHALL log every field change with user, timestamp, old value, and new value |

### 5.7 Action Bar

| ID | Requirement |
|----|-------------|
| EMR-F-26 | The action bar SHALL include: Follow, Upload Techcare Files, Get Image From Azure, Delete, Sharing, Change Owner, Edit |
| EMR-F-27 | S-type EMR action bar SHALL additionally include a "+ Follow" button |

---

## 6. Non-Functional Requirements

| ID | Category | Requirement |
|----|----------|-------------|
| EMR-NF-01 | Performance | EMR list pages SHALL load within 2 seconds for up to 500 records |
| EMR-NF-02 | Mobile | The EMILA photo capture form SHALL be fully functional on mobile (FSL Group Type) |
| EMR-NF-03 | Accessibility | All interactive elements SHALL meet WCAG 2.2 AA (min 44×44px touch target, 4.5:1 contrast) |
| EMR-NF-04 | Data Integrity | EMR auto-creation SHALL be idempotent — triggering twice on same WO must not create duplicates |
| EMR-NF-05 | Audit | All field changes SHALL be captured in EMR History with full before/after values |
| EMR-NF-06 | Dark Mode | All EMR UI components SHALL correctly render in both light and dark mode per the Design System |

---

## 7. UI / UX Requirements

| ID | Requirement |
|----|-------------|
| EMR-UX-01 | The subject/title banner SHALL display in the brand gold background (`var(--accent)`) with dark text |
| EMR-UX-02 | The Chevron progress bar SHALL use the brand colour system for active (gold), completed (green), and pending (grey) states |
| EMR-UX-03 | The detail page layout SHALL use a two-column split: left 65% main form, right 35% Related panel |
| EMR-UX-04 | Collapsible sections SHALL use a ChevronDown icon and animate open/close |
| EMR-UX-05 | All status badges SHALL use the Design System badge colour tokens |
| EMR-UX-06 | Timestamps and IDs SHALL render in monospace font per the Design System typography spec |

---

## 8. Integration Points

| System | Direction | Description |
|--------|-----------|-------------|
| Work Order Module | Inbound | EMR is triggered by WO creation/existence |
| Case Module | Inbound | Case Type determines EMR prefix (U/S) |
| SAP | Inbound | Automatic Schedule cases originate from SAP sync |
| Azure File Storage | Outbound | "Get Image From Azure" and "Upload Techcare Files" push/pull documents |
| Field Service Mobile (FSL) | Bidirectional | FSL Group Type photo entries captured on mobile |

---

## 9. Acceptance Criteria

| AC ID | Scenario | Expected Result |
|-------|----------|----------------|
| AC-01 | WO created with Case Type = Request | EMR `U-XXXXXXXX` is auto-created in Open status |
| AC-02 | WO created with Case Type = Automatic Schedule (SAP) | EMR `S-XXXXXXXX` is auto-created in Open status |
| AC-03 | Same WO triggers EMR creation twice | Only one EMR exists; no duplicate created |
| AC-04 | Mechanic opens EMR and fills fields | Status transitions to In Progress |
| AC-05 | Mechanic submits U-type EMR | Status moves to Submit EMR; Supervisor notified |
| AC-06 | TO marks U-type EMR Not Complete | Status reverts to Not Complete; Mechanic notified |
| AC-07 | Mechanic resubmits corrected U-type EMR | Status moves to Resubmit → Assign TO |
| AC-08 | Mechanic adds photo to EMILA category | Photo appears in EMR Additional Group list with correct Group Type |
| AC-09 | Field change is made on any EMR field | EMR History log entry created with field, old value, new value, user, timestamp |
| AC-10 | S-type EMR Chevron | Only 3 stages visible: Open, In Progress, Closed |
| AC-11 | U-type EMR Chevron | All 7 stages visible with correct order |

---

## 10. Open Questions

| # | Question | Owner | Status |
|---|----------|-------|--------|
| 1 | Should EMR auto-creation fire on WO creation OR WO assignment? | Product | Open |
| 2 | What is the exact SAP field/flag that designates a Case as "Automatic Schedule"? | Integration | Open |
| 3 | Are FAR, TSI, TSR tabs specific to U-type only, or conditionally shown based on PMact Type? | Business | Open |
| 4 | Maximum number of photos per EMILA category? | UX | Open |
| 5 | Should Resubmit always route to Assign TO, or can it go directly to Closed on second pass? | Business | Open |
| 6 | Is "Aging Day" calculated automatically or entered manually? | Dev | Open |
