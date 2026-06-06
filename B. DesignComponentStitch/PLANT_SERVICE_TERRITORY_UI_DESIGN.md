# Plant & Service Territory Module - UI Design Document
## Organizational Hierarchy & Field Service Infrastructure

## 1. Executive Summary

The **Plant & Service Territory Module** is the foundational infrastructure for organizing field service operations, establishing geographic service boundaries, and managing work center hierarchies. It serves as the organizational backbone connecting plant locations, service territories (branch offices), work centers (operational bases), and service resources (technicians) to work orders and cases. This design document outlines a sophisticated interface featuring:

- **Organizational Hierarchy** - Multi-level structure (Plant → Service Area → Service Territory → Work Center)
- **Sidebar Navigation** - Quick access to Plant, Service Territory, Work Center, Service Resources
- **Dual-Column Layout** - Detailed information with linked objects and team members
- **Geographic Configuration** - Territory boundaries and time zone management
- **Work Center Integration** - Warehouse and operational base setup
- **Service Resource Assignment** - Team member allocation by territory
- **Work Order Linkage** - Association with cases and service appointments
- **Activity Tracking** - History and audit trails for organizational changes

---

## 2. Complete System Architecture

### 2.1 Overall System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│            FIELD SERVICE ORGANIZATIONAL STRUCTURE                │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  PLANT (Manufacturing/Service Facility)                  │  │
│  │  Location: Padang, Indonesia                             │  │
│  │  Type: Production Plant / Service Hub                    │  │
│  │                                                          │  │
│  │  └─ SERVICE AREA (Regional Branch)                       │  │
│  │     Location: Padang ST (Service Area)                   │  │
│  │     Operating Hours: 24/7 Coverage                       │  │
│  │     Territory Type: Primary / Secondary                  │  │
│  │                                                          │  │
│  │     └─ SERVICE TERRITORY (Geographic Zone)               │  │
│  │        Name: Sangkulirang FMC ST                        │  │
│  │        Operating Hours: 00:00 - 00:00 WITA              │  │
│  │        Members: 6+ Service Resources                    │  │
│  │                                                          │  │
│  │        └─ WORK CENTER (Operational Base)                │  │
│  │           Name: FM-SKLPM (Warehouse)                    │  │
│  │           Type: Warehouse / Service Center               │  │
│  │           Parent: Service Territory                      │  │
│  │           Service Area: Branch Area 1                    │  │
│  │                                                          │  │
│  │           └─ SERVICE RESOURCES (Technicians)            │  │
│  │              • Bambang Suraji (Primary)                  │  │
│  │              • Arrochman Arrochman (Primary)             │  │
│  │              • Sulistawan Merudin (Primary)              │  │
│  │              • Ariga Desiwan Ardiyanto (Primary)        │  │
│  │              • Herry Sustriyanto (Primary)               │  │
│  │              • Nur Hasan (Primary)                       │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  LINKAGE TO OPERATIONS:                                         │
│  ├─ Work Orders (Assigned to Service Territories)              │
│  ├─ Cases (Associated with Plants/Work Centers)               │
│  ├─ Shifts (Scheduled across Service Territories)             │
│  └─ Service Appointments (Dispatched to Service Resources)   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Module Relationship Map

```
PLANT
├── Service Area (Regional branch)
│   ├── Service Territory (Geographic zone)
│   │   ├── Work Center (Operational base)
│   │   │   └── Service Resources (Technicians)
│   │   └── Locations (Multiple service points)
│   │
│   └── Cases (Support tickets for area)
│
└── Child Territories (Sub-regions)

INTEGRATION POINTS:
├── Work Orders
│   └── Assigned to Service Territory
│   └── Dispatched via Shift scheduling
│   └── Executed by Service Resources
│
├── Cases
│   └── Created for Plant/Service Area
│   └── Linked to Service Territory
│   └── Assigned to Work Center
│
└── Shifts
    └── Scheduled per Service Territory
    └── Resource allocation
    └── Recurring patterns by area
```

---

