# Work Order Management - Feed Tab with Collapsible Action Buttons

## Advanced Feed Tab Interface with Dynamic Action Buttons

---

## 1. FEED TAB OVERVIEW

### 1.1 Feed Tab Navigation Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ WORK ORDER #01275781                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ [Details] [Feed] [Related] [Log]                               │
│              ↑       ↑       ↑                                   │
│           ACTIVE  Available Available                            │
│                                                                  │
│ FEED TAB - Activity Timeline & Interactions                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Feed Tab Main Components

```
┌─────────────────────────────────────────────────────────────────┐
│ FEED TAB CONTENT AREA                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ 1. COLLAPSIBLE ACTION BUTTONS ROW                               │
│    [Book Appt] [Approve/Reject] [Generate PDF] [...]           │
│                                                                  │
│ 2. POST/INPUT SECTION                                           │
│    [Create new... field] [Add] [+]                             │
│                                                                  │
│ 3. SORT/FILTER SECTION                                          │
│    Sort by: [Most Recent Activity ▼]                            │
│    [Search this feed...]                                        │
│                                                                  │
│ 4. FEED TIMELINE                                                │
│    ├─ Activity Entry 1                                          │
│    ├─ Activity Entry 2                                          │
│    ├─ Activity Entry 3                                          │
│    └─ [Load More]                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. COLLAPSIBLE ACTION BUTTONS - DETAILED DESIGN

### 2.1 Buttons Row - Expanded State

```
┌────────────────────────────────────────────────────────────────────┐
│ ACTION BUTTONS ROW (EXPANDED)                                      │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ [Book Appointment]                                                 │
│ [Approve / Reject Work Order]                                      │
│ [Generate PDF]                                                     │
│ [Enrich Parts Request]                                             │
│ [Send Job Data to SAP]                                             │
│ [Timesheet Approval]                                               │
│ [Validate Checksheet]                                              │
│ [Update TSR Score]                                                 │
│ [Post]                                                             │
│ [Debug EMR]                                                        │
│ [Debug DO]                                                         │
│                                                                     │
│ [Collapse ▲]                                                       │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### 2.2 Buttons Row - Collapsed State

```
┌────────────────────────────────────────────────────────────────────┐
│ ACTION BUTTONS ROW (COLLAPSED)                                     │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ [Book Appt] [Approve/Reject] [Generate PDF] [Enrich Parts] [...]  │
│                                                                    │
│ [Expand ▼] [Show More Actions]                                    │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### 2.3 Collapse/Expand Behavior

```
USER INTERACTION:

1. INITIAL STATE (COLLAPSED)
   ├─ Shows: First 5 buttons + [Expand ▼]
   ├─ Height: ~50px
   ├─ Display: Inline horizontal
   └─ Remaining buttons: Hidden

2. CLICK [EXPAND ▼] OR [Show More Actions]
   ├─ Animation: Smooth height expansion (300ms)
   ├─ Shows: All 11 buttons
   ├─ Height: ~120-150px
   ├─ Layout: Multi-row grid (2-3 rows)
   └─ Button changes to: [Collapse ▲]

3. CLICK [COLLAPSE ▲]
   ├─ Animation: Smooth height collapse (300ms)
   ├─ Returns to: Collapsed state
   ├─ Shows: First 5 buttons + [Expand ▼]
   └─ Remembers: User preference (localStorage)

4. HOVER OVER BUTTON
   ├─ Shows: Button tooltip
   ├─ Background color: Slight highlight
   ├─ Cursor: Pointer
   └─ Transition: 150ms

5. CLICK BUTTON
   ├─ Action: Button-specific function
   ├─ Feedback: Loading spinner or success message
   ├─ Keep collapsed state: True (unless auto-expand)
   └─ Close any open modals/panels
