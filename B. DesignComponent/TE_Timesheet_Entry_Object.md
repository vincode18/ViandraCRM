# Timesheet Entries Module - UI Design Document

## 1. Overview

The **Timesheet Entries Module** serves as the central hub for managing field service work entries. It receives real-time data from mechanics in the **Field Service Module**, processes entries into the **Timesheet Entries Object**, and provides a dual-column interface for detailed management and activity tracking.

---

## 2. Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FIELD SERVICE MODULE                         │
│          (Mechanic - Real-time Data Capture)                    │
│                                                                  │
│  • Service Appointment Details                                   │
│  • Operation Code (0050, 0060, 0070, etc.)                      │
│  • Start Time & End Time                                         │
│  • Task Subject (Inspection & Measuring, Install & Completed)   │
│  • Duration Calculation                                          │
│  • Mechanic Name (SHIDIK AL-IKHSAN, Cip Andrik)                │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              TIMESHEET ENTRIES OBJECT                            │
│         (Data Processing & Storage Layer)                       │
│                                                                  │
│  • TST ID (TST-2569917)                                          │
│  • Work Order Reference (01254508)                               │
│  • Service Appointment Lookup (SA-2083611)                       │
│  • Status Management (New → Submitted → Approved)               │
│  • LeadTime Calculations (3, 4)                                  │
│  • Sent to SAP Status                                            │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│             TIMESHEET ENTRIES MODULE UI                          │
│        (Display & Management Interface - This Design)            │
│                                                                  │
│  • List View (Timesheet Entries)                                 │
│  • Detail View (Individual Entry Management)                     │
│  • Activity Tracking & History                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Module Layout Structure

### 3.1 Two-Column Layout Architecture

The Timesheet Entries Module uses a **two-column responsive layout** optimized for data-intensive workflows:

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER: Module Navigation & Actions                             │
│  • Work Orders | Time Sheet Entries | Related Records            │
│  • Global Search & Filters                                        │
│  • User Profile & Settings                                       │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  PRIMARY WORK AREA                                               │
├──────────────────────────────┬──────────────────────────────────┤
│                              │                                  │
│  COLUMN 1: MAIN FIELD        │  COLUMN 2:                       │
│  (65% width)                 │  LINKED ACTIVITY                 │
│                              │  (35% width)                     │
│  ┌────────────────────────┐  │  ┌────────────────────────────┐ │
│  │  Details    │ Related  │  │  │  Activity Feed             │ │
│  ├────────────────────────┤  │  │  • Timeline View           │ │
│  │                        │  │  │  • Activity Log            │ │
│  │  [DETAILS TAB]         │  │  │  • Changes History         │ │
│  │  • Key Information     │  │  │  • User Interactions       │ │
│  │  • Time Sheet Data     │  │  │  • System Events           │ │
│  │  • Status & Approvals  │  │  │                            │ │
│  │  • LeadTime Values     │  │  │  Upcoming & Overdue        │ │
│  │                        │  │  │  • Task Status             │ │
│  │  [RELATED TAB]         │  │  │  • Alerts & Notifications  │ │
│  │  • Files (0)           │  │  │  • Communication           │ │
│  │  • Time Sheet History  │  │  │                            │ │
│  │  • Approval History    │  │  │                            │ │
│  │                        │  │  │                            │ │
│  └────────────────────────┘  │  └────────────────────────────┘ │
│                              │                                  │
└──────────────────────────────┴──────────────────────────────────┘
```

---

## 4. Column 1: Main Field (Details & Related Tabs)

### 4.1 Details Tab Structure

**Purpose**: Display comprehensive timesheet entry information with edit capabilities.

#### 4.1.1 Information Section
```
┌─────────────────────────────────────────────────────────────┐
│ INFORMATION                                           [▼]    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Time Sheet                TST-2569917                       │
│  Start Time                30/04/2026, 13:27      [Edit]    │
│  Status                    Approved              [Edit]      │
│  Work Order                01254508              [Edit]      │
│  Duration                  0.00                  [Edit]      │
│  Description               [Empty]               [Edit]      │
│  Currency ISO Code         IDR - Indonesian Rupiah           │
│  Time Sheet Submitted      01/05/2026, 07:11     [Edit]    │
│  Time Sheet Approved       08/05/2026, 13:42     [Edit]    │
│  LeadTime 3                0.8                                │
│  Leadtime 3 Accurate       ✓ (Checked)                       │
│  LeadTime 4                7.3                                │
│  Leadtime 4 Accurate       □ (Unchecked)                     │
│  L/T Submitted Timesheet   1                                  │
│  L/T Approved Timesheet    7                                  │
│  Age Submit                28                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 4.1.2 Details Tab - Key Features
- **Expandable/Collapsible Sections**: Information, System Information
- **Field Organization**: Logical grouping by data category
  - Time Sheet Identification
  - Temporal Data (Start Time, Submitted, Approved)
  - Operational Metrics (Duration, LeadTime values)
  - Status & Currency Info
  - Age & Accuracy Tracking