## 3. Sidebar Navigation Architecture

### 3.1 Sidebar Structure & Organization

**Purpose**: Provide quick navigation between organizational hierarchy levels.

```
┌──────────────────────────────┐
│  UT Service Console          │
│  Cases / Shifts / Modules    │
├──────────────────────────────┤
│                              │
│  🏭 PLANT                    │
│     • PDG (Active)           │
│     • [Other plants...]      │
│                              │
│  🗺️  SERVICE TERRITORY       │
│     • Sangkulirang FMC ST    │
│     • Padang ST              │
│     • [Other territories]    │
│                              │
│  🏢 WORK CENTER             │
│     • FM-SKLPM (Warehouse)   │
│     • [Other centers]        │
│                              │
│  👥 SERVICE RESOURCES        │
│     • Bambang Suraji         │
│     • Arrochman Arrochman    │
│     • [Team members...]      │
│                              │
│  [+ New Item Buttons]        │
│  [Search within category]    │
│                              │
└──────────────────────────────┘
```

#### 3.1.1 Sidebar Navigation Items

**Plant Section**
- List of all plants/manufacturing locations
- Active status indicator (checkmark for active)
- Click to view plant details
- Context: Regional manufacturing hubs

**Service Territory Section**
- Geographic service areas
- Operating hours display
- Primary/Secondary designation
- Quick access to team assignments

**Work Center Section**
- Operational bases (Warehouses, Service Centers)
- Type indicator (Warehouse, Service Center, Depot)
- Parent territory reference
- Inventory/equipment location

**Service Resources Section**
- Individual technician/staff members
- Territory assignment
- Availability status
- Quick communication access

#### 3.1.2 Sidebar Navigation Behaviors

**Click Actions**
- Click Plant Name → View Plant Details
- Click Service Territory → View Territory Details
- Click Work Center → View Center Details
- Click Service Resource → View Resource Profile

**Filtering & Search**
- Search bar for each section
- Filter by status (Active/Inactive)
- Filter by assignment
- Hierarchical collapse/expand

**Quick Actions**
- + New Plant
- + New Service Territory
- + New Work Center
- + New Service Resource
- Assign / Unassign buttons

---

## 4. Plant Details View

### 4.1 Plant Record Structure

**Purpose**: Display plant/facility information and organizational relationships.

