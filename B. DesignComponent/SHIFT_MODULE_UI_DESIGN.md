# Shift Module - UI Design Document
## Field Service Resource Allocation & Schedule Management

## 1. Executive Summary

The **Shift Module** is the critical interface for managing service delivery schedules, allocating standby service resources, and coordinating field service operations across geographic territories and service plants. It serves as the bridge between opportunity/work order management and actual field service resource deployment, providing operations managers with comprehensive visibility into shift planning, resource allocation, and schedule optimization. This design document outlines a sophisticated interface featuring:

- **Shift Management Forms** - Creation and configuration of recurring shifts
- **Gantt Chart Scheduling** - Visual timeline-based resource allocation
- **Resource Allocation Interface** - Assignment of standby personnel to shifts
- **Recurring Pattern Configuration** - Weekly, monthly, and custom recurrence
- **Field Service Integration** - Linkage to service territories and work schedules
- **Real-Time Status Tracking** - Confirmation and override capabilities
- **Multi-View Interface** - Grid, Gantt chart, and calendar perspectives

---

## 2. Complete System Architecture

### 2.1 Overall System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  FIELD SERVICE WORKFLOW                         │
│                                                                  │
│  Work Order Creation (Opportunity/Service Request)              │
│  ↓                                                               │
│  Service Territory Assignment (Geographic Area)                 │
│  ↓                                                               │
│  Shift Management (Time-based Resource Allocation)              │
│  ├─ Create New Shift                                            │
│  ├─ Define Recurrence Pattern (Daily/Weekly/Monthly)           │
│  ├─ Assign Service Resources (Standby Personnel)               │
│  ├─ Configure Shift Schedule (Gantt Chart)                     │
│  └─ Confirm Resource Allocation                                │
│  ↓                                                               │
│  Field Service Execution (Technician Dispatch)                 │
│  ↓                                                               │
│  Work Completion & Timesheet Entry                             │
│  ↓                                                               │
│  Billing & Revenue Recognition                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Shift Module Data Flow

```
┌──────────────────────────────┐
│  SHIFT CREATION FORM          │
│  • Start/End Time             │
│  • Status (Tentative/Confirmed)
│  • Service Territory           │
│  • Time Slot Type             │
│  • Recurrence Pattern         │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  SHIFT OBJECT (Recurring)     │
│  • SFT-0293 (Single Instance) │
│  • Template: DAY              │
│  • Pattern: Weekly            │
│  • Occurs on: Mon, Fri        │
└──────────────┬───────────────┘
               │
       ┌───────┼──────────┐
       │       │          │
       ▼       ▼          ▼
   ┌────────┐ ┌────────┐ ┌──────────────┐
   │SERVICE │ │RESOURCE│ │GANTT CHART   │
   │TERRIT  │ │ALLOC.  │ │SCHEDULING    │
   └────────┘ └────────┘ └──────────────┘
       │          │           │
       └──────────┼───────────┘
                  │
                  ▼
       ┌──────────────────────┐
       │ FIELD SERVICE EXEC.  │
       │ • Technician dispatch│
       │ • Work Order link    │
       │ • Service delivery   │
       └──────────────────────┘
```

---

## 3. List View - Shifts Overview

### 3.1 Shifts List Interface

**Purpose**: Display all shifts with filtering, grouping, and bulk actions.

```
┌──────────────────────────────────────────────────────────────────┐
│  Shifts                          All Shifts    [New]              │
│                                                                   │
│  19 Items • Filtered by: All Shifts • Updated 2 minutes ago      │
│                                                                   │
│  Resources              Shifts by Work Type Group               │
│  [Tab 1]                [Tab 2]                                 │
│  [Left Panel Shows:     [Center/Right Shows:                    │
│   Market St Branch...]   SUN, MAY 08 | MON, MAY 09 ...         │
│   • Rachel Adams        │ 9:00 AM - 6:00 PM                     │
│   • Rachel Green        │ (Service Resource: Rachel Adams)      │
│   • Ramona Lawyer       │                                        │
│   • Ronald Wesley       │ Vacation | 12:00 AM - 11:30 PM       │
│   • Ryan Dobson         │                                        │
│                         │ 10:00 AM - 6:00 PM                    │
│                         │                                        │
│  Territory Time Zone    │ [TUE, MAY 10] [WED, MAY 11] [THU]    │
│  [Filter: PTT] [Dropdown]
│                         │                                        │
│  [Right Panel:]         │ SFT-0293                              │
│  ┌─────────────────┐    │ Start Time: 5/12/2022, 10:00 AM      │
│  │ Territory Time  │    │ End Time: 5/7/2022, 06:00 PM         │
│  │ Zone            │    │ Service Resource: Rachel Adams       │
│  │ 4 [Dropdown]    │    │ Work Type Group: Service Territory   │
│  │                 │    │ Market St Branch, San Francisco      │
│  │ [Today] [Upcoming]   │                                        │
│  │ [↙ View] [Export]    │ [Edit] [Delete] [Clone]             │
│  └─────────────────┘    │                                        │
│                         │                                        │
└──────────────────────────────────────────────────────────────────┘
```