```

---

## 3. ACTION BUTTONS - DETAILED SPECIFICATIONS

### 3.1 Button 1: Book Appointment

```
┌──────────────────────────────────────┐
│ BOOK APPOINTMENT                     │
├──────────────────────────────────────┤
│                                      │
│ Display:                             │
│ ├─ Label: "Book Appointment"         │
│ ├─ Icon: 📅 Calendar icon            │
│ ├─ Style: Primary button (Blue)      │
│ ├─ Size: Medium (40px height)        │
│ └─ State: Active / Disabled          │
│                                      │
│ Functionality:                       │
│ ├─ On Click: Opens appointment modal │
│ ├─ Pre-fills: WO#, Asset, Customer   │
│ ├─ Requires: Valid case & asset      │
│ └─ Success: Creates SA record        │
│                                      │
│ Modal Content:                       │
│ ├─ Appointment Date [Picker]         │
│ ├─ Start Time [Time Picker]          │
│ ├─ Duration [Input] hours            │
│ ├─ Mechanic [Dropdown]               │
│ ├─ Location [Autocomplete]           │
│ ├─ Notes [Text Area]                 │
│ └─ [Save] [Cancel]                   │
│                                      │
│ Tooltip:                             │
│ "Schedule a service appointment      │
│  for this work order"                │
│                                      │
└──────────────────────────────────────┘
```

### 3.2 Button 2: Approve / Reject Work Order

```
┌──────────────────────────────────────┐
│ APPROVE / REJECT WORK ORDER          │
├──────────────────────────────────────┤
│                                      │
│ Display:                             │
│ ├─ Label: "Approve / Reject WO"      │
│ ├─ Icon: ✓/✗ Check/X icon           │
│ ├─ Style: Primary button (Green)     │
│ ├─ Size: Medium (40px height)        │
│ └─ State: Active / Disabled          │
│                                      │
│ Functionality:                       │
│ ├─ On Click: Opens approval dialog   │
│ ├─ Shows: Current WO status          │
│ ├─ Options: Approve / Reject         │
│ └─ Requires: Manager permissions     │
│                                      │
│ Dialog Content:                      │
│ ├─ WO Details Summary                │
│ ├─ Current Status: [Status]          │
│ ├─ Comments [Text Area]              │
│ ├─ Approval Level [Dropdown]         │
│ ├─ Radio Buttons:                    │
│ │  ○ Approve                         │
│ │  ○ Reject                          │
│ │  ○ Request Changes                 │
│ └─ [Submit] [Cancel]                 │
│                                      │
│ Post-Action:                         │
│ ├─ If Approved:                      │
│ │  ├─ Status changes to "Approved"   │
│ │  ├─ Notification sent to owner     │
│ │  └─ Can proceed to dispatch        │
│ │                                    │
│ └─ If Rejected:                      │
│    ├─ Status changes to "Rejected"   │
│    ├─ Comments sent to creator       │
│    └─ Returns for revision           │
│                                      │
│ Tooltip:                             │
│ "Approve or reject this work order"  │
│                                      │
└──────────────────────────────────────┘
```

### 3.3 Button 3: Generate PDF

```
┌──────────────────────────────────────┐
│ GENERATE PDF                         │
├──────────────────────────────────────┤
│                                      │
│ Display:                             │
│ ├─ Label: "Generate PDF"             │
│ ├─ Icon: 📄 PDF icon                 │
│ ├─ Style: Secondary button (Gray)    │
│ ├─ Size: Medium (40px height)        │
│ └─ State: Active / Disabled          │
│                                      │
│ Functionality:                       │
│ ├─ On Click: Opens PDF options       │
│ ├─ Shows: Loading spinner            │
│ ├─ Generates: PDF from WO data       │
│ └─ Returns: Download dialog          │
│                                      │
│ PDF Dialog Content:                  │
│ ├─ Report Type [Dropdown]:           │
│ │  ├─ Full Work Order Report         │
│ │  ├─ Checklist Report               │
│ │  ├─ Timesheet Report               │
│ │  └─ Service Invoice                │
│ │                                    │
│ ├─ Include Sections:                 │
│ │  ☑ WO Details                      │
│ │  ☑ Asset Information               │
│ │  ☑ Service History                 │
│ │  ☑ Attachments/Photos              │
│ │  ☐ Customer Signature              │
│ │  ☐ Cost Breakdown                  │
│ │                                    │
│ ├─ Format Options:                   │
│ │  ○ A4 Portrait                     │
│ │  ○ A4 Landscape                    │
│ │  ○ Letter                          │
│ │                                    │
│ └─ [Generate & Download] [Cancel]    │
│                                      │
│ Tooltip:                             │
│ "Generate PDF report of this WO"     │
│                                      │
└──────────────────────────────────────┘
```

### 3.4 Button 4: Enrich Parts Request

```
┌──────────────────────────────────────┐
│ ENRICH PARTS REQUEST                 │
├──────────────────────────────────────┤
│                                      │
│ Display:                             │
│ ├─ Label: "Enrich Parts Request"     │
│ ├─ Icon: 📦 Package icon             │
│ ├─ Style: Secondary button (Orange)  │
│ ├─ Size: Medium (40px height)        │
│ └─ State: Active / Disabled          │
│                                      │
│ Functionality:                       │
│ ├─ On Click: Opens parts dialog      │
│ ├─ Shows: Current parts list         │
│ ├─ Allows: Add/modify parts          │
│ └─ Updates: Parts request record     │
│                                      │
│ Parts Dialog Content:                │
│ ├─ Current Parts (if any)            │
│ │  ├─ Part 1: [Details]              │
│ │  ├─ Part 2: [Details]              │
│ │  └─ [Remove] links                 │
│ │                                    │
│ ├─ Add New Part Section:             │
│ │  ├─ Part Code [Search/Autocomplete]│
│ │  ├─ Part Description [Display]     │
│ │  ├─ Quantity [Number Input]        │
│ │  ├─ Unit [Dropdown]                │
│ │  ├─ Urgency [Dropdown]:            │
│ │  │  ├─ Critical                    │
│ │  │  ├─ High                        │
│ │  │  ├─ Normal                      │
│ │  │  └─ Low                         │
│ │  └─ [Add Part] [Clear]             │
│ │                                    │
│ ├─ Summary:                          │
│ │  ├─ Total Parts: [Count]           │
│ │  ├─ Estimated Cost: $[Amount]      │
│ │  └─ Supplier: [Dropdown]           │
│ │                                    │
│ └─ [Save & Submit] [Cancel]          │
│                                      │
│ Tooltip:                             │
│ "Add or modify parts for this WO"    │
│                                      │
└──────────────────────────────────────┘
```

### 3.5 Button 5: Send Job Data to SAP

```
┌──────────────────────────────────────┐
│ SEND JOB DATA TO SAP                 │
├──────────────────────────────────────┤
│                                      │
│ Display:                             │
│ ├─ Label: "Send Job Data to SAP"     │
│ ├─ Icon: 🔄 Sync icon                │
│ ├─ Style: Primary button (Blue)      │
│ ├─ Size: Medium (40px height)        │
│ └─ State: Active / Disabled          │
│                                      │
│ Functionality:                       │
│ ├─ On Click: Shows confirmation      │
│ ├─ Syncs: All WO data to SAP         │
│ ├─ Updates: SAP records              │
│ └─ Returns: Sync status              │
│                                      │
│ Confirmation Dialog:                 │
│ ├─ Title: "Sync to SAP"              │
│ ├─ Message:                          │
│ │  "This will send all current WO    │
│ │   data to SAP system. Continue?"   │
│ │                                    │
│ ├─ Data to be sent:                  │
│ │  ☑ WO Details                      │
│ │  ☑ Asset Information               │
│ │  ☑ Timesheet Entries               │
│ │  ☑ Parts List                      │
│ │  ☑ Service Appointments            │
│ │                                    │
│ ├─ Last Sync: [Date/Time]            │
│ └─ [Send Now] [Cancel]               │
│                                      │
│ Post-Action:                         │
│ ├─ Success: Shows "Synced to SAP"    │
│ ├─ Error: Shows error message        │
│ ├─ Timestamp: Updates last sync date │
│ └─ Notification: Sent to admin       │
│                                      │
│ Tooltip:                             │
│ "Sync this work order to SAP system" │
│                                      │
└──────────────────────────────────────┘
```

### 3.6 Button 6: Timesheet Approval

```
┌──────────────────────────────────────┐
│ TIMESHEET APPROVAL                   │
├──────────────────────────────────────┤
│                                      │
│ Display:                             │
│ ├─ Label: "Timesheet Approval"       │
│ ├─ Icon: ⏱️ Clock icon               │
│ ├─ Style: Primary button (Green)     │
│ ├─ Size: Medium (40px height)        │
│ └─ State: Active / Disabled          │
│                                      │
│ Functionality:                       │
│ ├─ On Click: Opens timesheet review  │
│ ├─ Shows: All timesheet entries      │
│ ├─ Allows: Review & approve/reject   │
│ └─ Updates: Timesheet status         │
│                                      │
│ Timesheet Dialog Content:            │
│ ├─ Timesheet Period: [Date Range]    │
│ ├─ Employee: [Name]                  │
│ ├─ Total Hours: [Total]              │
│ ├─ Billable Hours: [Amount]          │
│ │                                    │
│ ├─ Entries Table:                    │
│ │  ├─ Date | Time | Task | Hours     │
│ │  ├─ [Entry 1]                      │
│ │  ├─ [Entry 2]                      │
│ │  └─ [Entry 3]                      │
│ │                                    │
│ ├─ Approval Section:                 │
│ │  ├─ Radio Buttons:                 │
│ │  │  ○ Approve All                  │
│ │  │  ○ Approve with Notes           │
│ │  │  ○ Reject - Need Revision       │
│ │  │                                 │
│ │  ├─ Comments [Text Area]           │
│ │  └─ [Submit Approval] [Cancel]     │
│ │                                    │
│ └─ Signature: [Digital Signature]    │
│                                      │
│ Tooltip:                             │
│ "Review and approve timesheet"       │
│                                      │
└──────────────────────────────────────┘
```

### 3.7 Button 7: Validate Checksheet

```
┌──────────────────────────────────────┐
│ VALIDATE CHECKSHEET                  │
├──────────────────────────────────────┤
│                                      │
│ Display:                             │
│ ├─ Label: "Validate Checksheet"      │
│ ├─ Icon: ✓ Checkmark icon            │
│ ├─ Style: Secondary button (Blue)    │
│ ├─ Size: Medium (40px height)        │
│ └─ State: Active / Disabled          │
│                                      │
│ Functionality:                       │
│ ├─ On Click: Opens validation panel  │
│ ├─ Shows: Checksheet items           │
│ ├─ Allows: Mark items complete       │
│ └─ Validates: All required fields    │
│                                      │
│ Checksheet Validation Panel:         │
│ ├─ Checksheet Type: [Type]           │
│ ├─ Created Date: [Date]              │
│ │                                    │
│ ├─ Items to Validate:                │
│ │  ☑ Item 1 - Complete               │
│ │  ☐ Item 2 - Pending                │
│ │  ☐ Item 3 - Not Started            │
│ │  ☑ Item 4 - Complete               │
│ │                                    │
│ ├─ Validation Status:                │
│ │  Progress: [████░░░░░░] 50%        │
│ │  Status: In Progress               │
│ │                                    │
│ ├─ Mark Complete Actions:            │
│ │  [Mark All Complete]               │
│ │  [Clear All]                       │
│ │  [Review Items]                    │
│ │                                    │
│ └─ [Submit Validation] [Cancel]      │
│                                      │
│ Tooltip:                             │
│ "Validate service checksheet items"  │
│                                      │
└──────────────────────────────────────┘
```

### 3.8 Button 8: Update TSR Score

```
┌──────────────────────────────────────┐
│ UPDATE TSR SCORE                     │
├──────────────────────────────────────┤
│                                      │
│ Display:                             │
│ ├─ Label: "Update TSR Score"         │
│ ├─ Icon: ⭐ Star icon                │
│ ├─ Style: Secondary button (Gold)    │
│ ├─ Size: Medium (40px height)        │
│ └─ State: Active / Disabled          │
│                                      │
│ Functionality:                       │
│ ├─ On Click: Opens scoring panel     │
│ ├─ Shows: Current TSR score          │
│ ├─ Allows: Update various metrics    │
│ └─ Calculates: New overall score     │
│                                      │
│ TSR Score Update Panel:              │
│ ├─ Current Overall Score: 85/100     │
│ │                                    │
│ ├─ Score Categories:                 │
│ │  ├─ Timeliness: [Slider] 85/100    │
│ │  ├─ Quality: [Slider] 90/100       │
│ │  ├─ Completeness: [Slider] 80/100  │
│ │  ├─ Customer Satisfaction:         │
│ │  │  [Slider] 85/100                │
│ │  └─ Compliance: [Slider] 80/100    │
│ │                                    │
│ ├─ Notes Section:                    │
│ │  ├─ Strengths: [Text Area]         │
│ │  ├─ Areas for Improvement:         │
│ │  │  [Text Area]                    │
│ │  └─ Reviewer Comments: [Text Area] │
│ │                                    │
│ ├─ New Score Summary:                │
│ │  Overall: [Calculated] / 100       │
│ │  Trend: ↑ ↓ → (vs. last review)    │
│ │                                    │
│ └─ [Save Score] [Cancel]             │
│                                      │
│ Tooltip:                             │
│ "Update Technical Service Record..."  │
│                                      │
└──────────────────────────────────────┘
```

### 3.9 Button 9: Post

```
┌──────────────────────────────────────┐
│ POST                                 │
├──────────────────────────────────────┤
│                                      │
│ Display:                             │
│ ├─ Label: "Post"                     │
│ ├─ Icon: 📝 Edit/Write icon          │
│ ├─ Style: Primary button (Blue)      │
│ ├─ Size: Medium (40px height)        │
│ └─ State: Active / Always            │
│                                      │
│ Functionality:                       │
│ ├─ On Click: Submits feed post       │
│ ├─ Creates: Activity entry           │
│ ├─ Timestamp: Current date/time      │
│ └─ Visibility: Public in feed        │
│                                      │
│ Post Integration:                    │
│ ├─ Input Field: [Create new...]      │
│ ├─ Character Limit: 5000             │
│ ├─ Rich Text: Enabled                │
│ ├─ Attachments: Supported            │
│ ├─ Mentions: @ mentions available    │
│ ├─ Tags: # hashtags available        │
│ └─ On Submit:                        │
│    ├─ Validates: Not empty           │
│    ├─ Creates: Activity record       │
│    ├─ Updates: Feed timeline         │
│    └─ Notifies: Mentioned users      │
│                                      │
│ Post Content:                        │
│ ├─ Author: Current user              │
│ ├─ Text: [Posted content]            │
│ ├─ Attachments: [List]               │
│ ├─ Timestamp: [Date/Time]            │
│ ├─ Like/Comment: [Interaction]       │
│ └─ [Like] [Comment] [More]           │
│                                      │
│ Tooltip:                             │
│ "Post a new activity/comment"        │
│                                      │
└──────────────────────────────────────┘
```

### 3.10 Button 10: Debug EMR

```
┌──────────────────────────────────────┐
│ DEBUG EMR                            │
├──────────────────────────────────────┤
│                                      │
│ Display:                             │
│ ├─ Label: "Debug EMR"                │
│ ├─ Icon: 🔧 Wrench icon              │
│ ├─ Style: Danger button (Red)        │
│ ├─ Size: Medium (40px height)        │
│ └─ State: Admin only                 │
│                                      │
│ Functionality:                       │
│ ├─ On Click: Opens debug console     │
│ ├─ Shows: EMR system logs            │
│ ├─ Allows: Run diagnostic tests      │
│ └─ Returns: Debug information        │
│                                      │
│ Debug EMR Console:                   │
│ ├─ System Status:                    │
│ │  ├─ Connection: ✓ Connected        │
│ │  ├─ Last Sync: [Date/Time]         │
│ │  └─ Status: Running                │
│ │                                    │
│ ├─ EMR Integration:                  │
│ │  ├─ Module Status: [Status]        │
│ │  ├─ Data Validation: [Status]      │
│ │  └─ Sync Status: [Status]          │
│ │                                    │
│ ├─ Diagnostics:                      │
│ │  ├─ [Run Validation]               │
│ │  ├─ [Clear Cache]                  │
│ │  ├─ [Resync Data]                  │
│ │  └─ [View Logs]                    │
│ │                                    │
│ ├─ Logs Panel:                       │
│ │  ├─ Timestamp | Level | Message    │
│ │  ├─ [Log Entry 1]                  │
│ │  ├─ [Log Entry 2]                  │
│ │  └─ [View Full Logs]               │
│ │                                    │
│ └─ [Export Logs] [Clear Logs] [Close]│
│                                      │
│ Permissions:                         │
│ ├─ Admin: Full access                │
│ ├─ Manager: View only                │
│ └─ User: No access                   │
│                                      │
│ Tooltip:                             │
│ "Debug EMR integration (Admin only)" │
│                                      │
└──────────────────────────────────────┘
```

### 3.11 Button 11: Debug DO

```
┌──────────────────────────────────────┐
│ DEBUG DO                             │
├──────────────────────────────────────┤
│                                      │
│ Display:                             │
│ ├─ Label: "Debug DO"                 │
│ ├─ Icon: 🔧 Wrench icon              │
│ ├─ Style: Danger button (Red)        │
│ ├─ Size: Medium (40px height)        │
│ └─ State: Admin only                 │
│                                      │
│ Functionality:                       │
│ ├─ On Click: Opens debug console     │
│ ├─ Shows: Dispatch Order logs        │
│ ├─ Allows: Run diagnostic tests      │
│ └─ Returns: Debug information        │
│                                      │
│ Debug DO Console:                    │
│ ├─ System Status:                    │
│ │  ├─ Connection: ✓ Connected        │
│ │  ├─ Last Sync: [Date/Time]         │
│ │  └─ Status: Running                │
│ │                                    │
│ ├─ DO Integration:                   │
│ │  ├─ Module Status: [Status]        │
│ │  ├─ Queue Status: [Status]         │
│ │  └─ Assignment Status: [Status]    │
│ │                                    │
│ ├─ Diagnostics:                      │
│ │  ├─ [Check Queue]                  │
│ │  ├─ [Verify Assignments]           │
│ │  ├─ [Test Notifications]           │
│ │  └─ [View Logs]                    │
│ │                                    │
│ ├─ Logs Panel:                       │
│ │  ├─ Timestamp | Level | Message    │
│ │  ├─ [Log Entry 1]                  │
│ │  ├─ [Log Entry 2]                  │
│ │  └─ [View Full Logs]               │
│ │                                    │
│ ├─ Queue Monitor:                    │
│ │  ├─ Total in Queue: [Count]        │
│ │  ├─ Processing: [Count]            │
│ │  └─ Completed: [Count]             │
│ │                                    │
│ └─ [Export Logs] [Clear Logs] [Close]│
│                                      │
│ Permissions:                         │
│ ├─ Admin: Full access                │
│ ├─ Manager: View only                │
│ └─ User: No access                   │
│                                      │
│ Tooltip:                             │
│ "Debug Dispatch Order (Admin only)"  │
│                                      │
└──────────────────────────────────────┘
```

---

## 4. ACTION BUTTONS LAYOUT - ASCII DIAGRAMS

### 4.1 Collapsed State Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ ACTION BUTTONS (COLLAPSED)                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ ┌──────────────┐ ┌──────────────────┐ ┌──────────┐ ┌───────────┐  │
│ │ 📅           │ │ ✓/✗              │ │ 📄       │ │ 📦        │  │
│ │ Book         │ │ Approve /        │ │ Generate │ │ Enrich    │  │
│ │ Appointment  │ │ Reject WO        │ │ PDF      │ │ Parts...  │  │
│ └──────────────┘ └──────────────────┘ └──────────┘ └───────────┘  │
│                                                                      │
│ ┌──────────────┐ [Expand ▼] [Show All Actions]                    │
│ │ 🔄           │                                                    │
│ │ Send Job ... │                                                    │
│ └──────────────┘                                                    │
│                                                                      │
│ Display: First 5 buttons + Expand button                           │
│ Height: ~50px                                                       │
│ Layout: Inline horizontal (1 row)                                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Expanded State Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ ACTION BUTTONS (EXPANDED)                                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ ROW 1:                                                              │
│ ┌──────────────┐ ┌──────────────────┐ ┌──────────┐ ┌───────────┐  │
│ │ 📅           │ │ ✓/✗              │ │ 📄       │ │ 📦        │  │
│ │ Book         │ │ Approve /        │ │ Generate │ │ Enrich    │  │
│ │ Appointment  │ │ Reject WO        │ │ PDF      │ │ Parts...  │  │
│ └──────────────┘ └──────────────────┘ └──────────┘ └───────────┘  │
│                                                                      │
│ ROW 2:                                                              │
│ ┌──────────────┐ ┌──────────────────┐ ┌──────────┐ ┌───────────┐  │
│ │ 🔄           │ │ ⏱️               │ │ ✓        │ │ ⭐        │  │
│ │ Send Job     │ │ Timesheet        │ │ Validate │ │ Update    │  │
│ │ Data to SAP  │ │ Approval         │ │ Check... │ │ TSR Score │  │
│ └──────────────┘ └──────────────────┘ └──────────┘ └───────────┘  │
│                                                                      │
│ ROW 3:                                                              │
│ ┌──────────────┐ ┌──────────────────┐ ┌──────────┐                │
│ │ 📝           │ │ 🔧               │ │ 🔧       │                │
│ │ Post         │ │ Debug EMR        │ │ Debug DO │                │
│ │              │ │                  │ │          │                │
│ └──────────────┘ └──────────────────┘ └──────────┘                │
│                                                                      │
│ [Collapse ▲]                                                        │
│                                                                      │
│ Display: All 11 buttons                                            │
│ Height: ~150px                                                      │
│ Layout: Grid (3-4 columns, 3 rows)                                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. FEED POST INPUT SECTION

### 5.1 Post Input Area

```
┌──────────────────────────────────────────────────────────────────┐
│ POST INPUT SECTION                                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│ [Create new...]                                    [Add] [+]     │
│ ├─ Placeholder text in input field                             │
│ ├─ Auto-expand on focus                                        │
│ └─ Character counter when typing                               │
│                                                                   │
│ When focused/expanded:                                           │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ [User Avatar] [Create new...]                               │ │
│ ├──────────────────────────────────────────────────────────────┤ │
│ │                                                               │ │
│ │ [Rich text editor with formatting buttons]                   │ │
│ │                                                               │ │
│ │ @mentions        #tags        📎 Attach        🔗 Link       │ │
│ │                                                               │ │
│ │ Character count: 0/5000                                      │ │
│ │                                                               │ │
│ │ [Post] [Cancel] [Save Draft]                                │ │
│ │                                                               │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ Sort/Filter Bar:                                                 │
│ ├─ Sort by: [Most Recent Activity ▼]                           │
│ │   Options:                                                    │
│ │   ├─ Most Recent Activity                                    │
│ │   ├─ Oldest First                                            │
│ │   ├─ Most Liked                                              │
│ │   └─ My Activity                                             │
│ │                                                               │
│ └─ [Search this feed...] [🔍]                                 │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 6. FEED TIMELINE - ACTIVITY ENTRIES