- **Edit Capability**: Inline edit icons (pencil icon) for each modifiable field
- **Read-Only Fields**: Calculated fields (Age, LeadTime Accurate)
- **Accessibility**: Clear labels with data types indicated

#### 4.1.3 System Information Section
```
┌─────────────────────────────────────────────────────────────┐
│ SYSTEM INFORMATION                                      [▼]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Created By      Parindra Mika Pradesta, 30/04/2026, 13:03 │
│  Last Modified   Parindra Mika Pradesta, 08/05/2026, 13:42 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.2 Related Tab Structure

**Purpose**: Display related records, file attachments, and historical data.

#### 4.2.1 Related Tab Components

**A. Files Section (0)**
```
┌─────────────────────────────────────────────────────────────┐
│ FILES (0)                                         [Add Files]│
├─────────────────────────────────────────────────────────────┤
│                                                              │
│         [Upload Files]  or drag files here                  │
│                                                              │
│         (Currently: No files attached)                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**B. Time Sheet Entry History (6+)**
```
┌─────────────────────────────────────────────────────────────┐
│ TIME SHEET ENTRY HISTORY (6+)                   [View All]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Date          Field                  User          Changes │
│  ──────────────────────────────────────────────────────────│
│  08/05/26      Status                  P.M.Pradesta  Approv.│
│  08/05/26      Time Sheet Approved     P.M.Pradesta  (date) │
│  08/05/26      Duration                P.M.Pradesta  1→0   │
│  01/05/26      Status                  SHIDIK AL-I   Subm. │
│  01/05/26      Duration                SHIDIK AL-I   →1    │
│  01/05/26      Time Sheet Submitted    SHIDIK AL-I   (date) │
│                                                              │
│  [Scrollable - Show more entries]           [View All]      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**C. Approval History (0)**
```
┌─────────────────────────────────────────────────────────────┐
│ APPROVAL HISTORY (0)                                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│         (No approval workflow records)                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 4.2.2 Related Tab - Key Features
- **Dynamic Section Counts**: Shows number of records in each section (e.g., "Files (0)", "History (6+)")
- **Collapsible Sections**: Each section can be expanded/collapsed for focused viewing
- **File Management**: Upload, download, and view attachments
- **Audit Trail**: Complete change history with user attribution and timestamps
- **Approval Workflow**: Separate section for approval-related activities

---

## 5. Column 2: Linked Activity Panel

**Purpose**: Provide real-time visibility into work progression and system communications.

### 5.1 Activity Panel Layout

```
┌─────────────────────────────────────────────────────────────┐
│ ACTIVITY                                                    │
│ Filters: All time • All activities • All types      [⚙]    │
│ Refresh • Expand All • View All                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┬──────────┬──────────┬──────────────┐          │
│  │ Sheets   │ Tasks    │ Files    │ Email        │          │
│  │[Icon]    │[Icon]    │[Icon]    │[Icon]        │          │
│  └──────────┴──────────┴──────────┴──────────────┘          │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                      │   │
│  │       No activities to show.                         │   │
│  │                                                      │   │
│  │       Get started by sending an email, scheduling   │   │
│  │       a task, and more.                             │   │
│  │                                                      │   │
│  │  To change what's shown, try changing your filters. │   │
│  │                                                      │   │
│  │              [Show All Activities]                  │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ UPCOMING & OVERDUE                                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   No activities to show.                                    │
│   Get started by sending an email, scheduling a task,       │
│   and more.                                                 │
│                                                              │
│   To change what's shown, try changing your filters.       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Activity Panel - Key Features

#### 5.2.1 Activity Type Filters
Four primary activity categories with icon-based navigation:
- **Sheets**: Related timesheet records and submissions
- **Tasks**: Assigned work items and action items
- **Files**: Document attachments and uploads
- **Email**: Email communications and notifications

#### 5.2.2 Filter Controls
- **Time Range**: All time | Custom date range
- **Activity Type**: All activities | Filter by type
- **Category**: All types | Specific categories
- **Refresh Button**: Manual refresh of activity feed
- **Expand/Collapse**: Toggle all sections at once
- **View All**: Link to comprehensive activity log

#### 5.2.3 Upcoming & Overdue Section
- **Status Indicator**: Visual distinction for pending vs. overdue items
- **Priority Highlighting**: Color-coded urgency levels
- **Quick Actions**: Inline buttons for immediate response
- **Due Date Display**: Clear deadline visibility

---

## 6. List View Interface (Timesheet Entries Table)

### 6.1 Table Structure

**Purpose**: Display all timesheet entries in a sortable, filterable grid view.

```
┌─────────────────────────────────────────────────────────────────┐
│  WORK ORDERS > 01254508 > TIME SHEET ENTRIES                   │
│  14 Items • Sorted by Start Time • Updated a few seconds ago    │
│                                                                  │
│  ☐ Name          Service Appt.  Operation  Start Time  Subject │
│  ──────────────────────────────────────────────────────────────│
│  ☐ TSE-0005      SA-2083611     0050       30/04/26   Inspect. │
│  ☐ TSE-0006      SA-2083611     0060       30/04/26   Install  │
│  ☐ TSE-0007      SA-2083611     0070       30/04/26   Perfor.  │
│  ...                                                             │
│                                                                  │
│  ☐ Mechanic Name    Duration   Status      Sent to SAP    Appr.│
│  ──────────────────────────────────────────────────────────────│
│  ☐ SHIDIK...       0.00       Approved    [Icon]        08/05  │
│                                                                  │
│                                                  [New Entry]    │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 List View - Key Features