#### 3.1.1 List View Components

**Left Panel: Resources**
- Service territory/location listing
- Service resource names (team members assigned)
- Territory location indicator
- Quick filter by territory

**Center Panel: Calendar View**
- Week view (multiple days displayed)
- Shift blocks displayed by time
- Color coding by shift type
- Duration visualization
- Service resource attribution

**Right Panel: Quick Details**
- Selected shift summary
- Start/End time
- Service resource assignment
- Shift ID (SFT-XXXX)
- Action buttons (Edit, Delete, Clone)

**Top Filters**
- Territory Time Zone selector
- View options (Today, Upcoming)
- Export functionality

#### 3.1.2 Shift Card Display
```
┌─────────────────────────────────┐
│  SFT-0293                        │
│  Start: 5/12/2022, 10:00 AM    │
│  End: 5/7/2022, 06:00 PM       │
│                                 │
│  Service Resource:              │
│  Rachel Adams                   │
│                                 │
│  Work Type Group:               │
│  Service Territory              │
│  Market St Branch, SF           │
│                                 │
│  [Edit] [Delete] [Clone]        │
└─────────────────────────────────┘
```

---

## 4. New Shift Form - Creation Interface

### 4.1 New Shift Form Structure

**Purpose**: Create single or recurring shifts with comprehensive configuration.

```
┌──────────────────────────────────────────────────────────────────┐
│  New Shift                                                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Information Section                                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │  * Start Time        * End Time                          │   │
│  │  [5/22/2022] [7:00 AM]  [5/22/2022] [9:00 PM]          │   │
│  │                                                          │   │
│  │  * Status                   Job Profile                 │   │
│  │  [Tentative ▼]              [Search Job Profiles...]    │   │
│  │                                                          │   │
│  │  Service Territory           Service Resource           │   │
│  │  [Search Service Territories]  [Search Service Resources]
│  │                                                          │   │
│  │  * Time Slot Type           Label                        │   │
│  │  [Normal ▼]                 [Text input]                │   │
│  │  [Non-Standard]                                          │   │
│  │                                                          │   │
│  │  Background Color           Recordset Filter Criteria   │   │
│  │  [Blue dropdown]            [Emergency Only ✓] [X]      │   │
│  │                                                          │   │
│  │  Shift Cell Preview:        Holiday Shift               │   │
│  │  [Orange bar]               [Checkbox]                  │   │
│  │  [Reset Background Color]                               │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [Cancel] [Save & New] [Save]                                    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

#### 4.1.1 Form Fields

**Time Configuration**
- **Start Time**: Date picker + Time picker (7:00 AM default)
- **End Time**: Date picker + Time picker (9:00 PM default)
- **Status**: Dropdown (Tentative, Confirmed, Cancelled)

**Resource Assignment**
- **Job Profile**: Search/lookup field for job roles
- **Service Territory**: Lookup with region/location selection
- **Service Resource**: Dropdown to select specific personnel

**Shift Configuration**
- **Time Slot Type**: Dropdown (Normal, Extended, Non-Standard)
- **Background Color**: Color picker for visual distinction
- **Holiday Shift**: Checkbox for holiday schedule flag

**Advanced Settings**
- **Label**: Free-text field for shift naming
- **Recordset Filter Criteria**: Tag-based filtering (e.g., "Emergency Only")
- **Shift Cell Preview**: Visual representation of shift appearance

#### 4.1.2 Required vs Optional Fields
```
REQUIRED (marked with *)
- Start Time
- End Time
- Status
- Time Slot Type