```
┌──────────────────────────────────────────────────────────────────┐
│  Service Territory (Header)                                      │
│  PDG (Plant Location)                                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Address: [Plant location]              Operating Hours         │
│  UT FMC WIB Time Zone 24 Hours          Active: ✓              │
│                                                                   │
│  [Related] [Details] (Active Tab)                                │
│                                                                   │
│  DETAILS TAB CONTENT                                              │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  ▼ Information                                         [▼] │  │
│  │  ├─ Name: PDG                         [Edit]              │  │
│  │  ├─ Parent Territory: [empty]         [Edit]              │  │
│  │  ├─ Operating Hours: UT FMC WIB Time  [Edit]              │  │
│  │  │                   Zone 24 Hours                         │  │
│  │  ├─ Active: ✓ (Checked)                                   │  │
│  │  ├─ Address: [Plant address]          [Edit]              │  │
│  │  ├─ Type: Plant                       [Edit]              │  │
│  │  ├─ Travel Offset: [empty]            [Edit]              │  │
│  │  ├─ Units of Measure: [empty]         [Edit]              │  │
│  │  ├─ Site: [empty]                     [Edit]              │  │
│  │  ├─ Contact Email: [empty]            [Edit]              │  │
│  │  ├─ Contact Jabatan: [empty]          [Edit]              │  │
│  │  ├─ Contact Parent Email: [empty]     [Edit]              │  │
│  │  ├─ Area Name: Branch Area 1          [Edit]              │  │
│  │  ├─ Service Area Name: Padang ST      [Edit]              │  │
│  │  │                                                         │  │
│  │  ▼ System Information                                 [▼] │  │
│  │  ├─ Created By: Purnomo, 31/12/2019  [Edit]              │  │
│  │  │                  16:31                                 │  │
│  │  ├─ Last Modified By: ETL Integration [Edit]             │  │
│  │  │                    02/11/2024, 05:12                   │  │
│  │  ├─ SF External ID: PDG                                  │  │
│  │  │                                                         │  │
│  │  [New Note] [New Contact] [Clone]                        │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

#### 4.1.1 Information Section Fields

**Plant Identification**
- **Name**: Unique plant identifier (PDG = Padang)
- **Type**: Plant, Service Hub, Distribution Center
- **Active**: Boolean flag for operational status
- **SF External ID**: SAP/External system reference

**Location & Contact**
- **Address**: Physical location of facility
- **Area Name**: Branch Area designation (Branch Area 1, etc.)
- **Service Area Name**: Regional service zone
- **Contact Email/Jabatan**: Contact person information
- **Contact Parent Email**: Escalation contact

**Operating Configuration**
- **Operating Hours**: Time zone and coverage hours
- **Travel Offset**: Travel time allowance for service
- **Units of Measure**: Standard UoM for operations
- **Site**: Specific site designation within plant

#### 4.1.2 System Information Section
- **Created By**: User and date/time of creation
- **Last Modified By**: User and date/time of last change
- **External System References**: SAP, ETL sync info

---

## 5. Service Territory Details View

### 5.1 Service Territory Record Structure

**Purpose**: Display geographic service area configuration and team assignments.

```
┌──────────────────────────────────────────────────────────────────┐
│  Service Territory (Header)                                      │
│  Sangkulirang FMC ST                                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Address: [Territory location]    Operating Hours               │
│  00:00 - 00:00 WITA (24 Hours)    Active: ✓                    │
│                                                                   │
│  [Related] [Details] (Active Tab)                                │
│                                                                   │
│  DETAILS TAB CONTENT                                              │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  ▼ Information                                         [▼] │  │
│  │  ├─ Name: Sangkulirang FMC ST       [Edit]              │  │
│  │  ├─ Parent Territory: SKL           [Edit]              │  │
│  │  ├─ Operating Hours: 00:00 - 00:00  [Edit]              │  │
│  │  │                   WITA (24 Hours)                     │  │
│  │  ├─ Active: ✓ (Checked)                                 │  │
│  │  ├─ Address: [Territory address]    [Edit]              │  │
│  │  ├─ Description: [Territory desc]   [Edit]              │  │
│  │  ├─ Owner: Admin Service DAD        [Edit]              │  │
│  │  ├─ Type: UT FMC Site               [Edit]              │  │
│  │  ├─ Travel Offset: [value]          [Edit]              │  │
│  │  ├─ Units of Measure: [empty]       [Edit]              │  │
│  │  ├─ Site: [empty]                   [Edit]              │  │
│  │  ├─ Contact Email: bglcancer@...    [Edit]              │  │
│  │  ├─ Contact Jabatan: [empty]        [Edit]              │  │
│  │  ├─ Contact Parent Email: [empty]   [Edit]              │  │
│  │  ├─ Area Name: Site 2A dan 2B       [Edit]              │  │
│  │  ├─ Service Area Name: Sangkulirang [Edit]              │  │
│  │  │                   FMC ST                              │  │
│  │  │                                                       │  │
│  │  ▼ System Information                                [▼] │  │
│  │  ├─ Created By: Admin Service DAD   [Edit]              │  │
│  │  │              08/01/2025, 15:32                       │  │
│  │  ├─ Last Modified By: Sys. Admin HD [Edit]              │  │
│  │  │                    17/04/2025, 15:13                 │  │
│  │                                                         │  │
│  │  [New Note] [New Contact] [Clone]                      │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  RIGHT PANEL: Activity & Links                                   │
│  ┌────────────────────────────────────────┐                     │
│  │ Activity                                │                     │
│  │ [Filter controls]                       │                     │
│  │                                         │                     │
│  │ Upcoming & Overdue:                     │                     │
│  │ No activities to show.                  │                     │
│  │                                         │                     │
│  │ [Show All Activities]                  │                     │
│  └────────────────────────────────────────┘                     │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