### 6.1 Feed Entry Structure

```
┌──────────────────────────────────────────────────────────────────┐
│ FEED TIMELINE ENTRIES                                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│ ENTRY 1:                                                         │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ 👤 M. Thoriqul Anwar Hidayat created a work order line   │   │
│ │    item.                                     2h ago       │   │
│ │                                                            │   │
│ │ Reference: 00000019                                        │   │
│ │                                                            │   │
│ │ [View more details]                                        │   │
│ │                                                            │   │
│ │ [Like] [Comment] [⋯ More]                                │   │
│ │                                                            │   │
│ │ Write a comment...                                         │   │
│ │                                                            │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                   │
│ ENTRY 2:                                                         │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ 👤 M. Thoriqul Anwar Hidayat created a work order line   │   │
│ │    item.                                     2h ago       │   │
│ │                                                            │   │
│ │ Reference: 00000018                                        │   │
│ │                                                            │   │
│ │ [View more details]                                        │   │
│ │                                                            │   │
│ │ [Like] [Comment] [⋯ More]                                │   │
│ │                                                            │   │
│ │ Write a comment...                                         │   │
│ │                                                            │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                   │
│ ENTRY 3:                                                         │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ 👤 M. Thoriqul Anwar Hidayat created a work order line   │   │
│ │    item.                                     2h ago       │   │
│ │                                                            │   │
│ │ Reference: 00000017                                        │   │
│ │                                                            │   │
│ │ [View more details]                                        │   │
│ │                                                            │   │
│ │ [Like] [Comment] [⋯ More]                                │   │
│ │                                                            │   │
│ │ Write a comment...                                         │   │
│ │                                                            │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                   │
│ [View More Activities] [Load Previous]                          │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 7. COMPLETE FEED TAB LAYOUT - FULL VIEW

```
┌────────────────────────────────────────────────────────────────────────────┐
│ WORK ORDER #01275781                                                       │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ Owner: UT Integration ⚡                    Case: 01553477                 │
│ Status: New  Start Date: 26/05/2026, 07:00  End Date: 28/05/2026, 07:00  │
│ Subject: TRS HYDRAULIK SYSTEM HO785                                        │
│                                                                             │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ [Details] [Feed] [Related] [Log]                                          │
│              ↑                                                              │
│           ACTIVE                                                            │
│                                                                             │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ COLLAPSIBLE ACTION BUTTONS (COLLAPSED):                                   │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ [📅 Book Appt] [✓/✗ Approve/Reject] [📄 Generate PDF] [📦 Enrich..] │ │
│ │                                                                         │ │
│ │ [🔄 Send Job...] [Expand ▼] [Show More Actions]                      │ │
│ │                                                                         │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ [CREATE NEW INPUT FIELD] [Add] [+]                                        │
│ ├─ Placeholder: "Create new..."                                           │
│ └─ Auto-expand on focus                                                   │
│                                                                             │
│ SORT/FILTER:                                                              │
│ Sort by: [Most Recent Activity ▼]  [Search this feed...] [🔍]            │
│                                                                             │
│ ────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│ FEED ENTRIES:                                                              │
│                                                                             │
│ ENTRY 1:                                                                  │
│ ┌──────────────────────────────────────────────────────────────────────┐ │
│ │ 👤 M. Thoriqul Anwar Hidayat created a work order line item.        │ │
│ │    2h ago                                                             │ │
│ │                                                                        │ │
│ │    Reference: 00000019                                                │ │
│ │                                                                        │ │
│ │    [View more details]                                                │ │
│ │                                                                        │ │
│ │    [Like] [Comment] [⋯ More]                                         │ │
│ │                                                                        │ │
│ │    [Write a comment...]                                               │ │
│ │                                                                        │ │
│ └──────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ENTRY 2:                                                                  │
│ ┌──────────────────────────────────────────────────────────────────────┐ │
│ │ 👤 M. Thoriqul Anwar Hidayat created a work order line item.        │ │
│ │    2h ago                                                             │ │
│ │                                                                        │ │
│ │    Reference: 00000018                                                │ │
│ │                                                                        │ │
│ │    [View more details]                                                │ │
│ │                                                                        │ │
│ │    [Like] [Comment] [⋯ More]                                         │ │
│ │                                                                        │ │
│ │    [Write a comment...]                                               │ │
│ │                                                                        │ │
│ └──────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ENTRY 3:                                                                  │
│ ┌──────────────────────────────────────────────────────────────────────┐ │
│ │ 👤 M. Thoriqul Anwar Hidayat created a work order line item.        │ │
│ │    2h ago                                                             │ │
│ │                                                                        │ │
│ │    Reference: 00000017                                                │ │
│ │                                                                        │ │
│ │    [View more details]                                                │ │
│ │                                                                        │ │
│ │    [Like] [Comment] [⋯ More]                                         │ │
│ │                                                                        │ │
│ │    [Write a comment...]                                               │ │
│ │                                                                        │ │
│ └──────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ [View More Activities] [Load Previous]                                    │
│                                                                             │
│ ────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│ [Recent Items] [Macros] [Chatter Feed]  [Omni-Channel (Offline)]        │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘

RIGHT PANEL (ALWAYS VISIBLE):

┌──────────────────────────────┐
│ Rekomendasi Mekanik (Blue)   │
│ [Button]                     │
│                              │
├──────────────────────────────┤
│ Knowledge                    │
│ [Filters] [Search...]        │
│ • GD825A Hydraulic...        │
│ • Thrust Plate...            │
│                              │
├──────────────────────────────┤
│ Asset Details                │
│ HD785-7 - 8076              │
│ Equipment: 79947             │
│ Serial Number: 8076          │
│ Unit Model: HD785-7          │
│ Unit Code: HD1114            │
│ Material Number: HD785-7     │
│ SMR: 6006I.0                │
│ Equipment UoM: hm           │
│ Measuring Date: 15/03/2025  │
│                              │
├──────────────────────────────┤
│ Work Plans (0)               │
│ Work Steps (0)               │
│ Service Appointments (1)      │
│ SA-2124973                  │
│ Status: Scheduled            │
│ [View All]                  │
│                              │
│ + 18 More Objects            │
│ (Scrollable)                 │
│                              │
└──────────────────────────────┘
```

---

## 8. BUTTON INTERACTION FLOWS

### 8.1 Expand/Collapse Flow

```
USER CLICKS [Expand ▼]:
│
├─ Animation: Height expands smoothly (300ms)
├─ Display: All 11 buttons become visible
├─ Button changes to: [Collapse ▲]
├─ State saved: localStorage['actionButtonsExpanded'] = true
└─ Feed continues scrolling below