#### 6.2.1 Column Headers (Sortable)
- **Name** (TSE-XXXX): Primary identifier
- **Service Appointment**: Link to source field service record
- **Operation Code**: Process step identifier
- **Start Time**: Entry timestamp
- **Mechanic Name**: Data entry person
- **Subject**: Task description
- **Duration**: Time spent on activity
- **Status**: Current approval state
- **Sent to SAP**: Integration status
- **Time Sheet Approval**: Final approval date

#### 6.2.2 Sorting & Filtering
- **Sort Indicators**: ▲ ▼ on active column
- **Default Sort**: Start Time (descending - newest first)
- **Multi-Column Sort**: Secondary sort options
- **Filter Rows**: Column-specific filters available
- **Search**: Global search across all columns
- **Selection**: Bulk action checkboxes

#### 6.2.3 Row Actions
- **Click to Open**: View full details in side panel
- **Inline Edit**: Some fields editable directly in grid
- **Status Indicators**: Visual badges for status
- **Quick View**: Hover previews of truncated data

#### 6.2.4 Record Count & Metadata
- **Total Items**: "14 Items" displayed at top
- **Sort Order**: "Sorted by Start Time"
- **Last Updated**: "Updated a few seconds ago"
- **Pagination**: Load more / Infinite scroll options

---

## 7. Navigation & Header Components

### 7.1 Module Navigation Tabs
```
┌─────────────────────────────────────────────────────────────┐
│  UT Service Console > Work Orders > Time Sheet Entries       │
│  [Work Orders] [Time Sheet] [TSE-0005] [...other open tabs]  │
└─────────────────────────────────────────────────────────────┘
```

- **Breadcrumb Navigation**: Clear hierarchical path
- **Tab Management**: Open multiple records simultaneously
- **Quick Switch**: Click any tab to jump between records
- **Close Actions**: "X" to close individual tabs

### 7.2 Header Actions (Detail View)
```
┌─────────────────────────────────────────────────────────────┐
│  [Update Timesheet Entry]  [New Note]  [New Contact]  [⋮]   │
└─────────────────────────────────────────────────────────────┘
```

- **Update Timesheet Entry**: Save changes to current entry
- **New Note**: Add internal notes/comments
- **New Contact**: Link new contact relationship
- **More Actions (⋮)**: Additional bulk operations
  - Delete
  - Share
  - Lock/Unlock
  - Change Owner
  - Export Data

---

## 8. Data Relationships & Lookups

### 8.1 Key Entity Links

```
TIMESHEET ENTRY (TSE-XXXX)
    ↓
    ├── Work Order Link (01254508)
    │       └── Contains multiple TimeSheet Entries
    │
    ├── Service Appointment Link (SA-2083611)
    │       └── Source data from Field Service Module
    │       └── Multiple operations per appointment
    │
    └── Time Sheet Master (TST-2569917)
            └── Aggregates multiple entries
            └── Overall approval status
            └── Sent to SAP status
```