OPTIONAL
- Job Profile
- Service Territory
- Service Resource
- Label
- Background Color
- Holiday Shift flag
- Recordset Filter
```

---

## 5. Recurring Shift Configuration

### 5.1 Shift Type - Recurring Configuration

**Purpose**: Define recurring patterns for automated shift generation.

```
┌──────────────────────────────────────────────────────────────────┐
│  New Shift - Shift Type (Recurring)                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Shift Type                                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Type: [Recurring ▼]                                      │   │
│  │ • Daily   [Tab]  • Weekly [Tab - ACTIVE]  • Monthly [Tab]
│  │                                                          │   │
│  │ ℹ️ The recurrence pattern is in the selected service    │   │
│  │    territory timezone (America/Los_Angeles).             │   │
│  │                                                          │   │
│  │ Repeat Every: [1 ▼]  [week]                             │   │
│  │                                                          │   │
│  │ Repeats On:  [Sun] [Mon ✓] [Tue] [Wed] [Thu ✓] [Fri]   │   │
│  │              [Sat]                                        │   │
│  │                                                          │   │
│  │ End Date: [Date picker]  (Optional)                      │   │
│  │                                                          │   │
│  │ ○ Number of Occurrences: [4]  (Radio button selected)   │   │
│  │   [+ button]  [- button]                                 │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Fields Section                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │  * Start Time              * End Time                    │   │
│  │  [3/26/2023] [11:00 AM]    [3/26/2023] [8:00 PM]       │   │
│  │                                                          │   │
│  │  * Status                  Work Type Group               │   │
│  │  [Confirmed ▼]             [Search Work Type Groups...]  │   │
│  │                                                          │   │
│  │  Service Territory         Service Resource             │   │
│  │  [San Francisco - Mission] [Ryan Dobson (Sample)]       │   │
│  │                                                          │   │
│  │  * Time Slot Type          Label                        │   │
│  │  [Extended ▼]              [Text field]                 │   │
│  │                                                          │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [Cancel] [Save & New] [Save]                                    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

#### 5.1.1 Recurrence Pattern Options

**Daily Recurrence**
```
Repeat Every: [X] days
Example: Every 1 day, Every 3 days, etc.
```

**Weekly Recurrence** (Most Common)
```
Repeat Every: [X] weeks
Repeats On: [Select multiple days]
  ☐ Sunday
  ☑ Monday  (Example selected)
  ☐ Tuesday
  ☑ Wednesday  (Example selected)
  ☐ Thursday
  ☐ Friday
  ☑ Saturday  (Example selected)
```

**Monthly Recurrence**
```
Repeat Every: [X] months
Repeat On: [Date picker or day selector]
  Example: Every 1st Monday of month
  Example: Every 15th of month
```

#### 5.1.2 Recurrence End Options

**Option 1: End Date**
- Date picker field
- Allows shift to run through specified date
- Optional (can leave blank for indefinite)

**Option 2: Number of Occurrences**
- Radio button selection
- Numeric input field
- +/- buttons for adjustment
- Example: 4 occurrences = 4 weeks of shifts

#### 5.1.3 Recurring Shift Example

```
Pattern: Every 1 week on Monday and Friday
Start: 3/26/2023, 11:00 AM
End: 3/26/2023, 8:00 PM
Occurrences: 4

Generated Shifts:
1. Mon, Mar 26, 2023 11:00 AM - 8:00 PM
2. Fri, Mar 29, 2023 11:00 AM - 8:00 PM
3. Mon, Apr 02, 2023 11:00 AM - 8:00 PM
4. Fri, Apr 05, 2023 11:00 AM - 8:00 PM
```

---

## 6. Gantt Chart View - Visual Schedule Management

### 6.1 Gantt Chart Interface

**Purpose**: Visualize shifts across time period with resource allocation.