USER CLICKS [Collapse ▲]:
│
├─ Animation: Height collapses smoothly (300ms)
├─ Display: Returns to collapsed state
├─ Shows: First 5 buttons + [Expand ▼]
├─ State saved: localStorage['actionButtonsExpanded'] = false
└─ Feed continues scrolling below
```

### 8.2 Button Click Flow (Example: Book Appointment)

```
USER CLICKS [Book Appointment]:
│
├─ Button state: Loading spinner shows
├─ Modal opens: Appointment creation form
├─ Form pre-fills:
│  ├─ Work Order: 01275781
│  ├─ Asset: HD785-7 - 8076
│  ├─ Customer: BURHAN (SIMS JAYA KALTIM)
│  └─ Service Location: [Auto-filled]
│
├─ User fills form:
│  ├─ Date: [Select]
│  ├─ Time: [Select]
│  ├─ Duration: [Input]
│  ├─ Mechanic: [Select]
│  └─ Notes: [Optional text]
│
├─ User clicks [Save]:
│  ├─ Validation: Check required fields
│  ├─ If valid:
│  │  ├─ Create: Service Appointment record
│  │  ├─ Update: WO status
│  │  ├─ Notify: Mechanic + Customer
│  │  ├─ Close: Modal
│  │  ├─ Show: Success message
│  │  └─ Update: Feed timeline
│  │
│  └─ If invalid:
│     └─ Show: Error messages on form
│
└─ End: User can continue with other actions
```

---

## 9. RESPONSIVE BEHAVIOR - BUTTONS

### 9.1 Desktop View (≥1024px)

```
COLLAPSED STATE:
├─ First 5 buttons visible in row
├─ [Expand ▼] button visible
├─ All buttons: Medium size (40px height)
└─ Full width available