#### 5.1.1 Territory Identification
- **Name**: Territory identifier (Sangkulirang FMC ST)
- **Parent Territory**: Hierarchical parent (SKL)
- **Type**: Territory type (UT FMC Site, etc.)
- **Active**: Operational status indicator

#### 5.1.2 Service Configuration
- **Operating Hours**: Coverage hours and time zone (WITA)
- **Address**: Physical location of territory base
- **Area Name**: Branch area assignment (Site 2A dan 2B)
- **Service Area Name**: Regional designation
- **Travel Offset**: Travel time adjustment

#### 5.1.3 Contact Information
- **Owner**: Territory manager/owner
- **Contact Email**: Primary contact email
- **Contact Jabatan**: Contact person title
- **Contact Parent Email**: Escalation contact

---

## 6. Related Tab - Service Territory Members & Locations

### 6.1 Service Territory Related Tab

**Purpose**: Display team members and operational locations linked to territory.

```
┌──────────────────────────────────────────────────────────────────┐
│  Related Tab (Service Territory)                                 │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ✓ Service Territory Members (6+)                          [New] │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Member Number | Service Resource | Territory Type | Start  │  │
│  │ STM-103530    | Bambang Suraji   | Primary       | 01/01.. │  │
│  │ STM-103532    | Arrochman...     | Primary       | 01/01.. │  │
│  │ STM-103534    | Sulistawan Merudin | Primary     | 01/01.. │  │
│  │ STM-103535    | Ariga Desiwan... | Primary       | 01/01.. │  │
│  │ STM-103536    | Herry Sustriyanto| Primary       | 01/01.. │  │
│  │ STM-103537    | Nur Hasan        | Primary       | 01/01.. │  │
│  │                                        [View All (6+)]      │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Service Territory Locations (0)                            [New] │
│  [No locations currently assigned]                               │
│                                                                   │
│  Files (0)                                                  [Add] │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  [Upload Files]  Or drag files                              │  │
│  │                                                              │  │
│  │  (No files attached)                                         │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Service Territory History (1)                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Date: 08/01/2025, 15:32                                    │  │
│  │ Field: Created.                                             │  │
│  │ User: Admin Service DAD                                    │  │
│  │ Original Value: [N/A]                                       │  │
│  │ New Value: [N/A]                                            │  │
│  │                                  [View All]                 │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Child Service Territories (0)                             [New] │
│  [No child territories]                                          │
│                                                                   │
│  Divisions (0)                                             [New] │
│  [No divisions assigned]                                         │
│                                                                   │
│  Locations (1)                                             [New] │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Work Center Name        | Work Center Type | Visitor Addr  │  │
│  │ FM-SKLPM               | Warehouse        | [Address]      │  │
│  │                                    [View All]              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Cases (Service Area) (6+)                                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Case ID     | Subject                      | Date Opened   │  │
│  │ 01562627    | HD785-7.7D3, D773D PS...    | 28/05/2026 09:41
│  │ 01562551    | RI BUCKET CYL PC200-8...    | 28/05/2026 09:02
│  │ 01562243    | 01274082 -- HOSE STEERING.. | 28/05/2026 04:00
│  │ 01562247    | 01274099 -- PIPING LUBRIC.. | 28/05/2026 03:35
│  │ [Additional cases...]                                      │  │
│  │                                    [View All]              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

#### 6.1.1 Service Territory Members Table

**Columns:**
- **Member Number**: Unique identifier (STM-XXXXX)
- **Service Resource**: Technician/staff name (clickable link)
- **Territory Type**: Primary, Secondary, Support
- **Start Date**: Assignment date (01/01/2025)
- **Actions**: Edit, Delete, View detail

**Features:**
- Multiple member assignments per territory
- Territory type designation (primary coverage, backup, etc.)
- Sortable by any column
- View All link for complete list
- New Member button for assignments

#### 6.1.2 Service Territory Locations

**Purpose**: Work centers and operational bases within territory.

**Columns:**
- **Work Center Name**: Facility identifier (FM-SKLPM)
- **Work Center Type**: Warehouse, Service Center, Depot
- **Visitor Address**: Public-facing address for customers

#### 6.1.3 Service Territory History

**Purpose**: Audit trail of changes to territory.

**Displays:**
- Date and time of change
- Field that was modified
- User who made change
- Before and after values
- Expandable for full details

#### 6.1.4 Linked Cases

**Purpose**: Service cases associated with territory.

**Columns:**
- **Case ID**: Unique case identifier
- **Subject**: Problem description
- **Date/Time Opened**: Case creation timestamp
- **Priority**: Case priority level (Medium, High)
- **Status**: Open, In Progress, Closed

**Features:**
- Show most recent 6+ cases
- View All for complete list
- Click to open case detail
- Filter by status/priority

#### 6.1.5 Child Territories & Divisions

**Purpose**: Hierarchical organization structure.

- **Child Territories**: Sub-regions under current territory
- **Divisions**: Organizational subdivisions
- New button to create sub-territories
- Hierarchical collapse/expand capability

---

## 7. Work Center Details View

### 7.1 Work Center Record Structure

**Purpose**: Display operational base configuration and inventory location.

```
┌──────────────────────────────────────────────────────────────────┐
│  Work Center (Header)                                            │
│  FM-SKLPM (Warehouse)                                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Work Center Type: Warehouse                                     │
│                                                                   │
│  [Related] [Details] (Active Tab)                                │
│                                                                   │
│  DETAILS TAB CONTENT                                              │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  ▼ Information                                         [▼] │  │
│  │  ├─ Work Center Name: FM-SKLPM      [Edit]              │  │
│  │  ├─ Work Center Type: Warehouse     [Edit]              │  │
│  │  ├─ Description: FMC Sangkulirang   [Edit]              │  │
│  │  ├─ Parent Work Center: [empty]     [Edit]              │  │
│  │  ├─ Mobile Location: ☐              [Edit]              │  │
│  │  ├─ Inventory Location: ☐           [Edit]              │  │
│  │  ├─ Visitor Address: [empty]        [Edit]              │  │
│  │  ├─ Time Zone: [empty]              [Edit]              │  │
│  │  ├─ Driving Directions: [empty]     [Edit]              │  │
│  │  ├─ Service Territory: Sangkulirang [Edit]              │  │
│  │  │                    FMC ST                             │  │
│  │  ├─ SAP External Key: FM-SKLPM      [Edit]              │  │
│  │  │                                                       │  │
│  │  ▼ System Information                                [▼] │  │
│  │  ├─ Created By: Admin Service DAD   [Edit]              │  │
│  │  │              08/01/2025, 15:33                       │  │
│  │  ├─ Owner: Admin Service DAD        [Edit]              │  │
│  │  ├─ Last Modified By: Admin Service [Edit]              │  │
│  │  │                    DAD, 08/01/2025, 15:33           │  │
│  │                                                         │  │
│  │  [New Contact] [New Note] [Edit]                       │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  RIGHT PANEL: Activity                                            │
│  ┌────────────────────────────────────────┐                     │
│  │ Activity                                │                     │
│  │                                         │                     │
│  │ No activities to show.                  │                     │
│  │                                         │                     │
│  │ [Show All Activities]                  │                     │
│  └────────────────────────────────────────┘                     │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

