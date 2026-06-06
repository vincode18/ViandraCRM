# Service Appointment Module - UI Design & Layout Document
## Related Tab & Details Tab Display Specifications

---

## 📋 Table of Contents

- [Overview](#overview)
- [Module Structure](#module-structure)
- [Header Section](#header-section)
- [Navigation & Tabs](#navigation--tabs)
- [Details Tab](#details-tab)
- [Related Tab](#related-tab)
- [Data Grid Layouts](#data-grid-layouts)
- [Related Records Sections](#related-records-sections)
- [Field Specifications](#field-specifications)
- [Component Styling](#component-styling)
- [Interactions & Behaviors](#interactions--behaviors)
- [Responsive Design](#responsive-design)

---

## Overview

### Purpose
The Service Appointment Module displays comprehensive service appointment information with two primary tabs: Details (containing appointment specifications and scheduling) and Related (showing linked work orders, notes, attachments, history, and resources).

### Key Objectives
- Display service appointment details in organized, hierarchical sections
- Show relationships between Service Appointments and related records
- Enable inline editing for specific fields
- Provide quick access to linked documents and resources
- Support service scheduling and resource allocation workflows
- Maintain professional, audit-trail documentation

### Target Users
- Service Technicians
- Service Managers
- Dispatch/Scheduling Officers
- Equipment Owners/Operators
- Crew Leaders

### Scope
- Service Appointment SA-2083611
- Two-tab interface (Details | Related)
- Expandable sections with field-level specifications
- Related document linking system
- Activity tracking and history

---

## Module Structure

### Overall Layout Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│  Top Navigation Bar (Salesforce/UT Service Console)                 │
├─────────────────────────────────────────────────────────────────────┤
│  Service Appointment Header: SA-2083611 + Action Buttons            │
│  Owner: UT Integration | Account: PUTRA PERKASA ABADI | Status...   │
├─────────────────────────────────────────────────────────────────────┤
│  Tab Navigation: Details (ACTIVE) | Related                         │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────┬─────────────────────────────────┐ │
│  │                              │                                 │ │
│  │   MAIN CONTENT AREA          │   ACTIVITY PANEL                │ │
│  │   (Left Column 65%)          │   (Right Column 35%)            │ │
│  │                              │                                 │ │
│  │  Expandable Sections:        │   Activity Feed                 │ │
│  │  • General Information       │   • Upcoming & Overdue          │ │
│  │  • Scheduled Times           │   • Show All Activities Button  │ │
│  │  • Actual Times              │                                 │ │
│  │  • Custom Fields             │   Chatter Integration:          │ │
│  │  • Related Tabs              │   • Comments                    │ │
│  │                              │   • @mentions                   │ │
│  │  [Scrollable Content]        │   • File attachments            │ │
│  │                              │                                 │ │
│  └──────────────────────────────┴─────────────────────────────────┘ │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Grid System

```
Total Width:              100% of viewport (minus left sidebar)
Left Sidebar:             280px (UT Service Console menu)
Main Content:             Remaining width
Left Column:              65% of main content
Right Panel (Activity):    35% of main content
Gutter Between:           24px
Container Max-Width:      1600px
Padding (Content):        16px - 24px
```

---

## Header Section

### Service Appointment Title Bar

```
Height:                 Dual-level header (64px main + 48px info bar)
Background:             #FFFFFF
Border-bottom:          1px solid #E0E0E0
Sticky:                 Yes (stays at top when scrolling)
Z-Index:                50
Padding:                16px 24px

Level 1 - Main Header (64px):
┌──────────────────────────────────────────────────────────────────┐
│ [Icon] Service Appointment    SA-2083611        [Follow] [Actions]│
└──────────────────────────────────────────────────────────────────┘

Level 2 - Info Bar (48px):
┌──────────────────────────────────────────────────────────────────┐
│ Owner: UT Integration  | Account: PUTRA PERKASA ABADI             │
│ Parent Record: 01254508 | Work Type: R2SG030A | Status: ...       │
│ Arrival Window Start: [Date/Time]                                 │
└──────────────────────────────────────────────────────────────────┘
```

### Icon & Title Section

```
Icon:
├── Background: Linear gradient (#4A90E2 to #357ABD)
├── Size: 48x48px
├── Border-radius: 4px
├── Icon: 📅 (calendar/appointment icon, white)
└── Box-shadow: 0 2px 4px rgba(0,0,0,0.1)

Text Section:
├── Label: "Service Appointment" (font-size: 12px, color: #757575, uppercase)
├── Title: "SA-2083611" (font-size: 24px, font-weight: 700, color: #212121)
└── Spacing: 12px gap between icon and text

Action Buttons (Right side):
├── [ Follow ] - Secondary button
├── [ Change Status ] - Primary button
├── [ New Note ] - Secondary button
├── [ New Contact ] - Secondary button
└── [ More ▼ ] - Dropdown menu (secondary)

Button Styling:
├── Padding: 8px 16px
├── Font-size: 13px
├── Font-weight: 500
├── Border-radius: 4px
├── Gap between: 8px
└── Transitions: all 0.2s ease
```

### Info Bar Content

```
Layout:                 Grid layout with 5 sections
Background:             #F5F5F5 (light grey)
Border-top:             1px solid #E0E0E0
Border-bottom:          1px solid #E0E0E0
Padding:                12px 24px

Sections (Left to Right):

1️⃣ Owner:
   ├── Label: "Owner"
   ├── Icon: 👤 (user icon)
   ├── Value: "UT Integration" (clickable link, #1976D2)
   └── Indicator: "Certified" badge (if applicable)

2️⃣ Account:
   ├── Label: "Account"
   ├── Icon: 🏢 (company icon)
   ├── Value: "PUTRA PERKASA ABADI" (clickable link)
   └── Spacing: 24px from previous

3️⃣ Parent Record:
   ├── Label: "Parent Record"
   ├── Icon: 📦 (work order icon)
   ├── Value: "01254508" (clickable link)
   └── Type: Work Order indicator

4️⃣ Work Type:
   ├── Label: "Work Type"
   ├── Icon: 🔧 (tools icon)
   ├── Value: "R2SG030A" (text or dropdown)
   └── Badge: Work type category

5️⃣ Status:
   ├── Label: "Status"
   ├── Icon: ⭕ (status circle)
   ├── Value: "Post Activity Mech" (status badge)
   ├── Color: Status-based (green for completed, etc.)
   └── Tooltip: Status description on hover

Info Bar Styling:
├── Font-size: 13px (labels), 14px (values)
├── Font-weight: 500 (labels), 600 (values)
├── Color: #757575 (labels), #212121 (values)
├── Line-height: 1.4
└── Responsive: Stack vertically on mobile
```

---

## Navigation & Tabs

### Tab Bar Structure

```
Position:               Below Service Appointment Header
Height:                 48px
Background:             #FFFFFF
Border-bottom:          2px solid #E0E0E0
Sticky:                 Yes
Z-Index:                40
Padding:                0px (full width)

Tab Items (Left to Right):
├── Details (icon: 📋) ← ACTIVE
└── Related (icon: 📎)

Tab Styling:
├── Inactive Tab:
│   ├── Color: #757575 (Light grey)
│   ├── Background: Transparent
│   ├── Border-bottom: 2px transparent
│   ├── Font-weight: 500
│   ├── Font-size: 14px
│   ├── Padding: 12px 16px
│   └── Cursor: Pointer
│
├── Active Tab (Details):
│   ├── Color: #1976D2 (Blue)
│   ├── Background: Transparent
│   ├── Border-bottom: 2px solid #1976D2
│   ├── Font-weight: 600
│   ├── Font-size: 14px
│   ├── Padding: 12px 16px
│   └── Box-shadow: 0 2px 8px rgba(0,0,0,0.08)
│
└── Hover Tab:
    ├── Color: #1976D2
    ├── Border-bottom: 1px dashed #1976D2
    └── Background: Rgba(25,118,210,0.04)

Tab Indicators:
├── Icon before text (12px gap)
├── Text label
└── Optional notification badge
```

---

## Details Tab

### Tab Content Overview

The Details tab contains comprehensive service appointment information organized in expandable sections.

### Section 1: General Information

**Expanded by Default**: Yes

```
Section Header:     GENERAL INFORMATION (with chevron indicator)
Background:         #FAFAFA (light grey header)
Border:             1px solid #E0E0E0
Border-radius:      4px

Field Layout:       2-column grid
Column 1 Width:     45% (field labels & values)
Column 2 Width:     45% (field labels & values)
Gap:                12px horizontal, 12px vertical

Fields (Left Column):
├── Appointment Number
│   ├── Label: "Appointment Number"
│   ├── Value: "SA-2083611" (read-only)
│   ├── Type: Text (monospace)
│   └── Copy Icon: Available

├── Account
│   ├── Label: "Account"
│   ├── Value: "PUTRA PERKASA ABADI" (link)
│   ├── Type: Lookup reference
│   └── Icon: External link

├── Contact
│   ├── Label: "Contact"
│   ├── Value: "[Name]" (link)
│   ├── Type: Lookup (editable with pencil icon)
│   ├── Phone: Clickable phone number
│   └── Edit Mode: Inline picker

├── Parent Record
│   ├── Label: "Parent Record"
│   ├── Value: "01254508" (link, blue)
│   ├── Type: Work Order reference
│   └── Icon: Work order badge

├── Service Territory
│   ├── Label: "Service Territory"
│   ├── Value: "Tanjung Enim PPA ST" (link)
│   ├── Type: Lookup reference
│   └── Icon: Location marker

├── Subject
│   ├── Label: "Subject"
│   ├── Value: "GD825A-2-13405-GD-829-OVH-GD829 R&i STEERING VALVE"
│   ├── Type: Text area (editable)
│   ├── Word-wrap: Yes
│   └── Max length: 500 characters

└── Description
    ├── Label: "Description"
    ├── Value: "GD829 R&I STEERING VALVE"
    ├── Type: Rich text area (editable)
    ├── Formatting: Supports markdown
    └── Max length: 1000 characters

Fields (Right Column):
├── Work Type
│   ├── Label: "Work Type"
│   ├── Value: "R2SG030A" (editable)
│   ├── Type: Dropdown selector
│   └── Options: List of work types

├── Waiting Reason
│   ├── Label: "Waiting Reason"
│   ├── Value: "[Reason]" (editable)
│   ├── Type: Dropdown/Picklist
│   └── Required: Only if status is waiting

├── Travelling Delay Reason
│   ├── Label: "Travelling Delay Reason"
│   ├── Value: "[Reason]" (editable)
│   ├── Type: Text (optional)
│   └── Max length: 255 characters

├── In Progress Delay Reason
│   ├── Label: "In Progress Delay Reason"
│   ├── Value: "[Reason]" (editable)
│   ├── Type: Text (optional)
│   └── Max length: 255 characters

├── Cannot Completed Last Position
│   ├── Label: "Cannot Completed Last Position"
│   ├── Value: "[Reason]" (editable)
│   ├── Type: Text area
│   └── Max length: 255 characters

├── Case
│   ├── Label: "Case"
│   ├── Value: "01532785" (link, blue)
│   ├── Type: Lookup reference
│   └── Icon: Case badge

└── Dispatch Done
    ├── Label: "Dispatch Done"
    ├── Value: ✓ (checkmark icon, green)
    ├── Type: Checkbox (boolean)
    ├── Checked: Yes
    └── State: Read-only display with edit icon
```

### Section 2: Scheduled Times

**Expanded by Default**: Yes

```
Section Header:     SCHEDULED TIMES
Background:         #FAFAFA
Border:             1px solid #E0E0E0

Field Layout:       2-column grid (same as General Information)

Fields (Left Column):
├── Arrival Window Start
│   ├── Label: "Arrival Window Start"
│   ├── Value: "30/04/2026, 13:27" (editable)
│   ├── Type: Date/Time picker
│   ├── Format: DD/MM/YYYY, HH:MM
│   └── Icon: Calendar/clock icon

└── Scheduled Start
    ├── Label: "Scheduled Start"
    ├── Value: "30/04/2026, 13:27" (editable)
    ├── Type: Date/Time picker
    └── Format: DD/MM/YYYY, HH:MM

Fields (Right Column):
├── Arrival Window End
│   ├── Label: "Arrival Window End"
│   ├── Value: "[Date/Time]" (editable)
│   ├── Type: Date/Time picker
│   └── Validation: Must be > Start date

└── Scheduled End
    ├── Label: "Scheduled End"
    ├── Value: "30/04/2026, 18:03" (editable)
    ├── Type: Date/Time picker
    └── Validation: Must be > Scheduled Start

Time Display:
├── Font-family: Monospace (for time alignment)
├── Format: 24-hour format
├── Timezone: Auto-detected from user
└── Highlight: Upcoming appointments highlighted
```

### Section 3: Actual Times

**Expanded by Default**: Yes (collapsible)

```
Section Header:     ACTUAL TIMES
Background:         #FAFAFA
Border:             1px solid #E0E0E0

Field Layout:       2-column grid

Fields (Left Column):
├── Actual Travel Date
│   ├── Label: "Actual Travel Date"
│   ├── Value: "30/04/2026, 13:05" (editable)
│   ├── Type: Date/Time (read-only until completed)
│   └── Icon: Lock icon if read-only

├── Actual In Progress Date
│   ├── Label: "Actual In Progress Date"
│   ├── Value: "30/04/2026, 13:22" (editable)
│   ├── Type: Date/Time
│   └── Info: Automatically set when status changes

└── Actual Post Activity Mech
    ├── Label: "Actual Post Activity Mech"
    ├── Value: "01/05/2026, 07:13" (editable)
    ├── Type: Date/Time
    └── Status: Post-activity timestamp

Fields (Right Column):
├── Actual Dispatched Date
│   ├── Label: "Actual Dispatched Date"
│   ├── Value: "30/04/2026, 13:03" (editable)
│   ├── Type: Date/Time
│   └── System: Auto-populated

├── Actual Completed Date
│   ├── Label: "Actual Completed Date"
│   ├── Value: "01/05/2026, 07:11" (editable)
│   ├── Type: Date/Time
│   └── Status: Locked when completed

└── [Additional fields as configured]

Timestamp Styling:
├── Color: Green (#4CAF50) if completed
├── Color: Blue (#2196F3) if in progress
├── Color: Orange (#FF9800) if scheduled
└── Font: Monospace, 13px
```

### Section 4: Additional Fields & Accuracy

**Expanded by Default**: No (collapsible)

```
Section Header:     ADDITIONAL FIELDS & ACCURACY
Background:         #FAFAFA
Border:             1px solid #E0E0E0

Fields:
├── Earliest Start Permitted
│   ├── Label: "Earliest Start Permitted"
│   ├── Value: "27/04/2026, 09:45" (editable)
│   ├── Type: Date/Time picker
│   └── Purpose: Scheduling constraint

├── Pinned
│   ├── Label: "Pinned"
│   ├── Value: ✓ (checkbox, checked)
│   ├── Type: Boolean toggle
│   └── Purpose: Keep appointment fixed in schedule

├── Unit Model
│   ├── Label: "Unit Model"
│   ├── Value: "GD825A-2" (read-only)
│   ├── Type: Text reference
│   └── Source: From work order

├── Parent Record Type
│   ├── Label: "Parent Record Type"
│   ├── Value: "WorkOrder" (read-only)
│   ├── Type: Text (system)
│   └── Accuracy: SA (Staging Accuracy)

├── Status Category
│   ├── Label: "Status Category"
│   ├── Value: "Completed" (status badge, green)
│   ├── Type: Read-only badge
│   └── Color-coded: By completion status

├── Accuracy SA (Staging Accuracy)
│   ├── Label: "Accuracy SA"
│   ├── Value: "[Accuracy %]" (editable)
│   ├── Type: Percentage field
│   └── Range: 0-100%

├── Accuracy Dispatch
│   ├── Label: "Accuracy Dispatch"
│   ├── Value: ✓ (checkbox)
│   ├── Type: Boolean
│   └── Purpose: Dispatch accuracy indicator

├── Crew Leader
│   ├── Label: "Crew Leader"
│   ├── Value: "SHIDIK AL-IKHSAN" (link)
│   ├── Type: Lookup reference
│   └── Role: Person managing the crew

└── Address
    ├── Label: "Address"
    ├── Value: "[Address text]" (editable)
    ├── Type: Text area
    ├── Max length: 500 characters
    └── Map integration: Click to view on map
```

---

## Related Tab

### Tab Overview

The Related tab displays all linked records and documents associated with the service appointment, including notes, attachments, files, history, approvals, resources, reports, and time sheet entries.

### Tab Structure Overview

```
Layout:                 Single column (full width)
Background:             #FAFAFA
Sections:               8-10 expandable sections
Scroll:                 Vertical, independent scrolling
Performance:            Lazy-load sections on expand

Section Categories:
1. Notes & Attachments (0 items)
2. Files (0 items)
3. Notes (0 items)
4. Service Appointment History (6+ items)
5. Approval History (0 items)
6. Assigned Resources (2 items)
7. Service Reports (0 items)
8. Time Sheet Entries (5 items)
9. Service Appointments Extension (0 items)
```

### Section 1: Notes & Attachments

**Expanded by Default**: Yes

```
Section Header:
┌──────────────────────────────────────────────────┐
│ 📎 Notes & Attachments (0)        [Upload Files] │
├──────────────────────────────────────────────────┤

Empty State Display:
┌────────────────────────────────────────────────┐
│                                                │
│           📁 Drag files here or               │
│           [↓ Upload Files]                    │
│           Or drop files                       │
│                                                │
└────────────────────────────────────────────────┘

File Upload Zone:
├── Background: #F5F5F5 (light grey)
├── Border: 2px dashed #BDBDBD
├── Border-radius: 8px
├── Min-height: 120px
├── Drag-over: Background #E3F2FD, border #1976D2
├── Drop: Auto-upload files
└── Accepted: All file types

When Files Present:
├── File List: Display in table format
├── Columns: Filename | Size | Upload Date | Actions
├── Actions: View | Download | Delete
└── Total Size: Display aggregate
```

### Section 2: Files

**Expanded by Default**: Yes

```
Section Header:
┌──────────────────────────────────────────────────┐
│ 📄 Files (0)                        [Add Files]  │
├──────────────────────────────────────────────────┤

Empty State Display:
┌────────────────────────────────────────────────┐
│                                                │
│           📁 Drag files here or               │
│           [↓ Upload Files]                    │
│           Or drop files                       │
│                                                │
└────────────────────────────────────────────────┘

File Properties (When Files Added):
├── Name: Filename with extension
├── Upload Date: DD/MM/YYYY, HH:MM
├── Uploaded By: User name (link)
├── File Size: Human-readable format (2.4 MB)
├── Type: File type badge
└── Preview: Thumbnail for images
```

### Section 3: Notes

**Expanded by Default**: Yes

```
Section Header:
┌──────────────────────────────────────────────────┐
│ 📝 Notes (0)                        [New]        │
├──────────────────────────────────────────────────┤

Empty State:
"No notes yet. Add one to get started."

Note Entry Structure (When Notes Exist):
├── Entry 1:
│   ├── Date: 01/05/2026, 07:13
│   ├── Author: SHIDIK AL-IKHSAN (link)
│   ├── Title: [Note title if present]
│   ├── Content: [Note text, expandable]
│   └── Actions: Edit | Delete | Reply

Note Styling:
├── Background: #FFFFFF
├── Border: 1px solid #E0E0E0
├── Border-radius: 4px
├── Padding: 12px
├── Margin-bottom: 8px
├── Hover: Box-shadow 0 2px 8px rgba(0,0,0,0.08)

Content Area:
├── Rich text support: Bold, italic, lists, links
├── Max length: 5000 characters
├── Word-wrap: Enabled
└── Timestamps: Show creation & last edit
```

### Section 4: Service Appointment History

**Expanded by Default**: Yes

```
Section Header:
┌──────────────────────────────────────────────────┐
│ 📋 Service Appointment History (6+)              │
├──────────────────────────────────────────────────┤

Table Layout:
┌───────────────┬───────────────────┬──────────────┬────────────────┬──────────────────┐
│ Date          │ Field             │ User         │ Original Value │ New Value        │
├───────────────┼───────────────────┼──────────────┼────────────────┼──────────────────┤
│ 01/05/2026,   │ Status            │ SHIDIK       │ Completed      │ Post Activity    │
│ 07:13         │                   │ AL-IKHSAN    │                │ Mech             │
├───────────────┼───────────────────┼──────────────┼────────────────┼──────────────────┤
│ 01/05/2026,   │ Actual Post       │ SHIDIK       │                │ 01/05/2026,      │
│ 07:13         │ Activity Mech     │ AL-IKHSAN    │                │ 07:13            │
├───────────────┼───────────────────┼──────────────┼────────────────┼──────────────────┤
│ 01/05/2026,   │ Status            │ SHIDIK       │ In Progress    │ Completed        │
│ 07:11         │                   │ AL-IKHSAN    │                │                  │
├───────────────┼───────────────────┼──────────────┼────────────────┼──────────────────┤
│ 01/05/2026,   │ Actual Completed  │ SHIDIK       │                │ 01/05/2026,      │
│ 07:11         │ Date              │ AL-IKHSAN    │                │ 07:11            │
├───────────────┼───────────────────┼──────────────┼────────────────┼──────────────────┤
│ [More entries...]                                                                      │
└───────────────┴───────────────────┴──────────────┴────────────────┴──────────────────┘

Table Styling:
├── Header: Bold, background #FAFAFA
├── Rows: Alternating white/light grey background
├── Borders: 1px solid #E0E0E0
├── Padding: 12px per cell
├── Font-size: 13px
├── User column: Clickable links (blue)
├── Value columns: Monospace for data
└── Hover: Row background highlights

Pagination:
├── Display: Last 10 entries by default
├── [View All] link: Shows complete history
├── Load more: Pagination or infinite scroll
└── Sort: Newest first (descending by date)
```

### Section 5: Approval History

**Expanded by Default**: No

```
Section Header:
┌──────────────────────────────────────────────────┐
│ ✅ Approval History (0)                          │
├──────────────────────────────────────────────────┤

Empty State:
"No approvals required or pending."

When Approvals Present:
├── Approval 1:
│   ├── Approver: [Name] (link)
│   ├── Status: Approved/Rejected/Pending
│   ├── Date: DD/MM/YYYY, HH:MM
│   ├── Comments: [Optional approval notes]
│   └── Badge: Color-coded (green=approved, red=rejected)

Approval Item Styling:
├── Background: #FFFFFF
├── Border-left: 4px solid [status-color]
├── Padding: 12px
├── Margin-bottom: 8px
└── Status colors:
    ├── Approved: Green (#4CAF50)
    ├── Rejected: Red (#FF5252)
    └── Pending: Orange (#FF9800)
```

### Section 6: Assigned Resources

**Expanded by Default**: Yes

```
Section Header:
┌──────────────────────────────────────────────────┐
│ 👥 Assigned Resources (2)                        │
├──────────────────────────────────────────────────┤

Table Layout:
┌──────────────────────────────┬──────────────────────────────┬──────────────────────────────┬──────────────────┐
│ Assigned Resource Number     │ Service Resource             │ Assigned Resource ID         │ Service Crew     │
├──────────────────────────────┼──────────────────────────────┼──────────────────────────────┼──────────────────┤
│ AR-2899928 (link)           │ PUMA 2 (link)                │ 03/Mg0000AiYbNiAV           │ PUMA 2           │
├──────────────────────────────┼──────────────────────────────┼──────────────────────────────┼──────────────────┤
│ AR-2899929 (link)           │ SHIDIK AL-IKHSAN (link)      │ 03/Mg0000AiYbNiAV           │ PUMA 2           │
└──────────────────────────────┴──────────────────────────────┴──────────────────────────────┴──────────────────┘

Resource Row Styling:
├── Background: #FFFFFF
├── Border: 1px solid #E0E0E0
├── Padding: 12px
├── Links: Blue (#1976D2), clickable
├── Resource Name: Highlighted with resource avatar/badge
└── Crew: Shows assigned service crew

Resource Information:
├── Resource ID: Unique identifier (can expand for details)
├── Type: Equipment / Person / Vehicle
├── Status: Available / Assigned / Unavailable
├── Availability: Hours/shift information
└── Contact: Click for contact info
```

### Section 7: Service Reports

**Expanded by Default**: No

```
Section Header:
┌──────────────────────────────────────────────────┐
│ 📊 Service Reports (0)                           │
├──────────────────────────────────────────────────┤

Empty State:
"No service reports generated yet."

When Reports Present:
├── Report 1:
│   ├── Report Name: [Name]
│   ├── Generated: DD/MM/YYYY, HH:MM
│   ├── Generated By: [User name]
│   ├── Type: Service Report / Work Summary / etc.
│   ├── Preview: [Link to view/download]
│   └── Actions: View | Download | Delete

Report Item Styling:
├── Background: #FFFFFF
├── Border: 1px solid #E0E0E0
├── Border-left: 4px solid #2196F3
├── Padding: 12px
├── Icon: 📄 (document icon)
└── Date: Small, grey text (#757575)
```

### Section 8: Time Sheet Entries

**Expanded by Default**: Yes

```
Section Header:
┌──────────────────────────────────────────────────┐
│ ⏱️ Time Sheet Entries (5)              [New]    │
├──────────────────────────────────────────────────┤

Table Layout:
┌──────────────────┬──────────────────┬──────────────────┬──────────────────┐
│ Name             │ Time Sheet       │ Mechanic Name    │ Last Modified    │
├──────────────────┼──────────────────┼──────────────────┼──────────────────┤
│ TSE-0005 (link)  │ TST-2569917      │ SHIDIK           │ 08/05/2026,      │
│                  │ (link)           │ AL-IKHSAN        │ 13:42            │
├──────────────────┼──────────────────┼──────────────────┼──────────────────┤
│ TSE-0006 (link)  │ TST-2569917      │ SHIDIK           │ 08/05/2026,      │
│                  │ (link)           │ AL-IKHSAN        │ 13:42            │
├──────────────────┼──────────────────┼──────────────────┼──────────────────┤
│ TSE-0007 (link)  │ TST-2569917      │ SHIDIK           │ 08/05/2026,      │
│                  │ (link)           │ AL-IKHSAN        │ 13:42            │
├──────────────────┼──────────────────┼──────────────────┼──────────────────┤
│ TSE-0008 (link)  │ TST-2569917      │ SHIDIK           │ 08/05/2026,      │
│                  │ (link)           │ AL-IKHSAN        │ 13:42            │
├──────────────────┼──────────────────┼──────────────────┼──────────────────┤
│ TSE-0009 (link)  │ TST-2569917      │ SHIDIK           │ 08/05/2026,      │
│                  │ (link)           │ AL-IKHSAN        │ 13:42            │
└──────────────────┴──────────────────┴──────────────────┴──────────────────┘

Table Styling:
├── Header: Bold, background #FAFAFA, uppercase
├── Rows: Alternating backgrounds (white/#FAFAFA)
├── Borders: 1px solid #E0E0E0
├── Padding: 12px per cell
├── Links: Blue (#1976D2), underline on hover
├── Last Modified: Small grey text, monospace
└── Hover: Row background highlights, cursor pointer

Time Entry Actions:
├── Click entry name: View time sheet details
├── Edit: Pencil icon appears on hover (if permission)
├── Delete: Trash icon appears on hover (if permission)
└── Expand: Click row for full details

Pagination:
├── Display: All 5 entries shown
├── [View All] link: If more than 5 exist
└── [New] button: Create new time sheet entry
```

### Section 9: Service Appointments Extension

**Expanded by Default**: No

```
Section Header:
┌──────────────────────────────────────────────────┐
│ 📅 Service Appointments Extension (0)    [New]  │
├──────────────────────────────────────────────────┤

Empty State:
"No extensions scheduled for this appointment."

When Extensions Present:
├── Extension 1:
│   ├── Extension ID: [ID] (link)
│   ├── Original Appointment: [Link]
│   ├── Reason: [Reason text]
│   ├── New Scheduled Date: DD/MM/YYYY, HH:MM
│   ├── Status: Approved / Pending / Rejected
│   └── Created: DD/MM/YYYY by [User]

Extension Item Styling:
├── Background: #FFFFFF
├── Border: 1px solid #E0E0E0
├── Border-left: 4px solid #FF9800 (extension color)
├── Padding: 12px
├── Margin-bottom: 8px
└── Status badge: Color-coded
```

---

## Data Grid Layouts

### General Information Grid

```
Grid Properties:
├── Grid-template-columns: repeat(2, 1fr)
├── Gap: 16px horizontal, 12px vertical
├── Padding: 16px
├── Background: #FFFFFF
├── Border: 1px solid #E0E0E0
├── Border-radius: 4px

Per Field Row:
├── Label Column: 40% width
│   ├── Font-size: 13px
│   ├── Font-weight: 600
│   ├── Color: #424242
│   ├── Text-transform: Uppercase
│   ├── Letter-spacing: 0.5px
│   └── Line-height: 1.2
│
└── Value Column: 60% width
    ├── Font-size: 14px
    ├── Font-weight: 400
    ├── Color: #212121
    ├── Word-break: Break-word
    ├── Line-height: 1.5
    └── Min-height: 24px

Link Styling (in values):
├── Color: #1976D2
├── Text-decoration: None
├── Underline: On hover
├── Cursor: Pointer
└── Icon: External link (optional)

Editable Field Styling:
├── Background: #FAFAFA
├── Border: 1px solid #E0E0E0
├── Border-radius: 4px
├── Padding: 8px 12px
├── Focus: Border #1976D2, box-shadow
└── Edit Icon: ✏️ on hover
```

### History & Related Records Tables

```
Table Properties:
├── Width: 100% (full container width)
├── Border-collapse: Collapse
├── Background: #FFFFFF
├── Border: 1px solid #E0E0E0

Table Header:
├── Background: #FAFAFA
├── Border-bottom: 2px solid #E0E0E0
├── Padding: 12px per cell
├── Font-size: 13px
├── Font-weight: 600
├── Color: #212121
├── Text-transform: Capitalize
└── Text-align: Left

Table Body Rows:
├── Background (odd rows): #FFFFFF
├── Background (even rows): #F5F5F5 (optional striping)
├── Border-bottom: 1px solid #E0E0E0
├── Padding: 12px per cell
├── Font-size: 13px
├── Font-weight: 400
├── Color: #212121
└── Hover: Background #F0F0F0, cursor pointer

Table Cells:
├── Min-height: 44px (touch-friendly)
├── Vertical-align: Middle
├── Text-align: Left (default)
├── Links: #1976D2, underline on hover
├── Timestamps: Monospace, grey text
└── Status: Color-coded badges
```

---

## Related Records Sections

### Expandable Section Header Pattern

```
Header Structure:
┌────────────────────────────────────────────────────────┐
│ [Icon] Section Title (Count)        [▼] [Action Btn]  │
└────────────────────────────────────────────────────────┘

Components:

1️⃣ Icon:
   ├── Width: 24px, Height: 24px
   ├── Color: Varies by section (see color mapping below)
   └── Emoji or SVG icon

2️⃣ Section Title:
   ├── Font-size: 14px
   ├── Font-weight: 600
   ├── Color: #212121
   ├── Text: Descriptive title

3️⃣ Count Badge:
   ├── Format: "(X)" or "(X+)" if more
   ├── Font-size: 13px
   ├── Color: #757575
   ├── Display: Always visible
   └── Updates: Real-time count

4️⃣ Chevron (Expand/Collapse):
   ├── Initial: ▼ (down, expanded)
   ├── Collapsed: ▶ (right, 90° rotation)
   ├── Transition: transform 0.3s ease
   └── Cursor: Pointer

5️⃣ Action Button:
   ├── Label: "Upload Files", "Add Files", "New", etc.
   ├── Type: Secondary button
   ├── Size: Small (padding: 6px 12px)
   ├── Display: Right-aligned
   └── Visibility: Always visible (or on hover)

Header Styling:
├── Background: #FAFAFA
├── Border: 1px solid #E0E0E0
├── Border-radius: 4px (top only if expanded)
├── Padding: 12px 16px
├── Margin-bottom: 12px
├── Cursor: Pointer
├── Hover: Background #F0F0F0
└── Font-weight (title): 600

Icon Color Mapping:
├── Notes & Attachments: #9C27B0 (Purple)
├── Files: #2196F3 (Blue)
├── Notes: #FF9800 (Orange)
├── History: #4CAF50 (Green)
├── Approvals: #1976D2 (Blue)
├── Resources: #FF5252 (Red)
├── Reports: #00BCD4 (Cyan)
└── Time Sheets: #673AB7 (Deep Purple)
```

### Content Area Expansion

```
Expansion Animation:
├── Trigger: Click on header
├── Duration: 0.3s
├── Easing: cubic-bezier(0.4, 0, 0.2, 1)
├── Property: max-height, opacity
├── Initial: max-height: 0, opacity: 0
└── Final: max-height: auto, opacity: 1

Content Display:
├── Background: #FFFFFF
├── Padding: 16px
├── Border: 1px solid #E0E0E0
├── Border-radius: 4px (bottom only)
├── Overflow: Auto (if scrollable)
└── Max-height: 600px (then scrollable)

Empty State Display (when no items):
├── Message: "No items yet."
├── Font-size: 14px
├── Color: #757575
├── Padding: 24px
├── Text-align: Center
└── Icon: Optional (⭕, 📭, etc.)

Loading State:
├── Skeleton loaders: Grey placeholder boxes
├── Pulse animation: Subtle loading effect
├── Duration: Until content loads
└── Fade-in: Smooth transition to content
```

---

## Field Specifications

### Data Types & Validation

#### Text Fields

```
Type:                   String
Max Length:             255 characters (unless specified)
Validation:             No special characters required
Formatting:             Left-aligned, word-wrap enabled
Edit Mode:              Inline edit (click to activate)
Save Trigger:           On blur (field loses focus)

Example Fields:
├── Appointment Number: "SA-2083611" (read-only)
├── Subject: "GD825A-2-13405..." (editable, 500 char max)
└── Description: "GD829 R&I STEERING VALVE" (editable)
```

#### Date/Time Fields

```
Type:                   Date + Time
Format:                 DD/MM/YYYY, HH:MM (24-hour)
Timezone:               User-specific (auto-detected)
Picker Type:            Calendar + Time selector
Validation:             Must be valid date/time
Edit Mode:              Click to open date/time picker

Example Fields:
├── Arrival Window Start: "30/04/2026, 13:27"
├── Scheduled Start: "30/04/2026, 13:27"
├── Scheduled End: "30/04/2026, 18:03"
└── Actual Travel Date: "30/04/2026, 13:05"
```

#### Lookup Fields

```
Type:                   Reference to another record
Display:                Record name + icon
Color:                  #1976D2 (blue, clickable)
Action:                 Click to navigate to record
Edit Mode:              Click to open picker/search
Search:                 Searchable by name/number

Example Fields:
├── Account: "PUTRA PERKASA ABADI" (company link)
├── Parent Record: "01254508" (work order link)
├── Service Territory: "Tanjung Enim PPA ST" (location link)
├── Case: "01532785" (case link)
└── Crew Leader: "SHIDIK AL-IKHSAN" (person link)
```

#### Dropdown/Picklist Fields

```
Type:                   Single select from predefined list
Display:                Selected value only
Edit Mode:              Click to open dropdown menu
Options:                Scrollable list
Search:                 Type to filter options

Example Fields:
├── Work Type: "R2SG030A" (editable dropdown)
├── Waiting Reason: "[Reason]" (picklist)
└── Status: "Post Activity Mech" (status badge)
```

#### Boolean/Checkbox Fields

```
Type:                   True/False or Yes/No
Display:                Checkbox icon or checkmark
States:                 Checked (✓) / Unchecked ( )
Color (checked):        Green (#4CAF50)
Edit Mode:              Click checkbox to toggle

Example Fields:
├── Dispatch Done: ✓ (checked, read-only display)
├── Pinned: ✓ (checkbox)
└── Accuracy Dispatch: ✓ (checkbox)
```

#### Status Badge Fields

```
Type:                   Fixed status value
Display:                Colored badge
Read-only:              Cannot edit directly
Color Codes:
├── Completed: Green (#4CAF50)
├── In Progress: Blue (#2196F3)
├── Post Activity: Orange (#FF9800)
├── Pending: Yellow (#FFC107)
└── Cancelled: Red (#FF5252)

Badge Styling:
├── Background: Status color (light variant)
├── Text: Status color (dark variant)
├── Padding: 4px 12px
├── Border-radius: 12px
├── Font-weight: 600
└── Font-size: 12px
```

---

## Component Styling

### Color System

```
Primary Brand Colors:
├── Brand Blue: #1976D2
├── Dark Blue: #1565C0 (hover)
└── Light Blue: #E3F2FD (background)

Status Colors:
├── Completed/Success: #4CAF50
├── In Progress/Active: #2196F3
├── Pending/Warning: #FFC107
├── Error/Danger: #FF5252
└── Neutral: #757575

Background Colors:
├── Primary: #FFFFFF (white)
├── Secondary: #FAFAFA (off-white)
├── Tertiary: #F5F5F5 (light grey)
├── Hover: #EEEEEE (lighter grey)
└── Header: #F5F5F5 (form header)

Text Colors:
├── Primary: #212121 (very dark grey)
├── Secondary: #424242 (dark grey)
├── Tertiary: #757575 (medium grey)
├── Disabled: #BDBDBD (light grey)
└── Link: #1976D2 (blue)

Border/Divider Colors:
├── Primary: #E0E0E0 (light grey)
├── Hover: #BDBDBD (darker grey)
├── Focus: #1976D2 (blue)
└── Disabled: #EEEEEE (very light)

Shadow System:
├── None: 0
├── Subtle: 0 1px 3px rgba(0,0,0,0.06)
├── Light: 0 2px 8px rgba(0,0,0,0.08)
├── Medium: 0 4px 12px rgba(0,0,0,0.12)
└── Strong: 0 8px 24px rgba(0,0,0,0.16)
```

### Typography

```
Font Family:            -apple-system, BlinkMacSystemFont, Segoe UI,
                       Roboto, Oxygen, Ubuntu, Cantarell, sans-serif

Font Sizes:
├── Large Title: 28px (font-weight: 700)
├── Title: 24px (font-weight: 700)
├── Section Header: 16px (font-weight: 600)
├── Subsection: 14px (font-weight: 600)
├── Body Text: 14px (font-weight: 400)
├── Label: 13px (font-weight: 600, uppercase)
├── Small/Meta: 12px (font-weight: 400)
└── Tiny: 11px (font-weight: 600)

Line Heights:
├── Headings: 1.3
├── Body: 1.5
├── Compact: 1.2
└── Spacious: 1.6

Font Weights:
├── Regular: 400
├── Medium: 500
├── Semi-bold: 600
└── Bold: 700

Letter Spacing:
├── Normal: 0
├── Labels/Uppercase: 0.5px
└── Headings: -0.2px
```

### Spacing & Sizing

```
Base Unit:              4px (all spacing in multiples)

Spacing Scale:
├── 2px (0.5x)
├── 4px (1x)
├── 8px (2x)
├── 12px (3x)
├── 16px (4x) - default
├── 24px (6x) - large
├── 32px (8x) - XL
└── 48px (12x) - XXL

Common Applications:
├── Field vertical gap: 12px
├── Field horizontal gap: 16px
├── Section padding: 16px
├── Border-radius: 4px (standard)
├── Tab padding: 12px 16px
└── Card padding: 12px - 16px
```

---

## Interactions & Behaviors

### Mouse Interactions

#### Hover Effects

```
Field Row Hover:
├── Background: Changes to #F5F5F5
├── Edit Icon: Becomes visible (opacity 1)
├── Border-left: Adds 3px solid #1976D2
├── Transition: all 0.2s ease
└── Cursor: Pointer (if clickable)

Link Hover:
├── Text: Stays #1976D2
├── Underline: Appears
├── Cursor: Pointer
└── Transition: text-decoration 0.2s ease

Button Hover:
├── Primary: Background darkens to #1565C0
├── Secondary: Background becomes #F0F0F0
├── Box-shadow: Adds 0 2px 8px rgba(0,0,0,0.12)
└── Transition: all 0.2s ease

Card Hover (History rows):
├── Background: Subtle highlight
├── Box-shadow: Upgrades to 0 2px 8px rgba(0,0,0,0.08)
└── Cursor: Pointer
```

#### Click Interactions

```
Field Value Click:
├── If editable: Enters edit mode
│   ├── Border becomes #1976D2
│   ├── Background becomes #FAFAFA
│   └── Focus: Cursor ready for input
└── If link: Navigates to record (new tab)

Link Click:
├── Navigation: Opens record in new tab
├── Loading: Show spinner during load
└── Tracking: Trackable in browser history

Button Click:
├── Disable: Button becomes disabled
├── Spinner: Show loading indicator
├── Feedback: Toast notification on completion
└── Reset: Return to normal state

Section Expand/Collapse Click:
├── Trigger: Click header area
├── Animation: Smooth expand/collapse (0.3s)
├── Chevron: Rotates (▼ ↔ ▶)
├── Content: Fades in/out
└── Persistence: Remember state in localStorage
```

### Keyboard Interactions

```
Tab Navigation:
├── Tab Key: Move to next focusable element
├── Shift+Tab: Move to previous element
├── Focus Indicator: 2px blue outline
├── Focus-visible: Only when keyboard-navigating
└── Outline-offset: 2px

Enter/Return Key:
├── In Text Field: Submit/Save changes
├── On Link: Navigate to link
├── On Button: Activate button
└── On Section Header: Toggle expand/collapse

Escape Key:
├── In Edit Mode: Cancel edit, revert changes
├── In Dropdown: Close dropdown
└── Propagation: Up to parent elements

Accessibility:
├── ARIA-labels: All interactive elements labeled
├── ARIA-expanded: Expandable sections marked
├── ARIA-disabled: Disabled fields marked
├── Role attributes: Semantic HTML roles
└── Screen reader: Announces changes when happening
```

### Loading & Error States

```
Loading States:
├── Skeleton Loaders: Grey placeholder boxes
├── Pulse Animation: Subtle loading effect (1s cycle)
├── Duration: Until content loads
├── Replacement: Animated fade-in of content

Save Confirmation:
├── Toast Position: Bottom-right corner
├── Message: "Saved successfully"
├── Color: Green (#4CAF50)
├── Icon: Checkmark (✓)
├── Duration: 3 seconds, then fade out

Error Display:
├── Color: Red (#FF5252)
├── Icon: Exclamation (⚠️)
├── Message: Error text (e.g., "Required field")
├── Position: Below field
├── Font-size: 12px

Validation:
├── Real-time: As user types/modifies
├── Visual: Red border on error
├── Message: Error text below field
└── Rules: Required, format, length, range
```

---

## Responsive Design

### Breakpoints

```
Desktop (≥1400px):
├── Sidebar: 280px visible
├── Main content: Full width
├── Two-column grid: 65/35 split (details left, activity right)
├── Field grid: 2 columns
└── All features visible

Tablet (1024px - 1399px):
├── Sidebar: 240px (compact) or toggle
├── Main content: Adjusted width
├── Columns: Two-column maintained (65/35)
├── Field grid: 2 columns, narrower
└── Some responsive adjustment

Mobile (768px - 1023px):
├── Sidebar: Hidden (hamburger toggle)
├── Main content: Full width
├── Columns: Stack vertically
├── Field grid: 1 column (full width)
├── Right panel: Below main content
└── Activity panel: Collapsible

Small Mobile (<768px):
├── Sidebar: Drawer menu
├── Layout: Single column, 100% width
├── Field grid: 1 column
├── Tables: Horizontal scroll or card layout
├── Buttons: Full width or wrapped
└── Padding: Reduced (12px instead of 16px)

Media Query Examples:
```

```css
/* Desktop */
@media (min-width: 1400px) {
  .main-content {
    display: grid;
    grid-template-columns: 65% 35%;
    gap: 24px;
  }
  
  .field-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Tablet */
@media (max-width: 1399px) {
  .field-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px 16px;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .field-grid {
    grid-template-columns: 1fr;
  }
  
  .right-panel {
    order: 2;
    margin-top: 24px;
  }
  
  table {
    overflow-x: auto;
  }
  
  button {
    width: 100%;
  }
}
```

### Mobile Optimizations

```
Touch Interactions:
├── Tap Target Size: 44x44px minimum
├── Tap Feedback: Subtle grey highlight (200ms)
├── Long Press: Context menu (if applicable)
└── Swipe: Smooth navigation (if applicable)

Mobile Layout:
├── Single column: Full width content
├── Stacked sections: Vertical layout
├── Table cards: Convert tables to card layout
├── Field labels: Full width, no side-by-side
└── Buttons: Full width with spacing

Performance (Mobile):
├── Lazy loading: Load content on scroll
├── Image optimization: Responsive images
├── Code splitting: Load only needed JS
├── Minimal animations: Reduced motion support
└── Font subsetting: Only required characters
```

---

## Summary & Implementation Notes

### Key Design Principles

1. **Clarity**: Clear visual hierarchy with labels, values, and sections
2. **Efficiency**: Quick access to key information and actions
3. **Consistency**: Uniform styling and interaction patterns
4. **Hierarchy**: Organized sections with expandable details
5. **Accessibility**: Full keyboard and screen reader support
6. **Responsiveness**: Works seamlessly on all devices
7. **Performance**: Fast loading and smooth interactions

### Development Checklist

✅ Create dual-tab interface (Details | Related)  
✅ Build expandable sections with animation  
✅ Implement two-column grid for Details fields  
✅ Create data grid layout for history tables  
✅ Build collapsible Related sections (8+)  
✅ Implement inline field editing  
✅ Add link navigation for references  
✅ Style status badges and indicators  
✅ Create file upload zones (drag & drop)  
✅ Build activity panel (right sidebar)  
✅ Implement loading states and spinners  
✅ Add error handling and validation  
✅ Ensure responsive design (mobile-first)  
✅ Add focus indicators for accessibility  
✅ Implement ARIA labels throughout  
✅ Test keyboard navigation  
✅ Add animation transitions  

### Technology Stack

```
Frontend:               React 18+ / Vue 3 / Angular 15+
Styling:                Tailwind CSS / Material-UI / Styled Components
State Management:       Redux / Zustand / Pinia / Context API
HTTP Client:            Axios / Fetch API / TanStack Query
Icons:                  Material Icons / Feather Icons / Heroicons
Forms:                  React Hook Form / Formik / Vee Validate
Validation:             Zod / Yup / Valibot
Animations:             Framer Motion / React Spring / CSS Transitions
Date Handling:          Day.js / Date-fns
Accessibility:          Radix UI / Headless UI / Custom ARIA
Testing:                Jest / Vitest / React Testing Library / Cypress
Charting (optional):    Recharts / Chart.js / D3.js
```

### Recommended File Structure

```
src/
├── components/
│   ├── ServiceAppointment/
│   │   ├── ServiceAppointmentModule.jsx
│   │   ├── DetailsTab.jsx
│   │   ├── RelatedTab.jsx
│   │   ├── Header/
│   │   │   ├── AppointmentHeader.jsx
│   │   │   └── InfoBar.jsx
│   │   ├── Sections/
│   │   │   ├── GeneralInformation.jsx
│   │   │   ├── ScheduledTimes.jsx
│   │   │   ├── ActualTimes.jsx
│   │   │   └── AdditionalFields.jsx
│   │   ├── RelatedSections/
│   │   │   ├── NotesAttachments.jsx
│   │   │   ├── ServiceHistory.jsx
│   │   │   ├── AssignedResources.jsx
│   │   │   ├── TimeSheetEntries.jsx
│   │   │   └── [other sections]
│   │   └── styles/
│   │       ├── details-tab.css
│   │       ├── related-tab.css
│   │       └── shared-styles.css
│   └── Common/
│       ├── EditableField.jsx
│       ├── ExpandableSection.jsx
│       ├── StatusBadge.jsx
│       ├── DataGrid.jsx
│       └── Card.jsx
├── hooks/
│   ├── useServiceAppointment.js
│   ├── useEditMode.js
│   ├── useTabNavigation.js
│   └── useResponsive.js
├── services/
│   ├── serviceAppointmentService.js
│   ├── fileUploadService.js
│   └── apiClient.js
├── styles/
│   ├── colors.css
│   ├── typography.css
│   ├── spacing.css
│   └── responsive.css
└── constants/
    └── fieldConfigurations.js
```

---

## Version Control

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-05-27 | Initial Service Appointment Module UI Design |
| | | Complete Details & Related tab specifications |
| | | All field and section layouts |
| | | Responsive design implementation |

---

**Document Status**: Complete & Ready for Development  
**Version**: 1.0  
**Last Updated**: May 27, 2024  
**Language**: English  
**Scope**: Service Appointment SA-2083611 Module  
**Ready For**: Full-Stack Development, QA Testing, Documentation
