# Service Resource Module - UI Design & Layout Document
## Service Resource & Service Crew Members Management

---

## 📋 Table of Contents

- [Overview](#overview)
- [Module Structure](#module-structure)
- [Header Section](#header-section)
- [Navigation & Tabs](#navigation--tabs)
- [Details Tab](#details-tab)
- [Related Tab](#related-tab)
- [Service Crew Members Section](#service-crew-members-section)
- [Field Specifications](#field-specifications)
- [Component Styling](#component-styling)
- [Interactions & Behaviors](#interactions--behaviors)
- [Responsive Design](#responsive-design)

---

## Overview

### Purpose
The Service Resource Module manages individual service resources (technicians, equipment, vehicles) and their organization into Service Crew teams. This module enables tracking of resource availability, skills, assignments, and team composition with relationship management to Service Crew Members.

### Key Objectives
- Display comprehensive service resource information
- Manage team composition through Service Crew Members linking
- Track resource skills, availability, and assignments
- Maintain audit trail and system information
- Support resource allocation and scheduling workflows
- Enable crew-based service delivery management

### Target Users
- Service Resource Managers
- Dispatch/Scheduling Officers
- Service Crew Leaders
- Service Technicians
- Operations Managers

### Scope
- Service Resource (PUMA 2 - Crew type)
- Two-tab interface (Details | Related)
- Service Crew Members management (6+ members)
- File attachments and activity tracking
- System information and audit trail

---

## Module Structure

### Overall Layout Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│  Top Navigation Bar (Salesforce/UT Service Console)                 │
├─────────────────────────────────────────────────────────────────────┤
│  Service Resource Header: PUMA 2 + Action Buttons                   │
│  User: [User] | Resource Type: Crew | Active: ✓                    │
├─────────────────────────────────────────────────────────────────────┤
│  Tab Navigation: Details (ACTIVE) | Related                         │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────┬─────────────────────────────────┐ │
│  │                              │                                 │ │
│  │   MAIN CONTENT AREA          │   ACTIVITY PANEL                │ │
│  │   (Left Column 65%)          │   (Right Column 35%)            │ │
│  │                              │                                 │ │
│  │  Expandable Sections:        │   Activity Feed                 │ │
│  │  • Information               │   • Upcoming & Overdue          │ │
│  │    - Name, User, Service     │   • Show All Activities         │ │
│  │    - Crew, Resource Type     │                                 │ │
│  │    - Active, Scheduling      │   Chatter:                      │ │
│  │    - NRP, Description        │   • Comments & @mentions        │ │
│  │  • System Information        │   • File attachments            │ │
│  │    - Created By/Date         │                                 │ │
│  │    - Last Modified By/Date   │                                 │ │
│  │    - Owner, Specialization   │                                 │ │
│  │                              │                                 │ │
│  │  [Scrollable Content]        │                                 │ │
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

### Service Resource Title Bar

```
Height:                 Dual-level header (64px main + 48px info bar)
Background:             #FFFFFF
Border-bottom:          1px solid #E0E0E0
Sticky:                 Yes (stays at top when scrolling)
Z-Index:                50
Padding:                16px 24px

Level 1 - Main Header (64px):
┌──────────────────────────────────────────────────────────────────┐
│ [Icon] Service Resource    PUMA 2        [Follow] [New Contact]  │
│                                          [New Note] [Edit] [More] │
└──────────────────────────────────────────────────────────────────┘

Level 2 - Info Bar (48px):
┌──────────────────────────────────────────────────────────────────┐
│ User: [User Name] | Resource Type: Crew | Active: ✓              │
└──────────────────────────────────────────────────────────────────┘
```

### Icon & Title Section

```
Icon:
├── Background: Linear gradient (#FF7043 to #D84315)
├── Size: 48x48px
├── Border-radius: 4px
├── Icon: 👥 (people/crew icon, white)
└── Box-shadow: 0 2px 4px rgba(0,0,0,0.1)

Text Section:
├── Label: "Service Resource" (font-size: 12px, color: #757575, uppercase)
├── Title: "PUMA 2" (font-size: 24px, font-weight: 700, color: #212121)
└── Spacing: 12px gap between icon and text

Action Buttons (Right side):
├── [ Follow ] - Secondary button
├── [ New Contact ] - Secondary button
├── [ New Note ] - Secondary button
├── [ Edit ] - Primary button
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
Layout:                 Grid layout with 3 sections
Background:             #F5F5F5 (light grey)
Border-top:             1px solid #E0E0E0
Border-bottom:          1px solid #E0E0E0
Padding:                12px 24px

Sections (Left to Right):

1️⃣ User:
   ├── Label: "User"
   ├── Value: "[User Name]" (clickable link, #1976D2)
   └── Spacing: 24px from previous

2️⃣ Resource Type:
   ├── Label: "Resource Type"
   ├── Value: "Crew" (text badge)
   ├── Badge Color: #2196F3 (blue for Crew type)
   └── Types: Individual / Crew / Equipment / Vehicle

3️⃣ Active Status:
   ├── Label: "Active"
   ├── Value: ✓ (checkmark, green)
   ├── Color: #4CAF50 (green for active)
   └── Alt: ✗ (x mark, grey for inactive)

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
Position:               Below Service Resource Header
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

The Details tab contains comprehensive service resource information organized in expandable sections.

### Section 1: Information

**Expanded by Default**: Yes

```
Section Header:     INFORMATION (with chevron indicator)
Background:         #FAFAFA (light grey header)
Border:             1px solid #E0E0E0
Border-radius:      4px

Field Layout:       2-column grid
Column 1 Width:     45% (field labels & values)
Column 2 Width:     45% (field labels & values)
Gap:                12px horizontal, 12px vertical

Fields (Left Column):
├── Name
│   ├── Label: "Name"
│   ├── Value: "PUMA 2" (editable with pencil icon)
│   ├── Type: Text
│   └── Max length: 255 characters

├── User
│   ├── Label: "User"
│   ├── Value: "[User Name]" (link)
│   ├── Type: Lookup reference
│   └── Icon: User avatar/badge

├── Service Crew
│   ├── Label: "Service Crew"
│   ├── Value: "PUMA 2" (link)
│   ├── Type: Lookup reference (editable)
│   └── Action: Click to change crew assignment

├── Resource Type
│   ├── Label: "Resource Type"
│   ├── Value: "Crew" (editable, radio/dropdown)
│   ├── Type: Picklist
│   ├── Options: [Individual | Crew | Equipment | Vehicle]
│   └── Read-only: If already assigned

└── Capacity-Based
    ├── Label: "Capacity-Based"
    ├── Value: "[Checkbox]" (editable)
    ├── Type: Boolean toggle
    ├── Description: "Enable capacity-based resource planning"
    └── State: Unchecked (by default)

Fields (Right Column):
├── Active
│   ├── Label: "Active"
│   ├── Value: ✓ (checkbox, checked)
│   ├── Type: Boolean
│   └── Color: Green (#4CAF50) when active

├── Include in Scheduling Optimization
│   ├── Label: "Include in Scheduling Optimization"
│   ├── Value: "[Checkbox]" (editable)
│   ├── Type: Boolean
│   ├── Description: "Consider in automatic scheduling"
│   └── State: Unchecked (optional)

├── NRP
│   ├── Label: "NRP"
│   ├── Value: "[NRP code]" (text, optional)
│   ├── Type: Text (National Resource Pool ID)
│   └── Max length: 50 characters

├── Description
│   ├── Label: "Description"
│   ├── Value: "[Description text]" (editable)
│   ├── Type: Rich text area
│   ├── Max length: 500 characters
│   └── Formatting: Markdown support

└── Primary Service Territory
    ├── Label: "Primary Service Territory"
    ├── Value: "Tanjung Enim PPA ST" (link)
    ├── Type: Lookup reference
    ├── Icon: Location marker
    └── Edit Mode: Click to open picker

Additional Fields:
├── Grade
│   ├── Label: "Grade"
│   ├── Value: "[Grade level]" (editable)
│   ├── Type: Picklist/Dropdown
│   └── Options: Grade levels/certifications

└── [Additional custom fields as configured]
```

### Section 2: System Information

**Expanded by Default**: No (collapsible)

```
Section Header:     SYSTEM INFORMATION
Background:         #FAFAFA
Border:             1px solid #E0E0E0

Field Layout:       2-column grid

Fields (Left Column):
├── Created By
│   ├── Label: "Created By"
│   ├── Value: "Suryadi Suryadi" (link)
│   ├── Date: "18/11/2024, 11:24" (timestamp)
│   ├── Type: System-generated
│   └── Read-only: Yes

└── Owner
    ├── Label: "Owner"
    ├── Value: "Suryadi Suryadi" (link)
    ├── Type: Lookup reference
    ├── Icon: User avatar
    ├── Can change: Yes (if permission)
    └── Edit Icon: Pencil on hover

Fields (Right Column):
├── Last Modified By
│   ├── Label: "Last Modified By"
│   ├── Value: "M. ABDUL ARIF" (link)
│   ├── Date: "25/05/2026, 18:40" (timestamp)
│   ├── Type: System-generated
│   └── Updates: Auto-updated on change

├── Already Created Mechanic Specialization
│   ├── Label: "Already Created Mechanic Specialization"
│   ├── Value: "[Checkbox]" (editable)
│   ├── Type: Boolean
│   └── Description: Pre-configured skills

├── Already Created IA JE
│   ├── Label: "Already Created IA JE"
│   ├── Value: "[Checkbox]" (editable)
│   ├── Type: Boolean
│   └── Description: Inspector/Quality role

└── Check End of Month
    ├── Label: "Check End of Month"
    ├── Value: "[Checkbox]" (editable)
    ├── Type: Boolean
    └── Description: Month-end review indicator

System Information Styling:
├── Color: Grey text (#757575)
├── Font-size: Small (12px)
├── Links: Blue (#1976D2)
├── Timestamps: Monospace font
├── Read-only: Greyed out appearance
└── Hoverable: Show edit icons on hover
```

---

## Related Tab

### Tab Overview

The Related tab displays all linked records and documents associated with the service resource, including crew members, files, and notes.

### Tab Structure Overview

```
Layout:                 Single column (full width)
Background:             #FAFAFA
Sections:               3-4 expandable sections
Scroll:                 Vertical, independent scrolling
Performance:            Lazy-load sections on expand

Section Categories:
1. Service Crew Members (6+ items)
2. Files (0 items)
3. Service Crew History (0 items)
```

---

## Service Crew Members Section

### Section Overview

This is the primary related section managing individual crew member assignments to the Service Crew.

### Section Header

```
Header Structure:
┌────────────────────────────────────────────────────────┐
│ 👥 Service Crew Members (6+)        [New]             │
└────────────────────────────────────────────────────────┘

Components:

1️⃣ Icon:
   ├── Type: 👥 (people/group icon)
   ├── Color: #FF5252 (Red/Orange for crew members)
   ├── Size: 24x24px
   └── Background: Optional colored circle

2️⃣ Section Title:
   ├── Text: "Service Crew Members"
   ├── Font-size: 14px
   ├── Font-weight: 600
   └── Color: #212121

3️⃣ Count Badge:
   ├── Format: "(6+)" indicating 6+ members
   ├── Font-size: 13px
   ├── Color: #757575
   └── Updates: Real-time count

4️⃣ Action Button:
   ├── Label: "[New]" or "[Add Member]"
   ├── Type: Secondary button
   ├── Size: Small (padding: 6px 12px)
   ├── Action: Open member creation form
   └── Visibility: Always visible

Header Styling:
├── Background: #FAFAFA
├── Border: 1px solid #E0E0E0
├── Border-radius: 4px (top only if expanded)
├── Padding: 12px 16px
├── Cursor: Pointer
└── Hover: Background #F0F0F0
```

### Service Crew Members Table

```
Table Layout:
┌─────────────────┬──────────────────────┬──────────────────┬──────────────────┐
│ Name            │ Service Resource     │ Start Date       │ End Date         │
├─────────────────┼──────────────────────┼──────────────────┼──────────────────┤
│ SCM-0020 (link) │ Ahmad Firli (link)   │ 26/11/2024, 18:00│ 27/11/2024, 06:00│
├─────────────────┼──────────────────────┼──────────────────┼──────────────────┤
│ SCM-0036 (link) │ Ahmad Firli (link)   │ 01/12/2024, 18:00│ 02/12/2024, 06:00│
├─────────────────┼──────────────────────┼──────────────────┼──────────────────┤
│ SCM-0114 (link) │ Ahmad Firli (link)   │ 11/01/2025, 18:00│ 12/01/2025, 06:00│
├─────────────────┼──────────────────────┼──────────────────┼──────────────────┤
│ SCM-0170 (link) │ Ahmad Firli (link)   │ 04/02/2025, 06:05│ 04/02/2025, 18:00│
├─────────────────┼──────────────────────┼──────────────────┼──────────────────┤
│ SCM-0257 (link) │ Ahmad Firli (link)   │ 14/03/2025, 07:00│ 14/03/2025, 18:00│
├─────────────────┼──────────────────────┼──────────────────┼──────────────────┤
│ SCM-0339 (link) │ Ahmad Firli (link)   │ 08/05/2025, 07:00│ 08/05/2025, 18:00│
└─────────────────┴──────────────────────┴──────────────────┴──────────────────┘

[View All] link - if more than 6 members

Table Styling:
├── Header: Bold, background #FAFAFA, uppercase
├── Rows: Alternating backgrounds (white/#FAFAFA)
├── Borders: 1px solid #E0E0E0
├── Padding: 12px per cell
├── Font-size: 13px
├── Links: Blue (#1976D2), underline on hover
├── Timestamps: Monospace font
└── Hover: Row background highlights

Member Item Styling:
├── Background: #FFFFFF
├── Border: 1px solid #E0E0E0
├── Padding: 12px
├── Margin-bottom: 8px
├── Hover: Box-shadow 0 2px 8px rgba(0,0,0,0.08)
└── Actions: Edit/Delete icons on hover (if permission)
```

### Member Information Display

```
Per Crew Member:

Column 1 - Name:
├── Format: "SCM-0020" (Service Crew Member ID)
├── Type: Clickable link (blue)
├── Color: #1976D2
├── Action: Click to view/edit member details
└── Icon: Member type indicator (optional)

Column 2 - Service Resource:
├── Format: "Ahmad Firli" (resource name)
├── Type: Clickable link (blue)
├── Color: #1976D2
├── Action: Navigate to service resource record
└── Display: Resource name or ID

Column 3 - Start Date:
├── Format: "26/11/2024, 18:00" (DD/MM/YYYY, HH:MM)
├── Type: Date/Time (read-only or editable)
├── Timezone: User-specific
└── Font: Monospace for alignment

Column 4 - End Date:
├── Format: "27/11/2024, 06:00" (DD/MM/YYYY, HH:MM)
├── Type: Date/Time (read-only or editable)
├── Optional: Can be null if ongoing
└── Font: Monospace for alignment

Timestamp Styling:
├── Color: #424242 (dark grey)
├── Font-size: 13px
├── Font-family: Monospace
└── Background: Transparent
```

### Member Row Actions

```
On Hover - Action Icons Appear:

1️⃣ View:
   ├── Icon: 👁️ or 🔗
   ├── Action: Open member details view
   └── New tab: Yes

2️⃣ Edit:
   ├── Icon: ✏️ (pencil)
   ├── Action: Enter edit mode for member
   └── Fields: Name, start/end dates, role

3️⃣ Delete:
   ├── Icon: 🗑️ (trash)
   ├── Action: Remove member from crew
   ├── Confirmation: "Remove this member?"
   └── Permanent: Yes (with warning)

4️⃣ More:
   ├── Icon: ⋮ (three dots)
   ├── Menu: Additional actions
   └── Options: Copy, share, view history
```

### Add/Create New Member

```
[New] Button Action:

Trigger:            Click [New] button in section header
Dialog/Form:        Service Crew Member Creation Form
Width:              600px (responsive)
Modal:              Yes (blocks background)

Form Fields:
├── Service Resource (Required)
│   ├── Label: "Service Resource"
│   ├── Type: Lookup/Picklist
│   ├── Required: Yes
│   ├── Search: Type to find resource
│   └── Value: Pre-populated if coming from resource

├── Start Date (Required)
│   ├── Label: "Start Date"
│   ├── Type: Date/Time picker
│   ├── Required: Yes
│   ├── Default: Today
│   └── Format: DD/MM/YYYY, HH:MM

├── End Date (Optional)
│   ├── Label: "End Date"
│   ├── Type: Date/Time picker
│   ├── Required: No
│   ├── Validation: Must be > Start Date if provided
│   └── Format: DD/MM/YYYY, HH:MM

├── Role (Optional)
│   ├── Label: "Role"
│   ├── Type: Dropdown/Picklist
│   ├── Options: Crew Lead, Technician, Helper, etc.
│   └── Required: No

└── Notes (Optional)
    ├── Label: "Notes"
    ├── Type: Text area
    ├── Max length: 500 characters
    └── Required: No

Action Buttons:
├── [ Cancel ] - Closes form without saving
├── [ Clear ] - Resets all fields to defaults
└── [ Save ] - Creates new member and closes form

Form Validation:
├── Required fields: Mark with red asterisk (*)
├── Real-time validation: As user types
├── Error messages: Display below field
├── Submit: Disabled until valid
└── Feedback: Success toast on creation
```

---

## Other Related Sections

### Section 2: Files

**Expanded by Default**: No

```
Section Header:
┌──────────────────────────────────────────────────────┐
│ 📄 Files (0)                        [Add Files]      │
├──────────────────────────────────────────────────────┤

Empty State Display:
┌────────────────────────────────────────────────────┐
│                                                    │
│           📁 Drag files here or                   │
│           [↓ Upload Files]                        │
│           Or drop files                           │
│                                                    │
└────────────────────────────────────────────────────┘

File Upload Zone:
├── Background: #F5F5F5 (light grey)
├── Border: 2px dashed #BDBDBD
├── Border-radius: 8px
├── Min-height: 120px
├── Drag-over: Background #E3F2FD, border #1976D2
└── Drop: Auto-upload files

When Files Present:
├── File List: Table format
├── Columns: Filename | Size | Upload Date | Actions
├── Actions: View | Download | Delete
└── Total Size: Display aggregate
```

### Section 3: Service Crew History

**Expanded by Default**: No

```
Section Header:
┌──────────────────────────────────────────────────────┐
│ 📋 Service Crew History (0)                          │
├──────────────────────────────────────────────────────┤

Empty State:
"No history records found."

When History Present:
├── Timeline display: Chronological entries
├── Per Entry:
│   ├── Date: DD/MM/YYYY, HH:MM
│   ├── Change: Field changed
│   ├── From: Original value
│   ├── To: New value
│   └── User: Who made the change

Entry Card Styling:
├── Background: #FFFFFF
├── Border-left: 4px solid #4CAF50
├── Padding: 12px
├── Margin-bottom: 8px
└── Timestamp: Small, grey text
```

---

## Data Grid Layouts

### Information Grid

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

### Service Crew Members Table

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
└── Actions: Icons appear on hover
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
├── Name: "PUMA 2" (editable, 255 char max)
├── NRP: "[NRP Code]" (editable, 50 char max)
└── Description: "[Description text]" (editable, 500 char max)
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
├── User: "[User Name]" (link, may be editable)
├── Service Crew: "PUMA 2" (link, editable)
├── Primary Service Territory: "Tanjung Enim PPA ST" (link, editable)
└── Owner: "Suryadi Suryadi" (link, may be editable)
```

#### Dropdown/Picklist Fields

```
Type:                   Single select from predefined list
Display:                Selected value only
Edit Mode:              Click to open dropdown menu
Options:                Scrollable list

Example Fields:
├── Resource Type: "Crew" (editable, options: Individual/Crew/Equipment/Vehicle)
└── Grade: "[Grade level]" (editable, picklist)
```

#### Boolean/Checkbox Fields

```
Type:                   True/False or Yes/No
Display:                Checkbox icon or checkmark
States:                 Checked (✓) / Unchecked ( )
Color (checked):        Green (#4CAF50)
Edit Mode:              Click checkbox to toggle

Example Fields:
├── Active: ✓ (checked, status indicator)
├── Capacity-Based: [ ] (unchecked, editable)
├── Include in Scheduling Optimization: [ ] (editable)
└── Already Created Mechanic Specialization: [ ] (editable)
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
├── Created Date: "18/11/2024, 11:24" (read-only)
├── Last Modified: "25/05/2026, 18:40" (read-only)
└── Start/End Dates (in crew members): "[Date/Time]" (editable)
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
├── Active/Success: #4CAF50
├── In Progress/Active: #2196F3
├── Warning: #FFC107
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

Table Row Hover:
├── Background: Changes to #F0F0F0
├── Action Icons: Become visible
├── Box-shadow: Optional subtle lift
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
├── Two-column grid: 65/35 split
├── Field grid: 2 columns
├── Table: Full width, horizontal scroll if needed
└── All features visible

Tablet (1024px - 1399px):
├── Sidebar: 240px (compact) or toggle
├── Main content: Adjusted width
├── Columns: Two-column maintained (65/35)
├── Field grid: 2 columns, narrower
├── Table: Responsive columns
└── Some responsive adjustment

Mobile (768px - 1023px):
├── Sidebar: Hidden (hamburger toggle)
├── Main content: Full width
├── Columns: Stack vertically
├── Field grid: 1 column (full width)
├── Right panel: Below main content
└── Table: Card layout or horizontal scroll

Small Mobile (<768px):
├── Sidebar: Drawer menu
├── Layout: Single column, 100% width
├── Field grid: 1 column
├── Tables: Converted to cards
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
    display: block;
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

1. **Resource Management**: Efficient crew member tracking and assignment
2. **Relationship Management**: Clear links between resources and crew members
3. **Clarity**: Visual hierarchy with organized sections
4. **Efficiency**: Quick access to key information and actions
5. **Consistency**: Uniform styling and interaction patterns
6. **Hierarchy**: Organized sections with expandable details
7. **Accessibility**: Full keyboard and screen reader support
8. **Responsiveness**: Works seamlessly on all devices

### Development Checklist

✅ Create dual-tab interface (Details | Related)  
✅ Build expandable sections with animation  
✅ Implement two-column grid for Details fields  
✅ Build Service Crew Members table (6+ rows)  
✅ Create member add/create functionality  
✅ Implement member edit/delete actions  
✅ Build collapsible Related sections  
✅ Implement inline field editing  
✅ Add link navigation for references  
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
```

### File Structure

```
src/
├── components/
│   ├── ServiceResource/
│   │   ├── ServiceResourceModule.jsx
│   │   ├── DetailsTab.jsx
│   │   ├── RelatedTab.jsx
│   │   ├── Header/
│   │   │   ├── ResourceHeader.jsx
│   │   │   └── InfoBar.jsx
│   │   ├── Sections/
│   │   │   ├── Information.jsx
│   │   │   ├── SystemInformation.jsx
│   │   │   └── ExpandableSection.jsx
│   │   ├── RelatedSections/
│   │   │   ├── ServiceCrewMembers.jsx
│   │   │   ├── CrewMemberForm.jsx
│   │   │   ├── Files.jsx
│   │   │   └── ServiceCrewHistory.jsx
│   │   └── styles/
│   │       ├── details-tab.css
│   │       ├── related-tab.css
│   │       └── shared-styles.css
│   └── Common/
│       ├── EditableField.jsx
│       ├── ExpandableSection.jsx
│       ├── DataGrid.jsx
│       └── Card.jsx
├── hooks/
│   ├── useServiceResource.js
│   ├── useCrewMembers.js
│   ├── useEditMode.js
│   └── useResponsive.js
├── services/
│   ├── serviceResourceService.js
│   ├── crewMemberService.js
│   └── fileUploadService.js
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
| 1.0 | 2024-05-27 | Initial Service Resource Module UI Design |
| | | Complete Details & Related tab specifications |
| | | Service Crew Members management |
| | | All field and section layouts |
| | | Responsive design implementation |

---

**Document Status**: Complete & Ready for Development  
**Version**: 1.0  
**Last Updated**: May 27, 2024  
**Language**: English  
**Scope**: Service Resource PUMA 2 Module with Service Crew Members  
**Ready For**: Full-Stack Development, QA Testing, Documentation