#### 7.1.1 Work Center Identification
- **Name**: Unique center identifier (FM-SKLPM)
- **Type**: Warehouse, Service Center, Depot, Mobile Unit
- **Description**: Purpose of work center
- **SAP External Key**: External system reference

#### 7.1.2 Configuration Fields
- **Parent Work Center**: Hierarchical parent (if nested)
- **Mobile Location**: Flag for mobile/traveling unit
- **Inventory Location**: Flag if used for parts storage
- **Service Territory**: Parent territory assignment
- **Time Zone**: Operational time zone

#### 7.1.3 Location Information
- **Visitor Address**: Public-facing address
- **Driving Directions**: Navigation/direction details
- **Contact Details**: Manager and contact information

---

## 8. Work Center Related Tab - Linked Information

### 8.1 Work Center Related Tab Structure

**Purpose**: Display cases and operational data linked to work center.

```
┌──────────────────────────────────────────────────────────────────┐
│  Related Tab (Work Center)                                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Cases (Service Area) (6+)                                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Case ID     | Subject              | Date Opened | Priority│  │
│  │ 01562627    | HD785-7.7D3...      | 28/05/2026  | Medium  │  │
│  │ 01562551    | RI BUCKET CYL...    | 28/05/2026  | Medium  │  │
│  │ 01562244    | [Case subject]      | 28/05/2026  | Medium  │  │
│  │ 01562243    | 01274082 -- HOSE... | 28/05/2026  | Medium  │  │
│  │ 01562247    | 01274099 -- PIPING..| 28/05/2026  | Medium  │  │
│  │ 01562223    | TRS ENGINE LOW POW..| 27/05/2026  | Medium  │  │
│  │                                        [View All]          │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Work Center Name         | Work Center Type | Visitor Address   │
│  FM-SKLPM               | Warehouse        | [Address details]  │
│  [View All]                                                      │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

**Related Objects:**
- **Cases**: Service cases dispatched from this work center
- **Linked Work Centers**: Related facilities
- **Shifts**: Shifts scheduled at this center
- **Service Resources**: Technicians based here

---

## 9. Complete Organizational Hierarchy

### 9.1 Hierarchy Visualization

```
PLANT (Level 1)
├── PDG (Padang Plant)
│   ├── OPERATING HOURS: UT FMC WIB Time Zone 24 Hours
│   ├── ADDRESS: [Plant location]
│   ├── ACTIVE: Yes
│   │
│   └─ SERVICE AREA (Level 2)
│       ├── Branch Area 1
│       ├── SERVICE AREA NAME: Padang ST
│       │
│       ├─ SERVICE TERRITORY (Level 3)
│       │  ├── Sangkulirang FMC ST (Active)
│       │  │   ├── OPERATING HOURS: 00:00-00:00 WITA
│       │  │   ├── MEMBERS: 6+ Service Resources
│       │  │   ├── LOCATIONS: 1 Work Center
│       │  │   │
│       │  │   └─ WORK CENTER (Level 4)
│       │  │      ├── FM-SKLPM (Warehouse)
│       │  │      ├── TYPE: Warehouse / Service Center
│       │  │      ├── SERVICE TERRITORY LINK: Sangkulirang FMC ST
│       │  │      │
│       │  │      └─ SERVICE RESOURCES (Level 5)
│       │  │         ├── Bambang Suraji (Primary)
│       │  │         ├── Arrochman Arrochman (Primary)
│       │  │         ├── Sulistawan Merudin (Primary)
│       │  │         ├── Ariga Desiwan Ardiyanto (Primary)
│       │  │         ├── Herry Sustriyanto (Primary)
│       │  │         └── Nur Hasan (Primary)
│       │  │
│       │  └── PDG (Secondary Service Territory)
│       │      ├── OPERATING HOURS: UT FMC WIB...
│       │      ├── PARENT: PDG
│       │      └── MEMBERS: [Team assignments]
│       │
│       └─ CHILD TERRITORIES
│           └── [Sub-region territories]
│
└─ RELATED OPERATIONS
   ├── WORK ORDERS
   │   └── Assigned to Service Territory
   │   └── Dispatched via Shift scheduling
   │   └── Executed by Service Resources
   │
   ├── CASES
   │   └── Linked to Plant/Work Center
   │   └── Assigned to Service Territory
   │   └── Tracked by Service Area
   │
   └── SHIFTS
       └── Scheduled per Service Territory
       └── Resource allocation
       └── Time zone based