EXPANDED STATE:
├─ Grid layout: 4 columns
├─ 11 buttons displayed
├─ [Collapse ▲] button visible
└─ 3 rows of buttons
```

### 9.2 Tablet View (768px - 1023px)

```
COLLAPSED STATE:
├─ First 3 buttons visible
├─ [Expand ▼] button visible
├─ Buttons: Medium size (38px height)
└─ Width: Adjusted to fit

EXPANDED STATE:
├─ Grid layout: 2-3 columns
├─ All buttons displayed
├─ [Collapse ▲] button visible
└─ 4-5 rows of buttons
```

### 9.3 Mobile View (<768px)

```
COLLAPSED STATE:
├─ First 2 buttons visible
├─ [Expand ▼] button visible
├─ Buttons: Small size (36px height)
└─ Responsive width

EXPANDED STATE:
├─ Stack layout: 1 column
├─ All buttons displayed
├─ Scrollable vertically
├─ [Collapse ▲] button visible
└─ Full width per button
```

---

## 10. ACCESSIBILITY & KEYBOARD NAVIGATION

### 10.1 Keyboard Shortcuts for Buttons

```
Ctrl + B  : Book Appointment
Ctrl + A  : Approve/Reject
Ctrl + P  : Generate PDF
Ctrl + E  : Enrich Parts
Ctrl + S  : Send to SAP
Ctrl + T  : Timesheet Approval
Ctrl + V  : Validate Checksheet
Ctrl + U  : Update TSR Score
Ctrl + Enter : Post new activity
Tab       : Navigate between buttons
Space/Enter: Activate focused button
? (in feed): Show help
```

### 10.2 ARIA Attributes

```
Buttons:
├─ aria-label: "[Button name]"
├─ aria-expanded: "false/true" (for expand/collapse)
├─ aria-pressed: "false/true" (for toggle buttons)
└─ role: "button"