### 8.2 Field Dependencies
- **Operation Code** → Determines **Subject** type
- **Start Time** → Influences **Duration** if End Time provided
- **Status Change** → Updates **Time Sheet Submitted/Approved** timestamps
- **LeadTime 3/4** → Calculated from date differences
- **Age Submit** → Days since Time Sheet Submitted

---

## 9. Status Workflow & State Management

### 9.1 Timesheet Entry Status States

```
┌─────────────────────────────────────────┐
│  Status Workflow                        │
├─────────────────────────────────────────┤
│                                         │
│  NEW (Draft)                            │
│    ↓                                    │
│  SUBMITTED (Awaiting Approval)          │
│    ↓                                    │
│  APPROVED (Ready for SAP Export)        │
│    ↓                                    │
│  SENT TO SAP (Integration Complete)     │
│                                         │
│  REJECTED ← (From any state)            │
│                                         │
└─────────────────────────────────────────┘
```

### 9.2 Status Indicators in UI
- **Approved**: Green badge ✓
- **Submitted**: Yellow badge ⧖
- **New/Draft**: Gray badge ○
- **Rejected**: Red badge ✗
- **Sent to SAP**: Blue checkmark [✓]

---

## 10. Responsive Design Considerations

### 10.1 Desktop Layout (1920px+)
- Two-column layout: 65% Main Field, 35% Activity Panel
- Full detail view with expanded related records
- All filter controls visible
- Horizontal scrolling for wide tables

### 10.2 Tablet Layout (768px - 1024px)
- Stacked columns (main field above activity panel)
- Collapsible sections to save space
- Condensed table with horizontal scroll
- Touch-friendly button sizes (48px minimum)

### 10.3 Mobile Layout (<768px)
- Single column, full-width content
- Modal dialogs for detail view
- Bottom sheet activity panel
- Simplified table with essential columns only
- Accordion-style sections

---

## 11. Accessibility Requirements

### 11.1 Keyboard Navigation
- Tab order follows logical reading sequence
- Keyboard shortcuts for common actions (S = Save, E = Edit)
- Arrow keys for table navigation
- Enter to open records
- Escape to close modals

### 11.2 Screen Reader Support
- ARIA labels on all interactive elements
- Form field descriptions
- Table header associations
- Status announcements for state changes
- Loading indicators with role="status"

### 11.3 Color Contrast
- Minimum WCAG AA contrast ratio (4.5:1 for text)
- Color-independent status indicators (icons + text)
- Focus indicators visible (minimum 2px border)
- Error messages clearly labeled

---

## 12. Performance Optimization

### 12.1 Data Loading Strategy
- **List View**: Lazy load with 20 items per page
- **Detail View**: Load on demand with caching
- **Activity Panel**: Stream updates with WebSocket
- **Search**: Debounce input (300ms delay)

### 12.2 Rendering Performance
- Virtual scrolling for tables >1000 rows
- Collapsible sections prevent DOM bloat
- CSS animations use transform/opacity (GPU-accelerated)
- Minimize layout shifts during load

---

## 13. User Workflows & Use Cases

### Use Case 1: Daily Timesheet Entry Submission
1. Mechanic completes work in Field Service Module
2. System creates new TSE in Submitted state
3. TSE appears in list with status indicator
4. Manager opens TSE detail view
5. Reviews all Related information in Related tab
6. Changes Status from Submitted → Approved
7. System triggers SAP export workflow
8. Activity panel shows approval event

### Use Case 2: Timesheet Modification & Resubmission
1. User opens TSE from list view
2. Clicks "Update Timesheet Entry"
3. Modifies Duration field inline
4. Changes Status back to Submitted
5. Activity History records change (with before/after values)
6. LeadTime values recalculate automatically
7. Notification sent to approver

### Use Case 3: Activity Tracking & Auditing
1. Manager selects timesheet entry
2. Switches to Activity panel
3. Filters for "All time" and "Status changes"
4. Views complete timeline of modifications
5. Identifies who made changes and when
6. Exports audit trail for compliance

---

## 14. Component Library Integration

### 14.1 Standard Components Used
- **Data Tables**: Sortable, filterable grid with inline actions
- **Form Fields**: Text, Date, Status dropdowns, Lookups
- **Buttons**: Primary (Save), Secondary (Cancel), Tertiary (More)
- **Badges**: Status indicators with color coding
- **Modals**: Detail view, confirmation dialogs, new record creation
- **Panels**: Side panels for related records, activity feeds
- **Accordions**: Collapsible section groups
- **Toast Notifications**: Temporary success/error messages
- **Spinners**: Loading indicators with estimated wait time

---

## 15. Data Validation Rules