```

### 9.2 Hierarchy Rules & Constraints

```
ORGANIZATIONAL HIERARCHY RULES:

1. PLANT → SERVICE AREA → TERRITORY → WORK CENTER → RESOURCES
   Each level strictly contains the next
   No skipping levels
   Parent/child relationships bidirectional

2. SERVICE TERRITORY REQUIREMENTS:
   ├── Must have parent Plant reference
   ├── Must have Operating Hours defined
   ├── Must have at least 1 Service Resource assigned
   ├── Can have multiple Work Centers
   └── Can have multiple Child Territories

3. WORK CENTER REQUIREMENTS:
   ├── Must have parent Service Territory
   ├── Must have unique name within territory
   ├── Type must be valid (Warehouse, Service Center, etc.)
   ├── Can be Mobile or Fixed location
   └── Can serve as inventory location

4. SERVICE RESOURCE REQUIREMENTS:
   ├── Must be assigned to Service Territory
   ├── Can have Territory Type (Primary, Secondary)
   ├── Can be associated with Work Center
   ├── Must have start date
   └── Can have end date (for inactive)

5. GEOGRAPHIC CONSTRAINTS:
   ├── Service Territory must be within Plant
   ├── Work Center must be within Territory geography
   ├── Time zone must match Territory
   └── Overlapping territories allowed (for backup coverage)