Modals:
├─ role: "dialog"
├─ aria-modal: "true"
├─ aria-labelledby: "modal-title"
└─ aria-describedby: "modal-desc"

Feed:
├─ role: "region"
├─ aria-live: "polite"
├─ aria-label: "Work Order Feed"
└─ aria-busy: "false/true" (when loading)
```

---

## 11. TECHNICAL IMPLEMENTATION

### 11.1 State Management

```
Button States:
├─ Collapsed: true/false
├─ Active: true/false
├─ Loading: true/false
├─ Disabled: true/false (based on permissions)
└─ Expanded height: CSS transition 300ms

Feed States:
├─ Loading: true/false
├─ Empty: true/false
├─ Error: error message / null
├─ Sorting: "recent" | "oldest" | "liked"
└─ Search filter: string

Modal States:
├─ Open: true/false
├─ Loading: true/false
├─ Submitting: true/false
├─ Error: error message / null
└─ Success: true/false
```

### 11.2 API Endpoints

```
Feed Data:
GET /api/workorder/{woId}/feed
GET /api/workorder/{woId}/feed?sort=recent
POST /api/workorder/{woId}/feed/post

Actions:
POST /api/appointment/create
POST /api/workorder/{woId}/approve
POST /api/workorder/{woId}/pdf/generate
POST /api/parts/enrich
POST /api/workorder/{woId}/sync-sap
POST /api/timesheet/approve
POST /api/checksheet/validate
PATCH /api/workorder/{woId}/tsr-score
POST /api/debug/emr
POST /api/debug/do
```

---

## 12. METADATA & SYSTEM INFO

**System:** UT Service Console v3.1 (Advanced)
**Feature:** Feed Tab with Collapsible Action Buttons
**Last Updated:** 26/05/2026 07:36
**Document Version:** Feed Tab Design v1.0

---

## 13. SUMMARY - KEY FEATURES

### Button Features:
✅ **11 Action Buttons** - Covering all main work order operations
✅ **Collapsible Design** - Expand/collapse with smooth animation
✅ **Responsive Layout** - Adapts to desktop, tablet, mobile
✅ **Visual Feedback** - Loading states, tooltips, confirmations
✅ **Permission-based** - Buttons enable/disable per user role
✅ **Keyboard Shortcuts** - Quick access via keyboard
✅ **Modal Dialogs** - Form-based input for complex actions
✅ **Real-time Updates** - Feed updates after action execution
✅ **Accessibility** - ARIA labels, keyboard navigation
✅ **Error Handling** - User-friendly error messages

### Feed Features:
✅ **Activity Timeline** - Chronological feed entries
✅ **Post Functionality** - Create new activities/comments
✅ **Sorting Options** - Most recent, oldest, liked
✅ **Search Filter** - Find entries by keyword
✅ **Rich Comments** - Like, comment, view details
✅ **Infinite Scroll** - Load more activities
✅ **Real-time Updates** - New activities appear instantly

---

*This document provides complete specification for Work Order Feed Tab with collapsible action buttons, modals, and comprehensive interaction flows.*