### 15.1 Required Fields
- **Start Time**: Mandatory (from Field Service)
- **Service Appointment**: Required lookup
- **Status**: Defaults to "New", required for submission
- **Mechanic Name**: Auto-populated from Field Service

### 15.2 Conditional Requirements
- **End Time**: Required if Duration > 0
- **LeadTime Accurate**: Required if Status = Approved
- **Duration**: Must be >= 0 and <= 24 hours
- **Approval Date**: Auto-set on Status = Approved

### 15.3 Validation Messages
- **Duplicate Prevention**: "This entry already exists"
- **Date Validation**: "End Time must be after Start Time"
- **Range Validation**: "Duration must be between 0 and 24 hours"
- **Dependency Validation**: "Cannot approve without LeadTime values"

---

## 16. Integration Points

### 16.1 Field Service Module Integration
- **Data Source**: Mechanics submit work data in real-time
- **Auto-Population**: TSE fields automatically filled from Service Appointment
- **Status Sync**: Field Service status changes trigger TSE updates
- **Photo/Attachment Sync**: Files attached in Field Service appear in Related tab

### 16.2 SAP Integration
- **Export Trigger**: When Status = Approved, send to SAP
- **Status Tracking**: "Sent to SAP" flag prevents duplicate exports
- **Error Handling**: Failed exports show error reason in Activity panel
- **Retry Logic**: Manual retry button for failed exports

### 16.3 Approval Workflow
- **Rule Engine**: Conditional approval based on LeadTime accuracy
- **Notifications**: Email alerts when TSE requires approval
- **Escalation**: Overdue entries escalate after X days

---

## 17. Visual Design System

### 17.1 Color Palette
```
Primary Colors:
  • Brand Blue: #0066CC (buttons, links, focus)
  • Success Green: #28A745 (approved, checkmarks)
  • Warning Yellow: #FFC107 (submitted, pending)
  • Error Red: #DC3545 (rejected, errors)
  • Neutral Gray: #6C757D (disabled, secondary)

Background Colors:
  • White: #FFFFFF (main content areas)
  • Light Gray: #F8F9FA (alternate rows, disabled states)
  • Dark Gray: #343A40 (dark mode background)
```

### 17.2 Typography
```
Font Family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif

Sizes:
  • Heading 1: 28px, Bold, #000000
  • Heading 2: 20px, Bold, #000000
  • Body: 14px, Regular, #333333
  • Label: 12px, Regular, #666666
  • Small: 11px, Regular, #999999
```

### 17.3 Spacing
```
Base Unit: 8px

Padding:
  • Component padding: 16px (2 units)
  • Section padding: 24px (3 units)
  • Page padding: 32px (4 units)

Margins:
  • Element margin: 8px (1 unit)
  • Section margin: 16px (2 units)
  • Heading margin: 24px (3 units)

Gaps:
  • Row gap: 12px
  • Column gap: 16px
```

---

## 18. Implementation Checklist

- [ ] Create data model for Timesheet Entry object with required fields
- [ ] Build list view with sorting, filtering, and pagination
- [ ] Implement detail view with two-column layout
- [ ] Create Details tab with Information and System Information sections
- [ ] Create Related tab with Files, History, and Approval sections
- [ ] Build Activity panel with type-based filters
- [ ] Integrate with Field Service module for data sync
- [ ] Create status workflow engine and transitions
- [ ] Implement approval workflow logic
- [ ] Build SAP export integration
- [ ] Add validation rules and error handling
- [ ] Create notification system for approvals
- [ ] Test responsive design across devices
- [ ] Implement accessibility features (ARIA, keyboard nav)
- [ ] Add performance optimizations (lazy loading, caching)
- [ ] Create user documentation
- [ ] Conduct UAT with stakeholders
- [ ] Deploy to production with monitoring

---

## 19. Future Enhancements

- **Mobile App**: Native iOS/Android app for on-site entry
- **Bulk Operations**: Multi-select approval for batch processing
- **Advanced Reporting**: Dashboard with metrics on approval times, rejection rates
- **API Access**: RESTful API for third-party integrations
- **OCR Integration**: Automatic time entry from receipt photos
- **Geolocation**: Track mechanic location during work
- **Offline Mode**: Work without internet, sync when online
- **AI Assistance**: Predictive field suggestions based on history
- **Custom Fields**: Allow orgs to add domain-specific fields
- **Webhook Support**: Real-time event notifications to external systems

---

**Document Version**: 1.0  
**Last Updated**: May 28, 2026  
**Author**: System Design Team  
**Status**: Final Design Documentation