```
┌──────────────────────────────────────────────────────────────────┐
│  GANTT CHART SCHEDULE VIEW                                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  [Navigation] [View controls] [Zoom level]                       │
│  Sat, November 9, 2019 - Mon, November 11, 2019                 │
│  [← Prev] [Today] [Next →] [⊞ Zoom]                             │
│                                                                   │
│  [View: GANTT] [MAP] [Custom filters]                            │
│                                                                   │
│  ─────────────────────────────────────────────────────────────  │
│  CANDIDATE ASSIGNMENTS    HIDE Shifts                            │
│                                                                   │
│  Showing candidates to SA-5903:                                  │
│  [Assign assignment list > Show Area]                           │
│                                                                   │
│  LEFT PANEL (Resource List)  CENTER PANEL (Gantt Timeline)     │
│  ┌──────────────────────┐    ┌────────────────────────────────┐
│  │                      │    │  SUN, NOV 9                     │
│  │ ASSIGN RECOMMENDED   │    │                                 │
│  │ [1] (Highlighted)    │    │ ┌─────────────────────────────┐
│  │ • Anne Partners      │    │ │ [Extended shift]  (Green)    │
│  │ • Dan Smith          │    │ │ [1]  Service Resource        │
│  │ • Mary Long          │    │ └─────────────────────────────┘
│  │ • Matthew Parker     │    │                                 │
│  │ • Kevin Cunningham   │    │ MON, NOV 10                    │
│  │                      │    │ ┌─────────────────────────────┐
│  │ STATUS INDICATORS    │    │ │ [Service Territory]  (Orange)
│  │ [2] (Highlighted)    │    │ │ Scheduled shift              │
│  │ • Anne Partners      │    │ │ Service Resource: [Name]     │
│  │   NOT SCHEDULED      │    │ └─────────────────────────────┘
│  │ • Dan Smith          │    │                                 │
│  │   FULLY SCHEDULED    │    │ TUE, NOV 11                    │
│  │ • Mary Long          │    │ [Partially scheduled]          │
│  │   PARTIALLY SCH.     │    │ [Available slots: 1]           │
│  │ • Matthew Parker     │    │                                 │
│  │ • Kevin Cunningham   │    │ [Drag to reschedule]           │
│  │   AVAILABLE          │    │ [Click for details]            │
│  │                      │    │                                 │
│  └──────────────────────┘    └────────────────────────────────┘
│                                                                   │
│  LEGEND:                                                          │
│  [Green] = Extended shift                                        │
│  [Orange] = Regular service territory shift                      │
│  [Yellow] = Vacation/PTO                                         │
│  [Red] = Conflict/Unavailable                                    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

#### 6.1.1 Gantt Chart Features

**Left Panel: Resource/Candidate List**
- Personnel names and roles
- Assignment status (Recommended, Assigned, Available)
- Visual status indicators (color-coded)
- Filter/search capability
- Bulk selection for multi-assign

**Center Panel: Timeline**
- Horizontal time axis (days/weeks/months)
- Vertical resource axis (team members)
- Shift blocks displayed as bars
- Color coding by shift type
- Drag-and-drop reschedule capability
- Zoom controls for detail level
- Responsive to screen size

**Shift Block Display**
- Shift duration visualization (bar width = duration)
- Service resource name
- Color indicates shift type
- Click for detailed view
- Drag for rescheduling

**Navigation & Controls**
- Date range selector (Prev/Today/Next)
- View type switcher (GANTT, MAP, Calendar)
- Zoom level adjustment
- Filter controls
- Export/Print options

#### 6.1.2 Interaction Patterns

**Drag & Drop Rescheduling**
1. Click and hold shift bar
2. Drag to new date/time
3. System validates availability
4. Drop to confirm
5. Update notification shown

**Resource Assignment**
1. Click candidate name
2. System highlights available slots
3. Click desired shift time
4. Assign dialog appears
5. Confirm assignment
6. Shift bar updates with resource

**Conflict Detection**
- Red highlighting for conflicts
- Warning message displayed
- Prevents invalid assignments
- Shows reason for conflict

---

## 7. Shift Details View

### 7.1 Shift Details Tab Structure

**Purpose**: Display complete shift metadata and associated information.

```
┌──────────────────────────────────────────────────────────────────┐
│  SFT-3061099 (Shift Record)                                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  HEADER INFORMATION                                               │
│  Start Time: 15/05/2026, 08:00    End Time: 15/05/2026, 17:00   │
│  Status: Confirmed                Service Territory: Padang ST   │
│  Service Resource: Mohammad Ficri Kaban                          │
│  Background Color: [#D7F550] (Light Green)                       │
│                                                                   │
│  [Related] [Details] (Active)                                    │
│                                                                   │
│  DETAILS TAB CONTENT                                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │  ▼ Information                                      [▼]  │   │
│  │  ├─ Shift Template: DAY                                 │   │
│  │  ├─ Label: DAY                                          │   │
│  │  ├─ Service Territory: Padang ST              [Edit]    │   │
│  │  ├─ Start Time: 15/05/2026, 08:00            [Edit]    │   │
│  │  ├─ End Time: 15/05/2026, 17:00              [Edit]    │   │
│  │  ├─ Shift Duration: 9.0 (hours)                        │   │
│  │  ├─ Added by: [empty]                         [Edit]    │   │
│  │  │                                                      │   │
│  │  ▼ System Information                              [▼]  │   │
│  │  ├─ Created Date: 15/05/2026, 16:50                    │   │
│  │  ├─ Created By: SARIEF RAHMATTULLOH                    │   │
│  │  ├─ Last Modified By: UT Integration                  │   │
│  │  ├─ Status: Confirmed                                  │   │
│  │  ├─ Service Resource: Mohammad Ficri Kaban  [Edit]    │   │
│  │  ├─ Status Changed: Confirmed               [Edit]    │   │
│  │  ├─ Status Change Date: 15/05/2026, 16:50             │   │
│  │  ├─ Shift Changed by: SARIEF RAHMATTULLOH             │   │
│  │  ├─ Shift Changed Date: 15/05/2026, 16:50             │   │
│  │  ├─ Shift Confirmed by System Date: 19/05/2026, 07:00 │   │
│  │  ├─ Shift Manual Confirmed Date: [empty]   [Edit]    │   │
│  │  ├─ First Shift Template: [empty]                      │   │
│  │  ├─ Previous Shift Template: CTH                       │   │
│  │  │                                                      │   │
│  │  [Change Shift Type] [New Note] [New Contact]          │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  RIGHT PANEL: Activity                                            │
│  ┌──────────────────────────────────┐                            │
│  │ Activity                          │                            │
│  │ [Filter controls]                 │                            │
│  │                                   │                            │
│  │ Upcoming & Overdue:               │                            │
│  │ No activities to show.            │                            │
│  │                                   │                            │
│  │ [Show All Activities]             │                            │
│  └──────────────────────────────────┘                            │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

#### 7.1.1 Information Section Fields

**Core Shift Data**
- **Shift Template**: DAY, NIGHT, EXTENDED, CTH, etc.
- **Label**: Custom shift name/identifier
- **Service Territory**: Geographic service area assignment
- **Start Time**: Date + Time picker
- **End Time**: Date + Time picker
- **Shift Duration**: Auto-calculated (hours)

**Assignment & Tracking**
- **Service Resource**: Assigned personnel
- **Status**: Tentative, Confirmed, Cancelled
- **Status Changed Date**: When status last changed
- **Shift Changed by**: User who modified
- **Added by**: Original creator field

**Additional Configuration**
- **Shift Template History**: Previous/First template used
- **Manual Confirmed Date**: Override system confirmation
- **System Confirmation Date**: Auto-generated date

#### 7.1.2 System Information Section

**Audit Trail**
- **Created Date**: Initial record creation timestamp
- **Created By**: User who created shift
- **Last Modified By**: Most recent user to edit
- **Modification Timestamp**: When last changed

**Status Tracking**
- **Current Status**: Confirmed, Pending, Cancelled
- **Status Change History**: All status transitions recorded
- **Confirmation Dates**: Manual vs system confirmations
- **Resource Assignment**: Personnel linked to shift

#### 7.1.3 Action Buttons

**Header Actions**
- **Change Shift Type**: Modify shift classification
- **New Note**: Add internal notes/comments
- **New Contact**: Create contact record
- **Edit Shift**: Inline edit capability (pencil icon)

---

## 8. Related Tab - Linked Records & Activity

### 8.1 Related Tab Structure

**Purpose**: Display associated shifts, work orders, and activities.

```
┌──────────────────────────────────────────────────────────────────┐
│  Related Tab (SFT-3061099)                                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  [Related] [Details] [Activity]                                  │
│                                                                   │
│  ▼ Information                                                    │
│  ├─ All linked shifts and related records                        │
│                                                                   │
│  ▼ Field Service Appointments (Linked)                           │
│  ├─ Service Appointment Reference: SA-5903                       │
│  ├─ Work Order Link: WO-12345                                    │
│  ├─ Service Territory: Padang ST                                 │
│  │                                                                │
│  ▼ Recurring Shift Group (if applicable)                         │
│  ├─ Parent Recurring Shift: [Linked ID]                          │
│  ├─ Next Occurrence: 22/05/2026                                  │
│  ├─ Previous Occurrence: 08/05/2026                              │
│  │                                                                │
│  ▼ Related Service Products                                      │
│  ├─ Product 1: RI SWIVEL JOINT PC200                            │
│  ├─ Product 2: [Other products for this shift]                  │
│  │                                                                │
│  ▼ Resource Assignments                                          │
│  ├─ Mohammad Ficri Kaban (Primary)                              │
│  ├─ Backup: [Other resources assigned]                           │
│  │                                                                │
│  ▼ Schedule Conflicts (if any)                                   │
│  ├─ [Display any scheduling conflicts]                           │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 9. Data Structure & Field Organization

### 9.1 Shift Object - Core Fields

```
SHIFT RECORD (SFT-XXXX)
├── Identification
│   ├── Shift ID (Auto)
│   ├── Shift Template (DAY, NIGHT, etc.)
│   ├── Label (Custom name)
│   └── Background Color (Visual coding)
│
├── Time Configuration
│   ├── Start Date
│   ├── Start Time
│   ├── End Date
│   ├── End Time
│   └── Shift Duration (Calculated)
│
├── Resource Assignment
│   ├── Service Territory
│   ├── Service Resource (Personnel)
│   ├── Job Profile
│   └── Work Type Group
│
├── Status & Control
│   ├── Status (Tentative, Confirmed, Cancelled)
│   ├── Holiday Shift Flag
│   ├── Time Slot Type (Normal, Extended, Non-Standard)
│   └── Recordset Filter Criteria
│
├── Recurrence (if applicable)
│   ├── Recurrence Type (Daily, Weekly, Monthly)
│   ├── Repeat Pattern
│   ├── Days of Week
│   ├── End Date
│   └── Number of Occurrences
│
└── System Information
    ├── Created By / Created Date
    ├── Last Modified By / Date
    ├── Status Change Date
    ├── Confirmed Date
    └── Manual Override Date
```

### 9.2 Recurring Shift Pattern

```
RECURRING SHIFT CONFIGURATION
├── Recurrence Type
│   ├── Type: Recurring
│   └── Frequency: Daily, Weekly, Monthly
│
├── Weekly Recurrence (Example)
│   ├── Repeat Every: 1 week
│   ├── Repeats On: [Select multiple days]
│   │   ├── Sunday
│   │   ├── Monday
│   │   ├── Tuesday
│   │   ├── Wednesday
│   │   ├── Thursday
│   │   ├── Friday
│   │   └── Saturday
│   └── Number of Occurrences: 4-52
│
├── End Condition
│   ├── Option 1: End Date (specific date)
│   └── Option 2: Number of Occurrences
│
└── Generated Instances
    ├── SFT-0293-001 (Week 1)
    ├── SFT-0293-002 (Week 2)
    ├── SFT-0293-003 (Week 3)
    └── SFT-0293-004 (Week 4)
```

---

## 10. Integration with Field Service Module

### 10.1 Service Territory Integration

```
SERVICE TERRITORY (Geographic Area)
├── Location: Market St Branch, San Francisco
├── Territory ID: SF-001
├── Time Zone: America/Los_Angeles (PDT)
│
├── Associated Shifts
│   ├── SFT-0293 (Mon-Fri, 9-6 PM)
│   ├── SFT-0294 (Weekends, 10 AM-6 PM)
│   └── SFT-0295 (Holiday Coverage)
│
├── Service Resources (Available Personnel)
│   ├── Rachel Adams
│   ├── Rachel Green
│   ├── Ryan Dobson
│   └── [Others]
│
└── Field Service Appointments
    ├── SA-5903 (Linked work order)
    ├── Work Order: WO-12345
    └── Service Delivery: [Technician dispatch]
```

### 10.2 Work Order to Shift Linkage

```
WORK ORDER (WO-12345)
├── Service Territory: Padang ST
├── Scheduled Date: 15/05/2026
├── Service Resource Required: YES
│
├── Assigned Shift: SFT-3061099
│   ├── Date: 15/05/2026
│   ├── Time: 08:00 - 17:00
│   ├── Resource: Mohammad Ficri Kaban
│   └── Status: Confirmed
│
├── Field Service Execution
│   ├── Technician Dispatch: Mohammad Ficri Kaban
│   ├── Actual Start Time: 08:15
│   ├── Actual End Time: 16:45
│   └── Work Completion: Verified
│
└── Billing & Revenue
    ├── Billable Hours: 8.5 hours
    ├── Service Charge: [Based on shift]
    └── Invoice: [Created]
```

### 10.3 Resource Allocation Flow

```
RESOURCE ALLOCATION WORKFLOW

Step 1: Create Shift
┌─────────────────────────┐
│ New Shift Form          │
│ • Territory: Padang ST  │
│ • Time: 08:00 - 17:00   │
│ • Status: Tentative     │
└──────────┬──────────────┘

Step 2: Assign Resource
┌─────────────────────────┐
│ Select Service Resource │
│ • Mohammad Ficri Kaban  │
│ • Check availability    │
│ • Confirm assignment    │
└──────────┬──────────────┘

Step 3: Schedule in Gantt
┌─────────────────────────┐
│ Gantt Chart View        │
│ • Drag resource to slot │
│ • Visual confirmation   │
│ • System validates      │
└──────────┬──────────────┘

Step 4: Confirm Shift
┌─────────────────────────┐
│ Status: Tentative →     │
│ Status: Confirmed       │
│ System notification sent│
└──────────┬──────────────┘

Step 5: Work Order Dispatch
┌─────────────────────────┐
│ Field Service Execution │
│ • Technician deployed   │
│ • Work completed        │
│ • Timesheet recorded    │
└─────────────────────────┘
```

---

## 11. Responsive Design Strategy

### 11.1 Desktop Layout (1920px+)
- Three-panel layout fully visible (Left, Center, Right)
- Gantt chart with full week/month view
- All controls and filters accessible
- Side panels for quick details
- Full calendar integration

### 11.2 Tablet Layout (768px - 1024px)
- Two-panel layout (List + Details)
- Gantt chart condensed to 3-day view
- Side panels collapse to bottom sheet
- Touch-optimized buttons and dropdowns
- Simplified filter bar

### 11.3 Mobile Layout (<768px)
- Single-column layout, full-width
- Hamburger navigation menu
- Card-based shift display
- Swipe gestures for navigation
- Bottom sheet for actions
- Simplified forms (inline labels)

---

## 12. Color Coding & Visual Design

### 12.1 Shift Type Color Scheme

```
Standard Shifts:
  • Regular/Normal: #87CEEB (Sky Blue)
  • Extended: #90EE90 (Light Green)
  • Non-Standard: #FFD700 (Gold)

Special Shifts:
  • Holiday Shift: #FF69B4 (Hot Pink)
  • Vacation/PTO: #FFFF99 (Light Yellow)
  • On-Call: #DDA0DD (Plum)
  • Standby: #98D8C8 (Mint Green)

Status Indicators:
  • Confirmed: #28A745 (Green)
  • Tentative: #FFC107 (Amber)
  • Cancelled: #DC3545 (Red)
  • Pending: #6C757D (Gray)

Availability:
  • Available: #20C997 (Teal)
  • Fully Scheduled: #6C757D (Gray)
  • Partially Scheduled: #17A2B8 (Blue)
  • Conflict: #DC3545 (Red)
```

### 12.2 Background Color Customization

**Background Color Picker**
- Custom color selection for visual distinction
- Recommended colors provided
- Live preview of shift cell appearance
- Reset to default option

**Color Coding Benefits**
- Visual identification of shift types
- Quick scanning of schedule
- Accessibility through both color + text
- Print-friendly distinct colors

---

## 13. Accessibility & Performance

### 13.1 Accessibility Features
- **Keyboard Navigation**: Tab through shifts, arrow key selection
- **Screen Reader**: ARIA labels on all interactive elements
- **Color + Text**: Never rely on color alone for status
- **Focus Indicators**: Visible 2px focus rings
- **Form Labels**: Clear labels for all input fields
- **Contrast**: Minimum 4.5:1 ratio

### 13.2 Performance Optimization
- **Virtual Scrolling**: For resource lists >100 items
- **Lazy Loading**: Load shift details on demand
- **Gantt Rendering**: Limit to 4-week window visible
- **Search Debounce**: 300ms delay for resource search
- **Image Optimization**: Color swatches pre-rendered

---

## 14. User Workflows

### 14.1 Weekly Shift Planning Workflow
```
1. Operations Manager opens Shift module
2. Views shift list for week of 5/22-5/28
3. Identifies uncovered shifts
4. Clicks "New Shift" button
5. Fills form: Territory, Time, Resource
6. Sets recurring pattern (Mon-Fri, 9-6 PM)
7. Saves shift as "Tentative"
8. Opens Gantt chart view
9. Drags unscheduled shift to available resource
10. Confirms assignment
11. System sends notification to resource
12. Resource accepts/confirms shift
13. Status changes to "Confirmed"
14. Shift becomes available for work order dispatch
```

### 14.2 Resource Availability Check Workflow
```
1. Manager needs to schedule high-priority repair
2. Opens Gantt chart for service territory
3. Scrolls through week view
4. Identifies technician availability gaps
5. Sees "Mohammed" has gaps Mon/Fri
6. Creates new shift on Monday 8 AM
7. Assigns to Mohammed
8. Checks for conflicts (system validates)
9. No conflicts found - confirms shift
10. Links work order to confirmed shift
11. Dispatch system notifies technician
12. Technician acknowledges receipt
```

### 14.3 Recurring Shift Management Workflow
```
1. Manager needs recurring coverage Mon/Fri
2. Opens Shift creation form
3. Selects "Recurring" shift type
4. Sets: Mon 9 AM - 6 PM, Fri 9 AM - 6 PM
5. Configures "Weekly" recurrence
6. Sets "4 occurrences" (4 weeks)
7. Assigns primary resource: Rachel Adams
8. Sets backup resource: Rachel Green
9. Saves shift configuration
10. System generates 8 shift instances:
    • 4 Monday shifts
    • 4 Friday shifts
11. Manager reviews generated shifts in list
12. Confirms all instances
13. System creates work order links
```

---

## 15. Business Rules & Validations

### 15.1 Shift Validation Rules
- **Time Validation**: End Time must be after Start Time
- **Duration Limits**: Shift must be 0.5 to 24 hours
- **Resource Uniqueness**: One resource per shift (primary)
- **Territory Match**: Resource must serve assigned territory
- **Status Progression**: Tentative → Confirmed → Completed

### 15.2 Recurrence Validation
- **Pattern Validity**: At least one day selected for weekly
- **Date Range**: If end date set, must be after start date
- **Occurrence Count**: Must be 1-52 occurrences
- **Timezone**: Recurrence must match territory timezone

### 15.3 Conflict Detection
- **Resource Double-Booking**: Prevent same resource in overlapping shifts
- **Territory Coverage**: Alert if territory gap created
- **Time Zone Issues**: Warn of timezone mismatches
- **Holiday Conflicts**: Flag if shift on holiday (optional)

---

## 16. Implementation Roadmap

### Phase 1: Core Shift Management (Weeks 1-2)
- [ ] Build shift list view (grid display)
- [ ] Create new shift form with basic fields
- [ ] Implement status management (Tentative/Confirmed)
- [ ] Add time range filtering
- [ ] Build basic shift details view
- [ ] Create edit/delete functionality

### Phase 2: Recurring & Scheduling (Weeks 3-4)
- [ ] Build recurring shift form
- [ ] Implement weekly/monthly recurrence patterns
- [ ] Create shift instance generation
- [ ] Build calendar view of shifts
- [ ] Add resource assignment interface
- [ ] Implement conflict detection

### Phase 3: Gantt & Optimization (Weeks 5-6)
- [ ] Build Gantt chart visualization
- [ ] Implement drag-and-drop rescheduling
- [ ] Add resource availability checking
- [ ] Create bulk assignment interface
- [ ] Implement notifications/alerts
- [ ] Build reporting dashboard
- [ ] Performance optimization

---

## 17. Testing Strategy

### 17.1 Functional Testing
- Shift creation with all field combinations
- Recurring pattern generation
- Conflict detection accuracy
- Resource assignment validation
- Status transitions
- Time calculations (duration, timezone)

### 17.2 Performance Testing
- Load time for shift list (1000+ records)
- Gantt chart rendering with 100+ shifts
- Resource search responsiveness
- Recurrence pattern generation speed
- Concurrent user load testing

### 17.3 Integration Testing
- Field Service module linkage
- Work order shift assignment
- Territory/timezone synchronization
- Notification system integration
- SAP/ERP system sync (if applicable)

---

**Document Version**: 1.0  
**Last Updated**: May 28, 2026  
**Author**: Enterprise Systems Design Team  
**Status**: Final Design Documentation - Production Ready

---

## Appendix A: Field Reference Guide

### Shift Core Fields
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| Shift ID | Auto | Yes | System-generated identifier | SFT-3061099 |
| Start Time | DateTime | Yes | Shift start date and time | 15/05/2026, 08:00 |
| End Time | DateTime | Yes | Shift end date and time | 15/05/2026, 17:00 |
| Status | Picklist | Yes | Shift status | Confirmed |
| Service Territory | Lookup | Yes | Geographic area | Padang ST |
| Service Resource | Lookup | No | Assigned personnel | Mohammad Ficri |
| Shift Duration | Formula | Auto | Calculated hours | 9.0 |
| Background Color | Color | No | Visual color | #D7F550 |
| Time Slot Type | Picklist | Yes | Shift classification | Normal, Extended |

### Recurrence Fields
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| Recurrence Type | Picklist | Yes | Daily/Weekly/Monthly | Weekly |
| Repeat Every | Number | Yes | Frequency interval | 1 |
| Repeats On | Checkboxes | Yes (Weekly) | Days of week | Mon, Wed, Fri |
| End Date | Date | No | Recurrence end | 30/06/2026 |
| Occurrences | Number | No | Number of repeats | 4 |

---

**END OF SHIFT MODULE DESIGN DOCUMENT**