```

---

## 10. Data Integration with Work Orders & Cases

### 10.1 Work Order Integration Flow

```
WORK ORDER CREATION & ASSIGNMENT

Step 1: Work Order Created
┌─────────────────────────────┐
│ Work Order (WO-12345)       │
│ • Service Type: Repair      │
│ • Customer Location: [Area] │
│ • Assigned Territory: TBD   │
└──────────────┬──────────────┘

Step 2: Territory Assignment
┌─────────────────────────────┐
│ Select Service Territory    │
│ • Sangkulirang FMC ST       │
│ • Operating Hours Match: ✓  │
│ • Resource Availability: ✓  │
└──────────────┬──────────────┘

Step 3: Resource Allocation
┌─────────────────────────────┐
│ Assign Service Resource     │
│ • Bambang Suraji (Primary)  │
│ • Current Shift: SFT-0293   │
│ • Availability: Yes         │
└──────────────┬──────────────┘

Step 4: Work Center Dispatch
┌─────────────────────────────┐
│ Dispatch from Work Center   │
│ • FM-SKLPM (Warehouse)      │
│ • Parts Location: Yes       │
│ • Travel Time: Est. 1 hour  │
└──────────────┬──────────────┘

Step 5: Execution
┌─────────────────────────────┐
│ Service Delivery            │
│ • Technician dispatched     │
│ • Work completed            │
│ • Parts consumed            │
│ • Timesheet recorded        │
└─────────────────────────────┘
```

### 10.2 Case Integration Flow

```
CASE CREATION & ASSIGNMENT

Case Created for Plant/Service Area
│
├─ Case Details:
│  ├── Subject: Equipment failure
│  ├── Priority: Medium/High
│  ├── Customer: [Account]
│  └── Plant: PDG
│
├─ Territory Assignment:
│  ├── Analyzed by geography
│  ├── Service Territory: Sangkulirang FMC ST
│  └── Work Center: FM-SKLPM
│
├─ Resource Allocation:
│  ├── Primary: Bambang Suraji
│  ├── Backup: Arrochman Arrochman
│  └── Shift: Regular business hours
│
└─ Dispatch & Tracking:
   ├── Case status updated
   ├── Technician assigned
   ├── Work Order created
   └── Resolution tracked
```

---

## 11. Responsive Design Strategy

### 11.1 Desktop Layout (1920px+)
- Full sidebar visible (18%)
- Main content area (65%)
- Right activity panel (17%)
- All details fully displayed
- Multi-column tables visible

### 11.2 Tablet Layout (768px - 1024px)
- Collapsible sidebar (icon mode)
- Two-column content stack
- Bottom activity sheet
- Responsive tables with horizontal scroll
- Touch-optimized buttons

### 11.3 Mobile Layout (<768px)
- Hamburger menu sidebar
- Full-width main content
- Bottom sheet for related items
- Card-based layout
- Single-column tables with card view

---

## 12. Accessibility & Performance

### 12.1 Accessibility Features
- **Keyboard Navigation**: Tab through hierarchy items
- **Screen Reader**: ARIA labels on all interactive elements
- **Color + Text**: Status indicators use both
- **Focus Indicators**: Visible 2px focus rings
- **Contrast**: Minimum 4.5:1 ratio

### 12.2 Performance Optimization
- **Virtual Scrolling**: For member lists >100 items
- **Lazy Loading**: Load related records on demand
- **Search Debounce**: 300ms delay for resource search
- **Caching**: Territory and resource lists cached
- **Progressive Loading**: Load hierarchy progressively

---

## 13. Business Rules & Validations

### 13.1 Plant Rules
- **Unique Name**: Plant name must be unique
- **Active Status**: Only active plants in dispatch
- **Time Zone**: Required for operating hours
- **Area Assignment**: Must have service area

### 13.2 Service Territory Rules
- **Parent Reference**: Must link to Plant
- **Operating Hours**: Required for scheduling
- **Member Assignment**: Minimum 1 service resource
- **Active Status**: Inactive territories hidden from dispatch

### 13.3 Work Center Rules
- **Parent Territory**: Must be assigned
- **Type Required**: Type must be valid value
- **Name Uniqueness**: Unique within territory
- **Location**: Address or coordinates required

### 13.4 Service Resource Rules
- **Territory Assignment**: Primary territory required
- **Start Date**: Assignment date required
- **Role**: Service resource type/role required
- **Availability**: Can mark as available/unavailable

---

## 14. Implementation Roadmap

### Phase 1: Core Hierarchy (Weeks 1-2)
- [ ] Build Plant module with CRUD
- [ ] Create Service Territory management
- [ ] Implement Work Center creation
- [ ] Build service resource assignment
- [ ] Create hierarchy views
- [ ] Basic validation rules

### Phase 2: Related Objects (Weeks 3-4)
- [ ] Link cases to territories/plants
- [ ] Associate work orders with territories
- [ ] Build member assignment interface
- [ ] Create location management
- [ ] Implement file attachments
- [ ] Build history/audit trail

### Phase 3: Integration & Optimization (Weeks 5-6)
- [ ] Gantt chart integration
- [ ] Shift scheduling linkage
- [ ] Dispatch optimization
- [ ] Search and filtering
- [ ] Reporting dashboard
- [ ] Mobile responsiveness

---

**Document Version**: 1.0  
**Last Updated**: May 28, 2026  
**Author**: Enterprise Systems Design Team  
**Status**: Final Design Documentation - Production Ready

---

## Appendix A: Field Reference Guide

### Plant Core Fields
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| Name | Text | Yes | Plant identifier | PDG |
| Type | Picklist | Yes | Plant/Hub/Center | Plant |
| Active | Boolean | Yes | Operational status | True |
| Address | Text | No | Physical location | [Address] |
| Operating Hours | Text | Yes | Coverage hours | UT FMC WIB Time Zone 24 Hours |

### Service Territory Fields
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| Name | Text | Yes | Territory identifier | Sangkulirang FMC ST |
| Parent Territory | Lookup | Yes | Parent territory | PDG |
| Operating Hours | Text | Yes | Coverage hours | 00:00-00:00 WITA |
| Active | Boolean | Yes | Operational | True |
| Area Name | Text | Yes | Branch area | Site 2A dan 2B |

### Work Center Fields
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| Name | Text | Yes | Center identifier | FM-SKLPM |
| Type | Picklist | Yes | Center type | Warehouse |
| Parent Territory | Lookup | Yes | Service territory | Sangkulirang FMC ST |
| Address | Text | No | Physical location | [Address] |
| Service Territory | Lookup | Yes | Operational territory | Sangkulirang FMC ST |

---

**END OF PLANT & SERVICE TERRITORY MODULE DESIGN**
